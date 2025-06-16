-- Drop existing RLS policies (they currently allow all access)
DROP POLICY IF EXISTS "accounts_policy" ON accounts;
DROP POLICY IF EXISTS "transactions_policy" ON transactions;
DROP POLICY IF EXISTS "budgets_policy" ON budgets;
DROP POLICY IF EXISTS "financial_goals_policy" ON financial_goals;

-- Create user-specific RLS policies

-- Accounts policies
CREATE POLICY "accounts_select_policy" ON accounts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "accounts_insert_policy" ON accounts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "accounts_update_policy" ON accounts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "accounts_delete_policy" ON accounts
    FOR DELETE USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "transactions_select_policy" ON transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "transactions_insert_policy" ON transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "transactions_update_policy" ON transactions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "transactions_delete_policy" ON transactions
    FOR DELETE USING (auth.uid() = user_id);

-- Budgets policies
CREATE POLICY "budgets_select_policy" ON budgets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "budgets_insert_policy" ON budgets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "budgets_update_policy" ON budgets
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "budgets_delete_policy" ON budgets
    FOR DELETE USING (auth.uid() = user_id);

-- Financial goals policies
CREATE POLICY "financial_goals_select_policy" ON financial_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "financial_goals_insert_policy" ON financial_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "financial_goals_update_policy" ON financial_goals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "financial_goals_delete_policy" ON financial_goals
    FOR DELETE USING (auth.uid() = user_id);
