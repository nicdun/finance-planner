import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Account, Transaction } from "@/lib/types";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PiggyBank,
  CreditCard,
} from "lucide-react";

interface FinancialSummaryProps {
  accounts: Account[];
  transactions: Transaction[];
}

interface SummaryCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  index: number;
}

function SummaryCard({
  title,
  value,
  change,
  changeType,
  icon,
  index,
}: SummaryCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case "positive":
        return <TrendingUp className="h-3 w-3" />;
      case "negative":
        return <TrendingDown className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            {title}
          </CardTitle>
          <div className="text-gray-400">{icon}</div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            {change && (
              <div
                className={`flex items-center gap-1 text-xs ${getChangeColor()}`}
              >
                {getChangeIcon()}
                <span>{change}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function FinancialSummary({
  accounts,
  transactions,
}: FinancialSummaryProps) {
  // Calculate total balance
  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );

  // Calculate liquid assets (checking + savings)
  const liquidAssets = accounts
    .filter(
      (account) => account.type === "checking" || account.type === "savings"
    )
    .reduce((sum, account) => sum + account.balance, 0);

  // Calculate investments
  const investments = accounts
    .filter((account) => account.type === "investment")
    .reduce((sum, account) => sum + account.balance, 0);

  // Calculate debt
  const debt = Math.abs(
    accounts
      .filter((account) => account.type === "credit")
      .reduce((sum, account) => sum + Math.min(0, account.balance), 0)
  );

  // Calculate monthly income and expenses for the latest month with data
  // Find the latest month that has transactions
  const transactionDates = transactions.map((t) => new Date(t.date));
  const latestDate =
    transactionDates.length > 0
      ? new Date(Math.max(...transactionDates.map((d) => d.getTime())))
      : new Date();

  const latestMonth = latestDate.getMonth();
  const latestYear = latestDate.getFullYear();

  const monthlyTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getMonth() === latestMonth &&
      transactionDate.getFullYear() === latestYear
    );
  });

  const monthlyIncome = monthlyTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = Math.abs(
    monthlyTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
  );

  // Calculate previous month's data for comparison
  const previousMonthDate = new Date(latestYear, latestMonth - 1, 1);
  const previousMonth = previousMonthDate.getMonth();
  const previousYear = previousMonthDate.getFullYear();

  const previousMonthTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getMonth() === previousMonth &&
      transactionDate.getFullYear() === previousYear
    );
  });

  const previousMonthIncome = previousMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const previousMonthExpenses = Math.abs(
    previousMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
  );

  // Calculate percentage changes
  const incomeChange =
    previousMonthIncome > 0
      ? (
          ((monthlyIncome - previousMonthIncome) / previousMonthIncome) *
          100
        ).toFixed(1)
      : null;

  const expenseChange =
    previousMonthExpenses > 0
      ? (
          ((monthlyExpenses - previousMonthExpenses) / previousMonthExpenses) *
          100
        ).toFixed(1)
      : null;

  const summaryData = [
    {
      title: "Gesamtvermögen",
      value: new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(totalBalance),
      change: "+2,4% vs. letzter Monat",
      changeType: "positive" as const,
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      title: "Liquide Mittel",
      value: new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(liquidAssets),
      change: "+1,2% vs. letzter Monat",
      changeType: "positive" as const,
      icon: <Wallet className="h-4 w-4" />,
    },
    {
      title: "Investitionen",
      value: new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(investments),
      change: "+5,8% vs. letzter Monat",
      changeType: "positive" as const,
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      title: "Schulden",
      value: new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(debt),
      change: "-3,2% vs. letzter Monat",
      changeType: "positive" as const,
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      title: "Monatseinkommen",
      value: new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(monthlyIncome),
      change: incomeChange
        ? `${
            parseFloat(incomeChange) > 0 ? "+" : ""
          }${incomeChange}% vs. letzter Monat`
        : undefined,
      changeType: incomeChange
        ? parseFloat(incomeChange) > 0
          ? ("positive" as const)
          : ("negative" as const)
        : undefined,
      icon: <PiggyBank className="h-4 w-4" />,
    },
    {
      title: "Monatsausgaben",
      value: new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(monthlyExpenses),
      change: expenseChange
        ? `${
            parseFloat(expenseChange) > 0 ? "+" : ""
          }${expenseChange}% vs. letzter Monat`
        : undefined,
      changeType: expenseChange
        ? parseFloat(expenseChange) > 0
          ? ("negative" as const)
          : ("positive" as const)
        : undefined,
      icon: <TrendingDown className="h-4 w-4" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {summaryData.map((item, index) => (
        <SummaryCard
          key={item.title}
          title={item.title}
          value={item.value}
          change={item.change}
          changeType={item.changeType}
          icon={item.icon}
          index={index}
        />
      ))}
    </div>
  );
}
