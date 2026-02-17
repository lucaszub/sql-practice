import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "69-star-schema-queries",
  title: "Star Schema Analytical Queries",
  titleFr: "Requetes analytiques sur schema en etoile",
  difficulty: "hard",
  category: "star-schema",
  description: `## Star Schema Analytical Queries

The business intelligence team has a fully modelled star schema for retail sales. Your task is to write **two analytical queries** and combine them with UNION ALL into a single result set.

**Query 1** — Revenue by region and quarter: Total revenue per \`region\` and \`calendar_quarter\`, ordered by quarter then revenue DESC.

**Query 2** — Top 5 products by total revenue across all time: Show \`product_name\` and \`total_revenue\`, ordered by total_revenue DESC, limited to 5.

Produce a unified result with columns: \`report_type\`, \`dimension_1\`, \`dimension_2\`, \`total_revenue\`.
- For Query 1: report_type = 'revenue_by_region_quarter', dimension_1 = region, dimension_2 = quarter as string (e.g. 'Q1')
- For Query 2: report_type = 'top_products', dimension_1 = product_name, dimension_2 = NULL

### Schema

**fact_sales**
| Column | Type |
|--------|------|
| sale_id | INTEGER |
| customer_sk | INTEGER |
| product_sk | INTEGER |
| date_sk | DATE |
| quantity | INTEGER |
| unit_price | DECIMAL(10,2) |
| discount | DECIMAL(10,2) |
| revenue | DECIMAL(10,2) |

**dim_customer**
| Column | Type |
|--------|------|
| customer_sk | INTEGER |
| customer_name | VARCHAR |
| region | VARCHAR |
| country | VARCHAR |
| segment | VARCHAR |

**dim_product**
| Column | Type |
|--------|------|
| product_sk | INTEGER |
| product_name | VARCHAR |
| category | VARCHAR |
| unit_cost | DECIMAL(10,2) |

**dim_date**
| Column | Type |
|--------|------|
| date_sk | DATE |
| calendar_year | INTEGER |
| calendar_quarter | INTEGER |
| month_name | VARCHAR |

### Expected output columns
\`report_type\`, \`dimension_1\`, \`dimension_2\`, \`total_revenue\`

Order by \`report_type\` ASC, \`dimension_2\` ASC NULLS LAST, \`total_revenue\` DESC.`,
  descriptionFr: `## Requetes analytiques sur schema en etoile

L'equipe business intelligence dispose d'un schema en etoile entierement modelise pour les ventes au detail. Votre tache est d'ecrire **deux requetes analytiques** et de les combiner avec UNION ALL en un seul ensemble de resultats.

**Requete 1** — Chiffre d'affaires par region et trimestre : Total du chiffre d'affaires par \`region\` et \`calendar_quarter\`, ordonne par trimestre puis par chiffre d'affaires DESC.

**Requete 2** — Top 5 produits par chiffre d'affaires total : Afficher \`product_name\` et \`total_revenue\`, ordonne par total_revenue DESC, limite a 5.

Produisez un resultat unifie avec les colonnes : \`report_type\`, \`dimension_1\`, \`dimension_2\`, \`total_revenue\`.
- Requete 1 : report_type = 'revenue_by_region_quarter', dimension_1 = region, dimension_2 = trimestre en chaine (ex : 'Q1')
- Requete 2 : report_type = 'top_products', dimension_1 = product_name, dimension_2 = NULL

### Schema

**fact_sales**, **dim_customer**, **dim_product**, **dim_date** — voir tables ci-dessus.

### Colonnes attendues en sortie
\`report_type\`, \`dimension_1\`, \`dimension_2\`, \`total_revenue\`

Triez par \`report_type\` ASC, \`dimension_2\` ASC NULLS LAST, \`total_revenue\` DESC.`,
  hint: "Write two separate CTEs or subqueries, one for region/quarter aggregation and one for top 5 products using LIMIT. Cast the quarter integer to a string with 'Q' prefix using 'Q' || calendar_quarter. UNION ALL both results and apply the final ORDER BY.",
  hintFr: "Ecrivez deux CTEs ou sous-requetes separees, une pour l'agregation region/trimestre et une pour le top 5 produits avec LIMIT. Convertissez l'entier trimestre en chaine avec le prefixe 'Q' : 'Q' || calendar_quarter. Combinez les deux resultats avec UNION ALL et appliquez l'ORDER BY final.",
  schema: `CREATE TABLE dim_customer (
  customer_sk INTEGER PRIMARY KEY,
  customer_name VARCHAR,
  region VARCHAR,
  country VARCHAR,
  segment VARCHAR
);

CREATE TABLE dim_product (
  product_sk INTEGER PRIMARY KEY,
  product_name VARCHAR,
  category VARCHAR,
  unit_cost DECIMAL(10,2)
);

CREATE TABLE dim_date (
  date_sk DATE PRIMARY KEY,
  calendar_year INTEGER,
  calendar_quarter INTEGER,
  month_name VARCHAR
);

CREATE TABLE fact_sales (
  sale_id INTEGER PRIMARY KEY,
  customer_sk INTEGER,
  product_sk INTEGER,
  date_sk DATE,
  quantity INTEGER,
  unit_price DECIMAL(10,2),
  discount DECIMAL(10,2),
  revenue DECIMAL(10,2)
);

INSERT INTO dim_customer VALUES
  (1, 'Acme Corp',    'North America', 'USA',     'Enterprise'),
  (2, 'Beta Ltd',     'Europe',        'UK',       'SMB'),
  (3, 'Gamma SA',     'Europe',        'France',   'Enterprise'),
  (4, 'Delta Inc',    'North America', 'Canada',   'SMB'),
  (5, 'Epsilon GmbH', 'Europe',        'Germany',  'Enterprise'),
  (6, 'Zeta Co',      'Asia Pacific',  'Japan',    'SMB'),
  (7, 'Eta Pte',      'Asia Pacific',  'Singapore','Enterprise'),
  (8, 'Theta LLC',    'North America', 'USA',      'Startup');

INSERT INTO dim_product VALUES
  (10, 'Laptop Pro',      'Computers',   800.00),
  (20, 'Wireless Mouse',  'Accessories',  15.00),
  (30, 'USB-C Hub',       'Accessories',  25.00),
  (40, 'Monitor 27"',     'Displays',    200.00),
  (50, 'Keyboard Elite',  'Accessories',  60.00),
  (60, 'Webcam HD',       'Peripherals',  40.00),
  (70, 'Docking Station', 'Accessories',  90.00);

INSERT INTO dim_date VALUES
  ('2024-01-15', 2024, 1, 'January'),
  ('2024-02-10', 2024, 1, 'February'),
  ('2024-03-20', 2024, 1, 'March'),
  ('2024-04-05', 2024, 2, 'April'),
  ('2024-05-12', 2024, 2, 'May'),
  ('2024-06-18', 2024, 2, 'June'),
  ('2024-07-08', 2024, 3, 'July'),
  ('2024-08-22', 2024, 3, 'August'),
  ('2024-09-14', 2024, 3, 'September'),
  ('2024-10-03', 2024, 4, 'October'),
  ('2024-11-19', 2024, 4, 'November'),
  ('2024-12-27', 2024, 4, 'December');

INSERT INTO fact_sales VALUES
  (1,  1, 10, '2024-01-15', 2, 1200.00, 100.00, 2300.00),
  (2,  2, 20, '2024-01-15', 5,   30.00,   5.00,  145.00),
  (3,  3, 40, '2024-02-10', 1,  500.00,  50.00,  450.00),
  (4,  4, 30, '2024-02-10', 3,   60.00,   0.00,  180.00),
  (5,  5, 10, '2024-03-20', 1, 1200.00, 120.00, 1080.00),
  (6,  6, 50, '2024-03-20', 2,   80.00,  10.00,  150.00),
  (7,  7, 70, '2024-04-05', 3,  150.00,  15.00,  420.00),
  (8,  8, 20, '2024-04-05', 4,   30.00,   0.00,  120.00),
  (9,  1, 40, '2024-05-12', 2,  500.00,  50.00,  950.00),
  (10, 2, 60, '2024-05-12', 1,   80.00,   8.00,   72.00),
  (11, 3, 10, '2024-06-18', 3, 1200.00, 150.00, 3450.00),
  (12, 4, 50, '2024-06-18', 2,   80.00,   0.00,  160.00),
  (13, 5, 30, '2024-07-08', 5,   60.00,   5.00,  295.00),
  (14, 6, 10, '2024-07-08', 1, 1200.00, 100.00, 1100.00),
  (15, 7, 40, '2024-08-22', 2,  500.00,  50.00,  950.00),
  (16, 8, 70, '2024-08-22', 1,  150.00,  15.00,  135.00),
  (17, 1, 20, '2024-09-14', 10,  30.00,   5.00,  295.00),
  (18, 2, 10, '2024-10-03', 2, 1200.00, 100.00, 2300.00),
  (19, 3, 60, '2024-10-03', 3,   80.00,  10.00,  230.00),
  (20, 4, 40, '2024-11-19', 1,  500.00,  25.00,  475.00),
  (21, 5, 50, '2024-11-19', 4,   80.00,   0.00,  320.00),
  (22, 6, 70, '2024-12-27', 2,  150.00,  15.00,  285.00),
  (23, 7, 10, '2024-12-27', 1, 1200.00,   0.00, 1200.00),
  (24, 8, 30, '2024-12-27', 3,   60.00,   5.00,  175.00);`,
  solutionQuery: `WITH region_quarter AS (
  SELECT
    'revenue_by_region_quarter' AS report_type,
    dc.region AS dimension_1,
    'Q' || dd.calendar_quarter AS dimension_2,
    ROUND(SUM(fs.revenue), 2) AS total_revenue
  FROM fact_sales fs
  INNER JOIN dim_customer dc ON fs.customer_sk = dc.customer_sk
  INNER JOIN dim_date dd ON fs.date_sk = dd.date_sk
  GROUP BY dc.region, dd.calendar_quarter
),
top_products AS (
  SELECT
    'top_products' AS report_type,
    dp.product_name AS dimension_1,
    NULL AS dimension_2,
    ROUND(SUM(fs.revenue), 2) AS total_revenue
  FROM fact_sales fs
  INNER JOIN dim_product dp ON fs.product_sk = dp.product_sk
  GROUP BY dp.product_name
  ORDER BY total_revenue DESC
  LIMIT 5
)
SELECT report_type, dimension_1, dimension_2, total_revenue
FROM region_quarter
UNION ALL
SELECT report_type, dimension_1, dimension_2, total_revenue
FROM top_products
ORDER BY report_type ASC, dimension_2 ASC NULLS LAST, total_revenue DESC;`,
  solutionExplanation: `## Explanation

### Pattern: Multi-query Star Schema Analytics with UNION ALL

This exercise combines two classic star schema query patterns — **slice by dimension** and **top-N ranking** — into a single unified result set.

### Step-by-step
1. **region_quarter CTE**: Joins fact_sales to dim_customer (for region) and dim_date (for quarter). GROUP BY region + quarter produces one row per combination. 'Q' || calendar_quarter casts integer to a readable string.
2. **top_products CTE**: Joins fact_sales to dim_product for product names. GROUP BY product_name, ORDER BY total_revenue DESC, LIMIT 5 produces the top 5 performers.
3. **UNION ALL**: Combines both result sets. Column types must match — dimension_2 is VARCHAR in both (NULL is implicitly cast).
4. **Final ORDER BY**: Orders the unified result meaningfully: report_type groups rows, dimension_2 sorts quarters naturally (Q1-Q4), NULLS LAST puts top_products after region_quarter rows.

### Why UNION ALL and not UNION?
UNION removes duplicates — UNION ALL does not. Since the two query types produce distinct report_type values, there are no duplicates to remove. UNION ALL is always faster.

### When to use
- BI dashboards that expose multiple metrics in a single query result
- Parameterized reports where different report_type values drive different visualizations
- ETL pipelines that populate a reporting mart with multiple metric types`,
  solutionExplanationFr: `## Explication

### Patron : Analytique star schema multi-requetes avec UNION ALL

Cet exercice combine deux patrons classiques de requetes star schema — **decoupe par dimension** et **classement top-N** — en un seul ensemble de resultats unifie.

### Etape par etape
1. **CTE region_quarter** : Joint fact_sales a dim_customer (pour la region) et dim_date (pour le trimestre). GROUP BY region + trimestre produit une ligne par combinaison. 'Q' || calendar_quarter convertit l'entier en chaine lisible.
2. **CTE top_products** : Joint fact_sales a dim_product pour les noms de produits. GROUP BY product_name, ORDER BY total_revenue DESC, LIMIT 5 produit les 5 meilleurs.
3. **UNION ALL** : Combine les deux ensembles de resultats. Les types de colonnes doivent correspondre — dimension_2 est VARCHAR dans les deux (NULL est implicitement converti).
4. **ORDER BY final** : Ordonne le resultat unifie de facon significative : report_type regroupe les lignes, dimension_2 trie les trimestres (Q1-Q4), NULLS LAST place top_products apres region_quarter.

### Pourquoi UNION ALL et non UNION ?
UNION supprime les doublons — UNION ALL non. Comme les deux types de requetes produisent des valeurs report_type distinctes, il n'y a pas de doublons a supprimer. UNION ALL est toujours plus rapide.

### Quand l'utiliser
- Tableaux de bord BI qui exposent plusieurs metriques dans un seul resultat de requete
- Rapports parametres ou differentes valeurs de report_type pilotent differentes visualisations
- Pipelines ETL qui alimentent un data mart de reporting avec plusieurs types de metriques`,
  testCases: [
    {
      name: "default",
      description: "Returns region/quarter revenues and top 5 products, unified with UNION ALL",
      descriptionFr: "Retourne les chiffres d'affaires par region/trimestre et le top 5 produits, combines avec UNION ALL",
      expectedColumns: ["report_type", "dimension_1", "dimension_2", "total_revenue"],
      expectedRows: [
        { report_type: "revenue_by_region_quarter", dimension_1: "Asia Pacific",  dimension_2: "Q1", total_revenue: 150.00 },
        { report_type: "revenue_by_region_quarter", dimension_1: "Europe",        dimension_2: "Q1", total_revenue: 1530.00 },
        { report_type: "revenue_by_region_quarter", dimension_1: "North America", dimension_2: "Q1", total_revenue: 2625.00 },
        { report_type: "revenue_by_region_quarter", dimension_1: "Asia Pacific",  dimension_2: "Q2", total_revenue: 492.00 },
        { report_type: "revenue_by_region_quarter", dimension_1: "Europe",        dimension_2: "Q2", total_revenue: 4472.00 },
        { report_type: "revenue_by_region_quarter", dimension_1: "North America", dimension_2: "Q2", total_revenue: 1070.00 },
        { report_type: "revenue_by_region_quarter", dimension_1: "Asia Pacific",  dimension_2: "Q3", total_revenue: 1395.00 },
        { report_type: "revenue_by_region_quarter", dimension_1: "Europe",        dimension_2: "Q3", total_revenue: 295.00 },
        { report_type: "revenue_by_region_quarter", dimension_1: "North America", dimension_2: "Q3", total_revenue: 430.00 },
        { report_type: "revenue_by_region_quarter", dimension_1: "Asia Pacific",  dimension_2: "Q4", total_revenue: 285.00 },
        { report_type: "revenue_by_region_quarter", dimension_1: "Europe",        dimension_2: "Q4", total_revenue: 2850.00 },
        { report_type: "revenue_by_region_quarter", dimension_1: "North America", dimension_2: "Q4", total_revenue: 650.00 },
        { report_type: "top_products", dimension_1: "Laptop Pro",      dimension_2: null, total_revenue: 11430.00 },
        { report_type: "top_products", dimension_1: "Monitor 27\"",    dimension_2: null, total_revenue: 2055.00 },
        { report_type: "top_products", dimension_1: "Docking Station", dimension_2: null, total_revenue: 840.00 },
        { report_type: "top_products", dimension_1: "Wireless Mouse",  dimension_2: null, total_revenue: 560.00 },
        { report_type: "top_products", dimension_1: "Keyboard Elite",  dimension_2: null, total_revenue: 630.00 },
      ],
      orderMatters: false,
    },
    {
      name: "single-region",
      description: "When only North America customers exist, region breakdown shows only North America rows",
      descriptionFr: "Quand seuls les clients nord-americains existent, la decomposition par region ne montre que les lignes Amerique du Nord",
      setupSql: `DELETE FROM fact_sales WHERE customer_sk IN (2, 3, 5, 6, 7);`,
      expectedColumns: ["report_type", "dimension_1", "dimension_2", "total_revenue"],
      expectedRows: [
        { report_type: "revenue_by_region_quarter", dimension_1: "North America", dimension_2: "Q1", total_revenue: 2625.00 },
        { report_type: "revenue_by_region_quarter", dimension_1: "North America", dimension_2: "Q2", total_revenue: 1070.00 },
        { report_type: "revenue_by_region_quarter", dimension_1: "North America", dimension_2: "Q3", total_revenue: 430.00 },
        { report_type: "revenue_by_region_quarter", dimension_1: "North America", dimension_2: "Q4", total_revenue: 650.00 },
        { report_type: "top_products", dimension_1: "Laptop Pro",      dimension_2: null, total_revenue: 2300.00 },
        { report_type: "top_products", dimension_1: "Wireless Mouse",  dimension_2: null, total_revenue: 415.00 },
        { report_type: "top_products", dimension_1: "USB-C Hub",       dimension_2: null, total_revenue: 355.00 },
        { report_type: "top_products", dimension_1: "Monitor 27\"",    dimension_2: null, total_revenue: 475.00 },
        { report_type: "top_products", dimension_1: "Keyboard Elite",  dimension_2: null, total_revenue: 320.00 },
      ],
      orderMatters: false,
    },
  ],
};
