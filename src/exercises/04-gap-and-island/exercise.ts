import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "04-gap-and-island",
  title: "Login Streaks (Gap & Island)",
  difficulty: "hard",
  category: "window-functions",
  description: `## Login Streaks (Gap & Island Problem)

Given a \`user_logins\` table with one row per user per login day, find the **longest consecutive login streak** for each user.

### Schema

| Column | Type |
|--------|------|
| user_id | INTEGER |
| login_date | DATE |

### Expected output columns
\`user_id\`, \`streak_start\`, \`streak_end\`, \`streak_length\`

Return only the longest streak per user. If there's a tie, return any one. Order by user_id ASC.`,
  hint: "Subtract ROW_NUMBER() from login_date to get a grouping key. Consecutive dates will produce the same grouping key. Then find the longest group per user.",
  schema: `CREATE TABLE user_logins (
  user_id INTEGER,
  login_date DATE
);

INSERT INTO user_logins VALUES
  (1, '2024-01-01'), (1, '2024-01-02'), (1, '2024-01-03'),
  (1, '2024-01-05'), (1, '2024-01-06'),
  (1, '2024-01-10'),
  (2, '2024-01-01'),
  (2, '2024-01-03'), (2, '2024-01-04'), (2, '2024-01-05'), (2, '2024-01-06'),
  (3, '2024-01-01'), (3, '2024-01-02');`,
  solutionQuery: `WITH streaks AS (
  SELECT
    user_id,
    login_date,
    login_date - INTERVAL (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) - 1) DAY as grp
  FROM user_logins
),
streak_lengths AS (
  SELECT
    user_id,
    MIN(login_date) as streak_start,
    MAX(login_date) as streak_end,
    COUNT(*) as streak_length
  FROM streaks
  GROUP BY user_id, grp
),
ranked AS (
  SELECT *,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY streak_length DESC) as rn
  FROM streak_lengths
)
SELECT user_id, streak_start, streak_end, streak_length
FROM ranked
WHERE rn = 1
ORDER BY user_id;`,
  solutionExplanation: `## Explanation

### The Gap and Island Technique
1. **Create a grouping key**: Subtract \`ROW_NUMBER()\` from \`login_date\`. For consecutive dates, this produces the same value (the "island").
2. **Group by the key**: Each group of consecutive dates shares the same grouping key.
3. **Aggregate**: MIN/MAX for start/end dates, COUNT for streak length.

### Step-by-step Example (User 1)
| login_date | ROW_NUMBER | date - rn |
|-----------|------------|-----------|
| 2024-01-01 | 1 | 2024-01-00 |
| 2024-01-02 | 2 | 2024-01-00 |
| 2024-01-03 | 3 | 2024-01-00 |
| 2024-01-05 | 4 | 2024-01-01 |
| 2024-01-06 | 5 | 2024-01-01 |

Same \`date - rn\` = same streak!`,
  testCases: [
    {
      name: "default",
      description: "Longest streak per user",
      expectedColumns: ["user_id", "streak_start", "streak_end", "streak_length"],
      expectedRows: [
        { user_id: 1, streak_start: "2024-01-01", streak_end: "2024-01-03", streak_length: 3 },
        { user_id: 2, streak_start: "2024-01-03", streak_end: "2024-01-06", streak_length: 4 },
        { user_id: 3, streak_start: "2024-01-01", streak_end: "2024-01-02", streak_length: 2 },
      ],
      orderMatters: true,
    },
    {
      name: "single-login",
      description: "User with only one login has streak of 1",
      setupSql: `INSERT INTO user_logins VALUES (4, '2024-01-15');`,
      expectedColumns: ["user_id", "streak_start", "streak_end", "streak_length"],
      expectedRows: [
        { user_id: 1, streak_start: "2024-01-01", streak_end: "2024-01-03", streak_length: 3 },
        { user_id: 2, streak_start: "2024-01-03", streak_end: "2024-01-06", streak_length: 4 },
        { user_id: 3, streak_start: "2024-01-01", streak_end: "2024-01-02", streak_length: 2 },
        { user_id: 4, streak_start: "2024-01-15", streak_end: "2024-01-15", streak_length: 1 },
      ],
      orderMatters: true,
    },
  ],
};
