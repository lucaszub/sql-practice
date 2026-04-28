import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "124-shift-coverage-gaps",
  title: "Find Unassigned Shifts for Covered Departments",
  difficulty: "medium",
  category: "multi-table-joins",
  description: `## Find Unassigned Shifts for Covered Departments

The operations manager needs every employee in a "full-coverage" department to be assigned to all three shifts (Morning, Afternoon, Evening). Admin staff are exempt — their department does not require full shift coverage.

Before the weekly schedule is published, the system must flag: **which employee-shift combinations are still unassigned for coverage-required departments?**

Write a query that returns each missing (employee, shift) pair.

### Schema

**employees**
| Column | Type |
|--------|------|
| employee_id | INTEGER |
| name | VARCHAR |
| dept_id | INTEGER |

**shifts**
| Column | Type |
|--------|------|
| shift_id | INTEGER |
| shift_name | VARCHAR |

**departments**
| Column | Type |
|--------|------|
| dept_id | INTEGER |
| dept_name | VARCHAR |
| requires_coverage | BOOLEAN |

**assignments**
| Column | Type |
|--------|------|
| employee_id | INTEGER |
| shift_id | INTEGER |

### Expected output columns
\`employee_name\`, \`shift_name\`

Order by \`employee_name\` ASC, then \`shift_name\` ASC.`,
  hint: "CROSS JOIN generates every employee×shift pair. INNER JOIN departments and filter requires_coverage = true to drop exempt staff. LEFT JOIN assignments and keep rows where the assignment is NULL.",
  schema: `CREATE TABLE employees (
  employee_id INTEGER PRIMARY KEY,
  name VARCHAR,
  dept_id INTEGER
);

CREATE TABLE shifts (
  shift_id INTEGER PRIMARY KEY,
  shift_name VARCHAR
);

CREATE TABLE departments (
  dept_id INTEGER PRIMARY KEY,
  dept_name VARCHAR,
  requires_coverage BOOLEAN
);

CREATE TABLE assignments (
  employee_id INTEGER,
  shift_id INTEGER,
  PRIMARY KEY (employee_id, shift_id)
);

INSERT INTO departments VALUES
  (1, 'Operations', true),
  (2, 'Warehouse', true),
  (3, 'Admin', false);

INSERT INTO employees VALUES
  (1, 'Alice', 1),
  (2, 'Bob', 1),
  (3, 'Carol', 2),
  (4, 'Dave', 3);

INSERT INTO shifts VALUES
  (1, 'Afternoon'),
  (2, 'Evening'),
  (3, 'Morning');

INSERT INTO assignments VALUES
  (1, 3),
  (1, 2),
  (2, 3),
  (2, 1),
  (3, 1),
  (3, 2);`,
  solutionQuery: `SELECT
  e.name AS employee_name,
  s.shift_name
FROM employees e
CROSS JOIN shifts s
INNER JOIN departments d
  ON e.dept_id = d.dept_id
  AND d.requires_coverage = true
LEFT JOIN assignments a
  ON e.employee_id = a.employee_id
  AND s.shift_id = a.shift_id
WHERE a.employee_id IS NULL
ORDER BY e.name, s.shift_name;`,
  solutionExplanation: `## Explanation

### Pattern: CROSS JOIN + INNER JOIN filter + LEFT JOIN gap detection

### Step-by-step

1. **CROSS JOIN shifts**: Produces every (employee, shift) pair — 4 employees × 3 shifts = 12 rows.
2. **INNER JOIN departments ON requires_coverage = true**: Drops Dave (Admin dept) immediately, leaving 3 × 3 = 9 pairs.
3. **LEFT JOIN assignments**: Tries to match each pair to a real assignment row. Unmatched pairs carry NULL assignment columns.
4. **WHERE a.employee_id IS NULL**: Keeps only the unassigned pairs.

### Key detail
The INNER JOIN condition combines a foreign-key match (\`e.dept_id = d.dept_id\`) with a business filter (\`d.requires_coverage = true\`). This is cleaner than pre-filtering employees in a subquery and makes the intent explicit.

### When to use
Shift scheduling, audit coverage matrices, compliance checklists — any scenario where a subset of entities must satisfy a complete coverage requirement.`,
  testCases: [
    {
      name: "default",
      description: "Returns 3 unassigned employee-shift pairs",
      expectedColumns: ["employee_name", "shift_name"],
      expectedRows: [
        { employee_name: "Alice", shift_name: "Afternoon" },
        { employee_name: "Bob", shift_name: "Evening" },
        { employee_name: "Carol", shift_name: "Morning" },
      ],
      orderMatters: true,
    },
    {
      name: "fully-scheduled",
      description: "After filling all gaps, no missing assignments remain",
      setupSql: `INSERT INTO assignments VALUES (1, 1), (2, 2), (3, 3);`,
      expectedColumns: ["employee_name", "shift_name"],
      expectedRows: [],
      orderMatters: false,
    },
  ],
};
