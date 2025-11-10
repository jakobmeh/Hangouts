import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const email = body.email;
  const password = body.password;

  if (!email || !password) {
    return NextResponse.json({ message: "Vnesi email in geslo." });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    return NextResponse.json({ message: "Uporabnik že obstaja." });
  }

  await prisma.user.create({
    data: { email, password },
  });

  return NextResponse.json({ message: "Uporabnik uspešno registriran!" });
}
