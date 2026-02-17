import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "81-watermark-pattern",
  title: "Incremental Load with Watermark",
  titleFr: "Chargement incrémental avec marqueur haute-eau",
  difficulty: "medium",
  category: "incremental-loads",
  description: `## Incremental Load with Watermark

The data platform team runs a nightly pipeline that loads orders from \`source_orders\` into \`fact_orders\`. Rather than reloading everything each night, the pipeline uses a **watermark**: it reads the maximum \`updated_at\` from the target table, then copies only source records that are strictly newer.

This avoids full-table scans on large sources and keeps the pipeline fast as data grows.

### Schema

**fact_orders** (target — already loaded up to 2024-01-15)
| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| amount | DECIMAL(10,2) |
| status | VARCHAR |
| updated_at | TIMESTAMP |

**source_orders** (full source — contains records from 2024-01-10 to 2024-01-20)
| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| amount | DECIMAL(10,2) |
| status | VARCHAR |
| updated_at | TIMESTAMP |

### Task

Write a single \`SELECT\` that returns only the rows from \`source_orders\` that are **strictly newer** than the maximum \`updated_at\` already present in \`fact_orders\`. Use a scalar subquery to compute the watermark inline.

### Expected output columns
\`order_id\`, \`customer_id\`, \`amount\`, \`status\`, \`updated_at\`

Order by \`updated_at\` ASC, \`order_id\` ASC.`,

  descriptionFr: `## Chargement incrémental avec marqueur haute-eau

L'équipe data platform exécute un pipeline nocturne qui charge des commandes depuis \`source_orders\` vers \`fact_orders\`. Plutôt que de tout recharger chaque nuit, le pipeline utilise un **marqueur haute-eau** : il lit le \`updated_at\` maximum de la table cible, puis ne copie que les enregistrements source strictement plus récents.

Cela évite les scans complets de la table source et maintient le pipeline rapide à mesure que les données croissent.

### Schéma

**fact_orders** (cible — déjà chargée jusqu'au 2024-01-15)
| Colonne | Type |
|---------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| amount | DECIMAL(10,2) |
| status | VARCHAR |
| updated_at | TIMESTAMP |

**source_orders** (source complète — contient des enregistrements du 2024-01-10 au 2024-01-20)
| Colonne | Type |
|---------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| amount | DECIMAL(10,2) |
| status | VARCHAR |
| updated_at | TIMESTAMP |

### Tâche

Écrivez un \`SELECT\` qui retourne uniquement les lignes de \`source_orders\` **strictement plus récentes** que le \`updated_at\` maximum déjà présent dans \`fact_orders\`. Utilisez une sous-requête scalaire pour calculer le marqueur de manière intégrée.

### Colonnes attendues en sortie
\`order_id\`, \`customer_id\`, \`amount\`, \`status\`, \`updated_at\`

Triez par \`updated_at\` ASC, \`order_id\` ASC.`,

  hint: "Compute the watermark with (SELECT MAX(updated_at) FROM fact_orders) inline in the WHERE clause. Filter source_orders WHERE updated_at > that subquery.",
  hintFr: "Calculez le marqueur avec (SELECT MAX(updated_at) FROM fact_orders) directement dans la clause WHERE. Filtrez source_orders WHERE updated_at > cette sous-requête.",

  schema: `CREATE TABLE fact_orders (
  order_id   INTEGER PRIMARY KEY,
  customer_id INTEGER,
  amount      DECIMAL(10,2),
  status      VARCHAR,
  updated_at  TIMESTAMP
);

CREATE TABLE source_orders (
  order_id   INTEGER PRIMARY KEY,
  customer_id INTEGER,
  amount      DECIMAL(10,2),
  status      VARCHAR,
  updated_at  TIMESTAMP
);

INSERT INTO fact_orders VALUES
  (1,  101, 120.00, 'completed', '2024-01-10 08:00:00'),
  (2,  102, 340.50, 'completed', '2024-01-11 09:15:00'),
  (3,  103,  89.99, 'completed', '2024-01-12 10:30:00'),
  (4,  101, 210.00, 'completed', '2024-01-13 11:00:00'),
  (5,  104, 450.00, 'completed', '2024-01-14 14:20:00'),
  (6,  102,  75.00, 'completed', '2024-01-15 16:45:00');

INSERT INTO source_orders VALUES
  (1,  101, 120.00, 'completed', '2024-01-10 08:00:00'),
  (2,  102, 340.50, 'completed', '2024-01-11 09:15:00'),
  (3,  103,  89.99, 'completed', '2024-01-12 10:30:00'),
  (4,  101, 210.00, 'completed', '2024-01-13 11:00:00'),
  (5,  104, 450.00, 'completed', '2024-01-14 14:20:00'),
  (6,  102,  75.00, 'completed', '2024-01-15 16:45:00'),
  (7,  105, 520.00, 'pending',   '2024-01-16 09:00:00'),
  (8,  103, 180.00, 'pending',   '2024-01-17 11:30:00'),
  (9,  101,  60.00, 'completed', '2024-01-18 13:00:00'),
  (10, 106, 290.00, 'pending',   '2024-01-19 08:45:00'),
  (11, 104, 310.00, 'completed', '2024-01-20 10:00:00'),
  (12, 102,  95.00, 'cancelled', '2024-01-20 15:30:00');`,

  solutionQuery: `SELECT
  order_id,
  customer_id,
  amount,
  status,
  updated_at
FROM source_orders
WHERE updated_at > (SELECT MAX(updated_at) FROM fact_orders)
ORDER BY updated_at ASC, order_id ASC;`,

  solutionExplanation: `## Explanation

### Pattern: Incremental Load — Watermark

The **watermark pattern** is the most common approach for incremental extraction. Instead of comparing source and target row by row, you compute a single boundary value (the watermark) from the target and use it to slice the source.

### Step-by-step
1. \`(SELECT MAX(updated_at) FROM fact_orders)\` — computes the watermark: \`2024-01-15 16:45:00\`. This is the latest timestamp already loaded.
2. \`WHERE updated_at > watermark\` — filters source_orders to rows strictly after the watermark. The 6 already-loaded rows are excluded; the 6 new rows (orders 7–12) are included.
3. The outer \`SELECT\` returns only the new rows, ready to be passed to an \`INSERT INTO fact_orders\`.

### Why
- **Efficient**: scans only new data, not the full target table.
- **Simple**: a single scalar subquery replaces a full anti-join.
- **Composable**: the same pattern works whether you load daily, hourly, or per-minute.

### When to use
- Append-only sources where rows are never updated after insertion.
- Event streams, log tables, or transaction tables with a monotonically increasing timestamp.
- Any pipeline where a full reload is too expensive and source data is immutable once written.`,

  solutionExplanationFr: `## Explication

### Patron : Chargement incrémental — Marqueur haute-eau

Le **patron du marqueur haute-eau** est l'approche la plus courante pour l'extraction incrémentale. Plutôt que de comparer source et cible ligne par ligne, on calcule une valeur frontière unique (le marqueur) depuis la cible et on l'utilise pour découper la source.

### Étape par étape
1. \`(SELECT MAX(updated_at) FROM fact_orders)\` — calcule le marqueur : \`2024-01-15 16:45:00\`. C'est le timestamp le plus récent déjà chargé.
2. \`WHERE updated_at > marqueur\` — filtre source_orders aux lignes strictement postérieures au marqueur. Les 6 lignes déjà chargées sont exclues ; les 6 nouvelles lignes (commandes 7–12) sont incluses.
3. Le \`SELECT\` externe retourne uniquement les nouvelles lignes, prêtes à être passées à un \`INSERT INTO fact_orders\`.

### Pourquoi
- **Efficace** : ne scanne que les nouvelles données, pas la table cible entière.
- **Simple** : une seule sous-requête scalaire remplace un anti-join complet.
- **Composable** : le même patron fonctionne que le chargement soit quotidien, horaire ou à la minute.

### Quand l'utiliser
- Sources append-only où les lignes ne sont jamais modifiées après insertion.
- Flux d'événements, tables de logs ou tables de transactions avec un timestamp croissant de manière monotone.
- Tout pipeline où un rechargement complet est trop coûteux et où les données source sont immuables une fois écrites.`,

  testCases: [
    {
      name: "default",
      description: "6 new orders (IDs 7–12) returned; the 6 already loaded orders (IDs 1–6, updated_at <= 2024-01-15) are excluded",
      descriptionFr: "6 nouvelles commandes (IDs 7–12) retournées ; les 6 commandes déjà chargées (IDs 1–6, updated_at <= 2024-01-15) sont exclues",
      expectedColumns: ["order_id", "customer_id", "amount", "status", "updated_at"],
      expectedRows: [
        { order_id: 7,  customer_id: 105, amount: 520.00, status: "pending",   updated_at: "2024-01-16 09:00:00" },
        { order_id: 8,  customer_id: 103, amount: 180.00, status: "pending",   updated_at: "2024-01-17 11:30:00" },
        { order_id: 9,  customer_id: 101, amount: 60.00,  status: "completed", updated_at: "2024-01-18 13:00:00" },
        { order_id: 10, customer_id: 106, amount: 290.00, status: "pending",   updated_at: "2024-01-19 08:45:00" },
        { order_id: 11, customer_id: 104, amount: 310.00, status: "completed", updated_at: "2024-01-20 10:00:00" },
        { order_id: 12, customer_id: 102, amount: 95.00,  status: "cancelled", updated_at: "2024-01-20 15:30:00" },
      ],
      orderMatters: true,
    },
    {
      name: "target-up-to-date",
      description: "When fact_orders already has the latest source record, no new rows are returned",
      descriptionFr: "Quand fact_orders contient déjà le dernier enregistrement source, aucune nouvelle ligne n'est retournée",
      setupSql: `INSERT INTO fact_orders VALUES
  (7,  105, 520.00, 'pending',   '2024-01-16 09:00:00'),
  (8,  103, 180.00, 'pending',   '2024-01-17 11:30:00'),
  (9,  101,  60.00, 'completed', '2024-01-18 13:00:00'),
  (10, 106, 290.00, 'pending',   '2024-01-19 08:45:00'),
  (11, 104, 310.00, 'completed', '2024-01-20 10:00:00'),
  (12, 102,  95.00, 'cancelled', '2024-01-20 15:30:00');`,
      expectedColumns: ["order_id", "customer_id", "amount", "status", "updated_at"],
      expectedRows: [],
      orderMatters: false,
    },
  ],
};
