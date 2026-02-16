import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "17-filtered-catalog",
  title: "Filtered Product Catalog",
  difficulty: "easy",
  category: "select-fundamentals",
  description: `## Filtered Product Catalog

The front-end team is building a filtered catalog page. They need a query that returns products matching **all** of the following criteria:

1. The product must be **in stock** (\`in_stock\` is \`true\`)
2. The \`price\` must be **under $50**
3. The \`category\` must be either **'Electronics'** or **'Books'**

The results should be sorted alphabetically by \`product_name\`.

### Schema

**products**
| Column | Type |
|--------|------|
| product_id | INTEGER |
| product_name | VARCHAR |
| category | VARCHAR |
| price | DECIMAL(10,2) |
| in_stock | BOOLEAN |
| description | VARCHAR |

### Task

Write a query that combines filtering, comparison, IN, and sorting to build the filtered catalog view.

### Expected output columns
\`product_id\`, \`product_name\`, \`category\`, \`price\`

Order by \`product_name\` ASC.`,
  hint: "Combine all filter conditions with AND: check in_stock, use a comparison for price, and IN for the category list. Finish with ORDER BY for alphabetical sorting.",
  schema: `CREATE TABLE products (
  product_id INTEGER,
  product_name VARCHAR,
  category VARCHAR,
  price DECIMAL(10,2),
  in_stock BOOLEAN,
  description VARCHAR
);

INSERT INTO products VALUES
  (1, 'Wireless Mouse', 'Electronics', 25.99, true, 'Ergonomic wireless mouse with USB receiver'),
  (2, 'Mechanical Keyboard', 'Electronics', 89.99, true, 'RGB mechanical keyboard with Cherry MX switches'),
  (3, 'USB-C Cable', 'Electronics', 9.99, true, 'Braided USB-C to USB-A cable, 6ft'),
  (4, 'HDMI Cable', 'Electronics', 14.99, false, 'High-speed HDMI 2.1 cable, 3ft'),
  (5, 'Webcam HD', 'Electronics', 49.99, true, '1080p webcam with built-in microphone'),
  (6, 'Bluetooth Speaker', 'Electronics', 35.00, true, 'Portable Bluetooth 5.0 speaker'),
  (7, 'Phone Case', 'Electronics', 12.50, false, 'Silicone phone case, universal fit'),
  (8, 'The Great Gatsby', 'Books', 11.99, true, 'Classic novel by F. Scott Fitzgerald'),
  (9, 'SQL Cookbook', 'Books', 44.95, true, 'Practical SQL recipes for data analysis'),
  (10, 'Clean Code', 'Books', 38.50, true, 'A handbook of agile software craftsmanship'),
  (11, 'Data Science Handbook', 'Books', 62.00, true, 'Comprehensive guide to data science'),
  (12, 'Fiction Bundle', 'Books', 29.99, false, 'Collection of 5 bestselling novels'),
  (13, 'Notebook Set', 'Books', 15.00, true, 'Pack of 3 lined notebooks'),
  (14, 'Yoga Mat', 'Sports', 25.00, true, 'Non-slip yoga mat, 6mm thick'),
  (15, 'Running Shoes', 'Sports', 75.00, true, 'Lightweight running shoes'),
  (16, 'Coffee Maker', 'Home & Kitchen', 45.00, true, 'Single-serve coffee maker'),
  (17, 'Desk Lamp', 'Home & Kitchen', 32.50, false, 'LED desk lamp with adjustable brightness'),
  (18, 'Programming Pearls', 'Books', 35.00, true, 'Classic algorithms and problem-solving'),
  (19, 'Screen Protector', 'Electronics', 7.99, true, 'Tempered glass screen protector'),
  (20, 'Headphone Adapter', 'Electronics', 5.49, true, 'USB-C to 3.5mm headphone jack adapter');`,
  solutionQuery: `SELECT product_id, product_name, category, price
FROM products
WHERE in_stock = true
  AND price < 50
  AND category IN ('Electronics', 'Books')
ORDER BY product_name ASC;`,
  solutionExplanation: `## Explanation

### Combining All SELECT Fundamentals
This exercise is a capstone for the B1 module, combining every concept covered so far: column selection, WHERE filtering, comparison operators, IN, boolean checks, and ORDER BY.

### Step-by-step
1. **SELECT product_id, product_name, category, price**: Choose only the columns needed for the catalog display. The \`in_stock\` and \`description\` columns are excluded from the output.
2. **WHERE in_stock = true**: Filter to only products currently available. In DuckDB, you can also write simply \`WHERE in_stock\` since it is a boolean column.
3. **AND price < 50**: Strict less-than comparison excludes products priced at exactly $50 or above.
4. **AND category IN ('Electronics', 'Books')**: Match products in either of the two target categories.
5. **ORDER BY product_name ASC**: Alphabetical sorting for a clean catalog display.

### Concepts combined
| Concept | How it is used |
|---------|---------------|
| Column selection | Only 4 of 6 columns returned |
| Boolean filter | \`in_stock = true\` |
| Comparison | \`price < 50\` |
| IN operator | \`category IN (...)\` |
| AND logic | All conditions combined |
| ORDER BY | Alphabetical sort |

### Why this approach
Each filter condition maps directly to a business requirement. Writing them as a flat list of AND conditions keeps the query readable. The IN operator is used instead of OR for the category check, which is cleaner and easier to extend.

### When to use
- Building any filtered view: product catalogs, search results, admin panels
- API endpoints that accept filter parameters and translate them to SQL
- Report generation with multiple business-defined criteria`,
  testCases: [
    {
      name: "default",
      description: "Returns in-stock Electronics/Books products under $50, sorted by name",
      expectedColumns: ["product_id", "product_name", "category", "price"],
      expectedRows: [
        { product_id: 6, product_name: "Bluetooth Speaker", category: "Electronics", price: 35.00 },
        { product_id: 10, product_name: "Clean Code", category: "Books", price: 38.50 },
        { product_id: 20, product_name: "Headphone Adapter", category: "Electronics", price: 5.49 },
        { product_id: 13, product_name: "Notebook Set", category: "Books", price: 15.00 },
        { product_id: 18, product_name: "Programming Pearls", category: "Books", price: 35.00 },
        { product_id: 9, product_name: "SQL Cookbook", category: "Books", price: 44.95 },
        { product_id: 19, product_name: "Screen Protector", category: "Electronics", price: 7.99 },
        { product_id: 8, product_name: "The Great Gatsby", category: "Books", price: 11.99 },
        { product_id: 3, product_name: "USB-C Cable", category: "Electronics", price: 9.99 },
        { product_id: 5, product_name: "Webcam HD", category: "Electronics", price: 49.99 },
        { product_id: 1, product_name: "Wireless Mouse", category: "Electronics", price: 25.99 },
      ],
      orderMatters: true,
    },
    {
      name: "out-of-stock-excluded",
      description: "Verifies that out-of-stock products are excluded even when meeting other criteria",
      setupSql: `UPDATE products SET in_stock = false WHERE in_stock = true; UPDATE products SET in_stock = true WHERE product_id IN (4, 7, 12);`,
      expectedColumns: ["product_id", "product_name", "category", "price"],
      expectedRows: [
        { product_id: 12, product_name: "Fiction Bundle", category: "Books", price: 29.99 },
        { product_id: 4, product_name: "HDMI Cable", category: "Electronics", price: 14.99 },
        { product_id: 7, product_name: "Phone Case", category: "Electronics", price: 12.50 },
      ],
      orderMatters: true,
    },
  ],
};
