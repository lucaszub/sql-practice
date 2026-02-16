import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "44-scalar-subquery-above-avg",
  title: "High-Value Invoices Above Average",
  difficulty: "medium",
  category: "subqueries-ctes",
  description: `## High-Value Invoices Above Average

The sales team wants to flag invoices that are above the company-wide average invoice amount. These high-value invoices need extra attention for payment follow-up and account management.

Write a query that returns all invoices where the amount exceeds the overall average, using a scalar subquery.

### Schema

**invoices**
| Column | Type |
|--------|------|
| invoice_id | INTEGER |
| customer_name | VARCHAR |
| amount | DECIMAL(10,2) |
| plan_tier | VARCHAR |
| invoice_date | DATE |

### Expected output columns
\`invoice_id\`, \`customer_name\`, \`amount\`, \`plan_tier\`

Order by \`amount\` DESC.`,
  hint: "Use a subquery in the WHERE clause: WHERE amount > (SELECT AVG(amount) FROM invoices). This subquery returns a single value (scalar) that is computed once and compared against each row.",
  schema: `CREATE TABLE invoices (
  invoice_id INTEGER PRIMARY KEY,
  customer_name VARCHAR,
  amount DECIMAL(10,2),
  plan_tier VARCHAR,
  invoice_date DATE
);

INSERT INTO invoices VALUES
  (1, 'Acme Corp', 2500.00, 'Enterprise', '2024-01-15'),
  (2, 'Beta Inc', 500.00, 'Starter', '2024-01-20'),
  (3, 'Gamma LLC', 1200.00, 'Professional', '2024-02-01'),
  (4, 'Delta Co', 3500.00, 'Enterprise', '2024-02-10'),
  (5, 'Epsilon Ltd', 800.00, 'Professional', '2024-02-15'),
  (6, 'Zeta Corp', 150.00, 'Starter', '2024-03-01'),
  (7, 'Eta Inc', 4200.00, 'Enterprise', '2024-03-05'),
  (8, 'Theta LLC', 950.00, 'Professional', '2024-03-10'),
  (9, 'Iota Co', 300.00, 'Starter', '2024-03-15'),
  (10, 'Kappa Ltd', 1800.00, 'Professional', '2024-03-20'),
  (11, 'Lambda Corp', 2200.00, 'Enterprise', '2024-04-01'),
  (12, 'Mu Inc', 600.00, 'Starter', '2024-04-05');`,
  solutionQuery: `SELECT
  invoice_id,
  customer_name,
  amount,
  plan_tier
FROM invoices
WHERE amount > (SELECT AVG(amount) FROM invoices)
ORDER BY amount DESC;`,
  solutionExplanation: `## Explanation

### Pattern: Scalar Subquery

This uses a **scalar subquery** -- a subquery that returns exactly one value -- to filter rows based on an aggregate computed over the entire table.

### Step-by-step
1. **Inner query**: \`SELECT AVG(amount) FROM invoices\` computes the overall average (1558.33).
2. **WHERE amount >**: Compares each row's amount to this single value.
3. **Only above-average invoices survive**: 5 out of 12 invoices exceed the average.

### Why a scalar subquery?
You cannot use \`WHERE amount > AVG(amount)\` directly because aggregate functions are not allowed in WHERE clauses. The subquery computes the aggregate separately and feeds it as a constant to the outer query.

### When to use
- Filtering rows above/below an average, median, or threshold
- Comparing individual values to global aggregates
- Any time you need a single computed value in a WHERE or SELECT clause`,
  testCases: [
    {
      name: "default",
      description: "Returns 5 invoices above the average of 1558.33",
      expectedColumns: ["invoice_id", "customer_name", "amount", "plan_tier"],
      expectedRows: [
        { invoice_id: 7, customer_name: "Eta Inc", amount: 4200.00, plan_tier: "Enterprise" },
        { invoice_id: 4, customer_name: "Delta Co", amount: 3500.00, plan_tier: "Enterprise" },
        { invoice_id: 1, customer_name: "Acme Corp", amount: 2500.00, plan_tier: "Enterprise" },
        { invoice_id: 11, customer_name: "Lambda Corp", amount: 2200.00, plan_tier: "Enterprise" },
        { invoice_id: 10, customer_name: "Kappa Ltd", amount: 1800.00, plan_tier: "Professional" },
      ],
      orderMatters: true,
    },
    {
      name: "higher-average",
      description: "After removing low-value invoices, the average rises to 1825.00 and only 4 invoices qualify",
      setupSql: `DELETE FROM invoices WHERE amount < 500;`,
      expectedColumns: ["invoice_id", "customer_name", "amount", "plan_tier"],
      expectedRows: [
        { invoice_id: 7, customer_name: "Eta Inc", amount: 4200.00, plan_tier: "Enterprise" },
        { invoice_id: 4, customer_name: "Delta Co", amount: 3500.00, plan_tier: "Enterprise" },
        { invoice_id: 1, customer_name: "Acme Corp", amount: 2500.00, plan_tier: "Enterprise" },
        { invoice_id: 11, customer_name: "Lambda Corp", amount: 2200.00, plan_tier: "Enterprise" },
      ],
      orderMatters: true,
    },
  ],
};
