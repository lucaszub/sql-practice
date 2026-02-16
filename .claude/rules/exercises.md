---
paths:
  - "src/exercises/**/*.ts"
---

# Exercise Rules

## Structure

- Each exercise lives in `src/exercises/{id}/` with `exercise.ts` and `exercise.test.ts`
- ID format: `{number}-{slug}` (e.g., `11-basic-select-where`)
- `exercise.ts` exports a single `exercise` const of type `Exercise`
- Add the import to `src/lib/exercises/index.ts` after creating the exercise

## Roadmap Alignment

IMPORTANT: Every new exercise MUST align with the roadmap. Before creating an exercise:

1. Check which **module** it belongs to (e.g., B1, I3, A2) — see `roadmap/data_analyst.md` or `roadmap/data_engineer.md`
2. Assign the correct **difficulty**: Beginner modules = "easy", Intermediate = "medium", Advanced = "hard"
3. Assign the correct **category** from the Exercise type
4. Choose a **business domain** appropriate for the difficulty level:
   - Beginner: e-commerce, employee databases (simple, relatable)
   - Intermediate: SaaS metrics, marketing, HR (multi-table, richer context)
   - Advanced: product analytics, finance, data platform (complex, realistic)

## Content Quality

- Description MUST be framed as a real business question (e.g., "The marketing team wants to know..." not "Write a query that...")
- Include a `hint` field with a conceptual hint (not the answer)
- `solutionExplanation` in markdown: explain the pattern, why it works, and when to use it
- Solution must be the most idiomatic approach (CTEs over nested subqueries, window functions over self-joins when cleaner)

## Schema Design

- Schema SQL must be DuckDB-compatible
- All INSERT values must be deterministic (no random data)
- Use realistic but concise datasets: 10–30 rows is the sweet spot
- Include enough variety to cover edge cases (NULLs, ties, empty groups)
- Table and column names should reflect the business domain

## Test Cases

- Minimum 2 test cases: one "default" and one edge case
- Edge cases to consider: NULL values, ties in ranking, empty result sets, boundary dates
- `orderMatters: true` only when the exercise explicitly asks for ordered output
- `setupSql` in edge case test cases to modify data (DELETE, INSERT) without changing the base schema

## DuckDB-Specific Features

When the exercise targets a DuckDB-specific feature (QUALIFY, ASOF JOIN, LIST/STRUCT, GROUP BY ALL, etc.):
- Mention it explicitly in the description
- Show the DuckDB-specific syntax in the solution
- Explain how it differs from standard SQL in the `solutionExplanation`
