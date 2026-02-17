import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "80-idempotent-dimension-load",
  title: "Idempotent Dimension Load",
  titleFr: "Chargement idempotent de dimension",
  difficulty: "hard",
  category: "merge-upsert",
  description: `## Idempotent Dimension Load

The data engineering team needs to build a **complete idempotent SCD Type 1 load** for the product dimension. Every day at 6 AM, a staging table \`stg_product\` arrives with the full current state from the source system. The pipeline must:

1. **Insert** new products (present in staging, absent from target)
2. **Update** changed products (present in both, but attributes differ)
3. **Soft-delete** removed products (present in target, absent from staging) by setting \`is_active = false\`
4. Leave unchanged products untouched

Write a **single SELECT** that returns the **final state** of \`dim_product\` after all three operations have been applied, showing all products with their current \`is_active\` flag.

### Schema

**dim_product** (target — 10 products, mix of active states)
| Column | Type |
|--------|------|
| product_id | INTEGER (PRIMARY KEY) |
| sku | VARCHAR (UNIQUE) |
| product_name | VARCHAR |
| price | DECIMAL(10,2) |
| is_active | BOOLEAN |

**stg_product** (daily full extract — 9 products: 2 new, 5 same, 3 changed, 3 removed from target)
| Column | Type |
|--------|------|
| sku | VARCHAR |
| product_name | VARCHAR |
| price | DECIMAL(10,2) |

### Task

Write the three DML statements in sequence:
1. \`INSERT INTO dim_product ... ON CONFLICT (sku) DO UPDATE SET ...\` to upsert staging rows (updating name and price for changed records, setting \`is_active = true\` for all)
2. \`UPDATE dim_product SET is_active = false WHERE sku NOT IN (SELECT sku FROM stg_product)\` to soft-delete removed products

Then \`SELECT\` all products ordered by \`product_id\` ASC showing the final state.

### Expected output columns
\`product_id\`, \`sku\`, \`product_name\`, \`price\`, \`is_active\``,
  descriptionFr: `## Chargement idempotent de dimension

L'équipe data engineering doit construire un **chargement SCD Type 1 complet et idempotent** pour la dimension produit. Chaque jour à 6h, une table de staging \`stg_product\` arrive avec l'état actuel complet depuis le système source. Le pipeline doit :

1. **Insérer** les nouveaux produits (présents dans le staging, absents de la cible)
2. **Mettre à jour** les produits modifiés (présents dans les deux, mais attributs différents)
3. **Supprimer logiquement** les produits retirés (présents dans la cible, absents du staging) en mettant \`is_active = false\`
4. Laisser les produits inchangés tels quels

Écrivez un **SELECT unique** qui retourne l'**état final** de \`dim_product\` après l'application des trois opérations, affichant tous les produits avec leur flag \`is_active\` courant.

### Schéma

**dim_product** (cible — 10 produits, mix d'états actifs)
| Colonne | Type |
|---------|------|
| product_id | INTEGER (PRIMARY KEY) |
| sku | VARCHAR (UNIQUE) |
| product_name | VARCHAR |
| price | DECIMAL(10,2) |
| is_active | BOOLEAN |

**stg_product** (extraction complète quotidienne — 9 produits : 2 nouveaux, 5 identiques, 3 modifiés, 3 retirés de la cible)
| Colonne | Type |
|---------|------|
| sku | VARCHAR |
| product_name | VARCHAR |
| price | DECIMAL(10,2) |

### Tâche

Écrivez les trois instructions DML en séquence :
1. \`INSERT INTO dim_product ... ON CONFLICT (sku) DO UPDATE SET ...\` pour upsert les lignes du staging (mise à jour nom et prix pour les modifiés, \`is_active = true\` pour tous)
2. \`UPDATE dim_product SET is_active = false WHERE sku NOT IN (SELECT sku FROM stg_product)\` pour la suppression logique des produits retirés

Puis faites un \`SELECT\` de tous les produits triés par \`product_id\` ASC montrant l'état final.

### Colonnes attendues en sortie
\`product_id\`, \`sku\`, \`product_name\`, \`price\`, \`is_active\``,
  hint: "Step 1: INSERT INTO dim_product ON CONFLICT (sku) DO UPDATE SET product_name = EXCLUDED.product_name, price = EXCLUDED.price, is_active = true. Step 2: UPDATE dim_product SET is_active = false WHERE sku NOT IN (SELECT sku FROM stg_product). Then SELECT all.",
  hintFr: "Étape 1 : INSERT INTO dim_product ON CONFLICT (sku) DO UPDATE SET product_name = EXCLUDED.product_name, price = EXCLUDED.price, is_active = true. Étape 2 : UPDATE dim_product SET is_active = false WHERE sku NOT IN (SELECT sku FROM stg_product). Puis SELECT tous.",
  schema: `CREATE TABLE dim_product (
  product_id INTEGER PRIMARY KEY,
  sku VARCHAR UNIQUE,
  product_name VARCHAR,
  price DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE stg_product (
  sku VARCHAR,
  product_name VARCHAR,
  price DECIMAL(10,2)
);

INSERT INTO dim_product VALUES
  (1,  'P-001', 'Laptop Pro 14',        1199.99, true),
  (2,  'P-002', 'Wireless Mouse',          29.99, true),
  (3,  'P-003', 'USB-C Dock',             129.99, true),
  (4,  'P-004', 'Mechanical Keyboard',    109.99, true),
  (5,  'P-005', 'Monitor 24"',            299.99, true),
  (6,  'P-006', 'Webcam HD',               59.99, true),
  (7,  'P-007', 'Headset Pro',            149.99, true),
  (8,  'P-008', 'Desk Mat XL',             24.99, true),
  (9,  'P-009', 'Laptop Stand',            39.99, true),
  (10, 'P-010', 'Cable USB-C 2m',          12.99, true);

INSERT INTO stg_product VALUES
  -- Unchanged (same name and price)
  ('P-001', 'Laptop Pro 14',        1199.99),
  ('P-002', 'Wireless Mouse',          29.99),
  ('P-006', 'Webcam HD',               59.99),
  ('P-009', 'Laptop Stand',            39.99),
  ('P-010', 'Cable USB-C 2m',          12.99),
  -- Changed (price or name updated)
  ('P-003', 'USB-C Dock 10-in-1',    149.99),
  ('P-004', 'Mechanical Keyboard TKL', 99.99),
  ('P-005', 'Monitor 24" QHD',        349.99),
  -- New products (not in dim_product)
  ('P-011', 'Monitor 32" 4K',         599.99),
  ('P-012', 'Ergonomic Chair',         449.99);
  -- Removed from staging (P-007, P-008 absent => soft-delete)`,
  solutionQuery: `INSERT INTO dim_product (product_id, sku, product_name, price, is_active)
SELECT
  (SELECT MAX(product_id) FROM dim_product) + ROW_NUMBER() OVER () AS product_id,
  sku,
  product_name,
  price,
  true AS is_active
FROM stg_product
ON CONFLICT (sku) DO UPDATE SET
  product_name = EXCLUDED.product_name,
  price        = EXCLUDED.price,
  is_active    = true;

UPDATE dim_product
SET is_active = false
WHERE sku NOT IN (SELECT sku FROM stg_product);

SELECT product_id, sku, product_name, price, is_active
FROM dim_product
ORDER BY product_id;`,
  solutionExplanation: `## Explanation

### Pattern: Idempotent Dimension Load (Insert + Update + Soft-Delete)

This is the complete SCD Type 1 pipeline pattern. Running this sequence multiple times on the same data produces the same result — it is idempotent. Three SQL statements handle all four cases: insert, update, soft-delete, and no-op.

### Step-by-step
1. **INSERT ... ON CONFLICT DO UPDATE** — handles inserts (P-011, P-012) and updates (P-003, P-004, P-005) atomically. The \`is_active = true\` in the SET clause also reactivates any previously soft-deleted product that reappears in the source.
2. **UPDATE ... WHERE sku NOT IN (...)** — finds products in \`dim_product\` whose SKU no longer appears in \`stg_product\` (P-007, P-008) and marks them inactive. This is safe because the previous upsert has already committed all source SKUs.
3. **SELECT** — reads the final state: 12 rows total, 10 active (8 original + 2 new), 2 soft-deleted.

### Why
Separating the upsert from the delete avoids the need for a full MERGE statement (which DuckDB does not support natively). Each statement has a clear, testable responsibility. The sequence is idempotent: re-running it on the same day produces identical results.

### When to use
- Daily SCD Type 1 dimension refreshes
- Any pipeline where the source represents the complete current state (full snapshot loads)
- When you need a simple, auditable alternative to MERGE for DuckDB`,
  solutionExplanationFr: `## Explication

### Patron : Chargement idempotent de dimension (Insertion + Mise à jour + Suppression logique)

C'est le patron complet de pipeline SCD Type 1. Exécuter cette séquence plusieurs fois sur les mêmes données produit le même résultat — c'est idempotent. Trois instructions SQL gèrent les quatre cas : insertion, mise à jour, suppression logique, et inaction.

### Étape par étape
1. **INSERT ... ON CONFLICT DO UPDATE** — gère les insertions (P-011, P-012) et les mises à jour (P-003, P-004, P-005) de manière atomique. Le \`is_active = true\` dans la clause SET réactive également tout produit précédemment supprimé logiquement qui réapparaît dans la source.
2. **UPDATE ... WHERE sku NOT IN (...)** — trouve les produits dans \`dim_product\` dont le SKU n'apparaît plus dans \`stg_product\` (P-007, P-008) et les marque inactifs. C'est sûr car l'upsert précédent a déjà validé tous les SKUs source.
3. **SELECT** — lit l'état final : 12 lignes au total, 10 actives (8 originaux + 2 nouveaux), 2 supprimées logiquement.

### Pourquoi
Séparer l'upsert de la suppression évite le besoin d'une instruction MERGE complète (que DuckDB ne supporte pas nativement). Chaque instruction a une responsabilité claire et testable. La séquence est idempotente : la relancer le même jour produit des résultats identiques.

### Quand l'utiliser
- Rafraîchissements quotidiens de dimension SCD Type 1
- Tout pipeline où la source représente l'état actuel complet (chargements de snapshots complets)
- Quand on a besoin d'une alternative simple et auditble à MERGE pour DuckDB`,
  testCases: [
    {
      name: "default",
      description: "12 products: 5 unchanged active, 3 updated active, 2 newly inserted active, 2 soft-deleted (is_active=false)",
      descriptionFr: "12 produits : 5 inchangés actifs, 3 mis à jour actifs, 2 nouvellement insérés actifs, 2 supprimés logiquement (is_active=false)",
      expectedColumns: ["product_id", "sku", "product_name", "price", "is_active"],
      expectedRows: [
        { product_id: 1,  sku: "P-001", product_name: "Laptop Pro 14",           price: 1199.99, is_active: true  },
        { product_id: 2,  sku: "P-002", product_name: "Wireless Mouse",           price: 29.99,   is_active: true  },
        { product_id: 3,  sku: "P-003", product_name: "USB-C Dock 10-in-1",      price: 149.99,  is_active: true  },
        { product_id: 4,  sku: "P-004", product_name: "Mechanical Keyboard TKL", price: 99.99,   is_active: true  },
        { product_id: 5,  sku: "P-005", product_name: "Monitor 24\" QHD",        price: 349.99,  is_active: true  },
        { product_id: 6,  sku: "P-006", product_name: "Webcam HD",               price: 59.99,   is_active: true  },
        { product_id: 7,  sku: "P-007", product_name: "Headset Pro",             price: 149.99,  is_active: false },
        { product_id: 8,  sku: "P-008", product_name: "Desk Mat XL",             price: 24.99,   is_active: false },
        { product_id: 9,  sku: "P-009", product_name: "Laptop Stand",            price: 39.99,   is_active: true  },
        { product_id: 10, sku: "P-010", product_name: "Cable USB-C 2m",          price: 12.99,   is_active: true  },
        { product_id: 11, sku: "P-011", product_name: "Monitor 32\" 4K",         price: 599.99,  is_active: true  },
        { product_id: 12, sku: "P-012", product_name: "Ergonomic Chair",         price: 449.99,  is_active: true  },
      ],
      orderMatters: true,
    },
    {
      name: "idempotent-rerun",
      description: "Running the same load twice produces the same final state — idempotency check",
      descriptionFr: "Exécuter le même chargement deux fois produit le même état final — vérification d'idempotence",
      setupSql: `INSERT INTO dim_product (product_id, sku, product_name, price, is_active)
SELECT
  (SELECT MAX(product_id) FROM dim_product) + ROW_NUMBER() OVER () AS product_id,
  sku, product_name, price, true
FROM stg_product
ON CONFLICT (sku) DO UPDATE SET
  product_name = EXCLUDED.product_name,
  price        = EXCLUDED.price,
  is_active    = true;
UPDATE dim_product SET is_active = false WHERE sku NOT IN (SELECT sku FROM stg_product);`,
      expectedColumns: ["product_id", "sku", "product_name", "price", "is_active"],
      expectedRows: [
        { product_id: 1,  sku: "P-001", product_name: "Laptop Pro 14",           price: 1199.99, is_active: true  },
        { product_id: 2,  sku: "P-002", product_name: "Wireless Mouse",           price: 29.99,   is_active: true  },
        { product_id: 3,  sku: "P-003", product_name: "USB-C Dock 10-in-1",      price: 149.99,  is_active: true  },
        { product_id: 4,  sku: "P-004", product_name: "Mechanical Keyboard TKL", price: 99.99,   is_active: true  },
        { product_id: 5,  sku: "P-005", product_name: "Monitor 24\" QHD",        price: 349.99,  is_active: true  },
        { product_id: 6,  sku: "P-006", product_name: "Webcam HD",               price: 59.99,   is_active: true  },
        { product_id: 7,  sku: "P-007", product_name: "Headset Pro",             price: 149.99,  is_active: false },
        { product_id: 8,  sku: "P-008", product_name: "Desk Mat XL",             price: 24.99,   is_active: false },
        { product_id: 9,  sku: "P-009", product_name: "Laptop Stand",            price: 39.99,   is_active: true  },
        { product_id: 10, sku: "P-010", product_name: "Cable USB-C 2m",          price: 12.99,   is_active: true  },
        { product_id: 11, sku: "P-011", product_name: "Monitor 32\" 4K",         price: 599.99,  is_active: true  },
        { product_id: 12, sku: "P-012", product_name: "Ergonomic Chair",         price: 449.99,  is_active: true  },
      ],
      orderMatters: false,
    },
  ],
};
