---
name: improve-tests
description: Verify exercise solutions against ALL test cases using native DuckDB, diagnose and fix mismatches
user_invocable: true
argument-hint: "[exercise-id] (optional — omit to verify all exercises)"
---

# improve-tests

Verifies that every exercise's `solutionQuery` actually produces the correct `expectedRows` for ALL test cases by running them against native DuckDB. Diagnoses and fixes any mismatches.

## Arguments

- `$ARGUMENTS[0]` — (optional) Exercise ID (e.g., `11-select-where-basics`). If omitted, verifies all exercises.

## Why This Skill Exists

The unit tests (`exercise.test.ts`) are boilerplate — they only pass the *expected* data through the validator, they never actually run the SQL. The integration test (`exercises.integration.test.ts`) only checks `testCases[0]`. This skill fills the gap: run the solution against DuckDB for **every** test case and fix discrepancies.

## Workflow

### Phase 1: Identify target exercises

1. If an exercise ID was provided, find `src/exercises/{id}/exercise.ts`
2. If no ID, list all `src/exercises/*/exercise.ts`

### Phase 2: Run integration test first (quick smoke test)

Run the existing integration test to get a baseline:

```bash
# Single exercise:
pnpm test:integration -- --reporter=verbose 2>&1 | grep -E "(PASS|FAIL|✓|×|❌)" | head -30

# Or for a specific exercise, just read the output:
pnpm test:integration -- --reporter=verbose
```

If the integration test passes for an exercise, its `testCases[0]` is already correct. Move on to testing other test cases.

### Phase 3: Verify ALL test cases (the core workflow)

For each target exercise, for each test case (`testCases[0]`, `testCases[1]`, ...):

**Step 1 — Read the exercise file** to understand schema, solutionQuery, and all test cases.

**Step 2 — Build a verification SQL script** and run it. For each test case, create a script that:

```sql
-- 1. Set up the schema
{exercise.schema}

-- 2. Apply test case setupSql (if any)
{testCase.setupSql ?? ''}

-- 3. Run the solution query
{exercise.solutionQuery}
```

Run this via `pnpm test:integration` or a one-off Node.js DuckDB script:

```bash
node -e "
const duckdb = require('duckdb');
const db = new duckdb.Database(':memory:');
const schema = \`SCHEMA_SQL_HERE\`;
const setupSql = \`SETUP_SQL_HERE\`;
const solution = \`SOLUTION_SQL_HERE\`;
db.exec(schema, (err) => {
  if (err) { console.error('Schema error:', err); process.exit(1); }
  const next = setupSql ? () => db.exec(setupSql, runQuery) : runQuery;
  function runQuery(err) {
    if (err) { console.error('Setup error:', err); process.exit(1); }
    db.all(solution, (err, rows) => {
      if (err) { console.error('Query error:', err); process.exit(1); }
      console.log(JSON.stringify(rows, (k,v) => typeof v === 'bigint' ? Number(v) : v, 2));
      db.close();
    });
  }
  next();
});
"
```

**Step 3 — Compare actual output vs expectedRows**

For each test case, compare:
- **Column names**: actual column names (from query output) vs `testCase.expectedColumns`
- **Row count**: actual row count vs `testCase.expectedRows.length`
- **Row values**: each row's values, accounting for:
  - DATE columns: DuckDB returns JS Date objects → format as `"YYYY-MM-DD"`
  - TIMESTAMP columns: format as `"YYYY-MM-DD HH:MM:SS"`
  - BIGINT: convert to Number
  - DECIMAL: should already be number
  - Float tolerance: ±0.0001
  - NULL: must match exactly

### Phase 4: Diagnose mismatches

When actual output ≠ expected output, determine the root cause:

**Decision tree:**

1. **Column mismatch** → The solutionQuery uses wrong aliases. Fix the `SELECT ... AS` clauses.

2. **Row count mismatch** →
   - If actual has MORE rows → solutionQuery is missing a WHERE/HAVING filter, or test data has rows the expected doesn't account for
   - If actual has FEWER rows → solutionQuery over-filters, or setupSql doesn't insert enough data

3. **Value mismatch** →
   - **Rounding issue**: Expected has `185.71` but actual is `185.714...` → Fix expectedRows to use correct rounding (ROUND in query or correct decimal in expected)
   - **Sort order issue**: Rows are correct but in wrong order → Check `orderMatters` flag. If true, fix the ORDER BY. If false, no issue.
   - **Date format issue**: Expected has `"2024-01-01"` but actual is `"2024-01-01 00:00:00"` → The validator normalizes midnight timestamps, but double-check
   - **Calculation error in expectedRows**: The human who wrote the expected data did the math wrong → Fix the expectedRows to match what the correct SQL actually produces
   - **Bug in solutionQuery**: The SQL logic is wrong → Fix the solutionQuery

**Key principle**: The `solutionQuery` is the **source of truth** for the SQL logic. If the query is correct SQL that answers the business question, then `expectedRows` must match it. Only fix the solutionQuery if it genuinely doesn't answer the exercise's business question.

### Phase 5: Apply fixes

Based on diagnosis:

1. **Fix expectedRows** (most common): Update the test case's `expectedRows` array in `exercise.ts` to match what the correct solutionQuery actually returns
2. **Fix solutionQuery** (rare): Only if the SQL logic is genuinely wrong
3. **Fix schema data** (rare): Only if the INSERT data has errors that make the exercise unsolvable
4. **Fix setupSql** (for non-default test cases): Ensure it creates the right scenario

### Phase 6: Re-verify

After every fix, re-run Phase 3 for that exercise to confirm all test cases pass:

```bash
pnpm test:integration -- --reporter=verbose
```

Also run the unit tests:

```bash
pnpm test -- src/exercises/{id}/exercise.test.ts
```

### Phase 7: Report

For each exercise, report:

```
Exercise ID     | Test Case  | Status | Issue (if any)               | Fix Applied
----------------|------------|--------|------------------------------|------------------
11-select-where | default    | PASS   | —                            | —
11-select-where | edge-null  | FAIL→FIX | expectedRows had wrong sum | Fixed row 3: 185.71 → 171.43
```

## Common Pitfalls

1. **Don't trust expectedRows blindly** — they were written by hand and may have calculation errors. Always run the SQL to get actual values.
2. **Multiple test cases share the same solutionQuery** — if testCase[1] has `setupSql` that modifies data, the same solution must work on modified data too.
3. **DuckDB date handling**: Native Node DuckDB returns JS Date objects. Format them before comparing: midnight → `"YYYY-MM-DD"`, with time → `"YYYY-MM-DD HH:MM:SS"`.
4. **Float rounding**: Use `ROUND(value, 2)` in SQL. Compare with ±0.0001 tolerance. If the expected says `185.71`, the query must `ROUND(..., 2)`.
5. **ORDER BY determinism**: If `orderMatters: true`, make sure ORDER BY has a tiebreaker column to be deterministic.
6. **Case sensitivity**: DuckDB column names are case-insensitive. The validator lowercases everything. But be consistent.

## Commands Reference

| Command | Use |
|---------|-----|
| `pnpm test:integration` | Run ALL exercises against native DuckDB (first test case only) |
| `pnpm test -- src/exercises/{id}/exercise.test.ts` | Run unit tests for one exercise |
| `pnpm test:run` | Run ALL unit tests |
