import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "76-insert-or-replace",
  title: "Product Dimension Upsert",
  titleFr: "Upsert de la dimension produit",
  difficulty: "medium",
  category: "merge-upsert",
  description: `## Product Dimension Upsert

The data platform team loads a product dimension table every morning from a supplier feed. The feed contains both **updated versions of existing products** and **brand-new products**. Your job is to write an upsert that inserts new products and replaces existing ones (price or category may have changed).

Use DuckDB's \`INSERT OR REPLACE INTO\` syntax (or equivalently \`INSERT INTO ... ON CONFLICT (id) DO UPDATE SET ...\`) to perform the upsert atomically.

### Schema

**products** (target dimension — already has 10 rows)
| Column | Type |
|--------|------|
| product_id | INTEGER (PRIMARY KEY) |
| product_name | VARCHAR |
| category | VARCHAR |
| price | DECIMAL(10,2) |

**new_products** (staging — 5 rows: 3 existing IDs + 2 new)
| Column | Type |
|--------|------|
| product_id | INTEGER |
| product_name | VARCHAR |
| category | VARCHAR |
| price | DECIMAL(10,2) |

### Task

Write a query that upserts every row from \`new_products\` into \`products\`: insert if the \`product_id\` does not exist, replace (update all columns) if it does. Then \`SELECT\` all products ordered by \`product_id\` ASC.

### Expected output columns
\`product_id\`, \`product_name\`, \`category\`, \`price\``,
  descriptionFr: `## Upsert de la dimension produit

L'équipe data platform charge chaque matin une table de dimension produit depuis un flux fournisseur. Ce flux contient à la fois des **versions mises à jour de produits existants** et des **produits entièrement nouveaux**. Votre mission est d'écrire un upsert qui insère les nouveaux produits et remplace les existants (le prix ou la catégorie peuvent avoir changé).

Utilisez la syntaxe \`INSERT OR REPLACE INTO\` de DuckDB (ou de manière équivalente \`INSERT INTO ... ON CONFLICT (id) DO UPDATE SET ...\`) pour effectuer l'upsert de manière atomique.

### Schéma

**products** (dimension cible — contient déjà 10 lignes)
| Colonne | Type |
|---------|------|
| product_id | INTEGER (PRIMARY KEY) |
| product_name | VARCHAR |
| category | VARCHAR |
| price | DECIMAL(10,2) |

**new_products** (staging — 5 lignes : 3 IDs existants + 2 nouveaux)
| Colonne | Type |
|---------|------|
| product_id | INTEGER |
| product_name | VARCHAR |
| category | VARCHAR |
| price | DECIMAL(10,2) |

### Tâche

Écrivez une requête qui upsert chaque ligne de \`new_products\` dans \`products\` : insertion si le \`product_id\` n'existe pas, remplacement (mise à jour de toutes les colonnes) s'il existe. Puis faites un \`SELECT\` de tous les produits triés par \`product_id\` ASC.

### Colonnes attendues en sortie
\`product_id\`, \`product_name\`, \`category\`, \`price\``,
  hint: "Use INSERT OR REPLACE INTO products SELECT ... FROM new_products. DuckDB will delete the conflicting row and insert the new one. Follow with SELECT * FROM products ORDER BY product_id.",
  hintFr: "Utilisez INSERT OR REPLACE INTO products SELECT ... FROM new_products. DuckDB supprime la ligne en conflit et insère la nouvelle. Suivez avec SELECT * FROM products ORDER BY product_id.",
  schema: `CREATE TABLE products (
  product_id INTEGER PRIMARY KEY,
  product_name VARCHAR,
  category VARCHAR,
  price DECIMAL(10,2)
);

CREATE TABLE new_products (
  product_id INTEGER,
  product_name VARCHAR,
  category VARCHAR,
  price DECIMAL(10,2)
);

INSERT INTO products VALUES
  (1,  'Wireless Mouse',      'Electronics',  29.99),
  (2,  'USB-C Hub',           'Electronics',  49.99),
  (3,  'Desk Lamp',           'Furniture',    19.99),
  (4,  'Mechanical Keyboard', 'Electronics',  89.99),
  (5,  'Notebook A5',         'Stationery',    4.99),
  (6,  'Ballpoint Pens 10pk', 'Stationery',    6.49),
  (7,  'Standing Desk',       'Furniture',   349.00),
  (8,  'Ergonomic Chair',     'Furniture',   229.00),
  (9,  'Monitor 27"',         'Electronics', 299.99),
  (10, 'Webcam HD',           'Electronics',  59.99);

INSERT INTO new_products VALUES
  (2,  'USB-C Hub Pro',       'Electronics',  64.99),
  (5,  'Notebook A5 Ruled',   'Stationery',    5.49),
  (9,  'Monitor 27" 4K',      'Electronics', 399.99),
  (11, 'Cable Organizer',     'Accessories',   8.99),
  (12, 'Laptop Stand',        'Accessories',  34.99);`,
  solutionQuery: `INSERT OR REPLACE INTO products
SELECT product_id, product_name, category, price
FROM new_products;

SELECT product_id, product_name, category, price
FROM products
ORDER BY product_id;`,
  solutionExplanation: `## Explanation

### Pattern: INSERT OR REPLACE (Upsert — full row replacement)

\`INSERT OR REPLACE\` is the simplest upsert strategy. When a row with a conflicting primary key already exists, DuckDB deletes the old row and inserts the new one atomically.

### Step-by-step
1. \`INSERT OR REPLACE INTO products\` — declares the upsert target.
2. \`SELECT product_id, product_name, category, price FROM new_products\` — provides the source rows. Column order must match the target table.
3. For IDs 2, 5, 9 (existing): the old rows are deleted and replaced with the new values.
4. For IDs 11, 12 (new): rows are inserted directly.
5. The final \`SELECT\` confirms the 12-row state of the dimension table.

### Why
\`INSERT OR REPLACE\` is semantically equivalent to DELETE + INSERT for conflicting rows. It is simpler than \`ON CONFLICT DO UPDATE\` when you want to replace every column, and it avoids the verbosity of listing each SET assignment.

### When to use
- Daily dimension loads where the source is authoritative and you want to fully replace changed records
- When you don't need to preserve columns not present in the source
- Simple ETL pipelines where all columns are always present in the staging table`,
  solutionExplanationFr: `## Explication

### Patron : INSERT OR REPLACE (Upsert — remplacement complet de ligne)

\`INSERT OR REPLACE\` est la stratégie d'upsert la plus simple. Quand une ligne avec une clé primaire en conflit existe déjà, DuckDB supprime l'ancienne ligne et insère la nouvelle de manière atomique.

### Étape par étape
1. \`INSERT OR REPLACE INTO products\` — déclare la cible de l'upsert.
2. \`SELECT product_id, product_name, category, price FROM new_products\` — fournit les lignes source. L'ordre des colonnes doit correspondre à la table cible.
3. Pour les IDs 2, 5, 9 (existants) : les anciennes lignes sont supprimées et remplacées par les nouvelles valeurs.
4. Pour les IDs 11, 12 (nouveaux) : les lignes sont insérées directement.
5. Le \`SELECT\` final confirme l'état à 12 lignes de la table de dimension.

### Pourquoi
\`INSERT OR REPLACE\` est sémantiquement équivalent à DELETE + INSERT pour les lignes en conflit. C'est plus simple que \`ON CONFLICT DO UPDATE\` quand on veut remplacer toutes les colonnes, et cela évite la verbosité de lister chaque assignation SET.

### Quand l'utiliser
- Chargements quotidiens de dimensions où la source fait autorité et on veut remplacer intégralement les enregistrements modifiés
- Quand on n'a pas besoin de préserver des colonnes absentes de la source
- Pipelines ETL simples où toutes les colonnes sont toujours présentes dans la table de staging`,
  testCases: [
    {
      name: "default",
      description: "12 products total: 7 unchanged + 3 replaced + 2 new, ordered by product_id",
      descriptionFr: "12 produits au total : 7 inchangés + 3 remplacés + 2 nouveaux, triés par product_id",
      expectedColumns: ["product_id", "product_name", "category", "price"],
      expectedRows: [
        { product_id: 1,  product_name: "Wireless Mouse",      category: "Electronics", price: 29.99 },
        { product_id: 2,  product_name: "USB-C Hub Pro",       category: "Electronics", price: 64.99 },
        { product_id: 3,  product_name: "Desk Lamp",           category: "Furniture",   price: 19.99 },
        { product_id: 4,  product_name: "Mechanical Keyboard", category: "Electronics", price: 89.99 },
        { product_id: 5,  product_name: "Notebook A5 Ruled",   category: "Stationery",  price: 5.49  },
        { product_id: 6,  product_name: "Ballpoint Pens 10pk", category: "Stationery",  price: 6.49  },
        { product_id: 7,  product_name: "Standing Desk",       category: "Furniture",   price: 349.00 },
        { product_id: 8,  product_name: "Ergonomic Chair",     category: "Furniture",   price: 229.00 },
        { product_id: 9,  product_name: "Monitor 27\" 4K",    category: "Electronics", price: 399.99 },
        { product_id: 10, product_name: "Webcam HD",           category: "Electronics", price: 59.99  },
        { product_id: 11, product_name: "Cable Organizer",     category: "Accessories", price: 8.99   },
        { product_id: 12, product_name: "Laptop Stand",        category: "Accessories", price: 34.99  },
      ],
      orderMatters: true,
    },
    {
      name: "empty-staging",
      description: "When new_products is empty, products table remains unchanged with original 10 rows",
      descriptionFr: "Quand new_products est vide, la table products reste inchangée avec ses 10 lignes d'origine",
      setupSql: `DELETE FROM new_products;`,
      expectedColumns: ["product_id", "product_name", "category", "price"],
      expectedRows: [
        { product_id: 1,  product_name: "Wireless Mouse",      category: "Electronics", price: 29.99 },
        { product_id: 2,  product_name: "USB-C Hub",           category: "Electronics", price: 49.99 },
        { product_id: 3,  product_name: "Desk Lamp",           category: "Furniture",   price: 19.99 },
        { product_id: 4,  product_name: "Mechanical Keyboard", category: "Electronics", price: 89.99 },
        { product_id: 5,  product_name: "Notebook A5",         category: "Stationery",  price: 4.99  },
        { product_id: 6,  product_name: "Ballpoint Pens 10pk", category: "Stationery",  price: 6.49  },
        { product_id: 7,  product_name: "Standing Desk",       category: "Furniture",   price: 349.00 },
        { product_id: 8,  product_name: "Ergonomic Chair",     category: "Furniture",   price: 229.00 },
        { product_id: 9,  product_name: "Monitor 27\"",        category: "Electronics", price: 299.99 },
        { product_id: 10, product_name: "Webcam HD",           category: "Electronics", price: 59.99  },
      ],
      orderMatters: false,
    },
  ],
};
