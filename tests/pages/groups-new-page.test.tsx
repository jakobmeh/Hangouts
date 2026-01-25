import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import NewGroupPage from "@/app/groups/new/page";

vi.mock("@/app/components/NavigationBar", () => ({
  default: () => <div data-testid="nav" />,
}));

vi.mock("@/app/components/Footer", () => ({
  default: () => <div data-testid="footer" />,
}));

vi.mock("@/app/components/sidebar", () => ({
  default: () => <div data-testid="sidebar" />,
}));

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

describe("NewGroupPage", () => {
  beforeEach(() => {
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(
      JSON.stringify({ id: 1, email: "user@example.com" })
    );

    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({}) } as Response);

    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("submits the create group form", async () => {
    render(<NewGroupPage />);

    fireEvent.change(screen.getByPlaceholderText("e.g. Hiking Slovenia"), {
      target: { value: "Chess Club" },
    });
    fireEvent.change(screen.getByPlaceholderText("Ljubljana"), {
      target: { value: "Ljubljana" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create group" }));

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/groups",
      expect.objectContaining({ method: "POST" })
    );
  });
});