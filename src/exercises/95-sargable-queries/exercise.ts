import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "95-sargable-queries",
  title: "Rewriting Non-Sargable Predicates",
  titleFr: "Réécriture de prédicats non-sargables",
  difficulty: "medium",
  category: "query-optimization",
  description: `## Rewriting Non-Sargable Predicates

The data platform team is reviewing the product catalog queries and found three problematic patterns that prevent the query engine from using efficient index scans:

1. **Function on column**: \`WHERE LOWER(category) = 'electronics'\`
2. **Leading wildcard**: \`WHERE sku LIKE '%PRD'\`
3. **Arithmetic on column**: \`WHERE price * 1.2 > 100\`

Each of these forces a full table scan because the engine cannot determine which rows match without reading every single one.

### Schema

| Column | Type | Notes |
|--------|------|-------|
| product_id | INTEGER | Primary key |
| sku | VARCHAR | Product code, format 'PRD-NNN' |
| name | VARCHAR | Product name |
| category | VARCHAR | Always stored in title case (e.g. 'Electronics') |
| price | DECIMAL | Price before tax |
| is_active | BOOLEAN | Whether the product is listed |

### Task

Write a single query that retrieves **active products in the Electronics category priced above 83.33** (equivalent to \`price * 1.2 > 100\`) using only sargable predicates — no functions on columns, no leading wildcards, no arithmetic on columns.

Return: \`product_id\`, \`sku\`, \`name\`, \`price\`

Order by \`price\` DESC, then \`product_id\` ASC.`,

  descriptionFr: `## Réécriture de prédicats non-sargables

L'équipe de la plateforme de données révise les requêtes du catalogue produits et a trouvé trois patterns problématiques qui empêchent le moteur d'utiliser des scans d'index efficaces :

1. **Fonction sur colonne** : \`WHERE LOWER(category) = 'electronics'\`
2. **Joker en tête** : \`WHERE sku LIKE '%PRD'\`
3. **Arithmétique sur colonne** : \`WHERE price * 1.2 > 100\`

Chacun de ces patterns force un scan complet de la table car le moteur ne peut pas déterminer quelles lignes correspondent sans lire chacune d'elles.

### Schéma

| Colonne | Type | Notes |
|---------|------|-------|
| product_id | INTEGER | Clé primaire |
| sku | VARCHAR | Code produit, format 'PRD-NNN' |
| name | VARCHAR | Nom du produit |
| category | VARCHAR | Toujours stocké en casse titre (ex : 'Electronics') |
| price | DECIMAL | Prix hors taxes |
| is_active | BOOLEAN | Si le produit est référencé |

### Tâche

Écrire une requête unique qui récupère les **produits actifs de la catégorie Electronics dont le prix est supérieur à 83,33** (équivalent à \`price * 1.2 > 100\`) en utilisant uniquement des prédicats sargables — pas de fonctions sur les colonnes, pas de jokers en tête, pas d'arithmétique sur les colonnes.

Retourner : \`product_id\`, \`sku\`, \`name\`, \`price\`

Trier par \`price\` DESC, puis \`product_id\` ASC.`,

  hint: "The category column is always stored in title case, so compare directly: category = 'Electronics'. Move arithmetic to the literal side: price > 100 / 1.2. For the SKU pattern, if you need prefix matching use LIKE 'PRD%' (trailing wildcard is fine).",
  hintFr: "La colonne category est toujours en casse titre, donc comparer directement : category = 'Electronics'. Déplacer l'arithmétique côté littéral : price > 100 / 1.2. Pour le pattern SKU, si vous avez besoin d'un préfixe utilisez LIKE 'PRD%' (le joker en fin est acceptable).",

  schema: `CREATE TABLE products (
  product_id INTEGER,
  sku        VARCHAR,
  name       VARCHAR,
  category   VARCHAR,
  price      DECIMAL(10, 2),
  is_active  BOOLEAN
);

INSERT INTO products VALUES
  (1,  'PRD-001', 'Wireless Headphones',   'Electronics', 149.99, true),
  (2,  'PRD-002', 'USB-C Hub',             'Electronics', 49.99,  true),
  (3,  'PRD-003', 'Laptop Stand',          'Accessories', 35.00,  true),
  (4,  'PRD-004', 'Mechanical Keyboard',   'Electronics', 129.00, true),
  (5,  'PRD-005', 'Webcam HD',             'Electronics', 89.99,  true),
  (6,  'PRD-006', 'Desk Lamp',             'Accessories', 45.00,  false),
  (7,  'PRD-007', 'Bluetooth Speaker',     'Electronics', 79.00,  true),
  (8,  'PRD-008', 'Monitor 27"',           'Electronics', 319.00, true),
  (9,  'PRD-009', 'Ergonomic Mouse',       'Electronics', 59.99,  true),
  (10, 'PRD-010', 'Notebook 5-pack',       'Stationery',  12.50,  true),
  (11, 'PRD-011', 'Smart Watch',           'Electronics', 199.00, true),
  (12, 'PRD-012', 'Phone Stand',           'Accessories', 18.00,  true),
  (13, 'PRD-013', 'Portable SSD 1TB',      'Electronics', 109.99, true),
  (14, 'PRD-014', 'Cable Organiser',       'Accessories', 9.99,   true),
  (15, 'PRD-015', 'Graphics Tablet',       'Electronics', 249.00, false),
  (16, 'PRD-016', 'HDMI Cable 2m',         'Electronics', 14.99,  true),
  (17, 'PRD-017', 'Noise-Cancel Earbuds',  'Electronics', 94.99,  true),
  (18, 'PRD-018', 'Printer Ink Set',       'Stationery',  29.00,  true),
  (19, 'PRD-019', 'Surge Protector',       'Electronics', 39.99,  false),
  (20, 'PRD-020', 'LED Ring Light',        'Electronics', 55.00,  true);`,

  solutionQuery: `SELECT
  product_id,
  sku,
  name,
  price
FROM products
WHERE category = 'Electronics'
  AND is_active = true
  AND price > 100.0 / 1.2
ORDER BY price DESC, product_id;`,

  solutionExplanation: `## Explanation

### Pattern: Sargable predicate rewriting

A **sargable** predicate lets the query engine push the filter down to storage, enabling range scans and skip reads instead of evaluating expressions row by row.

### Step-by-step

1. **Function on column** → **direct comparison**
   - Non-sargable: \`LOWER(category) = 'electronics'\`
   - Sargable: \`category = 'Electronics'\`
   - Because the column is always stored in title case, we compare the literal in the same case. No transformation of the column is needed.

2. **Leading wildcard** → **trailing wildcard or exact match**
   - Non-sargable: \`sku LIKE '%PRD'\` (engine cannot skip rows without reading them)
   - Sargable: \`sku LIKE 'PRD-%'\` (prefix match allows range scan)
   - In this exercise the sku filter is implicit in the category check; the principle is: always put the wildcard at the end.

3. **Arithmetic on column** → **arithmetic on literal**
   - Non-sargable: \`price * 1.2 > 100\`
   - Sargable: \`price > 100.0 / 1.2\` (≈ 83.33)
   - Move all computation to the right-hand side (the literal). The column appears alone on the left.

### Why this approach

- Avoids computing an expression for every row before filtering.
- In columnar engines like DuckDB, zone maps (min/max per row group) can only be used when the predicate applies to the raw column value.
- Result is identical — only the execution plan changes.

### When to use

Apply this rewriting whenever you see: functions wrapping a column in WHERE, leading wildcards in LIKE, or arithmetic applied to a column. Always ask: "Can I move the transformation to the literal instead?"`,

  solutionExplanationFr: `## Explication

### Patron : Réécriture de prédicats sargables

Un prédicat **sargable** permet au moteur de pousser le filtre vers le stockage, activant les scans de plage et le saut de lignes au lieu d'évaluer des expressions ligne par ligne.

### Étape par étape

1. **Fonction sur colonne** → **comparaison directe**
   - Non-sargable : \`LOWER(category) = 'electronics'\`
   - Sargable : \`category = 'Electronics'\`
   - La colonne étant toujours en casse titre, on compare le littéral dans la même casse. Aucune transformation de la colonne n'est nécessaire.

2. **Joker en tête** → **joker en fin ou correspondance exacte**
   - Non-sargable : \`sku LIKE '%PRD'\` (le moteur ne peut pas sauter de lignes sans les lire)
   - Sargable : \`sku LIKE 'PRD-%'\` (le préfixe permet un scan de plage)
   - Le principe : toujours mettre le joker à la fin.

3. **Arithmétique sur colonne** → **arithmétique sur littéral**
   - Non-sargable : \`price * 1.2 > 100\`
   - Sargable : \`price > 100.0 / 1.2\` (≈ 83,33)
   - Déplacer tout calcul vers le côté droit (le littéral). La colonne apparaît seule à gauche.

### Pourquoi cette approche

- Évite de calculer une expression pour chaque ligne avant de filtrer.
- Dans les moteurs orientés colonnes comme DuckDB, les zone maps (min/max par groupe de lignes) ne peuvent être utilisées que lorsque le prédicat s'applique à la valeur brute de la colonne.
- Le résultat est identique — seul le plan d'exécution change.

### Quand l'utiliser

Appliquer cette réécriture chaque fois que vous voyez : des fonctions enveloppant une colonne dans WHERE, des jokers en tête dans LIKE, ou de l'arithmétique appliquée à une colonne. Posez toujours la question : "Puis-je déplacer la transformation vers le littéral ?"`,

  testCases: [
    {
      name: "default",
      description: "Active Electronics products with price > 83.33, ordered by price DESC then product_id",
      descriptionFr: "Produits Electronics actifs avec price > 83,33, triés par price DESC puis product_id",
      expectedColumns: ["product_id", "sku", "name", "price"],
      expectedRows: [
        { product_id: 8,  sku: "PRD-008", name: 'Monitor 27"',           price: 319.00 },
        { product_id: 11, sku: "PRD-011", name: "Smart Watch",           price: 199.00 },
        { product_id: 1,  sku: "PRD-001", name: "Wireless Headphones",   price: 149.99 },
        { product_id: 4,  sku: "PRD-004", name: "Mechanical Keyboard",   price: 129.00 },
        { product_id: 13, sku: "PRD-013", name: "Portable SSD 1TB",      price: 109.99 },
        { product_id: 17, sku: "PRD-017", name: "Noise-Cancel Earbuds",  price: 94.99  },
        { product_id: 5,  sku: "PRD-005", name: "Webcam HD",             price: 89.99  },
      ],
      orderMatters: true,
    },
    {
      name: "inactive-excluded",
      description: "Inactive Electronics products must not appear even if their price qualifies",
      descriptionFr: "Les produits Electronics inactifs ne doivent pas apparaître même si leur prix est éligible",
      setupSql: `UPDATE products SET is_active = true WHERE product_id = 15;
UPDATE products SET price = 250.00 WHERE product_id = 15;`,
      expectedColumns: ["product_id", "sku", "name", "price"],
      expectedRows: [
        { product_id: 8,  sku: "PRD-008", name: 'Monitor 27"',           price: 319.00 },
        { product_id: 15, sku: "PRD-015", name: "Graphics Tablet",       price: 250.00 },
        { product_id: 11, sku: "PRD-011", name: "Smart Watch",           price: 199.00 },
        { product_id: 1,  sku: "PRD-001", name: "Wireless Headphones",   price: 149.99 },
        { product_id: 4,  sku: "PRD-004", name: "Mechanical Keyboard",   price: 129.00 },
        { product_id: 13, sku: "PRD-013", name: "Portable SSD 1TB",      price: 109.99 },
        { product_id: 17, sku: "PRD-017", name: "Noise-Cancel Earbuds",  price: 94.99  },
        { product_id: 5,  sku: "PRD-005", name: "Webcam HD",             price: 89.99  },
      ],
      orderMatters: true,
    },
  ],
};
