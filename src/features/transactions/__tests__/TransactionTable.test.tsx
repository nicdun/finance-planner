import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { TransactionTable } from "../TransactionTable";
import { Transaction, Account } from "@/lib/types";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    tr: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
  },
}));

// Mock CategoryEditor to avoid complex component interactions
vi.mock("../CategoryEditor", () => ({
  CategoryEditor: ({ transaction, onCategoryChange }: any) => (
    <div data-testid={`category-editor-${transaction.id}`}>
      <span data-testid="category-badge">{transaction.category}</span>
      <button
        onClick={() => onCategoryChange(transaction.id, "Neue Kategorie")}
        data-testid={`edit-category-${transaction.id}`}
      >
        Kategorie bearbeiten
      </button>
    </div>
  ),
}));

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2024-01-15",
    description: "Supermarket Purchase",
    amount: -50,
    category: "Lebensmittel",
    type: "expense",
    accountId: "acc1",
  },
  {
    id: "2",
    date: "2024-01-01",
    description: "Salary",
    amount: 2500,
    category: "Einkommen",
    type: "income",
    accountId: "acc1",
  },
  {
    id: "3",
    date: "2024-01-01",
    description: "Rent Payment",
    amount: -1200,
    category: "Wohnen",
    type: "expense",
    accountId: "acc2",
  },
];

const mockAccounts: Account[] = [
  {
    id: "acc1",
    name: "Checking Account",
    type: "checking",
    balance: 2500,
    currency: "EUR",
    iban: "DE89370400440532013000",
  },
  {
    id: "acc2",
    name: "Savings Account",
    type: "savings",
    balance: 5000,
    currency: "EUR",
    iban: "DE89370400440532013001",
  },
];

