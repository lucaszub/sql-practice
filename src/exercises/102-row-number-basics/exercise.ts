import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "102-row-number-basics",
  title: "Number Orders Chronologically",
  titleFr: "Numéroter les commandes chronologiquement",
  difficulty: "medium",
  category: "window-functions",
  description: `## Number Orders Chronologically

The customer success team wants to **number each customer's orders chronologically** to understand purchase cadence. For every customer, assign a sequential order number starting at 1 for their earliest order.

### Schema

| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| customer_name | VARCHAR |
| order_date | DATE |
| total_amount | DECIMAL(10,2) |

### Expected output columns
\`customer_name\`, \`order_date\`, \`total_amount\`, \`order_number\`

Order by customer_name ASC, order_number ASC.`,
  descriptionFr: `## Numéroter les commandes chronologiquement

L'équipe de succès client souhaite **numéroter chronologiquement les commandes de chaque client** pour comprendre la cadence d'achat. Pour chaque client, attribuez un numéro de commande séquentiel commençant à 1 pour sa commande la plus ancienne.

### Schema

| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| customer_name | VARCHAR |
| order_date | DATE |
| total_amount | DECIMAL(10,2) |

### Colonnes attendues en sortie
\`customer_name\`, \`order_date\`, \`total_amount\`, \`order_number\`

Triez par customer_name ASC, order_number ASC.`,
  hint: "Use ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date) to assign a sequential number to each customer's orders.",
  hintFr: "Utilisez ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date) pour attribuer un numéro séquentiel aux commandes de chaque client.",
  schema: `CREATE TABLE orders (
  order_id INTEGER,
  customer_id INTEGER,
  customer_name VARCHAR,
  order_date DATE,
  total_amount DECIMAL(10,2)
);

INSERT INTO orders VALUES
  (1, 101, 'Alice Martin', '2024-01-15', 250.00),
  (2, 102, 'Bob Johnson', '2024-01-10', 120.00),
  (3, 101, 'Alice Martin', '2024-02-20', 180.00),
  (4, 103, 'Clara Dubois', '2024-01-25', 340.00),
  (5, 102, 'Bob Johnson', '2024-02-05', 95.00),
  (6, 101, 'Alice Martin', '2024-03-12', 420.00),
  (7, 103, 'Clara Dubois', '2024-03-01', 210.00),
  (8, 102, 'Bob Johnson', '2024-03-18', 310.00),
  (9, 101, 'Alice Martin', '2024-04-02', 175.00),
  (10, 103, 'Clara Dubois', '2024-02-14', 560.00);`,
  solutionQuery: `SELECT
  customer_name,
  order_date,
  total_amount,
  ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date) AS order_number
FROM orders
ORDER BY customer_name, order_number;`,
  solutionExplanation: `## Explanation

### Pattern: ROW_NUMBER() with PARTITION BY

This uses the **row numbering** pattern to assign sequential numbers within groups.

### Step-by-step
1. \`PARTITION BY customer_id\` — divides the data into separate windows, one per customer
2. \`ORDER BY order_date\` — within each customer's window, rows are sorted by date
3. \`ROW_NUMBER()\` — assigns 1, 2, 3, ... to each row within the partition

### Why ROW_NUMBER()?
- Unlike RANK() or DENSE_RANK(), ROW_NUMBER() always produces unique sequential numbers
- Even if two orders share the same date, they get distinct numbers
- This makes it ideal for numbering, pagination, and "nth record" queries

### When to use
- Numbering records per entity (customer orders, employee tasks)
- Pagination within groups
- As a building block for Top-N per group (filter WHERE rn <= N)`,
  solutionExplanationFr: `## Explication

### Pattern : ROW_NUMBER() avec PARTITION BY

Ce pattern utilise la **numérotation de lignes** pour attribuer des numéros séquentiels au sein de groupes.

### Étape par étape
1. \`PARTITION BY customer_id\` — divise les données en fenêtres séparées, une par client
2. \`ORDER BY order_date\` — dans la fenêtre de chaque client, les lignes sont triées par date
3. \`ROW_NUMBER()\` — attribue 1, 2, 3, ... à chaque ligne dans la partition

### Pourquoi ROW_NUMBER() ?
- Contrairement à RANK() ou DENSE_RANK(), ROW_NUMBER() produit toujours des numéros séquentiels uniques
- Même si deux commandes partagent la même date, elles obtiennent des numéros distincts
- Idéal pour la numérotation, la pagination et les requêtes "nième enregistrement"

### Quand l'utiliser
- Numéroter des enregistrements par entité (commandes clients, tâches employés)
- Pagination au sein de groupes
- Comme brique de base pour le pattern Top-N par groupe (filtrer WHERE rn <= N)`,
  testCases: [
    {
      name: "default",
      description: "Number orders chronologically per customer",
      descriptionFr: "Numéroter les commandes chronologiquement par client",
      expectedColumns: ["customer_name", "order_date", "total_amount", "order_number"],
      expectedRows: [
        { customer_name: "Alice Martin", order_date: "2024-01-15", total_amount: 250.00, order_number: 1 },
        { customer_name: "Alice Martin", order_date: "2024-02-20", total_amount: 180.00, order_number: 2 },
        { customer_name: "Alice Martin", order_date: "2024-03-12", total_amount: 420.00, order_number: 3 },
        { customer_name: "Alice Martin", order_date: "2024-04-02", total_amount: 175.00, order_number: 4 },
        { customer_name: "Bob Johnson", order_date: "2024-01-10", total_amount: 120.00, order_number: 1 },
        { customer_name: "Bob Johnson", order_date: "2024-02-05", total_amount: 95.00, order_number: 2 },
        { customer_name: "Bob Johnson", order_date: "2024-03-18", total_amount: 310.00, order_number: 3 },
        { customer_name: "Clara Dubois", order_date: "2024-01-25", total_amount: 340.00, order_number: 1 },
        { customer_name: "Clara Dubois", order_date: "2024-02-14", total_amount: 560.00, order_number: 2 },
        { customer_name: "Clara Dubois", order_date: "2024-03-01", total_amount: 210.00, order_number: 3 },
      ],
      orderMatters: true,
    },
    {
      name: "single-order-customer",
      description: "Customer with a single order gets order_number = 1",
      descriptionFr: "Un client avec une seule commande obtient order_number = 1",
      setupSql: `DELETE FROM orders WHERE customer_id IN (101, 103);`,
      expectedColumns: ["customer_name", "order_date", "total_amount", "order_number"],
      expectedRows: [
        { customer_name: "Bob Johnson", order_date: "2024-01-10", total_amount: 120.00, order_number: 1 },
        { customer_name: "Bob Johnson", order_date: "2024-02-05", total_amount: 95.00, order_number: 2 },
        { customer_name: "Bob Johnson", order_date: "2024-03-18", total_amount: 310.00, order_number: 3 },
      ],
      orderMatters: true,
    },
  ],
};
