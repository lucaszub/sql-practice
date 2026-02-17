# SQL Practice Platform

Open-source, browser-based SQL practice with two career tracks: **Data Analyst** and **Data Engineer**. Powered by DuckDB-WASM — zero setup, runs entirely in the browser.

## Vision & Roadmap

IMPORTANT: Before creating any exercise, read @plan.md for the global vision and the relevant track roadmap:
- @roadmap/data_analyst.md — ~80 exercises, analytics patterns, business metrics
- @roadmap/data_engineer.md — ~85 exercises, schema design, pipeline SQL, optimization

**Current state**: 121 exercises total. DA track exercises 1-50 + 102-121 (window functions), DE track exercises 51-101 (all 11 modules implemented: DE-I1 through DE-A8). Window function modules I3, I4, A1, A2 are now comprehensive.

Every exercise belongs to a **track** (DA, DE, or shared), a **module** (e.g., I3 = Intermediate Window Functions: Ranking), and a **business domain** (e-commerce, SaaS, marketing, product analytics, finance, data platform, HR).

## Architecture

- Next.js 16 App Router, TypeScript strict, pnpm
- DuckDB-WASM (browser-only, always `'use client'`)
- CodeMirror 6 for SQL editing
- TanStack Table + TanStack React Virtual for results
- shadcn/ui + Tailwind for UI
- Zustand for state management (progress persisted to localStorage)
- Vitest for testing

## Key Directories

- `src/exercises/{id}/` — exercise.ts + exercise.test.ts (ID format: `{number}-{slug}`)
- `src/lib/db/` — DuckDB init, query runner, validator
- `src/lib/exercises/` — types.ts (Exercise, TestCase, QueryResult), index.ts (registry)
- `src/lib/companies/` — Company profiles (types, index, per-company modules)
- `src/lib/i18n/` — EN/FR translations and locale hook
- `src/lib/store/` — Zustand stores (progress, exercise-session)
- `src/components/` — React components (one per file, named export)
- `src/components/roadmap/` — Roadmap components (level-section, module-card)
- `src/app/(main)/` — Main layout (nav + footer), home, roadmaps, companies
- `src/app/(main)/company/[companyId]/` — Company scenario workspace
- `src/app/exercise/[id]/` — Exercise editor + validator

## Commands

See `.claude/commands/commands.md` for the full reference. Key ones:
- `pnpm dev` — dev server (port 3000)
- `pnpm test:run` — vitest single run (CI)
- `pnpm lint` — eslint
- `pnpm build` — production build

## Conventions

- TypeScript strict: no `any`, no `as` casts without justification
- Conventional commits: `<type>(<scope>): <description>`
- DuckDB-compatible SQL only (no PostgreSQL/MySQL-specific syntax)
- YOU MUST frame exercises as real business questions, never abstract syntax drills
- YOU MUST include 2+ test cases per exercise (default + edge case minimum)
- All INSERT values must be deterministic (no random data, no NOW())
