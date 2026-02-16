import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "03-yoy-growth",
  title: "Year-over-Year Growth",
  difficulty: "hard",
  category: "window-functions",
  description: `## Year-over-Year Growth

Given a \`monthly_revenue\` table, calculate the **year-over-year growth percentage** for each month.

### Schema

| Column | Type |
|--------|------|
| year | INTEGER |
| month | INTEGER |
| revenue | DECIMAL(12,2) |

### Expected output columns
\`year\`, \`month\`, \`revenue\`, \`prev_year_revenue\`, \`yoy_growth_pct\`

- \`prev_year_revenue\`: revenue for the same month in the previous year (NULL if no previous year)
- \`yoy_growth_pct\`: \`((revenue - prev_year_revenue) / prev_year_revenue) * 100\`, rounded to 2 decimals (NULL if no previous year)

Order by year ASC, month ASC.`,
  hint: "Use LAG(revenue) OVER (PARTITION BY month ORDER BY year) to get the previous year's revenue for the same month.",
  schema: `CREATE TABLE monthly_revenue (
  year INTEGER,
  month INTEGER,
  revenue DECIMAL(12,2)
);

INSERT INTO monthly_revenue VALUES
  (2022, 1, 10000.00),
  (2022, 2, 12000.00),
  (2022, 3, 11000.00),
  (2022, 6, 15000.00),
  (2023, 1, 12000.00),
  (2023, 2, 11500.00),
  (2023, 3, 13200.00),
  (2023, 6, 16500.00),
  (2024, 1, 14400.00),
  (2024, 2, 13000.00),
  (2024, 3, 15000.00),
  (2024, 6, 18000.00);`,
  solutionQuery: `SELECT
  year,
  month,
  revenue,
  LAG(revenue) OVER (PARTITION BY month ORDER BY year) as prev_year_revenue,
  ROUND(
    ((revenue - LAG(revenue) OVER (PARTITION BY month ORDER BY year))
    / LAG(revenue) OVER (PARTITION BY month ORDER BY year)) * 100,
    2
  ) as yoy_growth_pct
FROM monthly_revenue
ORDER BY year, month;`,
  solutionExplanation: `## Explanation

### LAG() Window Function
\`LAG(revenue) OVER (PARTITION BY month ORDER BY year)\`
- Looks at the previous row within the same month partition
- Since we partition by month and order by year, it gives us the same month's revenue from the previous year

### YoY Growth Formula
\`((current - previous) / previous) * 100\`
- A positive result means growth
- A negative result means decline
- NULL when there's no previous year data

### Key Concepts
- \`PARTITION BY month\` groups data by month so we compare Jan-to-Jan, Feb-to-Feb, etc.
- \`ORDER BY year\` ensures LAG looks at the previous year
- Multiple references to the same window function are optimized by the query planner`,
  testCases: [
    {
      name: "default",
      description: "YoY growth across 3 years",
      expectedColumns: ["year", "month", "revenue", "prev_year_revenue", "yoy_growth_pct"],
      expectedRows: [
        { year: 2022, month: 1, revenue: 10000.00, prev_year_revenue: null, yoy_growth_pct: null },
        { year: 2022, month: 2, revenue: 12000.00, prev_year_revenue: null, yoy_growth_pct: null },
        { year: 2022, month: 3, revenue: 11000.00, prev_year_revenue: null, yoy_growth_pct: null },
        { year: 2022, month: 6, revenue: 15000.00, prev_year_revenue: null, yoy_growth_pct: null },
        { year: 2023, month: 1, revenue: 12000.00, prev_year_revenue: 10000.00, yoy_growth_pct: 20.00 },
        { year: 2023, month: 2, revenue: 11500.00, prev_year_revenue: 12000.00, yoy_growth_pct: -4.17 },
        { year: 2023, month: 3, revenue: 13200.00, prev_year_revenue: 11000.00, yoy_growth_pct: 20.00 },
        { year: 2023, month: 6, revenue: 16500.00, prev_year_revenue: 15000.00, yoy_growth_pct: 10.00 },
        { year: 2024, month: 1, revenue: 14400.00, prev_year_revenue: 12000.00, yoy_growth_pct: 20.00 },
        { year: 2024, month: 2, revenue: 13000.00, prev_year_revenue: 11500.00, yoy_growth_pct: 13.04 },
        { year: 2024, month: 3, revenue: 15000.00, prev_year_revenue: 13200.00, yoy_growth_pct: 13.64 },
        { year: 2024, month: 6, revenue: 18000.00, prev_year_revenue: 16500.00, yoy_growth_pct: 9.09 },
      ],
      orderMatters: true,
    },
    {
      name: "handles-null",
      description: "First year has NULL for prev_year and growth",
      setupSql: `DELETE FROM monthly_revenue WHERE year > 2022;`,
      expectedColumns: ["year", "month", "revenue", "prev_year_revenue", "yoy_growth_pct"],
      expectedRows: [
        { year: 2022, month: 1, revenue: 10000.00, prev_year_revenue: null, yoy_growth_pct: null },
        { year: 2022, month: 2, revenue: 12000.00, prev_year_revenue: null, yoy_growth_pct: null },
        { year: 2022, month: 3, revenue: 11000.00, prev_year_revenue: null, yoy_growth_pct: null },
        { year: 2022, month: 6, revenue: 15000.00, prev_year_revenue: null, yoy_growth_pct: null },
      ],
      orderMatters: false,
    },
  ],
};
