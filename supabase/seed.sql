-- Comprehensive seed data for finance planner
-- Test user ID: da594080-c68a-4a64-95cc-5a6bb5256abb

-- Insert sample accounts
INSERT INTO accounts (name, type, balance, currency, iban, user_id) VALUES
('Hauptgirokonto', 'checking', 2500.00, 'EUR', 'DE89370400440532013000', 'da594080-c68a-4a64-95cc-5a6bb5256abb'),
('Sparkonto', 'savings', 15000.00, 'EUR', null, 'da594080-c68a-4a64-95cc-5a6bb5256abb'),
('Kreditkarte', 'credit', -350.00, 'EUR', null, 'da594080-c68a-4a64-95cc-5a6bb5256abb'),
('Investmentdepot', 'investment', 8500.00, 'EUR', null, 'da594080-c68a-4a64-95cc-5a6bb5256abb');

-- === 2023 TRANSACTIONS (Full Year) ===

-- Monthly salary transactions for 2023
INSERT INTO transactions (account_id, amount, description, category, date, type, user_id) 
SELECT a.id, 3200.00, 'Gehalt Januar 2023', 'Einkommen', '2023-01-01', 'income', 'da594080-c68a-4a64-95cc-5a6bb5256abb' 
FROM accounts a WHERE a.name = 'Hauptgirokonto' AND a.user_id = 'da594080-c68a-4a64-95cc-5a6bb5256abb';

INSERT INTO transactions (account_id, amount, description, category, date, type, user_id) 
SELECT a.id, 3200.00, 'Gehalt Februar 2023', 'Einkommen', '2023-02-01', 'income', 'da594080-c68a-4a64-95cc-5a6bb5256abb' 
FROM accounts a WHERE a.name = 'Hauptgirokonto' AND a.user_id = 'da594080-c68a-4a64-95cc-5a6bb5256abb';

INSERT INTO transactions (account_id, amount, description, category, date, type, user_id) 
SELECT a.id, 3200.00, 'Gehalt März 2023', 'Einkommen', '2023-03-01', 'income', 'da594080-c68a-4a64-95cc-5a6bb5256abb' 
FROM accounts a WHERE a.name = 'Hauptgirokonto' AND a.user_id = 'da594080-c68a-4a64-95cc-5a6bb5256abb';

INSERT INTO transactions (account_id, amount, description, category, date, type, user_id) 
SELECT a.id, 3200.00, 'Gehalt April 2023', 'Einkommen', '2023-04-01', 'income', 'da594080-c68a-4a64-95cc-5a6bb5256abb' 
FROM accounts a WHERE a.name = 'Hauptgirokonto' AND a.user_id = 'da594080-c68a-4a64-95cc-5a6bb5256abb';

INSERT INTO transactions (account_id, amount, description, category, date, type, user_id) 
SELECT a.id, 3200.00, 'Gehalt Mai 2023', 'Einkommen', '2023-05-01', 'income', 'da594080-c68a-4a64-95cc-5a6bb5256abb' 
FROM accounts a WHERE a.name = 'Hauptgirokonto' AND a.user_id = 'da594080-c68a-4a64-95cc-5a6bb5256abb';

INSERT INTO transactions (account_id, amount, description, category, date, type, user_id) 
SELECT a.id, 3200.00, 'Gehalt Juni 2023', 'Einkommen', '2023-06-01', 'income', 'da594080-c68a-4a64-95cc-5a6bb5256abb' 
FROM accounts a WHERE a.name = 'Hauptgirokonto' AND a.user_id = 'da594080-c68a-4a64-95cc-5a6bb5256abb';

INSERT INTO transactions (account_id, amount, description, category, date, type, user_id) 
SELECT a.id, 3200.00, 'Gehalt Juli 2023', 'Einkommen', '2023-07-01', 'income', 'da594080-c68a-4a64-95cc-5a6bb5256abb' 
FROM accounts a WHERE a.name = 'Hauptgirokonto' AND a.user_id = 'da594080-c68a-4a64-95cc-5a6bb5256abb';

