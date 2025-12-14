import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const eventId = Number(id);

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      _count: { select: { attendees: true } },
    },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  // ❌ EVENT FULL
  if (
    event.capacity !== null &&
    event._count.attendees >= event.capacity
  ) {
    return NextResponse.json(
      { error: "Event is full" },
      { status: 403 }
    );
  }

  // ❌ ALREADY JOINED
  const alreadyJoined = await prisma.attendee.findUnique({
    where: {
      userId_eventId: {
        userId: user.id,
        eventId,
      },
    },
  });

  if (alreadyJoined) {
    return NextResponse.json(
      { error: "Already joined" },
      { status: 409 }
    );
  }

  // ✅ JOIN
  await prisma.attendee.create({
    data: {
      userId: user.id,
      eventId,
    },
  });

  return NextResponse.json({ ok: true });
}
