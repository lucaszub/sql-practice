import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "30-join-with-groupby",
  title: "Average Order Value by Product Category",
  titleFr: "Valeur moyenne des commandes par categorie de produits",
  difficulty: "easy",
  category: "basic-joins",
  description: `## Average Order Value by Product Category

The product team wants the average order value broken down by product category, to understand which categories drive the highest-value transactions. This will inform inventory planning and promotional strategy.

Write a query that joins products to order items, groups by category, and calculates the average order line total (quantity times unit_price) per category. Round the average to 2 decimal places.

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
| unit_price | DECIMAL(10,2) |

### Expected output columns
\`category\`, \`total_items_sold\`, \`avg_line_total\`

- \`total_items_sold\`: total quantity sold across all orders for that category
- \`avg_line_total\`: average of (quantity * unit_price) per order line, rounded to 2 decimal places

Order by \`avg_line_total\` DESC.`,
  hint: "Join products to order_items on product_id. GROUP BY category, then use SUM(quantity) for total items and ROUND(AVG(quantity * unit_price), 2) for the average line total.",
  schema: `CREATE TABLE products (
  product_id INTEGER,
  product_name VARCHAR,
  category VARCHAR,
  price DECIMAL(10,2)
);

CREATE TABLE order_items (
  item_id INTEGER,
  order_id INTEGER,
  product_id INTEGER,
  quantity INTEGER,
  unit_price DECIMAL(10,2)
);

INSERT INTO products VALUES
  (1, 'Wireless Mouse', 'Electronics', 29.99),
  (2, 'Mechanical Keyboard', 'Electronics', 89.99),
  (3, 'USB-C Hub', 'Electronics', 45.00),
  (4, 'Desk Lamp', 'Home Office', 34.50),
  (5, 'Monitor Stand', 'Home Office', 59.99),
  (6, 'Ergonomic Chair', 'Furniture', 349.00),
  (7, 'Standing Desk', 'Furniture', 499.00),
  (8, 'Cable Organizer', 'Accessories', 12.99),
  (9, 'Laptop Sleeve', 'Accessories', 24.99),
  (10, 'Desk Pad', 'Accessories', 19.99);

INSERT INTO order_items VALUES
  (1, 101, 1, 2, 29.99),
  (2, 101, 4, 1, 34.50),
  (3, 102, 2, 1, 89.99),
  (4, 102, 6, 1, 349.00),
  (5, 103, 1, 1, 29.99),
  (6, 103, 3, 2, 45.00),
  (7, 104, 5, 1, 59.99),
  (8, 104, 7, 1, 499.00),
  (9, 105, 8, 3, 12.99),
  (10, 105, 9, 1, 24.99),
  (11, 106, 2, 2, 89.99),
  (12, 106, 10, 2, 19.99),
  (13, 107, 6, 1, 349.00),
  (14, 107, 4, 2, 34.50),
  (15, 108, 1, 1, 29.99),
  (16, 108, 5, 1, 59.99);`,
  solutionQuery: `SELECT
  p.category,
  SUM(oi.quantity) AS total_items_sold,
  ROUND(AVG(oi.quantity * oi.unit_price), 2) AS avg_line_total
FROM products p
INNER JOIN order_items oi ON p.product_id = oi.product_id
GROUP BY p.category
ORDER BY avg_line_total DESC;`,
  solutionExplanation: `## Explanation

### Pattern: JOIN + GROUP BY

This combines a **two-table join** with **GROUP BY aggregation** to produce category-level metrics from line-item data.

### Step-by-step
1. **INNER JOIN order_items oi ON p.product_id = oi.product_id**: Match each order line item to its product to get the category.
2. **SUM(oi.quantity) AS total_items_sold**: Add up all quantities sold across every order line in each category.
3. **ROUND(AVG(oi.quantity * oi.unit_price), 2) AS avg_line_total**: For each order line, compute the line total (quantity times unit_price), then average those across the category. Round to 2 decimal places for clean currency display.
4. **GROUP BY p.category**: One output row per category.
5. **ORDER BY avg_line_total DESC**: Show highest-value categories first.

### Why AVG of (quantity * unit_price)?
Each row in order_items represents one line on an order. The "line total" is quantity times unit_price. Averaging these gives the typical transaction value per line item in each category -- useful for understanding whether a category tends toward big-ticket or small purchases.

### When to use
- Breaking down metrics by a dimension that lives in a different table
- Product category performance reports
- Any analysis where the grouping column and the measure live in separate tables`,
  testCases: [
    {
      name: "default",
      description: "Average line total per category with default data",
      expectedColumns: ["category", "total_items_sold", "avg_line_total"],
      expectedRows: [
        { category: "Furniture", total_items_sold: 3, avg_line_total: 399.0 },
        { category: "Electronics", total_items_sold: 9, avg_line_total: 79.99 },
        { category: "Home Office", total_items_sold: 5, avg_line_total: 55.87 },
        { category: "Accessories", total_items_sold: 6, avg_line_total: 34.65 },
      ],
      orderMatters: true,
    },
    {
      name: "high-quantity-order",
      description: "A bulk order significantly changes the category average",
      setupSql: `INSERT INTO order_items VALUES (17, 109, 8, 50, 12.99);`,
      expectedColumns: ["category", "total_items_sold", "avg_line_total"],
      expectedRows: [
        { category: "Furniture", total_items_sold: 3, avg_line_total: 399.0 },
        { category: "Accessories", total_items_sold: 56, avg_line_total: 188.36 },
        { category: "Electronics", total_items_sold: 9, avg_line_total: 79.99 },
        { category: "Home Office", total_items_sold: 5, avg_line_total: 55.87 },
      ],
      orderMatters: true,
    },
  ],
};
