import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowUpDown,
  Car,
  Gamepad2,
  HomeIcon,
  Loader2,
  Plus,
  ShoppingCart,
  Utensils,
  Wand2,
  Zap,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

// Import database functions and types
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardHeader } from "@/routes/dashboard/-components/DashboardHeader";
import { createAccount, getAccounts } from "@/features/accounts/db";
import { BankConnection } from "@/features/banking/BankConnection";
import { BulkCategorizationPanel } from "@/features/transactions/BulkCategorizationPanel";
import {
  bulkUpdateTransactionCategories,
  deleteTransaction,
  getTransactions,
  updateTransactionCategory,
} from "@/features/transactions/db";
import { TransactionFilters } from "@/features/transactions/TransactionFilters";
import { TransactionTable } from "@/features/transactions/TransactionTable";
import { CreateTransactionDialog } from "@/features/transactions/CreateTransactionDialog";
import { categorizeTransactions } from "@/lib/categorization";
import { Account, Transaction } from "@/lib/types";

// Loading and error components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
    <span className="ml-2 text-gray-600">Lade Transaktionen...</span>
  </div>
);

const ErrorMessage = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <div className="flex flex-col items-center justify-center py-12">
    <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      Fehler beim Laden
    </h3>
    <p className="text-gray-600 mb-4">{message}</p>
    <Button onClick={onRetry} variant="outline">
      Erneut versuchen
    </Button>
  </div>
);

type SortField = "date" | "amount" | "description" | "category";
type SortDirection = "asc" | "desc";

const categoryIcons: Record<string, React.ReactNode> = {
  Einkommen: <ArrowUpCircle className="h-4 w-4 text-green-600" />,
  Wohnen: <HomeIcon className="h-4 w-4 text-blue-600" />,
  Lebensmittel: <Utensils className="h-4 w-4 text-orange-600" />,
  Transport: <Car className="h-4 w-4 text-purple-600" />,
  Nebenkosten: <Zap className="h-4 w-4 text-yellow-600" />,
  Unterhaltung: <Gamepad2 className="h-4 w-4 text-pink-600" />,
  Transfer: <ArrowUpDown className="h-4 w-4 text-gray-600" />,
  Gastronomie: <Utensils className="h-4 w-4 text-red-600" />,
  Shopping: <ShoppingCart className="h-4 w-4 text-indigo-600" />,
};

const categoryColors: Record<string, string> = {
  Einkommen: "bg-green-100 text-green-800",
  Wohnen: "bg-blue-100 text-blue-800",
  Lebensmittel: "bg-orange-100 text-orange-800",
  Transport: "bg-purple-100 text-purple-800",
  Nebenkosten: "bg-yellow-100 text-yellow-800",
  Unterhaltung: "bg-pink-100 text-pink-800",
  Transfer: "bg-gray-100 text-gray-800",
  Gastronomie: "bg-red-100 text-red-800",
  Shopping: "bg-indigo-100 text-indigo-800",
};

export const Route = createFileRoute("/transactions/")({
  component: TransactionsPage,
});

