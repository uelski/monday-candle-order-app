import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FragranceCard from "../FragranceCard";

const mockFragrance = {
  id: "1",
  name: "Herb Garden",
  category: "Herbaceous",
  description: "A refreshing herbal scent",
  image_url: "",
};

describe("FragranceCard", () => {
  it("renders fragrance name, category, and description", () => {
    render(
      <FragranceCard
        fragrance={mockFragrance}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    );
    expect(screen.getByText("Herb Garden")).toBeInTheDocument();
    expect(screen.getByText("Herbaceous")).toBeInTheDocument();
    expect(screen.getByText("A refreshing herbal scent")).toBeInTheDocument();
  });

  it("does not render description when empty", () => {
    const fragrance = { ...mockFragrance, description: "" };
    render(
      <FragranceCard
        fragrance={fragrance}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    );
    expect(screen.getByText("Herb Garden")).toBeInTheDocument();
    expect(
      screen.queryByText("A refreshing herbal scent")
    ).not.toBeInTheDocument();
  });

  it("calls onEdit with the fragrance when edit is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(
      <FragranceCard
        fragrance={mockFragrance}
        onEdit={onEdit}
        onDelete={() => {}}
      />
    );

    await user.click(screen.getByLabelText("Edit"));
    expect(onEdit).toHaveBeenCalledWith(mockFragrance);
  });

  it("calls onDelete with the fragrance when delete is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(
      <FragranceCard
        fragrance={mockFragrance}
        onEdit={() => {}}
        onDelete={onDelete}
      />
    );

    await user.click(screen.getByLabelText("Delete"));
    expect(onDelete).toHaveBeenCalledWith(mockFragrance);
  });
});
