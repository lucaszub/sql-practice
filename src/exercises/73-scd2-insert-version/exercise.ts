import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "73-scd2-insert-version",
  title: "SCD Type 2 — Apply a Change Event",
  titleFr: "SCD Type 2 — Appliquer un événement de changement",
  difficulty: "hard",
  category: "scd",
  description: `## SCD Type 2 — Apply a Change Event

The data engineering team processes nightly change events for the customer dimension. A customer has moved to a new city. To maintain full history, the pipeline must:

1. **Expire** the current record: set \`valid_to\` to the day before the change date, set \`is_current = false\`
2. **Insert** a new version with the updated city, \`valid_from\` = change date, \`valid_to = NULL\`, \`is_current = true\`

The \`change_events\` table contains one event for customer 3 (Carol Smith) moving from London to Bristol on 2024-09-01.

Write the two DML statements (UPDATE then INSERT), then SELECT all rows for customer 3 ordered by \`valid_from\`.

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
| change_events | customer_id | INTEGER |
| change_events | new_city | VARCHAR |
| change_events | change_date | DATE |

### Task

1. UPDATE \`dim_customer_scd2\`: expire the current record for the changed customer
2. INSERT the new version into \`dim_customer_scd2\`
3. SELECT all records for customer 3, ordered by \`valid_from\` ASC

### Expected output columns
\`surrogate_key\`, \`customer_id\`, \`customer_name\`, \`city\`, \`valid_from\`, \`valid_to\`, \`is_current\``,
  descriptionFr: `## SCD Type 2 — Appliquer un événement de changement

L'équipe data engineering traite chaque nuit les événements de changement pour la dimension client. Un client a déménagé dans une nouvelle ville. Pour maintenir l'historique complet, le pipeline doit :

1. **Expirer** l'enregistrement actuel : définir \`valid_to\` au jour avant la date de changement, définir \`is_current = false\`
2. **Insérer** une nouvelle version avec la ville mise à jour, \`valid_from\` = date de changement, \`valid_to = NULL\`, \`is_current = true\`

La table \`change_events\` contient un événement pour le client 3 (Carol Smith) qui déménage de Londres à Bristol le 2024-09-01.

Écris les deux instructions DML (UPDATE puis INSERT), puis SELECT toutes les lignes du client 3 triées par \`valid_from\`.

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
| change_events | customer_id | INTEGER |
| change_events | new_city | VARCHAR |
| change_events | change_date | DATE |

### Tâche

1. UPDATE \`dim_customer_scd2\` : expirer l'enregistrement actuel du client modifié
2. INSERT la nouvelle version dans \`dim_customer_scd2\`
3. SELECT tous les enregistrements du client 3, triés par \`valid_from\` ASC

### Colonnes attendues en sortie
\`surrogate_key\`, \`customer_id\`, \`customer_name\`, \`city\`, \`valid_from\`, \`valid_to\`, \`is_current\``,
  hint: "For the UPDATE: set valid_to = change_date - INTERVAL 1 DAY and is_current = false WHERE customer_id matches and is_current = true. For the INSERT: use the next available surrogate_key, pulling new_city and change_date from change_events.",
  hintFr: "Pour l'UPDATE : définir valid_to = change_date - INTERVAL 1 DAY et is_current = false WHERE customer_id correspond et is_current = true. Pour l'INSERT : utiliser le prochain surrogate_key disponible, en récupérant new_city et change_date depuis change_events.",
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
  (1, 1, 'Alice Martin', 'Paris',     'France', '2022-01-01', NULL, true),
  (2, 2, 'Bob Dupont',   'Lyon',      'France', '2021-03-10', NULL, true),
  (3, 3, 'Carol Smith',  'London',    'UK',     '2020-05-01', NULL, true),
  (4, 4, 'David Jones',  'Manchester','UK',     '2021-08-15', NULL, true),
  (5, 5, 'Eva Müller',   'Berlin',    'Germany','2022-07-01', NULL, true);

CREATE TABLE change_events (
  customer_id INTEGER,
  new_city VARCHAR,
  change_date DATE
);

INSERT INTO change_events VALUES
  (3, 'Bristol', '2024-09-01');`,
  solutionQuery: `UPDATE dim_customer_scd2
SET
  valid_to = DATE '2024-09-01' - INTERVAL 1 DAY,
  is_current = false
WHERE customer_id = (SELECT customer_id FROM change_events LIMIT 1)
  AND is_current = true;

INSERT INTO dim_customer_scd2
SELECT
  (SELECT MAX(surrogate_key) + 1 FROM dim_customer_scd2),
  ce.customer_id,
  d.customer_name,
  ce.new_city,
  d.country,
  ce.change_date,
  NULL,
  true
FROM change_events ce
JOIN dim_customer_scd2 d
  ON ce.customer_id = d.customer_id
 AND d.is_current = false
 AND d.valid_to = ce.change_date - INTERVAL 1 DAY;

SELECT
  surrogate_key,
  customer_id,
  customer_name,
  city,
  valid_from,
  valid_to,
  is_current
FROM dim_customer_scd2
WHERE customer_id = 3
ORDER BY valid_from;`,
  solutionExplanation: `## Explanation

