import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "21-group-by-category",
  title: "Revenue Breakdown by Product Category",
  titleFr: "Ventilation du chiffre d'affaires par categorie de produits",
  difficulty: "easy",
  category: "aggregation",
  description: `## Revenue Breakdown by Product Category

Management wants to see the **revenue breakdown by product category** to decide how to allocate inventory budget for next quarter. Categories generating the most revenue should get a larger share.

### Schema

**products**
| Column | Type |
|--------|------|
| product_id | INTEGER |
| product_name | VARCHAR |
| category | VARCHAR |

**order_items**
| Column | Type |
|--------|------|
| item_id | INTEGER |
| order_id | INTEGER |
| product_id | INTEGER |
| quantity | INTEGER |
| unit_price | DECIMAL(10,2) |

### Task

Write a query that returns, for each product category:
- \`category\`: the product category
- \`total_items_sold\`: the total quantity of items sold
- \`total_revenue\`: the total revenue (quantity * unit_price) for that category

Order by \`total_revenue\` DESC.

### Expected output columns
\`category\`, \`total_items_sold\`, \`total_revenue\``,
  descriptionFr: `## Ventilation du chiffre d'affaires par categorie de produits

La direction souhaite consulter la **ventilation du chiffre d'affaires par categorie de produits** afin de decider comment repartir le budget d'inventaire pour le prochain trimestre. Les categories generant le plus de revenus devraient recevoir une part plus importante.

### Schema

**products**
| Column | Type |
|--------|------|
| product_id | INTEGER |
| product_name | VARCHAR |
| category | VARCHAR |

**order_items**
| Column | Type |
|--------|------|
| item_id | INTEGER |
| order_id | INTEGER |
| product_id | INTEGER |
| quantity | INTEGER |
| unit_price | DECIMAL(10,2) |

### Tache

Ecrivez une requete qui retourne, pour chaque categorie de produits :
- \`category\` : la categorie du produit
- \`total_items_sold\` : la quantite totale d'articles vendus
- \`total_revenue\` : le chiffre d'affaires total (quantity * unit_price) pour cette categorie

Triez par \`total_revenue\` DESC.

### Colonnes attendues en sortie
\`category\`, \`total_items_sold\`, \`total_revenue\``,
  hint: "Join products to order_items on product_id. Use SUM(quantity) for items sold and SUM(quantity * unit_price) for revenue. GROUP BY category.",
  schema: `CREATE TABLE products (
  product_id INTEGER,
  product_name VARCHAR,
  category VARCHAR
);

CREATE TABLE order_items (
  item_id INTEGER,
  order_id INTEGER,
  product_id INTEGER,
  quantity INTEGER,
  unit_price DECIMAL(10,2)
);

INSERT INTO products VALUES
  (1, 'Laptop', 'Electronics'),
  (2, 'Phone Case', 'Accessories'),
  (3, 'Headphones', 'Electronics'),
  (4, 'USB Cable', 'Accessories'),
  (5, 'Desk Chair', 'Furniture'),
  (6, 'Monitor Stand', 'Furniture'),
  (7, 'Keyboard', 'Electronics'),
  (8, 'Mouse Pad', 'Accessories'),
  (9, 'Standing Desk', 'Furniture'),
  (10, 'Webcam', 'Electronics');

INSERT INTO order_items VALUES
  (1, 1001, 1, 2, 899.99),
  (2, 1001, 3, 1, 149.99),
  (3, 1002, 2, 5, 14.99),
  (4, 1002, 4, 3, 9.99),
  (5, 1003, 5, 1, 349.00),
  (6, 1003, 7, 2, 79.99),
  (7, 1004, 1, 1, 899.99),
  (8, 1004, 6, 2, 59.99),
  (9, 1005, 8, 10, 7.99),
  (10, 1005, 3, 3, 149.99),
  (11, 1006, 9, 1, 599.00),
  (12, 1006, 10, 2, 69.99),
  (13, 1007, 2, 2, 14.99),
  (14, 1007, 4, 4, 9.99),
  (15, 1008, 7, 1, 79.99);`,
  solutionQuery: `SELECT
  p.category,
  SUM(oi.quantity) AS total_items_sold,
  SUM(oi.quantity * oi.unit_price) AS total_revenue
FROM products p
JOIN order_items oi ON p.product_id = oi.product_id
GROUP BY p.category
ORDER BY total_revenue DESC;`,
  solutionExplanation: `## Explanation

### Pattern: GROUP BY with JOIN

This combines a join between two tables with aggregation to produce a category-level summary.

### Step-by-step
1. **\`JOIN order_items ON product_id\`**: Links each order item to its product to access the category.
2. **\`SUM(oi.quantity)\`**: Totals up all units sold across every order item in each category.
3. **\`SUM(oi.quantity * oi.unit_price)\`**: Computes revenue as the sum of (quantity times price) per line item. This is more accurate than summing prices separately.
4. **\`GROUP BY p.category\`**: Collapses all rows for the same category into one summary row.
5. **\`ORDER BY total_revenue DESC\`**: Shows the highest-revenue category first.

### Why this approach
- Joining before grouping is the standard pattern for aggregating across related tables. The join expands the data, and GROUP BY collapses it.
- Computing revenue as \`quantity * unit_price\` at the line-item level before summing ensures accurate totals even when quantities vary.

### When to use
- Revenue dashboards broken down by any dimension (category, region, channel)
- Inventory allocation decisions based on sales performance
- Any reporting that needs aggregated metrics from a normalized schema`,
  testCases: [
    {
      name: "default",
      description: "Revenue breakdown by category from the base dataset",
      expectedColumns: ["category", "total_items_sold", "total_revenue"],
      expectedRows: [
        { category: "Electronics", total_items_sold: 12, total_revenue: 3679.88 },
        { category: "Furniture", total_items_sold: 4, total_revenue: 1067.98 },
        { category: "Accessories", total_items_sold: 24, total_revenue: 254.76 },
      ],
      orderMatters: true,
    },
    {
      name: "category-with-no-sales",
      description:
        "A new category with no order items should not appear in results",
      setupSql: `INSERT INTO products VALUES (11, 'Garden Hose', 'Garden');`,
      expectedColumns: ["category", "total_items_sold", "total_revenue"],
      expectedRows: [
        { category: "Electronics", total_items_sold: 12, total_revenue: 3679.88 },
        { category: "Furniture", total_items_sold: 4, total_revenue: 1067.98 },
        { category: "Accessories", total_items_sold: 24, total_revenue: 254.76 },
      ],
      orderMatters: true,
    },
  ],
};
