-- Enable RLS on all tables
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_goals ENABLE ROW LEVEL SECURITY;

-- For now, allow all operations (you can restrict this later based on user authentication)
-- These policies allow public access for development purposes
CREATE POLICY "Allow all on accounts" ON accounts FOR ALL USING (true);
CREATE POLICY "Allow all on transactions" ON transactions FOR ALL USING (true);
CREATE POLICY "Allow all on budgets" ON budgets FOR ALL USING (true);
CREATE POLICY "Allow all on financial_goals" ON financial_goals FOR ALL USING (true);
