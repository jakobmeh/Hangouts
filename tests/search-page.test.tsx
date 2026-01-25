import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SearchPage from "@/app/search/page";

const mockPush = vi.fn();
const mockSearchParams = new URLSearchParams({
  event: "music",
  city: "Paris",
  page: "1",
});

vi.mock("@/app/components/NavigationBar", () => ({
  default: () => <div data-testid="nav" />,
}));

vi.mock("@/app/components/Footer", () => ({
  default: () => <div data-testid="footer" />,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockSearchParams,
}));

describe("SearchPage", () => {
  beforeEach(() => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({ events: [], total: 0 }),
    });

    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("renders the empty state and calls the filter API", async () => {
    render(<SearchPage />);

    expect(screen.getByText("Find events in Paris")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("No events found")).toBeInTheDocument();
    });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/filter?event=music&city=Paris&page=1&pageSize=9"
    );
  });
});
