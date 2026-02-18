import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "105-percent-rank-salary",
  title: "Salary Percentile Ranking",
  titleFr: "Classement percentile des salaires",
  difficulty: "medium",
  category: "window-functions",
  description: `## Salary Percentile Ranking

HR is conducting a **compensation equity analysis** and needs to know where each employee's salary falls as a percentile within their department. An employee at the 75th percentile earns more than 75% of their department peers.

Use \`PERCENT_RANK()\` to compute the percentile, rounded to 2 decimal places and expressed as a percentage (0–100).

### Schema

| Column | Type |
|--------|------|
| employee_id | INTEGER |
| employee_name | VARCHAR |
| department | VARCHAR |
| salary | DECIMAL(10,2) |

### Expected output columns
\`department\`, \`employee_name\`, \`salary\`, \`salary_percentile\`

Order by department ASC, salary DESC.`,
  descriptionFr: `## Classement percentile des salaires

Les RH effectuent une **analyse d'équité salariale** et ont besoin de savoir où se situe le salaire de chaque employé en percentile au sein de son département. Un employé au 75e percentile gagne plus que 75% de ses collègues du département.

Utilisez \`PERCENT_RANK()\` pour calculer le percentile, arrondi à 2 décimales et exprimé en pourcentage (0–100).

### Schema

| Column | Type |
|--------|------|
| employee_id | INTEGER |
| employee_name | VARCHAR |
| department | VARCHAR |
| salary | DECIMAL(10,2) |

### Colonnes attendues en sortie
\`department\`, \`employee_name\`, \`salary\`, \`salary_percentile\`

Triez par department ASC, salary DESC.`,
  hint: "PERCENT_RANK() returns a value from 0 to 1. Multiply by 100 and ROUND to get a percentage. Use PARTITION BY department ORDER BY salary.",
  hintFr: "PERCENT_RANK() retourne une valeur de 0 à 1. Multipliez par 100 et arrondissez avec ROUND pour obtenir un pourcentage. Utilisez PARTITION BY department ORDER BY salary.",
  schema: `CREATE TABLE employees (
  employee_id INTEGER,
  employee_name VARCHAR,
  department VARCHAR,
  salary DECIMAL(10,2)
);

INSERT INTO employees VALUES
  (1, 'Alice Martin', 'Engineering', 95000.00),
  (2, 'Bob Chen', 'Engineering', 110000.00),
  (3, 'Clara Kim', 'Engineering', 85000.00),
  (4, 'David Patel', 'Engineering', 120000.00),
  (5, 'Eva Santos', 'Engineering', 95000.00),
  (6, 'Frank Lee', 'Marketing', 72000.00),
  (7, 'Grace Liu', 'Marketing', 85000.00),
  (8, 'Henry Zhao', 'Marketing', 68000.00),
  (9, 'Iris Müller', 'Marketing', 92000.00),
  (10, 'Jack Brown', 'Sales', 65000.00),
  (11, 'Kate Davis', 'Sales', 78000.00),
  (12, 'Leo Garcia', 'Sales', 71000.00);`,
  solutionQuery: `SELECT
  department,
  employee_name,
  salary,
  ROUND(PERCENT_RANK() OVER (PARTITION BY department ORDER BY salary) * 100, 2) AS salary_percentile
FROM employees
ORDER BY department, salary DESC;`,
  solutionExplanation: `## Explanation

### Pattern: PERCENT_RANK() for percentile analysis

This uses the **percentile ranking** pattern to express each row's position as a percentage within its group.

### Step-by-step
1. \`PARTITION BY department\` — separate ranking per department
2. \`ORDER BY salary\` — ascending order so lower salaries get lower percentiles
3. \`PERCENT_RANK()\` — computes \`(rank - 1) / (total_rows - 1)\`, returning 0.0 to 1.0
4. Multiply by 100 and round for human-readable percentages

### PERCENT_RANK formula
\`(rank - 1) / (N - 1)\` where N is the number of rows in the partition.
- The lowest value always gets 0 (0th percentile)
- The highest value always gets 1 (100th percentile)

### PERCENT_RANK vs CUME_DIST
- **PERCENT_RANK**: "What percentage of rows rank below me?" — ranges from 0 to 1
- **CUME_DIST**: "What percentage of rows have values ≤ mine?" — ranges from >0 to 1

### When to use
- Salary equity analysis across departments
- Student grade percentiles
- Performance benchmarking (e.g., "this server is faster than 90% of peers")`,
  solutionExplanationFr: `## Explication

### Pattern : PERCENT_RANK() pour l'analyse en percentiles

Ce pattern utilise le **classement en percentiles** pour exprimer la position de chaque ligne en pourcentage dans son groupe.

### Étape par étape
1. \`PARTITION BY department\` — classement séparé par département
2. \`ORDER BY salary\` — ordre croissant pour que les salaires bas aient des percentiles bas
3. \`PERCENT_RANK()\` — calcule \`(rang - 1) / (total_lignes - 1)\`, retourne 0.0 à 1.0
4. Multiplier par 100 et arrondir pour des pourcentages lisibles

### Formule de PERCENT_RANK
\`(rang - 1) / (N - 1)\` où N est le nombre de lignes dans la partition.
- La valeur la plus basse obtient toujours 0 (0e percentile)
- La valeur la plus haute obtient toujours 1 (100e percentile)

### Quand l'utiliser
- Analyse d'équité salariale entre départements
- Percentiles de notes d'étudiants
- Benchmarking de performance`,
  testCases: [
    {
      name: "default",
      description: "Salary percentile ranking within each department",
      descriptionFr: "Classement en percentile des salaires au sein de chaque département",
      expectedColumns: ["department", "employee_name", "salary", "salary_percentile"],
      expectedRows: [
        { department: "Engineering", employee_name: "David Patel", salary: 120000.00, salary_percentile: 100.00 },
        { department: "Engineering", employee_name: "Bob Chen", salary: 110000.00, salary_percentile: 75.00 },
        { department: "Engineering", employee_name: "Alice Martin", salary: 95000.00, salary_percentile: 25.00 },
        { department: "Engineering", employee_name: "Eva Santos", salary: 95000.00, salary_percentile: 25.00 },
        { department: "Engineering", employee_name: "Clara Kim", salary: 85000.00, salary_percentile: 0.00 },
        { department: "Marketing", employee_name: "Iris Müller", salary: 92000.00, salary_percentile: 100.00 },
        { department: "Marketing", employee_name: "Grace Liu", salary: 85000.00, salary_percentile: 66.67 },
        { department: "Marketing", employee_name: "Frank Lee", salary: 72000.00, salary_percentile: 33.33 },
        { department: "Marketing", employee_name: "Henry Zhao", salary: 68000.00, salary_percentile: 0.00 },
        { department: "Sales", employee_name: "Kate Davis", salary: 78000.00, salary_percentile: 100.00 },
        { department: "Sales", employee_name: "Leo Garcia", salary: 71000.00, salary_percentile: 50.00 },
        { department: "Sales", employee_name: "Jack Brown", salary: 65000.00, salary_percentile: 0.00 },
      ],
      orderMatters: true,
    },
    {
      name: "single-employee-department",
      description: "A department with one employee gets percentile 0",
      descriptionFr: "Un département avec un seul employé obtient le percentile 0",
      setupSql: `INSERT INTO employees VALUES (13, 'Zara Novak', 'Legal', 105000.00);`,
      expectedColumns: ["department", "employee_name", "salary", "salary_percentile"],
      expectedRows: [
        { department: "Engineering", employee_name: "David Patel", salary: 120000.00, salary_percentile: 100.00 },
        { department: "Engineering", employee_name: "Bob Chen", salary: 110000.00, salary_percentile: 75.00 },
        { department: "Engineering", employee_name: "Alice Martin", salary: 95000.00, salary_percentile: 25.00 },
        { department: "Engineering", employee_name: "Eva Santos", salary: 95000.00, salary_percentile: 25.00 },
        { department: "Engineering", employee_name: "Clara Kim", salary: 85000.00, salary_percentile: 0.00 },
        { department: "Legal", employee_name: "Zara Novak", salary: 105000.00, salary_percentile: 0.00 },
        { department: "Marketing", employee_name: "Iris Müller", salary: 92000.00, salary_percentile: 100.00 },
        { department: "Marketing", employee_name: "Grace Liu", salary: 85000.00, salary_percentile: 66.67 },
        { department: "Marketing", employee_name: "Frank Lee", salary: 72000.00, salary_percentile: 33.33 },
        { department: "Marketing", employee_name: "Henry Zhao", salary: 68000.00, salary_percentile: 0.00 },
        { department: "Sales", employee_name: "Kate Davis", salary: 78000.00, salary_percentile: 100.00 },
        { department: "Sales", employee_name: "Leo Garcia", salary: 71000.00, salary_percentile: 50.00 },
        { department: "Sales", employee_name: "Jack Brown", salary: 65000.00, salary_percentile: 0.00 },
      ],
      orderMatters: true,
    },
  ],
};
