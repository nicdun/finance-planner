import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
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
import { useEffect, useState } from "react";
import { DashboardHeader } from "./_components/DashboardHeader";

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

// Import mock monthly data (still using mock for chart until we have real monthly aggregation)
import { mockMonthlyData } from "@/lib/mock-data";

// Import types
import { Account, Budget, FinancialGoal, Transaction } from "@/lib/types";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  // State management for real data
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [loading, setLoading] = useState(true);

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
                    data={mockMonthlyData}
                    type="area"
                    title="Finanzentwicklung 2024"
                  />
                  <RecentTransactions transactions={transactions} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FinancialChart
                    data={mockMonthlyData}
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
