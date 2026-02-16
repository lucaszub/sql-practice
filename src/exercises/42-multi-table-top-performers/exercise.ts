import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "42-multi-table-top-performers",
  title: "Top Performers Across Departments",
  difficulty: "medium",
  category: "multi-table-joins",
  description: `## Top Performers Across Departments

HR wants to identify top-performing employees for the annual awards ceremony. A "top performer" is anyone who received a performance rating of 4.0 or higher in 2024. The report should include each employee's name, department, salary, and rating.

Write a query that joins four tables and filters for top performers.

### Schema

**departments**
| Column | Type |
|--------|------|
| department_id | INTEGER |
| department_name | VARCHAR |

**employees**
| Column | Type |
|--------|------|
| employee_id | INTEGER |
| first_name | VARCHAR |
| last_name | VARCHAR |
| department_id | INTEGER |
| hire_date | DATE |

**salaries**
| Column | Type |
|--------|------|
| employee_id | INTEGER |
| salary | INTEGER |

**performance_reviews**
| Column | Type |
|--------|------|
| employee_id | INTEGER |
| review_year | INTEGER |
| rating | DECIMAL(2,1) |

### Expected output columns
\`employee_name\`, \`department_name\`, \`salary\`, \`rating\`

Only include employees with \`rating >= 4.0\` in review year 2024.

Order by \`rating\` DESC, then \`salary\` DESC.`,
  hint: "Join employees to departments, salaries, and performance_reviews using employee_id and department_id. Add a WHERE clause for review_year = 2024 AND rating >= 4.0.",
  schema: `CREATE TABLE departments (
  department_id INTEGER PRIMARY KEY,
  department_name VARCHAR
);

CREATE TABLE employees (
  employee_id INTEGER PRIMARY KEY,
  first_name VARCHAR,
  last_name VARCHAR,
  department_id INTEGER,
  hire_date DATE
);

CREATE TABLE salaries (
  employee_id INTEGER PRIMARY KEY,
  salary INTEGER
);

CREATE TABLE performance_reviews (
  employee_id INTEGER,
  review_year INTEGER,
  rating DECIMAL(2,1),
  PRIMARY KEY (employee_id, review_year)
);

INSERT INTO departments VALUES
  (1, 'Engineering'),
  (2, 'Marketing'),
  (3, 'Sales');

INSERT INTO employees VALUES
  (1, 'Alice', 'Martin', 1, '2020-01-15'),
  (2, 'Bob', 'Johnson', 1, '2019-06-01'),
  (3, 'Charlie', 'Lee', 2, '2021-03-10'),
  (4, 'Diana', 'Park', 2, '2018-09-20'),
  (5, 'Eve', 'Garcia', 3, '2022-01-05'),
  (6, 'Frank', 'Chen', 3, '2020-07-15'),
  (7, 'Grace', 'Kim', 1, '2023-02-01'),
  (8, 'Henry', 'Wilson', 2, '2019-11-10');

INSERT INTO salaries VALUES
  (1, 95000),
  (2, 110000),
  (3, 72000),
  (4, 88000),
  (5, 65000),
  (6, 78000),
  (7, 70000),
  (8, 92000);

INSERT INTO performance_reviews VALUES
  (1, 2024, 4.5),
  (2, 2024, 4.8),
  (3, 2024, 3.9),
  (4, 2024, 4.2),
  (5, 2024, 4.7),
  (6, 2024, 3.5),
  (7, 2024, 4.0),
  (8, 2024, 4.6);`,
  solutionQuery: `SELECT
  e.first_name || ' ' || e.last_name AS employee_name,
  d.department_name,
  s.salary,
  pr.rating
FROM employees e
JOIN departments d ON e.department_id = d.department_id
JOIN salaries s ON e.employee_id = s.employee_id
JOIN performance_reviews pr ON e.employee_id = pr.employee_id
WHERE pr.review_year = 2024 AND pr.rating >= 4.0
ORDER BY pr.rating DESC, s.salary DESC;`,
  solutionExplanation: `## Explanation

### Pattern: Multi-table JOIN with Filtering

This uses a **four-table join** to combine employee data from multiple normalized tables, then filters for a specific business criterion.

### Step-by-step
1. **FROM employees e**: Start from the employees table as the hub.
2. **JOIN departments d**: Resolve department_id to a readable name.
3. **JOIN salaries s**: Attach salary information.
4. **JOIN performance_reviews pr**: Attach performance ratings.
5. **WHERE pr.review_year = 2024 AND pr.rating >= 4.0**: Filter for top performers.
6. **ORDER BY pr.rating DESC, s.salary DESC**: Show highest-rated (then highest-paid) first.

### Why this approach?
In a normalized HR database, employee attributes are stored across multiple tables to avoid redundancy. JOINing them together reconstructs a "flat" view that's useful for reporting. The WHERE clause after the JOINs is clean and readable.

### When to use
- HR reports combining employee demographics, compensation, and performance
- Any report requiring data from 3+ related tables with business-rule filtering
- Award nominations, promotion pipelines, compensation reviews`,
  testCases: [
    {
      name: "default",
      description: "Returns 6 employees with rating >= 4.0 in 2024",
      expectedColumns: ["employee_name", "department_name", "salary", "rating"],
      expectedRows: [
        { employee_name: "Bob Johnson", department_name: "Engineering", salary: 110000, rating: 4.8 },
        { employee_name: "Eve Garcia", department_name: "Sales", salary: 65000, rating: 4.7 },
        { employee_name: "Henry Wilson", department_name: "Marketing", salary: 92000, rating: 4.6 },
        { employee_name: "Alice Martin", department_name: "Engineering", salary: 95000, rating: 4.5 },
        { employee_name: "Diana Park", department_name: "Marketing", salary: 88000, rating: 4.2 },
        { employee_name: "Grace Kim", department_name: "Engineering", salary: 70000, rating: 4.0 },
      ],
      orderMatters: true,
    },
    {
      name: "higher-threshold",
      description: "After raising the bar to 4.5, only 4 employees qualify",
      setupSql: `UPDATE performance_reviews SET rating = 3.8 WHERE employee_id IN (4, 7);`,
      expectedColumns: ["employee_name", "department_name", "salary", "rating"],
      expectedRows: [
        { employee_name: "Bob Johnson", department_name: "Engineering", salary: 110000, rating: 4.8 },
        { employee_name: "Eve Garcia", department_name: "Sales", salary: 65000, rating: 4.7 },
        { employee_name: "Henry Wilson", department_name: "Marketing", salary: 92000, rating: 4.6 },
        { employee_name: "Alice Martin", department_name: "Engineering", salary: 95000, rating: 4.5 },
      ],
      orderMatters: true,
    },
  ],
};
