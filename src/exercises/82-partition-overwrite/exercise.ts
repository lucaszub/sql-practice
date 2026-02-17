import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "82-partition-overwrite",
  title: "Partition Overwrite",
  titleFr: "Écrasement de partition",
  difficulty: "medium",
  category: "incremental-loads",
  description: `## Partition Overwrite

The data engineering team discovered that the source system sent corrected order data for \`2024-01-15\`. The amounts and statuses for that day changed. Rather than updating rows individually, the team uses the **partition overwrite** pattern: delete all records for that date, then insert the corrected data fresh from \`staging_orders\`.

This is the standard pattern for reprocessing a single day in a date-partitioned fact table.

### Schema

**fact_orders** (target — contains multiple dates including the stale 2024-01-15 data)
| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| amount | DECIMAL(10,2) |
| status | VARCHAR |
| order_date | DATE |

**staging_orders** (corrected data — contains only 2024-01-15 records)
| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| amount | DECIMAL(10,2) |
| status | VARCHAR |
| order_date | DATE |

### Task

Write the two-step partition overwrite:
1. \`DELETE\` all rows from \`fact_orders\` where \`order_date = '2024-01-15'\`.
2. \`INSERT INTO fact_orders SELECT ... FROM staging_orders\`.
3. \`SELECT\` the final state of \`fact_orders\` for \`order_date = '2024-01-15'\` to verify the reload.

### Expected output columns
\`order_id\`, \`customer_id\`, \`amount\`, \`status\`, \`order_date\`

Order by \`order_id\` ASC.`,

  descriptionFr: `## Écrasement de partition

L'équipe data engineering a découvert que le système source a envoyé des données de commandes corrigées pour le \`2024-01-15\`. Les montants et statuts de ce jour ont changé. Plutôt que de mettre à jour les lignes individuellement, l'équipe utilise le patron d'**écrasement de partition** : supprimer tous les enregistrements pour cette date, puis insérer les données corrigées depuis \`staging_orders\`.

C'est le patron standard pour retraiter un seul jour dans une table de faits partitionnée par date.

### Schéma

**fact_orders** (cible — contient plusieurs dates dont les données périmées du 2024-01-15)
| Colonne | Type |
|---------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| amount | DECIMAL(10,2) |
| status | VARCHAR |
| order_date | DATE |

**staging_orders** (données corrigées — ne contient que les enregistrements du 2024-01-15)
| Colonne | Type |
|---------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| amount | DECIMAL(10,2) |
| status | VARCHAR |
| order_date | DATE |

### Tâche

Écrivez l'écrasement de partition en deux étapes :
1. \`DELETE\` toutes les lignes de \`fact_orders\` où \`order_date = '2024-01-15'\`.
2. \`INSERT INTO fact_orders SELECT ... FROM staging_orders\`.
3. \`SELECT\` l'état final de \`fact_orders\` pour \`order_date = '2024-01-15'\` pour vérifier le rechargement.

### Colonnes attendues en sortie
\`order_id\`, \`customer_id\`, \`amount\`, \`status\`, \`order_date\`

Triez par \`order_id\` ASC.`,

  hint: "Step 1: DELETE FROM fact_orders WHERE order_date = '2024-01-15'. Step 2: INSERT INTO fact_orders SELECT ... FROM staging_orders. Step 3: SELECT ... FROM fact_orders WHERE order_date = '2024-01-15' ORDER BY order_id.",
  hintFr: "Étape 1 : DELETE FROM fact_orders WHERE order_date = '2024-01-15'. Étape 2 : INSERT INTO fact_orders SELECT ... FROM staging_orders. Étape 3 : SELECT ... FROM fact_orders WHERE order_date = '2024-01-15' ORDER BY order_id.",

  schema: `CREATE TABLE fact_orders (
  order_id    INTEGER PRIMARY KEY,
  customer_id INTEGER,
  amount      DECIMAL(10,2),
  status      VARCHAR,
  order_date  DATE
);

CREATE TABLE staging_orders (
  order_id    INTEGER PRIMARY KEY,
  customer_id INTEGER,
  amount      DECIMAL(10,2),
  status      VARCHAR,
  order_date  DATE
);

-- Existing data in fact_orders: Jan 14, Jan 15 (stale), Jan 16
INSERT INTO fact_orders VALUES
  (1,  101, 120.00, 'completed', '2024-01-14'),
  (2,  102, 200.00, 'completed', '2024-01-14'),
  (3,  103,  50.00, 'completed', '2024-01-14'),
  (4,  101, 310.00, 'completed', '2024-01-15'),
  (5,  104,  80.00, 'completed', '2024-01-15'),
  (6,  102, 145.00, 'completed', '2024-01-15'),
  (7,  105, 220.00, 'pending',   '2024-01-15'),
  (8,  103,  60.00, 'completed', '2024-01-16'),
  (9,  101, 390.00, 'completed', '2024-01-16'),
  (10, 106, 175.00, 'pending',   '2024-01-16');

-- Corrected data for 2024-01-15 from the source system
INSERT INTO staging_orders VALUES
  (4,  101, 325.00, 'completed', '2024-01-15'),
  (5,  104,  95.00, 'returned',  '2024-01-15'),
  (6,  102, 145.00, 'completed', '2024-01-15'),
  (7,  105, 220.00, 'completed', '2024-01-15'),
  (11, 107, 410.00, 'completed', '2024-01-15');`,

  solutionQuery: `DELETE FROM fact_orders WHERE order_date = '2024-01-15';

INSERT INTO fact_orders
SELECT order_id, customer_id, amount, status, order_date
FROM staging_orders;

SELECT order_id, customer_id, amount, status, order_date
FROM fact_orders
WHERE order_date = '2024-01-15'
ORDER BY order_id ASC;`,

  solutionExplanation: `## Explanation

### Pattern: Partition Overwrite (DELETE + INSERT)

The **partition overwrite** pattern treats a date (or other partition key) as an atomic unit. Instead of row-level UPDATEs — which are slow on large tables and leave partial states visible — the entire partition is replaced atomically.

### Step-by-step
1. \`DELETE FROM fact_orders WHERE order_date = '2024-01-15'\` — removes the 4 stale rows for that date. Rows for other dates (Jan 14, Jan 16) are untouched.
2. \`INSERT INTO fact_orders SELECT ... FROM staging_orders\` — loads the 5 corrected rows. Note order 5's status changed from \`completed\` to \`returned\` and amount from 80.00 to 95.00; order 4's amount changed; order 11 is a new record for that day.
3. The final \`SELECT\` reads back only the Jan 15 partition to confirm the result: 5 rows with corrected data.

### Why
- **Atomic at partition level**: other partitions are never touched, reducing lock contention.
- **Simpler than UPDATE**: no need to match columns individually; the fresh staging data replaces stale data entirely.
- **Auditable**: the staging table preserves the corrected version before it is promoted.

### When to use
- Date-partitioned fact tables where source corrections arrive as full-day resends.
- Any scenario where a partition of data needs to be reprocessed completely (e.g., restatements, late-arriving corrections).
- Data warehouse patterns where DELETE + INSERT is preferred over MERGE for simplicity.`,

  solutionExplanationFr: `## Explication

### Patron : Écrasement de partition (DELETE + INSERT)

Le patron d'**écrasement de partition** traite une date (ou toute autre clé de partition) comme une unité atomique. Plutôt que des UPDATE ligne par ligne — lents sur de grandes tables et laissant des états partiels visibles — la partition entière est remplacée de manière atomique.

### Étape par étape
1. \`DELETE FROM fact_orders WHERE order_date = '2024-01-15'\` — supprime les 4 lignes périmées pour cette date. Les lignes des autres dates (14 et 16 jan.) restent intactes.
2. \`INSERT INTO fact_orders SELECT ... FROM staging_orders\` — charge les 5 lignes corrigées. Le statut de la commande 5 passe de \`completed\` à \`returned\` et le montant de 80.00 à 95.00 ; le montant de la commande 4 change ; la commande 11 est un nouvel enregistrement pour ce jour.
3. Le \`SELECT\` final relit uniquement la partition du 15 jan. pour confirmer le résultat : 5 lignes avec les données corrigées.

### Pourquoi
- **Atomique au niveau partition** : les autres partitions ne sont jamais touchées, réduisant la contention de verrous.
- **Plus simple qu'un UPDATE** : pas besoin de faire correspondre les colonnes individuellement ; les données fraîches du staging remplacent entièrement les données périmées.
- **Traçable** : la table de staging préserve la version corrigée avant qu'elle soit promue.

### Quand l'utiliser
- Tables de faits partitionnées par date où les corrections source arrivent sous forme de renvois journaliers complets.
- Tout scénario où une partition de données doit être entièrement retraitée (ex. : ajustements comptables, corrections tardives).
- Patterns data warehouse où DELETE + INSERT est préféré à MERGE pour sa simplicité.`,

  testCases: [
    {
      name: "default",
      description: "After partition overwrite: 5 corrected rows for 2024-01-15 (order 5 now returned/95.00, order 4 now 325.00, order 11 added)",
      descriptionFr: "Après écrasement : 5 lignes corrigées pour le 2024-01-15 (commande 5 now returned/95.00, commande 4 now 325.00, commande 11 ajoutée)",
      expectedColumns: ["order_id", "customer_id", "amount", "status", "order_date"],
      expectedRows: [
        { order_id: 4,  customer_id: 101, amount: 325.00, status: "completed", order_date: "2024-01-15" },
        { order_id: 5,  customer_id: 104, amount: 95.00,  status: "returned",  order_date: "2024-01-15" },
        { order_id: 6,  customer_id: 102, amount: 145.00, status: "completed", order_date: "2024-01-15" },
        { order_id: 7,  customer_id: 105, amount: 220.00, status: "completed", order_date: "2024-01-15" },
        { order_id: 11, customer_id: 107, amount: 410.00, status: "completed", order_date: "2024-01-15" },
      ],
      orderMatters: true,
    },
    {
      name: "other-dates-untouched",
      description: "Rows for 2024-01-14 and 2024-01-16 remain intact after the partition overwrite",
      descriptionFr: "Les lignes du 2024-01-14 et du 2024-01-16 restent intactes après l'écrasement de partition",
      setupSql: `DELETE FROM fact_orders WHERE order_date = '2024-01-15';
INSERT INTO fact_orders SELECT order_id, customer_id, amount, status, order_date FROM staging_orders;`,
      expectedColumns: ["order_id", "customer_id", "amount", "status", "order_date"],
      expectedRows: [
        { order_id: 1, customer_id: 101, amount: 120.00, status: "completed", order_date: "2024-01-14" },
        { order_id: 2, customer_id: 102, amount: 200.00, status: "completed", order_date: "2024-01-14" },
        { order_id: 3, customer_id: 103, amount: 50.00,  status: "completed", order_date: "2024-01-14" },
        { order_id: 8, customer_id: 103, amount: 60.00,  status: "completed", order_date: "2024-01-16" },
        { order_id: 9, customer_id: 101, amount: 390.00, status: "completed", order_date: "2024-01-16" },
        { order_id: 10, customer_id: 106, amount: 175.00, status: "pending",  order_date: "2024-01-16" },
      ],
      orderMatters: false,
    },
  ],
};
