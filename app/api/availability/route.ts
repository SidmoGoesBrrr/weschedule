import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { postAvailability, getAllAvailabilitiesByEventId, getAvailabilitiesByUserId, getAvailabilitiesByGuestName } from '@/lib/serverAvailUtil';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/availability
export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const body = await req.json();
    // console.log(body);

    if (!body?.userId || !body?.availability) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // const saved = await prisma.availability.upsert({
    //   where: { userId: body.userId },
    //   update: { availability: body.availability },
    //   create: { userId: body.userId, availability: body.availability },
    // });
    // console.log("sending")
    const event_id = searchParams.get("event_id");
    if (!event_id) {
      return NextResponse.json({ error: "Missing event id" }, { status: 400 });
    }
    const saved = await postAvailability(event_id, body.userId, body.availability)

    return NextResponse.json({ message: "Saved!", saved });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET /api/availability?userId=123  — fetch one user
// GET /api/availability?all=true    — fetch all users
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const event_id = searchParams.get("event_id");
    if (!event_id) {
      return NextResponse.json({ error: "Missing event id" }, { status: 400 });
    }

    if (searchParams.get("all") === "true") {
      // const all = await prisma.availability.findMany();
      const response = await getAllAvailabilitiesByEventId(event_id);
      return NextResponse.json(response);
    }

    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // const data = await prisma.availability.findUnique({ where: { userId } });
    const data = await getAvailabilitiesByGuestName(event_id, userId);
    // console.log('get by user response')
    // console.log(data)
    return NextResponse.json(data || {});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}