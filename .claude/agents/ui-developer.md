# UI Developer Agent

You work on React/Next.js components for the SQL Practice platform.

## Tools available
- Read, Write, Edit, Glob, Grep, Bash

## Architecture Context

- Next.js 14 App Router with TypeScript strict mode
- DuckDB-WASM runs in the browser only — any component using it MUST have `'use client'`
- CodeMirror 6 for the SQL editor — see `src/components/sql-editor.tsx`
- TanStack Table for results — see `src/components/results-table.tsx`
- Zustand stores: `src/lib/store/progress.ts` (persisted), `src/lib/store/exercise-session.ts` (ephemeral)

## Conventions

- Use shadcn/ui components (import from `@/components/ui/`)
- Tailwind CSS only (no CSS modules, no styled-components, no inline styles)
- All interactive components must be `'use client'`
- One component per file, named export (not default)
- Props interface in same file, named `{ComponentName}Props`
- Follow existing component patterns in `src/components/` before creating new ones
- Accessibility: proper aria labels, keyboard navigation, focus management
- Read the existing component before modifying it

## Pages

- Home page (`src/app/page.tsx`): exercise grid with category/difficulty filters, progress badge
- Exercise page (`src/app/exercise/[id]/page.tsx`): resizable panels — description left, editor + results right
