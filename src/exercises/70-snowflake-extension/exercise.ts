import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "70-snowflake-extension",
  title: "Snowflake Schema: Product Hierarchy",
  titleFr: "Schema flocon : Hierarchie produit",
  difficulty: "hard",
  category: "star-schema",
  description: `## Snowflake Schema: Product Hierarchy

The data warehouse team has extended the star schema by **snowflaking** the product dimension into a three-level hierarchy: \`dim_product\` → \`dim_subcategory\` → \`dim_category\`. This reduces redundancy in the dimension layer but requires multi-level JOINs in queries.

Your task is to write a query that computes **total revenue and profit margin by top-level category**, joining across the entire snowflake hierarchy.

Profit margin = ROUND((SUM(revenue) - SUM(cost)) / SUM(revenue) * 100, 2)

Include only categories with total revenue > 500.

### Schema

**fact_sales**
| Column | Type |
|--------|------|
| sale_id | INTEGER |
| product_sk | INTEGER |
| quantity | INTEGER |
| revenue | DECIMAL(10,2) |
| cost | DECIMAL(10,2) |

**dim_product** (snowflaked — no category column)
| Column | Type |
|--------|------|
| product_sk | INTEGER |
| product_name | VARCHAR |
| subcategory_id | INTEGER |
| unit_cost | DECIMAL(10,2) |

**dim_subcategory**
| Column | Type |
|--------|------|
| subcategory_id | INTEGER |
| subcategory_name | VARCHAR |
| category_id | INTEGER |

**dim_category**
| Column | Type |
|--------|------|
| category_id | INTEGER |
| category_name | VARCHAR |
| department | VARCHAR |

### Expected output columns
\`category_name\`, \`department\`, \`total_revenue\`, \`total_cost\`, \`profit_margin_pct\`

Order by \`total_revenue\` DESC.`,
  descriptionFr: `## Schema flocon : Hierarchie produit

L'equipe de l'entrepot de donnees a etendu le schema en etoile en **floconnant** la dimension produit en une hierarchie a trois niveaux : \`dim_product\` → \`dim_subcategory\` → \`dim_category\`. Cela reduit la redondance dans la couche de dimension mais necessite des JOINs multi-niveaux dans les requetes.

Votre tache est d'ecrire une requete qui calcule le **chiffre d'affaires total et la marge beneficiaire par categorie de niveau superieur**, en joignant l'ensemble de la hierarchie flocon.

Marge beneficiaire = ROUND((SUM(revenue) - SUM(cost)) / SUM(revenue) * 100, 2)

N'incluez que les categories avec un chiffre d'affaires total > 500.

### Schema

**fact_sales**, **dim_product**, **dim_subcategory**, **dim_category** — voir tables ci-dessus.

### Colonnes attendues en sortie
\`category_name\`, \`department\`, \`total_revenue\`, \`total_cost\`, \`profit_margin_pct\`

Triez par \`total_revenue\` DESC.`,
  hint: "Chain three JOINs: fact_sales → dim_product (on product_sk) → dim_subcategory (on subcategory_id) → dim_category (on category_id). GROUP BY category_name and department. Use HAVING to filter total_revenue > 500. Calculate profit margin with ROUND((SUM(revenue) - SUM(cost)) / SUM(revenue) * 100, 2).",
  hintFr: "Enchainez trois JOINs : fact_sales → dim_product (sur product_sk) → dim_subcategory (sur subcategory_id) → dim_category (sur category_id). GROUP BY category_name et department. Utilisez HAVING pour filtrer total_revenue > 500. Calculez la marge avec ROUND((SUM(revenue) - SUM(cost)) / SUM(revenue) * 100, 2).",
  schema: `CREATE TABLE dim_category (
  category_id INTEGER PRIMARY KEY,
  category_name VARCHAR,
  department VARCHAR
);

CREATE TABLE dim_subcategory (
  subcategory_id INTEGER PRIMARY KEY,
  subcategory_name VARCHAR,
  category_id INTEGER
);

CREATE TABLE dim_product (
  product_sk INTEGER PRIMARY KEY,
  product_name VARCHAR,
  subcategory_id INTEGER,
  unit_cost DECIMAL(10,2)
);

CREATE TABLE fact_sales (
  sale_id INTEGER PRIMARY KEY,
  product_sk INTEGER,
  quantity INTEGER,
  revenue DECIMAL(10,2),
  cost DECIMAL(10,2)
);

INSERT INTO dim_category VALUES
  (1, 'Computers',    'Technology'),
  (2, 'Peripherals',  'Technology'),
  (3, 'Furniture',    'Office'),
  (4, 'Stationery',   'Office');

INSERT INTO dim_subcategory VALUES
  (10, 'Laptops',      1),
  (11, 'Desktops',     1),
  (12, 'Monitors',     2),
  (13, 'Input Devices',2),
  (14, 'Audio',        2),
  (15, 'Desks',        3),
  (16, 'Chairs',       3),
  (17, 'Paper',        4),
  (18, 'Pens',         4);

INSERT INTO dim_product VALUES
  (101, 'Laptop Pro 15',    10, 850.00),
  (102, 'Laptop Air 13',    10, 650.00),
  (103, 'Desktop Tower',    11, 400.00),
  (104, 'Monitor 27" 4K',   12, 220.00),
  (105, 'Monitor 24" FHD',  12, 120.00),
  (106, 'Wireless Keyboard',13,  35.00),
  (107, 'Ergonomic Mouse',  13,  20.00),
  (108, 'Noise-Cancel Headset',14,80.00),
  (109, 'Standing Desk',    15, 300.00),
  (110, 'Ergonomic Chair',  16, 250.00),
  (111, 'A4 Paper Ream',    17,   3.00),
  (112, 'Premium Ballpens', 18,   1.50);

INSERT INTO fact_sales VALUES
  (1,  101, 3, 3900.00, 2550.00),
  (2,  101, 1, 1299.00,  850.00),
  (3,  102, 2, 2200.00, 1300.00),
  (4,  102, 1,  999.00,  650.00),
  (5,  103, 2, 1100.00,  800.00),
  (6,  104, 4, 2400.00,  880.00),
  (7,  104, 1,  580.00,  220.00),
  (8,  105, 3,  960.00,  360.00),
  (9,  106, 10,  750.00, 350.00),
  (10, 107, 8,   560.00, 160.00),
  (11, 107, 5,   375.00, 100.00),
  (12, 108, 2,   380.00, 160.00),
  (13, 108, 3,   540.00, 240.00),
  (14, 109, 1,   599.00, 300.00),
  (15, 109, 2,  1100.00, 600.00),
  (16, 110, 3,  1350.00, 750.00),
  (17, 110, 1,   449.00, 250.00),
  (18, 111, 50,  125.00, 150.00),
  (19, 111, 20,   50.00,  60.00),
  (20, 112, 100,  180.00,150.00),
  (21, 112, 30,   54.00,  45.00),
  (22, 103, 1,   549.00, 400.00),
  (23, 106, 5,   375.00, 175.00),
  (24, 105, 2,   640.00, 240.00);`,
  solutionQuery: `SELECT
  dc.category_name,
  dc.department,
  ROUND(SUM(fs.revenue), 2) AS total_revenue,
  ROUND(SUM(fs.cost), 2) AS total_cost,
  ROUND((SUM(fs.revenue) - SUM(fs.cost)) / SUM(fs.revenue) * 100, 2) AS profit_margin_pct
FROM fact_sales fs
INNER JOIN dim_product dp ON fs.product_sk = dp.product_sk
INNER JOIN dim_subcategory ds ON dp.subcategory_id = ds.subcategory_id
INNER JOIN dim_category dc ON ds.category_id = dc.category_id
GROUP BY dc.category_name, dc.department
HAVING SUM(fs.revenue) > 500
ORDER BY total_revenue DESC;`,
  solutionExplanation: `## Explanation

### Pattern: Snowflake Schema Multi-Level JOIN

A **snowflake schema** normalizes dimension tables into a hierarchy. Instead of storing \`category_name\` directly in \`dim_product\`, the data is split across \`dim_product → dim_subcategory → dim_category\`. This reduces storage redundancy but requires chaining multiple JOINs to reach the top-level category.

### Step-by-step
1. **fact_sales INNER JOIN dim_product**: Links each sale to its product. INNER JOIN ensures we only include sales with known products.
2. **INNER JOIN dim_subcategory**: Traverses the first level of the hierarchy — maps products to their subcategory (e.g., Laptop Pro 15 → Laptops).
3. **INNER JOIN dim_category**: Traverses the second level — maps subcategories to top-level categories (e.g., Laptops → Computers).
4. **GROUP BY category_name, department**: Aggregates all sales up to the category grain — the top level of the hierarchy.
5. **HAVING SUM(revenue) > 500**: Post-aggregation filter to exclude low-revenue categories (Stationery has revenue < 500).
6. **profit_margin_pct**: (revenue - cost) / revenue * 100 — a non-additive ratio that must be computed from the summed components, never averaged directly.

### Star vs. Snowflake tradeoffs
- **Star**: Simpler queries (fewer JOINs), larger dimension tables (repeated values)
- **Snowflake**: Normalized, smaller dimensions, but more JOINs required — and query engines like DuckDB handle them efficiently

### When to use
- Large dimension tables where denormalization would waste significant storage
- When the hierarchy itself is a queryable entity (e.g., browsing subcategory trees)
- Enterprise data warehouses where strict normalization is a governance requirement`,
  solutionExplanationFr: `## Explication

### Patron : JOIN multi-niveaux sur schema flocon

Un **schema flocon** normalise les tables de dimension en une hierarchie. Au lieu de stocker \`category_name\` directement dans \`dim_product\`, les donnees sont decoupees entre \`dim_product → dim_subcategory → dim_category\`. Cela reduit la redondance de stockage mais necessite d'enchainer plusieurs JOINs pour atteindre la categorie de niveau superieur.

### Etape par etape
1. **fact_sales INNER JOIN dim_product** : Lie chaque vente a son produit. INNER JOIN garantit qu'on n'inclut que les ventes avec des produits connus.
2. **INNER JOIN dim_subcategory** : Traverse le premier niveau de la hierarchie — mappe les produits sur leur sous-categorie (ex : Laptop Pro 15 → Laptops).
3. **INNER JOIN dim_category** : Traverse le deuxieme niveau — mappe les sous-categories sur les categories de niveau superieur (ex : Laptops → Computers).
4. **GROUP BY category_name, department** : Agrege toutes les ventes au grain categorie — le niveau superieur de la hierarchie.
5. **HAVING SUM(revenue) > 500** : Filtre post-agregation pour exclure les categories a faible chiffre d'affaires (Stationery a un CA < 500).
6. **profit_margin_pct** : (revenue - cost) / revenue * 100 — un ratio non-additif qui doit etre calcule a partir des composantes sommees, jamais moyenne directement.

### Compromis Star vs. Flocon
- **Etoile** : Requetes plus simples (moins de JOINs), tables de dimension plus grandes (valeurs repetees)
- **Flocon** : Normalise, dimensions plus petites, mais plus de JOINs necessaires — les moteurs comme DuckDB les gerent efficacement

### Quand l'utiliser
- Grandes tables de dimension ou la denormalisation gaspillerait un stockage significatif
- Quand la hierarchie elle-meme est une entite requetable (ex : navigation dans des arbres de sous-categories)
- Entrepots de donnees d'entreprise ou la normalisation stricte est une exigence de gouvernance`,
  testCases: [
    {
      name: "default",
      description: "Returns 3 categories with revenue > 500, ordered by total revenue DESC (Stationery excluded)",
      descriptionFr: "Retourne 3 categories avec un CA > 500, ordonnees par CA total DESC (Stationery exclue)",
      expectedColumns: ["category_name", "department", "total_revenue", "total_cost", "profit_margin_pct"],
      expectedRows: [
        { category_name: "Computers",   department: "Technology", total_revenue: 10047.00, total_cost: 6550.00, profit_margin_pct: 34.81 },
        { category_name: "Peripherals", department: "Technology", total_revenue: 5145.00,  total_cost: 2310.00, profit_margin_pct: 55.10 },
        { category_name: "Furniture",   department: "Office",     total_revenue: 3498.00,  total_cost: 1900.00, profit_margin_pct: 45.68 },
      ],
      orderMatters: true,
    },
    {
      name: "furniture-only",
      description: "When only furniture sales exist, returns only the Furniture category",
      descriptionFr: "Quand seules les ventes de mobilier existent, retourne uniquement la categorie Furniture",
      setupSql: `DELETE FROM fact_sales WHERE product_sk NOT IN (109, 110);`,
      expectedColumns: ["category_name", "department", "total_revenue", "total_cost", "profit_margin_pct"],
      expectedRows: [
        { category_name: "Furniture", department: "Office", total_revenue: 3498.00, total_cost: 1900.00, profit_margin_pct: 45.68 },
      ],
      orderMatters: true,
    },
  ],
};
