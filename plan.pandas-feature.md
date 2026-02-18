# Plan: Pandas Mode — Toggle on Home Page + Exercise Editor

## Vue d'ensemble

Ajouter un **toggle SQL / Pandas** sur la page d'accueil (`/`). Quand l'utilisateur choisit Pandas, la liste des modules change pour montrer la progression Pandas (PB1 DataFrame Basics, PB2 Filtering, etc.). Quand il choisit SQL, il voit la vue actuelle (B1 SELECT, B2 GROUP BY, etc.).

Sur la **page exercice**, les exercices partagés montrent un toggle SQL/Pandas pour choisir le mode d'édition.

**On ne touche PAS aux roadmaps DA/DE.** Tout se passe sur la home page et la page exercice.

---

## 1. UX de la page d'accueil

### Etat actuel
```
[Exercises]                    [All Levels ▼]
┌─────────────────────────────────────────────┐
│ B1 — SELECT Fundamentals          3/7  ███░ │
│   11-select-where-basics     ✓              │
│   12-in-between-filtering    ✓              │
│   ...                                       │
├─────────────────────────────────────────────┤
│ B2 — Aggregation & GROUP BY       0/7  ░░░░ │
│   ...                                       │
└─────────────────────────────────────────────┘
```

### Nouvel etat
```
[SQL]  [Pandas]                [All Levels ▼]     ← nouveau toggle
┌─────────────────────────────────────────────┐
│ PB1 — DataFrame Basics            0/5  ░░░░ │   ← modules Pandas
│   pd-01-inspect-orders                      │
│   pd-02-select-columns                      │
│   ...                                       │
├─────────────────────────────────────────────┤
│ PB2 — Filtering & Boolean Indexing 0/6 ░░░░ │
│   11-select-where-basics  ← partagé!        │
│   pd-03-isin-filtering                      │
│   ...                                       │
└─────────────────────────────────────────────┘
```

Le toggle est un **segmented control** (meme pattern que le filtre de difficulte, mais avec 2 boutons). Il utilise un state React :

```typescript
const [codingMode, setCodingMode] = useState<"sql" | "pandas">("sql");

// Switch modules based on mode
const activeTrack = codingMode === "sql" ? dataAnalystTrack : pandasTrack;
const modulesWithExercises = activeTrack.modules.map((mod) => { ... });
```

Le choix est persiste en localStorage (via le progress store ou un nouveau setting).

---

## 2. Pandas Track — Modules & Exercices

### Structure des modules

13 modules, ~63 exercices (~30 nouveaux + ~33 partages avec SQL)

```
Beginner                 Intermediate                Advanced
─────────────            ──────────────              ───────────
PB1 DataFrame Basics     PI1 Merge & Join            PA1 Window Ops
PB2 Filtering            PI2 String & DateTime       PA2 Consecutive Patterns
PB3 Sorting & Top-N      PI3 Missing Data            PA3 Multi-DataFrame
PB4 Basic Aggregation    PI4 Advanced GroupBy        PA4 Performance & Chaining
                         PI5 Pivot & Melt

Prerequisite chain :
PB1 → PB2 → PB3
        └→ PB4 → PI1 → PI4 → PA1 → PA2
                  └→ PA3 ───→ PA4
  PB3 → PI2
  PB4 → PI3 → PI4 → PI5
```

### Detail des modules avec exercices

#### PB1 — DataFrame Basics (5 exercices, tous NOUVEAUX)
| ID | Titre | Concept | Business question |
|----|-------|---------|-------------------|
| `pd-01-inspect-orders` | Order Dataset Overview | `head`, `shape`, `info` | "Le PM demande combien de commandes sont dans le dataset et quelles colonnes sont dispo" |
| `pd-02-select-columns` | Customer Contact List | `df[['col1','col2']]` | "L'equipe marketing a besoin de la liste nom + email des clients" |
| `pd-03-unique-categories` | Product Category Inventory | `unique`, `nunique` | "Le merchandising veut savoir combien de categories produits existent" |
| `pd-04-check-data-quality` | Data Quality Snapshot | `dtypes`, `isna().sum()` | "Avant l'analyse, verifie quelles colonnes ont des valeurs manquantes" |
| `pd-05-rename-columns` | Clean Report Headers | `rename(columns=...)` | "Le rapport export a des noms de colonnes techniques, renomme-les pour le business" |

