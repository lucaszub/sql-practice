import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "37-three-table-order-report",
  title: "Comprehensive Order Report",
  difficulty: "medium",
  category: "multi-table-joins",
  description: `## Comprehensive Order Report

The operations team needs a comprehensive order report that shows every order along with the customer's full name and the product they purchased. This report is used for fulfillment tracking and quality checks.

Write a query that joins three tables to produce a detailed order report.

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
| product_id | INTEGER |
| order_date | DATE |
| quantity | INTEGER |

**products**
| Column | Type |
|--------|------|
| product_id | INTEGER |
| product_name | VARCHAR |
| category | VARCHAR |
| unit_price | DECIMAL(10,2) |

### Expected output columns
\`order_id\`, \`first_name\`, \`last_name\`, \`product_name\`, \`quantity\`, \`unit_price\`, \`order_date\`

Order by \`order_id\` ASC.`,
  hint: "You need two JOIN clauses: one to connect orders to customers (via customer_id) and another to connect orders to products (via product_id). Chain them in a single FROM clause.",
  schema: `CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY,
  first_name VARCHAR,
  last_name VARCHAR,
  email VARCHAR
);

CREATE TABLE products (
  product_id INTEGER PRIMARY KEY,
  product_name VARCHAR,
  category VARCHAR,
  unit_price DECIMAL(10,2)
);

CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  product_id INTEGER,
  order_date DATE,
  quantity INTEGER
);

INSERT INTO customers VALUES
  (1, 'Alice', 'Martin', 'alice@example.com'),
  (2, 'Bob', 'Johnson', 'bob@example.com'),
  (3, 'Charlie', 'Lee', 'charlie@example.com'),
  (4, 'Diana', 'Park', 'diana@example.com'),
  (5, 'Eve', 'Garcia', 'eve@example.com');

INSERT INTO products VALUES
  (101, 'Wireless Mouse', 'Electronics', 29.99),
  (102, 'USB-C Hub', 'Electronics', 49.99),
  (103, 'Notebook Pack', 'Office', 12.50),
  (104, 'Standing Desk Mat', 'Office', 45.00),
  (105, 'Webcam HD', 'Electronics', 79.99);

INSERT INTO orders VALUES
  (1001, 1, 101, '2024-01-15', 2),
  (1002, 2, 103, '2024-01-18', 5),
  (1003, 1, 102, '2024-01-20', 1),
  (1004, 3, 105, '2024-02-01', 1),
  (1005, 4, 101, '2024-02-05', 3),
  (1006, 2, 104, '2024-02-10', 1),
  (1007, 5, 103, '2024-02-14', 10),
  (1008, 3, 102, '2024-02-20', 2),
  (1009, 1, 104, '2024-03-01', 1),
  (1010, 4, 105, '2024-03-05', 1);`,
  solutionQuery: `SELECT
  o.order_id,
  c.first_name,
  c.last_name,
  p.product_name,
  o.quantity,
  p.unit_price,
  o.order_date
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN products p ON o.product_id = p.product_id
ORDER BY o.order_id;`,
  solutionExplanation: `## Explanation

### Pattern: Multi-table JOIN

This uses the **three-table join** pattern to combine data from multiple related tables in a single query.

### Step-by-step
1. **FROM orders o**: Start from the orders table as the central table.
2. **JOIN customers c ON o.customer_id = c.customer_id**: Attach customer details to each order.
3. **JOIN products p ON o.product_id = p.product_id**: Attach product details to each order.
4. **SELECT columns from all three tables**: Pull the required fields from each table.
5. **ORDER BY o.order_id**: Sort for consistent output.

### Why this approach?
Chaining JOINs is the standard way to denormalize data from a normalized schema. Each JOIN adds one more table's columns to the result set. The database optimizer handles the join order efficiently.

### When to use
- Building reports that combine transactional data with reference/dimension data
- Any time you need information spread across 3+ related tables
- Fulfillment reports, invoice details, audit trails`,
  testCases: [
    {
      name: "default",
      description: "Returns all 10 orders with customer names and product details",
      expectedColumns: ["order_id", "first_name", "last_name", "product_name", "quantity", "unit_price", "order_date"],
      expectedRows: [
        { order_id: 1001, first_name: "Alice", last_name: "Martin", product_name: "Wireless Mouse", quantity: 2, unit_price: 29.99, order_date: "2024-01-15" },
        { order_id: 1002, first_name: "Bob", last_name: "Johnson", product_name: "Notebook Pack", quantity: 5, unit_price: 12.50, order_date: "2024-01-18" },
        { order_id: 1003, first_name: "Alice", last_name: "Martin", product_name: "USB-C Hub", quantity: 1, unit_price: 49.99, order_date: "2024-01-20" },
        { order_id: 1004, first_name: "Charlie", last_name: "Lee", product_name: "Webcam HD", quantity: 1, unit_price: 79.99, order_date: "2024-02-01" },
        { order_id: 1005, first_name: "Diana", last_name: "Park", product_name: "Wireless Mouse", quantity: 3, unit_price: 29.99, order_date: "2024-02-05" },
        { order_id: 1006, first_name: "Bob", last_name: "Johnson", product_name: "Standing Desk Mat", quantity: 1, unit_price: 45.00, order_date: "2024-02-10" },
        { order_id: 1007, first_name: "Eve", last_name: "Garcia", product_name: "Notebook Pack", quantity: 10, unit_price: 12.50, order_date: "2024-02-14" },
        { order_id: 1008, first_name: "Charlie", last_name: "Lee", product_name: "USB-C Hub", quantity: 2, unit_price: 49.99, order_date: "2024-02-20" },
        { order_id: 1009, first_name: "Alice", last_name: "Martin", product_name: "Standing Desk Mat", quantity: 1, unit_price: 45.00, order_date: "2024-03-01" },
        { order_id: 1010, first_name: "Diana", last_name: "Park", product_name: "Webcam HD", quantity: 1, unit_price: 79.99, order_date: "2024-03-05" },
      ],
      orderMatters: true,
    },
    {
      name: "filtered-by-month",
      description: "After removing January orders, only February and March orders appear",
      setupSql: `DELETE FROM orders WHERE order_date < '2024-02-01';`,
      expectedColumns: ["order_id", "first_name", "last_name", "product_name", "quantity", "unit_price", "order_date"],
      expectedRows: [
        { order_id: 1004, first_name: "Charlie", last_name: "Lee", product_name: "Webcam HD", quantity: 1, unit_price: 79.99, order_date: "2024-02-01" },
        { order_id: 1005, first_name: "Diana", last_name: "Park", product_name: "Wireless Mouse", quantity: 3, unit_price: 29.99, order_date: "2024-02-05" },
        { order_id: 1006, first_name: "Bob", last_name: "Johnson", product_name: "Standing Desk Mat", quantity: 1, unit_price: 45.00, order_date: "2024-02-10" },
        { order_id: 1007, first_name: "Eve", last_name: "Garcia", product_name: "Notebook Pack", quantity: 10, unit_price: 12.50, order_date: "2024-02-14" },
        { order_id: 1008, first_name: "Charlie", last_name: "Lee", product_name: "USB-C Hub", quantity: 2, unit_price: 49.99, order_date: "2024-02-20" },
        { order_id: 1009, first_name: "Alice", last_name: "Martin", product_name: "Standing Desk Mat", quantity: 1, unit_price: 45.00, order_date: "2024-03-01" },
        { order_id: 1010, first_name: "Diana", last_name: "Park", product_name: "Webcam HD", quantity: 1, unit_price: 79.99, order_date: "2024-03-05" },
      ],
      orderMatters: true,
    },
  ],
};
