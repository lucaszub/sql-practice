import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "51-create-table-basics",
  title: "Orders Tracking Table Setup",
  titleFr: "Mise en place de la table de suivi des commandes",
  difficulty: "easy",
  category: "ddl-dml",
  description: `## Orders Tracking Table Setup

An e-commerce company is launching a new logistics module and needs a dedicated table to track all customer orders. The engineering team has asked you to define the initial schema, load the first batch of orders, and verify the result.

### Schema

No pre-existing tables. You start from scratch.

### Task

Write a single script that:
1. Creates the \`orders\` table with columns: \`order_id INTEGER\`, \`customer_name VARCHAR\`, \`order_total DECIMAL(10,2)\`, \`order_date DATE\`, \`status VARCHAR\`
2. Inserts at least 5 rows of sample data (include one NULL status to represent pending review)
3. Ends with \`SELECT * FROM orders ORDER BY order_id\` to return the full table

### Expected output columns
\`order_id\`, \`customer_name\`, \`order_total\`, \`order_date\`, \`status\``,
  descriptionFr: `## Mise en place de la table de suivi des commandes

Une entreprise e-commerce lance un nouveau module logistique et a besoin d'une table dediee pour suivre toutes les commandes clients. L'equipe technique vous demande de definir le schema initial, charger le premier lot de commandes, et verifier le resultat.

### Schema

Aucune table pre-existante. Vous partez de zero.

### Consigne

Ecrivez un script unique qui :
1. Cree la table \`orders\` avec les colonnes : \`order_id INTEGER\`, \`customer_name VARCHAR\`, \`order_total DECIMAL(10,2)\`, \`order_date DATE\`, \`status VARCHAR\`
2. Insere au moins 5 lignes de donnees (incluez un status NULL pour representer une commande en attente de traitement)
3. Termine par \`SELECT * FROM orders ORDER BY order_id\` pour retourner la table complete

### Colonnes attendues en sortie
\`order_id\`, \`customer_name\`, \`order_total\`, \`order_date\`, \`status\``,
  hint: "Use CREATE TABLE to define the schema, INSERT INTO ... VALUES (...) to load rows, then SELECT * FROM orders ORDER BY order_id. Run all three statements together.",
  hintFr: "Utilisez CREATE TABLE pour definir le schema, INSERT INTO ... VALUES (...) pour charger les lignes, puis SELECT * FROM orders ORDER BY order_id. Executez les trois instructions ensemble.",
  schema: `-- No pre-existing tables for this exercise.
-- Your solution must CREATE the table, INSERT data, and SELECT to verify.
SELECT 'Ready — write your DDL below' AS instructions;`,
  solutionQuery: `CREATE TABLE orders (
  order_id     INTEGER,
  customer_name VARCHAR,
  order_total   DECIMAL(10,2),
  order_date    DATE,
  status        VARCHAR
);

INSERT INTO orders VALUES
  (1,  'Alice Johnson',  250.00, '2024-01-15', 'completed'),
  (2,  'Bob Smith',       45.99, '2024-01-16', 'completed'),
  (3,  'Carol White',    189.50, '2024-01-17', 'shipped'),
  (4,  'David Brown',     99.99, '2024-01-18', 'cancelled'),
  (5,  'Eva Martinez',   320.00, '2024-01-19', 'shipped'),
  (6,  'Frank Lee',       15.00, '2024-01-20', 'completed'),
  (7,  'Grace Kim',      100.00, '2024-01-21', NULL),
  (8,  'Hank Davis',     550.75, '2024-01-22', 'shipped'),
  (9,  'Irene Clark',     72.30, '2024-01-23', 'cancelled'),
  (10, 'Jack Wilson',    101.01, '2024-01-24', 'completed');

SELECT * FROM orders ORDER BY order_id;`,
  solutionExplanation: `## Explanation

### DDL + DML Bootstrap Pattern
This exercise covers the fundamental workflow of creating a table, populating it, and verifying the result — the minimal cycle every data engineer runs when bootstrapping a new schema.

### Step-by-step
1. **CREATE TABLE**: Defines the column names and their types. \`DECIMAL(10,2)\` means up to 10 significant digits with 2 decimal places — suitable for monetary values. \`VARCHAR\` without a length is valid in DuckDB and stores variable-length text.
2. **INSERT INTO ... VALUES**: Inserts multiple rows in a single statement by comma-separating the value tuples. Using \`NULL\` for the status column simulates a real scenario where some records arrive without a status.
3. **SELECT * FROM orders ORDER BY order_id**: Retrieves all columns, ordered by primary key, to confirm the data was inserted correctly.

### Why this approach
Running CREATE + INSERT + SELECT as a single script is idiomatic for schema initialization. It is repeatable (you can wrap it in a transaction), readable, and easy to diff in version control.

### When to use
- Initializing a new table in a data pipeline
- Setting up a staging or scratch table for ETL processing
- Writing schema migration scripts`,
  solutionExplanationFr: `## Explication

### Pattern DDL + DML Bootstrap
Cet exercice couvre le workflow fondamental : creer une table, la peupler, et verifier le resultat. C'est le cycle minimal que tout data engineer execute lors de l'initialisation d'un nouveau schema.

### Etape par etape
1. **CREATE TABLE** : Definit les noms de colonnes et leurs types. \`DECIMAL(10,2)\` signifie jusqu'a 10 chiffres significatifs avec 2 decimales — adapte aux valeurs monetaires. \`VARCHAR\` sans longueur est valide dans DuckDB et stocke du texte de longueur variable.
2. **INSERT INTO ... VALUES** : Insere plusieurs lignes en une seule instruction en separant les tuples par des virgules. L'utilisation de \`NULL\` pour la colonne status simule un cas reel ou certains enregistrements arrivent sans statut.
3. **SELECT * FROM orders ORDER BY order_id** : Recupere toutes les colonnes, triees par cle primaire, pour confirmer que les donnees ont ete inserees correctement.

### Pourquoi cette approche
Executer CREATE + INSERT + SELECT en un seul script est idiomatique pour l'initialisation d'un schema. C'est repetable (on peut l'encapsuler dans une transaction), lisible et facile a versionner.

### Quand l'utiliser
- Initialisation d'une nouvelle table dans un pipeline de donnees
- Mise en place d'une table de staging ou de travail pour un processus ETL
- Ecriture de scripts de migration de schema`,
  testCases: [
    {
      name: "default",
      description: "Returns all 10 inserted orders sorted by order_id, including one NULL status",
      descriptionFr: "Renvoie les 10 commandes inserees triees par order_id, incluant un status NULL",
      expectedColumns: ["order_id", "customer_name", "order_total", "order_date", "status"],
      expectedRows: [
        { order_id: 1,  customer_name: "Alice Johnson", order_total: 250.00, order_date: "2024-01-15", status: "completed" },
        { order_id: 2,  customer_name: "Bob Smith",      order_total: 45.99,  order_date: "2024-01-16", status: "completed" },
        { order_id: 3,  customer_name: "Carol White",   order_total: 189.50, order_date: "2024-01-17", status: "shipped"   },
        { order_id: 4,  customer_name: "David Brown",   order_total: 99.99,  order_date: "2024-01-18", status: "cancelled" },
        { order_id: 5,  customer_name: "Eva Martinez",  order_total: 320.00, order_date: "2024-01-19", status: "shipped"   },
        { order_id: 6,  customer_name: "Frank Lee",     order_total: 15.00,  order_date: "2024-01-20", status: "completed" },
        { order_id: 7,  customer_name: "Grace Kim",     order_total: 100.00, order_date: "2024-01-21", status: null        },
        { order_id: 8,  customer_name: "Hank Davis",    order_total: 550.75, order_date: "2024-01-22", status: "shipped"   },
        { order_id: 9,  customer_name: "Irene Clark",   order_total: 72.30,  order_date: "2024-01-23", status: "cancelled" },
        { order_id: 10, customer_name: "Jack Wilson",   order_total: 101.01, order_date: "2024-01-24", status: "completed" },
      ],
      orderMatters: true,
    },
    {
      name: "null-status-present",
      description: "At least one row has a NULL status (pending review case)",
      descriptionFr: "Au moins une ligne a un status NULL (cas en attente de traitement)",
      expectedColumns: ["order_id", "customer_name", "order_total", "order_date", "status"],
      expectedRows: [
        { order_id: 7, customer_name: "Grace Kim", order_total: 100.00, order_date: "2024-01-21", status: null },
      ],
      orderMatters: false,
      setupSql: `-- Filter to only the NULL-status row to verify NULL was stored correctly`,
    },
  ],
};
