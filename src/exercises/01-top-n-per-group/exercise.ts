import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "01-top-n-per-group",
  title: "Top N Per Group",
  difficulty: "medium",
  category: "window-functions",
  description: `## Top N Per Group

Given a \`products\` table, write a query to find the **top 3 products per category** by revenue.

If two products have the same revenue, include both (use \`RANK()\`, not \`ROW_NUMBER()\`).

### Schema

| Column | Type |
|--------|------|
| product_id | INTEGER |
| category | VARCHAR |
| product_name | VARCHAR |
| revenue | DECIMAL(10,2) |

### Expected output columns
\`category\`, \`product_name\`, \`revenue\`, \`rank\`

Order by category ASC, rank ASC.`,
  hint: "Use RANK() OVER (PARTITION BY category ORDER BY revenue DESC) and filter with a CTE or subquery where rank <= 3.",
  schema: `CREATE TABLE products (
  product_id INTEGER,
  category VARCHAR,
  product_name VARCHAR,
  revenue DECIMAL(10,2)
);

INSERT INTO products VALUES
  (1, 'Electronics', 'Laptop', 1200.00),
  (2, 'Electronics', 'Phone', 800.00),
  (3, 'Electronics', 'Tablet', 600.00),
  (4, 'Electronics', 'Headphones', 150.00),
  (5, 'Books', 'Novel A', 25.00),
  (6, 'Books', 'Novel B', 30.00),
  (7, 'Books', 'Textbook', 75.00),
  (8, 'Books', 'Comic', 10.00),
  (9, 'Clothing', 'Jacket', 200.00),
  (10, 'Clothing', 'Shirt', 50.00),
  (11, 'Clothing', 'Pants', 80.00);`,
  solutionQuery: `WITH ranked AS (
  SELECT
    category,
    product_name,
    revenue,
    RANK() OVER (PARTITION BY category ORDER BY revenue DESC) as rank
  FROM products
)
SELECT category, product_name, revenue, rank
FROM ranked
WHERE rank <= 3
ORDER BY category, rank;`,
  solutionExplanation: `## Explanation

1. **RANK() window function**: Assigns a rank within each category partition, ordered by revenue descending.
2. **CTE (WITH clause)**: Creates a temporary named result set \`ranked\` containing all products with their rank.
3. **Filter**: The outer query filters to only include ranks 1-3.

### Why RANK() over ROW_NUMBER()?
- \`ROW_NUMBER()\` assigns unique sequential numbers even for ties
- \`RANK()\` gives the same rank to ties (1,1,3) — better for "top N" semantics
- \`DENSE_RANK()\` also handles ties but without gaps (1,1,2)`,
  testCases: [
    {
      name: "default",
      description: "Top 3 products per category with default dataset",
      expectedColumns: ["category", "product_name", "revenue", "rank"],
      expectedRows: [
        { category: "Books", product_name: "Textbook", revenue: 75.0, rank: 1 },
        { category: "Books", product_name: "Novel B", revenue: 30.0, rank: 2 },
        { category: "Books", product_name: "Novel A", revenue: 25.0, rank: 3 },
        { category: "Clothing", product_name: "Jacket", revenue: 200.0, rank: 1 },
        { category: "Clothing", product_name: "Pants", revenue: 80.0, rank: 2 },
        { category: "Clothing", product_name: "Shirt", revenue: 50.0, rank: 3 },
        { category: "Electronics", product_name: "Laptop", revenue: 1200.0, rank: 1 },
        { category: "Electronics", product_name: "Phone", revenue: 800.0, rank: 2 },
        { category: "Electronics", product_name: "Tablet", revenue: 600.0, rank: 3 },
      ],
      orderMatters: true,
    },
    {
      name: "handles-ties",
      description: "Handles tied revenues correctly with RANK()",
      setupSql: `INSERT INTO products VALUES (12, 'Electronics', 'Camera', 800.00);`,
      expectedColumns: ["category", "product_name", "revenue", "rank"],
      expectedRows: [
        { category: "Books", product_name: "Textbook", revenue: 75.0, rank: 1 },
        { category: "Books", product_name: "Novel B", revenue: 30.0, rank: 2 },
        { category: "Books", product_name: "Novel A", revenue: 25.0, rank: 3 },
        { category: "Clothing", product_name: "Jacket", revenue: 200.0, rank: 1 },
        { category: "Clothing", product_name: "Pants", revenue: 80.0, rank: 2 },
        { category: "Clothing", product_name: "Shirt", revenue: 50.0, rank: 3 },
        { category: "Electronics", product_name: "Laptop", revenue: 1200.0, rank: 1 },
        { category: "Electronics", product_name: "Camera", revenue: 800.0, rank: 2 },
        { category: "Electronics", product_name: "Phone", revenue: 800.0, rank: 2 },
      ],
      orderMatters: false,
    },
  ],
};
