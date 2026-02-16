<div align="center">

# PracticeData

**Master data skills, one exercise at a time.**

SQL today. Pandas tomorrow. Zero setup — runs entirely in your browser.

</div>

---

## What is PracticeData?

PracticeData is an open-source, browser-based platform for practicing real-world data skills. No database to install, no environment to configure — just open the app and start writing queries.

Powered by **DuckDB-WASM**, everything runs locally in your browser. Your progress is saved automatically.

## Features

- **36 exercises** across 4 modules, from `SELECT` basics to window functions
- **Instant feedback** — submit your query, see results and validation in real time
- **Real business scenarios** — every exercise is framed as a question a data team would actually ask
- **Dark & light mode** — easy on the eyes, day or night
- **Activity tracking** — GitHub-style contribution graph to keep you motivated
- **Progress by module** — track completion across structured learning paths
- **100% client-side** — no backend, no account, no data leaves your browser

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| SQL Engine | DuckDB-WASM |
| Editor | CodeMirror 6 |
| UI | shadcn/ui + Tailwind CSS |
| State | Zustand (localStorage) |
| Testing | Vitest |

## Quick Start

```bash
git clone https://github.com/practicedata/practicedata.git
cd practicedata
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and start practicing.

## Scripts

| Command | Description |
|---------|------------|
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm test` | Run unit tests (watch) |
| `pnpm test:run` | Run unit tests (CI) |
| `pnpm test:integration` | Run all exercises against DuckDB |
| `pnpm lint` | ESLint |

## Roadmap

- [x] SQL exercises (Beginner: SELECT, JOINs, aggregation, subqueries)
- [ ] Intermediate SQL (window functions, CTEs, set operations)
- [ ] Advanced SQL (recursive queries, optimization, data engineering)
- [ ] Pandas exercises
- [ ] Career tracks: Data Analyst & Data Engineer

## Contributing

Contributions are welcome! Whether it's a new exercise, a bug fix, or a UI improvement — open an issue or submit a PR.

## License

MIT
