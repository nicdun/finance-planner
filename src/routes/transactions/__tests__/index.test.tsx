import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock all the database functions
vi.mock("@/features/transactions/db", () => ({
  getTransactions: vi.fn(),
  updateTransactionCategory: vi.fn(),
  bulkUpdateTransactionCategories: vi.fn(),
}));

vi.mock("@/features/accounts/db", () => ({
  getAccounts: vi.fn(),
  createAccount: vi.fn(),
}));

// Mock categorization
vi.mock("@/lib/categorization", () => ({
  categorizeTransactions: vi.fn(),
}));

// Mock AuthContext
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

// Mock ProtectedRoute - just render children
vi.mock("@/components/auth/ProtectedRoute", () => ({
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock tanstack router
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => () => ({
    component: () => null,
  }),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

// Mock the UI components that may cause issues in tests
vi.mock("@/components/ui/card", () => ({
  Card: ({ children, className }: any) => (
    <div className={className} data-testid="card">
      {children}
    </div>
  ),
  CardContent: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
  CardHeader: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
  CardTitle: ({ children, className }: any) => (
    <h3 className={className}>{children}</h3>
  ),
  CardDescription: ({ children, className }: any) => (
    <p className={className}>{children}</p>
  ),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, className, variant, size, ...props }: any) => (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/input", () => ({
  Input: (props: any) => <input {...props} />,
}));

vi.mock("@/components/ui/select", () => ({
  Select: ({ children, onValueChange }: any) => (
    <div data-testid="select">{children}</div>
  ),
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => (
    <option value={value}>{children}</option>
  ),
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
}));

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
  DropdownMenuLabel: ({ children }: any) => <div>{children}</div>,
  DropdownMenuSeparator: () => <hr />,
  DropdownMenuTrigger: ({ children }: any) => <div>{children}</div>,
}));

// Mock framer motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    header: ({ children, ...props }: any) => (
      <header {...props}>{children}</header>
    ),
    tr: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock the actual component dependencies
vi.mock("@/features/banking/BankConnection", () => ({
  BankConnection: ({
    onAccountAdded,
  }: {
    onAccountAdded: (account: any) => void;
  }) => (
    <button
      data-testid="bank-connection"
      onClick={() =>
        onAccountAdded({
          id: "new-account",
          name: "Test Account",
          type: "checking",
          iban: "DE89370400440532013000",
          balance: 1000,
          currency: "EUR",
        })
      }
    >
      Bank Connection
    </button>
  ),
}));

