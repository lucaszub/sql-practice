# Data Analyst SQL Roadmap

> From your first SELECT to FAANG-level analytical SQL.

This roadmap takes you from SQL fundamentals to the advanced analytical patterns tested in Data Analyst interviews at top companies. Every module is grounded in real business scenarios — e-commerce, SaaS, marketing, product analytics, and finance.

---

## Overview

```
BEGINNER (Weeks 1–6)              INTERMEDIATE (Weeks 6–16)           ADVANCED (Weeks 16–30)
~25 exercises                     ~30 exercises                       ~25 exercises
──────────────────────            ──────────────────────────          ──────────────────────────

B1. SELECT Fundamentals      →   I1. Multi-table Joins          →   A1. Running Totals & Averages
B2. Aggregation & GROUP BY   →   I2. Subqueries & CTEs          →   A2. Gaps & Islands
B3. Basic Joins              →   I3. Window Fns: Ranking        →   A3. Cohort Retention Analysis
B4. NULL Handling & CASE     →   I4. Window Fns: Analytics      →   A4. Funnel Analysis
                                 I5. Anti-joins & Set Ops       →   A5. Revenue Metrics (MRR/LTV)
                                 I6. Date & String Functions    →   A6. PIVOT / UNPIVOT
                                 I7. Conditional Aggregation    →   A7. DuckDB Modern SQL
                                                                    A8. Advanced Scenarios
```

**Total: ~80 exercises**

---

## Beginner — Foundations

> Goal: Confidently query, filter, sort, aggregate, and join data from one or two tables.

> Business domains: E-commerce (orders, customers, products), Employee databases.

### B1. SELECT Fundamentals (6–8 exercises)

**What you learn**: How to retrieve and filter data from a single table.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | SELECT, WHERE, comparison operators | Find all orders above $100 |
| 2 | Pattern drill | IN, BETWEEN | Find products in specific categories and price range |
| 3 | Pattern drill | LIKE, pattern matching | Find customers whose email ends with @gmail.com |
| 4 | Pattern drill | ORDER BY, ASC/DESC | List products by price descending |
| 5 | Pattern drill | LIMIT / OFFSET | Show the 10 most recent orders |
| 6 | Pattern drill | Multiple WHERE conditions (AND, OR, NOT) | Find premium customers with recent activity |
| 7 | Business scenario | Combining all basics | Build a filtered product catalog with sorting |

**Skills unlocked**: You can explore any single table and extract exactly the data you need.

---

### B2. Aggregation & GROUP BY (6–8 exercises)

**What you learn**: How to summarize data — count rows, sum values, compute averages, and group results.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | COUNT, COUNT(DISTINCT) | Count total orders and unique customers |
| 2 | Pattern drill | SUM, AVG | Calculate total and average revenue per month |
| 3 | Pattern drill | MIN, MAX | Find cheapest and most expensive product per category |
| 4 | Pattern drill | GROUP BY | Revenue breakdown by product category |
| 5 | Pattern drill | GROUP BY multiple columns | Orders by country and month |
| 6 | Pattern drill | HAVING | Find categories with more than 50 products |
| 7 | Business scenario | WHERE vs HAVING | Compare filtering before and after aggregation |

**Skills unlocked**: You can answer "how many?", "how much?", and "what's the average?" for any grouped data.

---

### B3. Basic Joins (6–8 exercises)

**What you learn**: How to combine data from two related tables.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | INNER JOIN basics | List orders with customer names |
| 2 | Pattern drill | INNER JOIN with aggregation | Total spending per customer |
| 3 | Pattern drill | LEFT JOIN basics | All customers, including those with no orders |
| 4 | Pattern drill | LEFT JOIN to find missing data | Customers who never ordered |
| 5 | Pattern drill | JOIN with WHERE | Orders from VIP customers in the last 30 days |
| 6 | Pattern drill | JOIN with GROUP BY | Average order value by product category |
| 7 | Business scenario | Multi-concept | Build a customer summary report (name, total orders, total spent, last order date) |

**Skills unlocked**: You can combine related data and build meaningful reports from multiple tables.

---

### B4. NULL Handling & CASE (4–5 exercises)

