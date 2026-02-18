# Plan: Add Pandas Coding Option (SQL or Pandas toggle)

## Overview

Allow users to solve exercises using either SQL (current behavior) or Python Pandas. A mode toggle in the exercise page lets users switch between the two. Both modes validate against the same expected output (columns + rows), ensuring equivalent learning outcomes.

---

## Architecture Decisions

### Runtime: Pyodide (CPython in WebAssembly)
- Use the official `pyodide` npm package (v0.29.3+)
- Lazy-load Pyodide only when the user selects Pandas mode (no impact on SQL-only users)
- Run in a **Web Worker** to keep UI responsive (mirrors DuckDB-WASM pattern)
- Pre-load `pandas` and `numpy` packages on first Pandas mode activation
- Cache via browser (CDN-served WASM, ~17 MB download on first use)

### Data Flow: SQL schema → Pandas DataFrames
- Reuse DuckDB to load the exercise schema (already working)
- Export each table as JSON from DuckDB (`SELECT * FROM table_name`)
- Pass JSON to Pyodide Web Worker
- In Python: `pd.DataFrame(json_data)` for each table, injected as globals
- User writes Pandas code; the last expression or variable named `result` is returned
- Convert result DataFrame to `{columns: [...], rows: [...]}` → same `QueryResult` format → same validator

### Editor: CodeMirror 6 with Python support
- Add `@codemirror/lang-python` for syntax highlighting
- New `PandasEditor` component (or extend `SqlEditor` to support both)
- Same keyboard shortcut (Ctrl+Enter) to submit

---

## Implementation Steps

### Phase 1: Pyodide Infrastructure (`src/lib/pyodide/`)

**Step 1.1 — Install dependencies**
```bash
pnpm add pyodide @codemirror/lang-python
```

**Step 1.2 — Pyodide Web Worker (`src/lib/pyodide/pyodide.worker.ts`)**

Create a Web Worker that:
- Loads Pyodide from CDN
- Loads pandas + numpy packages
- Accepts messages: `{ type: 'init' }`, `{ type: 'loadData', tables: {...} }`, `{ type: 'run', code: string }`
- Returns: `{ type: 'result', data: QueryResult }` or `{ type: 'error', message: string }`

The worker handles:
1. `init` → `loadPyodide()` + `pyodide.loadPackage(['pandas', 'numpy'])`
2. `loadData` → For each table name/data pair, create a `pd.DataFrame` in the Python global scope
3. `run` → Execute user code, extract the `result` variable (must be a DataFrame), convert to JSON

**Step 1.3 — Pyodide singleton (`src/lib/pyodide/pyodide-client.ts`)**

Mirror `src/lib/db/duckdb.ts` pattern:
```typescript
"use client";

let worker: Worker | null = null;
let initializing: Promise<Worker> | null = null;
let ready = false;

export async function getPyodideWorker(): Promise<Worker> { ... }
export async function initPyodide(): Promise<void> { ... }
export async function loadTablesIntoPandas(tables: Record<string, unknown[]>): Promise<void> { ... }
export async function executePandas(code: string): Promise<QueryResult> { ... }
```

**Step 1.4 — Pandas query runner (`src/lib/pyodide/pandas-runner.ts`)**

```typescript
export async function executePandasQuery(
  db: AsyncDuckDB,
  schema: string,
  userCode: string
): Promise<QueryResult>
```

This function:
1. Queries DuckDB for table names: `SELECT table_name FROM information_schema.tables`
2. For each table, exports data: `SELECT * FROM <table>` → JSON rows
3. Sends tables to Pyodide worker via `loadTablesIntoPandas()`
4. Executes user code via `executePandas(userCode)`
5. Returns `QueryResult` (same format as SQL)

---

### Phase 2: Exercise Type & Data Model Changes

**Step 2.1 — Add Pandas fields to `Exercise` type (`src/lib/exercises/types.ts`)**

```typescript
export type CodingMode = "sql" | "pandas";

export interface Exercise {
  // ... existing fields ...

  // New optional Pandas fields
  solutionPandas?: string;           // Reference Pandas solution
  solutionPandasExplanation?: string;
  solutionPandasExplanationFr?: string;
  pandasHint?: string;               // Pandas-specific hint
  pandasHintFr?: string;
  pandasSetup?: string;              // Optional: extra Python code run before user code
}
```

No change to `TestCase` — validation is the same (compare columns + rows).

