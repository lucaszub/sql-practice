import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "14-sorting-results",
  title: "Premium Catalog by Price",
  difficulty: "easy",
  category: "select-fundamentals",
  description: `## Premium Catalog by Price

The product team is building a premium catalog page that displays products sorted by price from **highest to lowest**. When two products share the same price, they should be sorted alphabetically by product name (A-Z).

### Schema

**products**
| Column | Type |
|--------|------|
| product_id | INTEGER |
| product_name | VARCHAR |
| category | VARCHAR |
| price | DECIMAL(10,2) |
| rating | DECIMAL(2,1) |

### Task

Write a query that returns all products, sorted by \`price\` in **descending** order. For products with the same price, sort by \`product_name\` in **ascending** order.

### Expected output columns
\`product_id\`, \`product_name\`, \`category\`, \`price\`

Order by \`price\` DESC, then \`product_name\` ASC.`,
  hint: "Use ORDER BY with two columns. The first column determines the primary sort direction, and the second acts as a tiebreaker. Remember to specify ASC or DESC for each column independently.",
  schema: `CREATE TABLE products (
  product_id INTEGER,
  product_name VARCHAR,
  category VARCHAR,
  price DECIMAL(10,2),
  rating DECIMAL(2,1)
);

INSERT INTO products VALUES
  (1, 'Laptop Pro', 'Electronics', 1299.99, 4.5),
  (2, 'Wireless Earbuds', 'Electronics', 79.99, 4.2),
  (3, 'Standing Desk', 'Furniture', 449.00, 4.7),
  (4, 'Ergonomic Chair', 'Furniture', 449.00, 4.8),
  (5, 'Mechanical Keyboard', 'Electronics', 149.99, 4.6),
  (6, 'Monitor 27"', 'Electronics', 349.99, 4.4),
  (7, 'Desk Lamp', 'Furniture', 39.99, 3.9),
  (8, 'Webcam HD', 'Electronics', 59.99, 4.0),
  (9, 'USB-C Dock', 'Electronics', 149.99, 4.3),
  (10, 'Notebook Pack', 'Stationery', 12.50, 4.1),
  (11, 'Gel Pen Set', 'Stationery', 8.99, 4.5),
  (12, 'Bookshelf', 'Furniture', 199.00, 4.2),
  (13, 'Tablet', 'Electronics', 599.00, 4.6),
  (14, 'Phone Stand', 'Electronics', 19.99, 3.8),
  (15, 'Wireless Mouse', 'Electronics', 29.99, 4.3);`,
  solutionQuery: `SELECT product_id, product_name, category, price
FROM products
ORDER BY price DESC, product_name ASC;`,
  solutionExplanation: `## Explanation

### Sorting with ORDER BY
This exercise demonstrates the **multi-column ORDER BY** pattern, which is essential for producing deterministic, well-organized query results.

### Step-by-step
1. **ORDER BY price DESC**: Sort all rows by price from highest to lowest. The most expensive products appear first.
2. **product_name ASC**: For products that share the same price (e.g., Standing Desk and Ergonomic Chair at $449.00, or Mechanical Keyboard and USB-C Dock at $149.99), break the tie alphabetically by name.

### Key concepts
- Each column in ORDER BY can have its own sort direction (ASC or DESC).
- ASC (ascending) is the default if you omit the direction keyword.
- The sort is applied left to right: the first column is the primary sort key, subsequent columns are tiebreakers.
- NULLs sort last in ASC order and first in DESC order by default in most databases (DuckDB follows this convention). You can override this with NULLS FIRST / NULLS LAST.

### Why this approach
Multi-column ordering ensures deterministic results. Without a tiebreaker, rows with the same price could appear in any order, making the output unpredictable and hard to test.

### When to use
- Building catalog or listing pages with user-facing sort order
- Generating reports with a primary metric and a secondary alphabetical sort
- Any query where deterministic ordering is required for testing or pagination`,
  testCases: [
    {
      name: "default",
      description: "Products sorted by price DESC, name ASC as tiebreaker",
      expectedColumns: ["product_id", "product_name", "category", "price"],
      expectedRows: [
        { product_id: 1, product_name: "Laptop Pro", category: "Electronics", price: 1299.99 },
        { product_id: 13, product_name: "Tablet", category: "Electronics", price: 599.00 },
        { product_id: 4, product_name: "Ergonomic Chair", category: "Furniture", price: 449.00 },
        { product_id: 3, product_name: "Standing Desk", category: "Furniture", price: 449.00 },
        { product_id: 6, product_name: "Monitor 27\"", category: "Electronics", price: 349.99 },
        { product_id: 12, product_name: "Bookshelf", category: "Furniture", price: 199.00 },
        { product_id: 5, product_name: "Mechanical Keyboard", category: "Electronics", price: 149.99 },
        { product_id: 9, product_name: "USB-C Dock", category: "Electronics", price: 149.99 },
        { product_id: 2, product_name: "Wireless Earbuds", category: "Electronics", price: 79.99 },
        { product_id: 8, product_name: "Webcam HD", category: "Electronics", price: 59.99 },
        { product_id: 7, product_name: "Desk Lamp", category: "Furniture", price: 39.99 },
        { product_id: 15, product_name: "Wireless Mouse", category: "Electronics", price: 29.99 },
        { product_id: 14, product_name: "Phone Stand", category: "Electronics", price: 19.99 },
        { product_id: 10, product_name: "Notebook Pack", category: "Stationery", price: 12.50 },
        { product_id: 11, product_name: "Gel Pen Set", category: "Stationery", price: 8.99 },
      ],
      orderMatters: true,
    },
    {
      name: "tiebreaker-ordering",
      description: "Verifies alphabetical tiebreaker for products at same price",
      setupSql: `DELETE FROM products WHERE product_id NOT IN (3, 4, 5, 9);`,
      expectedColumns: ["product_id", "product_name", "category", "price"],
      expectedRows: [
        { product_id: 4, product_name: "Ergonomic Chair", category: "Furniture", price: 449.00 },
        { product_id: 3, product_name: "Standing Desk", category: "Furniture", price: 449.00 },
        { product_id: 5, product_name: "Mechanical Keyboard", category: "Electronics", price: 149.99 },
        { product_id: 9, product_name: "USB-C Dock", category: "Electronics", price: 149.99 },
      ],
      orderMatters: true,
    },
  ],
};
