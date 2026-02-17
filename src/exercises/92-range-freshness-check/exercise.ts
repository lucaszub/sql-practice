import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "92-range-freshness-check",
  title: "Order Data Freshness and Range Validation",
  titleFr: "Validation de la fraicheur et des plages de valeurs des commandes",
  difficulty: "hard",
  category: "data-quality",
  description: `## Order Data Freshness and Range Validation

The data platform team runs a nightly validation suite before the BI dashboard refresh. Two critical checks must pass: (1) the data must be **fresh** — the last load timestamp must be within the last 24 hours relative to a reference time, and (2) all order records must have **valid ranges** — \`amount\` must be positive and \`quantity\` must be between 1 and 1000.

Write a single query that returns a summary of both checks.

### Schema

**fact_orders**
| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| order_date | DATE |
| amount | DECIMAL(10,2) |
| quantity | INTEGER |

**pipeline_metadata**
| Column | Type |
|--------|------|
| pipeline_name | VARCHAR |
| last_load_ts | TIMESTAMP |
| reference_ts | TIMESTAMP |

### Task

Write a query that produces one row per check:
- \`check_name\`: a label for the check (e.g. \`'freshness'\`, \`'amount_positive'\`, \`'quantity_range'\`)
- \`status\`: \`'PASS'\` or \`'FAIL'\`
- \`details\`: a descriptive message (e.g. \`'Last load 2.5h ago'\` or \`'3 rows with invalid amount'\`)

Freshness check: PASS if \`last_load_ts >= reference_ts - INTERVAL 24 HOURS\`, FAIL otherwise.
Amount check: PASS if no rows have \`amount <= 0\`, FAIL with count of invalid rows.
Quantity check: PASS if no rows have \`quantity < 1 OR quantity > 1000\`, FAIL with count of invalid rows.

Order by \`check_name\` ASC.

### Expected output columns
\`check_name\`, \`status\`, \`details\``,
  descriptionFr: `## Validation de la fraicheur et des plages de valeurs des commandes

L'equipe de la plateforme de donnees execute une suite de validation nocturne avant le rafraichissement du tableau de bord BI. Deux verifications critiques doivent passer : (1) les donnees doivent etre **fraiches** — l'horodatage du dernier chargement doit etre dans les 24 dernieres heures par rapport a un temps de reference, et (2) tous les enregistrements de commandes doivent avoir des **plages valides** — \`amount\` doit etre positif et \`quantity\` doit etre entre 1 et 1000.

Ecrivez une requete unique qui retourne un resume des deux verifications.

### Schema

**fact_orders**
| Colonne | Type |
|---------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| order_date | DATE |
| amount | DECIMAL(10,2) |
| quantity | INTEGER |

**pipeline_metadata**
| Colonne | Type |
|---------|------|
| pipeline_name | VARCHAR |
| last_load_ts | TIMESTAMP |
| reference_ts | TIMESTAMP |

### Tache

Ecrivez une requete qui produit une ligne par verification :
- \`check_name\` : un libelle pour la verification (ex. \`'freshness'\`, \`'amount_positive'\`, \`'quantity_range'\`)
- \`status\` : \`'PASS'\` ou \`'FAIL'\`
- \`details\` : un message descriptif (ex. \`'Last load 2.5h ago'\` ou \`'3 rows with invalid amount'\`)

Verification fraicheur : PASS si \`last_load_ts >= reference_ts - INTERVAL 24 HOURS\`, FAIL sinon.
Verification amount : PASS si aucune ligne n'a \`amount <= 0\`, FAIL avec le nombre de lignes invalides.
Verification quantity : PASS si aucune ligne n'a \`quantity < 1 OR quantity > 1000\`, FAIL avec le nombre de lignes invalides.

Triez par \`check_name\` ASC.

### Colonnes attendues en sortie
\`check_name\`, \`status\`, \`details\``,
  hint: "Use CTEs for each check, then UNION ALL the results. For freshness, use DATEDIFF or timestamp arithmetic. For range checks, use COUNT(*) FILTER (WHERE condition) to count violations.",
  hintFr: "Utilisez des CTEs pour chaque verification, puis UNION ALL les resultats. Pour la fraicheur, utilisez DATEDIFF ou l'arithmetique sur les timestamps. Pour les verifications de plage, utilisez COUNT(*) FILTER (WHERE condition) pour compter les violations.",
  schema: `CREATE TABLE fact_orders (
  order_id    INTEGER,
  customer_id INTEGER,
  order_date  DATE,
  amount      DECIMAL(10,2),
  quantity    INTEGER
);

CREATE TABLE pipeline_metadata (
  pipeline_name VARCHAR,
  last_load_ts  TIMESTAMP,
  reference_ts  TIMESTAMP
);

INSERT INTO fact_orders VALUES
  (3001, 101, '2024-06-01',  250.00,   2),
  (3002, 102, '2024-06-01',  -15.00,   1),
  (3003, 103, '2024-06-01',  870.50,   5),
  (3004, 104, '2024-06-02',    0.00,   3),
  (3005, 105, '2024-06-02',  120.00,   0),
  (3006, 106, '2024-06-02',  430.00,  10),
  (3007, 107, '2024-06-03',   89.99,   1),
  (3008, 108, '2024-06-03', 1200.00,1500),
  (3009, 109, '2024-06-03',  310.00,   7),
  (3010, 110, '2024-06-04',   55.00,   2),
  (3011, 111, '2024-06-04',  780.00,   4),
  (3012, 112, '2024-06-04',  -50.00,   1),
  (3013, 113, '2024-06-05',  640.00,   3),
  (3014, 114, '2024-06-05',  195.00,   6),
  (3015, 115, '2024-06-05',  920.00,   2);

INSERT INTO pipeline_metadata VALUES
  ('fact_orders_load',
   TIMESTAMP '2024-06-05 22:30:00',
   TIMESTAMP '2024-06-06 08:00:00');`,
  solutionQuery: `WITH meta AS (
  SELECT last_load_ts, reference_ts
  FROM pipeline_metadata
  WHERE pipeline_name = 'fact_orders_load'
),
freshness_check AS (
  SELECT
    'freshness' AS check_name,
    CASE
      WHEN m.last_load_ts >= m.reference_ts - INTERVAL 24 HOURS
      THEN 'PASS'
      ELSE 'FAIL'
    END AS status,
    CASE
      WHEN m.last_load_ts >= m.reference_ts - INTERVAL 24 HOURS
      THEN 'Last load ' ||
           CAST(ROUND(DATEDIFF('minute', m.last_load_ts, m.reference_ts) / 60.0, 1) AS VARCHAR) ||
           'h ago'
      ELSE 'Last load ' ||
           CAST(ROUND(DATEDIFF('minute', m.last_load_ts, m.reference_ts) / 60.0, 1) AS VARCHAR) ||
           'h ago — exceeds 24h threshold'
    END AS details
  FROM meta m
),
amount_check AS (
  SELECT
    'amount_positive' AS check_name,
    CASE WHEN COUNT(*) FILTER (WHERE amount <= 0) = 0 THEN 'PASS' ELSE 'FAIL' END AS status,
    CASE
      WHEN COUNT(*) FILTER (WHERE amount <= 0) = 0
      THEN 'All amounts are positive'
      ELSE CAST(COUNT(*) FILTER (WHERE amount <= 0) AS VARCHAR) || ' rows with invalid amount'
    END AS details
  FROM fact_orders
),
quantity_check AS (
  SELECT
    'quantity_range' AS check_name,
    CASE WHEN COUNT(*) FILTER (WHERE quantity < 1 OR quantity > 1000) = 0 THEN 'PASS' ELSE 'FAIL' END AS status,
    CASE
      WHEN COUNT(*) FILTER (WHERE quantity < 1 OR quantity > 1000) = 0
      THEN 'All quantities in range [1, 1000]'
      ELSE CAST(COUNT(*) FILTER (WHERE quantity < 1 OR quantity > 1000) AS VARCHAR) || ' rows with invalid quantity'
    END AS details
  FROM fact_orders
)
SELECT check_name, status, details FROM freshness_check
UNION ALL
SELECT check_name, status, details FROM amount_check
UNION ALL
SELECT check_name, status, details FROM quantity_check
ORDER BY check_name ASC;`,
  solutionExplanation: `## Explanation

### Pattern: Multi-Check Quality Report via CTE + UNION ALL

Each check is isolated in its own CTE, then combined with UNION ALL into a unified report row set.

### Step-by-step
1. **\`meta\` CTE**: Pulls the reference and load timestamps once to avoid re-reading the metadata table in each check.
2. **\`freshness_check\`**: Computes the time gap between last_load_ts and reference_ts using \`DATEDIFF('minute', ...)\`. The CASE expression sets 'PASS' or 'FAIL' and builds the details string.
3. **\`amount_check\`**: Uses DuckDB's \`COUNT(*) FILTER (WHERE amount <= 0)\` — cleaner than \`SUM(CASE WHEN ...)\` — to count violations in one pass.
4. **\`quantity_check\`**: Same pattern for the [1, 1000] range constraint.
5. **Final UNION ALL + ORDER BY**: Assembles the three rows into one result set, sorted alphabetically for deterministic output.

### Why this approach
- Isolating each check in a CTE makes it trivial to add or remove checks without restructuring the query.
- \`COUNT(*) FILTER (WHERE ...))\` is idiomatic DuckDB — avoids verbose CASE WHEN in aggregations.
- The UNION ALL structure naturally maps to a pipeline assertion framework where each row can be evaluated independently.

### When to use
- Nightly data quality gates before dashboard refresh
- Pre-load validation in ELT pipelines
- Data SLA monitoring dashboards`,
  solutionExplanationFr: `## Explication

### Patron : Rapport de qualite multi-verifications via CTE + UNION ALL

Chaque verification est isolee dans son propre CTE, puis combinee avec UNION ALL en un ensemble de lignes de rapport unifie.

### Etape par etape
1. **CTE \`meta\`** : Recupere les horodatages de reference et de chargement une seule fois pour eviter de relire la table de metadonnees dans chaque verification.
2. **\`freshness_check\`** : Calcule l'ecart de temps entre last_load_ts et reference_ts en utilisant \`DATEDIFF('minute', ...)\`. L'expression CASE definit 'PASS' ou 'FAIL' et construit la chaine de details.
3. **\`amount_check\`** : Utilise le \`COUNT(*) FILTER (WHERE amount <= 0)\` de DuckDB — plus propre que \`SUM(CASE WHEN ...)\` — pour compter les violations en un seul passage.
4. **\`quantity_check\`** : Meme patron pour la contrainte de plage [1, 1000].
5. **UNION ALL final + ORDER BY** : Assemble les trois lignes en un seul jeu de resultats, trie alphabetiquement pour une sortie deterministe.

### Pourquoi cette approche
- Isoler chaque verification dans un CTE facilite l'ajout ou la suppression de verifications sans restructurer la requete.
- \`COUNT(*) FILTER (WHERE ...)\` est idiomatique DuckDB — evite les CASE WHEN verbeux dans les agregations.
- La structure UNION ALL correspond naturellement a un cadre d'assertions de pipeline ou chaque ligne peut etre evaluee independamment.

### Quand l'utiliser
- Portes de qualite des donnees nocturnes avant le rafraichissement du tableau de bord
- Validation pre-chargement dans les pipelines ELT
- Tableaux de bord de surveillance des SLA de donnees`,
  testCases: [
    {
      name: "default",
      description: "All three checks from base data: freshness PASS (9.5h ago), amount FAIL (3 rows), quantity FAIL (2 rows)",
      descriptionFr: "Les trois verifications sur les donnees de base : fraicheur PASS (9.5h), amount FAIL (3 lignes), quantity FAIL (2 lignes)",
      expectedColumns: ["check_name", "status", "details"],
      expectedRows: [
        { check_name: "amount_positive", status: "FAIL", details: "3 rows with invalid amount" },
        { check_name: "freshness",       status: "PASS", details: "Last load 9.5h ago" },
        { check_name: "quantity_range",  status: "FAIL", details: "2 rows with invalid quantity" },
      ],
      orderMatters: true,
    },
    {
      name: "all-pass-after-cleanup",
      description: "After fixing bad rows and updating load timestamp, all checks pass",
      descriptionFr: "Apres correction des mauvaises lignes et mise a jour du timestamp de chargement, toutes les verifications passent",
      setupSql: `DELETE FROM fact_orders WHERE amount <= 0 OR quantity < 1 OR quantity > 1000;
UPDATE pipeline_metadata
SET last_load_ts = TIMESTAMP '2024-06-06 07:00:00'
WHERE pipeline_name = 'fact_orders_load';`,
      expectedColumns: ["check_name", "status", "details"],
      expectedRows: [
        { check_name: "amount_positive", status: "PASS", details: "All amounts are positive" },
        { check_name: "freshness",       status: "PASS", details: "Last load 1.0h ago" },
        { check_name: "quantity_range",  status: "PASS", details: "All quantities in range [1, 1000]" },
      ],
      orderMatters: true,
    },
  ],
};
