---
paths:
  - "src/exercises/**/*.test.ts"
  - "src/lib/**/*.test.ts"
---

# Testing Rules

## Branch-Aware Testing Strategy

IMPORTANT: The testing approach depends on the context. Follow these rules strictly.

### On a feature branch (≠ main)

1. **Always test the core engine** — `src/lib/db/` and `src/lib/exercises/` are critical and must be validated on every run
2. **Only test NEW exercises** — use `git diff --name-only origin/main...HEAD -- 'src/exercises/'` to detect what changed
3. **Do NOT retest exercises already in main** — they are considered validated
4. **If core engine files changed** (`src/lib/db/`, `src/lib/exercises/`), run full regression because engine changes can break any exercise

### On main (post-merge or direct commit)

- Tests only need to run if explicitly requested
- Full regression is appropriate here since this is the integration point

### Full regression triggers

Full `pnpm test:run` is only needed when:
- Core engine or validation utilities were modified
- Before production deployment or release
- Before a demo or presentation
- Explicitly requested by the user

---

## Exercise Tests

Each `exercise.test.ts` MUST verify:

1. **Structure validity**: exercise has correct id, title, minimum 2 test cases, non-empty schema and solution
2. **Solution correctness**: solution returns expected results for ALL test cases
3. **Wrong answer rejection**: at least one intentionally wrong query is rejected by the validator

## Test Isolation

- Each test case resets schema: DROP all tables then recreate from `exercise.schema`
- No shared state between test cases
- Use `setupSql` in test cases for scenario-specific data modifications

## Test Pattern

```typescript
import { describe, it, expect } from "vitest";
import { exercise } from "./exercise";
import { validateResult } from "@/lib/db/validator";

describe(exercise.title, () => {
  it("has valid structure", () => {
    expect(exercise.id).toMatch(/^\d{2}-[\w-]+$/);
    expect(exercise.testCases.length).toBeGreaterThanOrEqual(2);
    expect(exercise.solutionQuery).toBeTruthy();
    expect(exercise.schema).toContain("CREATE TABLE");
  });

  // ... solution and rejection tests
});
```

## Validator Behavior

- Column comparison is case-insensitive
- Float tolerance: ±0.0001
- Row order only matters when `orderMatters: true`
- NULL values must match exactly
- Error messages are in French (existing convention — do not change)

## Commands

See `.claude/commands/commands.md` for all commands. Key testing ones:
- `pnpm test` — watch mode (development)
- `pnpm test:run` — single run (CI, pre-commit)
- `pnpm test -- --filter={exercise-id}` — specific exercise tests
- `pnpm test -- src/lib/db/` — core engine tests only
- `pnpm test -- src/lib/exercises/` — registry tests only
