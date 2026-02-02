// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET as adminOverview } from "@/app/api/admin/overview/route";
import { PUT as updateUser, DELETE as deleteUser } from "@/app/api/admin/users/[id]/route";
import { DELETE as deleteGroup } from "@/app/api/admin/groups/[id]/route";
import { DELETE as deleteEvent } from "@/app/api/admin/events/[id]/route";
import { jsonRequest } from "@/tests/helpers/request";
import { prisma, resetPrisma } from "@/tests/mocks/prisma";

vi.mock("@/app/lib/prisma", async () => {
  const mod = await import("@/tests/mocks/prisma");
  return { prisma: mod.prisma };
});

const { getCurrentUser } = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
}));
vi.mock("@/app/lib/auth", () => ({ getCurrentUser }));

describe("admin routes", () => {
  beforeEach(() => {
    resetPrisma();
    getCurrentUser.mockReset();
  });

  it("rejects overview for non-admin", async () => {
    getCurrentUser.mockResolvedValue({ id: 1, isAdmin: false });

    const res = await adminOverview();
    expect(res.status).toBe(403);
  });

  it("returns overview for admin", async () => {
    getCurrentUser.mockResolvedValue({ id: 1, isAdmin: true });
    prisma.user.findMany.mockResolvedValue([]);
    prisma.group.findMany.mockResolvedValue([]);
    prisma.event.findMany.mockResolvedValue([]);

    const res = await adminOverview();
    const body = await res.json();

    expect(body).toHaveProperty("users");
  });

  it("updates user as admin", async () => {
    getCurrentUser.mockResolvedValue({ id: 1, isAdmin: true });
    prisma.user.update.mockResolvedValue({ id: 2 });

    const req = jsonRequest("http://localhost", { name: "New" }, "PUT");
    const res = await updateUser(req, { params: Promise.resolve({ id: "2" }) });

    expect(res.status).toBe(200);
  });

  it("prevents admin deleting own account", async () => {
    getCurrentUser.mockResolvedValue({ id: 1, isAdmin: true });

    const res = await deleteUser(new Request("http://localhost"), {
      params: Promise.resolve({ id: "1" }),
    });

    expect(res.status).toBe(400);
  });

  it("deletes group as admin", async () => {
    getCurrentUser.mockResolvedValue({ id: 1, isAdmin: true });

    const res = await deleteGroup(new Request("http://localhost"), {
      params: Promise.resolve({ id: "10" }),
    });

    expect(res.status).toBe(200);
  });

  it("deletes event as admin", async () => {
    getCurrentUser.mockResolvedValue({ id: 1, isAdmin: true });

    const res = await deleteEvent(new Request("http://localhost"), {
      params: Promise.resolve({ id: "10" }),
    });

    expect(res.status).toBe(200);
  });
});
