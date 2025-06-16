import { supabase } from "@/lib/supabase";
import { Budget } from "@/lib/types";

// Budget functions
export async function getBudgets(): Promise<Budget[]> {
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
    spentAmount: parseFloat(budget.spent_amount.toString()),
    period: budget.period as Budget["period"],
    color: budget.color,
  }));
}

export async function createBudget(
  budget: Omit<Budget, "id">
): Promise<Budget> {
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
      spent_amount: budget.spentAmount,
      period: budget.period,
      color: budget.color,
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
    spentAmount: parseFloat(data.spent_amount.toString()),
    period: data.period as Budget["period"],
    color: data.color,
  };
}
