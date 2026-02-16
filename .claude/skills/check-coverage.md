---
name: check-coverage
description: Show roadmap coverage — which modules have exercises and which are missing
user_invocable: true
context: fork
agent: Explore
---

# check-coverage

Analyze current exercise coverage against the roadmap.

## Steps

1. Read all exercise files in `src/exercises/*/exercise.ts` — extract id, title, difficulty, category
2. Read `roadmap/data_analyst.md` and `roadmap/data_engineer.md` to list all modules
3. Map existing exercises to roadmap modules (use the mapping tables in each roadmap file)
4. Report:
   - Total exercises: X
   - DA track coverage: X/15 modules have exercises
   - DE track coverage: X/19 modules have exercises
   - Modules with zero exercises (priority gaps)
   - Modules with partial coverage (need more exercises)
5. Suggest the next 5 exercises to build based on priority (foundations first, shared modules, high-interview-value patterns)
