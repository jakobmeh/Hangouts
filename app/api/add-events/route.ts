import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const { title, date, location, imageUrl, userId } = await req.json();

    if (!title || !date || !location || !userId) {
      return NextResponse.json({ message: "Manjkajo podatki." }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title,
        date: new Date(date),
        location,
        imageUrl: imageUrl || null,
        userId,
      },
    });

    return NextResponse.json({ message: "Dogodek dodan!", event });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Napaka pri dodajanju dogodka." }, { status: 500 });
  }
}
