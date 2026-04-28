import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "125-store-category-promo-gaps",
  title: "Detect Missing Promotions per Store and Category",
  difficulty: "medium",
  category: "multi-table-joins",
  description: `## Detect Missing Promotions per Store and Category

Every managed store (one with an assigned store manager) is expected to run at least one active promotion per product category. The retail operations team wants to surface **which store-category pairs currently have no promotion**, so regional managers can take action.

Stores without a manager (e.g. temporarily closed locations) are out of scope.

Write a query returning all managed store and product category combinations that have no active promotion.

### Schema

**stores**
| Column | Type |
|--------|------|
| store_id | INTEGER |
| store_name | VARCHAR |

**categories**
| Column | Type |
|--------|------|
| category_id | INTEGER |
| category_name | VARCHAR |

**store_managers**
| Column | Type |
|--------|------|
| store_id | INTEGER |
| manager_name | VARCHAR |

**promotions**
| Column | Type |
|--------|------|
| promo_id | INTEGER |
| store_id | INTEGER |
| category_id | INTEGER |
| discount_pct | INTEGER |

### Expected output columns
\`store_name\`, \`category_name\`

Order by \`store_name\` ASC, then \`category_name\` ASC.`,
  hint: "CROSS JOIN generates all store×category pairs. INNER JOIN store_managers to restrict to managed stores. LEFT JOIN promotions and keep pairs where the promotion is NULL.",
  schema: `CREATE TABLE stores (
  store_id INTEGER PRIMARY KEY,
  store_name VARCHAR
);

CREATE TABLE categories (
  category_id INTEGER PRIMARY KEY,
  category_name VARCHAR
);

CREATE TABLE store_managers (
  store_id INTEGER PRIMARY KEY,
  manager_name VARCHAR
);

CREATE TABLE promotions (
  promo_id INTEGER PRIMARY KEY,
  store_id INTEGER,
  category_id INTEGER,
  discount_pct INTEGER
);

INSERT INTO stores VALUES
  (1, 'Downtown'),
  (2, 'Mall Plaza'),
  (3, 'Airport Shop');

INSERT INTO categories VALUES
  (1, 'Apparel'),
  (2, 'Electronics'),
  (3, 'Sports');

INSERT INTO store_managers VALUES
  (1, 'Sarah Kim'),
  (2, 'James Lee');

INSERT INTO promotions VALUES
  (1, 1, 2, 10),
  (2, 1, 1, 15),
  (3, 2, 2, 20),
  (4, 2, 3, 5);`,
  solutionQuery: `SELECT
  s.store_name,
  c.category_name
FROM stores s
CROSS JOIN categories c
INNER JOIN store_managers sm ON s.store_id = sm.store_id
LEFT JOIN promotions p
  ON s.store_id = p.store_id
  AND c.category_id = p.category_id
WHERE p.promo_id IS NULL
ORDER BY s.store_name, c.category_name;`,
  solutionExplanation: `## Explanation

### Pattern: CROSS JOIN + INNER JOIN + LEFT JOIN — Retail Coverage Audit

### Step-by-step

1. **CROSS JOIN categories**: Produces all (store, category) pairs — 3 stores × 3 categories = 9 rows.
2. **INNER JOIN store_managers**: Drops Airport Shop (no manager row), leaving 2 × 3 = 6 pairs.
3. **LEFT JOIN promotions**: Tries to match each pair to an existing promotion. Unmatched pairs return NULL promo columns.
4. **WHERE p.promo_id IS NULL**: Retains only the gaps — store-category pairs with no promotion.

### The role of each join
- CROSS JOIN: dimension expansion ("give me every possible pairing")
- INNER JOIN: scope restriction ("only for stores that qualify")
- LEFT JOIN: gap detection ("which pairings have no matching record")

### When to use
Compliance audits, merchandising coverage checks, or any report asking "what should exist but doesn't" across a two-dimensional matrix.`,
  testCases: [
    {
      name: "default",
      description: "Returns 2 store-category pairs with no promotion",
      expectedColumns: ["store_name", "category_name"],
      expectedRows: [
        { store_name: "Downtown", category_name: "Sports" },
        { store_name: "Mall Plaza", category_name: "Apparel" },
      ],
      orderMatters: true,
    },
    {
      name: "full-coverage",
      description: "After adding the missing promotions, no gaps remain",
      setupSql: `INSERT INTO promotions VALUES (5, 1, 3, 8), (6, 2, 1, 12);`,
      expectedColumns: ["store_name", "category_name"],
      expectedRows: [],
      orderMatters: false,
    },
  ],
};
