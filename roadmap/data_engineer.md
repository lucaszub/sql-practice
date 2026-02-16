# Data Engineer SQL Roadmap

> From SELECT basics to production-grade pipeline SQL, schema design, and query optimization.

This roadmap trains the SQL skills that differentiate a Data Engineer from a Data Analyst: writing DDL, designing schemas, building idempotent pipelines, optimizing query performance, and ensuring data quality. All powered by DuckDB — a columnar engine whose patterns transfer directly to BigQuery, Redshift, Snowflake, and Databricks.

---

## Overview

```
BEGINNER (Weeks 1–6)              INTERMEDIATE (Weeks 6–16)           ADVANCED (Weeks 16–30)
~30 exercises                     ~25 exercises                       ~30 exercises
──────────────────────            ──────────────────────────          ──────────────────────────

B1. SELECT Fundamentals      →   I1. Multi-table Joins          →   A1. Star Schema Design
B2. Aggregation & GROUP BY   →   I2. Subqueries & CTEs          →   A2. SCD Type 2
B3. Basic Joins              →   I3. Window Fns: Ranking        →   A3. MERGE / UPSERT Patterns
B4. NULL Handling & CASE     →   I4. Window Fns: Analytics      →   A4. Incremental Load Patterns
B5. DDL & DML Foundations    →   I5. Anti-joins & Set Ops       →   A5. Query Optimization
B6. Data Types & Constraints →   I6. Date & String Functions    →   A6. Data Quality Validation
                                 I7. Schema Design              →   A7. Recursive CTEs
                                                                    A8. DuckDB Modern SQL
                                                                    A9. Nested Data (LIST/STRUCT)
                                                                    A10. Advanced Scenarios
```

**Total: ~85 exercises**

---

## Beginner — Foundations

> Goal: Read and write data confidently. Understand tables, types, constraints, and basic queries.

> Business domains: E-commerce (orders, customers, products), Employee databases.

### B1. SELECT Fundamentals (6–8 exercises)

*Shared with Data Analyst track.*

**What you learn**: Retrieve, filter, and sort data from a single table.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | SELECT, WHERE, comparison operators | Find all orders above $100 |
| 2 | Pattern drill | IN, BETWEEN | Find products in specific categories and price range |
| 3 | Pattern drill | LIKE, pattern matching | Find customers whose email ends with @gmail.com |
| 4 | Pattern drill | ORDER BY, ASC/DESC | List products by price descending |
| 5 | Pattern drill | LIMIT / OFFSET | Show the 10 most recent orders |
| 6 | Pattern drill | Multiple WHERE conditions | Find premium customers with recent activity |
| 7 | Business scenario | Combining all basics | Build a filtered product catalog with sorting |

---

### B2. Aggregation & GROUP BY (6–8 exercises)

*Shared with Data Analyst track.*

**What you learn**: Summarize data — count, sum, average, group, and filter groups.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | COUNT, COUNT(DISTINCT) | Count total orders and unique customers |
| 2 | Pattern drill | SUM, AVG | Total and average revenue per month |
| 3 | Pattern drill | MIN, MAX | Cheapest and most expensive product per category |
| 4 | Pattern drill | GROUP BY | Revenue breakdown by product category |
| 5 | Pattern drill | GROUP BY multiple columns | Orders by country and month |
| 6 | Pattern drill | HAVING | Categories with more than 50 products |
| 7 | Business scenario | WHERE vs HAVING | Filtering before and after aggregation |

---

### B3. Basic Joins (6–8 exercises)

*Shared with Data Analyst track.*

**What you learn**: Combine data from two related tables.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | INNER JOIN basics | Orders with customer names |
| 2 | Pattern drill | INNER JOIN + aggregation | Total spending per customer |
| 3 | Pattern drill | LEFT JOIN basics | All customers including those with no orders |
| 4 | Pattern drill | LEFT JOIN for missing data | Customers who never ordered |
| 5 | Pattern drill | JOIN with WHERE | Orders from VIP customers in the last 30 days |
| 6 | Pattern drill | JOIN with GROUP BY | Average order value by product category |
| 7 | Business scenario | Customer summary report | Name, total orders, total spent, last order date |

---

### B4. NULL Handling & CASE (4–5 exercises)

*Shared with Data Analyst track.*

