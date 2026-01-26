// @vitest-environment node
import { describe, expect, it, vi, beforeEach } from "vitest";
import { prisma, resetPrisma } from "@/tests/mocks/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

vi.mock("@/app/lib/prisma", () => ({ prisma }));

describe("authOptions callbacks", () => {
  beforeEach(() => {
    resetPrisma();
  });

  it("creates user on first Google sign-in", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({ id: 1 });

    const result = await authOptions.callbacks?.signIn?.({
      user: { email: "user@example.com", name: "User", image: null } as any,
      account: null,
      profile: null,
      email: null,
      credentials: null,
    });

    expect(result).toBe(true);
    expect(prisma.user.create).toHaveBeenCalled();
  });

  it("adds admin info to jwt", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      isAdmin: true,
      name: "Admin",
      image: null,
    });

    const token = await authOptions.callbacks?.jwt?.({
      token: { email: "admin@example.com" },
      user: null,
      account: null,
      profile: null,
      trigger: "signIn",
      session: null,
    });

    expect((token as any).isAdmin).toBe(true);
    expect((token as any).id).toBe(1);
  });
});