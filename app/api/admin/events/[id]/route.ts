import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const eventId = Number(id);

  const admin = await getCurrentUser();
  if (!admin || !admin.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!Number.isFinite(eventId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await prisma.event.delete({
    where: { id: eventId },
  });

  return NextResponse.json({ ok: true });
}
