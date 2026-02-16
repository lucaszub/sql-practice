import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "39-multi-table-revenue-by-category",
  title: "Revenue Breakdown by Product Category",
  difficulty: "medium",
  category: "multi-table-joins",
  description: `## Revenue Breakdown by Product Category

The finance team wants a revenue report broken down by product category. This requires joining four tables: orders, order items, products, and categories.

Write a query that calculates the total quantity sold and total revenue for each product category.

### Schema

**categories**
| Column | Type |
|--------|------|
| category_id | INTEGER |
| category_name | VARCHAR |

**products**
| Column | Type |
|--------|------|
| product_id | INTEGER |
| product_name | VARCHAR |
| category_id | INTEGER |
| unit_price | DECIMAL(10,2) |

**orders**
| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| order_date | DATE |

**order_items**
| Column | Type |
|--------|------|
| item_id | INTEGER |
| order_id | INTEGER |
| product_id | INTEGER |
| quantity | INTEGER |

### Expected output columns
\`category_name\`, \`total_items_sold\`, \`total_revenue\`

Where \`total_revenue\` = SUM(quantity * unit_price), rounded to 2 decimal places.

Order by \`total_revenue\` DESC.`,
  hint: "Chain four JOINs: order_items → orders (for context), order_items → products (for price), products → categories (for category name). Then GROUP BY category_name and use SUM for aggregation.",
  schema: `CREATE TABLE categories (
  category_id INTEGER PRIMARY KEY,
  category_name VARCHAR
);

CREATE TABLE products (
  product_id INTEGER PRIMARY KEY,
  product_name VARCHAR,
  category_id INTEGER,
  unit_price DECIMAL(10,2)
);

CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  order_date DATE
);

CREATE TABLE order_items (
  item_id INTEGER PRIMARY KEY,
  order_id INTEGER,
  product_id INTEGER,
  quantity INTEGER
);

INSERT INTO categories VALUES
  (1, 'Electronics'),
  (2, 'Office Supplies'),
  (3, 'Furniture');

INSERT INTO products VALUES
  (101, 'Wireless Mouse', 1, 29.99),
  (102, 'USB-C Hub', 1, 49.99),
  (103, 'Notebook Pack', 2, 12.50),
  (104, 'Pen Set', 2, 8.99),
  (105, 'Standing Desk', 3, 299.99),
  (106, 'Monitor Arm', 3, 89.99),
  (107, 'Keyboard', 1, 69.99),
  (108, 'Paper Ream', 2, 6.99);

INSERT INTO orders VALUES
  (1001, 1, '2024-01-15'),
  (1002, 2, '2024-01-20'),
  (1003, 3, '2024-02-01'),
  (1004, 1, '2024-02-10'),
  (1005, 4, '2024-02-15'),
  (1006, 2, '2024-03-01');

INSERT INTO order_items VALUES
  (1, 1001, 101, 2),
  (2, 1001, 103, 3),
  (3, 1002, 105, 1),
  (4, 1002, 102, 1),
  (5, 1003, 107, 2),
  (6, 1003, 104, 5),
  (7, 1004, 106, 1),
  (8, 1004, 101, 1),
  (9, 1005, 108, 10),
  (10, 1005, 102, 2),
  (11, 1006, 105, 1),
  (12, 1006, 103, 4);`,
  solutionQuery: `SELECT
  cat.category_name,
  SUM(oi.quantity) AS total_items_sold,
  ROUND(SUM(oi.quantity * p.unit_price), 2) AS total_revenue
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
JOIN categories cat ON p.category_id = cat.category_id
GROUP BY cat.category_name
ORDER BY total_revenue DESC;`,
  solutionExplanation: `## Explanation

### Pattern: Multi-table JOIN with Aggregation

This combines the **four-table join** pattern with GROUP BY aggregation to produce a category-level revenue summary.

### Step-by-step
1. **FROM order_items oi**: Start from line items (the most granular level).
2. **JOIN products p**: Attach product details (unit_price, category_id) to each line item.
3. **JOIN categories cat**: Resolve category_id to a human-readable category_name.
4. **SUM(oi.quantity * p.unit_price)**: Compute revenue per line item and aggregate.
5. **GROUP BY cat.category_name**: Roll up results to the category level.
6. **ORDER BY total_revenue DESC**: Show highest revenue categories first.

### Why start from order_items?
Starting from the most granular table (order_items) and joining outward ensures every line item is counted. The orders table provides context but isn't strictly needed for revenue calculation -- it would be necessary if we filtered by date or customer.

### When to use
- Revenue reports by dimension (category, region, channel)
- Any time you need to aggregate across a normalized schema
- Dashboard metrics that span multiple reference tables`,
  testCases: [
    {
      name: "default",
      description: "Returns revenue by category across all orders",
      expectedColumns: ["category_name", "total_items_sold", "total_revenue"],
      expectedRows: [
        { category_name: "Furniture", total_items_sold: 3, total_revenue: 689.97 },
        { category_name: "Electronics", total_items_sold: 8, total_revenue: 379.92 },
        { category_name: "Office Supplies", total_items_sold: 22, total_revenue: 202.35 },
      ],
      orderMatters: true,
    },
    {
      name: "single-category",
      description: "After removing non-electronics items, only Electronics category appears",
      setupSql: `DELETE FROM order_items WHERE product_id NOT IN (101, 102, 107);`,
      expectedColumns: ["category_name", "total_items_sold", "total_revenue"],
      expectedRows: [
        { category_name: "Electronics", total_items_sold: 8, total_revenue: 379.92 },
      ],
      orderMatters: true,
    },
  ],
};
