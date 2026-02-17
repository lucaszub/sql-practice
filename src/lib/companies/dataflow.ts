import type { CompanyProfile } from "./types";

const schema = `
CREATE TABLE plans (
  plan_id INTEGER PRIMARY KEY,
  plan_name VARCHAR NOT NULL,
  monthly_price DECIMAL(10,2) NOT NULL,
  annual_price DECIMAL(10,2) NOT NULL,
  max_users INTEGER NOT NULL,
  features VARCHAR NOT NULL
);

CREATE TABLE users (
  user_id INTEGER PRIMARY KEY,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  company VARCHAR NOT NULL,
  role VARCHAR NOT NULL,
  signup_date DATE NOT NULL,
  signup_channel VARCHAR
);

CREATE TABLE subscriptions (
  subscription_id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id),
  plan_id INTEGER NOT NULL REFERENCES plans(plan_id),
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR NOT NULL,
  monthly_amount DECIMAL(10,2) NOT NULL
);

CREATE TABLE invoices (
  invoice_id INTEGER PRIMARY KEY,
  subscription_id INTEGER NOT NULL REFERENCES subscriptions(subscription_id),
  invoice_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_status VARCHAR NOT NULL
);

CREATE TABLE events (
  event_id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id),
  event_type VARCHAR NOT NULL,
  event_timestamp TIMESTAMP NOT NULL,
  metadata VARCHAR
);

CREATE TABLE tickets (
  ticket_id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id),
  created_date DATE NOT NULL,
  priority VARCHAR NOT NULL,
  status VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  resolved_date DATE
);

-- Plans (3 rows)
INSERT INTO plans VALUES
  (1, 'Starter', 29.00, 290.00, 5, 'CRM basics, email integration, 1GB storage'),
  (2, 'Pro', 79.00, 790.00, 20, 'Advanced CRM, automation, analytics, 10GB storage'),
  (3, 'Enterprise', 199.00, 1990.00, 100, 'Unlimited CRM, API access, SSO, dedicated support, 100GB storage');

-- Users (25 rows)
INSERT INTO users VALUES
  (1,  'Alice',     'Martin',    'alice@techcorp.com',      'TechCorp',       'admin', '2023-01-10', 'google'),
  (2,  'Bob',       'Dupont',    'bob@salesforce.fr',       'SalesFR',        'user',  '2023-01-22', 'linkedin'),
  (3,  'Clara',     'Leroy',     'clara@innovate.io',       'InnovateTech',   'admin', '2023-02-05', 'google'),
  (4,  'David',     'Moreau',    'david@bigretail.com',     'BigRetail',      'user',  '2023-02-18', 'referral'),
  (5,  'Emma',      'Simon',     'emma@mediaco.fr',         'MediaCo',        'admin', '2023-03-01', 'linkedin'),
  (6,  'Florian',   'Laurent',   'florian@buildfast.io',    'BuildFast',      'user',  '2023-03-15', NULL),
  (7,  'Gabrielle', 'Michel',    'gab@logistiqa.com',       'LogistiqA',      'admin', '2023-04-02', 'google'),
  (8,  'Hugo',      'Garcia',    'hugo@greenleaf.fr',       'GreenLeaf',      'user',  '2023-04-20', 'referral'),
  (9,  'Ines',      'Thomas',    'ines@datapulse.io',       'DataPulse',      'admin', '2023-05-10', 'linkedin'),
  (10, 'Jules',     'Robert',    'jules@finedge.com',       'FinEdge',        'user',  '2023-05-28', 'google'),
  (11, 'Karine',    'Petit',     'karine@urbancraft.fr',    'UrbanCraft',     'admin', '2023-06-12', NULL),
  (12, 'Lucas',     'Durand',    'lucas@proserve.com',      'ProServe',       'user',  '2023-06-30', 'referral'),
  (13, 'Marie',     'Lefevre',   'marie@cloudnine.io',      'CloudNine',      'admin', '2023-07-15', 'google'),
  (14, 'Nathan',    'Roux',      'nathan@swiftlogic.fr',    'SwiftLogic',     'user',  '2023-08-01', 'linkedin'),
  (15, 'Olivia',    'Fontaine',  'olivia@brandwave.com',    'BrandWave',      'admin', '2023-08-20', NULL),
  (16, 'Pierre',    'Chevalier', 'pierre@alphacode.io',     'AlphaCode',      'user',  '2023-09-05', 'google'),
  (17, 'Quentin',   'Blanc',     'quentin@nextmove.fr',     'NextMove',       'admin', '2023-09-22', 'referral'),
  (18, 'Rose',      'Guerin',    'rose@vivadata.com',       'VivaData',       'user',  '2023-10-10', 'linkedin'),
  (19, 'Samuel',    'Perrin',    'samuel@ecotrack.io',      'EcoTrack',       'admin', '2023-10-28', 'google'),
  (20, 'Thea',      'Clement',   'thea@sparkline.fr',       'SparkLine',      'user',  '2023-11-15', NULL),
  (21, 'Ugo',       'Faure',     'ugo@bytecraft.com',       'ByteCraft',      'admin', '2023-12-01', 'referral'),
  (22, 'Valentine', 'Andre',     'val@pixelshift.io',       'PixelShift',     'user',  '2023-12-18', 'google'),
  (23, 'William',   'Mercier',   'william@orbitdata.fr',    'OrbitData',      'admin', '2024-01-08', 'linkedin'),
  (24, 'Xena',      'Dubois',    'xena@frontrow.com',       'FrontRow',       'user',  '2024-01-25', NULL),
  (25, 'Yann',      'Girard',    'yann@bluestack.io',       'BlueStack',      'admin', '2024-02-10', 'google');

-- Subscriptions (30 rows)
-- Statuses: active, churned, trial, paused
-- Some users have multiple subscriptions (upgraded or re-subscribed after churn)
INSERT INTO subscriptions VALUES
  (1,  1,  2, '2023-01-15', NULL,          'active',  79.00),
  (2,  2,  1, '2023-01-25', '2023-07-25',  'churned', 29.00),
  (3,  3,  3, '2023-02-10', NULL,          'active',  199.00),
  (4,  4,  1, '2023-02-20', '2023-08-20',  'churned', 29.00),
  (5,  5,  2, '2023-03-05', NULL,          'active',  79.00),
  (6,  6,  1, '2023-03-18', '2023-06-18',  'churned', 29.00),
  (7,  7,  3, '2023-04-05', NULL,          'active',  199.00),
  (8,  8,  1, '2023-04-22', NULL,          'active',  29.00),
  (9,  9,  2, '2023-05-12', NULL,          'active',  79.00),
  (10, 10, 1, '2023-06-01', '2023-12-01',  'churned', 29.00),
  (11, 11, 2, '2023-06-15', NULL,          'active',  79.00),
  (12, 12, 1, '2023-07-02', '2024-01-02',  'churned', 29.00),
  (13, 13, 3, '2023-07-18', NULL,          'active',  199.00),
  (14, 14, 1, '2023-08-05', NULL,          'active',  29.00),
  (15, 15, 2, '2023-08-22', '2024-02-22',  'churned', 79.00),
  (16, 16, 1, '2023-09-08', NULL,          'active',  29.00),
  (17, 17, 2, '2023-09-25', NULL,          'active',  79.00),
  (18, 18, 1, '2023-10-12', NULL,          'active',  29.00),
  (19, 19, 3, '2023-10-30', NULL,          'active',  199.00),
  (20, 20, 1, '2023-11-18', NULL,          'paused',  29.00),
  (21, 21, 2, '2023-12-05', NULL,          'active',  79.00),
  (22, 22, 1, '2023-12-20', NULL,          'active',  29.00),
  (23, 23, 2, '2024-01-10', NULL,          'active',  79.00),
  (24, 24, 1, '2024-01-28', NULL,          'trial',   0.00),
  (25, 25, 2, '2024-02-12', NULL,          'trial',   0.00),
  (26, 2,  2, '2023-08-01', NULL,          'active',  79.00),
  (27, 4,  2, '2023-09-01', '2024-01-01',  'churned', 79.00),
  (28, 6,  1, '2023-07-01', NULL,          'active',  29.00),
  (29, 10, 2, '2024-01-05', NULL,          'active',  79.00),
  (30, 12, 1, '2024-02-01', NULL,          'trial',   0.00);

-- Invoices (25 rows)
INSERT INTO invoices VALUES
  (1,  1,  '2024-01-15', 79.00,  'paid'),
  (2,  3,  '2024-01-10', 199.00, 'paid'),
  (3,  5,  '2024-01-05', 79.00,  'paid'),
  (4,  7,  '2024-01-05', 199.00, 'paid'),
  (5,  8,  '2024-01-22', 29.00,  'paid'),
  (6,  9,  '2024-01-12', 79.00,  'paid'),
  (7,  11, '2024-01-15', 79.00,  'paid'),
  (8,  13, '2024-01-18', 199.00, 'paid'),
  (9,  14, '2024-01-05', 29.00,  'paid'),
  (10, 17, '2024-01-25', 79.00,  'paid'),
  (11, 18, '2024-01-12', 29.00,  'paid'),
  (12, 19, '2024-01-30', 199.00, 'paid'),
  (13, 21, '2024-01-05', 79.00,  'paid'),
  (14, 22, '2024-01-20', 29.00,  'paid'),
  (15, 23, '2024-01-10', 79.00,  'paid'),
  (16, 26, '2024-01-01', 79.00,  'paid'),
  (17, 28, '2024-01-01', 29.00,  'paid'),
  (18, 29, '2024-01-05', 79.00,  'paid'),
  (19, 16, '2024-01-08', 29.00,  'paid'),
  (20, 1,  '2024-02-15', 79.00,  'paid'),
  (21, 3,  '2024-02-10', 199.00, 'paid'),
  (22, 9,  '2024-02-12', 79.00,  'paid'),
  (23, 13, '2024-02-18', 199.00, 'overdue'),
  (24, 19, '2024-02-28', 199.00, 'paid'),
  (25, 7,  '2024-02-05', 199.00, 'paid');

-- Events (50 rows)
-- Event types: login, deal_created, report_exported, contact_added
INSERT INTO events VALUES
  (1,  1,  'login',           '2024-01-02 09:00:00', NULL),
  (2,  1,  'deal_created',    '2024-01-02 09:15:00', 'deal_value:5000'),
  (3,  2,  'login',           '2024-01-02 10:00:00', NULL),
  (4,  3,  'login',           '2024-01-03 08:30:00', NULL),
  (5,  3,  'report_exported', '2024-01-03 08:45:00', 'format:csv'),
  (6,  5,  'login',           '2024-01-03 09:00:00', NULL),
  (7,  5,  'deal_created',    '2024-01-03 09:30:00', 'deal_value:12000'),
  (8,  7,  'login',           '2024-01-04 08:00:00', NULL),
  (9,  7,  'contact_added',   '2024-01-04 08:20:00', NULL),
  (10, 9,  'login',           '2024-01-04 10:00:00', NULL),
  (11, 1,  'login',           '2024-01-05 09:00:00', NULL),
  (12, 1,  'deal_created',    '2024-01-05 09:30:00', 'deal_value:8000'),
  (13, 2,  'login',           '2024-01-05 10:00:00', NULL),
  (14, 2,  'contact_added',   '2024-01-05 10:15:00', NULL),
  (15, 3,  'login',           '2024-01-06 08:30:00', NULL),
  (16, 3,  'deal_created',    '2024-01-06 09:00:00', 'deal_value:25000'),
  (17, 5,  'login',           '2024-01-07 09:00:00', NULL),
  (18, 7,  'login',           '2024-01-07 08:00:00', NULL),
  (19, 7,  'report_exported', '2024-01-07 08:30:00', 'format:pdf'),
  (20, 9,  'login',           '2024-01-08 10:00:00', NULL),
  (21, 9,  'deal_created',    '2024-01-08 10:30:00', 'deal_value:15000'),
  (22, 11, 'login',           '2024-01-08 11:00:00', NULL),
  (23, 13, 'login',           '2024-01-09 09:00:00', NULL),
  (24, 13, 'deal_created',    '2024-01-09 09:30:00', 'deal_value:30000'),
  (25, 14, 'login',           '2024-01-10 10:00:00', NULL),
  (26, 16, 'login',           '2024-01-10 11:00:00', NULL),
  (27, 17, 'login',           '2024-01-11 09:00:00', NULL),
  (28, 17, 'contact_added',   '2024-01-11 09:15:00', NULL),
  (29, 19, 'login',           '2024-01-12 08:00:00', NULL),
  (30, 19, 'deal_created',    '2024-01-12 08:30:00', 'deal_value:20000'),
  (31, 21, 'login',           '2024-01-13 09:00:00', NULL),
  (32, 21, 'report_exported', '2024-01-13 09:30:00', 'format:csv'),
  (33, 23, 'login',           '2024-01-14 10:00:00', NULL),
  (34, 23, 'deal_created',    '2024-01-14 10:30:00', 'deal_value:7500'),
  (35, 1,  'login',           '2024-01-15 09:00:00', NULL),
  (36, 3,  'login',           '2024-01-15 08:30:00', NULL),
  (37, 5,  'login',           '2024-01-16 09:00:00', NULL),
  (38, 5,  'contact_added',   '2024-01-16 09:15:00', NULL),
  (39, 8,  'login',           '2024-01-17 10:00:00', NULL),
  (40, 11, 'login',           '2024-01-18 11:00:00', NULL),
  (41, 11, 'deal_created',    '2024-01-18 11:30:00', 'deal_value:9500'),
  (42, 13, 'login',           '2024-01-19 09:00:00', NULL),
  (43, 17, 'login',           '2024-01-20 09:00:00', NULL),
  (44, 17, 'deal_created',    '2024-01-20 09:30:00', 'deal_value:18000'),
  (45, 22, 'login',           '2024-01-21 10:00:00', NULL),
  (46, 1,  'login',           '2024-02-01 09:00:00', NULL),
  (47, 3,  'login',           '2024-02-01 08:30:00', NULL),
  (48, 5,  'login',           '2024-02-02 09:00:00', NULL),
  (49, 9,  'login',           '2024-02-03 10:00:00', NULL),
  (50, 13, 'login',           '2024-02-04 09:00:00', NULL);

-- Tickets (15 rows)
INSERT INTO tickets VALUES
  (1,  2,  '2024-01-05', 'high',   'resolved', 'billing',         '2024-01-06'),
  (2,  4,  '2024-01-10', 'medium', 'resolved', 'bug',             '2024-01-12'),
  (3,  6,  '2024-01-15', 'low',    'resolved', 'feature_request', '2024-01-20'),
  (4,  8,  '2024-01-18', 'high',   'resolved', 'billing',         '2024-01-19'),
  (5,  10, '2024-01-22', 'medium', 'resolved', 'bug',             '2024-01-25'),
  (6,  1,  '2024-01-25', 'low',    'resolved', 'how_to',          '2024-01-26'),
  (7,  3,  '2024-02-01', 'high',   'resolved', 'bug',             '2024-02-03'),
  (8,  12, '2024-02-05', 'medium', 'open',     'billing',         NULL),
  (9,  14, '2024-02-08', 'high',   'resolved', 'bug',             '2024-02-09'),
  (10, 5,  '2024-02-10', 'low',    'open',     'feature_request', NULL),
  (11, 7,  '2024-02-12', 'medium', 'resolved', 'how_to',          '2024-02-13'),
  (12, 16, '2024-02-15', 'high',   'open',     'billing',         NULL),
  (13, 18, '2024-02-18', 'medium', 'resolved', 'bug',             '2024-02-20'),
  (14, 20, '2024-02-20', 'low',    'open',     'how_to',          NULL),
  (15, 9,  '2024-02-22', 'high',   'resolved', 'billing',         '2024-02-23');
`;

