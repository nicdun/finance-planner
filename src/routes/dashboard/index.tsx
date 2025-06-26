import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  BarChart3,
  CreditCard,
  Lightbulb,
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
import {
  FinancialChart,
  TimePeriod,
} from "@/features/dashboard/FinancialChart";
import { FinancialSummary } from "@/features/dashboard/FinancialSummary";
import { GoalCard } from "@/features/dashboard/GoalCard";
import { RecentTransactions } from "@/features/dashboard/RecentTransactions";
import { FinancialTipsCard } from "@/features/dashboard/FinancialTipsCard";

// Import database functions
import { createAccount, getAccounts } from "@/features/accounts/db";
import {
  getBudgetsWithSpending,
  getTopBudgetsWithSpending,
} from "@/features/budgets/server";
import { getFinancialGoals } from "@/features/goals/db";
import { getTransactions } from "@/features/transactions/db";
import { checkBudgetAlerts } from "@/features/notifications/db";

// Import types
import {
  Account,
  Budget,
  FinancialGoal,
  Transaction,
  MonthlyData,
  FinancialTip,
} from "@/lib/types";

// Import utilities
import { generateFinancialTips } from "@/lib/financial-tips";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

// Utility function to process transactions into monthly data - shows last 12 months
function processTransactionsToMonthlyData(
  transactions: Transaction[],
  timePeriod: "12months" | "2years" | "5years" = "12months"
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

  // For longer periods, we'll aggregate data differently
  if (timePeriod === "12months") {
    // Generate monthly data for 12 months
    const now = new Date();
    const timeData: MonthlyData[] = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthName = monthNames[month];

      timeData.push({
        month: monthName,
        year: year,
        income: 0,
        expenses: 0,
        savings: 0,
      });
    }

    // Process transactions
    transactions.forEach((transaction) => {
      try {
        const date = new Date(transaction.date);
        const year = date.getFullYear();
        const month = date.getMonth();

        const monthData = timeData.find(
          (m) => m.year === year && monthNames[month] === m.month
        );

        if (monthData) {
          if (transaction.type === "income") {
            monthData.income += Number(transaction.amount);
          } else if (transaction.type === "expense") {
            monthData.expenses += Math.abs(Number(transaction.amount));
          }
        }
      } catch (error) {
        console.error("Error processing transaction:", transaction, error);
      }
    });

    // Calculate savings
    timeData.forEach((monthData) => {
      monthData.savings = Math.max(0, monthData.income - monthData.expenses);
    });

    return timeData;
  } else {
    // For 2 years and 5 years, aggregate by quarters
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentQuarter = Math.floor(now.getMonth() / 3); // 0-3
    const yearsToGenerate = timePeriod === "2years" ? 2 : 5;
    const timeData: MonthlyData[] = [];

    // Generate quarterly data, only up to current quarter
    for (let yearOffset = yearsToGenerate - 1; yearOffset >= 0; yearOffset--) {
      const year = currentYear - yearOffset;

      // Determine how many quarters to include for this year
      const maxQuarter = year === currentYear ? currentQuarter : 3; // 0-3

      // Q1, Q2, Q3, Q4 (but only up to current quarter for current year)
      for (let quarter = 0; quarter <= maxQuarter; quarter++) {
        timeData.push({
          month: `Q${quarter + 1}`,
          year: year,
          income: 0,
          expenses: 0,
          savings: 0,
        });
      }
    }

    // Process transactions into quarters
    transactions.forEach((transaction) => {
      try {
        const date = new Date(transaction.date);
        const year = date.getFullYear();
        const month = date.getMonth();
        const quarter = Math.floor(month / 3); // 0-3

        const quarterData = timeData.find(
          (m) => m.year === year && m.month === `Q${quarter + 1}`
        );

        if (quarterData) {
          if (transaction.type === "income") {
            quarterData.income += Number(transaction.amount);
          } else if (transaction.type === "expense") {
            quarterData.expenses += Math.abs(Number(transaction.amount));
          }
        }
      } catch (error) {
        console.error("Error processing transaction:", transaction, error);
      }
    });

    // Calculate savings
    timeData.forEach((quarterData) => {
      quarterData.savings = Math.max(
        0,
        quarterData.income - quarterData.expenses
      );
    });

    return timeData;
  }
}

