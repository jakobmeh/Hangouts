import { cookies } from "next/headers";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  const cookieStore = await cookies();
const userId = cookieStore.get("userId")?.value;

  if (!userId) return null;

  const id = Number(userId);
  if (!Number.isFinite(id)) return null;

  return prisma.user.findUnique({
    where: { id },
  });
}