describe("TransactionTable Component", () => {
  const mockProps = {
    transactions: mockTransactions,
    accounts: mockAccounts,
    onSort: vi.fn(),
    sortField: "date" as const,
    sortDirection: "desc" as const,
    onCategoryChange: vi.fn(),
    onBulkCategoryChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render transactions correctly", () => {
    render(<TransactionTable {...mockProps} />);

    // Check that transaction descriptions are displayed
    expect(screen.getByText("Supermarket Purchase")).toBeInTheDocument();
    expect(screen.getByText("Salary")).toBeInTheDocument();
    expect(screen.getByText("Rent Payment")).toBeInTheDocument();
  });

  it("should display transaction details correctly", () => {
    render(<TransactionTable {...mockProps} />);

    // Check transaction types
    expect(screen.getByText("Einnahme")).toBeInTheDocument(); // Salary
    expect(screen.getAllByText("Ausgabe")).toHaveLength(2); // Two expenses

    // Check account names
    expect(screen.getAllByText("Checking Account")).toHaveLength(2);
    expect(screen.getByText("Savings Account")).toBeInTheDocument();
  });

  it("should handle sorting when sort buttons are clicked", () => {
    render(<TransactionTable {...mockProps} />);

    // Test description sorting
    const descriptionButton = screen.getByRole("button", {
      name: /beschreibung/i,
    });
    fireEvent.click(descriptionButton);
    expect(mockProps.onSort).toHaveBeenCalledWith("description");

    // Test category sorting - find the table header button specifically
    const categoryButtons = screen.getAllByRole("button", {
      name: /kategorie/i,
    });
    const categoryHeaderButton = categoryButtons.find(
      (button) =>
        button.textContent === "Kategorie" &&
        !button.getAttribute("data-testid")
    );
    expect(categoryHeaderButton).toBeInTheDocument();
    fireEvent.click(categoryHeaderButton!);
    expect(mockProps.onSort).toHaveBeenCalledWith("category");

    // Test date sorting
    const dateButton = screen.getByRole("button", { name: /datum/i });
    fireEvent.click(dateButton);
    expect(mockProps.onSort).toHaveBeenCalledWith("date");

    // Test amount sorting
    const amountButton = screen.getByRole("button", { name: /betrag/i });
    fireEvent.click(amountButton);
    expect(mockProps.onSort).toHaveBeenCalledWith("amount");
  });

  it("should show sort icon for active sort field", () => {
    render(<TransactionTable {...mockProps} sortField="description" />);

    const descriptionButton = screen.getByRole("button", {
      name: /beschreibung/i,
    });
    // Check that the button contains an icon (ArrowUpDown)
    expect(descriptionButton.querySelector("svg")).toBeInTheDocument();
  });

  it("should handle category changes when CategoryEditor is used", () => {
    render(<TransactionTable {...mockProps} />);

    const editButton = screen.getByTestId("edit-category-1");
    fireEvent.click(editButton);

    expect(mockProps.onCategoryChange).toHaveBeenCalledWith(
      "1",
      "Neue Kategorie"
    );
  });

  it("should display CategoryEditor when onCategoryChange is provided", () => {
    render(<TransactionTable {...mockProps} />);

    // Should show CategoryEditor components
    expect(screen.getByTestId("category-editor-1")).toBeInTheDocument();
    expect(screen.getByTestId("category-editor-2")).toBeInTheDocument();
    expect(screen.getByTestId("category-editor-3")).toBeInTheDocument();
  });

  it("should display category badges when onCategoryChange is not provided", () => {
    const propsWithoutCategoryChange = {
      ...mockProps,
      onCategoryChange: undefined,
    };

    render(<TransactionTable {...propsWithoutCategoryChange} />);

    // Should show category names as badges instead of editors
    expect(screen.getByText("Lebensmittel")).toBeInTheDocument();
    expect(screen.getByText("Einkommen")).toBeInTheDocument();
    expect(screen.getByText("Wohnen")).toBeInTheDocument();
  });

  it("should format amounts correctly", () => {
    render(<TransactionTable {...mockProps} />);

    // Check positive amount (income) - German locale formatting
    expect(screen.getByText("+2.500,00 €")).toBeInTheDocument();

    // Check negative amounts (expenses)
    expect(screen.getByText("-50,00 €")).toBeInTheDocument();
    expect(screen.getByText("-1.200,00 €")).toBeInTheDocument();
  });

  it("should format dates correctly", () => {
    render(<TransactionTable {...mockProps} />);

    // Check German date format (DD.MM.YYYY)
    expect(screen.getByText("15.01.2024")).toBeInTheDocument();
    expect(screen.getAllByText("01.01.2024")).toHaveLength(2);
  });

  it("should show correct account names", () => {
    render(<TransactionTable {...mockProps} />);

    expect(screen.getAllByText("Checking Account")).toHaveLength(2);
    expect(screen.getByText("Savings Account")).toBeInTheDocument();
  });

  it("should handle missing account gracefully", () => {
    const transactionWithMissingAccount: Transaction = {
      id: "4",
      date: "2024-01-10",
      description: "Test Transaction",
      amount: -100,
      category: "Test",
      type: "expense",
      accountId: "non-existent",
    };

    const propsWithMissingAccount = {
      ...mockProps,
      transactions: [transactionWithMissingAccount],
    };

    render(<TransactionTable {...propsWithMissingAccount} />);

    expect(screen.getByText("Unbekanntes Konto")).toBeInTheDocument();
  });

  it("should show empty state when no transactions", () => {
    const emptyProps = {
      ...mockProps,
      transactions: [],
    };

    render(<TransactionTable {...emptyProps} />);

    // Should show empty state message
    expect(
      screen.getByText("Keine Transaktionen gefunden")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Versuchen Sie andere Suchbegriffe oder Filter.")
    ).toBeInTheDocument();
  });

  it("should show actions dropdown menu", async () => {
    const user = userEvent.setup();
    render(<TransactionTable {...mockProps} />);

    // Find the first row and trigger hover to show the actions button
    const firstRow = screen.getByText("Supermarket Purchase").closest("tr");
    expect(firstRow).toBeInTheDocument();

    // The actions button should be present but might be hidden initially
    const actionsButtons = screen.getAllByRole("button", {
      name: /aktionen öffnen/i,
    });
    expect(actionsButtons.length).toBeGreaterThan(0);

    // Click the first actions button
    await user.click(actionsButtons[0]);

    // Check that dropdown menu items appear
    await waitFor(() => {
      expect(screen.getByText("Aktionen")).toBeInTheDocument();
      expect(screen.getByText("ID kopieren")).toBeInTheDocument();
      expect(screen.getByText("Bearbeiten")).toBeInTheDocument();
      expect(screen.getByText("Löschen")).toBeInTheDocument();
    });
  });

  it("should display category icons correctly", () => {
    render(<TransactionTable {...mockProps} />);

    // Check that category icons are rendered (they should be in the first column)
    const iconCells = screen.getAllByRole("cell");
    const iconContainers = iconCells.filter((cell) =>
      cell.querySelector("div.flex.items-center.justify-center")
    );

    // Should have icon containers for each transaction
    expect(iconContainers.length).toBeGreaterThan(0);
  });

  it("should handle copy action in dropdown menu", async () => {
    const user = userEvent.setup();

    // Mock clipboard API
    const mockWriteText = vi.fn();
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: mockWriteText,
      },
      writable: true,
    });

    render(<TransactionTable {...mockProps} />);

    // Open dropdown menu
    const actionsButtons = screen.getAllByRole("button", {
      name: /aktionen öffnen/i,
    });
    await user.click(actionsButtons[0]);

    // Click copy ID
    await waitFor(() => {
      const copyButton = screen.getByText("ID kopieren");
      expect(copyButton).toBeInTheDocument();
    });

    const copyButton = screen.getByText("ID kopieren");
    await user.click(copyButton);

    expect(mockWriteText).toHaveBeenCalledWith("1");
  });

  it("should render table headers correctly", () => {
    render(<TransactionTable {...mockProps} />);

    // Check all table headers are present
    expect(
      screen.getByRole("button", { name: /beschreibung/i })
    ).toBeInTheDocument();
    // Check category header button (find the table header one specifically)
    const categoryButtons = screen.getAllByRole("button", {
      name: /kategorie/i,
    });
    const categoryHeaderButton = categoryButtons.find(
      (button) =>
        button.textContent === "Kategorie" &&
        !button.getAttribute("data-testid")
    );
    expect(categoryHeaderButton).toBeInTheDocument();
    expect(screen.getByText("Konto")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /datum/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /betrag/i })).toBeInTheDocument();
  });
});
