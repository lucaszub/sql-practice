import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "75-scd2-point-in-time",
  title: "SCD Type 2 — Point-in-Time Customer Snapshot",
  titleFr: "SCD Type 2 — Snapshot client à un instant donné",
  difficulty: "hard",
  category: "scd",
  description: `## SCD Type 2 — Point-in-Time Customer Snapshot

The audit team is investigating a compliance issue and needs to know the **exact state of all customers as of 2024-06-15** — not today's data, but what the dimension looked like on that specific date.

The \`dim_customer_scd2\` table contains multiple versions per customer. A version was valid on 2024-06-15 if:
- \`valid_from\` ≤ 2024-06-15
- AND (\`valid_to\` ≥ 2024-06-15 OR \`valid_to\` IS NULL)

Some customers may not have existed yet on that date (no record should appear for them).

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
| is_current | BOOLEAN | |

### Task

Return the version of each customer that was active on **2024-06-15**.

### Expected output columns
\`customer_id\`, \`customer_name\`, \`city\`, \`country\`, \`valid_from\`, \`valid_to\`

Order by \`customer_id\` ASC.`,
  descriptionFr: `## SCD Type 2 — Snapshot client à un instant donné

L'équipe d'audit enquête sur un problème de conformité et a besoin de connaître l'**état exact de tous les clients au 2024-06-15** — pas les données actuelles, mais ce à quoi ressemblait la dimension à cette date précise.

La table \`dim_customer_scd2\` contient plusieurs versions par client. Une version était valide le 2024-06-15 si :
- \`valid_from\` ≤ 2024-06-15
- ET (\`valid_to\` ≥ 2024-06-15 OU \`valid_to\` IS NULL)

Certains clients peuvent ne pas avoir existé encore à cette date (aucun enregistrement ne doit apparaître pour eux).

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
| is_current | BOOLEAN | |

### Tâche

Retourne la version de chaque client qui était active le **2024-06-15**.

### Colonnes attendues en sortie
\`customer_id\`, \`customer_name\`, \`city\`, \`country\`, \`valid_from\`, \`valid_to\`

Trier par \`customer_id\` ASC.`,
  hint: "Filter WHERE valid_from <= '2024-06-15' AND (valid_to >= '2024-06-15' OR valid_to IS NULL). This correctly handles both closed versions (with a valid_to date) and open-ended current versions (valid_to IS NULL).",
  hintFr: "Filtre WHERE valid_from <= '2024-06-15' AND (valid_to >= '2024-06-15' OR valid_to IS NULL). Cela gère correctement à la fois les versions fermées (avec une date valid_to) et les versions actuelles ouvertes (valid_to IS NULL).",
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
  -- Customer 1: moved after the audit date
  (1,  1, 'Alice Martin', 'Paris',      'France',      '2022-01-01', '2024-09-30', false),
  (2,  1, 'Alice Martin', 'Bordeaux',   'France',      '2024-10-01', NULL,         true),
  -- Customer 2: moved before the audit date
  (3,  2, 'Bob Dupont',   'Lyon',       'France',      '2021-03-10', '2023-11-30', false),
  (4,  2, 'Bob Dupont',   'Nice',       'France',      '2023-12-01', NULL,         true),
  -- Customer 3: single version, predates audit
  (5,  3, 'Carol Smith',  'London',     'UK',          '2020-05-01', NULL,         true),
  -- Customer 4: version closed before audit date — replaced by current
  (6,  4, 'David Jones',  'Manchester', 'UK',          '2021-08-15', '2023-03-31', false),
  (7,  4, 'David Jones',  'Edinburgh',  'UK',          '2023-04-01', NULL,         true),
  -- Customer 5: version open at audit date, later closed
  (8,  5, 'Eva Müller',   'Berlin',     'Germany',     '2022-07-01', '2024-08-15', false),
  (9,  5, 'Eva Müller',   'Hamburg',    'Germany',     '2024-08-16', NULL,         true),
  -- Customer 6: registered AFTER audit date — should NOT appear
  (10, 6, 'Frank Weber',  'Munich',     'Germany',     '2024-09-01', NULL,         true),
  -- Customer 7: version exactly ending on audit date
  (11, 7, 'Grace Lee',    'Seoul',      'South Korea', '2021-11-01', '2024-06-15', false),
  (12, 7, 'Grace Lee',    'Busan',      'South Korea', '2024-06-16', NULL,         true),
  -- Customer 8: entire history before audit date (closed)
  (13, 8, 'Hiro Tanaka',  'Tokyo',      'Japan',       '2020-01-01', '2023-12-31', false),
  (14, 8, 'Hiro Tanaka',  'Osaka',      'Japan',       '2024-01-01', NULL,         true),
  -- Customer 9: two versions before audit date, one after
  (15, 9, 'Ines Costa',   'Lisbon',     'Portugal',    '2021-06-01', '2022-12-31', false),
  (16, 9, 'Ines Costa',   'Faro',       'Portugal',    '2023-01-01', '2024-11-30', false),
  (17, 9, 'Ines Costa',   'Porto',      'Portugal',    '2024-12-01', NULL,         true),
  -- Customer 10: single current version active at audit date
  (18, 10, 'João Silva',  'Porto',      'Portugal',    '2022-02-01', NULL,         true);`,
  solutionQuery: `SELECT
  customer_id,
  customer_name,
  city,
  country,
  valid_from,
  valid_to
