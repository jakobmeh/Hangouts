// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET as filterEvents } from "@/app/api/filter/route";
import { GET as searchLocation } from "@/app/api/search-location/route";
import { GET as notifications } from "@/app/api/notifications/route";
import { GET as myGroups } from "@/app/api/me/groups/route";

const { prisma, resetPrisma } = vi.hoisted(() => {
  const mod = require("../mocks/prisma.ts");
  return mod;
});

vi.mock("@/app/lib/prisma", () => ({ prisma }));

const { getCurrentUser } = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
}));
vi.mock("@/app/lib/auth", () => ({ getCurrentUser }));

describe("search and notification routes", () => {
  beforeEach(() => {
    resetPrisma();
    getCurrentUser.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("filters events by paging", async () => {
    prisma.event.findMany.mockResolvedValue([
      { id: 1, title: "Event A", date: new Date(), city: "Ljubljana", country: "Slovenia" },
      { id: 2, title: "Event B", date: new Date(), city: "Ljubljana", country: "Slovenia" },
    ]);

    const req = new Request("http://localhost/api/filter?page=1&pageSize=1");
    const res = await filterEvents(req);
    const body = await res.json();

    expect(body.events).toHaveLength(1);
    expect(body.total).toBe(2);
  });

  it("returns empty location list when query too short", async () => {
    const req = new Request("http://localhost/api/search-location?q=a");
    const res = await searchLocation(req);
    const body = await res.json();

    expect(body.results).toHaveLength(0);
  });

  it("maps location results", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          address: { city: "Ljubljana", country: "Slovenia" },
          display_name: "Ljubljana, Slovenia",
        },
      ],
    } as Response);

    vi.stubGlobal("fetch", fetchMock);

    const req = new Request("http://localhost/api/search-location?q=Ljubljana");
    const res = await searchLocation(req);
    const body = await res.json();

    expect(body.results[0].city).toBe("Ljubljana");
  });

  it("returns notifications for user", async () => {
    getCurrentUser.mockResolvedValue({ id: 1 });
    prisma.groupMember.findMany.mockResolvedValue([{ groupId: 1 }]);
    prisma.event.findMany.mockResolvedValue([
      {
        id: 1,
        title: "Event",
        createdAt: new Date().toISOString(),
        group: { id: 1, name: "Group" },
      },
    ]);
    prisma.groupMessage.findMany.mockResolvedValue([]);

    const res = await notifications();
    const body = await res.json();

    expect(body.notifications.length).toBeGreaterThan(0);
  });

  it("returns empty list for /api/me/groups when not logged in", async () => {
    getCurrentUser.mockResolvedValue(null);

    const res = await myGroups();
    const body = await res.json();

    expect(body).toHaveLength(0);
  });
});
