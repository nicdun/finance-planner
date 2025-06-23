import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  ArrowUpCircle,
  ArrowDownCircle,
  ShoppingCart,
  Car,
  HomeIcon,
  Utensils,
  Zap,
  Gamepad2,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
} from "lucide-react";
import { Transaction, Account } from "@/lib/types";
import { CategoryEditor } from "./CategoryEditor";

interface TransactionTableProps {
  transactions: Transaction[];
  accounts: Account[];
  onSort?: (field: string) => void;
  sortField?: string;
  sortDirection?: "asc" | "desc";
  onCategoryChange?: (transactionId: string, newCategory: string) => void;
  onBulkCategoryChange?: (
    transactionIds: string[],
    newCategory: string
  ) => void;
  onEditTransaction?: (transaction: Transaction) => void;
  onDeleteTransaction?: (transactionId: string) => void;
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
  Gesundheit: "bg-red-100 text-red-800",
  Kleidung: "bg-indigo-100 text-indigo-800",
  Bildung: "bg-cyan-100 text-cyan-800",
  Versicherung: "bg-gray-100 text-gray-800",
  Steuern: "bg-red-100 text-red-800",
  "Sparen & Investitionen": "bg-green-100 text-green-800",
  Abonnements: "bg-purple-100 text-purple-800",
  Sonstiges: "bg-gray-100 text-gray-800",
};

export function TransactionTable({
  transactions,
  accounts,
  onSort,
  sortField = "date",
  sortDirection = "desc",
  onCategoryChange,
  onBulkCategoryChange,
  onEditTransaction,
  onDeleteTransaction,
}: TransactionTableProps) {
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

  const handleSort = (field: string) => {
    if (onSort) {
      onSort(field);
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField === field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return null;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">{/* Icon column */}</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("description")}
                className="h-auto p-0 font-semibold"
              >
                Beschreibung
                {getSortIcon("description")}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("category")}
                className="h-auto p-0 font-semibold"
              >
                Kategorie
                {getSortIcon("category")}
              </Button>
            </TableHead>
            <TableHead>Konto</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("date")}
                className="h-auto p-0 font-semibold"
              >
                Datum
                {getSortIcon("date")}
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort("amount")}
                className="h-auto p-0 font-semibold"
              >
                Betrag
                {getSortIcon("amount")}
              </Button>
            </TableHead>
            <TableHead className="w-[50px]">{/* Actions column */}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12">
                <div className="flex flex-col items-center gap-2">
                  <div className="text-gray-400 text-lg">📊</div>
                  <h3 className="text-lg font-semibold text-gray-600">
                    Keine Transaktionen gefunden
                  </h3>
                  <p className="text-gray-500">
                    Versuchen Sie andere Suchbegriffe oder Filter.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction, index) => (
              <motion.tr
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                className="group hover:bg-gray-50 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                    {categoryIcons[transaction.category] || (
                      <ArrowUpDown className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">
                      {transaction.description}
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.type === "income" ? "Einnahme" : "Ausgabe"}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {onCategoryChange ? (
                    <CategoryEditor
                      transaction={transaction}
                      allTransactions={transactions}
                      onCategoryChange={onCategoryChange}
                      onBulkCategoryChange={onBulkCategoryChange}
                    />
                  ) : (
                    <Badge
                      variant="secondary"
                      className={
                        categoryColors[transaction.category] ||
                        "bg-gray-100 text-gray-800"
                      }
                    >
                      {transaction.category}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {getAccountName(transaction.accountId)}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatDate(transaction.date)}
                </TableCell>
                <TableCell className="text-right">
                  {formatAmount(transaction.amount)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <span className="sr-only">Aktionen öffnen</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() =>
                          navigator.clipboard.writeText(transaction.id)
                        }
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        ID kopieren
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onEditTransaction?.(transaction)}
                        disabled={!onEditTransaction}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Bearbeiten
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onDeleteTransaction?.(transaction.id)}
                        disabled={!onDeleteTransaction}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Löschen
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
