import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "85-recursive-hierarchy-depth",
  title: "Org Chart Depth Levels",
  titleFr: "Niveaux de profondeur de l'organigramme",
  difficulty: "medium",
  category: "recursive-ctes",
  description: `## Org Chart Depth Levels

The HR team needs to understand the structure of the organisation. They want to assign a **depth level** to every employee based on their position in the reporting hierarchy.

The rule is simple: the CEO (who has no manager) is at level **0**, their direct reports are at level **1**, and so on down the chain.

### Schema

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | Primary key |
| name | VARCHAR | Employee name |
| manager_id | INTEGER | NULL for the CEO |

### Task

Write a recursive CTE that returns every employee with their **depth level** in the hierarchy.

### Expected output columns

\`employee_name\`, \`level\`

Order by \`level\` ASC, then \`employee_name\` ASC.`,

  descriptionFr: `## Niveaux de profondeur de l'organigramme

L'équipe RH souhaite comprendre la structure de l'organisation. Elle veut attribuer un **niveau de profondeur** à chaque employé en fonction de sa position dans la hiérarchie.

La règle est simple : le PDG (qui n'a pas de manager) est au niveau **0**, ses subordonnés directs sont au niveau **1**, et ainsi de suite.

### Schéma

| Colonne | Type | Notes |
|---------|------|-------|
| id | INTEGER | Clé primaire |
| name | VARCHAR | Nom de l'employé |
| manager_id | INTEGER | NULL pour le PDG |

### Tâche

Écrire un CTE récursif qui retourne chaque employé avec son **niveau de profondeur** dans la hiérarchie.

### Colonnes attendues

\`employee_name\`, \`level\`

Trier par \`level\` ASC, puis \`employee_name\` ASC.`,

  hint: "Start the anchor with WHERE manager_id IS NULL (level 0). In the recursive step, join employees on manager_id = cte.id and increment level by 1.",
  hintFr: "Commencez l'ancre avec WHERE manager_id IS NULL (niveau 0). Dans l'étape récursive, joignez employees sur manager_id = cte.id et incrémentez level de 1.",

  schema: `CREATE TABLE employees (
  id INTEGER,
  name VARCHAR,
  manager_id INTEGER
);

INSERT INTO employees VALUES
  (1,  'Sarah Chen',     NULL),
  (2,  'Marcus Webb',    1),
  (3,  'Priya Nair',     1),
  (4,  'Tom Okafor',     1),
  (5,  'Julia Santos',   2),
  (6,  'Ahmed Yilmaz',   2),
  (7,  'Ling Zhao',      3),
  (8,  'Ben Kowalski',   3),
  (9,  'Nadia Dupont',   4),
  (10, 'Carlos Reyes',   5),
  (11, 'Fatima Hassan',  5),
  (12, 'Dmitri Volkov',  6),
  (13, 'Yuki Tanaka',    7),
  (14, 'Isabel Ferreira',8),
  (15, 'Kwame Mensah',   9);`,

  solutionQuery: `WITH RECURSIVE org AS (
  SELECT
    id,
    name AS employee_name,
    0    AS level
  FROM employees
  WHERE manager_id IS NULL

  UNION ALL

  SELECT
    e.id,
    e.name,
    o.level + 1
  FROM employees e
  JOIN org o ON e.manager_id = o.id
)
SELECT employee_name, level
FROM org
ORDER BY level, employee_name;`,

  solutionExplanation: `## Explanation

### Pattern: Recursive CTE for hierarchy traversal

This exercise uses the classic **recursive hierarchy depth** pattern.

#### Step-by-step

1. **Anchor member** — selects the root node (CEO, \`manager_id IS NULL\`) and seeds \`level = 0\`.
2. **Recursive member** — joins \`employees\` to the CTE result on \`manager_id = org.id\`, incrementing \`level\` by 1 at each step.
3. **UNION ALL** — combines anchor and recursive results until no new rows are produced (i.e., leaf nodes are reached).

#### Why this approach

- Pure SQL, no application-level looping.
- Handles any tree depth as long as there are no cycles in the data.
- The \`ORDER BY level, employee_name\` in the outer query makes the result deterministic.

#### When to use

Any time you have a self-referencing table (org chart, product categories, comment threads, file system) and you need to assign depth or aggregate by level.

#### DuckDB note

DuckDB supports \`WITH RECURSIVE\` natively. The syntax is identical to PostgreSQL.`,

  solutionExplanationFr: `## Explication

### Patron : CTE récursif pour la traversée de hiérarchie

Cet exercice utilise le patron classique de **profondeur de hiérarchie récursive**.

#### Étape par étape

1. **Membre ancre** — sélectionne la racine (PDG, \`manager_id IS NULL\`) et initialise \`level = 0\`.
2. **Membre récursif** — joint \`employees\` au résultat du CTE sur \`manager_id = org.id\`, en incrémentant \`level\` de 1 à chaque itération.
3. **UNION ALL** — combine les résultats jusqu'à ce qu'il n'y ait plus de nouvelles lignes (feuilles atteintes).

#### Pourquoi cette approche

- SQL pur, sans boucle côté application.
- Gère n'importe quelle profondeur d'arbre (sans cycles dans les données).
- L'\`ORDER BY level, employee_name\` dans la requête externe rend le résultat déterministe.

#### Quand l'utiliser

Partout où vous avez une table auto-référente (organigramme, catégories, fils de commentaires, système de fichiers) et où vous devez attribuer une profondeur ou agréger par niveau.`,

  testCases: [
    {
      name: "default",
      description: "All 15 employees with their correct depth level, ordered by level then name",
      descriptionFr: "Les 15 employés avec leur niveau de profondeur correct, triés par niveau puis par nom",
      expectedColumns: ["employee_name", "level"],
      expectedRows: [
        { employee_name: "Sarah Chen",      level: 0 },
        { employee_name: "Marcus Webb",     level: 1 },
        { employee_name: "Priya Nair",      level: 1 },
        { employee_name: "Tom Okafor",      level: 1 },
        { employee_name: "Ahmed Yilmaz",    level: 2 },
        { employee_name: "Ben Kowalski",    level: 2 },
        { employee_name: "Julia Santos",    level: 2 },
        { employee_name: "Ling Zhao",       level: 2 },
        { employee_name: "Nadia Dupont",    level: 2 },
        { employee_name: "Carlos Reyes",    level: 3 },
        { employee_name: "Dmitri Volkov",   level: 3 },
        { employee_name: "Fatima Hassan",   level: 3 },
        { employee_name: "Isabel Ferreira", level: 3 },
        { employee_name: "Yuki Tanaka",     level: 3 },
        { employee_name: "Kwame Mensah",    level: 4 },
      ],
      orderMatters: true,
    },
    {
      name: "extra-leaf",
      description: "Adding a 5th-level employee still assigns the correct depth",
      descriptionFr: "Ajouter un employé de niveau 5 lui attribue toujours la profondeur correcte",
      setupSql: `INSERT INTO employees VALUES (16, 'Aisha Osei', 15);`,
      expectedColumns: ["employee_name", "level"],
      expectedRows: [
        { employee_name: "Sarah Chen",      level: 0 },
        { employee_name: "Marcus Webb",     level: 1 },
        { employee_name: "Priya Nair",      level: 1 },
        { employee_name: "Tom Okafor",      level: 1 },
        { employee_name: "Ahmed Yilmaz",    level: 2 },
        { employee_name: "Ben Kowalski",    level: 2 },
        { employee_name: "Julia Santos",    level: 2 },
        { employee_name: "Ling Zhao",       level: 2 },
        { employee_name: "Nadia Dupont",    level: 2 },
        { employee_name: "Carlos Reyes",    level: 3 },
        { employee_name: "Dmitri Volkov",   level: 3 },
        { employee_name: "Fatima Hassan",   level: 3 },
        { employee_name: "Isabel Ferreira", level: 3 },
        { employee_name: "Yuki Tanaka",     level: 3 },
        { employee_name: "Kwame Mensah",    level: 4 },
        { employee_name: "Aisha Osei",      level: 5 },
      ],
      orderMatters: true,
    },
  ],
};
