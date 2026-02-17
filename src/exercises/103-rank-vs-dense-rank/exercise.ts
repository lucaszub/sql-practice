import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "103-rank-vs-dense-rank",
  title: "Sales Ranking with Ties",
  titleFr: "Classement des ventes avec ex aequo",
  difficulty: "medium",
  category: "window-functions",
  description: `## Sales Ranking with Ties

The sales director wants to see how products rank by total units sold **within each region**. When products have the same number of units sold, they should receive the **same rank**, and the next rank should follow consecutively without gaps (use \`DENSE_RANK()\`).

### Schema

| Column | Type |
|--------|------|
| product_id | INTEGER |
| product_name | VARCHAR |
| region | VARCHAR |
| units_sold | INTEGER |

### Expected output columns
\`region\`, \`product_name\`, \`units_sold\`, \`dense_rank\`

Order by region ASC, dense_rank ASC, product_name ASC.`,
  descriptionFr: `## Classement des ventes avec ex aequo

Le directeur commercial souhaite voir comment les produits se classent par nombre total d'unités vendues **dans chaque région**. Lorsque des produits ont le même nombre d'unités vendues, ils doivent recevoir le **même rang**, et le rang suivant doit suivre consécutivement sans trou (utilisez \`DENSE_RANK()\`).

### Schema

| Column | Type |
|--------|------|
| product_id | INTEGER |
| product_name | VARCHAR |
| region | VARCHAR |
| units_sold | INTEGER |

### Colonnes attendues en sortie
\`region\`, \`product_name\`, \`units_sold\`, \`dense_rank\`

Triez par region ASC, dense_rank ASC, product_name ASC.`,
  hint: "Use DENSE_RANK() OVER (PARTITION BY region ORDER BY units_sold DESC). DENSE_RANK gives consecutive ranks without gaps when there are ties, unlike RANK() which skips numbers.",
  hintFr: "Utilisez DENSE_RANK() OVER (PARTITION BY region ORDER BY units_sold DESC). DENSE_RANK attribue des rangs consécutifs sans trous en cas d'égalité, contrairement à RANK() qui saute des numéros.",
  schema: `CREATE TABLE product_sales (
  product_id INTEGER,
  product_name VARCHAR,
  region VARCHAR,
  units_sold INTEGER
);

INSERT INTO product_sales VALUES
  (1, 'Widget A', 'North', 150),
  (2, 'Widget B', 'North', 200),
  (3, 'Widget C', 'North', 200),
  (4, 'Widget D', 'North', 120),
  (5, 'Widget E', 'North', 95),
  (6, 'Gadget X', 'South', 300),
  (7, 'Gadget Y', 'South', 300),
  (8, 'Gadget Z', 'South', 250),
  (9, 'Gadget W', 'South', 180),
  (10, 'Tool P', 'East', 400),
  (11, 'Tool Q', 'East', 350),
  (12, 'Tool R', 'East', 350),
  (13, 'Tool S', 'East', 350),
  (14, 'Tool T', 'East', 100);`,
  solutionQuery: `SELECT
  region,
  product_name,
  units_sold,
  DENSE_RANK() OVER (PARTITION BY region ORDER BY units_sold DESC) AS dense_rank
FROM product_sales
ORDER BY region, dense_rank, product_name;`,
  solutionExplanation: `## Explanation

### Pattern: DENSE_RANK() for ranking with ties

This uses the **dense ranking** pattern to rank items where ties produce consecutive numbers.

### Step-by-step
1. \`PARTITION BY region\` — creates a separate ranking per region
2. \`ORDER BY units_sold DESC\` — highest sales get rank 1
3. \`DENSE_RANK()\` — assigns the same rank to tied values, next rank is always +1

### RANK() vs DENSE_RANK() vs ROW_NUMBER()

| units_sold | ROW_NUMBER | RANK | DENSE_RANK |
|-----------|------------|------|------------|
| 300 | 1 | 1 | 1 |
| 300 | 2 | 1 | 1 |
| 250 | 3 | 3 | 2 |
| 180 | 4 | 4 | 3 |

- **ROW_NUMBER()**: Always unique (1, 2, 3, 4) — ties get arbitrary order
- **RANK()**: Same rank for ties, skips (1, 1, 3, 4) — "Olympic medal" style
- **DENSE_RANK()**: Same rank for ties, no gaps (1, 1, 2, 3) — consecutive numbering

### When to use DENSE_RANK()
- Product rankings where ties are meaningful and you need consecutive rank numbers
- Bucketing by rank ("show me the top 3 distinct price tiers")
- Any ranking where stakeholders expect no gaps in rank numbers`,
  solutionExplanationFr: `## Explication

### Pattern : DENSE_RANK() pour un classement avec ex aequo

Ce pattern utilise le **classement dense** pour classer des éléments où les ex aequo produisent des numéros consécutifs.

### Étape par étape
1. \`PARTITION BY region\` — crée un classement séparé par région
2. \`ORDER BY units_sold DESC\` — les meilleures ventes obtiennent le rang 1
3. \`DENSE_RANK()\` — attribue le même rang aux valeurs ex aequo, le rang suivant est toujours +1

### RANK() vs DENSE_RANK() vs ROW_NUMBER()

| units_sold | ROW_NUMBER | RANK | DENSE_RANK |
|-----------|------------|------|------------|
| 300 | 1 | 1 | 1 |
| 300 | 2 | 1 | 1 |
| 250 | 3 | 3 | 2 |
| 180 | 4 | 4 | 3 |

- **ROW_NUMBER()** : Toujours unique (1, 2, 3, 4)
- **RANK()** : Même rang pour les ex aequo, avec sauts (1, 1, 3, 4)
- **DENSE_RANK()** : Même rang pour les ex aequo, sans sauts (1, 1, 2, 3)

### Quand utiliser DENSE_RANK()
- Classements de produits où les ex aequo sont significatifs
- Regroupement par rang ("montrer les 3 premiers niveaux de prix distincts")
- Tout classement où les parties prenantes attendent des numéros de rang sans trous`,
  testCases: [
    {
      name: "default",
      description: "Dense ranking of products by units sold per region",
      descriptionFr: "Classement dense des produits par unités vendues par région",
      expectedColumns: ["region", "product_name", "units_sold", "dense_rank"],
      expectedRows: [
        { region: "East", product_name: "Tool P", units_sold: 400, dense_rank: 1 },
        { region: "East", product_name: "Tool Q", units_sold: 350, dense_rank: 2 },
        { region: "East", product_name: "Tool R", units_sold: 350, dense_rank: 2 },
        { region: "East", product_name: "Tool S", units_sold: 350, dense_rank: 2 },
        { region: "East", product_name: "Tool T", units_sold: 100, dense_rank: 3 },
        { region: "North", product_name: "Widget B", units_sold: 200, dense_rank: 1 },
        { region: "North", product_name: "Widget C", units_sold: 200, dense_rank: 1 },
        { region: "North", product_name: "Widget A", units_sold: 150, dense_rank: 2 },
        { region: "North", product_name: "Widget D", units_sold: 120, dense_rank: 3 },
        { region: "North", product_name: "Widget E", units_sold: 95, dense_rank: 4 },
        { region: "South", product_name: "Gadget X", units_sold: 300, dense_rank: 1 },
        { region: "South", product_name: "Gadget Y", units_sold: 300, dense_rank: 1 },
        { region: "South", product_name: "Gadget Z", units_sold: 250, dense_rank: 2 },
        { region: "South", product_name: "Gadget W", units_sold: 180, dense_rank: 3 },
      ],
      orderMatters: true,
    },
    {
      name: "all-tied",
      description: "When all products in a region have the same sales, all get rank 1",
      descriptionFr: "Quand tous les produits d'une région ont les mêmes ventes, tous obtiennent le rang 1",
      setupSql: `DELETE FROM product_sales; INSERT INTO product_sales VALUES (1, 'Alpha', 'West', 100), (2, 'Beta', 'West', 100), (3, 'Gamma', 'West', 100);`,
      expectedColumns: ["region", "product_name", "units_sold", "dense_rank"],
      expectedRows: [
        { region: "West", product_name: "Alpha", units_sold: 100, dense_rank: 1 },
        { region: "West", product_name: "Beta", units_sold: 100, dense_rank: 1 },
        { region: "West", product_name: "Gamma", units_sold: 100, dense_rank: 1 },
      ],
      orderMatters: true,
    },
  ],
};
