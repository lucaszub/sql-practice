import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "100-struct-access",
  title: "Extract Fields from JSON Properties",
  titleFr: "Extraire des champs depuis des propriétés JSON",
  difficulty: "hard",
  category: "nested-data",
  description: `## Extract Fields from JSON Properties

The product analytics team collects user events. Each event has a \`properties\` column stored as a raw JSON string (coming from a webhook). Before the data can be used in reports, specific fields must be extracted from the JSON.

### Schema

**events**

| Column | Type | Notes |
|--------|------|-------|
| event_id | INTEGER | Primary key |
| event_type | VARCHAR | Type of event (e.g. \`page_view\`, \`click\`, \`purchase\`) |
| user_id | INTEGER | ID of the user |
| occurred_at | TIMESTAMP | When the event happened |
| properties | VARCHAR | JSON string with event-specific attributes |

### Task

Extract three fields from the \`properties\` JSON column:

- \`page\` → the page or screen name (string field)
- \`duration_seconds\` → time spent in seconds (integer field)
- \`revenue\` → revenue amount (float field, may be missing → return NULL)

Use DuckDB's \`json_extract_string()\` for string fields and \`json_extract()\` cast to the appropriate type for numeric fields.

Return: \`event_id\`, \`event_type\`, \`user_id\`, \`page\`, \`duration_seconds\`, \`revenue\`.

Order by \`event_id\` ASC.

### Expected output columns

\`event_id\`, \`event_type\`, \`user_id\`, \`page\`, \`duration_seconds\`, \`revenue\``,

  descriptionFr: `## Extraire des champs depuis des propriétés JSON

L'équipe d'analyse produit collecte des événements utilisateurs. Chaque événement a une colonne \`properties\` stockée comme chaîne JSON brute (provenant d'un webhook). Avant que les données puissent être utilisées dans des rapports, des champs spécifiques doivent être extraits du JSON.

### Schéma

**events**

| Colonne | Type | Notes |
|---------|------|-------|
| event_id | INTEGER | Clé primaire |
| event_type | VARCHAR | Type d'événement (ex. \`page_view\`, \`click\`, \`purchase\`) |
| user_id | INTEGER | ID de l'utilisateur |
| occurred_at | TIMESTAMP | Moment de l'événement |
| properties | VARCHAR | Chaîne JSON avec les attributs spécifiques à l'événement |

### Tâche

Extraire trois champs de la colonne JSON \`properties\` :

- \`page\` → nom de la page ou de l'écran (champ string)
- \`duration_seconds\` → temps passé en secondes (champ entier)
- \`revenue\` → montant du revenu (champ float, peut être absent → retourner NULL)

Utiliser \`json_extract_string()\` de DuckDB pour les champs string et \`json_extract()\` casté vers le type approprié pour les champs numériques.

Retourner : \`event_id\`, \`event_type\`, \`user_id\`, \`page\`, \`duration_seconds\`, \`revenue\`.

Trier par \`event_id\` ASC.

### Colonnes attendues

\`event_id\`, \`event_type\`, \`user_id\`, \`page\`, \`duration_seconds\`, \`revenue\``,

  hint: "Use json_extract_string(properties, '$.page') for strings. For integers use CAST(json_extract(properties, '$.duration_seconds') AS INTEGER). For optional fields that may be absent, the result is automatically NULL.",
  hintFr: "Utilisez json_extract_string(properties, '$.page') pour les chaînes. Pour les entiers, utilisez CAST(json_extract(properties, '$.duration_seconds') AS INTEGER). Pour les champs optionnels absents, le résultat est automatiquement NULL.",

  schema: `CREATE TABLE events (
  event_id INTEGER,
  event_type VARCHAR,
  user_id INTEGER,
  occurred_at TIMESTAMP,
  properties VARCHAR
);

INSERT INTO events VALUES
  (1,  'page_view', 101, '2024-03-01 08:00:00', '{"page": "/home", "duration_seconds": 45, "referrer": "google"}'),
  (2,  'page_view', 102, '2024-03-01 08:05:00', '{"page": "/products", "duration_seconds": 120, "referrer": "direct"}'),
  (3,  'click',     101, '2024-03-01 08:02:00', '{"page": "/home", "duration_seconds": 3, "element": "cta-button"}'),
  (4,  'purchase',  103, '2024-03-01 09:00:00', '{"page": "/checkout", "duration_seconds": 200, "revenue": 149.99}'),
  (5,  'page_view', 104, '2024-03-01 09:15:00', '{"page": "/about", "duration_seconds": 30, "referrer": "twitter"}'),
  (6,  'purchase',  101, '2024-03-01 09:30:00', '{"page": "/checkout", "duration_seconds": 180, "revenue": 89.50}'),
  (7,  'click',     105, '2024-03-01 10:00:00', '{"page": "/products", "duration_seconds": 2, "element": "add-to-cart"}'),
  (8,  'page_view', 102, '2024-03-01 10:10:00', '{"page": "/blog", "duration_seconds": 300, "referrer": "newsletter"}'),
  (9,  'purchase',  106, '2024-03-01 10:45:00', '{"page": "/checkout", "duration_seconds": 95, "revenue": 249.00}'),
  (10, 'page_view', 107, '2024-03-01 11:00:00', '{"page": "/pricing", "duration_seconds": 60, "referrer": "direct"}'),
  (11, 'click',     103, '2024-03-01 11:05:00', '{"page": "/pricing", "duration_seconds": 5, "element": "plan-pro"}'),
  (12, 'purchase',  108, '2024-03-01 11:20:00', '{"page": "/checkout", "duration_seconds": 150, "revenue": 29.99}'),
  (13, 'page_view', 109, '2024-03-01 12:00:00', '{"page": "/home", "duration_seconds": 20, "referrer": "organic"}'),
  (14, 'click',     110, '2024-03-01 12:10:00', '{"page": "/home", "duration_seconds": 1, "element": "nav-pricing"}'),
  (15, 'purchase',  111, '2024-03-01 12:30:00', '{"page": "/checkout", "duration_seconds": 220, "revenue": 399.00}');`,

  solutionQuery: `SELECT
  event_id,
  event_type,
  user_id,
  json_extract_string(properties, '$.page')                        AS page,
  CAST(json_extract(properties, '$.duration_seconds') AS INTEGER)  AS duration_seconds,
  CAST(json_extract(properties, '$.revenue') AS DOUBLE)            AS revenue
FROM events
ORDER BY event_id;`,

  solutionExplanation: `## Explanation

### Pattern: JSON field extraction with json_extract

This exercise uses DuckDB's **JSON extraction** functions to parse semi-structured data stored as VARCHAR.

### Step-by-step

1. **json_extract_string(col, path)** — extracts a string value from a JSON column using JSONPath syntax. Returns \`VARCHAR\`. Use this for text fields.
2. **json_extract(col, path)** — extracts a JSON value (number, boolean, object…). Returns a \`JSON\` type; must be \`CAST\` to the desired SQL type.
3. **CAST(... AS INTEGER / DOUBLE)** — converts the extracted JSON value to a native SQL type. When the field is absent, DuckDB returns \`NULL\` automatically.
4. **ORDER BY event_id** — deterministic output.

### Why this approach

- \`json_extract_string()\` is cleaner than \`json_extract()\` + CAST for string fields because it directly returns a stripped VARCHAR (no surrounding quotes).
- The missing \`revenue\` field on non-purchase events naturally becomes \`NULL\` — no \`COALESCE\` needed.
- JSONPath (\`$.field\`) is the standard notation supported by DuckDB.

### When to use

Any time raw JSON is stored in a VARCHAR column: webhook payloads, API responses, legacy event logs. This pattern is the first step before normalising the data into a proper schema.

### DuckDB note

DuckDB also supports the arrow operator shorthand: \`properties->>'page'\` (equivalent to \`json_extract_string\`) and \`properties->'revenue'\` (equivalent to \`json_extract\`).`,

  solutionExplanationFr: `## Explication

### Patron : Extraction de champs JSON avec json_extract

Cet exercice utilise les fonctions d'**extraction JSON** de DuckDB pour parser des données semi-structurées stockées en VARCHAR.

### Étape par étape

1. **json_extract_string(col, path)** — extrait une valeur string depuis une colonne JSON via la syntaxe JSONPath. Retourne un \`VARCHAR\`. À utiliser pour les champs texte.
2. **json_extract(col, path)** — extrait une valeur JSON (nombre, booléen, objet…). Retourne un type \`JSON\` ; doit être \`CAST\` vers le type SQL souhaité.
3. **CAST(... AS INTEGER / DOUBLE)** — convertit la valeur JSON extraite en type SQL natif. Quand le champ est absent, DuckDB retourne \`NULL\` automatiquement.
4. **ORDER BY event_id** — résultat déterministe.

### Pourquoi cette approche

- \`json_extract_string()\` est plus propre que \`json_extract()\` + CAST pour les champs string car il retourne directement un VARCHAR sans guillemets.
- Le champ \`revenue\` absent sur les événements non-achat devient naturellement \`NULL\`.
- JSONPath (\`$.field\`) est la notation standard supportée par DuckDB.

### Quand l'utiliser

Dès que du JSON brut est stocké dans une colonne VARCHAR : payloads webhook, réponses API, logs d'événements hérités.`,

  testCases: [
    {
      name: "default",
      description: "15 events with extracted page, duration_seconds, and revenue (NULL for non-purchase events)",
      descriptionFr: "15 événements avec page, duration_seconds et revenue extraits (NULL pour les événements non-achat)",
      expectedColumns: ["event_id", "event_type", "user_id", "page", "duration_seconds", "revenue"],
      expectedRows: [
        { event_id: 1,  event_type: "page_view", user_id: 101, page: "/home",     duration_seconds: 45,  revenue: null },
        { event_id: 2,  event_type: "page_view", user_id: 102, page: "/products", duration_seconds: 120, revenue: null },
        { event_id: 3,  event_type: "click",     user_id: 101, page: "/home",     duration_seconds: 3,   revenue: null },
        { event_id: 4,  event_type: "purchase",  user_id: 103, page: "/checkout", duration_seconds: 200, revenue: 149.99 },
        { event_id: 5,  event_type: "page_view", user_id: 104, page: "/about",    duration_seconds: 30,  revenue: null },
        { event_id: 6,  event_type: "purchase",  user_id: 101, page: "/checkout", duration_seconds: 180, revenue: 89.50 },
        { event_id: 7,  event_type: "click",     user_id: 105, page: "/products", duration_seconds: 2,   revenue: null },
        { event_id: 8,  event_type: "page_view", user_id: 102, page: "/blog",     duration_seconds: 300, revenue: null },
        { event_id: 9,  event_type: "purchase",  user_id: 106, page: "/checkout", duration_seconds: 95,  revenue: 249.00 },
        { event_id: 10, event_type: "page_view", user_id: 107, page: "/pricing",  duration_seconds: 60,  revenue: null },
        { event_id: 11, event_type: "click",     user_id: 103, page: "/pricing",  duration_seconds: 5,   revenue: null },
        { event_id: 12, event_type: "purchase",  user_id: 108, page: "/checkout", duration_seconds: 150, revenue: 29.99 },
        { event_id: 13, event_type: "page_view", user_id: 109, page: "/home",     duration_seconds: 20,  revenue: null },
        { event_id: 14, event_type: "click",     user_id: 110, page: "/home",     duration_seconds: 1,   revenue: null },
        { event_id: 15, event_type: "purchase",  user_id: 111, page: "/checkout", duration_seconds: 220, revenue: 399.00 },
      ],
      orderMatters: true,
    },
    {
      name: "new-purchase-event",
      description: "A new purchase event is correctly parsed with its revenue field",
      descriptionFr: "Un nouvel événement achat est correctement parsé avec son champ revenue",
      setupSql: `INSERT INTO events VALUES (16, 'purchase', 112, '2024-03-01 13:00:00', '{"page": "/checkout", "duration_seconds": 75, "revenue": 59.90}');`,
      expectedColumns: ["event_id", "event_type", "user_id", "page", "duration_seconds", "revenue"],
      expectedRows: [
        { event_id: 1,  event_type: "page_view", user_id: 101, page: "/home",     duration_seconds: 45,  revenue: null },
        { event_id: 2,  event_type: "page_view", user_id: 102, page: "/products", duration_seconds: 120, revenue: null },
        { event_id: 3,  event_type: "click",     user_id: 101, page: "/home",     duration_seconds: 3,   revenue: null },
        { event_id: 4,  event_type: "purchase",  user_id: 103, page: "/checkout", duration_seconds: 200, revenue: 149.99 },
        { event_id: 5,  event_type: "page_view", user_id: 104, page: "/about",    duration_seconds: 30,  revenue: null },
        { event_id: 6,  event_type: "purchase",  user_id: 101, page: "/checkout", duration_seconds: 180, revenue: 89.50 },
        { event_id: 7,  event_type: "click",     user_id: 105, page: "/products", duration_seconds: 2,   revenue: null },
        { event_id: 8,  event_type: "page_view", user_id: 102, page: "/blog",     duration_seconds: 300, revenue: null },
        { event_id: 9,  event_type: "purchase",  user_id: 106, page: "/checkout", duration_seconds: 95,  revenue: 249.00 },
        { event_id: 10, event_type: "page_view", user_id: 107, page: "/pricing",  duration_seconds: 60,  revenue: null },
        { event_id: 11, event_type: "click",     user_id: 103, page: "/pricing",  duration_seconds: 5,   revenue: null },
        { event_id: 12, event_type: "purchase",  user_id: 108, page: "/checkout", duration_seconds: 150, revenue: 29.99 },
        { event_id: 13, event_type: "page_view", user_id: 109, page: "/home",     duration_seconds: 20,  revenue: null },
        { event_id: 14, event_type: "click",     user_id: 110, page: "/home",     duration_seconds: 1,   revenue: null },
        { event_id: 15, event_type: "purchase",  user_id: 111, page: "/checkout", duration_seconds: 220, revenue: 399.00 },
        { event_id: 16, event_type: "purchase",  user_id: 112, page: "/checkout", duration_seconds: 75,  revenue: 59.90 },
      ],
      orderMatters: true,
    },
  ],
};
