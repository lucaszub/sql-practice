# Plan: Pandas Track — A Third Learning Path

## Overview

Add a **Pandas track** as a third career path alongside Data Analyst (SQL) and Data Engineer (SQL). Users get a dedicated `/roadmap/pandas` page with its own module progression from basic DataFrame operations to advanced analytics patterns. Exercises can be solved in **SQL or Pandas** — a toggle on each exercise lets users switch modes.

The Pandas roadmap teaches Pandas idioms in a structured way, not just "translate SQL to Pandas". It has its own logic: filtering → selection → groupby → merge → reshaping → window ops → performance.

---

## Pandas Roadmap: Module Breakdown (~60 exercises)

### Beginner (4 modules, ~20 exercises)

#### PB1 — DataFrame Basics
**Goal**: Load data, inspect structure, select columns.
| # | Exercise Idea | Key Concepts |
|---|---------------|-------------|
| 1 | Display first 10 orders | `df.head()`, `df.shape`, `df.info()` |
| 2 | Select specific columns from customers table | `df[['col1', 'col2']]`, `df.col` |
| 3 | Get unique product categories | `df['col'].unique()`, `df['col'].nunique()` |
| 4 | Check data types and missing values | `df.dtypes`, `df.isna().sum()` |
| 5 | Rename columns for a clean report | `df.rename(columns={...})` |

**Skills**: `head`, `shape`, `columns`, `dtypes`, `info`, `unique`, `rename`
**Icon**: `🐼`
**Prerequisites**: none

#### PB2 — Filtering & Boolean Indexing
**Goal**: Filter rows using conditions, combine filters.
| # | Exercise Idea | Key Concepts |
|---|---------------|-------------|
| 1 | Find orders above $100 | `df[df['amount'] > 100]` |
| 2 | Filter products in specific categories | `df[df['cat'].isin([...])]` |
| 3 | Find orders in a date range | `df[(df['date'] >= ...) & (df['date'] <= ...)]` |
| 4 | Search product names containing a keyword | `df[df['name'].str.contains('...')]` |
| 5 | Combine multiple conditions (AND/OR) | `&`, `|`, `~` operators |
| 6 | Find customers with missing email | `df[df['email'].isna()]` |

**Skills**: boolean indexing, `isin`, `str.contains`, `isna`, `between`, `&`/`|`/`~`
**Icon**: `🔍`
**Prerequisites**: `PB1`

#### PB3 — Sorting & Top-N
**Goal**: Sort data, get top/bottom results.
| # | Exercise Idea | Key Concepts |
|---|---------------|-------------|
| 1 | Sort orders by date descending | `df.sort_values('col', ascending=False)` |
| 2 | Top 5 customers by total spend | `df.nlargest(5, 'col')` |
| 3 | Bottom 3 products by rating | `df.nsmallest(3, 'col')` |
| 4 | Sort by multiple columns | `df.sort_values(['col1', 'col2'])` |
| 5 | Reset index after sorting | `df.reset_index(drop=True)` |

**Skills**: `sort_values`, `nlargest`, `nsmallest`, `head`, `reset_index`
**Icon**: `📊`
**Prerequisites**: `PB2`

#### PB4 — Basic Aggregation
**Goal**: Summarize data with groupby and aggregate functions.
| # | Exercise Idea | Key Concepts |
|---|---------------|-------------|
| 1 | Count orders per status | `df.groupby('status').size()` |
| 2 | Total revenue per product category | `df.groupby('cat')['amount'].sum()` |
| 3 | Average order value per customer | `df.groupby('customer_id')['amount'].mean()` |
| 4 | Multiple aggregations at once | `df.groupby(...).agg({'col': ['sum', 'mean']})` |
| 5 | Filter groups (equivalent of HAVING) | `grouped.filter(lambda g: g['amount'].sum() > 1000)` |

**Skills**: `groupby`, `size`, `sum`, `mean`, `count`, `agg`, `filter`
**Icon**: `📈`
**Prerequisites**: `PB2`

---

### Intermediate (5 modules, ~25 exercises)

#### PI1 — Merge & Join
**Goal**: Combine DataFrames like SQL JOINs.
| # | Exercise Idea | Key Concepts |
|---|---------------|-------------|
| 1 | Join orders with customer names | `pd.merge(orders, customers, on='customer_id')` |
| 2 | Left join to find customers without orders | `pd.merge(..., how='left')` + `isna()` |
| 3 | Join three tables (orders + products + categories) | chained `merge()` |
| 4 | Merge on different column names | `left_on=`, `right_on=` |
| 5 | Anti-join: products never ordered | merge + filter `_merge == 'left_only'` with `indicator=True` |