### Pattern: SCD Type 2 — Version Insertion

Applying a change event in SCD Type 2 is a two-step atomic operation: expire the old record and insert the new one.

### Step-by-step

**Step 1 — Expire the current record**
\`\`\`sql
UPDATE dim_customer_scd2
SET valid_to = change_date - INTERVAL 1 DAY, is_current = false
WHERE customer_id = ... AND is_current = true;
\`\`\`
- \`valid_to\` is set to the day before the change takes effect
- \`is_current\` is flipped to false

**Step 2 — Insert the new version**
The new row reuses the customer's \`customer_name\` and \`country\` from the expired record, but takes \`city\` and \`valid_from\` from the change event. A new \`surrogate_key\` is generated as \`MAX(surrogate_key) + 1\`.

**Step 3 — Query the result**
Selecting all rows for customer 3 ordered by \`valid_from\` shows the complete history: one closed version (London) and one open version (Bristol).

### Why this approach

This pattern preserves the full audit trail. Analysts can always reconstruct what the customer's city was at any point in time by querying the version whose \`valid_from\` ≤ date ≤ \`valid_to\`.

### When to use

- When business or regulatory requirements mandate historical tracking of attribute changes
- Customer addresses, product prices, employee roles — any slowly changing attribute`,
  solutionExplanationFr: `## Explication

### Pattern : SCD Type 2 — Insertion de version

Appliquer un événement de changement en SCD Type 2 est une opération atomique en deux étapes : expirer l'ancien enregistrement et insérer le nouveau.

### Étape par étape

**Étape 1 — Expirer l'enregistrement actuel**
\`\`\`sql
UPDATE dim_customer_scd2
SET valid_to = change_date - INTERVAL 1 DAY, is_current = false
WHERE customer_id = ... AND is_current = true;
\`\`\`
- \`valid_to\` est défini au jour avant que le changement prenne effet
- \`is_current\` passe à false

**Étape 2 — Insérer la nouvelle version**
La nouvelle ligne réutilise \`customer_name\` et \`country\` du client depuis l'enregistrement expiré, mais prend \`city\` et \`valid_from\` depuis l'événement de changement. Un nouveau \`surrogate_key\` est généré comme \`MAX(surrogate_key) + 1\`.

**Étape 3 — Interroger le résultat**
Sélectionner toutes les lignes du client 3 triées par \`valid_from\` montre l'historique complet : une version fermée (London) et une version ouverte (Bristol).

### Pourquoi cette approche

Ce pattern préserve la piste d'audit complète. Les analystes peuvent toujours reconstruire quelle était la ville du client à n'importe quel moment en interrogeant la version dont \`valid_from\` ≤ date ≤ \`valid_to\`.

### Quand l'utiliser

- Quand les exigences métier ou réglementaires imposent un suivi historique des changements d'attributs
- Adresses clients, prix des produits, rôles des employés — tout attribut à évolution lente`,
  testCases: [
    {
      name: "default",
      description: "Customer 3 has two versions: London (closed) and Bristol (current)",
      descriptionFr: "Le client 3 a deux versions : London (fermée) et Bristol (actuelle)",
      expectedColumns: ["surrogate_key", "customer_id", "customer_name", "city", "valid_from", "valid_to", "is_current"],
      expectedRows: [
        { surrogate_key: 3, customer_id: 3, customer_name: "Carol Smith", city: "London",  valid_from: "2020-05-01", valid_to: "2024-08-31", is_current: false },
        { surrogate_key: 6, customer_id: 3, customer_name: "Carol Smith", city: "Bristol", valid_from: "2024-09-01", valid_to: null, is_current: true },
      ],
      orderMatters: true,
    },
    {
      name: "multiple-changes",
      description: "Customer with two prior versions gets a third version added",
      descriptionFr: "Un client avec deux versions antérieures obtient une troisième version ajoutée",
      setupSql: `DELETE FROM dim_customer_scd2;
DELETE FROM change_events;
INSERT INTO dim_customer_scd2 VALUES
  (1, 3, 'Carol Smith', 'London',    'UK', '2020-05-01', '2022-12-31', false),
  (2, 3, 'Carol Smith', 'Bristol',   'UK', '2023-01-01', NULL,         true);
INSERT INTO change_events VALUES
  (3, 'Oxford', '2024-11-01');`,
      expectedColumns: ["surrogate_key", "customer_id", "customer_name", "city", "valid_from", "valid_to", "is_current"],
      expectedRows: [
        { surrogate_key: 1, customer_id: 3, customer_name: "Carol Smith", city: "London",  valid_from: "2020-05-01", valid_to: "2022-12-31", is_current: false },
        { surrogate_key: 2, customer_id: 3, customer_name: "Carol Smith", city: "Bristol", valid_from: "2023-01-01", valid_to: "2024-10-31", is_current: false },
        { surrogate_key: 3, customer_id: 3, customer_name: "Carol Smith", city: "Oxford",  valid_from: "2024-11-01", valid_to: null, is_current: true },
      ],
      orderMatters: true,
    },
  ],
};