vi.mock("@/features/transactions/TransactionFilters", () => ({
  TransactionFilters: ({
    searchTerm,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    selectedAccount,
    onAccountChange,
    categories,
    accounts,
    onClearFilters,
  }: any) => (
    <div data-testid="transaction-filters">
      <input
        data-testid="search-input"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search..."
      />
      <select
        data-testid="category-filter"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((cat: string) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <select
        data-testid="account-filter"
        value={selectedAccount}
        onChange={(e) => onAccountChange(e.target.value)}
      >
        <option value="">All Accounts</option>
        {accounts.map((acc: any) => (
          <option key={acc.id} value={acc.id}>
            {acc.name}
          </option>
        ))}
      </select>
      <button data-testid="clear-filters" onClick={onClearFilters}>
        Clear Filters
      </button>
    </div>
  ),
}));

vi.mock("@/features/transactions/TransactionTable", () => ({
  TransactionTable: ({
    transactions,
    onCategoryChange,
    onBulkCategoryChange,
    onSort,
    sortField,
    sortDirection,
  }: any) => (
    <div data-testid="transaction-table">
      <table>
        <thead>
          <tr>
            <th>
              <button onClick={() => onSort("date")} data-testid="sort-date">
                Date{" "}
                {sortField === "date" && (sortDirection === "asc" ? "↑" : "↓")}
              </button>
            </th>
            <th>
              <button
                onClick={() => onSort("description")}
                data-testid="sort-description"
              >
                Description{" "}
                {sortField === "description" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </button>
            </th>
            <th>
              <button
                onClick={() => onSort("amount")}
                data-testid="sort-amount"
              >
                Amount{" "}
                {sortField === "amount" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </button>
            </th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction: any) => (
            <tr
              key={transaction.id}
              data-testid={`transaction-${transaction.id}`}
            >
              <td>{new Date(transaction.date).toLocaleDateString("de-DE")}</td>
              <td>{transaction.description}</td>
              <td>
                <span
                  className={
                    transaction.amount > 0 ? "text-green-600" : "text-red-600"
                  }
                >
                  {transaction.amount > 0 ? "+" : ""}
                  {transaction.amount.toLocaleString("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </span>
              </td>
              <td>
                <span data-testid="category-badge">{transaction.category}</span>
                <button
                  data-testid={`change-category-${transaction.id}`}
                  onClick={() =>
                    onCategoryChange(transaction.id, "New Category")
                  }
                >
                  Change
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        data-testid="bulk-change"
        onClick={() => onBulkCategoryChange(["1", "2"], "Bulk Category")}
      >
        Bulk Change
      </button>
    </div>
  ),
}));

vi.mock("@/features/transactions/BulkCategorizationPanel", () => ({
  BulkCategorizationPanel: ({
    onClose,
    onBulkCategorize,
    transactions,
  }: any) => (
    <div data-testid="bulk-categorization-panel">
      <h3>Bulk Categorization</h3>
      <p>{transactions.length} transactions to categorize</p>
      <button data-testid="close-panel" onClick={onClose}>
        Close
      </button>
      <button
        data-testid="apply-categorization"
        onClick={() => onBulkCategorize([])}
      >
        Apply
      </button>
    </div>
  ),
}));

vi.mock("@/features/transactions/CategoryEditor", () => ({
  CategoryEditor: () => (
    <div data-testid="category-editor">Category Editor</div>
  ),
}));

// Import the database functions and other dependencies
import { useAuth } from "@/contexts/AuthContext";
import { createAccount, getAccounts } from "@/features/accounts/db";
import {
  bulkUpdateTransactionCategories,
  getTransactions,
  updateTransactionCategory,
} from "@/features/transactions/db";
import { categorizeTransactions } from "@/lib/categorization";
import { Account, Transaction } from "@/lib/types";

// Import the actual TransactionsPage component
import { TransactionsPage } from "../index";

// Mock data for testing
const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2024-01-15",
    description: "Salary Payment",
    amount: 3500,
    category: "Einkommen",
    type: "income",
    accountId: "acc1",
  },
  {
    id: "2",
    date: "2024-01-14",
    description: "Supermarket Purchase",
    amount: -85.5,
    category: "Lebensmittel",
    type: "expense",
    accountId: "acc1",
  },
  {
    id: "3",
    date: "2024-01-13",
    description: "Gas Station",
    amount: -65,
    category: "Transport",
    type: "expense",
    accountId: "acc1",
  },
];

const mockAccounts: Account[] = [
  {
    id: "acc1",
    name: "Hauptkonto",
    type: "checking",
    iban: "DE89370400440532013000",
    balance: 2500,
    currency: "EUR",
  },
];

const mockUser = {
  id: "user1",
  email: "test@example.com",
};

describe("Transactions Page", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup default mock implementations
    (getTransactions as any).mockResolvedValue(mockTransactions);
    (getAccounts as any).mockResolvedValue(mockAccounts);
    (updateTransactionCategory as any).mockResolvedValue(mockTransactions[0]);
    (bulkUpdateTransactionCategories as any).mockResolvedValue(
      mockTransactions
    );
    (createAccount as any).mockImplementation((account) =>
      Promise.resolve({ ...account, id: "new-account-id" })
    );
    (categorizeTransactions as any).mockImplementation((transactions) =>
      transactions.map((t: Transaction) => ({
        ...t,
        category: "Auto-categorized",
      }))
    );
    (useAuth as any).mockReturnValue({
      user: mockUser,
      signOut: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial Loading", () => {
    it("should load transactions and accounts on mount", async () => {
      render(<TransactionsPage />);

      await waitFor(() => {
        expect(screen.getByText("Transaktionen 💰")).toBeInTheDocument();
        expect(screen.getByText("Supermarket Purchase")).toBeInTheDocument();
        expect(getTransactions).toHaveBeenCalled();
        expect(getAccounts).toHaveBeenCalled();
      });
    });

    it("should show loading state initially", () => {
      render(<TransactionsPage />);
      expect(screen.getByText("Lade Transaktionen...")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("should display error message when loading fails", async () => {
      const errorMessage = "Failed to fetch transactions";
      (getTransactions as any).mockRejectedValue(new Error(errorMessage));

      render(<TransactionsPage />);

      await waitFor(() => {
        expect(screen.getByText("Fehler beim Laden")).toBeInTheDocument();
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it("should retry loading when retry button is clicked", async () => {
      (getTransactions as any).mockRejectedValueOnce(
        new Error("Network error")
      );
      (getTransactions as any).mockResolvedValueOnce(mockTransactions);

      render(<TransactionsPage />);

      await waitFor(() => {
        expect(screen.getByText("Erneut versuchen")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Erneut versuchen"));

      await waitFor(() => {
        expect(getTransactions).toHaveBeenCalledTimes(2);
        expect(screen.getByText("Transaktionen 💰")).toBeInTheDocument();
      });
    });
  });

  describe("Summary Cards", () => {
    it("should display correct summary statistics", async () => {
      render(<TransactionsPage />);

      await waitFor(() => {
        expect(screen.getByText("Einnahmen")).toBeInTheDocument();
        expect(screen.getByText("Ausgaben")).toBeInTheDocument();
        expect(screen.getByText("Netto")).toBeInTheDocument();
      });

      // Check for income display in summary cards (using getAllByText to handle duplicates)
      const incomeElements = screen.getAllByText("+3.500,00 €");
      expect(incomeElements.length).toBeGreaterThan(0);
      // Check for expenses display
      expect(screen.getByText("-150,50 €")).toBeInTheDocument();
      // Check for net amount display
      expect(screen.getByText("+3.349,50 €")).toBeInTheDocument();
    });
  });

  describe("Search and Filtering", () => {
    it("should render search filters", async () => {
      render(<TransactionsPage />);

      await waitFor(() => {
        expect(screen.getByTestId("transaction-filters")).toBeInTheDocument();
        expect(screen.getByTestId("search-input")).toBeInTheDocument();
      });
    });

    it("should handle search input changes", async () => {
      render(<TransactionsPage />);

      await waitFor(() => {
        const searchInput = screen.getByTestId("search-input");
        fireEvent.change(searchInput, { target: { value: "Salary" } });
        expect(searchInput).toHaveValue("Salary");
      });
    });
  });

  describe("Category Management", () => {
    it("should update transaction category", async () => {
      render(<TransactionsPage />);

      await waitFor(() => {
        expect(screen.getByTestId("transaction-table")).toBeInTheDocument();
      });

      const changeCategoryButton = screen.getByTestId("change-category-2");
      fireEvent.click(changeCategoryButton);

      await waitFor(() => {
        expect(updateTransactionCategory).toHaveBeenCalledWith(
          "2",
          "New Category"
        );
      });
    });

    it("should handle bulk category update", async () => {
      render(<TransactionsPage />);

      await waitFor(() => {
        expect(screen.getByTestId("transaction-table")).toBeInTheDocument();
      });

      const bulkButton = screen.getByTestId("bulk-change");
      fireEvent.click(bulkButton);

      await waitFor(() => {
        expect(bulkUpdateTransactionCategories).toHaveBeenCalledWith(
          ["1", "2"],
          "Bulk Category"
        );
      });
    });

    it("should show error when category update fails", async () => {
      (updateTransactionCategory as any).mockRejectedValue(
        new Error("Update failed")
      );

      render(<TransactionsPage />);

      await waitFor(() => {
        expect(screen.getByTestId("transaction-table")).toBeInTheDocument();
      });

      const changeCategoryButton = screen.getByTestId("change-category-2");
      fireEvent.click(changeCategoryButton);

      await waitFor(() => {
        expect(screen.getByText("Update failed")).toBeInTheDocument();
      });
    });
  });

  describe("Bulk Categorization", () => {
    it("should show bulk categorization panel", async () => {
      render(<TransactionsPage />);

      await waitFor(() => {
        expect(screen.getByText("KI Kategorisierung")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("KI Kategorisierung"));

      await waitFor(() => {
        expect(
          screen.getByTestId("bulk-categorization-panel")
        ).toBeInTheDocument();
      });
    });

    it("should close bulk categorization panel", async () => {
      render(<TransactionsPage />);

      await waitFor(() => {
        fireEvent.click(screen.getByText("KI Kategorisierung"));
      });

      await waitFor(() => {
        expect(
          screen.getByTestId("bulk-categorization-panel")
        ).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("close-panel"));

      await waitFor(() => {
        expect(
          screen.queryByTestId("bulk-categorization-panel")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Account Management", () => {
    it("should add new account when bank connection creates one", async () => {
      render(<TransactionsPage />);

      await waitFor(() => {
        expect(screen.getByTestId("bank-connection")).toBeInTheDocument();
      });

      const bankConnectionButton = screen.getByTestId("bank-connection");
      fireEvent.click(bankConnectionButton);

      await waitFor(() => {
        expect(createAccount).toHaveBeenCalledWith({
          id: "new-account",
          name: "Test Account",
          type: "checking",
          iban: "DE89370400440532013000",
          balance: 1000,
          currency: "EUR",
        });
      });
    });

    it("should handle account creation error", async () => {
      (createAccount as any).mockRejectedValue(new Error("Creation failed"));

      render(<TransactionsPage />);

      await waitFor(() => {
        fireEvent.click(screen.getByTestId("bank-connection"));
      });

      await waitFor(() => {
        expect(screen.getByText("Creation failed")).toBeInTheDocument();
      });
    });
  });

  describe("User Authentication", () => {
    it("should display user email", async () => {
      render(<TransactionsPage />);

      await waitFor(() => {
        expect(screen.getByText("test@example.com")).toBeInTheDocument();
      });
    });

    it("should call signOut when logout is clicked", async () => {
      const mockSignOut = vi.fn();
      (useAuth as any).mockReturnValue({
        user: mockUser,
        signOut: mockSignOut,
      });

      render(<TransactionsPage />);

      await waitFor(() => {
        fireEvent.click(screen.getByText("Abmelden"));
      });

      expect(mockSignOut).toHaveBeenCalled();
    });
  });
});
