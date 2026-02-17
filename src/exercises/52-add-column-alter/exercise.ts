import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "52-add-column-alter",
  title: "Add Email Column to Employees",
  titleFr: "Ajouter une colonne email aux employes",
  difficulty: "easy",
  category: "ddl-dml",
  description: `## Add Email Column to Employees

The HR department is migrating to a new communication platform and needs every employee record to include a corporate email address. The \`employees\` table already exists but was created before the email requirement was defined.

### Schema

**employees** (pre-existing)
| Column | Type |
|--------|------|
| employee_id | INTEGER |
| full_name | VARCHAR |
| department | VARCHAR |
| hire_date | DATE |
| salary | DECIMAL(10,2) |

### Task

Write a script that:
1. Uses \`ALTER TABLE\` to add an \`email VARCHAR\` column to the existing \`employees\` table
2. Uses \`UPDATE\` to set the email for employees 1, 2, and 3 (leave the rest as NULL to reflect that migration is still in progress)
3. Ends with \`SELECT employee_id, full_name, department, email FROM employees ORDER BY employee_id\` to verify

### Expected output columns
\`employee_id\`, \`full_name\`, \`department\`, \`email\``,
  descriptionFr: `## Ajouter une colonne email aux employes

Le departement RH migre vers une nouvelle plateforme de communication et a besoin que chaque fiche employe inclue une adresse email corporate. La table \`employees\` existe deja mais a ete creee avant que l'exigence email ne soit definie.

### Schema

**employees** (pre-existante)
| Colonne | Type |
|---------|------|
| employee_id | INTEGER |
| full_name | VARCHAR |
| department | VARCHAR |
| hire_date | DATE |
| salary | DECIMAL(10,2) |

### Consigne

Ecrivez un script qui :
1. Utilise \`ALTER TABLE\` pour ajouter une colonne \`email VARCHAR\` a la table \`employees\` existante
2. Utilise \`UPDATE\` pour definir l'email des employes 1, 2 et 3 (laisser le reste a NULL pour reflechir que la migration est encore en cours)
3. Termine par \`SELECT employee_id, full_name, department, email FROM employees ORDER BY employee_id\` pour verifier

### Colonnes attendues en sortie
\`employee_id\`, \`full_name\`, \`department\`, \`email\``,
  hint: "Use ALTER TABLE employees ADD COLUMN email VARCHAR; then UPDATE employees SET email = '...' WHERE employee_id = ...; for each employee. Finish with a SELECT.",
  hintFr: "Utilisez ALTER TABLE employees ADD COLUMN email VARCHAR; puis UPDATE employees SET email = '...' WHERE employee_id = ...; pour chaque employe. Terminez avec un SELECT.",
  schema: `CREATE TABLE employees (
  employee_id  INTEGER,
  full_name    VARCHAR,
  department   VARCHAR,
  hire_date    DATE,
  salary       DECIMAL(10,2)
);

INSERT INTO employees VALUES
  (1,  'Alice Johnson',   'Engineering',  '2021-03-15', 95000.00),
  (2,  'Bob Smith',       'Marketing',    '2019-07-01', 72000.00),
  (3,  'Carol White',     'Engineering',  '2022-01-10', 88000.00),
  (4,  'David Brown',     'HR',           '2020-05-20', 65000.00),
  (5,  'Eva Martinez',    'Finance',      '2018-11-30', 110000.00),
  (6,  'Frank Lee',       'Engineering',  '2023-02-14', 91000.00),
  (7,  'Grace Kim',       'Marketing',    '2021-08-08', 68000.00),
  (8,  'Hank Davis',      'HR',           '2017-04-25', 70000.00),
  (9,  'Irene Clark',     'Finance',      '2022-09-01', 98000.00),
  (10, 'Jack Wilson',     'Engineering',  '2020-12-05', 105000.00),
  (11, 'Karen Hall',      'Marketing',    '2019-03-18', 75000.00),
  (12, 'Leo Turner',      'HR',           '2023-06-30', 62000.00);`,
  solutionQuery: `ALTER TABLE employees ADD COLUMN email VARCHAR;

UPDATE employees SET email = 'alice.johnson@company.com'  WHERE employee_id = 1;
UPDATE employees SET email = 'bob.smith@company.com'      WHERE employee_id = 2;
UPDATE employees SET email = 'carol.white@company.com'    WHERE employee_id = 3;

SELECT employee_id, full_name, department, email
FROM employees
ORDER BY employee_id;`,
  solutionExplanation: `## Explanation

### ALTER TABLE ADD COLUMN Pattern
This exercise demonstrates the most common schema evolution operation: adding a column to an existing table without losing any existing data.

### Step-by-step
1. **ALTER TABLE employees ADD COLUMN email VARCHAR**: DuckDB supports standard SQL DDL. The new column is added with \`NULL\` as the default value for all existing rows — no data is lost.
2. **UPDATE ... WHERE employee_id = ...**: Targeted updates set specific values for known employees. The remaining rows keep \`NULL\`, which accurately represents "not yet migrated" — a realistic partial-migration scenario.
3. **SELECT employee_id, full_name, department, email**: We select only the relevant columns. The new \`email\` column appears at the end by default but can be positioned anywhere in the SELECT list.

### Why this approach
\`ALTER TABLE ADD COLUMN\` is non-destructive and is the standard way to evolve a schema. It avoids the need to DROP and recreate the table. Partial \`UPDATE\` after the ALTER reflects real migration workflows where not all records are updated at once.

### When to use
- Adding a new attribute to an existing dimension or fact table
- Schema migration scripts in CI/CD pipelines
- Rolling out a new feature that requires a new column`,
  solutionExplanationFr: `## Explication

### Pattern ALTER TABLE ADD COLUMN
Cet exercice illustre l'operation d'evolution de schema la plus courante : ajouter une colonne a une table existante sans perdre les donnees existantes.

### Etape par etape
1. **ALTER TABLE employees ADD COLUMN email VARCHAR** : DuckDB supporte le DDL SQL standard. La nouvelle colonne est ajoutee avec \`NULL\` comme valeur par defaut pour toutes les lignes existantes — aucune donnee n'est perdue.
2. **UPDATE ... WHERE employee_id = ...** : Des mises a jour ciblees definissent des valeurs specifiques pour les employes connus. Les lignes restantes conservent \`NULL\`, ce qui represente fidelement un etat "pas encore migre" — un scenario de migration partielle realiste.
3. **SELECT employee_id, full_name, department, email** : On selectionne uniquement les colonnes pertinentes. La nouvelle colonne \`email\` apparait par defaut en fin de liste mais peut etre positionnee n'importe ou dans le SELECT.

### Pourquoi cette approche
\`ALTER TABLE ADD COLUMN\` est non destructif et constitue la methode standard pour faire evoluer un schema. Cela evite de supprimer et recreer la table. L'UPDATE partiel apres l'ALTER reflete les workflows de migration reels ou tous les enregistrements ne sont pas mis a jour en une seule fois.

### Quand l'utiliser
- Ajout d'un nouvel attribut a une table de dimension ou de faits existante
- Scripts de migration de schema dans des pipelines CI/CD
- Deploiement d'une nouvelle fonctionnalite necessitant une nouvelle colonne`,
  testCases: [
    {
      name: "default",
      description: "Returns all employees with email populated for IDs 1-3 and NULL for the rest",
      descriptionFr: "Renvoie tous les employes avec email renseigne pour les IDs 1-3 et NULL pour les autres",
      expectedColumns: ["employee_id", "full_name", "department", "email"],
      expectedRows: [
        { employee_id: 1,  full_name: "Alice Johnson",  department: "Engineering", email: "alice.johnson@company.com" },
        { employee_id: 2,  full_name: "Bob Smith",      department: "Marketing",   email: "bob.smith@company.com"    },
        { employee_id: 3,  full_name: "Carol White",    department: "Engineering", email: "carol.white@company.com"  },
        { employee_id: 4,  full_name: "David Brown",    department: "HR",          email: null                       },
        { employee_id: 5,  full_name: "Eva Martinez",   department: "Finance",     email: null                       },
        { employee_id: 6,  full_name: "Frank Lee",      department: "Engineering", email: null                       },
        { employee_id: 7,  full_name: "Grace Kim",      department: "Marketing",   email: null                       },
        { employee_id: 8,  full_name: "Hank Davis",     department: "HR",          email: null                       },
        { employee_id: 9,  full_name: "Irene Clark",    department: "Finance",     email: null                       },
        { employee_id: 10, full_name: "Jack Wilson",    department: "Engineering", email: null                       },
        { employee_id: 11, full_name: "Karen Hall",     department: "Marketing",   email: null                       },
        { employee_id: 12, full_name: "Leo Turner",     department: "HR",          email: null                       },
      ],
      orderMatters: true,
    },
    {
      name: "null-emails-remain",
      description: "Employees without email should have NULL, not empty string",
      descriptionFr: "Les employes sans email doivent avoir NULL, pas une chaine vide",
      setupSql: `-- Verify only un-migrated employees (IDs 4-12) — they should all have NULL email`,
      expectedColumns: ["employee_id", "full_name", "department", "email"],
      expectedRows: [
        { employee_id: 4,  full_name: "David Brown",  department: "HR",          email: null },
        { employee_id: 5,  full_name: "Eva Martinez", department: "Finance",     email: null },
        { employee_id: 6,  full_name: "Frank Lee",    department: "Engineering", email: null },
        { employee_id: 7,  full_name: "Grace Kim",    department: "Marketing",   email: null },
        { employee_id: 8,  full_name: "Hank Davis",   department: "HR",          email: null },
        { employee_id: 9,  full_name: "Irene Clark",  department: "Finance",     email: null },
        { employee_id: 10, full_name: "Jack Wilson",  department: "Engineering", email: null },
        { employee_id: 11, full_name: "Karen Hall",   department: "Marketing",   email: null },
        { employee_id: 12, full_name: "Leo Turner",   department: "HR",          email: null },
      ],
      orderMatters: false,
    },
  ],
};
