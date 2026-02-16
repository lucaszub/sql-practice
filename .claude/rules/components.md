---
paths:
  - "src/components/**/*.tsx"
  - "src/app/**/*.tsx"
---

# Component Rules

- One component per file, named export (not default)
- File name = component name in kebab-case
- Props interface defined in same file, named `{ComponentName}Props`
- `'use client'` directive for any component using hooks, browser APIs, or DuckDB
- shadcn/ui components imported from `@/components/ui/`
- No inline styles — Tailwind classes only
- Keyboard shortcuts must have visual indicators
- Follow existing component patterns in `src/components/` before creating new ones
