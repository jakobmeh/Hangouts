import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: { user: true },
      orderBy: { date: "asc" },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Napaka pri pridobivanju dogodkov:", error);
    return NextResponse.json({ events: [] }, { status: 500 });
  }
}
