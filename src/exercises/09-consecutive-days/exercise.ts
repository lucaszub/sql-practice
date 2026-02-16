import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "09-consecutive-days",
  title: "Consecutive Active Days",
  difficulty: "medium",
  category: "analytics-patterns",
  description: `## Consecutive Active Days

Given a \`user_activity\` table, find all users who had **3 or more consecutive days** of activity. For each qualifying user, return the **total number of distinct active days**.

### Schema

| Column | Type |
|--------|------|
| user_id | INTEGER |
| activity_date | DATE |

### Expected output columns
\`user_id\`, \`total_active_days\`

Only include users who have at least one streak of 3+ consecutive days. Order by user_id ASC.`,
  hint: "Use the gap-and-island technique (date - ROW_NUMBER) to find consecutive groups. Filter groups with COUNT >= 3. Then count total distinct active days for qualifying users.",
  schema: `CREATE TABLE user_activity (
  user_id INTEGER,
  activity_date DATE
);

INSERT INTO user_activity VALUES
  (1, '2024-01-01'), (1, '2024-01-02'), (1, '2024-01-03'), (1, '2024-01-04'),
  (1, '2024-01-10'), (1, '2024-01-11'),
  (2, '2024-01-01'), (2, '2024-01-03'),
  (3, '2024-01-05'), (3, '2024-01-06'), (3, '2024-01-07'),
  (3, '2024-01-10');`,
  solutionQuery: `WITH streaks AS (
  SELECT
    user_id,
    activity_date,
    activity_date - INTERVAL (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY activity_date) - 1) DAY as grp
  FROM user_activity
),
streak_lengths AS (
  SELECT
    user_id,
    grp,
    COUNT(*) as streak_len
  FROM streaks
  GROUP BY user_id, grp
),
qualifying_users AS (
  SELECT DISTINCT user_id
  FROM streak_lengths
  WHERE streak_len >= 3
)
SELECT
  qu.user_id,
  COUNT(DISTINCT ua.activity_date) as total_active_days
FROM qualifying_users qu
JOIN user_activity ua ON qu.user_id = ua.user_id
GROUP BY qu.user_id
ORDER BY qu.user_id;`,
  solutionExplanation: `## Explanation

### Step 1: Gap-and-Island Technique
Subtract \`ROW_NUMBER()\` from \`activity_date\` to create a grouping key. Consecutive dates produce the same key.

### Step 2: Find Streaks >= 3
Group by the key and filter where \`COUNT(*) >= 3\`.

### Step 3: Get Qualifying Users
\`DISTINCT user_id\` from step 2 gives users with at least one 3+ day streak.

### Step 4: Count Total Active Days
Join back with the original table to count all distinct active days (not just the streak days).`,
  testCases: [
    {
      name: "default",
      description: "Users with 3+ consecutive day streaks",
      expectedColumns: ["user_id", "total_active_days"],
      expectedRows: [
        { user_id: 1, total_active_days: 6 },
        { user_id: 3, total_active_days: 4 },
      ],
      orderMatters: true,
    },
    {
      name: "no-qualifying-users",
      description: "No users qualify when no streaks >= 3",
      setupSql: `DELETE FROM user_activity;
INSERT INTO user_activity VALUES
  (1, '2024-01-01'), (1, '2024-01-03'),
  (2, '2024-01-01'), (2, '2024-01-02');`,
      expectedColumns: ["user_id", "total_active_days"],
      expectedRows: [],
      orderMatters: false,
    },
  ],
};
