import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "02-running-total",
  title: "Running Total & Moving Average",
  difficulty: "medium",
  category: "window-functions",
  description: `## Running Total & Moving Average

Given a \`daily_sales\` table, write a query that calculates for each day:
1. The **running total** of sales amount
2. The **7-day moving average** of sales amount

### Schema

| Column | Type |
|--------|------|
| sale_date | DATE |
| amount | DECIMAL(10,2) |

### Expected output columns
\`sale_date\`, \`amount\`, \`running_total\`, \`moving_avg_7d\`

Order by sale_date ASC. Round moving_avg_7d to 2 decimal places.`,
  hint: "Use SUM(amount) OVER (ORDER BY sale_date ROWS UNBOUNDED PRECEDING) for running total and ROUND(AVG(amount) OVER (ORDER BY sale_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), 2) for moving average.",
  schema: `CREATE TABLE daily_sales (
  sale_date DATE,
  amount DECIMAL(10,2)
);

INSERT INTO daily_sales VALUES
  ('2024-01-01', 100.00),
  ('2024-01-02', 150.00),
  ('2024-01-03', 200.00),
  ('2024-01-04', 120.00),
  ('2024-01-05', 180.00),
  ('2024-01-06', 90.00),
  ('2024-01-07', 210.00),
  ('2024-01-08', 160.00),
  ('2024-01-09', 140.00),
  ('2024-01-10', 300.00);`,
  solutionQuery: `SELECT
  sale_date,
  amount,
  SUM(amount) OVER (ORDER BY sale_date ROWS UNBOUNDED PRECEDING) as running_total,
  ROUND(AVG(amount) OVER (ORDER BY sale_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), 2) as moving_avg_7d
FROM daily_sales
ORDER BY sale_date;`,
  solutionExplanation: `## Explanation

### Running Total
\`SUM(amount) OVER (ORDER BY sale_date ROWS UNBOUNDED PRECEDING)\`
- Sums all rows from the start up to and including the current row
- \`ROWS UNBOUNDED PRECEDING\` means "from the very first row"

### 7-Day Moving Average
\`AVG(amount) OVER (ORDER BY sale_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)\`
- Averages the current row and the 6 preceding rows (7 total)
- For the first 6 rows, it averages fewer values (only available rows)

### Key Concepts
- \`ROWS BETWEEN\` defines the window frame
- \`UNBOUNDED PRECEDING\` = from the start
- \`6 PRECEDING AND CURRENT ROW\` = sliding window of 7 rows`,
  testCases: [
    {
      name: "default",
      description: "Running total and moving average for 10 days of sales",
      expectedColumns: ["sale_date", "amount", "running_total", "moving_avg_7d"],
      expectedRows: [
        { sale_date: "2024-01-01", amount: 100.00, running_total: 100.00, moving_avg_7d: 100.00 },
        { sale_date: "2024-01-02", amount: 150.00, running_total: 250.00, moving_avg_7d: 125.00 },
        { sale_date: "2024-01-03", amount: 200.00, running_total: 450.00, moving_avg_7d: 150.00 },
        { sale_date: "2024-01-04", amount: 120.00, running_total: 570.00, moving_avg_7d: 142.50 },
        { sale_date: "2024-01-05", amount: 180.00, running_total: 750.00, moving_avg_7d: 150.00 },
        { sale_date: "2024-01-06", amount: 90.00, running_total: 840.00, moving_avg_7d: 140.00 },
        { sale_date: "2024-01-07", amount: 210.00, running_total: 1050.00, moving_avg_7d: 150.00 },
        { sale_date: "2024-01-08", amount: 160.00, running_total: 1210.00, moving_avg_7d: 158.57 },
        { sale_date: "2024-01-09", amount: 140.00, running_total: 1350.00, moving_avg_7d: 157.14 },
        { sale_date: "2024-01-10", amount: 300.00, running_total: 1650.00, moving_avg_7d: 171.43 },
      ],
      orderMatters: true,
    },
    {
      name: "single-row",
      description: "Works with minimal data",
      setupSql: `DELETE FROM daily_sales WHERE sale_date > '2024-01-01';`,
      expectedColumns: ["sale_date", "amount", "running_total", "moving_avg_7d"],
      expectedRows: [
        { sale_date: "2024-01-01", amount: 100.00, running_total: 100.00, moving_avg_7d: 100.00 },
      ],
      orderMatters: true,
    },
  ],
};