**What you learn**: How to handle missing data and add conditional logic to queries.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | IS NULL, IS NOT NULL | Find products without a description |
| 2 | Pattern drill | COALESCE | Default to "Unknown" for missing categories |
| 3 | Pattern drill | CASE WHEN basic | Classify orders as "small", "medium", "large" by amount |
| 4 | Pattern drill | CASE WHEN with aggregation | Count orders per size bucket |
| 5 | Business scenario | NULL + CASE combined | Build a customer health score with fallback values |

**Skills unlocked**: You handle real-world messy data gracefully.

---

## Intermediate — Composition & Analysis

> Goal: Decompose complex multi-step queries, use window functions, handle 3+ table scenarios.

> Business domains: SaaS metrics, marketing campaigns, HR analytics.

### I1. Multi-table Joins (6–8 exercises)

**What you learn**: Join 3+ tables, use self-joins, handle complex relationships.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | 3-table JOIN | Orders with customer name and product details |
| 2 | Pattern drill | 4-table JOIN | Full order report: customer → order → items → product |
| 3 | Pattern drill | Self-join: comparison | Find employees who earn more than their manager |
| 4 | Pattern drill | Self-join: pairs | Find products bought together (same order) |
| 5 | Pattern drill | CROSS JOIN | Generate all possible product-store combinations |
| 6 | Business scenario | Multi-table aggregation | Revenue by department with manager name and employee count |
| 7 | Business scenario | Complex reporting | Build a monthly sales dashboard joining 4+ tables |

**Skills unlocked**: You can navigate complex data models and build rich reports.

---

### I2. Subqueries & CTEs (6–8 exercises)

**What you learn**: Decompose complex logic into readable, reusable steps.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | Scalar subquery | Find products priced above the average |
| 2 | Pattern drill | Subquery in WHERE (IN) | Find customers who bought product X |
| 3 | Pattern drill | Correlated subquery | Find each department's highest earner |
| 4 | Pattern drill | Basic CTE | Rewrite a subquery as a CTE for readability |
| 5 | Pattern drill | Multi-step CTE | Chain 3 CTEs: filter → aggregate → rank |
| 6 | Business scenario | CTE decomposition | Monthly active users with 3-month trend |
| 7 | Debugging | Subquery vs CTE | Fix a broken correlated subquery by converting to CTE |

**Skills unlocked**: You write readable, maintainable queries that handle multi-step logic.

---

### I3. Window Functions: Ranking (8–10 exercises)

**What you learn**: Rank, number, and partition rows without collapsing groups.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | ROW_NUMBER() basics | Number orders chronologically per customer |
| 2 | Pattern drill | ROW_NUMBER() + PARTITION BY | Number each customer's orders independently |
| 3 | Pattern drill | RANK() vs DENSE_RANK() | Rank products by sales, handling ties |
| 4 | Pattern drill | **Top-N per group** | Top 3 products by revenue per category |
| 5 | Pattern drill | NTILE() | Divide customers into quartiles by spending |
| 6 | Pattern drill | PERCENT_RANK() | Percentile ranking of employee salaries |
| 7 | Pattern drill | Deduplication | Keep only the latest address per customer |
| 8 | Business scenario | Top performers | Find the top salesperson per region per quarter |
| 9 | Business scenario | RFM segmentation | Score customers by Recency, Frequency, Monetary using NTILE |

**Skills unlocked**: You solve the #1 most-asked SQL interview pattern (Top-N per group).

---

### I4. Window Functions: Analytics (6–8 exercises)

**What you learn**: Compare rows with their neighbors — previous period, next event, first/last values.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | LAG() basics | Previous month's revenue for each product |
| 2 | Pattern drill | LEAD() basics | Next scheduled appointment per patient |
| 3 | Pattern drill | **YoY growth** | Year-over-year revenue growth per product |
| 4 | Pattern drill | **MoM growth** | Month-over-month user signup growth |
| 5 | Pattern drill | FIRST_VALUE / LAST_VALUE | First and last purchase per customer |
| 6 | Business scenario | Period comparison | Compare each month's metrics to the same month last year |
| 7 | Business scenario | Trend detection | Flag products with 3 consecutive months of declining sales |

