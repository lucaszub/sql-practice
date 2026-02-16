# Content Design Rules

## Business Scenario Framing

IMPORTANT: Every exercise MUST be framed as a real business question.

### Good examples
- "The product team wants to identify users with login streaks of 7+ consecutive days to award loyalty badges."
- "Finance needs a monthly report showing revenue growth compared to the same month last year."
- "The data platform team discovered duplicate records in the staging table. Write a query to keep only the most recent record per customer."

### Bad examples (never do this)
- "Write a query using ROW_NUMBER with PARTITION BY."
- "Practice the gap-and-island technique."
- "Use LAG to compute differences."

## Difficulty Progression Within a Module

Each module should follow this internal progression:

1. **Guided** (1–2 exercises): Clear, simple, one-concept. Builds confidence.
2. **Independent** (3–4 exercises): Full query writing, clear problem statement. Tests understanding.
3. **Challenge** (1–2 exercises): Real-world complexity, multiple concepts combined. Tests mastery.

## Business Domain Selection

| Domain | Tables | Best For |
|--------|--------|----------|
| E-commerce | orders, customers, products, order_items, returns | Beginner (relatable, intuitive) |
| SaaS/Subscription | users, subscriptions, invoices, events, plans | Intermediate–Advanced DA (MRR, churn) |
| Marketing | campaigns, impressions, clicks, conversions, channels | Intermediate DA (attribution, funnels) |
| Product Analytics | users, events, sessions, posts, friendships | Advanced DA (DAU/MAU, retention) |
| Finance | transactions, accounts, loans, credit_scores | Advanced DA (fraud, YoY growth) |
| Data Platform | raw_events, staging_*, dim_*, fact_* | Advanced DE (medallion, ETL) |
| HR | employees, departments, salaries, performance_reviews | Intermediate (hierarchies, self-joins) |

## Schema Design Guidelines

- **10–30 rows** per table: enough for meaningful results, small enough to reason about
- Include **NULLs** in at least one column (real data is never perfectly clean)
- Include **edge cases in the data itself**: ties for ranking, gaps in dates, empty groups
- Use **realistic values**: real-looking names, plausible amounts, sensible dates
- **Column naming**: snake_case, descriptive (e.g., `order_date` not `od`, `total_amount` not `amt`)

## Solution Explanation Structure

Every `solutionExplanation` should follow this pattern:

1. **Pattern name**: "This uses the Top-N per group pattern."
2. **Step-by-step breakdown**: Walk through each CTE or subquery.
3. **Why this approach**: Explain why this is idiomatic (readability, performance).
4. **When to use**: Real-world situations where this pattern applies.
5. **DuckDB note** (if applicable): How DuckDB syntax differs from standard SQL.
