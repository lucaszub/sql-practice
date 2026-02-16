import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "20-min-max-prices",
  title: "Cheapest and Most Expensive Products by Category",
  difficulty: "easy",
  category: "aggregation",
  description: `## Cheapest and Most Expensive Products by Category

The merchandising team wants to find the **cheapest and most expensive product** in each category. This will help them set competitive price ranges and identify pricing outliers.

### Schema

**products**
| Column | Type |
|--------|------|
| product_id | INTEGER |
| product_name | VARCHAR |
| category | VARCHAR |
| price | DECIMAL(10,2) |

Some products have a NULL price (newly listed items awaiting pricing). These should be excluded.

### Task

Write a query that returns, for each category:
- \`category\`: the product category
- \`min_price\`: the lowest price in that category
- \`max_price\`: the highest price in that category
- \`price_range\`: the difference between \`max_price\` and \`min_price\`

Order by \`category\` ASC.

### Expected output columns
\`category\`, \`min_price\`, \`max_price\`, \`price_range\``,
  hint: "Use MIN() and MAX() with GROUP BY. You can compute the range as MAX(price) - MIN(price). Filter out NULLs with WHERE price IS NOT NULL.",
  schema: `CREATE TABLE products (
  product_id INTEGER,
  product_name VARCHAR,
  category VARCHAR,
  price DECIMAL(10,2)
);

INSERT INTO products VALUES
  (1, 'Wireless Mouse', 'Electronics', 29.99),
  (2, 'Mechanical Keyboard', 'Electronics', 89.99),
  (3, 'USB-C Hub', 'Electronics', 45.50),
  (4, '4K Monitor', 'Electronics', 349.99),
  (5, 'Webcam HD', 'Electronics', NULL),
  (6, 'Running Shoes', 'Sports', 119.99),
  (7, 'Yoga Mat', 'Sports', 24.99),
  (8, 'Dumbbells Set', 'Sports', 79.50),
  (9, 'Water Bottle', 'Sports', 12.99),
  (10, 'Coffee Table', 'Home', 199.00),
  (11, 'Desk Lamp', 'Home', 34.99),
  (12, 'Bookshelf', 'Home', 149.50),
  (13, 'Wall Clock', 'Home', 22.00),
  (14, 'Throw Pillow', 'Home', NULL),
  (15, 'Python Cookbook', 'Books', 49.99),
  (16, 'SQL Guide', 'Books', 39.99),
  (17, 'Data Science Intro', 'Books', 54.99),
  (18, 'Notebook Journal', 'Books', 12.50);`,
  solutionQuery: `SELECT
  category,
  MIN(price) AS min_price,
  MAX(price) AS max_price,
  MAX(price) - MIN(price) AS price_range
FROM products
WHERE price IS NOT NULL
GROUP BY category
ORDER BY category;`,
  solutionExplanation: `## Explanation

### Pattern: MIN/MAX Aggregation

This uses \`MIN()\` and \`MAX()\` to find boundary values within each group.

### Step-by-step
1. **\`WHERE price IS NOT NULL\`**: Excludes products without a price. While \`MIN\` and \`MAX\` skip NULLs automatically, filtering up front makes the intent clear and ensures no unpriced products appear in any calculation.
2. **\`MIN(price)\`**: Finds the lowest price within each category.
3. **\`MAX(price)\`**: Finds the highest price within each category.
4. **\`MAX(price) - MIN(price)\`**: Computes the spread. A large range might indicate inconsistent pricing within a category.
5. **\`GROUP BY category\`**: One row per category.

### Why this approach
- \`MIN\` and \`MAX\` are simple, readable, and efficient. They communicate intent immediately.
- Computing \`price_range\` as an arithmetic expression on aggregates is a common pattern for derived metrics.

### When to use
- Identifying price outliers within product lines
- Setting dynamic pricing boundaries
- Quality checks: a category with a $1 min and $1,000 max might have a data entry error`,
  testCases: [
    {
      name: "default",
      description:
        "Min, max, and range per category from the base product catalog",
      expectedColumns: ["category", "min_price", "max_price", "price_range"],
      expectedRows: [
        {
          category: "Books",
          min_price: 12.5,
          max_price: 54.99,
          price_range: 42.49,
        },
        {
          category: "Electronics",
          min_price: 29.99,
          max_price: 349.99,
          price_range: 320.0,
        },
        {
          category: "Home",
          min_price: 22.0,
          max_price: 199.0,
          price_range: 177.0,
        },
        {
          category: "Sports",
          min_price: 12.99,
          max_price: 119.99,
          price_range: 107.0,
        },
      ],
      orderMatters: true,
    },
    {
      name: "single-product-category",
      description:
        "A category with one product should have min = max and range = 0",
      setupSql: `DELETE FROM products WHERE category = 'Books' AND product_id != 15;`,
      expectedColumns: ["category", "min_price", "max_price", "price_range"],
      expectedRows: [
        {
          category: "Books",
          min_price: 49.99,
          max_price: 49.99,
          price_range: 0.0,
        },
        {
          category: "Electronics",
          min_price: 29.99,
          max_price: 349.99,
          price_range: 320.0,
        },
        {
          category: "Home",
          min_price: 22.0,
          max_price: 199.0,
          price_range: 177.0,
        },
        {
          category: "Sports",
          min_price: 12.99,
          max_price: 119.99,
          price_range: 107.0,
        },
      ],
      orderMatters: true,
    },
  ],
};