export function TransactionsPage() {
  // State management
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [showBulkCategorization, setShowBulkCategorization] = useState(false);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateTransaction, setShowCreateTransaction] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  // Load data from Supabase
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [transactionsData, accountsData] = await Promise.all([
        getTransactions(),
        getAccounts(),
      ]);

      setTransactions(transactionsData);
      setAccounts(accountsData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Ein unbekannter Fehler ist aufgetreten"
      );
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const handleAccountAdded = async (newAccount: Account) => {
    try {
      const createdAccount = await createAccount(newAccount);
      setAccounts((prev) => [...prev, createdAccount]);
    } catch (err) {
      console.error("Error creating account:", err);
      setError(
        err instanceof Error ? err.message : "Fehler beim Erstellen des Kontos"
      );
    }
  };

  const handleCategoryChange = async (
    transactionId: string,
    newCategory: string
  ) => {
    try {
      const updatedTransaction = await updateTransactionCategory(
        transactionId,
        newCategory
      );

      // Update local state
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === transactionId ? updatedTransaction : transaction
        )
      );
    } catch (err) {
      console.error("Error updating transaction category:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Fehler beim Aktualisieren der Kategorie"
      );
    }
  };

  const handleBulkCategoryChange = async (
    transactionIds: string[],
    newCategory: string
  ) => {
    try {
      const updatedTransactions = await bulkUpdateTransactionCategories(
        transactionIds,
        newCategory
      );

      // Update local state
      setTransactions((prev) => {
        const updatedMap = new Map(updatedTransactions.map((t) => [t.id, t]));
        return prev.map((transaction) =>
          updatedMap.has(transaction.id)
            ? updatedMap.get(transaction.id)!
            : transaction
        );
      });
    } catch (err) {
      console.error("Error bulk updating transaction categories:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Fehler beim Aktualisieren der Kategorien"
      );
    }
  };

  const handleBulkCategorize = (updatedTransactions: Transaction[]) => {
    setTransactions(updatedTransactions);
    setShowBulkCategorization(false);
  };

  const handleAutoCategorizeAll = () => {
    const categorizedTransactions = categorizeTransactions(transactions);
    setTransactions(categorizedTransactions);
  };

  const handleTransactionCreated = async () => {
    try {
      // Reload transactions after a new one is created
      const transactionsData = await getTransactions();
      setTransactions(transactionsData);
    } catch (error) {
      console.error("Error reloading transactions:", error);
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowCreateTransaction(true);
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (
      !confirm("Sind Sie sicher, dass Sie diese Transaktion löschen möchten?")
    ) {
      return;
    }

    try {
      await deleteTransaction(transactionId);
      // Reload transactions after deletion
      const transactionsData = await getTransactions();
      setTransactions(transactionsData);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Fehler beim Löschen der Transaktion"
      );
    }
  };

  const handleDialogClose = (open: boolean) => {
    setShowCreateTransaction(open);
    if (!open) {
      // Reset editing transaction when dialog closes
      setEditingTransaction(null);
    }
  };

  // Get unique categories from transactions
  const categories = useMemo(() => {
    const cats = [...new Set(transactions.map((t) => t.category))];
    return cats.sort();
  }, [transactions]);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter((transaction) => {
      const matchesSearch =
        transaction.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        !selectedCategory || transaction.category === selectedCategory;
      const matchesAccount =
        !selectedAccount || transaction.accountId === selectedAccount;

      return matchesSearch && matchesCategory && matchesAccount;
    });

    // Sort transactions
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === "date") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortField === "amount") {
        aValue = Math.abs(aValue);
        bValue = Math.abs(bValue);
      } else {
        aValue = aValue.toString().toLowerCase();
        bValue = bValue.toString().toLowerCase();
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [
    transactions,
    searchTerm,
    selectedCategory,
    selectedAccount,
    sortField,
    sortDirection,
  ]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const formatAmount = (amount: number) => {
    const isPositive = amount > 0;
    return (
      <span
        className={`font-semibold ${
          isPositive ? "text-green-600" : "text-red-600"
        }`}
      >
        {isPositive ? "+" : ""}
        {amount.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getAccountName = (accountId: string) => {
    const account = accounts.find((acc) => acc.id === accountId);
    return account?.name || "Unbekanntes Konto";
  };

  // Calculate summary statistics
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = Math.abs(
    filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const netAmount = totalIncome - totalExpenses;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader onAccountAdded={handleAccountAdded} />

        {/* Main Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Transaktionen 💰
                    </h2>
                    <p className="text-gray-600">
                      Alle Ihre Einnahmen und Ausgaben im Überblick
                    </p>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <Button
                      onClick={() => setShowCreateTransaction(true)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={accounts.length === 0}
                      title={
                        accounts.length === 0
                          ? "Fügen Sie zuerst ein Konto hinzu"
                          : "Neue Transaktion erstellen"
                      }
                    >
                      <Plus className="h-4 w-4" />
                      Transaktion hinzufügen
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Loading State */}
            {loading && <LoadingSpinner />}

            {/* Error State */}
            {error && !loading && (
              <Card>
                <CardContent>
                  <ErrorMessage message={error} onRetry={loadData} />
                </CardContent>
              </Card>
            )}

            {/* Main Content - only show when not loading and no error */}
            {!loading && !error && (
              <>
                {/* Summary Cards */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <ArrowUpCircle className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Einnahmen</p>
                          <p className="text-lg font-semibold text-green-600">
                            +
                            {totalIncome.toLocaleString("de-DE", {
                              style: "currency",
                              currency: "EUR",
                            })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <ArrowDownCircle className="h-8 w-8 text-red-600" />
                        <div>
                          <p className="text-sm text-gray-600">Ausgaben</p>
                          <p className="text-lg font-semibold text-red-600">
                            -
                            {totalExpenses.toLocaleString("de-DE", {
                              style: "currency",
                              currency: "EUR",
                            })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <ArrowUpDown className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Netto</p>
                          <p
                            className={`text-lg font-semibold ${
                              netAmount >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {netAmount >= 0 ? "+" : ""}
                            {netAmount.toLocaleString("de-DE", {
                              style: "currency",
                              currency: "EUR",
                            })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Filters and Search */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                          <TransactionFilters
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            selectedCategory={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                            selectedAccount={selectedAccount}
                            onAccountChange={setSelectedAccount}
                            categories={categories}
                            accounts={accounts}
                            onClearFilters={() => {
                              setSelectedCategory("");
                              setSelectedAccount("");
                            }}
                          />
                        </div>

                        {/* Categorization Button */}
                        <Button
                          variant="outline"
                          onClick={() => setShowBulkCategorization(true)}
                          className="flex items-center gap-2"
                        >
                          <Wand2 className="h-4 w-4" />
                          KI Kategorisierung
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Bulk Categorization Panel */}
                <AnimatePresence>
                  {showBulkCategorization && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <BulkCategorizationPanel
                        transactions={filteredTransactions}
                        onBulkCategorize={handleBulkCategorize}
                        onClose={() => setShowBulkCategorization(false)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Transaction Table */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>
                          Transaktionen ({filteredTransactions.length})
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <TransactionTable
                        transactions={filteredTransactions}
                        accounts={accounts}
                        onSort={handleSort}
                        sortField={sortField}
                        sortDirection={sortDirection}
                        onCategoryChange={handleCategoryChange}
                        onBulkCategoryChange={handleBulkCategoryChange}
                        onEditTransaction={handleEditTransaction}
                        onDeleteTransaction={handleDeleteTransaction}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            )}
          </div>
        </main>

        {/* Create/Edit Transaction Dialog */}
        <CreateTransactionDialog
          open={showCreateTransaction}
          onOpenChange={handleDialogClose}
          onTransactionCreated={handleTransactionCreated}
          accounts={accounts}
          editingTransaction={editingTransaction}
        />
      </div>
    </ProtectedRoute>
  );
}
