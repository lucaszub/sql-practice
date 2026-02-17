import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "93-quality-suite-report",
  title: "Comprehensive Data Quality Suite Report",
  titleFr: "Rapport complet de la suite de qualite des donnees",
  difficulty: "hard",
  category: "data-quality",
  description: `## Comprehensive Data Quality Suite Report

The data governance team needs a single dashboard query that consolidates all data quality dimensions into one report. Before triggering the daily BI refresh, a pipeline gate evaluates four checks across multiple tables: completeness (NULLs in critical columns), uniqueness (duplicate keys), referential integrity (orphaned records), and freshness (stale load timestamp). The output drives an automated alerting system.

### Schema

**dim_customers**
| Column | Type |
|--------|------|
| customer_id | INTEGER |
| email | VARCHAR |
| country | VARCHAR |

**fact_sales**
| Column | Type |
|--------|------|
| sale_id | INTEGER |
| customer_id | INTEGER |
| sale_date | DATE |
| revenue | DECIMAL(10,2) |

**dim_products**
| Column | Type |
|--------|------|
| product_id | INTEGER |
| product_name | VARCHAR |

**fact_sale_items**
| Column | Type |
|--------|------|
| item_id | INTEGER |
| sale_id | INTEGER |
| product_id | INTEGER |
| quantity | INTEGER |

**load_log**
| Column | Type |
|--------|------|
| table_name | VARCHAR |
| last_loaded_ts | TIMESTAMP |
| check_ts | TIMESTAMP |

### Task

Write a single query returning one row per check:
- \`check_type\`: the category of the check (\`'completeness'\`, \`'uniqueness'\`, \`'referential_integrity'\`, \`'freshness'\`)
- \`table_name\`: the table being checked
- \`status\`: \`'PASS'\` or \`'FAIL'\`
- \`issue_count\`: number of issues found (0 if PASS)

Checks to implement:
1. **Completeness** on \`dim_customers\`: count rows where \`email\` IS NULL
2. **Completeness** on \`dim_customers\`: count rows where \`country\` IS NULL
3. **Uniqueness** on \`fact_sales\`: count duplicate \`sale_id\` values (occurrences beyond the first)
4. **Referential integrity** on \`fact_sale_items\`: count items referencing non-existent \`sale_id\` in \`fact_sales\`
5. **Referential integrity** on \`fact_sale_items\`: count items referencing non-existent \`product_id\` in \`dim_products\`
6. **Freshness** on \`fact_sales\`: FAIL if \`last_loaded_ts < check_ts - INTERVAL 24 HOURS\`

Order by \`check_type\` ASC, then \`table_name\` ASC.

### Expected output columns
\`check_type\`, \`table_name\`, \`status\`, \`issue_count\``,
  descriptionFr: `## Rapport complet de la suite de qualite des donnees

L'equipe de gouvernance des donnees a besoin d'une requete de tableau de bord unique qui consolide toutes les dimensions de qualite des donnees en un seul rapport. Avant de declencher le rafraichissement BI quotidien, une porte de pipeline evalue quatre verifications sur plusieurs tables : completude (NULLs dans les colonnes critiques), unicite (cles dupliquees), integrite referentielle (enregistrements orphelins) et fraicheur (horodatage de chargement obsolete). La sortie alimente un systeme d'alerte automatise.

### Schema

**dim_customers**
| Colonne | Type |
|---------|------|
| customer_id | INTEGER |
| email | VARCHAR |
| country | VARCHAR |

**fact_sales**
| Colonne | Type |
|---------|------|
| sale_id | INTEGER |
| customer_id | INTEGER |
| sale_date | DATE |
| revenue | DECIMAL(10,2) |

**dim_products**
| Colonne | Type |
|---------|------|
| product_id | INTEGER |
| product_name | VARCHAR |

**fact_sale_items**
| Colonne | Type |
|---------|------|
| item_id | INTEGER |
| sale_id | INTEGER |
| product_id | INTEGER |
| quantity | INTEGER |

**load_log**
| Colonne | Type |
|---------|------|
| table_name | VARCHAR |
| last_loaded_ts | TIMESTAMP |
| check_ts | TIMESTAMP |

### Tache

Ecrivez une requete unique retournant une ligne par verification :
- \`check_type\` : la categorie de la verification (\`'completeness'\`, \`'uniqueness'\`, \`'referential_integrity'\`, \`'freshness'\`)
- \`table_name\` : la table verifiee
- \`status\` : \`'PASS'\` ou \`'FAIL'\`
- \`issue_count\` : nombre de problemes trouves (0 si PASS)

Verifications a implementer :
1. **Completude** sur \`dim_customers\` : compter les lignes ou \`email\` est NULL
2. **Completude** sur \`dim_customers\` : compter les lignes ou \`country\` est NULL
3. **Unicite** sur \`fact_sales\` : compter les valeurs \`sale_id\` dupliquees (occurrences au-dela de la premiere)
4. **Integrite referentielle** sur \`fact_sale_items\` : compter les articles referencant un \`sale_id\` inexistant dans \`fact_sales\`
5. **Integrite referentielle** sur \`fact_sale_items\` : compter les articles referencant un \`product_id\` inexistant dans \`dim_products\`
6. **Fraicheur** sur \`fact_sales\` : FAIL si \`last_loaded_ts < check_ts - INTERVAL 24 HOURS\`

Triez par \`check_type\` ASC, puis \`table_name\` ASC.

### Colonnes attendues en sortie
\`check_type\`, \`table_name\`, \`status\`, \`issue_count\``,
  hint: "Build one CTE per check, then UNION ALL all checks at the end. For uniqueness, COUNT(*) - COUNT(DISTINCT sale_id) gives you the number of extra duplicates. For referential integrity, use LEFT JOIN + IS NULL.",
  hintFr: "Construisez un CTE par verification, puis UNION ALL toutes les verifications a la fin. Pour l'unicite, COUNT(*) - COUNT(DISTINCT sale_id) donne le nombre de doublons superflus. Pour l'integrite referentielle, utilisez LEFT JOIN + IS NULL.",
  schema: `CREATE TABLE dim_customers (
  customer_id INTEGER,
  email       VARCHAR,
  country     VARCHAR
);

CREATE TABLE fact_sales (
  sale_id     INTEGER,
  customer_id INTEGER,
  sale_date   DATE,
  revenue     DECIMAL(10,2)
);

CREATE TABLE dim_products (
  product_id   INTEGER,
  product_name VARCHAR
);

CREATE TABLE fact_sale_items (
  item_id    INTEGER,
  sale_id    INTEGER,
  product_id INTEGER,
  quantity   INTEGER
);

CREATE TABLE load_log (
  table_name     VARCHAR,
  last_loaded_ts TIMESTAMP,
  check_ts       TIMESTAMP
);

INSERT INTO dim_customers VALUES
  (1, 'alice@example.com', 'USA'),
  (2, NULL,                'France'),
  (3, 'carol@example.com', NULL),
  (4, 'dave@example.com',  'Germany'),
  (5, NULL,                'Japan'),
  (6, 'frank@example.com', 'UK'),
  (7, 'grace@example.com', NULL),
  (8, 'hiro@example.com',  'Japan');

INSERT INTO fact_sales VALUES
  (5001, 1, '2024-09-01', 120.00),
  (5002, 2, '2024-09-01', 340.50),
  (5003, 3, '2024-09-02', 89.99),
  (5001, 1, '2024-09-01', 120.00),
  (5004, 4, '2024-09-02', 210.00),
  (5005, 5, '2024-09-03', 175.00),
  (5006, 6, '2024-09-03', 95.00),
  (5007, 7, '2024-09-04', 430.00),
  (5002, 2, '2024-09-01', 340.50),
  (5008, 8, '2024-09-04', 60.00);

INSERT INTO dim_products VALUES
  (101, 'Laptop'),
  (102, 'Mouse'),
  (103, 'Keyboard'),
  (104, 'Monitor');

INSERT INTO fact_sale_items VALUES
  (1,  5001, 101, 1),
  (2,  5001, 102, 2),
  (3,  5002, 103, 1),
  (4,  5003, 999, 3),
  (5,  5004, 104, 1),
  (6,  5099, 101, 2),
  (7,  5005, 102, 1),
  (8,  5006, 103, 4),
  (9,  5007, 888, 1),
  (10, 5008, 104, 2);

INSERT INTO load_log VALUES
  ('fact_sales',
   TIMESTAMP '2024-09-04 06:00:00',
   TIMESTAMP '2024-09-05 08:00:00');`,
  solutionQuery: `WITH completeness_email AS (
  SELECT
    'completeness'     AS check_type,
    'dim_customers'    AS table_name,
    COUNT(*) - COUNT(email) AS issue_count
  FROM dim_customers
),
completeness_country AS (
  SELECT
    'completeness'     AS check_type,
    'dim_customers'    AS table_name,
    COUNT(*) - COUNT(country) AS issue_count
  FROM dim_customers
),
uniqueness_sales AS (
  SELECT
    'uniqueness'       AS check_type,
    'fact_sales'       AS table_name,
    COUNT(*) - COUNT(DISTINCT sale_id) AS issue_count
  FROM fact_sales
),
ref_integrity_sales AS (
  SELECT
    'referential_integrity' AS check_type,
    'fact_sale_items'       AS table_name,
    COUNT(*)                AS issue_count
  FROM fact_sale_items fsi
  LEFT JOIN fact_sales fs ON fsi.sale_id = fs.sale_id
  WHERE fs.sale_id IS NULL
),
ref_integrity_products AS (
  SELECT
    'referential_integrity' AS check_type,
    'fact_sale_items'       AS table_name,
    COUNT(*)                AS issue_count
  FROM fact_sale_items fsi
  LEFT JOIN dim_products dp ON fsi.product_id = dp.product_id
  WHERE dp.product_id IS NULL
),
freshness_sales AS (
  SELECT
    'freshness'  AS check_type,
    'fact_sales' AS table_name,
    CASE WHEN last_loaded_ts < check_ts - INTERVAL 24 HOURS THEN 1 ELSE 0 END AS issue_count
  FROM load_log
  WHERE table_name = 'fact_sales'
),
all_checks AS (
  SELECT check_type, table_name, issue_count FROM completeness_email
  UNION ALL
  SELECT check_type, table_name, issue_count FROM completeness_country
  UNION ALL
  SELECT check_type, table_name, issue_count FROM uniqueness_sales
  UNION ALL
  SELECT check_type, table_name, issue_count FROM ref_integrity_sales
  UNION ALL
  SELECT check_type, table_name, issue_count FROM ref_integrity_products
  UNION ALL
  SELECT check_type, table_name, issue_count FROM freshness_sales
)
SELECT
  check_type,
  table_name,
  CASE WHEN issue_count = 0 THEN 'PASS' ELSE 'FAIL' END AS status,
  issue_count
FROM all_checks
ORDER BY check_type ASC, table_name ASC;`,
  solutionExplanation: `## Explanation

### Pattern: Comprehensive Quality Suite via CTE + UNION ALL

Each quality dimension is implemented as an isolated CTE that produces a single \`issue_count\`. The final SELECT assembles them into a unified report with PASS/FAIL classification.

### Step-by-step
1. **\`completeness_email\` / \`completeness_country\`**: Use \`COUNT(*) - COUNT(col)\` to get NULL counts. Each produces one row for one column check.
2. **\`uniqueness_sales\`**: \`COUNT(*) - COUNT(DISTINCT sale_id)\` gives the number of extra rows beyond the first occurrence of each sale_id.
3. **\`ref_integrity_sales\`**: LEFT JOIN fact_sale_items to fact_sales; items with NULL parent sale_id are orphans.
4. **\`ref_integrity_products\`**: Same pattern against dim_products for broken product references.
5. **\`freshness_sales\`**: Reads the load_log and converts the staleness condition to 0 or 1 issue.
6. **\`all_checks\` + final SELECT**: UNION ALL aggregates all CTE rows; the outer query adds the PASS/FAIL label and sorts deterministically.

### Why this approach
- Each CTE is a self-contained, independently testable unit. Adding a new check requires adding one CTE and one UNION ALL branch.
- \`COUNT(*) - COUNT(DISTINCT key)\` is an elegant O(n) duplicate detector without a self-join.
- This structure maps directly to a data contract or SLA framework: one row per assertion, with a binary status.

### When to use
- Pipeline gate queries that must pass before a downstream process runs
- Data SLA dashboards tracking quality across a lakehouse
- Data contract enforcement in medallion architecture (Bronze → Silver validation)`,
  solutionExplanationFr: `## Explication

### Patron : Suite de qualite complete via CTE + UNION ALL

Chaque dimension de qualite est implementee comme un CTE isole qui produit un seul \`issue_count\`. Le SELECT final les assemble en un rapport unifie avec classification PASS/FAIL.

### Etape par etape
1. **\`completeness_email\` / \`completeness_country\`** : Utilisent \`COUNT(*) - COUNT(col)\` pour obtenir les comptes de NULLs. Chacun produit une ligne pour une verification de colonne.
2. **\`uniqueness_sales\`** : \`COUNT(*) - COUNT(DISTINCT sale_id)\` donne le nombre de lignes supplementaires au-dela de la premiere occurrence de chaque sale_id.
3. **\`ref_integrity_sales\`** : LEFT JOIN fact_sale_items vers fact_sales ; les articles avec sale_id parent NULL sont des orphelins.
4. **\`ref_integrity_products\`** : Meme patron contre dim_products pour les references produit cassees.
5. **\`freshness_sales\`** : Lit le load_log et convertit la condition d'obsolescence en 0 ou 1 probleme.
6. **\`all_checks\` + SELECT final** : UNION ALL agregre toutes les lignes CTE ; la requete externe ajoute le libelle PASS/FAIL et trie de maniere deterministe.

### Pourquoi cette approche
- Chaque CTE est une unite autonome et testable independamment. Ajouter une nouvelle verification necessite d'ajouter un CTE et une branche UNION ALL.
- \`COUNT(*) - COUNT(DISTINCT key)\` est un detecteur de doublons elegant en O(n) sans auto-jointure.
- Cette structure correspond directement a un cadre de contrat de donnees ou de SLA : une ligne par assertion, avec un statut binaire.

### Quand l'utiliser
- Requetes de porte de pipeline qui doivent passer avant l'execution d'un processus en aval
- Tableaux de bord SLA de donnees suivant la qualite dans un lakehouse
- Application de contrats de donnees dans l'architecture medallion (validation Bronze vers Silver)`,
  testCases: [
    {
      name: "default",
      description: "Base dataset: completeness FAIL (2 email, 2 country NULLs), uniqueness FAIL (2 duplicates), 2 ref integrity FAILs, freshness FAIL (26h stale)",
      descriptionFr: "Jeu de base : completude FAIL (2 email, 2 country NULLs), unicite FAIL (2 doublons), 2 integrite referentielle FAIL, fraicheur FAIL (26h obsolete)",
      expectedColumns: ["check_type", "table_name", "status", "issue_count"],
      expectedRows: [
        { check_type: "completeness",          table_name: "dim_customers",   status: "FAIL", issue_count: 2 },
        { check_type: "completeness",          table_name: "dim_customers",   status: "FAIL", issue_count: 2 },
        { check_type: "freshness",             table_name: "fact_sales",      status: "FAIL", issue_count: 1 },
        { check_type: "referential_integrity", table_name: "fact_sale_items", status: "FAIL", issue_count: 1 },
        { check_type: "referential_integrity", table_name: "fact_sale_items", status: "FAIL", issue_count: 2 },
        { check_type: "uniqueness",            table_name: "fact_sales",      status: "FAIL", issue_count: 2 },
      ],
      orderMatters: true,
    },
    {
      name: "all-pass-after-cleanup",
      description: "After fixing all issues, every check returns PASS with 0 issues",
      descriptionFr: "Apres correction de tous les problemes, chaque verification retourne PASS avec 0 probleme",
      setupSql: `UPDATE dim_customers SET email = 'placeholder@example.com' WHERE email IS NULL;
UPDATE dim_customers SET country = 'Unknown' WHERE country IS NULL;

DELETE FROM fact_sales
WHERE sale_id IN (SELECT sale_id FROM fact_sales GROUP BY sale_id HAVING COUNT(*) > 1)
  AND rowid NOT IN (
    SELECT MIN(rowid) FROM fact_sales GROUP BY sale_id
  );

DELETE FROM fact_sale_items
WHERE sale_id NOT IN (SELECT sale_id FROM fact_sales)
   OR product_id NOT IN (SELECT product_id FROM dim_products);

UPDATE load_log
SET last_loaded_ts = check_ts - INTERVAL 1 HOUR
WHERE table_name = 'fact_sales';`,
      expectedColumns: ["check_type", "table_name", "status", "issue_count"],
      expectedRows: [
        { check_type: "completeness",          table_name: "dim_customers",   status: "PASS", issue_count: 0 },
        { check_type: "completeness",          table_name: "dim_customers",   status: "PASS", issue_count: 0 },
        { check_type: "freshness",             table_name: "fact_sales",      status: "PASS", issue_count: 0 },
        { check_type: "referential_integrity", table_name: "fact_sale_items", status: "PASS", issue_count: 0 },
        { check_type: "referential_integrity", table_name: "fact_sale_items", status: "PASS", issue_count: 0 },
        { check_type: "uniqueness",            table_name: "fact_sales",      status: "PASS", issue_count: 0 },
      ],
      orderMatters: true,
    },
  ],
};
