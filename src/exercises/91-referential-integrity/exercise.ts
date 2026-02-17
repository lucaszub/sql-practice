import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "91-referential-integrity",
  title: "Orphaned Order Items Detection",
  titleFr: "Detection des articles de commande orphelins",
  difficulty: "medium",
  category: "data-quality",
  description: `## Orphaned Order Items Detection

The data platform team discovered that a batch deletion process removed some orders from the \`orders\` table without cascading to \`order_items\`. This left orphaned line items — records that reference order IDs that no longer exist. These ghost records corrupt revenue calculations and need to be identified before the next warehouse load.

### Schema

**orders**
| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| order_date | DATE |
| status | VARCHAR |

**order_items**
| Column | Type |
|--------|------|
| item_id | INTEGER |
| order_id | INTEGER |
| product_name | VARCHAR |
| quantity | INTEGER |
| unit_price | DECIMAL(10,2) |

### Task

Write a query that finds all orphaned order_items (those whose order_id does not exist in the \`orders\` table):
- \`item_id\`: the orphaned item identifier
- \`order_id\`: the missing parent order_id
- \`product_name\`: the product in this orphaned line item
- \`quantity\`: quantity ordered
- \`unit_price\`: unit price

Order by \`order_id\` ASC, then \`item_id\` ASC.

### Expected output columns
\`item_id\`, \`order_id\`, \`product_name\`, \`quantity\`, \`unit_price\``,
  descriptionFr: `## Detection des articles de commande orphelins

L'equipe de la plateforme de donnees a decouvert qu'un processus de suppression par lot a retire certaines commandes de la table \`orders\` sans cascade vers \`order_items\`. Cela a laisse des articles orphelins — des enregistrements qui referencent des order_id qui n'existent plus. Ces enregistrements fantomes corrompent les calculs de revenus et doivent etre identifies avant le prochain chargement en entrepot.

### Schema

**orders**
| Colonne | Type |
|---------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| order_date | DATE |
| status | VARCHAR |

**order_items**
| Colonne | Type |
|---------|------|
| item_id | INTEGER |
| order_id | INTEGER |
| product_name | VARCHAR |
| quantity | INTEGER |
| unit_price | DECIMAL(10,2) |

### Tache

Ecrivez une requete qui trouve tous les order_items orphelins (ceux dont l'order_id n'existe pas dans la table \`orders\`) :
- \`item_id\` : l'identifiant de l'article orphelin
- \`order_id\` : l'order_id parent manquant
- \`product_name\` : le produit dans cet article orphelin
- \`quantity\` : quantite commandee
- \`unit_price\` : prix unitaire

Triez par \`order_id\` ASC, puis \`item_id\` ASC.

### Colonnes attendues en sortie
\`item_id\`, \`order_id\`, \`product_name\`, \`quantity\`, \`unit_price\``,
  hint: "Use a LEFT JOIN from order_items to orders, then filter WHERE orders.order_id IS NULL — this is the anti-join pattern.",
  hintFr: "Utilisez un LEFT JOIN de order_items vers orders, puis filtrez WHERE orders.order_id IS NULL — c'est le patron anti-jointure.",
  schema: `CREATE TABLE orders (
  order_id    INTEGER,
  customer_id INTEGER,
  order_date  DATE,
  status      VARCHAR
);

CREATE TABLE order_items (
  item_id      INTEGER,
  order_id     INTEGER,
  product_name VARCHAR,
  quantity     INTEGER,
  unit_price   DECIMAL(10,2)
);

INSERT INTO orders VALUES
  (2001, 101, '2024-03-01', 'completed'),
  (2002, 102, '2024-03-02', 'completed'),
  (2003, 103, '2024-03-03', 'completed'),
  (2005, 105, '2024-03-05', 'completed'),
  (2006, 106, '2024-03-06', 'cancelled'),
  (2008, 108, '2024-03-08', 'completed'),
  (2009, 109, '2024-03-09', 'completed'),
  (2010, 110, '2024-03-10', 'completed');

INSERT INTO order_items VALUES
  (1,  2001, 'Laptop Pro',      1, 1199.99),
  (2,  2001, 'Laptop Sleeve',   1,   29.99),
  (3,  2002, 'Wireless Mouse',  2,   45.00),
  (4,  2003, 'Standing Desk',   1,  599.00),
  (5,  2004, 'USB Hub',         3,   22.50),
  (6,  2004, 'Cable Pack',      2,   15.00),
  (7,  2005, 'Monitor 27"',     1,  349.00),
  (8,  2006, 'Keyboard',        1,   89.99),
  (9,  2007, 'Webcam HD',       1,   79.00),
  (10, 2007, 'Ring Light',      1,   55.00),
  (11, 2008, 'Headphones',      1,  129.00),
  (12, 2009, 'Desk Lamp',       2,   34.99),
  (13, 2010, 'Chair Mat',       1,   49.99),
  (14, 2010, 'Monitor Arm',     1,  119.00),
  (15, 2004, 'Notebook Set',   10,    8.99);`,
  solutionQuery: `SELECT
  oi.item_id,
  oi.order_id,
  oi.product_name,
  oi.quantity,
  oi.unit_price
FROM order_items oi
LEFT JOIN orders o ON oi.order_id = o.order_id
WHERE o.order_id IS NULL
ORDER BY oi.order_id ASC, oi.item_id ASC;`,
  solutionExplanation: `## Explanation

### Pattern: Anti-Join for Referential Integrity Check

An anti-join finds rows in the left table that have no matching row in the right table — ideal for detecting broken foreign keys.

### Step-by-step
1. **\`LEFT JOIN orders ON order_id\`**: Attempts to match every order_item to its parent order. Non-matching items will have NULL for all orders columns.
2. **\`WHERE o.order_id IS NULL\`**: Keeps only the rows where no match was found — these are the orphans.
3. **\`ORDER BY oi.order_id, oi.item_id\`**: Groups orphans by their missing parent for readability.

### Why this approach
- The LEFT JOIN + IS NULL pattern is the most portable anti-join form.
- Alternative: \`WHERE oi.order_id NOT IN (SELECT order_id FROM orders)\` — but this fails if orders has any NULLs.
- Best alternative: \`WHERE NOT EXISTS (SELECT 1 FROM orders WHERE order_id = oi.order_id)\` — safest form.

### When to use
- Foreign key validation before warehouse loads
- Post-deletion integrity checks when CASCADE is not set
- CDC reconciliation: finding target records with no source counterpart`,
  solutionExplanationFr: `## Explication

### Patron : Anti-jointure pour la verification d'integrite referentielle

Une anti-jointure trouve les lignes dans la table gauche qui n'ont pas de correspondance dans la table droite — ideal pour detecter les cles etrangeres cassees.

### Etape par etape
1. **\`LEFT JOIN orders ON order_id\`** : Tente de faire correspondre chaque order_item a sa commande parente. Les articles sans correspondance auront NULL pour toutes les colonnes d'orders.
2. **\`WHERE o.order_id IS NULL\`** : Ne garde que les lignes pour lesquelles aucune correspondance n'a ete trouvee — ce sont les orphelins.
3. **\`ORDER BY oi.order_id, oi.item_id\`** : Regroupe les orphelins par parent manquant pour la lisibilite.

### Pourquoi cette approche
- Le patron LEFT JOIN + IS NULL est la forme d'anti-jointure la plus portable.
- Alternative : \`WHERE oi.order_id NOT IN (SELECT order_id FROM orders)\` — mais cela echoue si orders a des NULLs.
- Meilleure alternative : \`WHERE NOT EXISTS (SELECT 1 FROM orders WHERE order_id = oi.order_id)\` — forme la plus sure.

### Quand l'utiliser
- Validation des cles etrangeres avant les chargements en entrepot
- Verifications d'integrite post-suppression quand CASCADE n'est pas defini
- Reconciliation CDC : trouver les enregistrements cibles sans contrepartie source`,
  testCases: [
    {
      name: "default",
      description: "Finds 3 orphaned items referencing deleted orders 2004 and 2007",
      descriptionFr: "Trouve 3 articles orphelins referencant les commandes supprimees 2004 et 2007",
      expectedColumns: ["item_id", "order_id", "product_name", "quantity", "unit_price"],
      expectedRows: [
        { item_id: 5,  order_id: 2004, product_name: "USB Hub",      quantity: 3,  unit_price: 22.50 },
        { item_id: 6,  order_id: 2004, product_name: "Cable Pack",   quantity: 2,  unit_price: 15.00 },
        { item_id: 15, order_id: 2004, product_name: "Notebook Set", quantity: 10, unit_price: 8.99  },
        { item_id: 9,  order_id: 2007, product_name: "Webcam HD",    quantity: 1,  unit_price: 79.00 },
        { item_id: 10, order_id: 2007, product_name: "Ring Light",   quantity: 1,  unit_price: 55.00 },
      ],
      orderMatters: true,
    },
    {
      name: "no-orphans-after-restore",
      description: "After restoring the missing parent orders, no orphans remain",
      descriptionFr: "Apres restauration des commandes parentes manquantes, plus aucun orphelin",
      setupSql: `INSERT INTO orders VALUES
  (2004, 104, '2024-03-04', 'completed'),
  (2007, 107, '2024-03-07', 'completed');`,
      expectedColumns: ["item_id", "order_id", "product_name", "quantity", "unit_price"],
      expectedRows: [],
      orderMatters: false,
    },
  ],
};
