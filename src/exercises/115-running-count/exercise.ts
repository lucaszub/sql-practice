import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "115-running-count",
  title: "Cumulative User Signups",
  titleFr: "Inscriptions cumulées d'utilisateurs",
  difficulty: "hard",
  category: "running-totals",
  description: `## Cumulative User Signups

The growth team wants a daily report showing the **cumulative number of user signups** over time. For each day, display the number of new signups that day and the running total of all signups up to and including that day.

### Schema

| Column | Type |
|--------|------|
| signup_date | DATE |
| new_signups | INTEGER |

### Expected output columns
\`signup_date\`, \`new_signups\`, \`cumulative_signups\`

- \`cumulative_signups\`: Running total of new_signups from the first date up to the current date
- Order by signup_date ASC.`,
  descriptionFr: `## Inscriptions cumulées d'utilisateurs

L'équipe croissance souhaite un rapport quotidien montrant le **nombre cumulé d'inscriptions** au fil du temps. Pour chaque jour, affichez le nombre de nouvelles inscriptions et le total cumulé de toutes les inscriptions jusqu'à ce jour inclus.

### Schema

| Column | Type |
|--------|------|
| signup_date | DATE |
| new_signups | INTEGER |

### Colonnes attendues en sortie
\`signup_date\`, \`new_signups\`, \`cumulative_signups\`

- \`cumulative_signups\` : Total cumulé de new_signups depuis la première date jusqu'à la date courante
- Triez par signup_date ASC.`,
  hint: "Use SUM(new_signups) OVER (ORDER BY signup_date ROWS UNBOUNDED PRECEDING) to compute a running total.",
  hintFr: "Utilisez SUM(new_signups) OVER (ORDER BY signup_date ROWS UNBOUNDED PRECEDING) pour calculer un total cumulé.",
  schema: `CREATE TABLE daily_signups (
  signup_date DATE,
  new_signups INTEGER
);

INSERT INTO daily_signups VALUES
  ('2024-01-01', 45),
  ('2024-01-02', 52),
  ('2024-01-03', 38),
  ('2024-01-04', 67),
  ('2024-01-05', 41),
  ('2024-01-06', 29),
  ('2024-01-07', 55),
  ('2024-01-08', 73),
  ('2024-01-09', 48),
  ('2024-01-10', 61);`,
  solutionQuery: `SELECT
  signup_date,
  new_signups,
  SUM(new_signups) OVER (ORDER BY signup_date ROWS UNBOUNDED PRECEDING) AS cumulative_signups
FROM daily_signups
ORDER BY signup_date;`,
  solutionExplanation: `## Explanation

### Pattern: Running count/total with SUM() OVER

This is the foundational **running total** pattern — one of the most common window function uses.

### Step-by-step
1. \`SUM(new_signups)\` — aggregate function applied as a window function
2. \`ORDER BY signup_date\` — defines the order for accumulation
3. \`ROWS UNBOUNDED PRECEDING\` — accumulate from the first row to the current row

### Why specify ROWS UNBOUNDED PRECEDING?
The default frame with ORDER BY is \`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\`. While functionally similar here, \`ROWS\` is:
- More explicit about intent
- More predictable with duplicate ORDER BY values
- Industry best practice to always specify the frame

### Other running aggregates
The same pattern works with any aggregate:
- \`COUNT(*) OVER (...)\` — running count of records
- \`AVG(amount) OVER (...)\` — running average
- \`MAX(amount) OVER (...)\` — running maximum

### When to use
- User growth tracking (cumulative signups, downloads)
- Financial cumulative reports (running balance, cumulative revenue)
- Progress monitoring (cumulative story points completed)`,
  solutionExplanationFr: `## Explication

### Pattern : Comptage/total cumulé avec SUM() OVER

C'est le pattern fondamental de **total cumulé** — l'un des usages les plus courants des fonctions de fenêtre.

### Étape par étape
1. \`SUM(new_signups)\` — fonction d'agrégation appliquée comme fonction de fenêtre
2. \`ORDER BY signup_date\` — définit l'ordre d'accumulation
3. \`ROWS UNBOUNDED PRECEDING\` — accumule depuis la première ligne jusqu'à la ligne courante

### Pourquoi spécifier ROWS UNBOUNDED PRECEDING ?
Le cadre par défaut avec ORDER BY est \`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\`. Bien que fonctionnellement similaire ici, \`ROWS\` est plus explicite et prévisible.

### Quand l'utiliser
- Suivi de la croissance utilisateurs
- Rapports financiers cumulés
- Suivi de progression`,
  testCases: [
    {
      name: "default",
      description: "Cumulative signups over 10 days",
      descriptionFr: "Inscriptions cumulées sur 10 jours",
      expectedColumns: ["signup_date", "new_signups", "cumulative_signups"],
      expectedRows: [
        { signup_date: "2024-01-01", new_signups: 45, cumulative_signups: 45 },
        { signup_date: "2024-01-02", new_signups: 52, cumulative_signups: 97 },
        { signup_date: "2024-01-03", new_signups: 38, cumulative_signups: 135 },
        { signup_date: "2024-01-04", new_signups: 67, cumulative_signups: 202 },
        { signup_date: "2024-01-05", new_signups: 41, cumulative_signups: 243 },
        { signup_date: "2024-01-06", new_signups: 29, cumulative_signups: 272 },
        { signup_date: "2024-01-07", new_signups: 55, cumulative_signups: 327 },
        { signup_date: "2024-01-08", new_signups: 73, cumulative_signups: 400 },
        { signup_date: "2024-01-09", new_signups: 48, cumulative_signups: 448 },
        { signup_date: "2024-01-10", new_signups: 61, cumulative_signups: 509 },
      ],
      orderMatters: true,
    },
    {
      name: "single-day",
      description: "Single day: cumulative equals daily signups",
      descriptionFr: "Un seul jour : le cumulé égale les inscriptions du jour",
      setupSql: `DELETE FROM daily_signups WHERE signup_date > '2024-01-01';`,
      expectedColumns: ["signup_date", "new_signups", "cumulative_signups"],
      expectedRows: [
        { signup_date: "2024-01-01", new_signups: 45, cumulative_signups: 45 },
      ],
      orderMatters: true,
    },
  ],
};
