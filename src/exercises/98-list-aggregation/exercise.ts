import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "98-list-aggregation",
  title: "Product List per Order",
  titleFr: "Liste de produits par commande",
  difficulty: "medium",
  category: "nested-data",
  description: `## Product List per Order

The operations team needs a summary view of every order showing all the products it contains in a single column — one row per order. This makes it easy to scan orders without joining multiple tables every time.

### Schema

**orders**

| Column | Type | Notes |
|--------|------|-------|
| order_id | INTEGER | Primary key |
| customer_name | VARCHAR | Name of the customer |
| order_date | DATE | Date of the order |

**order_items**

| Column | Type | Notes |
|--------|------|-------|
| item_id | INTEGER | Primary key |
| order_id | INTEGER | FK to orders |
| product_id | INTEGER | FK to products |
| quantity | INTEGER | Items ordered |

**products**

| Column | Type | Notes |
|--------|------|-------|
| product_id | INTEGER | Primary key |
| product_name | VARCHAR | Name of the product |
| category | VARCHAR | Product category |

### Task

For each order, collect all product names into a sorted list. Use DuckDB's \`list()\` function with \`GROUP BY\` to produce one row per order.

Return: \`order_id\`, \`customer_name\`, \`product_list\` (a \`VARCHAR[]\` column).

Order by \`order_id\` ASC.

### Expected output columns

\`order_id\`, \`customer_name\`, \`product_list\``,

  descriptionFr: `## Liste de produits par commande

L'équipe opérationnelle a besoin d'une vue récapitulative de chaque commande montrant tous les produits qu'elle contient dans une seule colonne — une ligne par commande. Cela permet de parcourir les commandes facilement sans jointures multiples à chaque fois.

### Schéma

**orders**

| Colonne | Type | Notes |
|---------|------|-------|
| order_id | INTEGER | Clé primaire |
| customer_name | VARCHAR | Nom du client |
| order_date | DATE | Date de la commande |

**order_items**

| Colonne | Type | Notes |
|---------|------|-------|
| item_id | INTEGER | Clé primaire |
| order_id | INTEGER | FK vers orders |
| product_id | INTEGER | FK vers products |
| quantity | INTEGER | Quantité commandée |

**products**

| Colonne | Type | Notes |
|---------|------|-------|
| product_id | INTEGER | Clé primaire |
| product_name | VARCHAR | Nom du produit |
| category | VARCHAR | Catégorie du produit |

### Tâche

Pour chaque commande, collecter tous les noms de produits dans une liste triée. Utiliser la fonction \`list()\` de DuckDB avec \`GROUP BY\` pour produire une ligne par commande.

Retourner : \`order_id\`, \`customer_name\`, \`product_list\` (colonne de type \`VARCHAR[]\`).

Trier par \`order_id\` ASC.

### Colonnes attendues

\`order_id\`, \`customer_name\`, \`product_list\``,

  hint: "JOIN the three tables, then GROUP BY order_id and customer_name. Use list_sort(list(product_name)) to collect product names into a sorted array.",
  hintFr: "Joignez les trois tables, puis faites un GROUP BY sur order_id et customer_name. Utilisez list_sort(list(product_name)) pour collecter les noms de produits dans un tableau trié.",

  schema: `CREATE TABLE orders (
  order_id INTEGER,
  customer_name VARCHAR,
  order_date DATE
);

CREATE TABLE order_items (
  item_id INTEGER,
  order_id INTEGER,
  product_id INTEGER,
  quantity INTEGER
);

CREATE TABLE products (
  product_id INTEGER,
  product_name VARCHAR,
  category VARCHAR
);

INSERT INTO orders VALUES
  (1, 'Alice Martin',   '2024-01-10'),
  (2, 'Bob Nguyen',     '2024-01-11'),
  (3, 'Carol Schmidt',  '2024-01-12'),
  (4, 'David Okafor',   '2024-01-13'),
  (5, 'Eva Rossi',      '2024-01-14');

INSERT INTO products VALUES
  (10, 'Laptop',       'Electronics'),
  (11, 'Mouse',        'Electronics'),
  (12, 'Keyboard',     'Electronics'),
  (13, 'Desk Lamp',    'Office'),
  (14, 'Notebook',     'Stationery'),
  (15, 'Pen Set',      'Stationery'),
  (16, 'Monitor',      'Electronics'),
  (17, 'USB Hub',      'Electronics');

INSERT INTO order_items VALUES
  (1,  1, 10, 1),
  (2,  1, 11, 2),
  (3,  1, 14, 3),
  (4,  2, 12, 1),
  (5,  2, 13, 1),
  (6,  3, 10, 1),
  (7,  3, 16, 1),
  (8,  3, 17, 2),
  (9,  4, 15, 5),
  (10, 4, 14, 2),
  (11, 5, 11, 1),
  (12, 5, 12, 1),
  (13, 5, 13, 1),
  (14, 5, 17, 1);`,

  solutionQuery: `SELECT
  o.order_id,
  o.customer_name,
  list_sort(list(p.product_name)) AS product_list
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
JOIN products p    ON p.product_id = oi.product_id
GROUP BY o.order_id, o.customer_name
ORDER BY o.order_id;`,

  solutionExplanation: `## Explanation

### Pattern: List aggregation with list()

This exercise uses DuckDB's **list aggregation** pattern to collect multiple rows into a single array value per group.

### Step-by-step

1. **Three-table join** — \`orders\` → \`order_items\` → \`products\` expands each order into one row per product.
2. **GROUP BY** — collapse back to one row per order using \`GROUP BY o.order_id, o.customer_name\`.
3. **list()** — the DuckDB aggregate function collects all \`product_name\` values into a \`VARCHAR[]\` array for each group.
4. **list_sort()** — wraps \`list()\` to return the array in alphabetical order, making the output deterministic.

### Why this approach

- \`list()\` is the DuckDB native equivalent of PostgreSQL's \`array_agg()\` or standard SQL's \`ARRAY_AGG()\`.
- \`list_sort()\` is cleaner than \`ORDER BY\` inside an aggregate (which DuckDB also supports: \`list(product_name ORDER BY product_name)\`).
- Produces a true array type (\`VARCHAR[]\`), not a string — useful for downstream unnesting or filtering.

### When to use

Any time you need to denormalize a one-to-many relationship into a single column: order → products, user → roles, article → tags. Common in reporting layers and analytical exports.

### DuckDB note

DuckDB supports both \`list()\` and \`array_agg()\` as aliases. Use \`list_sort()\`, \`list_contains()\`, \`len()\`, and other list functions to manipulate the result.`,

  solutionExplanationFr: `## Explication

### Patron : Agrégation en liste avec list()

Cet exercice utilise le patron d'**agrégation en liste** de DuckDB pour collecter plusieurs lignes dans une valeur tableau par groupe.

### Étape par étape

1. **Jointure trois tables** — \`orders\` → \`order_items\` → \`products\` produit une ligne par produit pour chaque commande.
2. **GROUP BY** — regroupe en une ligne par commande avec \`GROUP BY o.order_id, o.customer_name\`.
3. **list()** — fonction d'agrégat DuckDB qui collecte tous les \`product_name\` dans un tableau \`VARCHAR[]\` pour chaque groupe.
4. **list_sort()** — enveloppe \`list()\` pour retourner le tableau trié alphabétiquement, rendant le résultat déterministe.

### Pourquoi cette approche

- \`list()\` est l'équivalent DuckDB natif de \`array_agg()\` de PostgreSQL.
- \`list_sort()\` est plus lisible qu'un \`ORDER BY\` dans un agrégat.
- Produit un vrai type tableau (\`VARCHAR[]\`), utile pour un dénesting ou filtrage ultérieur.

### Quand l'utiliser

Dès que vous devez dénormaliser une relation un-à-plusieurs en une seule colonne : commande → produits, utilisateur → rôles, article → tags.`,

  testCases: [
    {
      name: "default",
      description: "5 orders each with their sorted product list",
      descriptionFr: "5 commandes avec leur liste de produits triée",
      expectedColumns: ["order_id", "customer_name", "product_list"],
      expectedRows: [
        { order_id: 1, customer_name: "Alice Martin",  product_list: ["Laptop", "Mouse", "Notebook"] },
        { order_id: 2, customer_name: "Bob Nguyen",    product_list: ["Desk Lamp", "Keyboard"] },
        { order_id: 3, customer_name: "Carol Schmidt", product_list: ["Laptop", "Monitor", "USB Hub"] },
        { order_id: 4, customer_name: "David Okafor",  product_list: ["Notebook", "Pen Set"] },
        { order_id: 5, customer_name: "Eva Rossi",     product_list: ["Desk Lamp", "Keyboard", "Mouse", "USB Hub"] },
      ],
      orderMatters: true,
    },
    {
      name: "single-item-order",
      description: "An order with a single product still produces a one-element list",
      descriptionFr: "Une commande avec un seul produit produit une liste à un élément",
      setupSql: `INSERT INTO orders VALUES (6, 'Frank Müller', '2024-01-15');
INSERT INTO order_items VALUES (15, 6, 10, 1);`,
      expectedColumns: ["order_id", "customer_name", "product_list"],
      expectedRows: [
        { order_id: 1, customer_name: "Alice Martin",  product_list: ["Laptop", "Mouse", "Notebook"] },
        { order_id: 2, customer_name: "Bob Nguyen",    product_list: ["Desk Lamp", "Keyboard"] },
        { order_id: 3, customer_name: "Carol Schmidt", product_list: ["Laptop", "Monitor", "USB Hub"] },
        { order_id: 4, customer_name: "David Okafor",  product_list: ["Notebook", "Pen Set"] },
        { order_id: 5, customer_name: "Eva Rossi",     product_list: ["Desk Lamp", "Keyboard", "Mouse", "USB Hub"] },
        { order_id: 6, customer_name: "Frank Müller",  product_list: ["Laptop"] },
      ],
      orderMatters: true,
    },
  ],
};
