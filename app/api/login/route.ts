import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email as string;
    const password = body.password as string;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Vnesi email in geslo." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { message: "Uporabnik ne obstaja." },
        { status: 404 }
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        { message: "Napačno geslo." },
        { status: 401 }
      );
    }

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      image: user.image,
    };

    // ⬇️ TO JE EDINA NOVA STVAR
    const res = NextResponse.json({
      message: "Uspešno prijavljen!",
      user: userData,
    });

    res.cookies.set("userId", String(user.id), {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });

    return res;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Napaka pri prijavi." },
      { status: 500 }
    );
  }
}
