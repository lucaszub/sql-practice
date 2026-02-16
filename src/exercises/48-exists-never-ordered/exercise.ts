import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "48-exists-never-ordered",
  title: "Products Never Ordered",
  difficulty: "medium",
  category: "subqueries-ctes",
  description: `## Products Never Ordered

The inventory team wants to identify products that have **never been ordered**. These products may need to be discontinued or promoted to increase sales.

Write a query using NOT EXISTS to find all products with no matching order items.

### Schema

**products**
| Column | Type |
|--------|------|
| product_id | INTEGER |
| product_name | VARCHAR |
| category | VARCHAR |
| price | DECIMAL(10,2) |

**order_items**
| Column | Type |
|--------|------|
| item_id | INTEGER |
| order_id | INTEGER |
| product_id | INTEGER |
| quantity | INTEGER |

### Expected output columns
\`product_id\`, \`product_name\`, \`category\`, \`price\`

Order by \`product_id\` ASC.`,
  hint: "Use NOT EXISTS with a correlated subquery: WHERE NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_id = p.product_id). This checks, for each product, whether any order item references it.",
  schema: `CREATE TABLE products (
  product_id INTEGER PRIMARY KEY,
  product_name VARCHAR,
  category VARCHAR,
  price DECIMAL(10,2)
);

CREATE TABLE order_items (
  item_id INTEGER PRIMARY KEY,
  order_id INTEGER,
  product_id INTEGER,
  quantity INTEGER
);

INSERT INTO products VALUES
  (1, 'Wireless Mouse', 'Electronics', 29.99),
  (2, 'USB-C Hub', 'Electronics', 49.99),
  (3, 'Notebook Pack', 'Office', 12.50),
  (4, 'Standing Desk', 'Furniture', 299.99),
  (5, 'Keyboard', 'Electronics', 69.99),
  (6, 'Desk Lamp', 'Furniture', 45.99),
  (7, 'Monitor Stand', 'Furniture', 89.99),
  (8, 'Paper Clips', 'Office', 3.99),
  (9, 'Whiteboard', 'Office', 129.99),
  (10, 'Webcam HD', 'Electronics', 79.99);

INSERT INTO order_items VALUES
  (1, 1001, 1, 2),
  (2, 1001, 3, 5),
  (3, 1002, 2, 1),
  (4, 1002, 5, 1),
  (5, 1003, 4, 1),
  (6, 1003, 1, 3),
  (7, 1004, 6, 2),
  (8, 1004, 3, 4),
  (9, 1005, 10, 1),
  (10, 1005, 2, 2);`,
  solutionQuery: `SELECT
  p.product_id,
  p.product_name,
  p.category,
  p.price
FROM products p
WHERE NOT EXISTS (
  SELECT 1
  FROM order_items oi
  WHERE oi.product_id = p.product_id
)
ORDER BY p.product_id;`,
  solutionExplanation: `## Explanation

### Pattern: NOT EXISTS (Anti-join)

This uses the **NOT EXISTS** pattern to find records in one table that have no matching records in another.

### Step-by-step
1. **FROM products p**: Start from the products table.
2. **WHERE NOT EXISTS (...)**: For each product, check if any order item references it.
3. **SELECT 1**: The subquery just checks for existence -- the actual selected value doesn't matter.
4. **WHERE oi.product_id = p.product_id**: Correlates the subquery to the outer query.

### NOT EXISTS vs LEFT JOIN + IS NULL
Both achieve the same result:
- \`NOT EXISTS\`: More readable for "find things that don't have..."
- \`LEFT JOIN + WHERE IS NULL\`: Sometimes preferred when you need columns from the right table.
Performance is typically identical in modern databases.

### When to use
- Finding unmatched records (products never sold, users who never logged in)
- Data quality checks (orphaned records, missing references)
- Business questions like "which X has never had Y?"`,
  testCases: [
    {
      name: "default",
      description: "Returns 3 products that have never been ordered",
      expectedColumns: ["product_id", "product_name", "category", "price"],
      expectedRows: [
        { product_id: 7, product_name: "Monitor Stand", category: "Furniture", price: 89.99 },
        { product_id: 8, product_name: "Paper Clips", category: "Office", price: 3.99 },
        { product_id: 9, product_name: "Whiteboard", category: "Office", price: 129.99 },
      ],
      orderMatters: true,
    },
    {
      name: "all-products-ordered",
      description: "After ordering the remaining products, no unordered products remain",
      setupSql: `INSERT INTO order_items VALUES (11, 1006, 7, 1), (12, 1006, 8, 10), (13, 1006, 9, 1);`,
      expectedColumns: ["product_id", "product_name", "category", "price"],
      expectedRows: [],
      orderMatters: false,
    },
  ],
};
