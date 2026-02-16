import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "38-self-join-employee-managers",
  title: "Employee-Manager Directory",
  difficulty: "medium",
  category: "multi-table-joins",
  description: `## Employee-Manager Directory

HR is building an org chart and needs a directory that shows each employee alongside their manager's name. The CEO has no manager, but should still appear in the list with a NULL manager name.

Write a query that returns each employee's full name, department, and their manager's full name.

### Schema

**employees**
| Column | Type |
|--------|------|
| employee_id | INTEGER |
| first_name | VARCHAR |
| last_name | VARCHAR |
| department | VARCHAR |
| manager_id | INTEGER (nullable, references employee_id) |

### Expected output columns
\`employee_name\`, \`department\`, \`manager_name\`

Order by \`employee_id\` ASC (use the base table's employee_id for ordering).`,
  hint: "Use a LEFT JOIN from the employees table back to itself, aliasing one copy as 'e' (employee) and another as 'm' (manager). Join on e.manager_id = m.employee_id. LEFT JOIN ensures the CEO (manager_id IS NULL) still appears.",
  schema: `CREATE TABLE employees (
  employee_id INTEGER PRIMARY KEY,
  first_name VARCHAR,
  last_name VARCHAR,
  department VARCHAR,
  manager_id INTEGER
);

INSERT INTO employees VALUES
  (1, 'Sarah', 'Connor', 'Executive', NULL),
  (2, 'John', 'Smith', 'Engineering', 1),
  (3, 'Maria', 'Garcia', 'Marketing', 1),
  (4, 'James', 'Wilson', 'Engineering', 2),
  (5, 'Emily', 'Chen', 'Engineering', 2),
  (6, 'Michael', 'Brown', 'Marketing', 3),
  (7, 'Lisa', 'Taylor', 'Marketing', 3),
  (8, 'David', 'Kim', 'Engineering', 4),
  (9, 'Rachel', 'Lee', 'Sales', 1),
  (10, 'Tom', 'Davis', 'Sales', 9);`,
  solutionQuery: `SELECT
  e.first_name || ' ' || e.last_name AS employee_name,
  e.department,
  m.first_name || ' ' || m.last_name AS manager_name
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.employee_id
ORDER BY e.employee_id;`,
  solutionExplanation: `## Explanation

### Pattern: Self-Join

This uses the **self-join** pattern where a table is joined to itself to express hierarchical relationships.

### Step-by-step
1. **FROM employees e**: The first copy of the table represents each employee.
2. **LEFT JOIN employees m ON e.manager_id = m.employee_id**: The second copy represents the manager. We match each employee's manager_id to the manager's employee_id.
3. **LEFT JOIN (not INNER JOIN)**: Ensures the CEO (manager_id IS NULL) still appears in the result with a NULL manager_name.
4. **Concatenation**: \`first_name || ' ' || last_name\` builds the full name from both table aliases.

### Why LEFT JOIN?
Using INNER JOIN would exclude Sarah Connor (the CEO) because her manager_id is NULL and has no match. LEFT JOIN preserves all rows from the left table (employees) even when there's no matching row in the right table (managers).

### When to use
- Organizational hierarchies (employee → manager)
- Category trees (subcategory → parent category)
- Any table with a self-referencing foreign key`,
  testCases: [
    {
      name: "default",
      description: "Returns all employees with their manager names, CEO has NULL manager",
      expectedColumns: ["employee_name", "department", "manager_name"],
      expectedRows: [
        { employee_name: "Sarah Connor", department: "Executive", manager_name: null },
        { employee_name: "John Smith", department: "Engineering", manager_name: "Sarah Connor" },
        { employee_name: "Maria Garcia", department: "Marketing", manager_name: "Sarah Connor" },
        { employee_name: "James Wilson", department: "Engineering", manager_name: "John Smith" },
        { employee_name: "Emily Chen", department: "Engineering", manager_name: "John Smith" },
        { employee_name: "Michael Brown", department: "Marketing", manager_name: "Maria Garcia" },
        { employee_name: "Lisa Taylor", department: "Marketing", manager_name: "Maria Garcia" },
        { employee_name: "David Kim", department: "Engineering", manager_name: "James Wilson" },
        { employee_name: "Rachel Lee", department: "Sales", manager_name: "Sarah Connor" },
        { employee_name: "Tom Davis", department: "Sales", manager_name: "Rachel Lee" },
      ],
      orderMatters: true,
    },
    {
      name: "new-hire-no-manager",
      description: "A new hire with no assigned manager also appears with NULL manager",
      setupSql: `INSERT INTO employees VALUES (11, 'New', 'Hire', 'Engineering', NULL);`,
      expectedColumns: ["employee_name", "department", "manager_name"],
      expectedRows: [
        { employee_name: "Sarah Connor", department: "Executive", manager_name: null },
        { employee_name: "John Smith", department: "Engineering", manager_name: "Sarah Connor" },
        { employee_name: "Maria Garcia", department: "Marketing", manager_name: "Sarah Connor" },
        { employee_name: "James Wilson", department: "Engineering", manager_name: "John Smith" },
        { employee_name: "Emily Chen", department: "Engineering", manager_name: "John Smith" },
        { employee_name: "Michael Brown", department: "Marketing", manager_name: "Maria Garcia" },
        { employee_name: "Lisa Taylor", department: "Marketing", manager_name: "Maria Garcia" },
        { employee_name: "David Kim", department: "Engineering", manager_name: "James Wilson" },
        { employee_name: "Rachel Lee", department: "Sales", manager_name: "Sarah Connor" },
        { employee_name: "Tom Davis", department: "Sales", manager_name: "Rachel Lee" },
        { employee_name: "New Hire", department: "Engineering", manager_name: null },
      ],
      orderMatters: true,
    },
  ],
};