**Skills**: `pd.merge`, `how=`, `on=`, `left_on/right_on`, `indicator`, `suffixes`
**Icon**: `🔗`
**Prerequisites**: `PB4`

#### PI2 — String & DateTime Operations
**Goal**: Manipulate text and dates.
| # | Exercise Idea | Key Concepts |
|---|---------------|-------------|
| 1 | Extract month from order dates | `df['date'].dt.month` |
| 2 | Truncate to monthly periods | `df['date'].dt.to_period('M')` |
| 3 | Calculate days between order and delivery | `(df['delivery'] - df['order']).dt.days` |
| 4 | Clean product names (lowercase, strip) | `df['name'].str.lower().str.strip()` |
| 5 | Extract domain from email addresses | `df['email'].str.split('@').str[1]` |

**Skills**: `.dt.`, `.str.`, `to_datetime`, `dt.days`, `str.split`, `str.extract`
**Icon**: `📅`
**Prerequisites**: `PB3`

#### PI3 — Missing Data & Cleaning
**Goal**: Handle NaN, fill values, deduplicate.
| # | Exercise Idea | Key Concepts |
|---|---------------|-------------|
| 1 | Fill missing prices with category average | `df.groupby('cat')['price'].transform(...)` + `fillna()` |
| 2 | Drop rows where critical columns are null | `df.dropna(subset=['col1', 'col2'])` |
| 3 | Remove duplicate customer records (keep latest) | `df.sort_values('date').drop_duplicates('email', keep='last')` |
| 4 | Replace sentinel values (-1, 'N/A') with NaN | `df.replace({-1: np.nan, 'N/A': np.nan})` |
| 5 | Forward-fill time series gaps | `df.set_index('date').resample('D').ffill()` |

**Skills**: `fillna`, `dropna`, `drop_duplicates`, `replace`, `interpolate`, `ffill`
**Icon**: `🧹`
**Prerequisites**: `PB4`

#### PI4 — Advanced GroupBy & Transform
**Goal**: Complex aggregations, transform, apply.
| # | Exercise Idea | Key Concepts |
|---|---------------|-------------|
| 1 | Percentage of total per category | `transform('sum')` for group totals |
| 2 | Rank products within each category | `df.groupby('cat')['sales'].rank(method='dense')` |
| 3 | Custom aggregation function | `.agg(lambda x: ...)` or named agg |
| 4 | Multiple named aggregations | `.agg(total=('amount', 'sum'), avg=('amount', 'mean'))` |
| 5 | Cross-tabulation (counts by 2 dimensions) | `pd.crosstab(df['region'], df['status'])` |

**Skills**: `transform`, `rank`, `apply`, named agg, `crosstab`, `value_counts`
**Icon**: `🔢`
**Prerequisites**: `PI1`, `PI3`

#### PI5 — Reshaping: Pivot & Melt
**Goal**: Transform data between wide and long formats.
| # | Exercise Idea | Key Concepts |
|---|---------------|-------------|
| 1 | Monthly revenue pivot table | `df.pivot_table(values='amount', index='month', columns='category')` |
| 2 | Unpivot quarterly columns to rows | `pd.melt(df, id_vars=['product'], value_vars=['Q1','Q2','Q3','Q4'])` |
| 3 | Multi-level pivot (region × product × metric) | `pivot_table` with `aggfunc` |
| 4 | Stack/unstack multi-index | `df.set_index([...]).unstack()` |
| 5 | Create a summary with margins (totals row/col) | `pivot_table(..., margins=True)` |

**Skills**: `pivot_table`, `melt`, `stack`, `unstack`, `margins`, `aggfunc`
**Icon**: `🔄`
**Prerequisites**: `PI4`

---

### Advanced (4 modules, ~18 exercises)

#### PA1 — Window Operations (Rolling, Shift, Rank)
**Goal**: Pandas equivalent of SQL window functions.
| # | Exercise Idea | Key Concepts |
|---|---------------|-------------|
| 1 | Running total of daily revenue | `df['amount'].cumsum()` |
| 2 | 7-day moving average of orders | `df['orders'].rolling(7).mean()` |
| 3 | Month-over-month growth rate | `df['revenue'].pct_change()` |
| 4 | Previous month comparison with shift | `df['revenue'].shift(1)` |
| 5 | Expanding max (all-time high) | `df['price'].expanding().max()` |

**Skills**: `cumsum`, `rolling`, `expanding`, `shift`, `pct_change`, `rank`
**Icon**: `📉`
**Prerequisites**: `PI4`

#### PA2 — Consecutive Patterns & Complex Logic
**Goal**: Gaps, islands, streaks — the Pandas way.
| # | Exercise Idea | Key Concepts |
|---|---------------|-------------|
| 1 | Detect login streaks (consecutive days) | `diff() + cumsum()` grouping trick |
| 2 | Find gaps in daily data | date range comparison |
| 3 | Session detection (30-min inactivity gap) | `diff() > threshold` → `cumsum()` |
| 4 | Longest winning streak per player | group consecutive, count max |

