import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

type TimeBlock = { start: string; end: string };

function toMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function overlap(a: TimeBlock, b: TimeBlock): TimeBlock | null {
  const start = Math.max(toMinutes(a.start), toMinutes(b.start));
  const end = Math.min(toMinutes(a.end), toMinutes(b.end));

  if (end <= start) return null;

  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    start: `${pad(Math.floor(start / 60))}:${pad(start % 60)}`,
    end: `${pad(Math.floor(end / 60))}:${pad(end % 60)}`,
  };
}

export async function POST(req: Request) {
  try {
    const { userIds } = await req.json();

    if (!userIds || userIds.length < 2) {
      return NextResponse.json(
        { error: "Need at least 2 users" },
        { status: 400 }
      );
    }

    const users = await prisma.availability.findMany({
      where: { userId: { in: userIds } },
    });

    if (users.length < 2) {
      return NextResponse.json({ error: "Not enough data" }, { status: 400 });
    }

    const results: any = {};

    for (const day of [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ]) {
      let dayMatches: TimeBlock[] | null = null;

      for (const user of users) {
        const avail = user.availability as any;

        if (!avail?.[day]?.available) {
          dayMatches = [];
          break;
        }

        const blocks = avail[day].blocks ?? [];

        if (dayMatches === null) {
          dayMatches = blocks;
        } else {
          const next: TimeBlock[] = [];

          for (const a of dayMatches) {
            for (const b of blocks) {
              const o = overlap(a, b);
              if (o) next.push(o);
            }
          }

          dayMatches = next;
        }
      }

      results[day] = dayMatches ?? [];
    }

    return NextResponse.json(results);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}