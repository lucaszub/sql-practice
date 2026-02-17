import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "109-lag-previous-month",
  title: "Previous Month Revenue Comparison",
  titleFr: "Comparaison du chiffre d'affaires au mois précédent",
  difficulty: "medium",
  category: "analytics-patterns",
  description: `## Previous Month Revenue Comparison

The finance team needs a monthly report showing each product line's revenue alongside the **previous month's revenue** to quickly spot trends. For each product and month, show the current revenue and the revenue from the immediately preceding month.

### Schema

| Column | Type |
|--------|------|
| product_line | VARCHAR |
| month_date | DATE |
| revenue | DECIMAL(12,2) |

### Expected output columns
\`product_line\`, \`month_date\`, \`revenue\`, \`prev_month_revenue\`

- \`prev_month_revenue\`: The revenue from the previous month for the same product line (NULL for the first month)
- Order by product_line ASC, month_date ASC.`,
  descriptionFr: `## Comparaison du chiffre d'affaires au mois précédent

L'équipe finance a besoin d'un rapport mensuel montrant le chiffre d'affaires de chaque ligne de produits avec le **chiffre d'affaires du mois précédent** pour repérer rapidement les tendances. Pour chaque produit et mois, affichez le chiffre d'affaires actuel et celui du mois immédiatement précédent.

### Schema

| Column | Type |
|--------|------|
| product_line | VARCHAR |
| month_date | DATE |
| revenue | DECIMAL(12,2) |

### Colonnes attendues en sortie
\`product_line\`, \`month_date\`, \`revenue\`, \`prev_month_revenue\`

- \`prev_month_revenue\` : Le chiffre d'affaires du mois précédent pour la même ligne de produits (NULL pour le premier mois)
- Triez par product_line ASC, month_date ASC.`,
  hint: "Use LAG(revenue, 1) OVER (PARTITION BY product_line ORDER BY month_date) to access the previous month's revenue for each product line.",
  hintFr: "Utilisez LAG(revenue, 1) OVER (PARTITION BY product_line ORDER BY month_date) pour accéder au chiffre d'affaires du mois précédent pour chaque ligne de produits.",
  schema: `CREATE TABLE monthly_product_revenue (
  product_line VARCHAR,
  month_date DATE,
  revenue DECIMAL(12,2)
);

INSERT INTO monthly_product_revenue VALUES
  ('Electronics', '2024-01-01', 45000.00),
  ('Electronics', '2024-02-01', 52000.00),
  ('Electronics', '2024-03-01', 48000.00),
  ('Electronics', '2024-04-01', 61000.00),
  ('Clothing', '2024-01-01', 32000.00),
  ('Clothing', '2024-02-01', 28000.00),
  ('Clothing', '2024-03-01', 35000.00),
  ('Clothing', '2024-04-01', 41000.00),
  ('Home & Garden', '2024-01-01', 18000.00),
  ('Home & Garden', '2024-02-01', 22000.00),
  ('Home & Garden', '2024-03-01', 25000.00),
  ('Home & Garden', '2024-04-01', 30000.00);`,
  solutionQuery: `SELECT
  product_line,
  month_date,
  revenue,
  LAG(revenue, 1) OVER (PARTITION BY product_line ORDER BY month_date) AS prev_month_revenue
FROM monthly_product_revenue
ORDER BY product_line, month_date;`,
  solutionExplanation: `## Explanation

### Pattern: LAG() for previous-period comparison

This uses the **LAG()** window function to look back at the previous row within a partition.

### Step-by-step
1. \`PARTITION BY product_line\` — each product line has its own window
2. \`ORDER BY month_date\` — rows ordered chronologically within each product
3. \`LAG(revenue, 1)\` — accesses the revenue value from 1 row back

### LAG() syntax
\`LAG(column, offset, default_value) OVER (PARTITION BY ... ORDER BY ...)\`
- \`offset\` defaults to 1 (previous row)
- \`default_value\` defaults to NULL (returned when there's no previous row)

### Why LAG() instead of a self-join?
- More readable: intent is clear from the function name
- More efficient: no need to join the table to itself
- Easier to extend: change offset to look back 2, 3, or N periods

### When to use
- Month-over-month comparisons
- Sequential difference calculations
- Detecting changes between consecutive records (price changes, status transitions)`,
  solutionExplanationFr: `## Explication

### Pattern : LAG() pour la comparaison à la période précédente

Ce pattern utilise la fonction de fenêtre **LAG()** pour regarder la ligne précédente au sein d'une partition.

### Étape par étape
1. \`PARTITION BY product_line\` — chaque ligne de produits a sa propre fenêtre
2. \`ORDER BY month_date\` — lignes ordonnées chronologiquement dans chaque produit
3. \`LAG(revenue, 1)\` — accède à la valeur du chiffre d'affaires 1 ligne en arrière

### Syntaxe de LAG()
\`LAG(colonne, décalage, valeur_par_défaut) OVER (PARTITION BY ... ORDER BY ...)\`
- \`décalage\` vaut 1 par défaut (ligne précédente)
- \`valeur_par_défaut\` vaut NULL par défaut (retourné quand il n'y a pas de ligne précédente)

### Quand l'utiliser
- Comparaisons mois par mois
- Calculs de différences séquentielles
- Détection de changements entre enregistrements consécutifs`,
  testCases: [
    {
      name: "default",
      description: "Previous month revenue for each product line",
      descriptionFr: "Chiffre d'affaires du mois précédent pour chaque ligne de produits",
      expectedColumns: ["product_line", "month_date", "revenue", "prev_month_revenue"],
      expectedRows: [
        { product_line: "Clothing", month_date: "2024-01-01", revenue: 32000.00, prev_month_revenue: null },
        { product_line: "Clothing", month_date: "2024-02-01", revenue: 28000.00, prev_month_revenue: 32000.00 },
        { product_line: "Clothing", month_date: "2024-03-01", revenue: 35000.00, prev_month_revenue: 28000.00 },
        { product_line: "Clothing", month_date: "2024-04-01", revenue: 41000.00, prev_month_revenue: 35000.00 },
        { product_line: "Electronics", month_date: "2024-01-01", revenue: 45000.00, prev_month_revenue: null },
        { product_line: "Electronics", month_date: "2024-02-01", revenue: 52000.00, prev_month_revenue: 45000.00 },
        { product_line: "Electronics", month_date: "2024-03-01", revenue: 48000.00, prev_month_revenue: 52000.00 },
        { product_line: "Electronics", month_date: "2024-04-01", revenue: 61000.00, prev_month_revenue: 48000.00 },
        { product_line: "Home & Garden", month_date: "2024-01-01", revenue: 18000.00, prev_month_revenue: null },
        { product_line: "Home & Garden", month_date: "2024-02-01", revenue: 22000.00, prev_month_revenue: 18000.00 },
        { product_line: "Home & Garden", month_date: "2024-03-01", revenue: 25000.00, prev_month_revenue: 22000.00 },
        { product_line: "Home & Garden", month_date: "2024-04-01", revenue: 30000.00, prev_month_revenue: 25000.00 },
      ],
      orderMatters: true,
    },
    {
      name: "single-month",
      description: "Product with only one month has NULL prev_month_revenue",
      descriptionFr: "Un produit avec un seul mois a prev_month_revenue NULL",
      setupSql: `DELETE FROM monthly_product_revenue WHERE product_line != 'Electronics' OR month_date > '2024-01-01';`,
      expectedColumns: ["product_line", "month_date", "revenue", "prev_month_revenue"],
      expectedRows: [
        { product_line: "Electronics", month_date: "2024-01-01", revenue: 45000.00, prev_month_revenue: null },
      ],
      orderMatters: true,
    },
  ],
};
