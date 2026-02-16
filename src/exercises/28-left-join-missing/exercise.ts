import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "28-left-join-missing",
  title: "Find Products Never Ordered",
  titleFr: "Trouver les produits jamais commandes",
  difficulty: "easy",
  category: "basic-joins",
  description: `## Find Products Never Ordered

The QA team needs to find all products that have never been ordered. These products may need to be delisted from the catalog or investigated for pricing issues.

Write a query that returns products with zero orders. Use a LEFT JOIN approach.

### Schema

**products**
| Column | Type |
|--------|------|
| product_id | INTEGER |
| product_name | VARCHAR |
| category | VARCHAR |
| price | DECIMAL(10,2) |
| created_date | DATE |

**order_items**
| Column | Type |
|--------|------|
| item_id | INTEGER |
| order_id | INTEGER |
| product_id | INTEGER |
| quantity | INTEGER |
| unit_price | DECIMAL(10,2) |

### Expected output columns
\`product_id\`, \`product_name\`, \`category\`, \`price\`

Order by \`product_id\` ASC.`,
  hint: "Use LEFT JOIN from products to order_items, then filter WHERE order_items.item_id IS NULL. This is the anti-join pattern -- it finds rows in the left table with no match in the right table.",
  schema: `CREATE TABLE products (
  product_id INTEGER,
  product_name VARCHAR,
  category VARCHAR,
  price DECIMAL(10,2),
  created_date DATE
);

CREATE TABLE order_items (
  item_id INTEGER,
  order_id INTEGER,
  product_id INTEGER,
  quantity INTEGER,
  unit_price DECIMAL(10,2)
);

INSERT INTO products VALUES
  (1, 'Wireless Mouse', 'Electronics', 29.99, '2023-06-01'),
  (2, 'Mechanical Keyboard', 'Electronics', 89.99, '2023-06-15'),
  (3, 'USB-C Hub', 'Electronics', 45.00, '2023-07-01'),
  (4, 'Desk Lamp', 'Home Office', 34.50, '2023-07-20'),
  (5, 'Monitor Stand', 'Home Office', 59.99, '2023-08-01'),
  (6, 'Webcam HD', 'Electronics', 74.99, '2023-08-15'),
  (7, 'Cable Organizer', 'Accessories', 12.99, '2023-09-01'),
  (8, 'Laptop Sleeve', 'Accessories', 24.99, '2023-09-15'),
  (9, 'Ergonomic Chair', 'Furniture', 349.00, '2023-10-01'),
  (10, 'Standing Desk Mat', 'Furniture', 49.99, '2023-10-15'),
  (11, 'Noise-Cancel Headphones', 'Electronics', 199.99, '2023-11-01'),
  (12, 'Bluetooth Speaker', 'Electronics', 39.99, '2023-11-15');

INSERT INTO order_items VALUES
  (1, 101, 1, 2, 29.99),
  (2, 101, 3, 1, 45.00),
  (3, 102, 2, 1, 89.99),
  (4, 102, 4, 1, 34.50),
  (5, 103, 1, 1, 29.99),
  (6, 103, 6, 1, 74.99),
  (7, 104, 5, 2, 59.99),
  (8, 105, 2, 1, 89.99),
  (9, 105, 1, 3, 29.99),
  (10, 106, 9, 1, 349.00),
  (11, 107, 4, 2, 34.50),
  (12, 107, 3, 1, 45.00);`,
  solutionQuery: `SELECT
  p.product_id,
  p.product_name,
  p.category,
  p.price
FROM products p
LEFT JOIN order_items oi ON p.product_id = oi.product_id
WHERE oi.item_id IS NULL
ORDER BY p.product_id;`,
  solutionExplanation: `## Explanation

### Pattern: Anti-Join (LEFT JOIN + IS NULL)

This uses the **anti-join** pattern to find rows in one table that have no matching rows in another table.

### Step-by-step
1. **LEFT JOIN order_items oi ON p.product_id = oi.product_id**: Keep all products. For products that appear in order_items, the join columns will have values. For products never ordered, all order_items columns will be NULL.
2. **WHERE oi.item_id IS NULL**: Filter to only the products where the join found no match -- these are the never-ordered products.
3. **ORDER BY p.product_id**: Consistent ordering for the report.

### Why this approach?
The LEFT JOIN + IS NULL pattern is the most common and readable way to find "missing" records. It clearly communicates the intent: "give me everything from the left table that has nothing on the right."

### Alternative approaches
- \`WHERE NOT EXISTS (SELECT 1 FROM order_items WHERE product_id = p.product_id)\` -- equivalent, sometimes preferred for complex conditions
- \`WHERE p.product_id NOT IN (SELECT product_id FROM order_items)\` -- caution: behaves unexpectedly if the subquery returns NULLs

### When to use
- Finding unmatched records: products never sold, customers never contacted, tickets never assigned
- Data quality audits: orphaned records, missing relationships
- Catalog cleanup: identifying stale or unused items`,
  testCases: [
    {
      name: "default",
      description: "Products that have never appeared in any order",
      expectedColumns: ["product_id", "product_name", "category", "price"],
      expectedRows: [
        { product_id: 7, product_name: "Cable Organizer", category: "Accessories", price: 12.99 },
        { product_id: 8, product_name: "Laptop Sleeve", category: "Accessories", price: 24.99 },
        { product_id: 10, product_name: "Standing Desk Mat", category: "Furniture", price: 49.99 },
        { product_id: 11, product_name: "Noise-Cancel Headphones", category: "Electronics", price: 199.99 },
        { product_id: 12, product_name: "Bluetooth Speaker", category: "Electronics", price: 39.99 },
      ],
      orderMatters: true,
    },
    {
      name: "all-products-ordered",
      description: "Returns empty result when every product has been ordered at least once",
      setupSql: `INSERT INTO order_items VALUES
        (13, 108, 7, 1, 12.99),
        (14, 108, 8, 1, 24.99),
        (15, 109, 10, 1, 49.99),
        (16, 109, 11, 1, 199.99),
        (17, 110, 12, 2, 39.99);`,
      expectedColumns: ["product_id", "product_name", "category", "price"],
      expectedRows: [],
      orderMatters: false,
    },
  ],
};
