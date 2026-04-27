import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const TABLE_NAME = "messages";
const USERS_TABLE_NAME = "userslogin";

async function resolveNameByEmail(email: string) {
  let supabaseAdmin;
  try {
    supabaseAdmin = getSupabaseAdmin();
  } catch {
    return "";
  }
  if (!email) {
    return "";
  }
  const result = await supabaseAdmin
    .from(USERS_TABLE_NAME)
    .select("name")
    .eq("email", email)
    .maybeSingle();

  if (!result.error && typeof result.data?.name === "string" && result.data.name.trim()) {
    return result.data.name.trim();
  }
  return "";
}

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const email =
    cookieStore.get("userEmail")?.value?.trim() ||
    cookieStore.get("email")?.value?.trim() ||
    "";

  if (!email) {
    return null;
  }

  let supabaseAdmin;
  try {
    supabaseAdmin = getSupabaseAdmin();
  } catch {
    // If Supabase isn't configured, still treat the cookie as identity.
    return { email, name: email.split("@")[0] || "Unknown User" };
  }

  const result = await supabaseAdmin
    .from(USERS_TABLE_NAME)
    .select("name, email")
    .eq("email", email)
    .maybeSingle();

  if (result.error || !result.data?.email) {
    return null;
  }

  return {
    email: result.data.email,
    name: (result.data.name || "").trim() || result.data.email.split("@")[0] || "Unknown User",
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId")?.trim();

  if (!roomId) {
    return NextResponse.json({ error: "roomId is required" }, { status: 400 });
  }

  let supabaseAdmin;
  try {
    supabaseAdmin = getSupabaseAdmin();
  } catch {
    // Chat history is Supabase-only.
    return NextResponse.json({ messages: [] }, { status: 200 });
  }

  const { data, error } = await supabaseAdmin
    .from(TABLE_NAME)
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to load messages from Supabase:", error);
    // Chat history should not block the availability page rendering.
    return NextResponse.json({ messages: [] }, { status: 200 });
  }

  const allMessages = data ?? [];
  const exactRoomMessages = allMessages.filter((row: Record<string, unknown>) => {
    const rowRoomId = typeof row.room_id === "string" ? row.room_id.trim() : "";
    return rowRoomId === roomId;
  });
  const legacyUnscopedMessages = allMessages.filter((row: Record<string, unknown>) => {
    if (!("room_id" in row)) {
      return true;
    }
    if (row.room_id === null || row.room_id === undefined) {
      return true;
    }
    if (typeof row.room_id === "string" && row.room_id.trim() === "") {
      return true;
    }
    return false;
  });
  // Backward compatibility: older rows may not have room_id.
  const roomMessages = exactRoomMessages.length > 0 ? exactRoomMessages : legacyUnscopedMessages;

  const emailCandidates = Array.from(
    new Set(
      roomMessages
        .map((row: Record<string, unknown>) => {
          if (typeof row.email === "string" && row.email.trim()) {
            return row.email.trim().toLowerCase();
          }
          if (typeof row.user_email === "string" && row.user_email.trim()) {
            return row.user_email.trim().toLowerCase();
          }
          return "";
        })
        .filter(Boolean)
    )
  );

  const namesByEmail = new Map<string, string>();
  if (emailCandidates.length > 0) {
    const usersResult = await supabaseAdmin
      .from(USERS_TABLE_NAME)
      .select("email, name")
      .in("email", emailCandidates);

    if (!usersResult.error && Array.isArray(usersResult.data)) {
      for (const row of usersResult.data) {
        const email = typeof row.email === "string" ? row.email.trim().toLowerCase() : "";
        const name = typeof row.name === "string" ? row.name.trim() : "";
        if (email && name) {
          namesByEmail.set(email, name);
        }
      }
    }
  }

  const normalizedMessages = roomMessages
    .map((row: Record<string, unknown>) => {
      const rowEmail =
        typeof row.email === "string"
          ? row.email.trim().toLowerCase()
          : typeof row.user_email === "string"
            ? row.user_email.trim().toLowerCase()
            : "";
      const storedSenderName =
        typeof row.sender === "string"
          ? row.sender.trim()
          : typeof row.sender_name === "string"
            ? row.sender_name.trim()
          : typeof row.name === "string"
            ? row.name.trim()
            : "";
      const resolvedSenderName =
        (storedSenderName && storedSenderName !== "Unknown User" ? storedSenderName : "") ||
        (rowEmail ? namesByEmail.get(rowEmail) : "") ||
        storedSenderName ||
        "Unknown User";

      return {
      id: String(row.id ?? crypto.randomUUID()),
      content:
        typeof row.content === "string"
          ? row.content
          : typeof row.text === "string"
            ? row.text
            : typeof row.message === "string"
              ? row.message
              : "",
      sender_name: resolvedSenderName,
      created_at: row.created_at ?? null,
      room_id: row.room_id ?? null,
      };
    })
    .filter((msg) => msg.content.trim().length > 0);

  return NextResponse.json({ messages: normalizedMessages });
}

