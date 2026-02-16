import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "29-join-with-where",
  title: "Premium Customer Recent Orders",
  difficulty: "easy",
  category: "basic-joins",
  description: `## Premium Customer Recent Orders

The VIP team wants to see orders placed by premium customers (membership_level = 'gold' or 'platinum') in the last 30 days (on or after 2024-03-01), so they can prepare personalized thank-you packages.

Write a query that joins customers to orders, filtering for premium membership levels and recent order dates.

### Schema

**customers**
| Column | Type |
|--------|------|
| customer_id | INTEGER |
| first_name | VARCHAR |
| last_name | VARCHAR |
| membership_level | VARCHAR |
| email | VARCHAR |

**orders**
| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| order_date | DATE |
| total_amount | DECIMAL(10,2) |

### Expected output columns
\`order_id\`, \`first_name\`, \`last_name\`, \`membership_level\`, \`order_date\`, \`total_amount\`

Order by \`order_date\` DESC, \`order_id\` DESC.`,
  hint: "Join customers to orders with INNER JOIN, then add WHERE conditions: membership_level IN ('gold', 'platinum') AND order_date >= '2024-03-01'. The WHERE clause filters the joined result.",
  schema: `CREATE TABLE customers (
  customer_id INTEGER,
  first_name VARCHAR,
  last_name VARCHAR,
  membership_level VARCHAR,
  email VARCHAR
);

CREATE TABLE orders (
  order_id INTEGER,
  customer_id INTEGER,
  order_date DATE,
  total_amount DECIMAL(10,2)
);

INSERT INTO customers VALUES
  (1, 'Alice', 'Martin', 'platinum', 'alice@example.com'),
  (2, 'Bob', 'Johnson', 'gold', 'bob@example.com'),
  (3, 'Charlie', 'Lee', 'silver', 'charlie@example.com'),
  (4, 'Diana', 'Park', 'gold', 'diana@example.com'),
  (5, 'Eve', 'Garcia', 'bronze', 'eve@example.com'),
  (6, 'Frank', 'Chen', 'platinum', 'frank@example.com'),
  (7, 'Grace', 'Kim', 'silver', 'grace@example.com'),
  (8, 'Hank', 'Wilson', NULL, 'hank@example.com');

INSERT INTO orders VALUES
  (201, 1, '2024-03-15', 250.00),
  (202, 1, '2024-02-10', 180.00),
  (203, 2, '2024-03-08', 95.50),
  (204, 2, '2024-03-22', 140.00),
  (205, 3, '2024-03-12', 60.00),
  (206, 4, '2024-03-05', 320.00),
  (207, 4, '2024-02-28', 75.00),
  (208, 5, '2024-03-18', 45.00),
  (209, 6, '2024-03-25', 510.00),
  (210, 6, '2024-03-10', 88.00),
  (211, 7, '2024-03-20', 125.00),
  (212, 8, '2024-03-14', 30.00);`,
  solutionQuery: `SELECT
  o.order_id,
  c.first_name,
  c.last_name,
  c.membership_level,
  o.order_date,
  o.total_amount
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
WHERE c.membership_level IN ('gold', 'platinum')
  AND o.order_date >= '2024-03-01'
ORDER BY o.order_date DESC, o.order_id DESC;`,
  solutionExplanation: `## Explanation

### Pattern: JOIN + WHERE Filter

This combines a **two-table join** with **WHERE filtering** on columns from both tables.

### Step-by-step
1. **INNER JOIN**: Match orders to customers on \`customer_id\`.
2. **WHERE c.membership_level IN ('gold', 'platinum')**: Filter to only premium customers. This eliminates silver, bronze, and NULL membership levels.
3. **AND o.order_date >= '2024-03-01'**: Further restrict to orders in the target date range. Alice's February order (202) and Diana's February order (207) are excluded.
4. **ORDER BY o.order_date DESC, o.order_id DESC**: Most recent orders first; ties broken by order ID descending.

### Why filter in WHERE, not in JOIN?
- Filters on the **joined result** belong in WHERE.
- Filters that affect **which rows are joined** belong in the ON clause (relevant for LEFT JOINs where moving a condition from WHERE to ON changes the result).
- For INNER JOINs, both locations produce the same result, but WHERE is the conventional and more readable placement.

### Key edge case: NULL membership
Customer Hank has a NULL membership_level. The \`IN ('gold', 'platinum')\` condition naturally excludes NULLs because NULL is never equal to any value.

### When to use
- Filtering joined data by attributes from both tables
- Building targeted lists (VIP orders, high-value transactions in a date range)
- Any report that requires combining entity attributes with event filters`,
  testCases: [
    {
      name: "default",
      description: "Only premium customer orders from March 2024 onward",
      expectedColumns: ["order_id", "first_name", "last_name", "membership_level", "order_date", "total_amount"],
      expectedRows: [
        { order_id: 209, first_name: "Frank", last_name: "Chen", membership_level: "platinum", order_date: "2024-03-25", total_amount: 510.00 },
        { order_id: 204, first_name: "Bob", last_name: "Johnson", membership_level: "gold", order_date: "2024-03-22", total_amount: 140.00 },
        { order_id: 201, first_name: "Alice", last_name: "Martin", membership_level: "platinum", order_date: "2024-03-15", total_amount: 250.00 },
        { order_id: 210, first_name: "Frank", last_name: "Chen", membership_level: "platinum", order_date: "2024-03-10", total_amount: 88.00 },
        { order_id: 203, first_name: "Bob", last_name: "Johnson", membership_level: "gold", order_date: "2024-03-08", total_amount: 95.50 },
        { order_id: 206, first_name: "Diana", last_name: "Park", membership_level: "gold", order_date: "2024-03-05", total_amount: 320.00 },
      ],
      orderMatters: true,
    },
    {
      name: "no-qualifying-orders",
      description: "Returns empty when no premium customers have recent orders",
      setupSql: `DELETE FROM orders WHERE order_date >= '2024-03-01' AND customer_id IN (1, 2, 4, 6);`,
      expectedColumns: ["order_id", "first_name", "last_name", "membership_level", "order_date", "total_amount"],
      expectedRows: [],
      orderMatters: false,
    },
  ],
};
