import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Button } from "../button";
import { Badge } from "../badge";
import { Card, CardHeader, CardTitle, CardContent } from "../card";

describe("UI Components Render Tests", () => {
  describe("Button Component", () => {
    it("renders button with text content", () => {
      render(<Button>Click me</Button>);
      expect(
        screen.getByRole("button", { name: /click me/i })
      ).toBeInTheDocument();
    });

    it("handles click events", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole("button");

      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("can be disabled", () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });
  });

  describe("Badge Component", () => {
    it("renders badge with text content", () => {
      render(<Badge>Badge Text</Badge>);
      expect(screen.getByText("Badge Text")).toBeInTheDocument();
    });

    it("supports different variants", () => {
      const { rerender } = render(<Badge variant="secondary">Secondary</Badge>);
      expect(screen.getByText("Secondary")).toBeInTheDocument();

      rerender(<Badge variant="outline">Outline</Badge>);
      expect(screen.getByText("Outline")).toBeInTheDocument();
    });
  });

  describe("Card Components", () => {
    it("renders card structure with content", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Test content</p>
          </CardContent>
        </Card>
      );

      expect(screen.getByText("Test Title")).toBeInTheDocument();
      expect(screen.getByText("Test content")).toBeInTheDocument();
    });

    it("renders complete card with all parts", () => {
      render(
        <Card data-testid="test-card">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
          <CardContent>Card Content</CardContent>
        </Card>
      );

      expect(screen.getByTestId("test-card")).toBeInTheDocument();
      expect(screen.getByText("Card Title")).toBeInTheDocument();
      expect(screen.getByText("Card Content")).toBeInTheDocument();
    });
  });

  describe("Component Integration", () => {
    it("renders components together in a realistic scenario", () => {
      render(
        <Card>
          <CardHeader>
            <Badge variant="secondary">New Feature</Badge>
            <CardTitle>Financial Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Track your investments and portfolio performance.</p>
            <Button>Get Started</Button>
          </CardContent>
        </Card>
      );

      expect(screen.getByText("New Feature")).toBeInTheDocument();
      expect(screen.getByText("Financial Dashboard")).toBeInTheDocument();
      expect(
        screen.getByText("Track your investments and portfolio performance.")
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /get started/i })
      ).toBeInTheDocument();
    });
  });
});
