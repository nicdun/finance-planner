import { supabase } from "@/lib/supabase/client";
import { AppNotification } from "@/lib/types";

export async function getNotifications(): Promise<AppNotification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }

  return data || [];
}

export async function getUnreadNotifications(): Promise<AppNotification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("is_read", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching unread notifications:", error);
    throw error;
  }

  return data || [];
}

export async function createNotification(
  notification: Omit<
    AppNotification,
    "id" | "user_id" | "created_at" | "updated_at"
  >
): Promise<AppNotification> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("notifications")
    .insert([
      {
        ...notification,
        user_id: user.id,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating notification:", error);
    throw error;
  }

  return data;
}

export async function markNotificationAsRead(id: string): Promise<void> {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id);

  if (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
}

export async function markAllNotificationsAsRead(): Promise<void> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  if (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
}

export async function deleteNotification(id: string): Promise<void> {
  const { error } = await supabase.from("notifications").delete().eq("id", id);

  if (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
}

// Helper function to check budget alerts
export async function checkBudgetAlerts(
  budgets: any[],
  transactions: any[]
): Promise<void> {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  for (const budget of budgets) {
    // Calculate spending for current month in this category
    const monthlySpending = transactions
      .filter((t: any) => {
        const transactionDate = new Date(t.date);
        return (
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear &&
          t.category === budget.category &&
          t.type === "expense"
        );
      })
      .reduce((sum: number, t: any) => sum + Math.abs(t.amount), 0);

    // Check if budget is exceeded or close to being exceeded
    const budgetUsagePercentage = (monthlySpending / budget.budgetAmount) * 100;

    if (budgetUsagePercentage >= 100) {
      // Budget exceeded
      await createNotification({
        type: "budget_alert",
        title: "Budget überschritten!",
        message: `Ihr Budget für ${budget.category} wurde um ${(
          budgetUsagePercentage - 100
        ).toFixed(1)}% überschritten.`,
        data: {
          category: budget.category,
          budgetAmount: budget.budgetAmount,
          spentAmount: monthlySpending,
          percentage: budgetUsagePercentage,
        },
        is_read: false,
      });
    } else if (budgetUsagePercentage >= 80) {
      // Budget warning (80% used)
      await createNotification({
        type: "budget_alert",
        title: "Budget-Warnung",
        message: `Sie haben bereits ${budgetUsagePercentage.toFixed(
          1
        )}% Ihres ${budget.category}-Budgets verwendet.`,
        data: {
          category: budget.category,
          budgetAmount: budget.budgetAmount,
          spentAmount: monthlySpending,
          percentage: budgetUsagePercentage,
        },
        is_read: false,
      });
    }
  }
}
