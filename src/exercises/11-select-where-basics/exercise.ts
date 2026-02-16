import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "11-select-where-basics",
  title: "High-Value Orders Report",
  difficulty: "easy",
  category: "select-fundamentals",
  description: `## High-Value Orders Report

The sales team wants to see all orders above $100 to identify high-value transactions for their quarterly review. They need the order ID, customer name, order total, and order date.

### Schema

**orders**
| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_name | VARCHAR |
| order_total | DECIMAL(10,2) |
| order_date | DATE |
| status | VARCHAR |

### Task

Write a query that returns all orders where the \`order_total\` is **greater than 100**.

### Expected output columns
\`order_id\`, \`customer_name\`, \`order_total\`, \`order_date\`

Order by \`order_id\` ASC.`,
  hint: "Use SELECT to pick the four columns you need, then WHERE with a comparison operator (>) to filter rows where order_total exceeds 100.",
  schema: `CREATE TABLE orders (
  order_id INTEGER,
  customer_name VARCHAR,
  order_total DECIMAL(10,2),
  order_date DATE,
  status VARCHAR
);

INSERT INTO orders VALUES
  (1, 'Alice Johnson', 250.00, '2024-01-15', 'completed'),
  (2, 'Bob Smith', 45.99, '2024-01-16', 'completed'),
  (3, 'Carol White', 189.50, '2024-01-17', 'completed'),
  (4, 'David Brown', 99.99, '2024-01-18', 'completed'),
  (5, 'Eva Martinez', 320.00, '2024-01-19', 'shipped'),
  (6, 'Frank Lee', 15.00, '2024-01-20', 'completed'),
  (7, 'Grace Kim', 100.00, '2024-01-21', 'completed'),
  (8, 'Hank Davis', 550.75, '2024-01-22', 'shipped'),
  (9, 'Irene Clark', 72.30, '2024-01-23', 'cancelled'),
  (10, 'Jack Wilson', 101.01, '2024-01-24', 'completed'),
  (11, 'Karen Hall', 200.00, '2024-01-25', 'completed'),
  (12, 'Leo Turner', 88.50, '2024-01-26', 'shipped'),
  (13, 'Mia Scott', 150.25, '2024-01-27', 'completed'),
  (14, 'Noah Adams', 33.00, '2024-01-28', 'cancelled'),
  (15, 'Olivia Reed', 475.00, '2024-01-29', 'completed');`,
  solutionQuery: `SELECT order_id, customer_name, order_total, order_date
FROM orders
WHERE order_total > 100
ORDER BY order_id;`,
  solutionExplanation: `## Explanation

### Basic Filtering Pattern
This exercise uses the fundamental **SELECT ... WHERE** pattern to filter rows based on a condition.

### Step-by-step
1. **SELECT**: Choose only the four columns the sales team needs (\`order_id\`, \`customer_name\`, \`order_total\`, \`order_date\`). The \`status\` column is intentionally excluded since it was not requested.
2. **WHERE order_total > 100**: The comparison operator \`>\` filters out any row where the total is 100 or less. Note that the boundary value 100.00 itself is excluded (strictly greater than).
3. **ORDER BY order_id**: Ensures deterministic output order.

### Why this approach
SELECT with WHERE is the most fundamental SQL pattern. Selecting only the columns you need (instead of \`SELECT *\`) is a good habit: it makes queries clearer, reduces data transfer, and documents your intent.

### When to use
- Any time you need to retrieve a subset of rows from a single table
- Reporting queries where business users specify a threshold or condition
- Quick data exploration to understand value distributions`,
  testCases: [
    {
      name: "default",
      description: "Returns all orders with total greater than $100",
      expectedColumns: ["order_id", "customer_name", "order_total", "order_date"],
      expectedRows: [
        { order_id: 1, customer_name: "Alice Johnson", order_total: 250.00, order_date: "2024-01-15" },
        { order_id: 3, customer_name: "Carol White", order_total: 189.50, order_date: "2024-01-17" },
        { order_id: 5, customer_name: "Eva Martinez", order_total: 320.00, order_date: "2024-01-19" },
        { order_id: 8, customer_name: "Hank Davis", order_total: 550.75, order_date: "2024-01-22" },
        { order_id: 10, customer_name: "Jack Wilson", order_total: 101.01, order_date: "2024-01-24" },
        { order_id: 11, customer_name: "Karen Hall", order_total: 200.00, order_date: "2024-01-25" },
        { order_id: 13, customer_name: "Mia Scott", order_total: 150.25, order_date: "2024-01-27" },
        { order_id: 15, customer_name: "Olivia Reed", order_total: 475.00, order_date: "2024-01-29" },
      ],
      orderMatters: true,
    },
    {
      name: "boundary-exclusion",
      description: "Correctly excludes the exact boundary value of $100.00",
      setupSql: `DELETE FROM orders WHERE order_id != 7;`,
      expectedColumns: ["order_id", "customer_name", "order_total", "order_date"],
      expectedRows: [],
      orderMatters: false,
    },
  ],
};
