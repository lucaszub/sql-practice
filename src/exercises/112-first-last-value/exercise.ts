import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "112-first-last-value",
  title: "First and Last Purchase Per Customer",
  titleFr: "Premier et dernier achat par client",
  difficulty: "medium",
  category: "analytics-patterns",
  description: `## First and Last Purchase Per Customer

The product analytics team wants to understand customer purchase patterns by comparing each order to the customer's **first and last purchase amounts**. For every order, show what the customer spent on their very first and very last order.

### Schema

| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| customer_name | VARCHAR |
| order_date | DATE |
| amount | DECIMAL(10,2) |

### Expected output columns
\`customer_name\`, \`order_date\`, \`amount\`, \`first_purchase_amount\`, \`last_purchase_amount\`

- \`first_purchase_amount\`: Amount of this customer's first-ever order
- \`last_purchase_amount\`: Amount of this customer's most recent order
- Order by customer_name ASC, order_date ASC.`,
  descriptionFr: `## Premier et dernier achat par client

L'équipe d'analytics produit souhaite comprendre les habitudes d'achat des clients en comparant chaque commande aux montants du **premier et du dernier achat** du client. Pour chaque commande, montrez ce que le client a dépensé lors de sa toute première et de sa toute dernière commande.

### Schema

| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| customer_name | VARCHAR |
| order_date | DATE |
| amount | DECIMAL(10,2) |

### Colonnes attendues en sortie
\`customer_name\`, \`order_date\`, \`amount\`, \`first_purchase_amount\`, \`last_purchase_amount\`

- \`first_purchase_amount\` : Montant de la toute première commande du client
- \`last_purchase_amount\` : Montant de la commande la plus récente du client
- Triez par customer_name ASC, order_date ASC.`,
  hint: "Use FIRST_VALUE(amount) OVER (PARTITION BY customer_id ORDER BY order_date) for the first purchase. For LAST_VALUE, you must specify the frame ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING to see the actual last value.",
  hintFr: "Utilisez FIRST_VALUE(amount) OVER (PARTITION BY customer_id ORDER BY order_date) pour le premier achat. Pour LAST_VALUE, vous devez spécifier le cadre ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING pour voir la vraie dernière valeur.",
  schema: `CREATE TABLE purchases (
  order_id INTEGER,
  customer_id INTEGER,
  customer_name VARCHAR,
  order_date DATE,
  amount DECIMAL(10,2)
);

INSERT INTO purchases VALUES
  (1, 501, 'Alice', '2024-01-10', 75.00),
  (2, 501, 'Alice', '2024-03-22', 120.00),
  (3, 501, 'Alice', '2024-06-15', 200.00),
  (4, 501, 'Alice', '2024-09-05', 95.00),
  (5, 502, 'Bob', '2024-02-14', 300.00),
  (6, 502, 'Bob', '2024-07-20', 150.00),
  (7, 503, 'Clara', '2024-04-01', 450.00),
  (8, 504, 'David', '2024-01-05', 60.00),
  (9, 504, 'David', '2024-05-18', 85.00),
  (10, 504, 'David', '2024-10-28', 110.00);`,
  solutionQuery: `SELECT
  customer_name,
  order_date,
  amount,
  FIRST_VALUE(amount) OVER (
    PARTITION BY customer_id ORDER BY order_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) AS first_purchase_amount,
  LAST_VALUE(amount) OVER (
    PARTITION BY customer_id ORDER BY order_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) AS last_purchase_amount
FROM purchases
ORDER BY customer_name, order_date;`,
  solutionExplanation: `## Explanation

### Pattern: FIRST_VALUE() and LAST_VALUE() for boundary access

This uses **FIRST_VALUE()** and **LAST_VALUE()** to access the first and last values within each partition.

### Step-by-step
1. \`PARTITION BY customer_id\` — each customer's orders form a separate window
2. \`ORDER BY order_date\` — orders are sorted chronologically
3. \`FIRST_VALUE(amount)\` — returns the amount of the first order in the partition
4. \`LAST_VALUE(amount)\` — returns the amount of the last order in the partition

### Critical: Frame specification for LAST_VALUE
The default frame is \`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\`. With this default:
- FIRST_VALUE works correctly (it always sees the first row)
- LAST_VALUE returns the **current row's value**, not the actual last value!

You **must** specify \`ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING\` to make LAST_VALUE see the entire partition.

### Alternative approaches
- MIN/MAX with window: \`MIN(amount) OVER (PARTITION BY customer_id)\` for first (if first=smallest)
- Subquery: Join to first/last record per customer
- But FIRST_VALUE/LAST_VALUE is most expressive when you want "first by date" or "last by date"

### When to use
- Comparing current values to initial/final states
- First-touch/last-touch attribution in marketing
- Calculating change from baseline (first value)`,
  solutionExplanationFr: `## Explication

### Pattern : FIRST_VALUE() et LAST_VALUE() pour accéder aux bornes

Ce pattern utilise **FIRST_VALUE()** et **LAST_VALUE()** pour accéder aux première et dernière valeurs au sein de chaque partition.

### Attention : Spécification du cadre pour LAST_VALUE
Le cadre par défaut est \`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\`. Avec ce défaut :
- FIRST_VALUE fonctionne correctement
- LAST_VALUE retourne la valeur de la **ligne courante**, pas la vraie dernière valeur !

Vous **devez** spécifier \`ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING\` pour que LAST_VALUE voie toute la partition.

### Quand l'utiliser
- Comparer les valeurs actuelles aux états initial/final
- Attribution premier contact/dernier contact en marketing
- Calcul de changement par rapport à la ligne de base`,
  testCases: [
    {
      name: "default",
      description: "First and last purchase amounts for each customer order",
      descriptionFr: "Montants du premier et dernier achat pour chaque commande client",
      expectedColumns: ["customer_name", "order_date", "amount", "first_purchase_amount", "last_purchase_amount"],
      expectedRows: [
        { customer_name: "Alice", order_date: "2024-01-10", amount: 75.00, first_purchase_amount: 75.00, last_purchase_amount: 95.00 },
        { customer_name: "Alice", order_date: "2024-03-22", amount: 120.00, first_purchase_amount: 75.00, last_purchase_amount: 95.00 },
        { customer_name: "Alice", order_date: "2024-06-15", amount: 200.00, first_purchase_amount: 75.00, last_purchase_amount: 95.00 },
        { customer_name: "Alice", order_date: "2024-09-05", amount: 95.00, first_purchase_amount: 75.00, last_purchase_amount: 95.00 },
        { customer_name: "Bob", order_date: "2024-02-14", amount: 300.00, first_purchase_amount: 300.00, last_purchase_amount: 150.00 },
        { customer_name: "Bob", order_date: "2024-07-20", amount: 150.00, first_purchase_amount: 300.00, last_purchase_amount: 150.00 },
        { customer_name: "Clara", order_date: "2024-04-01", amount: 450.00, first_purchase_amount: 450.00, last_purchase_amount: 450.00 },
        { customer_name: "David", order_date: "2024-01-05", amount: 60.00, first_purchase_amount: 60.00, last_purchase_amount: 110.00 },
        { customer_name: "David", order_date: "2024-05-18", amount: 85.00, first_purchase_amount: 60.00, last_purchase_amount: 110.00 },
        { customer_name: "David", order_date: "2024-10-28", amount: 110.00, first_purchase_amount: 60.00, last_purchase_amount: 110.00 },
      ],
      orderMatters: true,
    },
    {
      name: "single-order-customer",
      description: "Customer with one order: first = last = current",
      descriptionFr: "Client avec une seule commande : premier = dernier = actuel",
      setupSql: `DELETE FROM purchases WHERE customer_id != 503;`,
      expectedColumns: ["customer_name", "order_date", "amount", "first_purchase_amount", "last_purchase_amount"],
      expectedRows: [
        { customer_name: "Clara", order_date: "2024-04-01", amount: 450.00, first_purchase_amount: 450.00, last_purchase_amount: 450.00 },
      ],
      orderMatters: true,
    },
  ],
};