**Skills unlocked**: You compute growth rates, trends, and period-over-period comparisons.

---

### I5. Anti-joins & Set Operations (5–6 exercises)

**What you learn**: Find what's missing, what's exclusive, and what's common between datasets.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | LEFT JOIN + IS NULL (anti-join) | Find customers with no orders in 2024 |
| 2 | Pattern drill | NOT EXISTS | Find products never reviewed |
| 3 | Pattern drill | EXISTS (semi-join) | Find customers who bought at least one premium product |
| 4 | Pattern drill | UNION / UNION ALL | Combine online and in-store transactions |
| 5 | Pattern drill | INTERSECT / EXCEPT | Find customers who bought in both Q1 and Q2 vs. only Q1 |
| 6 | Business scenario | Churn detection | Find previously active users who stopped engaging |

**Skills unlocked**: You detect gaps, churned users, and dataset overlaps.

---

### I6. Date & String Functions (5–6 exercises)

**What you learn**: Manipulate dates and text for reporting and analysis.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | DATE_TRUNC, EXTRACT | Aggregate orders by week, month, quarter |
| 2 | Pattern drill | Date arithmetic | Find orders placed within 7 days of signup |
| 3 | Pattern drill | DATEDIFF / AGE | Calculate customer tenure in months |
| 4 | Pattern drill | TRIM, UPPER, LOWER, CONCAT | Standardize messy customer names |
| 5 | Pattern drill | SUBSTRING, REPLACE | Extract domain from email addresses |
| 6 | Business scenario | Date + String combined | Build a "user_2024_Q3_premium" segment label |

**Skills unlocked**: You handle the messy date and string operations that real data requires.

---

### I7. Conditional Aggregation (4–5 exercises)

**What you learn**: Compute multiple metrics in a single query using conditional logic inside aggregates.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | SUM(CASE WHEN ...) | Count paid vs. free users in one query |
| 2 | Pattern drill | COUNT + CASE | Pivot-style: orders per status (pending, shipped, delivered) in columns |
| 3 | Pattern drill | FILTER clause (DuckDB) | Cleaner syntax for conditional aggregation |
| 4 | Business scenario | Dashboard metrics | One query returning: total users, active users, churned users, revenue |
| 5 | Business scenario | Conversion rates | Signup-to-purchase conversion rate by channel |

**Skills unlocked**: You build efficient dashboard queries that compute multiple metrics at once.

---

## Advanced — Real-World Analytical Patterns

> Goal: Solve the analytical SQL patterns asked in FAANG interviews and used daily by senior DAs.

> Business domains: Product analytics, subscription/SaaS, finance, marketing attribution.

### A1. Running Totals & Moving Averages (5–6 exercises)

**What you learn**: Cumulative calculations and rolling windows for trend analysis.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | Running total | Cumulative revenue by day |
| 2 | Pattern drill | Running count | Cumulative user signups over time |
| 3 | Pattern drill | 7-day moving average | Smoothed daily revenue trend |
| 4 | Pattern drill | Window frame: ROWS vs RANGE | Understand the difference with duplicated dates |
| 5 | Business scenario | Partitioned running total | Cumulative spending per customer over time |
| 6 | Business scenario | Growth tracking | Running total with % of annual target reached |

**Skills unlocked**: You build trend lines and cumulative metrics for executive dashboards.

---

### A2. Gaps & Islands (5–6 exercises)

**What you learn**: Detect consecutive sequences — login streaks, active periods, continuous inventory.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | ROW_NUMBER subtraction | Identify consecutive login days per user |
| 2 | Pattern drill | Island detection | Group consecutive dates into ranges |
| 3 | Pattern drill | Gap detection | Find missing dates in a time series |
| 4 | Pattern drill | Streak filtering | Find users with login streaks of 7+ days |
| 5 | Business scenario | Session detection | Group page views into sessions (30-min gap threshold) |
| 6 | Business scenario | Subscription continuity | Detect subscription lapses and reactivations |

**Skills unlocked**: You solve one of the hardest SQL patterns — a favorite in senior DA interviews.

---

### A3. Cohort Retention Analysis (4–5 exercises)

