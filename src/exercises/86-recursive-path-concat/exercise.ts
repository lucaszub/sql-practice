import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "86-recursive-path-concat",
  title: "Full Management Chain Path",
  titleFr: "Chemin complet de la chaîne managériale",
  difficulty: "hard",
  category: "recursive-ctes",
  description: `## Full Management Chain Path

The HR analytics team is building an employee directory that must display the **full reporting chain** for each person — from the CEO down to the employee — separated by " > ".

For example, an engineer reporting to a team lead, who reports to a VP, who reports to the CEO would show:
\`CEO Name > VP Name > Team Lead Name > Engineer Name\`

### Schema

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | Primary key |
| name | VARCHAR | Employee name |
| manager_id | INTEGER | NULL for the CEO |

### Task

Write a recursive CTE that builds the full management chain path for every employee using string concatenation.

### Expected output columns

\`employee_name\`, \`management_chain\`

Order by \`management_chain\` ASC.`,

  descriptionFr: `## Chemin complet de la chaîne managériale

L'équipe d'analytique RH construit un annuaire des employés qui doit afficher la **chaîne hiérarchique complète** pour chaque personne — du PDG jusqu'à l'employé — séparée par " > ".

Par exemple, un ingénieur rattaché à un chef d'équipe, lui-même rattaché à un VP, lui-même rattaché au PDG afficherait :
\`Nom PDG > Nom VP > Nom Chef d'équipe > Nom Ingénieur\`

### Schéma

| Colonne | Type | Notes |
|---------|------|-------|
| id | INTEGER | Clé primaire |
| name | VARCHAR | Nom de l'employé |
| manager_id | INTEGER | NULL pour le PDG |

### Tâche

Écrire un CTE récursif qui construit le chemin complet de la chaîne managériale pour chaque employé par concaténation de chaînes.

### Colonnes attendues

\`employee_name\`, \`management_chain\`

Trier par \`management_chain\` ASC.`,

  hint: "Seed the path with the CEO's name. In the recursive step, concatenate the parent's path with ' > ' and the current employee's name.",
  hintFr: "Initialisez le chemin avec le nom du PDG. Dans l'étape récursive, concaténez le chemin du parent avec ' > ' et le nom de l'employé courant.",

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

  solutionQuery: `WITH RECURSIVE chain AS (
  SELECT
    id,
    name          AS employee_name,
    name          AS management_chain
  FROM employees
  WHERE manager_id IS NULL

  UNION ALL

  SELECT
    e.id,
    e.name,
    c.management_chain || ' > ' || e.name
  FROM employees e
  JOIN chain c ON e.manager_id = c.id
)
SELECT employee_name, management_chain
FROM chain
ORDER BY management_chain;`,

  solutionExplanation: `## Explanation

### Pattern: Recursive path concatenation

This exercise extends the basic hierarchy traversal with **string accumulation** across recursion levels.

#### Step-by-step

1. **Anchor member** — the CEO row seeds both \`employee_name\` and \`management_chain\` with the CEO's name.
2. **Recursive member** — for each employee, the new \`management_chain\` is the parent's chain concatenated with \`' > '\` and the current employee's name.
3. **Termination** — recursion stops when no more employees reference a CTE row as their manager (leaf nodes).

#### Why this approach

String concatenation inside a recursive CTE avoids a second self-join or a GROUP_CONCAT on a closure table. The path is built incrementally, one level at a time, which is both readable and efficient.

#### When to use

- Employee org chart breadcrumbs
- File system path reconstruction
- URL slug generation from nested categories
- Any scenario where you need the full ancestor trail as a single string

#### DuckDB note

The \`||\` operator is the standard SQL string concatenation operator, fully supported in DuckDB.`,

  solutionExplanationFr: `## Explication

### Patron : Concaténation de chemin récursive

Cet exercice étend la traversée de hiérarchie de base avec une **accumulation de chaîne** à travers les niveaux de récursion.

#### Étape par étape

1. **Membre ancre** — la ligne du PDG initialise \`employee_name\` et \`management_chain\` avec le nom du PDG.
2. **Membre récursif** — pour chaque employé, le nouveau \`management_chain\` est la chaîne du parent concaténée avec \`' > '\` et le nom de l'employé courant.
3. **Terminaison** — la récursion s'arrête quand plus aucun employé ne référence une ligne du CTE comme manager (feuilles atteintes).

#### Pourquoi cette approche

La concaténation de chaîne dans un CTE récursif évite une seconde auto-jointure ou un GROUP_CONCAT sur une table de fermeture. Le chemin est construit de façon incrémentale, niveau par niveau.

#### Quand l'utiliser

- Fils d'Ariane dans un organigramme
- Reconstruction de chemins de système de fichiers
- Génération de slugs d'URL depuis des catégories imbriquées
- Tout scénario nécessitant la piste complète des ancêtres sous forme de chaîne unique.`,

  testCases: [
    {
      name: "default",
      description: "Full management chain paths for all 15 employees, ordered alphabetically",
      descriptionFr: "Chemins complets pour les 15 employés, triés alphabétiquement",
      expectedColumns: ["employee_name", "management_chain"],
      expectedRows: [
        { employee_name: "Ahmed Yilmaz",    management_chain: "Sarah Chen > Marcus Webb > Ahmed Yilmaz" },
        { employee_name: "Ben Kowalski",    management_chain: "Sarah Chen > Priya Nair > Ben Kowalski" },
        { employee_name: "Carlos Reyes",    management_chain: "Sarah Chen > Marcus Webb > Julia Santos > Carlos Reyes" },
        { employee_name: "Dmitri Volkov",   management_chain: "Sarah Chen > Marcus Webb > Ahmed Yilmaz > Dmitri Volkov" },
        { employee_name: "Fatima Hassan",   management_chain: "Sarah Chen > Marcus Webb > Julia Santos > Fatima Hassan" },
        { employee_name: "Isabel Ferreira", management_chain: "Sarah Chen > Priya Nair > Ben Kowalski > Isabel Ferreira" },
        { employee_name: "Julia Santos",    management_chain: "Sarah Chen > Marcus Webb > Julia Santos" },
        { employee_name: "Kwame Mensah",    management_chain: "Sarah Chen > Tom Okafor > Nadia Dupont > Kwame Mensah" },
        { employee_name: "Ling Zhao",       management_chain: "Sarah Chen > Priya Nair > Ling Zhao" },
        { employee_name: "Marcus Webb",     management_chain: "Sarah Chen > Marcus Webb" },
        { employee_name: "Nadia Dupont",    management_chain: "Sarah Chen > Tom Okafor > Nadia Dupont" },
        { employee_name: "Priya Nair",      management_chain: "Sarah Chen > Priya Nair" },
        { employee_name: "Sarah Chen",      management_chain: "Sarah Chen" },
        { employee_name: "Tom Okafor",      management_chain: "Sarah Chen > Tom Okafor" },
        { employee_name: "Yuki Tanaka",     management_chain: "Sarah Chen > Priya Nair > Ling Zhao > Yuki Tanaka" },
      ],
      orderMatters: true,
    },
    {
      name: "single-report",
      description: "A tree with only one direct report from the CEO produces the correct 2-segment path",
      descriptionFr: "Un arbre avec un seul subordonné direct du PDG produit le chemin à 2 segments correct",
      setupSql: `DELETE FROM employees WHERE id != 1 AND id != 2;`,
      expectedColumns: ["employee_name", "management_chain"],
      expectedRows: [
        { employee_name: "Sarah Chen",  management_chain: "Sarah Chen" },
        { employee_name: "Marcus Webb", management_chain: "Sarah Chen > Marcus Webb" },
      ],
      orderMatters: true,
    },
  ],
};
