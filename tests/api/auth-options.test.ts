// @vitest-environment node
/**
 * AUTH OPTIONS TESTI
 *
 * Testira NextAuth callback-e:
 * 1. signIn - Dovolitev ali zavrnitev prijave
 * 2. session - Dodaj admin info v session
 * 
 * NAPOMENA: Uporabimo database session strategy, zato JWT callback ni testiran
 */

import { describe, expect, it, vi, beforeEach } from "vitest";
import { prisma, resetPrisma } from "@/tests/mocks/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

vi.mock("@/app/lib/prisma", () => ({ prisma }));

describe("authOptions callbacks", () => {
  beforeEach(() => {
    resetPrisma();
  });

  /**
   * Test: signIn callback - Vedno vrne true
   * (Adapter že obdeluje креирање user-ja)
   */
  it("signIn callback vedno dovoli prijavo", async () => {
    const result = await authOptions.callbacks?.signIn?.({
      user: { email: "user@example.com", name: "User", image: null } as any,
      account: null,
      profile: null,
      email: null,
      credentials: null,
    });

    expect(result).toBe(true);
  });

  /**
   * Test: session callback - Dodaj admin info in id v session
   */
  it("session callback dodaj admin info v session", async () => {
    const sessionObject = {
      user: { email: "admin@example.com", name: "Admin" },
      expires: new Date().toISOString(),
    };

    const userObject = {
      id: 1,
      isAdmin: true,
      name: "Admin",
      image: null,
      email: "admin@example.com",
    };

    const result = await authOptions.callbacks?.session?.({
      session: sessionObject as any,
      user: userObject as any,
      newSession: undefined,
      token: undefined,
      trigger: "update",
    });

    expect((result as any).user.id).toBe(1);
    expect((result as any).user.isAdmin).toBe(true);
  });
});