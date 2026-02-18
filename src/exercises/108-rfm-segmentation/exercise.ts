import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "108-rfm-segmentation",
  title: "RFM Customer Segmentation",
  titleFr: "Segmentation RFM des clients",
  difficulty: "hard",
  category: "window-functions",
  description: `## RFM Customer Segmentation

The growth team wants to build an **RFM (Recency, Frequency, Monetary)** segmentation model to identify their best customers. For each customer, compute:

1. **Recency score** (1–3): How recently they purchased. Use \`NTILE(3)\` ordered by last purchase date ASC (most recent = score 3).
2. **Frequency score** (1–3): How often they purchase. Use \`NTILE(3)\` ordered by number of orders ASC (most orders = score 3).
3. **Monetary score** (1–3): How much they spend. Use \`NTILE(3)\` ordered by total spending ASC (highest spending = score 3).

Use \`customer_name\` as a secondary sort in each NTILE to ensure deterministic bucket assignment when values are tied.
4. **rfm_segment**: Concatenate the three scores as a string (e.g., \`'333'\` for the best customers).

Reference date for recency: use each customer's last order date directly (no fixed reference date needed).

### Schema

| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| customer_name | VARCHAR |
| order_date | DATE |
| amount | DECIMAL(10,2) |

### Expected output columns
\`customer_name\`, \`last_order_date\`, \`order_count\`, \`total_spent\`, \`recency_score\`, \`frequency_score\`, \`monetary_score\`, \`rfm_segment\`

Order by rfm_segment DESC, customer_name ASC.`,
  descriptionFr: `## Segmentation RFM des clients

L'équipe croissance souhaite construire un modèle de segmentation **RFM (Récence, Fréquence, Montant)** pour identifier ses meilleurs clients. Pour chaque client, calculez :

1. **Score de récence** (1–3) : Date du dernier achat. Utilisez \`NTILE(3)\` ordonné par date du dernier achat ASC (plus récent = score 3).
2. **Score de fréquence** (1–3) : Fréquence d'achat. Utilisez \`NTILE(3)\` ordonné par nombre de commandes ASC (plus de commandes = score 3).
3. **Score monétaire** (1–3) : Montant total dépensé. Utilisez \`NTILE(3)\` ordonné par dépenses totales ASC (plus de dépenses = score 3).

Utilisez \`customer_name\` comme tri secondaire dans chaque NTILE pour garantir une attribution déterministe des groupes en cas d'égalité.
4. **rfm_segment** : Concaténez les trois scores en une chaîne (ex. \`'333'\` pour les meilleurs clients).

### Schema

| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| customer_name | VARCHAR |
| order_date | DATE |
| amount | DECIMAL(10,2) |

### Colonnes attendues en sortie
\`customer_name\`, \`last_order_date\`, \`order_count\`, \`total_spent\`, \`recency_score\`, \`frequency_score\`, \`monetary_score\`, \`rfm_segment\`

Triez par rfm_segment DESC, customer_name ASC.`,
  hint: "First, aggregate per customer to get last_order_date, order_count, and total_spent in a CTE. Then apply NTILE(3) with appropriate ORDER BY for each score dimension in a second CTE. Finally, concatenate the scores.",
  hintFr: "D'abord, agrégez par client pour obtenir last_order_date, order_count et total_spent dans un CTE. Puis appliquez NTILE(3) avec l'ORDER BY approprié pour chaque dimension de score dans un second CTE. Enfin, concaténez les scores.",
  schema: `CREATE TABLE orders (
  order_id INTEGER,
  customer_id INTEGER,
  customer_name VARCHAR,
  order_date DATE,
  amount DECIMAL(10,2)
);

INSERT INTO orders VALUES
  (1, 1, 'Alice', '2024-01-10', 150.00),
  (2, 1, 'Alice', '2024-03-15', 200.00),
  (3, 1, 'Alice', '2024-06-20', 350.00),
  (4, 1, 'Alice', '2024-09-05', 175.00),
  (5, 1, 'Alice', '2024-11-28', 420.00),
  (6, 2, 'Bob', '2024-02-14', 80.00),
  (7, 2, 'Bob', '2024-08-22', 120.00),
  (8, 3, 'Clara', '2024-05-01', 500.00),
  (9, 3, 'Clara', '2024-07-10', 650.00),
  (10, 3, 'Clara', '2024-10-15', 800.00),
  (11, 4, 'David', '2024-01-05', 45.00),
  (12, 5, 'Eva', '2024-04-18', 90.00),
  (13, 5, 'Eva', '2024-06-30', 110.00),
  (14, 5, 'Eva', '2024-09-12', 85.00),
  (15, 6, 'Frank', '2024-11-01', 1200.00),
  (16, 6, 'Frank', '2024-11-15', 900.00),
  (17, 6, 'Frank', '2024-12-01', 750.00),
  (18, 6, 'Frank', '2024-12-10', 600.00),
  (19, 7, 'Grace', '2024-03-20', 60.00),
  (20, 8, 'Henry', '2024-07-05', 300.00),
  (21, 8, 'Henry', '2024-10-20', 250.00),
  (22, 9, 'Iris', '2024-12-15', 180.00),
  (23, 9, 'Iris', '2024-12-20', 220.00),
  (24, 9, 'Iris', '2024-12-25', 310.00);`,
  solutionQuery: `WITH customer_metrics AS (
  SELECT
    customer_name,
    MAX(order_date) AS last_order_date,
    COUNT(*) AS order_count,
    SUM(amount) AS total_spent
  FROM orders
  GROUP BY customer_id, customer_name
),
scored AS (
  SELECT
    customer_name,
    last_order_date,
    order_count,
    total_spent,
    NTILE(3) OVER (ORDER BY last_order_date, customer_name) AS recency_score,
    NTILE(3) OVER (ORDER BY order_count, customer_name) AS frequency_score,
    NTILE(3) OVER (ORDER BY total_spent, customer_name) AS monetary_score
  FROM customer_metrics
)
SELECT
  customer_name,
  last_order_date,
  order_count,
  total_spent,
  recency_score,
  frequency_score,
  monetary_score,
  recency_score || frequency_score || monetary_score AS rfm_segment
FROM scored
ORDER BY rfm_segment DESC, customer_name;`,
  solutionExplanation: `## Explanation

### Pattern: RFM Segmentation with NTILE()

This uses a multi-step **CTE decomposition** pattern combined with **NTILE()** for scoring across multiple dimensions.

### Step-by-step
1. **CTE \`customer_metrics\`**: Aggregate raw orders into per-customer metrics (last order, count, total)
2. **CTE \`scored\`**: Apply NTILE(3) three times — once per RFM dimension:
   - Recency: ORDER BY last_order_date ASC → most recent customers get score 3
   - Frequency: ORDER BY order_count ASC → most frequent buyers get score 3
   - Monetary: ORDER BY total_spent ASC → highest spenders get score 3
3. **Final SELECT**: Concatenate scores into the segment string

### How NTILE(3) distributes 9 customers
- 9 / 3 = 3 per bucket → perfect split
- Bucket 1 (score 1): bottom third
- Bucket 2 (score 2): middle third
- Bucket 3 (score 3): top third

### Interpreting RFM segments
- **333**: Champions — recent, frequent, high-value (retention priority)
- **111**: Hibernating — old, rare, low-value (re-engagement or sunset)
- **311**: Can't lose them — used to be valuable but haven't returned
- **133**: Promising — recent but not yet frequent or high-value

### When to use
- Customer lifecycle management
- Targeted marketing campaigns
- Churn prevention programs`,
  solutionExplanationFr: `## Explication

### Pattern : Segmentation RFM avec NTILE()

Ce pattern utilise une **décomposition en CTE** multi-étapes combinée avec **NTILE()** pour scorer sur plusieurs dimensions.

### Étape par étape
1. **CTE \`customer_metrics\`** : Agréger les commandes en métriques par client
2. **CTE \`scored\`** : Appliquer NTILE(3) trois fois — une par dimension RFM
3. **SELECT final** : Concaténer les scores en chaîne de segment

### Comment NTILE(3) distribue 9 clients
- 9 / 3 = 3 par groupe → répartition parfaite

### Interpréter les segments RFM
- **333** : Champions — récents, fréquents, haute valeur
- **111** : En hibernation — anciens, rares, faible valeur
- **311** : À ne pas perdre — étaient précieux mais ne reviennent plus
- **133** : Prometteurs — récents mais pas encore fréquents ou haute valeur`,
  testCases: [
    {
      name: "default",
      description: "RFM segmentation for 9 customers with NTILE(3)",
      descriptionFr: "Segmentation RFM pour 9 clients avec NTILE(3)",
      expectedColumns: ["customer_name", "last_order_date", "order_count", "total_spent", "recency_score", "frequency_score", "monetary_score", "rfm_segment"],
      expectedRows: [
        { customer_name: "Alice", last_order_date: "2024-11-28", order_count: 5, total_spent: 1295.00, recency_score: 3, frequency_score: 3, monetary_score: 3, rfm_segment: "333" },
        { customer_name: "Frank", last_order_date: "2024-12-10", order_count: 4, total_spent: 3450.00, recency_score: 3, frequency_score: 3, monetary_score: 3, rfm_segment: "333" },
        { customer_name: "Iris", last_order_date: "2024-12-25", order_count: 3, total_spent: 710.00, recency_score: 3, frequency_score: 3, monetary_score: 2, rfm_segment: "332" },
        { customer_name: "Clara", last_order_date: "2024-10-15", order_count: 3, total_spent: 1950.00, recency_score: 2, frequency_score: 2, monetary_score: 3, rfm_segment: "223" },
        { customer_name: "Eva", last_order_date: "2024-09-12", order_count: 3, total_spent: 285.00, recency_score: 2, frequency_score: 2, monetary_score: 2, rfm_segment: "222" },
        { customer_name: "Henry", last_order_date: "2024-10-20", order_count: 2, total_spent: 550.00, recency_score: 2, frequency_score: 2, monetary_score: 2, rfm_segment: "222" },
        { customer_name: "Bob", last_order_date: "2024-08-22", order_count: 2, total_spent: 200.00, recency_score: 1, frequency_score: 1, monetary_score: 1, rfm_segment: "111" },
        { customer_name: "David", last_order_date: "2024-01-05", order_count: 1, total_spent: 45.00, recency_score: 1, frequency_score: 1, monetary_score: 1, rfm_segment: "111" },
        { customer_name: "Grace", last_order_date: "2024-03-20", order_count: 1, total_spent: 60.00, recency_score: 1, frequency_score: 1, monetary_score: 1, rfm_segment: "111" },
      ],
      orderMatters: true,
    },
    {
      name: "fewer-customers",
      description: "Works with smaller dataset (3 customers, 1 per tile)",
      descriptionFr: "Fonctionne avec un jeu de données réduit (3 clients, 1 par groupe)",
      setupSql: `DELETE FROM orders WHERE customer_id NOT IN (1, 4, 6);`,
      expectedColumns: ["customer_name", "last_order_date", "order_count", "total_spent", "recency_score", "frequency_score", "monetary_score", "rfm_segment"],
      expectedRows: [
        { customer_name: "Frank", last_order_date: "2024-12-10", order_count: 4, total_spent: 3450.00, recency_score: 3, frequency_score: 2, monetary_score: 3, rfm_segment: "323" },
        { customer_name: "Alice", last_order_date: "2024-11-28", order_count: 5, total_spent: 1295.00, recency_score: 2, frequency_score: 3, monetary_score: 2, rfm_segment: "232" },
        { customer_name: "David", last_order_date: "2024-01-05", order_count: 1, total_spent: 45.00, recency_score: 1, frequency_score: 1, monetary_score: 1, rfm_segment: "111" },
      ],
      orderMatters: true,
    },
  ],
};
