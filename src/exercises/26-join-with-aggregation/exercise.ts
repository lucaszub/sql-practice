import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "26-join-with-aggregation",
  title: "Total Spend per Customer",
  titleFr: "Depenses totales par client",
  difficulty: "easy",
  category: "basic-joins",
  description: `## Total Spend per Customer

Finance wants to know the total amount each customer has spent across all their orders, so they can segment customers by revenue tier.

Write a query that joins customers to their orders and calculates the total amount spent per customer. Only include customers who have placed at least one order.

### Schema

**customers**
| Column | Type |
|--------|------|
| customer_id | INTEGER |
| first_name | VARCHAR |
| last_name | VARCHAR |
| email | VARCHAR |

**orders**
| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| order_date | DATE |
| total_amount | DECIMAL(10,2) |

### Expected output columns
\`customer_id\`, \`first_name\`, \`last_name\`, \`total_spent\`

Order by \`total_spent\` DESC.`,
  hint: "Join customers to orders using INNER JOIN, then GROUP BY the customer columns and use SUM(total_amount) to calculate total spend.",
  schema: `CREATE TABLE customers (
  customer_id INTEGER,
  first_name VARCHAR,
  last_name VARCHAR,
  email VARCHAR
);

CREATE TABLE orders (
  order_id INTEGER,
  customer_id INTEGER,
  order_date DATE,
  total_amount DECIMAL(10,2)
);

INSERT INTO customers VALUES
  (1, 'Alice', 'Martin', 'alice@example.com'),
  (2, 'Bob', 'Johnson', 'bob@example.com'),
  (3, 'Charlie', 'Lee', 'charlie@example.com'),
  (4, 'Diana', 'Park', 'diana@example.com'),
  (5, 'Eve', 'Garcia', 'eve@example.com'),
  (6, 'Frank', 'Chen', 'frank@example.com');

INSERT INTO orders VALUES
  (101, 1, '2024-01-15', 120.00),
  (102, 1, '2024-02-20', 85.50),
  (103, 1, '2024-03-10', 45.00),
  (104, 2, '2024-01-22', 200.00),
  (105, 2, '2024-03-05', 150.75),
  (106, 3, '2024-02-14', 320.00),
  (107, 4, '2024-03-01', 55.25),
  (108, 4, '2024-03-18', 99.99),
  (109, 5, '2024-01-30', 410.00);`,
  solutionQuery: `SELECT
  c.customer_id,
  c.first_name,
  c.last_name,
  SUM(o.total_amount) AS total_spent
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name
ORDER BY total_spent DESC;`,
  solutionExplanation: `## Explanation

### Pattern: INNER JOIN + Aggregation

This combines the **two-table join** pattern with **aggregation** to produce summary statistics across related tables.

### Step-by-step
1. **INNER JOIN**: Match each order to its customer. Since we only want customers who have orders, INNER JOIN naturally excludes Frank (customer_id = 6) who has no orders.
2. **SUM(o.total_amount) AS total_spent**: Aggregate all order amounts per customer into a single total.
3. **GROUP BY c.customer_id, c.first_name, c.last_name**: Group by the customer identity columns so the SUM is computed per customer.
4. **ORDER BY total_spent DESC**: Show highest spenders first, which is most useful for revenue tier analysis.

### Why this approach?
- INNER JOIN + GROUP BY is the standard way to aggregate data across a one-to-many relationship (one customer, many orders).
- Including \`customer_id\` in GROUP BY ensures correctness even if two customers share the same name.

### When to use
- Summarizing transaction data by entity (total spend, order count, average order value)
- Building customer segments based on purchase behavior
- Any report that requires combining descriptive data (names) with aggregated metrics (totals)`,
  testCases: [
    {
      name: "default",
      description: "Total spend per customer ordered by highest spender first",
      expectedColumns: ["customer_id", "first_name", "last_name", "total_spent"],
      expectedRows: [
        { customer_id: 5, first_name: "Eve", last_name: "Garcia", total_spent: 410.00 },
        { customer_id: 2, first_name: "Bob", last_name: "Johnson", total_spent: 350.75 },
        { customer_id: 3, first_name: "Charlie", last_name: "Lee", total_spent: 320.00 },
        { customer_id: 1, first_name: "Alice", last_name: "Martin", total_spent: 250.50 },
        { customer_id: 4, first_name: "Diana", last_name: "Park", total_spent: 155.24 },
      ],
      orderMatters: true,
    },
    {
      name: "single-order-customer",
      description: "Customer with a single large order appears correctly",
      setupSql: `INSERT INTO orders VALUES (110, 6, '2024-04-01', 999.99);`,
      expectedColumns: ["customer_id", "first_name", "last_name", "total_spent"],
      expectedRows: [
        { customer_id: 6, first_name: "Frank", last_name: "Chen", total_spent: 999.99 },
        { customer_id: 5, first_name: "Eve", last_name: "Garcia", total_spent: 410.00 },
        { customer_id: 2, first_name: "Bob", last_name: "Johnson", total_spent: 350.75 },
        { customer_id: 3, first_name: "Charlie", last_name: "Lee", total_spent: 320.00 },
        { customer_id: 1, first_name: "Alice", last_name: "Martin", total_spent: 250.50 },
        { customer_id: 4, first_name: "Diana", last_name: "Park", total_spent: 155.24 },
      ],
      orderMatters: true,
    },
  ],
};
