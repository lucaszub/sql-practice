import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "114-trend-detection",
  title: "Detect Consecutive Sales Decline",
  titleFr: "Détecter les baisses de ventes consécutives",
  difficulty: "hard",
  category: "analytics-patterns",
  description: `## Detect Consecutive Sales Decline

The product team wants to identify products experiencing a **sustained downward trend** — specifically, products that had **3 or more consecutive months of declining sales**. For each product, flag months where revenue was lower than the previous month for at least 3 months in a row.

### Schema

| Column | Type |
|--------|------|
| product_name | VARCHAR |
| month_date | DATE |
| revenue | DECIMAL(12,2) |

### Expected output columns
\`product_name\`, \`month_date\`, \`revenue\`, \`prev_revenue\`, \`consecutive_decline_months\`

- \`prev_revenue\`: Revenue from the previous month for this product
- \`consecutive_decline_months\`: Number of consecutive months this product's revenue has been declining (0 if current month is not a decline)
- Only include rows where \`consecutive_decline_months >= 3\`
- Order by product_name ASC, month_date ASC.`,
  descriptionFr: `## Détecter les baisses de ventes consécutives

L'équipe produit souhaite identifier les produits en **tendance baissière soutenue** — spécifiquement, les produits qui ont eu **3 mois consécutifs ou plus de baisse des ventes**. Pour chaque produit, signalez les mois où le chiffre d'affaires était inférieur au mois précédent pendant au moins 3 mois consécutifs.

### Schema

| Column | Type |
|--------|------|
| product_name | VARCHAR |
| month_date | DATE |
| revenue | DECIMAL(12,2) |

### Colonnes attendues en sortie
\`product_name\`, \`month_date\`, \`revenue\`, \`prev_revenue\`, \`consecutive_decline_months\`

- \`prev_revenue\` : Chiffre d'affaires du mois précédent pour ce produit
- \`consecutive_decline_months\` : Nombre de mois consécutifs de baisse
- N'inclure que les lignes où \`consecutive_decline_months >= 3\`
- Triez par product_name ASC, month_date ASC.`,
  hint: "First use LAG() to get previous month's revenue. Then use a running count technique: assign groups where a decline streak resets (using SUM of a 'reset' flag as a window function), and count consecutive declines within each group.",
  hintFr: "D'abord utilisez LAG() pour obtenir le chiffre d'affaires du mois précédent. Puis utilisez une technique de comptage courant : assignez des groupes où la série de baisses se réinitialise, et comptez les baisses consécutives dans chaque groupe.",
  schema: `CREATE TABLE product_monthly_sales (
  product_name VARCHAR,
  month_date DATE,
  revenue DECIMAL(12,2)
);

INSERT INTO product_monthly_sales VALUES
  ('Widget Pro', '2024-01-01', 50000.00),
  ('Widget Pro', '2024-02-01', 48000.00),
  ('Widget Pro', '2024-03-01', 45000.00),
  ('Widget Pro', '2024-04-01', 42000.00),
  ('Widget Pro', '2024-05-01', 40000.00),
  ('Widget Pro', '2024-06-01', 55000.00),
  ('Widget Pro', '2024-07-01', 52000.00),
  ('Widget Pro', '2024-08-01', 49000.00),
  ('Gadget Max', '2024-01-01', 30000.00),
  ('Gadget Max', '2024-02-01', 35000.00),
  ('Gadget Max', '2024-03-01', 33000.00),
  ('Gadget Max', '2024-04-01', 31000.00),
  ('Gadget Max', '2024-05-01', 28000.00),
  ('Gadget Max', '2024-06-01', 25000.00),
  ('Gadget Max', '2024-07-01', 27000.00),
  ('Gadget Max', '2024-08-01', 32000.00),
  ('Tool Basic', '2024-01-01', 20000.00),
  ('Tool Basic', '2024-02-01', 22000.00),
  ('Tool Basic', '2024-03-01', 25000.00),
  ('Tool Basic', '2024-04-01', 28000.00);`,
  solutionQuery: `WITH with_prev AS (
  SELECT
    product_name,
    month_date,
    revenue,
    LAG(revenue) OVER (PARTITION BY product_name ORDER BY month_date) AS prev_revenue
  FROM product_monthly_sales
),
with_decline_flag AS (
  SELECT
    *,
    CASE WHEN prev_revenue IS NOT NULL AND revenue < prev_revenue THEN 0 ELSE 1 END AS reset_flag
  FROM with_prev
),
with_groups AS (
  SELECT
    *,
    SUM(reset_flag) OVER (PARTITION BY product_name ORDER BY month_date) AS decline_group
  FROM with_decline_flag
),
with_streak AS (
  SELECT
    product_name,
    month_date,
    revenue,
    prev_revenue,
    CASE WHEN reset_flag = 0
      THEN ROW_NUMBER() OVER (PARTITION BY product_name, decline_group ORDER BY month_date) - 1
      ELSE 0
    END AS consecutive_decline_months
  FROM with_groups
)
SELECT product_name, month_date, revenue, prev_revenue, consecutive_decline_months
FROM with_streak
WHERE consecutive_decline_months >= 3
ORDER BY product_name, month_date;`,
  solutionExplanation: `## Explanation

### Pattern: Consecutive event detection with running group assignment

This combines **LAG()**, **conditional grouping**, and **ROW_NUMBER()** to detect consecutive declining streaks.

### Step-by-step
1. **CTE \`with_prev\`**: Use LAG() to get the previous month's revenue
2. **CTE \`with_decline_flag\`**: Flag each month as 0 (declining) or 1 (not declining/first month)
3. **CTE \`with_groups\`**: Running SUM of the reset flag creates a group ID — each time revenue doesn't decline, a new group starts
4. **CTE \`with_streak\`**: Within each decline group, ROW_NUMBER() counts consecutive decline months
5. **Filter**: Keep only rows where the streak is 3+ months

### Why this works
The running SUM trick creates a "group ID" that increments each time the streak breaks:
- Decline months get flag 0 (don't increment the group)
- Non-decline months get flag 1 (increment = new group)
- Within each group, ROW_NUMBER gives the streak position

### When to use
- Monitoring product health (declining engagement, revenue, usage)
- Alert systems for sustained negative trends
- Performance management (consecutive underperformance)
- Stock analysis (consecutive drops)`,
  solutionExplanationFr: `## Explication

### Pattern : Détection d'événements consécutifs avec attribution de groupes courants

Ce pattern combine **LAG()**, **regroupement conditionnel** et **ROW_NUMBER()** pour détecter des séries de baisses consécutives.

### Étape par étape
1. **CTE \`with_prev\`** : Utiliser LAG() pour obtenir le chiffre d'affaires du mois précédent
2. **CTE \`with_decline_flag\`** : Marquer chaque mois comme 0 (en baisse) ou 1 (pas en baisse)
3. **CTE \`with_groups\`** : La SUM courante du flag crée un ID de groupe
4. **CTE \`with_streak\`** : Au sein de chaque groupe, ROW_NUMBER() compte les mois de baisse consécutifs
5. **Filtre** : Ne garder que les lignes avec une série de 3+ mois

### Quand l'utiliser
- Surveillance de la santé des produits
- Systèmes d'alerte pour tendances négatives soutenues
- Gestion de la performance
- Analyse boursière`,
  testCases: [
    {
      name: "default",
      description: "Detect products with 3+ consecutive months of declining revenue",
      descriptionFr: "Détecter les produits avec 3+ mois consécutifs de baisse de chiffre d'affaires",
      expectedColumns: ["product_name", "month_date", "revenue", "prev_revenue", "consecutive_decline_months"],
      expectedRows: [
        { product_name: "Gadget Max", month_date: "2024-05-01", revenue: 28000.00, prev_revenue: 31000.00, consecutive_decline_months: 3 },
        { product_name: "Gadget Max", month_date: "2024-06-01", revenue: 25000.00, prev_revenue: 28000.00, consecutive_decline_months: 4 },
        { product_name: "Widget Pro", month_date: "2024-04-01", revenue: 42000.00, prev_revenue: 45000.00, consecutive_decline_months: 3 },
        { product_name: "Widget Pro", month_date: "2024-05-01", revenue: 40000.00, prev_revenue: 42000.00, consecutive_decline_months: 4 },
      ],
      orderMatters: true,
    },
    {
      name: "no-decline-streaks",
      description: "Product with no consecutive declines returns empty",
      descriptionFr: "Un produit sans baisses consécutives retourne un résultat vide",
      setupSql: `DELETE FROM product_monthly_sales WHERE product_name != 'Tool Basic';`,
      expectedColumns: ["product_name", "month_date", "revenue", "prev_revenue", "consecutive_decline_months"],
      expectedRows: [],
      orderMatters: false,
    },
  ],
};
