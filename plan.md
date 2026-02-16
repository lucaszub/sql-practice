# SQL Practice Platform — Vision & Roadmap

## Vision

Build the **best open-source, browser-based SQL practice platform** for aspiring Data Analysts and Data Engineers. No signup, no backend, no paywall — just instant SQL practice powered by DuckDB-WASM.

Two structured career tracks guide learners from their first `SELECT` to production-grade analytical and pipeline SQL, using real-world business scenarios from e-commerce, SaaS, marketing, finance, and product analytics.

## Why This Platform

### Market Gaps Identified

| Gap | Current State | Our Approach |
|-----|---------------|--------------|
| **No career-track structure** | All platforms treat SQL as one monolithic skill | Two distinct paths: Data Analyst & Data Engineer |
| **No DuckDB practice** | 100% of competitors use PostgreSQL/MySQL | DuckDB-WASM with modern SQL features (QUALIFY, ASOF JOIN, LIST/STRUCT, PIVOT) |
| **Paywall on best content** | DataLemur $10/mo, LeetCode Premium, StrataScratch $79+/yr | Fully open-source and free |
| **Setup friction** | Most platforms require accounts, some require local installs | Zero-setup: runs entirely in the browser |
| **Weak validation** | HackerRank uses single test cases | Multi-test-case validation with edge cases |
| **No analytical thinking** | Platforms test syntax, not reasoning | Business-scenario framing: "diagnose why revenue dropped", not "write a JOIN" |
| **No DE-specific SQL** | Only StrataScratch has a limited DE track (75 questions) | Full DE path: data modeling, ETL patterns, optimization, MERGE/UPSERT |

### Competitive Landscape

| Platform | Exercises | Free? | DA Track | DE Track | Engine | Unique Strength |
|----------|-----------|-------|----------|----------|--------|-----------------|
| DataLemur | 200+ | Partial | Yes | No | PostgreSQL | FAANG interview focus |
| LeetCode | ~200 | Partial | General | No | MySQL | Community + gamification |
| HackerRank | ~58 | Yes | General | No | MySQL | Employer certifications |
| StrataScratch | 649+ | Partial | Yes | Limited | Multi | Real company questions |
| SQLZoo | ~100 | Yes | General | No | MariaDB | Learn-by-doing tutorials |
| Mode Analytics | ~50 | Yes | Yes | No | PostgreSQL | Analytical thinking |
| **SQL Practice** | **150+ (target)** | **Yes** | **Yes** | **Yes** | **DuckDB** | **Career tracks + modern SQL + open source** |

### Technical Advantages

- **DuckDB-WASM**: Columnar engine in the browser — mirrors BigQuery/Redshift/Snowflake query patterns
- **Modern SQL syntax**: QUALIFY, GROUP BY ALL, SELECT * EXCLUDE, ASOF JOIN, PIVOT/UNPIVOT
- **Nested types**: LIST, STRUCT, MAP for semi-structured data practice
- **CodeMirror 6**: Professional editor with syntax highlighting and autocomplete
- **TanStack Table**: Rich, virtualized result display
- **Multi-test validation**: Every exercise validated against 2+ test cases including edge cases

---

## Learning Levels

### Level 1 — Beginner (Weeks 1–6)

**Goal**: Write confident SELECT queries, filter, sort, aggregate, and join two tables.

| Module | Key Concepts | Exercises |
|--------|-------------|-----------|
| SELECT Fundamentals | SELECT, WHERE, IN, BETWEEN, LIKE, ORDER BY, LIMIT | 6–8 |
| Aggregation & Grouping | COUNT, SUM, AVG, MIN, MAX, GROUP BY, HAVING | 6–8 |
| Basic Joins | INNER JOIN, LEFT JOIN on two tables | 6–8 |
| Data Manipulation (DE) | CREATE TABLE, INSERT, UPDATE, DELETE, data types | 5–6 |
| NULL & CASE | IS NULL, COALESCE, CASE WHEN, conditional logic | 4–5 |

**Business context**: E-commerce orders, employee databases, simple product catalogs.

### Level 2 — Intermediate (Weeks 6–16)

**Goal**: Decompose complex queries with CTEs, use window functions, handle multi-table scenarios.

| Module | Key Concepts | Exercises |
|--------|-------------|-----------|
| Multi-table Joins | 3+ table joins, self-joins, CROSS JOIN | 6–8 |
| Subqueries & CTEs | Correlated subqueries, CTE decomposition, readability | 6–8 |
| Window Functions: Ranking | ROW_NUMBER, RANK, DENSE_RANK, PARTITION BY | 8–10 |
| Window Functions: Analytics | LAG, LEAD, FIRST_VALUE, LAST_VALUE | 6–8 |
| Anti-joins & Set Operations | NOT EXISTS, EXISTS, UNION, INTERSECT, EXCEPT | 5–6 |
| Date & String Functions | DATE_TRUNC, EXTRACT, DATEDIFF, TRIM, CONCAT | 5–6 |
| Conditional Aggregation | SUM(CASE WHEN), FILTER clause, pivot-style queries | 4–5 |
| Schema Design (DE) | Normalization, constraints, indexes, ALTER TABLE | 5–6 |

