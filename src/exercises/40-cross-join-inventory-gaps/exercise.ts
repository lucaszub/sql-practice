import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "40-cross-join-inventory-gaps",
  title: "Find Missing Products in Stores",
  difficulty: "medium",
  category: "multi-table-joins",
  description: `## Find Missing Products in Stores

The supply chain team needs to identify which products are **not stocked** at which stores. Every store should carry every product, but some gaps exist. The team wants a list of all store-product combinations that are missing from inventory.

Write a query that uses CROSS JOIN to generate all possible store-product pairs, then identifies which ones have no inventory record.

### Schema

**stores**
| Column | Type |
|--------|------|
| store_id | INTEGER |
| store_name | VARCHAR |
| city | VARCHAR |

**products**
| Column | Type |
|--------|------|
| product_id | INTEGER |
| product_name | VARCHAR |

**inventory**
| Column | Type |
|--------|------|
| store_id | INTEGER |
| product_id | INTEGER |
| stock_quantity | INTEGER |

### Expected output columns
\`store_name\`, \`product_name\`

Order by \`store_name\` ASC, then \`product_name\` ASC.`,
  hint: "CROSS JOIN generates every combination of stores and products. Then LEFT JOIN the inventory table and filter for rows WHERE inventory is NULL -- those are the gaps.",
  schema: `CREATE TABLE stores (
  store_id INTEGER PRIMARY KEY,
  store_name VARCHAR,
  city VARCHAR
);

CREATE TABLE products (
  product_id INTEGER PRIMARY KEY,
  product_name VARCHAR
);

CREATE TABLE inventory (
  store_id INTEGER,
  product_id INTEGER,
  stock_quantity INTEGER,
  PRIMARY KEY (store_id, product_id)
);

INSERT INTO stores VALUES
  (1, 'Downtown', 'New York'),
  (2, 'Mall Plaza', 'Chicago'),
  (3, 'Airport Shop', 'Denver');

INSERT INTO products VALUES
  (101, 'Laptop Stand'),
  (102, 'Wireless Charger'),
  (103, 'Screen Protector'),
  (104, 'Phone Case');

INSERT INTO inventory VALUES
  (1, 101, 15),
  (1, 102, 8),
  (1, 103, 25),
  (2, 101, 10),
  (2, 104, 30),
  (3, 102, 5),
  (3, 103, 12),
  (3, 104, 20);`,
  solutionQuery: `SELECT
  s.store_name,
  p.product_name
FROM stores s
CROSS JOIN products p
LEFT JOIN inventory i
  ON s.store_id = i.store_id AND p.product_id = i.product_id
WHERE i.store_id IS NULL
ORDER BY s.store_name, p.product_name;`,
  solutionExplanation: `## Explanation

### Pattern: CROSS JOIN + Anti-Join for Gap Detection

This combines **CROSS JOIN** (to generate all possible combinations) with an **anti-join** pattern (LEFT JOIN + IS NULL) to find missing records.

### Step-by-step
1. **CROSS JOIN**: Generates every possible (store, product) pair -- 3 stores x 4 products = 12 rows.
2. **LEFT JOIN inventory**: Attempts to match each pair to an actual inventory record.
3. **WHERE i.store_id IS NULL**: Keeps only the pairs that have no inventory record -- these are the gaps.
4. **ORDER BY**: Sorts alphabetically for a clean report.

### Why CROSS JOIN?
CROSS JOIN is rarely used in practice, but it's perfect for generating "all possible combinations" when you need to find what's missing. Without it, you'd only see combinations that already exist.

### When to use
- Finding missing data in a matrix (stores x products, users x features, dates x categories)
- Generating complete date/dimension grids for reporting
- Identifying coverage gaps in assignments or schedules`,
  testCases: [
    {
      name: "default",
      description: "Returns 4 missing store-product combinations",
      expectedColumns: ["store_name", "product_name"],
      expectedRows: [
        { store_name: "Airport Shop", product_name: "Laptop Stand" },
        { store_name: "Downtown", product_name: "Phone Case" },
        { store_name: "Mall Plaza", product_name: "Screen Protector" },
        { store_name: "Mall Plaza", product_name: "Wireless Charger" },
      ],
      orderMatters: true,
    },
    {
      name: "full-coverage",
      description: "After filling all gaps, no missing combinations remain",
      setupSql: `INSERT INTO inventory VALUES (3, 101, 5), (1, 104, 10), (2, 103, 7), (2, 102, 3);`,
      expectedColumns: ["store_name", "product_name"],
      expectedRows: [],
      orderMatters: false,
    },
  ],
};
