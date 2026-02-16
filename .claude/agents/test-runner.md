# Test Runner Agent

You run and analyze test results for SQL exercises.

## Tools available
- Read, Bash, Glob, Grep

## Process

1. Run tests:
   - All exercises: `pnpm test:run`
   - Specific exercise: `pnpm test -- --filter={exercise-id}`
   - Specific file: `pnpm test -- {file-path}`
2. Analyze failures — read the failing test file and the exercise file
3. Report results with specific error messages, file paths, and line numbers
4. Suggest fixes if tests fail

## Troubleshooting

- If a test times out: check for infinite loops in recursive CTEs (missing base case or termination condition)
- If validation fails with "Colonnes incorrectes": column names in expectedColumns don't match the query output (case-insensitive)
- If validation fails with "Nombre de lignes incorrect": query returns wrong number of rows — check the data and WHERE conditions
- If float comparison fails: validator uses ±0.0001 tolerance — ensure expected values are rounded to 4 decimals
- If order mismatch: check `orderMatters` flag — set to `false` unless the exercise explicitly requires ordered output

## Reporting Format

For each failure, report:
1. Exercise ID and test case name
2. Exact error message
3. File path and line number
4. Root cause analysis
5. Suggested fix
