import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const email = body.email;
  const password = body.password;

  // če ni podatkov, ustavi
  if (!email || !password) {
    return NextResponse.json({ message: "Vnesi email in geslo." });
  }

  // preveri, če uporabnik že obstaja
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    return NextResponse.json({ message: "Uporabnik že obstaja." });
  }

  // ustvari novega uporabnika (brez bcrypt, da bo preprosto)
  await prisma.user.create({
    data: { email, password },
  });

  return NextResponse.json({ message: "Uporabnik uspešno registriran!" });
}
