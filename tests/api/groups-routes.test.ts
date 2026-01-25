// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { jsonRequest } from "@/tests/helpers/request";
import { GET as getGroups, POST as createGroup } from "@/app/api/groups/route";
import { GET as getGroup, DELETE as deleteGroup } from "@/app/api/groups/[id]/route";
import { POST as joinGroup } from "@/app/api/groups/[id]/join/route";
import { POST as leaveGroup } from "@/app/api/groups/[id]/leave/route";
import { POST as createEvent } from "@/app/api/groups/[id]/events/route";
import { GET as getMessages, POST as postMessage } from "@/app/api/groups/[id]/messages/route";

const { prisma, resetPrisma } = vi.hoisted(() => {
  const mod = require("../mocks/prisma.ts");
  return mod;
});

vi.mock("@/app/lib/prisma", () => ({ prisma }));

const { getCurrentUser } = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
}));
vi.mock("@/app/lib/auth", () => ({ getCurrentUser }));

describe("group routes", () => {
  beforeEach(() => {
    resetPrisma();
    getCurrentUser.mockReset();
  });

  it("lists groups", async () => {
    prisma.group.findMany.mockResolvedValue([{ id: 1, name: "Group" }]);

    const res = await getGroups();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toHaveLength(1);
  });

  it("creates group when authorized", async () => {
    getCurrentUser.mockResolvedValue({ id: 5 });
    prisma.group.create.mockResolvedValue({ id: 1, name: "Group" });

    const req = jsonRequest("http://localhost/api/groups", {
      name: "Group",
      city: "Ljubljana",
      description: "Desc",
      imageUrl: "",
      country: "Slovenia",
    });

    const res = await createGroup(req);
    expect(res.status).toBe(201);
  });

  it("rejects group creation when not authorized", async () => {
    getCurrentUser.mockResolvedValue(null);

    const req = jsonRequest("http://localhost/api/groups", {
      name: "Group",
      city: "Ljubljana",
    });

    const res = await createGroup(req);
    expect(res.status).toBe(401);
  });

  it("fetches group detail", async () => {
    prisma.group.findUnique.mockResolvedValue({ id: 1, name: "Group" });

    const res = await getGroup(new Request("http://localhost"), {
      params: Promise.resolve({ id: "1" }),
    });

    expect(res.status).toBe(200);
  });

  it("returns 400 for invalid group id", async () => {
    const res = await getGroup(new Request("http://localhost"), {
      params: Promise.resolve({ id: "bad" }),
    });

    expect(res.status).toBe(400);
  });

  it("deletes group when owner", async () => {
    getCurrentUser.mockResolvedValue({ id: 2, isAdmin: false });
    prisma.group.findUnique.mockResolvedValue({ id: 1, ownerId: 2 });

    const res = await deleteGroup(new Request("http://localhost"), {
      params: Promise.resolve({ id: "1" }),
    });

    expect(res.status).toBe(200);
  });

  it("rejects group deletion when not logged in", async () => {
    getCurrentUser.mockResolvedValue(null);

    const res = await deleteGroup(new Request("http://localhost"), {
      params: Promise.resolve({ id: "1" }),
    });

    expect(res.status).toBe(401);
  });

  it("joins a group", async () => {
    getCurrentUser.mockResolvedValue({ id: 3 });
    prisma.groupMember.findUnique.mockResolvedValue(null);

    const res = await joinGroup(new Request("http://localhost"), {
      params: Promise.resolve({ id: "1" }),
    });

    expect(res.status).toBe(200);
    expect(prisma.groupMember.create).toHaveBeenCalled();
  });

  it("leaves a group", async () => {
    getCurrentUser.mockResolvedValue({ id: 3 });

    const res = await leaveGroup(new Request("http://localhost"), {
      params: Promise.resolve({ id: "1" }),
    });

    expect(res.status).toBe(200);
    expect(prisma.groupMember.deleteMany).toHaveBeenCalled();
  });

  it("creates event in group", async () => {
    getCurrentUser.mockResolvedValue({ id: 9 });
    prisma.event.create.mockResolvedValue({ id: 10 });

    const req = jsonRequest("http://localhost", {
      title: "Event",
      description: "Desc",
      date: "2030-01-01T10:00:00.000Z",
      city: "Ljubljana",
      country: "Slovenia",
      imageUrl: null,
      capacity: null,
    });

    const res = await createEvent(req, {
      params: Promise.resolve({ id: "1" }),
    });

    expect(res.status).toBe(200);
  });

  it("returns messages for a group", async () => {
    prisma.groupMessage.findMany.mockResolvedValue([{ id: 1, content: "Hi" }]);

    const res = await getMessages(new Request("http://localhost"), {
      params: Promise.resolve({ id: "1" }),
    });

    const body = await res.json();
    expect(body).toHaveLength(1);
  });

  it("posts a message when authorized", async () => {
    getCurrentUser.mockResolvedValue({ id: 5 });
    prisma.groupMessage.create.mockResolvedValue({ id: 1, content: "Hello" });

    const req = jsonRequest("http://localhost", { content: "Hello" });
    const res = await postMessage(req, {
      params: Promise.resolve({ id: "1" }),
    });

    expect(res.status).toBe(200);
  });

  it("rejects empty message", async () => {
    getCurrentUser.mockResolvedValue({ id: 5 });

    const req = jsonRequest("http://localhost", { content: "" });
    const res = await postMessage(req, {
      params: Promise.resolve({ id: "1" }),
    });

    expect(res.status).toBe(400);
  });
});
