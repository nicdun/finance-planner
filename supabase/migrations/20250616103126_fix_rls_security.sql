-- Fix RLS Security: Remove insecure "Allow all" policies
-- These policies were overriding the user-specific policies, causing security issues

-- Drop the insecure "Allow all" policies
DROP POLICY IF EXISTS "Allow all on accounts" ON accounts;
DROP POLICY IF EXISTS "Allow all on transactions" ON transactions;
DROP POLICY IF EXISTS "Allow all on budgets" ON budgets;
DROP POLICY IF EXISTS "Allow all on financial_goals" ON financial_goals;

-- Verify that RLS is still enabled on all tables (should already be enabled)
-- These commands are idempotent and safe to run again
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_goals ENABLE ROW LEVEL SECURITY; 