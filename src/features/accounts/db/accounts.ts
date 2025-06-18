import { supabase } from "@/lib/supabase";
import { Account } from "@/lib/types";

// Account functions
export async function getAccounts(): Promise<Account[]> {
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
    .from("accounts")
    .select("*")
    .eq("user_id", user.id)
    .order("name");

  if (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }

  return data.map((account) => ({
    id: account.id,
    name: account.name,
    type: account.type as Account["type"],
    balance: parseFloat(account.balance.toString()),
    currency: account.currency,
    iban: account.iban,
  }));
}

export async function createAccount(
  account: Omit<Account, "id">
): Promise<Account> {
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
    .from("accounts")
    .insert({
      name: account.name,
      type: account.type,
      balance: account.balance,
      currency: account.currency,
      iban: account.iban,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating account:", error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    type: data.type as Account["type"],
    balance: parseFloat(data.balance.toString()),
    currency: data.currency,
    iban: data.iban,
  };
}

export async function updateAccount(
  id: string,
  updates: Partial<Account>
): Promise<Account> {
  const { data, error } = await supabase
    .from("accounts")
    .update({
      ...(updates.name && { name: updates.name }),
      ...(updates.type && { type: updates.type }),
      ...(updates.balance !== undefined && { balance: updates.balance }),
      ...(updates.currency && { currency: updates.currency }),
      ...(updates.iban !== undefined && { iban: updates.iban }),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating account:", error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    type: data.type as Account["type"],
    balance: parseFloat(data.balance.toString()),
    currency: data.currency,
    iban: data.iban,
  };
}

export async function deleteAccount(id: string): Promise<void> {
  const { error } = await supabase.from("accounts").delete().eq("id", id);

  if (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
}
