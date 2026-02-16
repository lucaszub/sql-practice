import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "33-coalesce-defaults",
  title: "Clean Up NULL Categories for Reporting",
  difficulty: "easy",
  category: "null-handling",
  description: `## Clean Up NULL Categories for Reporting

The reporting dashboard currently shows "null" for products that have no category assigned. The product team wants a cleaner display: replace any NULL category with **'Uncategorized'** so that every product has a visible category label.

### Schema

**products**
| Column | Type |
|--------|------|
| product_id | INTEGER |
| product_name | VARCHAR |
| category | VARCHAR |
| price | DECIMAL(10,2) |
| supplier | VARCHAR |

### Task

Write a query that returns the \`product_id\`, \`product_name\`, and a column called \`display_category\` that shows the product's category if it exists, or \`'Uncategorized'\` if the category is NULL.

### Expected output columns
\`product_id\`, \`product_name\`, \`display_category\`

Order by \`product_id\` ASC.`,
  hint: "The COALESCE function returns the first non-NULL value from its arguments. COALESCE(category, 'Uncategorized') will return category when it has a value, and 'Uncategorized' when it is NULL.",
  schema: `CREATE TABLE products (
  product_id INTEGER,
  product_name VARCHAR,
  category VARCHAR,
  price DECIMAL(10,2),
  supplier VARCHAR
);

INSERT INTO products VALUES
  (1, 'Wireless Mouse', 'Electronics', 29.99, 'TechCorp'),
  (2, 'USB-C Hub', NULL, 49.99, 'TechCorp'),
  (3, 'Standing Desk Mat', 'Office', 39.99, 'ErgoWorks'),
  (4, 'Mechanical Keyboard', 'Electronics', 89.99, 'KeyMaster'),
  (5, 'Desk Lamp', 'Office', 24.99, 'BrightLife'),
  (6, 'Phone Case', NULL, 12.99, 'ShieldCo'),
  (7, 'Webcam HD', 'Electronics', 59.99, 'TechCorp'),
  (8, 'Cable Management Kit', NULL, 14.99, 'OrganizerPro'),
  (9, 'Laptop Stand', 'Accessories', 44.99, 'ErgoWorks'),
  (10, 'Screen Protector', NULL, 9.99, 'ShieldCo'),
  (11, 'Wireless Charger', 'Electronics', 19.99, 'TechCorp'),
  (12, 'Notebook', 'Office', 7.99, 'PaperWorks'),
  (13, 'Headphone Stand', NULL, 18.99, 'OrganizerPro'),
  (14, 'Portable SSD', 'Electronics', 79.99, 'DataSafe'),
  (15, 'Desk Organizer', 'Office', 22.99, 'OrganizerPro');`,
  solutionQuery: `SELECT
  product_id,
  product_name,
  COALESCE(category, 'Uncategorized') AS display_category
FROM products
ORDER BY product_id;`,
  solutionExplanation: `## Explanation

### Pattern: COALESCE for Default Values

This exercise uses the **COALESCE** function to replace NULL values with a meaningful default.

### Step-by-step
1. **SELECT product_id, product_name**: Return the identifying columns as-is.
2. **COALESCE(category, 'Uncategorized') AS display_category**: COALESCE takes multiple arguments and returns the first one that is not NULL. If \`category\` has a value, it is returned. If \`category\` is NULL, the fallback \`'Uncategorized'\` is returned.
3. **ORDER BY product_id**: Ensures deterministic output.

### Why this approach
COALESCE is the standard SQL function for providing default values. It is more readable and portable than alternatives like \`IFNULL\` (MySQL-specific) or \`NVL\` (Oracle-specific). COALESCE also supports multiple fallback arguments -- e.g., \`COALESCE(category, subcategory, 'Unknown')\` -- making it flexible for chains of fallbacks.

### When to use
- Reporting and dashboards: replacing NULLs with user-friendly labels
- Data transformations: ensuring downstream queries never receive NULLs in required columns
- JOIN safety: providing defaults when a LEFT JOIN produces NULLs for unmatched rows
- Any time NULL would cause confusing output or break concatenation/calculation logic`,
  testCases: [
    {
      name: "default",
      description: "Returns all products with NULL categories replaced by 'Uncategorized'",
      expectedColumns: ["product_id", "product_name", "display_category"],
      expectedRows: [
        { product_id: 1, product_name: "Wireless Mouse", display_category: "Electronics" },
        { product_id: 2, product_name: "USB-C Hub", display_category: "Uncategorized" },
        { product_id: 3, product_name: "Standing Desk Mat", display_category: "Office" },
        { product_id: 4, product_name: "Mechanical Keyboard", display_category: "Electronics" },
        { product_id: 5, product_name: "Desk Lamp", display_category: "Office" },
        { product_id: 6, product_name: "Phone Case", display_category: "Uncategorized" },
        { product_id: 7, product_name: "Webcam HD", display_category: "Electronics" },
        { product_id: 8, product_name: "Cable Management Kit", display_category: "Uncategorized" },
        { product_id: 9, product_name: "Laptop Stand", display_category: "Accessories" },
        { product_id: 10, product_name: "Screen Protector", display_category: "Uncategorized" },
        { product_id: 11, product_name: "Wireless Charger", display_category: "Electronics" },
        { product_id: 12, product_name: "Notebook", display_category: "Office" },
        { product_id: 13, product_name: "Headphone Stand", display_category: "Uncategorized" },
        { product_id: 14, product_name: "Portable SSD", display_category: "Electronics" },
        { product_id: 15, product_name: "Desk Organizer", display_category: "Office" },
      ],
      orderMatters: true,
    },
    {
      name: "all-null-categories",
      description: "When all categories are NULL, every row should show 'Uncategorized'",
      setupSql: `UPDATE products SET category = NULL;`,
      expectedColumns: ["product_id", "product_name", "display_category"],
      expectedRows: [
        { product_id: 1, product_name: "Wireless Mouse", display_category: "Uncategorized" },
        { product_id: 2, product_name: "USB-C Hub", display_category: "Uncategorized" },
        { product_id: 3, product_name: "Standing Desk Mat", display_category: "Uncategorized" },
        { product_id: 4, product_name: "Mechanical Keyboard", display_category: "Uncategorized" },
        { product_id: 5, product_name: "Desk Lamp", display_category: "Uncategorized" },
        { product_id: 6, product_name: "Phone Case", display_category: "Uncategorized" },
        { product_id: 7, product_name: "Webcam HD", display_category: "Uncategorized" },
        { product_id: 8, product_name: "Cable Management Kit", display_category: "Uncategorized" },
        { product_id: 9, product_name: "Laptop Stand", display_category: "Uncategorized" },
        { product_id: 10, product_name: "Screen Protector", display_category: "Uncategorized" },
        { product_id: 11, product_name: "Wireless Charger", display_category: "Uncategorized" },
        { product_id: 12, product_name: "Notebook", display_category: "Uncategorized" },
        { product_id: 13, product_name: "Headphone Stand", display_category: "Uncategorized" },
        { product_id: 14, product_name: "Portable SSD", display_category: "Uncategorized" },
        { product_id: 15, product_name: "Desk Organizer", display_category: "Uncategorized" },
      ],
      orderMatters: true,
    },
  ],
};
