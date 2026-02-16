# Exercise Rules

- Each exercise lives in src/exercises/{id}/ with exercise.ts and exercise.test.ts
- ID format: {number}-{slug} (e.g., 01-top-n-per-group)
- exercise.ts exports a single `exercise` const of type Exercise
- Minimum 2 test cases: one "default" and one edge case
- Schema SQL must be DuckDB-compatible
- All INSERT values must be deterministic (no random data)
- Description and explanation use markdown
- Solution must be the most idiomatic approach
