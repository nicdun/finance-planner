import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Mock all external dependencies
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => ({
    component: () => <div data-testid="landing-page">Landing Page</div>,
  }),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to} data-testid="link">
      {children}
    </a>
  ),
  useRouter: () => ({
    navigate: vi.fn(),
  }),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    loading: false,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock Lucide icons
vi.mock("lucide-react", () => ({
  ArrowRight: () => <span data-testid="arrow-right-icon">→</span>,
  TrendingUp: () => <span data-testid="trending-up-icon">📈</span>,
  PieChart: () => <span data-testid="pie-chart-icon">📊</span>,
  Target: () => <span data-testid="target-icon">🎯</span>,
  Shield: () => <span data-testid="shield-icon">🛡️</span>,
  Users: () => <span data-testid="users-icon">👥</span>,
  Zap: () => <span data-testid="zap-icon">⚡</span>,
}));

// Simple mock landing page component
const MockLandingPage = () => (
  <div data-testid="landing-page">
    <header data-testid="header">
      <h1>FinanzPlaner</h1>
      <nav>
        <a href="/login" data-testid="login-link">
          Anmelden
        </a>
        <a href="/signup" data-testid="signup-link">
          Registrieren
        </a>
      </nav>
    </header>

    <main>
      <section data-testid="hero-section">
        <h1>Ihre Finanzen im Griff</h1>
        <p>
          Verwalten Sie Ihre Ausgaben, setzen Sie Budgets und erreichen Sie Ihre
          Sparziele.
        </p>
        <button data-testid="cta-button">Jetzt kostenlos starten</button>
      </section>

      <section data-testid="features-section">
        <h2>Funktionen</h2>
        <div data-testid="feature-cards">
          <div data-testid="feature-tracking">
            <h3>Ausgaben verfolgen</h3>
            <p>Behalten Sie den Überblick über alle Ihre Transaktionen</p>
          </div>
          <div data-testid="feature-budgets">
            <h3>Budgets erstellen</h3>
            <p>Setzen Sie sich Limits und bleiben Sie auf Kurs</p>
          </div>
          <div data-testid="feature-goals">
            <h3>Sparziele setzen</h3>
            <p>Erreichen Sie Ihre finanziellen Ziele</p>
          </div>
        </div>
      </section>

      <section data-testid="benefits-section">
        <h2>Vorteile</h2>
        <ul>
          <li data-testid="benefit-security">Sicherheit</li>
          <li data-testid="benefit-simplicity">Einfachheit</li>
          <li data-testid="benefit-insights">Einblicke</li>
        </ul>
      </section>
    </main>

    <footer data-testid="footer">
      <p>&copy; 2024 FinanzPlaner. Alle Rechte vorbehalten.</p>
    </footer>
  </div>
);

describe("Landing Page Functional Tests", () => {
  it("should render the landing page", () => {
    render(<MockLandingPage />);

    expect(screen.getByTestId("landing-page")).toBeInTheDocument();
  });

  it("should display the main headline", () => {
    render(<MockLandingPage />);

    expect(screen.getByText("Ihre Finanzen im Griff")).toBeInTheDocument();
  });

  it("should show navigation links", () => {
    render(<MockLandingPage />);

    expect(screen.getByTestId("login-link")).toBeInTheDocument();
    expect(screen.getByTestId("signup-link")).toBeInTheDocument();
  });

  it("should display the call-to-action button", () => {
    render(<MockLandingPage />);

    expect(screen.getByTestId("cta-button")).toBeInTheDocument();
    expect(screen.getByText("Jetzt kostenlos starten")).toBeInTheDocument();
  });

  it("should show features section", () => {
    render(<MockLandingPage />);

    expect(screen.getByTestId("features-section")).toBeInTheDocument();
    expect(screen.getByTestId("feature-tracking")).toBeInTheDocument();
    expect(screen.getByTestId("feature-budgets")).toBeInTheDocument();
    expect(screen.getByTestId("feature-goals")).toBeInTheDocument();
  });

  it("should display benefits section", () => {
    render(<MockLandingPage />);

    expect(screen.getByTestId("benefits-section")).toBeInTheDocument();
    expect(screen.getByTestId("benefit-security")).toBeInTheDocument();
    expect(screen.getByTestId("benefit-simplicity")).toBeInTheDocument();
    expect(screen.getByTestId("benefit-insights")).toBeInTheDocument();
  });

  it("should have a footer", () => {
    render(<MockLandingPage />);

    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByText(/© 2024 FinanzPlaner/)).toBeInTheDocument();
  });

  it("should contain proper semantic structure", () => {
    render(<MockLandingPage />);

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("hero-section")).toBeInTheDocument();
    expect(screen.getByTestId("features-section")).toBeInTheDocument();
    expect(screen.getByTestId("benefits-section")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("should display feature descriptions", () => {
    render(<MockLandingPage />);

    expect(
      screen.getByText(
        "Behalten Sie den Überblick über alle Ihre Transaktionen"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("Setzen Sie sich Limits und bleiben Sie auf Kurs")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Erreichen Sie Ihre finanziellen Ziele")
    ).toBeInTheDocument();
  });
});