#### PB2 — Filtering & Boolean Indexing (6 exercices, 4 PARTAGES + 2 NOUVEAUX)
| ID | Type | Titre | Concept |
|----|------|-------|---------|
| `11-select-where-basics` | PARTAGE | High-Value Orders Report | `df[df['amount'] > 100]` |
| `12-in-between-filtering` | PARTAGE | Promotion-Eligible Products | `isin()` + `between()` |
| `13-pattern-matching` | PARTAGE | Gmail Customers for Migration | `str.contains()` / `str.endswith()` |
| `16-multiple-conditions` | PARTAGE | At-Risk Premium Customers | `&` / `|` / `~` operators |
| `pd-06-date-range-filter` | NOUVEAU | Q4 Orders for Year-End Report | `df[(df['date'] >= ...) & (df['date'] <= ...)]` |
| `pd-07-null-filter` | NOUVEAU | Customers Missing Phone Numbers | `df[df['phone'].isna()]` |

#### PB3 — Sorting & Top-N (5 exercices, 2 PARTAGES + 3 NOUVEAUX)
| ID | Type | Titre | Concept |
|----|------|-------|---------|
| `14-sorting-results` | PARTAGE | Premium Catalog by Price | `sort_values(ascending=False)` |
| `15-limit-offset` | PARTAGE | Recent Activity Widget | `sort_values() + head()` |
| `pd-08-top-n` | NOUVEAU | Top 5 Revenue-Generating Products | `nlargest(5, 'revenue')` |
| `pd-09-bottom-n` | NOUVEAU | Lowest Rated Products to Review | `nsmallest(3, 'rating')` |
| `pd-10-multi-sort` | NOUVEAU | Employee Directory by Dept then Name | `sort_values(['dept', 'name'])` |

#### PB4 — Basic Aggregation (5 exercices, 3 PARTAGES + 2 NOUVEAUX)
| ID | Type | Titre | Concept |
|----|------|-------|---------|
| `18-count-basics` | PARTAGE | Count Orders and Unique Customers | `len()`, `nunique()` |
| `19-sum-avg-revenue` | PARTAGE | Monthly Revenue and Avg Order Value | `groupby().agg()` |
| `20-min-max-prices` | PARTAGE | Cheapest & Most Expensive by Category | `groupby().agg(['min','max'])` |
| `pd-11-value-counts` | NOUVEAU | Order Status Distribution | `value_counts()` |
| `pd-12-group-filter` | NOUVEAU | High-Volume Product Categories | `groupby().filter(lambda ...)` |

#### PI1 — Merge & Join (5 exercices, 4 PARTAGES + 1 NOUVEAU)
| ID | Type | Titre | Concept |
|----|------|-------|---------|
| `25-inner-join-basics` | PARTAGE | Shipping Labels with Customer Names | `pd.merge(how='inner')` |
| `27-left-join-basics` | PARTAGE | Customer Order Count Incl. Inactive | `merge(how='left')` |
| `28-left-join-missing` | PARTAGE | Find Products Never Ordered | `merge(indicator=True)` anti-join |
| `31-customer-summary` | PARTAGE | Customer Summary Report | `merge(how='left')` + `fillna(0)` |
| `pd-13-merge-different-keys` | NOUVEAU | Match Employees with Departments | `merge(left_on=..., right_on=...)` |

#### PI2 — String & DateTime Operations (5 exercices, tous NOUVEAUX)
| ID | Titre | Concept |
|----|-------|---------|
| `pd-14-extract-month` | Monthly Sales Breakdown | `df['date'].dt.month` |
| `pd-15-date-diff` | Average Delivery Time per Region | `(col1 - col2).dt.days` |
| `pd-16-string-clean` | Clean Product Names for Catalog | `str.lower().str.strip()` |
| `pd-17-string-extract` | Extract Email Domains | `str.split('@').str[1]` |
| `pd-18-to-period` | Quarterly Revenue Report | `dt.to_period('Q')` |

