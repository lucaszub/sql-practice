import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "32-is-null-check",
  title: "Flag Products Missing Descriptions",
  difficulty: "easy",
  category: "null-handling",
  description: `## Flag Products Missing Descriptions

The catalog team has discovered that some products in the online store are missing descriptions. These incomplete listings hurt SEO and confuse customers. They need a list of all products that are **missing a description** so the content team can prioritize fixes.

### Schema

**products**
| Column | Type |
|--------|------|
| product_id | INTEGER |
| product_name | VARCHAR |
| category | VARCHAR |
| description | VARCHAR |
| price | DECIMAL(10,2) |
| is_active | BOOLEAN |

### Task

Write a query that returns the \`product_id\`, \`product_name\`, and \`category\` of all products where the \`description\` is NULL.

### Expected output columns
\`product_id\`, \`product_name\`, \`category\`

Order by \`product_id\` ASC.`,
  hint: "Use IS NULL to test for missing values. Remember: you cannot use = NULL in SQL -- NULL is not equal to anything, not even itself.",
  schema: `CREATE TABLE products (
  product_id INTEGER,
  product_name VARCHAR,
  category VARCHAR,
  description VARCHAR,
  price DECIMAL(10,2),
  is_active BOOLEAN
);

INSERT INTO products VALUES
  (1, 'Wireless Mouse', 'Electronics', 'Ergonomic wireless mouse with adjustable DPI', 29.99, true),
  (2, 'USB-C Hub', 'Electronics', NULL, 49.99, true),
  (3, 'Standing Desk Mat', 'Office', 'Anti-fatigue mat for standing desks', 39.99, true),
  (4, 'Mechanical Keyboard', 'Electronics', 'Cherry MX Blue switches, full-size layout', 89.99, true),
  (5, 'Desk Lamp', 'Office', NULL, 24.99, true),
  (6, 'Monitor Arm', 'Office', NULL, 119.99, true),
  (7, 'Webcam HD', 'Electronics', '1080p webcam with built-in microphone', 59.99, true),
  (8, 'Cable Management Kit', 'Accessories', NULL, 14.99, true),
  (9, 'Laptop Stand', 'Accessories', 'Aluminum laptop stand, adjustable height', 44.99, true),
  (10, 'Screen Protector', 'Accessories', NULL, 9.99, false),
  (11, 'Wireless Charger', 'Electronics', 'Fast-charge Qi wireless charging pad', 19.99, true),
  (12, 'Ergonomic Chair', 'Office', NULL, 299.99, true),
  (13, 'Noise Canceling Headphones', 'Electronics', 'Over-ear headphones with ANC', 149.99, true),
  (14, 'Portable SSD', 'Electronics', NULL, 79.99, true),
  (15, 'Desk Organizer', 'Office', 'Bamboo desk organizer with 5 compartments', 22.99, true);`,
  solutionQuery: `SELECT product_id, product_name, category
FROM products
WHERE description IS NULL
ORDER BY product_id;`,
  solutionExplanation: `## Explanation

### Pattern: IS NULL Check

This exercise uses the fundamental **IS NULL** pattern to identify rows with missing data.

### Step-by-step
1. **SELECT product_id, product_name, category**: Return only the columns the catalog team needs to identify the products.
2. **WHERE description IS NULL**: Filters to only rows where the description column has no value. This is the only correct way to check for NULLs in SQL.
3. **ORDER BY product_id**: Ensures deterministic output for easy review.

### Why this approach
In SQL, NULL represents a missing or unknown value. You cannot use \`= NULL\` or \`!= NULL\` because NULL is not a value -- it is the absence of a value. Any comparison with NULL using \`=\` returns NULL (not true or false), so the row would be excluded. \`IS NULL\` is the dedicated operator designed for this purpose.

### When to use
- Data quality audits: finding incomplete records that need attention
- Pre-migration checks: ensuring required fields are populated before a schema change
- Dashboard filters: separating "known" from "unknown" data
- Any time you need to identify or exclude missing values in a dataset`,
  testCases: [
    {
      name: "default",
      description: "Returns all products with NULL descriptions",
      expectedColumns: ["product_id", "product_name", "category"],
      expectedRows: [
        { product_id: 2, product_name: "USB-C Hub", category: "Electronics" },
        { product_id: 5, product_name: "Desk Lamp", category: "Office" },
        { product_id: 6, product_name: "Monitor Arm", category: "Office" },
        { product_id: 8, product_name: "Cable Management Kit", category: "Accessories" },
        { product_id: 10, product_name: "Screen Protector", category: "Accessories" },
        { product_id: 12, product_name: "Ergonomic Chair", category: "Office" },
        { product_id: 14, product_name: "Portable SSD", category: "Electronics" },
      ],
      orderMatters: true,
    },
    {
      name: "no-nulls-after-fix",
      description: "After filling in all missing descriptions, the query returns no rows",
      setupSql: `UPDATE products SET description = 'Placeholder description' WHERE description IS NULL;`,
      expectedColumns: ["product_id", "product_name", "category"],
      expectedRows: [],
      orderMatters: false,
    },
  ],
};
