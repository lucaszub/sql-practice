import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "83-batch-id-tracking",
  title: "Batch ID Tracking for Audit Trail",
  titleFr: "Suivi par identifiant de lot pour la traçabilité",
  difficulty: "hard",
  category: "incremental-loads",
  description: `## Batch ID Tracking for Audit Trail

The data platform team requires every load into \`fact_events\` to be tagged with a \`batch_id\` and a \`loaded_at\` timestamp. This metadata makes it possible to audit which pipeline run inserted each row, replay a specific batch, or roll back a bad load by deleting all rows with a given \`batch_id\`.

Your task is to write the \`INSERT INTO ... SELECT\` that enriches raw events with batch metadata during the load.

### Schema

**raw_events** (source — incoming events to be loaded)
| Column | Type |
|--------|------|
| event_id | INTEGER |
| user_id | INTEGER |
| event_type | VARCHAR |
| event_ts | TIMESTAMP |
| properties | VARCHAR |

**fact_events** (target — already contains rows from a previous batch)
| Column | Type |
|--------|------|
| event_id | INTEGER |
| user_id | INTEGER |
| event_type | VARCHAR |
| event_ts | TIMESTAMP |
| properties | VARCHAR |
| batch_id | INTEGER |
| loaded_at | TIMESTAMP |

### Task

Write an \`INSERT INTO fact_events SELECT ...\` that loads all rows from \`raw_events\` and tags them with \`batch_id = 2\` and \`loaded_at = '2024-01-16 03:00:00'\` (the current batch run timestamp). Then \`SELECT\` all rows from \`fact_events\` that belong to \`batch_id = 2\` to verify the load.

### Expected output columns
\`event_id\`, \`user_id\`, \`event_type\`, \`event_ts\`, \`batch_id\`, \`loaded_at\`

Order by \`event_id\` ASC.`,

  descriptionFr: `## Suivi par identifiant de lot pour la traçabilité

L'équipe data platform exige que chaque chargement dans \`fact_events\` soit étiqueté avec un \`batch_id\` et un timestamp \`loaded_at\`. Ces métadonnées permettent d'auditer quelle exécution du pipeline a inséré chaque ligne, de rejouer un lot spécifique, ou d'annuler un mauvais chargement en supprimant toutes les lignes avec un \`batch_id\` donné.

Votre mission est d'écrire l'\`INSERT INTO ... SELECT\` qui enrichit les événements bruts avec les métadonnées de lot pendant le chargement.

### Schéma

**raw_events** (source — événements entrants à charger)
| Colonne | Type |
|---------|------|
| event_id | INTEGER |
| user_id | INTEGER |
| event_type | VARCHAR |
| event_ts | TIMESTAMP |
| properties | VARCHAR |

**fact_events** (cible — contient déjà des lignes d'un lot précédent)
| Colonne | Type |
|---------|------|
| event_id | INTEGER |
| user_id | INTEGER |
| event_type | VARCHAR |
| event_ts | TIMESTAMP |
| properties | VARCHAR |
| batch_id | INTEGER |
| loaded_at | TIMESTAMP |

### Tâche

Écrivez un \`INSERT INTO fact_events SELECT ...\` qui charge toutes les lignes de \`raw_events\` et les étiquette avec \`batch_id = 2\` et \`loaded_at = '2024-01-16 03:00:00'\` (le timestamp de l'exécution courante). Ensuite, \`SELECT\` toutes les lignes de \`fact_events\` appartenant au \`batch_id = 2\` pour vérifier le chargement.

### Colonnes attendues en sortie
\`event_id\`, \`user_id\`, \`event_type\`, \`event_ts\`, \`batch_id\`, \`loaded_at\`

Triez par \`event_id\` ASC.`,

  hint: "In the SELECT list, add literal values for the two new columns: SELECT event_id, user_id, event_type, event_ts, properties, 2 AS batch_id, '2024-01-16 03:00:00'::TIMESTAMP AS loaded_at FROM raw_events. Then filter fact_events WHERE batch_id = 2.",
  hintFr: "Dans la liste SELECT, ajoutez des valeurs littérales pour les deux nouvelles colonnes : SELECT event_id, user_id, event_type, event_ts, properties, 2 AS batch_id, '2024-01-16 03:00:00'::TIMESTAMP AS loaded_at FROM raw_events. Ensuite filtrez fact_events WHERE batch_id = 2.",

  schema: `CREATE TABLE raw_events (
  event_id   INTEGER PRIMARY KEY,
  user_id    INTEGER,
  event_type VARCHAR,
  event_ts   TIMESTAMP,
  properties VARCHAR
);

CREATE TABLE fact_events (
  event_id   INTEGER PRIMARY KEY,
  user_id    INTEGER,
  event_type VARCHAR,
  event_ts   TIMESTAMP,
  properties VARCHAR,
  batch_id   INTEGER,
  loaded_at  TIMESTAMP
);

-- Existing rows from batch 1 (previous load)
INSERT INTO fact_events VALUES
  (1,  201, 'page_view',   '2024-01-15 08:01:00', 'page=/home',       1, '2024-01-16 02:00:00'),
  (2,  202, 'click',       '2024-01-15 08:05:00', 'element=cta',      1, '2024-01-16 02:00:00'),
  (3,  201, 'purchase',    '2024-01-15 08:15:00', 'amount=99.99',     1, '2024-01-16 02:00:00'),
  (4,  203, 'page_view',   '2024-01-15 09:00:00', 'page=/products',   1, '2024-01-16 02:00:00'),
  (5,  204, 'signup',      '2024-01-15 09:30:00', 'plan=free',        1, '2024-01-16 02:00:00'),
  (6,  202, 'page_view',   '2024-01-15 10:00:00', 'page=/checkout',   1, '2024-01-16 02:00:00'),
  (7,  205, 'click',       '2024-01-15 10:45:00', 'element=nav',      1, '2024-01-16 02:00:00'),
  (8,  201, 'logout',      '2024-01-15 11:00:00', NULL,               1, '2024-01-16 02:00:00');

-- New events to be loaded as batch 2
INSERT INTO raw_events VALUES
  (9,  206, 'signup',      '2024-01-16 00:15:00', 'plan=pro'),
  (10, 207, 'page_view',   '2024-01-16 00:30:00', 'page=/home'),
  (11, 206, 'click',       '2024-01-16 00:35:00', 'element=cta'),
  (12, 208, 'page_view',   '2024-01-16 01:00:00', 'page=/pricing'),
  (13, 207, 'purchase',    '2024-01-16 01:10:00', 'amount=49.99'),
  (14, 209, 'signup',      '2024-01-16 01:20:00', 'plan=free'),
  (15, 208, 'click',       '2024-01-16 01:45:00', 'element=nav'),
  (16, 206, 'page_view',   '2024-01-16 02:00:00', 'page=/dashboard'),
  (17, 210, 'page_view',   '2024-01-16 02:30:00', 'page=/home'),
  (18, 207, 'logout',      '2024-01-16 02:50:00', NULL);`,

  solutionQuery: `INSERT INTO fact_events
SELECT
  event_id,
  user_id,
  event_type,
  event_ts,
  properties,
  2                              AS batch_id,
  '2024-01-16 03:00:00'::TIMESTAMP AS loaded_at
FROM raw_events;

SELECT event_id, user_id, event_type, event_ts, batch_id, loaded_at
FROM fact_events
WHERE batch_id = 2
ORDER BY event_id ASC;`,

  solutionExplanation: `## Explanation

### Pattern: Batch ID Tagging (INSERT INTO ... SELECT with literal metadata)

The **batch ID tracking** pattern enriches every inserted row with audit metadata at load time. By adding literal constant values (\`batch_id\`, \`loaded_at\`) directly in the SELECT list, the pipeline annotates each row without touching the source table.

### Step-by-step
1. \`INSERT INTO fact_events\` — targets the production fact table.
2. \`SELECT event_id, user_id, event_type, event_ts, properties\` — copies the source columns from \`raw_events\`.
3. \`2 AS batch_id\` — a literal constant identifying this pipeline run. In a real pipeline, this would be parameterized (e.g., passed as a variable by the orchestrator).
4. \`'2024-01-16 03:00:00'::TIMESTAMP AS loaded_at\` — the pipeline execution timestamp, cast explicitly. DuckDB accepts this cast syntax. In production this would be \`CURRENT_TIMESTAMP\`, but we use a fixed value here for determinism.
5. The final \`SELECT ... WHERE batch_id = 2\` verifies that exactly the 10 new rows were tagged correctly.

### Why
- **Auditability**: you can always answer "which pipeline run inserted this row?".
- **Rollback**: \`DELETE FROM fact_events WHERE batch_id = 2\` removes exactly the rows from a bad run.
- **Replay**: rerunning batch 2 after a fix is safe because the batch_id lets you clean up before re-inserting.

### When to use
- Any incremental pipeline that loads into an append table and needs audit capabilities.
- Data lakehouse patterns (Bronze → Silver) where lineage tracking is required.
- Regulated environments (finance, healthcare) where row-level provenance must be maintained.`,

  solutionExplanationFr: `## Explication

### Patron : Étiquetage par lot (INSERT INTO ... SELECT avec métadonnées littérales)

Le patron de **suivi par identifiant de lot** enrichit chaque ligne insérée avec des métadonnées d'audit au moment du chargement. En ajoutant des valeurs constantes littérales (\`batch_id\`, \`loaded_at\`) directement dans la liste SELECT, le pipeline annote chaque ligne sans toucher la table source.

### Étape par étape
1. \`INSERT INTO fact_events\` — cible la table de faits de production.
2. \`SELECT event_id, user_id, event_type, event_ts, properties\` — copie les colonnes source depuis \`raw_events\`.
3. \`2 AS batch_id\` — une constante littérale identifiant cette exécution du pipeline. Dans un vrai pipeline, ce serait paramétrisé (ex. : passé comme variable par l'orchestrateur).
4. \`'2024-01-16 03:00:00'::TIMESTAMP AS loaded_at\` — le timestamp d'exécution du pipeline, casté explicitement. DuckDB accepte cette syntaxe de cast. En production ce serait \`CURRENT_TIMESTAMP\`, mais on utilise une valeur fixe ici pour le déterminisme.
5. Le \`SELECT ... WHERE batch_id = 2\` final vérifie que exactement les 10 nouvelles lignes ont été correctement étiquetées.

### Pourquoi
- **Traçabilité** : on peut toujours répondre à "quelle exécution du pipeline a inséré cette ligne ?".
- **Rollback** : \`DELETE FROM fact_events WHERE batch_id = 2\` supprime exactement les lignes d'une mauvaise exécution.
- **Replay** : réexécuter le lot 2 après une correction est sûr car le batch_id permet de nettoyer avant de réinsérer.

### Quand l'utiliser
- Tout pipeline incrémental qui charge dans une table append et nécessite des capacités d'audit.
- Patterns data lakehouse (Bronze → Silver) où le traçage de la lignée est requis.
- Environnements réglementés (finance, santé) où la provenance au niveau ligne doit être maintenue.`,

  testCases: [
    {
      name: "default",
      description: "10 events from raw_events loaded with batch_id=2 and loaded_at='2024-01-16 03:00:00'; batch 1 rows are unaffected",
      descriptionFr: "10 événements de raw_events chargés avec batch_id=2 et loaded_at='2024-01-16 03:00:00' ; les lignes du lot 1 restent intactes",
      expectedColumns: ["event_id", "user_id", "event_type", "event_ts", "batch_id", "loaded_at"],
      expectedRows: [
        { event_id: 9,  user_id: 206, event_type: "signup",    event_ts: "2024-01-16 00:15:00", batch_id: 2, loaded_at: "2024-01-16 03:00:00" },
        { event_id: 10, user_id: 207, event_type: "page_view", event_ts: "2024-01-16 00:30:00", batch_id: 2, loaded_at: "2024-01-16 03:00:00" },
        { event_id: 11, user_id: 206, event_type: "click",     event_ts: "2024-01-16 00:35:00", batch_id: 2, loaded_at: "2024-01-16 03:00:00" },
        { event_id: 12, user_id: 208, event_type: "page_view", event_ts: "2024-01-16 01:00:00", batch_id: 2, loaded_at: "2024-01-16 03:00:00" },
        { event_id: 13, user_id: 207, event_type: "purchase",  event_ts: "2024-01-16 01:10:00", batch_id: 2, loaded_at: "2024-01-16 03:00:00" },
        { event_id: 14, user_id: 209, event_type: "signup",    event_ts: "2024-01-16 01:20:00", batch_id: 2, loaded_at: "2024-01-16 03:00:00" },
        { event_id: 15, user_id: 208, event_type: "click",     event_ts: "2024-01-16 01:45:00", batch_id: 2, loaded_at: "2024-01-16 03:00:00" },
        { event_id: 16, user_id: 206, event_type: "page_view", event_ts: "2024-01-16 02:00:00", batch_id: 2, loaded_at: "2024-01-16 03:00:00" },
        { event_id: 17, user_id: 210, event_type: "page_view", event_ts: "2024-01-16 02:30:00", batch_id: 2, loaded_at: "2024-01-16 03:00:00" },
        { event_id: 18, user_id: 207, event_type: "logout",    event_ts: "2024-01-16 02:50:00", batch_id: 2, loaded_at: "2024-01-16 03:00:00" },
      ],
      orderMatters: true,
    },
    {
      name: "batch1-untouched",
      description: "The 8 rows from batch 1 remain intact with batch_id=1 after loading batch 2",
      descriptionFr: "Les 8 lignes du lot 1 restent intactes avec batch_id=1 après le chargement du lot 2",
      setupSql: `INSERT INTO fact_events
SELECT event_id, user_id, event_type, event_ts, properties,
  2 AS batch_id,
  '2024-01-16 03:00:00'::TIMESTAMP AS loaded_at
FROM raw_events;`,
      expectedColumns: ["event_id", "user_id", "event_type", "event_ts", "batch_id", "loaded_at"],
      expectedRows: [
        { event_id: 1, user_id: 201, event_type: "page_view", event_ts: "2024-01-15 08:01:00", batch_id: 1, loaded_at: "2024-01-16 02:00:00" },
        { event_id: 2, user_id: 202, event_type: "click",     event_ts: "2024-01-15 08:05:00", batch_id: 1, loaded_at: "2024-01-16 02:00:00" },
        { event_id: 3, user_id: 201, event_type: "purchase",  event_ts: "2024-01-15 08:15:00", batch_id: 1, loaded_at: "2024-01-16 02:00:00" },
        { event_id: 4, user_id: 203, event_type: "page_view", event_ts: "2024-01-15 09:00:00", batch_id: 1, loaded_at: "2024-01-16 02:00:00" },
        { event_id: 5, user_id: 204, event_type: "signup",    event_ts: "2024-01-15 09:30:00", batch_id: 1, loaded_at: "2024-01-16 02:00:00" },
        { event_id: 6, user_id: 202, event_type: "page_view", event_ts: "2024-01-15 10:00:00", batch_id: 1, loaded_at: "2024-01-16 02:00:00" },
        { event_id: 7, user_id: 205, event_type: "click",     event_ts: "2024-01-15 10:45:00", batch_id: 1, loaded_at: "2024-01-16 02:00:00" },
        { event_id: 8, user_id: 201, event_type: "logout",    event_ts: "2024-01-15 11:00:00", batch_id: 1, loaded_at: "2024-01-16 02:00:00" },
      ],
      orderMatters: false,
    },
  ],
};