**Step 2.2 — Add `CodingMode` to exercise session store (`src/lib/store/exercise-session.ts`)**

```typescript
interface ExerciseSessionState {
  // ... existing fields ...
  codingMode: CodingMode;
  currentPandas: string;          // Pandas editor content
  pyodideReady: boolean;          // Pyodide initialization status
  pyodideLoading: boolean;        // Loading indicator

  setCodingMode(mode: CodingMode): void;
  setPandas(code: string): void;
  setPyodideReady(ready: boolean): void;
  setPyodideLoading(loading: boolean): void;
}
```

**Step 2.3 — Update progress store (`src/lib/store/progress.ts`)**

```typescript
interface ExerciseProgress {
  solved: boolean;
  solvedModes?: CodingMode[];       // Track which modes the user solved with
  lastAttempt?: string;
  lastAttemptPandas?: string;       // Last Pandas attempt
  attempts: number;
  solvedAt?: string;
}
```

An exercise counts as "solved" if solved in either mode. `solvedModes` tracks which modes were used (for badges/stats).

---

### Phase 3: UI Components

**Step 3.1 — Mode toggle component (`src/components/mode-toggle.tsx`)**

A segmented control / toggle button in the exercise header:
- `[SQL] [Pandas]`
- Defaults to SQL
- When switching to Pandas for the first time: trigger Pyodide init (show loading indicator)
- Persists choice in session store (not across exercises — each exercise starts on SQL)

**Step 3.2 — Python editor component (`src/components/python-editor.tsx`)**

Same interface as `SqlEditor` but with Python language support:
```typescript
interface PythonEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  isRunning: boolean;
  isLoading: boolean;        // Pyodide still initializing
}
```

Uses `@codemirror/lang-python` instead of `@codemirror/lang-sql`.

Shows a loading overlay when Pyodide is initializing ("Loading Python runtime...").

Includes a helper comment at the top:
```python
# Available DataFrames: orders, customers, products, ...
# Your result must be stored in a variable named `result`
# Example: result = orders.groupby('status').size().reset_index(name='count')
```

**Step 3.3 — Update exercise page (`src/app/exercise/[id]/page.tsx`)**

- Add mode toggle to header (between title and nav buttons)
- Conditionally render `SqlEditor` or `PythonEditor` based on `codingMode`
- Route `handleRun` to either SQL execution or Pandas execution
- Show "Pandas not available yet" if exercise has no `solutionPandas` (Phase 5)
  - Actually, all exercises can be solved in Pandas since validation is data-based
  - But solution/hint won't be available in Pandas mode for exercises without `solutionPandas`

**Step 3.4 — Update solution panel (`src/components/solution-panel.tsx`)**

- When in Pandas mode: show `solutionPandas` + `solutionPandasExplanation` if available
- If not available: show a message "Pandas solution not yet available for this exercise. Try writing your own!"
- Switch syntax highlighting between SQL and Python based on mode

**Step 3.5 — Update exercise description (`src/components/exercise-description.tsx`)**

- When in Pandas mode: show `pandasHint` if available, else fall back to generic hint
- Add a "Available DataFrames" section showing table names and columns (parsed from schema)
- Add a brief Pandas tips section for beginners

---

### Phase 4: Execution & Validation Pipeline

**Step 4.1 — Pandas execution in exercise page**

```typescript
const handleRunPandas = useCallback(async () => {
  if (!db || !exercise || isRunning) return;
  setIsRunning(true);

  try {
    // 1. Ensure Pyodide is ready
    await initPyodide();

    // 2. For each test case:
    for (const tc of exercise.testCases) {
      // a. Reset DuckDB schema (+ setupSql if needed)
      await resetSchema(db, exercise.schema);
      if (tc.setupSql) await loadSchema(db, tc.setupSql);

      // b. Export tables from DuckDB → JSON
      // c. Load into Pandas
      // d. Execute user code
      // e. Validate result
    }
  } catch (err) { ... }
}, [...]);
```

**Step 4.2 — Result conversion in worker**

The worker extracts the `result` variable from Python:
```python
import json
if isinstance(result, pd.DataFrame):
    columns = result.columns.tolist()
    rows = json.loads(result.to_json(orient='records', date_format='iso'))
```

This produces the same `{ columns, rows }` structure that `validateResult()` expects.

---

### Phase 5: i18n Updates

