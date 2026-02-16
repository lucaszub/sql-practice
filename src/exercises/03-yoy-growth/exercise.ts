import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "03-yoy-growth",
  title: "Year-over-Year Growth",
  titleFr: "Croissance en glissement annuel",
  difficulty: "hard",
  category: "window-functions",
  description: `## Year-over-Year Growth

Given a \`monthly_revenue\` table, calculate the **year-over-year growth percentage** for each month.

### Schema

| Column | Type |
|--------|------|
| year | INTEGER |
| month | INTEGER |
| revenue | DECIMAL(12,2) |

### Expected output columns
\`year\`, \`month\`, \`revenue\`, \`prev_year_revenue\`, \`yoy_growth_pct\`

- \`prev_year_revenue\`: revenue for the same month in the previous year (NULL if no previous year)
- \`yoy_growth_pct\`: \`((revenue - prev_year_revenue) / prev_year_revenue) * 100\`, rounded to 2 decimals (NULL if no previous year)

Order by year ASC, month ASC.`,
  descriptionFr: `## Croissance en glissement annuel

A partir d'une table \`monthly_revenue\`, calculez le **pourcentage de croissance en glissement annuel** pour chaque mois.

### Schema

| Column | Type |
|--------|------|
| year | INTEGER |
| month | INTEGER |
| revenue | DECIMAL(12,2) |

### Colonnes attendues en sortie
\`year\`, \`month\`, \`revenue\`, \`prev_year_revenue\`, \`yoy_growth_pct\`

- \`prev_year_revenue\` : le chiffre d'affaires du meme mois de l'annee precedente (NULL s'il n'y a pas d'annee precedente)
- \`yoy_growth_pct\` : \`((revenue - prev_year_revenue) / prev_year_revenue) * 100\`, arrondi a 2 decimales (NULL s'il n'y a pas d'annee precedente)

Triez par year ASC, month ASC.`,
  hint: "Use LAG(revenue) OVER (PARTITION BY month ORDER BY year) to get the previous year's revenue for the same month.",
  hintFr: "Utilisez LAG(revenue) OVER (PARTITION BY month ORDER BY year) pour obtenir le chiffre d'affaires du meme mois de l'annee precedente.",
  schema: `CREATE TABLE monthly_revenue (
  year INTEGER,
  month INTEGER,
  revenue DECIMAL(12,2)
);

INSERT INTO monthly_revenue VALUES
  (2022, 1, 10000.00),
  (2022, 2, 12000.00),
  (2022, 3, 11000.00),
  (2022, 6, 15000.00),
  (2023, 1, 12000.00),
  (2023, 2, 11500.00),
  (2023, 3, 13200.00),
  (2023, 6, 16500.00),
  (2024, 1, 14400.00),
  (2024, 2, 13000.00),
  (2024, 3, 15000.00),
  (2024, 6, 18000.00);`,
  solutionQuery: `SELECT
  year,
  month,
  revenue,
  LAG(revenue) OVER (PARTITION BY month ORDER BY year) as prev_year_revenue,
  ROUND(
    ((revenue - LAG(revenue) OVER (PARTITION BY month ORDER BY year))
    / LAG(revenue) OVER (PARTITION BY month ORDER BY year)) * 100,
    2
  ) as yoy_growth_pct
FROM monthly_revenue
ORDER BY year, month;`,
  solutionExplanation: `## Explanation

### LAG() Window Function
\`LAG(revenue) OVER (PARTITION BY month ORDER BY year)\`
- Looks at the previous row within the same month partition
- Since we partition by month and order by year, it gives us the same month's revenue from the previous year

### YoY Growth Formula
\`((current - previous) / previous) * 100\`
- A positive result means growth
- A negative result means decline
- NULL when there's no previous year data

### Key Concepts
- \`PARTITION BY month\` groups data by month so we compare Jan-to-Jan, Feb-to-Feb, etc.
- \`ORDER BY year\` ensures LAG looks at the previous year
- Multiple references to the same window function are optimized by the query planner`,
  solutionExplanationFr: `## Explication

### Fonction de fenetre LAG()
\`LAG(revenue) OVER (PARTITION BY month ORDER BY year)\`
- Consulte la ligne precedente au sein de la meme partition par mois
- Comme nous partitionnons par mois et ordonnons par annee, cela renvoie le chiffre d'affaires du meme mois de l'annee precedente

### Formule de croissance annuelle
\`((actuel - precedent) / precedent) * 100\`
- Un resultat positif signifie une croissance
- Un resultat negatif signifie un recul
- NULL lorsqu'il n'y a pas de donnees pour l'annee precedente

### Concepts cles
- \`PARTITION BY month\` regroupe les donnees par mois pour comparer janvier a janvier, fevrier a fevrier, etc.
- \`ORDER BY year\` garantit que LAG consulte l'annee precedente
- Les references multiples a la meme fonction de fenetre sont optimisees par le planificateur de requetes`,
  testCases: [
    {
      name: "default",
      description: "YoY growth across 3 years",
      descriptionFr: "Croissance annuelle sur 3 ans",
      expectedColumns: ["year", "month", "revenue", "prev_year_revenue", "yoy_growth_pct"],
      expectedRows: [
        { year: 2022, month: 1, revenue: 10000.00, prev_year_revenue: null, yoy_growth_pct: null },
        { year: 2022, month: 2, revenue: 12000.00, prev_year_revenue: null, yoy_growth_pct: null },
        { year: 2022, month: 3, revenue: 11000.00, prev_year_revenue: null, yoy_growth_pct: null },
        { year: 2022, month: 6, revenue: 15000.00, prev_year_revenue: null, yoy_growth_pct: null },
        { year: 2023, month: 1, revenue: 12000.00, prev_year_revenue: 10000.00, yoy_growth_pct: 20.00 },
        { year: 2023, month: 2, revenue: 11500.00, prev_year_revenue: 12000.00, yoy_growth_pct: -4.17 },
        { year: 2023, month: 3, revenue: 13200.00, prev_year_revenue: 11000.00, yoy_growth_pct: 20.00 },
        { year: 2023, month: 6, revenue: 16500.00, prev_year_revenue: 15000.00, yoy_growth_pct: 10.00 },
        { year: 2024, month: 1, revenue: 14400.00, prev_year_revenue: 12000.00, yoy_growth_pct: 20.00 },
        { year: 2024, month: 2, revenue: 13000.00, prev_year_revenue: 11500.00, yoy_growth_pct: 13.04 },
        { year: 2024, month: 3, revenue: 15000.00, prev_year_revenue: 13200.00, yoy_growth_pct: 13.64 },
        { year: 2024, month: 6, revenue: 18000.00, prev_year_revenue: 16500.00, yoy_growth_pct: 9.09 },
      ],
      orderMatters: true,
    },
    {
      name: "handles-null",
      description: "First year has NULL for prev_year and growth",
      setupSql: `DELETE FROM monthly_revenue WHERE year > 2022;`,
      expectedColumns: ["year", "month", "revenue", "prev_year_revenue", "yoy_growth_pct"],
      expectedRows: [
        { year: 2022, month: 1, revenue: 10000.00, prev_year_revenue: null, yoy_growth_pct: null },
        { year: 2022, month: 2, revenue: 12000.00, prev_year_revenue: null, yoy_growth_pct: null },
        { year: 2022, month: 3, revenue: 11000.00, prev_year_revenue: null, yoy_growth_pct: null },
        { year: 2022, month: 6, revenue: 15000.00, prev_year_revenue: null, yoy_growth_pct: null },
      ],
      orderMatters: false,
    },
  ],
};
