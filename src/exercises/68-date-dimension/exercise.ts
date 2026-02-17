import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "68-date-dimension",
  title: "Date Dimension with Fiscal Periods",
  titleFr: "Dimension date avec periodes fiscales",
  difficulty: "medium",
  category: "star-schema",
  description: `## Date Dimension with Fiscal Periods

The analytics engineering team needs to populate a \`dim_date\` table for a company that runs on a **fiscal year starting April 1st** (common in UK and many enterprises). For each calendar date, the dimension must include derived attributes: fiscal year, fiscal quarter, calendar month name, day of week, and a weekend flag.

### Schema

**dim_date** (pre-created, empty)
| Column | Type |
|--------|------|
| date_id | DATE |
| calendar_year | INTEGER |
| calendar_month | INTEGER |
| month_name | VARCHAR |
| calendar_quarter | INTEGER |
| fiscal_year | INTEGER |
| fiscal_quarter | INTEGER |
| day_of_week | INTEGER |
| day_name | VARCHAR |
| is_weekend | BOOLEAN |

### Task

Use \`generate_series\` to produce one row per day from **2024-01-01 to 2024-03-31** (Q1 of calendar year 2024, which spans fiscal Q4 2023-24).

Fiscal year logic:
- If calendar month >= 4, fiscal_year = calendar_year
- If calendar month < 4, fiscal_year = calendar_year - 1

Fiscal quarter logic (April = start of FQ1):
- Months 4-6 → FQ1, 7-9 → FQ2, 10-12 → FQ3, 1-3 → FQ4

Use DuckDB's \`dayofweek()\` (0=Sunday, 1=Monday ... 6=Saturday) for day_of_week. Use \`strftime()\` for month_name and day_name.

### Expected output columns
\`date_id\`, \`calendar_year\`, \`calendar_month\`, \`month_name\`, \`calendar_quarter\`, \`fiscal_year\`, \`fiscal_quarter\`, \`day_of_week\`, \`day_name\`, \`is_weekend\`

Order by \`date_id\` ASC. Only return rows where \`date_id\` IN ('2024-01-01', '2024-02-15', '2024-03-31') for verification.`,
  descriptionFr: `## Dimension date avec periodes fiscales

L'equipe d'ingenierie analytique doit alimenter une table \`dim_date\` pour une entreprise dont l'**annee fiscale commence le 1er avril** (courant au Royaume-Uni et dans de nombreuses entreprises). Pour chaque date calendaire, la dimension doit inclure des attributs derives : annee fiscale, trimestre fiscal, nom du mois calendaire, jour de la semaine et indicateur week-end.

### Schema

**dim_date** (pre-creee, vide)
| Colonne | Type |
|---------|------|
| date_id | DATE |
| calendar_year | INTEGER |
| calendar_month | INTEGER |
| month_name | VARCHAR |
| calendar_quarter | INTEGER |
| fiscal_year | INTEGER |
| fiscal_quarter | INTEGER |
| day_of_week | INTEGER |
| day_name | VARCHAR |
| is_weekend | BOOLEAN |

### Tache

Utilisez \`generate_series\` pour produire une ligne par jour du **2024-01-01 au 2024-03-31** (T1 de l'annee civile 2024, qui correspond au T4 fiscal 2023-24).

Logique annee fiscale :
- Si le mois calendaire >= 4, fiscal_year = calendar_year
- Si le mois calendaire < 4, fiscal_year = calendar_year - 1

Logique trimestre fiscal (avril = debut TF1) :
- Mois 4-6 → TF1, 7-9 → TF2, 10-12 → TF3, 1-3 → TF4

Utilisez \`dayofweek()\` de DuckDB (0=Dimanche, 1=Lundi ... 6=Samedi) pour day_of_week. Utilisez \`strftime()\` pour month_name et day_name.

### Colonnes attendues en sortie
\`date_id\`, \`calendar_year\`, \`calendar_month\`, \`month_name\`, \`calendar_quarter\`, \`fiscal_year\`, \`fiscal_quarter\`, \`day_of_week\`, \`day_name\`, \`is_weekend\`

Triez par \`date_id\` ASC. Ne retournez que les lignes ou \`date_id\` IN ('2024-01-01', '2024-02-15', '2024-03-31') pour la verification.`,
  hint: "Use generate_series(DATE '2024-01-01', DATE '2024-03-31', INTERVAL '1 day') AS g(date_id). Extract month with MONTH(date_id), year with YEAR(date_id). For fiscal_year: use CASE WHEN MONTH(date_id) >= 4 THEN YEAR ... For fiscal_quarter: use CASE with month ranges. dayofweek() returns 0 for Sunday.",
  hintFr: "Utilisez generate_series(DATE '2024-01-01', DATE '2024-03-31', INTERVAL '1 day') AS g(date_id). Extrayez le mois avec MONTH(date_id), l'annee avec YEAR(date_id). Pour fiscal_year : CASE WHEN MONTH(date_id) >= 4 THEN YEAR ... Pour fiscal_quarter : CASE avec des plages de mois. dayofweek() retourne 0 pour le dimanche.",
  schema: `CREATE TABLE dim_date (
  date_id DATE PRIMARY KEY,
  calendar_year INTEGER,
  calendar_month INTEGER,
  month_name VARCHAR,
  calendar_quarter INTEGER,
  fiscal_year INTEGER,
  fiscal_quarter INTEGER,
  day_of_week INTEGER,
  day_name VARCHAR,
  is_weekend BOOLEAN
);`,
  solutionQuery: `SELECT
  date_id::DATE AS date_id,
  YEAR(date_id)  AS calendar_year,
  MONTH(date_id) AS calendar_month,
  strftime(date_id, '%B') AS month_name,
  QUARTER(date_id) AS calendar_quarter,
  CASE
    WHEN MONTH(date_id) >= 4 THEN YEAR(date_id)
    ELSE YEAR(date_id) - 1
  END AS fiscal_year,
  CASE
    WHEN MONTH(date_id) BETWEEN 4 AND 6 THEN 1
    WHEN MONTH(date_id) BETWEEN 7 AND 9 THEN 2
    WHEN MONTH(date_id) BETWEEN 10 AND 12 THEN 3
    ELSE 4
  END AS fiscal_quarter,
  dayofweek(date_id) AS day_of_week,
  strftime(date_id, '%A') AS day_name,
  dayofweek(date_id) IN (0, 6) AS is_weekend
FROM generate_series(DATE '2024-01-01', DATE '2024-03-31', INTERVAL '1 day') AS g(date_id)
WHERE date_id IN (DATE '2024-01-01', DATE '2024-02-15', DATE '2024-03-31')
ORDER BY date_id ASC;`,
  solutionExplanation: `## Explanation

### Pattern: Date Dimension Generation with Fiscal Calendar

This is a **dimension table generation** pattern using \`generate_series\` — a DuckDB (and PostgreSQL) table-valued function that produces a sequence of values without needing a source table.

### Step-by-step
1. **generate_series(start, end, interval)**: Produces one row per day in the range. The alias \`g(date_id)\` names the column.
2. **Calendar attributes**: YEAR(), MONTH(), QUARTER() are DuckDB built-ins that extract date parts.
3. **strftime(date, format)**: Formats dates as strings. '%B' = full month name, '%A' = full day name.
4. **Fiscal year**: Months before April (< 4) belong to the previous calendar year's fiscal year.
5. **Fiscal quarter**: Maps month ranges to fiscal quarters. January-March are FQ4 because the fiscal year started the previous April.
6. **dayofweek()**: Returns 0 for Sunday, 6 for Saturday. The expression \`IN (0, 6)\` produces a BOOLEAN for is_weekend.

### DuckDB note
\`generate_series\` works with DATE and INTERVAL directly in DuckDB — no need for CAST or a numbers table. This is more elegant than recursive CTEs for date generation.

### When to use
- One-time or annual date dimension population
- Any star schema that requires date-based slicing and dicing
- Fiscal calendar mapping when the fiscal year differs from the calendar year`,
  solutionExplanationFr: `## Explication

### Patron : Generation de dimension date avec calendrier fiscal

C'est un patron de **generation de table de dimension** utilisant \`generate_series\` — une fonction table de DuckDB (et PostgreSQL) qui produit une sequence de valeurs sans necessiter de table source.

### Etape par etape
1. **generate_series(debut, fin, intervalle)** : Produit une ligne par jour dans la plage. L'alias \`g(date_id)\` nomme la colonne.
2. **Attributs calendaires** : YEAR(), MONTH(), QUARTER() sont des fonctions integrees de DuckDB pour extraire des parties de date.
3. **strftime(date, format)** : Formate les dates en chaines. '%B' = nom complet du mois, '%A' = nom complet du jour.
4. **Annee fiscale** : Les mois avant avril (< 4) appartiennent a l'annee fiscale de l'annee civile precedente.
5. **Trimestre fiscal** : Mappe des plages de mois sur des trimestres fiscaux. Janvier-mars sont TF4 car l'annee fiscale a commence en avril precedent.
6. **dayofweek()** : Retourne 0 pour le dimanche, 6 pour le samedi. L'expression \`IN (0, 6)\` produit un BOOLEAN pour is_weekend.

### Note DuckDB
\`generate_series\` fonctionne directement avec DATE et INTERVAL dans DuckDB — pas besoin de CAST ou d'une table de nombres. C'est plus elegant que les CTE recursives pour la generation de dates.

### Quand l'utiliser
- Population initiale ou annuelle de la dimension date
- Tout schema en etoile necessitant un decoupage par date
- Mapping de calendrier fiscal quand l'annee fiscale differe de l'annee civile`,
  testCases: [
    {
      name: "default",
      description: "Returns 3 spot-check dates with correct fiscal year 2023 and fiscal quarter 4 (Jan-Mar are FQ4)",
      descriptionFr: "Retourne 3 dates de controle avec l'annee fiscale 2023 et le trimestre fiscal 4 corrects (jan-mars = TF4)",
      expectedColumns: ["date_id", "calendar_year", "calendar_month", "month_name", "calendar_quarter", "fiscal_year", "fiscal_quarter", "day_of_week", "day_name", "is_weekend"],
      expectedRows: [
        { date_id: "2024-01-01", calendar_year: 2024, calendar_month: 1, month_name: "January",  calendar_quarter: 1, fiscal_year: 2023, fiscal_quarter: 4, day_of_week: 1, day_name: "Monday",   is_weekend: false },
        { date_id: "2024-02-15", calendar_year: 2024, calendar_month: 2, month_name: "February", calendar_quarter: 1, fiscal_year: 2023, fiscal_quarter: 4, day_of_week: 4, day_name: "Thursday", is_weekend: false },
        { date_id: "2024-03-31", calendar_year: 2024, calendar_month: 3, month_name: "March",    calendar_quarter: 1, fiscal_year: 2023, fiscal_quarter: 4, day_of_week: 0, day_name: "Sunday",   is_weekend: true },
      ],
      orderMatters: true,
    },
    {
      name: "weekend-detection",
      description: "Fiscal Q4 spans Jan-Mar; March 31 2024 is a Sunday (is_weekend=true)",
      descriptionFr: "TF4 couvre jan-mars ; le 31 mars 2024 est un dimanche (is_weekend=true)",
      setupSql: ``,
      expectedColumns: ["date_id", "calendar_year", "calendar_month", "month_name", "calendar_quarter", "fiscal_year", "fiscal_quarter", "day_of_week", "day_name", "is_weekend"],
      expectedRows: [
        { date_id: "2024-01-01", calendar_year: 2024, calendar_month: 1, month_name: "January",  calendar_quarter: 1, fiscal_year: 2023, fiscal_quarter: 4, day_of_week: 1, day_name: "Monday",   is_weekend: false },
        { date_id: "2024-02-15", calendar_year: 2024, calendar_month: 2, month_name: "February", calendar_quarter: 1, fiscal_year: 2023, fiscal_quarter: 4, day_of_week: 4, day_name: "Thursday", is_weekend: false },
        { date_id: "2024-03-31", calendar_year: 2024, calendar_month: 3, month_name: "March",    calendar_quarter: 1, fiscal_year: 2023, fiscal_quarter: 4, day_of_week: 0, day_name: "Sunday",   is_weekend: true },
      ],
      orderMatters: true,
    },
  ],
};
