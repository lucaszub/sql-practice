import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "34-case-when-basics",
  title: "Classify Orders by Shipping Tier",
  difficulty: "easy",
  category: "null-handling",
  description: `## Classify Orders by Shipping Tier

The logistics team needs to assign shipping tiers to orders so they can route packages to the correct fulfillment line. The rules are:

- **Small**: order total under $50
- **Medium**: order total from $50 to $200 (inclusive)
- **Large**: order total over $200

### Schema

**orders**
| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_name | VARCHAR |
| order_total | DECIMAL(10,2) |
| order_date | DATE |

### Task

Write a query that returns the \`order_id\`, \`customer_name\`, \`order_total\`, and a new column called \`shipping_tier\` that classifies each order as \`'Small'\`, \`'Medium'\`, or \`'Large'\` based on the rules above.

### Expected output columns
\`order_id\`, \`customer_name\`, \`order_total\`, \`shipping_tier\`

Order by \`order_id\` ASC.`,
  hint: "Use a CASE WHEN expression to evaluate conditions in order. CASE WHEN order_total < 50 THEN 'Small' WHEN ... THEN ... ELSE ... END. The conditions are checked top to bottom, so order matters.",
  schema: `CREATE TABLE orders (
  order_id INTEGER,
  customer_name VARCHAR,
  order_total DECIMAL(10,2),
  order_date DATE
);

INSERT INTO orders VALUES
  (1, 'Alice Johnson', 25.00, '2024-03-01'),
  (2, 'Bob Smith', 150.00, '2024-03-02'),
  (3, 'Carol White', 49.99, '2024-03-03'),
  (4, 'David Brown', 50.00, '2024-03-04'),
  (5, 'Eva Martinez', 320.00, '2024-03-05'),
  (6, 'Frank Lee', 12.50, '2024-03-06'),
  (7, 'Grace Kim', 200.00, '2024-03-07'),
  (8, 'Hank Davis', 200.01, '2024-03-08'),
  (9, 'Irene Clark', 75.00, '2024-03-09'),
  (10, 'Jack Wilson', 500.00, '2024-03-10'),
  (11, 'Karen Hall', 1.99, '2024-03-11'),
  (12, 'Leo Turner', 99.99, '2024-03-12'),
  (13, 'Mia Scott', 185.50, '2024-03-13'),
  (14, 'Noah Adams', 350.75, '2024-03-14'),
  (15, 'Olivia Reed', 50.01, '2024-03-15');`,
  solutionQuery: `SELECT
  order_id,
  customer_name,
  order_total,
  CASE
    WHEN order_total < 50 THEN 'Small'
    WHEN order_total <= 200 THEN 'Medium'
    ELSE 'Large'
  END AS shipping_tier
FROM orders
ORDER BY order_id;`,
  solutionExplanation: `## Explanation

### Pattern: CASE WHEN for Conditional Classification

This exercise uses the **CASE WHEN** expression to categorize rows into discrete buckets based on a numeric value.

### Step-by-step
1. **CASE WHEN order_total < 50 THEN 'Small'**: The first condition catches all orders under $50.
2. **WHEN order_total <= 200 THEN 'Medium'**: Since CASE evaluates conditions top-to-bottom, this only runs for rows where the first condition was false (i.e., order_total >= 50). Combined with the upper bound of 200, this captures the $50-$200 range.
3. **ELSE 'Large'**: Everything not caught by the previous conditions (i.e., over $200) falls into the Large tier.
4. **ORDER BY order_id**: Ensures deterministic output.

### Why this approach
CASE WHEN is SQL's equivalent of if/else-if/else logic. It is evaluated in order, so you only need to specify the upper boundary of each range (the lower boundary is implied by the previous condition failing). This makes the expression concise and less error-prone than writing overlapping range conditions.

### When to use
- Classifying numeric values into labeled buckets (shipping tiers, risk levels, performance grades)
- Creating derived columns for reporting without changing the underlying data
- Building segments for GROUP BY analysis (e.g., count orders per tier)
- Any time business logic requires conditional labels in query output`,
  testCases: [
    {
      name: "default",
      description: "Classifies all orders into Small, Medium, or Large shipping tiers",
      expectedColumns: ["order_id", "customer_name", "order_total", "shipping_tier"],
      expectedRows: [
        { order_id: 1, customer_name: "Alice Johnson", order_total: 25.00, shipping_tier: "Small" },
        { order_id: 2, customer_name: "Bob Smith", order_total: 150.00, shipping_tier: "Medium" },
        { order_id: 3, customer_name: "Carol White", order_total: 49.99, shipping_tier: "Small" },
        { order_id: 4, customer_name: "David Brown", order_total: 50.00, shipping_tier: "Medium" },
        { order_id: 5, customer_name: "Eva Martinez", order_total: 320.00, shipping_tier: "Large" },
        { order_id: 6, customer_name: "Frank Lee", order_total: 12.50, shipping_tier: "Small" },
        { order_id: 7, customer_name: "Grace Kim", order_total: 200.00, shipping_tier: "Medium" },
        { order_id: 8, customer_name: "Hank Davis", order_total: 200.01, shipping_tier: "Large" },
        { order_id: 9, customer_name: "Irene Clark", order_total: 75.00, shipping_tier: "Medium" },
        { order_id: 10, customer_name: "Jack Wilson", order_total: 500.00, shipping_tier: "Large" },
        { order_id: 11, customer_name: "Karen Hall", order_total: 1.99, shipping_tier: "Small" },
        { order_id: 12, customer_name: "Leo Turner", order_total: 99.99, shipping_tier: "Medium" },
        { order_id: 13, customer_name: "Mia Scott", order_total: 185.50, shipping_tier: "Medium" },
        { order_id: 14, customer_name: "Noah Adams", order_total: 350.75, shipping_tier: "Large" },
        { order_id: 15, customer_name: "Olivia Reed", order_total: 50.01, shipping_tier: "Medium" },
      ],
      orderMatters: true,
    },
    {
      name: "boundary-values",
      description: "Correctly classifies exact boundary values: $49.99 is Small, $50.00 is Medium, $200.00 is Medium, $200.01 is Large",
      setupSql: `DELETE FROM orders WHERE order_id NOT IN (3, 4, 7, 8);`,
      expectedColumns: ["order_id", "customer_name", "order_total", "shipping_tier"],
      expectedRows: [
        { order_id: 3, customer_name: "Carol White", order_total: 49.99, shipping_tier: "Small" },
        { order_id: 4, customer_name: "David Brown", order_total: 50.00, shipping_tier: "Medium" },
        { order_id: 7, customer_name: "Grace Kim", order_total: 200.00, shipping_tier: "Medium" },
        { order_id: 8, customer_name: "Hank Davis", order_total: 200.01, shipping_tier: "Large" },
      ],
      orderMatters: true,
    },
  ],
};
