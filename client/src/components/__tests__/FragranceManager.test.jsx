import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FragranceManager from "../FragranceManager";

const mockFragrances = [
  {
    id: "1",
    name: "Herb Garden",
    description: "A herbal scent",
    category: "Herbaceous",
    image_url: "",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Ocean Breeze",
    description: "",
    category: "Fresh",
    image_url: "",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("FragranceManager", () => {
  it("shows the passcode gate initially", () => {
    render(<FragranceManager boardId="123" />);
    expect(
      screen.getByText("Enter passcode to manage fragrances")
    ).toBeInTheDocument();
  });

  it("shows fragrance list after unlocking with correct passcode", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockFragrances),
    });

    render(<FragranceManager boardId="123" />);

    await user.type(screen.getByPlaceholderText("Passcode"), "demo");
    await user.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText("Herb Garden")).toBeInTheDocument();
    });
    expect(screen.getByText("Ocean Breeze")).toBeInTheDocument();
    expect(screen.getByText("2 fragrances")).toBeInTheDocument();
  });

  it("shows error state when fetch fails", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<FragranceManager boardId="123" />);

    await user.type(screen.getByPlaceholderText("Passcode"), "demo");
    await user.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText("Failed to load fragrances")).toBeInTheDocument();
    });
  });

  it("shows empty state when no fragrances exist", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    render(<FragranceManager boardId="123" />);

    await user.type(screen.getByPlaceholderText("Passcode"), "demo");
    await user.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(
        screen.getByText("No fragrances yet. Add your first one!")
      ).toBeInTheDocument();
    });
  });

  it("sends POST with boardId when adding a fragrance", async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    // Initial load
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    render(<FragranceManager boardId="123" />);

    await user.type(screen.getByPlaceholderText("Passcode"), "demo");
    await user.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText("Add Fragrance")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Add Fragrance"));

    // Save response + re-fetch
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: "3", name: "New Scent" }),
    });
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: "3",
            name: "New Scent",
            category: "Floral",
            description: "",
            image_url: "",
          },
        ]),
    });

    // Fill form — Vibe TextField onChange fires with value directly
    const nameInput = screen.getByPlaceholderText("e.g. Herb Garden");
    const categoryInput = screen.getByPlaceholderText("e.g. Herbaceous");
    await user.type(nameInput, "New Scent");
    await user.type(categoryInput, "Floral");

    await user.click(screen.getByText("Save"));

    await waitFor(() => {
      const postCall = fetchSpy.mock.calls.find(
        (call) => call[1]?.method === "POST"
      );
      expect(postCall).toBeDefined();
      const body = JSON.parse(postCall[1].body);
      expect(body.boardId).toBe("123");
      expect(body.name).toBe("New Scent");
    });
  });

  it("sends DELETE with boardId when deleting a fragrance", async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockFragrances),
    });

    render(<FragranceManager boardId="123" />);

    await user.type(screen.getByPlaceholderText("Passcode"), "demo");
    await user.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText("Herb Garden")).toBeInTheDocument();
    });

    // Click delete on first card
    const deleteButtons = screen.getAllByLabelText("Delete");
    await user.click(deleteButtons[0]);

    // Confirm delete
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockFragrances[0]),
    });
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([mockFragrances[1]]),
    });

    await user.click(screen.getByText("Delete"));

    await waitFor(() => {
      const deleteCall = fetchSpy.mock.calls.find(
        (call) => call[1]?.method === "DELETE"
      );
      expect(deleteCall).toBeDefined();
      const body = JSON.parse(deleteCall[1].body);
      expect(body.boardId).toBe("123");
    });
  });
});