**What you learn**: Handle missing data and add conditional logic.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | IS NULL, IS NOT NULL | Products without descriptions |
| 2 | Pattern drill | COALESCE | Default "Unknown" for missing categories |
| 3 | Pattern drill | CASE WHEN basic | Classify orders as small/medium/large |
| 4 | Pattern drill | CASE WHEN + aggregation | Count orders per size bucket |
| 5 | Business scenario | NULL + CASE | Customer health score with fallback values |

---

### B5. DDL & DML Foundations (5–6 exercises)

*DE-specific module.*

**What you learn**: Create, modify, and populate tables — the foundation of data engineering.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Schema design | CREATE TABLE | Design an orders table with appropriate columns |
| 2 | Pattern drill | INSERT INTO | Populate a dimension table with reference data |
| 3 | Pattern drill | UPDATE | Correct misspelled product categories |
| 4 | Pattern drill | DELETE with WHERE | Remove test data without affecting production rows |
| 5 | Pattern drill | ALTER TABLE | Add a new column, rename a column |
| 6 | Schema design | DROP + recreate | Rebuild a table with a new schema (migration pattern) |

**Skills unlocked**: You can create and evolve database schemas.

---

### B6. Data Types & Constraints (4–5 exercises)

*DE-specific module.*

**What you learn**: Enforce data integrity at the schema level.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Schema design | Data types | Choose correct types: VARCHAR, INTEGER, DECIMAL, DATE, BOOLEAN, TIMESTAMP |
| 2 | Schema design | PRIMARY KEY | Design a table with a proper primary key |
| 3 | Schema design | FOREIGN KEY | Create parent-child relationship between orders and order_items |
| 4 | Schema design | NOT NULL, UNIQUE, CHECK | Enforce business rules: email must be unique, quantity > 0 |
| 5 | Schema design | DEFAULT values | Set sensible defaults: status = 'pending', created_at = NOW() |

**Skills unlocked**: You design schemas that prevent bad data from entering the system.

---

## Intermediate — Query Composition & Schema Design

> Goal: Write complex multi-step queries, design normalized schemas, understand window functions.

> Business domains: SaaS metrics, HR analytics, multi-department reporting.

### I1. Multi-table Joins (6–8 exercises)

*Shared with Data Analyst track.*

**What you learn**: Join 3+ tables, self-joins, handle complex relationships.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | 3-table JOIN | Orders with customer name and product details |
| 2 | Pattern drill | 4-table JOIN | Full order report: customer → order → items → product |
| 3 | Pattern drill | Self-join: comparison | Employees earning more than their manager |
| 4 | Pattern drill | Self-join: pairs | Products bought together in same order |
| 5 | Pattern drill | CROSS JOIN | All possible product-store combinations |
| 6 | Business scenario | Multi-table aggregation | Revenue by department with manager and headcount |

---

### I2. Subqueries & CTEs (6–8 exercises)

*Shared with Data Analyst track.*

**What you learn**: Decompose complex logic into readable, maintainable steps.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | Scalar subquery | Products priced above the average |
| 2 | Pattern drill | Subquery in WHERE (IN) | Customers who bought product X |
| 3 | Pattern drill | Correlated subquery | Each department's highest earner |
| 4 | Pattern drill | Basic CTE | Rewrite a subquery as a CTE |
| 5 | Pattern drill | Multi-step CTE | Chain 3 CTEs: filter → aggregate → rank |
| 6 | Business scenario | CTE pipeline | Monthly active users with trend |

---

### I3. Window Functions: Ranking (6–8 exercises)

*Shared with Data Analyst track (reduced set for DE).*

**What you learn**: Rank, number, and partition rows — essential for deduplication and Top-N patterns.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | ROW_NUMBER() + PARTITION BY | Number each customer's orders independently |
| 2 | Pattern drill | RANK() vs DENSE_RANK() | Rank products by sales, handling ties |
| 3 | Pattern drill | **Top-N per group** | Top 3 products by revenue per category |
| 4 | Pattern drill | **Deduplication** | Keep only the latest record per entity (SCD prep) |
| 5 | Pattern drill | NTILE() | Divide customers into quartiles by spending |
| 6 | Business scenario | Data cleaning | Deduplicate a raw events table keeping most recent per user |

---

