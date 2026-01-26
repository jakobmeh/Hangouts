import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ProfilePage from "@/app/profile/page";

vi.mock("@/app/components/NavigationBar", () => ({
  default: () => <div data-testid="nav" />,
}));

vi.mock("@/app/components/Footer", () => ({
  default: () => <div data-testid="footer" />,
}));

vi.mock("@/app/components/sidebar", () => ({
  default: () => <div data-testid="sidebar" />,
}));

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(
      JSON.stringify({ id: 1, email: "user@example.com", name: "User" })
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

  it("renders profile settings and submits changes", () => {
    render(<ProfilePage />);

    expect(screen.getByText("Profile settings")).toBeInTheDocument();

    const nameInput = screen.getByDisplayValue("User");
    fireEvent.change(nameInput, {
      target: { value: "New Name" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/me",
      expect.objectContaining({ method: "PUT" })
    );
  });
});
