import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "15-limit-offset",
  title: "Recent Activity Widget",
  difficulty: "easy",
  category: "select-fundamentals",
  description: `## Recent Activity Widget

The homepage needs a "Recent Activity" widget that displays the **5 most recent orders**. The widget should show the order ID, customer name, total amount, and order date, with the newest orders appearing first.

### Schema

**orders**
| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_name | VARCHAR |
| total_amount | DECIMAL(10,2) |
| order_date | DATE |
| status | VARCHAR |

### Task

Write a query that returns the **5 most recent orders** based on \`order_date\`. If two orders share the same date, the one with the higher \`order_id\` should appear first (as it was placed later).

### Expected output columns
\`order_id\`, \`customer_name\`, \`total_amount\`, \`order_date\`

Return only 5 rows.`,
  hint: "First sort the orders by date (newest first), then use LIMIT to restrict the output to exactly 5 rows. Think about what makes a good tiebreaker when dates are the same.",
  schema: `CREATE TABLE orders (
  order_id INTEGER,
  customer_name VARCHAR,
  total_amount DECIMAL(10,2),
  order_date DATE,
  status VARCHAR
);

INSERT INTO orders VALUES
  (1, 'Alice Johnson', 125.50, '2024-01-05', 'completed'),
  (2, 'Bob Smith', 89.99, '2024-01-08', 'completed'),
  (3, 'Carol White', 210.00, '2024-01-10', 'shipped'),
  (4, 'David Brown', 45.00, '2024-01-12', 'completed'),
  (5, 'Eva Martinez', 330.75, '2024-01-15', 'completed'),
  (6, 'Frank Lee', 67.20, '2024-01-15', 'shipped'),
  (7, 'Grace Kim', 155.00, '2024-01-18', 'completed'),
  (8, 'Hank Davis', 420.00, '2024-01-20', 'shipped'),
  (9, 'Irene Clark', 92.50, '2024-01-22', 'completed'),
  (10, 'Jack Wilson', 178.30, '2024-01-22', 'completed'),
  (11, 'Karen Hall', 55.00, '2024-01-25', 'cancelled'),
  (12, 'Leo Turner', 299.99, '2024-01-27', 'completed'),
  (13, 'Mia Scott', 140.00, '2024-01-28', 'shipped'),
  (14, 'Noah Adams', 88.50, '2024-01-30', 'completed'),
  (15, 'Olivia Reed', 195.00, '2024-01-30', 'completed');`,
  solutionQuery: `SELECT order_id, customer_name, total_amount, order_date
FROM orders
ORDER BY order_date DESC, order_id DESC
LIMIT 5;`,
  solutionExplanation: `## Explanation

### LIMIT Pattern for Top-N Queries
This exercise uses **ORDER BY + LIMIT** to retrieve the N most recent (or highest, or lowest) rows from a table.

### Step-by-step
1. **ORDER BY order_date DESC**: Sort orders with the most recent date first.
2. **order_id DESC**: For orders on the same date (e.g., Jan 30 has two orders), the higher order_id appears first since it was placed later.
3. **LIMIT 5**: Return only the first 5 rows from the sorted result.

### Key concepts
- LIMIT restricts the number of rows returned. It is applied after ORDER BY.
- Without ORDER BY, LIMIT returns an arbitrary set of rows (non-deterministic), which is almost never what you want.
- OFFSET can be combined with LIMIT for pagination: \`LIMIT 5 OFFSET 5\` skips the first 5 rows and returns the next 5.

### Why this approach
ORDER BY + LIMIT is the standard SQL idiom for "top N" queries. It is simple, readable, and well-optimized by all database engines. The database can often use an index to avoid sorting the entire table.

### When to use
- Dashboard widgets showing recent or top items
- Pagination (combined with OFFSET)
- Quick previews of data ("show me the 10 biggest orders")
- Sampling a few rows for data exploration`,
  testCases: [
    {
      name: "default",
      description: "Returns the 5 most recent orders",
      expectedColumns: ["order_id", "customer_name", "total_amount", "order_date"],
      expectedRows: [
        { order_id: 15, customer_name: "Olivia Reed", total_amount: 195.00, order_date: "2024-01-30" },
        { order_id: 14, customer_name: "Noah Adams", total_amount: 88.50, order_date: "2024-01-30" },
        { order_id: 13, customer_name: "Mia Scott", total_amount: 140.00, order_date: "2024-01-28" },
        { order_id: 12, customer_name: "Leo Turner", total_amount: 299.99, order_date: "2024-01-27" },
        { order_id: 11, customer_name: "Karen Hall", total_amount: 55.00, order_date: "2024-01-25" },
      ],
      orderMatters: true,
    },
    {
      name: "fewer-than-limit",
      description: "Returns all rows when table has fewer than 5 orders",
      setupSql: `DELETE FROM orders WHERE order_id > 3;`,
      expectedColumns: ["order_id", "customer_name", "total_amount", "order_date"],
      expectedRows: [
        { order_id: 3, customer_name: "Carol White", total_amount: 210.00, order_date: "2024-01-10" },
        { order_id: 2, customer_name: "Bob Smith", total_amount: 89.99, order_date: "2024-01-08" },
        { order_id: 1, customer_name: "Alice Johnson", total_amount: 125.50, order_date: "2024-01-05" },
      ],
      orderMatters: true,
    },
  ],
};
