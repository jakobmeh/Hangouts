// app/api/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const email = body.email;
  const password = body.password;

  if (!email || !password) {
    return NextResponse.json({ message: "Vnesi email in geslo." });
  }

  // poiščemo uporabnika po emailu
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ message: "Uporabnik ne obstaja." });
  }

  // preverimo geslo (tukaj brez hash-a, preprosto)
  if (user.password !== password) {
    return NextResponse.json({ message: "Napačno geslo." });
  }

  return NextResponse.json({ message: "Uspešno prijavljen!" });
}
