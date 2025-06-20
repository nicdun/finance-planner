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

export async function updateFinancialGoal(
  id: string,
  updates: Partial<Omit<FinancialGoal, "id">>
): Promise<FinancialGoal> {
  const { data, error } = await supabase
    .from("financial_goals")
    .update({
      ...(updates.title && { title: updates.title }),
      ...(updates.targetAmount && { target_amount: updates.targetAmount }),
      ...(updates.currentAmount !== undefined && {
        current_amount: updates.currentAmount,
      }),
      ...(updates.targetDate && { target_date: updates.targetDate }),
      ...(updates.category && { category: updates.category }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating financial goal:", error);
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

export async function deleteFinancialGoal(id: string): Promise<void> {
  const { error } = await supabase
    .from("financial_goals")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting financial goal:", error);
    throw error;
  }
}

// Utility function to calculate monthly savings rate
export function calculateMonthlySavingsRate(
  targetAmount: number,
  currentAmount: number,
  targetDate: string
): number {
  const target = new Date(targetDate);
  const now = new Date();

  // Calculate months until target date
  const monthsUntilTarget = Math.max(
    1,
    (target.getFullYear() - now.getFullYear()) * 12 +
      (target.getMonth() - now.getMonth())
  );

  const remainingAmount = Math.max(0, targetAmount - currentAmount);
  return remainingAmount / monthsUntilTarget;
}

// Function to get goal progress statistics
export function getGoalProgressStats(goal: FinancialGoal) {
  const progressPercentage = Math.min(
    100,
    (goal.currentAmount / goal.targetAmount) * 100
  );
  const remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount);
  const monthlySavingsRate = calculateMonthlySavingsRate(
    goal.targetAmount,
    goal.currentAmount,
    goal.targetDate
  );

  const targetDate = new Date(goal.targetDate);
  const now = new Date();
  const daysRemaining = Math.max(
    0,
    Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );

  return {
    progressPercentage,
    remainingAmount,
    monthlySavingsRate,
    daysRemaining,
    isOnTrack:
      progressPercentage >=
      ((Date.now() - new Date().getTime()) /
        (targetDate.getTime() - new Date().getTime())) *
        100,
  };
}