export async function POST(req: Request) {
  try {
    let supabaseAdmin: ReturnType<typeof getSupabaseAdmin>;
    try {
      supabaseAdmin = getSupabaseAdmin();
    } catch {
      return NextResponse.json(
        { error: "Supabase is not configured. Messages can only be stored in Supabase." },
        { status: 503 }
      );
    }

    const authenticatedUser = await getAuthenticatedUser();

    const body = await req.json();
    const content = typeof body?.text === "string" ? body.text.trim() : "";
    const roomId = typeof body?.roomId === "string" ? body.roomId.trim() : "";
    const bodyEmail = typeof body?.email === "string" ? body.email.trim() : "";
    const bodySenderName = typeof body?.senderName === "string" ? body.senderName.trim() : "";

    if (!content || !roomId) {
      return NextResponse.json({ error: "Message text and roomId are required." }, { status: 400 });
    }

    const senderEmail = authenticatedUser?.email || bodyEmail;
    const lookedUpName = await resolveNameByEmail(senderEmail);
    const senderName = authenticatedUser?.name || lookedUpName || bodySenderName || "Unknown User";

    // Try newer schema first, then fall back to legacy column names.
    let data: Record<string, unknown> | null = null;
    let error: { code?: string; message?: string } | null = null;

    const attempts: Record<string, unknown>[] = [
      { content, room_id: roomId, email: senderEmail, sender_name: senderName },
      { content, room_id: roomId, email: senderEmail, sender: senderName },
      { text: content, room_id: roomId, email: senderEmail, sender_name: senderName },
      { text: content, room_id: roomId, email: senderEmail, sender: senderName },
      { body: content, room_id: roomId, email: senderEmail, sender_name: senderName },
      { body: content, room_id: roomId, email: senderEmail, sender: senderName },
      { message_text: content, room_id: roomId, email: senderEmail, sender_name: senderName },
      { message_text: content, room_id: roomId, email: senderEmail, sender: senderName },
      { chat_text: content, room_id: roomId, email: senderEmail, sender_name: senderName },
      { chat_text: content, room_id: roomId, email: senderEmail, sender: senderName },
      { content, room_id: roomId, name: senderName },
      { content, room_id: roomId, sender: senderName },
      { text: content, room_id: roomId, name: senderName },
      { text: content, room_id: roomId, sender: senderName },
      // Ensure persistence even when sender columns are absent.
      { content, room_id: roomId, email: senderEmail },
      { text: content, room_id: roomId, email: senderEmail },
      { content, room_id: roomId },
      { text: content, room_id: roomId },
    ];

    for (const payload of attempts) {
      const result = await supabaseAdmin
        .from(TABLE_NAME)
        .insert(payload)
        .select("*")
        .single();

      if (!result.error) {
        data = result.data as Record<string, unknown>;
        error = null;
        break;
      }

      error = result.error as { code?: string; message?: string };

      // Retry only when failure is due to a missing column in this attempt.
      if (error.code !== "PGRST204" && error.code !== "42703") {
        break;
      }
    }

    if (error || !data) {
      const isSchemaMismatch = error?.code === "PGRST204" || error?.code === "42703";
      if (!isSchemaMismatch) {
        console.error("Failed to save message to Supabase:", error);
        return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
      }

      // Unknown column naming in remote schema; allow live chat to continue without noisy failures.
      return NextResponse.json(
        {
          message: {
            id: crypto.randomUUID(),
            content,
            room_id: roomId,
            sender: senderName,
          },
          persisted: false,
        },
        { status: 202 }
      );
    }

    return NextResponse.json({ message: data }, { status: 201 });
  } catch (error) {
    console.error("Unexpected /api/messages POST error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
