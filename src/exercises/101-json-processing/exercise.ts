import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "101-json-processing",
  title: "Flatten and Classify Event Payloads",
  titleFr: "Aplatir et classifier les payloads d'événements",
  difficulty: "hard",
  category: "nested-data",
  description: `## Flatten and Classify Event Payloads

The data engineering team receives a raw \`event_log\` table from the ingestion pipeline. Each row contains a \`payload\` JSON string that differs in structure depending on the \`event_type\`. The team needs a flat analytical table that consolidates all relevant fields and classifies each event into a business category.

### Schema

**event_log**

| Column | Type | Notes |
|--------|------|-------|
| log_id | INTEGER | Primary key |
| event_type | VARCHAR | \`signup\`, \`subscription\`, \`purchase\`, or \`refund\` |
| user_id | INTEGER | User performing the action |
| logged_at | TIMESTAMP | Ingestion timestamp |
| payload | VARCHAR | JSON string — structure varies by event_type |

**Payload structures by event_type:**

- \`signup\`: \`{"plan": "free|pro|enterprise", "country": "..."}\`
- \`subscription\`: \`{"plan": "pro|enterprise", "mrr": 99.0, "trial": true|false}\`
- \`purchase\`: \`{"item_name": "...", "amount": 49.99, "currency": "USD|EUR"}\`
- \`refund\`: \`{"item_name": "...", "amount": 19.99, "reason": "..."}\`

### Task

Build a flat analytical view. For each event, extract the relevant fields and compute:

- \`event_category\`: use a CASE on \`event_type\` → \`'acquisition'\` for signup, \`'revenue'\` for subscription and purchase, \`'loss'\` for refund.
- \`plan\`: from signup and subscription payloads (NULL for others).
- \`amount\`: from purchase and refund payloads (NULL for others). Cast to DOUBLE.
- \`item_name\`: from purchase and refund payloads (NULL for others).
- \`country\`: from signup payloads only (NULL for others).

Return: \`log_id\`, \`event_type\`, \`event_category\`, \`user_id\`, \`plan\`, \`amount\`, \`item_name\`, \`country\`.

Order by \`log_id\` ASC.

### Expected output columns

\`log_id\`, \`event_type\`, \`event_category\`, \`user_id\`, \`plan\`, \`amount\`, \`item_name\`, \`country\``,

  descriptionFr: `## Aplatir et classifier les payloads d'événements

L'équipe data engineering reçoit une table brute \`event_log\` depuis le pipeline d'ingestion. Chaque ligne contient une chaîne JSON \`payload\` dont la structure varie selon le \`event_type\`. L'équipe a besoin d'une table analytique plate qui consolide tous les champs pertinents et classifie chaque événement dans une catégorie métier.

### Schéma

**event_log**

| Colonne | Type | Notes |
|---------|------|-------|
| log_id | INTEGER | Clé primaire |
| event_type | VARCHAR | \`signup\`, \`subscription\`, \`purchase\`, ou \`refund\` |
| user_id | INTEGER | Utilisateur effectuant l'action |
| logged_at | TIMESTAMP | Timestamp d'ingestion |
| payload | VARCHAR | Chaîne JSON — structure variable selon l'event_type |

**Structures du payload par event_type :**

- \`signup\` : \`{"plan": "free|pro|enterprise", "country": "..."}\`
- \`subscription\` : \`{"plan": "pro|enterprise", "mrr": 99.0, "trial": true|false}\`
- \`purchase\` : \`{"item_name": "...", "amount": 49.99, "currency": "USD|EUR"}\`
- \`refund\` : \`{"item_name": "...", "amount": 19.99, "reason": "..."}\`

### Tâche

Construire une vue analytique plate. Pour chaque événement, extraire les champs pertinents et calculer :

- \`event_category\` : CASE sur \`event_type\` → \`'acquisition'\` pour signup, \`'revenue'\` pour subscription et purchase, \`'loss'\` pour refund.
- \`plan\` : depuis les payloads signup et subscription (NULL pour les autres).
- \`amount\` : depuis les payloads purchase et refund (NULL pour les autres). Caster en DOUBLE.
- \`item_name\` : depuis les payloads purchase et refund (NULL pour les autres).
- \`country\` : depuis les payloads signup uniquement (NULL pour les autres).

Retourner : \`log_id\`, \`event_type\`, \`event_category\`, \`user_id\`, \`plan\`, \`amount\`, \`item_name\`, \`country\`.

Trier par \`log_id\` ASC.

### Colonnes attendues

\`log_id\`, \`event_type\`, \`event_category\`, \`user_id\`, \`plan\`, \`amount\`, \`item_name\`, \`country\``,

  hint: "Use CASE WHEN event_type = 'signup' THEN json_extract_string(payload, '$.plan') END for fields that only appear in certain event types. The CASE expression naturally returns NULL for non-matching branches.",
  hintFr: "Utilisez CASE WHEN event_type = 'signup' THEN json_extract_string(payload, '$.plan') END pour les champs qui n'apparaissent que dans certains types d'événements. L'expression CASE retourne naturellement NULL pour les branches non correspondantes.",

  schema: `CREATE TABLE event_log (
  log_id INTEGER,
  event_type VARCHAR,
  user_id INTEGER,
  logged_at TIMESTAMP,
  payload VARCHAR
);

INSERT INTO event_log VALUES
  (1,  'signup',       201, '2024-04-01 08:00:00', '{"plan": "free", "country": "FR"}'),
  (2,  'signup',       202, '2024-04-01 08:05:00', '{"plan": "pro", "country": "US"}'),
  (3,  'subscription', 202, '2024-04-01 08:06:00', '{"plan": "pro", "mrr": 49.0, "trial": false}'),
  (4,  'purchase',     201, '2024-04-01 09:00:00', '{"item_name": "Ebook Bundle", "amount": 29.99, "currency": "EUR"}'),
  (5,  'signup',       203, '2024-04-01 09:30:00', '{"plan": "enterprise", "country": "DE"}'),
  (6,  'subscription', 203, '2024-04-01 09:31:00', '{"plan": "enterprise", "mrr": 299.0, "trial": true}'),
  (7,  'purchase',     204, '2024-04-01 10:00:00', '{"item_name": "Video Course", "amount": 99.00, "currency": "USD"}'),
  (8,  'refund',       204, '2024-04-01 10:45:00', '{"item_name": "Video Course", "amount": 99.00, "reason": "not-as-described"}'),
  (9,  'signup',       205, '2024-04-01 11:00:00', '{"plan": "free", "country": "BR"}'),
  (10, 'purchase',     202, '2024-04-01 11:15:00', '{"item_name": "Template Pack", "amount": 19.99, "currency": "USD"}'),
  (11, 'refund',       201, '2024-04-01 11:30:00', '{"item_name": "Ebook Bundle", "amount": 29.99, "reason": "duplicate"}'),
  (12, 'subscription', 205, '2024-04-02 09:00:00', '{"plan": "pro", "mrr": 49.0, "trial": true}'),
  (13, 'purchase',     203, '2024-04-02 10:00:00', '{"item_name": "Workshop Ticket", "amount": 149.00, "currency": "EUR"}'),
  (14, 'signup',       206, '2024-04-02 12:00:00', '{"plan": "pro", "country": "UK"}'),
  (15, 'subscription', 206, '2024-04-02 12:05:00', '{"plan": "pro", "mrr": 49.0, "trial": false}');`,

  solutionQuery: `SELECT
  log_id,
  event_type,
  CASE event_type
    WHEN 'signup'        THEN 'acquisition'
    WHEN 'subscription'  THEN 'revenue'
    WHEN 'purchase'      THEN 'revenue'
    WHEN 'refund'        THEN 'loss'
  END                                                                           AS event_category,
  user_id,
  CASE WHEN event_type IN ('signup', 'subscription')
    THEN json_extract_string(payload, '$.plan')
  END                                                                           AS plan,
  CASE WHEN event_type IN ('purchase', 'refund')
    THEN CAST(json_extract(payload, '$.amount') AS DOUBLE)
  END                                                                           AS amount,
  CASE WHEN event_type IN ('purchase', 'refund')
    THEN json_extract_string(payload, '$.item_name')
  END                                                                           AS item_name,
  CASE WHEN event_type = 'signup'
    THEN json_extract_string(payload, '$.country')
  END                                                                           AS country
FROM event_log
ORDER BY log_id;`,

  solutionExplanation: `## Explanation

### Pattern: Conditional JSON extraction with CASE + json_extract

This exercise combines the **CASE-based conditional aggregation** pattern with **JSON extraction** to flatten a polymorphic event log into a typed analytical table.

### Step-by-step

1. **event_category via CASE** — a simple \`CASE event_type WHEN ... END\` maps each event type to a business category. Clean, readable, no subquery needed.
2. **Conditional json_extract_string** — wrapped in \`CASE WHEN event_type IN (...)\` so the extraction only runs when the field actually exists in the payload. Other rows get \`NULL\` automatically.
3. **CAST(json_extract(...) AS DOUBLE)** — for numeric fields (\`amount\`), \`json_extract\` returns the raw JSON value (e.g., \`29.99\` without quotes), which must be cast to a SQL numeric type.
4. **json_extract_string** — for string fields (\`plan\`, \`item_name\`, \`country\`), this function strips the surrounding JSON quotes and returns a clean \`VARCHAR\`.

### Why this approach

- Handling polymorphic JSON in a single \`SELECT\` is more efficient than multiple CTEs filtering by event type.
- \`CASE WHEN event_type = '...' THEN json_extract...\` is self-documenting: it makes the schema of each event type explicit in the query.
- The pattern scales: adding a new event type only requires new \`CASE\` branches.

### When to use

Any time you ingest polymorphic event streams (analytics pipelines, audit logs, CDC streams) where payload structure differs by event type. This is the standard **event log flattening** pattern used in data warehouse ingestion layers.

### DuckDB note

- \`json_extract_string(col, '$.field')\` is equivalent to \`col->>'field'\` (arrow operator).
- \`json_extract(col, '$.field')\` is equivalent to \`col->'field'\`.
- Both syntaxes work in DuckDB; the function form is more portable.`,

  solutionExplanationFr: `## Explication

### Patron : Extraction JSON conditionnelle avec CASE + json_extract

Cet exercice combine le patron d'**agrégation conditionnelle CASE** avec l'**extraction JSON** pour aplatir un log d'événements polymorphe en une table analytique typée.

### Étape par étape

1. **event_category via CASE** — un \`CASE event_type WHEN ... END\` mappe chaque type d'événement vers une catégorie métier.
2. **json_extract_string conditionnel** — enveloppé dans \`CASE WHEN event_type IN (...)\` pour que l'extraction ne s'exécute que quand le champ existe réellement dans le payload. Les autres lignes obtiennent \`NULL\` automatiquement.
3. **CAST(json_extract(...) AS DOUBLE)** — pour les champs numériques (\`amount\`), \`json_extract\` retourne la valeur JSON brute qui doit être castée en type SQL numérique.
4. **json_extract_string** — pour les champs string (\`plan\`, \`item_name\`, \`country\`), cette fonction supprime les guillemets JSON et retourne un \`VARCHAR\` propre.

### Pourquoi cette approche

- Gérer du JSON polymorphe dans un seul \`SELECT\` est plus efficace que plusieurs CTEs filtrant par type d'événement.
- Le patron \`CASE WHEN event_type = '...' THEN json_extract...\` est auto-documenté.
- Le patron passe à l'échelle : ajouter un nouveau type d'événement ne nécessite que de nouvelles branches CASE.

### Quand l'utiliser

Dès que vous ingérez des flux d'événements polymorphes (pipelines analytics, audit logs, streams CDC) où la structure du payload varie selon le type d'événement.`,

  testCases: [
    {
      name: "default",
      description: "15 events flattened with correct categories, plans, amounts, item names, and countries",
      descriptionFr: "15 événements aplatis avec les catégories, plans, montants, noms d'articles et pays corrects",
      expectedColumns: ["log_id", "event_type", "event_category", "user_id", "plan", "amount", "item_name", "country"],
      expectedRows: [
        { log_id: 1,  event_type: "signup",       event_category: "acquisition", user_id: 201, plan: "free",       amount: null,   item_name: null,             country: "FR" },
        { log_id: 2,  event_type: "signup",       event_category: "acquisition", user_id: 202, plan: "pro",        amount: null,   item_name: null,             country: "US" },
        { log_id: 3,  event_type: "subscription", event_category: "revenue",     user_id: 202, plan: "pro",        amount: null,   item_name: null,             country: null },
        { log_id: 4,  event_type: "purchase",     event_category: "revenue",     user_id: 201, plan: null,         amount: 29.99,  item_name: "Ebook Bundle",   country: null },
        { log_id: 5,  event_type: "signup",       event_category: "acquisition", user_id: 203, plan: "enterprise", amount: null,   item_name: null,             country: "DE" },
        { log_id: 6,  event_type: "subscription", event_category: "revenue",     user_id: 203, plan: "enterprise", amount: null,   item_name: null,             country: null },
        { log_id: 7,  event_type: "purchase",     event_category: "revenue",     user_id: 204, plan: null,         amount: 99.00,  item_name: "Video Course",   country: null },
        { log_id: 8,  event_type: "refund",       event_category: "loss",        user_id: 204, plan: null,         amount: 99.00,  item_name: "Video Course",   country: null },
        { log_id: 9,  event_type: "signup",       event_category: "acquisition", user_id: 205, plan: "free",       amount: null,   item_name: null,             country: "BR" },
        { log_id: 10, event_type: "purchase",     event_category: "revenue",     user_id: 202, plan: null,         amount: 19.99,  item_name: "Template Pack",  country: null },
        { log_id: 11, event_type: "refund",       event_category: "loss",        user_id: 201, plan: null,         amount: 29.99,  item_name: "Ebook Bundle",   country: null },
        { log_id: 12, event_type: "subscription", event_category: "revenue",     user_id: 205, plan: "pro",        amount: null,   item_name: null,             country: null },
        { log_id: 13, event_type: "purchase",     event_category: "revenue",     user_id: 203, plan: null,         amount: 149.00, item_name: "Workshop Ticket",country: null },
        { log_id: 14, event_type: "signup",       event_category: "acquisition", user_id: 206, plan: "pro",        amount: null,   item_name: null,             country: "UK" },
        { log_id: 15, event_type: "subscription", event_category: "revenue",     user_id: 206, plan: "pro",        amount: null,   item_name: null,             country: null },
      ],
      orderMatters: true,
    },
    {
      name: "new-refund-event",
      description: "A new refund event is correctly classified as loss with amount and item_name extracted",
      descriptionFr: "Un nouvel événement remboursement est correctement classifié comme loss avec amount et item_name extraits",
      setupSql: `INSERT INTO event_log VALUES (16, 'refund', 205, '2024-04-03 09:00:00', '{"item_name": "Template Pack", "amount": 19.99, "reason": "wrong-item"}');`,
      expectedColumns: ["log_id", "event_type", "event_category", "user_id", "plan", "amount", "item_name", "country"],
      expectedRows: [
        { log_id: 1,  event_type: "signup",       event_category: "acquisition", user_id: 201, plan: "free",       amount: null,   item_name: null,             country: "FR" },
        { log_id: 2,  event_type: "signup",       event_category: "acquisition", user_id: 202, plan: "pro",        amount: null,   item_name: null,             country: "US" },
        { log_id: 3,  event_type: "subscription", event_category: "revenue",     user_id: 202, plan: "pro",        amount: null,   item_name: null,             country: null },
        { log_id: 4,  event_type: "purchase",     event_category: "revenue",     user_id: 201, plan: null,         amount: 29.99,  item_name: "Ebook Bundle",   country: null },
        { log_id: 5,  event_type: "signup",       event_category: "acquisition", user_id: 203, plan: "enterprise", amount: null,   item_name: null,             country: "DE" },
        { log_id: 6,  event_type: "subscription", event_category: "revenue",     user_id: 203, plan: "enterprise", amount: null,   item_name: null,             country: null },
        { log_id: 7,  event_type: "purchase",     event_category: "revenue",     user_id: 204, plan: null,         amount: 99.00,  item_name: "Video Course",   country: null },
        { log_id: 8,  event_type: "refund",       event_category: "loss",        user_id: 204, plan: null,         amount: 99.00,  item_name: "Video Course",   country: null },
        { log_id: 9,  event_type: "signup",       event_category: "acquisition", user_id: 205, plan: "free",       amount: null,   item_name: null,             country: "BR" },
        { log_id: 10, event_type: "purchase",     event_category: "revenue",     user_id: 202, plan: null,         amount: 19.99,  item_name: "Template Pack",  country: null },
        { log_id: 11, event_type: "refund",       event_category: "loss",        user_id: 201, plan: null,         amount: 29.99,  item_name: "Ebook Bundle",   country: null },
        { log_id: 12, event_type: "subscription", event_category: "revenue",     user_id: 205, plan: "pro",        amount: null,   item_name: null,             country: null },
        { log_id: 13, event_type: "purchase",     event_category: "revenue",     user_id: 203, plan: null,         amount: 149.00, item_name: "Workshop Ticket",country: null },
        { log_id: 14, event_type: "signup",       event_category: "acquisition", user_id: 206, plan: "pro",        amount: null,   item_name: null,             country: "UK" },
        { log_id: 15, event_type: "subscription", event_category: "revenue",     user_id: 206, plan: "pro",        amount: null,   item_name: null,             country: null },
        { log_id: 16, event_type: "refund",       event_category: "loss",        user_id: 205, plan: null,         amount: 19.99,  item_name: "Template Pack",  country: null },
      ],
      orderMatters: true,
    },
  ],
};
