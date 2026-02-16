import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "19-sum-avg-revenue",
  title: "Monthly Revenue and Average Order Value",
  difficulty: "easy",
  category: "aggregation",
  description: `## Monthly Revenue and Average Order Value

Finance needs a report showing **total revenue** and **average order value** for each month. This will feed into the monthly P&L and help spot seasonal trends.

### Schema

**orders**
| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| order_date | DATE |
| total_amount | DECIMAL(10,2) |

### Task

Write a query that returns, for each month:
- \`order_month\`: the month extracted from \`order_date\` (as an integer, e.g. 1 for January)
- \`total_revenue\`: the sum of \`total_amount\` for that month
- \`avg_order_value\`: the average \`total_amount\` per order for that month, rounded to 2 decimal places

Only include orders that have a non-NULL \`total_amount\`.

Order by \`order_month\` ASC.

### Expected output columns
\`order_month\`, \`total_revenue\`, \`avg_order_value\``,
  hint: "Use EXTRACT(MONTH FROM order_date) or MONTH(order_date) to get the month. SUM() adds values; AVG() computes the mean. Use ROUND() for rounding. Remember to filter out NULLs with a WHERE clause.",
  schema: `CREATE TABLE orders (
  order_id INTEGER,
  customer_id INTEGER,
  order_date DATE,
  total_amount DECIMAL(10,2)
);

INSERT INTO orders VALUES
  (1, 101, '2024-01-05', 59.99),
  (2, 102, '2024-01-08', 129.50),
  (3, 101, '2024-01-15', 24.99),
  (4, 103, '2024-01-20', 89.00),
  (5, 104, '2024-02-02', 210.00),
  (6, 101, '2024-02-10', 15.75),
  (7, 105, '2024-02-14', 74.50),
  (8, 102, '2024-02-22', 45.00),
  (9, 106, '2024-03-01', 320.00),
  (10, 103, '2024-03-10', 55.25),
  (11, 107, '2024-03-15', NULL),
  (12, 101, '2024-03-25', 99.99),
  (13, 108, '2024-04-05', 175.00),
  (14, 104, '2024-04-12', 62.50);`,
  solutionQuery: `SELECT
  EXTRACT(MONTH FROM order_date) AS order_month,
  SUM(total_amount) AS total_revenue,
  ROUND(AVG(total_amount), 2) AS avg_order_value
FROM orders
WHERE total_amount IS NOT NULL
GROUP BY EXTRACT(MONTH FROM order_date)
ORDER BY order_month;`,
  solutionExplanation: `## Explanation

### Pattern: SUM and AVG Aggregation by Group

This query demonstrates the two most common numeric aggregate functions grouped by a time period.

### Step-by-step
1. **\`WHERE total_amount IS NOT NULL\`**: Filters out orders with missing amounts before aggregation. While \`SUM\` and \`AVG\` already skip NULLs, explicitly filtering ensures the row is excluded entirely (not counted in any aggregate).
2. **\`EXTRACT(MONTH FROM order_date)\`**: Pulls the integer month (1-12) from the date column.
3. **\`SUM(total_amount)\`**: Adds up all order amounts within each month.
4. **\`AVG(total_amount)\`**: Computes the mean order amount per month.
5. **\`ROUND(..., 2)\`**: Rounds the average to 2 decimal places for clean reporting.
6. **\`GROUP BY\`**: Groups rows by month so each aggregate applies to one month's orders.

### Why this approach
- \`SUM\` and \`AVG\` are the workhorses of financial reporting. Together they tell you both total volume and per-unit economics.
- Rounding ensures consistent output format, which matters for downstream reports and dashboards.

### When to use
- Monthly/quarterly revenue reports
- Computing average order value (AOV) for marketing optimization
- Any time-series financial aggregation`,
  testCases: [
    {
      name: "default",
      description: "Monthly totals and averages from the base dataset",
      expectedColumns: ["order_month", "total_revenue", "avg_order_value"],
      expectedRows: [
        { order_month: 1, total_revenue: 303.48, avg_order_value: 75.87 },
        { order_month: 2, total_revenue: 345.25, avg_order_value: 86.31 },
        { order_month: 3, total_revenue: 475.24, avg_order_value: 158.41 },
        { order_month: 4, total_revenue: 237.50, avg_order_value: 118.75 },
      ],
      orderMatters: true,
    },
    {
      name: "single-order-month",
      description:
        "When a month has only one order, SUM and AVG should be equal",
      setupSql: `DELETE FROM orders WHERE EXTRACT(MONTH FROM order_date) = 4 AND order_id = 14;`,
      expectedColumns: ["order_month", "total_revenue", "avg_order_value"],
      expectedRows: [
        { order_month: 1, total_revenue: 303.48, avg_order_value: 75.87 },
        { order_month: 2, total_revenue: 345.25, avg_order_value: 86.31 },
        { order_month: 3, total_revenue: 475.24, avg_order_value: 158.41 },
        { order_month: 4, total_revenue: 175.00, avg_order_value: 175.00 },
      ],
      orderMatters: true,
    },
  ],
};
