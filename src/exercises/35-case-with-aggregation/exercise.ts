import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "35-case-with-aggregation",
  title: "Monthly Order Size Distribution",
  difficulty: "easy",
  category: "null-handling",
  description: `## Monthly Order Size Distribution

Management wants a summary report showing how many orders fall into each size bucket per month. The same shipping tier rules apply:

- **Small**: order total under $50
- **Medium**: order total from $50 to $200 (inclusive)
- **Large**: order total over $200

They want one row per month with columns for the count of each tier.

### Schema

**orders**
| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_name | VARCHAR |
| order_total | DECIMAL(10,2) |
| order_date | DATE |

### Task

Write a query that returns:
- \`order_month\`: the first day of the month (e.g., \`'2024-01-01'\`)
- \`small_count\`: number of Small orders (total < $50)
- \`medium_count\`: number of Medium orders ($50 <= total <= $200)
- \`large_count\`: number of Large orders (total > $200)

### Expected output columns
\`order_month\`, \`small_count\`, \`medium_count\`, \`large_count\`

Order by \`order_month\` ASC.`,
  hint: "Combine CASE WHEN with SUM or COUNT to count rows conditionally. For example: SUM(CASE WHEN condition THEN 1 ELSE 0 END) counts how many rows match the condition. Use DATE_TRUNC('month', order_date) to group by month.",
  schema: `CREATE TABLE orders (
  order_id INTEGER,
  customer_name VARCHAR,
  order_total DECIMAL(10,2),
  order_date DATE
);

INSERT INTO orders VALUES
  (1, 'Alice Johnson', 25.00, '2024-01-05'),
  (2, 'Bob Smith', 150.00, '2024-01-12'),
  (3, 'Carol White', 320.00, '2024-01-20'),
  (4, 'David Brown', 49.99, '2024-01-25'),
  (5, 'Eva Martinez', 75.00, '2024-02-02'),
  (6, 'Frank Lee', 12.50, '2024-02-08'),
  (7, 'Grace Kim', 250.00, '2024-02-14'),
  (8, 'Hank Davis', 200.00, '2024-02-19'),
  (9, 'Irene Clark', 35.00, '2024-02-25'),
  (10, 'Jack Wilson', 500.00, '2024-03-03'),
  (11, 'Karen Hall', 89.99, '2024-03-10'),
  (12, 'Leo Turner', 10.00, '2024-03-15'),
  (13, 'Mia Scott', 175.00, '2024-03-20'),
  (14, 'Noah Adams', 45.00, '2024-03-22'),
  (15, 'Olivia Reed', 300.00, '2024-03-28'),
  (16, 'Pete Garcia', 60.00, '2024-01-30'),
  (17, 'Quinn Foster', 8.99, '2024-02-11'),
  (18, 'Rachel Nguyen', 410.00, '2024-03-05');`,
  solutionQuery: `SELECT
  DATE_TRUNC('month', order_date) AS order_month,
  SUM(CASE WHEN order_total < 50 THEN 1 ELSE 0 END) AS small_count,
  SUM(CASE WHEN order_total >= 50 AND order_total <= 200 THEN 1 ELSE 0 END) AS medium_count,
  SUM(CASE WHEN order_total > 200 THEN 1 ELSE 0 END) AS large_count
FROM orders
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY order_month;`,
  solutionExplanation: `## Explanation

### Pattern: Conditional Aggregation (CASE WHEN + SUM)

This exercise combines **CASE WHEN** with **SUM** to create a pivot-style summary in a single pass over the data.

### Step-by-step
1. **DATE_TRUNC('month', order_date) AS order_month**: Truncates each date to the first day of its month, creating a grouping key. For example, \`'2024-01-15'\` becomes \`'2024-01-01'\`.
2. **SUM(CASE WHEN order_total < 50 THEN 1 ELSE 0 END) AS small_count**: For each row, the CASE expression returns 1 if the order is "Small" and 0 otherwise. SUM then counts how many 1s there are per month.
3. The same pattern is repeated for Medium and Large tiers with appropriate conditions.
4. **GROUP BY DATE_TRUNC('month', order_date)**: Aggregates rows by month.
5. **ORDER BY order_month**: Sorts chronologically.

### Why this approach
Conditional aggregation lets you compute multiple filtered counts in a single query without subqueries or multiple passes. This is the standard pattern for creating cross-tabulations (pivots) in SQL. It is more efficient and readable than writing separate queries per category and joining them together.

### When to use
- Pivot-style reports: counts or sums broken down by category within each group
- Dashboard metrics: showing multiple KPI breakdowns in a single result set
- Status distribution reports (e.g., orders by status per month, tickets by priority per team)
- Any time you need to count or sum values conditionally within a GROUP BY

### DuckDB note
DuckDB also supports the \`COUNT(*) FILTER (WHERE condition)\` syntax as a cleaner alternative to \`SUM(CASE WHEN ... THEN 1 ELSE 0 END)\`. Both approaches are correct.`,
  testCases: [
    {
      name: "default",
      description: "Returns monthly distribution of Small, Medium, and Large orders",
      expectedColumns: ["order_month", "small_count", "medium_count", "large_count"],
      expectedRows: [
        { order_month: "2024-01-01", small_count: 2, medium_count: 2, large_count: 1 },
        { order_month: "2024-02-01", small_count: 3, medium_count: 2, large_count: 1 },
        { order_month: "2024-03-01", small_count: 2, medium_count: 2, large_count: 2 },
      ],
      orderMatters: true,
    },
    {
      name: "single-month-all-large",
      description: "When a month has only Large orders, Small and Medium counts should be zero",
      setupSql: `DELETE FROM orders; INSERT INTO orders VALUES
  (100, 'Test User A', 999.99, '2024-06-01'),
  (101, 'Test User B', 250.00, '2024-06-15'),
  (102, 'Test User C', 500.00, '2024-06-20');`,
      expectedColumns: ["order_month", "small_count", "medium_count", "large_count"],
      expectedRows: [
        { order_month: "2024-06-01", small_count: 0, medium_count: 0, large_count: 3 },
      ],
      orderMatters: false,
    },
  ],
};