INSERT INTO transactions (account_id, amount, description, category, date, type, user_id) 
SELECT a.id, 3200.00, 'Gehalt August 2023', 'Einkommen', '2023-08-01', 'income', 'da594080-c68a-4a64-95cc-5a6bb5256abb' 
FROM accounts a WHERE a.name = 'Hauptgirokonto' AND a.user_id = 'da594080-c68a-4a64-95cc-5a6bb5256abb';

INSERT INTO transactions (account_id, amount, description, category, date, type, user_id) 
SELECT a.id, 3200.00, 'Gehalt September 2023', 'Einkommen', '2023-09-01', 'income', 'da594080-c68a-4a64-95cc-5a6bb5256abb' 
FROM accounts a WHERE a.name = 'Hauptgirokonto' AND a.user_id = 'da594080-c68a-4a64-95cc-5a6bb5256abb';

INSERT INTO transactions (account_id, amount, description, category, date, type, user_id) 
SELECT a.id, 3200.00, 'Gehalt Oktober 2023', 'Einkommen', '2023-10-01', 'income', 'da594080-c68a-4a64-95cc-5a6bb5256abb' 
FROM accounts a WHERE a.name = 'Hauptgirokonto' AND a.user_id = 'da594080-c68a-4a64-95cc-5a6bb5256abb';

INSERT INTO transactions (account_id, amount, description, category, date, type, user_id) 
SELECT a.id, 3200.00, 'Gehalt November 2023', 'Einkommen', '2023-11-01', 'income', 'da594080-c68a-4a64-95cc-5a6bb5256abb' 
FROM accounts a WHERE a.name = 'Hauptgirokonto' AND a.user_id = 'da594080-c68a-4a64-95cc-5a6bb5256abb';

INSERT INTO transactions (account_id, amount, description, category, date, type, user_id) 
SELECT a.id, 3200.00, 'Gehalt Dezember 2023', 'Einkommen', '2023-12-01', 'income', 'da594080-c68a-4a64-95cc-5a6bb5256abb' 
FROM accounts a WHERE a.name = 'Hauptgirokonto' AND a.user_id = 'da594080-c68a-4a64-95cc-5a6bb5256abb';

INSERT INTO transactions (account_id, amount, description, category, date, type, user_id) 
SELECT a.id, 800.00, 'Weihnachtsgeld 2023', 'Einkommen', '2023-12-15', 'income', 'da594080-c68a-4a64-95cc-5a6bb5256abb' 
FROM accounts a WHERE a.name = 'Hauptgirokonto' AND a.user_id = 'da594080-c68a-4a64-95cc-5a6bb5256abb';

-- Monthly rent payments for 2023
INSERT INTO transactions (account_id, amount, description, category, date, type, user_id) 
SELECT a.id, -850.00, 'Miete Januar 2023', 'Wohnen', '2023-01-01', 'expense', 'da594080-c68a-4a64-95cc-5a6bb5256abb' 
FROM accounts a WHERE a.name = 'Hauptgirokonto' AND a.user_id = 'da594080-c68a-4a64-95cc-5a6bb5256abb';

INSERT INTO transactions (account_id, amount, description, category, date, type, user_id) 
SELECT a.id, -850.00, 'Miete Februar 2023', 'Wohnen', '2023-02-01', 'expense', 'da594080-c68a-4a64-95cc-5a6bb5256abb' 
FROM accounts a WHERE a.name = 'Hauptgirokonto' AND a.user_id = 'da594080-c68a-4a64-95cc-5a6bb5256abb';

INSERT INTO transactions (account_id, amount, description, category, date, type, user_id) 
SELECT a.id, -850.00, 'Miete März 2023', 'Wohnen', '2023-03-01', 'expense', 'da594080-c68a-4a64-95cc-5a6bb5256abb' 
FROM accounts a WHERE a.name = 'Hauptgirokonto' AND a.user_id = 'da594080-c68a-4a64-95cc-5a6bb5256abb';

