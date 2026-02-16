# Project Commands

All commands must be run from the project root: `/sql-practice/`

## Development

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Next.js dev server (port 3000) |
| `pnpm build` | Production build (webpack) |
| `pnpm start` | Start production server |

## Testing

| Command | Description |
|---------|-------------|
| `pnpm test` | Vitest watch mode (dev) |
| `pnpm test:run` | Vitest single run (CI) |
| `pnpm test -- --filter={id}` | Run tests for a specific exercise |
| `pnpm test -- {file-path}` | Run a specific test file |
| `pnpm test:integration` | Integration tests (requires native duckdb) |

## Code Quality

| Command | Description |
|---------|-------------|
| `pnpm lint` | ESLint check |

## Git

| Command | Description |
|---------|-------------|
| `git status` | Working tree status |
| `git diff` | Unstaged changes |
| `git log --oneline -10` | Recent commits |

## Pre-commit Checklist

Run before every commit:
1. `pnpm lint`
2. `pnpm test:run`
3. `pnpm build`
