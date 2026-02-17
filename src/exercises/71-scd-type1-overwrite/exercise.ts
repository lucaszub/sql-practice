import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "71-scd-type1-overwrite",
  title: "SCD Type 1 — Overwrite Customer Addresses",
  titleFr: "SCD Type 1 — Écrasement des adresses clients",
  difficulty: "medium",
  category: "scd",
  description: `## SCD Type 1 — Overwrite Customer Addresses

The data platform team receives a nightly file of address corrections from the CRM system. These changes must be applied to the customer dimension using **SCD Type 1**: simply overwrite the old value with the new one — no history is kept.

Given the \`dim_customer\` table and the \`staging_updates\` table containing the latest address corrections, write a query that shows what the dimension table would look like **after** applying all the updates.

For customers not in the staging table, keep their existing data unchanged.

### Schema

| Table | Column | Type |
|-------|--------|------|
| dim_customer | customer_id | INTEGER |
| dim_customer | customer_name | VARCHAR |
| dim_customer | city | VARCHAR |
| dim_customer | country | VARCHAR |
| staging_updates | customer_id | INTEGER |
| staging_updates | new_city | VARCHAR |
| staging_updates | new_country | VARCHAR |

### Task

Return all customers from \`dim_customer\`, replacing \`city\` and \`country\` with values from \`staging_updates\` where a match exists.

### Expected output columns
\`customer_id\`, \`customer_name\`, \`city\`, \`country\`

Order by \`customer_id\` ASC.`,
  descriptionFr: `## SCD Type 1 — Écrasement des adresses clients

L'équipe data platform reçoit chaque nuit un fichier de corrections d'adresses depuis le CRM. Ces changements doivent être appliqués à la dimension client en **SCD Type 1** : on écrase simplement l'ancienne valeur par la nouvelle — aucun historique n'est conservé.

Étant donné la table \`dim_customer\` et la table \`staging_updates\` contenant les dernières corrections d'adresses, écris une requête qui montre à quoi ressemblerait la table de dimension **après** application de toutes les mises à jour.

Pour les clients absents de la table staging, conserve leurs données existantes.

### Schéma

| Table | Colonne | Type |
|-------|---------|------|
| dim_customer | customer_id | INTEGER |
| dim_customer | customer_name | VARCHAR |
| dim_customer | city | VARCHAR |
| dim_customer | country | VARCHAR |
| staging_updates | customer_id | INTEGER |
| staging_updates | new_city | VARCHAR |
| staging_updates | new_country | VARCHAR |

### Tâche

Retourne tous les clients de \`dim_customer\`, en remplaçant \`city\` et \`country\` par les valeurs de \`staging_updates\` lorsqu'une correspondance existe.

### Colonnes attendues en sortie
\`customer_id\`, \`customer_name\`, \`city\`, \`country\`

Trier par \`customer_id\` ASC.`,
  hint: "Use a LEFT JOIN between dim_customer and staging_updates, then COALESCE(su.new_city, dc.city) to keep the updated value when available, or fall back to the original.",
  hintFr: "Utilise un LEFT JOIN entre dim_customer et staging_updates, puis COALESCE(su.new_city, dc.city) pour garder la valeur mise à jour si elle existe, ou revenir à l'originale.",
  schema: `CREATE TABLE dim_customer (
  customer_id INTEGER,
  customer_name VARCHAR,
  city VARCHAR,
  country VARCHAR
);

INSERT INTO dim_customer VALUES
  (1, 'Alice Martin', 'Paris', 'France'),
  (2, 'Bob Dupont', 'Lyon', 'France'),
  (3, 'Carol Smith', 'London', 'UK'),
  (4, 'David Jones', 'Manchester', 'UK'),
  (5, 'Eva Müller', 'Berlin', 'Germany'),
  (6, 'Frank Weber', 'Munich', 'Germany'),
  (7, 'Grace Lee', 'Seoul', 'South Korea'),
  (8, 'Hiro Tanaka', 'Tokyo', 'Japan'),
  (9, 'Ines Costa', 'Lisbon', 'Portugal'),
  (10, 'João Silva', 'Porto', 'Portugal');

CREATE TABLE staging_updates (
  customer_id INTEGER,
  new_city VARCHAR,
  new_country VARCHAR
);

INSERT INTO staging_updates VALUES
  (2, 'Marseille', 'France'),
  (5, 'Hamburg', 'Germany'),
  (9, 'Faro', 'Portugal');`,
  solutionQuery: `SELECT
  dc.customer_id,
  dc.customer_name,
  COALESCE(su.new_city, dc.city) AS city,
  COALESCE(su.new_country, dc.country) AS country
FROM dim_customer dc
LEFT JOIN staging_updates su ON dc.customer_id = su.customer_id
ORDER BY dc.customer_id;`,
  solutionExplanation: `## Explanation

### Pattern: SCD Type 1 (Overwrite)

SCD Type 1 is the simplest dimension update strategy: when an attribute changes, you simply overwrite the old value. No historical versions are kept.

### Step-by-step

1. **LEFT JOIN**: Join \`dim_customer\` with \`staging_updates\` on \`customer_id\`. Customers without an update get NULL from the staging side.
2. **COALESCE**: \`COALESCE(su.new_city, dc.city)\` returns the new city if it exists, otherwise falls back to the existing city. Same logic for country.
3. **Result**: All 10 customers appear; 3 have their city/country replaced by the staging values.

### Why this approach

Using a SELECT with LEFT JOIN + COALESCE simulates the UPDATE logic without actually modifying the table. This is useful for previewing changes before committing them to the dimension.

In a real pipeline, this would be followed by an actual UPDATE statement or a MERGE.

### When to use

- Dimension attributes that do not need historical tracking (e.g., phone numbers, email addresses, corrected typos)
- When the business only cares about the current state`,
  solutionExplanationFr: `## Explication

### Pattern : SCD Type 1 (Écrasement)

Le SCD Type 1 est la stratégie de mise à jour de dimension la plus simple : lorsqu'un attribut change, on écrase simplement l'ancienne valeur. Aucune version historique n'est conservée.

### Étape par étape

1. **LEFT JOIN** : Jointure de \`dim_customer\` avec \`staging_updates\` sur \`customer_id\`. Les clients sans mise à jour obtiennent NULL du côté staging.
2. **COALESCE** : \`COALESCE(su.new_city, dc.city)\` retourne la nouvelle ville si elle existe, sinon revient à la ville existante. Même logique pour le pays.
3. **Résultat** : Les 10 clients apparaissent ; 3 ont leur ville/pays remplacés par les valeurs du staging.

### Pourquoi cette approche

Utiliser un SELECT avec LEFT JOIN + COALESCE simule la logique UPDATE sans modifier réellement la table. C'est utile pour prévisualiser les changements avant de les appliquer à la dimension.

Dans un vrai pipeline, cela serait suivi d'un vrai UPDATE ou d'un MERGE.

### Quand l'utiliser

- Attributs de dimension ne nécessitant pas de suivi historique (ex : numéros de téléphone, adresses email, corrections de fautes de frappe)
- Quand le métier ne s'intéresse qu'à l'état actuel`,
  testCases: [
    {
      name: "default",
      description: "3 customers have address updates applied via SCD Type 1",
      descriptionFr: "3 clients ont leurs adresses mises à jour via SCD Type 1",
      expectedColumns: ["customer_id", "customer_name", "city", "country"],
      expectedRows: [
        { customer_id: 1, customer_name: "Alice Martin", city: "Paris", country: "France" },
        { customer_id: 2, customer_name: "Bob Dupont", city: "Marseille", country: "France" },
        { customer_id: 3, customer_name: "Carol Smith", city: "London", country: "UK" },
        { customer_id: 4, customer_name: "David Jones", city: "Manchester", country: "UK" },
        { customer_id: 5, customer_name: "Eva Müller", city: "Hamburg", country: "Germany" },
        { customer_id: 6, customer_name: "Frank Weber", city: "Munich", country: "Germany" },
        { customer_id: 7, customer_name: "Grace Lee", city: "Seoul", country: "South Korea" },
        { customer_id: 8, customer_name: "Hiro Tanaka", city: "Tokyo", country: "Japan" },
        { customer_id: 9, customer_name: "Ines Costa", city: "Faro", country: "Portugal" },
        { customer_id: 10, customer_name: "João Silva", city: "Porto", country: "Portugal" },
      ],
      orderMatters: true,
    },
    {
      name: "no-updates",
      description: "When staging is empty, all original data is preserved",
      descriptionFr: "Quand le staging est vide, toutes les données originales sont conservées",
      setupSql: `DELETE FROM staging_updates;`,
      expectedColumns: ["customer_id", "customer_name", "city", "country"],
      expectedRows: [
        { customer_id: 1, customer_name: "Alice Martin", city: "Paris", country: "France" },
        { customer_id: 2, customer_name: "Bob Dupont", city: "Lyon", country: "France" },
        { customer_id: 3, customer_name: "Carol Smith", city: "London", country: "UK" },
        { customer_id: 4, customer_name: "David Jones", city: "Manchester", country: "UK" },
        { customer_id: 5, customer_name: "Eva Müller", city: "Berlin", country: "Germany" },
        { customer_id: 6, customer_name: "Frank Weber", city: "Munich", country: "Germany" },
        { customer_id: 7, customer_name: "Grace Lee", city: "Seoul", country: "South Korea" },
        { customer_id: 8, customer_name: "Hiro Tanaka", city: "Tokyo", country: "Japan" },
        { customer_id: 9, customer_name: "Ines Costa", city: "Lisbon", country: "Portugal" },
        { customer_id: 10, customer_name: "João Silva", city: "Porto", country: "Portugal" },
      ],
      orderMatters: false,
    },
  ],
};