INSERT INTO transactions (account_id, amount, description, category, date, type, user_id) 
SELECT a.id, -850.00, 'Miete April 2023', 'Wohnen', '2023-04-01', 'expense', 'da594080-c68a-4a64-95cc-5a6bb5256abb' 
FROM accounts a WHERE a.name = 'Hauptgirokonto' AND a.user_id = 'da594080-c68a-4a64-95cc-5a6bb5256abb';

INSERT INTO transactions (account_id, amount, description, category, date, type, user_id) 
SELECT a.id, -850.00, 'Miete Mai 2023', 'Wohnen', '2023-05-01', 'expense', 'da594080-c68a-4a64-95cc-5a6bb5256abb' 
FROM accounts a WHERE a.name = 'Hauptgirokonto' AND a.user_id = 'da594080-c68a-4a64-95cc-5a6bb5256abb';

INSERT INTO transactions (account_id, amount, description, category, date, type, user_id) 
SELECT a.id, -850.00, 'Miete Juni 2023', 'Wohnen', '2023-06-01', 'expense', 'da594080-c68a-4a64-95cc-5a6bb5256abb' 
FROM accounts a WHERE a.name = 'Hauptgirokonto' AND a.user_id = 'da594080-c68a-4a64-95cc-5a6bb5256abb';

INSERT INTO transactions (account_id, amount, description, category, date, type, user_id) 
SELECT a.id, -850.00, 'Miete Juli 2023', 'Wohnen', '2023-07-01', 'expense', 'da594080-c68a-4a64-95cc-5a6bb5256abb' 
FROM accounts a WHERE a.name = 'Hauptgirokonto' AND a.user_id = 'da594080-c68a-4a64-95cc-5a6bb5256abb';

INSERT INTO transactions (account_id, amount, description, category, date, type, user_id) 
SELECT a.id, -850.00, 'Miete August 2023', 'Wohnen', '2023-08-01', 'expense', 'da594080-c68a-4a64-95cc-5a6bb5256abb' 
FROM accounts a WHERE a.name = 'Hauptgirokonto' AND a.user_id = 'da594080-c68a-4a64-95cc-5a6bb5256abb';

INSERT INTO transactions (account_id, amount, description, category, date, type, user_id) 
SELECT a.id, -850.00, 'Miete September 2023', 'Wohnen', '2023-09-01', 'expense', 'da594080-c68a-4a64-95cc-5a6bb5256abb' 
FROM accounts a WHERE a.name = 'Hauptgirokonto' AND a.user_id = 'da594080-c68a-4a64-95cc-5a6bb5256abb';

INSERT INTO transactions (account_id, amount, description, category, date, type, user_id) 
SELECT a.id, -850.00, 'Miete Oktober 2023', 'Wohnen', '2023-10-01', 'expense', 'da594080-c68a-4a64-95cc-5a6bb5256abb' 
FROM accounts a WHERE a.name = 'Hauptgirokonto' AND a.user_id = 'da594080-c68a-4a64-95cc-5a6bb5256abb';

INSERT INTO transactions (account_id, amount, description, category, date, type, user_id) 
SELECT a.id, -850.00, 'Miete November 2023', 'Wohnen', '2023-11-01', 'expense', 'da594080-c68a-4a64-95cc-5a6bb5256abb' 
FROM accounts a WHERE a.name = 'Hauptgirokonto' AND a.user_id = 'da594080-c68a-4a64-95cc-5a6bb5256abb';

INSERT INTO transactions (account_id, amount, description, category, date, type, user_id) 
SELECT a.id, -850.00, 'Miete Dezember 2023', 'Wohnen', '2023-12-01', 'expense', 'da594080-c68a-4a64-95cc-5a6bb5256abb' 
FROM accounts a WHERE a.name = 'Hauptgirokonto' AND a.user_id = 'da594080-c68a-4a64-95cc-5a6bb5256abb';

-- === 2024 SAMPLE TRANSACTIONS ===

-- Insert sample transactions for 2024
INSERT INTO transactions (account_id, amount, description, category, date, type, user_id) 
SELECT a.id, 3200.00, 'Gehalt Januar 2024', 'Einkommen', '2024-01-01', 'income', 'da594080-c68a-4a64-95cc-5a6bb5256abb' 
FROM accounts a WHERE a.name = 'Hauptgirokonto' AND a.user_id = 'da594080-c68a-4a64-95cc-5a6bb5256abb';

