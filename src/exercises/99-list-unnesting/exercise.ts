import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "99-list-unnesting",
  title: "Unnest Product Tags",
  titleFr: "Dénester les tags de produits",
  difficulty: "medium",
  category: "nested-data",
  description: `## Unnest Product Tags

The analytics team ingested a product catalogue where tags were stored as comma-separated strings — a common pattern from CSV imports or legacy systems. Before they can filter or group by individual tags, they need to split each tag string into separate rows.

### Schema

**products**

| Column | Type | Notes |
|--------|------|-------|
| product_id | INTEGER | Primary key |
| product_name | VARCHAR | Name of the product |
| category | VARCHAR | Product category |
| tags | VARCHAR | Comma-separated tags, e.g. \`'wireless,bluetooth,portable'\` |

### Task

Split the \`tags\` column on commas and unnest the result so that each tag becomes its own row. Use DuckDB's \`string_split()\` to split and \`UNNEST()\` to expand.

Return: \`product_id\`, \`product_name\`, \`tag\` (trimmed, lower-case).

Order by \`product_id\` ASC, then \`tag\` ASC.

### Expected output columns

\`product_id\`, \`product_name\`, \`tag\``,

  descriptionFr: `## Dénester les tags de produits

L'équipe analytique a ingéré un catalogue produits où les tags étaient stockés en chaînes séparées par des virgules — un pattern courant lors d'imports CSV ou de systèmes hérités. Avant de pouvoir filtrer ou regrouper par tag individuel, il faut éclater chaque chaîne en lignes séparées.

### Schéma

**products**

| Colonne | Type | Notes |
|---------|------|-------|
| product_id | INTEGER | Clé primaire |
| product_name | VARCHAR | Nom du produit |
| category | VARCHAR | Catégorie du produit |
| tags | VARCHAR | Tags séparés par des virgules, ex. \`'wireless,bluetooth,portable'\` |

### Tâche

Diviser la colonne \`tags\` sur les virgules et dénester le résultat pour que chaque tag devienne sa propre ligne. Utiliser \`string_split()\` de DuckDB pour diviser et \`UNNEST()\` pour développer.

Retourner : \`product_id\`, \`product_name\`, \`tag\` (sans espaces, en minuscules).

Trier par \`product_id\` ASC, puis \`tag\` ASC.

### Colonnes attendues

\`product_id\`, \`product_name\`, \`tag\``,

  hint: "Use string_split(tags, ',') to get a list, then UNNEST() that list in the SELECT. Wrap the tag value with trim() and lower() to normalize it.",
  hintFr: "Utilisez string_split(tags, ',') pour obtenir une liste, puis UNNEST() cette liste dans le SELECT. Enveloppez la valeur du tag avec trim() et lower() pour la normaliser.",

  schema: `CREATE TABLE products (
  product_id INTEGER,
  product_name VARCHAR,
  category VARCHAR,
  tags VARCHAR
);

INSERT INTO products VALUES
  (1,  'Wireless Headphones', 'Electronics', 'wireless,bluetooth,portable,audio'),
  (2,  'Mechanical Keyboard',  'Electronics', 'mechanical,gaming,rgb'),
  (3,  'Yoga Mat',             'Sports',      'fitness,yoga,non-slip'),
  (4,  'Standing Desk',        'Furniture',   'ergonomic,adjustable,office'),
  (5,  'Coffee Grinder',       'Kitchen',     'coffee,electric,portable'),
  (6,  'Running Shoes',        'Sports',      'running,lightweight,breathable'),
  (7,  'Smart Watch',          'Electronics', 'wireless,fitness,bluetooth,wearable'),
  (8,  'Notebook A5',          'Stationery',  'paper,portable'),
  (9,  'Camping Tent',         'Outdoors',    'outdoor,waterproof,portable'),
  (10, 'Electric Kettle',      'Kitchen',     'electric,fast,kitchen');`,

  solutionQuery: `SELECT
  product_id,
  product_name,
  trim(lower(UNNEST(string_split(tags, ',')))) AS tag
FROM products
ORDER BY product_id, tag;`,

  solutionExplanation: `## Explanation

### Pattern: String split and unnest

This exercise uses the **split-and-unnest** pattern to normalize a denormalized multi-value column into individual rows.

### Step-by-step

1. **string_split(tags, ',')** — DuckDB function that splits a \`VARCHAR\` on a delimiter and returns a \`VARCHAR[]\` (list).
2. **UNNEST()** — table-generating function that expands a list into one row per element. DuckDB supports \`UNNEST()\` directly in the \`SELECT\` clause, which is more concise than putting it in \`FROM\`.
3. **trim(lower(...))** — normalizes each tag by removing surrounding whitespace and converting to lower-case.
4. **ORDER BY product_id, tag** — makes the output deterministic.

### Why this approach

- \`string_split()\` + \`UNNEST()\` is DuckDB's idiomatic way to explode delimited strings, equivalent to \`regexp_split_to_table()\` in PostgreSQL or \`LATERAL FLATTEN\` in Snowflake.
- Normalizing tags at query time avoids storing redundant data.

### When to use

Any time you have a column storing multiple values as a delimited string (tags, categories, user roles) and you need to treat each value individually for filtering, counting, or joining.

### DuckDB note

In DuckDB you can place \`UNNEST()\` directly in the \`SELECT\` list — it is automatically cross-joined with each row. This is equivalent to \`FROM products, UNNEST(string_split(tags, ',')) AS t(tag)\` but more concise.`,

  solutionExplanationFr: `## Explication

### Patron : Découpage de chaîne et dénesting

Cet exercice utilise le patron **split-and-unnest** pour normaliser une colonne multi-valeurs en lignes individuelles.

### Étape par étape

1. **string_split(tags, ',')** — fonction DuckDB qui découpe un \`VARCHAR\` sur un délimiteur et retourne un \`VARCHAR[]\`.
2. **UNNEST()** — fonction génératrice de tables qui développe une liste en une ligne par élément. DuckDB supporte \`UNNEST()\` directement dans la clause \`SELECT\`.
3. **trim(lower(...))** — normalise chaque tag en supprimant les espaces et en passant en minuscules.
4. **ORDER BY product_id, tag** — rend le résultat déterministe.

### Pourquoi cette approche

- \`string_split()\` + \`UNNEST()\` est la façon idiomatique DuckDB d'éclater des chaînes délimitées.
- Normaliser les tags à la requête évite de stocker des données redondantes.

### Quand l'utiliser

Dès qu'une colonne stocke plusieurs valeurs sous forme de chaîne délimitée (tags, catégories, rôles) et qu'il faut traiter chaque valeur individuellement.`,

  testCases: [
    {
      name: "default",
      description: "All 10 products unnested into individual tag rows, ordered by product_id then tag",
      descriptionFr: "Les 10 produits dénestés en lignes de tags individuelles, triés par product_id puis tag",
      expectedColumns: ["product_id", "product_name", "tag"],
      expectedRows: [
        { product_id: 1,  product_name: "Wireless Headphones", tag: "audio" },
        { product_id: 1,  product_name: "Wireless Headphones", tag: "bluetooth" },
        { product_id: 1,  product_name: "Wireless Headphones", tag: "portable" },
        { product_id: 1,  product_name: "Wireless Headphones", tag: "wireless" },
        { product_id: 2,  product_name: "Mechanical Keyboard",  tag: "gaming" },
        { product_id: 2,  product_name: "Mechanical Keyboard",  tag: "mechanical" },
        { product_id: 2,  product_name: "Mechanical Keyboard",  tag: "rgb" },
        { product_id: 3,  product_name: "Yoga Mat",             tag: "fitness" },
        { product_id: 3,  product_name: "Yoga Mat",             tag: "non-slip" },
        { product_id: 3,  product_name: "Yoga Mat",             tag: "yoga" },
        { product_id: 4,  product_name: "Standing Desk",        tag: "adjustable" },
        { product_id: 4,  product_name: "Standing Desk",        tag: "ergonomic" },
        { product_id: 4,  product_name: "Standing Desk",        tag: "office" },
        { product_id: 5,  product_name: "Coffee Grinder",       tag: "coffee" },
        { product_id: 5,  product_name: "Coffee Grinder",       tag: "electric" },
        { product_id: 5,  product_name: "Coffee Grinder",       tag: "portable" },
        { product_id: 6,  product_name: "Running Shoes",        tag: "breathable" },
        { product_id: 6,  product_name: "Running Shoes",        tag: "lightweight" },
        { product_id: 6,  product_name: "Running Shoes",        tag: "running" },
        { product_id: 7,  product_name: "Smart Watch",          tag: "bluetooth" },
        { product_id: 7,  product_name: "Smart Watch",          tag: "fitness" },
        { product_id: 7,  product_name: "Smart Watch",          tag: "wearable" },
        { product_id: 7,  product_name: "Smart Watch",          tag: "wireless" },
        { product_id: 8,  product_name: "Notebook A5",          tag: "paper" },
        { product_id: 8,  product_name: "Notebook A5",          tag: "portable" },
        { product_id: 9,  product_name: "Camping Tent",         tag: "outdoor" },
        { product_id: 9,  product_name: "Camping Tent",         tag: "portable" },
        { product_id: 9,  product_name: "Camping Tent",         tag: "waterproof" },
        { product_id: 10, product_name: "Electric Kettle",      tag: "electric" },
        { product_id: 10, product_name: "Electric Kettle",      tag: "fast" },
        { product_id: 10, product_name: "Electric Kettle",      tag: "kitchen" },
      ],
      orderMatters: true,
    },
    {
      name: "single-tag-product",
      description: "A product with a single tag produces exactly one row",
      descriptionFr: "Un produit avec un seul tag produit exactement une ligne",
      setupSql: `INSERT INTO products VALUES (11, 'Plain Ruler', 'Stationery', 'stationery');`,
      expectedColumns: ["product_id", "product_name", "tag"],
      expectedRows: [
        { product_id: 1,  product_name: "Wireless Headphones", tag: "audio" },
        { product_id: 1,  product_name: "Wireless Headphones", tag: "bluetooth" },
        { product_id: 1,  product_name: "Wireless Headphones", tag: "portable" },
        { product_id: 1,  product_name: "Wireless Headphones", tag: "wireless" },
        { product_id: 2,  product_name: "Mechanical Keyboard",  tag: "gaming" },
        { product_id: 2,  product_name: "Mechanical Keyboard",  tag: "mechanical" },
        { product_id: 2,  product_name: "Mechanical Keyboard",  tag: "rgb" },
        { product_id: 3,  product_name: "Yoga Mat",             tag: "fitness" },
        { product_id: 3,  product_name: "Yoga Mat",             tag: "non-slip" },
        { product_id: 3,  product_name: "Yoga Mat",             tag: "yoga" },
        { product_id: 4,  product_name: "Standing Desk",        tag: "adjustable" },
        { product_id: 4,  product_name: "Standing Desk",        tag: "ergonomic" },
        { product_id: 4,  product_name: "Standing Desk",        tag: "office" },
        { product_id: 5,  product_name: "Coffee Grinder",       tag: "coffee" },
        { product_id: 5,  product_name: "Coffee Grinder",       tag: "electric" },
        { product_id: 5,  product_name: "Coffee Grinder",       tag: "portable" },
        { product_id: 6,  product_name: "Running Shoes",        tag: "breathable" },
        { product_id: 6,  product_name: "Running Shoes",        tag: "lightweight" },
        { product_id: 6,  product_name: "Running Shoes",        tag: "running" },
        { product_id: 7,  product_name: "Smart Watch",          tag: "bluetooth" },
        { product_id: 7,  product_name: "Smart Watch",          tag: "fitness" },
        { product_id: 7,  product_name: "Smart Watch",          tag: "wearable" },
        { product_id: 7,  product_name: "Smart Watch",          tag: "wireless" },
        { product_id: 8,  product_name: "Notebook A5",          tag: "paper" },
        { product_id: 8,  product_name: "Notebook A5",          tag: "portable" },
        { product_id: 9,  product_name: "Camping Tent",         tag: "outdoor" },
        { product_id: 9,  product_name: "Camping Tent",         tag: "portable" },
        { product_id: 9,  product_name: "Camping Tent",         tag: "waterproof" },
        { product_id: 10, product_name: "Electric Kettle",      tag: "electric" },
        { product_id: 10, product_name: "Electric Kettle",      tag: "fast" },
        { product_id: 10, product_name: "Electric Kettle",      tag: "kitchen" },
        { product_id: 11, product_name: "Plain Ruler",          tag: "stationery" },
      ],
      orderMatters: true,
    },
  ],
};
