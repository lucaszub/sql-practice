import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "54-foreign-key-design",
  title: "Departments and Employees Relationship",
  titleFr: "Relation departements et employes",
  difficulty: "medium",
  category: "schema-design",
  description: `## Departments and Employees Relationship

The HR system currently stores department information in a flat column on the employees table. The data engineering team wants to normalize the schema: extract departments into their own table and link employees to departments via a foreign key. This enforces referential integrity and allows department-level reporting.

### Schema

No pre-existing tables. Design both tables from scratch.

### Task

Write a script that:
1. Creates a \`departments\` table: \`dept_id INTEGER PRIMARY KEY\`, \`dept_name VARCHAR NOT NULL\`, \`location VARCHAR\`
2. Creates an \`employees\` table: \`employee_id INTEGER\`, \`full_name VARCHAR NOT NULL\`, \`dept_id INTEGER REFERENCES departments(dept_id)\`, \`hire_date DATE\`, \`salary DECIMAL(10,2)\`
3. Inserts data into \`departments\` first (parent), then into \`employees\` (child)
4. Ends with a JOIN query:
\`\`\`sql
SELECT e.employee_id, e.full_name, d.dept_name, d.location, e.salary
FROM employees e
INNER JOIN departments d ON e.dept_id = d.dept_id
ORDER BY e.employee_id;
\`\`\`

### Expected output columns
\`employee_id\`, \`full_name\`, \`dept_name\`, \`location\`, \`salary\``,
  descriptionFr: `## Relation departements et employes

Le systeme RH stocke actuellement les informations de departement dans une colonne plate sur la table employes. L'equipe data engineering souhaite normaliser le schema : extraire les departements dans leur propre table et lier les employes aux departements via une cle etrangere. Cela garantit l'integrite referentielle et permet des rapports au niveau des departements.

### Schema

Aucune table pre-existante. Concevez les deux tables de zero.

### Consigne

Ecrivez un script qui :
1. Cree une table \`departments\` : \`dept_id INTEGER PRIMARY KEY\`, \`dept_name VARCHAR NOT NULL\`, \`location VARCHAR\`
2. Cree une table \`employees\` : \`employee_id INTEGER\`, \`full_name VARCHAR NOT NULL\`, \`dept_id INTEGER REFERENCES departments(dept_id)\`, \`hire_date DATE\`, \`salary DECIMAL(10,2)\`
3. Insere les donnees dans \`departments\` en premier (parent), puis dans \`employees\` (enfant)
4. Termine par une requete JOIN :
\`\`\`sql
SELECT e.employee_id, e.full_name, d.dept_name, d.location, e.salary
FROM employees e
INNER JOIN departments d ON e.dept_id = d.dept_id
ORDER BY e.employee_id;
\`\`\`

### Colonnes attendues en sortie
\`employee_id\`, \`full_name\`, \`dept_name\`, \`location\`, \`salary\``,
  hint: "Create the parent table (departments) before the child table (employees). Use REFERENCES departments(dept_id) inline on the dept_id column in employees. Insert all departments before inserting employees.",
  hintFr: "Creez la table parente (departments) avant la table enfant (employees). Utilisez REFERENCES departments(dept_id) inline sur la colonne dept_id dans employees. Inserez tous les departements avant d'inserer les employes.",
  schema: `-- No pre-existing tables for this exercise.
-- Your solution must CREATE both tables, INSERT data in the correct order, and JOIN to verify.
SELECT 'Ready — design your relational schema below' AS instructions;`,
  solutionQuery: `CREATE TABLE departments (
  dept_id    INTEGER PRIMARY KEY,
  dept_name  VARCHAR NOT NULL,
  location   VARCHAR
);

CREATE TABLE employees (
  employee_id  INTEGER,
  full_name    VARCHAR NOT NULL,
  dept_id      INTEGER REFERENCES departments(dept_id),
  hire_date    DATE,
  salary       DECIMAL(10,2)
);

INSERT INTO departments VALUES
  (1, 'Engineering',  'San Francisco'),
  (2, 'Marketing',    'New York'),
  (3, 'HR',           'Chicago'),
  (4, 'Finance',      'New York'),
  (5, 'Operations',   'Austin');

INSERT INTO employees VALUES
  (1,  'Alice Johnson',   1, '2021-03-15', 95000.00),
  (2,  'Bob Smith',       2, '2019-07-01', 72000.00),
  (3,  'Carol White',     1, '2022-01-10', 88000.00),
  (4,  'David Brown',     3, '2020-05-20', 65000.00),
  (5,  'Eva Martinez',    4, '2018-11-30', 110000.00),
  (6,  'Frank Lee',       1, '2023-02-14', 91000.00),
  (7,  'Grace Kim',       2, '2021-08-08', 68000.00),
  (8,  'Hank Davis',      3, '2017-04-25', 70000.00),
  (9,  'Irene Clark',     4, '2022-09-01', 98000.00),
  (10, 'Jack Wilson',     1, '2020-12-05', 105000.00),
  (11, 'Karen Hall',      2, '2019-03-18', 75000.00),
  (12, 'Leo Turner',      5, '2023-06-30', 62000.00),
  (13, 'Maya Patel',      5, '2022-11-01', 58000.00),
  (14, 'Nathan Cruz',     3, '2021-01-15', 67000.00),
  (15, 'Olivia Reed',     4, '2020-07-22', 102000.00);

SELECT e.employee_id, e.full_name, d.dept_name, d.location, e.salary
FROM employees e
INNER JOIN departments d ON e.dept_id = d.dept_id
ORDER BY e.employee_id;`,
  solutionExplanation: `## Explanation

### Foreign Key Relationship Pattern
This exercise demonstrates the foundational relational design pattern: separating a repeated attribute (department) into its own table and linking tables via a foreign key constraint. This is the first step toward a normalized schema.

### Step-by-step
1. **departments (parent table)**: Created first because the child table references it. \`PRIMARY KEY\` on \`dept_id\` ensures uniqueness and enables referential integrity.
2. **employees (child table)**: The \`dept_id INTEGER REFERENCES departments(dept_id)\` column definition creates a foreign key constraint. DuckDB will reject any insert where the \`dept_id\` does not exist in \`departments\`.
3. **Insert order matters**: Parent rows must exist before child rows that reference them. Inserting employees before departments would violate the foreign key constraint.
4. **INNER JOIN**: Combines the two tables on the shared key. Only employees whose \`dept_id\` matches an existing department are returned — which is all of them here since FK integrity is enforced.

### Why this approach
Normalization reduces data redundancy (the department name and location are stored once, not on every employee row) and ensures consistency (updating a department name only requires one UPDATE on the \`departments\` table). Foreign keys provide a database-level guardrail against orphaned records.

### When to use
- Any time a dimension (department, category, region) is shared across many fact rows
- Star schema design: dimension tables referenced by fact tables
- Anywhere referential integrity needs to be enforced at the database level`,
  solutionExplanationFr: `## Explication

### Pattern Relation Cle Etrangere
Cet exercice illustre le pattern de conception relationnelle fondamental : separer un attribut repete (departement) dans sa propre table et lier les tables via une contrainte de cle etrangere. C'est la premiere etape vers un schema normalise.

### Etape par etape
1. **departments (table parente)** : Creee en premier car la table enfant la reference. \`PRIMARY KEY\` sur \`dept_id\` garantit l'unicite et permet l'integrite referentielle.
2. **employees (table enfant)** : La definition de colonne \`dept_id INTEGER REFERENCES departments(dept_id)\` cree une contrainte de cle etrangere. DuckDB rejettera tout insert dont le \`dept_id\` n'existe pas dans \`departments\`.
3. **L'ordre d'insertion est important** : Les lignes parentes doivent exister avant les lignes enfants qui les referencent. Inserer les employes avant les departements violerait la contrainte de cle etrangere.
4. **INNER JOIN** : Combine les deux tables sur la cle partagee. Seuls les employes dont le \`dept_id\` correspond a un departement existant sont retournes — ce qui est le cas de tous ici puisque l'integrite FK est respectee.

### Pourquoi cette approche
La normalisation reduit la redondance des donnees (le nom et la localisation du departement sont stockes une seule fois, pas sur chaque ligne d'employe) et garantit la coherence (mettre a jour un nom de departement ne necessite qu'un seul UPDATE sur la table \`departments\`). Les cles etrangeres constituent une protection au niveau base de donnees contre les enregistrements orphelins.

### Quand l'utiliser
- Chaque fois qu'une dimension (departement, categorie, region) est partagee par de nombreuses lignes de faits
- Conception de schema en etoile : tables de dimension referencees par des tables de faits
- Partout ou l'integrite referentielle doit etre appliquee au niveau base de donnees`,
  testCases: [
    {
      name: "default",
      description: "Returns all 15 employees joined with their department name and location, sorted by employee_id",
      descriptionFr: "Renvoie les 15 employes joints avec leur nom de departement et localisation, tries par employee_id",
      expectedColumns: ["employee_id", "full_name", "dept_name", "location", "salary"],
      expectedRows: [
        { employee_id: 1,  full_name: "Alice Johnson",  dept_name: "Engineering", location: "San Francisco", salary: 95000.00  },
        { employee_id: 2,  full_name: "Bob Smith",      dept_name: "Marketing",   location: "New York",      salary: 72000.00  },
        { employee_id: 3,  full_name: "Carol White",    dept_name: "Engineering", location: "San Francisco", salary: 88000.00  },
        { employee_id: 4,  full_name: "David Brown",    dept_name: "HR",          location: "Chicago",       salary: 65000.00  },
        { employee_id: 5,  full_name: "Eva Martinez",   dept_name: "Finance",     location: "New York",      salary: 110000.00 },
        { employee_id: 6,  full_name: "Frank Lee",      dept_name: "Engineering", location: "San Francisco", salary: 91000.00  },
        { employee_id: 7,  full_name: "Grace Kim",      dept_name: "Marketing",   location: "New York",      salary: 68000.00  },
        { employee_id: 8,  full_name: "Hank Davis",     dept_name: "HR",          location: "Chicago",       salary: 70000.00  },
        { employee_id: 9,  full_name: "Irene Clark",    dept_name: "Finance",     location: "New York",      salary: 98000.00  },
        { employee_id: 10, full_name: "Jack Wilson",    dept_name: "Engineering", location: "San Francisco", salary: 105000.00 },
        { employee_id: 11, full_name: "Karen Hall",     dept_name: "Marketing",   location: "New York",      salary: 75000.00  },
        { employee_id: 12, full_name: "Leo Turner",     dept_name: "Operations",  location: "Austin",        salary: 62000.00  },
        { employee_id: 13, full_name: "Maya Patel",     dept_name: "Operations",  location: "Austin",        salary: 58000.00  },
        { employee_id: 14, full_name: "Nathan Cruz",    dept_name: "HR",          location: "Chicago",       salary: 67000.00  },
        { employee_id: 15, full_name: "Olivia Reed",    dept_name: "Finance",     location: "New York",      salary: 102000.00 },
      ],
      orderMatters: true,
    },
    {
      name: "single-department",
      description: "Engineering department has exactly 4 employees",
      descriptionFr: "Le departement Engineering compte exactement 4 employes",
      expectedColumns: ["employee_id", "full_name", "dept_name", "location", "salary"],
      expectedRows: [
        { employee_id: 1,  full_name: "Alice Johnson", dept_name: "Engineering", location: "San Francisco", salary: 95000.00  },
        { employee_id: 3,  full_name: "Carol White",   dept_name: "Engineering", location: "San Francisco", salary: 88000.00  },
        { employee_id: 6,  full_name: "Frank Lee",     dept_name: "Engineering", location: "San Francisco", salary: 91000.00  },
        { employee_id: 10, full_name: "Jack Wilson",   dept_name: "Engineering", location: "San Francisco", salary: 105000.00 },
      ],
      orderMatters: false,
      setupSql: `DELETE FROM employees WHERE dept_id != 1;`,
    },
  ],
};
