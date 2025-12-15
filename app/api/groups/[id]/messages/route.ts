import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const groupId = Number(id);

  const messages = await prisma.groupMessage.findMany({
    where: { groupId },
    orderBy: { createdAt: "asc" },
    include: {
      user: {
        select: { id: true, name: true },
      },
    },
  });

  return NextResponse.json(messages);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const groupId = Number(id);

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (!body.content || !body.content.trim()) {
    return NextResponse.json({ error: "Empty message" }, { status: 400 });
  }

  const message = await prisma.groupMessage.create({
    data: {
      content: body.content,
      userId: user.id,
      groupId,
    },
  });

  return NextResponse.json(message);
}
