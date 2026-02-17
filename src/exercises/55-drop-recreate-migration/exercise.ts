import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "55-drop-recreate-migration",
  title: "Staging Table Schema Migration",
  titleFr: "Migration de schema d'une table de staging",
  difficulty: "medium",
  category: "ddl-dml",
  description: `## Staging Table Schema Migration

The data platform team is rebuilding the \`staging_orders\` table after a schema review. The old table is missing a \`region VARCHAR\` column and the \`order_total\` column was typed as \`INTEGER\` (truncating cents). The new schema must use \`DECIMAL(10,2)\` for \`order_total\` and add the \`region\` column.

The migration steps are: DROP the old table, CREATE the new one, INSERT the migrated data (converting amounts to correct type), and verify with a SELECT.

### Schema (initial state — old table)

**staging_orders** (pre-existing, to be dropped)
| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_name | VARCHAR |
| order_total | INTEGER |
| order_date | DATE |

### Task

Write a migration script that:
1. Drops the existing \`staging_orders\` table
2. Creates a new \`staging_orders\` table with columns: \`order_id INTEGER\`, \`customer_name VARCHAR\`, \`order_total DECIMAL(10,2)\`, \`order_date DATE\`, \`region VARCHAR\`
3. Inserts 12+ rows with correct decimal totals and region values (include NULL region for 2 rows — region data was missing in the original)
4. Ends with \`SELECT * FROM staging_orders ORDER BY order_id\`

### Expected output columns
\`order_id\`, \`customer_name\`, \`order_total\`, \`order_date\`, \`region\``,
  descriptionFr: `## Migration de schema d'une table de staging

L'equipe data platform reconstruit la table \`staging_orders\` apres une revue de schema. L'ancienne table manque d'une colonne \`region VARCHAR\` et la colonne \`order_total\` etait typee \`INTEGER\` (tronquant les centimes). Le nouveau schema doit utiliser \`DECIMAL(10,2)\` pour \`order_total\` et ajouter la colonne \`region\`.

Les etapes de migration sont : DROP l'ancienne table, CREATE la nouvelle, INSERT les donnees migrees (en convertissant les montants au bon type), et verifier avec un SELECT.

### Schema (etat initial — ancienne table)

**staging_orders** (pre-existante, a supprimer)
| Colonne | Type |
|---------|------|
| order_id | INTEGER |
| customer_name | VARCHAR |
| order_total | INTEGER |
| order_date | DATE |

### Consigne

Ecrivez un script de migration qui :
1. Supprime la table \`staging_orders\` existante
2. Cree une nouvelle table \`staging_orders\` avec les colonnes : \`order_id INTEGER\`, \`customer_name VARCHAR\`, \`order_total DECIMAL(10,2)\`, \`order_date DATE\`, \`region VARCHAR\`
3. Insere 12+ lignes avec des totaux decimaux corrects et des valeurs de region (incluez NULL region pour 2 lignes — les donnees de region etaient manquantes dans l'original)
4. Termine par \`SELECT * FROM staging_orders ORDER BY order_id\`

### Colonnes attendues en sortie
\`order_id\`, \`customer_name\`, \`order_total\`, \`order_date\`, \`region\``,
  hint: "Use DROP TABLE staging_orders; to remove the old table, then CREATE TABLE staging_orders (...) with the new column list. The DROP must come before the CREATE. Insert migrated data with correct DECIMAL values.",
  hintFr: "Utilisez DROP TABLE staging_orders; pour supprimer l'ancienne table, puis CREATE TABLE staging_orders (...) avec la nouvelle liste de colonnes. Le DROP doit preceder le CREATE. Inserez les donnees migrees avec des valeurs DECIMAL correctes.",
  schema: `CREATE TABLE staging_orders (
  order_id       INTEGER,
  customer_name  VARCHAR,
  order_total    INTEGER,
  order_date     DATE
);

INSERT INTO staging_orders VALUES
  (1,  'Alice Johnson',  250, '2024-01-15'),
  (2,  'Bob Smith',       45, '2024-01-16'),
  (3,  'Carol White',    189, '2024-01-17'),
  (4,  'David Brown',     99, '2024-01-18'),
  (5,  'Eva Martinez',   320, '2024-01-19'),
  (6,  'Frank Lee',       15, '2024-01-20'),
  (7,  'Grace Kim',      100, '2024-01-21'),
  (8,  'Hank Davis',     550, '2024-01-22'),
  (9,  'Irene Clark',     72, '2024-01-23'),
  (10, 'Jack Wilson',    101, '2024-01-24'),
  (11, 'Karen Hall',     200, '2024-01-25'),
  (12, 'Leo Turner',      88, '2024-01-26');`,
  solutionQuery: `DROP TABLE staging_orders;

CREATE TABLE staging_orders (
  order_id       INTEGER,
  customer_name  VARCHAR,
  order_total    DECIMAL(10,2),
  order_date     DATE,
  region         VARCHAR
);

INSERT INTO staging_orders VALUES
  (1,  'Alice Johnson',  250.00, '2024-01-15', 'West'),
  (2,  'Bob Smith',       45.99, '2024-01-16', 'East'),
  (3,  'Carol White',    189.50, '2024-01-17', 'East'),
  (4,  'David Brown',     99.99, '2024-01-18', NULL),
  (5,  'Eva Martinez',   320.00, '2024-01-19', 'South'),
  (6,  'Frank Lee',       15.75, '2024-01-20', 'West'),
  (7,  'Grace Kim',      100.00, '2024-01-21', 'Midwest'),
  (8,  'Hank Davis',     550.75, '2024-01-22', 'East'),
  (9,  'Irene Clark',     72.30, '2024-01-23', 'South'),
  (10, 'Jack Wilson',    101.01, '2024-01-24', NULL),
  (11, 'Karen Hall',     200.00, '2024-01-25', 'West'),
  (12, 'Leo Turner',      88.50, '2024-01-26', 'Midwest');

SELECT * FROM staging_orders ORDER BY order_id;`,
  solutionExplanation: `## Explanation

### Drop-Recreate Migration Pattern
This pattern is the simplest form of schema migration: discard the old structure entirely and rebuild from scratch. It is appropriate when the schema change is incompatible with \`ALTER TABLE\` (e.g., changing a column type from INTEGER to DECIMAL) or when the table is a staging table with no persistence requirements.

### Step-by-step
1. **DROP TABLE staging_orders**: Removes the old table and all its data. This is irreversible — in a production context, you would first back up the data or use a rename strategy. Here the table is a staging scratch space, so dropping is acceptable.
2. **CREATE TABLE staging_orders (new schema)**: Creates the table fresh with two changes: \`order_total DECIMAL(10,2)\` (was INTEGER) and the new \`region VARCHAR\` column. No data is carried over automatically.
3. **INSERT INTO ... VALUES**: Re-inserts migrated data with corrected decimal values (e.g., \`45.99\` instead of \`45\`). Two rows have \`NULL\` region, reflecting that the original source did not have region data for those orders — a realistic partial-migration scenario.
4. **SELECT * ORDER BY order_id**: Verifies the new schema and data are correct.

### Why this approach
For staging tables (temporary landing zones for raw data), drop-recreate is preferred over ALTER TABLE because:
- Staging tables are rebuilt every pipeline run anyway
- It avoids complex multi-step ALTER migrations for type changes
- The script is idempotent: run it multiple times and you always end up with the correct schema

### When to use
- Staging or scratch tables that are rebuilt on each pipeline run
- Schema changes that are incompatible with ALTER TABLE (type changes, column removals)
- Development and test environments where data can be regenerated from source`,
  solutionExplanationFr: `## Explication

### Pattern Drop-Recreate Migration
Ce pattern est la forme la plus simple de migration de schema : supprimer entierement l'ancienne structure et la reconstruire de zero. Il est approprie quand le changement de schema est incompatible avec \`ALTER TABLE\` (ex. changer un type de colonne de INTEGER a DECIMAL) ou quand la table est une table de staging sans exigences de persistance.

### Etape par etape
1. **DROP TABLE staging_orders** : Supprime l'ancienne table et toutes ses donnees. C'est irreversible — dans un contexte de production, on sauvegarderait d'abord les donnees ou utiliserait une strategie de renommage. Ici la table est un espace de travail de staging, donc la suppression est acceptable.
2. **CREATE TABLE staging_orders (nouveau schema)** : Cree la table de zero avec deux modifications : \`order_total DECIMAL(10,2)\` (etait INTEGER) et la nouvelle colonne \`region VARCHAR\`. Aucune donnee n'est recuperee automatiquement.
3. **INSERT INTO ... VALUES** : Reinseree les donnees migrees avec des valeurs decimales corrigees (ex. \`45.99\` au lieu de \`45\`). Deux lignes ont un \`region\` NULL, refletant que la source originale n'avait pas de donnees de region pour ces commandes — un scenario de migration partielle realiste.
4. **SELECT * ORDER BY order_id** : Verifie que le nouveau schema et les donnees sont corrects.

### Pourquoi cette approche
Pour les tables de staging (zones d'atterrissage temporaires pour les donnees brutes), drop-recreate est prefere a ALTER TABLE car :
- Les tables de staging sont reconstruites a chaque execution du pipeline de toute facon
- Cela evite des migrations ALTER en plusieurs etapes complexes pour les changements de type
- Le script est idempotent : executez-le plusieurs fois et vous obtenez toujours le schema correct

### Quand l'utiliser
- Tables de staging ou de travail reconstruites a chaque execution du pipeline
- Changements de schema incompatibles avec ALTER TABLE (changements de type, suppressions de colonnes)
- Environnements de developpement et de test ou les donnees peuvent etre regenerees depuis la source`,
  testCases: [
    {
      name: "default",
      description: "Returns all 12 migrated rows with correct DECIMAL totals and region column, including 2 NULL regions",
      descriptionFr: "Renvoie les 12 lignes migrees avec des totaux DECIMAL corrects et la colonne region, incluant 2 regions NULL",
      expectedColumns: ["order_id", "customer_name", "order_total", "order_date", "region"],
      expectedRows: [
        { order_id: 1,  customer_name: "Alice Johnson", order_total: 250.00, order_date: "2024-01-15", region: "West"    },
        { order_id: 2,  customer_name: "Bob Smith",     order_total: 45.99,  order_date: "2024-01-16", region: "East"    },
        { order_id: 3,  customer_name: "Carol White",   order_total: 189.50, order_date: "2024-01-17", region: "East"    },
        { order_id: 4,  customer_name: "David Brown",   order_total: 99.99,  order_date: "2024-01-18", region: null      },
        { order_id: 5,  customer_name: "Eva Martinez",  order_total: 320.00, order_date: "2024-01-19", region: "South"   },
        { order_id: 6,  customer_name: "Frank Lee",     order_total: 15.75,  order_date: "2024-01-20", region: "West"    },
        { order_id: 7,  customer_name: "Grace Kim",     order_total: 100.00, order_date: "2024-01-21", region: "Midwest" },
        { order_id: 8,  customer_name: "Hank Davis",    order_total: 550.75, order_date: "2024-01-22", region: "East"    },
        { order_id: 9,  customer_name: "Irene Clark",   order_total: 72.30,  order_date: "2024-01-23", region: "South"   },
        { order_id: 10, customer_name: "Jack Wilson",   order_total: 101.01, order_date: "2024-01-24", region: null      },
        { order_id: 11, customer_name: "Karen Hall",    order_total: 200.00, order_date: "2024-01-25", region: "West"    },
        { order_id: 12, customer_name: "Leo Turner",    order_total: 88.50,  order_date: "2024-01-26", region: "Midwest" },
      ],
      orderMatters: true,
    },
    {
      name: "null-regions",
      description: "Exactly 2 rows have NULL region (records with missing source data)",
      descriptionFr: "Exactement 2 lignes ont un region NULL (enregistrements avec donnees source manquantes)",
      expectedColumns: ["order_id", "customer_name", "order_total", "order_date", "region"],
      expectedRows: [
        { order_id: 4,  customer_name: "David Brown", order_total: 99.99,  order_date: "2024-01-18", region: null },
        { order_id: 10, customer_name: "Jack Wilson",  order_total: 101.01, order_date: "2024-01-24", region: null },
      ],
      orderMatters: false,
      setupSql: `DELETE FROM staging_orders WHERE region IS NOT NULL;`,
    },
  ],
};