#### PI3 — Missing Data & Cleaning (5 exercices, 2 PARTAGES + 3 NOUVEAUX)
| ID | Type | Titre | Concept |
|----|------|-------|---------|
| `32-is-null-check` | PARTAGE | Flag Products Missing Descriptions | `df[df['col'].isna()]` |
| `33-coalesce-defaults` | PARTAGE | Clean Up NULL Categories | `fillna('default')` |
| `pd-19-fill-group-mean` | NOUVEAU | Fill Missing Prices with Category Average | `transform('mean') + fillna()` |
| `pd-20-dedup-keep-latest` | NOUVEAU | Deduplicate Customer Records | `sort_values().drop_duplicates(keep='last')` |
| `pd-21-replace-sentinels` | NOUVEAU | Replace Sentinel Values (-1, N/A) | `df.replace({-1: np.nan})` |

#### PI4 — Advanced GroupBy & Transform (5 exercices, 2 PARTAGES + 3 NOUVEAUX)
| ID | Type | Titre | Concept |
|----|------|-------|---------|
| `01-top-n-per-group` | PARTAGE | Top N Per Group | `groupby().rank()` + filter |
| `03-yoy-growth` | PARTAGE | Year-over-Year Growth | `pivot + pct_change()` |
| `pd-22-pct-of-total` | NOUVEAU | Revenue Share per Category | `transform('sum')` for pct |
| `pd-23-named-agg` | NOUVEAU | Sales KPI Summary per Region | `.agg(total=(...), avg=(...))` |
| `pd-24-crosstab` | NOUVEAU | Order Status by Region | `pd.crosstab()` |

#### PI5 — Reshaping: Pivot & Melt (5 exercices, tous NOUVEAUX)
| ID | Titre | Concept |
|----|-------|---------|
| `pd-25-pivot-table` | Monthly Revenue by Category | `pivot_table(values, index, columns)` |
| `pd-26-melt` | Unpivot Quarterly Metrics | `pd.melt(id_vars, value_vars)` |
| `pd-27-pivot-margins` | Sales Summary with Totals | `pivot_table(margins=True)` |
| `pd-28-unstack` | Flatten Multi-level GroupBy | `groupby([...]).unstack()` |
| `pd-29-crosstab-pivot` | Customer Segment vs Product Affinity | `pd.crosstab(normalize='index')` |

#### PA1 — Window Operations (5 exercices, 2 PARTAGES + 3 NOUVEAUX)
| ID | Type | Titre | Concept |
|----|------|-------|---------|
| `02-running-total` | PARTAGE | Running Total & Moving Average | `cumsum()`, `rolling(7).mean()` |
| `09-consecutive-days` | PARTAGE | Consecutive Active Days | `diff() + cumsum()` |
| `pd-30-pct-change` | NOUVEAU | Month-over-Month Growth Rate | `pct_change()` |
| `pd-31-shift-compare` | NOUVEAU | Compare Each Month to Previous | `shift(1)` |
| `pd-32-expanding-max` | NOUVEAU | All-Time Revenue High | `expanding().max()` |

#### PA2 — Consecutive Patterns (4 exercices, 1 PARTAGE + 3 NOUVEAUX)
| ID | Type | Titre | Concept |
|----|------|-------|---------|
| `04-gap-and-island` | PARTAGE | Login Streaks Detection | `diff() + cumsum()` grouping |
| `pd-33-gap-detection` | NOUVEAU | Find Missing Days in Time Series | date range comparison |
| `pd-34-session-detect` | NOUVEAU | Session Detection (30min gap) | `diff() > threshold + cumsum()` |
| `pd-35-longest-streak` | NOUVEAU | Longest Winning Streak per Player | group consecutive + max |

#### PA3 — Multi-DataFrame & Concat (4 exercices, tous NOUVEAUX)
| ID | Titre | Concept |
|----|-------|---------|
| `pd-36-concat-files` | Combine Monthly Reports | `pd.concat([df1, df2])` |
| `pd-37-combine-first` | Update Master with New Data | `combine_first()` |
| `pd-38-snapshot-diff` | Find Changes Between Snapshots | `merge(indicator=True)` + diff |
| `pd-39-merge-asof` | Match Trades to Nearest Quote | `pd.merge_asof(on='timestamp')` |