**Business context**: SaaS metrics, marketing campaigns, multi-department analytics.

### Level 3 — Advanced (Weeks 16–30+)

**Goal**: Solve real-world analytical and engineering problems with production-grade SQL.

| Module | Key Concepts | Exercises |
|--------|-------------|-----------|
| Running Totals & Moving Averages | Window frames, ROWS BETWEEN, cumulative sums | 5–6 |
| Gaps & Islands | Consecutive sequences, streaks, session detection | 5–6 |
| Cohort Retention | Cohort assignment, period tracking, retention % | 4–5 |
| Funnel Analysis | Step-by-step conversion, time-windowed funnels | 4–5 |
| Recursive CTEs | Hierarchies, graph traversal, date series generation | 5–6 |
| PIVOT / UNPIVOT | Row-to-column transforms, dynamic pivoting | 4–5 |
| DuckDB Modern SQL | QUALIFY, ASOF JOIN, LIST/STRUCT, GROUP BY ALL | 5–6 |
| Data Modeling (DE) | Star schema, snowflake, SCD Type 2 | 5–6 |
| ETL Patterns (DE) | MERGE/UPSERT, incremental loads, idempotent SQL | 5–6 |
| Query Optimization (DE) | EXPLAIN, sargable queries, partitioning | 4–5 |
| Data Quality (DE) | Validation queries, completeness, uniqueness, freshness | 4–5 |

**Business context**: Product analytics (DAU/MAU), subscription revenue (MRR/churn), A/B testing, fraud detection.

---

## Career Tracks

### Data Analyst Track

**Target**: From junior DA writing basic SELECT queries to senior DA running cohort analyses and funnel breakdowns at FAANG-level companies.

**Focus**: Reading data, analytical patterns, business metrics, storytelling with SQL.

**Progression**:
```
Beginner                    Intermediate                     Advanced
────────────────────────    ─────────────────────────────    ──────────────────────────────
SELECT / WHERE / ORDER BY → Multi-table Joins              → Cohort Retention Analysis
Aggregation / GROUP BY    → CTEs & Subqueries              → Funnel Analysis
Basic Joins               → Window Functions (Ranking)     → Gaps & Islands
NULL & CASE               → Window Functions (Analytics)   → A/B Test Metrics
                          → Date & String Functions        → Revenue Metrics (MRR/LTV)
                          → Conditional Aggregation        → RFM Segmentation
                          → Anti-joins & Set Operations    → PIVOT / UNPIVOT
                                                           → DuckDB Modern SQL
```

**~80 exercises** — See [roadmap/data_analyst.md](roadmap/data_analyst.md) for the full path.

### Data Engineer Track

**Target**: From SQL fundamentals to designing schemas, optimizing queries, and writing idempotent pipeline SQL.

**Focus**: Writing data (DDL/DML), data modeling, performance, pipeline patterns, data quality.

**Progression**:
```
Beginner                    Intermediate                     Advanced
────────────────────────    ─────────────────────────────    ──────────────────────────────
SELECT / WHERE / ORDER BY → Multi-table Joins              → Star Schema Design & Queries
Aggregation / GROUP BY    → CTEs & Subqueries              → SCD Type 2 Implementation
Basic Joins               → Window Functions (Ranking)     → MERGE / UPSERT Patterns
DDL & DML Basics          → Schema Design & Constraints    → Incremental Load Patterns
NULL & CASE               → Window Functions (Analytics)   → Query Optimization (EXPLAIN)
                          → Indexing & Performance Basics  → Partitioning Strategies
                          → Date & String Functions        → Data Quality Validation
                          → Anti-joins & Set Operations    → Recursive CTEs
                                                           → DuckDB Modern SQL
                                                           → Nested Data (LIST/STRUCT/MAP)
```

**~85 exercises** — See [roadmap/data_engineer.md](roadmap/data_engineer.md) for the full path.

### Shared Foundation

Both tracks share the Beginner level (except DDL/DML which is DE-only) and the core Intermediate modules (joins, CTEs, window functions). They diverge at the Advanced level where DA focuses on analytical patterns and DE focuses on engineering patterns.

