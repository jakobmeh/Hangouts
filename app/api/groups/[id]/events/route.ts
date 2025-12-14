import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const groupId = Number(id);

  if (!Number.isFinite(groupId)) {
    return NextResponse.json({ error: "Invalid group id" }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const group = await prisma.group.findUnique({
    where: { id: groupId },
  });

  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  // 🔐 SAMO OWNER LAHKO DODA EVENT
  if (group.ownerId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { title, date, city } = body;

if (!title || !date || !city) {
  return NextResponse.json(
    { error: "Missing required fields" },
    { status: 400 }
  );
}

const parsedDate = new Date(date); // ✅ TO JE VSE

if (isNaN(parsedDate.getTime())) {
  return NextResponse.json(
    { error: "Invalid date format" },
    { status: 400 }
  );
}



  const event = await prisma.event.create({
    data: {
      title,
      date: new Date(date), // ⚠️ ZELO POMEMBNO
      city,
      country: group.country ?? "Unknown",
      userId: user.id,
      groupId: group.id,
    },
  });

  return NextResponse.json(event, { status: 201 });
}
