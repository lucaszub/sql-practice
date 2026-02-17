import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "62-foreign-key-relationships",
  title: "Foreign Key Relationships: Orders and Order Items",
  titleFr: "Relations par clé étrangère : commandes et lignes de commande",
  difficulty: "medium",
  category: "data-types-constraints",
  description: `## Foreign Key Relationships: Orders and Order Items

The e-commerce platform's data team is designing the transactional schema. They need an \`orders\` table and an \`order_items\` table linked by a **FOREIGN KEY** so that every line item is guaranteed to belong to a valid order — preventing orphan records that break financial reporting.

### Schema

**orders**
| Column | Type |
|--------|------|
| order_id | INTEGER (PRIMARY KEY) |
| customer_name | VARCHAR |
| order_date | DATE |
| status | VARCHAR |

**order_items**
| Column | Type |
|--------|------|
| item_id | INTEGER (PRIMARY KEY) |
| order_id | INTEGER (FOREIGN KEY → orders.order_id) |
| product_name | VARCHAR |
| quantity | INTEGER |
| unit_price | DECIMAL(10,2) |

### Task

Write a query that JOINs \`orders\` and \`order_items\` to return each order line with: the order date, customer name, product name, quantity, unit price, and the computed \`line_total\` (quantity × unit_price). Order by \`order_id\` ASC, then \`item_id\` ASC.

### Expected output columns
\`order_id\`, \`order_date\`, \`customer_name\`, \`product_name\`, \`quantity\`, \`unit_price\`, \`line_total\``,
  descriptionFr: `## Relations par clé étrangère : commandes et lignes de commande

L'équipe data de la plateforme e-commerce conçoit le schéma transactionnel. Elle a besoin d'une table \`orders\` et d'une table \`order_items\` liées par une **FOREIGN KEY** pour garantir que chaque ligne appartient à une commande valide — évitant les enregistrements orphelins qui cassent le reporting financier.

### Schéma

**orders**
| Colonne | Type |
|---------|------|
| order_id | INTEGER (PRIMARY KEY) |
| customer_name | VARCHAR |
| order_date | DATE |
| status | VARCHAR |

**order_items**
| Colonne | Type |
|---------|------|
| item_id | INTEGER (PRIMARY KEY) |
| order_id | INTEGER (FOREIGN KEY → orders.order_id) |
| product_name | VARCHAR |
| quantity | INTEGER |
| unit_price | DECIMAL(10,2) |

### Tâche

Écrire une requête qui joint \`orders\` et \`order_items\` pour retourner chaque ligne de commande avec : la date, le nom du client, le produit, la quantité, le prix unitaire et le \`line_total\` calculé (quantité × prix unitaire). Trier par \`order_id\` ASC, puis \`item_id\` ASC.

### Colonnes attendues en sortie
\`order_id\`, \`order_date\`, \`customer_name\`, \`product_name\`, \`quantity\`, \`unit_price\`, \`line_total\``,
  hint: "Use INNER JOIN on order_id to link the two tables. Compute line_total = quantity * unit_price directly in the SELECT. Order by order_id, then item_id.",
  hintFr: "Utilisez INNER JOIN sur order_id pour relier les deux tables. Calculez line_total = quantity * unit_price directement dans le SELECT. Triez par order_id puis item_id.",
  schema: `CREATE TABLE orders (
  order_id      INTEGER PRIMARY KEY,
  customer_name VARCHAR,
  order_date    DATE,
  status        VARCHAR
);

CREATE TABLE order_items (
  item_id      INTEGER PRIMARY KEY,
  order_id     INTEGER REFERENCES orders(order_id),
  product_name VARCHAR,
  quantity     INTEGER,
  unit_price   DECIMAL(10, 2)
);

INSERT INTO orders VALUES
  (1, 'Alice Martin',  '2024-01-10', 'completed'),
  (2, 'Bob Nguyen',    '2024-01-15', 'completed'),
  (3, 'Clara Schmidt', '2024-02-01', 'pending'),
  (4, 'David Osei',    '2024-02-14', 'completed'),
  (5, 'Eva Kowalski',  '2024-03-03', 'cancelled');

INSERT INTO order_items VALUES
  (1,  1, 'Laptop',        1,  999.99),
  (2,  1, 'Mouse',         2,   29.99),
  (3,  1, 'USB Hub',       1,   49.99),
  (4,  2, 'Keyboard',      1,   89.99),
  (5,  2, 'Monitor',       1,  349.99),
  (6,  3, 'Webcam',        1,   79.99),
  (7,  3, 'Headset',       1,  129.99),
  (8,  3, 'Desk Lamp',     2,   34.99),
  (9,  4, 'SSD 1TB',       2,  109.99),
  (10, 4, 'RAM 32GB',      1,   89.99),
  (11, 4, 'CPU Cooler',    1,   59.99),
  (12, 5, 'Chair Mat',     1,   44.99),
  (13, 5, 'Cable Tray',    2,   19.99);`,
  solutionQuery: `SELECT
  o.order_id,
  o.order_date,
  o.customer_name,
  oi.product_name,
  oi.quantity,
  oi.unit_price,
  oi.quantity * oi.unit_price AS line_total
FROM orders o
INNER JOIN order_items oi ON o.order_id = oi.order_id
ORDER BY o.order_id ASC, oi.item_id ASC;`,
  solutionExplanation: `## Explanation

### Pattern: FOREIGN KEY enforced parent-child join

A **FOREIGN KEY** constraint ensures referential integrity: every \`order_id\` in \`order_items\` must exist in \`orders\`. This prevents orphan records (line items with no parent order), which would silently skew revenue calculations.

### Step-by-step
1. **FOREIGN KEY declaration**: \`order_id INTEGER REFERENCES orders(order_id)\` tells the database to reject any INSERT into \`order_items\` whose \`order_id\` has no match in \`orders\`.
2. **INNER JOIN**: Retrieves only rows that have a matching record in both tables. Since the FK guarantees every \`order_items.order_id\` is valid, the JOIN will never silently drop rows.
3. **Computed column**: \`quantity * unit_price AS line_total\` is a derived expression — no subquery needed for simple arithmetic.
4. **Double ORDER BY**: Ensures deterministic output — first by order, then by item within that order.

### Why
Referential integrity at the schema level is the first line of defence against data quality issues. Application bugs, bulk loads, or manual imports can all create orphan records if the database doesn't enforce the constraint.

### When to use
- Any parent-child relationship: orders/items, invoices/lines, projects/tasks.
- Always define FKs in production schemas; they can be deferred for performance in bulk-load pipelines but re-enabled afterwards.`,
  solutionExplanationFr: `## Explication

### Modèle : JOIN parent-enfant avec FOREIGN KEY

Une contrainte **FOREIGN KEY** garantit l'intégrité référentielle : chaque \`order_id\` dans \`order_items\` doit exister dans \`orders\`. Cela prévient les enregistrements orphelins qui fausseraient les calculs de revenus.

### Étape par étape
1. **Déclaration FOREIGN KEY** : \`order_id INTEGER REFERENCES orders(order_id)\` empêche tout INSERT dont l'order_id n'existe pas dans \`orders\`.
2. **INNER JOIN** : Récupère uniquement les lignes ayant une correspondance dans les deux tables.
3. **Colonne calculée** : \`quantity * unit_price AS line_total\` est une expression dérivée directe.
4. **Double ORDER BY** : Assure un résultat déterministe — d'abord par commande, puis par ligne dans cette commande.

### Pourquoi
L'intégrité référentielle au niveau du schéma est la première ligne de défense contre les problèmes de qualité des données.

### Quand l'utiliser
- Toute relation parent-enfant : commandes/lignes, factures/lignes, projets/tâches.`,
  testCases: [
    {
      name: "default",
      description: "Returns all 13 order lines with computed line_total, ordered by order_id then item_id",
      descriptionFr: "Retourne les 13 lignes de commande avec line_total calculé, triées par order_id puis item_id",
      expectedColumns: ["order_id", "order_date", "customer_name", "product_name", "quantity", "unit_price", "line_total"],
      expectedRows: [
        { order_id: 1, order_date: "2024-01-10", customer_name: "Alice Martin",  product_name: "Laptop",     quantity: 1, unit_price: 999.99, line_total: 999.99 },
        { order_id: 1, order_date: "2024-01-10", customer_name: "Alice Martin",  product_name: "Mouse",      quantity: 2, unit_price: 29.99,  line_total: 59.98 },
        { order_id: 1, order_date: "2024-01-10", customer_name: "Alice Martin",  product_name: "USB Hub",    quantity: 1, unit_price: 49.99,  line_total: 49.99 },
        { order_id: 2, order_date: "2024-01-15", customer_name: "Bob Nguyen",    product_name: "Keyboard",   quantity: 1, unit_price: 89.99,  line_total: 89.99 },
        { order_id: 2, order_date: "2024-01-15", customer_name: "Bob Nguyen",    product_name: "Monitor",    quantity: 1, unit_price: 349.99, line_total: 349.99 },
        { order_id: 3, order_date: "2024-02-01", customer_name: "Clara Schmidt", product_name: "Webcam",     quantity: 1, unit_price: 79.99,  line_total: 79.99 },
        { order_id: 3, order_date: "2024-02-01", customer_name: "Clara Schmidt", product_name: "Headset",    quantity: 1, unit_price: 129.99, line_total: 129.99 },
        { order_id: 3, order_date: "2024-02-01", customer_name: "Clara Schmidt", product_name: "Desk Lamp",  quantity: 2, unit_price: 34.99,  line_total: 69.98 },
        { order_id: 4, order_date: "2024-02-14", customer_name: "David Osei",    product_name: "SSD 1TB",    quantity: 2, unit_price: 109.99, line_total: 219.98 },
        { order_id: 4, order_date: "2024-02-14", customer_name: "David Osei",    product_name: "RAM 32GB",   quantity: 1, unit_price: 89.99,  line_total: 89.99 },
        { order_id: 4, order_date: "2024-02-14", customer_name: "David Osei",    product_name: "CPU Cooler", quantity: 1, unit_price: 59.99,  line_total: 59.99 },
        { order_id: 5, order_date: "2024-03-03", customer_name: "Eva Kowalski",  product_name: "Chair Mat",  quantity: 1, unit_price: 44.99,  line_total: 44.99 },
        { order_id: 5, order_date: "2024-03-03", customer_name: "Eva Kowalski",  product_name: "Cable Tray", quantity: 2, unit_price: 19.99,  line_total: 39.98 },
      ],
      orderMatters: true,
    },
    {
      name: "single-order",
      description: "With only order 1 remaining, returns its 3 items with correct line totals",
      descriptionFr: "Avec uniquement la commande 1, retourne ses 3 lignes avec les totaux corrects",
      setupSql: `DELETE FROM order_items WHERE order_id != 1; DELETE FROM orders WHERE order_id != 1;`,
      expectedColumns: ["order_id", "order_date", "customer_name", "product_name", "quantity", "unit_price", "line_total"],
      expectedRows: [
        { order_id: 1, order_date: "2024-01-10", customer_name: "Alice Martin", product_name: "Laptop",  quantity: 1, unit_price: 999.99, line_total: 999.99 },
        { order_id: 1, order_date: "2024-01-10", customer_name: "Alice Martin", product_name: "Mouse",   quantity: 2, unit_price: 29.99,  line_total: 59.98 },
        { order_id: 1, order_date: "2024-01-10", customer_name: "Alice Martin", product_name: "USB Hub", quantity: 1, unit_price: 49.99,  line_total: 49.99 },
      ],
      orderMatters: true,
    },
  ],
};
