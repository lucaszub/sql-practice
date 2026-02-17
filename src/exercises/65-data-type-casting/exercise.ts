import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "65-data-type-casting",
  title: "Data Type Casting: Cleaning a Raw Events Table",
  titleFr: "Transtypage de données : nettoyage d'une table d'événements bruts",
  difficulty: "medium",
  category: "data-types-constraints",
  description: `## Data Type Casting: Cleaning a Raw Events Table

The data platform team ingested clickstream events from a third-party vendor. Because the vendor exports everything as CSV, the staging table \`raw_events\` has **all columns as VARCHAR** — including \`event_date\`, \`amount\`, and \`quantity\`. Before these events can be used in revenue calculations, they must be **cast to proper types** so that arithmetic and date filtering work correctly.

### Schema

**raw_events**
| Column | Type |
|--------|------|
| event_id | VARCHAR |
| event_date | VARCHAR (stored as 'YYYY-MM-DD') |
| event_type | VARCHAR |
| amount | VARCHAR (stored as decimal string e.g. '19.99') |
| quantity | VARCHAR (stored as integer string e.g. '3') |
| customer_id | VARCHAR |

### Task

Write a query that returns cleaned event data by casting each column to its proper type:
- \`event_id\` → INTEGER
- \`event_date\` → DATE
- \`amount\` → DECIMAL(10,2)
- \`quantity\` → INTEGER
- Compute \`revenue\` as the product of the cast \`amount\` and \`quantity\`
- Keep \`event_type\` and \`customer_id\` as VARCHAR

Filter to only \`'purchase'\` events. Order by \`event_date\` ASC, then \`event_id\` ASC.

### Expected output columns
\`event_id\`, \`event_date\`, \`event_type\`, \`customer_id\`, \`amount\`, \`quantity\`, \`revenue\``,
  descriptionFr: `## Transtypage de données : nettoyage d'une table d'événements bruts

L'équipe data platform a ingéré des événements clickstream d'un fournisseur tiers. Comme le fournisseur exporte tout en CSV, la table de staging \`raw_events\` a **toutes les colonnes en VARCHAR** — y compris \`event_date\`, \`amount\` et \`quantity\`. Avant que ces événements puissent être utilisés dans les calculs de revenus, ils doivent être **transtypés vers les bons types** pour que l'arithmétique et le filtrage par date fonctionnent correctement.

### Schéma

**raw_events**
| Colonne | Type |
|---------|------|
| event_id | VARCHAR |
| event_date | VARCHAR (stocké comme 'YYYY-MM-DD') |
| event_type | VARCHAR |
| amount | VARCHAR (stocké comme chaîne décimale ex. '19.99') |
| quantity | VARCHAR (stocké comme chaîne entière ex. '3') |
| customer_id | VARCHAR |

### Tâche

Écrire une requête qui retourne les données d'événements nettoyées en transtypant chaque colonne vers son bon type :
- \`event_id\` → INTEGER
- \`event_date\` → DATE
- \`amount\` → DECIMAL(10,2)
- \`quantity\` → INTEGER
- Calculer \`revenue\` comme le produit de \`amount\` et \`quantity\` transtypés
- Conserver \`event_type\` et \`customer_id\` comme VARCHAR

Filtrer uniquement les événements \`'purchase'\`. Trier par \`event_date\` ASC, puis \`event_id\` ASC.

### Colonnes attendues en sortie
\`event_id\`, \`event_date\`, \`event_type\`, \`customer_id\`, \`amount\`, \`quantity\`, \`revenue\``,
  hint: "In DuckDB, use CAST(col AS TYPE) or the shorthand col::TYPE. For example: CAST(amount AS DECIMAL(10,2)) or amount::DECIMAL(10,2). Multiply the cast values to get revenue.",
  hintFr: "Dans DuckDB, utilisez CAST(col AS TYPE) ou le raccourci col::TYPE. Par exemple : CAST(amount AS DECIMAL(10,2)) ou amount::DECIMAL(10,2). Multipliez les valeurs transtypées pour obtenir revenue.",
  schema: `CREATE TABLE raw_events (
  event_id    VARCHAR,
  event_date  VARCHAR,
  event_type  VARCHAR,
  amount      VARCHAR,
  quantity    VARCHAR,
  customer_id VARCHAR
);

INSERT INTO raw_events VALUES
  ('1',  '2024-01-05', 'purchase', '149.99', '1', 'C001'),
  ('2',  '2024-01-07', 'view',     '0.00',   '1', 'C002'),
  ('3',  '2024-01-10', 'purchase', '29.99',  '3', 'C003'),
  ('4',  '2024-01-12', 'purchase', '89.99',  '1', 'C001'),
  ('5',  '2024-01-15', 'view',     '0.00',   '1', 'C004'),
  ('6',  '2024-01-20', 'purchase', '199.99', '2', 'C005'),
  ('7',  '2024-02-01', 'refund',   '149.99', '1', 'C001'),
  ('8',  '2024-02-03', 'purchase', '49.99',  '1', 'C006'),
  ('9',  '2024-02-08', 'purchase', '9.99',   '5', 'C002'),
  ('10', '2024-02-10', 'view',     '0.00',   '1', 'C007'),
  ('11', '2024-02-14', 'purchase', '299.99', '1', 'C008'),
  ('12', '2024-02-18', 'purchase', '14.99',  '2', 'C003'),
  ('13', '2024-03-01', 'refund',   '29.99',  '3', 'C003'),
  ('14', '2024-03-05', 'purchase', '59.99',  '1', 'C009'),
  ('15', '2024-03-08', 'purchase', '24.99',  '4', 'C004'),
  ('16', '2024-03-12', 'view',     '0.00',   '1', 'C010'),
  ('17', '2024-03-15', 'purchase', '399.99', '1', 'C005'),
  ('18', '2024-03-20', 'purchase', '19.99',  '3', 'C006'),
  ('19', '2024-03-25', 'refund',   '89.99',  '1', 'C001'),
  ('20', '2024-03-28', 'purchase', '74.99',  '2', 'C007');`,
  solutionQuery: `SELECT
  CAST(event_id   AS INTEGER)      AS event_id,
  CAST(event_date AS DATE)         AS event_date,
  event_type,
  customer_id,
  CAST(amount     AS DECIMAL(10,2)) AS amount,
  CAST(quantity   AS INTEGER)      AS quantity,
  CAST(amount AS DECIMAL(10,2)) * CAST(quantity AS INTEGER) AS revenue
FROM raw_events
WHERE event_type = 'purchase'
ORDER BY CAST(event_date AS DATE) ASC, CAST(event_id AS INTEGER) ASC;`,
  solutionExplanation: `## Explanation

### Pattern: Type casting for staging-to-clean layer transformation

**Type casting** is the core operation in the Bronze → Silver layer of a data lakehouse (medallion architecture). Raw ingestion tables store everything as strings to avoid load failures; the cleaning layer applies CAST to enable correct computation.

### Step-by-step
1. \`CAST(event_id AS INTEGER)\`: The event ID arrived as a string \`'1'\`, \`'2'\`, etc. Casting to INTEGER enables numeric sorting and JOIN operations with other integer-keyed tables.
2. \`CAST(event_date AS DATE)\`: String \`'2024-01-05'\` becomes a proper DATE, enabling date arithmetic, \`DATE_TRUNC\`, \`DATEDIFF\`, and correct chronological ordering.
3. \`CAST(amount AS DECIMAL(10,2))\`: String \`'149.99'\` becomes a decimal number. Without this, \`'9.99' > '199.99'\` would be TRUE (string comparison), causing wrong revenue totals.
4. \`CAST(quantity AS INTEGER)\`: String \`'3'\` becomes the integer 3 so multiplication works correctly.
5. **revenue**: The product of cast amount × cast quantity. Both casts must happen before the multiplication.
6. **WHERE event_type = 'purchase'**: Filters out \`'view'\` and \`'refund'\` events — only purchases generate revenue.
7. **ORDER BY with casts**: \`ORDER BY CAST(event_date AS DATE)\` ensures chronological ordering, not lexicographic string ordering.

### DuckDB note
DuckDB supports the PostgreSQL-style shorthand: \`amount::DECIMAL(10,2)\` is equivalent to \`CAST(amount AS DECIMAL(10,2))\`. Both are valid.

### Why
Running revenue calculations on raw VARCHAR columns silently produces wrong results — string \`'9.99' * '5'\` is a type error or wrong cast in most engines. Explicit CAST makes the transformation visible and auditable.

### When to use
- Any Bronze → Silver / Raw → Clean pipeline step.
- Validating third-party data exports where types cannot be trusted.
- Before joining raw staging tables with typed dimension tables.`,
  solutionExplanationFr: `## Explication

### Modèle : Transtypage pour la transformation de la couche staging vers la couche propre

Le **transtypage** est l'opération centrale de la couche Bronze → Silver d'un data lakehouse (architecture medallion). Les tables d'ingestion brutes stockent tout en chaînes pour éviter les échecs de chargement ; la couche de nettoyage applique CAST pour permettre les calculs corrects.

### Étape par étape
1. \`CAST(event_id AS INTEGER)\` : L'event ID est arrivé comme chaîne. Le cast en INTEGER permet le tri numérique et les opérations JOIN.
2. \`CAST(event_date AS DATE)\` : La chaîne \`'2024-01-05'\` devient une vraie DATE, permettant l'arithmétique de dates et \`DATE_TRUNC\`.
3. \`CAST(amount AS DECIMAL(10,2))\` : Sans ce cast, \`'9.99' > '199.99'\` serait TRUE (comparaison de chaînes).
4. \`CAST(quantity AS INTEGER)\` : Permet la multiplication correcte.
5. **revenue** : Produit de amount × quantity transtypés.
6. **WHERE event_type = 'purchase'** : Filtre les vues et remboursements.
7. **ORDER BY avec casts** : Assure un tri chronologique, pas lexicographique.

### Note DuckDB
DuckDB supporte le raccourci style PostgreSQL : \`amount::DECIMAL(10,2)\` équivaut à \`CAST(amount AS DECIMAL(10,2))\`.

### Pourquoi
Les calculs de revenus sur des colonnes VARCHAR brutes produisent silencieusement des résultats incorrects.

### Quand l'utiliser
- Toute étape Bronze → Silver dans un pipeline de données.
- Validation des exports de données tierces.`,
  testCases: [
    {
      name: "default",
      description: "Returns 13 purchase events with correctly cast types and revenue, ordered by event_date then event_id",
      descriptionFr: "Retourne 13 événements d'achat avec les types correctement transtypés et revenue, triés par event_date puis event_id",
      expectedColumns: ["event_id", "event_date", "event_type", "customer_id", "amount", "quantity", "revenue"],
      expectedRows: [
        { event_id: 1,  event_date: "2024-01-05", event_type: "purchase", customer_id: "C001", amount: 149.99, quantity: 1, revenue: 149.99 },
        { event_id: 3,  event_date: "2024-01-10", event_type: "purchase", customer_id: "C003", amount: 29.99,  quantity: 3, revenue: 89.97 },
        { event_id: 4,  event_date: "2024-01-12", event_type: "purchase", customer_id: "C001", amount: 89.99,  quantity: 1, revenue: 89.99 },
        { event_id: 6,  event_date: "2024-01-20", event_type: "purchase", customer_id: "C005", amount: 199.99, quantity: 2, revenue: 399.98 },
        { event_id: 8,  event_date: "2024-02-03", event_type: "purchase", customer_id: "C006", amount: 49.99,  quantity: 1, revenue: 49.99 },
        { event_id: 9,  event_date: "2024-02-08", event_type: "purchase", customer_id: "C002", amount: 9.99,   quantity: 5, revenue: 49.95 },
        { event_id: 11, event_date: "2024-02-14", event_type: "purchase", customer_id: "C008", amount: 299.99, quantity: 1, revenue: 299.99 },
        { event_id: 12, event_date: "2024-02-18", event_type: "purchase", customer_id: "C003", amount: 14.99,  quantity: 2, revenue: 29.98 },
        { event_id: 14, event_date: "2024-03-05", event_type: "purchase", customer_id: "C009", amount: 59.99,  quantity: 1, revenue: 59.99 },
        { event_id: 15, event_date: "2024-03-08", event_type: "purchase", customer_id: "C004", amount: 24.99,  quantity: 4, revenue: 99.96 },
        { event_id: 17, event_date: "2024-03-15", event_type: "purchase", customer_id: "C005", amount: 399.99, quantity: 1, revenue: 399.99 },
        { event_id: 18, event_date: "2024-03-20", event_type: "purchase", customer_id: "C006", amount: 19.99,  quantity: 3, revenue: 59.97 },
        { event_id: 20, event_date: "2024-03-28", event_type: "purchase", customer_id: "C007", amount: 74.99,  quantity: 2, revenue: 149.98 },
      ],
      orderMatters: true,
    },
    {
      name: "january-only",
      description: "With only January events remaining, returns 3 purchases ordered by event_date then event_id",
      descriptionFr: "Avec uniquement les événements de janvier, retourne 3 achats triés par event_date puis event_id",
      setupSql: `DELETE FROM raw_events WHERE event_date NOT LIKE '2024-01-%';`,
      expectedColumns: ["event_id", "event_date", "event_type", "customer_id", "amount", "quantity", "revenue"],
      expectedRows: [
        { event_id: 1, event_date: "2024-01-05", event_type: "purchase", customer_id: "C001", amount: 149.99, quantity: 1, revenue: 149.99 },
        { event_id: 3, event_date: "2024-01-10", event_type: "purchase", customer_id: "C003", amount: 29.99,  quantity: 3, revenue: 89.97 },
        { event_id: 4, event_date: "2024-01-12", event_type: "purchase", customer_id: "C001", amount: 89.99,  quantity: 1, revenue: 89.99 },
        { event_id: 6, event_date: "2024-01-20", event_type: "purchase", customer_id: "C005", amount: 199.99, quantity: 2, revenue: 399.98 },
      ],
      orderMatters: true,
    },
  ],
};
