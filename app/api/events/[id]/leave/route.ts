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

  const attendee = await prisma.attendee.findUnique({
    where: {
      userId_eventId: {
        userId: user.id,
        eventId,
      },
    },
  });

  if (!attendee) {
    return NextResponse.json(
      { error: "Not attending" },
      { status: 404 }
    );
  }

  await prisma.attendee.delete({
    where: {
      id: attendee.id,
    },
  });

  return NextResponse.json({ ok: true });
}
