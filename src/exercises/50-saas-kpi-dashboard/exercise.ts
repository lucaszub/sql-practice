import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "50-saas-kpi-dashboard",
  title: "SaaS KPI Dashboard Pipeline",
  difficulty: "medium",
  category: "subqueries-ctes",
  description: `## SaaS KPI Dashboard Pipeline

The executive team needs a unified monthly KPI dashboard built from subscription event data. Build a **4-step CTE pipeline** that transforms raw events into executive-ready metrics.

### Pipeline Steps
1. **monthly_events**: Aggregate subscription events by month -- compute net MRR change, new MRR (from 'new' events), churned MRR (absolute value from 'churn' events), count of new and churned customers
2. **cumulative_mrr**: Use window functions to compute running total MRR and running net subscriber count
3. **with_growth**: Use LAG to compute MoM MRR growth percentage (rounded to 2 decimals)
4. **Final SELECT**: Output the dashboard metrics

### Schema

**subscription_events**
| Column | Type |
|--------|------|
| event_id | INTEGER |
| customer_name | VARCHAR |
| event_type | VARCHAR ('new', 'churn', 'upgrade') |
| plan | VARCHAR |
| mrr_change | INTEGER |
| event_date | DATE |

### Expected output columns
\`month\`, \`total_mrr\`, \`active_subscribers\`, \`new_mrr\`, \`churned_mrr\`, \`mrr_growth_pct\`

Order by \`month\` ASC.`,
  hint: "Build CTEs step by step: (1) GROUP BY month with conditional SUMs for new/churn. (2) SUM() OVER (ORDER BY month) for running totals. (3) LAG for growth percentage. For churned_mrr, use ABS() on churn events since mrr_change is negative for churns.",
  schema: `CREATE TABLE subscription_events (
  event_id INTEGER PRIMARY KEY,
  customer_name VARCHAR,
  event_type VARCHAR,
  plan VARCHAR,
  mrr_change INTEGER,
  event_date DATE
);

INSERT INTO subscription_events VALUES
  (1, 'Acme Corp', 'new', 'Enterprise', 5000, '2024-01-05'),
  (2, 'Beta Inc', 'new', 'Professional', 1500, '2024-01-10'),
  (3, 'Gamma LLC', 'new', 'Starter', 500, '2024-01-15'),
  (4, 'Delta Co', 'new', 'Enterprise', 4000, '2024-01-20'),
  (5, 'Theta LLC', 'new', 'Starter', 500, '2024-01-25'),
  (6, 'Epsilon Ltd', 'new', 'Professional', 2000, '2024-02-05'),
  (7, 'Theta LLC', 'churn', 'Starter', -500, '2024-02-15'),
  (8, 'Gamma LLC', 'upgrade', 'Professional', 1000, '2024-02-20'),
  (9, 'Zeta Corp', 'new', 'Starter', 500, '2024-03-01'),
  (10, 'Eta Inc', 'new', 'Professional', 1500, '2024-03-10'),
  (11, 'Beta Inc', 'churn', 'Professional', -1500, '2024-03-15'),
  (12, 'Delta Co', 'upgrade', 'Enterprise', 1000, '2024-03-20'),
  (13, 'Kappa Ltd', 'new', 'Enterprise', 3500, '2024-04-05'),
  (14, 'Epsilon Ltd', 'churn', 'Professional', -2000, '2024-04-10'),
  (15, 'Zeta Corp', 'upgrade', 'Professional', 1000, '2024-04-15');`,
  solutionQuery: `WITH monthly_events AS (
  SELECT
    DATE_TRUNC('month', event_date) AS month,
    SUM(mrr_change) AS net_mrr_change,
    SUM(CASE WHEN event_type = 'new' THEN mrr_change ELSE 0 END) AS new_mrr,
    SUM(CASE WHEN event_type = 'churn' THEN ABS(mrr_change) ELSE 0 END) AS churned_mrr,
    SUM(CASE WHEN event_type = 'new' THEN 1 ELSE 0 END) AS new_customers,
    SUM(CASE WHEN event_type = 'churn' THEN 1 ELSE 0 END) AS churned_customers
  FROM subscription_events
  GROUP BY DATE_TRUNC('month', event_date)
),
cumulative_mrr AS (
  SELECT
    month,
    net_mrr_change,
    new_mrr,
    churned_mrr,
    new_customers,
    churned_customers,
    SUM(net_mrr_change) OVER (ORDER BY month) AS total_mrr,
    SUM(new_customers - churned_customers) OVER (ORDER BY month) AS active_subscribers
  FROM monthly_events
),
with_growth AS (
  SELECT
    month,
    total_mrr,
    active_subscribers,
    new_mrr,
    churned_mrr,
    ROUND(
      100.0 * (total_mrr - LAG(total_mrr) OVER (ORDER BY month))
      / LAG(total_mrr) OVER (ORDER BY month),
      2
    ) AS mrr_growth_pct
  FROM cumulative_mrr
)
SELECT
  month,
  total_mrr,
  active_subscribers,
  new_mrr,
  churned_mrr,
  mrr_growth_pct
FROM with_growth
ORDER BY month;`,
  solutionExplanation: `## Explanation

### Pattern: CTE Pipeline for KPI Dashboard

This is a **mini-project** demonstrating a multi-step CTE pipeline that transforms raw event data into executive KPIs -- a common pattern in SaaS analytics.

### Step-by-step
1. **monthly_events**: Aggregates raw events by month using conditional SUM (CASE WHEN). Separates new MRR from churned MRR. Uses ABS() for churn since those events have negative mrr_change.
2. **cumulative_mrr**: Applies SUM() OVER (ORDER BY month) to compute running totals for MRR and subscriber count. This gives the "as-of" metrics for each month.
3. **with_growth**: Uses LAG(total_mrr) to access the previous month's MRR and compute month-over-month growth percentage.
4. **Final SELECT**: Outputs the clean dashboard with all key SaaS metrics.

### Key SaaS metrics explained
- **Total MRR**: Monthly Recurring Revenue -- the cumulative sum of all subscription changes.
- **Active Subscribers**: Running count of new minus churned customers.
- **New MRR**: Revenue from newly acquired customers this month.
- **Churned MRR**: Revenue lost from customers who cancelled this month.
- **MRR Growth %**: How much total MRR changed compared to last month.

### When to use
- SaaS executive dashboards
- Investor reporting (MRR, churn, growth)
- Any event-sourced business metric computation`,
  testCases: [
    {
      name: "default",
      description: "Returns 4 months of SaaS KPIs with cumulative MRR and growth",
      expectedColumns: ["month", "total_mrr", "active_subscribers", "new_mrr", "churned_mrr", "mrr_growth_pct"],
      expectedRows: [
        { month: "2024-01-01", total_mrr: 11500, active_subscribers: 5, new_mrr: 11500, churned_mrr: 0, mrr_growth_pct: null },
        { month: "2024-02-01", total_mrr: 14000, active_subscribers: 5, new_mrr: 2000, churned_mrr: 500, mrr_growth_pct: 21.74 },
        { month: "2024-03-01", total_mrr: 15500, active_subscribers: 6, new_mrr: 2000, churned_mrr: 1500, mrr_growth_pct: 10.71 },
        { month: "2024-04-01", total_mrr: 18000, active_subscribers: 6, new_mrr: 3500, churned_mrr: 2000, mrr_growth_pct: 16.13 },
      ],
      orderMatters: true,
    },
    {
      name: "first-two-months",
      description: "With only Jan and Feb events, shows initial ramp and first churn",
      setupSql: `DELETE FROM subscription_events WHERE event_date >= '2024-03-01';`,
      expectedColumns: ["month", "total_mrr", "active_subscribers", "new_mrr", "churned_mrr", "mrr_growth_pct"],
      expectedRows: [
        { month: "2024-01-01", total_mrr: 11500, active_subscribers: 5, new_mrr: 11500, churned_mrr: 0, mrr_growth_pct: null },
        { month: "2024-02-01", total_mrr: 14000, active_subscribers: 5, new_mrr: 2000, churned_mrr: 500, mrr_growth_pct: 21.74 },
      ],
      orderMatters: true,
    },
  ],
};
