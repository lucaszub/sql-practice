import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "66-fact-table-design",
  title: "Fact Table Population",
  titleFr: "Alimentation d'une table de faits",
  difficulty: "medium",
  category: "star-schema",
  description: `## Fact Table Population

The analytics engineering team needs to populate a \`fact_orders\` table from raw transactional data. The raw tables contain orders, line items, and products. Your job is to write a SELECT query that produces the fact table structure with the correct measures and foreign keys.

### Schema

**raw_orders**
| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| order_date | DATE |
| status | VARCHAR |

**raw_order_items**
| Column | Type |
|--------|------|
| item_id | INTEGER |
| order_id | INTEGER |
| product_id | INTEGER |
| quantity | INTEGER |
| unit_price | DECIMAL(10,2) |
| discount_amount | DECIMAL(10,2) |

**raw_products**
| Column | Type |
|--------|------|
| product_id | INTEGER |
| product_name | VARCHAR |
| category | VARCHAR |

### Task

Write a SELECT that produces one row per order line item with:
- Foreign keys: \`order_id\`, \`customer_id\`, \`product_id\`
- Date key: \`order_date\` (will later map to \`date_id\`)
- Measures: \`quantity\`, \`unit_price\`, \`discount_amount\`, \`total_amount\` (quantity * unit_price - discount_amount)

Only include orders with status \`'completed'\`.

### Expected output columns
\`order_id\`, \`customer_id\`, \`product_id\`, \`order_date\`, \`quantity\`, \`unit_price\`, \`discount_amount\`, \`total_amount\`

Order by \`order_id\` ASC, \`item_id\` ASC.`,
  descriptionFr: `## Alimentation d'une table de faits

L'equipe d'ingenierie analytique doit alimenter une table \`fact_orders\` a partir de donnees transactionnelles brutes. Les tables brutes contiennent des commandes, des lignes de commande et des produits. Votre mission est d'ecrire une requete SELECT qui produit la structure de la table de faits avec les bonnes mesures et cles etrangeres.

### Schema

**raw_orders**
| Colonne | Type |
|---------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| order_date | DATE |
| status | VARCHAR |

**raw_order_items**
| Colonne | Type |
|---------|------|
| item_id | INTEGER |
| order_id | INTEGER |
| product_id | INTEGER |
| quantity | INTEGER |
| unit_price | DECIMAL(10,2) |
| discount_amount | DECIMAL(10,2) |

**raw_products**
| Colonne | Type |
|---------|------|
| product_id | INTEGER |
| product_name | VARCHAR |
| category | VARCHAR |

### Tache

Ecrivez un SELECT qui produit une ligne par article de commande avec :
- Cles etrangeres : \`order_id\`, \`customer_id\`, \`product_id\`
- Cle de date : \`order_date\` (sera ensuite mappee vers \`date_id\`)
- Mesures : \`quantity\`, \`unit_price\`, \`discount_amount\`, \`total_amount\` (quantity * unit_price - discount_amount)

Incluez uniquement les commandes avec le statut \`'completed'\`.

### Colonnes attendues en sortie
\`order_id\`, \`customer_id\`, \`product_id\`, \`order_date\`, \`quantity\`, \`unit_price\`, \`discount_amount\`, \`total_amount\`

Triez par \`order_id\` ASC, \`item_id\` ASC.`,
  hint: "JOIN raw_orders with raw_order_items on order_id, then filter WHERE status = 'completed'. Calculate total_amount as quantity * unit_price - discount_amount. You need raw_products joined too for the product_id foreign key (it's already in raw_order_items).",
  hintFr: "Joignez raw_orders avec raw_order_items sur order_id, puis filtrez avec WHERE status = 'completed'. Calculez total_amount comme quantity * unit_price - discount_amount. Le product_id se trouve deja dans raw_order_items.",
  schema: `CREATE TABLE raw_orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  order_date DATE,
  status VARCHAR
);

CREATE TABLE raw_order_items (
  item_id INTEGER PRIMARY KEY,
  order_id INTEGER,
  product_id INTEGER,
  quantity INTEGER,
  unit_price DECIMAL(10,2),
  discount_amount DECIMAL(10,2)
);

CREATE TABLE raw_products (
  product_id INTEGER PRIMARY KEY,
  product_name VARCHAR,
  category VARCHAR
);

INSERT INTO raw_orders VALUES
  (1001, 1, '2024-01-05', 'completed'),
  (1002, 2, '2024-01-08', 'completed'),
  (1003, 3, '2024-01-10', 'cancelled'),
  (1004, 1, '2024-01-15', 'completed'),
  (1005, 4, '2024-01-18', 'pending'),
  (1006, 2, '2024-01-20', 'completed'),
  (1007, 5, '2024-01-22', 'completed'),
  (1008, 3, '2024-02-01', 'completed');

INSERT INTO raw_order_items VALUES
  (1, 1001, 10, 2, 29.99, 0.00),
  (2, 1001, 20, 1, 149.99, 15.00),
  (3, 1002, 10, 3, 29.99, 5.00),
  (4, 1002, 30, 1, 89.99, 0.00),
  (5, 1003, 20, 1, 149.99, 10.00),
  (6, 1004, 40, 2, 49.99, 0.00),
  (7, 1004, 10, 1, 29.99, 3.00),
  (8, 1005, 30, 2, 89.99, 0.00),
  (9, 1006, 50, 1, 199.99, 20.00),
  (10, 1006, 40, 3, 49.99, 5.00),
  (11, 1007, 10, 4, 29.99, 0.00),
  (12, 1007, 20, 1, 149.99, 0.00),
  (13, 1008, 50, 2, 199.99, 30.00),
  (14, 1008, 30, 1, 89.99, 9.00);

INSERT INTO raw_products VALUES
  (10, 'Wireless Mouse', 'Electronics'),
  (20, 'Mechanical Keyboard', 'Electronics'),
  (30, 'USB Hub', 'Accessories'),
  (40, 'Laptop Stand', 'Accessories'),
  (50, 'Monitor Arm', 'Furniture');`,
  solutionQuery: `SELECT
  o.order_id,
  o.customer_id,
  i.product_id,
  o.order_date,
  i.quantity,
  i.unit_price,
  i.discount_amount,
  ROUND(i.quantity * i.unit_price - i.discount_amount, 2) AS total_amount
FROM raw_orders o
INNER JOIN raw_order_items i ON o.order_id = i.order_id
WHERE o.status = 'completed'
ORDER BY o.order_id ASC, i.item_id ASC;`,
  solutionExplanation: `## Explanation

### Pattern: Fact Table Population from Raw Sources

This is the **ETL extraction step** for a star schema. The fact table captures grain-level events (one row per order line item) with measures and foreign keys to dimensions.

### Step-by-step
1. **FROM raw_orders o INNER JOIN raw_order_items i**: The grain of a fact_orders table is one row per order line item. INNER JOIN gives us only orders that have items (no orphan order headers).
2. **WHERE o.status = 'completed'**: Filter out cancelled and pending orders — the fact table should only reflect finalized business events.
3. **Select foreign keys**: \`order_id\`, \`customer_id\`, \`product_id\` are the dimension foreign keys. \`order_date\` maps to the date dimension.
4. **Measures**: \`quantity\`, \`unit_price\`, \`discount_amount\` are additive measures. \`total_amount\` is a derived measure: quantity * unit_price - discount_amount.
5. **ROUND(..., 2)**: Always round monetary measures in fact tables to avoid floating-point drift.

### Why INNER JOIN and not LEFT JOIN?
Line items without a parent order (or orphan orders) are data quality issues, not valid facts. INNER JOIN naturally enforces referential integrity.

### When to use
- Loading nightly batches into a data warehouse fact table
- Building a SELECT INTO or CREATE TABLE AS SELECT (CTAS) for the analytical layer
- Any ETL step that denormalizes raw OLTP data into a fact structure`,
  solutionExplanationFr: `## Explication

### Patron : Alimentation d'une table de faits depuis les sources brutes

C'est l'**etape d'extraction ETL** pour un schema en etoile. La table de faits capture des evenements au niveau grain (une ligne par article de commande) avec des mesures et des cles etrangeres vers les dimensions.

### Etape par etape
1. **FROM raw_orders o INNER JOIN raw_order_items i** : Le grain de fact_orders est une ligne par article de commande. INNER JOIN ne retient que les commandes qui ont des articles (pas d'en-tetes de commande orphelins).
2. **WHERE o.status = 'completed'** : Filtre les commandes annulees et en attente — la table de faits ne doit refleter que les evenements metier finalises.
3. **Cles etrangeres** : \`order_id\`, \`customer_id\`, \`product_id\` sont les cles etrangeres vers les dimensions. \`order_date\` est mappee vers la dimension date.
4. **Mesures** : \`quantity\`, \`unit_price\`, \`discount_amount\` sont des mesures additives. \`total_amount\` est une mesure derivee : quantity * unit_price - discount_amount.
5. **ROUND(..., 2)** : Arrondissez toujours les mesures monetaires dans les tables de faits pour eviter la derive en virgule flottante.

### Pourquoi INNER JOIN et non LEFT JOIN ?
Les articles sans commande parente (ou les commandes orphelines) sont des problemes de qualite des donnees, pas des faits valides. INNER JOIN applique naturellement l'integrite referentielle.

### Quand l'utiliser
- Chargement de lots nocturnes dans une table de faits de l'entrepot de donnees
- Construction d'un SELECT INTO ou CREATE TABLE AS SELECT (CTAS) pour la couche analytique
- Toute etape ETL qui denormalise des donnees OLTP brutes en structure de faits`,
  testCases: [
    {
      name: "default",
      description: "Returns completed order line items with correct measures, excluding cancelled and pending orders",
      descriptionFr: "Retourne les articles de commandes completees avec les bonnes mesures, en excluant les commandes annulees et en attente",
      expectedColumns: ["order_id", "customer_id", "product_id", "order_date", "quantity", "unit_price", "discount_amount", "total_amount"],
      expectedRows: [
        { order_id: 1001, customer_id: 1, product_id: 10, order_date: "2024-01-05", quantity: 2, unit_price: 29.99, discount_amount: 0.00, total_amount: 59.98 },
        { order_id: 1001, customer_id: 1, product_id: 20, order_date: "2024-01-05", quantity: 1, unit_price: 149.99, discount_amount: 15.00, total_amount: 134.99 },
        { order_id: 1002, customer_id: 2, product_id: 10, order_date: "2024-01-08", quantity: 3, unit_price: 29.99, discount_amount: 5.00, total_amount: 84.97 },
        { order_id: 1002, customer_id: 2, product_id: 30, order_date: "2024-01-08", quantity: 1, unit_price: 89.99, discount_amount: 0.00, total_amount: 89.99 },
        { order_id: 1004, customer_id: 1, product_id: 40, order_date: "2024-01-15", quantity: 2, unit_price: 49.99, discount_amount: 0.00, total_amount: 99.98 },
        { order_id: 1004, customer_id: 1, product_id: 10, order_date: "2024-01-15", quantity: 1, unit_price: 29.99, discount_amount: 3.00, total_amount: 26.99 },
        { order_id: 1006, customer_id: 2, product_id: 50, order_date: "2024-01-20", quantity: 1, unit_price: 199.99, discount_amount: 20.00, total_amount: 179.99 },
        { order_id: 1006, customer_id: 2, product_id: 40, order_date: "2024-01-20", quantity: 3, unit_price: 49.99, discount_amount: 5.00, total_amount: 144.97 },
        { order_id: 1007, customer_id: 5, product_id: 10, order_date: "2024-01-22", quantity: 4, unit_price: 29.99, discount_amount: 0.00, total_amount: 119.96 },
        { order_id: 1007, customer_id: 5, product_id: 20, order_date: "2024-01-22", quantity: 1, unit_price: 149.99, discount_amount: 0.00, total_amount: 149.99 },
        { order_id: 1008, customer_id: 3, product_id: 50, order_date: "2024-02-01", quantity: 2, unit_price: 199.99, discount_amount: 30.00, total_amount: 369.98 },
        { order_id: 1008, customer_id: 3, product_id: 30, order_date: "2024-02-01", quantity: 1, unit_price: 89.99, discount_amount: 9.00, total_amount: 80.99 },
      ],
      orderMatters: true,
    },
    {
      name: "no-completed-orders",
      description: "When all orders are cancelled or pending, the fact table is empty",
      descriptionFr: "Quand toutes les commandes sont annulees ou en attente, la table de faits est vide",
      setupSql: `UPDATE raw_orders SET status = 'cancelled' WHERE status = 'completed';`,
      expectedColumns: ["order_id", "customer_id", "product_id", "order_date", "quantity", "unit_price", "discount_amount", "total_amount"],
      expectedRows: [],
      orderMatters: false,
    },
  ],
};