**What you learn**: Track how groups of users behave over time — the core metric for product teams.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | Cohort assignment | Assign users to monthly signup cohorts |
| 2 | Pattern drill | Retention matrix | Build a month-by-month retention table |
| 3 | Pattern drill | Retention percentage | Compute % of cohort still active in month N |
| 4 | Business scenario | Full cohort analysis | End-to-end retention report for a SaaS product |
| 5 | Business scenario | Cohort comparison | Compare retention of organic vs. paid acquisition cohorts |

**Skills unlocked**: You build the single most important metric for product and growth teams.

---

### A4. Funnel Analysis (4–5 exercises)

**What you learn**: Measure step-by-step conversion through a user journey.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | Basic funnel | Visit → signup → activation → purchase counts |
| 2 | Pattern drill | Conversion rates | Step-by-step and overall conversion percentages |
| 3 | Pattern drill | Time-windowed funnel | Only count conversions within 7 days of signup |
| 4 | Business scenario | Funnel by segment | Compare mobile vs. desktop conversion funnels |
| 5 | Business scenario | Drop-off analysis | Identify the step with the highest drop-off rate |

**Skills unlocked**: You quantify where users drop off and identify optimization opportunities.

---

### A5. Revenue Metrics — MRR, Churn, LTV (4–5 exercises)

**What you learn**: The SQL behind subscription business metrics.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | MRR calculation | Monthly recurring revenue from active subscriptions |
| 2 | Pattern drill | Churn rate | Monthly customer churn rate |
| 3 | Pattern drill | Revenue categorization | Classify MRR changes: new, expansion, contraction, churn |
| 4 | Business scenario | LTV estimation | Customer lifetime value by acquisition channel |
| 5 | Business scenario | Full SaaS dashboard | MRR, churn, net revenue retention in one report |

**Skills unlocked**: You speak the language of SaaS/subscription businesses fluently in SQL.

---

### A6. PIVOT / UNPIVOT (4–5 exercises)

**What you learn**: Transform data between row and column formats.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | Manual pivot (CASE + GROUP BY) | Monthly revenue as columns (Jan, Feb, Mar...) |
| 2 | Pattern drill | DuckDB PIVOT | Native PIVOT syntax for the same problem |
| 3 | Pattern drill | UNPIVOT | Convert wide survey data to long format |
| 4 | Business scenario | Cross-tabulation | Product × region revenue matrix |
| 5 | Business scenario | Dynamic reporting | Quarterly comparison pivot table |

**Skills unlocked**: You reshape data for reports and dashboards without post-processing.

---

### A7. DuckDB Modern SQL (5–6 exercises)

**What you learn**: Modern SQL features that make queries shorter, faster, and more readable.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | QUALIFY | Top-N per group in a single query (no subquery) |
| 2 | Pattern drill | GROUP BY ALL | Automatic grouping without listing columns |
| 3 | Pattern drill | SELECT * EXCLUDE | Select all columns except sensitive ones |
| 4 | Pattern drill | FILTER clause | Conditional aggregation with cleaner syntax |
| 5 | Pattern drill | ASOF JOIN | Match trades to the most recent quote |
| 6 | Business scenario | Modern rewrite | Rewrite a legacy query using DuckDB modern syntax |

**Skills unlocked**: You write modern, concise SQL that translates to BigQuery, Snowflake, and Databricks.

---

### A8. Advanced Business Scenarios (3–4 exercises)

**What you learn**: Combine multiple patterns to solve complex, open-ended analytical problems.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Business scenario | A/B test analysis | Compare conversion rates between test and control groups with statistical significance |
| 2 | Business scenario | User engagement scoring | Build a composite engagement score using multiple activity signals |
| 3 | Business scenario | Metric investigation | Diagnose a sudden drop in daily active users |
| 4 | Business scenario | GROUPING SETS / ROLLUP | Build a report with subtotals and grand totals |

**Skills unlocked**: You think like a senior DA — combining patterns to answer complex business questions.

---

## Existing Exercises Mapping

The platform has 121 exercises. Here's where the window function exercises fit in this roadmap:

### I3. Window Functions: Ranking (8 exercises)

