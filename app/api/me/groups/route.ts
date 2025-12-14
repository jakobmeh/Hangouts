import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json([], { status: 200 });
  }

  const groups = await prisma.group.findMany({
    where: {
      members: {
        some: {
          userId: user.id,
        },
      },
    },
    select: {
      id: true,
      name: true,
      events: {
        orderBy: { date: "asc" },
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return NextResponse.json(groups);
}
