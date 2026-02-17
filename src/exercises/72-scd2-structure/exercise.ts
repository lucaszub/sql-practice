import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "72-scd2-structure",
  title: "SCD Type 2 — Query Current Customer Records",
  titleFr: "SCD Type 2 — Interroger les enregistrements clients actuels",
  difficulty: "medium",
  category: "scd",
  description: `## SCD Type 2 — Query Current Customer Records

Your data warehouse uses **SCD Type 2** to track the full history of customer attribute changes. The \`dim_customer_scd2\` table stores one row per version of each customer, with \`valid_from\`, \`valid_to\` (NULL for the current version), and \`is_current\` to identify the active record.

The BI team needs a clean snapshot of all **current** customer records to power a dashboard. Write a query that returns only the active version of each customer.

### Schema

| Column | Type | Notes |
|--------|------|-------|
| surrogate_key | INTEGER | Unique row identifier |
| customer_id | INTEGER | Natural business key |
| customer_name | VARCHAR | |
| city | VARCHAR | |
| country | VARCHAR | |
| valid_from | DATE | Start of this version |
| valid_to | DATE | End of this version (NULL = still active) |
| is_current | BOOLEAN | TRUE for the active record |

### Task

Return all columns for records where \`is_current = true\`.

### Expected output columns
\`surrogate_key\`, \`customer_id\`, \`customer_name\`, \`city\`, \`country\`, \`valid_from\`, \`valid_to\`, \`is_current\`

Order by \`customer_id\` ASC.`,
  descriptionFr: `## SCD Type 2 — Interroger les enregistrements clients actuels

Votre entrepôt de données utilise le **SCD Type 2** pour suivre l'historique complet des changements d'attributs clients. La table \`dim_customer_scd2\` stocke une ligne par version de chaque client, avec \`valid_from\`, \`valid_to\` (NULL pour la version actuelle), et \`is_current\` pour identifier l'enregistrement actif.

L'équipe BI a besoin d'un snapshot propre de tous les enregistrements clients **actuels** pour alimenter un tableau de bord. Écris une requête qui ne retourne que la version active de chaque client.

### Schéma

| Colonne | Type | Notes |
|---------|------|-------|
| surrogate_key | INTEGER | Identifiant unique de ligne |
| customer_id | INTEGER | Clé métier naturelle |
| customer_name | VARCHAR | |
| city | VARCHAR | |
| country | VARCHAR | |
| valid_from | DATE | Début de cette version |
| valid_to | DATE | Fin de cette version (NULL = encore active) |
| is_current | BOOLEAN | TRUE pour l'enregistrement actif |

### Tâche

Retourne toutes les colonnes pour les enregistrements où \`is_current = true\`.

### Colonnes attendues en sortie
\`surrogate_key\`, \`customer_id\`, \`customer_name\`, \`city\`, \`country\`, \`valid_from\`, \`valid_to\`, \`is_current\`

Trier par \`customer_id\` ASC.`,
  hint: "Filter on is_current = true. This is more reliable than checking valid_to IS NULL, as some warehouses use a sentinel date (e.g., 9999-12-31) instead of NULL.",
  hintFr: "Filtre sur is_current = true. C'est plus fiable que de vérifier valid_to IS NULL, car certains entrepôts utilisent une date sentinelle (ex : 9999-12-31) plutôt que NULL.",
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
  (1,  1, 'Alice Martin',  'Paris',      'France',      '2022-01-01', '2023-06-14', false),
  (2,  1, 'Alice Martin',  'Bordeaux',   'France',      '2023-06-15', NULL,         true),
  (3,  2, 'Bob Dupont',    'Lyon',       'France',      '2021-03-10', '2022-11-30', false),
  (4,  2, 'Bob Dupont',    'Marseille',  'France',      '2022-12-01', '2024-02-28', false),
  (5,  2, 'Bob Dupont',    'Nice',       'France',      '2024-03-01', NULL,         true),
  (6,  3, 'Carol Smith',   'London',     'UK',          '2020-05-01', NULL,         true),
  (7,  4, 'David Jones',   'Manchester', 'UK',          '2021-08-15', '2023-03-31', false),
  (8,  4, 'David Jones',   'Edinburgh',  'UK',          '2023-04-01', NULL,         true),
  (9,  5, 'Eva Müller',    'Berlin',     'Germany',     '2022-07-01', '2024-01-15', false),
  (10, 5, 'Eva Müller',    'Hamburg',    'Germany',     '2024-01-16', NULL,         true),
  (11, 6, 'Frank Weber',   'Munich',     'Germany',     '2023-01-01', NULL,         true),
  (12, 7, 'Grace Lee',     'Seoul',      'South Korea', '2021-11-01', '2022-08-31', false),
  (13, 7, 'Grace Lee',     'Busan',      'South Korea', '2022-09-01', NULL,         true),
  (14, 8, 'Hiro Tanaka',   'Tokyo',      'Japan',       '2020-01-01', NULL,         true),
  (15, 9, 'Ines Costa',    'Lisbon',     'Portugal',    '2023-04-01', '2024-07-31', false),
  (16, 9, 'Ines Costa',    'Faro',       'Portugal',    '2024-08-01', NULL,         true),
  (17, 10, 'João Silva',   'Porto',      'Portugal',    '2022-02-01', NULL,         true);`,
  solutionQuery: `SELECT
  surrogate_key,
  customer_id,
  customer_name,
  city,
  country,
  valid_from,
  valid_to,
  is_current
