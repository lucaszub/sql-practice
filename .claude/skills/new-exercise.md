---
name: new-exercise
description: Scaffold a new SQL exercise aligned with the roadmap
user_invocable: true
argument-hint: "<module> <slug> (e.g., B1 basic-select-filter)"
---

# new-exercise

Creates a new SQL exercise from template, aligned with the project roadmap.

## Arguments

- `$ARGUMENTS[0]` — Roadmap module code (e.g., B1, I3, A2)
- `$ARGUMENTS[1]` — Exercise slug in kebab-case (e.g., basic-select-filter)

## Steps

1. Determine the next exercise number by reading `src/exercises/` directory
2. Identify the module from `roadmap/data_analyst.md` or `roadmap/data_engineer.md`
3. Map the module to difficulty: B* = "easy", I* = "medium", A* = "hard"
4. Create directory: `src/exercises/{number}-{slug}/`
5. Create `exercise.ts` with the Exercise interface template, pre-filled with:
   - Correct ID, difficulty, and a TODO for category
   - Business-scenario placeholder in description
   - Empty schema, solutionQuery, solutionExplanation
   - Two empty test cases (default + edge case)
6. Create `exercise.test.ts` with the standard test template
7. Add import to `src/lib/exercises/index.ts`
8. Report the created files and remind to fill in the exercise content