### I4. Window Functions: Analytics (5–6 exercises)

*Shared with Data Analyst track (reduced set for DE).*

**What you learn**: Compare rows with previous/next values for change tracking.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | LAG() | Previous month's value for change detection |
| 2 | Pattern drill | LEAD() | Next expected event timestamp |
| 3 | Pattern drill | **Change detection** | Identify when a dimension value changed (SCD prep) |
| 4 | Pattern drill | Running totals | Cumulative event count |
| 5 | Business scenario | Pipeline monitoring | Detect record count anomalies vs. previous batch |

---

### I5. Anti-joins & Set Operations (4–5 exercises)

*Shared with Data Analyst track (reduced set for DE).*

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | LEFT JOIN + IS NULL | Find orphaned records (FK violations) |
| 2 | Pattern drill | NOT EXISTS | Missing dimension entries |
| 3 | Pattern drill | UNION ALL | Combine data from multiple source tables |
| 4 | Pattern drill | EXCEPT | Find records in source but not in target (data gap detection) |
| 5 | Business scenario | Source-target reconciliation | Validate all source records were loaded |

---

### I6. Date & String Functions (4–5 exercises)

*Shared with Data Analyst track (reduced set for DE).*

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | DATE_TRUNC, EXTRACT | Partition data by week, month, quarter |
| 2 | Pattern drill | Date arithmetic | Calculate data freshness (hours since last update) |
| 3 | Pattern drill | TRIM, UPPER, REPLACE | Standardize raw source data |
| 4 | Pattern drill | CONCAT, SUBSTRING | Build surrogate keys from composite fields |
| 5 | Business scenario | Data cleaning pipeline | Clean and standardize a raw CSV import |

---

### I7. Schema Design & Normalization (5–6 exercises)

*DE-specific module.*

**What you learn**: Design properly normalized schemas with appropriate constraints.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Schema design | 1NF: atomic values | Fix a table with comma-separated values in one column |
| 2 | Schema design | 2NF: no partial dependencies | Split a table with redundant data |
| 3 | Schema design | 3NF: no transitive dependencies | Remove derived/dependent columns |
| 4 | Schema design | Index design | Choose which columns to index for common query patterns |
| 5 | Business scenario | Full normalization | Given a flat CSV, design a normalized 3NF schema |
| 6 | Business scenario | Denormalization trade-offs | When and why to denormalize for read performance |

**Skills unlocked**: You design schemas that balance integrity, performance, and maintainability.

---

## Advanced — Pipeline SQL & Performance

> Goal: Design dimensional models, write idempotent pipeline SQL, optimize for performance, ensure data quality.

> Business domains: Data platform (raw → staging → dim/fact), analytics warehouse, data quality monitoring.

### A1. Star Schema Design & Queries (5–6 exercises)

**What you learn**: Design and query dimensional models — the backbone of analytics warehouses.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Schema design | Fact table design | Design a `fact_orders` table with measures and foreign keys |
| 2 | Schema design | Dimension table design | Design `dim_customer` with descriptive attributes |
| 3 | Schema design | Date dimension | Build a `dim_date` table with fiscal periods and flags |
| 4 | Pattern drill | Star schema queries | Revenue by region, category, and quarter from star schema |
| 5 | Business scenario | Full star schema | Design and query a complete e-commerce star schema |
| 6 | Business scenario | Snowflake extension | When to snowflake a dimension (product → category → department) |

**Skills unlocked**: You design the schemas that power BI dashboards and analytics.

---

### A2. Slowly Changing Dimensions — SCD Type 2 (5–6 exercises)

**What you learn**: Track historical changes in dimension data.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | SCD Type 1 | Overwrite: update customer address (no history) |
| 2 | Pattern drill | SCD Type 2: structure | Design a dimension with `valid_from`, `valid_to`, `is_current` |
| 3 | Pattern drill | SCD Type 2: insert new version | Add a new row when a customer changes city |
| 4 | Pattern drill | SCD Type 2: query current | Get current snapshot of all customers |
| 5 | Pattern drill | SCD Type 2: query at point-in-time | Get customer attributes as they were on 2024-06-15 |
| 6 | Business scenario | Full SCD pipeline | Process a batch of customer changes into an SCD Type 2 dimension |

**Skills unlocked**: You implement the most common dimensional modeling pattern in data warehousing.

