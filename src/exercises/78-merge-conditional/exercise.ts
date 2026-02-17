import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "78-merge-conditional",
  title: "Conditional Upsert with Timestamp Guard",
  titleFr: "Upsert conditionnel avec garde-fou sur le timestamp",
  difficulty: "hard",
  category: "merge-upsert",
  description: `## Conditional Upsert with Timestamp Guard

The product catalog team pushes updates from multiple regional systems that may arrive **out of order**. A staging table brings in a batch of changes, but some records in the batch are **older** than what's already in the dimension table. You must only update a product if the incoming \`updated_at\` is strictly newer than the existing one — stale updates must be silently ignored.

Use DuckDB's \`INSERT INTO ... ON CONFLICT DO UPDATE SET ... WHERE EXCLUDED.updated_at > dim_product.updated_at\` to implement this guard.

### Schema

**dim_product** (target — 10 products with timestamps)
| Column | Type |
|--------|------|
| product_id | INTEGER (PRIMARY KEY) |
| sku | VARCHAR (UNIQUE) |
| product_name | VARCHAR |
| price | DECIMAL(10,2) |
| updated_at | TIMESTAMP |

**staging_products** (12 rows: 4 newer, 3 same-timestamp, 3 older, 2 new)
| Column | Type |
|--------|------|
| sku | VARCHAR |
| product_name | VARCHAR |
| price | DECIMAL(10,2) |
| updated_at | TIMESTAMP |

### Task

Write an upsert that:
1. Inserts rows whose \`sku\` does not exist in \`dim_product\`
2. Updates rows where \`sku\` matches AND the staging \`updated_at\` is **strictly newer** than the dimension \`updated_at\`
3. Ignores rows where the staging \`updated_at\` is equal to or older than the dimension

Then \`SELECT\` all products ordered by \`product_id\` ASC.

### Expected output columns
\`product_id\`, \`sku\`, \`product_name\`, \`price\`, \`updated_at\``,
  descriptionFr: `## Upsert conditionnel avec garde-fou sur le timestamp

L'équipe du catalogue produit pousse des mises à jour depuis plusieurs systèmes régionaux qui peuvent arriver **dans le désordre**. Une table de staging apporte un lot de modifications, mais certains enregistrements du lot sont **plus anciens** que ce qui est déjà dans la table de dimension. Vous devez mettre à jour un produit uniquement si le \`updated_at\` entrant est strictement plus récent que l'existant — les mises à jour périmées doivent être silencieusement ignorées.

Utilisez la syntaxe \`INSERT INTO ... ON CONFLICT DO UPDATE SET ... WHERE EXCLUDED.updated_at > dim_product.updated_at\` de DuckDB pour implémenter ce garde-fou.

### Schéma

**dim_product** (cible — 10 produits avec timestamps)
| Colonne | Type |
|---------|------|
| product_id | INTEGER (PRIMARY KEY) |
| sku | VARCHAR (UNIQUE) |
| product_name | VARCHAR |
| price | DECIMAL(10,2) |
| updated_at | TIMESTAMP |

**staging_products** (12 lignes : 4 plus récents, 3 même timestamp, 3 plus anciens, 2 nouveaux)
| Colonne | Type |
|---------|------|
| sku | VARCHAR |
| product_name | VARCHAR |
| price | DECIMAL(10,2) |
| updated_at | TIMESTAMP |

### Tâche

Écrivez un upsert qui :
1. Insère les lignes dont le \`sku\` n'existe pas dans \`dim_product\`
2. Met à jour les lignes où le \`sku\` correspond ET où le \`updated_at\` du staging est **strictement plus récent** que celui de la dimension
3. Ignore les lignes où le \`updated_at\` du staging est égal ou antérieur à celui de la dimension

Puis faites un \`SELECT\` de tous les produits triés par \`product_id\` ASC.

### Colonnes attendues en sortie
\`product_id\`, \`sku\`, \`product_name\`, \`price\`, \`updated_at\``,
  hint: "Add a WHERE clause after DO UPDATE SET: WHERE EXCLUDED.updated_at > dim_product.updated_at. This WHERE clause applies to the conflict resolution only — it does not filter which rows get inserted.",
  hintFr: "Ajoutez une clause WHERE après DO UPDATE SET : WHERE EXCLUDED.updated_at > dim_product.updated_at. Cette clause WHERE s'applique uniquement à la résolution du conflit — elle ne filtre pas les lignes insérées.",
  schema: `CREATE TABLE dim_product (
  product_id INTEGER PRIMARY KEY,
  sku VARCHAR UNIQUE,
  product_name VARCHAR,
  price DECIMAL(10,2),
  updated_at TIMESTAMP
);

CREATE TABLE staging_products (
  sku VARCHAR,
  product_name VARCHAR,
  price DECIMAL(10,2),
  updated_at TIMESTAMP
);

INSERT INTO dim_product VALUES
  (1,  'SKU-A1', 'Laptop Pro 15',      1299.99, '2024-03-01 10:00:00'),
  (2,  'SKU-A2', 'Laptop Air 13',       999.99, '2024-03-01 10:00:00'),
  (3,  'SKU-B1', 'Wireless Headset',    149.99, '2024-02-15 08:00:00'),
  (4,  'SKU-B2', 'USB Microphone',       89.99, '2024-02-20 09:00:00'),
  (5,  'SKU-C1', 'Mechanical Keyboard', 129.99, '2024-03-05 14:00:00'),
  (6,  'SKU-C2', 'Gaming Mouse',         59.99, '2024-03-05 14:00:00'),
  (7,  'SKU-D1', 'Monitor 24"',         329.99, '2024-01-10 07:00:00'),
  (8,  'SKU-D2', 'Monitor 27"',         499.99, '2024-01-10 07:00:00'),
  (9,  'SKU-E1', 'Webcam 4K',           129.99, '2024-02-28 12:00:00'),
  (10, 'SKU-E2', 'Ring Light',           49.99, '2024-02-28 12:00:00');

INSERT INTO staging_products VALUES
  -- Newer timestamps: should update
  ('SKU-A1', 'Laptop Pro 15 v2',    1349.99, '2024-03-10 09:00:00'),
  ('SKU-B1', 'Wireless Headset Pro', 179.99, '2024-03-08 11:00:00'),
  ('SKU-D1', 'Monitor 24" QHD',     359.99, '2024-02-01 08:00:00'),
  ('SKU-E1', 'Webcam 4K Ultra',     149.99, '2024-03-15 16:00:00'),
  -- Same timestamp: should NOT update
  ('SKU-A2', 'Laptop Air 13 DUPLICATE', 999.99, '2024-03-01 10:00:00'),
  ('SKU-C1', 'Mechanical Keyboard DUPE', 129.99, '2024-03-05 14:00:00'),
  -- Older timestamps: should NOT update
  ('SKU-B2', 'USB Microphone OLD',   79.99, '2024-01-05 06:00:00'),
  ('SKU-C2', 'Gaming Mouse OLD',     49.99, '2024-02-01 08:00:00'),
  ('SKU-D2', 'Monitor 27" OLD',     459.99, '2023-12-01 00:00:00'),
  -- New SKUs: should insert
  ('SKU-F1', 'Laptop Stand',         34.99, '2024-03-12 10:00:00'),
  ('SKU-F2', 'Cable Management Kit', 19.99, '2024-03-12 10:00:00');`,
  solutionQuery: `INSERT INTO dim_product (product_id, sku, product_name, price, updated_at)
SELECT
  (SELECT MAX(product_id) FROM dim_product) + ROW_NUMBER() OVER () AS product_id,
  sku,
  product_name,
  price,
  updated_at
FROM staging_products
ON CONFLICT (sku) DO UPDATE SET
  product_name = EXCLUDED.product_name,
  price        = EXCLUDED.price,
  updated_at   = EXCLUDED.updated_at
WHERE EXCLUDED.updated_at > dim_product.updated_at;

SELECT product_id, sku, product_name, price, updated_at
FROM dim_product
ORDER BY product_id;`,
  solutionExplanation: `## Explanation

### Pattern: Conditional Upsert (INSERT ON CONFLICT DO UPDATE WHERE)

This extends the basic upsert with a predicate on the DO UPDATE clause. DuckDB supports a \`WHERE\` clause after the \`SET\` assignments that determines whether the update actually fires for conflicting rows.

### Step-by-step
1. \`INSERT INTO dim_product (...)\` with a SELECT from staging — provides the candidate rows.
2. \`ON CONFLICT (sku)\` — the unique natural key that detects duplicates.
3. \`DO UPDATE SET ... WHERE EXCLUDED.updated_at > dim_product.updated_at\` — the update only fires if the incoming timestamp is strictly newer. If the WHERE condition is false, the row is left unchanged (no update, no error).
4. For new SKUs (F1, F2): no conflict detected, rows are inserted with generated IDs.
5. For existing SKUs with newer timestamps (A1, B1, D1, E1): price and name are updated.
6. For existing SKUs with same or older timestamps (A2, C1, B2, C2, D2): the original row is preserved.

### Why
Without the WHERE guard, replaying a batch that partially overlaps with an earlier batch would overwrite newer data with stale values. The timestamp predicate makes the load **idempotent** and **late-arrival safe**.

### When to use
- Multi-source ingestion pipelines where updates may arrive out of order
- CDC (Change Data Capture) merges where the source timestamp is authoritative
- Any upsert where you want to preserve the most recent version of a record`,
  solutionExplanationFr: `## Explication

### Patron : Upsert conditionnel (INSERT ON CONFLICT DO UPDATE WHERE)

Ce patron étend l'upsert de base avec un prédicat sur la clause DO UPDATE. DuckDB supporte une clause \`WHERE\` après les assignations \`SET\` qui détermine si la mise à jour s'exécute réellement pour les lignes en conflit.

### Étape par étape
1. \`INSERT INTO dim_product (...)\` avec un SELECT depuis le staging — fournit les lignes candidates.
2. \`ON CONFLICT (sku)\` — la clé naturelle unique qui détecte les doublons.
3. \`DO UPDATE SET ... WHERE EXCLUDED.updated_at > dim_product.updated_at\` — la mise à jour ne s'exécute que si le timestamp entrant est strictement plus récent. Si la condition WHERE est fausse, la ligne reste inchangée (pas de mise à jour, pas d'erreur).
4. Pour les nouveaux SKUs (F1, F2) : aucun conflit détecté, les lignes sont insérées avec des IDs générés.
5. Pour les SKUs existants avec des timestamps plus récents (A1, B1, D1, E1) : le prix et le nom sont mis à jour.
6. Pour les SKUs existants avec des timestamps identiques ou plus anciens (A2, C1, B2, C2, D2) : la ligne originale est préservée.

### Pourquoi
Sans le garde-fou sur le timestamp, rejouer un lot qui chevauche partiellement un lot antérieur écraserait des données récentes avec des valeurs périmées. Le prédicat sur le timestamp rend le chargement **idempotent** et **résistant aux arrivées tardives**.

### Quand l'utiliser
- Pipelines d'ingestion multi-sources où les mises à jour peuvent arriver dans le désordre
- Fusions CDC (Change Data Capture) où le timestamp source fait autorité
- Tout upsert où on veut préserver la version la plus récente d'un enregistrement`,
  testCases: [
    {
      name: "default",
      description: "12 products: 4 updated (newer), 4 unchanged (same/older ts), 2 unchanged (exact same), 2 inserted new",
      descriptionFr: "12 produits : 4 mis à jour (plus récents), 4 inchangés (même/plus ancien ts), 2 inchangés (identiques), 2 insérés nouveaux",
      expectedColumns: ["product_id", "sku", "product_name", "price", "updated_at"],
      expectedRows: [
        { product_id: 1,  sku: "SKU-A1", product_name: "Laptop Pro 15 v2",      price: 1349.99, updated_at: "2024-03-10 09:00:00" },
        { product_id: 2,  sku: "SKU-A2", product_name: "Laptop Air 13",           price: 999.99,  updated_at: "2024-03-01 10:00:00" },
        { product_id: 3,  sku: "SKU-B1", product_name: "Wireless Headset Pro",    price: 179.99,  updated_at: "2024-03-08 11:00:00" },
        { product_id: 4,  sku: "SKU-B2", product_name: "USB Microphone",          price: 89.99,   updated_at: "2024-02-20 09:00:00" },
        { product_id: 5,  sku: "SKU-C1", product_name: "Mechanical Keyboard",     price: 129.99,  updated_at: "2024-03-05 14:00:00" },
        { product_id: 6,  sku: "SKU-C2", product_name: "Gaming Mouse",            price: 59.99,   updated_at: "2024-03-05 14:00:00" },
        { product_id: 7,  sku: "SKU-D1", product_name: "Monitor 24\" QHD",       price: 359.99,  updated_at: "2024-02-01 08:00:00" },
        { product_id: 8,  sku: "SKU-D2", product_name: "Monitor 27\"",            price: 499.99,  updated_at: "2024-01-10 07:00:00" },
        { product_id: 9,  sku: "SKU-E1", product_name: "Webcam 4K Ultra",         price: 149.99,  updated_at: "2024-03-15 16:00:00" },
        { product_id: 10, sku: "SKU-E2", product_name: "Ring Light",              price: 49.99,   updated_at: "2024-02-28 12:00:00" },
        { product_id: 11, sku: "SKU-F1", product_name: "Laptop Stand",            price: 34.99,   updated_at: "2024-03-12 10:00:00" },
        { product_id: 12, sku: "SKU-F2", product_name: "Cable Management Kit",    price: 19.99,   updated_at: "2024-03-12 10:00:00" },
      ],
      orderMatters: true,
    },
    {
      name: "all-stale-updates",
      description: "When all staging rows have older timestamps, no existing products are updated",
      descriptionFr: "Quand toutes les lignes du staging ont des timestamps plus anciens, aucun produit existant n'est mis à jour",
      setupSql: `DELETE FROM staging_products WHERE sku IN ('SKU-F1', 'SKU-F2');
UPDATE staging_products SET updated_at = '2020-01-01 00:00:00';`,
      expectedColumns: ["product_id", "sku", "product_name", "price", "updated_at"],
      expectedRows: [
        { product_id: 1,  sku: "SKU-A1", product_name: "Laptop Pro 15",       price: 1299.99, updated_at: "2024-03-01 10:00:00" },
        { product_id: 2,  sku: "SKU-A2", product_name: "Laptop Air 13",        price: 999.99,  updated_at: "2024-03-01 10:00:00" },
        { product_id: 3,  sku: "SKU-B1", product_name: "Wireless Headset",     price: 149.99,  updated_at: "2024-02-15 08:00:00" },
        { product_id: 4,  sku: "SKU-B2", product_name: "USB Microphone",       price: 89.99,   updated_at: "2024-02-20 09:00:00" },
        { product_id: 5,  sku: "SKU-C1", product_name: "Mechanical Keyboard",  price: 129.99,  updated_at: "2024-03-05 14:00:00" },
        { product_id: 6,  sku: "SKU-C2", product_name: "Gaming Mouse",         price: 59.99,   updated_at: "2024-03-05 14:00:00" },
        { product_id: 7,  sku: "SKU-D1", product_name: "Monitor 24\"",         price: 329.99,  updated_at: "2024-01-10 07:00:00" },
        { product_id: 8,  sku: "SKU-D2", product_name: "Monitor 27\"",         price: 499.99,  updated_at: "2024-01-10 07:00:00" },
        { product_id: 9,  sku: "SKU-E1", product_name: "Webcam 4K",            price: 129.99,  updated_at: "2024-02-28 12:00:00" },
        { product_id: 10, sku: "SKU-E2", product_name: "Ring Light",           price: 49.99,   updated_at: "2024-02-28 12:00:00" },
      ],
      orderMatters: false,
    },
  ],
};
