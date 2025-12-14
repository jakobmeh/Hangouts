import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

/* ================= GET ================= */

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(user);
}

/* ================= UPDATE ================= */

export async function PUT(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, image } = body;

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      name,
      image,
    },
  });

  return NextResponse.json(updatedUser);
}
