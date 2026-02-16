import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "10-anti-join",
  title: "Find Inactive Customers",
  difficulty: "easy",
  category: "advanced-joins",
  description: `## Find Inactive Customers (Anti-Join)

Given \`customers\` and \`orders\` tables, find all customers who have **never placed an order**.

### Schema

**customers**
| Column | Type |
|--------|------|
| id | INTEGER |
| name | VARCHAR |
| email | VARCHAR |

**orders**
| Column | Type |
|--------|------|
| id | INTEGER |
| customer_id | INTEGER |
| amount | DECIMAL(10,2) |
| order_date | DATE |

### Expected output columns
\`id\`, \`name\`, \`email\`

Order by id ASC.`,
  hint: "Use LEFT JOIN orders ON customers.id = orders.customer_id WHERE orders.id IS NULL. This is called an anti-join pattern.",
  schema: `CREATE TABLE customers (
  id INTEGER,
  name VARCHAR,
  email VARCHAR
);

CREATE TABLE orders (
  id INTEGER,
  customer_id INTEGER,
  amount DECIMAL(10,2),
  order_date DATE
);

INSERT INTO customers VALUES
  (1, 'Alice', 'alice@example.com'),
  (2, 'Bob', 'bob@example.com'),
  (3, 'Charlie', 'charlie@example.com'),
  (4, 'Diana', 'diana@example.com'),
  (5, 'Eve', 'eve@example.com');

INSERT INTO orders VALUES
  (1, 1, 99.99, '2024-01-15'),
  (2, 1, 49.99, '2024-02-20'),
  (3, 3, 199.99, '2024-01-10'),
  (4, 5, 29.99, '2024-03-05');`,
  solutionQuery: `SELECT c.id, c.name, c.email
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL
ORDER BY c.id;`,
  solutionExplanation: `## Explanation

### Anti-Join Pattern
The anti-join finds rows in table A that have **no matching rows** in table B.

### How It Works
1. \`LEFT JOIN\`: Keep all customers, even without matching orders
2. \`WHERE o.id IS NULL\`: Filter to only customers where the join found no match

### Alternatives
- \`WHERE NOT EXISTS (SELECT 1 FROM orders WHERE customer_id = c.id)\`
- \`WHERE c.id NOT IN (SELECT customer_id FROM orders)\`

All three approaches produce the same result. The LEFT JOIN WHERE NULL pattern is often preferred for readability and consistent performance.

### When to Use
- Finding unmatched records between tables
- Data quality checks (orphaned records)
- Identifying inactive users, unused products, etc.`,
  testCases: [
    {
      name: "default",
      description: "Find customers without orders",
      expectedColumns: ["id", "name", "email"],
      expectedRows: [
        { id: 2, name: "Bob", email: "bob@example.com" },
        { id: 4, name: "Diana", email: "diana@example.com" },
      ],
      orderMatters: true,
    },
    {
      name: "all-customers-have-orders",
      description: "Returns empty when all customers have orders",
      setupSql: `INSERT INTO orders VALUES (5, 2, 50.00, '2024-04-01'), (6, 4, 75.00, '2024-04-02');`,
      expectedColumns: ["id", "name", "email"],
      expectedRows: [],
      orderMatters: false,
    },
  ],
};
