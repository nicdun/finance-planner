import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowUpDown,
  Search,
  Filter,
  Calendar,
  Download,
  Home,
  User,
  Bell,
  Settings,
  ArrowUpCircle,
  ArrowDownCircle,
  ShoppingCart,
  Car,
  HomeIcon,
  Utensils,
  Zap,
  Gamepad2,
  Plus,
  X,
  Wand2,
} from "lucide-react";

// Import mock data and types
import { mockTransactions, mockAccounts } from "@/lib/mock-data";
import { Transaction, Account } from "@/lib/types";
import { BankConnection } from "@/features/banking/BankConnection";
import { CategoryEditor } from "@/features/transactions/CategoryEditor";
import { BulkCategorizationPanel } from "@/features/transactions/BulkCategorizationPanel";
import { TransactionTable } from "@/features/transactions/TransactionTable";
import { TransactionFilters } from "@/features/transactions/TransactionFilters";
import { categorizeTransactions } from "@/lib/categorization";

// Enhanced transaction data with more variety for categorization testing
const enhancedTransactions: Transaction[] = [
  ...mockTransactions,
  // Streaming & Abonnements
  {
    id: "6",
    accountId: "1",
    amount: -13.99,
    description: "Netflix Streaming",
    category: "Sonstiges", // Wird automatisch als "Abonnements" kategorisiert
    date: "2024-01-06",
    type: "expense",
  },
  {
    id: "7",
    accountId: "1",
    amount: -9.99,
    description: "Spotify Premium",
    category: "Sonstiges", // Wird automatisch als "Abonnements" kategorisiert
    date: "2024-01-07",
    type: "expense",
  },
  {
    id: "8",
    accountId: "1",
    amount: -7.99,
    description: "Disney+ Abo",
    category: "Sonstiges", // Wird automatisch als "Abonnements" kategorisiert
    date: "2024-01-08",
    type: "expense",
  },
  // Supermärkte
  {
    id: "9",
    accountId: "1",
    amount: -89.45,
    description: "REWE Lebensmittel",
    category: "Sonstiges", // Wird automatisch als "Lebensmittel" kategorisiert
    date: "2024-01-09",
    type: "expense",
  },
  {
    id: "10",
    accountId: "1",
    amount: -67.23,
    description: "EDEKA Wocheneinkauf",
    category: "Sonstiges", // Wird automatisch als "Lebensmittel" kategorisiert
    date: "2024-01-10",
    type: "expense",
  },
  {
    id: "11",
    accountId: "1",
    amount: -34.5,
    description: "ALDI Nord",
    category: "Sonstiges", // Wird automatisch als "Lebensmittel" kategorisiert
    date: "2024-01-11",
    type: "expense",
  },
  // Transport
  {
    id: "12",
    accountId: "1",
    amount: -65.8,
    description: "Shell Tankstelle",
    category: "Sonstiges", // Wird automatisch als "Transport" kategorisiert
    date: "2024-01-12",
    type: "expense",
  },
  {
    id: "13",
    accountId: "1",
    amount: -98.5,
    description: "Deutsche Bahn Fahrkarte",
    category: "Sonstiges", // Wird automatisch als "Transport" kategorisiert
    date: "2024-01-13",
    type: "expense",
  },
  // Nebenkosten
  {
    id: "14",
    accountId: "1",
    amount: -78.9,
    description: "E.ON Strom",
    category: "Sonstiges", // Wird automatisch als "Nebenkosten" kategorisiert
    date: "2024-01-14",
    type: "expense",
  },
  {
    id: "15",
    accountId: "1",
    amount: -45.6,
    description: "Telekom Internet",
    category: "Sonstiges", // Wird automatisch als "Nebenkosten" kategorisiert
    date: "2024-01-15",
    type: "expense",
  },
  // Gastronomie
  {
    id: "16",
    accountId: "1",
    amount: -23.4,
    description: "McDonald's Restaurant",
    category: "Sonstiges", // Wird automatisch als "Gastronomie" kategorisiert
    date: "2024-01-16",
    type: "expense",
  },
  {
    id: "17",
    accountId: "1",
    amount: -8.5,
    description: "Starbucks Coffee",
    category: "Sonstiges", // Wird automatisch als "Gastronomie" kategorisiert
    date: "2024-01-17",
    type: "expense",
  },
  // Wohnen
  {
    id: "18",
    accountId: "1",
    amount: -1350.0,
    description: "Wohnungsmiete Februar",
    category: "Sonstiges", // Wird automatisch als "Wohnen" kategorisiert
    date: "2024-02-01",
    type: "expense",
  },
  // Gesundheit
  {
    id: "19",
    accountId: "1",
    amount: -45.2,
    description: "Apotheke Medikamente",
    category: "Sonstiges", // Wird automatisch als "Gesundheit" kategorisiert
    date: "2024-01-18",
    type: "expense",
  },
  {
    id: "20",
    accountId: "1",
    amount: -85.0,
    description: "Zahnarzt Behandlung",
    category: "Sonstiges", // Wird automatisch als "Gesundheit" kategorisiert
    date: "2024-01-19",
    type: "expense",
  },
];

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
  component: RouteComponent,
});

function RouteComponent() {
  const [accounts, setAccounts] = React.useState<Account[]>(mockAccounts);
  const [transactions, setTransactions] =
    useState<Transaction[]>(enhancedTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const [showBulkCategorization, setShowBulkCategorization] = useState(false);

  const handleAccountAdded = (newAccount: Account) => {
    setAccounts((prev) => [...prev, newAccount]);
  };

  const handleCategoryChange = (transactionId: string, newCategory: string) => {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === transactionId
          ? { ...transaction, category: newCategory }
          : transaction
      )
    );
  };

  const handleBulkCategoryChange = (
    transactionIds: string[],
    newCategory: string
  ) => {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transactionIds.includes(transaction.id)
          ? { ...transaction, category: newCategory }
          : transaction
      )
    );
  };

  const handleBulkCategorize = (updatedTransactions: Transaction[]) => {
    setTransactions(updatedTransactions);
    setShowBulkCategorization(false);
  };

  const handleAutoCategorizeAll = () => {
    const categorizedTransactions = categorizeTransactions(transactions);
    setTransactions(categorizedTransactions);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header
        className="bg-white border-b border-gray-200 px-6 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Home className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">FinanzPlaner</h1>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <nav className="flex items-center gap-6">
              <Link
                to="/dashboard"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <span className="text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-1">
                Transaktionen
              </span>
              <a
                href="#"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Budgets
              </a>
              <a
                href="#"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Ziele
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <BankConnection onAccountAdded={handleAccountAdded} />
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarFallback className="bg-blue-100 text-blue-600">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </motion.header>

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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Transaktionen 💰
              </h2>
              <p className="text-gray-600">
                Alle Ihre Einnahmen und Ausgaben im Überblick
              </p>
            </div>
          </motion.div>

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
                  <span>Transaktionen ({filteredTransactions.length})</span>
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
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
