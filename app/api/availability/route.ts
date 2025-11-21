import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/availability
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.userId || !body.availability) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Save to DB
    const saved = await prisma.availability.upsert({
      where: { userId: body.userId },
      update: { availability: body.availability },
      create: {
        userId: body.userId,
        availability: body.availability,
      },
    });

    return NextResponse.json({ message: "Saved!", saved });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET /api/availability?userId=123
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const data = await prisma.availability.findUnique({
    where: { userId },
  });

  return NextResponse.json(data || {});
}