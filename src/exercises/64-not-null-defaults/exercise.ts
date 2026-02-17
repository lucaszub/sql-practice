import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "64-not-null-defaults",
  title: "NOT NULL and DEFAULT Values in User Accounts",
  titleFr: "NOT NULL et valeurs DEFAULT dans les comptes utilisateurs",
  difficulty: "easy",
  category: "data-types-constraints",
  description: `## NOT NULL and DEFAULT Values in User Accounts

The platform team is launching a new user registration flow. They want the \`user_accounts\` table to enforce that \`email\` is always provided (**NOT NULL**), while \`status\` and \`created_at\` should never require the caller to supply a value — they should default to \`'active'\` and \`CURRENT_DATE\` respectively. This reduces bugs in the registration API and ensures new accounts are always in a known state.

### Schema

**user_accounts**
| Column | Type | Constraint |
|--------|------|-----------|
| user_id | INTEGER | PRIMARY KEY |
| email | VARCHAR | NOT NULL |
| username | VARCHAR | |
| status | VARCHAR | DEFAULT 'active' |
| plan | VARCHAR | DEFAULT 'free' |
| created_at | DATE | DEFAULT CURRENT_DATE |

### Task

Query \`user_accounts\` to show all accounts, selecting \`user_id\`, \`email\`, \`username\`, \`status\`, \`plan\`, and \`created_at\`. Order by \`user_id\` ASC.

**Note**: In this exercise the data is pre-loaded with explicit values to make the test deterministic — the important concept is the schema design that prevents NULL emails and ensures sensible defaults.

### Expected output columns
\`user_id\`, \`email\`, \`username\`, \`status\`, \`plan\`, \`created_at\`

Order by \`user_id\` ASC.`,
  descriptionFr: `## NOT NULL et valeurs DEFAULT dans les comptes utilisateurs

L'équipe plateforme lance un nouveau flux d'inscription. Elle veut que la table \`user_accounts\` impose que \`email\` soit toujours fourni (**NOT NULL**), tandis que \`status\` et \`created_at\` ne doivent jamais nécessiter une valeur explicite — ils doivent respectivement prendre \`'active'\` et \`CURRENT_DATE\` par défaut. Cela réduit les bugs dans l'API d'inscription et garantit que les nouveaux comptes sont toujours dans un état connu.

### Schéma

**user_accounts**
| Colonne | Type | Contrainte |
|---------|------|-----------|
| user_id | INTEGER | PRIMARY KEY |
| email | VARCHAR | NOT NULL |
| username | VARCHAR | |
| status | VARCHAR | DEFAULT 'active' |
| plan | VARCHAR | DEFAULT 'free' |
| created_at | DATE | DEFAULT CURRENT_DATE |

### Tâche

Interroger \`user_accounts\` pour afficher tous les comptes, en sélectionnant \`user_id\`, \`email\`, \`username\`, \`status\`, \`plan\` et \`created_at\`. Trier par \`user_id\` ASC.

### Colonnes attendues en sortie
\`user_id\`, \`email\`, \`username\`, \`status\`, \`plan\`, \`created_at\`

Trié par \`user_id\` ASC.`,
  hint: "This exercise is about schema design: NOT NULL ensures email is always present, DEFAULT fills status/plan/created_at automatically. The query itself is a straightforward SELECT * with ORDER BY.",
  hintFr: "Cet exercice porte sur la conception de schéma : NOT NULL garantit que l'email est toujours présent, DEFAULT remplit status/plan/created_at automatiquement. La requête est un simple SELECT avec ORDER BY.",
  schema: `CREATE TABLE user_accounts (
  user_id    INTEGER PRIMARY KEY,
  email      VARCHAR NOT NULL,
  username   VARCHAR,
  status     VARCHAR DEFAULT 'active',
  plan       VARCHAR DEFAULT 'free',
  created_at DATE DEFAULT CURRENT_DATE
);

INSERT INTO user_accounts VALUES
  (1,  'alice@example.com',    'alice_m',    'active',    'pro',      '2024-01-10'),
  (2,  'bob@example.com',      'bob_n',      'active',    'free',     '2024-01-15'),
  (3,  'clara@example.com',    NULL,         'active',    'free',     '2024-02-01'),
  (4,  'david@example.com',    'david_o',    'suspended', 'free',     '2024-02-14'),
  (5,  'eva@example.com',      'eva_k',      'active',    'pro',      '2024-03-03'),
  (6,  'frank@example.com',    'frank_d',    'active',    'free',     '2024-03-22'),
  (7,  'grace@example.com',    'grace_l',    'active',    'enterprise','2024-04-05'),
  (8,  'hiro@example.com',     NULL,         'inactive',  'free',     '2024-04-18'),
  (9,  'ingrid@example.com',   'ingrid_b',   'active',    'free',     '2024-05-07'),
  (10, 'jorge@example.com',    'jorge_p',    'active',    'pro',      '2024-05-20'),
  (11, 'kemi@example.com',     'kemi_a',     'active',    'free',     '2024-06-01'),
  (12, 'lena@example.com',     'lena_f',     'suspended', 'pro',      '2024-06-15'),
  (13, 'marco@example.com',    'marco_r',    'active',    'free',     '2024-07-03'),
  (14, 'nina@example.com',     'nina_p',     'active',    'enterprise','2024-07-21'),
  (15, 'omar@example.com',     'omar_h',     'inactive',  'free',     '2024-08-09'),
  (16, 'petra@example.com',    NULL,         'active',    'free',     '2024-08-20'),
  (17, 'quinn@example.com',    'quinn_r',    'active',    'pro',      '2024-09-01'),
  (18, 'rosa@example.com',     'rosa_s',     'active',    'free',     '2024-09-14'),
  (19, 'sam@example.com',      'sam_t',      'suspended', 'enterprise','2024-10-02'),
  (20, 'tina@example.com',     'tina_u',     'active',    'free',     '2024-10-18');`,
  solutionQuery: `SELECT
  user_id,
  email,
  username,
  status,
  plan,
  created_at
FROM user_accounts
ORDER BY user_id ASC;`,
  solutionExplanation: `## Explanation

### Pattern: NOT NULL + DEFAULT for defensive schema design

**NOT NULL** and **DEFAULT** are complementary constraints that eliminate entire classes of bugs at the schema level rather than the application level.

### Step-by-step
1. \`email VARCHAR NOT NULL\`: The database engine will reject any INSERT that tries to store a NULL email. The registration API cannot accidentally omit it.
2. \`status VARCHAR DEFAULT 'active'\`: When a new row is inserted without specifying \`status\`, the database automatically supplies \`'active'\`. The application doesn't need to remember to set it.
3. \`plan VARCHAR DEFAULT 'free'\`: Same pattern — new users start on the free tier by default.
4. \`created_at DATE DEFAULT CURRENT_DATE\`: The registration date is set automatically to the current date by the database engine, avoiding clock drift between app servers.
5. **NULL usernames**: Note that \`username\` has no NOT NULL — some users register with just an email. Rows 3, 8, and 16 demonstrate this valid scenario.

### Why
Defaults reduce the surface area of bugs: a new engineer writing a registration endpoint doesn't need to know every default value. NOT NULL prevents silent data loss where missing emails could cause broken password-reset flows.

### When to use
- Any column with a sensible "starting" value: \`status = 'pending'\`, \`role = 'viewer'\`, \`is_verified = FALSE\`.
- Audit columns: \`created_at\`, \`updated_at\` with timestamp defaults.
- Combine with CHECK constraints for maximum data integrity.`,
  solutionExplanationFr: `## Explication

### Modèle : NOT NULL + DEFAULT pour une conception de schéma défensive

**NOT NULL** et **DEFAULT** sont des contraintes complémentaires qui éliminent des classes entières de bugs au niveau du schéma.

### Étape par étape
1. \`email VARCHAR NOT NULL\` : Rejette tout INSERT qui tente de stocker un email NULL.
2. \`status VARCHAR DEFAULT 'active'\` : Quand une nouvelle ligne est insérée sans \`status\`, la base de données fournit automatiquement \`'active'\`.
3. \`plan VARCHAR DEFAULT 'free'\` : Même modèle — les nouveaux utilisateurs commencent sur le tier gratuit.
4. \`created_at DATE DEFAULT CURRENT_DATE\` : La date d'inscription est définie automatiquement par le moteur de base de données.
5. **username NULL** : Les lignes 3, 8 et 16 montrent que certains utilisateurs s'inscrivent sans nom d'utilisateur — c'est un scénario valide.

### Pourquoi
Les valeurs par défaut réduisent la surface des bugs. NOT NULL évite la perte silencieuse de données.

### Quand l'utiliser
- Tout colonne avec une valeur de départ sensée : \`status = 'pending'\`, \`role = 'viewer'\`.
- Colonnes d'audit : \`created_at\`, \`updated_at\` avec des valeurs par défaut timestamp.`,
  testCases: [
    {
      name: "default",
      description: "Returns all 20 user accounts ordered by user_id ASC, including rows with NULL username",
      descriptionFr: "Retourne les 20 comptes utilisateurs triés par user_id ASC, y compris les lignes avec username NULL",
      expectedColumns: ["user_id", "email", "username", "status", "plan", "created_at"],
      expectedRows: [
        { user_id: 1,  email: "alice@example.com",  username: "alice_m",  status: "active",    plan: "pro",        created_at: "2024-01-10" },
        { user_id: 2,  email: "bob@example.com",    username: "bob_n",    status: "active",    plan: "free",       created_at: "2024-01-15" },
        { user_id: 3,  email: "clara@example.com",  username: null,       status: "active",    plan: "free",       created_at: "2024-02-01" },
        { user_id: 4,  email: "david@example.com",  username: "david_o",  status: "suspended", plan: "free",       created_at: "2024-02-14" },
        { user_id: 5,  email: "eva@example.com",    username: "eva_k",    status: "active",    plan: "pro",        created_at: "2024-03-03" },
        { user_id: 6,  email: "frank@example.com",  username: "frank_d",  status: "active",    plan: "free",       created_at: "2024-03-22" },
        { user_id: 7,  email: "grace@example.com",  username: "grace_l",  status: "active",    plan: "enterprise", created_at: "2024-04-05" },
        { user_id: 8,  email: "hiro@example.com",   username: null,       status: "inactive",  plan: "free",       created_at: "2024-04-18" },
        { user_id: 9,  email: "ingrid@example.com", username: "ingrid_b", status: "active",    plan: "free",       created_at: "2024-05-07" },
        { user_id: 10, email: "jorge@example.com",  username: "jorge_p",  status: "active",    plan: "pro",        created_at: "2024-05-20" },
        { user_id: 11, email: "kemi@example.com",   username: "kemi_a",   status: "active",    plan: "free",       created_at: "2024-06-01" },
        { user_id: 12, email: "lena@example.com",   username: "lena_f",   status: "suspended", plan: "pro",        created_at: "2024-06-15" },
        { user_id: 13, email: "marco@example.com",  username: "marco_r",  status: "active",    plan: "free",       created_at: "2024-07-03" },
        { user_id: 14, email: "nina@example.com",   username: "nina_p",   status: "active",    plan: "enterprise", created_at: "2024-07-21" },
        { user_id: 15, email: "omar@example.com",   username: "omar_h",   status: "inactive",  plan: "free",       created_at: "2024-08-09" },
        { user_id: 16, email: "petra@example.com",  username: null,       status: "active",    plan: "free",       created_at: "2024-08-20" },
        { user_id: 17, email: "quinn@example.com",  username: "quinn_r",  status: "active",    plan: "pro",        created_at: "2024-09-01" },
        { user_id: 18, email: "rosa@example.com",   username: "rosa_s",   status: "active",    plan: "free",       created_at: "2024-09-14" },
        { user_id: 19, email: "sam@example.com",    username: "sam_t",    status: "suspended", plan: "enterprise", created_at: "2024-10-02" },
        { user_id: 20, email: "tina@example.com",   username: "tina_u",   status: "active",    plan: "free",       created_at: "2024-10-18" },
      ],
      orderMatters: true,
    },
    {
      name: "active-only",
      description: "With suspended and inactive users deleted, returns 14 active users ordered by user_id",
      descriptionFr: "Après suppression des utilisateurs suspendus et inactifs, retourne 14 utilisateurs actifs triés par user_id",
      setupSql: `DELETE FROM user_accounts WHERE status != 'active';`,
      expectedColumns: ["user_id", "email", "username", "status", "plan", "created_at"],
      expectedRows: [
        { user_id: 1,  email: "alice@example.com",  username: "alice_m",  status: "active", plan: "pro",        created_at: "2024-01-10" },
        { user_id: 2,  email: "bob@example.com",    username: "bob_n",    status: "active", plan: "free",       created_at: "2024-01-15" },
        { user_id: 3,  email: "clara@example.com",  username: null,       status: "active", plan: "free",       created_at: "2024-02-01" },
        { user_id: 5,  email: "eva@example.com",    username: "eva_k",    status: "active", plan: "pro",        created_at: "2024-03-03" },
        { user_id: 6,  email: "frank@example.com",  username: "frank_d",  status: "active", plan: "free",       created_at: "2024-03-22" },
        { user_id: 7,  email: "grace@example.com",  username: "grace_l",  status: "active", plan: "enterprise", created_at: "2024-04-05" },
        { user_id: 9,  email: "ingrid@example.com", username: "ingrid_b", status: "active", plan: "free",       created_at: "2024-05-07" },
        { user_id: 10, email: "jorge@example.com",  username: "jorge_p",  status: "active", plan: "pro",        created_at: "2024-05-20" },
        { user_id: 11, email: "kemi@example.com",   username: "kemi_a",   status: "active", plan: "free",       created_at: "2024-06-01" },
        { user_id: 13, email: "marco@example.com",  username: "marco_r",  status: "active", plan: "free",       created_at: "2024-07-03" },
        { user_id: 14, email: "nina@example.com",   username: "nina_p",   status: "active", plan: "enterprise", created_at: "2024-07-21" },
        { user_id: 16, email: "petra@example.com",  username: null,       status: "active", plan: "free",       created_at: "2024-08-20" },
        { user_id: 17, email: "quinn@example.com",  username: "quinn_r",  status: "active", plan: "pro",        created_at: "2024-09-01" },
        { user_id: 18, email: "rosa@example.com",   username: "rosa_s",   status: "active", plan: "free",       created_at: "2024-09-14" },
        { user_id: 20, email: "tina@example.com",   username: "tina_u",   status: "active", plan: "free",       created_at: "2024-10-18" },
      ],
      orderMatters: true,
    },
  ],
};
