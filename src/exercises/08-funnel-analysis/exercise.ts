import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "08-funnel-analysis",
  title: "Funnel Analysis",
  difficulty: "hard",
  category: "analytics-patterns",
  description: `## Funnel Analysis

Given an \`events\` table tracking user actions, calculate the **conversion funnel** through 4 steps:
1. \`page_view\`
2. \`add_to_cart\`
3. \`checkout\`
4. \`purchase\`

For each step, show the number of **unique users** who reached that step and the **drop-off rate** from the previous step.

### Schema

| Column | Type |
|--------|------|
| user_id | INTEGER |
| event_name | VARCHAR |
| event_timestamp | TIMESTAMP |

### Expected output columns
\`step\`, \`step_name\`, \`users\`, \`dropoff_pct\`

- \`step\`: 1-4
- \`users\`: count of distinct users who performed this action
- \`dropoff_pct\`: percentage of users lost from previous step, rounded to 1 decimal (NULL for step 1)

Order by step ASC.`,
  hint: "Count distinct users per event. Use LAG() to get the previous step's user count and calculate dropoff as ((prev - current) / prev) * 100.",
  schema: `CREATE TABLE funnel_events (
  user_id INTEGER,
  event_name VARCHAR,
  event_timestamp TIMESTAMP
);

INSERT INTO funnel_events VALUES
  (1, 'page_view', '2024-01-01 10:00:00'),
  (2, 'page_view', '2024-01-01 10:05:00'),
  (3, 'page_view', '2024-01-01 10:10:00'),
  (4, 'page_view', '2024-01-01 10:15:00'),
  (5, 'page_view', '2024-01-01 10:20:00'),
  (1, 'add_to_cart', '2024-01-01 10:30:00'),
  (2, 'add_to_cart', '2024-01-01 10:35:00'),
  (3, 'add_to_cart', '2024-01-01 10:40:00'),
  (4, 'add_to_cart', '2024-01-01 10:45:00'),
  (1, 'checkout', '2024-01-01 11:00:00'),
  (2, 'checkout', '2024-01-01 11:05:00'),
  (3, 'checkout', '2024-01-01 11:10:00'),
  (1, 'purchase', '2024-01-01 11:30:00'),
  (2, 'purchase', '2024-01-01 11:35:00');`,
  solutionQuery: `WITH step_mapping AS (
  SELECT * FROM (VALUES
    ('page_view', 1, 'Page View'),
    ('add_to_cart', 2, 'Add to Cart'),
    ('checkout', 3, 'Checkout'),
    ('purchase', 4, 'Purchase')
  ) AS t(event_name, step, step_name)
),
step_users AS (
  SELECT
    sm.step,
    sm.step_name,
    COUNT(DISTINCT fe.user_id) as users
  FROM step_mapping sm
  LEFT JOIN funnel_events fe ON sm.event_name = fe.event_name
  GROUP BY sm.step, sm.step_name
)
SELECT
  step,
  step_name,
  users,
  ROUND(
    ((LAG(users) OVER (ORDER BY step) - users) * 100.0
    / LAG(users) OVER (ORDER BY step)),
    1
  ) as dropoff_pct
FROM step_users
ORDER BY step;`,
  solutionExplanation: `## Explanation

### Step Mapping
A VALUES table maps event names to step numbers and labels.

### Counting Users per Step
\`COUNT(DISTINCT user_id)\` per step gives the number of unique users.

### Drop-off Calculation
\`LAG(users) OVER (ORDER BY step)\` gets the previous step's count.
Drop-off = \`(previous - current) / previous * 100\`

### Key Insight
Not every user needs to go through steps sequentially in the data — we just count who performed each action. In a real scenario, you might enforce ordering with timestamps.`,
  testCases: [
    {
      name: "default",
      description: "4-step conversion funnel",
      expectedColumns: ["step", "step_name", "users", "dropoff_pct"],
      expectedRows: [
        { step: 1, step_name: "Page View", users: 5, dropoff_pct: null },
        { step: 2, step_name: "Add to Cart", users: 4, dropoff_pct: 20.0 },
        { step: 3, step_name: "Checkout", users: 3, dropoff_pct: 25.0 },
        { step: 4, step_name: "Purchase", users: 2, dropoff_pct: 33.3 },
      ],
      orderMatters: true,
    },
    {
      name: "full-conversion",
      description: "All users convert through all steps",
      setupSql: `DELETE FROM funnel_events;
INSERT INTO funnel_events VALUES
  (1, 'page_view', '2024-01-01 10:00:00'),
  (2, 'page_view', '2024-01-01 10:05:00'),
  (1, 'add_to_cart', '2024-01-01 10:30:00'),
  (2, 'add_to_cart', '2024-01-01 10:35:00'),
  (1, 'checkout', '2024-01-01 11:00:00'),
  (2, 'checkout', '2024-01-01 11:05:00'),
  (1, 'purchase', '2024-01-01 11:30:00'),
  (2, 'purchase', '2024-01-01 11:35:00');`,
      expectedColumns: ["step", "step_name", "users", "dropoff_pct"],
      expectedRows: [
        { step: 1, step_name: "Page View", users: 2, dropoff_pct: null },
        { step: 2, step_name: "Add to Cart", users: 2, dropoff_pct: 0.0 },
        { step: 3, step_name: "Checkout", users: 2, dropoff_pct: 0.0 },
        { step: 4, step_name: "Purchase", users: 2, dropoff_pct: 0.0 },
      ],
      orderMatters: true,
    },
  ],
};