FROM dim_customer_scd2
WHERE valid_from <= DATE '2024-06-15'
  AND (valid_to >= DATE '2024-06-15' OR valid_to IS NULL)
ORDER BY customer_id;`,
  solutionExplanation: `## Explanation

### Pattern: SCD Type 2 — Point-in-Time (Bi-Temporal) Lookup

Point-in-time queries reconstruct the exact state of a dimension table at a specific historical date. This is a fundamental capability of SCD Type 2 and is used for audits, regulatory reporting, and debugging pipeline issues.

### Step-by-step

The key filter condition:
\`\`\`sql
WHERE valid_from <= '2024-06-15'
  AND (valid_to >= '2024-06-15' OR valid_to IS NULL)
\`\`\`

- **\`valid_from <= '2024-06-15'\`**: The version must have started on or before the audit date.
- **\`valid_to >= '2024-06-15'\`**: The version must still be open on the audit date (for closed records).
- **\`OR valid_to IS NULL\`**: NULL means the version is still active today — it was also active on the audit date.

### Edge cases handled

- **Customer 6 (Frank Weber)**: registered 2024-09-01 — after the audit date. \`valid_from > '2024-06-15'\`, so it does NOT appear.
- **Customer 7 (Grace Lee)**: version closed exactly on 2024-06-15 (\`valid_to = '2024-06-15'\`). The \`>=\` operator correctly includes this row.
- **Customer 9 (Ines Costa)**: has a version active on the audit date (Faro, valid until 2024-11-30) — the later version (Porto, from 2024-12-01) does not yet exist.

### Why this approach

This single WHERE clause is the canonical point-in-time lookup pattern. It is O(n) over the dimension rows and can be made highly efficient with a composite index on \`(customer_id, valid_from, valid_to)\`.

### When to use

- Audit and compliance reports requiring a specific historical state
- Debugging fact table joins to understand which dimension version was active at transaction time
- Regulatory reporting (e.g., "show me all customer data as it existed on the report date")`,
  solutionExplanationFr: `## Explication

### Pattern : SCD Type 2 — Lookup à un instant donné (Bi-temporel)

Les requêtes point-in-time reconstruisent l'état exact d'une table de dimension à une date historique spécifique. C'est une capacité fondamentale du SCD Type 2 utilisée pour les audits, les rapports réglementaires et le débogage des problèmes de pipeline.

### Étape par étape

La condition de filtre clé :
\`\`\`sql
WHERE valid_from <= '2024-06-15'
  AND (valid_to >= '2024-06-15' OR valid_to IS NULL)
\`\`\`

- **\`valid_from <= '2024-06-15'\`** : La version doit avoir commencé au plus tard à la date d'audit.
- **\`valid_to >= '2024-06-15'\`** : La version doit encore être ouverte à la date d'audit (pour les enregistrements fermés).
- **\`OR valid_to IS NULL\`** : NULL signifie que la version est encore active aujourd'hui — elle était aussi active à la date d'audit.

### Cas limites gérés

- **Client 6 (Frank Weber)** : enregistré le 2024-09-01 — après la date d'audit. \`valid_from > '2024-06-15'\`, donc il n'apparaît PAS.
- **Client 7 (Grace Lee)** : version fermée exactement le 2024-06-15 (\`valid_to = '2024-06-15'\`). L'opérateur \`>=\` inclut correctement cette ligne.
- **Client 9 (Ines Costa)** : a une version active à la date d'audit (Faro, valide jusqu'au 2024-11-30) — la version suivante (Porto, à partir du 2024-12-01) n'existe pas encore.

### Pourquoi cette approche

Cette clause WHERE unique est le pattern canonique de lookup point-in-time. Elle est O(n) sur les lignes de dimension et peut être rendue très efficace avec un index composite sur \`(customer_id, valid_from, valid_to)\`.

### Quand l'utiliser

- Rapports d'audit et de conformité nécessitant un état historique spécifique
- Débogage des jointures de tables de faits pour comprendre quelle version de dimension était active au moment de la transaction
- Rapports réglementaires (ex : "montrez-moi toutes les données clients telles qu'elles existaient à la date du rapport")`,
  testCases: [
    {
      name: "default",
      description: "Snapshot at 2024-06-15: 9 customers visible (Frank Weber not yet registered), Grace Lee in Seoul",
      descriptionFr: "Snapshot au 2024-06-15 : 9 clients visibles (Frank Weber pas encore enregistré), Grace Lee à Seoul",
      expectedColumns: ["customer_id", "customer_name", "city", "country", "valid_from", "valid_to"],
      expectedRows: [
        { customer_id: 1,  customer_name: "Alice Martin", city: "Paris",   country: "France",       valid_from: "2022-01-01", valid_to: "2024-09-30" },
        { customer_id: 2,  customer_name: "Bob Dupont",   city: "Nice",    country: "France",       valid_from: "2023-12-01", valid_to: null },
        { customer_id: 3,  customer_name: "Carol Smith",  city: "London",  country: "UK",           valid_from: "2020-05-01", valid_to: null },
        { customer_id: 4,  customer_name: "David Jones",  city: "Edinburgh", country: "UK",         valid_from: "2023-04-01", valid_to: null },
        { customer_id: 5,  customer_name: "Eva Müller",   city: "Berlin",  country: "Germany",      valid_from: "2022-07-01", valid_to: "2024-08-15" },
        { customer_id: 7,  customer_name: "Grace Lee",    city: "Seoul",   country: "South Korea",  valid_from: "2021-11-01", valid_to: "2024-06-15" },
        { customer_id: 8,  customer_name: "Hiro Tanaka",  city: "Osaka",   country: "Japan",        valid_from: "2024-01-01", valid_to: null },
        { customer_id: 9,  customer_name: "Ines Costa",   city: "Faro",    country: "Portugal",     valid_from: "2023-01-01", valid_to: "2024-11-30" },
        { customer_id: 10, customer_name: "João Silva",   city: "Porto",   country: "Portugal",     valid_from: "2022-02-01", valid_to: null },
      ],
      orderMatters: true,
    },
    {
      name: "early-date",
      description: "Snapshot at 2021-01-01: only customers registered before that date",
      descriptionFr: "Snapshot au 2021-01-01 : uniquement les clients enregistrés avant cette date",
      setupSql: `DELETE FROM dim_customer_scd2;
INSERT INTO dim_customer_scd2 VALUES
  (1, 1, 'Alice Martin', 'Paris',  'France', '2020-01-01', '2020-12-31', false),
  (2, 1, 'Alice Martin', 'Lyon',   'France', '2021-01-01', NULL,         true),
  (3, 2, 'Bob Dupont',   'Nantes', 'France', '2022-03-01', NULL,         true),
  (4, 3, 'Carol Smith',  'London', 'UK',     '2019-06-01', '2020-06-30', false),
  (5, 3, 'Carol Smith',  'Leeds',  'UK',     '2020-07-01', NULL,         true);`,
      expectedColumns: ["customer_id", "customer_name", "city", "country", "valid_from", "valid_to"],
      expectedRows: [
        { customer_id: 1, customer_name: "Alice Martin", city: "Lyon",  country: "France", valid_from: "2021-01-01", valid_to: null },
        { customer_id: 3, customer_name: "Carol Smith",  city: "Leeds", country: "UK",     valid_from: "2020-07-01", valid_to: null },
      ],
      orderMatters: false,
    },
  ],
};
