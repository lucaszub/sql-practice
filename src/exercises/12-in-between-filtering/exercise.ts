import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "12-in-between-filtering",
  title: "Promotion-Eligible Products",
  difficulty: "easy",
  category: "select-fundamentals",
  description: `## Promotion-Eligible Products

The merchandising team is preparing an upcoming mid-range promotion. They need all products that belong to the **'Electronics'**, **'Books'**, or **'Home & Kitchen'** categories **and** are priced between **$20 and $80** (inclusive).

### Schema

**products**
| Column | Type |
|--------|------|
| product_id | INTEGER |
| product_name | VARCHAR |
| category | VARCHAR |
| price | DECIMAL(10,2) |
| in_stock | BOOLEAN |

### Task

Write a query that returns products matching **both** criteria: the category must be one of the three listed above, and the price must fall within the $20-$80 range (inclusive on both ends).

### Expected output columns
\`product_id\`, \`product_name\`, \`category\`, \`price\`

Order by \`price\` ASC, then \`product_id\` ASC.`,
  hint: "Use the IN operator to check membership in a list of categories, and BETWEEN to check a range. Combine them with AND.",
  schema: `CREATE TABLE products (
  product_id INTEGER,
  product_name VARCHAR,
  category VARCHAR,
  price DECIMAL(10,2),
  in_stock BOOLEAN
);

INSERT INTO products VALUES
  (1, 'Wireless Mouse', 'Electronics', 25.99, true),
  (2, 'Mechanical Keyboard', 'Electronics', 89.99, true),
  (3, 'USB-C Hub', 'Electronics', 34.50, true),
  (4, 'HDMI Cable', 'Electronics', 12.99, true),
  (5, 'Monitor Stand', 'Electronics', 45.00, false),
  (6, 'The Great Gatsby', 'Books', 14.99, true),
  (7, 'SQL Cookbook', 'Books', 49.95, true),
  (8, 'Data Science Handbook', 'Books', 62.00, true),
  (9, 'Clean Code', 'Books', 38.50, true),
  (10, 'Fiction Bundle', 'Books', 80.00, true),
  (11, 'Coffee Maker', 'Home & Kitchen', 79.99, true),
  (12, 'Blender', 'Home & Kitchen', 55.00, false),
  (13, 'Toaster', 'Home & Kitchen', 29.99, true),
  (14, 'Air Fryer', 'Home & Kitchen', 120.00, true),
  (15, 'Cutting Board', 'Home & Kitchen', 19.99, true),
  (16, 'Yoga Mat', 'Sports', 25.00, true),
  (17, 'Running Shoes', 'Sports', 75.00, true),
  (18, 'Desk Lamp', 'Home & Kitchen', 42.50, true),
  (19, 'Notebook Set', 'Books', 20.00, true),
  (20, 'Webcam', 'Electronics', 59.99, true);`,
  solutionQuery: `SELECT product_id, product_name, category, price
FROM products
WHERE category IN ('Electronics', 'Books', 'Home & Kitchen')
  AND price BETWEEN 20 AND 80
ORDER BY price ASC, product_id ASC;`,
  solutionExplanation: `## Explanation

### IN and BETWEEN Filtering Pattern
This exercise combines two filtering operators to narrow down results on multiple dimensions simultaneously.

### Step-by-step
1. **IN ('Electronics', 'Books', 'Home & Kitchen')**: Checks if the category matches any value in the list. This is equivalent to writing \`category = 'Electronics' OR category = 'Books' OR category = 'Home & Kitchen'\`, but much more readable.
2. **BETWEEN 20 AND 80**: Checks if the price falls within the inclusive range [$20, $80]. This is equivalent to \`price >= 20 AND price <= 80\`. Note that BETWEEN is inclusive on both ends.
3. **AND**: Both conditions must be true for a row to appear in the results.
4. **ORDER BY price ASC, product_id ASC**: Primary sort by price, with product_id as a tiebreaker for products at the same price.

### Why this approach
- \`IN\` is cleaner and more maintainable than chaining multiple OR conditions, especially as the list grows.
- \`BETWEEN\` clearly communicates a range check and is less error-prone than writing two separate comparisons.
- Combining them with AND creates a precise multi-dimensional filter.

### When to use
- Filtering products by category for promotions, catalog pages, or inventory reports
- Any scenario where you need to match against a set of values AND a numeric range
- Report generation with predefined categories and thresholds`,
  testCases: [
    {
      name: "default",
      description: "Returns products in target categories within $20-$80 price range",
      expectedColumns: ["product_id", "product_name", "category", "price"],
      expectedRows: [
        { product_id: 19, product_name: "Notebook Set", category: "Books", price: 20.00 },
        { product_id: 1, product_name: "Wireless Mouse", category: "Electronics", price: 25.99 },
        { product_id: 13, product_name: "Toaster", category: "Home & Kitchen", price: 29.99 },
        { product_id: 3, product_name: "USB-C Hub", category: "Electronics", price: 34.50 },
        { product_id: 9, product_name: "Clean Code", category: "Books", price: 38.50 },
        { product_id: 18, product_name: "Desk Lamp", category: "Home & Kitchen", price: 42.50 },
        { product_id: 5, product_name: "Monitor Stand", category: "Electronics", price: 45.00 },
        { product_id: 7, product_name: "SQL Cookbook", category: "Books", price: 49.95 },
        { product_id: 12, product_name: "Blender", category: "Home & Kitchen", price: 55.00 },
        { product_id: 20, product_name: "Webcam", category: "Electronics", price: 59.99 },
        { product_id: 8, product_name: "Data Science Handbook", category: "Books", price: 62.00 },
        { product_id: 11, product_name: "Coffee Maker", category: "Home & Kitchen", price: 79.99 },
        { product_id: 10, product_name: "Fiction Bundle", category: "Books", price: 80.00 },
      ],
      orderMatters: true,
    },
    {
      name: "boundary-values-included",
      description: "Confirms BETWEEN is inclusive by checking exact boundary values $20 and $80",
      setupSql: `DELETE FROM products WHERE product_id NOT IN (10, 19);`,
      expectedColumns: ["product_id", "product_name", "category", "price"],
      expectedRows: [
        { product_id: 19, product_name: "Notebook Set", category: "Books", price: 20.00 },
        { product_id: 10, product_name: "Fiction Bundle", category: "Books", price: 80.00 },
      ],
      orderMatters: true,
    },
  ],
};
