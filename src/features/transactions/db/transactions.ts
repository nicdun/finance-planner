import { supabase } from "@/lib/supabase/client";
import { Transaction } from "@/lib/types";

// Transaction functions
export async function getTransactions(): Promise<Transaction[]> {
  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Authentication error:", authError);
    throw authError;
  }

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }

  return data.map((transaction) => ({
    id: transaction.id,
    accountId: transaction.account_id,
    amount: parseFloat(transaction.amount.toString()),
    description: transaction.description,
    category: transaction.category,
    date: transaction.date,
    type: transaction.type as Transaction["type"],
  }));
}

export async function createTransaction(
  transaction: Omit<Transaction, "id">
): Promise<Transaction> {
  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Authentication error:", authError);
    throw authError;
  }

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      account_id: transaction.accountId,
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      date: transaction.date,
      type: transaction.type,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }

  return {
    id: data.id,
    accountId: data.account_id,
    amount: parseFloat(data.amount.toString()),
    description: data.description,
    category: data.category,
    date: data.date,
    type: data.type as Transaction["type"],
  };
}

export async function updateTransaction(
  id: string,
  updates: Partial<Transaction>
): Promise<Transaction> {
  const { data, error } = await supabase
    .from("transactions")
    .update({
      ...(updates.accountId && { account_id: updates.accountId }),
      ...(updates.amount !== undefined && { amount: updates.amount }),
      ...(updates.description && { description: updates.description }),
      ...(updates.category && { category: updates.category }),
      ...(updates.date && { date: updates.date }),
      ...(updates.type && { type: updates.type }),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }

  return {
    id: data.id,
    accountId: data.account_id,
    amount: parseFloat(data.amount.toString()),
    description: data.description,
    category: data.category,
    date: data.date,
    type: data.type as Transaction["type"],
  };
}

export async function deleteTransaction(id: string): Promise<void> {
  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
}

// Category management
export async function updateTransactionCategory(
  transactionId: string,
  newCategory: string
): Promise<Transaction> {
  const { data, error } = await supabase
    .from("transactions")
    .update({ category: newCategory })
    .eq("id", transactionId)
    .select()
    .single();

  if (error) {
    console.error("Error updating transaction category:", error);
    throw error;
  }

  return {
    id: data.id,
    accountId: data.account_id,
    amount: parseFloat(data.amount.toString()),
    description: data.description,
    category: data.category,
    date: data.date,
    type: data.type as Transaction["type"],
  };
}

export async function bulkUpdateTransactionCategories(
  transactionIds: string[],
  newCategory: string
): Promise<Transaction[]> {
  if (transactionIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("transactions")
    .update({ category: newCategory })
    .in("id", transactionIds)
    .select();

  if (error) {
    console.error("Error bulk updating transaction categories:", error);
    throw error;
  }

  return data.map((transaction) => ({
    id: transaction.id,
    accountId: transaction.account_id,
    amount: parseFloat(transaction.amount.toString()),
    description: transaction.description,
    category: transaction.category,
    date: transaction.date,
    type: transaction.type as Transaction["type"],
  }));
}
