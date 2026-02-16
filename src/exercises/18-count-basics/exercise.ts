import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "18-count-basics",
  title: "Count Orders and Unique Customers",
  difficulty: "easy",
  category: "aggregation",
  description: `## Count Orders and Unique Customers

The operations team wants to know the **total number of orders** and **how many unique customers** placed them. This will help them understand order volume versus customer reach.

### Schema

**orders**
| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| order_date | DATE |
| total_amount | DECIMAL(10,2) |

### Task

Write a query that returns:
- \`total_orders\`: the total number of orders
- \`unique_customers\`: the number of distinct customers who placed at least one order

### Expected output columns
\`total_orders\`, \`unique_customers\``,
  hint: "COUNT(*) counts all rows, while COUNT(DISTINCT column) counts only unique values in that column.",
  schema: `CREATE TABLE orders (
  order_id INTEGER,
  customer_id INTEGER,
  order_date DATE,
  total_amount DECIMAL(10,2)
);

INSERT INTO orders VALUES
  (1, 101, '2024-01-05', 59.99),
  (2, 102, '2024-01-08', 129.50),
  (3, 101, '2024-01-12', 24.99),
  (4, 103, '2024-01-15', 89.00),
  (5, 104, '2024-01-18', 210.00),
  (6, 101, '2024-01-22', 15.75),
  (7, 105, '2024-01-25', 74.50),
  (8, 102, '2024-01-28', 45.00),
  (9, 106, '2024-02-01', 320.00),
  (10, 103, '2024-02-05', 55.25),
  (11, 107, '2024-02-08', NULL),
  (12, 101, '2024-02-10', 99.99);`,
  solutionQuery: `SELECT
  COUNT(*) AS total_orders,
  COUNT(DISTINCT customer_id) AS unique_customers
FROM orders;`,
  solutionExplanation: `## Explanation

### Pattern: Basic Aggregation with COUNT

This exercise uses the two most common forms of \`COUNT\`:

1. **\`COUNT(*)\`**: Counts every row in the table, regardless of NULL values. This gives us the total number of orders (12).
2. **\`COUNT(DISTINCT customer_id)\`**: Counts only the unique values in the \`customer_id\` column. Customer 101 placed 4 orders, but is counted only once.

### Why this approach
- \`COUNT(*)\` is the standard way to count rows. It includes rows even when some columns are NULL (like order 11's \`total_amount\`).
- \`COUNT(DISTINCT ...)\` is essential for deduplication in aggregation. Without \`DISTINCT\`, \`COUNT(customer_id)\` would return 12 (all non-NULL customer IDs), not 7.

### When to use
- Dashboards showing "total orders vs. active customers"
- Quick health checks on data volume and cardinality
- Any time you need to understand how many unique entities exist in a dataset`,
  testCases: [
    {
      name: "default",
      description: "Count all orders and unique customers from the base dataset",
      expectedColumns: ["total_orders", "unique_customers"],
      expectedRows: [{ total_orders: 12, unique_customers: 7 }],
      orderMatters: false,
    },
    {
      name: "after-adding-duplicate-customer-orders",
      description:
        "Adding more orders from existing customers should increase total but not unique count",
      setupSql: `INSERT INTO orders VALUES
  (13, 101, '2024-02-15', 30.00),
  (14, 102, '2024-02-18', 60.00);`,
      expectedColumns: ["total_orders", "unique_customers"],
      expectedRows: [{ total_orders: 14, unique_customers: 7 }],
      orderMatters: false,
    },
  ],
};
