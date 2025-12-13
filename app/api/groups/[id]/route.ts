import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const groupId = Number(id);

  if (isNaN(groupId)) {
    return NextResponse.json(
      { error: "Invalid group id" },
      { status: 400 }
    );
  }

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      owner: true,
      _count: { select: { members: true } },
    },
  });

  if (!group) {
    return NextResponse.json(
      { error: "Group not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ group });
}
