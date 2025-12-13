import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const groups = await prisma.group.findMany({
    include: {
      owner: true,
      _count: { select: { members: true } },
    },
  });

  return NextResponse.json({ groups });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, description, city, country, ownerId } = body;

  if (!name || !city || !ownerId) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  const group = await prisma.group.create({
    data: {
      name,
      description,
      city,
      country,
      ownerId,
    },
  });

  return NextResponse.json({ group });
}
