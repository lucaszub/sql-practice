import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "84-idempotent-reload",
  title: "Idempotent Daily Reload",
  titleFr: "Rechargement quotidien idempotent",
  difficulty: "hard",
  category: "incremental-loads",
  description: `## Idempotent Daily Reload

The data engineering team reprocesses daily aggregates whenever upstream corrections arrive. The critical requirement is **idempotency**: running the reload once or ten times must always produce the same result — no duplicate rows, no data loss.

The pattern is: \`DELETE WHERE metric_date = target_date\`, then \`INSERT\` the reprocessed data for that date. No matter how many times you run it, the final state is identical.

### Schema

**fact_daily_metrics** (target — contains existing aggregates for multiple dates)
| Column | Type |
|--------|------|
| metric_date | DATE |
| region | VARCHAR |
| total_orders | INTEGER |
| total_revenue | DECIMAL(10,2) |
| avg_order_value | DECIMAL(10,2) |

**staging_metrics** (source — reprocessed aggregates for 2024-01-15 only)
| Column | Type |
|--------|------|
| metric_date | DATE |
| region | VARCHAR |
| total_orders | INTEGER |
| total_revenue | DECIMAL(10,2) |
| avg_order_value | DECIMAL(10,2) |

### Task

Write the idempotent reload for \`metric_date = '2024-01-15'\`:
1. \`DELETE\` all rows from \`fact_daily_metrics\` where \`metric_date = '2024-01-15'\`.
2. \`INSERT INTO fact_daily_metrics SELECT ... FROM staging_metrics\`.
3. \`SELECT\` the final state of \`fact_daily_metrics\` for \`metric_date = '2024-01-15'\` to verify.

The result must be the same whether you run this once or multiple times.

### Expected output columns
\`metric_date\`, \`region\`, \`total_orders\`, \`total_revenue\`, \`avg_order_value\`

Order by \`region\` ASC.`,

  descriptionFr: `## Rechargement quotidien idempotent

L'équipe data engineering retraite les agrégats quotidiens chaque fois que des corrections arrivent en amont. L'exigence critique est l'**idempotence** : exécuter le rechargement une fois ou dix fois doit toujours produire le même résultat — pas de lignes dupliquées, pas de perte de données.

Le patron est : \`DELETE WHERE metric_date = date_cible\`, puis \`INSERT\` des données retraitées pour cette date. Peu importe combien de fois on l'exécute, l'état final est identique.

### Schéma

**fact_daily_metrics** (cible — contient les agrégats existants pour plusieurs dates)
| Colonne | Type |
|---------|------|
| metric_date | DATE |
| region | VARCHAR |
| total_orders | INTEGER |
| total_revenue | DECIMAL(10,2) |
| avg_order_value | DECIMAL(10,2) |

**staging_metrics** (source — agrégats retraités pour le 2024-01-15 uniquement)
| Colonne | Type |
|---------|------|
| metric_date | DATE |
| region | VARCHAR |
| total_orders | INTEGER |
| total_revenue | DECIMAL(10,2) |
| avg_order_value | DECIMAL(10,2) |

### Tâche

Écrivez le rechargement idempotent pour \`metric_date = '2024-01-15'\` :
1. \`DELETE\` toutes les lignes de \`fact_daily_metrics\` où \`metric_date = '2024-01-15'\`.
2. \`INSERT INTO fact_daily_metrics SELECT ... FROM staging_metrics\`.
3. \`SELECT\` l'état final de \`fact_daily_metrics\` pour \`metric_date = '2024-01-15'\` pour vérifier.

Le résultat doit être identique que vous l'exécutiez une ou plusieurs fois.

### Colonnes attendues en sortie
\`metric_date\`, \`region\`, \`total_orders\`, \`total_revenue\`, \`avg_order_value\`

Triez par \`region\` ASC.`,

  hint: "DELETE FROM fact_daily_metrics WHERE metric_date = '2024-01-15'. Then INSERT INTO fact_daily_metrics SELECT ... FROM staging_metrics. The DELETE before INSERT is what makes the operation idempotent: no matter how many times you run it, you always end up with exactly the staging data for that date.",
  hintFr: "DELETE FROM fact_daily_metrics WHERE metric_date = '2024-01-15'. Ensuite INSERT INTO fact_daily_metrics SELECT ... FROM staging_metrics. Le DELETE avant INSERT est ce qui rend l'opération idempotente : peu importe combien de fois vous l'exécutez, vous obtenez toujours exactement les données du staging pour cette date.",

  schema: `CREATE TABLE fact_daily_metrics (
  metric_date     DATE,
  region          VARCHAR,
  total_orders    INTEGER,
  total_revenue   DECIMAL(10,2),
  avg_order_value DECIMAL(10,2)
);

CREATE TABLE staging_metrics (
  metric_date     DATE,
  region          VARCHAR,
  total_orders    INTEGER,
  total_revenue   DECIMAL(10,2),
  avg_order_value DECIMAL(10,2)
);

-- Existing aggregates in fact table: Jan 14, stale Jan 15, Jan 16
INSERT INTO fact_daily_metrics VALUES
  ('2024-01-14', 'EMEA',   142,  28400.00, 200.00),
  ('2024-01-14', 'APAC',    98,  15680.00, 160.00),
  ('2024-01-14', 'AMER',   201,  60300.00, 300.00),
  ('2024-01-14', 'LATAM',   55,   7150.00, 130.00),
  ('2024-01-15', 'EMEA',   138,  27600.00, 200.00),
  ('2024-01-15', 'APAC',    92,  14720.00, 160.00),
  ('2024-01-15', 'AMER',   195,  58500.00, 300.00),
  ('2024-01-15', 'LATAM',   48,   6240.00, 130.00),
  ('2024-01-16', 'EMEA',   155,  31000.00, 200.00),
  ('2024-01-16', 'APAC',   110,  17600.00, 160.00),
  ('2024-01-16', 'AMER',   220,  66000.00, 300.00),
  ('2024-01-16', 'LATAM',   62,   8060.00, 130.00);

-- Reprocessed (corrected) data for 2024-01-15
INSERT INTO staging_metrics VALUES
  ('2024-01-15', 'AMER',   198,  61380.00, 310.00),
  ('2024-01-15', 'APAC',    95,  15960.00, 168.00),
  ('2024-01-15', 'EMEA',   141,  29610.00, 210.00),
  ('2024-01-15', 'LATAM',   51,   7038.00, 138.00);`,

  solutionQuery: `DELETE FROM fact_daily_metrics WHERE metric_date = '2024-01-15';

INSERT INTO fact_daily_metrics
SELECT metric_date, region, total_orders, total_revenue, avg_order_value
FROM staging_metrics;

SELECT metric_date, region, total_orders, total_revenue, avg_order_value
FROM fact_daily_metrics
WHERE metric_date = '2024-01-15'
ORDER BY region ASC;`,

  solutionExplanation: `## Explanation

### Pattern: Idempotent Reload (DELETE + INSERT on a partition key)

An **idempotent** operation produces the same result regardless of how many times it is executed. The DELETE + INSERT pattern achieves idempotency by ensuring the target partition is always wiped clean before the fresh data is written. There is no "if already exists" logic needed — the DELETE handles it unconditionally.

### Step-by-step
1. \`DELETE FROM fact_daily_metrics WHERE metric_date = '2024-01-15'\` — removes the 4 stale rows for Jan 15. If this delete has already been run before (e.g., second run), the DELETE simply affects 0 rows — still safe.
2. \`INSERT INTO fact_daily_metrics SELECT ...\` — loads the 4 corrected rows from \`staging_metrics\`. All values are updated: AMER now shows 198 orders (was 195), APAC 95 (was 92), EMEA 141 (was 138), LATAM 51 (was 48). Average order values are also corrected.
3. The final \`SELECT\` reads back only Jan 15 sorted by region, returning the 4 corrected rows.

### Why this is idempotent
- **First run**: deletes 4 stale rows, inserts 4 corrected rows → 4 rows for Jan 15.
- **Second run**: deletes those same 4 corrected rows, inserts 4 corrected rows again → still 4 rows for Jan 15, identical content.
- The result converges to the same state no matter how many times it runs.

### Why
- **Safe to retry**: pipeline failures and retries never cause data duplication.
- **Simple reasoning**: no conditional logic, no MERGE complexity, no deduplication step.
- **Partition isolation**: only the target date is affected; other dates remain untouched.

### When to use
- Daily or hourly aggregate tables where corrections arrive as full-partition resends.
- Orchestrated pipelines (Airflow, dbt, Dagster) where tasks may be retried on failure.
- Any scenario where the staging table always contains the full correct state for the target partition.`,

  solutionExplanationFr: `## Explication

### Patron : Rechargement idempotent (DELETE + INSERT sur une clé de partition)

Une opération **idempotente** produit le même résultat quel que soit le nombre de fois qu'elle est exécutée. Le patron DELETE + INSERT atteint l'idempotence en s'assurant que la partition cible est toujours vidée avant l'écriture des nouvelles données. Aucune logique "si déjà existant" n'est nécessaire — le DELETE s'en charge inconditionnellement.

### Étape par étape
1. \`DELETE FROM fact_daily_metrics WHERE metric_date = '2024-01-15'\` — supprime les 4 lignes périmées du 15 jan. Si ce delete a déjà été exécuté (ex. : deuxième exécution), le DELETE affecte simplement 0 lignes — toujours sûr.
2. \`INSERT INTO fact_daily_metrics SELECT ...\` — charge les 4 lignes corrigées depuis \`staging_metrics\`. Toutes les valeurs sont mises à jour : AMER montre maintenant 198 commandes (était 195), APAC 95 (était 92), EMEA 141 (était 138), LATAM 51 (était 48). Les valeurs moyennes de commande sont également corrigées.
3. Le \`SELECT\` final relit uniquement le 15 jan. trié par région, retournant les 4 lignes corrigées.

### Pourquoi c'est idempotent
- **Première exécution** : supprime 4 lignes périmées, insère 4 lignes corrigées → 4 lignes pour le 15 jan.
- **Deuxième exécution** : supprime ces mêmes 4 lignes corrigées, insère à nouveau 4 lignes corrigées → toujours 4 lignes pour le 15 jan., contenu identique.
- Le résultat converge vers le même état quel que soit le nombre d'exécutions.

### Pourquoi
- **Sûr à réessayer** : les pannes de pipeline et les nouvelles tentatives ne provoquent jamais de duplication de données.
- **Raisonnement simple** : pas de logique conditionnelle, pas de complexité MERGE, pas d'étape de déduplication.
- **Isolation de partition** : seule la date cible est affectée ; les autres dates restent intactes.

### Quand l'utiliser
- Tables d'agrégats quotidiens ou horaires où les corrections arrivent sous forme de renvois complets de partition.
- Pipelines orchestrés (Airflow, dbt, Dagster) où les tâches peuvent être relancées en cas d'échec.
- Tout scénario où la table de staging contient toujours l'état correct complet pour la partition cible.`,

  testCases: [
    {
      name: "default",
      description: "4 corrected rows for 2024-01-15 ordered by region; values differ from the original stale data",
      descriptionFr: "4 lignes corrigées pour le 2024-01-15 triées par région ; les valeurs diffèrent des données périmées originales",
      expectedColumns: ["metric_date", "region", "total_orders", "total_revenue", "avg_order_value"],
      expectedRows: [
        { metric_date: "2024-01-15", region: "AMER",  total_orders: 198, total_revenue: 61380.00, avg_order_value: 310.00 },
        { metric_date: "2024-01-15", region: "APAC",  total_orders: 95,  total_revenue: 15960.00, avg_order_value: 168.00 },
        { metric_date: "2024-01-15", region: "EMEA",  total_orders: 141, total_revenue: 29610.00, avg_order_value: 210.00 },
        { metric_date: "2024-01-15", region: "LATAM", total_orders: 51,  total_revenue: 7038.00,  avg_order_value: 138.00 },
      ],
      orderMatters: true,
    },
    {
      name: "idempotency-check",
      description: "Running the reload a second time produces exactly the same 4 rows — no duplicates",
      descriptionFr: "Exécuter le rechargement une deuxième fois produit exactement les 4 mêmes lignes — pas de doublons",
      setupSql: `DELETE FROM fact_daily_metrics WHERE metric_date = '2024-01-15';
INSERT INTO fact_daily_metrics SELECT metric_date, region, total_orders, total_revenue, avg_order_value FROM staging_metrics;
DELETE FROM fact_daily_metrics WHERE metric_date = '2024-01-15';
INSERT INTO fact_daily_metrics SELECT metric_date, region, total_orders, total_revenue, avg_order_value FROM staging_metrics;`,
      expectedColumns: ["metric_date", "region", "total_orders", "total_revenue", "avg_order_value"],
      expectedRows: [
        { metric_date: "2024-01-15", region: "AMER",  total_orders: 198, total_revenue: 61380.00, avg_order_value: 310.00 },
        { metric_date: "2024-01-15", region: "APAC",  total_orders: 95,  total_revenue: 15960.00, avg_order_value: 168.00 },
        { metric_date: "2024-01-15", region: "EMEA",  total_orders: 141, total_revenue: 29610.00, avg_order_value: 210.00 },
        { metric_date: "2024-01-15", region: "LATAM", total_orders: 51,  total_revenue: 7038.00,  avg_order_value: 138.00 },
      ],
      orderMatters: false,
    },
    {
      name: "other-dates-untouched",
      description: "Rows for 2024-01-14 and 2024-01-16 are never modified by the reload",
      descriptionFr: "Les lignes du 2024-01-14 et du 2024-01-16 ne sont jamais modifiées par le rechargement",
      setupSql: `DELETE FROM fact_daily_metrics WHERE metric_date = '2024-01-15';
INSERT INTO fact_daily_metrics SELECT metric_date, region, total_orders, total_revenue, avg_order_value FROM staging_metrics;`,
      expectedColumns: ["metric_date", "region", "total_orders", "total_revenue", "avg_order_value"],
      expectedRows: [
        { metric_date: "2024-01-14", region: "EMEA",  total_orders: 142, total_revenue: 28400.00, avg_order_value: 200.00 },
        { metric_date: "2024-01-14", region: "APAC",  total_orders: 98,  total_revenue: 15680.00, avg_order_value: 160.00 },
        { metric_date: "2024-01-14", region: "AMER",  total_orders: 201, total_revenue: 60300.00, avg_order_value: 300.00 },
        { metric_date: "2024-01-14", region: "LATAM", total_orders: 55,  total_revenue: 7150.00,  avg_order_value: 130.00 },
        { metric_date: "2024-01-16", region: "EMEA",  total_orders: 155, total_revenue: 31000.00, avg_order_value: 200.00 },
        { metric_date: "2024-01-16", region: "APAC",  total_orders: 110, total_revenue: 17600.00, avg_order_value: 160.00 },
        { metric_date: "2024-01-16", region: "AMER",  total_orders: 220, total_revenue: 66000.00, avg_order_value: 300.00 },
        { metric_date: "2024-01-16", region: "LATAM", total_orders: 62,  total_revenue: 8060.00,  avg_order_value: 130.00 },
      ],
      orderMatters: false,
    },
  ],
};
