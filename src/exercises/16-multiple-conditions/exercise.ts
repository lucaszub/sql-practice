import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "16-multiple-conditions",
  title: "At-Risk Premium Customers",
  difficulty: "easy",
  category: "select-fundamentals",
  description: `## At-Risk Premium Customers

The retention team wants to identify **premium customers who may be at risk of churning**. A customer is considered "at risk" if they meet **all** of the following criteria:

1. Their \`total_spent\` is greater than **$500** (premium customers)
2. Their \`last_order_date\` is **before '2024-04-01'** (inactive for over 90 days, assuming today is 2024-07-01)
3. Their \`status\` is **not** \`'churned'\` (they have not already left)

### Schema

**customers**
| Column | Type |
|--------|------|
| customer_id | INTEGER |
| customer_name | VARCHAR |
| email | VARCHAR |
| total_spent | DECIMAL(10,2) |
| last_order_date | DATE |
| status | VARCHAR |

### Task

Write a query that returns at-risk premium customers matching all three criteria above.

### Expected output columns
\`customer_id\`, \`customer_name\`, \`email\`, \`total_spent\`, \`last_order_date\`

Order by \`total_spent\` DESC.`,
  hint: "Use AND to combine multiple conditions in a single WHERE clause. Use the NOT or != operator to exclude churned customers. Remember: all three conditions must be true simultaneously.",
  schema: `CREATE TABLE customers (
  customer_id INTEGER,
  customer_name VARCHAR,
  email VARCHAR,
  total_spent DECIMAL(10,2),
  last_order_date DATE,
  status VARCHAR
);

INSERT INTO customers VALUES
  (1, 'Alice Johnson', 'alice@example.com', 1250.00, '2024-02-15', 'active'),
  (2, 'Bob Smith', 'bob@example.com', 320.00, '2024-01-20', 'active'),
  (3, 'Carol White', 'carol@example.com', 890.50, '2024-03-10', 'active'),
  (4, 'David Brown', 'david@example.com', 2100.00, '2024-06-01', 'active'),
  (5, 'Eva Martinez', 'eva@example.com', 750.00, '2024-01-05', 'churned'),
  (6, 'Frank Lee', 'frank@example.com', 540.25, '2024-03-28', 'active'),
  (7, 'Grace Kim', 'grace@example.com', 1800.00, '2024-02-22', 'active'),
  (8, 'Hank Davis', 'hank@example.com', 150.00, '2023-12-01', 'inactive'),
  (9, 'Irene Clark', 'irene@example.com', 620.00, '2024-05-15', 'active'),
  (10, 'Jack Wilson', 'jack@example.com', 3500.00, '2024-01-30', 'active'),
  (11, 'Karen Hall', 'karen@example.com', 980.00, '2024-03-31', 'active'),
  (12, 'Leo Turner', 'leo@example.com', 505.00, '2024-02-14', 'inactive'),
  (13, 'Mia Scott', 'mia@example.com', 1100.00, '2024-06-20', 'active'),
  (14, 'Noah Adams', 'noah@example.com', 670.00, '2024-03-15', 'churned'),
  (15, 'Olivia Reed', 'olivia@example.com', 499.99, '2024-01-10', 'active');`,
  solutionQuery: `SELECT customer_id, customer_name, email, total_spent, last_order_date
FROM customers
WHERE total_spent > 500
  AND last_order_date < '2024-04-01'
  AND status != 'churned'
ORDER BY total_spent DESC;`,
  solutionExplanation: `## Explanation

### Multiple WHERE Conditions Pattern
This exercise demonstrates combining **AND**, comparison operators, and **inequality (!=)** in a single WHERE clause to express complex business logic.

### Step-by-step
1. **total_spent > 500**: Identifies premium customers by spending threshold. This filters out low-value customers who are less critical for the retention team.
2. **last_order_date < '2024-04-01'**: Finds customers whose last order was more than 90 days ago. Date comparisons work naturally with the \`<\` operator because dates have a natural ordering.
3. **status != 'churned'**: Excludes customers who have already been marked as churned. The team only wants to reach customers they might still retain. You could also write \`status <> 'churned'\` or \`NOT status = 'churned'\`.
4. **AND**: All three conditions must be true simultaneously. If any one is false, the row is excluded.

### Key concepts
- **AND** requires all conditions to be true (logical conjunction)
- **OR** requires at least one condition to be true (logical disjunction)
- **NOT** or **!=** / **<>** negates a condition
- Operator precedence: NOT binds tightest, then AND, then OR. Use parentheses to make intent clear when mixing AND and OR.

### Why this approach
Combining multiple conditions in a single WHERE clause is straightforward and readable. Each condition maps directly to a business rule, making the query self-documenting.

### When to use
- Customer segmentation based on multiple attributes
- Building targeted lists for marketing, retention, or outreach campaigns
- Data quality checks where multiple criteria must be satisfied`,
  testCases: [
    {
      name: "default",
      description: "Returns at-risk premium customers matching all three criteria",
      expectedColumns: ["customer_id", "customer_name", "email", "total_spent", "last_order_date"],
      expectedRows: [
        { customer_id: 10, customer_name: "Jack Wilson", email: "jack@example.com", total_spent: 3500.00, last_order_date: "2024-01-30" },
        { customer_id: 7, customer_name: "Grace Kim", email: "grace@example.com", total_spent: 1800.00, last_order_date: "2024-02-22" },
        { customer_id: 1, customer_name: "Alice Johnson", email: "alice@example.com", total_spent: 1250.00, last_order_date: "2024-02-15" },
        { customer_id: 11, customer_name: "Karen Hall", email: "karen@example.com", total_spent: 980.00, last_order_date: "2024-03-31" },
        { customer_id: 3, customer_name: "Carol White", email: "carol@example.com", total_spent: 890.50, last_order_date: "2024-03-10" },
        { customer_id: 6, customer_name: "Frank Lee", email: "frank@example.com", total_spent: 540.25, last_order_date: "2024-03-28" },
        { customer_id: 12, customer_name: "Leo Turner", email: "leo@example.com", total_spent: 505.00, last_order_date: "2024-02-14" },
      ],
      orderMatters: true,
    },
    {
      name: "churned-excluded",
      description: "Verifies churned customers are excluded even if they meet spending and date criteria",
      setupSql: `UPDATE customers SET status = 'churned' WHERE customer_id IN (10, 7, 1, 11, 3, 6, 12);`,
      expectedColumns: ["customer_id", "customer_name", "email", "total_spent", "last_order_date"],
      expectedRows: [],
      orderMatters: false,
    },
  ],
};
