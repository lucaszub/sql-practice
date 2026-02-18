import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "120-gap-detection",
  title: "Find Missing Invoice Numbers",
  titleFr: "Trouver les numéros de factures manquants",
  difficulty: "hard",
  category: "gaps-islands",
  description: `## Find Missing Invoice Numbers

The accounting team discovered that some invoice numbers are **missing from the sequence** and suspects data entry errors. Write a query to find all gaps in the invoice numbering sequence — specifically, the start and end of each missing range.

### Schema

| Column | Type |
|--------|------|
| invoice_number | INTEGER |
| invoice_date | DATE |
| amount | DECIMAL(10,2) |

### Expected output columns
\`gap_start\`, \`gap_end\`, \`missing_count\`

- \`gap_start\`: First missing number in the gap
- \`gap_end\`: Last missing number in the gap
- \`missing_count\`: How many numbers are missing in this gap
- Order by gap_start ASC.`,
  descriptionFr: `## Trouver les numéros de factures manquants

L'équipe comptable a découvert que certains numéros de factures sont **absents de la séquence** et suspecte des erreurs de saisie. Écrivez une requête pour trouver toutes les lacunes dans la séquence de numérotation — spécifiquement, le début et la fin de chaque plage manquante.

### Schema

| Column | Type |
|--------|------|
| invoice_number | INTEGER |
| invoice_date | DATE |
| amount | DECIMAL(10,2) |

### Colonnes attendues en sortie
\`gap_start\`, \`gap_end\`, \`missing_count\`

- \`gap_start\` : Premier numéro manquant dans la lacune
- \`gap_end\` : Dernier numéro manquant dans la lacune
- \`missing_count\` : Combien de numéros manquent dans cette lacune
- Triez par gap_start ASC.`,
  hint: "Use LEAD(invoice_number) OVER (ORDER BY invoice_number) to find the next invoice number. When the gap between current and next is greater than 1, there are missing numbers.",
  hintFr: "Utilisez LEAD(invoice_number) OVER (ORDER BY invoice_number) pour trouver le prochain numéro de facture. Quand l'écart entre le courant et le suivant est supérieur à 1, il y a des numéros manquants.",
  schema: `CREATE TABLE invoices (
  invoice_number INTEGER,
  invoice_date DATE,
  amount DECIMAL(10,2)
);

INSERT INTO invoices VALUES
  (1001, '2024-01-02', 250.00),
  (1002, '2024-01-03', 180.00),
  (1003, '2024-01-05', 320.00),
  (1006, '2024-01-08', 450.00),
  (1007, '2024-01-09', 275.00),
  (1010, '2024-01-12', 190.00),
  (1011, '2024-01-13', 600.00),
  (1012, '2024-01-14', 340.00),
  (1013, '2024-01-15', 210.00),
  (1020, '2024-01-22', 550.00);`,
  solutionQuery: `WITH with_next AS (
  SELECT
    invoice_number,
    LEAD(invoice_number) OVER (ORDER BY invoice_number) AS next_invoice
  FROM invoices
)
SELECT
  invoice_number + 1 AS gap_start,
  next_invoice - 1 AS gap_end,
  next_invoice - invoice_number - 1 AS missing_count
FROM with_next
WHERE next_invoice - invoice_number > 1
ORDER BY gap_start;`,
  solutionExplanation: `## Explanation

### Pattern: Gap detection with LEAD()

This is the **gap detection** variant of the gap-and-island family. Instead of grouping consecutive values, we find where the sequence breaks.

### Step-by-step
1. \`LEAD(invoice_number) OVER (ORDER BY invoice_number)\` — gets the next invoice number in sequence
2. \`WHERE next_invoice - invoice_number > 1\` — identifies gaps (where the jump is more than 1)
3. \`gap_start = invoice_number + 1\` — first missing number
4. \`gap_end = next_invoice - 1\` — last missing number
5. \`missing_count = next_invoice - invoice_number - 1\` — how many are missing

### Why LEAD() is elegant here
The alternative (self-join to find the minimum number greater than current) is verbose and slower. LEAD() directly accesses the next row, making the gap calculation straightforward.

### Real-world gap detection scenarios
- **Invoice audit**: Find missing numbers in invoice sequences
- **Time series monitoring**: Detect missing hours/days in sensor data
- **Sequence validation**: Ensure batch IDs, ticket numbers, or order IDs are continuous
- **Data quality**: Find missing records after a data migration

### When to use
- Audit and compliance checks
- Data quality validation
- Sequence integrity verification`,
  solutionExplanationFr: `## Explication

### Pattern : Détection de lacunes avec LEAD()

C'est la variante **détection de lacunes** de la famille gap-and-island. Au lieu de regrouper les valeurs consécutives, on trouve où la séquence se brise.

### Étape par étape
1. \`LEAD(invoice_number) OVER (ORDER BY invoice_number)\` — obtient le prochain numéro de facture
2. \`WHERE next_invoice - invoice_number > 1\` — identifie les lacunes
3. \`gap_start = invoice_number + 1\` — premier numéro manquant
4. \`gap_end = next_invoice - 1\` — dernier numéro manquant

### Quand l'utiliser
- Contrôles d'audit et de conformité
- Validation de la qualité des données
- Vérification d'intégrité de séquences`,
  testCases: [
    {
      name: "default",
      description: "Find gaps in invoice number sequence",
      descriptionFr: "Trouver les lacunes dans la séquence de numéros de factures",
      expectedColumns: ["gap_start", "gap_end", "missing_count"],
      expectedRows: [
        { gap_start: 1004, gap_end: 1005, missing_count: 2 },
        { gap_start: 1008, gap_end: 1009, missing_count: 2 },
        { gap_start: 1014, gap_end: 1019, missing_count: 6 },
      ],
      orderMatters: true,
    },
    {
      name: "no-gaps",
      description: "Consecutive invoices have no gaps",
      descriptionFr: "Les factures consécutives n'ont pas de lacunes",
      setupSql: `DELETE FROM invoices; INSERT INTO invoices VALUES (1, '2024-01-01', 100.00), (2, '2024-01-02', 200.00), (3, '2024-01-03', 150.00);`,
      expectedColumns: ["gap_start", "gap_end", "missing_count"],
      expectedRows: [],
      orderMatters: false,
    },
  ],
};
