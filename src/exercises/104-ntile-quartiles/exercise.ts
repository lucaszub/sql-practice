import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "104-ntile-quartiles",
  title: "Customer Spending Quartiles",
  titleFr: "Quartiles de dépenses clients",
  difficulty: "medium",
  category: "window-functions",
  description: `## Customer Spending Quartiles

The marketing team wants to segment customers into **4 spending tiers** (quartiles) based on their total lifetime spending. Quartile 1 represents the highest spenders (top 25%), and quartile 4 the lowest.

### Schema

| Column | Type |
|--------|------|
| customer_id | INTEGER |
| customer_name | VARCHAR |
| total_spent | DECIMAL(10,2) |

### Expected output columns
\`customer_name\`, \`total_spent\`, \`spending_quartile\`

Order by spending_quartile ASC, total_spent DESC.`,
  descriptionFr: `## Quartiles de dépenses clients

L'équipe marketing souhaite segmenter les clients en **4 niveaux de dépenses** (quartiles) basés sur leurs dépenses totales. Le quartile 1 représente les plus gros dépensiers (top 25%), et le quartile 4 les plus faibles.

### Schema

| Column | Type |
|--------|------|
| customer_id | INTEGER |
| customer_name | VARCHAR |
| total_spent | DECIMAL(10,2) |

### Colonnes attendues en sortie
\`customer_name\`, \`total_spent\`, \`spending_quartile\`

Triez par spending_quartile ASC, total_spent DESC.`,
  hint: "Use NTILE(4) OVER (ORDER BY total_spent DESC) to divide customers into 4 equal-sized groups ordered by spending.",
  hintFr: "Utilisez NTILE(4) OVER (ORDER BY total_spent DESC) pour diviser les clients en 4 groupes de taille égale ordonnés par dépenses.",
  schema: `CREATE TABLE customers (
  customer_id INTEGER,
  customer_name VARCHAR,
  total_spent DECIMAL(10,2)
);

INSERT INTO customers VALUES
  (1, 'Emma Wilson', 12500.00),
  (2, 'James Brown', 8900.00),
  (3, 'Sophie Chen', 15200.00),
  (4, 'Lucas Garcia', 3200.00),
  (5, 'Olivia Kim', 6700.00),
  (6, 'Noah Patel', 22000.00),
  (7, 'Mia Anderson', 1800.00),
  (8, 'Ethan Lee', 9500.00),
  (9, 'Ava Martinez', 4100.00),
  (10, 'Liam Taylor', 7800.00),
  (11, 'Isabella Nguyen', 18500.00),
  (12, 'Mason Clark', 2500.00);`,
  solutionQuery: `SELECT
  customer_name,
  total_spent,
  NTILE(4) OVER (ORDER BY total_spent DESC) AS spending_quartile
FROM customers
ORDER BY spending_quartile, total_spent DESC;`,
  solutionExplanation: `## Explanation

### Pattern: NTILE() for bucket segmentation

This uses the **NTILE()** function to divide rows into a specified number of approximately equal-sized groups.

### Step-by-step
1. \`NTILE(4)\` — divides all customers into 4 groups
2. \`ORDER BY total_spent DESC\` — highest spenders are placed in group 1
3. With 12 customers and 4 buckets, each bucket gets exactly 3 customers

### How NTILE handles uneven divisions
- 12 rows / 4 tiles = 3 per tile (even split)
- 13 rows / 4 tiles = 4, 3, 3, 3 (extra row goes to first tile)
- 14 rows / 4 tiles = 4, 4, 3, 3 (extra rows fill from the first tile)

### When to use NTILE()
- Customer segmentation (VIP tiers, spending quartiles)
- Performance reviews (top/bottom quartile employees)
- A/B test bucketing (divide users into N groups)
- Percentile approximation (NTILE(100) ≈ percentile)

### Business context
Quartile 1 = potential VIP program candidates. Quartile 4 = targets for re-engagement campaigns.`,
  solutionExplanationFr: `## Explication

### Pattern : NTILE() pour la segmentation en groupes

Ce pattern utilise la fonction **NTILE()** pour diviser les lignes en un nombre spécifié de groupes de taille approximativement égale.

### Étape par étape
1. \`NTILE(4)\` — divise tous les clients en 4 groupes
2. \`ORDER BY total_spent DESC\` — les plus gros dépensiers sont dans le groupe 1
3. Avec 12 clients et 4 quartiles, chaque quartile contient exactement 3 clients

### Comment NTILE gère les divisions inégales
- 12 lignes / 4 tuiles = 3 par tuile (division égale)
- 13 lignes / 4 tuiles = 4, 3, 3, 3 (la ligne supplémentaire va dans la première tuile)
- 14 lignes / 4 tuiles = 4, 4, 3, 3 (les lignes supplémentaires remplissent depuis la première tuile)

### Quand utiliser NTILE()
- Segmentation client (niveaux VIP, quartiles de dépenses)
- Évaluations de performance (quartile supérieur/inférieur des employés)
- Répartition de tests A/B (diviser les utilisateurs en N groupes)`,
  testCases: [
    {
      name: "default",
      description: "Customers divided into 4 spending quartiles",
      descriptionFr: "Clients répartis en 4 quartiles de dépenses",
      expectedColumns: ["customer_name", "total_spent", "spending_quartile"],
      expectedRows: [
        { customer_name: "Noah Patel", total_spent: 22000.00, spending_quartile: 1 },
        { customer_name: "Isabella Nguyen", total_spent: 18500.00, spending_quartile: 1 },
        { customer_name: "Sophie Chen", total_spent: 15200.00, spending_quartile: 1 },
        { customer_name: "Emma Wilson", total_spent: 12500.00, spending_quartile: 2 },
        { customer_name: "Ethan Lee", total_spent: 9500.00, spending_quartile: 2 },
        { customer_name: "James Brown", total_spent: 8900.00, spending_quartile: 2 },
        { customer_name: "Liam Taylor", total_spent: 7800.00, spending_quartile: 3 },
        { customer_name: "Olivia Kim", total_spent: 6700.00, spending_quartile: 3 },
        { customer_name: "Ava Martinez", total_spent: 4100.00, spending_quartile: 3 },
        { customer_name: "Lucas Garcia", total_spent: 3200.00, spending_quartile: 4 },
        { customer_name: "Mason Clark", total_spent: 2500.00, spending_quartile: 4 },
        { customer_name: "Mia Anderson", total_spent: 1800.00, spending_quartile: 4 },
      ],
      orderMatters: true,
    },
    {
      name: "uneven-split",
      description: "NTILE handles uneven distribution (5 rows / 4 tiles)",
      descriptionFr: "NTILE gère la distribution inégale (5 lignes / 4 tuiles)",
      setupSql: `DELETE FROM customers WHERE customer_id > 5;`,
      expectedColumns: ["customer_name", "total_spent", "spending_quartile"],
      expectedRows: [
        { customer_name: "Sophie Chen", total_spent: 15200.00, spending_quartile: 1 },
        { customer_name: "Emma Wilson", total_spent: 12500.00, spending_quartile: 1 },
        { customer_name: "James Brown", total_spent: 8900.00, spending_quartile: 2 },
        { customer_name: "Olivia Kim", total_spent: 6700.00, spending_quartile: 3 },
        { customer_name: "Lucas Garcia", total_spent: 3200.00, spending_quartile: 4 },
      ],
      orderMatters: true,
    },
  ],
};
