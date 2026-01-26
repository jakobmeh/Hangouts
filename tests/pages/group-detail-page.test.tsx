import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GroupPage from "@/app/groups/[id]/page";

vi.mock("@/app/components/NavigationBar", () => ({
  default: () => <div data-testid="nav" />,
}));

vi.mock("@/app/components/Footer", () => ({
  default: () => <div data-testid="footer" />,
}));

vi.mock("@/app/components/sidebar", () => ({
  default: () => <div data-testid="sidebar" />,
}));

vi.mock("@/app/groups/[id]/DeleteGroupButton", () => ({
  default: () => <div>Delete group</div>,
}));

vi.mock("@/app/groups/[id]/JoinLeaveButton", () => ({
  default: () => <div>Join group</div>,
}));

vi.mock("@/app/groups/[id]/CreateEventButton", () => ({
  default: () => <div>Create Event</div>,
}));

vi.mock("@/app/groups/[id]/EventJoinButton", () => ({
  default: () => <div>Join event</div>,
}));

vi.mock("@/app/groups/[id]/DeleteEventButton", () => ({
  default: () => <div>Delete event</div>,
}));

vi.mock("@/app/groups/[id]/GroupChat", () => ({
  default: () => <div>Group chat</div>,
}));

const { prisma, resetPrisma } = vi.hoisted(() => {
  const mod = require("../mocks/prisma.ts");
  return mod;
});

vi.mock("@/app/lib/prisma", () => ({ prisma }));

const { getCurrentUser } = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
}));
vi.mock("@/app/lib/auth", () => ({ getCurrentUser }));

describe("GroupPage", () => {
  beforeEach(() => {
    resetPrisma();
    getCurrentUser.mockResolvedValue({
      id: 1,
      email: "owner@example.com",
      name: "Owner",
      isAdmin: false,
    });
  });

  it("renders group details and actions", async () => {
    prisma.group.findUnique.mockResolvedValue({
      id: 1,
      name: "Chess Club",
      city: "Ljubljana",
      country: "Slovenia",
      owner: { id: 1, name: "Owner" },
      members: [
        {
          user: { id: 1, name: "Owner", image: null },
        },
      ],
      events: [
        {
          id: 10,
          title: "Weekly Chess",
          date: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
          city: "Ljubljana",
          imageUrl: null,
          capacity: null,
          userId: 1,
          attendees: [],
          _count: { attendees: 0 },
        },
      ],
      _count: { members: 1, events: 1 },
    });

    const ui = await GroupPage({ params: Promise.resolve({ id: "1" }) });
    render(ui as React.ReactElement);

    expect(screen.getByText("Chess Club")).toBeInTheDocument();
    expect(screen.getByText("Members (1)")).toBeInTheDocument();
    expect(screen.getByText("Delete group")).toBeInTheDocument();
  });
});
