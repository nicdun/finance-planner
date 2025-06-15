import { createFileRoute } from "@tanstack/react-router";
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
import { FinancialSummary } from "@/components/dashboard/FinancialSummary";
import { AccountCard } from "@/components/dashboard/AccountCard";
import { BudgetCard } from "@/components/dashboard/BudgetCard";
import { GoalCard } from "@/components/dashboard/GoalCard";
import { FinancialChart } from "@/components/dashboard/FinancialChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";

// Import mock data
import {
  mockAccounts,
  mockTransactions,
  mockBudgets,
  mockGoals,
  mockMonthlyData,
} from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
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
              <a
                href="#"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Transaktionen
              </a>
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
            accounts={mockAccounts}
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
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Ihre Konten
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {mockAccounts.map((account, index) => (
                    <AccountCard
                      key={account.id}
                      account={account}
                      index={index}
                    />
                  ))}
                </div>
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