FROM dim_customer_scd2
WHERE is_current = true
ORDER BY customer_id;`,
  solutionExplanation: `## Explanation

### Pattern: SCD Type 2 — Current Snapshot

In SCD Type 2, each time a tracked attribute changes, a new row is inserted with updated \`valid_from\` and the previous row is "closed" by setting \`valid_to\` and \`is_current = false\`.

### Step-by-step

1. **Filter on is_current**: \`WHERE is_current = true\` selects exactly one row per customer — the active version.
2. **Order**: Results are sorted by \`customer_id\` for a clean, predictable output.

### Why this approach

Filtering on \`is_current\` is preferred over \`valid_to IS NULL\` because:
- Some warehouses use sentinel dates (\`9999-12-31\`) instead of NULL for open-ended records
- The boolean flag is explicit and index-friendly

### When to use

- Any time you need the current state of a slowly changing dimension
- As the base for joining with fact tables that record current-day transactions`,
  solutionExplanationFr: `## Explication

### Pattern : SCD Type 2 — Snapshot actuel

En SCD Type 2, chaque fois qu'un attribut suivi change, une nouvelle ligne est insérée avec \`valid_from\` mis à jour, et la ligne précédente est "fermée" en définissant \`valid_to\` et \`is_current = false\`.

### Étape par étape

1. **Filtre sur is_current** : \`WHERE is_current = true\` sélectionne exactement une ligne par client — la version active.
2. **Tri** : Les résultats sont triés par \`customer_id\` pour une sortie propre et prévisible.

### Pourquoi cette approche

Filtrer sur \`is_current\` est préférable à \`valid_to IS NULL\` car :
- Certains entrepôts utilisent des dates sentinelles (\`9999-12-31\`) au lieu de NULL pour les enregistrements ouverts
- Le flag booléen est explicite et adapté à l'indexation

### Quand l'utiliser

- Chaque fois que vous avez besoin de l'état actuel d'une dimension à évolution lente
- Comme base pour joindre avec des tables de faits qui enregistrent les transactions du jour`,
  testCases: [
    {
      name: "default",
      description: "Returns only current records — one per customer, 10 total",
      descriptionFr: "Retourne uniquement les enregistrements actuels — un par client, 10 au total",
      expectedColumns: ["surrogate_key", "customer_id", "customer_name", "city", "country", "valid_from", "valid_to", "is_current"],
      expectedRows: [
        { surrogate_key: 2,  customer_id: 1,  customer_name: "Alice Martin", city: "Bordeaux",   country: "France",       valid_from: "2023-06-15", valid_to: null, is_current: true },
        { surrogate_key: 5,  customer_id: 2,  customer_name: "Bob Dupont",   city: "Nice",       country: "France",       valid_from: "2024-03-01", valid_to: null, is_current: true },
        { surrogate_key: 6,  customer_id: 3,  customer_name: "Carol Smith",  city: "London",     country: "UK",           valid_from: "2020-05-01", valid_to: null, is_current: true },
        { surrogate_key: 8,  customer_id: 4,  customer_name: "David Jones",  city: "Edinburgh",  country: "UK",           valid_from: "2023-04-01", valid_to: null, is_current: true },
        { surrogate_key: 10, customer_id: 5,  customer_name: "Eva Müller",   city: "Hamburg",    country: "Germany",      valid_from: "2024-01-16", valid_to: null, is_current: true },
        { surrogate_key: 11, customer_id: 6,  customer_name: "Frank Weber",  city: "Munich",     country: "Germany",      valid_from: "2023-01-01", valid_to: null, is_current: true },
        { surrogate_key: 13, customer_id: 7,  customer_name: "Grace Lee",    city: "Busan",      country: "South Korea",  valid_from: "2022-09-01", valid_to: null, is_current: true },
        { surrogate_key: 14, customer_id: 8,  customer_name: "Hiro Tanaka",  city: "Tokyo",      country: "Japan",        valid_from: "2020-01-01", valid_to: null, is_current: true },
        { surrogate_key: 16, customer_id: 9,  customer_name: "Ines Costa",   city: "Faro",       country: "Portugal",     valid_from: "2024-08-01", valid_to: null, is_current: true },
        { surrogate_key: 17, customer_id: 10, customer_name: "João Silva",   city: "Porto",      country: "Portugal",     valid_from: "2022-02-01", valid_to: null, is_current: true },
      ],
      orderMatters: true,
    },
    {
      name: "single-current",
      description: "When only one customer has a current record",
      descriptionFr: "Quand un seul client a un enregistrement actuel",
      setupSql: `DELETE FROM dim_customer_scd2;
INSERT INTO dim_customer_scd2 VALUES
  (1, 1, 'Alice Martin', 'Paris',     'France', '2022-01-01', '2023-06-14', false),
  (2, 1, 'Alice Martin', 'Bordeaux',  'France', '2023-06-15', NULL,         true),
  (3, 2, 'Bob Dupont',   'Lyon',      'France', '2021-03-10', '2024-12-31', false);`,
      expectedColumns: ["surrogate_key", "customer_id", "customer_name", "city", "country", "valid_from", "valid_to", "is_current"],
      expectedRows: [
        { surrogate_key: 2, customer_id: 1, customer_name: "Alice Martin", city: "Bordeaux", country: "France", valid_from: "2023-06-15", valid_to: null, is_current: true },
      ],
      orderMatters: false,
    },
  ],
};
