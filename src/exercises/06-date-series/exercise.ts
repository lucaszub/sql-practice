import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "06-date-series",
  title: "Date Series Generation",
  difficulty: "medium",
  category: "ctes",
  description: `## Date Series Generation (Gap Filling)

Given an \`events\` table with sparse dates, write a query that generates a **continuous date range** from the min to max date, showing the event count for each day (0 for days with no events).

### Schema

| Column | Type |
|--------|------|
| event_date | DATE |
| event_count | INTEGER |

### Expected output columns
\`date\`, \`event_count\`

- \`date\`: every date from min to max event_date
- \`event_count\`: the count from the events table, or 0 if no events that day

Order by date ASC.`,
  hint: "Use a recursive CTE to generate dates: start with MIN(event_date), add 1 day each step until MAX(event_date). Then LEFT JOIN with the events table.",
  schema: `CREATE TABLE events (
  event_date DATE,
  event_count INTEGER
);

INSERT INTO events VALUES
  ('2024-01-01', 5),
  ('2024-01-03', 3),
  ('2024-01-05', 8),
  ('2024-01-07', 2);`,
  solutionQuery: `WITH RECURSIVE date_range AS (
  SELECT MIN(event_date) as date FROM events
  UNION ALL
  SELECT date + INTERVAL 1 DAY
  FROM date_range
  WHERE date < (SELECT MAX(event_date) FROM events)
)
SELECT
  dr.date,
  COALESCE(e.event_count, 0) as event_count
FROM date_range dr
LEFT JOIN events e ON dr.date = e.event_date
ORDER BY dr.date;`,
  solutionExplanation: `## Explanation

### Recursive Date Generation
1. **Anchor**: Start with \`MIN(event_date)\` from the events table
2. **Recursive step**: Add 1 day until we reach \`MAX(event_date)\`
3. **Result**: A complete, continuous date range

### Gap Filling with LEFT JOIN
- \`LEFT JOIN events ON date = event_date\` keeps all generated dates
- \`COALESCE(event_count, 0)\` replaces NULL (no events) with 0

### Alternative
DuckDB also supports \`generate_series()\` for date ranges, but the recursive CTE approach is more portable across SQL databases.`,
  testCases: [
    {
      name: "default",
      description: "Fill gaps in sparse event data",
      expectedColumns: ["date", "event_count"],
      expectedRows: [
        { date: "2024-01-01", event_count: 5 },
        { date: "2024-01-02", event_count: 0 },
        { date: "2024-01-03", event_count: 3 },
        { date: "2024-01-04", event_count: 0 },
        { date: "2024-01-05", event_count: 8 },
        { date: "2024-01-06", event_count: 0 },
        { date: "2024-01-07", event_count: 2 },
      ],
      orderMatters: true,
    },
    {
      name: "consecutive-dates",
      description: "Works when all dates are present (no gaps)",
      setupSql: `DELETE FROM events; INSERT INTO events VALUES ('2024-02-01', 1), ('2024-02-02', 2), ('2024-02-03', 3);`,
      expectedColumns: ["date", "event_count"],
      expectedRows: [
        { date: "2024-02-01", event_count: 1 },
        { date: "2024-02-02", event_count: 2 },
        { date: "2024-02-03", event_count: 3 },
      ],
      orderMatters: true,
    },
  ],
};
