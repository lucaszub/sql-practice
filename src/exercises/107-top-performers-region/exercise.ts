import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "107-top-performers-region",
  title: "Top Salesperson Per Region Per Quarter",
  titleFr: "Meilleur vendeur par région par trimestre",
  difficulty: "medium",
  category: "window-functions",
  description: `## Top Salesperson Per Region Per Quarter

The VP of Sales wants a quarterly report showing the **top-performing salesperson in each region** based on total sales amount. For each region and quarter, return only the salesperson with the highest total sales. If there's a tie, include all tied salespeople.

### Schema

| Column | Type |
|--------|------|
| sale_id | INTEGER |
| salesperson | VARCHAR |
| region | VARCHAR |
| sale_date | DATE |
| amount | DECIMAL(10,2) |

### Expected output columns
\`region\`, \`quarter\`, \`salesperson\`, \`total_sales\`, \`rank\`

- \`quarter\` should be formatted as \`'Q1'\`, \`'Q2'\`, etc.
- Only include rows where \`rank = 1\`
- Order by region ASC, quarter ASC, salesperson ASC.`,
  descriptionFr: `## Meilleur vendeur par région par trimestre

Le VP des ventes souhaite un rapport trimestriel montrant le **meilleur vendeur dans chaque région** basé sur le montant total des ventes. Pour chaque région et trimestre, retournez uniquement le vendeur avec les ventes totales les plus élevées. En cas d'égalité, incluez tous les vendeurs à égalité.

### Schema

| Column | Type |
|--------|------|
| sale_id | INTEGER |
| salesperson | VARCHAR |
| region | VARCHAR |
| sale_date | DATE |
| amount | DECIMAL(10,2) |

### Colonnes attendues en sortie
\`region\`, \`quarter\`, \`salesperson\`, \`total_sales\`, \`rank\`

- \`quarter\` doit être formaté comme \`'Q1'\`, \`'Q2'\`, etc.
- N'inclure que les lignes où \`rank = 1\`
- Triez par region ASC, quarter ASC, salesperson ASC.`,
  hint: "First aggregate sales by region, quarter, and salesperson using a CTE. Then use RANK() OVER (PARTITION BY region, quarter ORDER BY total_sales DESC) and filter for rank = 1.",
  hintFr: "D'abord, agrégez les ventes par région, trimestre et vendeur dans un CTE. Puis utilisez RANK() OVER (PARTITION BY region, quarter ORDER BY total_sales DESC) et filtrez pour rank = 1.",
  schema: `CREATE TABLE sales (
  sale_id INTEGER,
  salesperson VARCHAR,
  region VARCHAR,
  sale_date DATE,
  amount DECIMAL(10,2)
);

INSERT INTO sales VALUES
  (1, 'Ana', 'West', '2024-01-15', 5000.00),
  (2, 'Ana', 'West', '2024-02-20', 7000.00),
  (3, 'Ben', 'West', '2024-01-10', 6000.00),
  (4, 'Ben', 'West', '2024-03-05', 6000.00),
  (5, 'Ana', 'West', '2024-04-12', 8000.00),
  (6, 'Ben', 'West', '2024-05-18', 4000.00),
  (7, 'Cara', 'East', '2024-01-22', 9000.00),
  (8, 'Cara', 'East', '2024-02-14', 3000.00),
  (9, 'Dan', 'East', '2024-01-30', 12000.00),
  (10, 'Dan', 'East', '2024-03-25', 5000.00),
  (11, 'Cara', 'East', '2024-04-05', 11000.00),
  (12, 'Dan', 'East', '2024-04-20', 11000.00),
  (13, 'Eve', 'South', '2024-01-08', 4500.00),
  (14, 'Eve', 'South', '2024-02-28', 4500.00),
  (15, 'Finn', 'South', '2024-01-18', 9000.00);`,
  solutionQuery: `WITH quarterly_sales AS (
  SELECT
    region,
    'Q' || EXTRACT(QUARTER FROM sale_date) AS quarter,
    salesperson,
    SUM(amount) AS total_sales
  FROM sales
  GROUP BY region, EXTRACT(QUARTER FROM sale_date), salesperson
),
ranked AS (
  SELECT
    region,
    quarter,
    salesperson,
    total_sales,
    RANK() OVER (PARTITION BY region, quarter ORDER BY total_sales DESC) AS rank
  FROM quarterly_sales
)
SELECT region, quarter, salesperson, total_sales, rank
FROM ranked
WHERE rank = 1
ORDER BY region, quarter, salesperson;`,
  solutionExplanation: `## Explanation

### Pattern: Top-N per group with pre-aggregation

This combines **aggregation** with the **Top-N per group** pattern — a common real-world scenario where you need to rank aggregated results.

### Step-by-step
1. **CTE \`quarterly_sales\`**: Aggregate raw sales by region, quarter, and salesperson
2. **CTE \`ranked\`**: Apply RANK() within each region+quarter group
3. **Filter**: Keep only rank = 1 (the top performer per region per quarter)

### Why two CTEs?
- Window functions can't reference aggregate results in the same SELECT
- The first CTE computes totals, the second ranks them
- This "aggregate then rank" pattern is extremely common in business reporting

### Why RANK() instead of ROW_NUMBER()?
- RANK() allows ties — if two salespeople have identical total sales, both appear
- ROW_NUMBER() would arbitrarily pick one, potentially hiding meaningful information

### When to use
- Quarterly/monthly performance reports
- "Best in class" analysis across dimensions
- Award/bonus eligibility reports`,
  solutionExplanationFr: `## Explication

### Pattern : Top-N par groupe avec pré-agrégation

Ce pattern combine **l'agrégation** avec le pattern **Top-N par groupe** — un scénario très courant où il faut classer des résultats agrégés.

### Étape par étape
1. **CTE \`quarterly_sales\`** : Agréger les ventes brutes par région, trimestre et vendeur
2. **CTE \`ranked\`** : Appliquer RANK() au sein de chaque groupe région+trimestre
3. **Filtre** : Ne garder que le rang 1 (le meilleur performeur par région par trimestre)

### Pourquoi RANK() plutôt que ROW_NUMBER() ?
- RANK() permet les ex aequo — si deux vendeurs ont des ventes identiques, les deux apparaissent
- ROW_NUMBER() en choisirait un arbitrairement

### Quand l'utiliser
- Rapports de performance trimestriels/mensuels
- Analyse "meilleur de la catégorie" sur plusieurs dimensions`,
  testCases: [
    {
      name: "default",
      description: "Top salesperson per region per quarter, including ties",
      descriptionFr: "Meilleur vendeur par région par trimestre, y compris les ex aequo",
      expectedColumns: ["region", "quarter", "salesperson", "total_sales", "rank"],
      expectedRows: [
        { region: "East", quarter: "Q1", salesperson: "Dan", total_sales: 17000.00, rank: 1 },
        { region: "East", quarter: "Q2", salesperson: "Cara", total_sales: 11000.00, rank: 1 },
        { region: "East", quarter: "Q2", salesperson: "Dan", total_sales: 11000.00, rank: 1 },
        { region: "South", quarter: "Q1", salesperson: "Eve", total_sales: 9000.00, rank: 1 },
        { region: "South", quarter: "Q1", salesperson: "Finn", total_sales: 9000.00, rank: 1 },
        { region: "West", quarter: "Q1", salesperson: "Ana", total_sales: 12000.00, rank: 1 },
        { region: "West", quarter: "Q1", salesperson: "Ben", total_sales: 12000.00, rank: 1 },
        { region: "West", quarter: "Q2", salesperson: "Ana", total_sales: 8000.00, rank: 1 },
      ],
      orderMatters: true,
    },
    {
      name: "single-salesperson",
      description: "Region with only one salesperson always gets rank 1",
      descriptionFr: "Une région avec un seul vendeur obtient toujours le rang 1",
      setupSql: `DELETE FROM sales WHERE region != 'South';`,
      expectedColumns: ["region", "quarter", "salesperson", "total_sales", "rank"],
      expectedRows: [
        { region: "South", quarter: "Q1", salesperson: "Eve", total_sales: 9000.00, rank: 1 },
        { region: "South", quarter: "Q1", salesperson: "Finn", total_sales: 9000.00, rank: 1 },
      ],
      orderMatters: false,
    },
  ],
};
