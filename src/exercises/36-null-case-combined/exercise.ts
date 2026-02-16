import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "36-null-case-combined",
  title: "Customer Health Score Classification",
  difficulty: "easy",
  category: "null-handling",
  description: `## Customer Health Score Classification

The customer success team wants to classify every customer by engagement level so they can prioritize outreach. The rules are based on each customer's most recent order date relative to a reference date of **2024-04-01**:

- **Active**: last order within the last 30 days (on or after 2024-03-02)
- **At Risk**: last order 31 to 90 days ago (2024-01-01 through 2024-03-01 inclusive)
- **Churned**: last order more than 90 days ago (before 2024-01-01)
- **Never Ordered**: the customer has no orders at all (\`last_order_date\` is NULL)

### Schema

**customers**
| Column | Type |
|--------|------|
| customer_id | INTEGER |
| customer_name | VARCHAR |
| email | VARCHAR |
| signup_date | DATE |
| last_order_date | DATE |

### Task

Write a query that returns the \`customer_id\`, \`customer_name\`, \`last_order_date\`, and a new column called \`health_status\` that classifies each customer according to the rules above.

**Important**: Handle the NULL case first -- customers with a NULL \`last_order_date\` should be classified as \`'Never Ordered'\`.

### Expected output columns
\`customer_id\`, \`customer_name\`, \`last_order_date\`, \`health_status\`

Order by \`customer_id\` ASC.`,
  hint: "In a CASE expression, check for NULL first using WHEN last_order_date IS NULL THEN 'Never Ordered'. Then use date comparisons for the remaining tiers. Remember that CASE evaluates conditions top-to-bottom and stops at the first match.",
  schema: `CREATE TABLE customers (
  customer_id INTEGER,
  customer_name VARCHAR,
  email VARCHAR,
  signup_date DATE,
  last_order_date DATE
);

INSERT INTO customers VALUES
  (1, 'Alice Johnson', 'alice@example.com', '2023-01-15', '2024-03-28'),
  (2, 'Bob Smith', 'bob@example.com', '2023-03-20', '2024-03-05'),
  (3, 'Carol White', 'carol@example.com', '2023-06-10', NULL),
  (4, 'David Brown', 'david@example.com', '2022-11-01', '2024-02-14'),
  (5, 'Eva Martinez', 'eva@example.com', '2023-09-05', '2024-01-01'),
  (6, 'Frank Lee', 'frank@example.com', '2023-02-28', '2023-10-15'),
  (7, 'Grace Kim', 'grace@example.com', '2024-01-10', NULL),
  (8, 'Hank Davis', 'hank@example.com', '2022-07-22', '2023-06-30'),
  (9, 'Irene Clark', 'irene@example.com', '2023-08-14', '2024-03-31'),
  (10, 'Jack Wilson', 'jack@example.com', '2023-04-01', '2024-03-02'),
  (11, 'Karen Hall', 'karen@example.com', '2023-12-01', NULL),
  (12, 'Leo Turner', 'leo@example.com', '2022-05-15', '2023-12-31'),
  (13, 'Mia Scott', 'mia@example.com', '2023-07-20', '2024-02-28'),
  (14, 'Noah Adams', 'noah@example.com', '2023-11-11', '2024-03-15'),
  (15, 'Olivia Reed', 'olivia@example.com', '2024-03-01', NULL);`,
  solutionQuery: `SELECT
  customer_id,
  customer_name,
  last_order_date,
  CASE
    WHEN last_order_date IS NULL THEN 'Never Ordered'
    WHEN last_order_date >= DATE '2024-03-02' THEN 'Active'
    WHEN last_order_date >= DATE '2024-01-01' THEN 'At Risk'
    ELSE 'Churned'
  END AS health_status
FROM customers
ORDER BY customer_id;`,
  solutionExplanation: `## Explanation

### Pattern: NULL Handling Combined with CASE WHEN

This exercise combines **IS NULL** checking with **CASE WHEN** conditional logic -- a very common real-world pattern where missing data requires its own category.

### Step-by-step
1. **WHEN last_order_date IS NULL THEN 'Never Ordered'**: The NULL check comes first because any comparison (>=, <, etc.) with NULL returns NULL (not true or false), which would cause those rows to fall through to ELSE. By catching NULLs first, we handle them explicitly.
2. **WHEN last_order_date >= DATE '2024-03-02' THEN 'Active'**: Customers who ordered within the last 30 days from the reference date (2024-04-01). Since we already handled NULLs, we know last_order_date has a value here.
3. **WHEN last_order_date >= DATE '2024-01-01' THEN 'At Risk'**: Customers whose last order was 31-90 days ago. The lower bound is implied by the previous condition failing.
4. **ELSE 'Churned'**: Everyone else ordered more than 90 days ago.
5. **ORDER BY customer_id**: Deterministic output.

### Why this approach
This is the standard pattern for classification when NULLs are possible. The key insight is that NULL must be handled as a separate case before any value comparisons. If you wrote \`WHEN last_order_date < DATE '2024-01-01'\` without first checking for NULL, customers with no orders would incorrectly fall into ELSE rather than being properly categorized.

### When to use
- Customer segmentation: classifying engagement levels for marketing campaigns
- Lead scoring: categorizing prospects by recency of interaction
- SLA monitoring: flagging accounts that have not been contacted recently
- Any classification where missing data represents a meaningful category (not just "unknown")`,
  testCases: [
    {
      name: "default",
      description: "Classifies all customers into Active, At Risk, Churned, or Never Ordered",
      expectedColumns: ["customer_id", "customer_name", "last_order_date", "health_status"],
      expectedRows: [
        { customer_id: 1, customer_name: "Alice Johnson", last_order_date: "2024-03-28", health_status: "Active" },
        { customer_id: 2, customer_name: "Bob Smith", last_order_date: "2024-03-05", health_status: "Active" },
        { customer_id: 3, customer_name: "Carol White", last_order_date: null, health_status: "Never Ordered" },
        { customer_id: 4, customer_name: "David Brown", last_order_date: "2024-02-14", health_status: "At Risk" },
        { customer_id: 5, customer_name: "Eva Martinez", last_order_date: "2024-01-01", health_status: "At Risk" },
        { customer_id: 6, customer_name: "Frank Lee", last_order_date: "2023-10-15", health_status: "Churned" },
        { customer_id: 7, customer_name: "Grace Kim", last_order_date: null, health_status: "Never Ordered" },
        { customer_id: 8, customer_name: "Hank Davis", last_order_date: "2023-06-30", health_status: "Churned" },
        { customer_id: 9, customer_name: "Irene Clark", last_order_date: "2024-03-31", health_status: "Active" },
        { customer_id: 10, customer_name: "Jack Wilson", last_order_date: "2024-03-02", health_status: "Active" },
        { customer_id: 11, customer_name: "Karen Hall", last_order_date: null, health_status: "Never Ordered" },
        { customer_id: 12, customer_name: "Leo Turner", last_order_date: "2023-12-31", health_status: "Churned" },
        { customer_id: 13, customer_name: "Mia Scott", last_order_date: "2024-02-28", health_status: "At Risk" },
        { customer_id: 14, customer_name: "Noah Adams", last_order_date: "2024-03-15", health_status: "Active" },
        { customer_id: 15, customer_name: "Olivia Reed", last_order_date: null, health_status: "Never Ordered" },
      ],
      orderMatters: true,
    },
    {
      name: "all-never-ordered",
      description: "When all customers have NULL last_order_date, every customer is 'Never Ordered'",
      setupSql: `UPDATE customers SET last_order_date = NULL;`,
      expectedColumns: ["customer_id", "customer_name", "last_order_date", "health_status"],
      expectedRows: [
        { customer_id: 1, customer_name: "Alice Johnson", last_order_date: null, health_status: "Never Ordered" },
        { customer_id: 2, customer_name: "Bob Smith", last_order_date: null, health_status: "Never Ordered" },
        { customer_id: 3, customer_name: "Carol White", last_order_date: null, health_status: "Never Ordered" },
        { customer_id: 4, customer_name: "David Brown", last_order_date: null, health_status: "Never Ordered" },
        { customer_id: 5, customer_name: "Eva Martinez", last_order_date: null, health_status: "Never Ordered" },
        { customer_id: 6, customer_name: "Frank Lee", last_order_date: null, health_status: "Never Ordered" },
        { customer_id: 7, customer_name: "Grace Kim", last_order_date: null, health_status: "Never Ordered" },
        { customer_id: 8, customer_name: "Hank Davis", last_order_date: null, health_status: "Never Ordered" },
        { customer_id: 9, customer_name: "Irene Clark", last_order_date: null, health_status: "Never Ordered" },
        { customer_id: 10, customer_name: "Jack Wilson", last_order_date: null, health_status: "Never Ordered" },
        { customer_id: 11, customer_name: "Karen Hall", last_order_date: null, health_status: "Never Ordered" },
        { customer_id: 12, customer_name: "Leo Turner", last_order_date: null, health_status: "Never Ordered" },
        { customer_id: 13, customer_name: "Mia Scott", last_order_date: null, health_status: "Never Ordered" },
        { customer_id: 14, customer_name: "Noah Adams", last_order_date: null, health_status: "Never Ordered" },
        { customer_id: 15, customer_name: "Olivia Reed", last_order_date: null, health_status: "Never Ordered" },
      ],
      orderMatters: true,
    },
    {
      name: "boundary-active-at-risk",
      description: "Correctly classifies the boundary between Active (>= 2024-03-02) and At Risk (2024-03-01)",
      setupSql: `DELETE FROM customers WHERE customer_id > 2;
UPDATE customers SET last_order_date = '2024-03-02' WHERE customer_id = 1;
UPDATE customers SET last_order_date = '2024-03-01' WHERE customer_id = 2;`,
      expectedColumns: ["customer_id", "customer_name", "last_order_date", "health_status"],
      expectedRows: [
        { customer_id: 1, customer_name: "Alice Johnson", last_order_date: "2024-03-02", health_status: "Active" },
        { customer_id: 2, customer_name: "Bob Smith", last_order_date: "2024-03-01", health_status: "At Risk" },
      ],
      orderMatters: true,
    },
  ],
};
