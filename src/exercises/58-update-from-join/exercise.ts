import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "58-update-from-join",
  title: "Update Prices from Reference Table",
  titleFr: "Mise à jour des prix depuis une table de référence",
  difficulty: "medium",
  category: "ddl-dml",
  description: `## Update Prices from Reference Table

The procurement team has negotiated new prices with suppliers. The approved price changes are stored in a \`price_updates\` table. Your job is to apply those new prices to the \`products\` table using an \`UPDATE\` with a subquery, then return the updated catalog.

### Schema

**products**
| Column | Type |
|--------|------|
| product_id | INTEGER |
| product_name | VARCHAR |
| category | VARCHAR |
| current_price | DECIMAL(10,2) |
| supplier_code | VARCHAR |

**price_updates** (reference table with approved new prices)
| Column | Type |
|--------|------|
| product_id | INTEGER |
| new_price | DECIMAL(10,2) |
| effective_date | DATE |
| approved_by | VARCHAR |

### Task

Write an \`UPDATE products SET current_price = ...\` that applies the new price from \`price_updates\` for every product that has a matching entry. Products without a match keep their original price.

Then \`SELECT product_id, product_name, category, current_price, supplier_code FROM products ORDER BY product_id\`.

### Expected output columns
\`product_id\`, \`product_name\`, \`category\`, \`current_price\`, \`supplier_code\``,
  descriptionFr: `## Mise à jour des prix depuis une table de référence

L'équipe achats a négocié de nouveaux tarifs avec les fournisseurs. Les changements de prix approuvés sont stockés dans une table \`price_updates\`. Votre mission est d'appliquer ces nouveaux prix à la table \`products\` via un \`UPDATE\` avec sous-requête, puis retourner le catalogue mis à jour.

### Schéma

**products**
| Colonne | Type |
|---------|------|
| product_id | INTEGER |
| product_name | VARCHAR |
| category | VARCHAR |
| current_price | DECIMAL(10,2) |
| supplier_code | VARCHAR |

**price_updates** (table de référence avec les nouveaux prix approuvés)
| Colonne | Type |
|---------|------|
| product_id | INTEGER |
| new_price | DECIMAL(10,2) |
| effective_date | DATE |
| approved_by | VARCHAR |

### Tâche

Écrivez un \`UPDATE products SET current_price = ...\` qui applique le nouveau prix de \`price_updates\` pour chaque produit ayant une correspondance. Les produits sans correspondance conservent leur prix d'origine.

Puis \`SELECT product_id, product_name, category, current_price, supplier_code FROM products ORDER BY product_id\`.

### Colonnes attendues en sortie
\`product_id\`, \`product_name\`, \`category\`, \`current_price\`, \`supplier_code\``,
  hint: "Use UPDATE products SET current_price = (SELECT new_price FROM price_updates WHERE price_updates.product_id = products.product_id) WHERE product_id IN (SELECT product_id FROM price_updates).",
  hintFr: "Utilisez UPDATE products SET current_price = (SELECT new_price FROM price_updates WHERE price_updates.product_id = products.product_id) WHERE product_id IN (SELECT product_id FROM price_updates).",
  schema: `CREATE TABLE products (
  product_id INTEGER PRIMARY KEY,
  product_name VARCHAR,
  category VARCHAR,
  current_price DECIMAL(10,2),
  supplier_code VARCHAR
);

CREATE TABLE price_updates (
  product_id INTEGER,
  new_price DECIMAL(10,2),
  effective_date DATE,
  approved_by VARCHAR
);

INSERT INTO products VALUES
  (1,  'Wireless Mouse',       'Electronics', 29.99,  'SUP-01'),
  (2,  'USB-C Hub',            'Electronics', 49.99,  'SUP-01'),
  (3,  'Desk Lamp',            'Lighting',    19.99,  'SUP-02'),
  (4,  'Mechanical Keyboard',  'Electronics', 89.99,  'SUP-01'),
  (5,  'Notebook A5',          'Stationery',   4.99,  'SUP-03'),
  (6,  'Ballpoint Pens 10pk',  'Stationery',   6.49,  'SUP-03'),
  (7,  'Standing Desk',        'Furniture',  349.00,  'SUP-04'),
  (8,  'Ergonomic Chair',      'Furniture',  229.00,  'SUP-04'),
  (9,  'Monitor 27"',          'Electronics', 299.99, 'SUP-01'),
  (10, 'Webcam HD',            'Electronics',  59.99, 'SUP-02'),
  (11, 'Sticky Notes 5pk',     'Stationery',    2.99, 'SUP-03'),
  (12, 'Cable Organizer',      'Accessories',   8.99, 'SUP-02');

INSERT INTO price_updates VALUES
  (1,  24.99,  '2024-04-01', 'alice'),
  (4,  79.99,  '2024-04-01', 'alice'),
  (7,  319.00, '2024-04-01', 'bob'),
  (8,  199.00, '2024-04-01', 'bob'),
  (9,  279.99, '2024-04-01', 'alice'),
  (12,  7.99,  '2024-04-01', 'carol');`,
  solutionQuery: `UPDATE products
SET current_price = (
  SELECT new_price
  FROM price_updates
  WHERE price_updates.product_id = products.product_id
)
WHERE product_id IN (SELECT product_id FROM price_updates);

SELECT product_id, product_name, category, current_price, supplier_code
FROM products
ORDER BY product_id;`,
  solutionExplanation: `## Explanation

### Pattern: UPDATE with correlated subquery (Apply reference table changes)

This is the **apply-changes-from-reference** pattern. A separate table holds approved modifications; a correlated subquery in the SET clause looks up the new value for each matched row.

### Step-by-step
1. The outer \`UPDATE products\` targets the table to be modified.
2. \`SET current_price = (SELECT new_price FROM price_updates WHERE price_updates.product_id = products.product_id)\` — for each row being updated, the subquery fetches the corresponding new price from the reference table (correlated on \`product_id\`).
3. \`WHERE product_id IN (SELECT product_id FROM price_updates)\` — restricts the update to only rows that have a match. Without this clause, products without a match would have their price set to NULL.
4. The final SELECT confirms the result: 6 products have new prices, 6 keep their originals.

### Why
The \`WHERE ... IN (subquery)\` guard is critical. Omitting it causes the correlated subquery in SET to return NULL for unmatched rows, silently zeroing out prices.

### When to use
- Applying bulk price changes from a negotiation or pricing tool
- Syncing a dimension table with updated attributes from a source system
- Any ETL step where a reference table drives partial updates to a target table`,
  solutionExplanationFr: `## Explication

### Patron : UPDATE avec sous-requête corrélée (appliquer des changements depuis une table de référence)

Il s'agit du patron **appliquer-des-changements-depuis-la-référence**. Une table séparée contient les modifications approuvées ; une sous-requête corrélée dans la clause SET récupère la nouvelle valeur pour chaque ligne concernée.

### Étape par étape
1. L'\`UPDATE products\` externe cible la table à modifier.
2. \`SET current_price = (SELECT new_price FROM price_updates WHERE price_updates.product_id = products.product_id)\` — pour chaque ligne mise à jour, la sous-requête récupère le nouveau prix correspondant (corrélée sur \`product_id\`).
3. \`WHERE product_id IN (SELECT product_id FROM price_updates)\` — restreint la mise à jour aux seules lignes ayant une correspondance. Sans cette clause, les produits sans correspondance auraient leur prix mis à NULL.
4. Le SELECT final confirme le résultat : 6 produits ont de nouveaux prix, 6 conservent les leurs.

### Pourquoi
Le garde \`WHERE ... IN (subquery)\` est critique. L'omettre fait retourner NULL par la sous-requête corrélée pour les lignes sans correspondance, remettant silencieusement les prix à zéro.

### Quand l'utiliser
- Appliquer des changements de prix en masse depuis un outil de négociation
- Synchroniser une table de dimension avec des attributs mis à jour depuis un système source
- Toute étape ETL où une table de référence pilote des mises à jour partielles sur une table cible`,
  testCases: [
    {
      name: "default",
      description: "6 products updated with new prices; 6 products retain original prices",
      descriptionFr: "6 produits mis à jour avec les nouveaux prix ; 6 produits conservent leurs prix d'origine",
      expectedColumns: ["product_id", "product_name", "category", "current_price", "supplier_code"],
      expectedRows: [
        { product_id: 1,  product_name: "Wireless Mouse",      category: "Electronics", current_price: 24.99,  supplier_code: "SUP-01" },
        { product_id: 2,  product_name: "USB-C Hub",           category: "Electronics", current_price: 49.99,  supplier_code: "SUP-01" },
        { product_id: 3,  product_name: "Desk Lamp",           category: "Lighting",    current_price: 19.99,  supplier_code: "SUP-02" },
        { product_id: 4,  product_name: "Mechanical Keyboard", category: "Electronics", current_price: 79.99,  supplier_code: "SUP-01" },
        { product_id: 5,  product_name: "Notebook A5",         category: "Stationery",  current_price: 4.99,   supplier_code: "SUP-03" },
        { product_id: 6,  product_name: "Ballpoint Pens 10pk", category: "Stationery",  current_price: 6.49,   supplier_code: "SUP-03" },
        { product_id: 7,  product_name: "Standing Desk",       category: "Furniture",   current_price: 319.00, supplier_code: "SUP-04" },
        { product_id: 8,  product_name: "Ergonomic Chair",     category: "Furniture",   current_price: 199.00, supplier_code: "SUP-04" },
        { product_id: 9,  product_name: "Monitor 27\"",        category: "Electronics", current_price: 279.99, supplier_code: "SUP-01" },
        { product_id: 10, product_name: "Webcam HD",           category: "Electronics", current_price: 59.99,  supplier_code: "SUP-02" },
        { product_id: 11, product_name: "Sticky Notes 5pk",    category: "Stationery",  current_price: 2.99,   supplier_code: "SUP-03" },
        { product_id: 12, product_name: "Cable Organizer",     category: "Accessories", current_price: 7.99,   supplier_code: "SUP-02" },
      ],
      orderMatters: true,
    },
    {
      name: "no-updates",
      description: "With an empty price_updates table, all products keep original prices",
      descriptionFr: "Avec une table price_updates vide, tous les produits conservent leurs prix d'origine",
      setupSql: `DELETE FROM price_updates;`,
      expectedColumns: ["product_id", "product_name", "category", "current_price", "supplier_code"],
      expectedRows: [
        { product_id: 1,  product_name: "Wireless Mouse",      category: "Electronics", current_price: 29.99,  supplier_code: "SUP-01" },
        { product_id: 2,  product_name: "USB-C Hub",           category: "Electronics", current_price: 49.99,  supplier_code: "SUP-01" },
        { product_id: 3,  product_name: "Desk Lamp",           category: "Lighting",    current_price: 19.99,  supplier_code: "SUP-02" },
        { product_id: 4,  product_name: "Mechanical Keyboard", category: "Electronics", current_price: 89.99,  supplier_code: "SUP-01" },
        { product_id: 5,  product_name: "Notebook A5",         category: "Stationery",  current_price: 4.99,   supplier_code: "SUP-03" },
        { product_id: 6,  product_name: "Ballpoint Pens 10pk", category: "Stationery",  current_price: 6.49,   supplier_code: "SUP-03" },
        { product_id: 7,  product_name: "Standing Desk",       category: "Furniture",   current_price: 349.00, supplier_code: "SUP-04" },
        { product_id: 8,  product_name: "Ergonomic Chair",     category: "Furniture",   current_price: 229.00, supplier_code: "SUP-04" },
        { product_id: 9,  product_name: "Monitor 27\"",        category: "Electronics", current_price: 299.99, supplier_code: "SUP-01" },
        { product_id: 10, product_name: "Webcam HD",           category: "Electronics", current_price: 59.99,  supplier_code: "SUP-02" },
        { product_id: 11, product_name: "Sticky Notes 5pk",    category: "Stationery",  current_price: 2.99,   supplier_code: "SUP-03" },
        { product_id: 12, product_name: "Cable Organizer",     category: "Accessories", current_price: 8.99,   supplier_code: "SUP-02" },
      ],
      orderMatters: true,
    },
  ],
};
