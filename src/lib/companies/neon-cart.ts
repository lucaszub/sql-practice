import type { CompanyProfile } from "./types";

const schema = `
CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  city VARCHAR,
  signup_date DATE NOT NULL,
  referral_source VARCHAR
);

CREATE TABLE products (
  product_id INTEGER PRIMARY KEY,
  product_name VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL,
  supplier VARCHAR NOT NULL
);

CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(customer_id),
  order_date DATE NOT NULL,
  status VARCHAR NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  channel VARCHAR NOT NULL
);

CREATE TABLE order_items (
  order_item_id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(order_id),
  product_id INTEGER NOT NULL REFERENCES products(product_id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL
);

CREATE TABLE returns (
  return_id INTEGER PRIMARY KEY,
  order_item_id INTEGER NOT NULL REFERENCES order_items(order_item_id),
  return_date DATE NOT NULL,
  reason VARCHAR NOT NULL,
  refund_status VARCHAR NOT NULL
);

CREATE TABLE reviews (
  review_id INTEGER PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(product_id),
  customer_id INTEGER NOT NULL REFERENCES customers(customer_id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment VARCHAR,
  review_date DATE NOT NULL
);

-- Customers (25 rows)
INSERT INTO customers VALUES
  (1, 'Alice', 'Martin', 'alice.martin@email.com', 'Paris', '2023-01-15', 'google'),
  (2, 'Bob', 'Dupont', 'bob.dupont@email.com', 'Lyon', '2023-02-20', 'instagram'),
  (3, 'Clara', 'Leroy', 'clara.leroy@email.com', 'Marseille', '2023-03-10', 'google'),
  (4, 'David', 'Moreau', 'david.moreau@email.com', 'Toulouse', '2023-03-22', NULL),
  (5, 'Emma', 'Simon', 'emma.simon@email.com', 'Nice', '2023-04-05', 'friend'),
  (6, 'Florian', 'Laurent', 'florian.l@email.com', 'Nantes', '2023-04-18', 'google'),
  (7, 'Gabrielle', 'Michel', 'gab.michel@email.com', 'Strasbourg', '2023-05-01', 'instagram'),
  (8, 'Hugo', 'Garcia', 'hugo.garcia@email.com', 'Bordeaux', '2023-05-14', NULL),
  (9, 'Inès', 'Thomas', 'ines.thomas@email.com', 'Lille', '2023-06-02', 'friend'),
  (10, 'Jules', 'Robert', 'jules.robert@email.com', 'Paris', '2023-06-19', 'google'),
  (11, 'Karine', 'Petit', 'karine.petit@email.com', 'Lyon', '2023-07-08', 'tiktok'),
  (12, 'Lucas', 'Durand', 'lucas.durand@email.com', 'Marseille', '2023-07-25', NULL),
  (13, 'Marie', 'Lefevre', 'marie.lefevre@email.com', 'Paris', '2023-08-12', 'google'),
  (14, 'Nathan', 'Roux', 'nathan.roux@email.com', 'Toulouse', '2023-08-30', 'instagram'),
  (15, 'Olivia', 'Fontaine', 'olivia.font@email.com', NULL, '2023-09-15', 'friend'),
  (16, 'Pierre', 'Chevalier', 'pierre.chev@email.com', 'Nice', '2023-09-28', 'google'),
  (17, 'Quentin', 'Blanc', 'quentin.b@email.com', 'Nantes', '2023-10-10', NULL),
  (18, 'Rose', 'Guerin', 'rose.guerin@email.com', 'Bordeaux', '2023-10-22', 'tiktok'),
  (19, 'Samuel', 'Perrin', 'samuel.perrin@email.com', 'Strasbourg', '2023-11-05', 'google'),
  (20, 'Théa', 'Clement', 'thea.clement@email.com', 'Lille', '2023-11-18', 'instagram'),
  (21, 'Ugo', 'Faure', 'ugo.faure@email.com', 'Paris', '2023-12-01', NULL),
  (22, 'Valentine', 'Andre', 'val.andre@email.com', 'Lyon', '2023-12-15', 'friend'),
  (23, 'William', 'Mercier', 'william.m@email.com', 'Marseille', '2024-01-08', 'google'),
  (24, 'Xena', 'Dubois', 'xena.dubois@email.com', NULL, '2024-01-22', 'tiktok'),
  (25, 'Yann', 'Girard', 'yann.girard@email.com', 'Paris', '2024-02-05', 'google');

-- Products (20 rows)
INSERT INTO products VALUES
  (1, 'Wireless Keyboard', 'Peripherals', 49.99, 150, 'TechVibe'),
  (2, 'Gaming Mouse', 'Peripherals', 79.99, 80, 'TechVibe'),
  (3, 'USB-C Hub 7-port', 'Accessories', 34.99, 200, 'ConnectPlus'),
  (4, 'Mechanical Keyboard RGB', 'Peripherals', 129.99, 45, 'TechVibe'),
  (5, '27" 4K Monitor', 'Monitors', 399.99, 30, 'ScreenPro'),
  (6, '24" FHD Monitor', 'Monitors', 199.99, 55, 'ScreenPro'),
  (7, 'Webcam 1080p', 'Accessories', 59.99, 120, 'ConnectPlus'),
  (8, 'Noise-Canceling Headset', 'Audio', 149.99, 60, 'SoundWave'),
  (9, 'Bluetooth Speaker', 'Audio', 39.99, 90, 'SoundWave'),
  (10, 'Laptop Stand Adjustable', 'Accessories', 29.99, 180, 'DeskCraft'),
  (11, 'Mouse Pad XL', 'Accessories', 14.99, 300, 'DeskCraft'),
  (12, 'External SSD 1TB', 'Storage', 89.99, 70, 'DataVault'),
  (13, 'External SSD 2TB', 'Storage', 149.99, 40, 'DataVault'),
  (14, 'USB Microphone', 'Audio', 99.99, 50, 'SoundWave'),
  (15, 'HDMI Cable 2m', 'Accessories', 12.99, 500, 'ConnectPlus'),
  (16, 'Wireless Charger', 'Accessories', 24.99, 160, 'TechVibe'),
  (17, 'Retro Game Console', 'Gaming', 69.99, 35, 'PixelPlay'),
  (18, 'Pro Controller', 'Gaming', 54.99, 75, 'PixelPlay'),
  (19, 'LED Desk Lamp', 'Accessories', 44.99, 110, 'DeskCraft'),
  (20, 'Cable Management Kit', 'Accessories', 19.99, 220, 'DeskCraft');

-- Orders (30 rows)
INSERT INTO orders VALUES
  (1, 1, '2024-01-05', 'delivered', 129.98, 'web'),
  (2, 2, '2024-01-08', 'delivered', 79.99, 'mobile'),
  (3, 3, '2024-01-12', 'delivered', 434.98, 'web'),
  (4, 1, '2024-01-18', 'delivered', 149.99, 'web'),
  (5, 5, '2024-01-22', 'delivered', 59.99, 'mobile'),
  (6, 4, '2024-01-28', 'delivered', 199.99, 'web'),
  (7, 6, '2024-02-03', 'delivered', 94.98, 'mobile'),
  (8, 7, '2024-02-08', 'delivered', 399.99, 'web'),
  (9, 8, '2024-02-14', 'delivered', 249.98, 'web'),
  (10, 2, '2024-02-18', 'delivered', 89.99, 'mobile'),
  (11, 10, '2024-02-25', 'delivered', 129.99, 'web'),
  (12, 9, '2024-03-01', 'delivered', 44.99, 'mobile'),
  (13, 11, '2024-03-05', 'delivered', 169.98, 'web'),
  (14, 3, '2024-03-10', 'delivered', 149.99, 'web'),
  (15, 12, '2024-03-15', 'delivered', 79.99, 'mobile'),
  (16, 13, '2024-03-20', 'delivered', 524.98, 'web'),
  (17, 14, '2024-03-25', 'shipped', 54.99, 'mobile'),
  (18, 15, '2024-03-28', 'delivered', 99.99, 'web'),
  (19, 5, '2024-04-02', 'delivered', 129.99, 'web'),
  (20, 16, '2024-04-08', 'delivered', 34.99, 'mobile'),
  (21, 1, '2024-04-12', 'delivered', 89.99, 'web'),
  (22, 17, '2024-04-18', 'delivered', 69.99, 'mobile'),
  (23, 18, '2024-04-22', 'cancelled', 199.99, 'web'),
  (24, 19, '2024-04-28', 'delivered', 179.98, 'web'),
  (25, 20, '2024-05-03', 'delivered', 49.99, 'mobile'),
  (26, 21, '2024-05-08', 'delivered', 399.99, 'web'),
  (27, 22, '2024-05-15', 'shipped', 159.98, 'mobile'),
  (28, 23, '2024-05-20', 'delivered', 44.99, 'web'),
  (29, 10, '2024-05-25', 'delivered', 149.99, 'web'),
  (30, 24, '2024-05-30', 'pending', 239.98, 'mobile');

-- Order items (50 rows)
INSERT INTO order_items VALUES
  (1, 1, 1, 1, 49.99),
  (2, 1, 2, 1, 79.99),
  (3, 2, 2, 1, 79.99),
  (4, 3, 5, 1, 399.99),
  (5, 3, 3, 1, 34.99),
  (6, 4, 8, 1, 149.99),
  (7, 5, 7, 1, 59.99),
  (8, 6, 6, 1, 199.99),
  (9, 7, 9, 1, 39.99),
  (10, 7, 18, 1, 54.99),
  (11, 8, 5, 1, 399.99),
  (12, 9, 8, 1, 149.99),
  (13, 9, 14, 1, 99.99),
  (14, 10, 12, 1, 89.99),
  (15, 11, 4, 1, 129.99),
  (16, 12, 19, 1, 44.99),
  (17, 13, 4, 1, 129.99),
  (18, 13, 9, 1, 39.99),
  (19, 14, 13, 1, 149.99),
  (20, 15, 2, 1, 79.99),
  (21, 16, 5, 1, 399.99),
  (22, 16, 16, 2, 24.99),
  (23, 16, 15, 4, 12.99),
  (24, 17, 18, 1, 54.99),
  (25, 18, 14, 1, 99.99),
  (26, 19, 4, 1, 129.99),
  (27, 20, 3, 1, 34.99),
  (28, 21, 12, 1, 89.99),
  (29, 22, 17, 1, 69.99),
  (30, 23, 6, 1, 199.99),
  (31, 24, 8, 1, 149.99),
  (32, 24, 10, 1, 29.99),
  (33, 25, 1, 1, 49.99),
  (34, 26, 5, 1, 399.99),
  (35, 27, 13, 1, 149.99),
  (36, 27, 11, 1, 14.99),
  (37, 28, 19, 1, 44.99),
  (38, 29, 8, 1, 149.99),
  (39, 30, 12, 1, 89.99),
  (40, 30, 8, 1, 149.99),
  (41, 9, 13, 1, 149.99),
  (42, 13, 11, 1, 14.99),
  (43, 16, 11, 2, 14.99),
  (44, 3, 15, 2, 12.99),
  (45, 7, 11, 1, 14.99),
  (46, 24, 15, 2, 12.99),
  (47, 9, 3, 2, 34.99),
  (48, 1, 11, 2, 14.99),
  (49, 16, 3, 1, 34.99),
  (50, 6, 15, 3, 12.99);

-- Returns (8 rows)
INSERT INTO returns VALUES
  (1, 3, '2024-01-20', 'defective', 'refunded'),
  (2, 7, '2024-02-01', 'wrong_item', 'refunded'),
  (3, 11, '2024-02-18', 'changed_mind', 'refunded'),
  (4, 12, '2024-02-25', 'defective', 'pending'),
  (5, 20, '2024-03-25', 'changed_mind', 'refunded'),
  (6, 22, '2024-04-10', 'too_expensive', 'denied'),
  (7, 30, '2024-05-05', 'defective', 'refunded'),
  (8, 35, '2024-05-28', 'wrong_item', 'pending');

-- Reviews (15 rows)
INSERT INTO reviews VALUES
  (1, 1, 1, 4, 'Great keyboard, smooth typing', '2024-01-20'),
  (2, 2, 2, 5, 'Best mouse I ever owned!', '2024-01-25'),
  (3, 5, 3, 5, 'Stunning display quality', '2024-01-30'),
  (4, 8, 1, 4, 'Good sound isolation', '2024-02-05'),
  (5, 5, 7, 4, 'Amazing monitor', '2024-02-15'),
  (6, 2, 12, 3, 'Average mouse, nothing special', '2024-03-18'),
  (7, 4, 11, 5, 'Perfect keyboard for coding', '2024-03-10'),
  (8, 12, 10, 4, 'Fast transfer speeds', '2024-03-08'),
  (9, 9, 9, 2, 'Sound quality is mediocre', '2024-03-15'),
  (10, 6, 8, 4, 'Good value for the price', '2024-02-20'),
  (11, 14, 14, 5, 'Crystal clear audio recording', '2024-04-05'),
  (12, 17, 22, 4, 'Fun retro gaming experience', '2024-04-25'),
  (13, 13, 3, NULL, NULL, '2024-04-15'),
  (14, 19, 19, 3, 'Decent lamp, a bit dim', '2024-05-10'),
  (15, 4, 4, 5, 'Clicky and satisfying', '2024-03-28');
`;

