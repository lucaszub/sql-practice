import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "27-left-join-basics",
  title: "Customer Order Count Including Inactive",
  titleFr: "Nombre de commandes par client, y compris les inactifs",
  difficulty: "easy",
  category: "basic-joins",
  description: `## Customer Order Count Including Inactive

Customer success wants a complete list of all customers, showing their order count -- including customers who have not ordered yet. Customers without orders should show \`0\` as their order count.

This report helps the team identify which customers need outreach to encourage their first purchase.

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
\`customer_id\`, \`first_name\`, \`last_name\`, \`order_count\`

Order by \`order_count\` DESC, \`customer_id\` ASC.`,
  hint: "Use LEFT JOIN to keep all customers even if they have no orders. Then COUNT(orders.order_id) -- not COUNT(*) -- so that NULLs from unmatched rows produce 0 instead of 1.",
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
  (1, 'Alice', 'Martin', 'alice@example.com', '2023-06-15'),
  (2, 'Bob', 'Johnson', 'bob@example.com', '2023-08-22'),
  (3, 'Charlie', 'Lee', 'charlie@example.com', '2023-09-01'),
  (4, 'Diana', 'Park', 'diana@example.com', '2023-11-10'),
  (5, 'Eve', 'Garcia', 'eve@example.com', '2024-01-05'),
  (6, 'Frank', 'Chen', 'frank@example.com', '2024-02-14'),
  (7, 'Grace', 'Kim', 'grace@example.com', '2024-03-01');

INSERT INTO orders VALUES
  (101, 1, '2024-01-10', 75.00),
  (102, 1, '2024-02-15', 120.50),
  (103, 1, '2024-03-20', 45.00),
  (104, 2, '2024-01-25', 200.00),
  (105, 2, '2024-03-10', 89.99),
  (106, 3, '2024-02-28', 55.00),
  (107, 5, '2024-03-05', 310.00),
  (108, 5, '2024-03-18', 42.50),
  (109, 5, '2024-03-25', 67.75);`,
  solutionQuery: `SELECT
  c.customer_id,
  c.first_name,
  c.last_name,
  COUNT(o.order_id) AS order_count
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name
ORDER BY order_count DESC, c.customer_id ASC;`,
  solutionExplanation: `## Explanation

### Pattern: LEFT JOIN + COUNT

This uses the **LEFT JOIN** pattern to preserve all rows from the left table, even when there is no matching row in the right table.

### Step-by-step
1. **LEFT JOIN orders o ON c.customer_id = o.customer_id**: Keep every customer. If a customer has no orders, the order columns will be NULL.
2. **COUNT(o.order_id)**: Count only non-NULL order IDs. This is critical -- using \`COUNT(*)\` would return 1 for customers with no orders (because the LEFT JOIN still produces one row with NULLs). \`COUNT(order_id)\` correctly returns 0.
3. **GROUP BY**: Group by customer identity columns to get one row per customer.
4. **ORDER BY order_count DESC, customer_id ASC**: Show most active customers first; break ties by customer ID.

### Why LEFT JOIN instead of INNER JOIN?
An INNER JOIN would silently drop Diana (customer_id = 4), Frank (customer_id = 6), and Grace (customer_id = 7) because they have no orders. The whole point of this report is to include those customers with a count of 0.

### When to use
- Reports that must include all entities, even those without related records
- Customer engagement dashboards (showing active vs. inactive customers)
- Any "complete list" requirement where missing data should appear as zero, not be hidden`,
  testCases: [
    {
      name: "default",
      description: "All customers shown with correct order counts, including zeros",
      expectedColumns: ["customer_id", "first_name", "last_name", "order_count"],
      expectedRows: [
        { customer_id: 1, first_name: "Alice", last_name: "Martin", order_count: 3 },
        { customer_id: 5, first_name: "Eve", last_name: "Garcia", order_count: 3 },
        { customer_id: 2, first_name: "Bob", last_name: "Johnson", order_count: 2 },
        { customer_id: 3, first_name: "Charlie", last_name: "Lee", order_count: 1 },
        { customer_id: 4, first_name: "Diana", last_name: "Park", order_count: 0 },
        { customer_id: 6, first_name: "Frank", last_name: "Chen", order_count: 0 },
        { customer_id: 7, first_name: "Grace", last_name: "Kim", order_count: 0 },
      ],
      orderMatters: true,
    },
    {
      name: "all-customers-have-orders",
      description: "When every customer has at least one order, no zeros appear",
      setupSql: `INSERT INTO orders VALUES
        (110, 4, '2024-04-01', 30.00),
        (111, 6, '2024-04-02', 55.00),
        (112, 7, '2024-04-03', 80.00);`,
      expectedColumns: ["customer_id", "first_name", "last_name", "order_count"],
      expectedRows: [
        { customer_id: 1, first_name: "Alice", last_name: "Martin", order_count: 3 },
        { customer_id: 5, first_name: "Eve", last_name: "Garcia", order_count: 3 },
        { customer_id: 2, first_name: "Bob", last_name: "Johnson", order_count: 2 },
        { customer_id: 3, first_name: "Charlie", last_name: "Lee", order_count: 1 },
        { customer_id: 4, first_name: "Diana", last_name: "Park", order_count: 1 },
        { customer_id: 6, first_name: "Frank", last_name: "Chen", order_count: 1 },
        { customer_id: 7, first_name: "Grace", last_name: "Kim", order_count: 1 },
      ],
      orderMatters: true,
    },
  ],
};
