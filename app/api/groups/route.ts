import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

// GET /api/groups
export async function GET() {
  const groups = await prisma.group.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      owner: { select: { id: true, name: true } },
      _count: {
        select: { members: true, events: true },
      },
    },
  });

  return NextResponse.json(groups);
}

// POST /api/groups
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, description, city, country, imageUrl } = body;

  if (!name || !city) {
    return NextResponse.json(
      { error: "Name and city are required" },
      { status: 400 }
    );
  }

  const group = await prisma.group.create({
    data: {
      name,
      description,
      imageUrl,
      city,
      country,
      ownerId: user.id,
      members: {
        create: { userId: user.id },
      },
    },
  });

  return NextResponse.json(group, { status: 201 });
}
