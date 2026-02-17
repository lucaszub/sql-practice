import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "57-insert-select-transform",
  title: "Insert Monthly Summary from Orders",
  titleFr: "Insérer un résumé mensuel depuis les commandes",
  difficulty: "medium",
  category: "ddl-dml",
  description: `## Insert Monthly Summary from Orders

The finance team needs a pre-aggregated \`monthly_summary\` table for fast reporting. The raw \`orders\` table is already populated, but the summary table is empty. Your job is to populate it using \`INSERT INTO ... SELECT\` with \`GROUP BY\` to aggregate orders by month.

### Schema

**orders** (raw transactional data)
| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| order_date | DATE |
| amount | DECIMAL(10,2) |
| status | VARCHAR ('completed', 'cancelled', 'refunded') |

**monthly_summary** (pre-aggregated — starts empty)
| Column | Type |
|--------|------|
| month | DATE |
| total_orders | INTEGER |
| completed_orders | INTEGER |
| total_revenue | DECIMAL(10,2) |
| avg_order_value | DECIMAL(10,2) |

### Task

Write an \`INSERT INTO monthly_summary SELECT ...\` that aggregates \`orders\` by month:
- \`month\`: first day of the month (use \`DATE_TRUNC('month', order_date)\`)
- \`total_orders\`: count of all orders that month
- \`completed_orders\`: count of orders with \`status = 'completed'\`
- \`total_revenue\`: sum of \`amount\` for completed orders only
- \`avg_order_value\`: average \`amount\` across all orders (rounded to 2 decimals)

Then \`SELECT\` from \`monthly_summary\` ordered by \`month\` ASC.

### Expected output columns
\`month\`, \`total_orders\`, \`completed_orders\`, \`total_revenue\`, \`avg_order_value\``,
  descriptionFr: `## Insérer un résumé mensuel depuis les commandes

L'équipe finance a besoin d'une table \`monthly_summary\` pré-agrégée pour des rapports rapides. La table brute \`orders\` est déjà peuplée, mais la table de résumé est vide. Votre mission est de la peupler avec un \`INSERT INTO ... SELECT\` combiné à un \`GROUP BY\` pour agréger les commandes par mois.

### Schéma

**orders** (données transactionnelles brutes)
| Colonne | Type |
|---------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| order_date | DATE |
| amount | DECIMAL(10,2) |
| status | VARCHAR ('completed', 'cancelled', 'refunded') |

**monthly_summary** (pré-agrégée — vide au départ)
| Colonne | Type |
|---------|------|
| month | DATE |
| total_orders | INTEGER |
| completed_orders | INTEGER |
| total_revenue | DECIMAL(10,2) |
| avg_order_value | DECIMAL(10,2) |

### Tâche

Écrivez un \`INSERT INTO monthly_summary SELECT ...\` qui agrège \`orders\` par mois :
- \`month\` : premier jour du mois (utilisez \`DATE_TRUNC('month', order_date)\`)
- \`total_orders\` : nombre total de commandes ce mois
- \`completed_orders\` : nombre de commandes avec \`status = 'completed'\`
- \`total_revenue\` : somme de \`amount\` pour les commandes complétées uniquement
- \`avg_order_value\` : moyenne de \`amount\` sur toutes les commandes (arrondi à 2 décimales)

Puis \`SELECT\` depuis \`monthly_summary\` trié par \`month\` ASC.

### Colonnes attendues en sortie
\`month\`, \`total_orders\`, \`completed_orders\`, \`total_revenue\`, \`avg_order_value\``,
  hint: "Use DATE_TRUNC('month', order_date) to normalize dates. Use COUNT(*) for total_orders and COUNT(*) FILTER (WHERE status = 'completed') for completed_orders. SUM(amount) FILTER (WHERE status = 'completed') for revenue. ROUND(AVG(amount), 2) for avg.",
  hintFr: "Utilisez DATE_TRUNC('month', order_date) pour normaliser les dates. COUNT(*) pour total_orders et COUNT(*) FILTER (WHERE status = 'completed') pour completed_orders. SUM(amount) FILTER (WHERE status = 'completed') pour le revenu. ROUND(AVG(amount), 2) pour la moyenne.",
  schema: `CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  order_date DATE,
  amount DECIMAL(10,2),
  status VARCHAR
);

CREATE TABLE monthly_summary (
  month DATE,
  total_orders INTEGER,
  completed_orders INTEGER,
  total_revenue DECIMAL(10,2),
  avg_order_value DECIMAL(10,2)
);

INSERT INTO orders VALUES
  (1,  101, '2024-01-05', 120.00, 'completed'),
  (2,  102, '2024-01-12', 85.50,  'completed'),
  (3,  103, '2024-01-18', 200.00, 'cancelled'),
  (4,  104, '2024-01-25', 55.00,  'completed'),
  (5,  101, '2024-02-03', 310.00, 'completed'),
  (6,  105, '2024-02-14', 90.00,  'refunded'),
  (7,  102, '2024-02-20', 145.00, 'completed'),
  (8,  106, '2024-02-27', 60.00,  'cancelled'),
  (9,  103, '2024-03-02', 420.00, 'completed'),
  (10, 107, '2024-03-10', 75.00,  'completed'),
  (11, 104, '2024-03-15', 180.00, 'refunded'),
  (12, 108, '2024-03-22', 95.00,  'completed'),
  (13, 105, '2024-03-28', 50.00,  'cancelled'),
  (14, 101, '2024-04-05', 260.00, 'completed'),
  (15, 109, '2024-04-11', 130.00, 'completed'),
  (16, 106, '2024-04-19', 70.00,  'cancelled'),
  (17, 110, '2024-04-23', 315.00, 'completed'),
  (18, 102, '2024-04-29', 88.00,  'refunded'),
  (19, 111, '2024-05-07', 195.00, 'completed'),
  (20, 107, '2024-05-15', 40.00,  'cancelled'),
  (21, 112, '2024-05-21', 510.00, 'completed'),
  (22, 108, '2024-05-30', 220.00, 'completed');`,
  solutionQuery: `INSERT INTO monthly_summary
SELECT
  DATE_TRUNC('month', order_date) AS month,
  COUNT(*)                                                    AS total_orders,
  COUNT(*) FILTER (WHERE status = 'completed')               AS completed_orders,
  SUM(amount) FILTER (WHERE status = 'completed')            AS total_revenue,
  ROUND(AVG(amount), 2)                                      AS avg_order_value
FROM orders
GROUP BY DATE_TRUNC('month', order_date);

SELECT month, total_orders, completed_orders, total_revenue, avg_order_value
FROM monthly_summary
ORDER BY month;`,
  solutionExplanation: `## Explanation

### Pattern: INSERT INTO ... SELECT with GROUP BY (Aggregate Load)

This pattern materialises a pre-aggregated summary from raw transactional data in a single statement — a core technique for building reporting layers in a data warehouse.

### Step-by-step
1. \`DATE_TRUNC('month', order_date)\` — normalises every order date to the first of its month, enabling GROUP BY.
2. \`COUNT(*)\` — counts all orders regardless of status.
3. \`COUNT(*) FILTER (WHERE status = 'completed')\` — DuckDB's clean alternative to \`SUM(CASE WHEN status = 'completed' THEN 1 END)\`.
4. \`SUM(amount) FILTER (WHERE status = 'completed')\` — sums revenue only for completed orders; cancelled and refunded orders are excluded.
5. \`ROUND(AVG(amount), 2)\` — average order value across all statuses, rounded for display.
6. \`GROUP BY DATE_TRUNC('month', order_date)\` — one row per calendar month.

### DuckDB note
The \`FILTER (WHERE ...)\` clause is standard SQL:2003 and supported natively in DuckDB. It is cleaner and often faster than \`CASE WHEN\` inside aggregates.

### When to use
- Building fact tables or summary tables in a medallion architecture (bronze → silver → gold)
- Pre-aggregating data for dashboards where query speed matters more than raw access
- Any ETL step that materialises computed metrics into a reporting table`,
  solutionExplanationFr: `## Explication

### Patron : INSERT INTO ... SELECT avec GROUP BY (chargement agrégé)

Ce patron matérialise un résumé pré-agrégé à partir de données transactionnelles brutes en une seule instruction — technique centrale pour construire des couches de reporting dans un data warehouse.

### Étape par étape
1. \`DATE_TRUNC('month', order_date)\` — normalise chaque date de commande au premier du mois.
2. \`COUNT(*)\` — compte toutes les commandes quel que soit le statut.
3. \`COUNT(*) FILTER (WHERE status = 'completed')\` — alternative DuckDB élégante à \`SUM(CASE WHEN ...)\`.
4. \`SUM(amount) FILTER (WHERE status = 'completed')\` — somme le revenu uniquement pour les commandes complétées.
5. \`ROUND(AVG(amount), 2)\` — valeur moyenne des commandes, arrondie à 2 décimales.
6. \`GROUP BY DATE_TRUNC('month', order_date)\` — une ligne par mois calendaire.

### Note DuckDB
La clause \`FILTER (WHERE ...)\` est du SQL:2003 standard, supportée nativement dans DuckDB. Elle est plus lisible et souvent plus rapide que \`CASE WHEN\` dans les agrégats.

### Quand l'utiliser
- Construction de tables de faits ou de résumé dans une architecture medallion
- Pré-agrégation pour des tableaux de bord où la vitesse de requête prime sur l'accès brut
- Toute étape ETL qui matérialise des métriques calculées dans une table de reporting`,
  testCases: [
    {
      name: "default",
      description: "5 months of aggregated order data with correct revenue and counts",
      descriptionFr: "5 mois de données agrégées avec revenu et comptages corrects",
      expectedColumns: ["month", "total_orders", "completed_orders", "total_revenue", "avg_order_value"],
      expectedRows: [
        { month: "2024-01-01", total_orders: 4, completed_orders: 3, total_revenue: 260.50, avg_order_value: 115.13 },
        { month: "2024-02-01", total_orders: 4, completed_orders: 2, total_revenue: 455.00, avg_order_value: 151.25 },
        { month: "2024-03-01", total_orders: 5, completed_orders: 3, total_revenue: 590.00, avg_order_value: 164.00 },
        { month: "2024-04-01", total_orders: 5, completed_orders: 3, total_revenue: 705.00, avg_order_value: 172.60 },
        { month: "2024-05-01", total_orders: 4, completed_orders: 3, total_revenue: 925.00, avg_order_value: 241.25 },
      ],
      orderMatters: true,
    },
    {
      name: "single-month",
      description: "With only January orders, summary has exactly one row",
      descriptionFr: "Avec uniquement les commandes de janvier, le résumé a exactement une ligne",
      setupSql: `DELETE FROM orders WHERE order_date >= '2024-02-01';`,
      expectedColumns: ["month", "total_orders", "completed_orders", "total_revenue", "avg_order_value"],
      expectedRows: [
        { month: "2024-01-01", total_orders: 4, completed_orders: 3, total_revenue: 260.50, avg_order_value: 115.13 },
      ],
      orderMatters: true,
    },
  ],
};
