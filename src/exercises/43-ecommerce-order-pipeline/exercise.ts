import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "43-ecommerce-order-pipeline",
  title: "E-commerce Executive Summary Pipeline",
  difficulty: "medium",
  category: "multi-table-joins",
  description: `## E-commerce Executive Summary Pipeline

The executive team wants a category-level revenue summary built from raw transactional data. Build a **5-step CTE pipeline** that transforms raw data into an executive dashboard.

### Pipeline Steps
1. **order_lines**: Join orders with order_items to get line-level detail (order_id, customer_id, product_id, quantity)
2. **product_details**: Join with products to add product_name, category, unit_price, and calculate line_total (quantity * unit_price)
3. **customer_enriched**: Join with customers to add customer_name and region
4. **category_metrics**: Aggregate by category -- count distinct orders, sum revenue, average line value (all rounded to 2 decimals)
5. **Final SELECT**: Add pct_of_total using a window function (percentage of each category's revenue out of total revenue, rounded to 2 decimals)

### Schema

**customers**
| Column | Type |
|--------|------|
| customer_id | INTEGER |
| first_name | VARCHAR |
| last_name | VARCHAR |
| region | VARCHAR |

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

**products**
| Column | Type |
|--------|------|
| product_id | INTEGER |
| product_name | VARCHAR |
| category | VARCHAR |
| unit_price | DECIMAL(10,2) |

### Expected output columns
\`category\`, \`num_orders\`, \`total_revenue\`, \`avg_line_value\`, \`pct_of_total\`

Order by \`total_revenue\` DESC.`,
  hint: "Build the CTEs one at a time, each building on the previous. The first CTE joins orders + order_items. The second adds products. The third adds customers. The fourth does GROUP BY category. The final SELECT adds a window function for percentage.",
  schema: `CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY,
  first_name VARCHAR,
  last_name VARCHAR,
  region VARCHAR
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

CREATE TABLE products (
  product_id INTEGER PRIMARY KEY,
  product_name VARCHAR,
  category VARCHAR,
  unit_price DECIMAL(10,2)
);

INSERT INTO customers VALUES
  (1, 'Alice', 'Martin', 'East'),
  (2, 'Bob', 'Johnson', 'West'),
  (3, 'Charlie', 'Lee', 'East'),
  (4, 'Diana', 'Park', 'West'),
  (5, 'Eve', 'Garcia', 'Central');

INSERT INTO orders VALUES
  (1001, 1, '2024-01-15'),
  (1002, 2, '2024-01-20'),
  (1003, 3, '2024-02-05'),
  (1004, 4, '2024-02-10'),
  (1005, 5, '2024-02-15'),
  (1006, 1, '2024-03-01'),
  (1007, 2, '2024-03-10');

INSERT INTO products VALUES
  (101, 'Wireless Mouse', 'Electronics', 29.99),
  (102, 'USB-C Hub', 'Electronics', 49.99),
  (103, 'Notebook Pack', 'Office', 12.50),
  (104, 'Standing Desk', 'Furniture', 299.99),
  (105, 'Keyboard', 'Electronics', 69.99),
  (106, 'Pen Set', 'Office', 8.99),
  (107, 'Monitor Arm', 'Furniture', 89.99),
  (108, 'Desk Lamp', 'Furniture', 45.99);

INSERT INTO order_items VALUES
  (1, 1001, 101, 2),
  (2, 1001, 103, 3),
  (3, 1002, 104, 1),
  (4, 1002, 102, 1),
  (5, 1003, 105, 1),
  (6, 1003, 106, 5),
  (7, 1004, 107, 2),
  (8, 1004, 101, 1),
  (9, 1005, 108, 1),
  (10, 1005, 103, 4),
  (11, 1006, 104, 1),
  (12, 1006, 105, 1),
  (13, 1007, 102, 2),
  (14, 1007, 106, 3);`,
  solutionQuery: `WITH order_lines AS (
  SELECT
    o.order_id,
    o.customer_id,
    o.order_date,
    oi.product_id,
    oi.quantity
  FROM orders o
  JOIN order_items oi ON o.order_id = oi.order_id
),
product_details AS (
  SELECT
    ol.order_id,
    ol.customer_id,
    ol.order_date,
    p.product_name,
    p.category,
    ol.quantity,
    p.unit_price,
    ROUND(ol.quantity * p.unit_price, 2) AS line_total
  FROM order_lines ol
  JOIN products p ON ol.product_id = p.product_id
),
customer_enriched AS (
  SELECT
    pd.order_id,
    c.first_name || ' ' || c.last_name AS customer_name,
    c.region,
    pd.order_date,
    pd.product_name,
    pd.category,
    pd.quantity,
    pd.unit_price,
    pd.line_total
  FROM product_details pd
  JOIN customers c ON pd.customer_id = c.customer_id
),
category_metrics AS (
  SELECT
    category,
    COUNT(DISTINCT order_id) AS num_orders,
    ROUND(SUM(line_total), 2) AS total_revenue,
    ROUND(AVG(line_total), 2) AS avg_line_value
  FROM customer_enriched
  GROUP BY category
)
SELECT
  category,
  num_orders,
  total_revenue,
  avg_line_value,
  ROUND(100.0 * total_revenue / SUM(total_revenue) OVER (), 2) AS pct_of_total
FROM category_metrics
ORDER BY total_revenue DESC;`,
  solutionExplanation: `## Explanation

### Pattern: CTE Pipeline (Multi-step Transformation)

This is a **mini-project** that demonstrates the CTE pipeline pattern -- a sequence of CTEs where each step builds on the previous one, progressively transforming raw data into a polished summary.

### Step-by-step
1. **order_lines**: Joins orders with order_items to get one row per line item with order context.
2. **product_details**: Enriches each line with product info and calculates line_total.
3. **customer_enriched**: Adds customer name and region for potential regional analysis.
4. **category_metrics**: Aggregates to category level -- counts distinct orders, sums revenue, averages line value.
5. **Final SELECT**: Adds pct_of_total using SUM() OVER () window function for the executive view.

### Why CTEs?
Each CTE has a clear, single responsibility. This makes the pipeline:
- **Debuggable**: You can SELECT * FROM any intermediate CTE to inspect results.
- **Readable**: Each step has a descriptive name explaining its purpose.
- **Maintainable**: Adding a new enrichment step doesn't require rewriting the whole query.

### When to use
- Building dashboards from normalized data
- ETL-style transformations in SQL
- Any multi-step analysis where readability matters more than raw performance`,
  testCases: [
    {
      name: "default",
      description: "Returns category-level executive summary with revenue percentages",
      expectedColumns: ["category", "num_orders", "total_revenue", "avg_line_value", "pct_of_total"],
      expectedRows: [
        { category: "Furniture", num_orders: 4, total_revenue: 825.95, avg_line_value: 206.49, pct_of_total: 60.50 },
        { category: "Electronics", num_orders: 6, total_revenue: 379.92, avg_line_value: 63.32, pct_of_total: 27.83 },
        { category: "Office", num_orders: 4, total_revenue: 159.42, avg_line_value: 39.85, pct_of_total: 11.68 },
      ],
      orderMatters: true,
    },
    {
      name: "without-furniture",
      description: "After removing furniture items, percentages redistribute across remaining categories",
      setupSql: `DELETE FROM order_items WHERE product_id IN (104, 107, 108);`,
      expectedColumns: ["category", "num_orders", "total_revenue", "avg_line_value", "pct_of_total"],
      expectedRows: [
        { category: "Electronics", num_orders: 6, total_revenue: 379.92, avg_line_value: 63.32, pct_of_total: 70.44 },
        { category: "Office", num_orders: 4, total_revenue: 159.42, avg_line_value: 39.85, pct_of_total: 29.56 },
      ],
      orderMatters: true,
    },
  ],
};
