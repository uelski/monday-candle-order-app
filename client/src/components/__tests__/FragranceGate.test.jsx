import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FragranceGate from "../FragranceGate";

describe("FragranceGate", () => {
  it("renders the passcode prompt", () => {
    render(<FragranceGate onUnlock={() => {}} />);
    expect(
      screen.getByText("Enter passcode to manage fragrances")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Passcode")).toBeInTheDocument();
  });

  it("calls onUnlock when correct passcode is submitted", async () => {
    const user = userEvent.setup();
    const onUnlock = vi.fn();
    render(<FragranceGate onUnlock={onUnlock} />);

    await user.type(screen.getByPlaceholderText("Passcode"), "demo");
    await user.click(screen.getByText("Submit"));

    expect(onUnlock).toHaveBeenCalledOnce();
  });

  it("shows error on incorrect passcode", async () => {
    const user = userEvent.setup();
    const onUnlock = vi.fn();
    render(<FragranceGate onUnlock={onUnlock} />);

    await user.type(screen.getByPlaceholderText("Passcode"), "wrong");
    await user.click(screen.getByText("Submit"));

    expect(onUnlock).not.toHaveBeenCalled();
    expect(screen.getByText("Incorrect passcode")).toBeInTheDocument();
  });

  it("submits on Enter key", async () => {
    const user = userEvent.setup();
    const onUnlock = vi.fn();
    render(<FragranceGate onUnlock={onUnlock} />);

    const input = screen.getByPlaceholderText("Passcode");
    await user.type(input, "demo{Enter}");

    expect(onUnlock).toHaveBeenCalledOnce();
  });
});
