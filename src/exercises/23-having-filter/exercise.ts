import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "23-having-filter",
  title: "Premium Supplier Program Categories",
  titleFr: "Categories eligibles au programme fournisseur premium",
  difficulty: "easy",
  category: "aggregation",
  description: `## Premium Supplier Program Categories

Find product categories that generated **more than $1,000 in total revenue** -- these qualify for the premium supplier program, which offers better wholesale pricing and priority restocking.

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

Write a query that returns categories qualifying for the premium program:
- \`category\`: the product category
- \`total_revenue\`: the total revenue (quantity * unit_price) for that category
- \`total_orders\`: the count of distinct orders containing items from that category

Only include categories where \`total_revenue\` exceeds 1000.

Order by \`total_revenue\` DESC.

### Expected output columns
\`category\`, \`total_revenue\`, \`total_orders\``,
  descriptionFr: `## Categories eligibles au programme fournisseur premium

Trouvez les categories de produits ayant genere **plus de 1 000 $ de chiffre d'affaires total** -- celles-ci sont eligibles au programme fournisseur premium, qui offre de meilleurs tarifs de gros et un reapprovisionnement prioritaire.

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

Ecrivez une requete qui retourne les categories eligibles au programme premium :
- \`category\` : la categorie du produit
- \`total_revenue\` : le chiffre d'affaires total (quantity * unit_price) pour cette categorie
- \`total_orders\` : le nombre de commandes distinctes contenant des articles de cette categorie

N'incluez que les categories dont le \`total_revenue\` depasse 1 000.

Triez par \`total_revenue\` DESC.

### Colonnes attendues en sortie
\`category\`, \`total_revenue\`, \`total_orders\``,
  hint: "GROUP BY category, then use HAVING SUM(quantity * unit_price) > 1000 to filter groups after aggregation. Remember: WHERE filters rows before grouping; HAVING filters groups after aggregation.",
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
  (1, 'Laptop Pro', 'Electronics'),
  (2, 'Wireless Earbuds', 'Electronics'),
  (3, 'Phone Charger', 'Electronics'),
  (4, 'Office Chair', 'Furniture'),
  (5, 'Standing Desk', 'Furniture'),
  (6, 'Desk Lamp', 'Furniture'),
  (7, 'Notebook Set', 'Stationery'),
  (8, 'Pen Pack', 'Stationery'),
  (9, 'Sticky Notes', 'Stationery'),
  (10, 'Backpack', 'Accessories'),
  (11, 'Laptop Sleeve', 'Accessories'),
  (12, 'Cable Organizer', 'Accessories');

INSERT INTO order_items VALUES
  (1, 2001, 1, 3, 1199.99),
  (2, 2001, 2, 2, 79.99),
  (3, 2002, 4, 2, 349.00),
  (4, 2002, 5, 1, 599.00),
  (5, 2003, 7, 10, 12.99),
  (6, 2003, 8, 15, 5.99),
  (7, 2004, 1, 1, 1199.99),
  (8, 2004, 3, 5, 19.99),
  (9, 2005, 10, 4, 49.99),
  (10, 2005, 11, 3, 29.99),
  (11, 2006, 4, 1, 349.00),
  (12, 2006, 6, 2, 44.99),
  (13, 2007, 9, 20, 3.99),
  (14, 2007, 12, 6, 14.99),
  (15, 2008, 2, 5, 79.99),
  (16, 2008, 10, 2, 49.99);`,
  solutionQuery: `SELECT
  p.category,
  SUM(oi.quantity * oi.unit_price) AS total_revenue,
  COUNT(DISTINCT oi.order_id) AS total_orders
FROM products p
JOIN order_items oi ON p.product_id = oi.product_id
GROUP BY p.category
HAVING SUM(oi.quantity * oi.unit_price) > 1000
ORDER BY total_revenue DESC;`,
  solutionExplanation: `## Explanation

### Pattern: HAVING Clause for Group-Level Filtering

\`HAVING\` filters groups after aggregation, unlike \`WHERE\` which filters individual rows before grouping.

### Step-by-step
1. **\`JOIN order_items ON product_id\`**: Links items to product categories.
2. **\`SUM(oi.quantity * oi.unit_price)\`**: Computes total revenue per category.
3. **\`COUNT(DISTINCT oi.order_id)\`**: Counts unique orders (not line items) per category. Without DISTINCT, an order with multiple items from the same category would be counted multiple times.
4. **\`GROUP BY p.category\`**: One row per category.
5. **\`HAVING SUM(...) > 1000\`**: Keeps only categories whose total revenue exceeds $1,000. This cannot be done with WHERE because the sum does not exist until after grouping.

### Why this approach
- \`HAVING\` is the only way to filter on aggregate values. A common mistake is trying to put aggregate conditions in the WHERE clause, which will produce an error.
- Using \`COUNT(DISTINCT order_id)\` rather than \`COUNT(*)\` gives a more meaningful business metric (number of orders, not number of line items).

### When to use
- Threshold-based filtering: "categories with revenue above X", "customers with more than N orders"
- Qualification checks: loyalty tiers, supplier programs, performance reviews
- Any time you need to filter based on a computed group-level metric`,
  testCases: [
    {
      name: "default",
      description:
        "Categories with revenue over $1,000 from the base dataset",
      expectedColumns: ["category", "total_revenue", "total_orders"],
      expectedRows: [
        { category: "Electronics", total_revenue: 5459.84, total_orders: 3 },
        { category: "Furniture", total_revenue: 1735.98, total_orders: 2 },
      ],
      orderMatters: true,
    },
    {
      name: "extra-sales-push-stationery-above-threshold",
      description:
        "After adding large stationery orders, that category also qualifies",
      setupSql: `INSERT INTO order_items VALUES
  (17, 2009, 7, 50, 12.99),
  (18, 2009, 8, 30, 5.99);`,
      expectedColumns: ["category", "total_revenue", "total_orders"],
      expectedRows: [
        { category: "Electronics", total_revenue: 5459.84, total_orders: 3 },
        { category: "Furniture", total_revenue: 1735.98, total_orders: 2 },
        { category: "Stationery", total_revenue: 1128.75, total_orders: 3 },
      ],
      orderMatters: true,
    },
  ],
};