---

### A3. MERGE / UPSERT Patterns (5–6 exercises)

**What you learn**: Atomic insert-or-update operations — the foundation of idempotent pipelines.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | INSERT OR REPLACE | Simple upsert for dimension loading |
| 2 | Pattern drill | MERGE basics | Match on key, update if exists, insert if new |
| 3 | Pattern drill | MERGE with conditions | Only update if source is newer than target |
| 4 | Pattern drill | MERGE with DELETE | Remove records no longer in source |
| 5 | Business scenario | Dimension loading | Idempotent load of a product dimension from staging |
| 6 | Business scenario | Fact table loading | MERGE daily sales facts ensuring no duplicates on re-run |

**Skills unlocked**: Your pipeline SQL is safe to re-run without creating duplicates or losing data.

---

### A4. Incremental Load Patterns (4–5 exercises)

**What you learn**: Load only new or changed data — essential for production pipelines.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | Watermark pattern | Track `max(updated_at)` and load records newer than watermark |
| 2 | Pattern drill | Partition overwrite | DELETE + INSERT for a specific date partition |
| 3 | Pattern drill | Batch ID tracking | Tag rows with batch_id for audit and rollback |
| 4 | Business scenario | Incremental fact load | Load only today's new orders into the fact table |
| 5 | Business scenario | Idempotent reload | Re-process a specific day without duplicating data |

**Skills unlocked**: You build pipelines that scale with data volume instead of reprocessing everything.

---

### A5. Query Optimization (4–5 exercises)

**What you learn**: Read execution plans, write index-friendly queries, avoid common performance traps.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | EXPLAIN basics | Read an execution plan, identify table scans |
| 2 | Optimization | Sargable queries | Rewrite `WHERE YEAR(date) = 2024` to use index-friendly range |
| 3 | Optimization | SELECT specificity | Replace SELECT * with explicit columns, measure impact |
| 4 | Optimization | JOIN optimization | Reorder joins and add indexes for a slow multi-table query |
| 5 | Optimization | EXISTS vs IN vs JOIN | Compare 3 approaches for the same problem, analyze plans |

**Skills unlocked**: You write SQL that performs well on tables with millions of rows.

---

### A6. Data Quality Validation (4–5 exercises)

**What you learn**: Write SQL checks that catch data issues before they reach production.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | Completeness check | Find NULL values in required columns |
| 2 | Pattern drill | Uniqueness check | Detect duplicate primary keys |
| 3 | Pattern drill | Referential integrity | Find orphaned foreign keys (orders without customers) |
| 4 | Pattern drill | Range & freshness | Flag amounts outside expected range, stale data |
| 5 | Business scenario | Full quality suite | Build a validation report: completeness, uniqueness, integrity, freshness in one query |

**Skills unlocked**: You build the safety net that prevents bad data from reaching analysts and dashboards.

---

### A7. Recursive CTEs (5–6 exercises)

**What you learn**: Traverse hierarchies and generate sequences — essential for organizational and time-series data.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | Basic recursion | Employee hierarchy: manager chain |
| 2 | Pattern drill | Depth tracking | Calculate hierarchy level for each employee |
| 3 | Pattern drill | Path concatenation | Build full path: CEO → VP → Director → Manager → IC |
| 4 | Pattern drill | Date series generation | Generate all dates between two bounds (gap-filling) |
| 5 | Business scenario | BOM explosion | Bill of Materials: expand product components recursively |
| 6 | Business scenario | Category tree | Build full category breadcrumb from a self-referencing table |

**Skills unlocked**: You handle hierarchical data that would be impossible with flat joins.

---

### A8. DuckDB Modern SQL (5–6 exercises)

**What you learn**: Modern SQL features that map to BigQuery, Snowflake, and Databricks patterns.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | QUALIFY | Deduplicate with QUALIFY instead of subquery |
| 2 | Pattern drill | GROUP BY ALL | Simplify grouping expressions |
| 3 | Pattern drill | SELECT * EXCLUDE / REPLACE | Clean column selection without listing all columns |
| 4 | Pattern drill | ASOF JOIN | Match events to the most recent reference value |
| 5 | Pattern drill | PIVOT / UNPIVOT | Native row-to-column transformation |
| 6 | Business scenario | Pipeline modernization | Rewrite a legacy ETL query using modern DuckDB syntax |

