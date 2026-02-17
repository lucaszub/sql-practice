import type { CompanyProfile } from "./types";

const schema = `
CREATE TABLE users (
  user_id INTEGER PRIMARY KEY,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  date_of_birth DATE NOT NULL,
  city VARCHAR,
  kyc_status VARCHAR NOT NULL,
  created_at DATE NOT NULL
);

CREATE TABLE accounts (
  account_id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id),
  account_type VARCHAR NOT NULL,
  balance DECIMAL(12,2) NOT NULL,
  currency VARCHAR NOT NULL,
  opened_at DATE NOT NULL,
  status VARCHAR NOT NULL
);

CREATE TABLE transactions (
  transaction_id INTEGER PRIMARY KEY,
  account_id INTEGER NOT NULL REFERENCES accounts(account_id),
  amount DECIMAL(12,2) NOT NULL,
  transaction_type VARCHAR NOT NULL,
  merchant VARCHAR,
  category VARCHAR,
  transaction_date TIMESTAMP NOT NULL,
  status VARCHAR NOT NULL
);

CREATE TABLE cards (
  card_id INTEGER PRIMARY KEY,
  account_id INTEGER NOT NULL REFERENCES accounts(account_id),
  card_type VARCHAR NOT NULL,
  monthly_limit DECIMAL(10,2) NOT NULL,
  status VARCHAR NOT NULL,
  expiry_date DATE NOT NULL,
  contactless_enabled BOOLEAN NOT NULL
);

CREATE TABLE kyc_checks (
  check_id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id),
  check_date DATE NOT NULL,
  result VARCHAR NOT NULL,
  document_type VARCHAR NOT NULL,
  reviewer VARCHAR
);

CREATE TABLE transfers (
  transfer_id INTEGER PRIMARY KEY,
  sender_account_id INTEGER NOT NULL REFERENCES accounts(account_id),
  receiver_account_id INTEGER NOT NULL REFERENCES accounts(account_id),
  amount DECIMAL(12,2) NOT NULL,
  transfer_date TIMESTAMP NOT NULL,
  transfer_type VARCHAR NOT NULL,
  status VARCHAR NOT NULL
);

-- Users (20 rows)
INSERT INTO users VALUES
  (1, 'Amina', 'Belhaj', 'amina.belhaj@email.com', '1990-03-15', 'Paris', 'verified', '2023-01-10'),
  (2, 'Thomas', 'Berger', 'thomas.berger@email.com', '1988-07-22', 'Lyon', 'verified', '2023-01-18'),
  (3, 'Léa', 'Duval', 'lea.duval@email.com', '1995-11-03', 'Marseille', 'verified', '2023-02-05'),
  (4, 'Karim', 'Mansouri', 'karim.mansouri@email.com', '1992-01-28', 'Toulouse', 'verified', '2023-02-14'),
  (5, 'Sophie', 'Renard', 'sophie.renard@email.com', '1998-06-10', 'Nice', 'pending', '2023-03-01'),
  (6, 'Julien', 'Morel', 'julien.morel@email.com', '1985-09-18', 'Nantes', 'verified', '2023-03-12'),
  (7, 'Yasmine', 'Farid', 'yasmine.farid@email.com', '1993-04-25', 'Bordeaux', 'verified', '2023-03-28'),
  (8, 'Pierre', 'Lambert', 'pierre.lambert@email.com', '1991-12-07', 'Strasbourg', 'verified', '2023-04-10'),
  (9, 'Chloé', 'Petit', 'chloe.petit@email.com', '1997-08-19', 'Lille', 'rejected', '2023-04-22'),
  (10, 'Antoine', 'Girard', 'antoine.girard@email.com', '1986-02-14', 'Paris', 'verified', '2023-05-05'),
  (11, 'Fatou', 'Diallo', 'fatou.diallo@email.com', '1994-10-30', 'Lyon', 'verified', '2023-05-18'),
  (12, 'Maxime', 'Roux', 'maxime.roux@email.com', '1989-05-12', 'Marseille', 'verified', '2023-06-01'),
  (13, 'Inès', 'Charpentier', 'ines.charpentier@email.com', '1996-03-08', NULL, 'pending', '2023-06-15'),
  (14, 'Lucas', 'Fournier', 'lucas.fournier@email.com', '1987-11-21', 'Paris', 'verified', '2023-07-01'),
  (15, 'Nora', 'Khelifi', 'nora.khelifi@email.com', '1999-01-17', 'Nice', 'verified', '2023-07-20'),
  (16, 'Rémi', 'Blanc', 'remi.blanc@email.com', '1990-07-04', 'Nantes', 'verified', '2023-08-05'),
  (17, 'Camille', 'Dufresne', 'camille.dufresne@email.com', '1993-09-26', NULL, 'pending', '2023-08-22'),
  (18, 'Omar', 'Benali', 'omar.benali@email.com', '1988-04-11', 'Bordeaux', 'verified', '2023-09-10'),
  (19, 'Elise', 'Marchand', 'elise.marchand@email.com', '1995-12-29', 'Strasbourg', 'verified', '2023-09-25'),
  (20, 'Youssef', 'Amrani', 'youssef.amrani@email.com', '1991-06-16', 'Lille', 'rejected', '2023-10-08');

-- Accounts (20 rows)
INSERT INTO accounts VALUES
  (1, 1, 'checking', 3450.00, 'EUR', '2023-01-10', 'active'),
  (2, 2, 'checking', 12800.50, 'EUR', '2023-01-18', 'active'),
  (3, 3, 'checking', 890.25, 'EUR', '2023-02-05', 'active'),
  (4, 4, 'checking', 5620.00, 'EUR', '2023-02-14', 'active'),
  (5, 5, 'checking', 1200.00, 'EUR', '2023-03-01', 'active'),
  (6, 6, 'savings', 45000.00, 'EUR', '2023-03-12', 'active'),
  (7, 7, 'checking', 2340.75, 'EUR', '2023-03-28', 'active'),
  (8, 8, 'checking', 8900.00, 'EUR', '2023-04-10', 'active'),
  (9, 9, 'checking', 450.00, 'EUR', '2023-04-22', 'frozen'),
  (10, 10, 'savings', 67500.00, 'EUR', '2023-05-05', 'active'),
  (11, 11, 'checking', 3100.00, 'EUR', '2023-05-18', 'active'),
  (12, 12, 'checking', 15200.00, 'EUR', '2023-06-01', 'active'),
  (13, 13, 'checking', 780.50, 'EUR', '2023-06-15', 'active'),
  (14, 14, 'checking', 22000.00, 'EUR', '2023-07-01', 'active'),
  (15, 15, 'savings', 9800.00, 'EUR', '2023-07-20', 'active'),
  (16, 16, 'checking', 4100.00, 'EUR', '2023-08-05', 'active'),
  (17, 17, 'checking', 560.00, 'EUR', '2023-08-22', 'active'),
  (18, 18, 'checking', 11300.00, 'EUR', '2023-09-10', 'active'),
  (19, 19, 'checking', 6750.00, 'EUR', '2023-09-25', 'active'),
  (20, 20, 'checking', 320.00, 'EUR', '2023-10-08', 'closed');

-- Transactions (50 rows)
INSERT INTO transactions VALUES
  (1, 1, -45.90, 'purchase', 'Carrefour', 'groceries', '2024-01-05 09:15:00', 'completed'),
  (2, 1, -120.00, 'purchase', 'SNCF', 'transport', '2024-01-05 14:30:00', 'completed'),
  (3, 2, -89.99, 'purchase', 'Amazon', 'shopping', '2024-01-08 11:00:00', 'completed'),
  (4, 3, -15.50, 'purchase', 'Uber Eats', 'food_delivery', '2024-01-10 19:45:00', 'completed'),
  (5, 4, -250.00, 'purchase', 'Fnac', 'electronics', '2024-01-12 16:20:00', 'completed'),
  (6, 1, 2800.00, 'deposit', NULL, 'salary', '2024-01-15 08:00:00', 'completed'),
  (7, 5, -32.00, 'purchase', 'Monoprix', 'groceries', '2024-01-18 10:30:00', 'completed'),
  (8, 6, -500.00, 'withdrawal', NULL, NULL, '2024-01-20 14:00:00', 'completed'),
  (9, 7, -78.50, 'purchase', 'Zara', 'clothing', '2024-01-22 15:15:00', 'completed'),
  (10, 8, -1500.00, 'purchase', 'Apple Store', 'electronics', '2024-01-25 12:00:00', 'completed'),
  (11, 2, 3500.00, 'deposit', NULL, 'salary', '2024-02-01 08:00:00', 'completed'),
  (12, 4, 2600.00, 'deposit', NULL, 'salary', '2024-02-01 08:00:00', 'completed'),
  (13, 9, -890.00, 'purchase', 'Booking.com', 'travel', '2024-02-03 09:00:00', 'completed'),
  (14, 10, -200.00, 'withdrawal', NULL, NULL, '2024-02-05 11:30:00', 'completed'),
  (15, 11, -67.80, 'purchase', 'Leclerc', 'groceries', '2024-02-08 17:45:00', 'completed'),
  (16, 12, -350.00, 'purchase', 'Decathlon', 'sports', '2024-02-10 10:00:00', 'completed'),
  (17, 14, -1200.00, 'purchase', 'Louis Vuitton', 'luxury', '2024-02-12 14:30:00', 'completed'),
  (18, 3, -8.90, 'purchase', 'Netflix', 'subscription', '2024-02-15 00:00:00', 'completed'),
  (19, 1, -55.00, 'purchase', 'Total Energies', 'fuel', '2024-02-18 07:30:00', 'completed'),
  (20, 7, -42.00, 'purchase', 'Picard', 'groceries', '2024-02-20 18:00:00', 'completed'),
  (21, 8, -320.00, 'purchase', 'Darty', 'electronics', '2024-02-22 11:15:00', 'completed'),
  (22, 16, -95.00, 'purchase', 'Nike', 'clothing', '2024-02-25 13:00:00', 'completed'),
  (23, 18, -180.00, 'purchase', 'Airbnb', 'travel', '2024-02-28 20:00:00', 'completed'),
  (24, 1, 2800.00, 'deposit', NULL, 'salary', '2024-03-01 08:00:00', 'completed'),
  (25, 11, 2200.00, 'deposit', NULL, 'salary', '2024-03-01 08:00:00', 'completed'),
  (26, 4, -4800.00, 'purchase', 'Rolex Boutique', 'luxury', '2024-03-05 15:00:00', 'completed'),
  (27, 14, -3500.00, 'purchase', 'Chanel', 'luxury', '2024-03-05 16:30:00', 'completed'),
  (28, 14, -2800.00, 'purchase', 'Hermes', 'luxury', '2024-03-05 17:00:00', 'completed'),
  (29, 14, -1900.00, 'purchase', 'Dior', 'luxury', '2024-03-05 17:30:00', 'completed'),
  (30, 3, -22.50, 'purchase', 'Spotify', 'subscription', '2024-03-08 00:00:00', 'completed'),
  (31, 5, -1800.00, 'purchase', 'MediaMarkt', 'electronics', '2024-03-10 14:00:00', 'pending'),
  (32, 7, -55.00, 'purchase', 'Sephora', 'beauty', '2024-03-12 16:45:00', 'completed'),
  (33, 12, -125.00, 'purchase', 'IKEA', 'home', '2024-03-15 10:30:00', 'completed'),
  (34, 16, -28.50, 'purchase', 'Starbucks', 'food_delivery', '2024-03-18 08:15:00', 'completed'),
  (35, 19, -450.00, 'purchase', 'Boulanger', 'electronics', '2024-03-20 12:00:00', 'completed'),
  (36, 2, -75.00, 'purchase', 'Auchan', 'groceries', '2024-03-22 17:30:00', 'completed'),
  (37, 1, -38.00, 'purchase', 'Carrefour', 'groceries', '2024-03-25 09:00:00', 'completed'),
  (38, 8, -650.00, 'purchase', 'Samsung Store', 'electronics', '2024-03-28 11:00:00', 'completed'),
  (39, 4, -110.00, 'purchase', 'Leroy Merlin', 'home', '2024-03-30 14:00:00', 'completed'),
  (40, 11, -89.00, 'purchase', 'Cultura', 'shopping', '2024-04-02 15:30:00', 'completed'),
  (41, 18, -2200.00, 'purchase', 'Cartier', 'luxury', '2024-04-05 10:00:00', 'completed'),
  (42, 18, -1950.00, 'purchase', 'Bulgari', 'luxury', '2024-04-05 10:45:00', 'completed'),
  (43, 18, -3100.00, 'purchase', 'Van Cleef', 'luxury', '2024-04-05 11:20:00', 'completed'),
  (44, 13, -15.00, 'purchase', 'Uber', 'transport', '2024-04-08 22:00:00', 'completed'),
  (45, 17, -9.99, 'purchase', 'Disney+', 'subscription', '2024-04-10 00:00:00', 'completed'),
  (46, 2, -145.00, 'purchase', 'Galeries Lafayette', 'clothing', '2024-04-12 13:00:00', 'completed'),
  (47, 19, -62.00, 'purchase', 'Nature & Decouvertes', 'shopping', '2024-04-15 11:00:00', 'completed'),
  (48, 6, -1000.00, 'withdrawal', NULL, NULL, '2024-04-18 09:00:00', 'completed'),
  (49, 20, -5500.00, 'purchase', 'Crypto Exchange', 'crypto', '2024-04-20 03:00:00', 'flagged'),
  (50, 12, 4500.00, 'deposit', NULL, 'salary', '2024-04-25 08:00:00', 'completed');

-- Cards (15 rows)
INSERT INTO cards VALUES
  (1, 1, 'visa_classic', 1500.00, 'active', '2026-01-31', true),
  (2, 2, 'visa_premier', 5000.00, 'active', '2026-03-31', true),
  (3, 3, 'visa_classic', 1000.00, 'active', '2026-02-28', true),
  (4, 4, 'visa_premier', 3000.00, 'active', '2026-04-30', true),
  (5, 5, 'visa_classic', 800.00, 'active', '2025-12-31', false),
  (6, 7, 'visa_classic', 1500.00, 'active', '2026-06-30', true),
  (7, 8, 'visa_gold', 8000.00, 'active', '2026-07-31', true),
  (8, 11, 'visa_classic', 1500.00, 'active', '2026-08-31', true),
  (9, 12, 'visa_premier', 5000.00, 'active', '2026-09-30', true),
  (10, 14, 'visa_gold', 10000.00, 'active', '2026-10-31', true),
  (11, 16, 'visa_classic', 1500.00, 'active', '2026-11-30', true),
  (12, 18, 'visa_premier', 5000.00, 'active', '2026-12-31', true),
  (13, 19, 'visa_classic', 2000.00, 'blocked', '2025-06-30', true),
  (14, 9, 'visa_classic', 1000.00, 'blocked', '2025-09-30', false),
  (15, 17, 'visa_classic', 800.00, 'active', '2026-05-31', false);

-- KYC checks (12 rows)
INSERT INTO kyc_checks VALUES
  (1, 1, '2023-01-10', 'approved', 'passport', 'Agent_A'),
  (2, 2, '2023-01-18', 'approved', 'id_card', 'Agent_B'),
  (3, 3, '2023-02-06', 'approved', 'id_card', 'Agent_A'),
  (4, 4, '2023-02-15', 'approved', 'passport', 'Agent_C'),
  (5, 5, '2023-03-02', 'pending', 'id_card', NULL),
  (6, 6, '2023-03-13', 'approved', 'passport', 'Agent_B'),
  (7, 7, '2023-03-29', 'approved', 'driver_license', 'Agent_A'),
  (8, 8, '2023-04-11', 'approved', 'id_card', 'Agent_C'),
  (9, 9, '2023-04-23', 'rejected', 'id_card', 'Agent_B'),
  (10, 10, '2023-05-06', 'approved', 'passport', 'Agent_A'),
  (11, 13, '2023-06-16', 'pending', 'driver_license', NULL),
  (12, 20, '2023-10-09', 'rejected', 'id_card', 'Agent_C');

-- Transfers (20 rows)
INSERT INTO transfers VALUES
  (1, 1, 2, 500.00, '2024-01-05 10:00:00', 'instant', 'completed'),
  (2, 2, 3, 150.00, '2024-01-10 14:00:00', 'standard', 'completed'),
  (3, 4, 1, 300.00, '2024-01-15 09:30:00', 'instant', 'completed'),
  (4, 8, 7, 1000.00, '2024-01-20 16:00:00', 'instant', 'completed'),
  (5, 12, 11, 250.00, '2024-01-25 11:00:00', 'standard', 'completed'),
  (6, 14, 2, 2000.00, '2024-02-01 08:30:00', 'instant', 'completed'),
  (7, 1, 3, 75.00, '2024-02-05 13:00:00', 'standard', 'completed'),
  (8, 6, 1, 800.00, '2024-02-10 10:15:00', 'instant', 'completed'),
  (9, 2, 4, 450.00, '2024-02-15 15:00:00', 'instant', 'completed'),
  (10, 18, 19, 350.00, '2024-02-20 09:00:00', 'standard', 'completed'),
  (11, 4, 7, 600.00, '2024-02-28 11:30:00', 'instant', 'completed'),
  (12, 11, 3, 100.00, '2024-03-05 14:00:00', 'standard', 'completed'),
  (13, 14, 12, 5000.00, '2024-03-10 10:00:00', 'instant', 'completed'),
  (14, 8, 1, 200.00, '2024-03-15 16:30:00', 'instant', 'completed'),
  (15, 1, 7, 150.00, '2024-03-20 12:00:00', 'instant', 'completed'),
  (16, 12, 18, 800.00, '2024-03-25 09:45:00', 'standard', 'completed'),
  (17, 19, 16, 275.00, '2024-04-01 14:30:00', 'instant', 'completed'),
  (18, 4, 2, 1200.00, '2024-04-10 11:00:00', 'instant', 'completed'),
  (19, 14, 18, 3000.00, '2024-04-15 08:00:00', 'instant', 'completed'),
  (20, 2, 1, 600.00, '2024-04-20 15:00:00', 'standard', 'completed');
`;