export const dataflow: CompanyProfile = {
  id: "dataflow",
  name: "DataFlow",
  tagline: "The CRM salespeople actually use",
  taglineFr: "Le CRM que les commerciaux utilisent vraiment",
  sector: "SaaS B2B",
  sectorFr: "SaaS B2B",
  icon: "\u{1F504}",
  description:
    "You just joined the data team at DataFlow, a fast-growing B2B SaaS CRM. 800 clients, 3 pricing plans (Starter, Pro, Enterprise). The board wants visibility on key metrics: MRR, churn, retention. You're here to turn raw data into strategic insights.",
  descriptionFr:
    "Tu viens de rejoindre l'équipe data de DataFlow, un CRM SaaS B2B en pleine croissance. 800 clients, 3 plans tarifaires (Starter, Pro, Enterprise). L'enjeu du moment : réduire le churn et augmenter le MRR. Tu es là pour donner de la visibilité au board sur les métriques clés.",
  schema,
  tables: [
    {
      name: "plans",
      description: "Pricing plans with features and limits",
      descriptionFr: "Plans tarifaires avec fonctionnalités et limites",
      rowCount: 3,
      columns: [
        { name: "plan_id", type: "INTEGER", nullable: false, description: "Unique plan ID", descriptionFr: "ID unique du plan" },
        { name: "plan_name", type: "VARCHAR", nullable: false, description: "Plan name (Starter, Pro, Enterprise)", descriptionFr: "Nom du plan (Starter, Pro, Enterprise)" },
        { name: "monthly_price", type: "DECIMAL(10,2)", nullable: false, description: "Monthly price in EUR", descriptionFr: "Prix mensuel en EUR" },
        { name: "annual_price", type: "DECIMAL(10,2)", nullable: false, description: "Annual price in EUR", descriptionFr: "Prix annuel en EUR" },
        { name: "max_users", type: "INTEGER", nullable: false, description: "Max users allowed", descriptionFr: "Nombre max d'utilisateurs" },
        { name: "features", type: "VARCHAR", nullable: false, description: "Comma-separated feature list", descriptionFr: "Liste des fonctionnalités" },
      ],
    },
    {
      name: "users",
      description: "Registered users with company and signup info",
      descriptionFr: "Utilisateurs inscrits avec entreprise et informations d'inscription",
      rowCount: 25,
      columns: [
        { name: "user_id", type: "INTEGER", nullable: false, description: "Unique user ID", descriptionFr: "ID unique de l'utilisateur" },
        { name: "first_name", type: "VARCHAR", nullable: false, description: "First name", descriptionFr: "Prénom" },
        { name: "last_name", type: "VARCHAR", nullable: false, description: "Last name", descriptionFr: "Nom de famille" },
        { name: "email", type: "VARCHAR", nullable: false, description: "Email address", descriptionFr: "Adresse email" },
        { name: "company", type: "VARCHAR", nullable: false, description: "Company name", descriptionFr: "Nom de l'entreprise" },
        { name: "role", type: "VARCHAR", nullable: false, description: "User role (admin, user)", descriptionFr: "Rôle (admin, user)" },
        { name: "signup_date", type: "DATE", nullable: false, description: "Registration date", descriptionFr: "Date d'inscription" },
        { name: "signup_channel", type: "VARCHAR", nullable: true, description: "Acquisition channel (can be NULL)", descriptionFr: "Canal d'acquisition (peut être NULL)" },
      ],
    },
    {
      name: "subscriptions",
      description: "Subscription records with plan, dates, and status",
      descriptionFr: "Abonnements avec plan, dates et statut",
      rowCount: 30,
      columns: [
        { name: "subscription_id", type: "INTEGER", nullable: false, description: "Unique subscription ID", descriptionFr: "ID unique de l'abonnement" },
        { name: "user_id", type: "INTEGER", nullable: false, description: "FK to users", descriptionFr: "FK vers users" },
        { name: "plan_id", type: "INTEGER", nullable: false, description: "FK to plans", descriptionFr: "FK vers plans" },
        { name: "start_date", type: "DATE", nullable: false, description: "Subscription start date", descriptionFr: "Date de début" },
        { name: "end_date", type: "DATE", nullable: true, description: "Subscription end date (NULL if active)", descriptionFr: "Date de fin (NULL si actif)" },
        { name: "status", type: "VARCHAR", nullable: false, description: "Status (active, churned, trial, paused)", descriptionFr: "Statut (active, churned, trial, paused)" },
        { name: "monthly_amount", type: "DECIMAL(10,2)", nullable: false, description: "Monthly billing amount", descriptionFr: "Montant mensuel facturé" },
      ],
    },
    {
      name: "invoices",
      description: "Monthly invoices linked to subscriptions",
      descriptionFr: "Factures mensuelles liées aux abonnements",
      rowCount: 25,
      columns: [
        { name: "invoice_id", type: "INTEGER", nullable: false, description: "Unique invoice ID", descriptionFr: "ID unique de la facture" },
        { name: "subscription_id", type: "INTEGER", nullable: false, description: "FK to subscriptions", descriptionFr: "FK vers subscriptions" },
        { name: "invoice_date", type: "DATE", nullable: false, description: "Invoice date", descriptionFr: "Date de la facture" },
        { name: "amount", type: "DECIMAL(10,2)", nullable: false, description: "Invoice amount in EUR", descriptionFr: "Montant en EUR" },
        { name: "payment_status", type: "VARCHAR", nullable: false, description: "Payment status (paid, overdue)", descriptionFr: "Statut de paiement (paid, overdue)" },
      ],
    },
    {
      name: "events",
      description: "Product usage events (logins, deals, exports, contacts)",
      descriptionFr: "Événements d'usage produit (connexions, deals, exports, contacts)",
      rowCount: 50,
      columns: [
        { name: "event_id", type: "INTEGER", nullable: false, description: "Unique event ID", descriptionFr: "ID unique de l'événement" },
        { name: "user_id", type: "INTEGER", nullable: false, description: "FK to users", descriptionFr: "FK vers users" },
        { name: "event_type", type: "VARCHAR", nullable: false, description: "Event type (login, deal_created, report_exported, contact_added)", descriptionFr: "Type d'événement (login, deal_created, report_exported, contact_added)" },
        { name: "event_timestamp", type: "TIMESTAMP", nullable: false, description: "Event timestamp", descriptionFr: "Horodatage de l'événement" },
        { name: "metadata", type: "VARCHAR", nullable: true, description: "Optional metadata (can be NULL)", descriptionFr: "Métadonnées optionnelles (peut être NULL)" },
      ],
    },
    {
      name: "tickets",
      description: "Support tickets with priority, status, and category",
      descriptionFr: "Tickets support avec priorité, statut et catégorie",
      rowCount: 15,
      columns: [
        { name: "ticket_id", type: "INTEGER", nullable: false, description: "Unique ticket ID", descriptionFr: "ID unique du ticket" },
        { name: "user_id", type: "INTEGER", nullable: false, description: "FK to users", descriptionFr: "FK vers users" },
        { name: "created_date", type: "DATE", nullable: false, description: "Ticket creation date", descriptionFr: "Date de création du ticket" },
        { name: "priority", type: "VARCHAR", nullable: false, description: "Priority (high, medium, low)", descriptionFr: "Priorité (high, medium, low)" },
        { name: "status", type: "VARCHAR", nullable: false, description: "Status (open, resolved)", descriptionFr: "Statut (open, resolved)" },
        { name: "category", type: "VARCHAR", nullable: false, description: "Category (billing, bug, feature_request, how_to)", descriptionFr: "Catégorie (billing, bug, feature_request, how_to)" },
        { name: "resolved_date", type: "DATE", nullable: true, description: "Resolution date (NULL if open)", descriptionFr: "Date de résolution (NULL si ouvert)" },
      ],
    },
  ],
  questions: [
    {
      id: "df-01",
      title: "MRR breakdown by plan",
      titleFr: "Répartition du MRR par plan",
      stakeholder: "Clara",
      stakeholderRole: "CFO",
      difficulty: "easy",
      description:
        "Clara (CFO) needs a snapshot of the current Monthly Recurring Revenue. Show the MRR for each plan by summing the monthly amounts of all active subscriptions. Display the plan name, number of active subscriptions, and MRR, sorted by MRR descending.",
      descriptionFr:
        "Clara (CFO) a besoin d'une photo du MRR actuel. Calcule le MRR par plan en sommant les montants mensuels de tous les abonnements actifs. Affiche le nom du plan, le nombre d'abonnements actifs et le MRR, trié par MRR décroissant.",
      hint: "Join subscriptions with plans. Filter WHERE status = 'active'. GROUP BY plan_name.",
      hintFr: "Jointure subscriptions avec plans. Filtre WHERE status = 'active'. GROUP BY plan_name.",
      solutionQuery: `SELECT p.plan_name,
  COUNT(*) AS active_subscriptions,
  SUM(s.monthly_amount) AS mrr
FROM subscriptions s
JOIN plans p ON s.plan_id = p.plan_id
WHERE s.status = 'active'
GROUP BY p.plan_name
ORDER BY mrr DESC;`,
      expectedColumns: ["plan_name", "active_subscriptions", "mrr"],
      expectedRows: [
        { plan_name: "Enterprise", active_subscriptions: 4, mrr: 796.00 },
        { plan_name: "Pro", active_subscriptions: 9, mrr: 711.00 },
        { plan_name: "Starter", active_subscriptions: 6, mrr: 174.00 },
      ],
      orderMatters: true,
    },
    {
      id: "df-02",
      title: "Monthly collected revenue",
      titleFr: "Revenus encaissés par mois",
      stakeholder: "Clara",
      stakeholderRole: "CFO",
      difficulty: "easy",
      description:
        "Clara (CFO) wants to see how much revenue was actually collected each month. Using paid invoices only, show the month (first day), number of invoices, and total revenue, ordered chronologically.",
      descriptionFr:
        "Clara (CFO) veut voir combien de revenus ont été réellement encaissés chaque mois. En utilisant uniquement les factures payées, affiche le mois (premier jour), le nombre de factures et le revenu total, trié chronologiquement.",
      hint: "Use DATE_TRUNC('month', invoice_date) to group by month. Filter WHERE payment_status = 'paid'.",
      hintFr: "Utilise DATE_TRUNC('month', invoice_date) pour regrouper par mois. Filtre WHERE payment_status = 'paid'.",
      solutionQuery: `SELECT DATE_TRUNC('month', invoice_date) AS month,
  COUNT(*) AS invoice_count,
  SUM(amount) AS total_revenue
FROM invoices
WHERE payment_status = 'paid'
GROUP BY DATE_TRUNC('month', invoice_date)
ORDER BY month;`,
      expectedColumns: ["month", "invoice_count", "total_revenue"],
      expectedRows: [
        { month: "2024-01-01", invoice_count: 19, total_revenue: 1681.00 },
        { month: "2024-02-01", invoice_count: 5, total_revenue: 755.00 },
      ],
      orderMatters: true,
    },
    {
      id: "df-03",
      title: "Support ticket resolution rate by category",
      titleFr: "Taux de résolution des tickets par catégorie",
      stakeholder: "Hugo",
      stakeholderRole: "Head of Product",
      difficulty: "easy",
      description:
        "Hugo (Head of Product) wants to understand which support categories are handled well and which need attention. Show the category, total ticket count, number of resolved tickets, and resolution rate (percentage), sorted by ticket count descending.",
      descriptionFr:
        "Hugo (Head of Product) veut comprendre quelles catégories de support sont bien gérées et lesquelles nécessitent de l'attention. Affiche la catégorie, le nombre total de tickets, le nombre de tickets résolus et le taux de résolution (pourcentage), trié par nombre de tickets décroissant.",
      hint: "Use COUNT(*) FILTER (WHERE status = 'resolved') for resolved tickets. ROUND the percentage to 1 decimal.",
      hintFr: "Utilise COUNT(*) FILTER (WHERE status = 'resolved') pour les tickets résolus. Arrondi le pourcentage à 1 décimale.",
      solutionQuery: `SELECT category,
  COUNT(*) AS ticket_count,
  COUNT(*) FILTER (WHERE status = 'resolved') AS resolved_count,
  ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'resolved') / COUNT(*), 1) AS resolution_rate
FROM tickets
GROUP BY category
ORDER BY ticket_count DESC, category;`,
      expectedColumns: ["category", "ticket_count", "resolved_count", "resolution_rate"],
      expectedRows: [
        { category: "billing", ticket_count: 5, resolved_count: 2, resolution_rate: 40.0 },
        { category: "bug", ticket_count: 5, resolved_count: 5, resolution_rate: 100.0 },
        { category: "how_to", ticket_count: 3, resolved_count: 2, resolution_rate: 66.7 },
        { category: "feature_request", ticket_count: 2, resolved_count: 1, resolution_rate: 50.0 },
      ],
      orderMatters: true,
    },
    {
      id: "df-04",
      title: "Churn rate by plan",
      titleFr: "Taux de churn par plan",
      stakeholder: "Clara",
      stakeholderRole: "CFO",
      difficulty: "medium",
      description:
        "Clara (CFO) wants to understand which plans have the highest churn. For each plan, calculate the churn rate as the percentage of subscriptions that churned out of all non-trial subscriptions (active + churned only). Show the plan name, total subscriptions, churned count, and churn rate, sorted by churn rate descending.",
      descriptionFr:
        "Clara (CFO) veut comprendre quels plans ont le plus de churn. Pour chaque plan, calcule le taux de churn comme le pourcentage d'abonnements résiliés parmi les abonnements non-trial (active + churned uniquement). Affiche le nom du plan, le total d'abonnements, le nombre de résiliés et le taux de churn, trié par taux décroissant.",
      hint: "Filter subscriptions WHERE status IN ('active', 'churned'). Use FILTER clause to count churned. ROUND to 1 decimal.",
      hintFr: "Filtre les abonnements WHERE status IN ('active', 'churned'). Utilise FILTER pour compter les résiliés. Arrondi à 1 décimale.",
      solutionQuery: `SELECT p.plan_name,
  COUNT(*) AS total_subscriptions,
  COUNT(*) FILTER (WHERE s.status = 'churned') AS churned,
  ROUND(100.0 * COUNT(*) FILTER (WHERE s.status = 'churned') / COUNT(*), 1) AS churn_rate
FROM subscriptions s
JOIN plans p ON s.plan_id = p.plan_id
WHERE s.status IN ('active', 'churned')
GROUP BY p.plan_name
ORDER BY churn_rate DESC;`,
      expectedColumns: ["plan_name", "total_subscriptions", "churned", "churn_rate"],
      expectedRows: [
        { plan_name: "Starter", total_subscriptions: 11, churned: 5, churn_rate: 45.5 },
        { plan_name: "Pro", total_subscriptions: 11, churned: 2, churn_rate: 18.2 },
        { plan_name: "Enterprise", total_subscriptions: 4, churned: 0, churn_rate: 0.0 },
      ],
      orderMatters: true,
    },
    {
      id: "df-05",
      title: "Most active users by product engagement",
      titleFr: "Utilisateurs les plus actifs par engagement produit",
      stakeholder: "Hugo",
      stakeholderRole: "Head of Product",
      difficulty: "medium",
      description:
        "Hugo (Head of Product) wants to identify the top 5 most engaged users by total number of product events. Show their first name, last name, company, total event count, and number of distinct active days. Sort by event count descending, then active days descending, then last name alphabetically.",
      descriptionFr:
        "Hugo (Head of Product) veut identifier les 5 utilisateurs les plus engagés par nombre total d'événements produit. Affiche leur prénom, nom, entreprise, nombre total d'événements et nombre de jours actifs distincts. Trie par nombre d'événements décroissant, puis jours actifs décroissants, puis nom alphabétique.",
      hint: "Join users with events. GROUP BY user. COUNT(*) for events, COUNT(DISTINCT DATE_TRUNC('day', ...)) for active days. LIMIT 5.",
      hintFr: "Jointure users avec events. GROUP BY user. COUNT(*) pour les événements, COUNT(DISTINCT DATE_TRUNC('day', ...)) pour les jours actifs. LIMIT 5.",
      solutionQuery: `SELECT u.first_name, u.last_name, u.company,
  COUNT(*) AS event_count,
  COUNT(DISTINCT DATE_TRUNC('day', e.event_timestamp)) AS active_days
FROM users u
JOIN events e ON u.user_id = e.user_id
GROUP BY u.user_id, u.first_name, u.last_name, u.company
ORDER BY event_count DESC, active_days DESC, u.last_name
LIMIT 5;`,
      expectedColumns: ["first_name", "last_name", "company", "event_count", "active_days"],
      expectedRows: [
        { first_name: "Clara", last_name: "Leroy", company: "InnovateTech", event_count: 6, active_days: 4 },
        { first_name: "Alice", last_name: "Martin", company: "TechCorp", event_count: 6, active_days: 4 },
        { first_name: "Emma", last_name: "Simon", company: "MediaCo", event_count: 6, active_days: 4 },
        { first_name: "Marie", last_name: "Lefevre", company: "CloudNine", event_count: 4, active_days: 3 },
        { first_name: "Ines", last_name: "Thomas", company: "DataPulse", event_count: 4, active_days: 3 },
      ],
      orderMatters: true,
    },
    {
      id: "df-06",
      title: "Conversion rate by signup channel",
      titleFr: "Taux de conversion par canal d'acquisition",
      stakeholder: "Ines",
      stakeholderRole: "Growth Manager",
      difficulty: "medium",
      description:
        "Ines (Growth Manager) wants to compare signup channels by their effectiveness at converting users into active paying customers. For each channel (excluding users with unknown channel), show the total number of users, how many have at least one active subscription, and the conversion rate as a percentage. Sort by conversion rate descending.",
      descriptionFr:
        "Inès (Growth Manager) veut comparer les canaux d'acquisition par leur efficacité à convertir les utilisateurs en clients payants actifs. Pour chaque canal (en excluant les utilisateurs sans canal connu), affiche le nombre total d'utilisateurs, combien ont au moins un abonnement actif, et le taux de conversion en pourcentage. Trie par taux de conversion décroissant.",
      hint: "Use a CTE to compute per-user whether they have an active subscription. Then GROUP BY signup_channel.",
      hintFr: "Utilise un CTE pour calculer par utilisateur s'il a un abonnement actif. Puis GROUP BY signup_channel.",
      solutionQuery: `WITH user_conversion AS (
  SELECT u.signup_channel,
    u.user_id,
    MAX(CASE WHEN s.status = 'active' THEN 1 ELSE 0 END) AS has_active_sub
  FROM users u
  JOIN subscriptions s ON u.user_id = s.user_id
  WHERE u.signup_channel IS NOT NULL
  GROUP BY u.signup_channel, u.user_id
)
SELECT signup_channel,
  COUNT(*) AS total_users,
  SUM(has_active_sub) AS active_users,
  ROUND(100.0 * SUM(has_active_sub) / COUNT(*), 1) AS conversion_rate
FROM user_conversion
GROUP BY signup_channel
ORDER BY conversion_rate DESC;`,
      expectedColumns: ["signup_channel", "total_users", "active_users", "conversion_rate"],
      expectedRows: [
        { signup_channel: "linkedin", total_users: 6, active_users: 6, conversion_rate: 100.0 },
        { signup_channel: "google", total_users: 9, active_users: 8, conversion_rate: 88.9 },
        { signup_channel: "referral", total_users: 5, active_users: 3, conversion_rate: 60.0 },
      ],
      orderMatters: true,
    },
    {
      id: "df-07",
      title: "Top 10 accounts by total invoiced revenue",
      titleFr: "Top 10 comptes par revenus facturés",
      stakeholder: "Clara",
      stakeholderRole: "CFO",
      difficulty: "medium",
      description:
        "Clara (CFO) wants to identify the highest-value accounts. Show the top 10 users by total paid invoice amount, including their name, company, current plan, and total invoiced. Sort by total invoiced descending.",
      descriptionFr:
        "Clara (CFO) veut identifier les comptes à plus forte valeur. Affiche les 10 utilisateurs avec le plus de factures payées, incluant leur nom, entreprise, plan actuel et total facturé. Trie par total facturé décroissant.",
      hint: "Join users → subscriptions → plans → invoices. Filter paid invoices. GROUP BY user and plan. ORDER BY total DESC LIMIT 10.",
      hintFr: "Jointure users → subscriptions → plans → invoices. Filtre les factures payées. GROUP BY user et plan. ORDER BY total DESC LIMIT 10.",
      solutionQuery: `SELECT u.first_name, u.last_name, u.company,
  p.plan_name,
  SUM(i.amount) AS total_invoiced
FROM users u
JOIN subscriptions s ON u.user_id = s.user_id
JOIN plans p ON s.plan_id = p.plan_id
JOIN invoices i ON s.subscription_id = i.subscription_id
WHERE i.payment_status = 'paid'
GROUP BY u.user_id, u.first_name, u.last_name, u.company, p.plan_name
ORDER BY total_invoiced DESC, u.last_name
LIMIT 10;`,
      expectedColumns: ["first_name", "last_name", "company", "plan_name", "total_invoiced"],
      expectedRows: [
        { first_name: "Clara", last_name: "Leroy", company: "InnovateTech", plan_name: "Enterprise", total_invoiced: 398.00 },
        { first_name: "Samuel", last_name: "Perrin", company: "EcoTrack", plan_name: "Enterprise", total_invoiced: 398.00 },
        { first_name: "Marie", last_name: "Lefevre", company: "CloudNine", plan_name: "Enterprise", total_invoiced: 199.00 },
        { first_name: "Gabrielle", last_name: "Michel", company: "LogistiqA", plan_name: "Enterprise", total_invoiced: 199.00 },
        { first_name: "Alice", last_name: "Martin", company: "TechCorp", plan_name: "Pro", total_invoiced: 158.00 },
        { first_name: "Emma", last_name: "Simon", company: "MediaCo", plan_name: "Pro", total_invoiced: 158.00 },
        { first_name: "Ines", last_name: "Thomas", company: "DataPulse", plan_name: "Pro", total_invoiced: 158.00 },
        { first_name: "Quentin", last_name: "Blanc", company: "NextMove", plan_name: "Pro", total_invoiced: 79.00 },
        { first_name: "Bob", last_name: "Dupont", company: "SalesFR", plan_name: "Pro", total_invoiced: 79.00 },
        { first_name: "Lucas", last_name: "Durand", company: "BuildFast", plan_name: "Pro", total_invoiced: 79.00 },
      ],
      orderMatters: true,
    },
    {
      id: "df-08",
      title: "Month-over-month revenue growth",
      titleFr: "Croissance du revenu mois par mois",
      stakeholder: "Clara",
      stakeholderRole: "CFO",
      difficulty: "hard",
      description:
        "Clara (CFO) wants to track revenue momentum. Using paid invoices, compute the total revenue per month, the previous month's revenue, and the month-over-month growth percentage. The first month will have NULL for previous revenue and growth. Round growth to 1 decimal.",
      descriptionFr:
        "Clara (CFO) veut suivre la dynamique du revenu. À partir des factures payées, calcule le revenu total par mois, le revenu du mois précédent et le pourcentage de croissance mois par mois. Le premier mois aura NULL pour le revenu précédent et la croissance. Arrondi à 1 décimale.",
      hint: "Use a CTE for monthly revenue, then LAG(mrr) OVER (ORDER BY month) to get the previous month's value.",
      hintFr: "Utilise un CTE pour le revenu mensuel, puis LAG(mrr) OVER (ORDER BY month) pour obtenir la valeur du mois précédent.",
      solutionQuery: `WITH monthly_mrr AS (
  SELECT DATE_TRUNC('month', invoice_date) AS month,
    SUM(amount) AS mrr
  FROM invoices
  WHERE payment_status = 'paid'
  GROUP BY DATE_TRUNC('month', invoice_date)
)
SELECT month, mrr,
  LAG(mrr) OVER (ORDER BY month) AS prev_mrr,
  ROUND(100.0 * (mrr - LAG(mrr) OVER (ORDER BY month)) / LAG(mrr) OVER (ORDER BY month), 1) AS growth_pct
FROM monthly_mrr
ORDER BY month;`,
      expectedColumns: ["month", "mrr", "prev_mrr", "growth_pct"],
      expectedRows: [
        { month: "2024-01-01", mrr: 1681.00, prev_mrr: null, growth_pct: null },
        { month: "2024-02-01", mrr: 755.00, prev_mrr: 1681.00, growth_pct: -55.1 },
      ],
      orderMatters: true,
    },
    {
      id: "df-09",
      title: "Quarterly cohort retention in January 2024",
      titleFr: "Rétention par cohorte trimestrielle en janvier 2024",
      stakeholder: "Hugo",
      stakeholderRole: "Head of Product",
      difficulty: "hard",
      description:
        "Hugo (Head of Product) wants to measure product stickiness. Group users by their signup quarter (cohort). For each cohort, count how many users were active (had at least one event) during January 2024. Show the cohort quarter, cohort size, number active in January, and retention rate as a percentage. Sort by cohort quarter.",
      descriptionFr:
        "Hugo (Head of Product) veut mesurer l'adhérence produit. Regroupe les utilisateurs par trimestre d'inscription (cohorte). Pour chaque cohorte, compte combien d'utilisateurs étaient actifs (au moins un événement) en janvier 2024. Affiche le trimestre de cohorte, la taille de la cohorte, le nombre d'actifs en janvier et le taux de rétention. Trie par trimestre.",
      hint: "Use DATE_TRUNC('quarter', signup_date) for cohorts. LEFT JOIN with a subquery of distinct users active in January 2024 (events between Jan 1 and Feb 1).",
      hintFr: "Utilise DATE_TRUNC('quarter', signup_date) pour les cohortes. LEFT JOIN avec une sous-requête des utilisateurs distincts actifs en janvier 2024 (events entre le 1er janv. et le 1er fév.).",
      solutionQuery: `WITH cohorts AS (
  SELECT u.user_id,
    DATE_TRUNC('quarter', u.signup_date) AS cohort_quarter
  FROM users u
),
jan_active AS (
  SELECT DISTINCT user_id
  FROM events
  WHERE event_timestamp >= '2024-01-01' AND event_timestamp < '2024-02-01'
)
SELECT c.cohort_quarter,
  COUNT(DISTINCT c.user_id) AS cohort_size,
  COUNT(DISTINCT a.user_id) AS active_in_jan,
  ROUND(100.0 * COUNT(DISTINCT a.user_id) / COUNT(DISTINCT c.user_id), 1) AS retention_rate
FROM cohorts c
LEFT JOIN jan_active a ON c.user_id = a.user_id
GROUP BY c.cohort_quarter
ORDER BY c.cohort_quarter;`,
      expectedColumns: ["cohort_quarter", "cohort_size", "active_in_jan", "retention_rate"],
      expectedRows: [
        { cohort_quarter: "2023-01-01", cohort_size: 6, active_in_jan: 4, retention_rate: 66.7 },
        { cohort_quarter: "2023-04-01", cohort_size: 6, active_in_jan: 4, retention_rate: 66.7 },
        { cohort_quarter: "2023-07-01", cohort_size: 5, active_in_jan: 4, retention_rate: 80.0 },
        { cohort_quarter: "2023-10-01", cohort_size: 5, active_in_jan: 3, retention_rate: 60.0 },
        { cohort_quarter: "2024-01-01", cohort_size: 3, active_in_jan: 1, retention_rate: 33.3 },
      ],
      orderMatters: true,
    },
    {
      id: "df-10",
      title: "High-value accounts at churn risk",
      titleFr: "Comptes à forte valeur en risque de churn",
      stakeholder: "Clara",
      stakeholderRole: "CFO",
      difficulty: "hard",
      description:
        "Clara (CFO) wants an early warning list of paying customers who might churn. Identify users with active subscriptions who have either open support tickets OR overdue invoices. Show their name, company, current MRR, count of open tickets, and count of overdue invoices. Sort by MRR descending, then open tickets descending.",
      descriptionFr:
        "Clara (CFO) veut une liste d'alerte précoce des clients payants qui pourraient churner. Identifie les utilisateurs avec des abonnements actifs qui ont soit des tickets support ouverts SOIT des factures impayées. Affiche leur nom, entreprise, MRR actuel, nombre de tickets ouverts et nombre de factures impayées. Trie par MRR décroissant, puis tickets ouverts décroissants.",
      hint: "Build active_revenue CTE first. Then LEFT JOIN with tickets (open) and invoices (overdue). Filter users with at least one risk signal.",
      hintFr: "Construis d'abord un CTE active_revenue. Puis LEFT JOIN avec tickets (open) et invoices (overdue). Filtre les utilisateurs avec au moins un signal de risque.",
      solutionQuery: `WITH active_revenue AS (
  SELECT s.user_id, SUM(s.monthly_amount) AS current_mrr
  FROM subscriptions s
  WHERE s.status = 'active'
  GROUP BY s.user_id
),
risk_signals AS (
  SELECT u.user_id,
    u.first_name, u.last_name, u.company,
    ar.current_mrr,
    COUNT(DISTINCT CASE WHEN t.status = 'open' THEN t.ticket_id END) AS open_tickets,
    COUNT(DISTINCT CASE WHEN i.payment_status = 'overdue' THEN i.invoice_id END) AS overdue_invoices
  FROM users u
  JOIN active_revenue ar ON u.user_id = ar.user_id
  LEFT JOIN tickets t ON u.user_id = t.user_id
  LEFT JOIN subscriptions s ON u.user_id = s.user_id AND s.status = 'active'
  LEFT JOIN invoices i ON s.subscription_id = i.subscription_id AND i.payment_status = 'overdue'
  GROUP BY u.user_id, u.first_name, u.last_name, u.company, ar.current_mrr
)
SELECT first_name, last_name, company, current_mrr, open_tickets, overdue_invoices
FROM risk_signals
WHERE open_tickets > 0 OR overdue_invoices > 0
ORDER BY current_mrr DESC, open_tickets DESC;`,
      expectedColumns: ["first_name", "last_name", "company", "current_mrr", "open_tickets", "overdue_invoices"],
      expectedRows: [
        { first_name: "Marie", last_name: "Lefevre", company: "CloudNine", current_mrr: 199.00, open_tickets: 0, overdue_invoices: 1 },
        { first_name: "Emma", last_name: "Simon", company: "MediaCo", current_mrr: 79.00, open_tickets: 1, overdue_invoices: 0 },
        { first_name: "Pierre", last_name: "Chevalier", company: "AlphaCode", current_mrr: 29.00, open_tickets: 1, overdue_invoices: 0 },
      ],
      orderMatters: true,
    },
  ],
};
