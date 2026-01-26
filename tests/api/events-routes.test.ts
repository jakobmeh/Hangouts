// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST as joinEvent } from "@/app/api/events/[id]/join/route";
import { POST as leaveEvent } from "@/app/api/events/[id]/leave/route";
import { DELETE as deleteEvent } from "@/app/api/events/[id]/route";

const { prisma, resetPrisma } = vi.hoisted(() => {
  const mod = require("../mocks/prisma.ts");
  return mod;
});

vi.mock("@/app/lib/prisma", () => ({ prisma }));

const { getCurrentUser } = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
}));
vi.mock("@/app/lib/auth", () => ({ getCurrentUser }));

describe("event routes", () => {
  beforeEach(() => {
    resetPrisma();
    getCurrentUser.mockReset();
  });

  it("prevents joining when event is full", async () => {
    getCurrentUser.mockResolvedValue({ id: 1 });
    prisma.event.findUnique.mockResolvedValue({
      id: 1,
      capacity: 1,
      _count: { attendees: 1 },
    });

    const res = await joinEvent(new Request("http://localhost"), {
      params: Promise.resolve({ id: "1" }),
    });

    expect(res.status).toBe(403);
  });

  it("joins event when allowed", async () => {
    getCurrentUser.mockResolvedValue({ id: 1 });
    prisma.event.findUnique.mockResolvedValue({
      id: 1,
      capacity: null,
      _count: { attendees: 0 },
    });
    prisma.attendee.findUnique.mockResolvedValue(null);

    const res = await joinEvent(new Request("http://localhost"), {
      params: Promise.resolve({ id: "1" }),
    });

    expect(res.status).toBe(200);
    expect(prisma.attendee.create).toHaveBeenCalled();
  });

  it("leaves event", async () => {
    getCurrentUser.mockResolvedValue({ id: 2 });
    prisma.attendee.findUnique.mockResolvedValue({ id: 99 });

    const res = await leaveEvent(new Request("http://localhost"), {
      params: Promise.resolve({ id: "1" }),
    });

    expect(res.status).toBe(200);
  });

  it("rejects event delete when not owner", async () => {
    getCurrentUser.mockResolvedValue({ id: 1, isAdmin: false });
    prisma.event.findUnique.mockResolvedValue({ id: 5, userId: 2 });

    const res = await deleteEvent(new Request("http://localhost"), {
      params: Promise.resolve({ id: "5" }),
    });

    expect(res.status).toBe(403);
  });
});