```
                    ┌─────────────────────────┐
                    │    SHARED FOUNDATION    │
                    │  SELECT, Joins, GROUP   │
                    │  BY, CTEs, Window Fns   │
                    └────────────┬────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
          ┌─────────▼─────────┐    ┌─────────▼──────────┐
          │   DATA ANALYST    │    │   DATA ENGINEER     │
          │                   │    │                     │
          │ Cohort Retention  │    │ Star Schema Design  │
          │ Funnel Analysis   │    │ SCD Type 2          │
          │ A/B Test Metrics  │    │ MERGE / UPSERT      │
          │ Revenue (MRR/LTV) │    │ Query Optimization  │
          │ RFM Segmentation  │    │ Data Quality        │
          │ PIVOT / UNPIVOT   │    │ Incremental Loads   │
          │ Gaps & Islands    │    │ Partitioning        │
          └───────────────────┘    └────────────────────┘
```

---

## Exercise Types

Each exercise should follow a consistent pattern:

### By Format

| Type | Description | When to Use |
|------|-------------|-------------|
| **Pattern drill** | Single-concept exercise with clear expected output | Core learning — majority of exercises |
| **Business scenario** | Multi-step problem framed as a real analyst/engineer task | Intermediate & Advanced — test composition |
| **Debugging** | Given a broken query, find and fix the error | Reinforce understanding of common mistakes |
| **Optimization** | Given a working but slow query, improve it | DE track — teach performance thinking |
| **Schema design** | Given a business requirement, write the DDL | DE track — data modeling skills |

### By Business Domain

| Domain | Example Tables | Best For |
|--------|---------------|----------|
| **E-commerce** | orders, customers, products, order_items, returns | Beginner → Intermediate (relatable, intuitive) |
| **SaaS / Subscription** | users, subscriptions, invoices, events, plans | Intermediate → Advanced DA (MRR, churn, cohorts) |
| **Marketing** | campaigns, impressions, clicks, conversions, channels | Intermediate DA (attribution, ROAS, funnels) |
| **Product Analytics** | users, events, sessions, posts, friendships | Advanced DA (DAU/MAU, engagement, retention) |
| **Finance** | transactions, accounts, loans, credit_scores | Advanced DA (fraud detection, YoY growth) |
| **Data Platform** | raw_events, staging_*, dim_*, fact_* | Advanced DE (medallion architecture, ETL) |
| **HR** | employees, departments, salaries, performance | Intermediate (hierarchies, self-joins) |

### By DuckDB Feature

Exercises that highlight DuckDB-specific syntax no other platform teaches:

| Feature | SQL Example | Value |
|---------|-------------|-------|
| `QUALIFY` | `SELECT * FROM t QUALIFY ROW_NUMBER() OVER (...) = 1` | Eliminates boilerplate subqueries |
| `GROUP BY ALL` | `SELECT dept, AVG(salary) FROM emp GROUP BY ALL` | Cleaner syntax |
| `SELECT * EXCLUDE` | `SELECT * EXCLUDE (internal_id, created_at) FROM users` | Column selection |
| `ASOF JOIN` | `SELECT * FROM trades ASOF JOIN quotes USING (ticker, ts)` | Time-series matching |
| `PIVOT` / `UNPIVOT` | `PIVOT sales ON month USING SUM(amount)` | Native pivot support |
| `LIST` / `STRUCT` | `SELECT LIST(name) FROM employees GROUP BY dept` | Semi-structured data |
| `COLUMNS()` | `SELECT COLUMNS('sales_.*') FROM quarterly_report` | Dynamic column selection |

---

## Target Metrics

| Metric | Target |
|--------|--------|
| Total exercises | 150+ (across both tracks) |
| DA track exercises | ~80 |
| DE track exercises | ~85 |
| Shared exercises | ~35 (beginner + core intermediate) |
| Business domains covered | 7 |
| DuckDB-specific exercises | 10–15 |
| Exercises per topic | 4–10 (scaled by importance) |
| Test cases per exercise | 2+ (default + edge case minimum) |

---

## Implementation Principles

1. **No exercise without business context** — Every exercise is framed as a real-world question, not abstract syntax practice
2. **Pattern-first taxonomy** — Exercises teach recognizable SQL patterns (Top-N per group, running total, gap-and-island) that transfer across SQL dialects
3. **Progressive difficulty within topics** — Each topic starts guided, then independent, then challenge-level
4. **DuckDB as differentiator** — Dedicate exercises to modern SQL features unique to DuckDB
5. **Multi-test validation** — Every exercise has 2+ test cases catching edge cases (NULLs, ties, empty results)
6. **Idiomatic solutions** — Solution queries use the most readable, standard approach (CTEs over nested subqueries, window functions over self-joins when cleaner)
7. **Deterministic data** — All schemas use fixed, hand-crafted data — no random generation

---

## Future Enhancements (Not in Scope Now)

- **Skill tree visualization** with prerequisite-based unlocking
- **Streak system** for daily practice engagement
- **Progressive hints** (concept → approach → partial solution)
- **Spaced repetition** engine (SM-2 adapted for SQL patterns)
- **Timed challenges** for interview simulation
- **Community solutions** and discussion
- **Export mastery data** for cross-device sync
