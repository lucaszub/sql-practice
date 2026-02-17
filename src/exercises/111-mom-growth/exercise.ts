import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "111-mom-growth",
  title: "Month-over-Month User Signup Growth",
  titleFr: "Croissance mensuelle des inscriptions",
  difficulty: "medium",
  category: "analytics-patterns",
  description: `## Month-over-Month User Signup Growth

The growth team monitors **month-over-month (MoM) signup growth** to evaluate the impact of marketing campaigns. Calculate the MoM growth rate as a percentage for each month.

### Schema

| Column | Type |
|--------|------|
| signup_month | DATE |
| signups | INTEGER |

### Expected output columns
\`signup_month\`, \`signups\`, \`prev_month_signups\`, \`mom_growth_pct\`

- \`prev_month_signups\`: Signups from the previous month (NULL for the first month)
- \`mom_growth_pct\`: \`ROUND(((signups - prev_month_signups) / prev_month_signups::DECIMAL) * 100, 2)\` (NULL for the first month)
- Order by signup_month ASC.`,
  descriptionFr: `## Croissance mensuelle des inscriptions

L'équipe croissance surveille la **croissance mois par mois (MoM) des inscriptions** pour évaluer l'impact des campagnes marketing. Calculez le taux de croissance MoM en pourcentage pour chaque mois.

### Schema

| Column | Type |
|--------|------|
| signup_month | DATE |
| signups | INTEGER |

### Colonnes attendues en sortie
\`signup_month\`, \`signups\`, \`prev_month_signups\`, \`mom_growth_pct\`

- \`prev_month_signups\` : Inscriptions du mois précédent (NULL pour le premier mois)
- \`mom_growth_pct\` : \`ROUND(((signups - prev_month_signups) / prev_month_signups::DECIMAL) * 100, 2)\` (NULL pour le premier mois)
- Triez par signup_month ASC.`,
  hint: "Use LAG(signups) OVER (ORDER BY signup_month) to get the previous month's count. Then compute the growth percentage using the standard formula: ((current - previous) / previous) * 100.",
  hintFr: "Utilisez LAG(signups) OVER (ORDER BY signup_month) pour obtenir le nombre du mois précédent. Puis calculez le pourcentage de croissance avec la formule standard : ((actuel - précédent) / précédent) * 100.",
  schema: `CREATE TABLE monthly_signups (
  signup_month DATE,
  signups INTEGER
);

INSERT INTO monthly_signups VALUES
  ('2024-01-01', 1200),
  ('2024-02-01', 1350),
  ('2024-03-01', 1100),
  ('2024-04-01', 1500),
  ('2024-05-01', 1800),
  ('2024-06-01', 1750),
  ('2024-07-01', 2100),
  ('2024-08-01', 2400);`,
  solutionQuery: `SELECT
  signup_month,
  signups,
  LAG(signups) OVER (ORDER BY signup_month) AS prev_month_signups,
  ROUND(
    ((signups - LAG(signups) OVER (ORDER BY signup_month))::DECIMAL
    / LAG(signups) OVER (ORDER BY signup_month)) * 100,
    2
  ) AS mom_growth_pct
FROM monthly_signups
ORDER BY signup_month;`,
  solutionExplanation: `## Explanation

### Pattern: Month-over-Month growth with LAG()

This uses **LAG()** to compute period-over-period growth rates — one of the most common analytical patterns.

### Step-by-step
1. \`LAG(signups) OVER (ORDER BY signup_month)\` — gets the previous month's signup count
2. No PARTITION BY needed — signups are global (not per-category)
3. Growth formula: \`((current - previous) / previous) * 100\`
4. ROUND to 2 decimal places for clean reporting

### Interpreting MoM growth
- **Positive**: Growth is accelerating (e.g., +12.5% means 12.5% more signups than last month)
- **Negative**: Growth is declining (e.g., -18.52% means signups dropped)
- **NULL**: First month has no comparison point

### Important: Cast to DECIMAL
Integer division in SQL truncates: \`100 / 1200 = 0\`. Cast to DECIMAL to get fractional results.

### When to use
- Monitoring marketing campaign effectiveness
- Product launch impact analysis
- Seasonal trend identification
- Board/investor reporting metrics`,
  solutionExplanationFr: `## Explication

### Pattern : Croissance mois par mois avec LAG()

Ce pattern utilise **LAG()** pour calculer les taux de croissance période par période — l'un des patterns analytiques les plus courants.

### Étape par étape
1. \`LAG(signups) OVER (ORDER BY signup_month)\` — obtient le nombre d'inscriptions du mois précédent
2. Pas de PARTITION BY nécessaire — les inscriptions sont globales
3. Formule de croissance : \`((actuel - précédent) / précédent) * 100\`
4. ROUND à 2 décimales pour un reporting propre

### Interpréter la croissance MoM
- **Positif** : La croissance s'accélère
- **Négatif** : La croissance décline
- **NULL** : Le premier mois n'a pas de point de comparaison

### Important : Cast en DECIMAL
La division entière en SQL tronque : \`100 / 1200 = 0\`. Castez en DECIMAL pour obtenir des résultats fractionnaires.`,
  testCases: [
    {
      name: "default",
      description: "MoM growth rate for 8 months of signups",
      descriptionFr: "Taux de croissance MoM pour 8 mois d'inscriptions",
      expectedColumns: ["signup_month", "signups", "prev_month_signups", "mom_growth_pct"],
      expectedRows: [
        { signup_month: "2024-01-01", signups: 1200, prev_month_signups: null, mom_growth_pct: null },
        { signup_month: "2024-02-01", signups: 1350, prev_month_signups: 1200, mom_growth_pct: 12.50 },
        { signup_month: "2024-03-01", signups: 1100, prev_month_signups: 1350, mom_growth_pct: -18.52 },
        { signup_month: "2024-04-01", signups: 1500, prev_month_signups: 1100, mom_growth_pct: 36.36 },
        { signup_month: "2024-05-01", signups: 1800, prev_month_signups: 1500, mom_growth_pct: 20.00 },
        { signup_month: "2024-06-01", signups: 1750, prev_month_signups: 1800, mom_growth_pct: -2.78 },
        { signup_month: "2024-07-01", signups: 2100, prev_month_signups: 1750, mom_growth_pct: 20.00 },
        { signup_month: "2024-08-01", signups: 2400, prev_month_signups: 2100, mom_growth_pct: 14.29 },
      ],
      orderMatters: true,
    },
    {
      name: "two-months",
      description: "Minimal data: only two months",
      descriptionFr: "Données minimales : seulement deux mois",
      setupSql: `DELETE FROM monthly_signups WHERE signup_month > '2024-02-01';`,
      expectedColumns: ["signup_month", "signups", "prev_month_signups", "mom_growth_pct"],
      expectedRows: [
        { signup_month: "2024-01-01", signups: 1200, prev_month_signups: null, mom_growth_pct: null },
        { signup_month: "2024-02-01", signups: 1350, prev_month_signups: 1200, mom_growth_pct: 12.50 },
      ],
      orderMatters: true,
    },
  ],
};
