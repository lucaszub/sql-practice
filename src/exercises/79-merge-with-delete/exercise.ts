import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "79-merge-with-delete",
  title: "Full Sync: Identify Records to Soft-Delete",
  titleFr: "Synchronisation complète : identifier les enregistrements à supprimer",
  difficulty: "hard",
  category: "merge-upsert",
  description: `## Full Sync: Identify Records to Soft-Delete

The CRM team performs a **full sync** of the customer dimension every Sunday. The source system sends the complete current list of active customers. Any customer that was in the target table but is **absent from the source** has been deactivated and should be soft-deleted (flagged with \`is_active = false\`).

Your task has two parts:
1. Upsert all source customers into the target (insert new, update changed).
2. Write a query that returns the customers who need to be soft-deleted — i.e., customers in \`target_customers\` with \`is_active = true\` that do **not** appear in \`source_customers\`.

For this exercise, focus on **part 2**: write the SELECT that identifies which customer IDs need soft-deletion.

### Schema

**target_customers** (current dimension — 12 customers, all active)
| Column | Type |
|--------|------|
| customer_id | INTEGER (PRIMARY KEY) |
| email | VARCHAR (UNIQUE) |
| full_name | VARCHAR |
| country | VARCHAR |
| is_active | BOOLEAN |

**source_customers** (Sunday full extract — 9 customers: target is smaller, 3 removed)
| Column | Type |
|--------|------|
| email | VARCHAR |
| full_name | VARCHAR |
| country | VARCHAR |

### Task

Write a query that identifies **which customer_ids** in \`target_customers\` (where \`is_active = true\`) do **not** have a matching \`email\` in \`source_customers\`. These are the records that should be soft-deleted.

Return \`customer_id\`, \`email\`, \`full_name\` ordered by \`customer_id\` ASC.

### Expected output columns
\`customer_id\`, \`email\`, \`full_name\``,
  descriptionFr: `## Synchronisation complète : identifier les enregistrements à supprimer

L'équipe CRM effectue une **synchronisation complète** de la dimension client chaque dimanche. Le système source envoie la liste complète des clients actifs du moment. Tout client présent dans la table cible mais **absent de la source** a été désactivé et doit être marqué comme supprimé (flagué avec \`is_active = false\`).

Votre tâche se déroule en deux parties :
1. Upsert de tous les clients source dans la cible (insertion des nouveaux, mise à jour des modifiés).
2. Écrire une requête qui retourne les clients à supprimer — c'est-à-dire les clients dans \`target_customers\` avec \`is_active = true\` qui **n'apparaissent pas** dans \`source_customers\`.

Pour cet exercice, concentrez-vous sur la **partie 2** : écrire le SELECT qui identifie quels customer_ids nécessitent une suppression logique.

### Schéma

**target_customers** (dimension courante — 12 clients, tous actifs)
| Colonne | Type |
|---------|------|
| customer_id | INTEGER (PRIMARY KEY) |
| email | VARCHAR (UNIQUE) |
| full_name | VARCHAR |
| country | VARCHAR |
| is_active | BOOLEAN |

**source_customers** (extraction complète du dimanche — 9 clients : la cible est plus grande, 3 supprimés)
| Colonne | Type |
|---------|------|
| email | VARCHAR |
| full_name | VARCHAR |
| country | VARCHAR |

### Tâche

Écrivez une requête qui identifie **quels customer_ids** dans \`target_customers\` (où \`is_active = true\`) n'ont **pas** d'\`email\` correspondant dans \`source_customers\`. Ce sont les enregistrements qui doivent être supprimés logiquement.

Retournez \`customer_id\`, \`email\`, \`full_name\` triés par \`customer_id\` ASC.

### Colonnes attendues en sortie
\`customer_id\`, \`email\`, \`full_name\``,
  hint: "Use a LEFT JOIN from target_customers to source_customers on email, then filter WHERE source_customers.email IS NULL AND target_customers.is_active = true. This is the anti-join pattern applied to a full-sync scenario.",
  hintFr: "Utilisez un LEFT JOIN de target_customers vers source_customers sur email, puis filtrez WHERE source_customers.email IS NULL AND target_customers.is_active = true. C'est le patron d'anti-jointure appliqué à un scénario de synchronisation complète.",
  schema: `CREATE TABLE target_customers (
  customer_id INTEGER PRIMARY KEY,
  email VARCHAR UNIQUE,
  full_name VARCHAR,
  country VARCHAR,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE source_customers (
  email VARCHAR,
  full_name VARCHAR,
  country VARCHAR
);

INSERT INTO target_customers VALUES
  (1,  'alice@example.com',   'Alice Martin',    'FR', true),
  (2,  'bob@example.com',     'Bob Dupont',       'FR', true),
  (3,  'carol@example.com',   'Carol Smith',      'GB', true),
  (4,  'david@example.com',   'David Brown',      'GB', true),
  (5,  'emma@example.com',    'Emma Wilson',      'DE', true),
  (6,  'frank@example.com',   'Frank Miller',     'DE', true),
  (7,  'grace@example.com',   'Grace Lee',        'US', true),
  (8,  'henry@example.com',   'Henry Taylor',     'US', true),
  (9,  'iris@example.com',    'Iris Chen',        'JP', true),
  (10, 'james@example.com',   'James Wang',       'JP', true),
  (11, 'kate@example.com',    'Kate Johnson',     'CA', true),
  (12, 'liam@example.com',    'Liam Anderson',    'CA', true);

INSERT INTO source_customers VALUES
  ('alice@example.com',   'Alice Martin',    'FR'),
  ('bob@example.com',     'Bob Dupont',       'FR'),
  ('carol@example.com',   'Carol Smith',      'GB'),
  ('emma@example.com',    'Emma Wilson',      'DE'),
  ('frank@example.com',   'Frank Miller',     'DE'),
  ('grace@example.com',   'Grace Lee',        'US'),
  ('iris@example.com',    'Iris Chen',        'JP'),
  ('james@example.com',   'James Wang',       'JP'),
  ('kate@example.com',    'Kate Johnson',     'CA');`,
  solutionQuery: `SELECT
  t.customer_id,
  t.email,
  t.full_name
FROM target_customers t
LEFT JOIN source_customers s ON t.email = s.email
WHERE s.email IS NULL
  AND t.is_active = true
ORDER BY t.customer_id;`,
  solutionExplanation: `## Explanation

### Pattern: Anti-join for Full Sync Delete Detection

In a full sync pattern, the source is authoritative: anything present in the target but absent from the source should be treated as deleted. This is one half of the full sync operation — the other half being the upsert of new and changed records.

### Step-by-step
1. \`FROM target_customers t LEFT JOIN source_customers s ON t.email = s.email\` — keeps all target rows, joining to the source on the natural key (email).
2. \`WHERE s.email IS NULL\` — retains only the rows where no match was found in the source (the "anti-join" condition). These customers exist in the target but not in the source.
3. \`AND t.is_active = true\` — limits to currently active records. Already-inactive customers don't need to be re-flagged.
4. The result (IDs 4, 8, 12) represents the three customers who were removed from the source extract.

### Why
An explicit LEFT JOIN anti-join is the most readable and performant approach for this pattern in DuckDB. The alternative (\`NOT EXISTS\` or \`NOT IN\`) achieves the same result but is more verbose.

### When to use
- Full replacement syncs where the source sends the complete current state
- Identifying orphaned records after a parent table is updated
- Building the "delete" leg of a full ETL sync (upsert new/changed + flag removed)`,
  solutionExplanationFr: `## Explication

### Patron : Anti-jointure pour la détection des suppressions en synchronisation complète

Dans un patron de synchronisation complète, la source fait autorité : tout ce qui est présent dans la cible mais absent de la source doit être traité comme supprimé. C'est une moitié de l'opération de synchronisation complète — l'autre moitié étant l'upsert des enregistrements nouveaux et modifiés.

### Étape par étape
1. \`FROM target_customers t LEFT JOIN source_customers s ON t.email = s.email\` — conserve toutes les lignes cibles, en les joignant à la source sur la clé naturelle (email).
2. \`WHERE s.email IS NULL\` — ne conserve que les lignes sans correspondance dans la source (la condition "anti-jointure"). Ces clients existent dans la cible mais pas dans la source.
3. \`AND t.is_active = true\` — limite aux enregistrements actuellement actifs. Les clients déjà inactifs n'ont pas besoin d'être re-flagués.
4. Le résultat (IDs 4, 8, 12) représente les trois clients qui ont été retirés de l'extraction source.

### Pourquoi
Un LEFT JOIN anti-jointure explicite est l'approche la plus lisible et performante pour ce patron dans DuckDB. L'alternative (\`NOT EXISTS\` ou \`NOT IN\`) donne le même résultat mais est plus verbeuse.

### Quand l'utiliser
- Synchronisations de remplacement complet où la source envoie l'état actuel complet
- Identification des enregistrements orphelins après la mise à jour d'une table parent
- Construction de la phase "suppression" d'une synchronisation ETL complète (upsert nouveau/modifié + marquage des supprimés)`,
  testCases: [
    {
      name: "default",
      description: "3 customers to soft-delete: IDs 4 (david), 8 (henry), 12 (liam) — absent from source",
      descriptionFr: "3 clients à supprimer logiquement : IDs 4 (david), 8 (henry), 12 (liam) — absents de la source",
      expectedColumns: ["customer_id", "email", "full_name"],
      expectedRows: [
        { customer_id: 4,  email: "david@example.com", full_name: "David Brown"    },
        { customer_id: 8,  email: "henry@example.com", full_name: "Henry Taylor"   },
        { customer_id: 12, email: "liam@example.com",  full_name: "Liam Anderson"  },
      ],
      orderMatters: true,
    },
    {
      name: "source-matches-all",
      description: "When source contains all target emails, no records need soft-deletion",
      descriptionFr: "Quand la source contient tous les emails de la cible, aucun enregistrement ne nécessite de suppression logique",
      setupSql: `INSERT INTO source_customers VALUES
  ('david@example.com', 'David Brown',   'GB'),
  ('henry@example.com', 'Henry Taylor',  'US'),
  ('liam@example.com',  'Liam Anderson', 'CA');`,
      expectedColumns: ["customer_id", "email", "full_name"],
      expectedRows: [],
      orderMatters: false,
    },
  ],
};
