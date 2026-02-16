---
name: new-exercise
description: Scaffold a new SQL exercise with template files
user_invocable: true
---

# new-exercise

Creates a new SQL exercise from template.

## Steps
1. Determine the next exercise number from src/exercises/
2. Create directory: src/exercises/{number}-{slug}/
3. Create exercise.ts with the Exercise interface template
4. Create exercise.test.ts with test template
5. Add import to src/lib/exercises/index.ts
6. Report the created files
