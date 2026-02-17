import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "63-check-constraints",
  title: "CHECK Constraints for Inventory Integrity",
  titleFr: "Contraintes CHECK pour l'intégrité de l'inventaire",
  difficulty: "medium",
  category: "data-types-constraints",
  description: `## CHECK Constraints for Inventory Integrity

The warehouse team has been burned by data entry errors: negative stock quantities and zero-price products have caused automated purchasing alerts to misfire. They want \`inventory\` redesigned with **CHECK constraints** to enforce that \`quantity >= 0\` and \`unit_price > 0\` at the database level.

### Schema

**inventory**
| Column | Type |
|--------|------|
| product_id | INTEGER (PRIMARY KEY) |
| product_name | VARCHAR |
| category | VARCHAR |
| quantity | INTEGER (CHECK quantity >= 0) |
| unit_price | DECIMAL(10,2) (CHECK unit_price > 0) |
| warehouse | VARCHAR |
| last_restocked | DATE |

### Task

Query the inventory to return all products where quantity is greater than 0 (items actually in stock), ordered by \`category\` ASC, then \`product_name\` ASC. Include the total stock value (\`quantity * unit_price\`) as \`stock_value\`.

### Expected output columns
\`product_id\`, \`product_name\`, \`category\`, \`quantity\`, \`unit_price\`, \`stock_value\`, \`warehouse\``,
  descriptionFr: `## Contraintes CHECK pour l'intégrité de l'inventaire

L'équipe entrepôt a subi des erreurs de saisie : des quantités négatives et des prix à zéro ont déclenché de fausses alertes d'achat automatisées. Ils veulent que \`inventory\` soit repensé avec des **contraintes CHECK** pour imposer \`quantity >= 0\` et \`unit_price > 0\` au niveau de la base de données.

### Schéma

**inventory**
| Colonne | Type |
|---------|------|
| product_id | INTEGER (PRIMARY KEY) |
| product_name | VARCHAR |
| category | VARCHAR |
| quantity | INTEGER (CHECK quantity >= 0) |
| unit_price | DECIMAL(10,2) (CHECK unit_price > 0) |
| warehouse | VARCHAR |
| last_restocked | DATE |

### Tâche

Interroger l'inventaire pour retourner tous les produits avec une quantité supérieure à 0 (articles réellement en stock), triés par \`category\` ASC, puis \`product_name\` ASC. Inclure la valeur de stock totale (\`quantity * unit_price\`) comme \`stock_value\`.

### Colonnes attendues en sortie
\`product_id\`, \`product_name\`, \`category\`, \`quantity\`, \`unit_price\`, \`stock_value\`, \`warehouse\``,
  hint: "Filter WHERE quantity > 0 to exclude out-of-stock items. Compute stock_value = quantity * unit_price in the SELECT. The CHECK constraint prevents negatives from ever existing, so you only need to handle the zero case.",
  hintFr: "Filtrez WHERE quantity > 0 pour exclure les articles en rupture. Calculez stock_value = quantity * unit_price dans le SELECT. La contrainte CHECK empêche les valeurs négatives d'exister.",
  schema: `CREATE TABLE inventory (
  product_id     INTEGER PRIMARY KEY,
  product_name   VARCHAR,
  category       VARCHAR,
  quantity       INTEGER CHECK (quantity >= 0),
  unit_price     DECIMAL(10, 2) CHECK (unit_price > 0),
  warehouse      VARCHAR,
  last_restocked DATE
);

INSERT INTO inventory VALUES
  (1,  'Laptop Pro 15',     'Electronics', 24,  1299.99, 'Paris',    '2024-01-15'),
  (2,  'Wireless Mouse',    'Electronics', 150, 29.99,   'Paris',    '2024-02-01'),
  (3,  'Mechanical Keyboard','Electronics', 0,  89.99,   'Paris',    '2024-01-20'),
  (4,  'USB-C Hub',         'Electronics', 75,  49.99,   'Lyon',     '2024-03-05'),
  (5,  'Monitor 27"',       'Electronics', 12,  399.99,  'Lyon',     '2024-02-18'),
  (6,  'Office Chair',      'Furniture',   8,   249.99,  'Paris',    '2024-01-10'),
  (7,  'Standing Desk',     'Furniture',   0,   599.99,  'Paris',    '2024-03-01'),
  (8,  'Desk Organizer',    'Furniture',   45,  19.99,   'Marseille','2024-02-25'),
  (9,  'Whiteboard 120cm',  'Furniture',   6,   89.99,   'Marseille','2024-01-30'),
  (10, 'A4 Paper (500pk)',  'Supplies',    200, 8.99,    'Paris',    '2024-03-10'),
  (11, 'Ballpoint Pens x10','Supplies',   300, 4.99,    'Paris',    '2024-03-10'),
  (12, 'Stapler Heavy Duty','Supplies',    0,   14.99,   'Lyon',     '2024-02-12'),
  (13, 'Printer Ink Black', 'Supplies',    55,  22.99,   'Lyon',     '2024-03-08'),
  (14, 'Sticky Notes x12', 'Supplies',    120, 6.99,    'Marseille','2024-02-20'),
  (15, 'Safety Gloves L',   'Safety',      40,  12.99,   'Marseille','2024-01-25'),
  (16, 'Hard Hat Yellow',   'Safety',      25,  18.99,   'Marseille','2024-01-25'),
  (17, 'Safety Vest',       'Safety',      0,   9.99,    'Lyon',     '2024-03-02'),
  (18, 'Fire Extinguisher', 'Safety',      10,  79.99,   'Paris',    '2024-01-05');`,
  solutionQuery: `SELECT
  product_id,
  product_name,
  category,
  quantity,
  unit_price,
  quantity * unit_price AS stock_value,
  warehouse
FROM inventory
WHERE quantity > 0
ORDER BY category ASC, product_name ASC;`,
  solutionExplanation: `## Explanation

### Pattern: CHECK constraint as schema-level data quality gate

A **CHECK constraint** embeds a business rule directly in the table definition. It fires on every INSERT and UPDATE, rejecting any row that violates the condition. This is more reliable than application-layer validation because it applies regardless of how data enters the database (app, bulk load, manual SQL).

### Step-by-step
1. \`CHECK (quantity >= 0)\`: Prevents negative stock quantities from ever being stored. A quantity of 0 is valid — it means "out of stock" — so we use \`>=\` in the constraint.
2. \`CHECK (unit_price > 0)\`: Strictly positive price. A price of 0 would be a data error (free products are handled differently, e.g., with a \`is_free BOOLEAN\` flag).
3. **WHERE quantity > 0**: Filters to items actually in stock. Out-of-stock items (quantity = 0) are valid rows — they tell the system to reorder — but the business wants to see only available stock.
4. **stock_value**: Derived column giving the total monetary value of each product line currently held in inventory.
5. **ORDER BY category, product_name**: Produces a grouped, alphabetical inventory list — useful for warehouse picking sheets.

### Why
Relying solely on application validation means a bad migration script or manual SQL can still insert \`quantity = -50\`. A CHECK constraint at the DB level makes this impossible.

### When to use
- Any numeric business rule with a hard lower/upper bound: quantities, prices, percentages (0–100), ages.
- Combine with NOT NULL and DEFAULT for a fully defensive schema.`,
  solutionExplanationFr: `## Explication

### Modèle : Contrainte CHECK comme gardien de qualité des données

Une contrainte **CHECK** intègre une règle métier directement dans la définition de la table. Elle s'applique à chaque INSERT et UPDATE, rejetant toute ligne qui viole la condition.

### Étape par étape
1. \`CHECK (quantity >= 0)\` : Empêche les quantités négatives. Une quantité de 0 est valide — elle signifie "rupture de stock".
2. \`CHECK (unit_price > 0)\` : Prix strictement positif. Un prix à 0 serait une erreur de données.
3. **WHERE quantity > 0** : Filtre les articles réellement disponibles.
4. **stock_value** : Colonne dérivée donnant la valeur totale de chaque ligne de produit.
5. **ORDER BY category, product_name** : Liste alphabétique groupée par catégorie.

### Pourquoi
S'appuyer uniquement sur la validation applicative laisse la porte ouverte aux scripts de migration défectueux. Une contrainte CHECK au niveau DB rend cela impossible.

### Quand l'utiliser
- Toute règle métier numérique avec une limite stricte : quantités, prix, pourcentages.`,
  testCases: [
    {
      name: "default",
      description: "Returns 13 in-stock products (quantity > 0) ordered by category then product_name",
      descriptionFr: "Retourne 13 produits en stock (quantity > 0) triés par catégorie puis nom de produit",
      expectedColumns: ["product_id", "product_name", "category", "quantity", "unit_price", "stock_value", "warehouse"],
      expectedRows: [
        { product_id: 4,  product_name: "USB-C Hub",          category: "Electronics", quantity: 75,  unit_price: 49.99,   stock_value: 3749.25,  warehouse: "Lyon" },
        { product_id: 1,  product_name: "Laptop Pro 15",      category: "Electronics", quantity: 24,  unit_price: 1299.99, stock_value: 31199.76, warehouse: "Paris" },
        { product_id: 5,  product_name: 'Monitor 27"',        category: "Electronics", quantity: 12,  unit_price: 399.99,  stock_value: 4799.88,  warehouse: "Lyon" },
        { product_id: 2,  product_name: "Wireless Mouse",     category: "Electronics", quantity: 150, unit_price: 29.99,   stock_value: 4498.50,  warehouse: "Paris" },
        { product_id: 8,  product_name: "Desk Organizer",     category: "Furniture",   quantity: 45,  unit_price: 19.99,   stock_value: 899.55,   warehouse: "Marseille" },
        { product_id: 6,  product_name: "Office Chair",       category: "Furniture",   quantity: 8,   unit_price: 249.99,  stock_value: 1999.92,  warehouse: "Paris" },
        { product_id: 9,  product_name: "Whiteboard 120cm",   category: "Furniture",   quantity: 6,   unit_price: 89.99,   stock_value: 539.94,   warehouse: "Marseille" },
        { product_id: 16, product_name: "Hard Hat Yellow",    category: "Safety",      quantity: 25,  unit_price: 18.99,   stock_value: 474.75,   warehouse: "Marseille" },
        { product_id: 18, product_name: "Fire Extinguisher",  category: "Safety",      quantity: 10,  unit_price: 79.99,   stock_value: 799.90,   warehouse: "Paris" },
        { product_id: 15, product_name: "Safety Gloves L",    category: "Safety",      quantity: 40,  unit_price: 12.99,   stock_value: 519.60,   warehouse: "Marseille" },
        { product_id: 10, product_name: "A4 Paper (500pk)",   category: "Supplies",    quantity: 200, unit_price: 8.99,    stock_value: 1798.00,  warehouse: "Paris" },
        { product_id: 11, product_name: "Ballpoint Pens x10", category: "Supplies",    quantity: 300, unit_price: 4.99,    stock_value: 1497.00,  warehouse: "Paris" },
        { product_id: 13, product_name: "Printer Ink Black",  category: "Supplies",    quantity: 55,  unit_price: 22.99,   stock_value: 1264.45,  warehouse: "Lyon" },
        { product_id: 14, product_name: "Sticky Notes x12",   category: "Supplies",    quantity: 120, unit_price: 6.99,    stock_value: 838.80,   warehouse: "Marseille" },
      ],
      orderMatters: true,
    },
    {
      name: "single-category",
      description: "With only Safety products remaining, returns 2 in-stock items",
      descriptionFr: "Avec uniquement les produits Safety, retourne 2 articles en stock",
      setupSql: `DELETE FROM inventory WHERE category != 'Safety';`,
      expectedColumns: ["product_id", "product_name", "category", "quantity", "unit_price", "stock_value", "warehouse"],
      expectedRows: [
        { product_id: 16, product_name: "Hard Hat Yellow",   category: "Safety", quantity: 25, unit_price: 18.99, stock_value: 474.75,  warehouse: "Marseille" },
        { product_id: 18, product_name: "Fire Extinguisher", category: "Safety", quantity: 10, unit_price: 79.99, stock_value: 799.90,  warehouse: "Paris" },
        { product_id: 15, product_name: "Safety Gloves L",   category: "Safety", quantity: 40, unit_price: 12.99, stock_value: 519.60,  warehouse: "Marseille" },
      ],
      orderMatters: true,
    },
  ],
};
