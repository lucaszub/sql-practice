import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "106-deduplication-latest-record",
  title: "Deduplicate Customer Addresses",
  titleFr: "Dédupliquer les adresses clients",
  difficulty: "medium",
  category: "window-functions",
  description: `## Deduplicate Customer Addresses

The data platform team discovered that the \`customer_addresses\` staging table contains **duplicate records** — some customers have multiple address entries due to repeated data imports. Write a query to keep only the **most recent address** per customer (the one with the latest \`updated_at\` timestamp).

### Schema

| Column | Type |
|--------|------|
| record_id | INTEGER |
| customer_id | INTEGER |
| customer_name | VARCHAR |
| city | VARCHAR |
| country | VARCHAR |
| updated_at | TIMESTAMP |

### Expected output columns
\`customer_id\`, \`customer_name\`, \`city\`, \`country\`, \`updated_at\`

Order by customer_id ASC.`,
  descriptionFr: `## Dédupliquer les adresses clients

L'équipe data platform a découvert que la table de staging \`customer_addresses\` contient des **enregistrements en double** — certains clients ont plusieurs entrées d'adresse suite à des imports de données répétés. Écrivez une requête pour ne garder que **l'adresse la plus récente** par client (celle avec le \`updated_at\` le plus récent).

### Schema

| Column | Type |
|--------|------|
| record_id | INTEGER |
| customer_id | INTEGER |
| customer_name | VARCHAR |
| city | VARCHAR |
| country | VARCHAR |
| updated_at | TIMESTAMP |

### Colonnes attendues en sortie
\`customer_id\`, \`customer_name\`, \`city\`, \`country\`, \`updated_at\`

Triez par customer_id ASC.`,
  hint: "Use ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY updated_at DESC) to number records per customer, then filter for row_number = 1 in an outer query or with QUALIFY.",
  hintFr: "Utilisez ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY updated_at DESC) pour numéroter les enregistrements par client, puis filtrez pour row_number = 1 dans une requête externe ou avec QUALIFY.",
  schema: `CREATE TABLE customer_addresses (
  record_id INTEGER,
  customer_id INTEGER,
  customer_name VARCHAR,
  city VARCHAR,
  country VARCHAR,
  updated_at TIMESTAMP
);

INSERT INTO customer_addresses VALUES
  (1, 201, 'Alice Martin', 'Paris', 'France', '2024-01-15 10:00:00'),
  (2, 201, 'Alice Martin', 'Lyon', 'France', '2024-03-20 14:30:00'),
  (3, 201, 'Alice Martin', 'Paris', 'France', '2024-06-01 09:15:00'),
  (4, 202, 'Bob Johnson', 'New York', 'USA', '2024-02-10 11:00:00'),
  (5, 202, 'Bob Johnson', 'Chicago', 'USA', '2024-05-15 16:45:00'),
  (6, 203, 'Clara Dubois', 'Berlin', 'Germany', '2024-01-05 08:30:00'),
  (7, 204, 'David Lee', 'Tokyo', 'Japan', '2024-04-10 12:00:00'),
  (8, 204, 'David Lee', 'Osaka', 'Japan', '2024-04-10 15:00:00'),
  (9, 204, 'David Lee', 'Tokyo', 'Japan', '2024-07-22 10:30:00'),
  (10, 205, 'Eva Santos', 'São Paulo', 'Brazil', '2024-03-01 09:00:00'),
  (11, 205, 'Eva Santos', 'Rio de Janeiro', 'Brazil', '2024-03-01 09:30:00');`,
  solutionQuery: `WITH ranked AS (
  SELECT
    customer_id,
    customer_name,
    city,
    country,
    updated_at,
    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY updated_at DESC) AS rn
  FROM customer_addresses
)
SELECT customer_id, customer_name, city, country, updated_at
FROM ranked
WHERE rn = 1
ORDER BY customer_id;`,
  solutionExplanation: `## Explanation

### Pattern: Deduplication with ROW_NUMBER()

This is the **deduplication** pattern — one of the most common real-world uses of window functions.

### Step-by-step
1. \`PARTITION BY customer_id\` — groups records by customer
2. \`ORDER BY updated_at DESC\` — most recent record gets row number 1
3. \`ROW_NUMBER()\` — assigns a unique number within each partition
4. Filter \`WHERE rn = 1\` — keeps only the latest record per customer

### Why ROW_NUMBER() and not RANK()?
- ROW_NUMBER() guarantees exactly one row per customer (even with identical timestamps)
- RANK() could return multiple rows if timestamps are tied
- For deduplication, we always want exactly one record per entity

### DuckDB alternative: QUALIFY
\`\`\`sql
SELECT customer_id, customer_name, city, country, updated_at
FROM customer_addresses
QUALIFY ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY updated_at DESC) = 1
ORDER BY customer_id;
\`\`\`
The QUALIFY clause eliminates the need for a CTE, making the query more concise.

### When to use
- Staging table cleanup (keep latest record per entity)
- Removing accidental duplicates from imports
- "Most recent status" queries (latest order, latest login, latest address)`,
  solutionExplanationFr: `## Explication

### Pattern : Déduplication avec ROW_NUMBER()

C'est le pattern de **déduplication** — l'un des usages les plus courants des fonctions de fenêtre en pratique.

### Étape par étape
1. \`PARTITION BY customer_id\` — regroupe les enregistrements par client
2. \`ORDER BY updated_at DESC\` — l'enregistrement le plus récent obtient le numéro 1
3. \`ROW_NUMBER()\` — attribue un numéro unique au sein de chaque partition
4. Filtre \`WHERE rn = 1\` — ne garde que le dernier enregistrement par client

### Pourquoi ROW_NUMBER() et pas RANK() ?
- ROW_NUMBER() garantit exactement une ligne par client (même avec des timestamps identiques)
- RANK() pourrait retourner plusieurs lignes si les timestamps sont à égalité

### Alternative DuckDB : QUALIFY
\`\`\`sql
SELECT customer_id, customer_name, city, country, updated_at
FROM customer_addresses
QUALIFY ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY updated_at DESC) = 1
ORDER BY customer_id;
\`\`\`

### Quand l'utiliser
- Nettoyage de tables de staging (garder le dernier enregistrement par entité)
- Supprimer les doublons accidentels d'imports
- Requêtes "statut le plus récent"`,
  testCases: [
    {
      name: "default",
      description: "Keep only the latest address per customer",
      descriptionFr: "Garder uniquement la dernière adresse par client",
      expectedColumns: ["customer_id", "customer_name", "city", "country", "updated_at"],
      expectedRows: [
        { customer_id: 201, customer_name: "Alice Martin", city: "Paris", country: "France", updated_at: "2024-06-01 09:15:00" },
        { customer_id: 202, customer_name: "Bob Johnson", city: "Chicago", country: "USA", updated_at: "2024-05-15 16:45:00" },
        { customer_id: 203, customer_name: "Clara Dubois", city: "Berlin", country: "Germany", updated_at: "2024-01-05 08:30:00" },
        { customer_id: 204, customer_name: "David Lee", city: "Tokyo", country: "Japan", updated_at: "2024-07-22 10:30:00" },
        { customer_id: 205, customer_name: "Eva Santos", city: "Rio de Janeiro", country: "Brazil", updated_at: "2024-03-01 09:30:00" },
      ],
      orderMatters: true,
    },
    {
      name: "no-duplicates",
      description: "Customers with a single record are kept as-is",
      descriptionFr: "Les clients avec un seul enregistrement sont conservés tels quels",
      setupSql: `DELETE FROM customer_addresses WHERE customer_id != 203;`,
      expectedColumns: ["customer_id", "customer_name", "city", "country", "updated_at"],
      expectedRows: [
        { customer_id: 203, customer_name: "Clara Dubois", city: "Berlin", country: "Germany", updated_at: "2024-01-05 08:30:00" },
      ],
      orderMatters: true,
    },
  ],
};
