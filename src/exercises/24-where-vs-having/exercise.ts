import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "24-where-vs-having",
  title: "High-Volume Categories Excluding Small Orders",
  difficulty: "easy",
  category: "aggregation",
  description: `## High-Volume Categories Excluding Small Orders

The marketing team wants to find categories with **more than 3 orders**, but only counting orders above $25 (excluding small test purchases that skew the data). This will identify genuinely popular categories for the next ad campaign.

### Schema

**orders**
| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| order_date | DATE |
| total_amount | DECIMAL(10,2) |
| category | VARCHAR |

### Task

Write a query that:
1. **Excludes** orders with \`total_amount\` <= 25 (these are test purchases)
2. Groups the remaining orders by \`category\`
3. **Filters** to only categories with more than 3 qualifying orders

Return:
- \`category\`: the order category
- \`order_count\`: the number of qualifying orders (above $25)
- \`total_revenue\`: the sum of \`total_amount\` for qualifying orders
- \`avg_order_value\`: the average \`total_amount\` for qualifying orders, rounded to 2 decimal places

Order by \`order_count\` DESC, \`category\` ASC.

### Expected output columns
\`category\`, \`order_count\`, \`total_revenue\`, \`avg_order_value\``,
  hint: "Use WHERE to filter individual rows (total_amount > 25) BEFORE grouping, then HAVING to filter groups (COUNT(*) > 3) AFTER grouping. WHERE and HAVING work at different stages of query execution.",
  schema: `CREATE TABLE orders (
  order_id INTEGER,
  customer_id INTEGER,
  order_date DATE,
  total_amount DECIMAL(10,2),
  category VARCHAR
);

INSERT INTO orders VALUES
  (1, 201, '2024-01-05', 89.99, 'Electronics'),
  (2, 202, '2024-01-08', 15.00, 'Electronics'),
  (3, 203, '2024-01-10', 145.00, 'Electronics'),
  (4, 204, '2024-01-12', 12.50, 'Books'),
  (5, 205, '2024-01-15', 67.50, 'Electronics'),
  (6, 201, '2024-01-18', 34.99, 'Clothing'),
  (7, 206, '2024-01-20', 210.00, 'Electronics'),
  (8, 202, '2024-01-22', 5.99, 'Books'),
  (9, 207, '2024-01-25', 55.00, 'Clothing'),
  (10, 203, '2024-01-28', 42.00, 'Books'),
  (11, 208, '2024-02-01', 19.99, 'Clothing'),
  (12, 204, '2024-02-04', 78.00, 'Books'),
  (13, 209, '2024-02-07', 125.00, 'Clothing'),
  (14, 205, '2024-02-10', 8.99, 'Stationery'),
  (15, 210, '2024-02-12', 92.00, 'Electronics'),
  (16, 206, '2024-02-15', 37.50, 'Books'),
  (17, 201, '2024-02-18', 65.00, 'Clothing'),
  (18, 207, '2024-02-20', 18.00, 'Stationery'),
  (19, 208, '2024-02-22', 150.00, 'Electronics'),
  (20, 209, '2024-02-25', 28.00, 'Books'),
  (21, 210, '2024-03-01', 9.99, 'Stationery'),
  (22, 202, '2024-03-05', 45.00, 'Clothing'),
  (23, 203, '2024-03-08', 22.00, 'Books'),
  (24, 204, '2024-03-10', 199.99, 'Electronics');`,
  solutionQuery: `SELECT
  category,
  COUNT(*) AS order_count,
  SUM(total_amount) AS total_revenue,
  ROUND(AVG(total_amount), 2) AS avg_order_value
FROM orders
WHERE total_amount > 25
GROUP BY category
HAVING COUNT(*) > 3
ORDER BY order_count DESC, category;`,
  solutionExplanation: `## Explanation

### Pattern: WHERE vs HAVING Combined

This exercise demonstrates the crucial difference between row-level filtering (\`WHERE\`) and group-level filtering (\`HAVING\`), used together in the same query.

### Step-by-step
1. **\`WHERE total_amount > 25\`**: Executes first. Removes individual rows (test purchases) before any grouping happens. This affects which rows are included in the aggregation.
2. **\`GROUP BY category\`**: Groups the remaining rows by category.
3. **\`COUNT(*)\`**: Counts only the qualifying orders (those above $25) per category.
4. **\`HAVING COUNT(*) > 3\`**: Executes after grouping. Removes entire category groups that do not meet the threshold, even if they had some qualifying orders.
5. **\`ORDER BY order_count DESC, category\`**: Categories with the most orders first; ties broken alphabetically.

### SQL execution order
Understanding the logical execution order is key:
1. \`FROM\` -- scan the table
2. \`WHERE\` -- filter rows (before grouping)
3. \`GROUP BY\` -- form groups
4. \`HAVING\` -- filter groups (after grouping)
5. \`SELECT\` -- compute output columns
6. \`ORDER BY\` -- sort results

### Why this approach
- \`WHERE\` and \`HAVING\` serve fundamentally different purposes. Using both together gives you precise control: first clean the data (remove test purchases), then apply business rules (minimum order count).
- A common mistake is putting aggregate conditions in WHERE or row conditions in HAVING. WHERE cannot reference aggregates; HAVING should not be used for row-level filters (it works but is less efficient).

### When to use
- Any report that needs both data cleaning (row filters) and threshold-based group selection
- Marketing: "popular categories excluding returns/test orders"
- Finance: "high-value accounts excluding micro-transactions"`,
  testCases: [
    {
      name: "default",
      description:
        "Categories with >3 orders above $25 from the base dataset",
      expectedColumns: [
        "category",
        "order_count",
        "total_revenue",
        "avg_order_value",
      ],
      expectedRows: [
        {
          category: "Electronics",
          order_count: 7,
          total_revenue: 954.48,
          avg_order_value: 136.35,
        },
        {
          category: "Clothing",
          order_count: 5,
          total_revenue: 324.99,
          avg_order_value: 65.0,
        },
        {
          category: "Books",
          order_count: 4,
          total_revenue: 185.5,
          avg_order_value: 46.38,
        },
      ],
      orderMatters: true,
    },
    {
      name: "no-qualifying-categories",
      description:
        "When small orders are removed from a category, it may drop below the threshold",
      setupSql: `DELETE FROM orders WHERE category = 'Books' AND total_amount > 25;`,
      expectedColumns: [
        "category",
        "order_count",
        "total_revenue",
        "avg_order_value",
      ],
      expectedRows: [
        {
          category: "Electronics",
          order_count: 7,
          total_revenue: 954.48,
          avg_order_value: 136.35,
        },
        {
          category: "Clothing",
          order_count: 5,
          total_revenue: 324.99,
          avg_order_value: 65.0,
        },
      ],
      orderMatters: true,
    },
  ],
};
