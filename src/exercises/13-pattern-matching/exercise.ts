import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "13-pattern-matching",
  title: "Gmail Customers for Migration Notice",
  difficulty: "easy",
  category: "select-fundamentals",
  description: `## Gmail Customers for Migration Notice

Customer support is sending a platform migration notice to all customers whose email address ends with **@gmail.com**. They need the customer ID, full name, and email for each matching customer.

### Schema

**customers**
| Column | Type |
|--------|------|
| customer_id | INTEGER |
| first_name | VARCHAR |
| last_name | VARCHAR |
| email | VARCHAR |
| city | VARCHAR |
| signup_date | DATE |

### Task

Write a query that returns all customers whose \`email\` ends with \`@gmail.com\`.

### Expected output columns
\`customer_id\`, \`first_name\`, \`last_name\`, \`email\`

Order by \`customer_id\` ASC.`,
  hint: "Use the LIKE operator with a wildcard pattern. The '%' wildcard matches any sequence of characters. Think about which end of the email you need to match.",
  schema: `CREATE TABLE customers (
  customer_id INTEGER,
  first_name VARCHAR,
  last_name VARCHAR,
  email VARCHAR,
  city VARCHAR,
  signup_date DATE
);

INSERT INTO customers VALUES
  (1, 'Alice', 'Johnson', 'alice.johnson@gmail.com', 'New York', '2023-03-15'),
  (2, 'Bob', 'Smith', 'bob.smith@yahoo.com', 'Los Angeles', '2023-04-20'),
  (3, 'Carol', 'White', 'carol@gmail.com', 'Chicago', '2023-05-10'),
  (4, 'David', 'Brown', 'david.brown@outlook.com', 'Houston', '2023-06-01'),
  (5, 'Eva', 'Martinez', 'eva.m@company.com', 'Phoenix', '2023-06-15'),
  (6, 'Frank', 'Lee', 'frank.lee@gmail.com', 'Philadelphia', '2023-07-22'),
  (7, 'Grace', 'Kim', 'grace.kim@hotmail.com', 'San Antonio', '2023-08-05'),
  (8, 'Hank', 'Davis', 'hank@gmail.com', 'San Diego', '2023-08-18'),
  (9, 'Irene', 'Clark', 'irene.clark@protonmail.com', 'Dallas', '2023-09-01'),
  (10, 'Jack', 'Wilson', 'jack.w@gmail.com', 'San Jose', '2023-09-14'),
  (11, 'Karen', 'Hall', 'karen.hall@yahoo.com', 'Austin', '2023-10-02'),
  (12, 'Leo', 'Turner', 'leo.t@gmail.com', 'Jacksonville', '2023-10-20'),
  (13, 'Mia', 'Scott', 'mia.scott@work.com', 'Fort Worth', '2023-11-08'),
  (14, 'Noah', 'Adams', 'noah.adams@gmail.com', 'Columbus', '2023-11-25'),
  (15, 'Olivia', 'Reed', 'olivia@notgmail.company.com', 'Charlotte', '2023-12-10');`,
  solutionQuery: `SELECT customer_id, first_name, last_name, email
FROM customers
WHERE email LIKE '%@gmail.com'
ORDER BY customer_id;`,
  solutionExplanation: `## Explanation

### Pattern Matching with LIKE
This exercise uses the **LIKE** operator for string pattern matching, one of the most common filtering techniques in SQL.

### Step-by-step
1. **LIKE '%@gmail.com'**: The \`%\` wildcard matches zero or more characters before \`@gmail.com\`. This ensures only emails that end with exactly \`@gmail.com\` are matched.
2. Note that customer 15 (olivia@notgmail.company.com) is correctly excluded because her email does not end with \`@gmail.com\` -- it merely contains "gmail" in a different position.

### LIKE wildcards
- \`%\` matches any sequence of characters (including empty)
- \`_\` matches exactly one character
- Patterns are case-insensitive in DuckDB by default

### Why this approach
LIKE is the standard SQL way to perform pattern matching. For this use case (suffix matching), \`LIKE '%@gmail.com'\` is the most readable and idiomatic approach.

### Alternatives
- \`WHERE email ILIKE '%@gmail.com'\` -- explicitly case-insensitive (DuckDB supports ILIKE)
- \`WHERE email LIKE '%@gmail.com' OR email LIKE '%@Gmail.com'\` -- manual case handling (unnecessary in DuckDB)
- \`WHERE LOWER(email) LIKE '%@gmail.com'\` -- explicit lowercasing for portability

### When to use
- Searching for records by partial string matches (email domains, name prefixes, product codes)
- Filtering log entries, user agents, or any text field by known patterns
- Building search features in applications`,
  testCases: [
    {
      name: "default",
      description: "Returns all customers with @gmail.com emails",
      expectedColumns: ["customer_id", "first_name", "last_name", "email"],
      expectedRows: [
        { customer_id: 1, first_name: "Alice", last_name: "Johnson", email: "alice.johnson@gmail.com" },
        { customer_id: 3, first_name: "Carol", last_name: "White", email: "carol@gmail.com" },
        { customer_id: 6, first_name: "Frank", last_name: "Lee", email: "frank.lee@gmail.com" },
        { customer_id: 8, first_name: "Hank", last_name: "Davis", email: "hank@gmail.com" },
        { customer_id: 10, first_name: "Jack", last_name: "Wilson", email: "jack.w@gmail.com" },
        { customer_id: 12, first_name: "Leo", last_name: "Turner", email: "leo.t@gmail.com" },
        { customer_id: 14, first_name: "Noah", last_name: "Adams", email: "noah.adams@gmail.com" },
      ],
      orderMatters: true,
    },
    {
      name: "no-matches",
      description: "Returns empty result when no gmail customers exist",
      setupSql: `DELETE FROM customers WHERE email LIKE '%@gmail.com';`,
      expectedColumns: ["customer_id", "first_name", "last_name", "email"],
      expectedRows: [],
      orderMatters: false,
    },
  ],
};
