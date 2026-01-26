import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GroupsPage from "@/app/groups/page";

vi.mock("@/app/components/NavigationBar", () => ({
  default: () => <div data-testid="nav" />,
}));

vi.mock("@/app/components/Footer", () => ({
  default: () => <div data-testid="footer" />,
}));

vi.mock("@/app/components/sidebar", () => ({
  default: () => <div data-testid="sidebar" />,
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

describe("GroupsPage", () => {
  beforeEach(() => {
    resetPrisma();
    getCurrentUser.mockResolvedValue({
      id: 1,
      email: "admin@example.com",
      name: "Admin",
      isAdmin: true,
    });
  });

  it("renders groups from the database", async () => {
    prisma.group.findMany.mockResolvedValue([
      {
        id: 1,
        name: "Chess Club",
        city: "Ljubljana",
        country: "Slovenia",
        owner: { id: 1, name: "Admin" },
        _count: { members: 3, events: 2 },
      },
    ]);

    const ui = await GroupsPage();
    render(ui as React.ReactElement);

    expect(screen.getByText("Discover Groups")).toBeInTheDocument();
    expect(screen.getByText("Chess Club")).toBeInTheDocument();
  });
});