**Skills**: `diff`, `cumsum`, `shift`, boolean grouping, gap detection
**Icon**: `🏝️`
**Prerequisites**: `PA1`

#### PA3 — Multi-DataFrame & Concat
**Goal**: Complex merges, concat, combine operations.
| # | Exercise Idea | Key Concepts |
|---|---------------|-------------|
| 1 | Combine monthly CSV files into one DataFrame | `pd.concat([df1, df2, df3])` |
| 2 | Update master table with new data (upsert-style) | `combine_first` / index-based merge |
| 3 | Compare two snapshots and find changes | merge with indicator + diff |
| 4 | Merge-asof: match trades to closest quote | `pd.merge_asof(trades, quotes, on='timestamp')` |

**Skills**: `pd.concat`, `combine_first`, `merge_asof`, `compare`, `indicator`
**Icon**: `📦`
**Prerequisites**: `PI1`

#### PA4 — Performance & Method Chaining
**Goal**: Write idiomatic, efficient Pandas code.
| # | Exercise Idea | Key Concepts |
|---|---------------|-------------|
| 1 | Rewrite `.apply()` as vectorized operations | vectorized `np.where` vs `apply` |
| 2 | Chain operations with `.pipe()` | `df.pipe(clean).pipe(transform).pipe(aggregate)` |
| 3 | Use `.query()` for readable filters | `df.query('amount > 100 and status == "shipped"')` |
| 4 | Optimize memory with category dtype | `df['status'].astype('category')` |
| 5 | Method chaining: full ETL in one expression | `.assign().query().groupby().agg().reset_index()` |

**Skills**: `pipe`, `assign`, `query`, `eval`, vectorization, `astype('category')`
**Icon**: `⚡`
**Prerequisites**: `PA1`, `PA3`

---

## Roadmap Summary

```
                    PANDAS TRACK (~60 exercises)

 Beginner                Intermediate              Advanced
 ────────────            ──────────────            ───────────
 PB1 DataFrame Basics    PI1 Merge & Join          PA1 Window Ops
 PB2 Filtering           PI2 String & DateTime     PA2 Gaps & Islands
 PB3 Sorting & Top-N     PI3 Missing Data          PA3 Multi-DataFrame
 PB4 Basic Aggregation   PI4 Advanced GroupBy      PA4 Performance
                          PI5 Pivot & Melt

 Prerequisite chain:
 PB1 → PB2 → PB3
              PB2 → PB4 → PI1 → PI4 → PA1 → PA2
                          PI1 → PA3 → PA4
              PB3 → PI2
              PB4 → PI3 → PI4 → PI5
```

---

## Architecture & Implementation

### Runtime: Pyodide (CPython in WebAssembly)
- Official `pyodide` npm package (v0.29.3+)
- **Lazy-loaded**: only when user opens the Pandas roadmap or toggles to Pandas mode
- Runs in a **Web Worker** (mirrors DuckDB-WASM singleton pattern)
- Pre-loads `pandas` + `numpy` (~17 MB first download, cached after)

### Data Flow
```
Exercise schema (SQL) → DuckDB loads tables → Export as JSON
    → Pyodide Web Worker → pd.DataFrame(json) per table
    → User writes Pandas code → `result` variable extracted
    → Convert to {columns, rows} → Same validator as SQL
```

### Exercise Model Changes (`src/lib/exercises/types.ts`)
```typescript
export type CodingMode = "sql" | "pandas";

export interface Exercise {
  // ... existing fields ...
  supportedModes?: CodingMode[];           // default: ["sql"], pandas exercises: ["pandas"] or ["sql", "pandas"]
  solutionPandas?: string;                 // Reference Pandas solution
  solutionPandasExplanation?: string;
  solutionPandasExplanationFr?: string;
  pandasHint?: string;
  pandasHintFr?: string;
}
```

### New Track Definition (`src/lib/exercises/modules.ts`)
```typescript
export const pandasTrack: Track = {
  id: "pandas",
  name: "Pandas",
  description: "Master data manipulation with Python Pandas: from DataFrame basics to advanced analytics patterns. ~60 exercises across 13 modules.",
  modules: [
    { id: "PB1", name: "DataFrame Basics", level: "beginner", ... },
    { id: "PB2", name: "Filtering & Boolean Indexing", level: "beginner", ... },
    // ...
  ],
};
```

### Exercise Page: Mode Toggle
- Exercises tagged `["sql", "pandas"]` show a `[SQL] [Pandas]` toggle
- Exercises tagged `["pandas"]` only (Pandas-specific) go straight to Python editor
- Exercises tagged `["sql"]` only (DDL/DML, DuckDB-specific) have no toggle

