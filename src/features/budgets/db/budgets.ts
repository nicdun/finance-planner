import { createClient } from "@/lib/supabase/server";
import { Budget, Transaction } from "@/lib/types";

// Budget functions
export async function getBudgets(request: Request): Promise<Budget[]> {
  const supabase = await createClient(request);

  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .order("category");

  if (error) {
    console.error("Error fetching budgets:", error);
    throw error;
  }

  return data.map((budget) => ({
    id: budget.id,
    category: budget.category,
    budgetAmount: parseFloat(budget.budget_amount.toString()),
    period: budget.period as Budget["period"],
    color: budget.color,
    isTopBudget: budget.is_top_budget,
  }));
}

export async function createBudget(
  request: Request,
  budget: Omit<Budget, "id">
): Promise<Budget> {
  const supabase = await createClient(request);
  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("budgets")
    .insert({
      category: budget.category,
      budget_amount: budget.budgetAmount,
      period: budget.period,
      color: budget.color,
      is_top_budget: budget.isTopBudget || false,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating budget:", error);
    throw error;
  }

  return {
    id: data.id,
    category: data.category,
    budgetAmount: parseFloat(data.budget_amount.toString()),
    period: data.period as Budget["period"],
    color: data.color,
    isTopBudget: data.is_top_budget,
  };
}

export async function updateBudget(
  request: Request,
  id: string,
  updates: Partial<Omit<Budget, "id">>
): Promise<Budget> {
  const supabase = await createClient(request);
  const { data, error } = await supabase
    .from("budgets")
    .update({
      ...(updates.category && { category: updates.category }),
      ...(updates.budgetAmount && { budget_amount: updates.budgetAmount }),
      ...(updates.period && { period: updates.period }),
      ...(updates.color && { color: updates.color }),
      ...(updates.isTopBudget !== undefined && {
        is_top_budget: updates.isTopBudget,
      }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating budget:", error);
    throw error;
  }

  return {
    id: data.id,
    category: data.category,
    budgetAmount: parseFloat(data.budget_amount.toString()),
    period: data.period as Budget["period"],
    color: data.color,
    isTopBudget: data.is_top_budget,
  };
}

export async function deleteBudget(
  request: Request,
  id: string
): Promise<void> {
  const supabase = await createClient(request);
  const { error } = await supabase.from("budgets").delete().eq("id", id);

  if (error) {
    console.error("Error deleting budget:", error);
    throw error;
  }
}

// Function to calculate monthly spending by category from transactions
export async function getMonthlySpendingByCategory(
  request: Request,
  year: number,
  month: number
): Promise<Record<string, number>> {
  const supabase = await createClient(request);
  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  // Calculate date range for the month
  const startDate = new Date(year, month - 1, 1).toISOString().split("T")[0];
  const endDate = new Date(year, month, 0).toISOString().split("T")[0];

  console.log(
    `Calculating spending for ${year}-${month}, date range: ${startDate} to ${endDate}`
  );

  const { data, error } = await supabase
    .from("transactions")
    .select("category, amount")
    .eq("user_id", user.id)
    .eq("type", "expense")
    .gte("date", startDate)
    .lte("date", endDate);

  if (error) {
    console.error(
      "Error fetching transactions for spending calculation:",
      error
    );
    throw error;
  }

  console.log("Raw transactions found:", data);

  const spendingByCategory: Record<string, number> = {};

  data.forEach((transaction) => {
    const category = transaction.category;
    const amount = parseFloat(transaction.amount.toString());
    // Convert negative expense amounts to positive spending amounts
    const spentAmount = Math.abs(amount);

    console.log(
      `Transaction: ${category}, amount: ${amount}, spentAmount: ${spentAmount}`
    );

    if (spendingByCategory[category]) {
      spendingByCategory[category] += spentAmount;
    } else {
      spendingByCategory[category] = spentAmount;
    }
  });

  console.log("Final spending by category:", spendingByCategory);
  return spendingByCategory;
}

// Function to get current month spending for a specific category
export async function getCurrentMonthSpending(
  request: Request,
  category: string
): Promise<number> {
  // No supabase call here, just calls getMonthlySpendingByCategory
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const spendingByCategory = await getMonthlySpendingByCategory(
    request,
    currentYear,
    currentMonth
  );
  return spendingByCategory[category] || 0;
}

// Enhanced function to get budgets with calculated spending
export async function getBudgetsWithSpending(
  request: Request
): Promise<(Budget & { spentAmount: number })[]> {
  // No supabase call here, just calls getBudgets and getMonthlySpendingByCategory
  const budgets = await getBudgets(request);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const spendingByCategory = await getMonthlySpendingByCategory(
    request,
    currentYear,
    currentMonth
  );

  return budgets.map((budget) => ({
    ...budget,
    spentAmount: spendingByCategory[budget.category] || 0,
  }));
}

// Function to get only top budgets with spending data
export async function getTopBudgetsWithSpending(
  request: Request
): Promise<(Budget & { spentAmount: number })[]> {
  // No supabase call here, just calls getBudgetsWithSpending
  const allBudgets = await getBudgetsWithSpending(request);
  return allBudgets.filter((budget) => budget.isTopBudget);
}

// Function to toggle top budget status
export async function toggleTopBudget(
  request: Request,
  budgetId: string,
  isTopBudget: boolean
): Promise<Budget> {
  // No supabase call here, just calls updateBudget
  return updateBudget(request, budgetId, { isTopBudget });
}

// Utility function to get budget progress statistics with calculated spending
export function getBudgetProgressStats(
  budget: Budget & { spentAmount: number }
) {
  const progressPercentage =
    budget.budgetAmount > 0
      ? Math.max(0, (budget.spentAmount / budget.budgetAmount) * 100)
      : 0;
  const remainingAmount = budget.budgetAmount - budget.spentAmount;
  const isOverBudget = budget.spentAmount > budget.budgetAmount;
  const overAmount = isOverBudget
    ? budget.spentAmount - budget.budgetAmount
    : 0;

  return {
    progressPercentage,
    remainingAmount,
    isOverBudget,
    overAmount,
  };
}