**Step 5.1 — Add translation keys (`src/lib/i18n/translations.ts`)**

```typescript
"exercise.modeSql": { en: "SQL", fr: "SQL" },
"exercise.modePandas": { en: "Pandas", fr: "Pandas" },
"exercise.pyodideLoading": { en: "Loading Python runtime...", fr: "Chargement de Python..." },
"exercise.pyodideReady": { en: "Python ready", fr: "Python prêt" },
"exercise.pandasSolutionNotAvailable": {
  en: "Pandas solution not yet available for this exercise.",
  fr: "La solution Pandas n'est pas encore disponible pour cet exercice."
},
"exercise.pandasResultVar": {
  en: "Store your result in a variable named `result`",
  fr: "Stockez votre résultat dans une variable nommée `result`"
},
"exercise.availableDataframes": {
  en: "Available DataFrames",
  fr: "DataFrames disponibles"
},
```

---

### Phase 6: Add Pandas Solutions to Exercises (Incremental)

This is a content task that can be done incrementally after the feature ships:

- Start with 5-10 beginner exercises (B1-B2 modules) to validate the UX
- Add `solutionPandas` + `solutionPandasExplanation` fields
- Pattern: each SQL pattern maps to a Pandas equivalent:
  - `SELECT ... WHERE` → `df[df['col'] > val]`
  - `GROUP BY` → `df.groupby('col').agg(...)`
  - `JOIN` → `pd.merge(df1, df2, on='key')`
  - `WINDOW FUNCTIONS` → `df.groupby('col')['val'].transform('rank')`
  - etc.

---

## File Change Summary

| File | Action | Description |
|------|--------|-------------|
| `package.json` | modify | Add `pyodide`, `@codemirror/lang-python` |
| `next.config.ts` | modify | Add webpack config for Pyodide WASM files |
| `src/lib/exercises/types.ts` | modify | Add `CodingMode`, Pandas fields to `Exercise` |
| `src/lib/pyodide/pyodide.worker.ts` | **new** | Web Worker for Pyodide execution |
| `src/lib/pyodide/pyodide-client.ts` | **new** | Singleton client (mirrors duckdb.ts) |
| `src/lib/pyodide/pandas-runner.ts` | **new** | Orchestrates DuckDB export → Pandas execution |
| `src/lib/store/exercise-session.ts` | modify | Add `codingMode`, `currentPandas`, pyodide state |
| `src/lib/store/progress.ts` | modify | Add `solvedModes`, `lastAttemptPandas` |
| `src/components/python-editor.tsx` | **new** | CodeMirror with Python language |
| `src/components/mode-toggle.tsx` | **new** | SQL/Pandas segmented control |
| `src/components/sql-editor.tsx` | minor | Extract shared editor logic if needed |
| `src/components/exercise-description.tsx` | modify | Pandas hints, available DataFrames |
| `src/components/solution-panel.tsx` | modify | Show Pandas solution when in Pandas mode |
| `src/app/exercise/[id]/page.tsx` | modify | Mode toggle, conditional editor, dual execution |
| `src/lib/i18n/translations.ts` | modify | Add Pandas-related translation keys |

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Bundle size** (~17 MB for Pyodide+Pandas) | Slow first load for Pandas users | Lazy-load only when Pandas mode is selected; CDN caching |
| **Pyodide init time** (5-15s first time) | UX feels slow | Show clear loading indicator; preload on toggle hover; cache in Service Worker |
| **Next.js + Pyodide webpack conflicts** | Build failures | Use CDN loading (bypass webpack); `'use client'` directives |
| **Data type mismatches** (Pandas vs DuckDB) | Validation failures on correct code | Normalize dates, numbers, NULLs in the worker before comparison |
| **Python code security** | Users can run arbitrary Python | Pyodide runs in browser sandbox (same-origin); no server risk |
| **Memory usage** | Large DataFrames + Pyodide overhead | Exercise schemas are small (10-30 rows); not a real concern |

---

## Implementation Order (recommended)

1. **Phase 1** (infrastructure) — Pyodide worker + client + runner
2. **Phase 2** (data model) — Types + stores
3. **Phase 3** (UI) — Editor + toggle + page integration
4. **Phase 4** (execution) — Wire up Pandas execution pipeline
5. **Phase 5** (i18n) — Translations (small, do alongside Phase 3)
6. **Phase 6** (content) — Add Pandas solutions to exercises incrementally