#### PA4 — Performance & Method Chaining (5 exercices, tous NOUVEAUX)
| ID | Titre | Concept |
|----|-------|---------|
| `pd-40-vectorize` | Replace apply() with Vectorized Ops | `np.where` vs `apply` |
| `pd-41-pipe` | Build ETL Pipeline with pipe() | `df.pipe(f1).pipe(f2)` |
| `pd-42-query` | Readable Filters with query() | `df.query('amount > 100')` |
| `pd-43-assign-chain` | Method Chaining: Clean → Transform → Aggregate | `.assign().query().groupby().agg()` |
| `pd-44-category-dtype` | Optimize Memory with Categories | `astype('category')` |

---

### Comptage final

| Type | Nombre |
|------|--------|
| Exercices NOUVEAUX (Pandas-only) | 30 |
| Exercices PARTAGES (SQL + Pandas) | 23 |
| **Total track Pandas** | **53** |

Les 23 exercices partages reutilisent les memes donnees/schema/test cases. Seuls `solutionPandas` et `solutionPandasExplanation` sont ajoutes.

---

## 3. Architecture technique

### Pyodide (Python dans le navigateur)
- Package npm `pyodide` (v0.29.3+)
- **Lazy-load** : charge uniquement quand l'user selectionne Pandas (~17 MB, cached apres)
- **Web Worker** : meme pattern singleton que `src/lib/db/duckdb.ts`
- Pre-charge `pandas` + `numpy`

### Data flow
```
Schema SQL (DuckDB) → export JSON par table
    → Pyodide Worker → pd.DataFrame(json) par table
    → User ecrit du Pandas → variable `result` extraite
    → Converti en {columns, rows} → meme validateur que SQL
```

### Changements type Exercise (`src/lib/exercises/types.ts`)
```typescript
export type CodingMode = "sql" | "pandas";

export interface Exercise {
  // champs existants inchanges...
  supportedModes?: CodingMode[];  // default ["sql"], shared: ["sql","pandas"], pandas-only: ["pandas"]
  solutionPandas?: string;
  solutionPandasExplanation?: string;
  solutionPandasExplanationFr?: string;
  pandasHint?: string;
  pandasHintFr?: string;
}
```

### Nouveau track dans `modules.ts`
```typescript
export const pandasTrack: Track = {
  id: "pandas",
  name: "Pandas",
  description: "Master data manipulation with Python Pandas...",
  modules: [
    { id: "PB1", name: "DataFrame Basics", level: "beginner",
      exerciseIds: ["pd-01-inspect-orders", "pd-02-select-columns", ...],
      skills: ["head", "shape", "columns", "dtypes", "rename"],
      icon: "🐼" },
    { id: "PB2", name: "Filtering & Boolean Indexing", level: "beginner",
      exerciseIds: ["11-select-where-basics", "12-in-between-filtering", "pd-06-date-range-filter", ...],
      // ↑ melange d'exercices partages et nouveaux
      skills: ["boolean indexing", "isin", "str.contains", "isna"],
      icon: "🔍", prerequisites: ["PB1"] },
    // ...
  ],
};
```

### Page d'accueil (`src/app/(main)/page.tsx`)
```typescript
// Nouveau state
const [codingMode, setCodingMode] = useState<"sql" | "pandas">("sql");

// Switch le track selon le mode
const activeTrack = codingMode === "sql" ? dataAnalystTrack : pandasTrack;

// Le reste du code (modules, filters, render) ne change pas — il utilise juste activeTrack
const modulesWithExercises = activeTrack.modules.map((mod) => { ... });
```

Le toggle est un composant segmented control juste avant le filtre de difficulte :
```tsx
<div className="flex items-center justify-between">
  <h2 className="text-lg font-semibold">{t("home.exercises")}</h2>
  <div className="flex items-center gap-2">
    <CodingModeToggle value={codingMode} onChange={setCodingMode} />
    <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
      ...
    </Select>
  </div>
</div>
```

