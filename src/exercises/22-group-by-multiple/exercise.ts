import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "22-group-by-multiple",
  title: "Order Counts by Country and Month",
  titleFr: "Nombre de commandes par pays et par mois",
  difficulty: "easy",
  category: "aggregation",
  description: `## Order Counts by Country and Month

The analytics team needs **order counts broken down by country and month** for the quarterly report. This two-dimensional breakdown will reveal which markets are growing and which are seasonal.

### Schema

**customers**
| Column | Type |
|--------|------|
| customer_id | INTEGER |
| customer_name | VARCHAR |
| country | VARCHAR |

**orders**
| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| order_date | DATE |
| total_amount | DECIMAL(10,2) |

### Task

Write a query that returns:
- \`country\`: the customer's country
- \`order_month\`: the month extracted from \`order_date\` (as an integer)
- \`order_count\`: the number of orders for that country-month combination
- \`total_revenue\`: the sum of \`total_amount\` for that country-month combination

Order by \`country\` ASC, \`order_month\` ASC.

### Expected output columns
\`country\`, \`order_month\`, \`order_count\`, \`total_revenue\``,
  descriptionFr: `## Nombre de commandes par pays et par mois

L'equipe analytique a besoin du **nombre de commandes ventile par pays et par mois** pour le rapport trimestriel. Cette ventilation bidimensionnelle permettra de reveler quels marches sont en croissance et lesquels sont saisonniers.

### Schema

**customers**
| Column | Type |
|--------|------|
| customer_id | INTEGER |
| customer_name | VARCHAR |
| country | VARCHAR |

**orders**
| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| order_date | DATE |
| total_amount | DECIMAL(10,2) |

### Tache

Ecrivez une requete qui retourne :
- \`country\` : le pays du client
- \`order_month\` : le mois extrait de \`order_date\` (sous forme d'entier)
- \`order_count\` : le nombre de commandes pour cette combinaison pays-mois
- \`total_revenue\` : la somme de \`total_amount\` pour cette combinaison pays-mois

Triez par \`country\` ASC, \`order_month\` ASC.

### Colonnes attendues en sortie
\`country\`, \`order_month\`, \`order_count\`, \`total_revenue\``,
  hint: "JOIN customers and orders, then GROUP BY country and EXTRACT(MONTH FROM order_date). Use COUNT(*) for order count and SUM() for revenue.",
  schema: `CREATE TABLE customers (
  customer_id INTEGER,
  customer_name VARCHAR,
  country VARCHAR
);

CREATE TABLE orders (
  order_id INTEGER,
  customer_id INTEGER,
  order_date DATE,
  total_amount DECIMAL(10,2)
);

INSERT INTO customers VALUES
  (1, 'Alice Martin', 'France'),
  (2, 'Bob Smith', 'USA'),
  (3, 'Carlos Garcia', 'Spain'),
  (4, 'Diana Chen', 'USA'),
  (5, 'Emma Wilson', 'UK'),
  (6, 'Francois Dupont', 'France'),
  (7, 'Giulia Rossi', 'Spain'),
  (8, 'Hans Mueller', 'Germany');

INSERT INTO orders VALUES
  (1, 1, '2024-01-10', 120.00),
  (2, 2, '2024-01-15', 89.99),
  (3, 3, '2024-01-20', 54.50),
  (4, 1, '2024-01-25', 200.00),
  (5, 4, '2024-01-28', 175.00),
  (6, 5, '2024-02-05', 65.00),
  (7, 2, '2024-02-10', 310.00),
  (8, 6, '2024-02-14', 88.50),
  (9, 3, '2024-02-18', 142.00),
  (10, 7, '2024-02-22', 99.99),
  (11, 8, '2024-03-01', 225.00),
  (12, 1, '2024-03-08', 78.00),
  (13, 4, '2024-03-12', 415.00),
  (14, 5, '2024-03-18', 33.50),
  (15, 2, '2024-03-25', 190.00);`,
  solutionQuery: `SELECT
  c.country,
  EXTRACT(MONTH FROM o.order_date) AS order_month,
  COUNT(*) AS order_count,
  SUM(o.total_amount) AS total_revenue
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.country, EXTRACT(MONTH FROM o.order_date)
ORDER BY c.country, order_month;`,
  solutionExplanation: `## Explanation

### Pattern: GROUP BY Multiple Columns

Grouping by two or more columns creates a multi-dimensional breakdown, where each unique combination of values becomes one row.

### Step-by-step
1. **\`JOIN orders ON customer_id\`**: Connects each order to the customer's country.
2. **\`EXTRACT(MONTH FROM o.order_date)\`**: Extracts the month as an integer for grouping.
3. **\`GROUP BY c.country, EXTRACT(MONTH FROM o.order_date)\`**: Creates one group for each unique (country, month) pair. For example, ('France', 1) and ('France', 2) are separate groups.
4. **\`COUNT(*)\`**: Counts orders within each country-month group.
5. **\`SUM(o.total_amount)\`**: Totals revenue within each country-month group.
6. **\`ORDER BY country, order_month\`**: Sorts alphabetically by country, then chronologically by month within each country.

### Why this approach
- Multi-column GROUP BY is the foundation of dimensional reporting. It lets you slice data along multiple axes simultaneously.
- Each additional GROUP BY column adds a dimension to the analysis, creating finer-grained breakdowns.

### When to use
- Cross-tabulated reports (country x month, category x region, etc.)
- Identifying patterns that only appear when you look at intersections (e.g., a country that only orders in Q1)
- Building pivot-ready datasets for dashboards`,
  testCases: [
    {
      name: "default",
      description:
        "Order counts and revenue by country and month from base data",
      expectedColumns: [
        "country",
        "order_month",
        "order_count",
        "total_revenue",
      ],
      expectedRows: [
        { country: "France", order_month: 1, order_count: 2, total_revenue: 320.0 },
        { country: "France", order_month: 2, order_count: 1, total_revenue: 88.5 },
        { country: "France", order_month: 3, order_count: 1, total_revenue: 78.0 },
        { country: "Germany", order_month: 3, order_count: 1, total_revenue: 225.0 },
        { country: "Spain", order_month: 1, order_count: 1, total_revenue: 54.5 },
        { country: "Spain", order_month: 2, order_count: 2, total_revenue: 241.99 },
        { country: "UK", order_month: 2, order_count: 1, total_revenue: 65.0 },
        { country: "UK", order_month: 3, order_count: 1, total_revenue: 33.5 },
        { country: "USA", order_month: 1, order_count: 2, total_revenue: 264.99 },
        { country: "USA", order_month: 2, order_count: 1, total_revenue: 310.0 },
        { country: "USA", order_month: 3, order_count: 2, total_revenue: 605.0 },
      ],
      orderMatters: true,
    },
    {
      name: "new-country-single-order",
      description:
        "Adding an order for a new country should create a single-row group",
      setupSql: `INSERT INTO customers VALUES (9, 'Yuki Tanaka', 'Japan');
INSERT INTO orders VALUES (16, 9, '2024-01-30', 500.00);`,
      expectedColumns: [
        "country",
        "order_month",
        "order_count",
        "total_revenue",
      ],
      expectedRows: [
        { country: "France", order_month: 1, order_count: 2, total_revenue: 320.0 },
        { country: "France", order_month: 2, order_count: 1, total_revenue: 88.5 },
        { country: "France", order_month: 3, order_count: 1, total_revenue: 78.0 },
        { country: "Germany", order_month: 3, order_count: 1, total_revenue: 225.0 },
        { country: "Japan", order_month: 1, order_count: 1, total_revenue: 500.0 },
        { country: "Spain", order_month: 1, order_count: 1, total_revenue: 54.5 },
        { country: "Spain", order_month: 2, order_count: 2, total_revenue: 241.99 },
        { country: "UK", order_month: 2, order_count: 1, total_revenue: 65.0 },
        { country: "UK", order_month: 3, order_count: 1, total_revenue: 33.5 },
        { country: "USA", order_month: 1, order_count: 2, total_revenue: 264.99 },
        { country: "USA", order_month: 2, order_count: 1, total_revenue: 310.0 },
        { country: "USA", order_month: 3, order_count: 2, total_revenue: 605.0 },
      ],
      orderMatters: true,
    },
  ],
};