export const cashBee: CompanyProfile = {
  id: "cashbee",
  name: "CashBee",
  tagline: "The bank that never sleeps",
  taglineFr: "La banque qui ne dort jamais",
  sector: "Fintech / Neobank",
  sectorFr: "Fintech / Néobanque",
  icon: "🐝",
  description:
    "You just joined the data team at CashBee, a fast-growing neobank targeting 25-40 year olds. With 50,000 active accounts, instant transfers, and a cashback program, the company is scaling fast. The regulator wants reports, the CEO wants dashboards, and the fraud team wants to sleep at night. Your job: make sense of the data before the next audit.",
  descriptionFr:
    "Tu viens de rejoindre l'équipe data de CashBee, une néobanque en pleine croissance ciblant les 25-40 ans. Avec 50 000 comptes actifs, des virements instantanés et un programme de cashback, la boîte scale vite. Le régulateur veut des rapports, le CEO veut des dashboards, et l'équipe fraude veut dormir la nuit. Ta mission : donner du sens aux données avant le prochain audit.",
  schema,
  tables: [
    {
      name: "users",
      description: "Registered users with identity and KYC status",
      descriptionFr: "Utilisateurs inscrits avec identité et statut KYC",
      rowCount: 20,
      columns: [
        { name: "user_id", type: "INTEGER", nullable: false, description: "Unique user ID", descriptionFr: "ID unique de l'utilisateur" },
        { name: "first_name", type: "VARCHAR", nullable: false, description: "First name", descriptionFr: "Prénom" },
        { name: "last_name", type: "VARCHAR", nullable: false, description: "Last name", descriptionFr: "Nom de famille" },
        { name: "email", type: "VARCHAR", nullable: false, description: "Email address", descriptionFr: "Adresse email" },
        { name: "date_of_birth", type: "DATE", nullable: false, description: "Date of birth", descriptionFr: "Date de naissance" },
        { name: "city", type: "VARCHAR", nullable: true, description: "City (can be NULL)", descriptionFr: "Ville (peut être NULL)" },
        { name: "kyc_status", type: "VARCHAR", nullable: false, description: "KYC status (verified, pending, rejected)", descriptionFr: "Statut KYC (verified, pending, rejected)" },
        { name: "created_at", type: "DATE", nullable: false, description: "Registration date", descriptionFr: "Date d'inscription" },
      ],
    },
    {
      name: "accounts",
      description: "Bank accounts with balance and status",
      descriptionFr: "Comptes bancaires avec solde et statut",
      rowCount: 20,
      columns: [
        { name: "account_id", type: "INTEGER", nullable: false, description: "Unique account ID", descriptionFr: "ID unique du compte" },
        { name: "user_id", type: "INTEGER", nullable: false, description: "FK to users", descriptionFr: "FK vers users" },
        { name: "account_type", type: "VARCHAR", nullable: false, description: "Account type (checking, savings)", descriptionFr: "Type de compte (checking, savings)" },
        { name: "balance", type: "DECIMAL(12,2)", nullable: false, description: "Current balance in EUR", descriptionFr: "Solde actuel en EUR" },
        { name: "currency", type: "VARCHAR", nullable: false, description: "Currency code", descriptionFr: "Code devise" },
        { name: "opened_at", type: "DATE", nullable: false, description: "Account opening date", descriptionFr: "Date d'ouverture du compte" },
        { name: "status", type: "VARCHAR", nullable: false, description: "Account status (active, frozen, closed)", descriptionFr: "Statut du compte (active, frozen, closed)" },
      ],
    },
    {
      name: "transactions",
      description: "Financial transactions with merchant and category details",
      descriptionFr: "Transactions financières avec détails marchand et catégorie",
      rowCount: 50,
      columns: [
        { name: "transaction_id", type: "INTEGER", nullable: false, description: "Unique transaction ID", descriptionFr: "ID unique de la transaction" },
        { name: "account_id", type: "INTEGER", nullable: false, description: "FK to accounts", descriptionFr: "FK vers accounts" },
        { name: "amount", type: "DECIMAL(12,2)", nullable: false, description: "Transaction amount (negative for debits)", descriptionFr: "Montant (négatif pour les débits)" },
        { name: "transaction_type", type: "VARCHAR", nullable: false, description: "Type (purchase, deposit, withdrawal)", descriptionFr: "Type (purchase, deposit, withdrawal)" },
        { name: "merchant", type: "VARCHAR", nullable: true, description: "Merchant name (NULL for deposits/withdrawals)", descriptionFr: "Nom du marchand (NULL pour dépôts/retraits)" },
        { name: "category", type: "VARCHAR", nullable: true, description: "Spending category (can be NULL)", descriptionFr: "Catégorie de dépense (peut être NULL)" },
        { name: "transaction_date", type: "TIMESTAMP", nullable: false, description: "Transaction timestamp", descriptionFr: "Horodatage de la transaction" },
        { name: "status", type: "VARCHAR", nullable: false, description: "Status (completed, pending, flagged)", descriptionFr: "Statut (completed, pending, flagged)" },
      ],
    },
    {
      name: "cards",
      description: "Bank cards with limits and features",
      descriptionFr: "Cartes bancaires avec plafonds et fonctionnalités",
      rowCount: 15,
      columns: [
        { name: "card_id", type: "INTEGER", nullable: false, description: "Unique card ID", descriptionFr: "ID unique de la carte" },
        { name: "account_id", type: "INTEGER", nullable: false, description: "FK to accounts", descriptionFr: "FK vers accounts" },
        { name: "card_type", type: "VARCHAR", nullable: false, description: "Card type (visa_classic, visa_premier, visa_gold)", descriptionFr: "Type de carte (visa_classic, visa_premier, visa_gold)" },
        { name: "monthly_limit", type: "DECIMAL(10,2)", nullable: false, description: "Monthly spending limit", descriptionFr: "Plafond mensuel" },
        { name: "status", type: "VARCHAR", nullable: false, description: "Card status (active, blocked)", descriptionFr: "Statut de la carte (active, blocked)" },
        { name: "expiry_date", type: "DATE", nullable: false, description: "Card expiry date", descriptionFr: "Date d'expiration" },
        { name: "contactless_enabled", type: "BOOLEAN", nullable: false, description: "Contactless payment enabled", descriptionFr: "Paiement sans contact activé" },
      ],
    },
    {
      name: "kyc_checks",
      description: "Know Your Customer verification records",
      descriptionFr: "Vérifications KYC (Know Your Customer)",
      rowCount: 12,
      columns: [
        { name: "check_id", type: "INTEGER", nullable: false, description: "Unique check ID", descriptionFr: "ID unique de la vérification" },
        { name: "user_id", type: "INTEGER", nullable: false, description: "FK to users", descriptionFr: "FK vers users" },
        { name: "check_date", type: "DATE", nullable: false, description: "Verification date", descriptionFr: "Date de vérification" },
        { name: "result", type: "VARCHAR", nullable: false, description: "Result (approved, pending, rejected)", descriptionFr: "Résultat (approved, pending, rejected)" },
        { name: "document_type", type: "VARCHAR", nullable: false, description: "Document type (passport, id_card, driver_license)", descriptionFr: "Type de document (passport, id_card, driver_license)" },
        { name: "reviewer", type: "VARCHAR", nullable: true, description: "Reviewer agent (NULL if pending)", descriptionFr: "Agent vérificateur (NULL si en attente)" },
      ],
    },
    {
      name: "transfers",
      description: "Account-to-account transfers",
      descriptionFr: "Virements de compte à compte",
      rowCount: 20,
      columns: [
        { name: "transfer_id", type: "INTEGER", nullable: false, description: "Unique transfer ID", descriptionFr: "ID unique du virement" },
        { name: "sender_account_id", type: "INTEGER", nullable: false, description: "FK to sender account", descriptionFr: "FK vers le compte émetteur" },
        { name: "receiver_account_id", type: "INTEGER", nullable: false, description: "FK to receiver account", descriptionFr: "FK vers le compte bénéficiaire" },
        { name: "amount", type: "DECIMAL(12,2)", nullable: false, description: "Transfer amount", descriptionFr: "Montant du virement" },
        { name: "transfer_date", type: "TIMESTAMP", nullable: false, description: "Transfer timestamp", descriptionFr: "Horodatage du virement" },
        { name: "transfer_type", type: "VARCHAR", nullable: false, description: "Type (instant, standard)", descriptionFr: "Type (instant, standard)" },
        { name: "status", type: "VARCHAR", nullable: false, description: "Transfer status", descriptionFr: "Statut du virement" },
      ],
    },
  ],
  questions: [
    {
      id: "cb-01",
      title: "Total spending by category",
      titleFr: "Dépenses totales par catégorie",
      stakeholder: "Lisa",
      stakeholderRole: "Product Manager",
      difficulty: "easy",
      description:
        "Lisa (Product Manager) wants to understand where users spend their money. Show each spending category and the total amount spent (as a positive number), for completed purchase transactions only. Sort by total spent descending. Exclude NULL categories.",
      descriptionFr:
        "Lisa (Product Manager) veut comprendre où les utilisateurs dépensent leur argent. Affiche chaque catégorie de dépense et le montant total dépensé (en nombre positif), uniquement pour les transactions d'achat complétées. Trie par montant décroissant. Exclure les catégories NULL.",
      hint: "Filter on transaction_type = 'purchase' and status = 'completed'. Use ABS() or negate the amount. GROUP BY category.",
      hintFr: "Filtre sur transaction_type = 'purchase' et status = 'completed'. Utilise ABS() ou inverse le montant. GROUP BY category.",
      solutionQuery: `SELECT category, SUM(ABS(amount)) AS total_spent
FROM transactions
WHERE transaction_type = 'purchase'
  AND status = 'completed'
  AND category IS NOT NULL
GROUP BY category
ORDER BY total_spent DESC, category;`,
      expectedColumns: ["category", "total_spent"],
      expectedRows: [
        { category: "luxury", total_spent: 21450.00 },
        { category: "electronics", total_spent: 3170.00 },
        { category: "travel", total_spent: 1070.00 },
        { category: "sports", total_spent: 350.00 },
        { category: "clothing", total_spent: 318.50 },
        { category: "groceries", total_spent: 300.70 },
        { category: "shopping", total_spent: 240.99 },
        { category: "home", total_spent: 235.00 },
        { category: "transport", total_spent: 135.00 },
        { category: "beauty", total_spent: 55.00 },
        { category: "fuel", total_spent: 55.00  },
        { category: "food_delivery", total_spent: 44.00 },
        { category: "subscription", total_spent: 41.39 },
      ],
      orderMatters: true,
    },
    {
      id: "cb-02",
      title: "Users without KYC verification",
      titleFr: "Utilisateurs sans vérification KYC",
      stakeholder: "Fatima",
      stakeholderRole: "Compliance Officer",
      difficulty: "easy",
      description:
        "Fatima (Compliance Officer) needs to identify users who have never undergone a KYC check. Show their first name, last name, email, and registration date. Sort by registration date.",
      descriptionFr:
        "Fatima (Compliance Officer) doit identifier les utilisateurs qui n'ont jamais fait l'objet d'une vérification KYC. Affiche leur prénom, nom, email et date d'inscription. Trie par date d'inscription.",
      hint: "Use a LEFT JOIN between users and kyc_checks, then filter WHERE check_id IS NULL.",
      hintFr: "Utilise un LEFT JOIN entre users et kyc_checks, puis filtre WHERE check_id IS NULL.",
      solutionQuery: `SELECT u.first_name, u.last_name, u.email, u.created_at
FROM users u
LEFT JOIN kyc_checks k ON u.user_id = k.user_id
WHERE k.check_id IS NULL
ORDER BY u.created_at;`,
      expectedColumns: ["first_name", "last_name", "email", "created_at"],
      expectedRows: [
        { first_name: "Fatou", last_name: "Diallo", email: "fatou.diallo@email.com", created_at: "2023-05-18" },
        { first_name: "Maxime", last_name: "Roux", email: "maxime.roux@email.com", created_at: "2023-06-01" },
        { first_name: "Lucas", last_name: "Fournier", email: "lucas.fournier@email.com", created_at: "2023-07-01" },
        { first_name: "Nora", last_name: "Khelifi", email: "nora.khelifi@email.com", created_at: "2023-07-20" },
        { first_name: "Rémi", last_name: "Blanc", email: "remi.blanc@email.com", created_at: "2023-08-05" },
        { first_name: "Camille", last_name: "Dufresne", email: "camille.dufresne@email.com", created_at: "2023-08-22" },
        { first_name: "Omar", last_name: "Benali", email: "omar.benali@email.com", created_at: "2023-09-10" },
        { first_name: "Elise", last_name: "Marchand", email: "elise.marchand@email.com", created_at: "2023-09-25" },
      ],
      orderMatters: true,
    },
    {
      id: "cb-03",
      title: "High-value transactions without approved KYC",
      titleFr: "Transactions élevées sans KYC approuvé",
      stakeholder: "Fatima",
      stakeholderRole: "Compliance Officer",
      difficulty: "hard",
      description:
        "Fatima (Compliance Officer) is preparing for an audit. She needs to find all completed purchase transactions over 1000 EUR made by users who do NOT have an approved KYC check. Show the user's full name, the transaction amount (as a positive number), the merchant, the transaction date, and the user's KYC status. Sort by amount descending.",
      descriptionFr:
        "Fatima (Compliance Officer) prépare un audit. Elle doit trouver toutes les transactions d'achat complétées de plus de 1000 EUR effectuées par des utilisateurs qui N'ONT PAS de vérification KYC approuvée. Affiche le nom complet de l'utilisateur, le montant (en positif), le marchand, la date de transaction et le statut KYC. Trie par montant décroissant.",
      hint: "Join transactions → accounts → users. Use NOT EXISTS or LEFT JOIN on kyc_checks WHERE result = 'approved'. Filter ABS(amount) > 1000.",
      hintFr: "Jointure transactions → accounts → users. Utilise NOT EXISTS ou LEFT JOIN sur kyc_checks WHERE result = 'approved'. Filtre ABS(amount) > 1000.",
      solutionQuery: `SELECT
  u.first_name || ' ' || u.last_name AS full_name,
  ABS(t.amount) AS transaction_amount,
  t.merchant,
  t.transaction_date,
  u.kyc_status
FROM transactions t
JOIN accounts a ON t.account_id = a.account_id
JOIN users u ON a.user_id = u.user_id
WHERE t.transaction_type = 'purchase'
  AND t.status = 'completed'
  AND ABS(t.amount) > 1000
  AND NOT EXISTS (
    SELECT 1 FROM kyc_checks k
    WHERE k.user_id = u.user_id
      AND k.result = 'approved'
  )
ORDER BY transaction_amount DESC;`,
      expectedColumns: ["full_name", "transaction_amount", "merchant", "transaction_date", "kyc_status"],
      expectedRows: [
        { full_name: "Lucas Fournier", transaction_amount: 3500.00, merchant: "Chanel", transaction_date: "2024-03-05 16:30:00", kyc_status: "verified" },
        { full_name: "Omar Benali", transaction_amount: 3100.00, merchant: "Van Cleef", transaction_date: "2024-04-05 11:20:00", kyc_status: "verified" },
        { full_name: "Lucas Fournier", transaction_amount: 2800.00, merchant: "Hermes", transaction_date: "2024-03-05 17:00:00", kyc_status: "verified" },
        { full_name: "Omar Benali", transaction_amount: 2200.00, merchant: "Cartier", transaction_date: "2024-04-05 10:00:00", kyc_status: "verified" },
        { full_name: "Omar Benali", transaction_amount: 1950.00, merchant: "Bulgari", transaction_date: "2024-04-05 10:45:00", kyc_status: "verified" },
        { full_name: "Lucas Fournier", transaction_amount: 1900.00, merchant: "Dior", transaction_date: "2024-03-05 17:30:00", kyc_status: "verified" },
        { full_name: "Lucas Fournier", transaction_amount: 1200.00, merchant: "Louis Vuitton", transaction_date: "2024-02-12 14:30:00", kyc_status: "verified" },
      ],
      orderMatters: true,
    },
    {
      id: "cb-04",
      title: "Rapid-fire luxury purchases (fraud pattern)",
      titleFr: "Achats luxe en rafale (pattern fraude)",
      stakeholder: "David",
      stakeholderRole: "Risk Manager",
      difficulty: "hard",
      description:
        "David (Risk Manager) wants to detect potential fraud: users who made 3 or more purchase transactions on the same day. Show the user's full name, the transaction date (date only), the number of transactions that day, and the total amount spent (as a positive number). Sort by total amount descending.",
      descriptionFr:
        "David (Risk Manager) veut détecter une fraude potentielle : les utilisateurs ayant effectué 3 transactions d'achat ou plus le même jour. Affiche le nom complet, la date (jour uniquement), le nombre de transactions ce jour-là et le montant total dépensé (en positif). Trie par montant total décroissant.",
      hint: "Cast transaction_date to DATE to group by day. Join through accounts to users. HAVING COUNT(*) >= 3.",
      hintFr: "Cast transaction_date en DATE pour regrouper par jour. Jointure via accounts vers users. HAVING COUNT(*) >= 3.",
      solutionQuery: `SELECT
  u.first_name || ' ' || u.last_name AS full_name,
  CAST(t.transaction_date AS DATE) AS transaction_day,
  COUNT(*) AS transaction_count,
  SUM(ABS(t.amount)) AS total_amount
FROM transactions t
JOIN accounts a ON t.account_id = a.account_id
JOIN users u ON a.user_id = u.user_id
WHERE t.transaction_type = 'purchase'
GROUP BY u.user_id, u.first_name, u.last_name, CAST(t.transaction_date AS DATE)
HAVING COUNT(*) >= 3
ORDER BY total_amount DESC;`,
      expectedColumns: ["full_name", "transaction_day", "transaction_count", "total_amount"],
      expectedRows: [
        { full_name: "Lucas Fournier", transaction_day: "2024-03-05", transaction_count: 3, total_amount: 8200.00 },
        { full_name: "Omar Benali", transaction_day: "2024-04-05", transaction_count: 3, total_amount: 7250.00 },
      ],
      orderMatters: true,
    },
    {
      id: "cb-05",
      title: "Feature adoption: contactless by age group",
      titleFr: "Adoption fonctionnalité : sans contact par tranche d'âge",
      stakeholder: "Lisa",
      stakeholderRole: "Product Manager",
      difficulty: "medium",
      description:
        "Lisa (Product Manager) wants to measure contactless payment adoption across age groups. Classify users into age groups based on their birth year: '25-29' (born 1997-2001), '30-34' (born 1992-1996), '35-40' (born 1986-1991). For each age group, show the total number of cards and the number with contactless enabled, plus the adoption rate as a percentage rounded to 1 decimal. Sort by age group.",
      descriptionFr:
        "Lisa (Product Manager) veut mesurer l'adoption du paiement sans contact par tranche d'âge. Classe les utilisateurs en groupes : '25-29' (nés 1997-2001), '30-34' (nés 1992-1996), '35-40' (nés 1986-1991). Pour chaque groupe, affiche le nombre total de cartes, le nombre avec sans contact activé et le taux d'adoption en pourcentage arrondi à 1 décimale. Trie par tranche d'âge.",
      hint: "Use CASE WHEN on EXTRACT(YEAR FROM date_of_birth) to create age groups. Join users → accounts → cards.",
      hintFr: "Utilise CASE WHEN sur EXTRACT(YEAR FROM date_of_birth) pour créer les tranches d'âge. Jointure users → accounts → cards.",
      solutionQuery: `SELECT
  CASE
    WHEN EXTRACT(YEAR FROM u.date_of_birth) BETWEEN 1997 AND 2001 THEN '25-29'
    WHEN EXTRACT(YEAR FROM u.date_of_birth) BETWEEN 1992 AND 1996 THEN '30-34'
    WHEN EXTRACT(YEAR FROM u.date_of_birth) BETWEEN 1986 AND 1991 THEN '35-40'
  END AS age_group,
  COUNT(*) AS total_cards,
  COUNT(*) FILTER (WHERE c.contactless_enabled = true) AS contactless_cards,
  ROUND(100.0 * COUNT(*) FILTER (WHERE c.contactless_enabled = true) / COUNT(*), 1) AS adoption_rate
FROM users u
JOIN accounts a ON u.user_id = a.user_id
JOIN cards c ON a.account_id = c.account_id
WHERE EXTRACT(YEAR FROM u.date_of_birth) BETWEEN 1986 AND 2001
GROUP BY age_group
ORDER BY age_group;`,
      expectedColumns: ["age_group", "total_cards", "contactless_cards", "adoption_rate"],
      expectedRows: [
        { age_group: "25-29", total_cards: 2, contactless_cards: 0, adoption_rate: 0.0 },
        { age_group: "30-34", total_cards: 6, contactless_cards: 5, adoption_rate: 83.3 },
        { age_group: "35-40", total_cards: 7, contactless_cards: 7, adoption_rate: 100.0 },
      ],
      orderMatters: true,
    },
    {
      id: "cb-06",
      title: "Account balance distribution",
      titleFr: "Répartition des soldes de comptes",
      stakeholder: "David",
      stakeholderRole: "Risk Manager",
      difficulty: "medium",
      description:
        "David (Risk Manager) needs a balance tier analysis for active accounts. Classify accounts into tiers: 'low' (balance < 1000), 'medium' (1000-9999.99), 'high' (10000-49999.99), 'premium' (50000+). Show the tier, number of accounts, and average balance rounded to 2 decimals. Sort by average balance descending.",
      descriptionFr:
        "David (Risk Manager) a besoin d'une analyse par tranche de solde pour les comptes actifs. Classe les comptes : 'low' (solde < 1000), 'medium' (1000-9999.99), 'high' (10000-49999.99), 'premium' (50000+). Affiche la tranche, le nombre de comptes et le solde moyen arrondi à 2 décimales. Trie par solde moyen décroissant.",
      hint: "Use CASE WHEN on balance to create tiers. Filter on status = 'active'. GROUP BY the tier.",
      hintFr: "Utilise CASE WHEN sur balance pour créer les tranches. Filtre sur status = 'active'. GROUP BY la tranche.",
      solutionQuery: `SELECT
  CASE
    WHEN balance >= 50000 THEN 'premium'
    WHEN balance >= 10000 THEN 'high'
    WHEN balance >= 1000 THEN 'medium'
    ELSE 'low'
  END AS balance_tier,
  COUNT(*) AS account_count,
  ROUND(AVG(balance), 2) AS avg_balance
FROM accounts
WHERE status = 'active'
GROUP BY balance_tier
ORDER BY avg_balance DESC;`,
      expectedColumns: ["balance_tier", "account_count", "avg_balance"],
      expectedRows: [
        { balance_tier: "premium", account_count: 1, avg_balance: 67500.0 },
        { balance_tier: "high", account_count: 5, avg_balance: 21260.1 },
        { balance_tier: "medium", account_count: 9, avg_balance: 5028.97 },
        { balance_tier: "low", account_count: 3, avg_balance: 743.58 },
      ],
      orderMatters: true,
    },
    {
      id: "cb-07",
      title: "Transfer network: top senders and receivers",
      titleFr: "Réseau de virements : top émetteurs et récepteurs",
      stakeholder: "David",
      stakeholderRole: "Risk Manager",
      difficulty: "medium",
      description:
        "David (Risk Manager) wants to analyze the transfer network. For each user who has sent OR received transfers, show their full name, total amount sent, total amount received, and net position (received minus sent). Sort by absolute net position descending. Only include users with at least one transfer (sent or received).",
      descriptionFr:
        "David (Risk Manager) veut analyser le réseau de virements. Pour chaque utilisateur ayant envoyé OU reçu des virements, affiche le nom complet, le total envoyé, le total reçu et la position nette (reçu moins envoyé). Trie par valeur absolue de la position nette décroissante. N'inclure que les utilisateurs avec au moins un virement.",
      hint: "Use two CTEs: one for sent totals, one for received totals. FULL OUTER JOIN them, then join with users through accounts. Use COALESCE for NULLs.",
      hintFr: "Utilise deux CTEs : un pour les totaux envoyés, un pour les totaux reçus. FULL OUTER JOIN, puis jointure avec users via accounts. Utilise COALESCE pour les NULLs.",
      solutionQuery: `WITH sent AS (
  SELECT a.user_id, SUM(t.amount) AS total_sent
  FROM transfers t
  JOIN accounts a ON t.sender_account_id = a.account_id
  GROUP BY a.user_id
),
received AS (
  SELECT a.user_id, SUM(t.amount) AS total_received
  FROM transfers t
  JOIN accounts a ON t.receiver_account_id = a.account_id
  GROUP BY a.user_id
)
SELECT
  u.first_name || ' ' || u.last_name AS full_name,
  COALESCE(s.total_sent, 0) AS total_sent,
  COALESCE(r.total_received, 0) AS total_received,
  COALESCE(r.total_received, 0) - COALESCE(s.total_sent, 0) AS net_position
FROM users u
LEFT JOIN sent s ON u.user_id = s.user_id
LEFT JOIN received r ON u.user_id = r.user_id
WHERE s.total_sent IS NOT NULL OR r.total_received IS NOT NULL
ORDER BY ABS(COALESCE(r.total_received, 0) - COALESCE(s.total_sent, 0)) DESC;`,
      expectedColumns: ["full_name", "total_sent", "total_received", "net_position"],
      expectedRows: [
        { full_name: "Lucas Fournier", total_sent: 10000.00, total_received: 0.00, net_position: -10000.00 },
        { full_name: "Maxime Roux", total_sent: 1050.00, total_received: 5000.00, net_position: 3950.00 },
        { full_name: "Omar Benali", total_sent: 350.00, total_received: 3800.00, net_position: 3450.00 },
        { full_name: "Thomas Berger", total_sent: 1200.00, total_received: 3700.00, net_position: 2500.00 },
        { full_name: "Yasmine Farid", total_sent: 0.00, total_received: 1750.00, net_position: 1750.00 },
        { full_name: "Karim Mansouri", total_sent: 2100.00, total_received: 450.00, net_position: -1650.00 },
        { full_name: "Pierre Lambert", total_sent: 1200.00, total_received: 0.00, net_position: -1200.00 },
        { full_name: "Amina Belhaj", total_sent: 725.00, total_received: 1900.00, net_position: 1175.00 },
        { full_name: "Julien Morel", total_sent: 800.00, total_received: 0.00, net_position: -800.00 },
        { full_name: "Léa Duval", total_sent: 0.00, total_received: 325.00, net_position: 325.00 },
        { full_name: "Rémi Blanc", total_sent: 0.00, total_received: 275.00, net_position: 275.00 },
        { full_name: "Fatou Diallo", total_sent: 100.00, total_received: 250.00, net_position: 150.00 },
        { full_name: "Elise Marchand", total_sent: 275.00, total_received: 350.00, net_position: 75.00 },
      ],
      orderMatters: true,
    },
    {
      id: "cb-08",
      title: "Card utilization rate by card type",
      titleFr: "Taux d'utilisation des cartes par type",
      stakeholder: "Lisa",
      stakeholderRole: "Product Manager",
      difficulty: "medium",
      description:
        "Lisa (Product Manager) wants to measure card usage. For each card type, show the number of active cards, the average monthly limit, and the average total purchase spend per card (absolute value of completed purchases). Round averages to 2 decimals. Sort by card type.",
      descriptionFr:
        "Lisa (Product Manager) veut mesurer l'utilisation des cartes. Pour chaque type de carte, affiche le nombre de cartes actives, le plafond mensuel moyen et la dépense moyenne d'achat par carte (valeur absolue des achats complétés). Arrondis les moyennes à 2 décimales. Trie par type de carte.",
      hint: "Join cards with transactions through account_id. Filter on active cards and completed purchases. Use AVG for limits and spending.",
      hintFr: "Jointure cards avec transactions via account_id. Filtre sur les cartes actives et achats complétés. Utilise AVG pour les plafonds et dépenses.",
      solutionQuery: `WITH card_spending AS (
  SELECT
    c.card_id,
    c.card_type,
    c.monthly_limit,
    COALESCE(SUM(ABS(t.amount)) FILTER (WHERE t.transaction_type = 'purchase' AND t.status = 'completed'), 0) AS total_spend
  FROM cards c
  LEFT JOIN transactions t ON c.account_id = t.account_id
  WHERE c.status = 'active'
  GROUP BY c.card_id, c.card_type, c.monthly_limit
)
SELECT
  card_type,
  COUNT(*) AS active_cards,
  ROUND(AVG(monthly_limit), 2) AS avg_monthly_limit,
  ROUND(AVG(total_spend), 2) AS avg_spend_per_card
FROM card_spending
GROUP BY card_type
ORDER BY card_type;`,
      expectedColumns: ["card_type", "active_cards", "avg_monthly_limit", "avg_spend_per_card"],
      expectedRows: [
        { card_type: "visa_classic", active_cards: 7, avg_monthly_limit: 1228.57, avg_spend_per_card: 114.8 },
        { card_type: "visa_gold", active_cards: 2, avg_monthly_limit: 9000.0, avg_spend_per_card: 5935.0 },
        { card_type: "visa_premier", active_cards: 4, avg_monthly_limit: 4500.0, avg_spend_per_card: 3343.75 },
      ],
      orderMatters: true,
    },
    {
      id: "cb-09",
      title: "KYC compliance rate by document type",
      titleFr: "Taux de conformité KYC par type de document",
      stakeholder: "Fatima",
      stakeholderRole: "Compliance Officer",
      difficulty: "hard",
      description:
        "Fatima (Compliance Officer) wants a compliance dashboard. For each document type used in KYC checks, show the total number of checks, the number approved, the number rejected, the number still pending, and the approval rate (percentage of approved out of total, rounded to 1 decimal). Sort by approval rate descending.",
      descriptionFr:
        "Fatima (Compliance Officer) veut un tableau de bord de conformité. Pour chaque type de document utilisé dans les vérifications KYC, affiche le nombre total de vérifications, le nombre approuvé, le nombre rejeté, le nombre en attente et le taux d'approbation (pourcentage d'approuvés sur le total, arrondi à 1 décimale). Trie par taux d'approbation décroissant.",
      hint: "Use conditional aggregation: COUNT(*) FILTER (WHERE result = 'approved'), etc. GROUP BY document_type.",
      hintFr: "Utilise l'agrégation conditionnelle : COUNT(*) FILTER (WHERE result = 'approved'), etc. GROUP BY document_type.",
      solutionQuery: `SELECT
  document_type,
  COUNT(*) AS total_checks,
  COUNT(*) FILTER (WHERE result = 'approved') AS approved,
  COUNT(*) FILTER (WHERE result = 'rejected') AS rejected,
  COUNT(*) FILTER (WHERE result = 'pending') AS pending,
  ROUND(100.0 * COUNT(*) FILTER (WHERE result = 'approved') / COUNT(*), 1) AS approval_rate
FROM kyc_checks
GROUP BY document_type
ORDER BY approval_rate DESC, document_type;`,
      expectedColumns: ["document_type", "total_checks", "approved", "rejected", "pending", "approval_rate"],
      expectedRows: [
        { document_type: "passport", total_checks: 4, approved: 4, rejected: 0, pending: 0, approval_rate: 100.0 },
        { document_type: "driver_license", total_checks: 2, approved: 1, rejected: 0, pending: 1, approval_rate: 50.0 },
        { document_type: "id_card", total_checks: 6, approved: 3, rejected: 2, pending: 1, approval_rate: 50.0 },
      ],
      orderMatters: true,
    },
    {
      id: "cb-10",
      title: "Monthly transaction volume with running total",
      titleFr: "Volume de transactions mensuel avec cumul glissant",
      stakeholder: "David",
      stakeholderRole: "Risk Manager",
      difficulty: "hard",
      description:
        "David (Risk Manager) needs a monthly report showing the number of transactions, total transaction value (absolute values of all completed transactions including deposits and withdrawals), and a running total of transaction value month over month. Show the month (first day), transaction count, monthly total value, and cumulative total value. Sort chronologically.",
      descriptionFr:
        "David (Risk Manager) a besoin d'un rapport mensuel montrant le nombre de transactions, la valeur totale des transactions (valeurs absolues de toutes les transactions complétées y compris dépôts et retraits) et un cumul glissant de la valeur mois par mois. Affiche le mois (premier jour), le nombre de transactions, la valeur mensuelle et la valeur cumulée. Trie chronologiquement.",
      hint: "First aggregate by month using DATE_TRUNC. Then use SUM() OVER (ORDER BY month ROWS UNBOUNDED PRECEDING) for the running total.",
      hintFr: "D'abord agrège par mois avec DATE_TRUNC. Puis utilise SUM() OVER (ORDER BY month ROWS UNBOUNDED PRECEDING) pour le cumul.",
      solutionQuery: `WITH monthly AS (
  SELECT
    DATE_TRUNC('month', transaction_date) AS month,
    COUNT(*) AS transaction_count,
    SUM(ABS(amount)) AS monthly_value
  FROM transactions
  WHERE status = 'completed'
  GROUP BY DATE_TRUNC('month', transaction_date)
)
SELECT
  month,
  transaction_count,
  monthly_value,
  SUM(monthly_value) OVER (ORDER BY month ROWS UNBOUNDED PRECEDING) AS cumulative_value
FROM monthly
ORDER BY month;`,
      expectedColumns: ["month", "transaction_count", "monthly_value", "cumulative_value"],
      expectedRows: [
        { month: "2024-01-01", transaction_count: 10, monthly_value: 5431.89, cumulative_value: 5431.89 },
        { month: "2024-02-01", transaction_count: 13, monthly_value: 9508.70, cumulative_value: 14940.59 },
        { month: "2024-03-01", transaction_count: 15, monthly_value: 19554.00, cumulative_value: 34494.59 },
        { month: "2024-04-01", transaction_count: 10, monthly_value: 13070.99, cumulative_value: 47565.58 },
      ],
      orderMatters: true,
    },
  ],
};
