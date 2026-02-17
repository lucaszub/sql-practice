import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "96-select-specificity",
  title: "Replacing SELECT * with Focused Queries",
  titleFr: "Remplacer SELECT * par des requêtes ciblées",
  difficulty: "medium",
  category: "query-optimization",
  description: `## Replacing SELECT * with Focused Queries

The finance team receives a daily email report listing **high-value completed orders** with the customer name and total. The query powering it uses \`SELECT *\`, which transfers dozens of columns over the network — most of which are never used.

The report only needs three pieces of information:
- The order reference (\`order_id\`)
- The customer's full name (\`customer_name\`)
- The order total (\`total_amount\`)

High-value orders are those with \`total_amount >= 200\` and \`status = 'completed'\`.

### Schema

**orders**

| Column | Type | Notes |
|--------|------|-------|
| order_id | INTEGER | Primary key |
| customer_id | INTEGER | FK to customers |
| order_date | DATE | |
| total_amount | DECIMAL | |
| status | VARCHAR | 'completed', 'pending', 'cancelled' |
| shipping_address | VARCHAR | Not needed |
| billing_address | VARCHAR | Not needed |
| notes | VARCHAR | Not needed |
| internal_ref | VARCHAR | Not needed |

**customers**

| Column | Type | Notes |
|--------|------|-------|
| customer_id | INTEGER | Primary key |
| customer_name | VARCHAR | Full name |
| email | VARCHAR | Not needed |
| phone | VARCHAR | Not needed |
| tier | VARCHAR | Not needed |

### Task

Write an optimized query that selects **only the three needed columns** and applies **proper WHERE filtering**. Join the two tables and return only the relevant rows.

Return: \`order_id\`, \`customer_name\`, \`total_amount\`

Order by \`total_amount\` DESC, then \`order_id\` ASC.`,

  descriptionFr: `## Remplacer SELECT * par des requêtes ciblées

L'équipe finance reçoit un rapport email quotidien listant les **commandes complétées à haute valeur** avec le nom du client et le total. La requête qui l'alimente utilise \`SELECT *\`, transférant des dizaines de colonnes sur le réseau — la plupart jamais utilisées.

Le rapport n'a besoin que de trois informations :
- La référence de commande (\`order_id\`)
- Le nom complet du client (\`customer_name\`)
- Le total de la commande (\`total_amount\`)

Les commandes à haute valeur sont celles avec \`total_amount >= 200\` et \`status = 'completed'\`.

### Schéma

**orders**

| Colonne | Type | Notes |
|---------|------|-------|
| order_id | INTEGER | Clé primaire |
| customer_id | INTEGER | FK vers customers |
| order_date | DATE | |
| total_amount | DECIMAL | |
| status | VARCHAR | 'completed', 'pending', 'cancelled' |
| shipping_address | VARCHAR | Non nécessaire |
| billing_address | VARCHAR | Non nécessaire |
| notes | VARCHAR | Non nécessaire |
| internal_ref | VARCHAR | Non nécessaire |

**customers**

| Colonne | Type | Notes |
|---------|------|-------|
| customer_id | INTEGER | Clé primaire |
| customer_name | VARCHAR | Nom complet |
| email | VARCHAR | Non nécessaire |
| phone | VARCHAR | Non nécessaire |
| tier | VARCHAR | Non nécessaire |

### Tâche

Écrire une requête optimisée qui sélectionne **uniquement les trois colonnes nécessaires** et applique un **filtrage WHERE approprié**. Joindre les deux tables et retourner uniquement les lignes pertinentes.

Retourner : \`order_id\`, \`customer_name\`, \`total_amount\`

Trier par \`total_amount\` DESC, puis \`order_id\` ASC.`,

  hint: "List only order_id, customer_name, and total_amount in your SELECT. Apply WHERE status = 'completed' AND total_amount >= 200 before or after the JOIN. Filtering early reduces the number of rows processed.",
  hintFr: "Listez uniquement order_id, customer_name et total_amount dans votre SELECT. Appliquez WHERE status = 'completed' AND total_amount >= 200 avant ou après le JOIN. Filtrer tôt réduit le nombre de lignes traitées.",

  schema: `CREATE TABLE customers (
  customer_id   INTEGER,
  customer_name VARCHAR,
  email         VARCHAR,
  phone         VARCHAR,
  tier          VARCHAR
);

CREATE TABLE orders (
  order_id         INTEGER,
  customer_id      INTEGER,
  order_date       DATE,
  total_amount     DECIMAL(10, 2),
  status           VARCHAR,
  shipping_address VARCHAR,
  billing_address  VARCHAR,
  notes            VARCHAR,
  internal_ref     VARCHAR
);

INSERT INTO customers VALUES
  (1,  'Alice Martin',   'alice@example.com',   '+1-555-0101', 'gold'),
  (2,  'Bob Chen',       'bob@example.com',     '+1-555-0102', 'silver'),
  (3,  'Clara Dupont',   'clara@example.com',   '+1-555-0103', 'bronze'),
  (4,  'David Kim',      'david@example.com',   '+1-555-0104', 'gold'),
  (5,  'Elena Rossi',    'elena@example.com',   '+1-555-0105', 'silver'),
  (6,  'Frank Osei',     'frank@example.com',   '+1-555-0106', 'bronze'),
  (7,  'Grace Yilmaz',   'grace@example.com',   '+1-555-0107', 'gold'),
  (8,  'Hugo Ferreira',  'hugo@example.com',    '+1-555-0108', 'silver'),
  (9,  'Ingrid Nkosi',   'ingrid@example.com',  '+1-555-0109', 'bronze'),
  (10, 'James Webb',     'james@example.com',   '+1-555-0110', 'gold');

INSERT INTO orders VALUES
  (1,  1,  '2024-01-10', 350.00,  'completed', '10 Rue de Rivoli', '10 Rue de Rivoli', NULL,         'ORD-A001'),
  (2,  2,  '2024-01-15', 89.99,   'completed', '5 Baker St',       '5 Baker St',       'fragile',    'ORD-A002'),
  (3,  3,  '2024-02-01', 420.50,  'pending',   '22 Avenida Sol',   '22 Avenida Sol',   NULL,         'ORD-A003'),
  (4,  4,  '2024-02-14', 215.00,  'completed', '7 Maplewood Dr',   '7 Maplewood Dr',   NULL,         'ORD-A004'),
  (5,  5,  '2024-03-05', 59.00,   'cancelled', '3 Via Roma',       '3 Via Roma',       'return ok',  'ORD-A005'),
  (6,  6,  '2024-03-20', 510.00,  'completed', '18 High St',       '18 High St',       NULL,         'ORD-A006'),
  (7,  7,  '2024-04-01', 175.00,  'completed', '99 Oak Lane',      '99 Oak Lane',      'gift wrap',  'ORD-A007'),
  (8,  8,  '2024-04-18', 640.00,  'completed', '14 Elm Close',     '14 Elm Close',     NULL,         'ORD-A008'),
  (9,  9,  '2024-05-02', 30.00,   'completed', '6 Pine Ave',       '6 Pine Ave',       NULL,         'ORD-A009'),
  (10, 10, '2024-05-20', 290.00,  'completed', '2 Cedar Rd',       '2 Cedar Rd',       NULL,         'ORD-A010'),
  (11, 1,  '2024-06-10', 480.00,  'completed', '10 Rue de Rivoli', '10 Rue de Rivoli', NULL,         'ORD-A011'),
  (12, 3,  '2024-06-25', 200.00,  'completed', '22 Avenida Sol',   '22 Avenida Sol',   NULL,         'ORD-A012'),
  (13, 2,  '2024-07-04', 315.00,  'cancelled', '5 Baker St',       '5 Baker St',       NULL,         'ORD-A013'),
  (14, 5,  '2024-07-19', 750.00,  'completed', '3 Via Roma',       '3 Via Roma',       'urgent',     'ORD-A014'),
  (15, 7,  '2024-08-08', 125.00,  'pending',   '99 Oak Lane',      '99 Oak Lane',      NULL,         'ORD-A015');`,

  solutionQuery: `SELECT
  o.order_id,
  c.customer_name,
  o.total_amount
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE o.status = 'completed'
  AND o.total_amount >= 200
ORDER BY o.total_amount DESC, o.order_id;`,

  solutionExplanation: `## Explanation

### Pattern: Explicit column selection + early filtering

\`SELECT *\` is convenient but harmful at scale. This exercise demonstrates two complementary optimisations: **projection pushdown** (select only needed columns) and **predicate pushdown** (filter early).

### Step-by-step

1. **Explicit column list** — name only the three columns the report actually uses (\`order_id\`, \`customer_name\`, \`total_amount\`). The query engine reads less data from storage and transfers less over the network.

2. **WHERE before or during JOIN** — filtering on \`status = 'completed'\` and \`total_amount >= 200\` eliminates ineligible rows before the join multiplies them. Most optimisers push these predicates automatically, but being explicit guarantees it.

3. **JOIN only what you need** — joining only the \`customers\` table (not a \`SELECT *\` subquery) keeps the plan simple.

### Why this approach

- In columnar storage (Parquet, DuckDB), reading fewer columns means fewer column chunks are decompressed and scanned.
- Reducing row count early (before aggregation or further joins) amplifies the benefit.
- Explicit column lists also make the query self-documenting: the reader immediately sees what the report cares about.

### When to use

Always. \`SELECT *\` is acceptable during exploration; it should be replaced with explicit columns in any query that runs repeatedly in production. The savings scale with table width and query frequency.`,

  solutionExplanationFr: `## Explication

### Patron : Sélection explicite de colonnes + filtrage précoce

\`SELECT *\` est pratique mais néfaste à l'échelle. Cet exercice démontre deux optimisations complémentaires : le **pushdown de projection** (sélectionner uniquement les colonnes nécessaires) et le **pushdown de prédicat** (filtrer tôt).

### Étape par étape

1. **Liste de colonnes explicite** — nommer uniquement les trois colonnes dont le rapport a réellement besoin (\`order_id\`, \`customer_name\`, \`total_amount\`). Le moteur lit moins de données du stockage et transfère moins sur le réseau.

2. **WHERE avant ou pendant le JOIN** — filtrer sur \`status = 'completed'\` et \`total_amount >= 200\` élimine les lignes inéligibles avant que le join les multiplie. La plupart des optimiseurs poussent ces prédicats automatiquement, mais être explicite le garantit.

3. **JOIN uniquement ce dont on a besoin** — joindre uniquement la table \`customers\` (et non une sous-requête \`SELECT *\`) garde le plan simple.

### Pourquoi cette approche

- Dans le stockage orienté colonnes (Parquet, DuckDB), lire moins de colonnes signifie que moins de chunks de colonnes sont décompressés et scannés.
- Réduire le nombre de lignes tôt (avant l'agrégation ou d'autres joins) amplifie le bénéfice.
- Les listes de colonnes explicites rendent aussi la requête auto-documentée : le lecteur voit immédiatement ce dont le rapport a besoin.

### Quand l'utiliser

Toujours. \`SELECT *\` est acceptable lors de l'exploration ; il doit être remplacé par des colonnes explicites dans toute requête qui s'exécute régulièrement en production. Les gains s'amplifient avec la largeur de la table et la fréquence d'exécution.`,

  testCases: [
    {
      name: "default",
      description: "Completed orders with total >= 200, ordered by total DESC then order_id ASC",
      descriptionFr: "Commandes complétées avec total >= 200, triées par total DESC puis order_id ASC",
      expectedColumns: ["order_id", "customer_name", "total_amount"],
      expectedRows: [
        { order_id: 14, customer_name: "Elena Rossi",   total_amount: 750.00 },
        { order_id: 8,  customer_name: "Hugo Ferreira",  total_amount: 640.00 },
        { order_id: 6,  customer_name: "Frank Osei",     total_amount: 510.00 },
        { order_id: 11, customer_name: "Alice Martin",   total_amount: 480.00 },
        { order_id: 1,  customer_name: "Alice Martin",   total_amount: 350.00 },
        { order_id: 10, customer_name: "James Webb",     total_amount: 290.00 },
        { order_id: 4,  customer_name: "David Kim",      total_amount: 215.00 },
        { order_id: 12, customer_name: "Clara Dupont",   total_amount: 200.00 },
      ],
      orderMatters: true,
    },
    {
      name: "threshold-boundary",
      description: "Orders with total_amount exactly 200 are included; those with 199.99 are excluded",
      descriptionFr: "Les commandes avec total_amount exactement 200 sont incluses ; celles à 199,99 sont exclues",
      setupSql: `INSERT INTO orders VALUES
  (16, 2, '2024-09-01', 199.99, 'completed', 'addr', 'addr', NULL, 'ORD-A016'),
  (17, 3, '2024-09-02', 200.00, 'completed', 'addr', 'addr', NULL, 'ORD-A017');`,
      expectedColumns: ["order_id", "customer_name", "total_amount"],
      expectedRows: [
        { order_id: 14, customer_name: "Elena Rossi",   total_amount: 750.00 },
        { order_id: 8,  customer_name: "Hugo Ferreira",  total_amount: 640.00 },
        { order_id: 6,  customer_name: "Frank Osei",     total_amount: 510.00 },
        { order_id: 11, customer_name: "Alice Martin",   total_amount: 480.00 },
        { order_id: 1,  customer_name: "Alice Martin",   total_amount: 350.00 },
        { order_id: 10, customer_name: "James Webb",     total_amount: 290.00 },
        { order_id: 4,  customer_name: "David Kim",      total_amount: 215.00 },
        { order_id: 12, customer_name: "Clara Dupont",   total_amount: 200.00 },
        { order_id: 17, customer_name: "Clara Dupont",   total_amount: 200.00 },
      ],
      orderMatters: true,
    },
  ],
};
