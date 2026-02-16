import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "07-cohort-retention",
  title: "Cohort Retention Analysis",
  difficulty: "hard",
  category: "analytics-patterns",
  description: `## Cohort Retention Analysis

Given a \`user_activity\` table, calculate **monthly retention rates** by cohort.

A user's cohort is determined by their **first activity month**. For each cohort, calculate the percentage of users who were active in subsequent months.

### Schema

| Column | Type |
|--------|------|
| user_id | INTEGER |
| activity_date | DATE |

### Expected output columns
\`cohort_month\`, \`month_offset\`, \`retained_users\`, \`retention_rate\`

- \`cohort_month\`: the month of first activity (as DATE, first of month)
- \`month_offset\`: 0 for the cohort month, 1 for next month, etc.
- \`retained_users\`: count of distinct users active in that offset month
- \`retention_rate\`: \`retained_users / cohort_size * 100\`, rounded to 1 decimal

Order by cohort_month ASC, month_offset ASC.`,
  hint: "First find each user's cohort (MIN activity_date truncated to month). Then cross-join cohorts with activity months and count distinct users. Calculate retention as percentage of original cohort size.",
  schema: `CREATE TABLE user_activity (
  user_id INTEGER,
  activity_date DATE
);

INSERT INTO user_activity VALUES
  (1, '2024-01-05'), (1, '2024-01-15'), (1, '2024-02-10'), (1, '2024-03-20'),
  (2, '2024-01-08'), (2, '2024-02-12'),
  (3, '2024-01-20'), (3, '2024-03-05'),
  (4, '2024-02-01'), (4, '2024-02-15'), (4, '2024-03-10'),
  (5, '2024-02-05'),
  (6, '2024-01-10');`,
  solutionQuery: `WITH user_cohorts AS (
  SELECT
    user_id,
    DATE_TRUNC('month', MIN(activity_date)) as cohort_month
  FROM user_activity
  GROUP BY user_id
),
monthly_activity AS (
  SELECT
    user_id,
    DATE_TRUNC('month', activity_date) as activity_month
  FROM user_activity
  GROUP BY user_id, DATE_TRUNC('month', activity_date)
),
cohort_sizes AS (
  SELECT cohort_month, COUNT(*) as cohort_size
  FROM user_cohorts
  GROUP BY cohort_month
),
retention AS (
  SELECT
    uc.cohort_month,
    DATEDIFF('month', uc.cohort_month, ma.activity_month) as month_offset,
    COUNT(DISTINCT ma.user_id) as retained_users
  FROM user_cohorts uc
  JOIN monthly_activity ma ON uc.user_id = ma.user_id
  GROUP BY uc.cohort_month, DATEDIFF('month', uc.cohort_month, ma.activity_month)
)
SELECT
  r.cohort_month,
  r.month_offset,
  r.retained_users,
  ROUND(r.retained_users * 100.0 / cs.cohort_size, 1) as retention_rate
FROM retention r
JOIN cohort_sizes cs ON r.cohort_month = cs.cohort_month
ORDER BY r.cohort_month, r.month_offset;`,
  solutionExplanation: `## Explanation

### Step 1: User Cohorts
Find each user's first activity month — this is their cohort.

### Step 2: Monthly Activity
Deduplicate to get one row per user per active month.

### Step 3: Cohort Sizes
Count users per cohort for the denominator.

### Step 4: Retention
Join cohorts with activity to calculate:
- \`month_offset\`: months since the user's cohort month
- \`retained_users\`: distinct users active at that offset

### Step 5: Retention Rate
\`retained_users / cohort_size * 100\`

Month 0 always has 100% retention (users are active in their first month by definition).`,
  testCases: [
    {
      name: "default",
      description: "Retention rates for Jan and Feb cohorts",
      expectedColumns: ["cohort_month", "month_offset", "retained_users", "retention_rate"],
      expectedRows: [
        { cohort_month: "2024-01-01", month_offset: 0, retained_users: 4, retention_rate: 100.0 },
        { cohort_month: "2024-01-01", month_offset: 1, retained_users: 2, retention_rate: 50.0 },
        { cohort_month: "2024-01-01", month_offset: 2, retained_users: 2, retention_rate: 50.0 },
        { cohort_month: "2024-02-01", month_offset: 0, retained_users: 2, retention_rate: 100.0 },
        { cohort_month: "2024-02-01", month_offset: 1, retained_users: 1, retention_rate: 50.0 },
      ],
      orderMatters: true,
    },
    {
      name: "single-user-cohort",
      description: "Cohort with a single user",
      setupSql: `INSERT INTO user_activity VALUES (7, '2024-04-01');`,
      expectedColumns: ["cohort_month", "month_offset", "retained_users", "retention_rate"],
      expectedRows: [
        { cohort_month: "2024-01-01", month_offset: 0, retained_users: 4, retention_rate: 100.0 },
        { cohort_month: "2024-01-01", month_offset: 1, retained_users: 2, retention_rate: 50.0 },
        { cohort_month: "2024-01-01", month_offset: 2, retained_users: 2, retention_rate: 50.0 },
        { cohort_month: "2024-02-01", month_offset: 0, retained_users: 2, retention_rate: 100.0 },
        { cohort_month: "2024-02-01", month_offset: 1, retained_users: 1, retention_rate: 50.0 },
        { cohort_month: "2024-04-01", month_offset: 0, retained_users: 1, retention_rate: 100.0 },
      ],
      orderMatters: true,
    },
  ],
};
