import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [users, groups, events] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        isAdmin: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.group.findMany({
      select: {
        id: true,
        name: true,
        city: true,
        country: true,
        createdAt: true,
        owner: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { members: true, events: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.event.findMany({
      select: {
        id: true,
        title: true,
        date: true,
        createdAt: true,
        group: { select: { id: true, name: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { date: "desc" },
      take: 200,
    }),
  ]);

  return NextResponse.json({ users, groups, events });
}
