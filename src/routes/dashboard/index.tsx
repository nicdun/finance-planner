import { createFileRoute, Link } from "@tanstack/react-router";
import React from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  BarChart3,
  PieChart,
  Settings,
  Bell,
  User,
  Home,
  CreditCard,
  Target,
  TrendingUp,
} from "lucide-react";

// Import dashboard components
import { FinancialSummary } from "@/features/dashboard/FinancialSummary";
import { AccountCard } from "@/features/dashboard/AccountCard";
import { BudgetCard } from "@/features/dashboard/BudgetCard";
import { GoalCard } from "@/features/dashboard/GoalCard";
import { FinancialChart } from "@/features/dashboard/FinancialChart";
import { RecentTransactions } from "@/features/dashboard/RecentTransactions";
import { BankConnection } from "@/features/banking/BankConnection";

// Import mock data
import {
  mockAccounts,
  mockTransactions,
  mockBudgets,
  mockGoals,
  mockMonthlyData,
} from "@/lib/mock-data";

// Import types
import { Account } from "@/lib/types";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [accounts, setAccounts] = React.useState<Account[]>(mockAccounts);

  const handleAccountAdded = (newAccount: Account) => {
    setAccounts((prev) => [...prev, newAccount]);

    // Add some sample transactions for the new account
    const sampleTransactions = [
      {
        id: `tx-${Date.now()}-1`,
        accountId: newAccount.id,
        amount: 2500.0,
        description: "Gehalt",
        category: "Einkommen",
        date: new Date().toISOString().split("T")[0],
        type: "income" as const,
      },
      {
        id: `tx-${Date.now()}-2`,
        accountId: newAccount.id,
        amount: -45.5,
        description: "Supermarkt Einkauf",
        category: "Lebensmittel",
        date: new Date(Date.now() - 86400000).toISOString().split("T")[0], // Yesterday
        type: "expense" as const,
      },
    ];

    // Here you would typically update transactions state as well
    // For now we just add the account
  };

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
              <a
                href="#"
                className="text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-1"
              >
                Dashboard
              </a>
              <Link
                to="/transactions"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Transaktionen
              </Link>
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
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <Settings className="h-5 w-5" />
            </button>
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
          <FinancialSummary
            accounts={accounts}
            transactions={mockTransactions}
          />

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Übersicht
              </TabsTrigger>
              <TabsTrigger value="accounts" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Konten
              </TabsTrigger>
              <TabsTrigger value="budgets" className="flex items-center gap-2">
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
                <RecentTransactions transactions={mockTransactions} />
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
                    {mockBudgets.slice(0, 3).map((budget, index) => (
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
                  {mockBudgets.map((budget, index) => (
                    <BudgetCard key={budget.id} budget={budget} index={index} />
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
                  {mockGoals.map((goal, index) => (
                    <GoalCard key={goal.id} goal={goal} index={index} />
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