| Exercise | Title | Difficulty | Pattern |
|----------|-------|-----------|---------|
| `01-top-n-per-group` | Top N Per Group | medium | RANK + PARTITION BY |
| `102-row-number-basics` | Number Orders Chronologically | medium | ROW_NUMBER basics |
| `103-rank-vs-dense-rank` | Sales Ranking with Ties | medium | DENSE_RANK comparison |
| `104-ntile-quartiles` | Customer Spending Quartiles | medium | NTILE segmentation |
| `105-percent-rank-salary` | Salary Percentile Ranking | medium | PERCENT_RANK |
| `106-deduplication-latest-record` | Deduplicate Customer Addresses | medium | ROW_NUMBER dedup |
| `107-top-performers-region` | Top Salesperson Per Region Per Quarter | medium | Aggregate + RANK |
| `108-rfm-segmentation` | RFM Customer Segmentation | hard | Multi-NTILE + CTEs |

### I4. Window Functions: Analytics (7 exercises)

| Exercise | Title | Difficulty | Pattern |
|----------|-------|-----------|---------|
| `03-yoy-growth` | Year-over-Year Growth | hard | LAG + PARTITION BY month |
| `109-lag-previous-month` | Previous Month Revenue Comparison | medium | LAG basics |
| `110-lead-next-event` | Next Appointment Scheduling | medium | LEAD basics |
| `111-mom-growth` | Month-over-Month User Signup Growth | medium | LAG + growth formula |
| `112-first-last-value` | First and Last Purchase Per Customer | medium | FIRST_VALUE/LAST_VALUE |
| `113-period-comparison` | Same Month Last Year Comparison | hard | LAG + PARTITION BY month |
| `114-trend-detection` | Detect Consecutive Sales Decline | hard | LAG + running groups |

### A1. Running Totals & Moving Averages (5 exercises)

| Exercise | Title | Difficulty | Pattern |
|----------|-------|-----------|---------|
| `02-running-total` | Running Total & Moving Average | medium | SUM/AVG OVER frames |
| `115-running-count` | Cumulative User Signups | hard | SUM OVER running total |
| `116-rows-vs-range` | ROWS vs RANGE Frame Comparison | hard | Frame specification |
| `117-partitioned-running-total` | Cumulative Spending Per Customer | hard | Partitioned SUM OVER |
| `118-growth-target-tracking` | Revenue Target Progress Tracking | hard | Running total + % |

### A2. Gaps & Islands (5 exercises)

| Exercise | Title | Difficulty | Pattern |
|----------|-------|-----------|---------|
| `04-gap-and-island` | Login Streaks (Gap & Island) | hard | ROW_NUMBER subtraction |
| `09-consecutive-days` | Consecutive Days | hard | Gap & island variant |
| `119-island-grouping` | Group Consecutive Active Days | hard | Island detection |
| `120-gap-detection` | Find Missing Invoice Numbers | hard | LEAD gap detection |
| `121-session-detection` | Sessionize Page Views | hard | LAG-based sessions |

### Other modules (existing exercises)

| Exercise | Module |
|----------|--------|
| `05-employee-hierarchy` | (Shared with DE — Recursive CTEs) |
| `06-date-series` | I6. Date & String Functions / (Shared with DE) |
| `07-cohort-retention` | A3. Cohort Retention Analysis |
| `08-funnel-analysis` | A4. Funnel Analysis |
| `10-anti-join` | I5. Anti-joins & Set Operations |
| `11-50` | B1–B4, I1–I2 (Beginner & Intermediate foundations) |

---

## Interview Readiness by Level

| Level | Interview Target |
|-------|-----------------|
| Beginner complete | Entry-level DA, junior analyst |
| Intermediate complete | Mid-level DA at most companies |
| Advanced complete | Senior DA, FAANG-level interviews |

### FAANG-Tested Patterns Covered

- Top-N per group (Meta, Amazon) → I3
- Self-joins (Meta friend recommendations) → I1
- YoY/MoM growth (Amazon, Wayfair) → I4
- Running totals (all companies) → A1
- Gaps & Islands (Google, Apple) → A2
- Cohort retention (all product companies) → A3
- Funnel analysis (all companies) → A4
- Deduplication (all companies) → I3
- Anti-joins (Meta, Netflix) → I5
