import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

/* ─────────────────────────────── */
/* GET GROUP */
/* ─────────────────────────────── */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const groupId = Number(id);

  if (!Number.isFinite(groupId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      owner: {
        select: { id: true, name: true },
      },
      members: {
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      },

      // ✅ KLJUČNI POPRAVEK
      events: {
        orderBy: { date: "asc" },
        include: {
          attendees: {
            select: { userId: true },
          },
        },
      },

      _count: {
        select: { members: true, events: true },
      },
    },
  });

  if (!group) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(group);
}

/* ─────────────────────────────── */
/* DELETE GROUP */
/* ─────────────────────────────── */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const groupId = Number(id);

  if (!Number.isFinite(groupId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const group = await prisma.group.findUnique({
    where: { id: groupId },
  });

  if (!group) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (group.ownerId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 🔥 delete members
  await prisma.groupMember.deleteMany({
    where: { groupId },
  });

  // 🔥 delete events (attendees se pobrišejo zaradi cascade)
  await prisma.event.deleteMany({
    where: { groupId },
  });

  // 🔥 delete group
  await prisma.group.delete({
    where: { id: groupId },
  });

  return NextResponse.json({ ok: true });
}
