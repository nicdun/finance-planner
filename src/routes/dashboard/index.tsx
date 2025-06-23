import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  BarChart3,
  CreditCard,
  Loader2,
  PieChart,
  Target,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { DashboardHeader } from "./-components/DashboardHeader";

// Import dashboard components
import { BankConnection } from "@/features/banking/BankConnection";
import { AccountCard } from "@/features/dashboard/AccountCard";
import { BudgetCard } from "@/features/dashboard/BudgetCard";
import { FinancialChart } from "@/features/dashboard/FinancialChart";
import { FinancialSummary } from "@/features/dashboard/FinancialSummary";
import { GoalCard } from "@/features/dashboard/GoalCard";
import { RecentTransactions } from "@/features/dashboard/RecentTransactions";

// Import database functions
import { createAccount, getAccounts } from "@/features/accounts/db";
import { getBudgets } from "@/features/budgets/db";
import { getFinancialGoals } from "@/features/goals/db";
import { getTransactions } from "@/features/transactions/db";

// Import types
import {
  Account,
  Budget,
  FinancialGoal,
  Transaction,
  MonthlyData,
} from "@/lib/types";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

// Utility function to process transactions into monthly data - shows last 12 months
function processTransactionsToMonthlyData(
  transactions: Transaction[]
): MonthlyData[] {
  const monthNames = [
    "Jan",
    "Feb",
    "Mär",
    "Apr",
    "Mai",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Dez",
  ];

  // Create a simple map to group transactions by month-year
  const monthlyMap = new Map<
    string,
    { income: number; expenses: number; month: string }
  >();

  // Process each transaction
  transactions.forEach((transaction) => {
    try {
      const date = new Date(transaction.date);
      const year = date.getFullYear();
      const month = date.getMonth(); // 0-11
      const monthKey = `${year}-${month.toString().padStart(2, "0")}`;
      const monthName = monthNames[month];

      // Initialize month if not exists
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, {
          income: 0,
          expenses: 0,
          month: monthName,
        });
      }

      const monthData = monthlyMap.get(monthKey)!;

      // Add to appropriate category
      if (transaction.type === "income") {
        monthData.income += Number(transaction.amount);
      } else if (transaction.type === "expense") {
        monthData.expenses += Math.abs(Number(transaction.amount));
      }
    } catch (error) {
      console.error("Error processing transaction:", transaction, error);
    }
  });

  // Convert map to array and sort chronologically
  const monthlyArray = Array.from(monthlyMap.entries())
    .map(([key, data]) => {
      const [year, month] = key.split("-");
      return {
        ...data,
        year: Number(year),
        monthIndex: Number(month),
        sortKey: key,
      };
    })
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map((data) => ({
      month: data.month,
      income: data.income,
      expenses: data.expenses,
      savings: Math.max(0, data.income - data.expenses),
    }));

  return monthlyArray;
}

function RouteComponent() {
  // State management for real data
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [loading, setLoading] = useState(true);

  // Process transactions into monthly data - only shows months with actual data
  const monthlyData = useMemo(() => {
    return processTransactionsToMonthlyData(transactions);
  }, [transactions]);

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [accountsData, transactionsData, budgetsData, goalsData] =
          await Promise.all([
            getAccounts(),
            getTransactions(),
            getBudgets(),
            getFinancialGoals(),
          ]);

        setAccounts(accountsData);
        setTransactions(transactionsData);
        setBudgets(budgetsData);
        setGoals(goalsData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAccountAdded = async (newAccount: Account) => {
    try {
      const createdAccount = await createAccount(newAccount);
      setAccounts((prev) => [...prev, createdAccount]);
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Lade Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader onAccountAdded={handleAccountAdded} />

        {/* Main Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Willkommen zurück! 👋
                </h2>
                <p className="text-gray-600">
                  Hier ist Ihre aktuelle Finanzübersicht für{" "}
                  {new Date().toLocaleDateString("de-DE", {
                    month: "long",
                    year: "numeric",
                  })}
                  .
                </p>
              </div>
            </motion.div>

            {/* Financial Summary */}
            <FinancialSummary accounts={accounts} transactions={transactions} />

            {/* Main Dashboard Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger
                  value="overview"
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  Übersicht
                </TabsTrigger>
                <TabsTrigger
                  value="accounts"
                  className="flex items-center gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  Konten
                </TabsTrigger>
                <TabsTrigger
                  value="budgets"
                  className="flex items-center gap-2"
                >
                  <PieChart className="h-4 w-4" />
                  Budgets
                </TabsTrigger>
                <TabsTrigger value="goals" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Ziele
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FinancialChart
                    data={monthlyData}
                    type="area"
                    title="Finanzübersicht 2024"
                  />
                  <RecentTransactions transactions={transactions} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FinancialChart
                    data={monthlyData}
                    type="bar"
                    title="Monatliche Übersicht"
                  />
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Top Budgets
                    </h3>
                    <div className="space-y-3">
                      {budgets.slice(0, 3).map((budget, index) => (
                        <BudgetCard
                          key={budget.id}
                          budget={budget}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="accounts" className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Ihre Konten
                    </h3>
                    <BankConnection onAccountAdded={handleAccountAdded} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {accounts.map((account, index) => (
                      <AccountCard
                        key={account.id}
                        account={account}
                        index={index}
                      />
                    ))}
                  </div>
                  {accounts.length === 0 && (
                    <motion.div
                      className="text-center py-12"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        Noch keine Konten verbunden
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Verbinden Sie Ihr erstes Bankkonto, um Ihre Finanzen zu
                        verwalten.
                      </p>
                      <BankConnection onAccountAdded={handleAccountAdded} />
                    </motion.div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="budgets" className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Budget-Übersicht
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {budgets.map((budget, index) => (
                      <BudgetCard
                        key={budget.id}
                        budget={budget}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="goals" className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Finanzielle Ziele
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {goals.map((goal, index) => (
                      <GoalCard key={goal.id} goal={goal} index={index} />
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
