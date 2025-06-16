import { jsxs, jsx } from 'react/jsx-runtime';
import { Link } from '@tanstack/react-router';
import React__default from 'react';
import { motion } from 'framer-motion';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { c as cn, C as Card, a as CardHeader, b as CardTitle, e as CardContent, B as Badge } from './ssr.mjs';
import { m as mockAccounts, S as Separator, B as BankConnection, A as Avatar, b as AvatarFallback, a as mockTransactions, c as mockMonthlyData, d as mockBudgets, e as mockGoals } from './BankConnection-BzYEi_Co.mjs';
import { Home, Bell, Settings, User, BarChart3, CreditCard, PieChart, Target, TrendingUp, DollarSign, Wallet, PiggyBank, TrendingDown, Calendar, ArrowUpRight, ArrowDownRight, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, BarChart, Legend, Bar } from 'recharts';
import 'node:fs';
import '@radix-ui/react-slot';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
import 'node:async_hooks';
import 'node:stream';
import 'react-dom/server';
import 'node:stream/web';
import '@radix-ui/react-separator';
import '@radix-ui/react-avatar';

function Tabs({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.Root,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function TabsContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.Content,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className),
      ...props
    }
  );
}
function SummaryCard({
  title,
  value,
  change,
  changeType,
  icon,
  index
}) {
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
        return /* @__PURE__ */ jsx(TrendingUp, { className: "h-3 w-3" });
      case "negative":
        return /* @__PURE__ */ jsx(TrendingDown, { className: "h-3 w-3" });
      default:
        return null;
    }
  };
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, delay: index * 0.1 },
      children: /* @__PURE__ */ jsxs(Card, { className: "hover:shadow-lg transition-shadow duration-200", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium text-gray-600", children: title }),
          /* @__PURE__ */ jsx("div", { className: "text-gray-400", children: icon })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-gray-900", children: value }),
          change && /* @__PURE__ */ jsxs(
            "div",
            {
              className: `flex items-center gap-1 text-xs ${getChangeColor()}`,
              children: [
                getChangeIcon(),
                /* @__PURE__ */ jsx("span", { children: change })
              ]
            }
          )
        ] }) })
      ] })
    }
  );
}
function FinancialSummary({
  accounts,
  transactions
}) {
  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );
  const liquidAssets = accounts.filter(
    (account) => account.type === "checking" || account.type === "savings"
  ).reduce((sum, account) => sum + account.balance, 0);
  const investments = accounts.filter((account) => account.type === "investment").reduce((sum, account) => sum + account.balance, 0);
  const debt = Math.abs(
    accounts.filter((account) => account.type === "credit").reduce((sum, account) => sum + Math.min(0, account.balance), 0)
  );
  const currentMonth = (/* @__PURE__ */ new Date()).getMonth();
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const monthlyTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
  });
  const monthlyIncome = monthlyTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = Math.abs(
    monthlyTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  );
  const summaryData = [
    {
      title: "Gesamtverm\xF6gen",
      value: new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR"
      }).format(totalBalance),
      change: "+2,4% vs. letzter Monat",
      changeType: "positive",
      icon: /* @__PURE__ */ jsx(DollarSign, { className: "h-4 w-4" })
    },
    {
      title: "Liquide Mittel",
      value: new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR"
      }).format(liquidAssets),
      change: "+1,2% vs. letzter Monat",
      changeType: "positive",
      icon: /* @__PURE__ */ jsx(Wallet, { className: "h-4 w-4" })
    },
    {
      title: "Investitionen",
      value: new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR"
      }).format(investments),
      change: "+5,8% vs. letzter Monat",
      changeType: "positive",
      icon: /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4" })
    },
    {
      title: "Schulden",
      value: new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR"
      }).format(debt),
      change: "-3,2% vs. letzter Monat",
      changeType: "positive",
      icon: /* @__PURE__ */ jsx(CreditCard, { className: "h-4 w-4" })
    },
    {
      title: "Monatseinkommen",
      value: new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR"
      }).format(monthlyIncome),
      icon: /* @__PURE__ */ jsx(PiggyBank, { className: "h-4 w-4" })
    },
    {
      title: "Monatsausgaben",
      value: new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR"
      }).format(monthlyExpenses),
      change: "+8,5% vs. letzter Monat",
      changeType: "negative",
      icon: /* @__PURE__ */ jsx(TrendingDown, { className: "h-4 w-4" })
    }
  ];
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: summaryData.map((item, index) => /* @__PURE__ */ jsx(
    SummaryCard,
    {
      title: item.title,
      value: item.value,
      change: item.change,
      changeType: item.changeType,
      icon: item.icon,
      index
    },
    item.title
  )) });
}
const getAccountIcon = (type) => {
  switch (type) {
    case "checking":
      return /* @__PURE__ */ jsx(Wallet, { className: "h-5 w-5" });
    case "savings":
      return /* @__PURE__ */ jsx(PiggyBank, { className: "h-5 w-5" });
    case "credit":
      return /* @__PURE__ */ jsx(CreditCard, { className: "h-5 w-5" });
    case "investment":
      return /* @__PURE__ */ jsx(TrendingUp, { className: "h-5 w-5" });
    default:
      return /* @__PURE__ */ jsx(Wallet, { className: "h-5 w-5" });
  }
};
const getAccountTypeLabel = (type) => {
  switch (type) {
    case "checking":
      return "Girokonto";
    case "savings":
      return "Sparkonto";
    case "credit":
      return "Kreditkarte";
    case "investment":
      return "Depot";
    default:
      return "Konto";
  }
};
const getBalanceColor = (balance) => {
  if (balance < 0) return "text-red-600";
  if (balance > 1e4) return "text-green-600";
  return "text-gray-900";
};
function AccountCard({ account, index }) {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, delay: index * 0.1 },
      children: /* @__PURE__ */ jsxs(Card, { className: "hover:shadow-lg transition-shadow duration-200", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm font-medium flex items-center gap-2", children: [
            getAccountIcon(account.type),
            account.name
          ] }),
          /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: getAccountTypeLabel(account.type) })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `text-2xl font-bold ${getBalanceColor(
                account.balance
              )}`,
              children: new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: account.currency
              }).format(account.balance)
            }
          ),
          account.iban && /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 font-mono", children: account.iban })
        ] }) })
      ] })
    }
  );
}
function BudgetCard({ budget, index }) {
  const percentage = budget.spentAmount / budget.budgetAmount * 100;
  const isOverBudget = percentage > 100;
  const isNearLimit = percentage > 80 && percentage <= 100;
  const getStatusIcon = () => {
    if (isOverBudget) return /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-red-500" });
    if (isNearLimit) return /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 text-yellow-500" });
    return /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-green-500" });
  };
  const getStatusColor = () => {
    if (isOverBudget) return "bg-red-500";
    if (isNearLimit) return "bg-yellow-500";
    return "bg-green-500";
  };
  const getStatusText = () => {
    if (isOverBudget) return "\xDCberschritten";
    if (isNearLimit) return "Warnung";
    return "Im Rahmen";
  };
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.3, delay: index * 0.1 },
      children: /* @__PURE__ */ jsxs(Card, { className: "hover:shadow-lg transition-shadow duration-200", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: budget.category }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            getStatusIcon(),
            /* @__PURE__ */ jsx(
              Badge,
              {
                variant: isOverBudget ? "destructive" : isNearLimit ? "secondary" : "default",
                className: "text-xs",
                children: getStatusText()
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Ausgegeben:" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: new Intl.NumberFormat("de-DE", {
              style: "currency",
              currency: "EUR"
            }).format(budget.spentAmount) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Budget:" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: new Intl.NumberFormat("de-DE", {
              style: "currency",
              currency: "EUR"
            }).format(budget.budgetAmount) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-gray-500", children: [
              /* @__PURE__ */ jsxs("span", { children: [
                Math.round(percentage),
                "% verwendet"
              ] }),
              /* @__PURE__ */ jsxs("span", { children: [
                new Intl.NumberFormat("de-DE", {
                  style: "currency",
                  currency: "EUR"
                }).format(budget.budgetAmount - budget.spentAmount),
                " ",
                "\xFCbrig"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: /* @__PURE__ */ jsx(
              motion.div,
              {
                className: `h-2 rounded-full ${getStatusColor()}`,
                initial: { width: 0 },
                animate: { width: `${Math.min(percentage, 100)}%` },
                transition: { duration: 0.8, delay: index * 0.1 }
              }
            ) })
          ] })
        ] }) })
      ] })
    }
  );
}
function GoalCard({ goal, index }) {
  const percentage = goal.currentAmount / goal.targetAmount * 100;
  const remainingAmount = goal.targetAmount - goal.currentAmount;
  const targetDate = new Date(goal.targetDate);
  const today = /* @__PURE__ */ new Date();
  const daysRemaining = Math.ceil(
    (targetDate.getTime() - today.getTime()) / (1e3 * 60 * 60 * 24)
  );
  const getProgressColor = () => {
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 75) return "bg-blue-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-gray-400";
  };
  const getStatusBadge = () => {
    if (percentage >= 100)
      return { variant: "default", text: "Erreicht" };
    if (daysRemaining < 0)
      return { variant: "destructive", text: "\xDCberf\xE4llig" };
    if (daysRemaining < 30)
      return { variant: "secondary", text: "Bald f\xE4llig" };
    return { variant: "outline", text: "In Bearbeitung" };
  };
  const status = getStatusBadge();
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.3, delay: index * 0.1 },
      children: /* @__PURE__ */ jsxs(Card, { className: "hover:shadow-lg transition-shadow duration-200", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm font-medium flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Target, { className: "h-4 w-4" }),
            goal.title
          ] }),
          /* @__PURE__ */ jsx(Badge, { variant: status.variant, className: "text-xs", children: status.text })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Aktuell:" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR"
              }).format(goal.currentAmount) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Ziel:" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR"
              }).format(goal.targetAmount) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Noch ben\xF6tigt:" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium text-blue-600", children: new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR"
              }).format(Math.max(0, remainingAmount)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-gray-500", children: [
              /* @__PURE__ */ jsxs("span", { children: [
                Math.round(percentage),
                "% erreicht"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3" }),
                /* @__PURE__ */ jsx("span", { children: daysRemaining > 0 ? `${daysRemaining} Tage verbleibend` : daysRemaining === 0 ? "Heute f\xE4llig" : `${Math.abs(daysRemaining)} Tage \xFCberf\xE4llig` })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: /* @__PURE__ */ jsx(
              motion.div,
              {
                className: `h-2 rounded-full ${getProgressColor()}`,
                initial: { width: 0 },
                animate: { width: `${Math.min(percentage, 100)}%` },
                transition: { duration: 1, delay: index * 0.1 }
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs text-gray-500", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(TrendingUp, { className: "h-3 w-3" }),
              goal.category
            ] }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Zieldatum: ",
              targetDate.toLocaleDateString("de-DE")
            ] })
          ] })
        ] }) })
      ] })
    }
  );
}
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-white p-3 border border-gray-200 rounded-lg shadow-lg", children: [
      /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-900", children: `${label} 2024` }),
      payload.map((entry, index) => /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: entry.color }, children: `${entry.name}: ${new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR"
      }).format(entry.value)}` }, index))
    ] });
  }
  return null;
};
function FinancialChart({ data, type, title }) {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
      children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg font-semibold", children: title }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "h-80", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: type === "area" ? /* @__PURE__ */ jsxs(
          AreaChart,
          {
            data,
            margin: { top: 10, right: 30, left: 0, bottom: 0 },
            children: [
              /* @__PURE__ */ jsxs("defs", { children: [
                /* @__PURE__ */ jsxs(
                  "linearGradient",
                  {
                    id: "colorIncome",
                    x1: "0",
                    y1: "0",
                    x2: "0",
                    y2: "1",
                    children: [
                      /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#10b981", stopOpacity: 0.8 }),
                      /* @__PURE__ */ jsx(
                        "stop",
                        {
                          offset: "95%",
                          stopColor: "#10b981",
                          stopOpacity: 0.1
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "linearGradient",
                  {
                    id: "colorExpenses",
                    x1: "0",
                    y1: "0",
                    x2: "0",
                    y2: "1",
                    children: [
                      /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#ef4444", stopOpacity: 0.8 }),
                      /* @__PURE__ */ jsx(
                        "stop",
                        {
                          offset: "95%",
                          stopColor: "#ef4444",
                          stopOpacity: 0.1
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "linearGradient",
                  {
                    id: "colorSavings",
                    x1: "0",
                    y1: "0",
                    x2: "0",
                    y2: "1",
                    children: [
                      /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#3b82f6", stopOpacity: 0.8 }),
                      /* @__PURE__ */ jsx(
                        "stop",
                        {
                          offset: "95%",
                          stopColor: "#3b82f6",
                          stopOpacity: 0.1
                        }
                      )
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f0f0f0" }),
              /* @__PURE__ */ jsx(
                XAxis,
                {
                  dataKey: "month",
                  axisLine: false,
                  tickLine: false,
                  tick: { fontSize: 12, fill: "#6b7280" }
                }
              ),
              /* @__PURE__ */ jsx(
                YAxis,
                {
                  axisLine: false,
                  tickLine: false,
                  tick: { fontSize: 12, fill: "#6b7280" },
                  tickFormatter: (value) => `${value / 1e3}k`
                }
              ),
              /* @__PURE__ */ jsx(Tooltip, { content: /* @__PURE__ */ jsx(CustomTooltip, {}) }),
              /* @__PURE__ */ jsx(
                Area,
                {
                  type: "monotone",
                  dataKey: "income",
                  stackId: "1",
                  stroke: "#10b981",
                  fillOpacity: 1,
                  fill: "url(#colorIncome)",
                  name: "Einkommen"
                }
              ),
              /* @__PURE__ */ jsx(
                Area,
                {
                  type: "monotone",
                  dataKey: "expenses",
                  stackId: "2",
                  stroke: "#ef4444",
                  fillOpacity: 1,
                  fill: "url(#colorExpenses)",
                  name: "Ausgaben"
                }
              ),
              /* @__PURE__ */ jsx(
                Area,
                {
                  type: "monotone",
                  dataKey: "savings",
                  stackId: "3",
                  stroke: "#3b82f6",
                  fillOpacity: 1,
                  fill: "url(#colorSavings)",
                  name: "Ersparnisse"
                }
              )
            ]
          }
        ) : /* @__PURE__ */ jsxs(
          BarChart,
          {
            data,
            margin: { top: 20, right: 30, left: 20, bottom: 5 },
            children: [
              /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f0f0f0" }),
              /* @__PURE__ */ jsx(
                XAxis,
                {
                  dataKey: "month",
                  axisLine: false,
                  tickLine: false,
                  tick: { fontSize: 12, fill: "#6b7280" }
                }
              ),
              /* @__PURE__ */ jsx(
                YAxis,
                {
                  axisLine: false,
                  tickLine: false,
                  tick: { fontSize: 12, fill: "#6b7280" },
                  tickFormatter: (value) => `${value / 1e3}k`
                }
              ),
              /* @__PURE__ */ jsx(Tooltip, { content: /* @__PURE__ */ jsx(CustomTooltip, {}) }),
              /* @__PURE__ */ jsx(Legend, {}),
              /* @__PURE__ */ jsx(
                Bar,
                {
                  dataKey: "income",
                  fill: "#10b981",
                  name: "Einkommen",
                  radius: [2, 2, 0, 0]
                }
              ),
              /* @__PURE__ */ jsx(
                Bar,
                {
                  dataKey: "expenses",
                  fill: "#ef4444",
                  name: "Ausgaben",
                  radius: [2, 2, 0, 0]
                }
              ),
              /* @__PURE__ */ jsx(
                Bar,
                {
                  dataKey: "savings",
                  fill: "#3b82f6",
                  name: "Ersparnisse",
                  radius: [2, 2, 0, 0]
                }
              )
            ]
          }
        ) }) }) })
      ] })
    }
  );
}
function RecentTransactions({ transactions }) {
  const sortedTransactions = transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.5 },
      children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Calendar, { className: "h-5 w-5" }),
          "Letzte Transaktionen"
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          sortedTransactions.map((transaction, index) => /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: -20 },
              animate: { opacity: 1, x: 0 },
              transition: { duration: 0.3, delay: index * 0.1 },
              className: "flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: `p-2 rounded-full ${transaction.type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`,
                      children: transaction.type === "income" ? /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ArrowDownRight, { className: "h-4 w-4" })
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsx("div", { className: "font-medium text-sm text-gray-900", children: transaction.description }),
                    /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500 flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx("span", { children: new Date(transaction.date).toLocaleDateString("de-DE") }),
                      /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: transaction.category })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: `font-semibold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`,
                    children: [
                      transaction.type === "income" ? "+" : "",
                      new Intl.NumberFormat("de-DE", {
                        style: "currency",
                        currency: "EUR"
                      }).format(transaction.amount)
                    ]
                  }
                )
              ]
            },
            transaction.id
          )),
          sortedTransactions.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-8 text-gray-500", children: [
            /* @__PURE__ */ jsx(Calendar, { className: "h-12 w-12 mx-auto mb-4 text-gray-300" }),
            /* @__PURE__ */ jsx("p", { children: "Keine Transaktionen vorhanden" })
          ] })
        ] }) })
      ] })
    }
  );
}
const SplitComponent = function RouteComponent() {
  const [accounts, setAccounts] = React__default.useState(mockAccounts);
  const handleAccountAdded = (newAccount) => {
    setAccounts((prev) => [...prev, newAccount]);
    [{
      id: `tx-${Date.now()}-1`,
      accountId: newAccount.id,
      amount: 2500,
      description: "Gehalt",
      category: "Einkommen",
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      type: "income"
    }, {
      id: `tx-${Date.now()}-2`,
      accountId: newAccount.id,
      amount: -45.5,
      description: "Supermarkt Einkauf",
      category: "Lebensmittel",
      date: new Date(Date.now() - 864e5).toISOString().split("T")[0],
      // Yesterday
      type: "expense"
    }];
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsx(motion.header, { className: "bg-white border-b border-gray-200 px-6 py-4", initial: {
      opacity: 0,
      y: -20
    }, animate: {
      opacity: 1,
      y: 0
    }, transition: {
      duration: 0.3
    }, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(Home, { className: "h-5 w-5 text-white" }) }),
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-gray-900", children: "FinanzPlaner" })
        ] }),
        /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "h-6" }),
        /* @__PURE__ */ jsxs("nav", { className: "flex items-center gap-6", children: [
          /* @__PURE__ */ jsx("a", { href: "#", className: "text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-1", children: "Dashboard" }),
          /* @__PURE__ */ jsx(Link, { to: "/transactions", className: "text-sm font-medium text-gray-600 hover:text-gray-900", children: "Transaktionen" }),
          /* @__PURE__ */ jsx("a", { href: "#", className: "text-sm font-medium text-gray-600 hover:text-gray-900", children: "Budgets" }),
          /* @__PURE__ */ jsx("a", { href: "#", className: "text-sm font-medium text-gray-600 hover:text-gray-900", children: "Ziele" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(BankConnection, { onAccountAdded: handleAccountAdded }),
        /* @__PURE__ */ jsx("button", { className: "p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100", children: /* @__PURE__ */ jsx(Bell, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsx("button", { className: "p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100", children: /* @__PURE__ */ jsx(Settings, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsx(Avatar, { children: /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-blue-100 text-blue-600", children: /* @__PURE__ */ jsx(User, { className: "h-4 w-4" }) }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("main", { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto space-y-6", children: [
      /* @__PURE__ */ jsx(motion.div, { initial: {
        opacity: 0,
        y: 20
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        duration: 0.4
      }, children: /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Willkommen zur\xFCck! \u{1F44B}" }),
        /* @__PURE__ */ jsxs("p", { className: "text-gray-600", children: [
          "Hier ist Ihre aktuelle Finanz\xFCbersicht f\xFCr",
          " ",
          (/* @__PURE__ */ new Date()).toLocaleDateString("de-DE", {
            month: "long",
            year: "numeric"
          }),
          "."
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(FinancialSummary, { accounts, transactions: mockTransactions }),
      /* @__PURE__ */ jsxs(Tabs, { defaultValue: "overview", className: "space-y-6", children: [
        /* @__PURE__ */ jsxs(TabsList, { className: "grid w-full grid-cols-4", children: [
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "overview", className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(BarChart3, { className: "h-4 w-4" }),
            "\xDCbersicht"
          ] }),
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "accounts", className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(CreditCard, { className: "h-4 w-4" }),
            "Konten"
          ] }),
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "budgets", className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(PieChart, { className: "h-4 w-4" }),
            "Budgets"
          ] }),
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "goals", className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Target, { className: "h-4 w-4" }),
            "Ziele"
          ] })
        ] }),
        /* @__PURE__ */ jsxs(TabsContent, { value: "overview", className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsx(FinancialChart, { data: mockMonthlyData, type: "area", title: "Finanzentwicklung 2024" }),
            /* @__PURE__ */ jsx(RecentTransactions, { transactions: mockTransactions })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsx(FinancialChart, { data: mockMonthlyData, type: "bar", title: "Monatliche \xDCbersicht" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(TrendingUp, { className: "h-5 w-5" }),
                "Top Budgets"
              ] }),
              /* @__PURE__ */ jsx("div", { className: "space-y-3", children: mockBudgets.slice(0, 3).map((budget, index) => /* @__PURE__ */ jsx(BudgetCard, { budget, index }, budget.id)) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(TabsContent, { value: "accounts", className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(CreditCard, { className: "h-5 w-5" }),
              "Ihre Konten"
            ] }),
            /* @__PURE__ */ jsx(BankConnection, { onAccountAdded: handleAccountAdded })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: accounts.map((account, index) => /* @__PURE__ */ jsx(AccountCard, { account, index }, account.id)) }),
          accounts.length === 0 && /* @__PURE__ */ jsxs(motion.div, { className: "text-center py-12", initial: {
            opacity: 0,
            y: 20
          }, animate: {
            opacity: 1,
            y: 0
          }, children: [
            /* @__PURE__ */ jsx(CreditCard, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }),
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-600 mb-2", children: "Noch keine Konten verbunden" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-500 mb-4", children: "Verbinden Sie Ihr erstes Bankkonto, um Ihre Finanzen zu verwalten." }),
            /* @__PURE__ */ jsx(BankConnection, { onAccountAdded: handleAccountAdded })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "budgets", className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(PieChart, { className: "h-5 w-5" }),
            "Budget-\xDCbersicht"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: mockBudgets.map((budget, index) => /* @__PURE__ */ jsx(BudgetCard, { budget, index }, budget.id)) })
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "goals", className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Target, { className: "h-5 w-5" }),
            "Finanzielle Ziele"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: mockGoals.map((goal, index) => /* @__PURE__ */ jsx(GoalCard, { goal, index }, goal.id)) })
        ] }) })
      ] })
    ] }) })
  ] });
};

export { SplitComponent as component };
//# sourceMappingURL=index-BFCzRxEI.mjs.map
