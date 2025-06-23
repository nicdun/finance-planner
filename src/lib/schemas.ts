import { z } from "zod";

// Base schemas
export const accountTypeSchema = z.enum([
  "checking",
  "savings",
  "credit",
  "investment",
]);
export const transactionTypeSchema = z.enum(["income", "expense"]);
export const budgetPeriodSchema = z.enum(["monthly", "yearly"]);
export const notificationTypeSchema = z.enum([
  "tip",
  "budget_alert",
  "goal_reminder",
]);
export const prioritySchema = z.enum(["low", "medium", "high"]);

// Entity schemas
export const accountSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name ist erforderlich"),
  type: accountTypeSchema,
  balance: z.number(),
  currency: z.string().default("EUR"),
  iban: z.string().optional(),
  user_id: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const transactionSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  amount: z.number(),
  description: z.string().min(1, "Beschreibung ist erforderlich"),
  category: z.string(),
  date: z.string().datetime(),
  type: transactionTypeSchema,
  user_id: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const budgetSchema = z.object({
  id: z.string(),
  category: z.string(),
  budgetAmount: z.number().positive("Budget muss positiv sein"),
  spentAmount: z.number().default(0),
  period: budgetPeriodSchema,
  color: z.string(),
  user_id: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const financialGoalSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Titel ist erforderlich"),
  targetAmount: z.number().positive("Zielbetrag muss positiv sein"),
  currentAmount: z.number().default(0),
  targetDate: z.string().datetime(),
  category: z.string(),
  description: z.string().optional(),
  user_id: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const notificationSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  type: notificationTypeSchema,
  title: z.string(),
  message: z.string(),
  data: z.record(z.any()),
  is_read: z.boolean().default(false),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const financialTipSchema = z.object({
  id: z.string(),
  category: z.string(),
  title: z.string(),
  description: z.string(),
  potential_savings: z.number(),
  priority: prioritySchema,
  icon: z.string(),
  action_text: z.string().optional(),
  action_url: z.string().optional(),
});

// Form schemas (for client-side validation)
export const createAccountFormSchema = accountSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
});

export const createTransactionFormSchema = transactionSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
});

export const createBudgetFormSchema = budgetSchema.omit({
  id: true,
  user_id: true,
  spentAmount: true,
  created_at: true,
  updated_at: true,
});

export const createGoalFormSchema = financialGoalSchema.omit({
  id: true,
  user_id: true,
  currentAmount: true,
  created_at: true,
  updated_at: true,
});

// Type inference
export type Account = z.infer<typeof accountSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
export type Budget = z.infer<typeof budgetSchema>;
export type FinancialGoal = z.infer<typeof financialGoalSchema>;
export type AppNotification = z.infer<typeof notificationSchema>;
export type FinancialTip = z.infer<typeof financialTipSchema>;

// Form types
export type CreateAccountForm = z.infer<typeof createAccountFormSchema>;
export type CreateTransactionForm = z.infer<typeof createTransactionFormSchema>;
export type CreateBudgetForm = z.infer<typeof createBudgetFormSchema>;
export type CreateGoalForm = z.infer<typeof createGoalFormSchema>;

// API Response types
export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  success: boolean;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error: string | null;
  success: boolean;
};
