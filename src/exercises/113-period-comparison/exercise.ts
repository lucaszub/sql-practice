import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "113-period-comparison",
  title: "Same Month Last Year Comparison",
  titleFr: "Comparaison au même mois de l'année précédente",
  difficulty: "hard",
  category: "analytics-patterns",
  description: `## Same Month Last Year Comparison

The CFO wants a report comparing each month's revenue to the **same month in the previous year** to assess seasonal performance. For each month, show:
- Current revenue
- Same-month-last-year revenue
- The absolute difference
- The growth percentage

### Schema

| Column | Type |
|--------|------|
| report_date | DATE |
| revenue | DECIMAL(12,2) |

### Expected output columns
\`report_date\`, \`revenue\`, \`same_month_last_year\`, \`revenue_diff\`, \`growth_pct\`

- \`same_month_last_year\`: Revenue from the same calendar month one year earlier (NULL if unavailable)
- \`revenue_diff\`: \`revenue - same_month_last_year\` (NULL if no prior year)
- \`growth_pct\`: \`ROUND(((revenue - same_month_last_year) / same_month_last_year) * 100, 2)\` (NULL if no prior year)
- Order by report_date ASC.`,
  descriptionFr: `## Comparaison au même mois de l'année précédente

Le directeur financier souhaite un rapport comparant le chiffre d'affaires de chaque mois au **même mois de l'année précédente** pour évaluer la performance saisonnière. Pour chaque mois, affichez :
- Le chiffre d'affaires actuel
- Le chiffre d'affaires du même mois l'année précédente
- La différence absolue
- Le pourcentage de croissance

### Schema

| Column | Type |
|--------|------|
| report_date | DATE |
| revenue | DECIMAL(12,2) |

### Colonnes attendues en sortie
\`report_date\`, \`revenue\`, \`same_month_last_year\`, \`revenue_diff\`, \`growth_pct\`

- Triez par report_date ASC.`,
  hint: "Use LAG(revenue) OVER (PARTITION BY EXTRACT(MONTH FROM report_date) ORDER BY report_date) to compare with the same calendar month from the previous year.",
  hintFr: "Utilisez LAG(revenue) OVER (PARTITION BY EXTRACT(MONTH FROM report_date) ORDER BY report_date) pour comparer avec le même mois calendaire de l'année précédente.",
  schema: `CREATE TABLE monthly_revenue (
  report_date DATE,
  revenue DECIMAL(12,2)
);

INSERT INTO monthly_revenue VALUES
  ('2023-01-01', 85000.00),
  ('2023-02-01', 92000.00),
  ('2023-03-01', 78000.00),
  ('2023-04-01', 105000.00),
  ('2023-07-01', 120000.00),
  ('2023-10-01', 95000.00),
  ('2024-01-01', 98000.00),
  ('2024-02-01', 88000.00),
  ('2024-03-01', 91000.00),
  ('2024-04-01', 115000.00),
  ('2024-07-01', 135000.00),
  ('2024-10-01', 102000.00);`,
  solutionQuery: `SELECT
  report_date,
  revenue,
  LAG(revenue) OVER (PARTITION BY EXTRACT(MONTH FROM report_date) ORDER BY report_date) AS same_month_last_year,
  revenue - LAG(revenue) OVER (PARTITION BY EXTRACT(MONTH FROM report_date) ORDER BY report_date) AS revenue_diff,
  ROUND(
    ((revenue - LAG(revenue) OVER (PARTITION BY EXTRACT(MONTH FROM report_date) ORDER BY report_date))
    / LAG(revenue) OVER (PARTITION BY EXTRACT(MONTH FROM report_date) ORDER BY report_date)) * 100,
    2
  ) AS growth_pct
FROM monthly_revenue
ORDER BY report_date;`,
  solutionExplanation: `## Explanation

### Pattern: Same-period comparison with LAG() + PARTITION BY month

This extends the basic LAG() pattern by partitioning by calendar month to compare equivalent periods across years.

### Step-by-step
1. \`PARTITION BY EXTRACT(MONTH FROM report_date)\` — groups all Januaries together, all Februaries together, etc.
2. \`ORDER BY report_date\` — within each month group, rows are sorted by year
3. \`LAG(revenue)\` — accesses the same month's revenue from the previous year
4. Growth formula: \`((current - previous) / previous) * 100\`

### Why partition by month?
Simple LAG() without partitioning would compare to the previous sequential month (March to February). By partitioning by month number, we ensure:
- January 2024 is compared to January 2023
- July 2024 is compared to July 2023
- This eliminates seasonal noise from the comparison

### When to use same-period comparison
- **Seasonal businesses**: Retail (holiday season), travel (summer), tax (April)
- **Quarterly reporting**: Compare Q1 2024 to Q1 2023
- **Any metric with seasonality**: Website traffic, hiring, energy consumption
- Prefer over MoM when seasonal patterns are strong`,
  solutionExplanationFr: `## Explication

### Pattern : Comparaison à la même période avec LAG() + PARTITION BY mois

Ce pattern étend le pattern LAG() de base en partitionnant par mois calendaire pour comparer des périodes équivalentes entre années.

### Étape par étape
1. \`PARTITION BY EXTRACT(MONTH FROM report_date)\` — regroupe tous les janviers ensemble, tous les févrirs ensemble, etc.
2. \`ORDER BY report_date\` — au sein de chaque groupe mensuel, les lignes sont triées par année
3. \`LAG(revenue)\` — accède au chiffre d'affaires du même mois de l'année précédente

### Pourquoi partitionner par mois ?
Un simple LAG() sans partition comparerait au mois séquentiel précédent (mars à février). En partitionnant par numéro de mois, on assure que janvier 2024 est comparé à janvier 2023.

### Quand utiliser la comparaison à la même période
- **Entreprises saisonnières** : Commerce de détail, voyage, fiscalité
- **Rapports trimestriels** : Comparer T1 2024 à T1 2023
- Préférer au MoM quand les patterns saisonniers sont forts`,
  testCases: [
    {
      name: "default",
      description: "Same month last year comparison for revenue",
      descriptionFr: "Comparaison au même mois de l'année précédente pour le chiffre d'affaires",
      expectedColumns: ["report_date", "revenue", "same_month_last_year", "revenue_diff", "growth_pct"],
      expectedRows: [
        { report_date: "2023-01-01", revenue: 85000.00, same_month_last_year: null, revenue_diff: null, growth_pct: null },
        { report_date: "2023-02-01", revenue: 92000.00, same_month_last_year: null, revenue_diff: null, growth_pct: null },
        { report_date: "2023-03-01", revenue: 78000.00, same_month_last_year: null, revenue_diff: null, growth_pct: null },
        { report_date: "2023-04-01", revenue: 105000.00, same_month_last_year: null, revenue_diff: null, growth_pct: null },
        { report_date: "2023-07-01", revenue: 120000.00, same_month_last_year: null, revenue_diff: null, growth_pct: null },
        { report_date: "2023-10-01", revenue: 95000.00, same_month_last_year: null, revenue_diff: null, growth_pct: null },
        { report_date: "2024-01-01", revenue: 98000.00, same_month_last_year: 85000.00, revenue_diff: 13000.00, growth_pct: 15.29 },
        { report_date: "2024-02-01", revenue: 88000.00, same_month_last_year: 92000.00, revenue_diff: -4000.00, growth_pct: -4.35 },
        { report_date: "2024-03-01", revenue: 91000.00, same_month_last_year: 78000.00, revenue_diff: 13000.00, growth_pct: 16.67 },
        { report_date: "2024-04-01", revenue: 115000.00, same_month_last_year: 105000.00, revenue_diff: 10000.00, growth_pct: 9.52 },
        { report_date: "2024-07-01", revenue: 135000.00, same_month_last_year: 120000.00, revenue_diff: 15000.00, growth_pct: 12.50 },
        { report_date: "2024-10-01", revenue: 102000.00, same_month_last_year: 95000.00, revenue_diff: 7000.00, growth_pct: 7.37 },
      ],
      orderMatters: true,
    },
    {
      name: "single-year",
      description: "Only one year of data: all comparisons are NULL",
      descriptionFr: "Une seule année de données : toutes les comparaisons sont NULL",
      setupSql: `DELETE FROM monthly_revenue WHERE report_date >= '2024-01-01';`,
      expectedColumns: ["report_date", "revenue", "same_month_last_year", "revenue_diff", "growth_pct"],
      expectedRows: [
        { report_date: "2023-01-01", revenue: 85000.00, same_month_last_year: null, revenue_diff: null, growth_pct: null },
        { report_date: "2023-02-01", revenue: 92000.00, same_month_last_year: null, revenue_diff: null, growth_pct: null },
        { report_date: "2023-03-01", revenue: 78000.00, same_month_last_year: null, revenue_diff: null, growth_pct: null },
        { report_date: "2023-04-01", revenue: 105000.00, same_month_last_year: null, revenue_diff: null, growth_pct: null },
        { report_date: "2023-07-01", revenue: 120000.00, same_month_last_year: null, revenue_diff: null, growth_pct: null },
        { report_date: "2023-10-01", revenue: 95000.00, same_month_last_year: null, revenue_diff: null, growth_pct: null },
      ],
      orderMatters: true,
    },
  ],
};