export const neonCart: CompanyProfile = {
  id: "neon-cart",
  name: "NeonCart",
  tagline: "Futuristic e-commerce for geeks",
  taglineFr: "L'e-commerce futuriste pour geeks",
  sector: "E-commerce",
  sectorFr: "E-commerce",
  icon: "🛒",
  description:
    "You just joined the data team at NeonCart, a fast-growing online marketplace for tech, gaming, and gadgets. Founded in 2021 by two retro-gaming enthusiasts, the company grew from 50 to 2,000 orders/month in 3 years. The 3-person data team is overwhelmed and you're here to help.",
  descriptionFr:
    "Tu viens de rejoindre l'équipe data de NeonCart, une marketplace en ligne en pleine croissance spécialisée dans les produits tech, gaming et gadgets. Fondée en 2021 par deux passionnés de rétro-gaming, l'entreprise est passée de 50 à 2 000 commandes/mois en 3 ans. L'équipe data (3 personnes) est débordée et tu es là pour les aider.",
  schema,
  tables: [
    {
      name: "customers",
      description: "Registered customers with signup info",
      descriptionFr: "Clients inscrits avec leurs informations",
      rowCount: 25,
      columns: [
        { name: "customer_id", type: "INTEGER", nullable: false, description: "Unique customer ID", descriptionFr: "ID unique du client" },
        { name: "first_name", type: "VARCHAR", nullable: false, description: "First name", descriptionFr: "Prénom" },
        { name: "last_name", type: "VARCHAR", nullable: false, description: "Last name", descriptionFr: "Nom de famille" },
        { name: "email", type: "VARCHAR", nullable: false, description: "Email address", descriptionFr: "Adresse email" },
        { name: "city", type: "VARCHAR", nullable: true, description: "City (can be NULL)", descriptionFr: "Ville (peut être NULL)" },
        { name: "signup_date", type: "DATE", nullable: false, description: "Registration date", descriptionFr: "Date d'inscription" },
        { name: "referral_source", type: "VARCHAR", nullable: true, description: "Acquisition channel", descriptionFr: "Canal d'acquisition" },
      ],
    },
    {
      name: "products",
      description: "Product catalog with categories and pricing",
      descriptionFr: "Catalogue produits avec catégories et prix",
      rowCount: 20,
      columns: [
        { name: "product_id", type: "INTEGER", nullable: false, description: "Unique product ID", descriptionFr: "ID unique du produit" },
        { name: "product_name", type: "VARCHAR", nullable: false, description: "Product name", descriptionFr: "Nom du produit" },
        { name: "category", type: "VARCHAR", nullable: false, description: "Product category", descriptionFr: "Catégorie du produit" },
        { name: "price", type: "DECIMAL(10,2)", nullable: false, description: "Unit price in EUR", descriptionFr: "Prix unitaire en EUR" },
        { name: "stock", type: "INTEGER", nullable: false, description: "Current stock quantity", descriptionFr: "Stock actuel" },
        { name: "supplier", type: "VARCHAR", nullable: false, description: "Supplier name", descriptionFr: "Nom du fournisseur" },
      ],
    },
    {
      name: "orders",
      description: "Customer orders with status and totals",
      descriptionFr: "Commandes clients avec statut et montants",
      rowCount: 30,
      columns: [
        { name: "order_id", type: "INTEGER", nullable: false, description: "Unique order ID", descriptionFr: "ID unique de la commande" },
        { name: "customer_id", type: "INTEGER", nullable: false, description: "FK to customers", descriptionFr: "FK vers customers" },
        { name: "order_date", type: "DATE", nullable: false, description: "Order date", descriptionFr: "Date de commande" },
        { name: "status", type: "VARCHAR", nullable: false, description: "Order status (delivered, shipped, cancelled, pending)", descriptionFr: "Statut (delivered, shipped, cancelled, pending)" },
        { name: "total_amount", type: "DECIMAL(10,2)", nullable: false, description: "Total order amount", descriptionFr: "Montant total" },
        { name: "channel", type: "VARCHAR", nullable: false, description: "Sales channel (web, mobile)", descriptionFr: "Canal de vente (web, mobile)" },
      ],
    },
    {
      name: "order_items",
      description: "Individual line items within each order",
      descriptionFr: "Lignes de détail de chaque commande",
      rowCount: 50,
      columns: [
        { name: "order_item_id", type: "INTEGER", nullable: false, description: "Unique line item ID", descriptionFr: "ID unique de la ligne" },
        { name: "order_id", type: "INTEGER", nullable: false, description: "FK to orders", descriptionFr: "FK vers orders" },
        { name: "product_id", type: "INTEGER", nullable: false, description: "FK to products", descriptionFr: "FK vers products" },
        { name: "quantity", type: "INTEGER", nullable: false, description: "Quantity ordered", descriptionFr: "Quantité commandée" },
        { name: "unit_price", type: "DECIMAL(10,2)", nullable: false, description: "Price at time of order", descriptionFr: "Prix au moment de la commande" },
      ],
    },
    {
      name: "returns",
      description: "Product returns with reasons and refund status",
      descriptionFr: "Retours produits avec motifs et statut de remboursement",
      rowCount: 8,
      columns: [
        { name: "return_id", type: "INTEGER", nullable: false, description: "Unique return ID", descriptionFr: "ID unique du retour" },
        { name: "order_item_id", type: "INTEGER", nullable: false, description: "FK to order_items", descriptionFr: "FK vers order_items" },
        { name: "return_date", type: "DATE", nullable: false, description: "Return date", descriptionFr: "Date du retour" },
        { name: "reason", type: "VARCHAR", nullable: false, description: "Return reason", descriptionFr: "Motif du retour" },
        { name: "refund_status", type: "VARCHAR", nullable: false, description: "Refund status (refunded, pending, denied)", descriptionFr: "Statut remboursement (refunded, pending, denied)" },
      ],
    },
    {
      name: "reviews",
      description: "Customer product reviews and ratings (1-5 stars)",
      descriptionFr: "Avis clients et notes produits (1-5 étoiles)",
      rowCount: 15,
      columns: [
        { name: "review_id", type: "INTEGER", nullable: false, description: "Unique review ID", descriptionFr: "ID unique de l'avis" },
        { name: "product_id", type: "INTEGER", nullable: false, description: "FK to products", descriptionFr: "FK vers products" },
        { name: "customer_id", type: "INTEGER", nullable: false, description: "FK to customers", descriptionFr: "FK vers customers" },
        { name: "rating", type: "INTEGER", nullable: true, description: "Rating 1-5 (can be NULL)", descriptionFr: "Note 1-5 (peut être NULL)" },
        { name: "comment", type: "VARCHAR", nullable: true, description: "Review comment (can be NULL)", descriptionFr: "Commentaire (peut être NULL)" },
        { name: "review_date", type: "DATE", nullable: false, description: "Review date", descriptionFr: "Date de l'avis" },
      ],
    },
  ],
  questions: [
    {
      id: "nc-01",
      title: "Revenue by product category",
      titleFr: "Chiffre d'affaires par catégorie",
      stakeholder: "Alex",
      stakeholderRole: "VP Sales",
      difficulty: "easy",
      description:
        "Alex (VP Sales) wants to know the total revenue per product category for delivered orders. Show the category and total revenue, sorted by revenue descending.",
      descriptionFr:
        "Alex (VP Sales) veut connaître le chiffre d'affaires total par catégorie de produit pour les commandes livrées. Affiche la catégorie et le CA total, trié par CA décroissant.",
      hint: "Join orders, order_items, and products. Filter on status = 'delivered'. GROUP BY category.",
      hintFr: "Jointure entre orders, order_items et products. Filtre sur status = 'delivered'. GROUP BY category.",
      solutionQuery: `SELECT p.category, SUM(oi.quantity * oi.unit_price) AS total_revenue
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
WHERE o.status = 'delivered'
GROUP BY p.category
ORDER BY total_revenue DESC;`,
      expectedColumns: ["category", "total_revenue"],
      expectedRows: [
        { category: "Monitors", total_revenue: 1799.95 },
        { category: "Audio", total_revenue: 879.92 },
        { category: "Peripherals", total_revenue: 729.92 },
        { category: "Accessories", total_revenue: 637.72 },
        { category: "Storage", total_revenue: 479.96 },
        { category: "Gaming", total_revenue: 124.98 },
      ],
      orderMatters: true,
    },
    {
      id: "nc-02",
      title: "Customers without any orders",
      titleFr: "Clients sans aucune commande",
      stakeholder: "Nadia",
      stakeholderRole: "Product Manager",
      difficulty: "easy",
      description:
        "Nadia (Product Manager) wants to identify registered customers who have never placed an order. Show their first name, last name, and signup date.",
      descriptionFr:
        "Nadia (Product Manager) veut identifier les clients inscrits qui n'ont jamais passé de commande. Affiche leur prénom, nom et date d'inscription.",
      hint: "Use a LEFT JOIN between customers and orders, then filter WHERE order_id IS NULL.",
      hintFr: "Utilise un LEFT JOIN entre customers et orders, puis filtre WHERE order_id IS NULL.",
      solutionQuery: `SELECT c.first_name, c.last_name, c.signup_date
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;`,
      expectedColumns: ["first_name", "last_name", "signup_date"],
      expectedRows: [
        { first_name: "Yann", last_name: "Girard", signup_date: "2024-02-05" },
      ],
      orderMatters: false,
    },
    {
      id: "nc-03",
      title: "Top 3 products per category by revenue",
      titleFr: "Top 3 produits par catégorie en CA",
      stakeholder: "Alex",
      stakeholderRole: "VP Sales",
      difficulty: "medium",
      description:
        "Alex (VP Sales) needs the top 3 best-selling products per category (by total revenue from delivered orders). Show category, product name, and total revenue. Rank them within each category.",
      descriptionFr:
        "Alex (VP Sales) a besoin du top 3 des produits les plus vendus par catégorie (en CA sur les commandes livrées). Affiche la catégorie, le nom du produit et le CA total. Classe-les au sein de chaque catégorie.",
      hint: "Use ROW_NUMBER() OVER (PARTITION BY category ORDER BY revenue DESC), then filter rank <= 3 in an outer query.",
      hintFr: "Utilise ROW_NUMBER() OVER (PARTITION BY category ORDER BY revenue DESC), puis filtre rank <= 3 dans une requête externe.",
      solutionQuery: `WITH product_revenue AS (
  SELECT p.category, p.product_name,
    SUM(oi.quantity * oi.unit_price) AS total_revenue
  FROM orders o
  JOIN order_items oi ON o.order_id = oi.order_id
  JOIN products p ON oi.product_id = p.product_id
  WHERE o.status = 'delivered'
  GROUP BY p.category, p.product_name
),
ranked AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY category ORDER BY total_revenue DESC) AS rn
  FROM product_revenue
)
SELECT category, product_name, total_revenue
FROM ranked
WHERE rn <= 3
ORDER BY category, total_revenue DESC;`,
      expectedColumns: ["category", "product_name", "total_revenue"],
      expectedRows: [
        { category: "Accessories", product_name: "USB-C Hub 7-port", total_revenue: 174.95 },
        { category: "Accessories", product_name: "HDMI Cable 2m", total_revenue: 142.89 },
        { category: "Accessories", product_name: "LED Desk Lamp", total_revenue: 89.98 },
        { category: "Audio", product_name: "Noise-Canceling Headset", total_revenue: 599.96 },
        { category: "Audio", product_name: "USB Microphone", total_revenue: 199.98 },
        { category: "Audio", product_name: "Bluetooth Speaker", total_revenue: 79.98 },
        { category: "Gaming", product_name: "Retro Game Console", total_revenue: 69.99 },
        { category: "Gaming", product_name: "Pro Controller", total_revenue: 54.99 },
        { category: "Monitors", product_name: "27\" 4K Monitor", total_revenue: 1599.96 },
        { category: "Monitors", product_name: "24\" FHD Monitor", total_revenue: 199.99 },
        { category: "Peripherals", product_name: "Mechanical Keyboard RGB", total_revenue: 389.97 },
        { category: "Peripherals", product_name: "Gaming Mouse", total_revenue: 239.97 },
        { category: "Peripherals", product_name: "Wireless Keyboard", total_revenue: 99.98 },
        { category: "Storage", product_name: "External SSD 2TB", total_revenue: 299.98 },
        { category: "Storage", product_name: "External SSD 1TB", total_revenue: 179.98 },
      ],
      orderMatters: true,
    },
    {
      id: "nc-04",
      title: "Monthly revenue trend",
      titleFr: "Évolution du CA mensuel",
      stakeholder: "Alex",
      stakeholderRole: "VP Sales",
      difficulty: "easy",
      description:
        "Alex (VP Sales) wants a monthly revenue report for delivered orders. Show the month (as a date, first day of month) and total revenue, ordered chronologically.",
      descriptionFr:
        "Alex (VP Sales) veut un rapport mensuel du CA des commandes livrées. Affiche le mois (en date, premier jour du mois) et le CA total, trié chronologiquement.",
      hint: "Use DATE_TRUNC('month', order_date) to group by month. Filter on delivered status.",
      hintFr: "Utilise DATE_TRUNC('month', order_date) pour regrouper par mois. Filtre sur le statut delivered.",
      solutionQuery: `SELECT DATE_TRUNC('month', order_date) AS month, SUM(total_amount) AS total_revenue
FROM orders
WHERE status = 'delivered'
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY month;`,
      expectedColumns: ["month", "total_revenue"],
      expectedRows: [
        { month: "2024-01-01", total_revenue: 1054.92 },
        { month: "2024-02-01", total_revenue: 964.93 },
        { month: "2024-03-01", total_revenue: 1069.92 },
        { month: "2024-04-01", total_revenue: 504.94 },
        { month: "2024-05-01", total_revenue: 644.96 },
      ],
      orderMatters: true,
    },
    {
      id: "nc-05",
      title: "Return rate by product category",
      titleFr: "Taux de retour par catégorie",
      stakeholder: "Marc",
      stakeholderRole: "Head of Logistics",
      difficulty: "medium",
      description:
        "Marc (Head of Logistics) wants to know the return rate per product category. Calculate the number of returned items vs total items sold, as a percentage rounded to 1 decimal. Show category, items_sold, items_returned, and return_rate.",
      descriptionFr:
        "Marc (Head of Logistics) veut connaître le taux de retour par catégorie de produit. Calcule le nombre d'articles retournés vs vendus, en pourcentage arrondi à 1 décimale. Affiche category, items_sold, items_returned et return_rate.",
      hint: "LEFT JOIN order_items with returns to count returned items. GROUP BY category via products table.",
      hintFr: "LEFT JOIN order_items avec returns pour compter les retournés. GROUP BY category via la table products.",
      solutionQuery: `SELECT p.category,
  COUNT(oi.order_item_id) AS items_sold,
  COUNT(r.return_id) AS items_returned,
  ROUND(100.0 * COUNT(r.return_id) / COUNT(oi.order_item_id), 1) AS return_rate
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
LEFT JOIN returns r ON oi.order_item_id = r.order_item_id
GROUP BY p.category
ORDER BY return_rate DESC, p.category;`,
      expectedColumns: ["category", "items_sold", "items_returned", "return_rate"],
      expectedRows: [
        { category: "Monitors", items_sold: 6, items_returned: 2, return_rate: 33.3 },
        { category: "Peripherals", items_sold: 8, items_returned: 2, return_rate: 25.0 },
        { category: "Storage", items_sold: 6, items_returned: 1, return_rate: 16.7 },
        { category: "Accessories", items_sold: 18, items_returned: 2, return_rate: 11.1 },
        { category: "Audio", items_sold: 9, items_returned: 1, return_rate: 11.1 },
        { category: "Gaming", items_sold: 3, items_returned: 0, return_rate: 0.0 },
      ],
      orderMatters: true,
    },
    {
      id: "nc-06",
      title: "Average rating per product with review count",
      titleFr: "Note moyenne par produit avec nombre d'avis",
      stakeholder: "Nadia",
      stakeholderRole: "Product Manager",
      difficulty: "easy",
      description:
        "Nadia (Product Manager) wants to see the average rating and review count for each reviewed product. Only include products that have at least one rating (exclude NULL ratings). Show product name, review count, and average rating rounded to 1 decimal, sorted by average rating descending then product name ascending.",
      descriptionFr:
        "Nadia (Product Manager) veut voir la note moyenne et le nombre d'avis pour chaque produit ayant des avis. N'inclus que les produits avec au moins une note (exclure les NULL). Affiche le nom du produit, le nombre d'avis et la note moyenne arrondie à 1 décimale, trié par note décroissante puis nom du produit croissant.",
      hint: "Filter WHERE rating IS NOT NULL. JOIN reviews with products. GROUP BY product_name.",
      hintFr: "Filtre WHERE rating IS NOT NULL. JOIN reviews avec products. GROUP BY product_name.",
      solutionQuery: `SELECT p.product_name,
  COUNT(*) AS review_count,
  ROUND(AVG(r.rating), 1) AS avg_rating
FROM reviews r
JOIN products p ON r.product_id = p.product_id
WHERE r.rating IS NOT NULL
GROUP BY p.product_name
ORDER BY avg_rating DESC, p.product_name;`,
      expectedColumns: ["product_name", "review_count", "avg_rating"],
      expectedRows: [
        { product_name: "Mechanical Keyboard RGB", review_count: 2, avg_rating: 5.0 },
        { product_name: "USB Microphone", review_count: 1, avg_rating: 5.0 },
        { product_name: "27\" 4K Monitor", review_count: 2, avg_rating: 4.5 },
        { product_name: "24\" FHD Monitor", review_count: 1, avg_rating: 4.0 },
        { product_name: "External SSD 1TB", review_count: 1, avg_rating: 4.0 },
        { product_name: "Gaming Mouse", review_count: 2, avg_rating: 4.0 },
        { product_name: "Noise-Canceling Headset", review_count: 1, avg_rating: 4.0 },
        { product_name: "Retro Game Console", review_count: 1, avg_rating: 4.0 },
        { product_name: "Wireless Keyboard", review_count: 1, avg_rating: 4.0 },
        { product_name: "LED Desk Lamp", review_count: 1, avg_rating: 3.0 },
        { product_name: "Bluetooth Speaker", review_count: 1, avg_rating: 2.0 },
      ],
      orderMatters: true,
    },
    {
      id: "nc-07",
      title: "Customers who ordered on both web and mobile",
      titleFr: "Clients ayant commandé sur web ET mobile",
      stakeholder: "Nadia",
      stakeholderRole: "Product Manager",
      difficulty: "medium",
      description:
        "Nadia (Product Manager) wants to find customers who have placed orders on BOTH channels (web and mobile). Show their first name, last name, and total number of orders.",
      descriptionFr:
        "Nadia (Product Manager) veut trouver les clients ayant passé des commandes sur LES DEUX canaux (web et mobile). Affiche leur prénom, nom et nombre total de commandes.",
      hint: "GROUP BY customer, then use HAVING with COUNT(DISTINCT channel) = 2.",
      hintFr: "GROUP BY customer, puis utilise HAVING avec COUNT(DISTINCT channel) = 2.",
      solutionQuery: `SELECT c.first_name, c.last_name, COUNT(*) AS total_orders
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name
HAVING COUNT(DISTINCT o.channel) = 2
ORDER BY total_orders DESC;`,
      expectedColumns: ["first_name", "last_name", "total_orders"],
      expectedRows: [
        { first_name: "Emma", last_name: "Simon", total_orders: 2 },
      ],
      orderMatters: true,
    },
    {
      id: "nc-08",
      title: "Cumulative revenue over time",
      titleFr: "Chiffre d'affaires cumulé dans le temps",
      stakeholder: "Alex",
      stakeholderRole: "VP Sales",
      difficulty: "hard",
      description:
        "Alex (VP Sales) wants to see the cumulative (running total) revenue day by day for delivered orders. Show the order date, daily revenue, and cumulative revenue up to that date.",
      descriptionFr:
        "Alex (VP Sales) veut voir le chiffre d'affaires cumulé jour par jour pour les commandes livrées. Affiche la date de commande, le CA du jour et le CA cumulé jusqu'à cette date.",
      hint: "First aggregate daily revenue, then use SUM() OVER (ORDER BY order_date ROWS UNBOUNDED PRECEDING).",
      hintFr: "D'abord agrège le CA journalier, puis utilise SUM() OVER (ORDER BY order_date ROWS UNBOUNDED PRECEDING).",
      solutionQuery: `WITH daily AS (
  SELECT order_date, SUM(total_amount) AS daily_revenue
  FROM orders
  WHERE status = 'delivered'
  GROUP BY order_date
)
SELECT order_date, daily_revenue,
  SUM(daily_revenue) OVER (ORDER BY order_date ROWS UNBOUNDED PRECEDING) AS cumulative_revenue
FROM daily
ORDER BY order_date;`,
      expectedColumns: ["order_date", "daily_revenue", "cumulative_revenue"],
      expectedRows: [
        { order_date: "2024-01-05", daily_revenue: 129.98, cumulative_revenue: 129.98 },
        { order_date: "2024-01-08", daily_revenue: 79.99, cumulative_revenue: 209.97 },
        { order_date: "2024-01-12", daily_revenue: 434.98, cumulative_revenue: 644.95 },
        { order_date: "2024-01-18", daily_revenue: 149.99, cumulative_revenue: 794.94 },
        { order_date: "2024-01-22", daily_revenue: 59.99, cumulative_revenue: 854.93 },
        { order_date: "2024-01-28", daily_revenue: 199.99, cumulative_revenue: 1054.92 },
        { order_date: "2024-02-03", daily_revenue: 94.98, cumulative_revenue: 1149.90 },
        { order_date: "2024-02-08", daily_revenue: 399.99, cumulative_revenue: 1549.89 },
        { order_date: "2024-02-14", daily_revenue: 249.98, cumulative_revenue: 1799.87 },
        { order_date: "2024-02-18", daily_revenue: 89.99, cumulative_revenue: 1889.86 },
        { order_date: "2024-02-25", daily_revenue: 129.99, cumulative_revenue: 2019.85 },
        { order_date: "2024-03-01", daily_revenue: 44.99, cumulative_revenue: 2064.84 },
        { order_date: "2024-03-05", daily_revenue: 169.98, cumulative_revenue: 2234.82 },
        { order_date: "2024-03-10", daily_revenue: 149.99, cumulative_revenue: 2384.81 },
        { order_date: "2024-03-15", daily_revenue: 79.99, cumulative_revenue: 2464.80 },
        { order_date: "2024-03-20", daily_revenue: 524.98, cumulative_revenue: 2989.78 },
        { order_date: "2024-03-28", daily_revenue: 99.99, cumulative_revenue: 3089.77 },
        { order_date: "2024-04-02", daily_revenue: 129.99, cumulative_revenue: 3219.76 },
        { order_date: "2024-04-08", daily_revenue: 34.99, cumulative_revenue: 3254.75 },
        { order_date: "2024-04-12", daily_revenue: 89.99, cumulative_revenue: 3344.74 },
        { order_date: "2024-04-18", daily_revenue: 69.99, cumulative_revenue: 3414.73 },
        { order_date: "2024-04-28", daily_revenue: 179.98, cumulative_revenue: 3594.71 },
        { order_date: "2024-05-03", daily_revenue: 49.99, cumulative_revenue: 3644.70 },
        { order_date: "2024-05-08", daily_revenue: 399.99, cumulative_revenue: 4044.69 },
        { order_date: "2024-05-20", daily_revenue: 44.99, cumulative_revenue: 4089.68 },
        { order_date: "2024-05-25", daily_revenue: 149.99, cumulative_revenue: 4239.67 },
      ],
      orderMatters: true,
    },
    {
      id: "nc-09",
      title: "Web vs Mobile revenue comparison",
      titleFr: "Comparaison CA web vs mobile",
      stakeholder: "Nadia",
      stakeholderRole: "Product Manager",
      difficulty: "easy",
      description:
        "Nadia (Product Manager) wants to compare revenue between web and mobile channels for delivered orders. Show the channel, number of orders, and total revenue.",
      descriptionFr:
        "Nadia (Product Manager) veut comparer le CA entre les canaux web et mobile pour les commandes livrées. Affiche le canal, le nombre de commandes et le CA total.",
      hint: "Simple GROUP BY channel on the orders table. Filter on delivered status.",
      hintFr: "Simple GROUP BY channel sur la table orders. Filtre sur le statut delivered.",
      solutionQuery: `SELECT channel, COUNT(*) AS order_count, SUM(total_amount) AS total_revenue
FROM orders
WHERE status = 'delivered'
GROUP BY channel
ORDER BY total_revenue DESC;`,
      expectedColumns: ["channel", "order_count", "total_revenue"],
      expectedRows: [
        { channel: "web", order_count: 17, total_revenue: 3634.77 },
        { channel: "mobile", order_count: 9, total_revenue: 604.90 },
      ],
      orderMatters: true,
    },
    {
      id: "nc-10",
      title: "Repeat customers ranking",
      titleFr: "Classement des clients fidèles",
      stakeholder: "Alex",
      stakeholderRole: "VP Sales",
      difficulty: "medium",
      description:
        "Alex (VP Sales) wants to identify repeat customers (2+ orders). Show their first name, last name, number of orders, and total spent. Rank them by total spent descending.",
      descriptionFr:
        "Alex (VP Sales) veut identifier les clients fidèles (2+ commandes). Affiche leur prénom, nom, nombre de commandes et total dépensé. Classe-les par total dépensé décroissant.",
      hint: "GROUP BY customer, HAVING COUNT(*) >= 2. Join customers with orders.",
      hintFr: "GROUP BY customer, HAVING COUNT(*) >= 2. Jointure customers avec orders.",
      solutionQuery: `SELECT c.first_name, c.last_name,
  COUNT(*) AS order_count,
  SUM(o.total_amount) AS total_spent
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name
HAVING COUNT(*) >= 2
ORDER BY total_spent DESC;`,
      expectedColumns: ["first_name", "last_name", "order_count", "total_spent"],
      expectedRows: [
        { first_name: "Clara", last_name: "Leroy", order_count: 2, total_spent: 584.97 },
        { first_name: "Alice", last_name: "Martin", order_count: 3, total_spent: 369.96 },
        { first_name: "Jules", last_name: "Robert", order_count: 2, total_spent: 279.98 },
        { first_name: "Emma", last_name: "Simon", order_count: 2, total_spent: 189.98 },
        { first_name: "Bob", last_name: "Dupont", order_count: 2, total_spent: 169.98 },
      ],
      orderMatters: true,
    },
  ],
};