function RouteComponent() {
  // State management for real data
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [topBudgets, setTopBudgets] = useState<
    (Budget & { spentAmount: number })[]
  >([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [loading, setLoading] = useState(true);

  // State for chart time periods
  const [areaChartPeriod, setAreaChartPeriod] =
    useState<TimePeriod>("12months");
  const [barChartPeriod, setBarChartPeriod] = useState<TimePeriod>("12months");

  // Use realtime notifications hook
  const { notifications, unreadCount } = useRealtimeNotifications();

  // Process transactions into monthly data for different time periods
  const areaChartData = useMemo(() => {
    return processTransactionsToMonthlyData(transactions, areaChartPeriod);
  }, [transactions, areaChartPeriod]);

  const barChartData = useMemo(() => {
    return processTransactionsToMonthlyData(transactions, barChartPeriod);
  }, [transactions, barChartPeriod]);

  // Generate financial tips based on spending patterns
  const financialTips = useMemo(() => {
    return generateFinancialTips(transactions, budgets);
  }, [transactions, budgets]);

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [
          accountsData,
          transactionsData,
          budgetsData,
          topBudgetsData,
          goalsData,
        ] = await Promise.all([
          getAccounts(),
          getTransactions(),
          getBudgetsWithSpending(),
          getTopBudgetsWithSpending(),
          getFinancialGoals(),
        ]);

        setAccounts(accountsData);
        setTransactions(transactionsData);
        setBudgets(budgetsData);
        setTopBudgets(topBudgetsData);
        setGoals(goalsData);

        // Check for budget alerts
        if (budgetsData.length > 0 && transactionsData.length > 0) {
          try {
            await checkBudgetAlerts(budgetsData, transactionsData);
          } catch (error) {
            console.error("Error checking budget alerts:", error);
          }
        }
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
        <main className="p-3 sm:p-6">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
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
              <div className="overflow-x-auto">
                <TabsList className="grid w-full grid-cols-5 md:grid-cols-5 min-w-fit">
                  <TabsTrigger
                    value="overview"
                    className="flex items-center gap-1 md:gap-2 px-2 md:px-4 whitespace-nowrap"
                  >
                    <BarChart3 className="h-4 w-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Übersicht</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="accounts"
                    className="flex items-center gap-1 md:gap-2 px-2 md:px-4 whitespace-nowrap"
                  >
                    <CreditCard className="h-4 w-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Konten</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="budgets"
                    className="flex items-center gap-1 md:gap-2 px-2 md:px-4 whitespace-nowrap"
                  >
                    <PieChart className="h-4 w-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Budgets</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="goals"
                    className="flex items-center gap-1 md:gap-2 px-2 md:px-4 whitespace-nowrap"
                  >
                    <Target className="h-4 w-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Ziele</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="tips"
                    className="flex items-center gap-1 md:gap-2 px-2 md:px-4 whitespace-nowrap"
                  >
                    <Lightbulb className="h-4 w-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Tipps</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FinancialChart
                    data={areaChartData}
                    type="area"
                    title="Finanzentwicklung"
                    onTimePeriodChange={setAreaChartPeriod}
                  />
                  <RecentTransactions transactions={transactions} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FinancialChart
                    data={barChartData}
                    type="bar"
                    title="Monatliche Übersicht"
                    onTimePeriodChange={setBarChartPeriod}
                  />
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Top Budgets
                    </h3>
                    <div className="space-y-3">
                      {topBudgets.length > 0 ? (
                        topBudgets.map((budget, index) => (
                          <BudgetCard
                            key={budget.id}
                            budget={budget}
                            index={index}
                          />
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p className="text-sm">Keine Top-Budgets markiert</p>
                          <p className="text-xs">
                            Markieren Sie Budgets auf der Budget-Seite als
                            Favoriten
                          </p>
                        </div>
                      )}
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
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Budget-Übersicht
                    </h3>
                    <p className="text-sm text-gray-600">
                      {topBudgets.length} von {budgets.length} als Top-Budget
                      markiert
                    </p>
                  </div>
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

              <TabsContent value="tips" className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Finanzielle Tipps
                  </h3>
                  <FinancialTipsCard tips={financialTips} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
