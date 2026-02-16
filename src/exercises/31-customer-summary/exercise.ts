import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "31-customer-summary",
  title: "Customer Summary Report",
  difficulty: "easy",
  category: "basic-joins",
  description: `## Customer Summary Report

Management has requested a customer summary report for the quarterly business review. For every customer, the report should show:

- Customer name
- Total number of orders
- Total amount spent
- Most recent order date

Include **all** customers, even those who have never placed an order. For customers without orders, show \`0\` for order count, \`0\` for total spent, and \`NULL\` for the most recent order date.

### Schema

**customers**
| Column | Type |
|--------|------|
| customer_id | INTEGER |
| first_name | VARCHAR |
| last_name | VARCHAR |
| email | VARCHAR |
| signup_date | DATE |

**orders**
| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| order_date | DATE |
| total_amount | DECIMAL(10,2) |

### Expected output columns
\`customer_id\`, \`first_name\`, \`last_name\`, \`order_count\`, \`total_spent\`, \`last_order_date\`

Order by \`total_spent\` DESC, \`customer_id\` ASC.`,
  hint: "Use LEFT JOIN to include all customers. Then use COUNT(o.order_id) for order count (not COUNT(*)), COALESCE(SUM(o.total_amount), 0) for total spent, and MAX(o.order_date) for the most recent order date.",
  schema: `CREATE TABLE customers (
  customer_id INTEGER,
  first_name VARCHAR,
  last_name VARCHAR,
  email VARCHAR,
  signup_date DATE
);

CREATE TABLE orders (
  order_id INTEGER,
  customer_id INTEGER,
  order_date DATE,
  total_amount DECIMAL(10,2)
);

INSERT INTO customers VALUES
  (1, 'Alice', 'Martin', 'alice@example.com', '2023-01-15'),
  (2, 'Bob', 'Johnson', 'bob@example.com', '2023-03-22'),
  (3, 'Charlie', 'Lee', 'charlie@example.com', '2023-05-10'),
  (4, 'Diana', 'Park', 'diana@example.com', '2023-07-01'),
  (5, 'Eve', 'Garcia', 'eve@example.com', '2023-09-18'),
  (6, 'Frank', 'Chen', 'frank@example.com', '2023-11-05'),
  (7, 'Grace', 'Kim', 'grace@example.com', '2024-01-20'),
  (8, 'Hank', 'Wilson', 'hank@example.com', '2024-02-28');

INSERT INTO orders VALUES
  (101, 1, '2024-01-05', 150.00),
  (102, 1, '2024-02-10', 85.50),
  (103, 1, '2024-03-15', 220.00),
  (104, 1, '2024-03-28', 45.00),
  (105, 2, '2024-01-20', 310.00),
  (106, 2, '2024-03-12', 175.25),
  (107, 3, '2024-02-14', 92.00),
  (108, 3, '2024-03-01', 128.50),
  (109, 3, '2024-03-20', 64.00),
  (110, 4, '2024-03-08', 450.00),
  (111, 5, '2024-02-22', 33.99),
  (112, 6, '2024-03-25', 67.00);`,
  solutionQuery: `SELECT
  c.customer_id,
  c.first_name,
  c.last_name,
  COUNT(o.order_id) AS order_count,
  COALESCE(SUM(o.total_amount), 0) AS total_spent,
  MAX(o.order_date) AS last_order_date
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name
ORDER BY total_spent DESC, c.customer_id ASC;`,
  solutionExplanation: `## Explanation

### Pattern: Multi-concept summary (LEFT JOIN + multiple aggregations)

This exercise combines several concepts into one practical report: LEFT JOIN, COUNT, SUM, MAX, COALESCE, and GROUP BY.

### Step-by-step
1. **LEFT JOIN orders o ON c.customer_id = o.customer_id**: Include all customers, even those without orders (Grace and Hank).
2. **COUNT(o.order_id) AS order_count**: Count non-NULL order IDs. Returns 0 for customers with no orders.
3. **COALESCE(SUM(o.total_amount), 0) AS total_spent**: Sum all order amounts per customer. \`COALESCE(..., 0)\` converts the NULL result (from customers with no orders) to 0.
4. **MAX(o.order_date) AS last_order_date**: Get the most recent order date. Returns NULL for customers with no orders, which is the desired behavior.
5. **GROUP BY customer identity columns**: Produce one summary row per customer.
6. **ORDER BY total_spent DESC, customer_id ASC**: Highest spenders first; ties broken by customer ID.

### Why COALESCE for SUM but not MAX?
- **SUM**: The business requirement says to show \`0\` for total spent. Without COALESCE, SUM over no rows returns NULL.
- **MAX**: The business requirement says to show \`NULL\` for the last order date when there are no orders. NULL correctly represents "no date exists."
- **COUNT(o.order_id)**: Already returns 0 for no matches -- no COALESCE needed.

### When to use
- Executive dashboards and business review reports
- Customer 360 views that aggregate multiple metrics
- Any summary that must include all entities regardless of activity level`,
  testCases: [
    {
      name: "default",
      description: "Complete customer summary with all metrics, including zero-order customers",
      expectedColumns: ["customer_id", "first_name", "last_name", "order_count", "total_spent", "last_order_date"],
      expectedRows: [
        { customer_id: 1, first_name: "Alice", last_name: "Martin", order_count: 4, total_spent: 500.50, last_order_date: "2024-03-28" },
        { customer_id: 2, first_name: "Bob", last_name: "Johnson", order_count: 2, total_spent: 485.25, last_order_date: "2024-03-12" },
        { customer_id: 4, first_name: "Diana", last_name: "Park", order_count: 1, total_spent: 450.00, last_order_date: "2024-03-08" },
        { customer_id: 3, first_name: "Charlie", last_name: "Lee", order_count: 3, total_spent: 284.50, last_order_date: "2024-03-20" },
        { customer_id: 6, first_name: "Frank", last_name: "Chen", order_count: 1, total_spent: 67.00, last_order_date: "2024-03-25" },
        { customer_id: 5, first_name: "Eve", last_name: "Garcia", order_count: 1, total_spent: 33.99, last_order_date: "2024-02-22" },
        { customer_id: 7, first_name: "Grace", last_name: "Kim", order_count: 0, total_spent: 0, last_order_date: null },
        { customer_id: 8, first_name: "Hank", last_name: "Wilson", order_count: 0, total_spent: 0, last_order_date: null },
      ],
      orderMatters: true,
    },
    {
      name: "new-customer-first-order",
      description: "A previously inactive customer places their first order",
      setupSql: `INSERT INTO orders VALUES (113, 7, '2024-04-01', 199.99);`,
      expectedColumns: ["customer_id", "first_name", "last_name", "order_count", "total_spent", "last_order_date"],
      expectedRows: [
        { customer_id: 1, first_name: "Alice", last_name: "Martin", order_count: 4, total_spent: 500.50, last_order_date: "2024-03-28" },
        { customer_id: 2, first_name: "Bob", last_name: "Johnson", order_count: 2, total_spent: 485.25, last_order_date: "2024-03-12" },
        { customer_id: 4, first_name: "Diana", last_name: "Park", order_count: 1, total_spent: 450.00, last_order_date: "2024-03-08" },
        { customer_id: 3, first_name: "Charlie", last_name: "Lee", order_count: 3, total_spent: 284.50, last_order_date: "2024-03-20" },
        { customer_id: 7, first_name: "Grace", last_name: "Kim", order_count: 1, total_spent: 199.99, last_order_date: "2024-04-01" },
        { customer_id: 6, first_name: "Frank", last_name: "Chen", order_count: 1, total_spent: 67.00, last_order_date: "2024-03-25" },
        { customer_id: 5, first_name: "Eve", last_name: "Garcia", order_count: 1, total_spent: 33.99, last_order_date: "2024-02-22" },
        { customer_id: 8, first_name: "Hank", last_name: "Wilson", order_count: 0, total_spent: 0, last_order_date: null },
      ],
      orderMatters: true,
    },
  ],
};
