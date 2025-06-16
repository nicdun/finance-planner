import { supabase } from "@/lib/supabase";
import { FinancialGoal } from "@/lib/types";

// Financial Goals functions
export async function getFinancialGoals(): Promise<FinancialGoal[]> {
  const { data, error } = await supabase
    .from("financial_goals")
    .select("*")
    .order("target_date");

  if (error) {
    console.error("Error fetching financial goals:", error);
    throw error;
  }

  return data.map((goal) => ({
    id: goal.id,
    title: goal.title,
    targetAmount: parseFloat(goal.target_amount.toString()),
    currentAmount: parseFloat(goal.current_amount.toString()),
    targetDate: goal.target_date,
    category: goal.category,
  }));
}

export async function createFinancialGoal(
  goal: Omit<FinancialGoal, "id">
): Promise<FinancialGoal> {
  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("financial_goals")
    .insert({
      title: goal.title,
      target_amount: goal.targetAmount,
      current_amount: goal.currentAmount,
      target_date: goal.targetDate,
      category: goal.category,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating financial goal:", error);
    throw error;
  }

  return {
    id: data.id,
    title: data.title,
    targetAmount: parseFloat(data.target_amount.toString()),
    currentAmount: parseFloat(data.current_amount.toString()),
    targetDate: data.target_date,
    category: data.category,
  };
}
