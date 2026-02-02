/**
 * FORM_INPUT.TEST.TSX - Component test za FormInput komponento
 *
 * Testira:
 * - Rendering z label in value
 * - onChange callback
 * - Error state styling in sporočilo
 * - Disabled state
 * - Type prop
 */

import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FormInput from "@/app/components/FormInput";

describe("FormInput Component", () => {
  it("renders label and input with correct value", () => {
    render(
      <FormInput
        label="Test Label"
        value="test value"
        onChange={() => {}}
      />
    );

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByDisplayValue("test value")).toBeInTheDocument();
  });

  it("calls onChange when input value changes", () => {
    const mockOnChange = vi.fn();
    render(
      <FormInput
        label="Email"
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByLabelText("Email");
    fireEvent.change(input, { target: { value: "new value" } });

    expect(mockOnChange).toHaveBeenCalledWith("new value");
  });

  it("shows error message and applies error styling", () => {
    render(
      <FormInput
        label="Email"
        value=""
        onChange={() => {}}
        error="This field is required"
      />
    );

    expect(screen.getByText("This field is required")).toBeInTheDocument();

    const input = screen.getByLabelText("Email");
    expect(input).toHaveClass("border-red-300");
  });

  it("applies disabled styling and prevents input", () => {
    render(
      <FormInput
        label="Disabled Input"
        value="disabled value"
        onChange={() => {}}
        disabled={true}
      />
    );

    const input = screen.getByDisplayValue("disabled value");
    expect(input).toBeDisabled();
    expect(input).toHaveClass("border-gray-200", "bg-gray-100", "cursor-not-allowed");
  });

  it("sets correct input type", () => {
    render(
      <FormInput
        label="Password"
        value=""
        onChange={() => {}}
        type="password"
      />
    );

    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("type", "password");
  });

  it("defaults to text type when no type provided", () => {
    render(
      <FormInput
        label="Default Input"
        value=""
        onChange={() => {}}
      />
    );

    const input = screen.getByLabelText("Default Input");
    expect(input).toHaveAttribute("type", "text");
  });

  it("has correct accessibility attributes", () => {
    render(
      <FormInput
        label="Accessible Input"
        value=""
        onChange={() => {}}
        error="Error message"
      />
    );

    const input = screen.getByLabelText("Accessible Input");
    expect(input).toHaveAttribute("aria-label", "Accessible Input");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });
});