import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "126-monthly-account-gaps",
  title: "Find Months with No Transactions per Owned Account",
  difficulty: "medium",
  category: "multi-table-joins",
  description: `## Find Months with No Transactions per Owned Account

The compliance team at a bank runs a monthly dormancy check. Any account that has an assigned owner but shows **no transaction activity in a given month** is flagged for review.

Accounts with no owner (unassigned accounts) are excluded from this check.

Write a query that returns all (account, month) pairs where an owned account had zero transactions.

### Schema

**accounts**
| Column | Type |
|--------|------|
| account_id | INTEGER |
| account_name | VARCHAR |

**months**
| Column | Type |
|--------|------|
| month_id | INTEGER |
| month_label | VARCHAR |

**account_owners**
| Column | Type |
|--------|------|
| account_id | INTEGER |
| owner_name | VARCHAR |

**transactions**
| Column | Type |
|--------|------|
| txn_id | INTEGER |
| account_id | INTEGER |
| month_id | INTEGER |
| amount | DECIMAL(10,2) |

### Expected output columns
\`account_name\`, \`month_label\`

Order by \`account_name\` ASC, then \`month_label\` ASC.`,
  hint: "CROSS JOIN months to generate all account×month pairs. INNER JOIN account_owners to scope to owned accounts only. LEFT JOIN transactions and keep rows where no transaction exists.",
  schema: `CREATE TABLE accounts (
  account_id INTEGER PRIMARY KEY,
  account_name VARCHAR
);

CREATE TABLE months (
  month_id INTEGER PRIMARY KEY,
  month_label VARCHAR
);

CREATE TABLE account_owners (
  account_id INTEGER PRIMARY KEY,
  owner_name VARCHAR
);

CREATE TABLE transactions (
  txn_id INTEGER PRIMARY KEY,
  account_id INTEGER,
  month_id INTEGER,
  amount DECIMAL(10,2)
);

INSERT INTO accounts VALUES
  (1, 'Business Savings'),
  (2, 'Premium Checking'),
  (3, 'Student Account');

INSERT INTO months VALUES
  (1, '2024-01'),
  (2, '2024-02'),
  (3, '2024-03');

INSERT INTO account_owners VALUES
  (1, 'Acme Corp'),
  (2, 'Jane Doe');

INSERT INTO transactions VALUES
  (1, 2, 1, 500.00),
  (2, 2, 3, 200.00),
  (3, 1, 2, 1500.00);`,
  solutionQuery: `SELECT
  a.account_name,
  m.month_label
FROM accounts a
CROSS JOIN months m
INNER JOIN account_owners ao ON a.account_id = ao.account_id
LEFT JOIN transactions t
  ON a.account_id = t.account_id
  AND m.month_id = t.month_id
WHERE t.txn_id IS NULL
ORDER BY a.account_name, m.month_label;`,
  solutionExplanation: `## Explanation

### Pattern: CROSS JOIN + INNER JOIN + LEFT JOIN — Dormancy Detection

### Step-by-step

1. **CROSS JOIN months**: Generates all (account, month) combinations — 3 accounts × 3 months = 9 rows.
2. **INNER JOIN account_owners**: Removes the Student Account (no owner row), leaving 2 × 3 = 6 pairs.
3. **LEFT JOIN transactions**: Matches each pair to a transaction record. Pairs with no transactions return NULL txn columns.
4. **WHERE t.txn_id IS NULL**: Keeps only the inactive (account, month) pairs.

### Result walkthrough
- Business Savings: only active in February → January and March are flagged
- Premium Checking: active in January and March → February is flagged
- Student Account: excluded entirely (no owner)

### When to use
Financial dormancy reports, SaaS subscription activity gaps, or any periodic audit requiring "every entity should have at least one event per period."`,
  testCases: [
    {
      name: "default",
      description: "Returns 3 account-month pairs with no transactions",
      expectedColumns: ["account_name", "month_label"],
      expectedRows: [
        { account_name: "Business Savings", month_label: "2024-01" },
        { account_name: "Business Savings", month_label: "2024-03" },
        { account_name: "Premium Checking", month_label: "2024-02" },
      ],
      orderMatters: true,
    },
    {
      name: "all-active",
      description: "After filling all inactive months with transactions, no gaps remain",
      setupSql: `INSERT INTO transactions VALUES (4, 1, 1, 300.00), (5, 1, 3, 800.00), (6, 2, 2, 150.00);`,
      expectedColumns: ["account_name", "month_label"],
      expectedRows: [],
      orderMatters: false,
    },
  ],
};
