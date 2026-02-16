import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "41-self-join-price-comparison",
  title: "Same-Category Price Comparisons",
  titleFr: "Comparaisons de prix au sein d'une meme categorie",
  difficulty: "medium",
  category: "multi-table-joins",
  description: `## Same-Category Price Comparisons

The pricing team wants to compare every pair of products within the same category to understand price spread. For each pair, they need to see both product names, the category, both prices, and the price difference.

Write a query that generates all unique product pairs within the same category and calculates the price difference.

### Schema

**products**
| Column | Type |
|--------|------|
| product_id | INTEGER |
| product_name | VARCHAR |
| category | VARCHAR |
| price | DECIMAL(10,2) |

### Expected output columns
\`product_a\`, \`product_b\`, \`category\`, \`price_a\`, \`price_b\`, \`price_difference\`

To avoid duplicate pairs, only include pairs where the first product's ID is less than the second's. The \`price_difference\` should be \`price_b - price_a\`.

Order by \`category\` ASC, then \`price_difference\` DESC, then \`product_a\` ASC.`,
  descriptionFr: `## Comparaisons de prix au sein d'une meme categorie

L'equipe tarification souhaite comparer chaque paire de produits au sein d'une meme categorie afin de comprendre l'ecart de prix. Pour chaque paire, elle a besoin des noms des deux produits, de la categorie, des deux prix et de la difference de prix.

Ecrivez une requete qui genere toutes les paires uniques de produits au sein d'une meme categorie et calcule la difference de prix.

### Schema

**products**
| Column | Type |
|--------|------|
| product_id | INTEGER |
| product_name | VARCHAR |
| category | VARCHAR |
| price | DECIMAL(10,2) |

### Colonnes attendues en sortie
\`product_a\`, \`product_b\`, \`category\`, \`price_a\`, \`price_b\`, \`price_difference\`

Pour eviter les paires en double, n'incluez que les paires ou l'ID du premier produit est inferieur a celui du second. La \`price_difference\` doit etre calculee comme \`price_b - price_a\`.

Triez par \`category\` ASC, puis \`price_difference\` DESC, puis \`product_a\` ASC.`,
  hint: "Self-join the products table: JOIN products p2 ON p1.category = p2.category AND p1.product_id < p2.product_id. The condition p1.product_id < p2.product_id ensures each pair appears only once.",
  hintFr: "Effectuez une auto-jointure sur la table products : JOIN products p2 ON p1.category = p2.category AND p1.product_id < p2.product_id. La condition p1.product_id < p2.product_id garantit que chaque paire n'apparait qu'une seule fois.",
  schema: `CREATE TABLE products (
  product_id INTEGER PRIMARY KEY,
  product_name VARCHAR,
  category VARCHAR,
  price DECIMAL(10,2)
);

INSERT INTO products VALUES
  (1, 'Budget Laptop', 'Laptops', 499.99),
  (2, 'Pro Laptop', 'Laptops', 1299.99),
  (3, 'Ultra Laptop', 'Laptops', 1899.99),
  (4, 'Basic Phone', 'Phones', 199.99),
  (5, 'Mid Phone', 'Phones', 599.99),
  (6, 'Premium Phone', 'Phones', 999.99),
  (7, 'Entry Tablet', 'Tablets', 249.99),
  (8, 'Pro Tablet', 'Tablets', 799.99),
  (9, 'Wireless Earbuds', 'Audio', 79.99),
  (10, 'Studio Headphones', 'Audio', 349.99);`,
  solutionQuery: `SELECT
  p1.product_name AS product_a,
  p2.product_name AS product_b,
  p1.category,
  p1.price AS price_a,
  p2.price AS price_b,
  p2.price - p1.price AS price_difference
FROM products p1
JOIN products p2
  ON p1.category = p2.category AND p1.product_id < p2.product_id
ORDER BY p1.category, price_difference DESC, p1.product_name;`,
  solutionExplanation: `## Explanation

### Pattern: Self-Join for Pairwise Comparison

This uses a **self-join** to compare every product with every other product in the same category.

### Step-by-step
1. **FROM products p1 JOIN products p2**: Two copies of the same table.
2. **ON p1.category = p2.category**: Only pair products in the same category.
3. **AND p1.product_id < p2.product_id**: Avoid duplicates (A-B but not B-A) and self-pairs (A-A).
4. **p2.price - p1.price**: Since p1 always has the lower ID, this shows how much more expensive p2 is.

### Why product_id < product_id?
Without this condition, you'd get both (Budget, Pro) and (Pro, Budget) -- which are the same comparison. The less-than condition keeps exactly one of each pair.

### When to use
- Price comparisons within groups
- Finding similar or competing products
- Analyzing spread or variance within categories
- Any pairwise analysis on a single table`,
  solutionExplanationFr: `## Explication

### Pattern : Auto-jointure pour comparaison par paires

Cette requete utilise une **auto-jointure** pour comparer chaque produit avec tous les autres produits de la meme categorie.

### Etape par etape
1. **FROM products p1 JOIN products p2** : Deux copies de la meme table.
2. **ON p1.category = p2.category** : Ne coupler que les produits de la meme categorie.
3. **AND p1.product_id < p2.product_id** : Eviter les doublons (A-B mais pas B-A) et les auto-paires (A-A).
4. **p2.price - p1.price** : Comme p1 a toujours l'ID le plus petit, cela indique combien p2 est plus cher.

### Pourquoi product_id < product_id ?
Sans cette condition, vous obtiendriez a la fois (Budget, Pro) et (Pro, Budget) -- qui representent la meme comparaison. La condition strictement inferieur conserve exactement une paire sur deux.

### Quand l'utiliser
- Comparaisons de prix au sein de groupes
- Recherche de produits similaires ou concurrents
- Analyse de la dispersion ou de la variance au sein de categories
- Toute analyse par paires sur une seule table`,
  testCases: [
    {
      name: "default",
      description: "Returns all unique product pairs within each category",
      descriptionFr: "Retourne toutes les paires uniques de produits au sein de chaque categorie",
      expectedColumns: ["product_a", "product_b", "category", "price_a", "price_b", "price_difference"],
      expectedRows: [
        { product_a: "Wireless Earbuds", product_b: "Studio Headphones", category: "Audio", price_a: 79.99, price_b: 349.99, price_difference: 270.00 },
        { product_a: "Budget Laptop", product_b: "Ultra Laptop", category: "Laptops", price_a: 499.99, price_b: 1899.99, price_difference: 1400.00 },
        { product_a: "Budget Laptop", product_b: "Pro Laptop", category: "Laptops", price_a: 499.99, price_b: 1299.99, price_difference: 800.00 },
        { product_a: "Pro Laptop", product_b: "Ultra Laptop", category: "Laptops", price_a: 1299.99, price_b: 1899.99, price_difference: 600.00 },
        { product_a: "Basic Phone", product_b: "Premium Phone", category: "Phones", price_a: 199.99, price_b: 999.99, price_difference: 800.00 },
        { product_a: "Basic Phone", product_b: "Mid Phone", category: "Phones", price_a: 199.99, price_b: 599.99, price_difference: 400.00 },
        { product_a: "Mid Phone", product_b: "Premium Phone", category: "Phones", price_a: 599.99, price_b: 999.99, price_difference: 400.00 },
        { product_a: "Entry Tablet", product_b: "Pro Tablet", category: "Tablets", price_a: 249.99, price_b: 799.99, price_difference: 550.00 },
      ],
      orderMatters: true,
    },
    {
      name: "single-product-category",
      description: "A category with only one product produces no pairs",
      descriptionFr: "Une categorie avec un seul produit ne genere aucune paire",
      setupSql: `DELETE FROM products WHERE category = 'Audio' AND product_id = 10;`,
      expectedColumns: ["product_a", "product_b", "category", "price_a", "price_b", "price_difference"],
      expectedRows: [
        { product_a: "Budget Laptop", product_b: "Ultra Laptop", category: "Laptops", price_a: 499.99, price_b: 1899.99, price_difference: 1400.00 },
        { product_a: "Budget Laptop", product_b: "Pro Laptop", category: "Laptops", price_a: 499.99, price_b: 1299.99, price_difference: 800.00 },
        { product_a: "Pro Laptop", product_b: "Ultra Laptop", category: "Laptops", price_a: 1299.99, price_b: 1899.99, price_difference: 600.00 },
        { product_a: "Basic Phone", product_b: "Premium Phone", category: "Phones", price_a: 199.99, price_b: 999.99, price_difference: 800.00 },
        { product_a: "Basic Phone", product_b: "Mid Phone", category: "Phones", price_a: 199.99, price_b: 599.99, price_difference: 400.00 },
        { product_a: "Mid Phone", product_b: "Premium Phone", category: "Phones", price_a: 599.99, price_b: 999.99, price_difference: 400.00 },
        { product_a: "Entry Tablet", product_b: "Pro Tablet", category: "Tablets", price_a: 249.99, price_b: 799.99, price_difference: 550.00 },
      ],
      orderMatters: true,
    },
  ],
};
