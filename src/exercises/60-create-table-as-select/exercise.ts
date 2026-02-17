import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "60-create-table-as-select",
  title: "Create Reporting Table with CTAS",
  titleFr: "Créer une table de reporting avec CTAS",
  difficulty: "easy",
  category: "ddl-dml",
  description: `## Create Reporting Table with CTAS

The analytics team needs a denormalized table that combines customer information with their order history for fast dashboard queries. Instead of joining tables at query time on every dashboard refresh, they want to pre-build a \`customer_orders_summary\` table using **CREATE TABLE AS SELECT** (CTAS).

### Schema

**customers**
| Column | Type |
|--------|------|
| customer_id | INTEGER |
| customer_name | VARCHAR |
| email | VARCHAR |
| country | VARCHAR |
| registered_at | DATE |

**orders**
| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| order_date | DATE |
| amount | DECIMAL(10,2) |
| status | VARCHAR |

### Task

Write a \`CREATE TABLE customer_orders_summary AS SELECT ...\` that produces one row per customer with:
- \`customer_id\`, \`customer_name\`, \`country\`
- \`total_orders\`: total number of orders placed
- \`completed_orders\`: number of orders with \`status = 'completed'\`
- \`total_spent\`: sum of \`amount\` for completed orders (NULL if none)
- \`first_order_date\`: earliest \`order_date\`
- \`last_order_date\`: most recent \`order_date\`

Include customers who have never placed an order (they should appear with 0 counts and NULL dates).

Then \`SELECT\` from \`customer_orders_summary\` ordered by \`customer_id\`.

### Expected output columns
\`customer_id\`, \`customer_name\`, \`country\`, \`total_orders\`, \`completed_orders\`, \`total_spent\`, \`first_order_date\`, \`last_order_date\``,
  descriptionFr: `## Créer une table de reporting avec CTAS

L'équipe analytics a besoin d'une table dénormalisée combinant les informations clients avec leur historique de commandes pour des requêtes de tableau de bord rapides. Plutôt que de joindre les tables à chaque rafraîchissement, ils souhaitent pré-construire une table \`customer_orders_summary\` avec **CREATE TABLE AS SELECT** (CTAS).

### Schéma

**customers**
| Colonne | Type |
|---------|------|
| customer_id | INTEGER |
| customer_name | VARCHAR |
| email | VARCHAR |
| country | VARCHAR |
| registered_at | DATE |

**orders**
| Colonne | Type |
|---------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| order_date | DATE |
| amount | DECIMAL(10,2) |
| status | VARCHAR |

### Tâche

Écrivez un \`CREATE TABLE customer_orders_summary AS SELECT ...\` qui produit une ligne par client avec :
- \`customer_id\`, \`customer_name\`, \`country\`
- \`total_orders\` : nombre total de commandes passées
- \`completed_orders\` : nombre de commandes avec \`status = 'completed'\`
- \`total_spent\` : somme de \`amount\` pour les commandes complétées (NULL si aucune)
- \`first_order_date\` : date de la première commande
- \`last_order_date\` : date de la commande la plus récente

Incluez les clients n'ayant jamais passé de commande (ils doivent apparaître avec des compteurs à 0 et des dates NULL).

Puis \`SELECT\` depuis \`customer_orders_summary\` trié par \`customer_id\`.

### Colonnes attendues en sortie
\`customer_id\`, \`customer_name\`, \`country\`, \`total_orders\`, \`completed_orders\`, \`total_spent\`, \`first_order_date\`, \`last_order_date\``,
  hint: "Use CREATE TABLE customer_orders_summary AS SELECT c.customer_id, ... with a LEFT JOIN from customers to orders, GROUP BY customer columns. Use COUNT(o.order_id) (not COUNT(*)) so customers with no orders show 0. COALESCE or COUNT FILTER for completed_orders.",
  hintFr: "Utilisez CREATE TABLE customer_orders_summary AS SELECT c.customer_id, ... avec un LEFT JOIN de customers vers orders, GROUP BY les colonnes clients. Utilisez COUNT(o.order_id) (pas COUNT(*)) pour que les clients sans commande affichent 0. COALESCE ou COUNT FILTER pour completed_orders.",
  schema: `CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY,
  customer_name VARCHAR,
  email VARCHAR,
  country VARCHAR,
  registered_at DATE
);

CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  order_date DATE,
  amount DECIMAL(10,2),
  status VARCHAR
);

INSERT INTO customers VALUES
  (1,  'Alice Martin',   'alice@example.com',   'France',      '2023-01-15'),
  (2,  'Bob Zhang',      'bob@example.com',      'Canada',      '2023-02-20'),
  (3,  'Clara Müller',   'clara@example.com',    'Germany',     '2023-03-10'),
  (4,  'Diego Reyes',    'diego@example.com',    'Mexico',      '2023-04-05'),
  (5,  'Emma Nielsen',   'emma@example.com',     'Denmark',     '2023-05-01'),
  (6,  'Fatou Diallo',   'fatou@example.com',    'Senegal',     '2023-06-12'),
  (7,  'George Patel',   'george@example.com',   'UK',          '2023-07-22'),
  (8,  'Hannah Lee',     'hannah@example.com',   'South Korea', '2023-08-30');

INSERT INTO orders VALUES
  (1,  1, '2024-01-10', 120.00, 'completed'),
  (2,  1, '2024-02-15', 85.50,  'completed'),
  (3,  1, '2024-03-20', 200.00, 'cancelled'),
  (4,  2, '2024-01-25', 310.00, 'completed'),
  (5,  2, '2024-03-05', 90.00,  'refunded'),
  (6,  3, '2024-02-10', 450.00, 'completed'),
  (7,  3, '2024-04-01', 180.00, 'completed'),
  (8,  4, '2024-01-08', 55.00,  'completed'),
  (9,  4, '2024-02-28', 75.00,  'cancelled'),
  (10, 5, '2024-03-15', 620.00, 'completed'),
  (11, 6, '2024-01-30', 33.00,  'cancelled'),
  (12, 6, '2024-03-22', 44.00,  'refunded'),
  (13, 7, '2024-02-05', 260.00, 'completed');`,
  solutionQuery: `CREATE TABLE customer_orders_summary AS
SELECT
  c.customer_id,
  c.customer_name,
  c.country,
  COUNT(o.order_id)                                       AS total_orders,
  COUNT(o.order_id) FILTER (WHERE o.status = 'completed') AS completed_orders,
  SUM(o.amount) FILTER (WHERE o.status = 'completed')     AS total_spent,
  MIN(o.order_date)                                       AS first_order_date,
  MAX(o.order_date)                                       AS last_order_date
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name, c.country;

SELECT customer_id, customer_name, country, total_orders, completed_orders,
       total_spent, first_order_date, last_order_date
FROM customer_orders_summary
ORDER BY customer_id;`,
  solutionExplanation: `## Explanation

### Pattern: CREATE TABLE AS SELECT (CTAS — Denormalized Reporting Table)

CTAS is the fastest way to materialise a query result as a persistent table. It is the SQL equivalent of "save this query output as a table" and is foundational in data warehouse pipelines (gold layer in medallion architecture).

### Step-by-step
1. \`CREATE TABLE customer_orders_summary AS\` — DuckDB creates the table and infers column names and types from the SELECT.
2. \`LEFT JOIN orders\` — includes all customers, even those with no orders (Hannah Lee, customer 8).
3. \`COUNT(o.order_id)\` — counts non-NULL order_id values. Because of the LEFT JOIN, customers with no orders get 0 (not 1 from COUNT(*)).
4. \`COUNT(...) FILTER (WHERE o.status = 'completed')\` — counts only completed orders.
5. \`SUM(...) FILTER (WHERE o.status = 'completed')\` — sums amounts for completed orders; returns NULL when there are no completed orders (customers 6, 8).
6. \`MIN / MAX(o.order_date)\` — first and last order dates; NULL for customers with no orders.
7. \`GROUP BY c.customer_id, c.customer_name, c.country\` — one row per customer.

### DuckDB note
In DuckDB you can also write \`GROUP BY ALL\` instead of listing all non-aggregated columns — this shortcut is useful when many columns are in the GROUP BY.

### When to use
- Building a gold layer / reporting layer in a data lakehouse
- Pre-materialising dashboard queries for performance
- Creating denormalized snapshots for BI tools (Tableau, Looker, Metabase)`,
  solutionExplanationFr: `## Explication

### Patron : CREATE TABLE AS SELECT (CTAS — table de reporting dénormalisée)

CTAS est le moyen le plus rapide de matérialiser le résultat d'une requête comme table persistante. C'est l'équivalent SQL de "enregistrer cette requête comme table" et constitue la base des pipelines data warehouse (couche gold dans l'architecture medallion).

### Étape par étape
1. \`CREATE TABLE customer_orders_summary AS\` — DuckDB crée la table et infère les noms et types de colonnes depuis le SELECT.
2. \`LEFT JOIN orders\` — inclut tous les clients, même ceux sans commandes (Hannah Lee, client 8).
3. \`COUNT(o.order_id)\` — compte les valeurs non-NULL de order_id. Grâce au LEFT JOIN, les clients sans commandes ont 0 (pas 1 avec COUNT(*)).
4. \`COUNT(...) FILTER (WHERE o.status = 'completed')\` — compte uniquement les commandes complétées.
5. \`SUM(...) FILTER (WHERE o.status = 'completed')\` — somme les montants des commandes complétées ; retourne NULL quand il n'y en a pas (clients 6, 8).
6. \`MIN / MAX(o.order_date)\` — dates de première et dernière commande ; NULL pour les clients sans commandes.
7. \`GROUP BY c.customer_id, c.customer_name, c.country\` — une ligne par client.

### Note DuckDB
Dans DuckDB, on peut aussi écrire \`GROUP BY ALL\` au lieu de lister toutes les colonnes non agrégées — ce raccourci est utile quand le GROUP BY contient de nombreuses colonnes.

### Quand l'utiliser
- Construction d'une couche gold / reporting dans un data lakehouse
- Pré-matérialisation de requêtes de tableau de bord pour la performance
- Création de snapshots dénormalisés pour les outils BI (Tableau, Looker, Metabase)`,
  testCases: [
    {
      name: "default",
      description: "8 customers including one with no orders (NULLs for date and spent columns)",
      descriptionFr: "8 clients dont un sans commandes (NULL pour les colonnes dates et montant)",
      expectedColumns: ["customer_id", "customer_name", "country", "total_orders", "completed_orders", "total_spent", "first_order_date", "last_order_date"],
      expectedRows: [
        { customer_id: 1, customer_name: "Alice Martin", country: "France",      total_orders: 3, completed_orders: 2, total_spent: 205.50, first_order_date: "2024-01-10", last_order_date: "2024-03-20" },
        { customer_id: 2, customer_name: "Bob Zhang",    country: "Canada",      total_orders: 2, completed_orders: 1, total_spent: 310.00, first_order_date: "2024-01-25", last_order_date: "2024-03-05" },
        { customer_id: 3, customer_name: "Clara Müller", country: "Germany",     total_orders: 2, completed_orders: 2, total_spent: 630.00, first_order_date: "2024-02-10", last_order_date: "2024-04-01" },
        { customer_id: 4, customer_name: "Diego Reyes",  country: "Mexico",      total_orders: 2, completed_orders: 1, total_spent: 55.00,  first_order_date: "2024-01-08", last_order_date: "2024-02-28" },
        { customer_id: 5, customer_name: "Emma Nielsen", country: "Denmark",     total_orders: 1, completed_orders: 1, total_spent: 620.00, first_order_date: "2024-03-15", last_order_date: "2024-03-15" },
        { customer_id: 6, customer_name: "Fatou Diallo", country: "Senegal",     total_orders: 2, completed_orders: 0, total_spent: null,   first_order_date: "2024-01-30", last_order_date: "2024-03-22" },
        { customer_id: 7, customer_name: "George Patel", country: "UK",          total_orders: 1, completed_orders: 1, total_spent: 260.00, first_order_date: "2024-02-05", last_order_date: "2024-02-05" },
        { customer_id: 8, customer_name: "Hannah Lee",   country: "South Korea", total_orders: 0, completed_orders: 0, total_spent: null,   first_order_date: null,         last_order_date: null         },
      ],
      orderMatters: true,
    },
    {
      name: "no-orders",
      description: "With all orders deleted, every customer shows 0 orders and NULL amounts",
      descriptionFr: "Quand toutes les commandes sont supprimées, chaque client affiche 0 commandes et NULL montants",
      setupSql: `DELETE FROM orders;`,
      expectedColumns: ["customer_id", "customer_name", "country", "total_orders", "completed_orders", "total_spent", "first_order_date", "last_order_date"],
      expectedRows: [
        { customer_id: 1, customer_name: "Alice Martin", country: "France",      total_orders: 0, completed_orders: 0, total_spent: null, first_order_date: null, last_order_date: null },
        { customer_id: 2, customer_name: "Bob Zhang",    country: "Canada",      total_orders: 0, completed_orders: 0, total_spent: null, first_order_date: null, last_order_date: null },
        { customer_id: 3, customer_name: "Clara Müller", country: "Germany",     total_orders: 0, completed_orders: 0, total_spent: null, first_order_date: null, last_order_date: null },
        { customer_id: 4, customer_name: "Diego Reyes",  country: "Mexico",      total_orders: 0, completed_orders: 0, total_spent: null, first_order_date: null, last_order_date: null },
        { customer_id: 5, customer_name: "Emma Nielsen", country: "Denmark",     total_orders: 0, completed_orders: 0, total_spent: null, first_order_date: null, last_order_date: null },
        { customer_id: 6, customer_name: "Fatou Diallo", country: "Senegal",     total_orders: 0, completed_orders: 0, total_spent: null, first_order_date: null, last_order_date: null },
        { customer_id: 7, customer_name: "George Patel", country: "UK",          total_orders: 0, completed_orders: 0, total_spent: null, first_order_date: null, last_order_date: null },
        { customer_id: 8, customer_name: "Hannah Lee",   country: "South Korea", total_orders: 0, completed_orders: 0, total_spent: null, first_order_date: null, last_order_date: null },
      ],
      orderMatters: true,
    },
  ],
};
