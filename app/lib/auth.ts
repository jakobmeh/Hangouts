import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  // Prefer NextAuth session (Google or other future providers)
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, email: true, name: true, image: true, isAdmin: true },
      });
      if (user) return user;
    }
  } catch {
    // ignore session errors, fall back to legacy cookie
  }

  // Legacy cookie-based auth
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) return null;

  const id = Number(userId);
  if (!Number.isFinite(id)) return null;

  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      isAdmin: true,
    },
  });
}
