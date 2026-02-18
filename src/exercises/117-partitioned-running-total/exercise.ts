import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "117-partitioned-running-total",
  title: "Cumulative Spending Per Customer",
  titleFr: "Dépenses cumulées par client",
  difficulty: "hard",
  category: "running-totals",
  description: `## Cumulative Spending Per Customer

The loyalty program team needs to track each customer's **cumulative spending over time** to determine when they cross spending milestones (e.g., $500 for Silver, $1000 for Gold). For each order, show the customer's running total spending.

### Schema

| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_name | VARCHAR |
| order_date | DATE |
| amount | DECIMAL(10,2) |

### Expected output columns
\`customer_name\`, \`order_date\`, \`amount\`, \`cumulative_spent\`

- \`cumulative_spent\`: Running total of amount per customer, ordered by order_date
- Order by customer_name ASC, order_date ASC.`,
  descriptionFr: `## Dépenses cumulées par client

L'équipe du programme de fidélité doit suivre les **dépenses cumulées de chaque client au fil du temps** pour déterminer quand ils franchissent des paliers (ex. 500$ pour Silver, 1000$ pour Gold). Pour chaque commande, montrez le total cumulé des dépenses du client.

### Schema

| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_name | VARCHAR |
| order_date | DATE |
| amount | DECIMAL(10,2) |

### Colonnes attendues en sortie
\`customer_name\`, \`order_date\`, \`amount\`, \`cumulative_spent\`

- \`cumulative_spent\` : Total cumulé du montant par client, ordonné par date
- Triez par customer_name ASC, order_date ASC.`,
  hint: "Use SUM(amount) OVER (PARTITION BY customer_name ORDER BY order_date ROWS UNBOUNDED PRECEDING) to compute a per-customer running total.",
  hintFr: "Utilisez SUM(amount) OVER (PARTITION BY customer_name ORDER BY order_date ROWS UNBOUNDED PRECEDING) pour calculer un total cumulé par client.",
  schema: `CREATE TABLE orders (
  order_id INTEGER,
  customer_name VARCHAR,
  order_date DATE,
  amount DECIMAL(10,2)
);

INSERT INTO orders VALUES
  (1, 'Alice', '2024-01-05', 150.00),
  (2, 'Bob', '2024-01-10', 300.00),
  (3, 'Alice', '2024-01-20', 200.00),
  (4, 'Clara', '2024-01-15', 450.00),
  (5, 'Bob', '2024-02-01', 175.00),
  (6, 'Alice', '2024-02-15', 320.00),
  (7, 'Clara', '2024-02-20', 280.00),
  (8, 'Bob', '2024-03-05', 420.00),
  (9, 'Alice', '2024-03-10', 180.00),
  (10, 'Clara', '2024-03-15', 350.00),
  (11, 'Alice', '2024-04-01', 275.00),
  (12, 'Bob', '2024-04-10', 190.00);`,
  solutionQuery: `SELECT
  customer_name,
  order_date,
  amount,
  SUM(amount) OVER (PARTITION BY customer_name ORDER BY order_date ROWS UNBOUNDED PRECEDING) AS cumulative_spent
FROM orders
ORDER BY customer_name, order_date;`,
  solutionExplanation: `## Explanation

### Pattern: Partitioned running total

This extends the basic running total pattern by adding **PARTITION BY** to compute independent running totals per entity.

### Step-by-step
1. \`SUM(amount)\` — the aggregate to accumulate
2. \`PARTITION BY customer_name\` — restart the running total for each customer
3. \`ORDER BY order_date\` — accumulate in chronological order
4. \`ROWS UNBOUNDED PRECEDING\` — from the first row of the partition to the current row

### How partitioned running totals differ
Without PARTITION BY, SUM accumulates across all rows. With PARTITION BY:
- Alice's running total is independent of Bob's
- Each partition starts at 0 and accumulates separately
- The total resets at each partition boundary

### When to use
- Loyalty program milestone tracking
- Cumulative revenue per product, per region, per team
- Running balance per account in banking
- Cumulative metrics in any per-entity reporting`,
  solutionExplanationFr: `## Explication

### Pattern : Total cumulé partitionné

Ce pattern étend le total cumulé de base en ajoutant **PARTITION BY** pour calculer des totaux cumulés indépendants par entité.

### Étape par étape
1. \`SUM(amount)\` — l'agrégat à accumuler
2. \`PARTITION BY customer_name\` — redémarre le total cumulé pour chaque client
3. \`ORDER BY order_date\` — accumule dans l'ordre chronologique
4. \`ROWS UNBOUNDED PRECEDING\` — de la première ligne de la partition à la ligne courante

### Quand l'utiliser
- Suivi de paliers de programmes de fidélité
- Chiffre d'affaires cumulé par produit, région ou équipe
- Solde courant par compte bancaire`,
  testCases: [
    {
      name: "default",
      description: "Cumulative spending per customer over time",
      descriptionFr: "Dépenses cumulées par client au fil du temps",
      expectedColumns: ["customer_name", "order_date", "amount", "cumulative_spent"],
      expectedRows: [
        { customer_name: "Alice", order_date: "2024-01-05", amount: 150.00, cumulative_spent: 150.00 },
        { customer_name: "Alice", order_date: "2024-01-20", amount: 200.00, cumulative_spent: 350.00 },
        { customer_name: "Alice", order_date: "2024-02-15", amount: 320.00, cumulative_spent: 670.00 },
        { customer_name: "Alice", order_date: "2024-03-10", amount: 180.00, cumulative_spent: 850.00 },
        { customer_name: "Alice", order_date: "2024-04-01", amount: 275.00, cumulative_spent: 1125.00 },
        { customer_name: "Bob", order_date: "2024-01-10", amount: 300.00, cumulative_spent: 300.00 },
        { customer_name: "Bob", order_date: "2024-02-01", amount: 175.00, cumulative_spent: 475.00 },
        { customer_name: "Bob", order_date: "2024-03-05", amount: 420.00, cumulative_spent: 895.00 },
        { customer_name: "Bob", order_date: "2024-04-10", amount: 190.00, cumulative_spent: 1085.00 },
        { customer_name: "Clara", order_date: "2024-01-15", amount: 450.00, cumulative_spent: 450.00 },
        { customer_name: "Clara", order_date: "2024-02-20", amount: 280.00, cumulative_spent: 730.00 },
        { customer_name: "Clara", order_date: "2024-03-15", amount: 350.00, cumulative_spent: 1080.00 },
      ],
      orderMatters: true,
    },
    {
      name: "single-customer",
      description: "Works with a single customer's orders",
      descriptionFr: "Fonctionne avec les commandes d'un seul client",
      setupSql: `DELETE FROM orders WHERE customer_name != 'Clara';`,
      expectedColumns: ["customer_name", "order_date", "amount", "cumulative_spent"],
      expectedRows: [
        { customer_name: "Clara", order_date: "2024-01-15", amount: 450.00, cumulative_spent: 450.00 },
        { customer_name: "Clara", order_date: "2024-02-20", amount: 280.00, cumulative_spent: 730.00 },
        { customer_name: "Clara", order_date: "2024-03-15", amount: 350.00, cumulative_spent: 1080.00 },
      ],
      orderMatters: true,
    },
  ],
};
