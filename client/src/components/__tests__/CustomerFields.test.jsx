import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CustomerFields from "../CustomerFields";

describe("CustomerFields", () => {
  const defaultProps = {
    firstName: "",
    lastName: "",
    quantity: "",
    onFirstNameChange: vi.fn(),
    onLastNameChange: vi.fn(),
    onQuantityChange: vi.fn(),
  };

  it("renders first name, last name, and quantity fields", () => {
    render(<CustomerFields {...defaultProps} />);
    expect(
      screen.getByPlaceholderText("Enter Customer First Name")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter Customer Last Name")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("1")).toBeInTheDocument();
  });

  it("displays provided values", () => {
    render(
      <CustomerFields
        {...defaultProps}
        firstName="John"
        lastName="Doe"
        quantity="5"
      />
    );
    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("5")).toBeInTheDocument();
  });

  it("calls onFirstNameChange when first name is typed", async () => {
    const user = userEvent.setup();
    const onFirstNameChange = vi.fn();
    render(
      <CustomerFields {...defaultProps} onFirstNameChange={onFirstNameChange} />
    );

    await user.type(
      screen.getByPlaceholderText("Enter Customer First Name"),
      "A"
    );
    expect(onFirstNameChange).toHaveBeenCalled();
  });
});
