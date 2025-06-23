import { Transaction, Budget, FinancialTip } from "./types";

export function generateFinancialTips(
  transactions: Transaction[],
  budgets: Budget[]
): FinancialTip[] {
  const tips: FinancialTip[] = [];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Get current month transactions
  const currentMonthTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });

  // Analyze spending by category
  const categorySpending = new Map<string, number>();
  const categoryTransactionCount = new Map<string, number>();

  currentMonthTransactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const current = categorySpending.get(t.category) || 0;
      const count = categoryTransactionCount.get(t.category) || 0;
      categorySpending.set(t.category, current + Math.abs(t.amount));
      categoryTransactionCount.set(t.category, count + 1);
    });

  // Generate subscription tips
  const subscriptionCategories = [
    "Streaming",
    "Software",
    "Mitgliedschaften",
    "Abonnements",
  ];
  subscriptionCategories.forEach((category) => {
    const spending = categorySpending.get(category);
    if (spending && spending > 50) {
      tips.push({
        id: `tip-subscription-${category.toLowerCase()}`,
        category,
        title: "Abonnement-Optimierung",
        description: `Sie geben ${spending.toFixed(
          2
        )}€ monatlich für ${category} aus. Prüfen Sie, welche Abos Sie wirklich nutzen.`,
        potential_savings: spending * 0.3, // Assume 30% potential savings
        priority: spending > 100 ? "high" : "medium",
        icon: "💳",
        action_text: "Abos überprüfen",
      });
    }
  });

  // Generate dining out tips
  const diningSpending = categorySpending.get("Restaurants") || 0;
  const diningCount = categoryTransactionCount.get("Restaurants") || 0;
  if (diningSpending > 200 && diningCount > 10) {
    tips.push({
      id: "tip-dining-out",
      category: "Restaurants",
      title: "Weniger auswärts essen",
      description: `Sie haben ${diningCount} mal für ${diningSpending.toFixed(
        2
      )}€ auswärts gegessen. Selbst kochen kann bis zu 70% sparen.`,
      potential_savings: diningSpending * 0.7,
      priority: "high",
      icon: "🍽️",
      action_text: "Kochplan erstellen",
    });
  }

  // Generate transport tips
  const transportSpending = categorySpending.get("Transport") || 0;
  if (transportSpending > 300) {
    tips.push({
      id: "tip-transport",
      category: "Transport",
      title: "Günstigere Transportoptionen",
      description: `Ihre monatlichen Transportkosten betragen ${transportSpending.toFixed(
        2
      )}€. Prüfen Sie Monatstickets oder Fahrgemeinschaften.`,
      potential_savings: transportSpending * 0.4,
      priority: "medium",
      icon: "🚗",
      action_text: "Alternativen prüfen",
    });
  }

  // Generate shopping tips
  const shoppingSpending = categorySpending.get("Shopping") || 0;
  const shoppingCount = categoryTransactionCount.get("Shopping") || 0;
  if (shoppingSpending > 400 && shoppingCount > 15) {
    tips.push({
      id: "tip-impulse-shopping",
      category: "Shopping",
      title: "Impulskäufe reduzieren",
      description: `${shoppingCount} Einkäufe für ${shoppingSpending.toFixed(
        2
      )}€ deuten auf Impulskäufe hin. Eine Warteliste kann helfen.`,
      potential_savings: shoppingSpending * 0.25,
      priority: "medium",
      icon: "🛍️",
      action_text: "24h-Regel anwenden",
    });
  }

  // Generate utility savings tips
  const utilitiesSpending = categorySpending.get("Nebenkosten") || 0;
  if (utilitiesSpending > 200) {
    tips.push({
      id: "tip-utilities",
      category: "Nebenkosten",
      title: "Energiekosten senken",
      description: `Ihre Nebenkosten von ${utilitiesSpending.toFixed(
        2
      )}€ sind hoch. Prüfen Sie Ihren Stromverbrauch und Tarifwechsel.`,
      potential_savings: utilitiesSpending * 0.2,
      priority: "low",
      icon: "💡",
      action_text: "Tarife vergleichen",
    });
  }

  // Generate budget-based tips
  budgets.forEach((budget) => {
    const spending = categorySpending.get(budget.category) || 0;
    const budgetUsage = (spending / budget.budgetAmount) * 100;

    if (budgetUsage > 90) {
      tips.push({
        id: `tip-budget-${budget.category.toLowerCase()}`,
        category: budget.category,
        title: "Budget fast erschöpft",
        description: `Sie haben bereits ${budgetUsage.toFixed(1)}% Ihres ${
          budget.category
        }-Budgets verwendet.`,
        potential_savings: spending - budget.budgetAmount,
        priority: "high",
        icon: "⚠️",
        action_text: "Ausgaben reduzieren",
      });
    }
  });

  // Generate general savings tip
  const totalSpending = Array.from(categorySpending.values()).reduce(
    (sum, amount) => sum + amount,
    0
  );
  if (totalSpending > 2000) {
    tips.push({
      id: "tip-general-savings",
      category: "Allgemein",
      title: "Sparpotenzial erkannt",
      description: `Bei Gesamtausgaben von ${totalSpending.toFixed(
        2
      )}€ könnten Sie durch kleine Änderungen viel sparen.`,
      potential_savings: totalSpending * 0.1,
      priority: "medium",
      icon: "💰",
      action_text: "Sparplan erstellen",
    });
  }

  // Sort tips by priority and potential savings
  return tips.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return b.potential_savings - a.potential_savings;
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}
