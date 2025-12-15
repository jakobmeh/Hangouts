import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const groupId = Number(id);

  const admin = await getCurrentUser();
  if (!admin || !admin.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!Number.isFinite(groupId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await prisma.group.delete({
    where: { id: groupId },
  });

  return NextResponse.json({ ok: true });
}
