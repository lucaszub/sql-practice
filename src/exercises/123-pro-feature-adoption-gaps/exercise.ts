import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "123-pro-feature-adoption-gaps",
  title: "Identify Unused Pro Features per Subscriber",
  difficulty: "medium",
  category: "multi-table-joins",
  description: `## Identify Unused Pro Features per Subscriber

The product team at a SaaS company wants to boost feature adoption. They have a list of Pro features that every paying subscriber should ideally try. To target in-app nudges, they need to know: **which Pro features has each subscriber never used?**

Free-tier users don't have a subscription record and must be excluded from the analysis.

Write a query that returns every (subscriber, feature) pair where the subscriber has never used that feature.

### Schema

**users**
| Column | Type |
|--------|------|
| user_id | INTEGER |
| username | VARCHAR |

**features**
| Column | Type |
|--------|------|
| feature_id | INTEGER |
| feature_name | VARCHAR |

**subscriptions**
| Column | Type |
|--------|------|
| user_id | INTEGER |
| plan | VARCHAR |

**feature_usage**
| Column | Type |
|--------|------|
| user_id | INTEGER |
| feature_id | INTEGER |
| used_at | DATE |

### Expected output columns
\`username\`, \`feature_name\`

Order by \`username\` ASC, then \`feature_name\` ASC.`,
  hint: "CROSS JOIN generates all user×feature combinations. INNER JOIN subscriptions restricts to paying users only. LEFT JOIN feature_usage and keep rows where usage is NULL.",
  schema: `CREATE TABLE users (
  user_id INTEGER PRIMARY KEY,
  username VARCHAR
);

CREATE TABLE features (
  feature_id INTEGER PRIMARY KEY,
  feature_name VARCHAR
);

CREATE TABLE subscriptions (
  user_id INTEGER PRIMARY KEY,
  plan VARCHAR
);

CREATE TABLE feature_usage (
  user_id INTEGER,
  feature_id INTEGER,
  used_at DATE,
  PRIMARY KEY (user_id, feature_id)
);

INSERT INTO users VALUES
  (1, 'alice'),
  (2, 'bob'),
  (3, 'carol'),
  (4, 'dave');

INSERT INTO features VALUES
  (1, 'Advanced Analytics'),
  (2, 'API Access'),
  (3, 'Data Export');

INSERT INTO subscriptions VALUES
  (1, 'pro'),
  (2, 'pro');

INSERT INTO feature_usage VALUES
  (1, 1, '2024-03-01'),
  (1, 3, '2024-03-05'),
  (2, 2, '2024-03-10');`,
  solutionQuery: `SELECT
  u.username,
  f.feature_name
FROM users u
CROSS JOIN features f
INNER JOIN subscriptions s ON u.user_id = s.user_id
LEFT JOIN feature_usage fu
  ON u.user_id = fu.user_id
  AND f.feature_id = fu.feature_id
WHERE fu.user_id IS NULL
ORDER BY u.username, f.feature_name;`,
  solutionExplanation: `## Explanation

### Pattern: CROSS JOIN + INNER JOIN + LEFT JOIN for Feature Gap Detection

Each join type has a clear, distinct purpose.

### Step-by-step

1. **CROSS JOIN features**: Pairs every user with every feature — 4 users × 3 features = 12 rows.
2. **INNER JOIN subscriptions**: Filters out free-tier users (carol, dave) who have no subscription row. Reduces to 2 × 3 = 6 pairs.
3. **LEFT JOIN feature_usage**: Tries to match each pair to a real usage event. Unmatched pairs return NULL.
4. **WHERE fu.user_id IS NULL**: Keeps only pairs with no usage record — these are the adoption gaps.

### Why not just filter users upfront in a subquery?
You could, but joining with INNER JOIN keeps the intent clear: "only carry forward users who have a subscription." It reads as a single, declarative pipeline rather than a pre-filtered CTE.

### When to use
Whenever you need to find items from a cross-product that are absent from a third table, but only for a meaningful subset of one of the two dimensions.`,
  testCases: [
    {
      name: "default",
      description: "Returns 3 unused feature pairs for pro subscribers",
      expectedColumns: ["username", "feature_name"],
      expectedRows: [
        { username: "alice", feature_name: "API Access" },
        { username: "bob", feature_name: "Advanced Analytics" },
        { username: "bob", feature_name: "Data Export" },
      ],
      orderMatters: true,
    },
    {
      name: "full-adoption",
      description: "After all features are used, no gaps remain",
      setupSql: `INSERT INTO feature_usage VALUES (1, 2, '2024-04-01'), (2, 1, '2024-04-02'), (2, 3, '2024-04-03');`,
      expectedColumns: ["username", "feature_name"],
      expectedRows: [],
      orderMatters: false,
    },
  ],
};
