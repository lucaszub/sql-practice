---
name: improve-tests
description: Analyze and improve test quality for one or all exercises
user_invocable: true
argument-hint: "[exercise-id] (optional — omit to audit all exercises)"
---

# improve-tests

Audits exercise tests and improves their quality, coverage, and robustness.

## Arguments

- `$ARGUMENTS[0]` — (optional) Exercise ID to audit. If omitted, audits all exercises.

## Audit Criteria

For each exercise, check:

### 1. Structure completeness
- [ ] Has `exercise.test.ts` file
- [ ] Tests structure validity (id format, title, min 2 test cases, schema, solution)
- [ ] Tests solution correctness against ALL test cases (not just the first)
- [ ] Tests wrong answer rejection (at least 1 intentionally wrong query)

### 2. Test case quality
- [ ] Minimum 2 test cases: "default" (happy path) + at least 1 edge case
- [ ] Edge cases cover: NULLs, empty results, ties, boundary values, single-row tables
- [ ] If `orderMatters: true` — test with intentionally wrong order
- [ ] If aggregations — test with groups that produce 0 or 1 row
- [ ] If JOINs — test with unmatched rows (LEFT JOIN null scenario)
- [ ] If window functions — test with partition containing a single row

### 3. Wrong answer tests
- [ ] At least one wrong query that returns wrong columns
- [ ] At least one wrong query that returns wrong row count or wrong values
- [ ] Wrong queries should be plausible mistakes (common SQL errors), not random nonsense

### 4. Data robustness
- [ ] Schema data includes NULLs in nullable columns
- [ ] Schema data includes edge case values (0, empty strings, dates at boundaries)
- [ ] setupSql in test cases modifies data meaningfully (not just adding identical rows)

## Process

1. **Scan**: List all exercises or find the target exercise
2. **Audit**: For each exercise, read `exercise.ts` and `exercise.test.ts`, check all criteria
3. **Report**: List issues found per exercise, sorted by severity
4. **Fix**: For each issue, apply the fix:
   - Add missing test cases
   - Add missing wrong answer tests
   - Add edge case data to schema or setupSql
   - Improve test descriptions
5. **Verify**: Run `pnpm test -- --filter={exercise-id}` for each modified exercise

## Commands Reference

See `.claude/commands/commands.md` for available pnpm commands.

## Severity Levels

- **Critical**: No test file, solution not tested, or zero wrong answer tests
- **High**: Only 1 test case, missing edge case coverage
- **Medium**: Wrong answer tests too trivial, setupSql not used when needed
- **Low**: Test descriptions could be more descriptive

## Output

Report format:
```
Exercise ID | Issues Found | Severity | Fixed?
------------|-------------|----------|-------
01-xxx      | No NULL test case | High | Yes
02-xxx      | Missing wrong answer test | Critical | Yes
```
