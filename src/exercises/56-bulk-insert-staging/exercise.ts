import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "56-bulk-insert-staging",
  title: "Bulk Insert from Staging",
  titleFr: "Chargement en masse depuis la zone de staging",
  difficulty: "easy",
  category: "ddl-dml",
  description: `## Bulk Insert from Staging

The data engineering team receives a nightly CSV dump of new products from suppliers. The file is first loaded into a \`staging_products\` table for validation. Your job is to copy only **valid rows** (where \`price > 0\` AND \`category IS NOT NULL\`) into the production \`products\` table using \`INSERT INTO ... SELECT\`.

### Schema

**staging_products** (raw import — may contain invalid rows)
| Column | Type |
|--------|------|
| staging_id | INTEGER |
| product_name | VARCHAR |
| category | VARCHAR |
| price | DECIMAL(10,2) |
| supplier_code | VARCHAR |
| loaded_at | DATE |

**products** (production table — starts empty)
| Column | Type |
|--------|------|
| product_id | INTEGER |
| product_name | VARCHAR |
| category | VARCHAR |
| price | DECIMAL(10,2) |
| supplier_code | VARCHAR |

### Task

Write an \`INSERT INTO products SELECT ...\` statement that loads only the valid rows from \`staging_products\` into \`products\`. After the insert, write a \`SELECT\` that returns the loaded products.

Filter out rows where \`price <= 0\` OR \`category IS NULL\`.

### Expected output columns
\`product_id\`, \`product_name\`, \`category\`, \`price\`, \`supplier_code\`

Order by \`product_id\` ASC.`,
  descriptionFr: `## Chargement en masse depuis la zone de staging

L'équipe data engineering reçoit chaque nuit un export CSV de nouveaux produits fournisseurs. Ce fichier est d'abord chargé dans une table \`staging_products\` pour validation. Votre mission est de copier uniquement les **lignes valides** (où \`price > 0\` ET \`category IS NOT NULL\`) dans la table de production \`products\` via un \`INSERT INTO ... SELECT\`.

### Schéma

**staging_products** (import brut — peut contenir des lignes invalides)
| Colonne | Type |
|---------|------|
| staging_id | INTEGER |
| product_name | VARCHAR |
| category | VARCHAR |
| price | DECIMAL(10,2) |
| supplier_code | VARCHAR |
| loaded_at | DATE |

**products** (table de production — vide au départ)
| Colonne | Type |
|---------|------|
| product_id | INTEGER |
| product_name | VARCHAR |
| category | VARCHAR |
| price | DECIMAL(10,2) |
| supplier_code | VARCHAR |

### Tâche

Écrivez un \`INSERT INTO products SELECT ...\` qui charge uniquement les lignes valides de \`staging_products\` dans \`products\`. Après l'insertion, écrivez un \`SELECT\` qui retourne les produits chargés.

Excluez les lignes où \`price <= 0\` OU \`category IS NULL\`.

### Colonnes attendues en sortie
\`product_id\`, \`product_name\`, \`category\`, \`price\`, \`supplier_code\`

Triez par \`product_id\` ASC.`,
  hint: "Use INSERT INTO products SELECT staging_id, product_name, category, price, supplier_code FROM staging_products WHERE ... Then SELECT * FROM products ORDER BY product_id.",
  hintFr: "Utilisez INSERT INTO products SELECT staging_id, product_name, category, price, supplier_code FROM staging_products WHERE ... Puis SELECT * FROM products ORDER BY product_id.",
  schema: `CREATE TABLE staging_products (
  staging_id INTEGER PRIMARY KEY,
  product_name VARCHAR,
  category VARCHAR,
  price DECIMAL(10,2),
  supplier_code VARCHAR,
  loaded_at DATE
);

CREATE TABLE products (
  product_id INTEGER PRIMARY KEY,
  product_name VARCHAR,
  category VARCHAR,
  price DECIMAL(10,2),
  supplier_code VARCHAR
);

INSERT INTO staging_products VALUES
  (1,  'Wireless Mouse',        'Electronics',   29.99, 'SUP-01', '2024-03-01'),
  (2,  'USB-C Hub',             'Electronics',   49.99, 'SUP-01', '2024-03-01'),
  (3,  'Desk Lamp',             NULL,            19.99, 'SUP-02', '2024-03-01'),
  (4,  'Mechanical Keyboard',   'Electronics',   89.99, 'SUP-01', '2024-03-01'),
  (5,  'Notebook A5',           'Stationery',     4.99, 'SUP-03', '2024-03-01'),
  (6,  'Ballpoint Pens (10pk)', 'Stationery',     6.49, 'SUP-03', '2024-03-01'),
  (7,  'Standing Desk',         'Furniture',    349.00, 'SUP-04', '2024-03-01'),
  (8,  'Ergonomic Chair',       'Furniture',    229.00, 'SUP-04', '2024-03-01'),
  (9,  'Corrupted Record',      NULL,            -1.00, 'SUP-99', '2024-03-01'),
  (10, 'Monitor 27"',           'Electronics',  299.99, 'SUP-01', '2024-03-01'),
  (11, 'Webcam HD',             'Electronics',   59.99, 'SUP-02', '2024-03-01'),
  (12, 'Sticky Notes',          'Stationery',     2.99, 'SUP-03', '2024-03-01'),
  (13, 'Zero Price Item',       'Electronics',    0.00, 'SUP-01', '2024-03-01'),
  (14, 'Cable Organizer',       'Accessories',    8.99, 'SUP-02', '2024-03-01'),
  (15, 'No Category Headset',   NULL,            79.99, 'SUP-02', '2024-03-01');`,
  solutionQuery: `INSERT INTO products
SELECT
  staging_id,
  product_name,
  category,
  price,
  supplier_code
FROM staging_products
WHERE price > 0
  AND category IS NOT NULL;

SELECT product_id, product_name, category, price, supplier_code
FROM products
ORDER BY product_id;`,
  solutionExplanation: `## Explanation

### Pattern: Bulk Insert from Staging (INSERT INTO ... SELECT)

This is the foundational **staging-to-production load** pattern. Raw data lands in a staging table first; a filtered INSERT copies only the valid subset to the production table.

### Step-by-step
1. \`INSERT INTO products\` — targets the production table.
2. \`SELECT staging_id, product_name, category, price, supplier_code FROM staging_products\` — maps staging columns to production columns by position.
3. \`WHERE price > 0 AND category IS NOT NULL\` — the validation filter. Three rows are rejected: the corrupted record (price = -1), the zero-price item, and the two NULL-category rows.
4. The follow-up \`SELECT\` reads the now-populated \`products\` table to confirm the load.

### Why
Staging tables act as a quarantine zone. Loading validated rows in a single SQL statement is atomic and auditable — either all valid rows are inserted or none are (within a transaction).

### When to use
- Nightly batch loads from external data sources
- ETL pipelines where raw data arrives in a landing table before being promoted
- Any scenario where you need to filter, rename, or cast columns during a bulk copy`,
  solutionExplanationFr: `## Explication

### Patron : Chargement en masse depuis le staging (INSERT INTO ... SELECT)

Il s'agit du patron fondamental de **chargement staging → production**. Les données brutes arrivent d'abord dans une table de staging ; un INSERT filtré ne copie que le sous-ensemble valide vers la table de production.

### Étape par étape
1. \`INSERT INTO products\` — cible la table de production.
2. \`SELECT staging_id, product_name, category, price, supplier_code FROM staging_products\` — mappe les colonnes du staging vers la production par position.
3. \`WHERE price > 0 AND category IS NOT NULL\` — le filtre de validation. Trois lignes sont rejetées : l'enregistrement corrompu (price = -1), l'article à prix zéro, et les deux lignes avec category NULL.
4. Le \`SELECT\` final lit la table \`products\` maintenant peuplée pour confirmer le chargement.

### Pourquoi
Les tables de staging servent de zone de quarantaine. Charger les lignes validées en une seule instruction SQL est atomique et traçable.

### Quand l'utiliser
- Chargements batch nocturnes depuis des sources externes
- Pipelines ETL où les données brutes arrivent dans une table d'atterrissage avant promotion
- Tout scénario où il faut filtrer, renommer ou caster des colonnes lors d'une copie en masse`,
  testCases: [
    {
      name: "default",
      description: "12 valid rows loaded; 3 invalid rows (NULL category or price <= 0) excluded",
      descriptionFr: "12 lignes valides chargées ; 3 lignes invalides (category NULL ou price <= 0) exclues",
      expectedColumns: ["product_id", "product_name", "category", "price", "supplier_code"],
      expectedRows: [
        { product_id: 1,  product_name: "Wireless Mouse",        category: "Electronics", price: 29.99, supplier_code: "SUP-01" },
        { product_id: 2,  product_name: "USB-C Hub",             category: "Electronics", price: 49.99, supplier_code: "SUP-01" },
        { product_id: 4,  product_name: "Mechanical Keyboard",   category: "Electronics", price: 89.99, supplier_code: "SUP-01" },
        { product_id: 5,  product_name: "Notebook A5",           category: "Stationery",  price: 4.99,  supplier_code: "SUP-03" },
        { product_id: 6,  product_name: "Ballpoint Pens (10pk)", category: "Stationery",  price: 6.49,  supplier_code: "SUP-03" },
        { product_id: 7,  product_name: "Standing Desk",         category: "Furniture",   price: 349.00, supplier_code: "SUP-04" },
        { product_id: 8,  product_name: "Ergonomic Chair",       category: "Furniture",   price: 229.00, supplier_code: "SUP-04" },
        { product_id: 10, product_name: "Monitor 27\"",          category: "Electronics", price: 299.99, supplier_code: "SUP-01" },
        { product_id: 11, product_name: "Webcam HD",             category: "Electronics", price: 59.99, supplier_code: "SUP-02" },
        { product_id: 12, product_name: "Sticky Notes",          category: "Stationery",  price: 2.99,  supplier_code: "SUP-03" },
        { product_id: 14, product_name: "Cable Organizer",       category: "Accessories", price: 8.99,  supplier_code: "SUP-02" },
      ],
      orderMatters: true,
    },
    {
      name: "all-invalid",
      description: "When all staging rows are invalid, products table stays empty",
      descriptionFr: "Quand toutes les lignes du staging sont invalides, la table products reste vide",
      setupSql: `DELETE FROM staging_products WHERE price > 0 AND category IS NOT NULL;`,
      expectedColumns: ["product_id", "product_name", "category", "price", "supplier_code"],
      expectedRows: [],
      orderMatters: false,
    },
  ],
};
