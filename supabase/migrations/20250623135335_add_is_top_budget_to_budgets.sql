-- Add is_top_budget column to budgets table
ALTER TABLE budgets 
ADD COLUMN is_top_budget BOOLEAN DEFAULT FALSE NOT NULL;

-- Add an index on is_top_budget for better query performance
CREATE INDEX idx_budgets_is_top_budget ON budgets(is_top_budget);

-- Add a comment to document the column
COMMENT ON COLUMN budgets.is_top_budget IS 'Indicates if this budget should be shown as a top budget on the dashboard';
