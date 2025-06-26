import { createServerFn } from "@tanstack/react-start";
import { Budget } from "@/lib/types";
import {
  getBudgets as dbGetBudgets,
  createBudget as dbCreateBudget,
  updateBudget as dbUpdateBudget,
  deleteBudget as dbDeleteBudget,
  getBudgetsWithSpending as dbGetBudgetsWithSpending,
  getTopBudgetsWithSpending as dbGetTopBudgetsWithSpending,
  toggleTopBudget as dbToggleTopBudget,
  getCurrentMonthSpending as dbGetCurrentMonthSpending,
  getMonthlySpendingByCategory as dbGetMonthlySpendingByCategory,
  getBudgetProgressStats,
} from "../db/budgets";
import { createClient } from "@/lib/supabase/server";
import { getWebRequest } from "@tanstack/react-start/server";

// Server function to get all budgets
export const getBudgets = createServerFn({
  method: "GET",
}).handler(async (): Promise<Budget[]> => {
  const request = getWebRequest();
  return await dbGetBudgets(request);
});

// Server function to create a new budget
export const createBudget = createServerFn({
  method: "POST",
})
  .validator((budget: Omit<Budget, "id">) => budget)
  .handler(async ({ data }): Promise<Budget> => {
    const request = getWebRequest();
    return await dbCreateBudget(request, data);
  });

// Server function to update a budget
export const updateBudget = createServerFn({
  method: "POST",
})
  .validator(
    (data: { id: string; updates: Partial<Omit<Budget, "id">> }) => data
  )
  .handler(async ({ data }): Promise<Budget> => {
    const request = getWebRequest();
    return await dbUpdateBudget(request, data.id, data.updates);
  });

// Server function to delete a budget
export const deleteBudget = createServerFn({
  method: "POST",
})
  .validator((id: string) => id)
  .handler(async ({ data }): Promise<void> => {
    const request = getWebRequest();
    return await dbDeleteBudget(request, data);
  });

// Server function to get budgets with spending data
export const getBudgetsWithSpending = createServerFn({
  method: "GET",
}).handler(async (): Promise<(Budget & { spentAmount: number })[]> => {
  const request = getWebRequest();
  return await dbGetBudgetsWithSpending(request);
});

// Server function to get top budgets with spending data
export const getTopBudgetsWithSpending = createServerFn({
  method: "GET",
}).handler(async (): Promise<(Budget & { spentAmount: number })[]> => {
  const request = getWebRequest();
  return await dbGetTopBudgetsWithSpending(request);
});

// Server function to toggle top budget status
export const toggleTopBudget = createServerFn({
  method: "POST",
})
  .validator((data: { budgetId: string; isTopBudget: boolean }) => data)
  .handler(async ({ data }): Promise<Budget> => {
    const request = getWebRequest();
    return await dbToggleTopBudget(request, data.budgetId, data.isTopBudget);
  });

// Server function to get current month spending for a category
export const getCurrentMonthSpending = createServerFn({
  method: "GET",
})
  .validator((category: string) => category)
  .handler(async ({ data }): Promise<number> => {
    const request = getWebRequest();
    return await dbGetCurrentMonthSpending(request, data);
  });

// Server function to get monthly spending by category
export const getMonthlySpendingByCategory = createServerFn({
  method: "GET",
})
  .validator((data: { year: number; month: number }) => data)
  .handler(async ({ data }): Promise<Record<string, number>> => {
    const request = getWebRequest();
    return await dbGetMonthlySpendingByCategory(request, data.year, data.month);
  });

// Export the utility function as well since it's used by components
export { getBudgetProgressStats };
