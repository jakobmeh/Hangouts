import React from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AdminPage from "@/app/admin/page";

describe("AdminPage", () => {
  beforeEach(() => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        users: [
          {
            id: 1,
            email: "admin@example.com",
            name: "Admin",
            image: null,
            isAdmin: true,
            createdAt: new Date().toISOString(),
          },
        ],
        groups: [
          {
            id: 1,
            name: "Chess Club",
            city: "Ljubljana",
            country: "Slovenia",
            createdAt: new Date().toISOString(),
            owner: { id: 1, name: "Admin", email: "admin@example.com" },
            _count: { members: 3, events: 2 },
          },
        ],
        events: [
          {
            id: 10,
            title: "Weekly Chess",
            date: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            group: { id: 1, name: "Chess Club" },
            user: { id: 1, name: "Admin", email: "admin@example.com" },
          },
        ],
      }),
    } as Response);

    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("renders admin overview data", async () => {
    render(<AdminPage />);

    expect(screen.getByText("Admin Panel")).toBeInTheDocument();
    expect(await screen.findByText("Groups")).toBeInTheDocument();
    expect(screen.getByText("Chess Club")).toBeInTheDocument();
  });
});