**Skills unlocked**: You write cutting-edge SQL that's concise and transferable to modern cloud warehouses.

---

### A9. Nested Data — LIST, STRUCT, MAP (4–5 exercises)

*DE-specific module — unique to DuckDB, maps to BigQuery ARRAY/STRUCT and Snowflake VARIANT.*

**What you learn**: Handle semi-structured and nested data types directly in SQL.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Pattern drill | LIST aggregation | Collect all product names per order into a list |
| 2 | Pattern drill | LIST unnesting | Expand a tags list into individual rows |
| 3 | Pattern drill | STRUCT access | Query nested address fields (address.city, address.zip) |
| 4 | Pattern drill | MAP operations | Extract values from key-value metadata |
| 5 | Business scenario | JSON-like processing | Parse and flatten semi-structured event data |

**Skills unlocked**: You handle the nested data formats common in modern data lakes and event streams.

---

### A10. Advanced Engineering Scenarios (3–4 exercises)

**What you learn**: Combine multiple DE patterns to solve realistic pipeline challenges.

| # | Exercise Type | Concepts | Example |
|---|--------------|----------|---------|
| 1 | Business scenario | Medallion architecture | Build a Bronze → Silver → Gold transformation pipeline |
| 2 | Business scenario | Full dimension load | SCD Type 2 + MERGE + data quality validation in one pipeline |
| 3 | Business scenario | Source reconciliation | Validate completeness and accuracy between source and target tables |
| 4 | Business scenario | Pipeline idempotency | Design and test a pipeline that produces identical results on re-run |

**Skills unlocked**: You think in pipelines, not queries — the mindset of a production Data Engineer.

---

## Existing Exercises Mapping

The platform already has 10 exercises. Here's where they fit in this roadmap:

| Existing Exercise | Module |
|-------------------|--------|
| `01-top-n-per-group` | I3. Window Functions: Ranking |
| `02-running-total` | I4. Window Functions: Analytics |
| `03-yoy-growth` | I4. Window Functions: Analytics |
| `04-gap-and-island` | (DA track — Gaps & Islands) |
| `05-employee-hierarchy` | A7. Recursive CTEs |
| `06-date-series` | A7. Recursive CTEs |
| `07-cohort-retention` | (DA track — Cohort Retention) |
| `08-funnel-analysis` | (DA track — Funnel Analysis) |
| `09-consecutive-days` | (DA track — Gaps & Islands) |
| `10-anti-join` | I5. Anti-joins & Set Operations |

**Coverage gap**: All DE-specific modules (B5, B6, I7, A1–A6, A9, A10) need to be built from scratch. The existing exercises cover shared intermediate and some DA-advanced content.

---

## Interview Readiness by Level

| Level | Interview Target |
|-------|-----------------|
| Beginner complete | Junior DE, data operations roles |
| Intermediate complete | Mid-level DE at most companies |
| Advanced complete | Senior DE, FAANG-level interviews |

### DE Interview Topics Covered

| Topic | Module | Tested At |
|-------|--------|-----------|
| Schema design & DDL | B5, B6, I7 | All companies |
| Normalization / denormalization | I7 | All companies |
| Star schema & dimensional modeling | A1 | All companies (warehouse roles) |
| SCD Type 2 | A2 | All companies (warehouse roles) |
| MERGE / UPSERT | A3 | All companies |
| Incremental loads | A4 | Senior roles |
| Query optimization & EXPLAIN | A5 | Senior roles, FAANG |
| Data quality validation | A6 | Senior roles, reliability-focused teams |
| Recursive CTEs | A7 | All companies |
| Window functions (dedup, change detection) | I3, I4 | All companies |
| Semi-structured data | A9 | BigQuery/Snowflake shops |
| Pipeline idempotency | A3, A4, A10 | Senior roles, FAANG |

### Certification Alignment

| Certification | Modules Covered |
|---------------|----------------|
| Google Professional Data Engineer | A1, A5, A6, A8 |
| AWS Certified Data Engineer | A1, A3, A4, A5, A6 |
| Databricks Data Engineer Associate | A1, A2, A3, A8 |
| dbt Analytics Engineering | I2, I7, A1, A2, A3, A6 |
