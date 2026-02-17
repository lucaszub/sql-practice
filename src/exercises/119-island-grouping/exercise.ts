import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "119-island-grouping",
  title: "Group Consecutive Active Days into Ranges",
  titleFr: "Regrouper les jours actifs consécutifs en plages",
  difficulty: "hard",
  category: "gaps-islands",
  description: `## Group Consecutive Active Days into Ranges

The operations team monitors server uptime and wants to see **continuous active periods** grouped into date ranges. Given a table of dates when a service was active, group consecutive dates into ranges showing the start date, end date, and duration (in days) of each active period.

### Schema

| Column | Type |
|--------|------|
| service_name | VARCHAR |
| active_date | DATE |

### Expected output columns
\`service_name\`, \`period_start\`, \`period_end\`, \`active_days\`

- Group consecutive dates per service into a single row
- \`active_days\`: Number of consecutive days in the period
- Order by service_name ASC, period_start ASC.`,
  descriptionFr: `## Regrouper les jours actifs consécutifs en plages

L'équipe opérations surveille la disponibilité des serveurs et souhaite voir les **périodes actives continues** regroupées en plages de dates. Étant donné une table de dates où un service était actif, regroupez les dates consécutives en plages montrant la date de début, la date de fin et la durée (en jours) de chaque période active.

### Schema

| Column | Type |
|--------|------|
| service_name | VARCHAR |
| active_date | DATE |

### Colonnes attendues en sortie
\`service_name\`, \`period_start\`, \`period_end\`, \`active_days\`

- Regrouper les dates consécutives par service en une seule ligne
- \`active_days\` : Nombre de jours consécutifs dans la période
- Triez par service_name ASC, period_start ASC.`,
  hint: "Subtract ROW_NUMBER() (scaled by 1 day) from active_date. Consecutive dates will produce the same value — use this as a grouping key, then aggregate with MIN/MAX/COUNT.",
  hintFr: "Soustrayez ROW_NUMBER() (multiplié par 1 jour) de active_date. Les dates consécutives produiront la même valeur — utilisez ceci comme clé de regroupement, puis agrégez avec MIN/MAX/COUNT.",
  schema: `CREATE TABLE service_activity (
  service_name VARCHAR,
  active_date DATE
);

INSERT INTO service_activity VALUES
  ('API', '2024-01-01'),
  ('API', '2024-01-02'),
  ('API', '2024-01-03'),
  ('API', '2024-01-06'),
  ('API', '2024-01-07'),
  ('API', '2024-01-10'),
  ('API', '2024-01-11'),
  ('API', '2024-01-12'),
  ('API', '2024-01-13'),
  ('Web', '2024-01-02'),
  ('Web', '2024-01-03'),
  ('Web', '2024-01-04'),
  ('Web', '2024-01-05'),
  ('Web', '2024-01-08'),
  ('Web', '2024-01-15');`,
  solutionQuery: `WITH islands AS (
  SELECT
    service_name,
    active_date,
    active_date - INTERVAL (ROW_NUMBER() OVER (PARTITION BY service_name ORDER BY active_date) - 1) DAY AS grp
  FROM service_activity
)
SELECT
  service_name,
  MIN(active_date) AS period_start,
  MAX(active_date) AS period_end,
  COUNT(*) AS active_days
FROM islands
GROUP BY service_name, grp
ORDER BY service_name, period_start;`,
  solutionExplanation: `## Explanation

### Pattern: Island detection (grouping consecutive values)

This is the **island detection** variant of the gap-and-island pattern. Instead of finding gaps, we group consecutive dates into ranges.

### Step-by-step
1. \`ROW_NUMBER() OVER (PARTITION BY service_name ORDER BY active_date)\` — assign sequential numbers
2. \`active_date - ROW_NUMBER() * INTERVAL '1' DAY\` — the subtraction trick
3. Consecutive dates produce the same subtracted value (the "island key")
4. GROUP BY the island key to aggregate each range

### How the subtraction trick works
| active_date | ROW_NUMBER | date - rn |
|------------|------------|-----------|
| 2024-01-01 | 1 | 2023-12-31 |
| 2024-01-02 | 2 | 2023-12-31 |
| 2024-01-03 | 3 | 2023-12-31 |
| 2024-01-06 | 4 | 2024-01-02 |
| 2024-01-07 | 5 | 2024-01-02 |

Same \`date - rn\` = same island!

### When to use
- Uptime/downtime period reporting
- Subscription active period detection
- Employee attendance ranges
- Any "group consecutive" requirement`,
  solutionExplanationFr: `## Explication

### Pattern : Détection d'îlots (regroupement de valeurs consécutives)

C'est la variante **détection d'îlots** du pattern gap-and-island. Au lieu de trouver les lacunes, on regroupe les dates consécutives en plages.

### Comment fonctionne l'astuce de la soustraction
| active_date | ROW_NUMBER | date - rn |
|------------|------------|-----------|
| 2024-01-01 | 1 | 2023-12-31 |
| 2024-01-02 | 2 | 2023-12-31 |
| 2024-01-03 | 3 | 2023-12-31 |
| 2024-01-06 | 4 | 2024-01-02 |
| 2024-01-07 | 5 | 2024-01-02 |

Même \`date - rn\` = même îlot !

### Quand l'utiliser
- Rapports de périodes de disponibilité/indisponibilité
- Détection de périodes d'abonnement actif
- Plages de présence des employés`,
  testCases: [
    {
      name: "default",
      description: "Group consecutive active dates into ranges per service",
      descriptionFr: "Regrouper les dates actives consécutives en plages par service",
      expectedColumns: ["service_name", "period_start", "period_end", "active_days"],
      expectedRows: [
        { service_name: "API", period_start: "2024-01-01", period_end: "2024-01-03", active_days: 3 },
        { service_name: "API", period_start: "2024-01-06", period_end: "2024-01-07", active_days: 2 },
        { service_name: "API", period_start: "2024-01-10", period_end: "2024-01-13", active_days: 4 },
        { service_name: "Web", period_start: "2024-01-02", period_end: "2024-01-05", active_days: 4 },
        { service_name: "Web", period_start: "2024-01-08", period_end: "2024-01-08", active_days: 1 },
        { service_name: "Web", period_start: "2024-01-15", period_end: "2024-01-15", active_days: 1 },
      ],
      orderMatters: true,
    },
    {
      name: "single-day-islands",
      description: "Non-consecutive dates each form a single-day island",
      descriptionFr: "Des dates non consécutives forment chacune un îlot d'un jour",
      setupSql: `DELETE FROM service_activity; INSERT INTO service_activity VALUES ('API', '2024-01-01'), ('API', '2024-01-05'), ('API', '2024-01-10');`,
      expectedColumns: ["service_name", "period_start", "period_end", "active_days"],
      expectedRows: [
        { service_name: "API", period_start: "2024-01-01", period_end: "2024-01-01", active_days: 1 },
        { service_name: "API", period_start: "2024-01-05", period_end: "2024-01-05", active_days: 1 },
        { service_name: "API", period_start: "2024-01-10", period_end: "2024-01-10", active_days: 1 },
      ],
      orderMatters: true,
    },
  ],
};
