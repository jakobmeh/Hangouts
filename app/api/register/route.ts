import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "Vnesi ime, email in geslo." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Uporabnik že obstaja." },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        password,
        name,
      },
    });

   
    return NextResponse.json({
      message: "Uporabnik uspešno registriran!",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    console.error("Napaka pri registraciji:", error);
    return NextResponse.json(
      { message: "Napaka strežnika." },
      { status: 500 }
    );
  }
}
