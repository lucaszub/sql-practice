import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "122-campaign-region-gaps",
  title: "Find Uncovered Channel-Region Campaign Pairs",
  difficulty: "medium",
  category: "multi-table-joins",
  description: `## Find Uncovered Channel-Region Campaign Pairs

The marketing team runs campaigns across channels (Social Media, Email, TV) and three geographic regions. Before the Q3 budget review, the VP of Marketing wants to know: **which budgeted channel-region combinations have never had a campaign?**

TV was discontinued — it has no allocated budget and must be excluded. Only channels with a budget entry are considered active.

Write a query that returns all active channel and region pairs that have no campaign on record.

### Schema

**channels**
| Column | Type |
|--------|------|
| channel_id | INTEGER |
| channel_name | VARCHAR |

**regions**
| Column | Type |
|--------|------|
| region_id | INTEGER |
| region_name | VARCHAR |

**channel_budgets**
| Column | Type |
|--------|------|
| channel_id | INTEGER |
| max_budget | INTEGER |

**campaigns**
| Column | Type |
|--------|------|
| campaign_id | INTEGER |
| channel_id | INTEGER |
| region_id | INTEGER |
| budget_spent | INTEGER |

### Expected output columns
\`channel_name\`, \`region_name\`

Order by \`channel_name\` ASC, then \`region_name\` ASC.`,
  hint: "CROSS JOIN generates all channel×region pairs. INNER JOIN channel_budgets restricts to active channels only. Then LEFT JOIN campaigns and filter WHERE the campaign match is NULL.",
  schema: `CREATE TABLE channels (
  channel_id INTEGER PRIMARY KEY,
  channel_name VARCHAR
);

CREATE TABLE regions (
  region_id INTEGER PRIMARY KEY,
  region_name VARCHAR
);

CREATE TABLE channel_budgets (
  channel_id INTEGER PRIMARY KEY,
  max_budget INTEGER
);

CREATE TABLE campaigns (
  campaign_id INTEGER PRIMARY KEY,
  channel_id INTEGER,
  region_id INTEGER,
  budget_spent INTEGER
);

INSERT INTO channels VALUES
  (1, 'Social Media'),
  (2, 'Email'),
  (3, 'TV');

INSERT INTO regions VALUES
  (1, 'North'),
  (2, 'South'),
  (3, 'West');

INSERT INTO channel_budgets VALUES
  (1, 50000),
  (2, 20000);

INSERT INTO campaigns VALUES
  (1, 1, 1, 12000),
  (2, 1, 2, 8000),
  (3, 2, 1, 5000),
  (4, 2, 3, 4000);`,
  solutionQuery: `SELECT
  c.channel_name,
  r.region_name
FROM channels c
CROSS JOIN regions r
INNER JOIN channel_budgets cb ON c.channel_id = cb.channel_id
LEFT JOIN campaigns camp
  ON c.channel_id = camp.channel_id
  AND r.region_id = camp.region_id
WHERE camp.campaign_id IS NULL
ORDER BY c.channel_name, r.region_name;`,
  solutionExplanation: `## Explanation

### Pattern: CROSS JOIN + INNER JOIN + LEFT JOIN for Matrix Gap Detection

This query combines three join types, each serving a distinct role.

### Step-by-step

1. **CROSS JOIN regions**: Generates every possible (channel, region) pair — 3 channels × 3 regions = 9 rows.
2. **INNER JOIN channel_budgets**: Restricts to channels that have a budget entry. TV (channel_id=3) has no budget row and is silently dropped, leaving 2 × 3 = 6 pairs.
3. **LEFT JOIN campaigns**: Attempts to match each pair to an actual campaign record. Pairs with no campaign return NULL for all campaign columns.
4. **WHERE camp.campaign_id IS NULL**: Keeps only the unmatched pairs — the coverage gaps.

### Why three joins?
- CROSS JOIN: generate the complete dimension matrix
- INNER JOIN: filter the matrix to a meaningful subset (active channels)
- LEFT JOIN: find which cells in the filtered matrix are empty

### When to use
Any time you need to identify "what's missing" from a matrix of two dimensions, but only for a relevant subset of one dimension.`,
  testCases: [
    {
      name: "default",
      description: "Returns 2 missing channel-region pairs",
      expectedColumns: ["channel_name", "region_name"],
      expectedRows: [
        { channel_name: "Email", region_name: "South" },
        { channel_name: "Social Media", region_name: "West" },
      ],
      orderMatters: true,
    },
    {
      name: "all-covered",
      description: "After adding the missing campaigns, no gaps remain",
      setupSql: `INSERT INTO campaigns VALUES (5, 1, 3, 9000), (6, 2, 2, 3500);`,
      expectedColumns: ["channel_name", "region_name"],
      expectedRows: [],
      orderMatters: false,
    },
  ],
};
