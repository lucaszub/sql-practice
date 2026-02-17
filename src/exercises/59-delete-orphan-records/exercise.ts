import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "59-delete-orphan-records",
  title: "Delete Orphan Order Items",
  titleFr: "Supprimer les lignes de commande orphelines",
  difficulty: "medium",
  category: "ddl-dml",
  description: `## Delete Orphan Order Items

The operations team performed a hard delete on cancelled orders directly in the database, bypassing the application layer. This left behind \`order_items\` rows that reference orders which no longer exist — so-called **orphan records**. Your job is to clean them up using a \`DELETE\` with a subquery (anti-join pattern), then confirm the result.

### Schema

**orders** (some orders were deleted — gaps in order_id sequence are intentional)
| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| order_date | DATE |
| status | VARCHAR |

**order_items** (may contain rows referencing deleted orders)
| Column | Type |
|--------|------|
| item_id | INTEGER |
| order_id | INTEGER |
| product_name | VARCHAR |
| quantity | INTEGER |
| unit_price | DECIMAL(10,2) |

### Task

Write a \`DELETE FROM order_items WHERE order_id NOT IN (SELECT order_id FROM orders)\` to remove all orphan rows. Then \`SELECT\` the remaining items to confirm the cleanup.

### Expected output columns
\`item_id\`, \`order_id\`, \`product_name\`, \`quantity\`, \`unit_price\`

Order by \`item_id\` ASC.`,
  descriptionFr: `## Supprimer les lignes de commande orphelines

L'équipe opérations a effectué une suppression directe des commandes annulées dans la base de données, en contournant la couche applicative. Cela a laissé des lignes dans \`order_items\` qui référencent des commandes inexistantes — des **enregistrements orphelins**. Votre mission est de les nettoyer avec un \`DELETE\` et une sous-requête (patron anti-jointure), puis confirmer le résultat.

### Schéma

**orders** (certaines commandes ont été supprimées — les trous dans la séquence d'order_id sont intentionnels)
| Colonne | Type |
|---------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| order_date | DATE |
| status | VARCHAR |

**order_items** (peut contenir des lignes référençant des commandes supprimées)
| Colonne | Type |
|---------|------|
| item_id | INTEGER |
| order_id | INTEGER |
| product_name | VARCHAR |
| quantity | INTEGER |
| unit_price | DECIMAL(10,2) |

### Tâche

Écrivez un \`DELETE FROM order_items WHERE order_id NOT IN (SELECT order_id FROM orders)\` pour supprimer toutes les lignes orphelines. Puis \`SELECT\` les articles restants pour confirmer le nettoyage.

### Colonnes attendues en sortie
\`item_id\`, \`order_id\`, \`product_name\`, \`quantity\`, \`unit_price\`

Triez par \`item_id\` ASC.`,
  hint: "Use DELETE FROM order_items WHERE order_id NOT IN (SELECT order_id FROM orders). The NOT IN subquery is the anti-join pattern for deletes. Then SELECT the remaining rows.",
  hintFr: "Utilisez DELETE FROM order_items WHERE order_id NOT IN (SELECT order_id FROM orders). La sous-requête NOT IN est le patron d'anti-jointure pour les suppressions. Puis SELECT les lignes restantes.",
  schema: `CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  order_date DATE,
  status VARCHAR
);

CREATE TABLE order_items (
  item_id INTEGER PRIMARY KEY,
  order_id INTEGER,
  product_name VARCHAR,
  quantity INTEGER,
  unit_price DECIMAL(10,2)
);

-- Orders 3, 6, 9 were hard-deleted (cancelled orders removed directly)
INSERT INTO orders VALUES
  (1,  101, '2024-01-10', 'completed'),
  (2,  102, '2024-01-15', 'completed'),
  (4,  103, '2024-01-22', 'completed'),
  (5,  104, '2024-02-01', 'shipped'),
  (7,  105, '2024-02-10', 'completed'),
  (8,  106, '2024-02-18', 'completed'),
  (10, 107, '2024-03-05', 'shipped'),
  (11, 101, '2024-03-12', 'completed');

INSERT INTO order_items VALUES
  (1,  1,  'Wireless Mouse',      1, 29.99),
  (2,  1,  'USB-C Hub',           2, 49.99),
  (3,  2,  'Mechanical Keyboard', 1, 89.99),
  (4,  3,  'Orphan Item A',       1, 15.00),   -- order 3 deleted
  (5,  3,  'Orphan Item B',       3,  5.00),   -- order 3 deleted
  (6,  4,  'Notebook A5',         5,  4.99),
  (7,  5,  'Standing Desk',       1, 349.00),
  (8,  6,  'Orphan Item C',       2, 22.50),   -- order 6 deleted
  (9,  7,  'Ergonomic Chair',     1, 229.00),
  (10, 7,  'Desk Lamp',           2,  19.99),
  (11, 8,  'Monitor 27"',         1, 299.99),
  (12, 9,  'Orphan Item D',       1, 99.00),   -- order 9 deleted
  (13, 10, 'Webcam HD',           1,  59.99),
  (14, 11, 'Sticky Notes 5pk',    3,   2.99),
  (15, 11, 'Cable Organizer',     1,   8.99);`,
  solutionQuery: `DELETE FROM order_items
WHERE order_id NOT IN (SELECT order_id FROM orders);

SELECT item_id, order_id, product_name, quantity, unit_price
FROM order_items
ORDER BY item_id;`,
  solutionExplanation: `## Explanation

### Pattern: DELETE with NOT IN subquery (Anti-join delete for orphan cleanup)

This is the **orphan record cleanup** pattern. When a parent row is deleted without cascading, child rows become orphans. The \`NOT IN (subquery)\` construct is the DELETE equivalent of a LEFT JOIN anti-join.

### Step-by-step
1. \`DELETE FROM order_items\` — targets the child table.
2. \`WHERE order_id NOT IN (SELECT order_id FROM orders)\` — the subquery collects all valid parent IDs; \`NOT IN\` matches only the orphan rows (those referencing deleted orders 3, 6, and 9).
3. 4 orphan items are deleted (item_ids 4, 5, 8, 12), leaving 11 valid rows.
4. The final SELECT confirms the clean state.

### Alternative approach
You can also use a LEFT JOIN anti-join:
\`\`\`sql
DELETE FROM order_items oi
WHERE NOT EXISTS (
  SELECT 1 FROM orders o WHERE o.order_id = oi.order_id
);
\`\`\`
Both produce the same result. \`NOT EXISTS\` handles NULLs more safely than \`NOT IN\` if the subquery could return NULL values.

### When to use
- Cleaning up child records after a parent hard-delete (missing FK constraints)
- Data quality remediation to remove referential integrity violations
- Deduplication cleanup pipelines in staging areas`,
  solutionExplanationFr: `## Explication

### Patron : DELETE avec sous-requête NOT IN (anti-jointure pour nettoyage des orphelins)

Il s'agit du patron de **nettoyage des enregistrements orphelins**. Quand une ligne parente est supprimée sans cascade, les lignes enfants deviennent orphelines. Le \`NOT IN (subquery)\` est l'équivalent DELETE d'un anti-join LEFT JOIN.

### Étape par étape
1. \`DELETE FROM order_items\` — cible la table enfant.
2. \`WHERE order_id NOT IN (SELECT order_id FROM orders)\` — la sous-requête collecte tous les IDs parents valides ; \`NOT IN\` ne correspond qu'aux lignes orphelines (référençant les commandes supprimées 3, 6 et 9).
3. 4 articles orphelins sont supprimés (item_ids 4, 5, 8, 12), laissant 11 lignes valides.
4. Le SELECT final confirme l'état nettoyé.

### Approche alternative
On peut aussi utiliser un anti-join LEFT JOIN :
\`\`\`sql
DELETE FROM order_items oi
WHERE NOT EXISTS (
  SELECT 1 FROM orders o WHERE o.order_id = oi.order_id
);
\`\`\`
Les deux produisent le même résultat. \`NOT EXISTS\` gère les NULLs plus sûrement que \`NOT IN\` si la sous-requête peut retourner des valeurs NULL.

### Quand l'utiliser
- Nettoyer des enregistrements enfants après une suppression directe du parent (contraintes FK manquantes)
- Remédiation qualité données pour supprimer les violations d'intégrité référentielle
- Pipelines de nettoyage de déduplication dans les zones de staging`,
  testCases: [
    {
      name: "default",
      description: "4 orphan items deleted; 11 valid items remain ordered by item_id",
      descriptionFr: "4 articles orphelins supprimés ; 11 articles valides restent triés par item_id",
      expectedColumns: ["item_id", "order_id", "product_name", "quantity", "unit_price"],
      expectedRows: [
        { item_id: 1,  order_id: 1,  product_name: "Wireless Mouse",      quantity: 1, unit_price: 29.99 },
        { item_id: 2,  order_id: 1,  product_name: "USB-C Hub",           quantity: 2, unit_price: 49.99 },
        { item_id: 3,  order_id: 2,  product_name: "Mechanical Keyboard", quantity: 1, unit_price: 89.99 },
        { item_id: 6,  order_id: 4,  product_name: "Notebook A5",         quantity: 5, unit_price: 4.99  },
        { item_id: 7,  order_id: 5,  product_name: "Standing Desk",       quantity: 1, unit_price: 349.00 },
        { item_id: 9,  order_id: 7,  product_name: "Ergonomic Chair",     quantity: 1, unit_price: 229.00 },
        { item_id: 10, order_id: 7,  product_name: "Desk Lamp",           quantity: 2, unit_price: 19.99 },
        { item_id: 11, order_id: 8,  product_name: "Monitor 27\"",        quantity: 1, unit_price: 299.99 },
        { item_id: 13, order_id: 10, product_name: "Webcam HD",           quantity: 1, unit_price: 59.99 },
        { item_id: 14, order_id: 11, product_name: "Sticky Notes 5pk",    quantity: 3, unit_price: 2.99  },
        { item_id: 15, order_id: 11, product_name: "Cable Organizer",     quantity: 1, unit_price: 8.99  },
      ],
      orderMatters: true,
    },
    {
      name: "no-orphans",
      description: "When all order_items reference valid orders, nothing is deleted",
      descriptionFr: "Quand tous les order_items référencent des commandes valides, rien n'est supprimé",
      setupSql: `DELETE FROM order_items WHERE order_id IN (3, 6, 9);`,
      expectedColumns: ["item_id", "order_id", "product_name", "quantity", "unit_price"],
      expectedRows: [
        { item_id: 1,  order_id: 1,  product_name: "Wireless Mouse",      quantity: 1, unit_price: 29.99 },
        { item_id: 2,  order_id: 1,  product_name: "USB-C Hub",           quantity: 2, unit_price: 49.99 },
        { item_id: 3,  order_id: 2,  product_name: "Mechanical Keyboard", quantity: 1, unit_price: 89.99 },
        { item_id: 6,  order_id: 4,  product_name: "Notebook A5",         quantity: 5, unit_price: 4.99  },
        { item_id: 7,  order_id: 5,  product_name: "Standing Desk",       quantity: 1, unit_price: 349.00 },
        { item_id: 9,  order_id: 7,  product_name: "Ergonomic Chair",     quantity: 1, unit_price: 229.00 },
        { item_id: 10, order_id: 7,  product_name: "Desk Lamp",           quantity: 2, unit_price: 19.99 },
        { item_id: 11, order_id: 8,  product_name: "Monitor 27\"",        quantity: 1, unit_price: 299.99 },
        { item_id: 13, order_id: 10, product_name: "Webcam HD",           quantity: 1, unit_price: 59.99 },
        { item_id: 14, order_id: 11, product_name: "Sticky Notes 5pk",    quantity: 3, unit_price: 2.99  },
        { item_id: 15, order_id: 11, product_name: "Cable Organizer",     quantity: 1, unit_price: 8.99  },
      ],
      orderMatters: true,
    },
  ],
};
