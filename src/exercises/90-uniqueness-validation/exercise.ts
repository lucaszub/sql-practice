import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "90-uniqueness-validation",
  title: "Staging Table Duplicate Key Detection",
  titleFr: "Detection de cles dupliquees dans la table de staging",
  difficulty: "medium",
  category: "data-quality",
  description: `## Staging Table Duplicate Key Detection

Before loading the daily orders feed into the production database, the data engineering team runs a uniqueness validation check. The upstream source occasionally sends duplicate records for the same \`order_id\`. Loading duplicates would corrupt downstream aggregations and revenue reports.

Write a query that identifies all duplicate \`order_id\` values in the \`staging_orders\` table, returning the duplicate key and the number of times it appears.

### Schema

**staging_orders**
| Column | Type |
|--------|------|
| row_id | INTEGER |
| order_id | INTEGER |
| customer_id | INTEGER |
| order_date | DATE |
| amount | DECIMAL(10,2) |
| status | VARCHAR |

### Task

Write a query that returns:
- \`order_id\`: the duplicated order identifier
- \`occurrences\`: how many times this order_id appears in the staging table

Only include order_ids that appear **more than once**. Order by \`occurrences\` DESC, then \`order_id\` ASC.

### Expected output columns
\`order_id\`, \`occurrences\``,
  descriptionFr: `## Detection de cles dupliquees dans la table de staging

Avant de charger le flux de commandes quotidien dans la base de production, l'equipe data engineering execute une validation d'unicite. La source en amont envoie parfois des enregistrements dupliques pour le meme \`order_id\`. Charger des doublons corromprait les agregations en aval et les rapports de revenus.

Ecrivez une requete qui identifie toutes les valeurs d'order_id dupliquees dans la table \`staging_orders\`, en retournant la cle dupliquee et le nombre de fois qu'elle apparait.

### Schema

**staging_orders**
| Colonne | Type |
|---------|------|
| row_id | INTEGER |
| order_id | INTEGER |
| customer_id | INTEGER |
| order_date | DATE |
| amount | DECIMAL(10,2) |
| status | VARCHAR |

### Tache

Ecrivez une requete qui retourne :
- \`order_id\` : l'identifiant de commande duplique
- \`occurrences\` : combien de fois cet order_id apparait dans la table de staging

N'incluez que les order_id qui apparaissent **plus d'une fois**. Triez par \`occurrences\` DESC, puis \`order_id\` ASC.

### Colonnes attendues en sortie
\`order_id\`, \`occurrences\``,
  hint: "GROUP BY order_id and use HAVING COUNT(*) > 1 to keep only the duplicates.",
  hintFr: "Groupez par order_id et utilisez HAVING COUNT(*) > 1 pour ne garder que les doublons.",
  schema: `CREATE TABLE staging_orders (
  row_id      INTEGER,
  order_id    INTEGER,
  customer_id INTEGER,
  order_date  DATE,
  amount      DECIMAL(10,2),
  status      VARCHAR
);

INSERT INTO staging_orders VALUES
  (1,  1001, 201, '2024-01-10', 150.00, 'completed'),
  (2,  1002, 202, '2024-01-10', 89.50,  'completed'),
  (3,  1003, 203, '2024-01-11', 210.00, 'pending'),
  (4,  1001, 201, '2024-01-10', 150.00, 'completed'),
  (5,  1004, 204, '2024-01-11', 45.00,  'completed'),
  (6,  1005, 205, '2024-01-12', 320.75, 'completed'),
  (7,  1002, 202, '2024-01-10', 89.50,  'completed'),
  (8,  1006, 206, '2024-01-12', 99.99,  'cancelled'),
  (9,  1007, 207, '2024-01-13', 175.00, 'completed'),
  (10, 1008, 208, '2024-01-13', 60.00,  'pending'),
  (11, 1009, 209, '2024-01-14', 410.00, 'completed'),
  (12, 1010, 210, '2024-01-14', 25.00,  'completed'),
  (13, 1002, 202, '2024-01-10', 89.50,  'completed'),
  (14, 1011, 211, '2024-01-15', 88.00,  'completed'),
  (15, 1012, 212, '2024-01-15', 135.00, 'pending'),
  (16, 1013, 213, '2024-01-16', 200.00, 'completed'),
  (17, 1014, 214, '2024-01-16', 55.50,  'completed'),
  (18, 1015, 215, '2024-01-17', 310.00, 'completed'),
  (19, 1016, 216, '2024-01-17', 77.00,  'cancelled'),
  (20, 1017, 217, '2024-01-18', 490.00, 'completed');`,
  solutionQuery: `SELECT
  order_id,
  COUNT(*) AS occurrences
FROM staging_orders
GROUP BY order_id
HAVING COUNT(*) > 1
ORDER BY occurrences DESC, order_id ASC;`,
  solutionExplanation: `## Explanation

### Pattern: Uniqueness Validation via GROUP BY + HAVING

This is the canonical pattern for detecting duplicate keys before a load operation.

### Step-by-step
1. **\`GROUP BY order_id\`**: Collapses all rows with the same order_id into a single group.
2. **\`COUNT(*)\`**: Counts how many raw rows belong to each group. A count > 1 means a duplicate.
3. **\`HAVING COUNT(*) > 1\`**: Filters groups — keeps only those with more than one occurrence.
4. **\`ORDER BY occurrences DESC, order_id ASC\`**: Surfaces the worst offenders first, then breaks ties by key value for a stable result.

### Why this approach
- Simple, readable, and runs efficiently on indexed columns.
- This check belongs at the start of a pipeline (before INSERT/MERGE) to fail fast.
- In production pipelines, this is often wrapped in an assertion: if the result set is non-empty, raise an alert and halt the load.

### When to use
- Pre-load validation gates in ETL pipelines
- Reconciliation checks after CDC (Change Data Capture) ingestion
- Audit queries before UNIQUE constraint enforcement in DWH tables`,
  solutionExplanationFr: `## Explication

### Patron : Validation d'unicite via GROUP BY + HAVING

C'est le patron canonique pour detecter les cles dupliquees avant une operation de chargement.

### Etape par etape
1. **\`GROUP BY order_id\`** : Regroupe toutes les lignes ayant le meme order_id en un seul groupe.
2. **\`COUNT(*)\`** : Compte combien de lignes brutes appartiennent a chaque groupe. Un compte > 1 signifie un doublon.
3. **\`HAVING COUNT(*) > 1\`** : Filtre les groupes — ne garde que ceux avec plus d'une occurrence.
4. **\`ORDER BY occurrences DESC, order_id ASC\`** : Remonte les cas les plus graves en premier, puis brise les egalites par valeur de cle pour un resultat stable.

### Pourquoi cette approche
- Simple, lisible et s'execute efficacement sur des colonnes indexees.
- Cette verification appartient au debut d'un pipeline (avant INSERT/MERGE) pour echouer rapidement.
- Dans les pipelines de production, cela est souvent enveloppe dans une assertion : si le jeu de resultats est non vide, declenchez une alerte et arretez le chargement.

### Quand l'utiliser
- Portes de validation pre-chargement dans les pipelines ETL
- Verifications de reconciliation apres ingestion CDC (Change Data Capture)
- Requetes d'audit avant l'application de contraintes UNIQUE dans les tables DWH`,
  testCases: [
    {
      name: "default",
      description: "Detects the 3 duplicate order_ids (1001×2, 1002×3) from the base dataset",
      descriptionFr: "Detecte les 3 order_id dupliques (1001×2, 1002×3) du jeu de donnees de base",
      expectedColumns: ["order_id", "occurrences"],
      expectedRows: [
        { order_id: 1002, occurrences: 3 },
        { order_id: 1001, occurrences: 2 },
      ],
      orderMatters: true,
    },
    {
      name: "no-duplicates-after-dedup",
      description: "After removing duplicates, the result should be empty",
      descriptionFr: "Apres suppression des doublons, le resultat doit etre vide",
      setupSql: `DELETE FROM staging_orders
WHERE row_id NOT IN (
  SELECT MIN(row_id)
  FROM staging_orders
  GROUP BY order_id
);`,
      expectedColumns: ["order_id", "occurrences"],
      expectedRows: [],
      orderMatters: false,
    },
  ],
};
