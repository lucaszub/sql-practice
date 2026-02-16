import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "46-cte-revenue-breakdown",
  title: "Monthly Revenue by Plan Tier",
  difficulty: "medium",
  category: "subqueries-ctes",
  description: `## Monthly Revenue by Plan Tier

Finance needs a clean monthly revenue breakdown by plan tier. For each month and tier, they want to see the tier revenue, number of invoices, the month's total revenue, and what percentage each tier represents.

Write a query using CTEs to produce a readable revenue breakdown.

### Schema

**invoices**
| Column | Type |
|--------|------|
| invoice_id | INTEGER |
| customer_name | VARCHAR |
| plan_tier | VARCHAR |
| amount | DECIMAL(10,2) |
| invoice_month | DATE |

### Expected output columns
\`invoice_month\`, \`plan_tier\`, \`tier_revenue\`, \`num_invoices\`, \`total_revenue\`, \`pct_of_monthly\`

Where \`pct_of_monthly\` = ROUND(100.0 * tier_revenue / total_revenue, 1).

Order by \`invoice_month\` ASC, then \`tier_revenue\` DESC.`,
  hint: "Use two CTEs: the first groups by invoice_month + plan_tier to get tier_revenue. The second groups by invoice_month alone to get total_revenue. Then JOIN them in the final SELECT.",
  schema: `CREATE TABLE invoices (
  invoice_id INTEGER PRIMARY KEY,
  customer_name VARCHAR,
  plan_tier VARCHAR,
  amount DECIMAL(10,2),
  invoice_month DATE
);

INSERT INTO invoices VALUES
  (1, 'Acme Corp', 'Enterprise', 2500.00, '2024-01-01'),
  (2, 'Beta Inc', 'Starter', 500.00, '2024-01-01'),
  (3, 'Gamma LLC', 'Professional', 1200.00, '2024-01-01'),
  (4, 'Epsilon Ltd', 'Starter', 500.00, '2024-01-01'),
  (5, 'Acme Corp', 'Enterprise', 2500.00, '2024-02-01'),
  (6, 'Beta Inc', 'Starter', 500.00, '2024-02-01'),
  (7, 'Gamma LLC', 'Professional', 1200.00, '2024-02-01'),
  (8, 'Delta Co', 'Enterprise', 3000.00, '2024-02-01'),
  (9, 'Eta Inc', 'Starter', 500.00, '2024-02-01'),
  (10, 'Acme Corp', 'Enterprise', 2500.00, '2024-03-01'),
  (11, 'Beta Inc', 'Starter', 500.00, '2024-03-01'),
  (12, 'Gamma LLC', 'Professional', 1200.00, '2024-03-01'),
  (13, 'Delta Co', 'Enterprise', 3000.00, '2024-03-01'),
  (14, 'Eta Inc', 'Starter', 500.00, '2024-03-01'),
  (15, 'Zeta Corp', 'Professional', 1500.00, '2024-03-01'),
  (16, 'Acme Corp', 'Enterprise', 2500.00, '2024-04-01'),
  (17, 'Gamma LLC', 'Professional', 1200.00, '2024-04-01'),
  (18, 'Delta Co', 'Enterprise', 3000.00, '2024-04-01'),
  (19, 'Eta Inc', 'Starter', 500.00, '2024-04-01'),
  (20, 'Zeta Corp', 'Professional', 1500.00, '2024-04-01'),
  (21, 'Theta LLC', 'Enterprise', 2800.00, '2024-04-01');`,
  solutionQuery: `WITH monthly_revenue AS (
  SELECT
    invoice_month,
    plan_tier,
    SUM(amount) AS tier_revenue,
    COUNT(*) AS num_invoices
  FROM invoices
  GROUP BY invoice_month, plan_tier
),
monthly_totals AS (
  SELECT
    invoice_month,
    SUM(tier_revenue) AS total_revenue
  FROM monthly_revenue
  GROUP BY invoice_month
)
SELECT
  mr.invoice_month,
  mr.plan_tier,
  mr.tier_revenue,
  mr.num_invoices,
  mt.total_revenue,
  ROUND(100.0 * mr.tier_revenue / mt.total_revenue, 1) AS pct_of_monthly
FROM monthly_revenue mr
JOIN monthly_totals mt ON mr.invoice_month = mt.invoice_month
ORDER BY mr.invoice_month, mr.tier_revenue DESC;`,
  solutionExplanation: `## Explanation

### Pattern: CTE Decomposition

This uses the **CTE decomposition** pattern to break a complex calculation into readable, named steps.

### Step-by-step
1. **monthly_revenue CTE**: Groups invoices by month and plan tier, computing tier-level revenue and invoice count.
2. **monthly_totals CTE**: Aggregates from monthly_revenue to get each month's total revenue.
3. **Final SELECT**: Joins the two CTEs to compute each tier's percentage of monthly total.

### Why CTEs instead of a single query?
You could compute this with a window function (SUM() OVER (PARTITION BY invoice_month)), but the CTE approach is more readable and easier to debug -- you can SELECT * FROM either CTE independently.

### When to use
- Revenue breakdowns by dimension (tier, region, channel)
- Any report needing both detail-level and summary-level numbers
- Dashboards with percentage-of-total calculations`,
  testCases: [
    {
      name: "default",
      description: "Returns monthly revenue breakdown by plan tier with percentages",
      expectedColumns: ["invoice_month", "plan_tier", "tier_revenue", "num_invoices", "total_revenue", "pct_of_monthly"],
      expectedRows: [
        { invoice_month: "2024-01-01", plan_tier: "Enterprise", tier_revenue: 2500.00, num_invoices: 1, total_revenue: 4700.00, pct_of_monthly: 53.2 },
        { invoice_month: "2024-01-01", plan_tier: "Professional", tier_revenue: 1200.00, num_invoices: 1, total_revenue: 4700.00, pct_of_monthly: 25.5 },
        { invoice_month: "2024-01-01", plan_tier: "Starter", tier_revenue: 1000.00, num_invoices: 2, total_revenue: 4700.00, pct_of_monthly: 21.3 },
        { invoice_month: "2024-02-01", plan_tier: "Enterprise", tier_revenue: 5500.00, num_invoices: 2, total_revenue: 7700.00, pct_of_monthly: 71.4 },
        { invoice_month: "2024-02-01", plan_tier: "Professional", tier_revenue: 1200.00, num_invoices: 1, total_revenue: 7700.00, pct_of_monthly: 15.6 },
        { invoice_month: "2024-02-01", plan_tier: "Starter", tier_revenue: 1000.00, num_invoices: 2, total_revenue: 7700.00, pct_of_monthly: 13.0 },
        { invoice_month: "2024-03-01", plan_tier: "Enterprise", tier_revenue: 5500.00, num_invoices: 2, total_revenue: 9200.00, pct_of_monthly: 59.8 },
        { invoice_month: "2024-03-01", plan_tier: "Professional", tier_revenue: 2700.00, num_invoices: 2, total_revenue: 9200.00, pct_of_monthly: 29.3 },
        { invoice_month: "2024-03-01", plan_tier: "Starter", tier_revenue: 1000.00, num_invoices: 2, total_revenue: 9200.00, pct_of_monthly: 10.9 },
        { invoice_month: "2024-04-01", plan_tier: "Enterprise", tier_revenue: 8300.00, num_invoices: 3, total_revenue: 11500.00, pct_of_monthly: 72.2 },
        { invoice_month: "2024-04-01", plan_tier: "Professional", tier_revenue: 2700.00, num_invoices: 2, total_revenue: 11500.00, pct_of_monthly: 23.5 },
        { invoice_month: "2024-04-01", plan_tier: "Starter", tier_revenue: 500.00, num_invoices: 1, total_revenue: 11500.00, pct_of_monthly: 4.3 },
      ],
      orderMatters: true,
    },
    {
      name: "single-month",
      description: "After keeping only January data, percentages for that month remain correct",
      setupSql: `DELETE FROM invoices WHERE invoice_month > '2024-01-31';`,
      expectedColumns: ["invoice_month", "plan_tier", "tier_revenue", "num_invoices", "total_revenue", "pct_of_monthly"],
      expectedRows: [
        { invoice_month: "2024-01-01", plan_tier: "Enterprise", tier_revenue: 2500.00, num_invoices: 1, total_revenue: 4700.00, pct_of_monthly: 53.2 },
        { invoice_month: "2024-01-01", plan_tier: "Professional", tier_revenue: 1200.00, num_invoices: 1, total_revenue: 4700.00, pct_of_monthly: 25.5 },
        { invoice_month: "2024-01-01", plan_tier: "Starter", tier_revenue: 1000.00, num_invoices: 2, total_revenue: 4700.00, pct_of_monthly: 21.3 },
      ],
      orderMatters: true,
    },
  ],
};