INSERT INTO transactions (account_id, amount, description, category, date, type, user_id) 
SELECT a.id, 3200.00, 'Gehalt Februar 2024', 'Einkommen', '2024-02-01', 'income', 'da594080-c68a-4a64-95cc-5a6bb5256abb' 
FROM accounts a WHERE a.name = 'Hauptgirokonto' AND a.user_id = 'da594080-c68a-4a64-95cc-5a6bb5256abb';

INSERT INTO transactions (account_id, amount, description, category, date, type, user_id) 
SELECT a.id, 3200.00, 'Gehalt März 2024', 'Einkommen', '2024-03-01', 'income', 'da594080-c68a-4a64-95cc-5a6bb5256abb' 
FROM accounts a WHERE a.name = 'Hauptgirokonto' AND a.user_id = 'da594080-c68a-4a64-95cc-5a6bb5256abb';

INSERT INTO transactions (account_id, amount, description, category, date, type, user_id) 
SELECT a.id, -850.00, 'Miete Januar 2024', 'Wohnen', '2024-01-01', 'expense', 'da594080-c68a-4a64-95cc-5a6bb5256abb' 
FROM accounts a WHERE a.name = 'Hauptgirokonto' AND a.user_id = 'da594080-c68a-4a64-95cc-5a6bb5256abb';

INSERT INTO transactions (account_id, amount, description, category, date, type, user_id) 
SELECT a.id, -420.00, 'Lebensmittel Januar 2024', 'Lebensmittel', '2024-01-03', 'expense', 'da594080-c68a-4a64-95cc-5a6bb5256abb' 
FROM accounts a WHERE a.name = 'Hauptgirokonto' AND a.user_id = 'da594080-c68a-4a64-95cc-5a6bb5256abb';

INSERT INTO transactions (account_id, amount, description, category, date, type, user_id) 
SELECT a.id, -89.99, 'Tankstelle Januar 2024', 'Transport', '2024-01-05', 'expense', 'da594080-c68a-4a64-95cc-5a6bb5256abb' 
FROM accounts a WHERE a.name = 'Kreditkarte' AND a.user_id = 'da594080-c68a-4a64-95cc-5a6bb5256abb';

-- Insert sample budgets
INSERT INTO budgets (category, budget_amount, spent_amount, period, color, user_id) VALUES
('Lebensmittel', 500.00, 420.00, 'monthly', '#EF4444', 'da594080-c68a-4a64-95cc-5a6bb5256abb'),
('Transport', 200.00, 89.99, 'monthly', '#F59E0B', 'da594080-c68a-4a64-95cc-5a6bb5256abb'),
('Wohnen', 1000.00, 850.00, 'monthly', '#8B5CF6', 'da594080-c68a-4a64-95cc-5a6bb5256abb'),
('Unterhaltung', 150.00, 45.00, 'monthly', '#10B986', 'da594080-c68a-4a64-95cc-5a6bb5256abb'),
('Nebenkosten', 300.00, 150.00, 'monthly', '#3B82F6', 'da594080-c68a-4a64-95cc-5a6bb5256abb');

-- Insert sample financial goals
INSERT INTO financial_goals (title, target_amount, current_amount, target_date, category, user_id) VALUES
('Notfallfonds', 10000.00, 5000.00, '2024-12-31', 'Notfall', 'da594080-c68a-4a64-95cc-5a6bb5256abb'),
('Japanreise', 3500.00, 1200.00, '2024-09-15', 'Reise', 'da594080-c68a-4a64-95cc-5a6bb5256abb'),
('Neues Auto', 15000.00, 3500.00, '2025-06-30', 'Transport', 'da594080-c68a-4a64-95cc-5a6bb5256abb'),
('Hauserneuerung', 25000.00, 8500.00, '2025-12-01', 'Wohnen', 'da594080-c68a-4a64-95cc-5a6bb5256abb');
