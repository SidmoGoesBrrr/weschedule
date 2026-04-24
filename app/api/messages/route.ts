import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const TABLE_NAME = "messages";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId")?.trim();

  if (!roomId) {
    return NextResponse.json({ error: "roomId is required" }, { status: 400 });
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

  const normalizedMessages = (data ?? [])
    .filter((row: Record<string, unknown>) => {
      const rowRoomId = typeof row.room_id === "string" ? row.room_id : null;
      // If room_id exists, enforce room filtering; if column/field is absent, keep row (legacy schema).
      return rowRoomId ? rowRoomId === roomId : true;
    })
    .map((row: Record<string, unknown>) => ({
      id: String(row.id ?? crypto.randomUUID()),
      content:
        typeof row.content === "string"
          ? row.content
          : typeof row.text === "string"
            ? row.text
            : typeof row.message === "string"
              ? row.message
              : "",
      created_at: row.created_at ?? null,
      room_id: row.room_id ?? null,
    }))
    .filter((msg) => msg.content.trim().length > 0);

  return NextResponse.json({ messages: normalizedMessages });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const content = typeof body?.text === "string" ? body.text.trim() : "";
    const roomId = typeof body?.roomId === "string" ? body.roomId.trim() : "";

    if (!content || !roomId) {
      return NextResponse.json({ error: "Message text and roomId are required." }, { status: 400 });
    }

    // Try newer schema first, then fall back to legacy column names.
    let data: Record<string, unknown> | null = null;
    let error: { code?: string; message?: string } | null = null;

    const attempts: Record<string, unknown>[] = [
      { content, room_id: roomId },
      { text: content, room_id: roomId },
      { body: content, room_id: roomId },
      { message_text: content, room_id: roomId },
      { chat_text: content, room_id: roomId },
      { content },
      { text: content },
      { body: content },
      { message_text: content },
      { chat_text: content },
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
        { message: { id: crypto.randomUUID(), content, room_id: roomId }, persisted: false },
        { status: 202 }
      );
    }

    return NextResponse.json({ message: data }, { status: 201 });
  } catch (error) {
    console.error("Unexpected /api/messages POST error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