### New Files

| File | Description |
|------|-------------|
| `src/lib/pyodide/pyodide.worker.ts` | Web Worker: loads Pyodide, runs Python |
| `src/lib/pyodide/pyodide-client.ts` | Singleton client (init, loadData, execute) |
| `src/lib/pyodide/pandas-runner.ts` | DuckDB export → Pyodide bridge |
| `src/components/python-editor.tsx` | CodeMirror 6 with Python language |
| `src/components/coding-mode-toggle.tsx` | SQL/Pandas segmented toggle |
| `src/app/(main)/roadmap/pandas/page.tsx` | Pandas roadmap page |
| `roadmap/pandas.md` | Full Pandas roadmap spec document |
| `src/exercises/pd-{N}-{slug}/exercise.ts` | Pandas exercises (ID prefix: `pd-`) |

### Modified Files

| File | Changes |
|------|---------|
| `src/lib/exercises/types.ts` | Add `CodingMode`, `supportedModes`, Pandas fields |
| `src/lib/exercises/modules.ts` | Add `pandasTrack` |
| `src/lib/exercises/index.ts` | Register Pandas exercises |
| `src/lib/store/exercise-session.ts` | Add `codingMode`, `currentPandas` |
| `src/lib/store/progress.ts` | Add `solvedModes`, `lastAttemptPandas` |
| `src/app/exercise/[id]/page.tsx` | Mode toggle, conditional editor, dual execution path |
| `src/app/(main)/page.tsx` | Add Pandas track card/link to home page |
| `src/app/(main)/layout.tsx` | Add Pandas to navigation |
| `src/lib/i18n/translations.ts` | Pandas-related translation keys |
| `src/components/exercise-description.tsx` | Show available DataFrames in Pandas mode |
| `package.json` | Add `pyodide`, `@codemirror/lang-python` |
| `next.config.ts` | Pyodide WASM configuration |

---

## Shared Exercises Strategy

Some exercises can appear in **both SQL and Pandas roadmaps** (same data, same business question, different solution language):

| SQL Module | Pandas Module | Shared Exercises |
|------------|---------------|-----------------|
| B1 SELECT Fundamentals | PB2 Filtering | Filter-based exercises |
| B2 Aggregation | PB4 Basic Aggregation | GroupBy exercises |
| B3 Basic Joins | PI1 Merge & Join | Join exercises |
| I3 Window Ranking | PI4 Advanced GroupBy | Ranking exercises |
| A1 Running Totals | PA1 Window Ops | cumsum/rolling exercises |
| A2 Gaps & Islands | PA2 Consecutive Patterns | Streak exercises |

For shared exercises, `supportedModes: ["sql", "pandas"]` with both `solutionQuery` and `solutionPandas` populated.

Pandas-only exercises (e.g., method chaining, `.pipe()`, `astype('category')`) have `supportedModes: ["pandas"]`.

---

## Implementation Phases

### Phase 1: Infrastructure
1. Install `pyodide` + `@codemirror/lang-python`
2. Create Pyodide Web Worker + singleton client + runner
3. Configure Next.js for Pyodide WASM
4. Create `PythonEditor` component

### Phase 2: Data Model & Track
1. Update `Exercise` type with Pandas fields + `supportedModes`
2. Define `pandasTrack` in `modules.ts`
3. Update stores (exercise-session, progress)
4. Add i18n keys

### Phase 3: UI & Routing
1. Create `/roadmap/pandas` page (copy pattern from DA/DE)
2. Add `CodingModeToggle` component
3. Update exercise page with dual execution
4. Add Pandas to navigation + home page

### Phase 4: Content — Beginner Exercises (~20)
1. Create PB1 exercises (5): DataFrame basics
2. Create PB2 exercises (6): filtering
3. Create PB3 exercises (5): sorting
4. Create PB4 exercises (5): basic aggregation
5. Add `solutionPandas` to shared B1/B2 SQL exercises

### Phase 5: Content — Intermediate + Advanced (~40)
1. Create PI1-PI5 exercises
2. Create PA1-PA4 exercises
3. Add `solutionPandas` to more shared SQL exercises

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| **17 MB Pyodide download** | Lazy-load only on Pandas mode; CDN caching; show loading progress |
| **5-15s init time** | Loading indicator; preload on roadmap page hover; Service Worker cache |
| **Next.js + Pyodide webpack** | CDN loading bypasses webpack; `'use client'` |
| **Type mismatches (Pandas vs DuckDB)** | Normalize dates/numbers/NULLs in worker before validation |
| **Scope creep** | Ship beginner modules first (Phase 4), iterate |