### Page exercice (`src/app/exercise/[id]/page.tsx`)
- Si `exercise.supportedModes` inclut les deux : afficher toggle SQL/Pandas
- Si `["pandas"]` seulement : editeur Python directement
- Si `["sql"]` seulement (defaut) : comportement actuel, pas de toggle
- L'editeur Python utilise `@codemirror/lang-python`
- Le `handleRun` route vers DuckDB (SQL) ou Pyodide (Pandas)

---

## 4. Fichiers a creer

| Fichier | Description |
|---------|-------------|
| `src/lib/pyodide/pyodide.worker.ts` | Web Worker : charge Pyodide, execute Python |
| `src/lib/pyodide/pyodide-client.ts` | Singleton client (init, loadData, execute) |
| `src/lib/pyodide/pandas-runner.ts` | Bridge DuckDB export → Pyodide execution |
| `src/components/python-editor.tsx` | CodeMirror 6 avec support Python |
| `src/components/coding-mode-toggle.tsx` | Toggle segmented SQL/Pandas |
| `src/exercises/pd-{NN}-{slug}/exercise.ts` | ~30 nouveaux exercices Pandas |

## 5. Fichiers a modifier

| Fichier | Changement |
|---------|------------|
| `src/app/(main)/page.tsx` | Toggle SQL/Pandas, switch `activeTrack` |
| `src/app/exercise/[id]/page.tsx` | Toggle mode, double execution (SQL ou Pandas) |
| `src/lib/exercises/types.ts` | `CodingMode`, `supportedModes`, champs Pandas |
| `src/lib/exercises/modules.ts` | Ajouter `pandasTrack` |
| `src/lib/exercises/index.ts` | Enregistrer les 30 nouveaux exercices |
| `src/lib/store/exercise-session.ts` | `codingMode`, `currentPandas` |
| `src/lib/store/progress.ts` | `solvedModes`, `lastAttemptPandas` |
| `src/lib/i18n/translations.ts` | Cles Pandas |
| `src/components/exercise-description.tsx` | Afficher DataFrames dispo en mode Pandas |
| `package.json` | `pyodide`, `@codemirror/lang-python` |
| `next.config.ts` | Config Pyodide WASM |
| 23 exercices existants | Ajouter `supportedModes`, `solutionPandas` |

---

## 6. Phases d'implementation

### Phase 1 : Infrastructure Pyodide
1. `pnpm add pyodide @codemirror/lang-python`
2. Creer Web Worker + singleton client + runner
3. Config Next.js pour Pyodide WASM
4. Creer `PythonEditor` component

### Phase 2 : Data model + Track
1. Modifier `types.ts` (CodingMode, supportedModes, champs Pandas)
2. Definir `pandasTrack` dans `modules.ts`
3. Modifier stores (exercise-session, progress)
4. Ajouter cles i18n

### Phase 3 : UI Home page + Exercise page
1. Ajouter `CodingModeToggle` sur la home page
2. Wirer le switch `activeTrack` basé sur le mode
3. Ajouter toggle + execution Pandas sur la page exercice

### Phase 4 : Exercices Beginner (~21 exercices)
1. Creer PB1 (5 nouveaux)
2. Creer PB2 (2 nouveaux + 4 partages avec solutionPandas)
3. Creer PB3 (3 nouveaux + 2 partages)
4. Creer PB4 (2 nouveaux + 3 partages)

### Phase 5 : Exercices Intermediate + Advanced (~32 exercices)
1. Creer PI1-PI5, PA1-PA4
2. Ajouter solutionPandas aux exercices partages restants

---

## 7. Risques & mitigations

| Risque | Mitigation |
|--------|------------|
| 17 MB Pyodide | Lazy-load, CDN cache, progress indicator |
| 5-15s init time | Loading overlay, preload on hover, Service Worker |
| Next.js + Pyodide webpack | CDN loading, `'use client'` |
| Types mismatch Pandas vs DuckDB | Normaliser dates/numbers/NULLs dans le worker |
| Scope creep | Phase 4 (beginner) d'abord, iterer |
