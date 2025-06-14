import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Mock the server functions
vi.mock("@tanstack/react-start", () => ({
  createServerFn: vi.fn(() => ({
    handler: vi.fn(() => Promise.resolve(0)),
    validator: vi.fn((fn) => ({ handler: fn })),
  })),
}));

// Mock fs module
vi.mock("node:fs", () => ({
  promises: {
    readFile: vi.fn(() => Promise.resolve("0")),
    writeFile: vi.fn(() => Promise.resolve()),
  },
}));

// Mock router hooks
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: vi.fn(() => ({
    component: vi.fn(),
  })),
  useRouter: vi.fn(() => ({})),
}));

// Import the Home component directly
const { Home } = await import("../routes/index");

describe("Landing Page Functional Tests", () => {
  it("renders the main branding elements", () => {
    render(<Home />);

    // Check main branding
    expect(screen.getByText("FinanzCoach Pro")).toBeInTheDocument();
    expect(screen.getByText("Deutsche Bank Gruppe")).toBeInTheDocument();
  });

  it("displays the hero section content", () => {
    render(<Home />);

    // Check main headline
    expect(screen.getByText("Ihre finanzielle")).toBeInTheDocument();
    expect(screen.getByText("Zukunft beginnt heute")).toBeInTheDocument();

    // Check key statistics
    expect(screen.getByText("500+")).toBeInTheDocument();
    expect(screen.getByText("15+")).toBeInTheDocument();
    expect(screen.getByText("€50M+")).toBeInTheDocument();
  });

  it("shows all navigation links", () => {
    render(<Home />);

    const navigation = [
      { text: "Leistungen", href: "#services" },
      { text: "Über mich", href: "#about" },
      { text: "Referenzen", href: "#testimonials" },
      { text: "Kontakt", href: "#contact" },
    ];

    navigation.forEach(({ text, href }) => {
      const link = screen.getByRole("link", { name: text });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", href);
    });
  });

  it("displays financial services information", () => {
    render(<Home />);

    const services = ["Vermögensaufbau", "Altersvorsorge", "Finanzanalyse"];

    services.forEach((service) => {
      expect(screen.getByText(service)).toBeInTheDocument();
    });
  });

  it("shows portfolio performance data", () => {
    render(<Home />);

    expect(screen.getByText("Portfolio Performance")).toBeInTheDocument();
    expect(screen.getByText("+12.4%")).toBeInTheDocument();
    expect(screen.getByText("€185,000")).toBeInTheDocument();
    expect(screen.getByText("€250,000")).toBeInTheDocument();
  });

  it("displays customer testimonials", () => {
    render(<Home />);

    const customers = ["Maria Schmidt", "Thomas Weber", "Anna Müller"];
    customers.forEach((customer) => {
      expect(screen.getByText(customer)).toBeInTheDocument();
    });
  });

  it("shows contact information", () => {
    render(<Home />);

    expect(screen.getByText("+49 (0) 69 123 456 789")).toBeInTheDocument();
    expect(
      screen.getByText("coach@deutsche-bank-finanz.de")
    ).toBeInTheDocument();
  });

  it("includes all call-to-action buttons", () => {
    render(<Home />);

    const buttons = screen.getAllByRole("button");
    const buttonTexts = buttons.map((button) => button.textContent);

    expect(buttonTexts).toContain("Beratungstermin buchen");
    expect(buttonTexts).toContain("Kostenlose Erstberatung");
    expect(buttonTexts).toContain("Termin vereinbaren");
  });

  it("displays legal compliance information", () => {
    render(<Home />);

    const legalLinks = ["Impressum", "Datenschutz", "AGB", "Risikohinweise"];
    legalLinks.forEach((link) => {
      expect(screen.getByText(link)).toBeInTheDocument();
    });

    expect(
      screen.getByText("© 2024 Deutsche Bank AG. Alle Rechte vorbehalten.")
    ).toBeInTheDocument();
  });

  it("has proper semantic structure", () => {
    render(<Home />);

    // Check for essential landmarks
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();

    // Check for headings
    const headings = screen.getAllByRole("heading");
    expect(headings.length).toBeGreaterThan(0);

    // Check for buttons
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("displays professional qualifications", () => {
    render(<Home />);

    const qualifications = [
      "Certified Financial Planner (CFP)",
      "Master in Finance",
      "Deutsche Bank Zertifizierung",
    ];

    qualifications.forEach((qualification) => {
      expect(screen.getByText(qualification)).toBeInTheDocument();
    });
  });
});
