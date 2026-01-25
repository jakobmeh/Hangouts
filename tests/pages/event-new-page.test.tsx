import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import NewEventPage from "@/app/groups/[id]/events/new/page";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useParams: () => ({ id: "1" }),
}));

describe("NewEventPage", () => {
  beforeEach(() => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({}) } as Response);

    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("submits the create event form", () => {
    render(<NewEventPage />);

    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: "Weekly Meetup" },
    });
    fireEvent.change(screen.getByPlaceholderText("City"), {
      target: { value: "Ljubljana" },
    });
    const dateInput = document.querySelector(
      'input[type="datetime-local"]'
    ) as HTMLInputElement | null;
    expect(dateInput).not.toBeNull();
    if (dateInput) {
      fireEvent.change(dateInput, { target: { value: "2030-01-01T10:00" } });
    }

    fireEvent.click(screen.getByRole("button", { name: "Create Event" }));

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/groups/1/events",
      expect.objectContaining({ method: "POST" })
    );
  });
});
