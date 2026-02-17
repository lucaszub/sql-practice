import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "88-recursive-category-tree",
  title: "Category Breadcrumbs",
  titleFr: "Fils d'Ariane des catégories",
  difficulty: "medium",
  category: "recursive-ctes",
  description: `## Category Breadcrumbs

An e-commerce platform stores its product taxonomy in a self-referencing \`categories\` table. The front-end team needs to display a **breadcrumb** for every category so shoppers always know where they are in the navigation tree.

A breadcrumb is the full path from the root category down to the current category, separated by \` > \`.

For example, a category "Ultrabooks" under "Laptops" under "Computers" under "Electronics" would produce:
\`Electronics > Computers > Laptops > Ultrabooks\`

### Schema

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | Primary key |
| name | VARCHAR | Category display name |
| parent_id | INTEGER | NULL for root categories |

### Task

Write a recursive CTE that builds the breadcrumb path for **every** category in the tree.

### Expected output columns

\`category_name\`, \`breadcrumb\`

Order by \`breadcrumb\` ASC.`,

  descriptionFr: `## Fils d'Ariane des catégories

Une plateforme e-commerce stocke sa taxonomie de produits dans une table \`categories\` auto-référente. L'équipe front-end doit afficher un **fil d'Ariane** pour chaque catégorie afin que les acheteurs sachent toujours où ils se trouvent dans l'arbre de navigation.

Un fil d'Ariane est le chemin complet depuis la catégorie racine jusqu'à la catégorie courante, séparé par \` > \`.

Par exemple, une catégorie "Ultrabooks" sous "Laptops" sous "Ordinateurs" sous "Électronique" produirait :
\`Électronique > Ordinateurs > Laptops > Ultrabooks\`

### Schéma

| Colonne | Type | Notes |
|---------|------|-------|
| id | INTEGER | Clé primaire |
| name | VARCHAR | Nom d'affichage de la catégorie |
| parent_id | INTEGER | NULL pour les catégories racines |

### Tâche

Écrire un CTE récursif qui construit le fil d'Ariane pour **chaque** catégorie de l'arbre.

### Colonnes attendues

\`category_name\`, \`breadcrumb\`

Trier par \`breadcrumb\` ASC.`,

  hint: "Seed the recursion with root categories (parent_id IS NULL), using just the category name as the initial breadcrumb. In the recursive step concatenate parent breadcrumb + ' > ' + current name.",
  hintFr: "Initialisez la récursion avec les catégories racines (parent_id IS NULL), en utilisant simplement le nom de la catégorie comme fil d'Ariane initial. Dans l'étape récursive, concaténez le fil d'Ariane du parent + ' > ' + nom courant.",

  schema: `CREATE TABLE categories (
  id        INTEGER,
  name      VARCHAR,
  parent_id INTEGER
);

INSERT INTO categories VALUES
  -- Root categories
  (1,  'Electronics',   NULL),
  (2,  'Clothing',      NULL),
  (3,  'Sports',        NULL),
  -- Electronics children
  (4,  'Computers',     1),
  (5,  'Phones',        1),
  (6,  'Audio',         1),
  -- Computers children
  (7,  'Laptops',       4),
  (8,  'Desktops',      4),
  -- Laptops children
  (9,  'Ultrabooks',    7),
  (10, 'Gaming Laptops',7),
  -- Clothing children
  (11, 'Mens',          2),
  (12, 'Womens',        2);`,

  solutionQuery: `WITH RECURSIVE cat_tree AS (
  SELECT
    id,
    name          AS category_name,
    name          AS breadcrumb
  FROM categories
  WHERE parent_id IS NULL

  UNION ALL

  SELECT
    c.id,
    c.name,
    ct.breadcrumb || ' > ' || c.name
  FROM categories c
  JOIN cat_tree ct ON c.parent_id = ct.id
)
SELECT category_name, breadcrumb
FROM cat_tree
ORDER BY breadcrumb;`,

  solutionExplanation: `## Explanation

### Pattern: Recursive category breadcrumb

This is a common front-end data preparation pattern: **building navigation breadcrumbs from a self-referencing taxonomy table**.

#### Step-by-step

1. **Anchor member** — selects all root categories (\`parent_id IS NULL\`). Their breadcrumb is just their own name.
2. **Recursive member** — for each category already in the CTE, finds its children by joining on \`parent_id = cat_tree.id\`. The child's breadcrumb is the parent's breadcrumb concatenated with \`' > '\` and the child's name.
3. **Termination** — recursion stops when a category has no children (leaf nodes).

#### Result shape

| category_name | breadcrumb |
|---------------|-----------|
| Electronics | Electronics |
| Computers | Electronics > Computers |
| Laptops | Electronics > Computers > Laptops |
| Ultrabooks | Electronics > Computers > Laptops > Ultrabooks |

#### When to use

- E-commerce category navigation
- CMS section trees
- File system path display
- Any taxonomy or tag hierarchy where you need the full ancestor path as a single string for display or search indexing.

#### DuckDB note

DuckDB supports multiple root nodes in the anchor (multiple rows with \`parent_id IS NULL\`), so a forest (multiple trees) is handled naturally.`,

  solutionExplanationFr: `## Explication

### Patron : Fil d'Ariane de catégorie récursif

C'est un patron courant de préparation de données front-end : **construction de fils d'Ariane de navigation depuis une table de taxonomie auto-référente**.

#### Étape par étape

1. **Membre ancre** — sélectionne toutes les catégories racines (\`parent_id IS NULL\`). Leur fil d'Ariane est simplement leur propre nom.
2. **Membre récursif** — pour chaque catégorie déjà dans le CTE, trouve ses enfants en jointurant sur \`parent_id = cat_tree.id\`. Le fil d'Ariane de l'enfant est celui du parent concaténé avec \`' > '\` et le nom de l'enfant.
3. **Terminaison** — la récursion s'arrête quand une catégorie n'a plus d'enfants (feuilles).

#### Quand l'utiliser

- Navigation par catégories e-commerce
- Arbres de sections CMS
- Affichage de chemins de système de fichiers
- Toute taxonomie ou hiérarchie de tags où l'on a besoin du chemin complet des ancêtres sous forme de chaîne unique pour l'affichage ou l'indexation de recherche.`,

  testCases: [
    {
      name: "default",
      description: "Breadcrumbs for all 12 categories ordered alphabetically by breadcrumb",
      descriptionFr: "Fils d'Ariane pour les 12 catégories, triés alphabétiquement par fil d'Ariane",
      expectedColumns: ["category_name", "breadcrumb"],
      expectedRows: [
        { category_name: "Audio",          breadcrumb: "Electronics > Audio" },
        { category_name: "Clothing",       breadcrumb: "Clothing" },
        { category_name: "Computers",      breadcrumb: "Electronics > Computers" },
        { category_name: "Desktops",       breadcrumb: "Electronics > Computers > Desktops" },
        { category_name: "Electronics",    breadcrumb: "Electronics" },
        { category_name: "Gaming Laptops", breadcrumb: "Electronics > Computers > Laptops > Gaming Laptops" },
        { category_name: "Laptops",        breadcrumb: "Electronics > Computers > Laptops" },
        { category_name: "Mens",           breadcrumb: "Clothing > Mens" },
        { category_name: "Phones",         breadcrumb: "Electronics > Phones" },
        { category_name: "Sports",         breadcrumb: "Sports" },
        { category_name: "Ultrabooks",     breadcrumb: "Electronics > Computers > Laptops > Ultrabooks" },
        { category_name: "Womens",         breadcrumb: "Clothing > Womens" },
      ],
      orderMatters: true,
    },
    {
      name: "new-subcategory",
      description: "Adding a new subcategory under Sports produces the correct breadcrumb",
      descriptionFr: "Ajouter une nouvelle sous-catégorie sous Sports produit le fil d'Ariane correct",
      setupSql: `INSERT INTO categories VALUES (13, 'Running', 3);`,
      expectedColumns: ["category_name", "breadcrumb"],
      expectedRows: [
        { category_name: "Audio",          breadcrumb: "Electronics > Audio" },
        { category_name: "Clothing",       breadcrumb: "Clothing" },
        { category_name: "Computers",      breadcrumb: "Electronics > Computers" },
        { category_name: "Desktops",       breadcrumb: "Electronics > Computers > Desktops" },
        { category_name: "Electronics",    breadcrumb: "Electronics" },
        { category_name: "Gaming Laptops", breadcrumb: "Electronics > Computers > Laptops > Gaming Laptops" },
        { category_name: "Laptops",        breadcrumb: "Electronics > Computers > Laptops" },
        { category_name: "Mens",           breadcrumb: "Clothing > Mens" },
        { category_name: "Phones",         breadcrumb: "Electronics > Phones" },
        { category_name: "Running",        breadcrumb: "Sports > Running" },
        { category_name: "Sports",         breadcrumb: "Sports" },
        { category_name: "Ultrabooks",     breadcrumb: "Electronics > Computers > Laptops > Ultrabooks" },
        { category_name: "Womens",         breadcrumb: "Clothing > Womens" },
      ],
      orderMatters: true,
    },
  ],
};
