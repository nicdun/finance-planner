-- Update RLS policies to restrict access to authenticated users only
-- This ensures that anonymous users cannot even attempt to access the data

-- Update accounts policies
ALTER POLICY "accounts_select_policy" ON accounts TO authenticated;
ALTER POLICY "accounts_insert_policy" ON accounts TO authenticated;
ALTER POLICY "accounts_update_policy" ON accounts TO authenticated;
ALTER POLICY "accounts_delete_policy" ON accounts TO authenticated;

-- Update transactions policies
ALTER POLICY "transactions_select_policy" ON transactions TO authenticated;
ALTER POLICY "transactions_insert_policy" ON transactions TO authenticated;
ALTER POLICY "transactions_update_policy" ON transactions TO authenticated;
ALTER POLICY "transactions_delete_policy" ON transactions TO authenticated;

-- Update budgets policies
ALTER POLICY "budgets_select_policy" ON budgets TO authenticated;
ALTER POLICY "budgets_insert_policy" ON budgets TO authenticated;
ALTER POLICY "budgets_update_policy" ON budgets TO authenticated;
ALTER POLICY "budgets_delete_policy" ON budgets TO authenticated;

-- Update financial_goals policies
ALTER POLICY "financial_goals_select_policy" ON financial_goals TO authenticated;
ALTER POLICY "financial_goals_insert_policy" ON financial_goals TO authenticated;
ALTER POLICY "financial_goals_update_policy" ON financial_goals TO authenticated;
ALTER POLICY "financial_goals_delete_policy" ON financial_goals TO authenticated;
