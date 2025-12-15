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
        { message: "Uporabnik _e obstaja." },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        password, // ƒsÿ‹,? kasneje obvezno hash
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        isAdmin: true,
      },
    });

    const res = NextResponse.json({
      message: "Uporabnik uspe­no registriran!",
      user: newUser,
    });

    // ƒo. TO JE KLJUŽONO
    res.cookies.set("userId", String(newUser.id), {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });

    return res;
  } catch (error) {
    console.error("Napaka pri registraciji:", error);
    return NextResponse.json(
      { message: "Napaka stre_nika." },
      { status: 500 }
    );
  }
}
