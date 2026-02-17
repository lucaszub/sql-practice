import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "53-create-with-constraints",
  title: "Products Table with Constraints",
  titleFr: "Table produits avec contraintes",
  difficulty: "medium",
  category: "data-types-constraints",
  description: `## Products Table with Constraints

The catalog team is tired of dirty data: products with no name, duplicate SKUs, and negative prices keep breaking the downstream pipeline. They want the database itself to enforce data quality rules so that bad records are rejected at insert time.

### Schema

No pre-existing tables. Design the \`products\` table from scratch.

### Task

Write a script that:
1. Creates a \`products\` table with the following columns and constraints:
   - \`product_id INTEGER\` — primary identifier
   - \`sku VARCHAR\` — must be unique and not null (\`UNIQUE NOT NULL\`)
   - \`name VARCHAR\` — must not be null (\`NOT NULL\`)
   - \`price DECIMAL(10,2)\` — must be greater than zero (\`CHECK (price > 0)\`)
   - \`stock_qty INTEGER\` — must be zero or positive (\`CHECK (stock_qty >= 0)\`), defaults to 0
   - \`category VARCHAR\` — optional (nullable)
2. Inserts valid product rows (include one row with a NULL category to show optional fields work)
3. Ends with \`SELECT * FROM products ORDER BY product_id\`

### Expected output columns
\`product_id\`, \`sku\`, \`name\`, \`price\`, \`stock_qty\`, \`category\``,
  descriptionFr: `## Table produits avec contraintes

L'equipe catalogue est lasse des donnees incorrectes : des produits sans nom, des SKU en double et des prix negatifs ne cessent de perturber le pipeline en aval. Ils veulent que la base de donnees elle-meme applique les regles de qualite des donnees afin que les enregistrements incorrects soient rejetes a l'insertion.

### Schema

Aucune table pre-existante. Concevez la table \`products\` de zero.

### Consigne

Ecrivez un script qui :
1. Cree une table \`products\` avec les colonnes et contraintes suivantes :
   - \`product_id INTEGER\` — identifiant principal
   - \`sku VARCHAR\` — doit etre unique et non null (\`UNIQUE NOT NULL\`)
   - \`name VARCHAR\` — doit etre non null (\`NOT NULL\`)
   - \`price DECIMAL(10,2)\` — doit etre superieur a zero (\`CHECK (price > 0)\`)
   - \`stock_qty INTEGER\` — doit etre zero ou positif (\`CHECK (stock_qty >= 0)\`), defaut a 0
   - \`category VARCHAR\` — optionnel (nullable)
2. Insere des lignes de produits valides (incluez une ligne avec une categorie NULL pour montrer que les champs optionnels fonctionnent)
3. Termine par \`SELECT * FROM products ORDER BY product_id\`

### Colonnes attendues en sortie
\`product_id\`, \`sku\`, \`name\`, \`price\`, \`stock_qty\`, \`category\``,
  hint: "Define constraints inline after each column type: VARCHAR NOT NULL, DECIMAL(10,2) CHECK (price > 0), INTEGER DEFAULT 0 CHECK (stock_qty >= 0). UNIQUE can also be inline.",
  hintFr: "Definissez les contraintes inline apres chaque type de colonne : VARCHAR NOT NULL, DECIMAL(10,2) CHECK (price > 0), INTEGER DEFAULT 0 CHECK (stock_qty >= 0). UNIQUE peut aussi etre inline.",
  schema: `-- No pre-existing tables for this exercise.
-- Your solution must CREATE the table with constraints, INSERT valid data, and SELECT.
SELECT 'Ready — design your constrained schema below' AS instructions;`,
  solutionQuery: `CREATE TABLE products (
  product_id  INTEGER,
  sku         VARCHAR    NOT NULL UNIQUE,
  name        VARCHAR    NOT NULL,
  price       DECIMAL(10,2) CHECK (price > 0),
  stock_qty   INTEGER    DEFAULT 0 CHECK (stock_qty >= 0),
  category    VARCHAR
);

INSERT INTO products VALUES
  (1,  'SKU-001', 'Wireless Keyboard',    49.99,  150, 'Electronics'),
  (2,  'SKU-002', 'USB-C Hub',            35.00,   80, 'Electronics'),
  (3,  'SKU-003', 'Ergonomic Mouse',      29.99,  200, 'Electronics'),
  (4,  'SKU-004', 'Desk Lamp',            22.50,   60, 'Office'),
  (5,  'SKU-005', 'Notebook A5',           5.99,  500, 'Stationery'),
  (6,  'SKU-006', 'Standing Desk',       349.00,   15, 'Furniture'),
  (7,  'SKU-007', 'Monitor Arm',          89.99,   40, 'Electronics'),
  (8,  'SKU-008', 'Cable Organizer',       9.99,  300, NULL),
  (9,  'SKU-009', 'Webcam HD',            59.99,   75, 'Electronics'),
  (10, 'SKU-010', 'Laptop Stand',         39.99,    0, 'Electronics'),
  (11, 'SKU-011', 'Whiteboard Markers',    8.99,  120, 'Stationery'),
  (12, 'SKU-012', 'Office Chair',        299.00,    8, 'Furniture');

SELECT * FROM products ORDER BY product_id;`,
  solutionExplanation: `## Explanation

### Schema Constraints Pattern
This exercise demonstrates how to encode data quality rules directly into the table definition using SQL constraints. Constraints are enforced by the database engine — no application code required.

### Step-by-step
1. **NOT NULL**: Prevents empty values in mandatory fields (\`sku\`, \`name\`). Any \`INSERT\` that omits these columns or passes \`NULL\` will fail.
2. **UNIQUE**: Ensures no two rows share the same \`sku\`. DuckDB enforces this at insert and update time.
3. **CHECK (price > 0)**: A row-level constraint that rejects any price that is zero or negative. Useful for monetary fields where zero is not a valid price.
4. **CHECK (stock_qty >= 0)**: Prevents negative stock quantities — physically impossible inventory.
5. **DEFAULT 0**: When \`stock_qty\` is omitted from an INSERT, it defaults to 0 rather than NULL.
6. **Nullable category**: Omitting any constraint on \`category\` makes it nullable by default — correct for optional attributes.

### Why this approach
Constraints defined at the schema level are the most robust form of data validation. They cannot be bypassed by application bugs, direct database writes, or batch imports. This is a core principle of data engineering: push validation as close to the source as possible.

### When to use
- Any table where certain columns are always required (NOT NULL + UNIQUE for natural keys)
- Fact tables where measures must be non-negative (order quantities, prices, durations)
- Dimension tables where natural keys must be unique (SKU, email, user_handle)`,
  solutionExplanationFr: `## Explication

### Pattern Contraintes de Schema
Cet exercice illustre comment encoder les regles de qualite des donnees directement dans la definition de la table via des contraintes SQL. Les contraintes sont appliquees par le moteur de base de donnees — aucun code applicatif n'est requis.

### Etape par etape
1. **NOT NULL** : Empeche les valeurs vides dans les champs obligatoires (\`sku\`, \`name\`). Tout \`INSERT\` qui omet ces colonnes ou passe \`NULL\` echouera.
2. **UNIQUE** : Garantit qu'aucune deux lignes ne partagent le meme \`sku\`. DuckDB l'applique a l'insertion et a la mise a jour.
3. **CHECK (price > 0)** : Une contrainte au niveau de la ligne qui rejette tout prix nul ou negatif. Utile pour les champs monetaires ou zero n'est pas un prix valide.
4. **CHECK (stock_qty >= 0)** : Empeche les quantites de stock negatives — inventaire physiquement impossible.
5. **DEFAULT 0** : Quand \`stock_qty\` est omis d'un INSERT, il vaut 0 par defaut plutot que NULL.
6. **Categorie nullable** : L'absence de contrainte sur \`category\` la rend nullable par defaut — correct pour les attributs optionnels.

### Pourquoi cette approche
Les contraintes definies au niveau du schema sont la forme de validation de donnees la plus robuste. Elles ne peuvent pas etre contournees par des bugs applicatifs, des ecritures directes en base ou des imports batch. C'est un principe fondamental du data engineering : pousser la validation aussi pres que possible de la source.

### Quand l'utiliser
- Toute table ou certaines colonnes sont toujours requises (NOT NULL + UNIQUE pour les cles naturelles)
- Tables de faits ou les mesures doivent etre non negatives (quantites, prix, durees)
- Tables de dimension ou les cles naturelles doivent etre uniques (SKU, email, user_handle)`,
  testCases: [
    {
      name: "default",
      description: "Returns all 12 products sorted by product_id, with one NULL category",
      descriptionFr: "Renvoie les 12 produits tries par product_id, avec une categorie NULL",
      expectedColumns: ["product_id", "sku", "name", "price", "stock_qty", "category"],
      expectedRows: [
        { product_id: 1,  sku: "SKU-001", name: "Wireless Keyboard",   price: 49.99,  stock_qty: 150, category: "Electronics" },
        { product_id: 2,  sku: "SKU-002", name: "USB-C Hub",            price: 35.00,  stock_qty: 80,  category: "Electronics" },
        { product_id: 3,  sku: "SKU-003", name: "Ergonomic Mouse",      price: 29.99,  stock_qty: 200, category: "Electronics" },
        { product_id: 4,  sku: "SKU-004", name: "Desk Lamp",            price: 22.50,  stock_qty: 60,  category: "Office"      },
        { product_id: 5,  sku: "SKU-005", name: "Notebook A5",          price: 5.99,   stock_qty: 500, category: "Stationery"  },
        { product_id: 6,  sku: "SKU-006", name: "Standing Desk",        price: 349.00, stock_qty: 15,  category: "Furniture"   },
        { product_id: 7,  sku: "SKU-007", name: "Monitor Arm",          price: 89.99,  stock_qty: 40,  category: "Electronics" },
        { product_id: 8,  sku: "SKU-008", name: "Cable Organizer",      price: 9.99,   stock_qty: 300, category: null          },
        { product_id: 9,  sku: "SKU-009", name: "Webcam HD",            price: 59.99,  stock_qty: 75,  category: "Electronics" },
        { product_id: 10, sku: "SKU-010", name: "Laptop Stand",         price: 39.99,  stock_qty: 0,   category: "Electronics" },
        { product_id: 11, sku: "SKU-011", name: "Whiteboard Markers",   price: 8.99,   stock_qty: 120, category: "Stationery"  },
        { product_id: 12, sku: "SKU-012", name: "Office Chair",         price: 299.00, stock_qty: 8,   category: "Furniture"   },
      ],
      orderMatters: true,
    },
    {
      name: "zero-stock-valid",
      description: "Product with stock_qty = 0 is valid (out-of-stock, not negative)",
      descriptionFr: "Un produit avec stock_qty = 0 est valide (rupture de stock, pas negatif)",
      expectedColumns: ["product_id", "sku", "name", "price", "stock_qty", "category"],
      expectedRows: [
        { product_id: 10, sku: "SKU-010", name: "Laptop Stand", price: 39.99, stock_qty: 0, category: "Electronics" },
      ],
      orderMatters: false,
    },
  ],
};
