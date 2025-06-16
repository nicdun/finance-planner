import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  Search,
  ArrowUpCircle,
  ArrowDownCircle,
  ShoppingCart,
  Car,
  HomeIcon,
  Utensils,
  Zap,
  Gamepad2,
} from "lucide-react";
import { Transaction, Account } from "@/lib/types";

interface TransactionListProps {
  transactions: Transaction[];
  accounts: Account[];
  onSort?: (field: string) => void;
  sortField?: string;
  sortDirection?: "asc" | "desc";
  showHeader?: boolean;
}

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

export function TransactionList({
  transactions,
  accounts,
  onSort,
  sortField = "date",
  sortDirection = "desc",
  showHeader = true,
}: TransactionListProps) {
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

  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Transaktionen ({transactions.length})</span>
            {onSort && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Sortieren nach:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSort("date")}
                  className={`flex items-center gap-1 ${
                    sortField === "date" ? "text-blue-600" : ""
                  }`}
                >
                  Datum
                  {sortField === "date" && <ArrowUpDown className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSort("amount")}
                  className={`flex items-center gap-1 ${
                    sortField === "amount" ? "text-blue-600" : ""
                  }`}
                >
                  Betrag
                  {sortField === "amount" && (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Keine Transaktionen gefunden
            </h3>
            <p className="text-gray-500">
              Versuchen Sie andere Suchbegriffe oder Filter.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                    {categoryIcons[transaction.category] || (
                      <ArrowUpDown className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {transaction.description}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{getAccountName(transaction.accountId)}</span>
                      <span>•</span>
                      <span>{formatDate(transaction.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className={
                      categoryColors[transaction.category] ||
                      "bg-gray-100 text-gray-800"
                    }
                  >
                    {transaction.category}
                  </Badge>
                  <div className="text-right">
                    {formatAmount(transaction.amount)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
