import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "45-correlated-subquery-latest-order",
  title: "Most Recent Order per Customer",
  difficulty: "medium",
  category: "subqueries-ctes",
  description: `## Most Recent Order per Customer

The customer success team wants to see each customer's most recent order to identify who might need a follow-up. They need the customer name, order details, and the date of their latest order.

Write a query using a **correlated subquery** to find each customer's most recent order.

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
\`first_name\`, \`last_name\`, \`order_id\`, \`order_date\`, \`total_amount\`

Order by \`customer_id\` ASC.`,
  hint: "Use a correlated subquery in the WHERE clause: WHERE o.order_date = (SELECT MAX(o2.order_date) FROM orders o2 WHERE o2.customer_id = c.customer_id). The subquery runs once per customer, finding their latest order date.",
  schema: `CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY,
  first_name VARCHAR,
  last_name VARCHAR,
  email VARCHAR
);

CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  order_date DATE,
  total_amount DECIMAL(10,2)
);

INSERT INTO customers VALUES
  (1, 'Alice', 'Martin', 'alice@example.com'),
  (2, 'Bob', 'Johnson', 'bob@example.com'),
  (3, 'Charlie', 'Lee', 'charlie@example.com'),
  (4, 'Diana', 'Park', 'diana@example.com'),
  (5, 'Eve', 'Garcia', 'eve@example.com');

INSERT INTO orders VALUES
  (101, 1, '2024-01-15', 250.00),
  (102, 1, '2024-03-20', 180.00),
  (103, 1, '2024-06-01', 320.00),
  (104, 2, '2024-02-10', 450.00),
  (105, 2, '2024-05-15', 120.00),
  (106, 3, '2024-04-01', 89.99),
  (107, 4, '2024-01-05', 550.00),
  (108, 4, '2024-02-28', 340.00),
  (109, 4, '2024-07-10', 210.00),
  (110, 5, '2024-03-15', 175.00);`,
  solutionQuery: `SELECT
  c.first_name,
  c.last_name,
  o.order_id,
  o.order_date,
  o.total_amount
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_date = (
  SELECT MAX(o2.order_date)
  FROM orders o2
  WHERE o2.customer_id = c.customer_id
)
ORDER BY c.customer_id;`,
  solutionExplanation: `## Explanation

### Pattern: Correlated Subquery

This uses a **correlated subquery** -- a subquery that references the outer query's table -- to find the latest order per customer.

### Step-by-step
1. **FROM customers c JOIN orders o**: Get all customer-order combinations.
2. **Correlated subquery**: For each customer, \`SELECT MAX(o2.order_date) WHERE o2.customer_id = c.customer_id\` finds that customer's latest order date.
3. **WHERE o.order_date = (subquery)**: Keeps only the row matching the latest date.

### How is this different from a regular subquery?
A regular (non-correlated) subquery runs once and returns a fixed result. A correlated subquery references the outer query (\`c.customer_id\`), so it runs once per row in the outer query -- effectively "for each customer, find their max date."

### Alternative approaches
- **ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC)**: Window function approach, often preferred for readability.
- **GROUP BY with JOIN**: Join to a derived table of MAX dates.

### When to use
- Finding the latest/earliest/best record per group
- Comparing each row to its group's aggregate
- Any "for each X, find the Y that..." pattern`,
  testCases: [
    {
      name: "default",
      description: "Returns the most recent order for each of the 5 customers",
      expectedColumns: ["first_name", "last_name", "order_id", "order_date", "total_amount"],
      expectedRows: [
        { first_name: "Alice", last_name: "Martin", order_id: 103, order_date: "2024-06-01", total_amount: 320.00 },
        { first_name: "Bob", last_name: "Johnson", order_id: 105, order_date: "2024-05-15", total_amount: 120.00 },
        { first_name: "Charlie", last_name: "Lee", order_id: 106, order_date: "2024-04-01", total_amount: 89.99 },
        { first_name: "Diana", last_name: "Park", order_id: 109, order_date: "2024-07-10", total_amount: 210.00 },
        { first_name: "Eve", last_name: "Garcia", order_id: 110, order_date: "2024-03-15", total_amount: 175.00 },
      ],
      orderMatters: true,
    },
    {
      name: "new-order-shifts-latest",
      description: "Adding a newer order for Bob changes his latest order",
      setupSql: `INSERT INTO orders VALUES (111, 2, '2024-08-01', 999.99);`,
      expectedColumns: ["first_name", "last_name", "order_id", "order_date", "total_amount"],
      expectedRows: [
        { first_name: "Alice", last_name: "Martin", order_id: 103, order_date: "2024-06-01", total_amount: 320.00 },
        { first_name: "Bob", last_name: "Johnson", order_id: 111, order_date: "2024-08-01", total_amount: 999.99 },
        { first_name: "Charlie", last_name: "Lee", order_id: 106, order_date: "2024-04-01", total_amount: 89.99 },
        { first_name: "Diana", last_name: "Park", order_id: 109, order_date: "2024-07-10", total_amount: 210.00 },
        { first_name: "Eve", last_name: "Garcia", order_id: 110, order_date: "2024-03-15", total_amount: 175.00 },
      ],
      orderMatters: true,
    },
  ],
};
