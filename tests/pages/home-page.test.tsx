import React from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import HomePage from "@/app/page";

vi.mock("@/app/components/NavigationBar", () => ({
  default: () => <div data-testid="nav" />,
}));

vi.mock("@/app/components/Footer", () => ({
  default: () => <div data-testid="footer" />,
}));

vi.mock("@/app/components/sidebar", () => ({
  default: () => <div data-testid="sidebar" />,
}));

vi.mock("framer-motion", () => ({
  motion: { div: (props: { children: React.ReactNode }) => <div>{props.children}</div> },
}));

describe("HomePage", () => {
  beforeEach(() => {
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null);

    const fetchMock = vi.fn((input: RequestInfo | URL) => {
      const url = input.toString();
      if (url.includes("/api/me/groups")) {
        return Promise.resolve({ ok: true, json: async () => [] } as Response);
      }
      if (url.includes("/api/groups")) {
        return Promise.resolve({ ok: true, json: async () => [] } as Response);
      }
      if (url.includes("/api/me")) {
        return Promise.resolve({ ok: false, json: async () => ({}) } as Response);
      }
      return Promise.resolve({ ok: true, json: async () => ({}) } as Response);
    });

    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("renders guest CTA when no user is present", async () => {
    render(<HomePage />);

    expect(
      await screen.findByRole("button", { name: "Join Meetup" })
    ).toBeInTheDocument();
  });
});
