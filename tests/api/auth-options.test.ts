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
      profile: undefined,
      email: undefined,
      credentials: undefined,
    });

    expect(result).toBe(true);
  });
});