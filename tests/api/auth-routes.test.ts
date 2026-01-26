// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { jsonRequest } from "@/tests/helpers/request";
import { POST as login } from "@/app/api/login/route";
import { POST as register } from "@/app/api/register/route";
import { POST as logout } from "@/app/api/logout/route";
import { GET as meGet, PUT as mePut } from "@/app/api/me/route";

const { prisma, resetPrisma } = vi.hoisted(() => {
  const mod = require("../mocks/prisma.ts");
  return mod;
});

vi.mock("@/app/lib/prisma", () => ({ prisma }));

const { getCurrentUser } = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
}));
vi.mock("@/app/lib/auth", () => ({ getCurrentUser }));

describe("auth routes", () => {
  beforeEach(() => {
    resetPrisma();
    getCurrentUser.mockReset();
  });

  it("returns 400 for login without credentials", async () => {
    const req = jsonRequest("http://localhost", { email: "" });
    const res = await login(req);
    expect(res.status).toBe(400);
  });

  it("returns 404 when user does not exist", async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const req = jsonRequest("http://localhost", {
      email: "user@example.com",
      password: "pass",
    });

    const res = await login(req);
    expect(res.status).toBe(404);
  });

  it("logs in with valid credentials", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: "user@example.com",
      name: "User",
      password: "pass",
      isAdmin: false,
      image: null,
    });

    const req = jsonRequest("http://localhost", {
      email: "user@example.com",
      password: "pass",
    });

    const res = await login(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("set-cookie")).toContain("userId");
  });

  it("rejects duplicate registration", async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1 });

    const req = jsonRequest("http://localhost", {
      name: "User",
      email: "user@example.com",
      password: "pass",
    });

    const res = await register(req);
    expect(res.status).toBe(400);
  });

  it("registers a user", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({ id: 1, email: "user@example.com" });

    const req = jsonRequest("http://localhost", {
      name: "User",
      email: "user@example.com",
      password: "pass",
    });

    const res = await register(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("set-cookie")).toContain("userId");
  });

  it("clears cookie on logout", async () => {
    const res = await logout();
    expect(res.status).toBe(200);
    expect(res.headers.get("set-cookie")).toContain("userId=");
  });

  it("returns user from /api/me", async () => {
    getCurrentUser.mockResolvedValue({ id: 1, email: "user@example.com" });

    const res = await meGet();
    const body = await res.json();

    expect(body.email).toBe("user@example.com");
  });

  it("updates user profile", async () => {
    getCurrentUser.mockResolvedValue({ id: 1, email: "user@example.com" });
    prisma.user.update.mockResolvedValue({ id: 1, email: "user@example.com" });

    const req = jsonRequest("http://localhost", { name: "New", image: null }, "PUT");
    const res = await mePut(req);

    expect(res.status).toBe(200);
  });
});
