import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "05-employee-hierarchy",
  title: "Employee Hierarchy",
  difficulty: "hard",
  category: "ctes",
  description: `## Employee Hierarchy (Recursive CTE)

Given an \`employees\` table with a self-referencing \`manager_id\`, write a query that shows each employee with their **management level** (CEO = 0) and the **full management chain** (path from CEO to employee).

### Schema

| Column | Type |
|--------|------|
| id | INTEGER |
| name | VARCHAR |
| manager_id | INTEGER (NULL for CEO) |
| salary | DECIMAL(10,2) |

### Expected output columns
\`id\`, \`name\`, \`level\`, \`path\`

- \`level\`: 0 for CEO, 1 for direct reports, etc.
- \`path\`: slash-separated path like "Alice/Bob/Charlie"

Order by level ASC, name ASC.`,
  hint: "Start the recursive CTE with WHERE manager_id IS NULL (the CEO). In each recursive step, join employees ON employees.manager_id = cte.id and increment the level.",
  schema: `CREATE TABLE employees (
  id INTEGER,
  name VARCHAR,
  manager_id INTEGER,
  salary DECIMAL(10,2)
);

INSERT INTO employees VALUES
  (1, 'Alice', NULL, 150000.00),
  (2, 'Bob', 1, 120000.00),
  (3, 'Charlie', 1, 110000.00),
  (4, 'Diana', 2, 90000.00),
  (5, 'Eve', 2, 85000.00),
  (6, 'Frank', 3, 95000.00);`,
  solutionQuery: `WITH RECURSIVE hierarchy AS (
  SELECT
    id,
    name,
    0 as level,
    name as path
  FROM employees
  WHERE manager_id IS NULL

  UNION ALL

  SELECT
    e.id,
    e.name,
    h.level + 1,
    h.path || '/' || e.name
  FROM employees e
  JOIN hierarchy h ON e.manager_id = h.id
)
SELECT id, name, level, path
FROM hierarchy
ORDER BY level, name;`,
  solutionExplanation: `## Explanation

### Recursive CTE Structure
1. **Anchor member**: Start with employees who have no manager (CEO)
2. **Recursive member**: Join employees whose manager_id matches the current level's id
3. **UNION ALL**: Combines results from each recursion level

### How It Works
- Level 0: Alice (CEO, no manager)
- Level 1: Bob, Charlie (report to Alice)
- Level 2: Diana, Eve (report to Bob), Frank (reports to Charlie)

### Path Building
\`h.path || '/' || e.name\` concatenates the parent's path with the current employee's name, building a breadcrumb trail.`,
  testCases: [
    {
      name: "default",
      description: "Full org hierarchy",
      expectedColumns: ["id", "name", "level", "path"],
      expectedRows: [
        { id: 1, name: "Alice", level: 0, path: "Alice" },
        { id: 2, name: "Bob", level: 1, path: "Alice/Bob" },
        { id: 3, name: "Charlie", level: 1, path: "Alice/Charlie" },
        { id: 4, name: "Diana", level: 2, path: "Alice/Bob/Diana" },
        { id: 5, name: "Eve", level: 2, path: "Alice/Bob/Eve" },
        { id: 6, name: "Frank", level: 2, path: "Alice/Charlie/Frank" },
      ],
      orderMatters: true,
    },
    {
      name: "deep-hierarchy",
      description: "Handles deeper hierarchy",
      setupSql: `INSERT INTO employees VALUES (7, 'Grace', 4, 70000.00);`,
      expectedColumns: ["id", "name", "level", "path"],
      expectedRows: [
        { id: 1, name: "Alice", level: 0, path: "Alice" },
        { id: 2, name: "Bob", level: 1, path: "Alice/Bob" },
        { id: 3, name: "Charlie", level: 1, path: "Alice/Charlie" },
        { id: 4, name: "Diana", level: 2, path: "Alice/Bob/Diana" },
        { id: 5, name: "Eve", level: 2, path: "Alice/Bob/Eve" },
        { id: 6, name: "Frank", level: 2, path: "Alice/Charlie/Frank" },
        { id: 7, name: "Grace", level: 3, path: "Alice/Bob/Diana/Grace" },
      ],
      orderMatters: true,
    },
  ],
};
