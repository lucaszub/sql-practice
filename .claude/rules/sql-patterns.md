# SQL Patterns Reference

This platform teaches SQL through recognizable, named patterns. When creating exercises, use these pattern names consistently in titles, descriptions, and explanations.

## Core Patterns (by roadmap module)

### Beginner
- **Basic filtering**: WHERE with comparison, IN, BETWEEN, LIKE
- **Aggregation**: COUNT/SUM/AVG/MIN/MAX with GROUP BY and HAVING
- **Two-table join**: INNER JOIN and LEFT JOIN fundamentals

### Intermediate
- **Top-N per group**: ROW_NUMBER/RANK + PARTITION BY → filter in outer query
- **Deduplication**: ROW_NUMBER to keep latest/first record per entity
- **Period-over-period**: LAG/LEAD for YoY, MoM, WoW growth
- **Anti-join**: LEFT JOIN + IS NULL or NOT EXISTS to find missing records
- **CTE decomposition**: Break complex logic into named, readable steps
- **Conditional aggregation**: SUM(CASE WHEN ...) or FILTER clause for pivot-style queries

### Advanced — Data Analyst
- **Running total**: SUM() OVER (ORDER BY ... ROWS UNBOUNDED PRECEDING)
- **Moving average**: AVG() OVER (ORDER BY ... ROWS BETWEEN N PRECEDING AND CURRENT ROW)
- **Gap and island**: ROW_NUMBER subtraction to detect consecutive sequences
- **Cohort retention**: Assign cohort → track activity by period → compute retention %
- **Funnel analysis**: Chain CTEs, each step filtering from previous → conversion rates
- **Revenue metrics**: MRR, churn rate, LTV from subscription data

### Advanced — Data Engineer
- **Star schema**: Fact table (measures + FKs) joined to dimension tables (attributes)
- **SCD Type 2**: valid_from/valid_to/is_current for historical tracking
- **MERGE/UPSERT**: Atomic insert-or-update for idempotent pipeline loading
- **Incremental load**: Watermark pattern (max(updated_at)) or partition overwrite (DELETE+INSERT)
- **Data quality check**: NULL completeness, uniqueness, referential integrity, freshness

## DuckDB-Specific Syntax

Use these when they make the solution cleaner. Always explain in `solutionExplanation`.

| Feature | Syntax | Replaces |
|---------|--------|----------|
| QUALIFY | `SELECT ... QUALIFY ROW_NUMBER() OVER (...) = 1` | Subquery wrapping window function |
| GROUP BY ALL | `GROUP BY ALL` | Listing all non-aggregated columns |
| EXCLUDE | `SELECT * EXCLUDE (col1, col2)` | Listing all columns except some |
| FILTER | `COUNT(*) FILTER (WHERE status = 'active')` | SUM(CASE WHEN ...) |
| ASOF JOIN | `FROM a ASOF JOIN b USING (key, ts)` | Correlated subquery with MAX |
| PIVOT | `PIVOT t ON col USING SUM(val)` | Manual CASE WHEN pivot |
| UNPIVOT | `UNPIVOT t ON col1, col2 INTO NAME k VALUE v` | UNION ALL for each column |
| LIST | `LIST(col)` | STRING_AGG or array subqueries |
| STRUCT | `{'a': 1, 'b': 2}` | Multiple columns or JSON |
