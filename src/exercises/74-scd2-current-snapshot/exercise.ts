import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "74-scd2-current-snapshot",
  title: "SCD Type 2 — Total Spend per Current Customer",
  titleFr: "SCD Type 2 — Dépense totale par client actuel",
  difficulty: "medium",
  category: "scd",
  description: `## SCD Type 2 — Total Spend per Current Customer

The BI team needs a report showing each customer's **current city and country** alongside their **total lifetime spend**. The customer dimension uses SCD Type 2, so multiple historical versions exist per customer. You must join with \`fact_orders\` using the natural key (\`customer_id\`), but only use the **current** dimension record for the customer attributes.

### Schema

| Table | Column | Type |
|-------|--------|------|
| dim_customer_scd2 | surrogate_key | INTEGER |
| dim_customer_scd2 | customer_id | INTEGER |
| dim_customer_scd2 | customer_name | VARCHAR |
| dim_customer_scd2 | city | VARCHAR |
| dim_customer_scd2 | country | VARCHAR |
| dim_customer_scd2 | valid_from | DATE |
| dim_customer_scd2 | valid_to | DATE |
| dim_customer_scd2 | is_current | BOOLEAN |
| fact_orders | order_id | INTEGER |
| fact_orders | customer_id | INTEGER |
| fact_orders | order_date | DATE |
| fact_orders | amount | DECIMAL(10,2) |

### Task

Join \`dim_customer_scd2\` (current records only) with \`fact_orders\` on \`customer_id\` to compute \`total_spend\` per customer. Include customers with no orders (show 0.00 for them).

### Expected output columns
\`customer_id\`, \`customer_name\`, \`city\`, \`country\`, \`total_spend\`

Order by \`total_spend\` DESC, \`customer_id\` ASC.`,
  descriptionFr: `## SCD Type 2 — Dépense totale par client actuel

L'équipe BI a besoin d'un rapport montrant la **ville et le pays actuels** de chaque client ainsi que leur **dépense totale sur toute la durée de vie**. La dimension client utilise le SCD Type 2, donc plusieurs versions historiques existent par client. Vous devez joindre avec \`fact_orders\` en utilisant la clé naturelle (\`customer_id\`), mais utiliser uniquement l'enregistrement de dimension **actuel** pour les attributs du client.

### Schéma

| Table | Colonne | Type |
|-------|---------|------|
| dim_customer_scd2 | surrogate_key | INTEGER |
| dim_customer_scd2 | customer_id | INTEGER |
| dim_customer_scd2 | customer_name | VARCHAR |
| dim_customer_scd2 | city | VARCHAR |
| dim_customer_scd2 | country | VARCHAR |
| dim_customer_scd2 | valid_from | DATE |
| dim_customer_scd2 | valid_to | DATE |
| dim_customer_scd2 | is_current | BOOLEAN |
| fact_orders | order_id | INTEGER |
| fact_orders | customer_id | INTEGER |
| fact_orders | order_date | DATE |
| fact_orders | amount | DECIMAL(10,2) |

### Tâche

Joindre \`dim_customer_scd2\` (enregistrements actuels uniquement) avec \`fact_orders\` sur \`customer_id\` pour calculer \`total_spend\` par client. Inclure les clients sans commandes (afficher 0.00 pour eux).

### Colonnes attendues en sortie
\`customer_id\`, \`customer_name\`, \`city\`, \`country\`, \`total_spend\`

Trier par \`total_spend\` DESC, \`customer_id\` ASC.`,
  hint: "Filter the SCD2 table to is_current = true before joining. Use LEFT JOIN to keep customers with no orders. Use COALESCE(SUM(amount), 0.00) to show 0 instead of NULL for customers without orders.",
  hintFr: "Filtre la table SCD2 sur is_current = true avant la jointure. Utilise LEFT JOIN pour conserver les clients sans commandes. Utilise COALESCE(SUM(amount), 0.00) pour afficher 0 au lieu de NULL pour les clients sans commandes.",
  schema: `CREATE TABLE dim_customer_scd2 (
  surrogate_key INTEGER,
  customer_id INTEGER,
  customer_name VARCHAR,
  city VARCHAR,
  country VARCHAR,
  valid_from DATE,
  valid_to DATE,
  is_current BOOLEAN
);

INSERT INTO dim_customer_scd2 VALUES
  (1,  1, 'Alice Martin', 'Paris',      'France',      '2022-01-01', '2023-06-14', false),
  (2,  1, 'Alice Martin', 'Bordeaux',   'France',      '2023-06-15', NULL,         true),
  (3,  2, 'Bob Dupont',   'Lyon',       'France',      '2021-03-10', '2023-11-30', false),
  (4,  2, 'Bob Dupont',   'Nice',       'France',      '2023-12-01', NULL,         true),
  (5,  3, 'Carol Smith',  'London',     'UK',          '2020-05-01', NULL,         true),
  (6,  4, 'David Jones',  'Manchester', 'UK',          '2021-08-15', '2023-03-31', false),
  (7,  4, 'David Jones',  'Edinburgh',  'UK',          '2023-04-01', NULL,         true),
  (8,  5, 'Eva Müller',   'Berlin',     'Germany',     '2022-07-01', NULL,         true),
  (9,  6, 'Frank Weber',  'Munich',     'Germany',     '2023-01-01', NULL,         true),
  (10, 7, 'Grace Lee',    'Seoul',      'South Korea', '2021-11-01', NULL,         true);

CREATE TABLE fact_orders (
  order_id INTEGER,
  customer_id INTEGER,
  order_date DATE,
  amount DECIMAL(10,2)
);

INSERT INTO fact_orders VALUES
  (1,  1, '2023-01-15', 120.00),
  (2,  1, '2023-07-20', 245.50),
  (3,  1, '2024-02-10', 89.99),
  (4,  2, '2022-05-01', 310.00),
  (5,  2, '2024-01-18', 75.25),
  (6,  3, '2021-09-12', 540.00),
  (7,  3, '2022-03-05', 190.00),
  (8,  3, '2024-06-22', 420.75),
  (9,  4, '2023-11-30', 650.00),
  (10, 4, '2024-04-14', 320.50),
  (11, 5, '2023-08-08', 88.00),
  (12, 6, '2024-03-19', 210.00);`,
  solutionQuery: `SELECT
  dc.customer_id,
  dc.customer_name,
  dc.city,
  dc.country,
  COALESCE(SUM(fo.amount), 0.00) AS total_spend
FROM dim_customer_scd2 dc
LEFT JOIN fact_orders fo ON dc.customer_id = fo.customer_id
WHERE dc.is_current = true
GROUP BY dc.customer_id, dc.customer_name, dc.city, dc.country
ORDER BY total_spend DESC, dc.customer_id ASC;`,
  solutionExplanation: `## Explanation

### Pattern: SCD Type 2 — Current Snapshot Join

When a fact table uses the natural key (\`customer_id\`) while the dimension uses SCD Type 2, you must filter the dimension to \`is_current = true\` before joining. This ensures each customer appears exactly once with their current attributes.

### Step-by-step

1. **Filter dimension**: \`WHERE dc.is_current = true\` reduces the SCD2 table to one row per customer — their current version.
2. **LEFT JOIN to fact_orders**: Using \`LEFT JOIN\` ensures that customers with no orders still appear in the result.
3. **COALESCE for NULLs**: \`COALESCE(SUM(fo.amount), 0.00)\` converts NULL (no orders) to 0.00.
4. **GROUP BY**: Aggregate all orders per customer.
5. **ORDER BY**: Sort by total spend descending to rank highest-value customers first.

### Why this approach

Filtering on \`is_current\` before joining avoids double-counting — without the filter, a customer with 3 historical versions would have their orders summed 3 times.

### When to use

- Standard BI reporting: "show me the current state of customers with their metrics"
- Any join between a fact table and an SCD Type 2 dimension where only current attributes are needed`,
  solutionExplanationFr: `## Explication

### Pattern : SCD Type 2 — Jointure sur le snapshot actuel

Quand une table de faits utilise la clé naturelle (\`customer_id\`) tandis que la dimension utilise le SCD Type 2, vous devez filtrer la dimension sur \`is_current = true\` avant la jointure. Cela garantit que chaque client apparaît exactement une fois avec ses attributs actuels.

### Étape par étape

1. **Filtrer la dimension** : \`WHERE dc.is_current = true\` réduit la table SCD2 à une ligne par client — sa version actuelle.
2. **LEFT JOIN avec fact_orders** : L'utilisation de \`LEFT JOIN\` garantit que les clients sans commandes apparaissent quand même dans le résultat.
3. **COALESCE pour les NULLs** : \`COALESCE(SUM(fo.amount), 0.00)\` convertit NULL (pas de commandes) en 0.00.
4. **GROUP BY** : Agrège toutes les commandes par client.
5. **ORDER BY** : Trier par dépense totale décroissante pour classer les clients à plus haute valeur en premier.

### Pourquoi cette approche

Filtrer sur \`is_current\` avant la jointure évite le double comptage — sans le filtre, un client avec 3 versions historiques verrait ses commandes sommées 3 fois.

### Quand l'utiliser

- Rapports BI standards : "montrez-moi l'état actuel des clients avec leurs métriques"
- Toute jointure entre une table de faits et une dimension SCD Type 2 où seuls les attributs actuels sont nécessaires`,
  testCases: [
    {
      name: "default",
      description: "10 customers with their current city and total lifetime spend; customer 7 has no orders",
      descriptionFr: "10 clients avec leur ville actuelle et dépense totale ; le client 7 n'a pas de commandes",
      expectedColumns: ["customer_id", "customer_name", "city", "country", "total_spend"],
      expectedRows: [
        { customer_id: 4, customer_name: "David Jones", city: "Edinburgh",  country: "UK",           total_spend: 970.50 },
        { customer_id: 3, customer_name: "Carol Smith",  city: "London",    country: "UK",           total_spend: 1150.75 },
        { customer_id: 1, customer_name: "Alice Martin", city: "Bordeaux",  country: "France",       total_spend: 455.49 },
        { customer_id: 6, customer_name: "Frank Weber",  city: "Munich",    country: "Germany",      total_spend: 210.00 },
        { customer_id: 2, customer_name: "Bob Dupont",   city: "Nice",      country: "France",       total_spend: 385.25 },
        { customer_id: 5, customer_name: "Eva Müller",   city: "Berlin",    country: "Germany",      total_spend: 88.00 },
        { customer_id: 7, customer_name: "Grace Lee",    city: "Seoul",     country: "South Korea",  total_spend: 0.00 },
      ],
      orderMatters: true,
    },
    {
      name: "all-orders-one-customer",
      description: "Single customer with multiple historical versions — counted only once",
      descriptionFr: "Client unique avec plusieurs versions historiques — compté une seule fois",
      setupSql: `DELETE FROM dim_customer_scd2;
DELETE FROM fact_orders;
INSERT INTO dim_customer_scd2 VALUES
  (1, 1, 'Alice Martin', 'Paris',    'France', '2021-01-01', '2022-12-31', false),
  (2, 1, 'Alice Martin', 'Lyon',     'France', '2023-01-01', '2023-11-30', false),
  (3, 1, 'Alice Martin', 'Bordeaux', 'France', '2023-12-01', NULL,         true);
INSERT INTO fact_orders VALUES
  (1, 1, '2021-06-01', 100.00),
  (2, 1, '2023-03-15', 200.00),
  (3, 1, '2024-01-10', 300.00);`,
      expectedColumns: ["customer_id", "customer_name", "city", "country", "total_spend"],
      expectedRows: [
        { customer_id: 1, customer_name: "Alice Martin", city: "Bordeaux", country: "France", total_spend: 600.00 },
      ],
      orderMatters: false,
    },
  ],
};
