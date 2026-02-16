import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "47-multi-cte-customer-segmentation",
  title: "Customer Segmentation for Marketing",
  difficulty: "medium",
  category: "subqueries-ctes",
  description: `## Customer Segmentation for Marketing

The marketing team wants to segment customers into three tiers based on their total spending from conversions, to target campaigns more effectively:
- **VIP**: total spending > $1,000
- **Regular**: total spending between $200 and $1,000 (inclusive)
- **Light**: total spending below $200 (including customers with no conversions)

Write a query using multiple CTEs to compute spending, assign segments, and produce a summary.

### Schema

**customers**
| Column | Type |
|--------|------|
| customer_id | INTEGER |
| customer_name | VARCHAR |
| signup_date | DATE |

**campaigns**
| Column | Type |
|--------|------|
| campaign_id | INTEGER |
| campaign_name | VARCHAR |
| channel | VARCHAR |

**conversions**
| Column | Type |
|--------|------|
| conversion_id | INTEGER |
| customer_id | INTEGER |
| campaign_id | INTEGER |
| conversion_date | DATE |
| amount | DECIMAL(10,2) |

### Expected output columns
\`segment\`, \`num_customers\`, \`segment_revenue\`, \`avg_spending\`

Where \`avg_spending\` is ROUND(AVG(total_spending), 2).

Order by \`segment_revenue\` DESC.`,
  hint: "Use three CTEs: (1) customer_spending: LEFT JOIN customers to conversions and SUM spending with COALESCE for NULLs. (2) segmented: add a CASE WHEN to assign VIP/Regular/Light. (3) Final SELECT: GROUP BY segment.",
  schema: `CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY,
  customer_name VARCHAR,
  signup_date DATE
);

CREATE TABLE campaigns (
  campaign_id INTEGER PRIMARY KEY,
  campaign_name VARCHAR,
  channel VARCHAR
);

CREATE TABLE conversions (
  conversion_id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  campaign_id INTEGER,
  conversion_date DATE,
  amount DECIMAL(10,2)
);

INSERT INTO customers VALUES
  (1, 'Alice Martin', '2023-01-15'),
  (2, 'Bob Johnson', '2023-03-20'),
  (3, 'Charlie Lee', '2023-06-01'),
  (4, 'Diana Park', '2023-08-10'),
  (5, 'Eve Garcia', '2024-01-05'),
  (6, 'Frank Chen', '2024-02-15'),
  (7, 'Grace Kim', '2024-03-01'),
  (8, 'Henry Wilson', '2024-04-10'),
  (9, 'Iris Davis', '2024-05-20'),
  (10, 'Jack Brown', '2024-06-01');

INSERT INTO campaigns VALUES
  (1, 'Summer Sale', 'Email'),
  (2, 'Social Promo', 'Social'),
  (3, 'Search Ads', 'Search');

INSERT INTO conversions VALUES
  (1, 1, 1, '2024-01-15', 450.00),
  (2, 1, 2, '2024-03-10', 320.00),
  (3, 1, 3, '2024-05-01', 580.00),
  (4, 2, 1, '2024-01-20', 200.00),
  (5, 2, 2, '2024-04-05', 350.00),
  (6, 3, 3, '2024-02-15', 1200.00),
  (7, 4, 1, '2024-03-01', 150.00),
  (8, 4, 2, '2024-06-10', 400.00),
  (9, 5, 2, '2024-02-05', 80.00),
  (10, 6, 3, '2024-03-15', 900.00),
  (11, 6, 1, '2024-05-20', 250.00),
  (12, 7, 1, '2024-04-01', 120.00),
  (13, 8, 2, '2024-05-10', 300.00);`,
  solutionQuery: `WITH customer_spending AS (
  SELECT
    c.customer_id,
    c.customer_name,
    c.signup_date,
    COALESCE(SUM(cv.amount), 0) AS total_spending,
    COUNT(cv.conversion_id) AS num_purchases
  FROM customers c
  LEFT JOIN conversions cv ON c.customer_id = cv.customer_id
  GROUP BY c.customer_id, c.customer_name, c.signup_date
),
segmented AS (
  SELECT
    customer_id,
    customer_name,
    total_spending,
    num_purchases,
    CASE
      WHEN total_spending > 1000 THEN 'VIP'
      WHEN total_spending >= 200 THEN 'Regular'
      ELSE 'Light'
    END AS segment
  FROM customer_spending
)
SELECT
  segment,
  COUNT(*) AS num_customers,
  ROUND(SUM(total_spending), 2) AS segment_revenue,
  ROUND(AVG(total_spending), 2) AS avg_spending
FROM segmented
GROUP BY segment
ORDER BY segment_revenue DESC;`,
  solutionExplanation: `## Explanation

### Pattern: Multi-CTE for Business Logic

This uses **multiple CTEs** to separate data retrieval, business logic (segmentation), and aggregation into clear, named steps.

### Step-by-step
1. **customer_spending CTE**: LEFT JOINs customers to conversions, using COALESCE to handle customers with no purchases (0 instead of NULL).
2. **segmented CTE**: Applies CASE WHEN business rules to classify each customer as VIP, Regular, or Light.
3. **Final SELECT**: Aggregates by segment to produce the marketing summary.

### Why LEFT JOIN + COALESCE?
Customers 9 (Iris) and 10 (Jack) have no conversions. Without LEFT JOIN, they'd be excluded. Without COALESCE, their spending would be NULL instead of 0, which would break the CASE WHEN logic.

### When to use
- Customer segmentation (RFM analysis, tiering)
- Any classification that requires computing a metric, then bucketing it
- Marketing campaign targeting, loyalty programs`,
  testCases: [
    {
      name: "default",
      description: "Returns 3 segments: VIP, Regular, Light with correct counts and revenue",
      expectedColumns: ["segment", "num_customers", "segment_revenue", "avg_spending"],
      expectedRows: [
        { segment: "VIP", num_customers: 3, segment_revenue: 3700.00, avg_spending: 1233.33 },
        { segment: "Regular", num_customers: 3, segment_revenue: 1400.00, avg_spending: 466.67 },
        { segment: "Light", num_customers: 4, segment_revenue: 200.00, avg_spending: 50.00 },
      ],
      orderMatters: true,
    },
    {
      name: "all-customers-have-conversions",
      description: "After adding conversions for inactive customers, segments shift",
      setupSql: `INSERT INTO conversions VALUES (14, 9, 1, '2024-06-01', 500.00), (15, 10, 2, '2024-06-05', 1500.00);`,
      expectedColumns: ["segment", "num_customers", "segment_revenue", "avg_spending"],
      expectedRows: [
        { segment: "VIP", num_customers: 4, segment_revenue: 5200.00, avg_spending: 1300.00 },
        { segment: "Regular", num_customers: 4, segment_revenue: 1900.00, avg_spending: 475.00 },
        { segment: "Light", num_customers: 2, segment_revenue: 200.00, avg_spending: 100.00 },
      ],
      orderMatters: true,
    },
  ],
};
