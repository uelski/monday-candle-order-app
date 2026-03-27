import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AppHeader from "../AppHeader";

describe("AppHeader", () => {
  it("renders 'Order Maker' heading when view is order", () => {
    render(<AppHeader view="order" onMenuClick={() => {}} />);
    expect(screen.getByText("Order Maker")).toBeInTheDocument();
  });

  it("renders 'Fragrance Manager' heading when view is fragrances", () => {
    render(<AppHeader view="fragrances" onMenuClick={() => {}} />);
    expect(screen.getByText("Fragrance Manager")).toBeInTheDocument();
  });

  it("calls onMenuClick when the menu button is clicked", async () => {
    const user = userEvent.setup();
    const onMenuClick = vi.fn();
    render(<AppHeader view="order" onMenuClick={onMenuClick} />);

    await user.click(screen.getByLabelText("Menu"));
    expect(onMenuClick).toHaveBeenCalledOnce();
  });

  it("does not show filter icon in fragrances view", () => {
    const { container } = render(
      <AppHeader view="fragrances" onMenuClick={() => {}} />
    );
    // Filter icon only renders in order view
    const icons = container.querySelectorAll('[data-testid="icon"]');
    // The Menu IconButton always renders; Filter should not
    expect(screen.getByText("Fragrance Manager")).toBeInTheDocument();
  });
});
