import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "97-exists-vs-in-performance",
  title: "EXISTS vs IN for Subquery Filtering",
  titleFr: "EXISTS vs IN pour le filtrage par sous-requête",
  difficulty: "hard",
  category: "query-optimization",
  description: `## EXISTS vs IN for Subquery Filtering

The CRM team needs a list of **customers who have placed at least one order**. A junior analyst wrote this query using \`IN\`:

\`\`\`sql
SELECT customer_id, customer_name
FROM customers
WHERE customer_id IN (SELECT customer_id FROM orders);
\`\`\`

This works, but \`IN\` with a subquery materialises the full inner result set before comparing. When the orders table has millions of rows, this can exhaust memory.

Your task is to rewrite it using \`EXISTS\`, which short-circuits as soon as the first matching row is found.

### Schema

**customers** (15 rows)

| Column | Type | Notes |
|--------|------|-------|
| customer_id | INTEGER | Primary key |
| customer_name | VARCHAR | Full name |
| email | VARCHAR | |
| segment | VARCHAR | 'retail', 'wholesale', 'vip' |

**orders** (20 rows)

| Column | Type | Notes |
|--------|------|-------|
| order_id | INTEGER | Primary key |
| customer_id | INTEGER | FK to customers |
| order_date | DATE | |
| total_amount | DECIMAL | |
| status | VARCHAR | 'completed', 'pending', 'cancelled' |

### Task

Write the query using **EXISTS** that returns all customers who have placed **at least one order** (regardless of status). The result must be identical to the \`IN\` version.

Return: \`customer_id\`, \`customer_name\`

Order by \`customer_id\` ASC.`,

  descriptionFr: `## EXISTS vs IN pour le filtrage par sous-requête

L'équipe CRM a besoin d'une liste des **clients ayant passé au moins une commande**. Un analyste junior a écrit cette requête avec \`IN\` :

\`\`\`sql
SELECT customer_id, customer_name
FROM customers
WHERE customer_id IN (SELECT customer_id FROM orders);
\`\`\`

Cela fonctionne, mais \`IN\` avec une sous-requête matérialise l'intégralité du résultat interne avant de comparer. Quand la table orders contient des millions de lignes, cela peut épuiser la mémoire.

Votre tâche est de le réécrire en utilisant \`EXISTS\`, qui court-circuite dès que la première ligne correspondante est trouvée.

### Schéma

**customers** (15 lignes)

| Colonne | Type | Notes |
|---------|------|-------|
| customer_id | INTEGER | Clé primaire |
| customer_name | VARCHAR | Nom complet |
| email | VARCHAR | |
| segment | VARCHAR | 'retail', 'wholesale', 'vip' |

**orders** (20 lignes)

| Colonne | Type | Notes |
|---------|------|-------|
| order_id | INTEGER | Clé primaire |
| customer_id | INTEGER | FK vers customers |
| order_date | DATE | |
| total_amount | DECIMAL | |
| status | VARCHAR | 'completed', 'pending', 'cancelled' |

### Tâche

Écrire la requête avec **EXISTS** qui retourne tous les clients ayant passé **au moins une commande** (peu importe le statut). Le résultat doit être identique à la version \`IN\`.

Retourner : \`customer_id\`, \`customer_name\`

Trier par \`customer_id\` ASC.`,

  hint: "The EXISTS subquery is a correlated subquery: it references the outer query's row. Use: WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id). SELECT 1 is conventional — the subquery value is never used, only the existence of a row matters.",
  hintFr: "La sous-requête EXISTS est une sous-requête corrélée : elle référence la ligne de la requête externe. Utilisez : WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id). SELECT 1 est conventionnel — la valeur de la sous-requête n'est jamais utilisée, seule l'existence d'une ligne compte.",

  schema: `CREATE TABLE customers (
  customer_id   INTEGER,
  customer_name VARCHAR,
  email         VARCHAR,
  segment       VARCHAR
);

CREATE TABLE orders (
  order_id     INTEGER,
  customer_id  INTEGER,
  order_date   DATE,
  total_amount DECIMAL(10, 2),
  status       VARCHAR
);

INSERT INTO customers VALUES
  (1,  'Alice Martin',    'alice@example.com',    'vip'),
  (2,  'Bob Chen',        'bob@example.com',      'retail'),
  (3,  'Clara Dupont',    'clara@example.com',    'wholesale'),
  (4,  'David Kim',       'david@example.com',    'vip'),
  (5,  'Elena Rossi',     'elena@example.com',    'retail'),
  (6,  'Frank Osei',      'frank@example.com',    'wholesale'),
  (7,  'Grace Yilmaz',    'grace@example.com',    'vip'),
  (8,  'Hugo Ferreira',   'hugo@example.com',     'retail'),
  (9,  'Ingrid Nkosi',    'ingrid@example.com',   'wholesale'),
  (10, 'James Webb',      'james@example.com',    'retail'),
  (11, 'Karen Tanaka',    'karen@example.com',    'vip'),
  (12, 'Luis Santos',     'luis@example.com',     'retail'),
  (13, 'Maya Kowalski',   'maya@example.com',     'wholesale'),
  (14, 'Nour Hassan',     'nour@example.com',     'vip'),
  (15, 'Oscar Mensah',    'oscar@example.com',    'retail');

INSERT INTO orders VALUES
  (1,  1,  '2024-01-10', 350.00, 'completed'),
  (2,  2,  '2024-01-15', 89.99,  'completed'),
  (3,  3,  '2024-02-01', 420.50, 'pending'),
  (4,  4,  '2024-02-14', 215.00, 'completed'),
  (5,  5,  '2024-03-05', 59.00,  'cancelled'),
  (6,  6,  '2024-03-20', 510.00, 'completed'),
  (7,  7,  '2024-04-01', 175.00, 'completed'),
  (8,  8,  '2024-04-18', 640.00, 'completed'),
  (9,  9,  '2024-05-02', 30.00,  'completed'),
  (10, 10, '2024-05-20', 290.00, 'completed'),
  (11, 1,  '2024-06-10', 480.00, 'completed'),
  (12, 3,  '2024-06-25', 200.00, 'completed'),
  (13, 2,  '2024-07-04', 315.00, 'cancelled'),
  (14, 5,  '2024-07-19', 750.00, 'completed'),
  (15, 7,  '2024-08-08', 125.00, 'pending'),
  (16, 11, '2024-08-15', 99.00,  'completed'),
  (17, 12, '2024-09-01', 440.00, 'completed'),
  (18, 6,  '2024-09-14', 67.50,  'cancelled'),
  (19, 4,  '2024-10-02', 180.00, 'pending'),
  (20, 9,  '2024-10-22', 550.00, 'completed');`,

  solutionQuery: `SELECT
  c.customer_id,
  c.customer_name
FROM customers c
WHERE EXISTS (
  SELECT 1
  FROM orders o
  WHERE o.customer_id = c.customer_id
)
ORDER BY c.customer_id;`,

  solutionExplanation: `## Explanation

### Pattern: EXISTS for semi-join filtering

\`EXISTS\` performs a **semi-join**: for each row in the outer table, it checks whether at least one matching row exists in the inner table. It stops scanning as soon as the first match is found (short-circuit evaluation).

### Step-by-step

1. **Outer query** — iterate over each row in \`customers\`.
2. **Correlated subquery** — for each customer row, execute \`SELECT 1 FROM orders WHERE orders.customer_id = c.customer_id\`. The \`SELECT 1\` is a convention; the value is irrelevant — only the existence of a row matters.
3. **Short-circuit** — as soon as one order row matches, \`EXISTS\` returns \`TRUE\` and moves to the next customer. The engine never reads the rest of the matching orders.

### Why this approach vs IN

| Approach | Behaviour |
|----------|-----------|
| \`IN (subquery)\` | Materialises the entire inner result set into memory, then checks membership. |
| \`EXISTS\` | Evaluates row by row with short-circuit. Never materialises the inner set. |
| \`JOIN\` | May return duplicate customer rows if a customer has multiple orders (requires DISTINCT or GROUP BY). |

In modern query optimisers (including DuckDB), \`IN\` with a subquery and \`EXISTS\` are often rewritten to the same plan. However, being explicit with \`EXISTS\` communicates intent clearly: "I only care whether a match exists, not how many."

### When to use

Use \`EXISTS\` (or its inverse \`NOT EXISTS\`) whenever:
- You want to filter rows based on the presence or absence of related rows.
- The inner query could return a large result set (making \`IN\` memory-intensive).
- You want to avoid duplicates that a plain \`JOIN\` would introduce.

### DuckDB note

DuckDB's optimiser typically rewrites \`IN (subquery)\` to a hash semi-join, so in practice the performance difference is minimal. The choice between \`EXISTS\` and \`IN\` is primarily one of clarity and portability.`,

  solutionExplanationFr: `## Explication

### Patron : EXISTS pour le filtrage en semi-jointure

\`EXISTS\` effectue une **semi-jointure** : pour chaque ligne de la table externe, il vérifie si au moins une ligne correspondante existe dans la table interne. Il arrête le scan dès que la première correspondance est trouvée (évaluation court-circuit).

### Étape par étape

1. **Requête externe** — itérer sur chaque ligne de \`customers\`.
2. **Sous-requête corrélée** — pour chaque ligne client, exécuter \`SELECT 1 FROM orders WHERE orders.customer_id = c.customer_id\`. Le \`SELECT 1\` est une convention ; la valeur n'a pas d'importance — seule l'existence d'une ligne compte.
3. **Court-circuit** — dès qu'une ligne de commande correspond, \`EXISTS\` retourne \`TRUE\` et passe au client suivant. Le moteur ne lit jamais le reste des commandes correspondantes.

### Pourquoi cette approche vs IN

| Approche | Comportement |
|----------|-------------|
| \`IN (subquery)\` | Matérialise l'intégralité du résultat interne en mémoire, puis vérifie l'appartenance. |
| \`EXISTS\` | Évalue ligne par ligne avec court-circuit. Ne matérialise jamais l'ensemble interne. |
| \`JOIN\` | Peut retourner des lignes client en doublon si un client a plusieurs commandes (nécessite DISTINCT ou GROUP BY). |

Dans les optimiseurs modernes (dont DuckDB), \`IN\` avec une sous-requête et \`EXISTS\` sont souvent réécrits en même plan. Cependant, être explicite avec \`EXISTS\` communique clairement l'intention : "Je veux seulement savoir si une correspondance existe, pas combien."

### Quand l'utiliser

Utilisez \`EXISTS\` (ou son inverse \`NOT EXISTS\`) chaque fois que :
- Vous voulez filtrer des lignes selon la présence ou l'absence de lignes liées.
- La requête interne pourrait retourner un grand ensemble de résultats (rendant \`IN\` gourmand en mémoire).
- Vous voulez éviter les doublons qu'un \`JOIN\` simple introduirait.

### Note DuckDB

L'optimiseur DuckDB réécrit généralement \`IN (subquery)\` en hash semi-join, donc en pratique la différence de performance est minime. Le choix entre \`EXISTS\` et \`IN\` est principalement une question de clarté et de portabilité.`,

  testCases: [
    {
      name: "default",
      description: "12 customers who have placed at least one order, ordered by customer_id",
      descriptionFr: "12 clients ayant passé au moins une commande, triés par customer_id",
      expectedColumns: ["customer_id", "customer_name"],
      expectedRows: [
        { customer_id: 1,  customer_name: "Alice Martin"  },
        { customer_id: 2,  customer_name: "Bob Chen"      },
        { customer_id: 3,  customer_name: "Clara Dupont"  },
        { customer_id: 4,  customer_name: "David Kim"     },
        { customer_id: 5,  customer_name: "Elena Rossi"   },
        { customer_id: 6,  customer_name: "Frank Osei"    },
        { customer_id: 7,  customer_name: "Grace Yilmaz"  },
        { customer_id: 8,  customer_name: "Hugo Ferreira" },
        { customer_id: 9,  customer_name: "Ingrid Nkosi"  },
        { customer_id: 10, customer_name: "James Webb"    },
        { customer_id: 11, customer_name: "Karen Tanaka"  },
        { customer_id: 12, customer_name: "Luis Santos"   },
      ],
      orderMatters: true,
    },
    {
      name: "new-customer-with-order",
      description: "A new customer with one order appears in results; customers 13-15 still have no orders",
      descriptionFr: "Un nouveau client avec une commande apparaît dans les résultats ; les clients 13-15 n'ont toujours pas de commandes",
      setupSql: `INSERT INTO orders VALUES (21, 13, '2024-11-01', 88.00, 'completed');`,
      expectedColumns: ["customer_id", "customer_name"],
      expectedRows: [
        { customer_id: 1,  customer_name: "Alice Martin"  },
        { customer_id: 2,  customer_name: "Bob Chen"      },
        { customer_id: 3,  customer_name: "Clara Dupont"  },
        { customer_id: 4,  customer_name: "David Kim"     },
        { customer_id: 5,  customer_name: "Elena Rossi"   },
        { customer_id: 6,  customer_name: "Frank Osei"    },
        { customer_id: 7,  customer_name: "Grace Yilmaz"  },
        { customer_id: 8,  customer_name: "Hugo Ferreira" },
        { customer_id: 9,  customer_name: "Ingrid Nkosi"  },
        { customer_id: 10, customer_name: "James Webb"    },
        { customer_id: 11, customer_name: "Karen Tanaka"  },
        { customer_id: 12, customer_name: "Luis Santos"   },
        { customer_id: 13, customer_name: "Maya Kowalski" },
      ],
      orderMatters: true,
    },
  ],
};
