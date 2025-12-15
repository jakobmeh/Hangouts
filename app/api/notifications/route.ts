import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ notifications: [] });
  }

  const memberships = await prisma.groupMember.findMany({
    where: { userId: user.id },
    select: { groupId: true },
  });
  const groupIds = memberships.map((m) => m.groupId);
  if (groupIds.length === 0) {
    return NextResponse.json({ notifications: [] });
  }

  const [events, messages] = await Promise.all([
    prisma.event.findMany({
      where: { groupId: { in: groupIds } },
      select: {
        id: true,
        title: true,
        createdAt: true,
        group: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 15,
    }),
    prisma.groupMessage.findMany({
      where: { groupId: { in: groupIds } },
      select: {
        id: true,
        content: true,
        createdAt: true,
        group: { select: { id: true, name: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 15,
    }),
  ]);

  const notifications = [
    ...events.map((e) => ({
      id: e.id,
      type: "event" as const,
      title: e.title,
      meta: `New event in ${e.group?.name ?? "group"}`,
      createdAt: e.createdAt,
      link: `/groups/${e.group?.id ?? ""}`,
    })),
    ...messages.map((m) => ({
      id: m.id,
      type: "message" as const,
      title: m.group?.name ?? "Group message",
      meta: `${m.user?.name || m.user?.email || "Someone"}: ${m.content.slice(0, 60)}`,
      createdAt: m.createdAt,
      link: `/groups/${m.group?.id ?? ""}`,
    })),
  ]
    .filter((n) => n.link !== "/groups/") // avoid empty group ids
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 20);

  return NextResponse.json({ notifications });
}
