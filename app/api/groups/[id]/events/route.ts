import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const event = await prisma.event.create({
    data: {
      title: body.title,
      description: body.description,
      date: new Date(body.date),
      city: body.city,
      country: body.country,
      imageUrl: body.imageUrl || null,
      capacity: body.capacity,
      userId: user.id,
      groupId: Number(id),
    },
  });

  return NextResponse.json(event);
}
