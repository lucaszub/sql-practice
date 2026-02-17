import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "116-rows-vs-range",
  title: "ROWS vs RANGE Frame Comparison",
  titleFr: "Comparaison des cadres ROWS et RANGE",
  difficulty: "hard",
  category: "running-totals",
  description: `## ROWS vs RANGE Frame Comparison

The analytics team noticed unexpected results in a running total calculation and suspects it's related to **duplicate dates** in the dataset. Write a query that demonstrates the difference between \`ROWS\` and \`RANGE\` frames by computing both types of running totals.

Some dates have multiple transactions. The **ROWS** frame counts physical rows, while the **RANGE** frame groups rows with the same ORDER BY value together.

### Schema

| Column | Type |
|--------|------|
| transaction_id | INTEGER |
| transaction_date | DATE |
| amount | DECIMAL(10,2) |

### Expected output columns
\`transaction_id\`, \`transaction_date\`, \`amount\`, \`rows_running_total\`, \`range_running_total\`

- \`rows_running_total\`: SUM using \`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\`
- \`range_running_total\`: SUM using \`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\`
- Order by transaction_date ASC, transaction_id ASC.`,
  descriptionFr: `## Comparaison des cadres ROWS et RANGE

L'équipe analytics a remarqué des résultats inattendus dans un calcul de total cumulé et suspecte que c'est lié aux **dates en double** dans le jeu de données. Écrivez une requête démontrant la différence entre les cadres \`ROWS\` et \`RANGE\`.

Certaines dates ont plusieurs transactions. Le cadre **ROWS** compte les lignes physiques, tandis que le cadre **RANGE** regroupe les lignes avec la même valeur ORDER BY.

### Schema

| Column | Type |
|--------|------|
| transaction_id | INTEGER |
| transaction_date | DATE |
| amount | DECIMAL(10,2) |

### Colonnes attendues en sortie
\`transaction_id\`, \`transaction_date\`, \`amount\`, \`rows_running_total\`, \`range_running_total\`

- \`rows_running_total\` : SUM utilisant \`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\`
- \`range_running_total\` : SUM utilisant \`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\`
- Triez par transaction_date ASC, transaction_id ASC.`,
  hint: "Compute two separate window functions with different frame specifications. ROWS counts physical row positions; RANGE includes all rows with the same ORDER BY value as the current row.",
  hintFr: "Calculez deux fonctions de fenêtre séparées avec des spécifications de cadre différentes. ROWS compte les positions physiques des lignes ; RANGE inclut toutes les lignes avec la même valeur ORDER BY que la ligne courante.",
  schema: `CREATE TABLE transactions (
  transaction_id INTEGER,
  transaction_date DATE,
  amount DECIMAL(10,2)
);

INSERT INTO transactions VALUES
  (1, '2024-01-01', 100.00),
  (2, '2024-01-02', 200.00),
  (3, '2024-01-02', 150.00),
  (4, '2024-01-03', 300.00),
  (5, '2024-01-04', 250.00),
  (6, '2024-01-04', 175.00),
  (7, '2024-01-04', 125.00),
  (8, '2024-01-05', 400.00);`,
  solutionQuery: `SELECT
  transaction_id,
  transaction_date,
  amount,
  SUM(amount) OVER (ORDER BY transaction_date, transaction_id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS rows_running_total,
  SUM(amount) OVER (ORDER BY transaction_date RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS range_running_total
FROM transactions
ORDER BY transaction_date, transaction_id;`,
  solutionExplanation: `## Explanation

### Pattern: Understanding ROWS vs RANGE frame specifications

This exercise demonstrates a critical distinction in window function frame types.

### How ROWS works
\`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\`
- Counts **physical row positions** in the result set
- Each row gets a different running total, even for the same date
- Deterministic when ORDER BY includes a tiebreaker (transaction_id)

### How RANGE works
\`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\`
- Groups rows by **ORDER BY value** (the date)
- All rows with the same date get the **same running total**
- Includes ALL rows with the same date in the sum

### Visual example (Jan 4 has 3 transactions):

| id | date | amount | ROWS total | RANGE total |
|----|------|--------|-----------|-------------|
| 5 | Jan 4 | 250 | 1000 | 1300 |
| 6 | Jan 4 | 175 | 1175 | 1300 |
| 7 | Jan 4 | 125 | 1300 | 1300 |

ROWS increments row-by-row. RANGE jumps to the same total for all Jan 4 rows.

### Best practice
- **Always specify the frame explicitly** when using ORDER BY in window functions
- Use ROWS for most running total calculations (predictable, incremental)
- Use RANGE when you specifically want to group duplicate ORDER BY values

### DuckDB note
DuckDB supports both ROWS and RANGE, plus the less common GROUPS frame type which counts distinct groups of ORDER BY values.`,
  solutionExplanationFr: `## Explication

### Pattern : Comprendre les cadres ROWS vs RANGE

Cet exercice démontre une distinction critique dans les types de cadres de fonctions de fenêtre.

### Comment ROWS fonctionne
- Compte les **positions physiques des lignes**
- Chaque ligne obtient un total cumulé différent, même pour la même date

### Comment RANGE fonctionne
- Regroupe les lignes par **valeur ORDER BY** (la date)
- Toutes les lignes avec la même date obtiennent le **même total cumulé**

### Bonne pratique
- **Toujours spécifier le cadre explicitement** lors de l'utilisation de ORDER BY dans les fonctions de fenêtre
- Utiliser ROWS pour la plupart des calculs de total cumulé
- Utiliser RANGE quand on veut spécifiquement regrouper les valeurs ORDER BY dupliquées`,
  testCases: [
    {
      name: "default",
      description: "ROWS vs RANGE running totals with duplicate dates",
      descriptionFr: "Totaux cumulés ROWS vs RANGE avec des dates en double",
      expectedColumns: ["transaction_id", "transaction_date", "amount", "rows_running_total", "range_running_total"],
      expectedRows: [
        { transaction_id: 1, transaction_date: "2024-01-01", amount: 100.00, rows_running_total: 100.00, range_running_total: 100.00 },
        { transaction_id: 2, transaction_date: "2024-01-02", amount: 200.00, rows_running_total: 300.00, range_running_total: 450.00 },
        { transaction_id: 3, transaction_date: "2024-01-02", amount: 150.00, rows_running_total: 450.00, range_running_total: 450.00 },
        { transaction_id: 4, transaction_date: "2024-01-03", amount: 300.00, rows_running_total: 750.00, range_running_total: 750.00 },
        { transaction_id: 5, transaction_date: "2024-01-04", amount: 250.00, rows_running_total: 1000.00, range_running_total: 1300.00 },
        { transaction_id: 6, transaction_date: "2024-01-04", amount: 175.00, rows_running_total: 1175.00, range_running_total: 1300.00 },
        { transaction_id: 7, transaction_date: "2024-01-04", amount: 125.00, rows_running_total: 1300.00, range_running_total: 1300.00 },
        { transaction_id: 8, transaction_date: "2024-01-05", amount: 400.00, rows_running_total: 1700.00, range_running_total: 1700.00 },
      ],
      orderMatters: true,
    },
    {
      name: "no-duplicates",
      description: "When no duplicate dates exist, ROWS and RANGE produce identical results",
      descriptionFr: "Sans dates en double, ROWS et RANGE produisent des résultats identiques",
      setupSql: `DELETE FROM transactions WHERE transaction_id IN (3, 6, 7);`,
      expectedColumns: ["transaction_id", "transaction_date", "amount", "rows_running_total", "range_running_total"],
      expectedRows: [
        { transaction_id: 1, transaction_date: "2024-01-01", amount: 100.00, rows_running_total: 100.00, range_running_total: 100.00 },
        { transaction_id: 2, transaction_date: "2024-01-02", amount: 200.00, rows_running_total: 300.00, range_running_total: 300.00 },
        { transaction_id: 4, transaction_date: "2024-01-03", amount: 300.00, rows_running_total: 600.00, range_running_total: 600.00 },
        { transaction_id: 5, transaction_date: "2024-01-04", amount: 250.00, rows_running_total: 850.00, range_running_total: 850.00 },
        { transaction_id: 8, transaction_date: "2024-01-05", amount: 400.00, rows_running_total: 1250.00, range_running_total: 1250.00 },
      ],
      orderMatters: true,
    },
  ],
};
