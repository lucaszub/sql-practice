import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "89-null-completeness-check",
  title: "Customer Profile Completeness Audit",
  titleFr: "Audit de completude des profils clients",
  difficulty: "medium",
  category: "data-quality",
  description: `## Customer Profile Completeness Audit

The CRM team is preparing a data quality report before migrating to a new platform. They need to know which columns in the \`customers\` table have NULL values, how many are missing, and what percentage of records are incomplete — so they can prioritize data enrichment efforts.

### Schema

**customers**
| Column | Type |
|--------|------|
| customer_id | INTEGER |
| full_name | VARCHAR |
| email | VARCHAR |
| phone | VARCHAR |
| city | VARCHAR |
| country | VARCHAR |
| signup_date | DATE |

### Task

Write a query that reports NULL completeness for each column:
- \`column_name\`: the name of the column
- \`null_count\`: number of rows where that column is NULL
- \`total_rows\`: total number of rows in the table
- \`null_percentage\`: percentage of NULLs, rounded to 2 decimal places

Only include columns that have at least one NULL value. Order by \`null_percentage\` DESC.

### Expected output columns
\`column_name\`, \`null_count\`, \`total_rows\`, \`null_percentage\``,
  descriptionFr: `## Audit de completude des profils clients

L'equipe CRM prepare un rapport de qualite des donnees avant de migrer vers une nouvelle plateforme. Elle doit savoir quelles colonnes de la table \`customers\` contiennent des valeurs NULL, combien en manquent, et quel pourcentage des enregistrements est incomplet — afin de prioriser les efforts d'enrichissement des donnees.

### Schema

**customers**
| Colonne | Type |
|---------|------|
| customer_id | INTEGER |
| full_name | VARCHAR |
| email | VARCHAR |
| phone | VARCHAR |
| city | VARCHAR |
| country | VARCHAR |
| signup_date | DATE |

### Tache

Ecrivez une requete qui rapporte la completude des NULLs pour chaque colonne :
- \`column_name\` : le nom de la colonne
- \`null_count\` : nombre de lignes ou cette colonne est NULL
- \`total_rows\` : nombre total de lignes dans la table
- \`null_percentage\` : pourcentage de NULLs, arrondi a 2 decimales

N'incluez que les colonnes ayant au moins un NULL. Triez par \`null_percentage\` DESC.

### Colonnes attendues en sortie
\`column_name\`, \`null_count\`, \`total_rows\`, \`null_percentage\``,
  hint: "Use UNPIVOT or UNION ALL to turn each column into a row, then COUNT NULLs. In DuckDB, COUNT(col) ignores NULLs — so total_rows - COUNT(col) gives you the null count.",
  hintFr: "Utilisez UNPIVOT ou UNION ALL pour transformer chaque colonne en ligne, puis comptez les NULLs. Dans DuckDB, COUNT(col) ignore les NULLs — donc total_rows - COUNT(col) donne le nombre de NULLs.",
  schema: `CREATE TABLE customers (
  customer_id INTEGER,
  full_name   VARCHAR,
  email       VARCHAR,
  phone       VARCHAR,
  city        VARCHAR,
  country     VARCHAR,
  signup_date DATE
);

INSERT INTO customers VALUES
  (1,  'Alice Martin',    'alice@example.com',   '+1-555-0101', 'New York',    'USA',    '2023-01-15'),
  (2,  'Bob Chen',        'bob@example.com',      NULL,          'San Francisco','USA',   '2023-02-20'),
  (3,  'Clara Durand',    NULL,                   '+33-6-1234',  'Paris',       'France', '2023-02-28'),
  (4,  'David Kim',       'david@example.com',    '+82-10-5555', NULL,          'Korea',  '2023-03-05'),
  (5,  'Eva Rossi',       'eva@example.com',      NULL,          'Rome',        'Italy',  '2023-03-12'),
  (6,  'Frank Müller',    'frank@example.com',    '+49-30-9999', 'Berlin',      'Germany','2023-04-01'),
  (7,  'Grace Okonkwo',   NULL,                   NULL,          'Lagos',       'Nigeria','2023-04-15'),
  (8,  'Hiro Tanaka',     'hiro@example.com',     '+81-3-0000',  NULL,          'Japan',  '2023-05-02'),
  (9,  'Isla Brown',      'isla@example.com',     NULL,          'London',      'UK',     '2023-05-18'),
  (10, 'Juan Lopez',      'juan@example.com',     '+52-55-1234', 'Mexico City', 'Mexico', '2023-06-01'),
  (11, 'Kira Novak',      NULL,                   '+420-777-888','Prague',      'Czechia','2023-06-10'),
  (12, 'Liam Walsh',      'liam@example.com',     NULL,          NULL,          'Ireland','2023-07-04'),
  (13, 'Mia Andersen',    'mia@example.com',      '+45-20-3456', 'Copenhagen',  'Denmark','2023-07-19'),
  (14, 'Noah Fischer',    NULL,                   NULL,          'Vienna',      'Austria','2023-08-01'),
  (15, 'Olivia Santos',   'olivia@example.com',   '+55-11-9876', 'Sao Paulo',   'Brazil', '2023-08-22');`,
  solutionQuery: `WITH totals AS (
  SELECT COUNT(*) AS total_rows FROM customers
),
null_counts AS (
  SELECT 'email' AS column_name, COUNT(*) - COUNT(email) AS null_count FROM customers
  UNION ALL
  SELECT 'phone',                COUNT(*) - COUNT(phone)  FROM customers
  UNION ALL
  SELECT 'city',                 COUNT(*) - COUNT(city)   FROM customers
  UNION ALL
  SELECT 'full_name',            COUNT(*) - COUNT(full_name) FROM customers
  UNION ALL
  SELECT 'country',              COUNT(*) - COUNT(country) FROM customers
  UNION ALL
  SELECT 'signup_date',          COUNT(*) - COUNT(signup_date) FROM customers
)
SELECT
  nc.column_name,
  nc.null_count,
  t.total_rows,
  ROUND(nc.null_count * 100.0 / t.total_rows, 2) AS null_percentage
FROM null_counts nc
CROSS JOIN totals t
WHERE nc.null_count > 0
ORDER BY null_percentage DESC;`,
  solutionExplanation: `## Explanation

### Pattern: NULL Completeness Check via UNION ALL

This uses the \`COUNT(*) - COUNT(col)\` trick to count NULLs per column, then UNION ALL to pivot columns into rows.

### Step-by-step
1. **\`totals\` CTE**: Computes the total row count once, reused for every column.
2. **\`null_counts\` CTE**: Each branch of the UNION ALL targets one column. \`COUNT(*)\` counts all rows; \`COUNT(col)\` counts only non-NULL values — the difference is the null count.
3. **CROSS JOIN totals**: Attaches total_rows to every column row without a key (there's only one row in totals).
4. **WHERE null_count > 0**: Filters out columns with perfect completeness.
5. **ROUND(..., 2)**: Normalizes the percentage display.

### Why this approach
- \`COUNT(col)\` silently skips NULLs in all SQL dialects — this is reliable and portable.
- UNION ALL is explicit and easy to extend as columns are added to the table.
- Alternatively, DuckDB's UNPIVOT can automate this pattern for wide tables.

### When to use
- Pre-migration data quality audits
- Monitoring data pipelines for missing fields
- Dashboard completeness KPIs in data warehouses`,
  solutionExplanationFr: `## Explication

### Patron : Verification de completude des NULLs via UNION ALL

Cette approche utilise l'astuce \`COUNT(*) - COUNT(col)\` pour compter les NULLs par colonne, puis UNION ALL pour pivoter les colonnes en lignes.

### Etape par etape
1. **CTE \`totals\`** : Calcule le nombre total de lignes une seule fois, reutilise pour chaque colonne.
2. **CTE \`null_counts\`** : Chaque branche du UNION ALL cible une colonne. \`COUNT(*)\` compte toutes les lignes ; \`COUNT(col)\` ne compte que les valeurs non-NULL — la difference est le nombre de NULLs.
3. **CROSS JOIN totals** : Attache total_rows a chaque ligne de colonne sans cle (totals n'a qu'une seule ligne).
4. **WHERE null_count > 0** : Filtre les colonnes avec une completude parfaite.
5. **ROUND(..., 2)** : Normalise l'affichage du pourcentage.

### Pourquoi cette approche
- \`COUNT(col)\` ignore silencieusement les NULLs dans tous les dialectes SQL — c'est fiable et portable.
- UNION ALL est explicite et facile a etendre au fur et a mesure que des colonnes sont ajoutees a la table.
- Alternativement, UNPIVOT de DuckDB peut automatiser ce patron pour les tables larges.

### Quand l'utiliser
- Audits de qualite des donnees pre-migration
- Surveillance des pipelines de donnees pour les champs manquants
- KPIs de completude des tableaux de bord dans les entrepots de donnees`,
  testCases: [
    {
      name: "default",
      description: "NULL completeness report from the base dataset (email, phone, city, full_name have NULLs)",
      descriptionFr: "Rapport de completude des NULLs sur le jeu de donnees de base (email, phone, city, full_name ont des NULLs)",
      expectedColumns: ["column_name", "null_count", "total_rows", "null_percentage"],
      expectedRows: [
        { column_name: "phone",     null_count: 6, total_rows: 15, null_percentage: 40.0 },
        { column_name: "full_name", null_count: 4, total_rows: 15, null_percentage: 26.67 },
        { column_name: "email",     null_count: 4, total_rows: 15, null_percentage: 26.67 },
        { column_name: "city",      null_count: 3, total_rows: 15, null_percentage: 20.0 },
      ],
      orderMatters: true,
    },
    {
      name: "all-complete-after-fill",
      description: "After filling all NULLs, result set should be empty",
      descriptionFr: "Apres remplissage de tous les NULLs, le resultat doit etre vide",
      setupSql: `UPDATE customers SET
  email       = COALESCE(email,       'unknown@example.com'),
  phone       = COALESCE(phone,       '000-0000'),
  city        = COALESCE(city,        'Unknown'),
  full_name   = COALESCE(full_name,   'Unknown');`,
      expectedColumns: ["column_name", "null_count", "total_rows", "null_percentage"],
      expectedRows: [],
      orderMatters: false,
    },
  ],
};
