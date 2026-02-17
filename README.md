<div align="center">

# PracticeData

**Master data skills, one exercise at a time.**

SQL today. Pandas tomorrow. Zero setup — runs entirely in your browser.

[![101 exercises](https://img.shields.io/badge/exercises-101-blue)]()
[![8 companies](https://img.shields.io/badge/companies-8-purple)]()
[![2 tracks](https://img.shields.io/badge/tracks-DA%20%7C%20DE-green)]()
[![DuckDB-WASM](https://img.shields.io/badge/engine-DuckDB--WASM-orange)]()

</div>

---

<img width="1878" height="1017" alt="image" src="https://github.com/user-attachments/assets/7add8fac-89bc-472d-8133-d385c20c3b19" />


## What is PracticeData?

PracticeData is an open-source, browser-based platform for practicing real-world data skills. No database to install, no environment to configure — just open the app and start writing queries.

Powered by **DuckDB-WASM**, everything runs locally in your browser. Your progress is saved automatically.

## Features

- **101 exercises** across beginner, intermediate, and advanced modules
- **8 company scenarios** — NeonCart, DataFlow, PixelAds, CashBee, TalentHub, CloudForge, FreshBowl, StreamPulse — each with its own data and business questions
- **2 career tracks** — Data Analyst (50 exercises) and Data Engineer (51 exercises), with shared foundations and specialized paths
- **Real business scenarios** — every exercise is framed as a question a data team would actually ask
- **Instant feedback** — submit your query, see results and validation in real time
- **Bilingual** — full EN/FR support with one-click toggle
- **Dark & light mode** — easy on the eyes, day or night
- **Activity tracking** — GitHub-style contribution graph to keep you motivated
- **Progress by module** — track completion across structured learning paths
- **100% client-side** — no backend, no account, no data leaves your browser

## Career Tracks

### Data Analyst

From `SELECT` basics to FAANG-level analytical SQL.

| Level | Modules | Exercises | Topics |
|-------|---------|-----------|--------|
| Beginner | B1-B4 | 26 | SELECT, aggregation, basic joins, NULL handling |
| Intermediate | I1-I7 | 16 | Multi-table joins, CTEs, subqueries, window functions, anti-joins |
| Advanced | A1-A8 | 8 | Running totals, gaps & islands, cohort retention, funnel analysis |

### Data Engineer

From schema design to pipeline SQL, optimization, and data quality.

| Level | Modules | Exercises | Topics |
|-------|---------|-----------|--------|
| Beginner | B1-B4 | 26 (shared) | SELECT, aggregation, basic joins, NULL handling |
| Intermediate | DE-I1-I2 | 10 | DDL, DML, data types, constraints |
| Advanced | DE-A1-A8 | 41 | Star schema, SCD Type 2, MERGE, incremental loads, data quality |

### Company Scenarios

Practice on realistic company datasets with multi-exercise storylines.

| Company | Sector | Difficulty |
|---------|--------|------------|
| NeonCart | E-commerce | Beginner |
| FreshBowl | Foodtech / Delivery | Beginner |
| PixelAds | Marketing / Adtech | Intermediate |
| TalentHub | HR / Recruitment | Intermediate |
| CloudForge | Data Platform | Intermediate-Advanced |
| DataFlow | SaaS B2B | Intermediate-Advanced |
| CashBee | Fintech | Advanced |
| StreamPulse | Streaming / Media | Advanced |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| SQL Engine | DuckDB-WASM |
| Editor | CodeMirror 6 |
| UI | shadcn/ui + Tailwind CSS |
| Tables | TanStack Table + React Virtual |
| State | Zustand (localStorage persistence) |
| Testing | Vitest (unit + integration against native DuckDB) |

## Quick Start

```bash
git clone https://github.com/lucaszub/sql-practice.git
cd sql-practice
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and start practicing.

## Scripts

| Command | Description |
|---------|------------|
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm test` | Run unit tests (watch mode) |
| `pnpm test:run` | Run unit tests (single run) |
| `pnpm test:integration` | Validate all exercises against native DuckDB |
| `pnpm lint` | ESLint |

## Project Structure

```
src/
  app/                          # Next.js pages
    (main)/
      page.tsx                  # Home — exercise list with filters
      roadmap/
        data-analyst/           # DA track roadmap
        data-engineer/          # DE track roadmap
      companies/                # Company selection page
      company/[companyId]/      # Company scenario workspace
    exercise/[id]/              # Exercise editor + validator
  components/                   # React components (shadcn/ui)
  exercises/                    # 101 exercises
    {id}/
      exercise.ts               # Schema, solution, test cases, explanation
      exercise.test.ts          # Unit tests
  lib/
    companies/                  # Company profiles (schema, exercises, metadata)
    db/                         # DuckDB init, query runner, validator
    exercises/                  # Types, registry, module/track definitions
    i18n/                       # EN/FR translations
    store/                      # Zustand stores (progress, session)
```

## Adding Exercises

Each exercise lives in `src/exercises/{id}/` with two files:

- **`exercise.ts`** — schema SQL, solution query, test cases, explanation
- **`exercise.test.ts`** — unit tests (structure + mock validation)

Conventions:
- Business-framed descriptions ("The marketing team wants to...")
- 10-30 rows per table, deterministic data, include NULLs
- Minimum 2 test cases (default + edge case)
- DuckDB-compatible SQL only
- Register in `src/lib/exercises/index.ts` and assign to a module in `modules.ts`

## Roadmap

- [x] Beginner SQL — 26 exercises (B1-B4: SELECT, aggregation, joins, NULL handling)
- [x] Intermediate DA — 16 exercises (I1-I7: multi-table joins, CTEs, window functions, anti-joins)
- [x] Advanced DA — 8 exercises (A1-A8: cohort retention, funnel analysis, revenue metrics)
- [x] Intermediate DE — 10 exercises (DE-I1-I2: DDL, DML, data types)
- [x] Advanced DE — 41 exercises (DE-A1-A8: star schema, SCD2, MERGE, incremental loads, data quality)
- [x] Two career tracks with dedicated roadmap pages
- [x] 8 company scenario profiles with interactive SQL workspace
- [x] Bilingual EN/FR interface
- [x] Global footer with GitHub link
- [x] Company CTA banners in roadmap level sections
- [ ] Pandas exercises

## Contributing

Contributions are welcome! Whether it's a new exercise, a bug fix, or a UI improvement — open an issue or submit a PR.

## License

MIT
