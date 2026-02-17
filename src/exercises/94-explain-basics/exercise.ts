import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "94-explain-basics",
  title: "Sargable Date Filtering",
  titleFr: "Filtrage de dates sargable",
  difficulty: "medium",
  category: "query-optimization",
  description: `## Sargable Date Filtering

The analytics team noticed that a nightly report runs slowly. After investigation, the culprit is a WHERE clause that wraps a column in a function, preventing the query engine from using range-based optimisation.

The current slow query uses:

\`\`\`sql
WHERE YEAR(order_date) = 2024
\`\`\`

This forces the engine to evaluate \`YEAR()\` for every single row before filtering.

### Schema

| Column | Type | Notes |
|--------|------|-------|
| order_id | INTEGER | Primary key |
| customer_id | INTEGER | FK to customer |
| order_date | DATE | Date the order was placed |
| total_amount | DECIMAL | Order total in USD |
| status | VARCHAR | 'completed', 'pending', 'cancelled' |

### Task

Rewrite the query to use a **sargable** range predicate that returns the same rows. The optimized version should filter orders placed in the year 2024 without applying any function to the \`order_date\` column.

Return: \`order_id\`, \`order_date\`, \`total_amount\`

Order by \`order_date\` ASC, then \`order_id\` ASC.`,

  descriptionFr: `## Filtrage de dates sargable

L'équipe analytique a remarqué qu'un rapport nocturne s'exécute lentement. Après investigation, la cause est une clause WHERE qui enveloppe une colonne dans une fonction, empêchant le moteur d'utiliser une optimisation par plage.

La requête lente actuelle utilise :

\`\`\`sql
WHERE YEAR(order_date) = 2024
\`\`\`

Cela force le moteur à évaluer \`YEAR()\` pour chaque ligne avant de filtrer.

### Schéma

| Colonne | Type | Notes |
|---------|------|-------|
| order_id | INTEGER | Clé primaire |
| customer_id | INTEGER | FK vers client |
| order_date | DATE | Date de la commande |
| total_amount | DECIMAL | Total de la commande en USD |
| status | VARCHAR | 'completed', 'pending', 'cancelled' |

### Tâche

Réécrire la requête en utilisant un prédicat de plage **sargable** qui retourne les mêmes lignes. La version optimisée doit filtrer les commandes de l'année 2024 sans appliquer de fonction à la colonne \`order_date\`.

Retourner : \`order_id\`, \`order_date\`, \`total_amount\`

Trier par \`order_date\` ASC, puis \`order_id\` ASC.`,

  hint: "Replace YEAR(order_date) = 2024 with a closed range: order_date >= '2024-01-01' AND order_date < '2025-01-01'. This lets the engine use index seeks instead of full scans.",
  hintFr: "Remplacer YEAR(order_date) = 2024 par une plage fermée : order_date >= '2024-01-01' AND order_date < '2025-01-01'. Cela permet au moteur d'utiliser des recherches par index au lieu de scans complets.",

  schema: `CREATE TABLE orders (
  order_id     INTEGER,
  customer_id  INTEGER,
  order_date   DATE,
  total_amount DECIMAL(10, 2),
  status       VARCHAR
);

INSERT INTO orders VALUES
  (1,  101, '2023-03-15', 129.99, 'completed'),
  (2,  102, '2023-07-22', 249.50, 'completed'),
  (3,  103, '2023-11-30', 89.00,  'cancelled'),
  (4,  101, '2024-01-05', 310.00, 'completed'),
  (5,  104, '2024-01-18', 75.25,  'pending'),
  (6,  102, '2024-02-14', 199.99, 'completed'),
  (7,  105, '2024-03-01', 450.00, 'completed'),
  (8,  103, '2024-04-10', 60.00,  'cancelled'),
  (9,  106, '2024-05-05', 320.80, 'completed'),
  (10, 101, '2024-06-20', 145.00, 'pending'),
  (11, 107, '2024-07-11', 98.40,  'completed'),
  (12, 104, '2024-08-03', 512.00, 'completed'),
  (13, 102, '2024-09-17', 37.50,  'cancelled'),
  (14, 108, '2024-10-29', 275.00, 'completed'),
  (15, 105, '2024-11-08', 189.90, 'completed'),
  (16, 106, '2024-12-01', 405.00, 'completed'),
  (17, 109, '2024-12-31', 55.00,  'pending'),
  (18, 107, '2025-01-03', 220.00, 'completed'),
  (19, 108, '2025-02-14', 310.50, 'completed'),
  (20, 109, '2025-03-08', 140.00, 'pending');`,

  solutionQuery: `SELECT
  order_id,
  order_date,
  total_amount
FROM orders
WHERE order_date >= '2024-01-01'
  AND order_date < '2025-01-01'
ORDER BY order_date, order_id;`,

  solutionExplanation: `## Explanation

### Pattern: Sargable range predicate for date filtering

A predicate is **sargable** (Search ARGument ABLE) when the query engine can use it to perform an index seek or range scan, instead of evaluating a function on every row.

### Step-by-step

1. **Anti-pattern** — \`WHERE YEAR(order_date) = 2024\` applies a scalar function to the column, which makes the predicate non-sargable. The engine must read every row, compute \`YEAR()\`, then discard non-matching rows.

2. **Optimized version** — \`WHERE order_date >= '2024-01-01' AND order_date < '2025-01-01'\` expresses the same business rule as a closed range on the raw column value. No transformation is applied to the column itself.

3. **Boundary choice** — Using \`< '2025-01-01'\` (strict less-than) rather than \`<= '2024-12-31'\` is safer with TIMESTAMP columns (avoids missing values at 23:59:59 vs midnight). It works correctly for DATE columns too.

### Why this approach

- The engine can perform a range scan on \`order_date\` without reading every row.
- In DuckDB and most analytical engines, columnar storage and zone maps benefit directly from range predicates.
- The result set is identical to the function-based version.

### When to use

Any time you filter on a date column by year, month, or quarter. Always transform the **literal**, never the **column**:
- Year: \`col >= '2024-01-01' AND col < '2025-01-01'\`
- Month: \`col >= '2024-03-01' AND col < '2024-04-01'\`
- Quarter: \`col >= '2024-07-01' AND col < '2024-10-01'\``,

  solutionExplanationFr: `## Explication

### Patron : Prédicat de plage sargable pour le filtrage de dates

Un prédicat est **sargable** (Search ARGument ABLE) lorsque le moteur peut l'utiliser pour effectuer une recherche d'index ou un scan de plage, au lieu d'évaluer une fonction sur chaque ligne.

### Étape par étape

1. **Anti-patron** — \`WHERE YEAR(order_date) = 2024\` applique une fonction scalaire à la colonne, rendant le prédicat non-sargable. Le moteur doit lire chaque ligne, calculer \`YEAR()\`, puis écarter les lignes non correspondantes.

2. **Version optimisée** — \`WHERE order_date >= '2024-01-01' AND order_date < '2025-01-01'\` exprime la même règle métier sous forme d'une plage fermée sur la valeur brute de la colonne. Aucune transformation n'est appliquée à la colonne elle-même.

3. **Choix des bornes** — Utiliser \`< '2025-01-01'\` (strictement inférieur) plutôt que \`<= '2024-12-31'\` est plus sûr avec des colonnes TIMESTAMP (évite de manquer des valeurs à 23:59:59 vs minuit). Cela fonctionne aussi correctement pour les colonnes DATE.

### Pourquoi cette approche

- Le moteur peut effectuer un scan de plage sur \`order_date\` sans lire chaque ligne.
- Dans DuckDB et la plupart des moteurs analytiques, le stockage en colonnes et les zone maps bénéficient directement des prédicats de plage.
- Le résultat est identique à la version avec fonction.

### Quand l'utiliser

Chaque fois que vous filtrez une colonne de date par année, mois ou trimestre. Transformez toujours le **littéral**, jamais la **colonne** :
- Année : \`col >= '2024-01-01' AND col < '2025-01-01'\`
- Mois : \`col >= '2024-03-01' AND col < '2024-04-01'\`
- Trimestre : \`col >= '2024-07-01' AND col < '2024-10-01'\``,

  testCases: [
    {
      name: "default",
      description: "14 orders placed in 2024, ordered by date then order_id",
      descriptionFr: "14 commandes passées en 2024, triées par date puis order_id",
      expectedColumns: ["order_id", "order_date", "total_amount"],
      expectedRows: [
        { order_id: 4,  order_date: "2024-01-05", total_amount: 310.00 },
        { order_id: 5,  order_date: "2024-01-18", total_amount: 75.25  },
        { order_id: 6,  order_date: "2024-02-14", total_amount: 199.99 },
        { order_id: 7,  order_date: "2024-03-01", total_amount: 450.00 },
        { order_id: 8,  order_date: "2024-04-10", total_amount: 60.00  },
        { order_id: 9,  order_date: "2024-05-05", total_amount: 320.80 },
        { order_id: 10, order_date: "2024-06-20", total_amount: 145.00 },
        { order_id: 11, order_date: "2024-07-11", total_amount: 98.40  },
        { order_id: 12, order_date: "2024-08-03", total_amount: 512.00 },
        { order_id: 13, order_date: "2024-09-17", total_amount: 37.50  },
        { order_id: 14, order_date: "2024-10-29", total_amount: 275.00 },
        { order_id: 15, order_date: "2024-11-08", total_amount: 189.90 },
        { order_id: 16, order_date: "2024-12-01", total_amount: 405.00 },
        { order_id: 17, order_date: "2024-12-31", total_amount: 55.00  },
      ],
      orderMatters: true,
    },
    {
      name: "boundary-exclusion",
      description: "Orders on Jan 1 2025 must NOT be included; orders on Jan 1 2024 must be included",
      descriptionFr: "Les commandes du 1er jan 2025 ne doivent PAS être incluses ; celles du 1er jan 2024 doivent l'être",
      setupSql: `DELETE FROM orders WHERE order_id > 17;
INSERT INTO orders VALUES
  (21, 110, '2024-01-01', 999.00, 'completed'),
  (22, 111, '2025-01-01', 111.00, 'completed');`,
      expectedColumns: ["order_id", "order_date", "total_amount"],
      expectedRows: [
        { order_id: 21, order_date: "2024-01-01", total_amount: 999.00 },
        { order_id: 4,  order_date: "2024-01-05", total_amount: 310.00 },
        { order_id: 5,  order_date: "2024-01-18", total_amount: 75.25  },
        { order_id: 6,  order_date: "2024-02-14", total_amount: 199.99 },
        { order_id: 7,  order_date: "2024-03-01", total_amount: 450.00 },
        { order_id: 8,  order_date: "2024-04-10", total_amount: 60.00  },
        { order_id: 9,  order_date: "2024-05-05", total_amount: 320.80 },
        { order_id: 10, order_date: "2024-06-20", total_amount: 145.00 },
        { order_id: 11, order_date: "2024-07-11", total_amount: 98.40  },
        { order_id: 12, order_date: "2024-08-03", total_amount: 512.00 },
        { order_id: 13, order_date: "2024-09-17", total_amount: 37.50  },
        { order_id: 14, order_date: "2024-10-29", total_amount: 275.00 },
        { order_id: 15, order_date: "2024-11-08", total_amount: 189.90 },
        { order_id: 16, order_date: "2024-12-01", total_amount: 405.00 },
        { order_id: 17, order_date: "2024-12-31", total_amount: 55.00  },
      ],
      orderMatters: true,
    },
  ],
};
