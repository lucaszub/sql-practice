import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "25-inner-join-basics",
  title: "Shipping Labels with Customer Names",
  titleFr: "Etiquettes d'expedition avec noms des clients",
  difficulty: "easy",
  category: "basic-joins",
  description: `## Shipping Labels with Customer Names

The fulfillment team needs a list of all orders with the customer name attached, to print shipping labels.

Write a query that returns every order alongside the customer's full name. Only include orders that have a matching customer record.

### Schema

**customers**
| Column | Type |
|--------|------|
| customer_id | INTEGER |
| first_name | VARCHAR |
| last_name | VARCHAR |
| email | VARCHAR |

**orders**
| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| order_date | DATE |
| total_amount | DECIMAL(10,2) |
| shipping_address | VARCHAR |

### Expected output columns
\`order_id\`, \`first_name\`, \`last_name\`, \`order_date\`, \`total_amount\`, \`shipping_address\`

Order by \`order_id\` ASC.`,
  descriptionFr: `## Etiquettes d'expedition avec noms des clients

L'equipe logistique a besoin d'une liste de toutes les commandes avec le nom du client associe, afin d'imprimer les etiquettes d'expedition.

Ecrivez une requete qui retourne chaque commande accompagnee du nom complet du client. N'incluez que les commandes ayant un enregistrement client correspondant.

### Schema

**customers**
| Column | Type |
|--------|------|
| customer_id | INTEGER |
| first_name | VARCHAR |
| last_name | VARCHAR |
| email | VARCHAR |

**orders**
| Column | Type |
|--------|------|
| order_id | INTEGER |
| customer_id | INTEGER |
| order_date | DATE |
| total_amount | DECIMAL(10,2) |
| shipping_address | VARCHAR |

### Colonnes attendues en sortie
\`order_id\`, \`first_name\`, \`last_name\`, \`order_date\`, \`total_amount\`, \`shipping_address\`

Triez par \`order_id\` ASC.`,
  hint: "Use INNER JOIN to combine the orders table with the customers table on the customer_id column. INNER JOIN only returns rows where a match exists in both tables.",
  schema: `CREATE TABLE customers (
  customer_id INTEGER,
  first_name VARCHAR,
  last_name VARCHAR,
  email VARCHAR
);

CREATE TABLE orders (
  order_id INTEGER,
  customer_id INTEGER,
  order_date DATE,
  total_amount DECIMAL(10,2),
  shipping_address VARCHAR
);

INSERT INTO customers VALUES
  (1, 'Alice', 'Martin', 'alice@example.com'),
  (2, 'Bob', 'Johnson', 'bob@example.com'),
  (3, 'Charlie', 'Lee', 'charlie@example.com'),
  (4, 'Diana', 'Park', 'diana@example.com'),
  (5, 'Eve', 'Garcia', 'eve@example.com'),
  (6, 'Frank', 'Chen', 'frank@example.com');

INSERT INTO orders VALUES
  (101, 1, '2024-03-01', 59.99, '123 Oak St'),
  (102, 2, '2024-03-02', 124.50, '456 Pine Ave'),
  (103, 1, '2024-03-05', 34.00, '123 Oak St'),
  (104, 3, '2024-03-07', 210.00, '789 Maple Dr'),
  (105, 5, '2024-03-10', 15.75, '321 Elm Blvd'),
  (106, 2, '2024-03-12', 89.99, '456 Pine Ave'),
  (107, 4, '2024-03-15', 45.00, '654 Cedar Ln'),
  (108, 1, '2024-03-18', 175.25, '123 Oak St'),
  (109, 3, '2024-03-20', 62.50, '789 Maple Dr'),
  (110, 99, '2024-03-22', 30.00, '999 Ghost Rd');`,
  solutionQuery: `SELECT
  o.order_id,
  c.first_name,
  c.last_name,
  o.order_date,
  o.total_amount,
  o.shipping_address
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
ORDER BY o.order_id;`,
  solutionExplanation: `## Explanation

### Pattern: Basic INNER JOIN

This uses the **two-table join** pattern to combine related data from two tables.

### Step-by-step
1. **FROM orders o**: Start from the orders table (aliased as \`o\` for brevity).
2. **INNER JOIN customers c ON o.customer_id = c.customer_id**: Match each order to its customer using the shared \`customer_id\` column.
3. **SELECT columns from both tables**: Pull \`order_id\`, \`order_date\`, \`total_amount\`, and \`shipping_address\` from orders, and \`first_name\` and \`last_name\` from customers.
4. **ORDER BY o.order_id**: Sort results for consistent output.

### Why INNER JOIN?
INNER JOIN only returns rows where a match exists in **both** tables. Order 110 (customer_id = 99) has no matching customer, so it is excluded from the result. This is exactly what the fulfillment team needs -- they cannot print a label without a customer name.

### When to use
- Combining data from two related tables where you only want matched records
- Attaching descriptive information (names, labels) to transactional data (orders, events)
- Any time both sides of the relationship must exist for the result to be meaningful`,
  testCases: [
    {
      name: "default",
      description: "Returns all orders with matching customer names, excluding orphaned orders",
      expectedColumns: ["order_id", "first_name", "last_name", "order_date", "total_amount", "shipping_address"],
      expectedRows: [
        { order_id: 101, first_name: "Alice", last_name: "Martin", order_date: "2024-03-01", total_amount: 59.99, shipping_address: "123 Oak St" },
        { order_id: 102, first_name: "Bob", last_name: "Johnson", order_date: "2024-03-02", total_amount: 124.50, shipping_address: "456 Pine Ave" },
        { order_id: 103, first_name: "Alice", last_name: "Martin", order_date: "2024-03-05", total_amount: 34.00, shipping_address: "123 Oak St" },
        { order_id: 104, first_name: "Charlie", last_name: "Lee", order_date: "2024-03-07", total_amount: 210.00, shipping_address: "789 Maple Dr" },
        { order_id: 105, first_name: "Eve", last_name: "Garcia", order_date: "2024-03-10", total_amount: 15.75, shipping_address: "321 Elm Blvd" },
        { order_id: 106, first_name: "Bob", last_name: "Johnson", order_date: "2024-03-12", total_amount: 89.99, shipping_address: "456 Pine Ave" },
        { order_id: 107, first_name: "Diana", last_name: "Park", order_date: "2024-03-15", total_amount: 45.00, shipping_address: "654 Cedar Ln" },
        { order_id: 108, first_name: "Alice", last_name: "Martin", order_date: "2024-03-18", total_amount: 175.25, shipping_address: "123 Oak St" },
        { order_id: 109, first_name: "Charlie", last_name: "Lee", order_date: "2024-03-20", total_amount: 62.50, shipping_address: "789 Maple Dr" },
      ],
      orderMatters: true,
    },
    {
      name: "no-orphaned-orders",
      description: "After removing the orphaned order, all orders appear in the result",
      setupSql: `DELETE FROM orders WHERE order_id = 110;`,
      expectedColumns: ["order_id", "first_name", "last_name", "order_date", "total_amount", "shipping_address"],
      expectedRows: [
        { order_id: 101, first_name: "Alice", last_name: "Martin", order_date: "2024-03-01", total_amount: 59.99, shipping_address: "123 Oak St" },
        { order_id: 102, first_name: "Bob", last_name: "Johnson", order_date: "2024-03-02", total_amount: 124.50, shipping_address: "456 Pine Ave" },
        { order_id: 103, first_name: "Alice", last_name: "Martin", order_date: "2024-03-05", total_amount: 34.00, shipping_address: "123 Oak St" },
        { order_id: 104, first_name: "Charlie", last_name: "Lee", order_date: "2024-03-07", total_amount: 210.00, shipping_address: "789 Maple Dr" },
        { order_id: 105, first_name: "Eve", last_name: "Garcia", order_date: "2024-03-10", total_amount: 15.75, shipping_address: "321 Elm Blvd" },
        { order_id: 106, first_name: "Bob", last_name: "Johnson", order_date: "2024-03-12", total_amount: 89.99, shipping_address: "456 Pine Ave" },
        { order_id: 107, first_name: "Diana", last_name: "Park", order_date: "2024-03-15", total_amount: 45.00, shipping_address: "654 Cedar Ln" },
        { order_id: 108, first_name: "Alice", last_name: "Martin", order_date: "2024-03-18", total_amount: 175.25, shipping_address: "123 Oak St" },
        { order_id: 109, first_name: "Charlie", last_name: "Lee", order_date: "2024-03-20", total_amount: 62.50, shipping_address: "789 Maple Dr" },
      ],
      orderMatters: true,
    },
  ],
};
