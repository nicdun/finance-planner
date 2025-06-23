export interface Account {
  id: string;
  name: string;
  type: "checking" | "savings" | "credit" | "investment";
  balance: number;
  currency: string;
  iban?: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: "income" | "expense";
}

export interface Budget {
  id: string;
  category: string;
  budgetAmount: number;
  spentAmount: number;
  period: "monthly" | "yearly";
  color: string;
}

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
}

export interface MonthlyData {
  month: string;
  year: number;
  income: number;
  expenses: number;
  savings: number;
}

export interface AppNotification {
  id: string;
  user_id: string;
  type: "tip" | "budget_alert" | "goal_reminder";
  title: string;
  message: string;
  data: Record<string, any>;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface FinancialTip {
  id: string;
  category: string;
  title: string;
  description: string;
  potential_savings: number;
  priority: "low" | "medium" | "high";
  icon: string;
  action_text?: string;
  action_url?: string;
}
