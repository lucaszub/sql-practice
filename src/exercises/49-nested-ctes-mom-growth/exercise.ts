import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "49-nested-ctes-mom-growth",
  title: "Month-over-Month Revenue Growth",
  difficulty: "medium",
  category: "subqueries-ctes",
  description: `## Month-over-Month Revenue Growth

The CFO wants a monthly revenue report that includes the month-over-month (MoM) growth percentage. This helps identify revenue trends and seasonal patterns.

Write a query using CTEs and LAG to compute monthly revenue and its growth compared to the previous month.

### Schema

**invoices**
| Column | Type |
|--------|------|
| invoice_id | INTEGER |
| customer_name | VARCHAR |
| amount | DECIMAL(10,2) |
| invoice_date | DATE |

### Expected output columns
\`month\`, \`revenue\`, \`active_customers\`, \`prev_revenue\`, \`mom_growth_pct\`

Where:
- \`month\` = DATE_TRUNC('month', invoice_date)
- \`revenue\` = ROUND(SUM(amount), 2)
- \`active_customers\` = COUNT(DISTINCT customer_name)
- \`prev_revenue\` = previous month's revenue via LAG
- \`mom_growth_pct\` = ROUND(100.0 * (revenue - prev_revenue) / prev_revenue, 2)

Order by \`month\` ASC.`,
  hint: "Use two CTEs: (1) monthly_revenue: GROUP BY DATE_TRUNC('month', invoice_date) to compute monthly totals. (2) with_growth: use LAG(revenue) OVER (ORDER BY month) to get the previous month's revenue, then calculate the percentage change.",
  schema: `CREATE TABLE invoices (
  invoice_id INTEGER PRIMARY KEY,
  customer_name VARCHAR,
  amount DECIMAL(10,2),
  invoice_date DATE
);

INSERT INTO invoices VALUES
  (1, 'Acme Corp', 2500.00, '2024-01-05'),
  (2, 'Beta Inc', 500.00, '2024-01-12'),
  (3, 'Gamma LLC', 1200.00, '2024-01-20'),
  (4, 'Acme Corp', 2500.00, '2024-02-03'),
  (5, 'Beta Inc', 500.00, '2024-02-10'),
  (6, 'Gamma LLC', 1200.00, '2024-02-18'),
  (7, 'Delta Co', 3000.00, '2024-02-25'),
  (8, 'Acme Corp', 2500.00, '2024-03-05'),
  (9, 'Gamma LLC', 1500.00, '2024-03-12'),
  (10, 'Delta Co', 3000.00, '2024-03-20'),
  (11, 'Epsilon Ltd', 800.00, '2024-03-28'),
  (12, 'Acme Corp', 2500.00, '2024-04-02'),
  (13, 'Gamma LLC', 1500.00, '2024-04-10'),
  (14, 'Delta Co', 3000.00, '2024-04-18'),
  (15, 'Epsilon Ltd', 800.00, '2024-04-22'),
  (16, 'Zeta Corp', 2000.00, '2024-04-28');`,
  solutionQuery: `WITH monthly_revenue AS (
  SELECT
    DATE_TRUNC('month', invoice_date) AS month,
    ROUND(SUM(amount), 2) AS revenue,
    COUNT(DISTINCT customer_name) AS active_customers
  FROM invoices
  GROUP BY DATE_TRUNC('month', invoice_date)
),
with_growth AS (
  SELECT
    month,
    revenue,
    active_customers,
    LAG(revenue) OVER (ORDER BY month) AS prev_revenue,
    ROUND(
      100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
      / LAG(revenue) OVER (ORDER BY month),
      2
    ) AS mom_growth_pct
  FROM monthly_revenue
)
SELECT
  month,
  revenue,
  active_customers,
  prev_revenue,
  mom_growth_pct
FROM with_growth
ORDER BY month;`,
  solutionExplanation: `## Explanation

### Pattern: CTEs + LAG for Period-over-Period Growth

This combines **CTE decomposition** with the **LAG window function** to compute month-over-month growth.

### Step-by-step
1. **monthly_revenue CTE**: Aggregates invoices by month using DATE_TRUNC, computing total revenue and distinct customer count.
2. **with_growth CTE**: Uses LAG(revenue) OVER (ORDER BY month) to access the previous month's revenue, then calculates the percentage change.
3. **Final SELECT**: Returns all months with their growth metrics.

### Why LAG?
LAG(column) OVER (ORDER BY ...) returns the value from the previous row in the specified order. It's the standard way to do period-over-period comparisons without self-joins.

### Note on NULL
The first month has no previous month, so prev_revenue and mom_growth_pct are NULL -- this is expected and correct.

### When to use
- Month-over-month, quarter-over-quarter, year-over-year growth reports
- Trend analysis dashboards
- Any comparison of a metric to its prior period value`,
  testCases: [
    {
      name: "default",
      description: "Returns 4 months with MoM growth, first month has NULL growth",
      expectedColumns: ["month", "revenue", "active_customers", "prev_revenue", "mom_growth_pct"],
      expectedRows: [
        { month: "2024-01-01", revenue: 4200.00, active_customers: 3, prev_revenue: null, mom_growth_pct: null },
        { month: "2024-02-01", revenue: 7200.00, active_customers: 4, prev_revenue: 4200.00, mom_growth_pct: 71.43 },
        { month: "2024-03-01", revenue: 7800.00, active_customers: 4, prev_revenue: 7200.00, mom_growth_pct: 8.33 },
        { month: "2024-04-01", revenue: 9800.00, active_customers: 5, prev_revenue: 7800.00, mom_growth_pct: 25.64 },
      ],
      orderMatters: true,
    },
    {
      name: "two-months-only",
      description: "With only two months of data, one growth value is computed",
      setupSql: `DELETE FROM invoices WHERE invoice_date >= '2024-03-01';`,
      expectedColumns: ["month", "revenue", "active_customers", "prev_revenue", "mom_growth_pct"],
      expectedRows: [
        { month: "2024-01-01", revenue: 4200.00, active_customers: 3, prev_revenue: null, mom_growth_pct: null },
        { month: "2024-02-01", revenue: 7200.00, active_customers: 4, prev_revenue: 4200.00, mom_growth_pct: 71.43 },
      ],
      orderMatters: true,
    },
  ],
};
