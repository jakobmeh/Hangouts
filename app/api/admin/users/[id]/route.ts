import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const targetId = Number(id);

  const admin = await getCurrentUser();
  if (!admin || !admin.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!Number.isFinite(targetId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = await req.json();
  const { name, image, isAdmin } = body as {
    name?: string;
    image?: string;
    isAdmin?: boolean;
  };

  const updatedUser = await prisma.user.update({
    where: { id: targetId },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(image !== undefined ? { image } : {}),
      ...(isAdmin !== undefined ? { isAdmin: Boolean(isAdmin) } : {}),
    },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      isAdmin: true,
      createdAt: true,
    },
  });

  return NextResponse.json(updatedUser);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const targetId = Number(id);

  const admin = await getCurrentUser();
  if (!admin || !admin.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!Number.isFinite(targetId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  if (admin.id === targetId) {
    return NextResponse.json(
      { error: "Admin cannot delete their own account." },
      { status: 400 }
    );
  }

  await prisma.user.delete({
    where: { id: targetId },
  });

  return NextResponse.json({ ok: true });
}
