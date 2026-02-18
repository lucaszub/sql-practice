import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "118-growth-target-tracking",
  title: "Revenue Target Progress Tracking",
  titleFr: "Suivi de progression vers l'objectif de chiffre d'affaires",
  difficulty: "hard",
  category: "running-totals",
  description: `## Revenue Target Progress Tracking

The sales leadership wants to track **monthly progress toward the annual revenue target** of $1,000,000. For each month, show the monthly revenue, the cumulative revenue year-to-date, and the percentage of the annual target achieved so far.

### Schema

| Column | Type |
|--------|------|
| month_date | DATE |
| monthly_revenue | DECIMAL(12,2) |

The annual target is **$1,000,000**.

### Expected output columns
\`month_date\`, \`monthly_revenue\`, \`ytd_revenue\`, \`target_pct\`

- \`ytd_revenue\`: Cumulative revenue from January through the current month
- \`target_pct\`: \`ROUND((ytd_revenue / 1000000.0) * 100, 2)\` — percentage of $1M target achieved
- Order by month_date ASC.`,
  descriptionFr: `## Suivi de progression vers l'objectif de chiffre d'affaires

La direction commerciale souhaite suivre la **progression mensuelle vers l'objectif annuel de chiffre d'affaires** de 1 000 000 $. Pour chaque mois, montrez le chiffre d'affaires mensuel, le chiffre d'affaires cumulé depuis le début de l'année, et le pourcentage de l'objectif annuel atteint.

### Schema

| Column | Type |
|--------|------|
| month_date | DATE |
| monthly_revenue | DECIMAL(12,2) |

L'objectif annuel est de **1 000 000 $**.

### Colonnes attendues en sortie
\`month_date\`, \`monthly_revenue\`, \`ytd_revenue\`, \`target_pct\`

- \`ytd_revenue\` : Chiffre d'affaires cumulé de janvier au mois courant
- \`target_pct\` : \`ROUND((ytd_revenue / 1000000.0) * 100, 2)\` — pourcentage de l'objectif de 1M$ atteint
- Triez par month_date ASC.`,
  hint: "Compute ytd_revenue using SUM(monthly_revenue) OVER (ORDER BY month_date ROWS UNBOUNDED PRECEDING). Then divide by 1000000.0 and multiply by 100 for the percentage.",
  hintFr: "Calculez ytd_revenue avec SUM(monthly_revenue) OVER (ORDER BY month_date ROWS UNBOUNDED PRECEDING). Puis divisez par 1000000.0 et multipliez par 100 pour le pourcentage.",
  schema: `CREATE TABLE monthly_revenue (
  month_date DATE,
  monthly_revenue DECIMAL(12,2)
);

INSERT INTO monthly_revenue VALUES
  ('2024-01-01', 75000.00),
  ('2024-02-01', 82000.00),
  ('2024-03-01', 91000.00),
  ('2024-04-01', 88000.00),
  ('2024-05-01', 95000.00),
  ('2024-06-01', 103000.00),
  ('2024-07-01', 78000.00),
  ('2024-08-01', 85000.00),
  ('2024-09-01', 110000.00),
  ('2024-10-01', 98000.00);`,
  solutionQuery: `SELECT
  month_date,
  monthly_revenue,
  SUM(monthly_revenue) OVER (ORDER BY month_date ROWS UNBOUNDED PRECEDING) AS ytd_revenue,
  ROUND(
    (SUM(monthly_revenue) OVER (ORDER BY month_date ROWS UNBOUNDED PRECEDING) / 1000000.0) * 100,
    2
  ) AS target_pct
FROM monthly_revenue
ORDER BY month_date;`,
  solutionExplanation: `## Explanation

### Pattern: Running total with derived metric

This combines the **running total** pattern with a **calculated percentage** to track progress toward a fixed target.

### Step-by-step
1. \`SUM(monthly_revenue) OVER (ORDER BY month_date ROWS UNBOUNDED PRECEDING)\` — cumulative YTD revenue
2. Divide by target (1,000,000) and multiply by 100 for percentage
3. ROUND to 2 decimal places

### Why this is common in business
- Board decks always show YTD progress vs plan
- Sales teams track quota attainment
- Finance monitors budget utilization
- Product teams track cumulative adoption vs targets

### Extending this pattern
- **Partitioned targets**: PARTITION BY region for per-region tracking
- **Dynamic targets**: Join a targets table instead of hardcoding
- **Forecasting**: Use the YTD trend to project end-of-year totals
- **Behind/ahead flag**: Compare target_pct to (month_number / 12 * 100) to see if on track

### When to use
- Quarterly/annual target tracking
- Budget burn rate monitoring
- Campaign goal progress
- Fundraising goal tracking`,
  solutionExplanationFr: `## Explication

### Pattern : Total cumulé avec métrique dérivée

Ce pattern combine le **total cumulé** avec un **pourcentage calculé** pour suivre la progression vers un objectif fixe.

### Étape par étape
1. \`SUM(monthly_revenue) OVER (...)\` — chiffre d'affaires cumulé YTD
2. Diviser par l'objectif (1 000 000) et multiplier par 100 pour le pourcentage
3. ROUND à 2 décimales

### Extensions de ce pattern
- **Objectifs partitionnés** : PARTITION BY région pour un suivi par région
- **Objectifs dynamiques** : Joindre une table d'objectifs au lieu de coder en dur
- **Prévisions** : Utiliser la tendance YTD pour projeter les totaux de fin d'année`,
  testCases: [
    {
      name: "default",
      description: "YTD revenue and target percentage for 10 months",
      descriptionFr: "Chiffre d'affaires YTD et pourcentage d'objectif pour 10 mois",
      expectedColumns: ["month_date", "monthly_revenue", "ytd_revenue", "target_pct"],
      expectedRows: [
        { month_date: "2024-01-01", monthly_revenue: 75000.00, ytd_revenue: 75000.00, target_pct: 7.50 },
        { month_date: "2024-02-01", monthly_revenue: 82000.00, ytd_revenue: 157000.00, target_pct: 15.70 },
        { month_date: "2024-03-01", monthly_revenue: 91000.00, ytd_revenue: 248000.00, target_pct: 24.80 },
        { month_date: "2024-04-01", monthly_revenue: 88000.00, ytd_revenue: 336000.00, target_pct: 33.60 },
        { month_date: "2024-05-01", monthly_revenue: 95000.00, ytd_revenue: 431000.00, target_pct: 43.10 },
        { month_date: "2024-06-01", monthly_revenue: 103000.00, ytd_revenue: 534000.00, target_pct: 53.40 },
        { month_date: "2024-07-01", monthly_revenue: 78000.00, ytd_revenue: 612000.00, target_pct: 61.20 },
        { month_date: "2024-08-01", monthly_revenue: 85000.00, ytd_revenue: 697000.00, target_pct: 69.70 },
        { month_date: "2024-09-01", monthly_revenue: 110000.00, ytd_revenue: 807000.00, target_pct: 80.70 },
        { month_date: "2024-10-01", monthly_revenue: 98000.00, ytd_revenue: 905000.00, target_pct: 90.50 },
      ],
      orderMatters: true,
    },
    {
      name: "first-month-only",
      description: "Single month of data",
      descriptionFr: "Un seul mois de données",
      setupSql: `DELETE FROM monthly_revenue WHERE month_date > '2024-01-01';`,
      expectedColumns: ["month_date", "monthly_revenue", "ytd_revenue", "target_pct"],
      expectedRows: [
        { month_date: "2024-01-01", monthly_revenue: 75000.00, ytd_revenue: 75000.00, target_pct: 7.50 },
      ],
      orderMatters: true,
    },
  ],
};
