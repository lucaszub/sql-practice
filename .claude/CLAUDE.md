# SQL Practice Platform

## Architecture
- Next.js 14 App Router, TypeScript strict, pnpm
- DuckDB-WASM (browser-only, 'use client')
- CodeMirror 6 for SQL editing
- TanStack Table for results display
- shadcn/ui + Tailwind for UI
- Zustand for state management
- Vitest for testing

## Conventions
- TypeScript strict: no `any`, no `as` casts without justification
- Components: one component per file, named export
- Exercises: each in src/exercises/{id}/ with exercise.ts + exercise.test.ts
- All SQL schemas use DuckDB-compatible syntax
- Conventional commits: `<type>(<scope>): <description>`

## File Structure
- src/lib/db/ — DuckDB initialization, query runner, validator
- src/lib/exercises/ — types, registry
- src/lib/store/ — Zustand stores
- src/exercises/ — exercise definitions and tests
- src/components/ — React components
- src/app/ — Next.js pages

## Commands
- `pnpm dev` — development server
- `pnpm test` — run vitest
- `pnpm lint` — eslint
- `pnpm build` — production build
