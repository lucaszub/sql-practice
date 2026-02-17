import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "61-primary-key-design",
  title: "Primary Key Design for a Customer Table",
  titleFr: "Conception de clé primaire pour une table clients",
  difficulty: "easy",
  category: "data-types-constraints",
  description: `## Primary Key Design for a Customer Table

The data engineering team is setting up a new CRM database. They need a \`customers\` table with a proper **PRIMARY KEY** to guarantee uniqueness and prevent duplicate customer records — a common source of reporting errors in legacy systems.

### Schema

**customers**
| Column | Type |
|--------|------|
| customer_id | INTEGER (PRIMARY KEY) |
| full_name | VARCHAR |
| email | VARCHAR |
| country | VARCHAR |
| created_at | DATE |

### Task

Query the \`customers\` table to return all customers ordered by \`customer_id\` ASC. The PRIMARY KEY constraint ensures no two rows share the same \`customer_id\`.

### Expected output columns
\`customer_id\`, \`full_name\`, \`email\`, \`country\`, \`created_at\`

Order by \`customer_id\` ASC.`,
  descriptionFr: `## Conception de clé primaire pour une table clients

L'équipe data engineering met en place une nouvelle base CRM. Elle a besoin d'une table \`customers\` avec une **PRIMARY KEY** correctement définie pour garantir l'unicité et éviter les doublons — source fréquente d'erreurs dans les anciens systèmes.

### Schéma

**customers**
| Colonne | Type |
|---------|------|
| customer_id | INTEGER (PRIMARY KEY) |
| full_name | VARCHAR |
| email | VARCHAR |
| country | VARCHAR |
| created_at | DATE |

### Tâche

Interroger la table \`customers\` pour retourner tous les clients triés par \`customer_id\` ASC. La contrainte PRIMARY KEY garantit qu'aucune deux lignes ne partagent le même \`customer_id\`.

### Colonnes attendues en sortie
\`customer_id\`, \`full_name\`, \`email\`, \`country\`, \`created_at\`

Trié par \`customer_id\` ASC.`,
  hint: "A PRIMARY KEY implicitly adds a NOT NULL + UNIQUE constraint. You just need a SELECT * ... ORDER BY to verify the table structure works.",
  hintFr: "Une PRIMARY KEY ajoute implicitement les contraintes NOT NULL + UNIQUE. Un simple SELECT * ... ORDER BY suffit pour vérifier que la table fonctionne.",
  schema: `CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY,
  full_name   VARCHAR,
  email       VARCHAR,
  country     VARCHAR,
  created_at  DATE
);

INSERT INTO customers VALUES
  (1,  'Alice Martin',    'alice@example.com',    'France',      '2024-01-10'),
  (2,  'Bob Nguyen',      'bob@example.com',      'Vietnam',     '2024-01-15'),
  (3,  'Clara Schmidt',   'clara@example.com',    'Germany',     '2024-02-01'),
  (4,  'David Osei',      'david@example.com',    'Ghana',       '2024-02-14'),
  (5,  'Eva Kowalski',    'eva@example.com',      'Poland',      '2024-03-03'),
  (6,  'Frank Dubois',    'frank@example.com',    'France',      '2024-03-22'),
  (7,  'Grace Li',        'grace@example.com',    'China',       '2024-04-05'),
  (8,  'Hiro Tanaka',     'hiro@example.com',     'Japan',       '2024-04-18'),
  (9,  'Ingrid Berg',     'ingrid@example.com',   'Sweden',      '2024-05-07'),
  (10, 'Jorge Pérez',     'jorge@example.com',    'Mexico',      '2024-05-20'),
  (11, 'Kemi Adeyemi',    'kemi@example.com',     'Nigeria',     '2024-06-01'),
  (12, 'Lena Fischer',    'lena@example.com',     'Germany',     '2024-06-15'),
  (13, 'Marco Rossi',     'marco@example.com',    'Italy',       '2024-07-03'),
  (14, 'Nina Patel',      'nina@example.com',     'India',       '2024-07-21'),
  (15, 'Omar Hassan',     NULL,                   'Egypt',       '2024-08-09');`,
  solutionQuery: `SELECT
  customer_id,
  full_name,
  email,
  country,
  created_at
FROM customers
ORDER BY customer_id ASC;`,
  solutionExplanation: `## Explanation

### Pattern: Primary Key as uniqueness guarantee

A **PRIMARY KEY** is the fundamental building block of relational schema design. It combines two constraints: \`NOT NULL\` (every row must have a value) and \`UNIQUE\` (no two rows can share the same value). This makes it the reliable identifier for every record.

### Step-by-step
1. The \`customer_id INTEGER PRIMARY KEY\` declaration tells DuckDB (and any RDBMS) to reject any INSERT that would create a duplicate or NULL \`customer_id\`.
2. The SELECT retrieves all rows to confirm the data loaded correctly and is ordered predictably.
3. Notice row 15: \`email\` is NULL — this is fine because the PRIMARY KEY constraint only applies to \`customer_id\`, not other columns.

### Why
Without a PRIMARY KEY, duplicate customer records silently accumulate. Downstream queries (aggregations, JOINs) then double-count, causing incorrect revenue figures or misleading dashboards. Enforcing it at the schema level is far more reliable than application-level checks.

### When to use
- Every fact and dimension table in a data warehouse needs a surrogate or natural primary key.
- Use INTEGER or BIGINT for auto-incrementing surrogate keys; use VARCHAR or composite keys for natural identifiers.`,
  solutionExplanationFr: `## Explication

### Modèle : La clé primaire comme garantie d'unicité

Une **PRIMARY KEY** est le fondement de la conception de schéma relationnel. Elle combine deux contraintes : \`NOT NULL\` (chaque ligne doit avoir une valeur) et \`UNIQUE\` (deux lignes ne peuvent partager la même valeur). C'est l'identifiant fiable de chaque enregistrement.

### Étape par étape
1. La déclaration \`customer_id INTEGER PRIMARY KEY\` indique à DuckDB de rejeter tout INSERT qui créerait un doublon ou un \`customer_id\` NULL.
2. Le SELECT récupère toutes les lignes pour confirmer que les données sont chargées correctement et dans un ordre prévisible.
3. Ligne 15 : \`email\` est NULL — c'est acceptable car la contrainte PRIMARY KEY s'applique uniquement à \`customer_id\`.

### Pourquoi
Sans PRIMARY KEY, les doublons s'accumulent silencieusement. Les requêtes en aval (agrégations, JOINs) double-comptent alors, causant des chiffres de revenus incorrects. L'appliquer au niveau du schéma est bien plus fiable que des vérifications applicatives.

### Quand l'utiliser
- Chaque table de faits et de dimensions dans un entrepôt de données a besoin d'une clé primaire.
- Utilisez INTEGER ou BIGINT pour les clés de substitution auto-incrémentées.`,
  testCases: [
    {
      name: "default",
      description: "Returns all 15 customers ordered by customer_id ASC",
      descriptionFr: "Retourne les 15 clients triés par customer_id ASC",
      expectedColumns: ["customer_id", "full_name", "email", "country", "created_at"],
      expectedRows: [
        { customer_id: 1,  full_name: "Alice Martin",  email: "alice@example.com",  country: "France",   created_at: "2024-01-10" },
        { customer_id: 2,  full_name: "Bob Nguyen",    email: "bob@example.com",    country: "Vietnam",  created_at: "2024-01-15" },
        { customer_id: 3,  full_name: "Clara Schmidt", email: "clara@example.com",  country: "Germany",  created_at: "2024-02-01" },
        { customer_id: 4,  full_name: "David Osei",    email: "david@example.com",  country: "Ghana",    created_at: "2024-02-14" },
        { customer_id: 5,  full_name: "Eva Kowalski",  email: "eva@example.com",    country: "Poland",   created_at: "2024-03-03" },
        { customer_id: 6,  full_name: "Frank Dubois",  email: "frank@example.com",  country: "France",   created_at: "2024-03-22" },
        { customer_id: 7,  full_name: "Grace Li",      email: "grace@example.com",  country: "China",    created_at: "2024-04-05" },
        { customer_id: 8,  full_name: "Hiro Tanaka",   email: "hiro@example.com",   country: "Japan",    created_at: "2024-04-18" },
        { customer_id: 9,  full_name: "Ingrid Berg",   email: "ingrid@example.com", country: "Sweden",   created_at: "2024-05-07" },
        { customer_id: 10, full_name: "Jorge Pérez",   email: "jorge@example.com",  country: "Mexico",   created_at: "2024-05-20" },
        { customer_id: 11, full_name: "Kemi Adeyemi",  email: "kemi@example.com",   country: "Nigeria",  created_at: "2024-06-01" },
        { customer_id: 12, full_name: "Lena Fischer",  email: "lena@example.com",   country: "Germany",  created_at: "2024-06-15" },
        { customer_id: 13, full_name: "Marco Rossi",   email: "marco@example.com",  country: "Italy",    created_at: "2024-07-03" },
        { customer_id: 14, full_name: "Nina Patel",    email: "nina@example.com",   country: "India",    created_at: "2024-07-21" },
        { customer_id: 15, full_name: "Omar Hassan",   email: null,                 country: "Egypt",    created_at: "2024-08-09" },
      ],
      orderMatters: true,
    },
    {
      name: "single-country",
      description: "With only French customers loaded, returns 2 rows ordered by customer_id",
      descriptionFr: "Avec uniquement les clients français, retourne 2 lignes triées par customer_id",
      setupSql: `DELETE FROM customers WHERE country != 'France';`,
      expectedColumns: ["customer_id", "full_name", "email", "country", "created_at"],
      expectedRows: [
        { customer_id: 1, full_name: "Alice Martin", email: "alice@example.com", country: "France", created_at: "2024-01-10" },
        { customer_id: 6, full_name: "Frank Dubois", email: "frank@example.com", country: "France", created_at: "2024-03-22" },
      ],
      orderMatters: true,
    },
  ],
};
