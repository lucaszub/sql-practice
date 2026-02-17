import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "67-dimension-table-design",
  title: "Customer Dimension with Deduplication",
  titleFr: "Dimension client avec deduplication",
  difficulty: "medium",
  category: "star-schema",
  description: `## Customer Dimension with Deduplication

The data platform team is building a \`dim_customer\` dimension table from a raw CRM export. The raw data has duplicates — some customers appear multiple times due to repeated syncs. You need to deduplicate and assign a surrogate key to produce a clean dimension table.

### Schema

**raw_customers**
| Column | Type |
|--------|------|
| raw_id | INTEGER |
| customer_id | INTEGER |
| first_name | VARCHAR |
| last_name | VARCHAR |
| email | VARCHAR |
| city | VARCHAR |
| country | VARCHAR |
| segment | VARCHAR |
| synced_at | TIMESTAMP |

### Task

Write a query that produces one row per unique \`customer_id\` (the natural key). When duplicates exist, keep the **most recently synced** record. Assign a **surrogate key** using ROW_NUMBER ordered by \`customer_id\`.

### Expected output columns
\`customer_sk\`, \`customer_id\`, \`first_name\`, \`last_name\`, \`email\`, \`city\`, \`country\`, \`segment\`

Order by \`customer_sk\` ASC.`,
  descriptionFr: `## Dimension client avec deduplication

L'equipe data platform construit une table de dimension \`dim_customer\` a partir d'un export CRM brut. Les donnees brutes contiennent des doublons — certains clients apparaissent plusieurs fois en raison de synchronisations repetees. Vous devez dedupliquer et assigner une cle de substitution pour produire une table de dimension propre.

### Schema

**raw_customers**
| Colonne | Type |
|---------|------|
| raw_id | INTEGER |
| customer_id | INTEGER |
| first_name | VARCHAR |
| last_name | VARCHAR |
| email | VARCHAR |
| city | VARCHAR |
| country | VARCHAR |
| segment | VARCHAR |
| synced_at | TIMESTAMP |

### Tache

Ecrivez une requete qui produit une ligne par \`customer_id\` unique (la cle naturelle). En cas de doublons, conservez l'enregistrement **synchronise le plus recemment**. Assignez une **cle de substitution** via ROW_NUMBER ordonne par \`customer_id\`.

### Colonnes attendues en sortie
\`customer_sk\`, \`customer_id\`, \`first_name\`, \`last_name\`, \`email\`, \`city\`, \`country\`, \`segment\`

Triez par \`customer_sk\` ASC.`,
  hint: "Use ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY synced_at DESC) to rank duplicates. In an outer query, keep only rank = 1. Then apply a second ROW_NUMBER() OVER (ORDER BY customer_id) to generate the surrogate key.",
  hintFr: "Utilisez ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY synced_at DESC) pour classer les doublons. Dans une requete externe, ne conservez que le rang 1. Appliquez ensuite un second ROW_NUMBER() OVER (ORDER BY customer_id) pour generer la cle de substitution.",
  schema: `CREATE TABLE raw_customers (
  raw_id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  first_name VARCHAR,
  last_name VARCHAR,
  email VARCHAR,
  city VARCHAR,
  country VARCHAR,
  segment VARCHAR,
  synced_at TIMESTAMP
);

INSERT INTO raw_customers VALUES
  (1,  101, 'Alice',   'Martin',  'alice@acme.com',    'Paris',     'France',  'Enterprise', '2024-01-10 08:00:00'),
  (2,  101, 'Alice',   'Martin',  'alice@acme.com',    'Lyon',      'France',  'Enterprise', '2024-03-15 09:30:00'),
  (3,  102, 'Bob',     'Johnson', 'bob@beta.com',      'London',    'UK',      'SMB',        '2024-01-12 10:00:00'),
  (4,  103, 'Charlie', 'Lee',     'charlie@gamma.com', 'Berlin',    'Germany', 'Enterprise', '2024-01-20 11:00:00'),
  (5,  103, 'Charlie', 'Lee',     'charlie@gamma.com', 'Munich',    'Germany', 'Enterprise', '2024-02-01 14:00:00'),
  (6,  103, 'Charlie', 'Lee',     'charlie@gamma.com', 'Frankfurt', 'Germany', 'Enterprise', '2024-04-10 16:00:00'),
  (7,  104, 'Diana',   'Park',    'diana@delta.com',   'Seoul',     'Korea',   'SMB',        '2024-02-05 09:00:00'),
  (8,  105, 'Eve',     'Garcia',  'eve@epsilon.com',   'Madrid',    'Spain',   'Startup',    '2024-02-18 10:30:00'),
  (9,  105, 'Eve',     'Garcia',  'eve@epsilon.com',   'Barcelona', 'Spain',   'SMB',        '2024-05-01 11:00:00'),
  (10, 106, 'Frank',   'Chen',    'frank@zeta.com',    'Shanghai',  'China',   'Enterprise', '2024-03-01 08:00:00'),
  (11, 107, 'Grace',   'Kim',     NULL,                'Tokyo',     'Japan',   'Startup',    '2024-03-10 09:00:00'),
  (12, 108, 'Hank',    'Wilson',  'hank@eta.com',      'New York',  'USA',     'Enterprise', '2024-04-01 10:00:00'),
  (13, 108, 'Hank',    'Wilson',  'hank@eta.com',      'Chicago',   'USA',     'Enterprise', '2024-04-20 12:00:00'),
  (14, 109, 'Iris',    'Brown',   'iris@theta.com',    'Toronto',   'Canada',  'SMB',        '2024-05-05 08:00:00'),
  (15, 110, 'Jake',    'Smith',   'jake@iota.com',     'Sydney',    'Australia','Startup',   '2024-05-10 10:00:00');`,
  solutionQuery: `WITH ranked AS (
  SELECT
    *,
    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY synced_at DESC) AS rn
  FROM raw_customers
),
deduped AS (
  SELECT *
  FROM ranked
  WHERE rn = 1
)
SELECT
  ROW_NUMBER() OVER (ORDER BY customer_id) AS customer_sk,
  customer_id,
  first_name,
  last_name,
  email,
  city,
  country,
  segment
FROM deduped
ORDER BY customer_sk ASC;`,
  solutionExplanation: `## Explanation

### Pattern: Dimension Table Deduplication with Surrogate Key

This is the **SCD Type 1 load pattern** — keep the latest version of each entity and discard historical duplicates.

### Step-by-step
1. **ranked CTE**: Assigns ROW_NUMBER() partitioned by the natural key (\`customer_id\`) and ordered by \`synced_at DESC\`. Row 1 is always the most recent sync for each customer.
2. **deduped CTE**: Filters to keep only \`rn = 1\` — one row per customer, always the latest data.
3. **Final SELECT with ROW_NUMBER()**: Generates a monotonic integer surrogate key (\`customer_sk\`) by ordering the deduped result by \`customer_id\`. The surrogate key is database-assigned and decoupled from the natural key.

### Why surrogate keys?
- Natural keys (like \`customer_id\`) can change or be reused in source systems.
- Surrogate keys are stable, system-generated integers that join efficiently with fact tables.
- They also enable SCD Type 2 (multiple versions per customer) when needed later.

### When to use
- Initial dimension table load from raw CRM, ERP, or API data
- Nightly refresh where you rebuild the entire dimension (full refresh strategy)
- Any scenario where source data has sync-induced duplicates`,
  solutionExplanationFr: `## Explication

### Patron : Deduplication de table de dimension avec cle de substitution

C'est le **patron de chargement SCD Type 1** — conserver la derniere version de chaque entite et ignorer les doublons historiques.

### Etape par etape
1. **CTE ranked** : Assigne un ROW_NUMBER() partitionne par la cle naturelle (\`customer_id\`) et ordonne par \`synced_at DESC\`. La ligne 1 est toujours la synchronisation la plus recente pour chaque client.
2. **CTE deduped** : Filtre pour ne conserver que \`rn = 1\` — une ligne par client, toujours les donnees les plus recentes.
3. **SELECT final avec ROW_NUMBER()** : Genere une cle de substitution entiere monotone (\`customer_sk\`) en ordonnant le resultat deduplique par \`customer_id\`. La cle de substitution est assignee par la base de donnees et decouplée de la cle naturelle.

### Pourquoi des cles de substitution ?
- Les cles naturelles (comme \`customer_id\`) peuvent changer ou etre reutilisees dans les systemes sources.
- Les cles de substitution sont des entiers stables, generes par le systeme, qui joignent efficacement avec les tables de faits.
- Elles permettent aussi le SCD Type 2 (plusieurs versions par client) quand necessaire.

### Quand l'utiliser
- Chargement initial d'une table de dimension depuis des donnees CRM, ERP ou API brutes
- Rafraichissement nocturne ou la dimension entiere est reconstruite (strategie full refresh)
- Tout scenario ou les donnees sources contiennent des doublons dus aux synchronisations`,
  testCases: [
    {
      name: "default",
      description: "Returns 10 unique customers with surrogate keys, keeping latest synced record for duplicates",
      descriptionFr: "Retourne 10 clients uniques avec des cles de substitution, en conservant l'enregistrement synchronise le plus recemment pour les doublons",
      expectedColumns: ["customer_sk", "customer_id", "first_name", "last_name", "email", "city", "country", "segment"],
      expectedRows: [
        { customer_sk: 1, customer_id: 101, first_name: "Alice",   last_name: "Martin",  email: "alice@acme.com",    city: "Lyon",      country: "France",    segment: "Enterprise" },
        { customer_sk: 2, customer_id: 102, first_name: "Bob",     last_name: "Johnson", email: "bob@beta.com",      city: "London",    country: "UK",        segment: "SMB" },
        { customer_sk: 3, customer_id: 103, first_name: "Charlie", last_name: "Lee",     email: "charlie@gamma.com", city: "Frankfurt", country: "Germany",   segment: "Enterprise" },
        { customer_sk: 4, customer_id: 104, first_name: "Diana",   last_name: "Park",    email: "diana@delta.com",   city: "Seoul",     country: "Korea",     segment: "SMB" },
        { customer_sk: 5, customer_id: 105, first_name: "Eve",     last_name: "Garcia",  email: "eve@epsilon.com",   city: "Barcelona", country: "Spain",     segment: "SMB" },
        { customer_sk: 6, customer_id: 106, first_name: "Frank",   last_name: "Chen",    email: "frank@zeta.com",    city: "Shanghai",  country: "China",     segment: "Enterprise" },
        { customer_sk: 7, customer_id: 107, first_name: "Grace",   last_name: "Kim",     email: null,                city: "Tokyo",     country: "Japan",     segment: "Startup" },
        { customer_sk: 8, customer_id: 108, first_name: "Hank",    last_name: "Wilson",  email: "hank@eta.com",      city: "Chicago",   country: "USA",       segment: "Enterprise" },
        { customer_sk: 9, customer_id: 109, first_name: "Iris",    last_name: "Brown",   email: "iris@theta.com",    city: "Toronto",   country: "Canada",    segment: "SMB" },
        { customer_sk: 10, customer_id: 110, first_name: "Jake",   last_name: "Smith",   email: "jake@iota.com",     city: "Sydney",    country: "Australia", segment: "Startup" },
      ],
      orderMatters: true,
    },
    {
      name: "single-customer-multiple-syncs",
      description: "When only one customer exists with 3 syncs, returns exactly 1 row with the latest data",
      descriptionFr: "Quand un seul client existe avec 3 synchronisations, retourne exactement 1 ligne avec les donnees les plus recentes",
      setupSql: `DELETE FROM raw_customers WHERE customer_id != 103;`,
      expectedColumns: ["customer_sk", "customer_id", "first_name", "last_name", "email", "city", "country", "segment"],
      expectedRows: [
        { customer_sk: 1, customer_id: 103, first_name: "Charlie", last_name: "Lee", email: "charlie@gamma.com", city: "Frankfurt", country: "Germany", segment: "Enterprise" },
      ],
      orderMatters: true,
    },
  ],
};
