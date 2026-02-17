import type { CompanyProfile } from "./types";

const schema = `
CREATE TABLE restaurants (
  restaurant_id INTEGER PRIMARY KEY,
  name VARCHAR NOT NULL,
  city VARCHAR NOT NULL,
  cuisine_type VARCHAR NOT NULL,
  avg_rating DECIMAL(2,1),
  opening_date DATE NOT NULL
);

CREATE TABLE riders (
  rider_id INTEGER PRIMARY KEY,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  city VARCHAR NOT NULL,
  signup_date DATE NOT NULL,
  vehicle VARCHAR NOT NULL
);

CREATE TABLE menu_items (
  item_id INTEGER PRIMARY KEY,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(restaurant_id),
  item_name VARCHAR NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR NOT NULL,
  calories INTEGER
);

CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  customer_name VARCHAR NOT NULL,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(restaurant_id),
  order_date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR NOT NULL
);

CREATE TABLE deliveries (
  delivery_id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(order_id),
  rider_id INTEGER NOT NULL REFERENCES riders(rider_id),
  estimated_minutes INTEGER NOT NULL,
  actual_minutes INTEGER,
  distance_km DECIMAL(4,1) NOT NULL
);

CREATE TABLE ratings (
  rating_id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(order_id),
  restaurant_rating INTEGER CHECK (restaurant_rating BETWEEN 1 AND 5),
  rider_rating INTEGER CHECK (rider_rating BETWEEN 1 AND 5),
  comment VARCHAR
);

-- Restaurants (12 rows)
INSERT INTO restaurants VALUES
  (1, 'Green Garden', 'Paris', 'Veggie', 4.5, '2023-01-10'),
  (2, 'Bowl & Soul', 'Paris', 'Poke', 4.2, '2023-02-15'),
  (3, 'Vita Fresh', 'Lyon', 'Salad', 4.7, '2023-01-20'),
  (4, 'Super Bowl', 'Lyon', 'Poke', 3.9, '2023-03-05'),
  (5, 'Grain de Folie', 'Marseille', 'Grain Bowl', 4.1, '2023-04-12'),
  (6, 'Açaí Corner', 'Marseille', 'Açaí', 4.6, '2023-02-28'),
  (7, 'Zen Kitchen', 'Bordeaux', 'Asian Fusion', 4.3, '2023-05-01'),
  (8, 'Le Bol Doré', 'Bordeaux', 'Grain Bowl', 3.8, '2023-06-15'),
  (9, 'Fresh Factory', 'Nantes', 'Salad', 4.4, '2023-03-22'),
  (10, 'Poké Palace', 'Nantes', 'Poke', 4.0, '2023-07-01'),
  (11, 'Buddha Bowl Bar', 'Paris', 'Veggie', 4.8, '2023-08-10'),
  (12, 'Smoothie & Bowl', 'Lyon', 'Açaí', 3.5, '2023-09-01');

-- Riders (15 rows)
INSERT INTO riders VALUES
  (1, 'Lucas', 'Martin', 'Paris', '2023-02-01', 'bicycle'),
  (2, 'Léa', 'Bernard', 'Paris', '2023-03-15', 'scooter'),
  (3, 'Hugo', 'Petit', 'Lyon', '2023-01-20', 'bicycle'),
  (4, 'Manon', 'Durand', 'Lyon', '2023-04-10', 'scooter'),
  (5, 'Théo', 'Leroy', 'Marseille', '2023-02-28', 'bicycle'),
  (6, 'Camille', 'Moreau', 'Marseille', '2023-05-15', 'scooter'),
  (7, 'Nathan', 'Simon', 'Bordeaux', '2023-03-01', 'bicycle'),
  (8, 'Emma', 'Laurent', 'Bordeaux', '2023-06-20', 'scooter'),
  (9, 'Louis', 'Garcia', 'Nantes', '2023-04-05', 'bicycle'),
  (10, 'Chloé', 'Thomas', 'Nantes', '2023-07-12', 'scooter'),
  (11, 'Raphaël', 'Robert', 'Paris', '2023-08-01', 'bicycle'),
  (12, 'Jade', 'Richard', 'Lyon', '2023-09-10', 'bicycle'),
  (13, 'Arthur', 'Dubois', 'Marseille', '2023-10-01', 'scooter'),
  (14, 'Inès', 'Bertrand', 'Bordeaux', '2023-11-15', 'bicycle'),
  (15, 'Mathis', 'Roux', 'Nantes', '2023-12-01', 'scooter');

-- Menu items (20 rows)
INSERT INTO menu_items VALUES
  (1, 1, 'Buddha Bowl Classique', 12.90, 'Bowl', 520),
  (2, 1, 'Smoothie Vert Détox', 6.50, 'Drink', 180),
  (3, 2, 'Poke Saumon Avocat', 14.50, 'Poke', 610),
  (4, 2, 'Poke Thon Épicé', 14.90, 'Poke', 580),
  (5, 3, 'Salade César Poulet', 11.90, 'Salad', 450),
  (6, 3, 'Wrap Veggie', 9.50, 'Wrap', 380),
  (7, 4, 'Poke Crevettes', 15.50, 'Poke', 550),
  (8, 5, 'Grain Bowl Méditerranéen', 13.20, 'Bowl', 490),
  (9, 6, 'Açaí Bowl Granola', 10.90, 'Açaí', 420),
  (10, 6, 'Açaí Bowl Fruits Rouges', 11.50, 'Açaí', 390),
  (11, 7, 'Teriyaki Bowl', 13.90, 'Bowl', 560),
  (12, 7, 'Miso Soup Side', 4.50, 'Side', NULL),
  (13, 8, 'Quinoa Power Bowl', 12.50, 'Bowl', 470),
  (14, 9, 'Salade Niçoise', 12.20, 'Salad', 410),
  (15, 9, 'Jus Detox Gingembre', 5.90, 'Drink', 95),
  (16, 10, 'Poke Tofu Teriyaki', 13.50, 'Poke', NULL),
  (17, 10, 'Edamame Side', 4.90, 'Side', 120),
  (18, 11, 'Super Green Bowl', 14.20, 'Bowl', 480),
  (19, 11, 'Protein Power Bowl', 15.90, 'Bowl', 650),
  (20, 12, 'Açaí Tropical', 10.50, 'Açaí', 400);

-- Orders (30 rows)
INSERT INTO orders VALUES
  (1, 'Alice Dupont', 1, '2024-03-01', 19.40, 'delivered'),
  (2, 'Bob Martin', 2, '2024-03-01', 14.50, 'delivered'),
  (3, 'Clara Leroy', 3, '2024-03-02', 21.40, 'delivered'),
  (4, 'David Moreau', 5, '2024-03-02', 13.20, 'delivered'),
  (5, 'Emma Simon', 6, '2024-03-03', 22.40, 'delivered'),
  (6, 'Florian Petit', 7, '2024-03-03', 18.40, 'delivered'),
  (7, 'Alice Dupont', 11, '2024-03-04', 14.20, 'delivered'),
  (8, 'Hugo Garcia', 4, '2024-03-04', 15.50, 'delivered'),
  (9, 'Inès Thomas', 9, '2024-03-05', 18.10, 'delivered'),
  (10, 'Jules Robert', 10, '2024-03-05', 18.40, 'delivered'),
  (11, 'Bob Martin', 1, '2024-03-06', 12.90, 'delivered'),
  (12, 'Clara Leroy', 8, '2024-03-06', 12.50, 'delivered'),
  (13, 'Emma Simon', 2, '2024-03-07', 14.90, 'delivered'),
  (14, 'David Moreau', 3, '2024-03-07', 11.90, 'delivered'),
  (15, 'Florian Petit', 12, '2024-03-08', 10.50, 'delivered'),
  (16, 'Alice Dupont', 6, '2024-03-08', 11.50, 'delivered'),
  (17, 'Hugo Garcia', 7, '2024-03-09', 13.90, 'cancelled'),
  (18, 'Inès Thomas', 11, '2024-03-09', 15.90, 'delivered'),
  (19, 'Jules Robert', 5, '2024-03-10', 13.20, 'delivered'),
  (20, 'Karine Blanc', 9, '2024-03-10', 12.20, 'delivered'),
  (21, 'Bob Martin', 4, '2024-03-11', 15.50, 'delivered'),
  (22, 'Clara Leroy', 1, '2024-03-11', 12.90, 'delivered'),
  (23, 'Lucas Faure', 10, '2024-03-12', 13.50, 'delivered'),
  (24, 'Emma Simon', 8, '2024-03-12', 12.50, 'delivered'),
  (25, 'David Moreau', 6, '2024-03-13', 10.90, 'delivered'),
  (26, 'Florian Petit', 11, '2024-03-13', 30.10, 'delivered'),
  (27, 'Alice Dupont', 3, '2024-03-14', 9.50, 'delivered'),
  (28, 'Hugo Garcia', 2, '2024-03-14', 29.40, 'pending'),
  (29, 'Inès Thomas', 7, '2024-03-15', 18.40, 'delivered'),
  (30, 'Jules Robert', 12, '2024-03-15', 10.50, 'delivered');

-- Deliveries (25 rows — cancelled/pending orders have no delivery)
INSERT INTO deliveries VALUES
  (1, 1, 1, 25, 28, 3.2),
  (2, 2, 2, 20, 18, 2.1),
  (3, 3, 3, 30, 35, 4.5),
  (4, 4, 5, 25, 22, 3.0),
  (5, 5, 6, 20, 24, 2.8),
  (6, 6, 7, 30, 32, 4.2),
  (7, 7, 11, 20, 19, 1.8),
  (8, 8, 4, 25, 30, 3.5),
  (9, 9, 9, 25, 23, 3.1),
  (10, 10, 10, 20, 26, 2.5),
  (11, 11, 1, 20, 21, 2.0),
  (12, 12, 7, 30, 28, 4.0),
  (13, 13, 2, 20, 22, 2.3),
  (14, 14, 3, 25, 24, 3.8),
  (15, 15, 12, 30, 38, 5.1),
  (16, 16, 6, 20, 19, 2.6),
  (17, 18, 11, 20, 17, 1.5),
  (18, 19, 5, 25, 27, 3.3),
  (19, 20, 9, 25, 22, 2.9),
  (20, 21, 4, 25, 25, 3.4),
  (21, 22, 1, 20, 23, 2.2),
  (22, 23, 10, 20, 21, 2.4),
  (23, 24, 8, 30, 33, 4.3),
  (24, 25, 6, 20, 18, 2.7),
  (25, 26, 11, 25, 24, 1.9);

-- Ratings (18 rows)
INSERT INTO ratings VALUES
  (1, 1, 4, 5, 'Très bon bowl, livraison rapide'),
  (2, 2, 5, 4, 'Excellent poke !'),
  (3, 3, 5, 3, 'Salade parfaite mais livreur en retard'),
  (4, 4, 4, 4, NULL),
  (5, 5, 5, 5, 'Meilleur açaí de la ville'),
  (6, 6, 4, 4, 'Bon teriyaki bowl'),
  (7, 7, 5, 5, 'Super green bowl incroyable'),
  (8, 8, 3, 3, 'Poke moyen, temps d''attente long'),
  (9, 9, 4, 4, 'Bonne salade, rider sympa'),
  (10, 10, 3, 2, 'Poke correct mais livraison froide'),
  (11, 11, 4, 4, 'Toujours aussi bon'),
  (12, 13, 4, 5, NULL),
  (13, 14, 5, 4, 'Salade césar top'),
  (14, 16, 5, 5, 'Açaí parfait'),
  (15, 18, 5, 4, 'Power bowl excellent'),
  (16, 19, 4, 3, 'Bien mais un peu froid'),
  (17, 22, 4, 4, 'Buddha bowl classique et bon'),
  (18, 26, 5, 5, 'Deux bowls commandés, les deux parfaits');
`;

export const freshBowl: CompanyProfile = {
  id: "freshbowl",
  name: "FreshBowl",
  tagline: "Fresh bowls, delivered warm",
  taglineFr: "Des bowls frais, livrés chauds",
  sector: "Foodtech / Delivery",
  sectorFr: "Foodtech / Livraison",
  icon: "🥗",
  description:
    "You just joined the data team at FreshBowl, a healthy bowl delivery startup operating across 5 cities. With 12 partner restaurants, 15 riders, and a mobile app, FreshBowl has grown fast in its first year. The ops team needs help understanding delivery times, the partnerships team wants restaurant performance data, and product wants app usage metrics.",
  descriptionFr:
    "Tu viens de rejoindre l'équipe data de FreshBowl, une startup de livraison de bowls healthy présente dans 5 villes. Avec 12 restaurants partenaires, 15 livreurs et une app mobile, FreshBowl a connu une croissance rapide lors de sa première année. L'équipe ops a besoin de comprendre les temps de livraison, l'équipe partenariats veut des données de performance des restaurants, et le produit veut des métriques d'usage de l'app.",
  schema,
  tables: [
    {
      name: "restaurants",
      description: "Partner restaurants with location and cuisine info",
      descriptionFr: "Restaurants partenaires avec localisation et type de cuisine",
      rowCount: 12,
      columns: [
        { name: "restaurant_id", type: "INTEGER", nullable: false, description: "Unique restaurant ID", descriptionFr: "ID unique du restaurant" },
        { name: "name", type: "VARCHAR", nullable: false, description: "Restaurant name", descriptionFr: "Nom du restaurant" },
        { name: "city", type: "VARCHAR", nullable: false, description: "City", descriptionFr: "Ville" },
        { name: "cuisine_type", type: "VARCHAR", nullable: false, description: "Cuisine type (Veggie, Poke, Salad, etc.)", descriptionFr: "Type de cuisine (Veggie, Poke, Salad, etc.)" },
        { name: "avg_rating", type: "DECIMAL(2,1)", nullable: true, description: "Average platform rating", descriptionFr: "Note moyenne sur la plateforme" },
        { name: "opening_date", type: "DATE", nullable: false, description: "Date the restaurant joined FreshBowl", descriptionFr: "Date d'arrivée sur FreshBowl" },
      ],
    },
    {
      name: "riders",
      description: "Delivery riders with city and vehicle type",
      descriptionFr: "Livreurs avec ville et type de véhicule",
      rowCount: 15,
      columns: [
        { name: "rider_id", type: "INTEGER", nullable: false, description: "Unique rider ID", descriptionFr: "ID unique du livreur" },
        { name: "first_name", type: "VARCHAR", nullable: false, description: "First name", descriptionFr: "Prénom" },
        { name: "last_name", type: "VARCHAR", nullable: false, description: "Last name", descriptionFr: "Nom de famille" },
        { name: "city", type: "VARCHAR", nullable: false, description: "City of operation", descriptionFr: "Ville d'opération" },
        { name: "signup_date", type: "DATE", nullable: false, description: "Signup date", descriptionFr: "Date d'inscription" },
        { name: "vehicle", type: "VARCHAR", nullable: false, description: "Vehicle type (bicycle, scooter)", descriptionFr: "Type de véhicule (bicycle, scooter)" },
      ],
    },
    {
      name: "menu_items",
      description: "Menu items per restaurant with pricing and nutrition",
      descriptionFr: "Plats par restaurant avec prix et informations nutritionnelles",
      rowCount: 20,
      columns: [
        { name: "item_id", type: "INTEGER", nullable: false, description: "Unique item ID", descriptionFr: "ID unique du plat" },
        { name: "restaurant_id", type: "INTEGER", nullable: false, description: "FK to restaurants", descriptionFr: "FK vers restaurants" },
        { name: "item_name", type: "VARCHAR", nullable: false, description: "Item name", descriptionFr: "Nom du plat" },
        { name: "price", type: "DECIMAL(10,2)", nullable: false, description: "Price in EUR", descriptionFr: "Prix en EUR" },
        { name: "category", type: "VARCHAR", nullable: false, description: "Item category (Bowl, Poke, Salad, Drink, Side, etc.)", descriptionFr: "Catégorie (Bowl, Poke, Salad, Drink, Side, etc.)" },
        { name: "calories", type: "INTEGER", nullable: true, description: "Calorie count (can be NULL)", descriptionFr: "Nombre de calories (peut être NULL)" },
      ],
    },
    {
      name: "orders",
      description: "Customer orders with restaurant, date, amount, and status",
      descriptionFr: "Commandes clients avec restaurant, date, montant et statut",
      rowCount: 30,
      columns: [
        { name: "order_id", type: "INTEGER", nullable: false, description: "Unique order ID", descriptionFr: "ID unique de la commande" },
        { name: "customer_name", type: "VARCHAR", nullable: false, description: "Customer full name", descriptionFr: "Nom complet du client" },
        { name: "restaurant_id", type: "INTEGER", nullable: false, description: "FK to restaurants", descriptionFr: "FK vers restaurants" },
        { name: "order_date", type: "DATE", nullable: false, description: "Order date", descriptionFr: "Date de commande" },
        { name: "total_amount", type: "DECIMAL(10,2)", nullable: false, description: "Total order amount in EUR", descriptionFr: "Montant total en EUR" },
        { name: "status", type: "VARCHAR", nullable: false, description: "Order status (delivered, cancelled, pending)", descriptionFr: "Statut (delivered, cancelled, pending)" },
      ],
    },
    {
      name: "deliveries",
      description: "Delivery tracking with estimated vs actual time and distance",
      descriptionFr: "Suivi des livraisons avec temps estimé vs réel et distance",
      rowCount: 25,
      columns: [
        { name: "delivery_id", type: "INTEGER", nullable: false, description: "Unique delivery ID", descriptionFr: "ID unique de la livraison" },
        { name: "order_id", type: "INTEGER", nullable: false, description: "FK to orders", descriptionFr: "FK vers orders" },
        { name: "rider_id", type: "INTEGER", nullable: false, description: "FK to riders", descriptionFr: "FK vers riders" },
        { name: "estimated_minutes", type: "INTEGER", nullable: false, description: "Estimated delivery time in minutes", descriptionFr: "Temps de livraison estimé en minutes" },
        { name: "actual_minutes", type: "INTEGER", nullable: true, description: "Actual delivery time in minutes (can be NULL if ongoing)", descriptionFr: "Temps de livraison réel en minutes (peut être NULL si en cours)" },
        { name: "distance_km", type: "DECIMAL(4,1)", nullable: false, description: "Delivery distance in km", descriptionFr: "Distance de livraison en km" },
      ],
    },
    {
      name: "ratings",
      description: "Customer ratings for restaurant and rider (1-5 stars)",
      descriptionFr: "Notes clients pour le restaurant et le livreur (1-5 étoiles)",
      rowCount: 18,
      columns: [
        { name: "rating_id", type: "INTEGER", nullable: false, description: "Unique rating ID", descriptionFr: "ID unique de la note" },
        { name: "order_id", type: "INTEGER", nullable: false, description: "FK to orders", descriptionFr: "FK vers orders" },
        { name: "restaurant_rating", type: "INTEGER", nullable: true, description: "Restaurant rating 1-5", descriptionFr: "Note restaurant 1-5" },
        { name: "rider_rating", type: "INTEGER", nullable: true, description: "Rider rating 1-5", descriptionFr: "Note livreur 1-5" },
        { name: "comment", type: "VARCHAR", nullable: true, description: "Optional comment (can be NULL)", descriptionFr: "Commentaire optionnel (peut être NULL)" },
      ],
    },
  ],
  questions: [
    {
      id: "fb-01",
      title: "Average delivery time by city",
      titleFr: "Temps de livraison moyen par ville",
      stakeholder: "Emma",
      stakeholderRole: "COO",
      difficulty: "easy",
      description:
        "Emma (COO) wants to compare average delivery times across the 5 cities to identify where operations need improvement. Show the city and average actual delivery time in minutes (rounded to 1 decimal), sorted from fastest to slowest.",
      descriptionFr:
        "Emma (COO) veut comparer les temps de livraison moyens dans les 5 villes pour identifier où les opérations doivent s'améliorer. Affiche la ville et le temps de livraison moyen réel en minutes (arrondi à 1 décimale), trié du plus rapide au plus lent.",
      hint: "Join deliveries with orders and restaurants to get the city. Use AVG(actual_minutes) and GROUP BY city.",
      hintFr: "Jointure entre deliveries, orders et restaurants pour obtenir la ville. Utilise AVG(actual_minutes) et GROUP BY city.",
      solutionQuery: `SELECT r.city,
  ROUND(AVG(d.actual_minutes), 1) AS avg_delivery_minutes
FROM deliveries d
JOIN orders o ON d.order_id = o.order_id
JOIN restaurants r ON o.restaurant_id = r.restaurant_id
GROUP BY r.city
ORDER BY avg_delivery_minutes ASC;`,
      expectedColumns: ["city", "avg_delivery_minutes"],
      expectedRows: [
        { city: "Paris", avg_delivery_minutes: 21.5 },
        { city: "Marseille", avg_delivery_minutes: 22.0 },
        { city: "Nantes", avg_delivery_minutes: 23.0 },
        { city: "Lyon", avg_delivery_minutes: 30.4 },
        { city: "Bordeaux", avg_delivery_minutes: 31.0 },
      ],
      orderMatters: true,
    },
    {
      id: "fb-02",
      title: "Restaurant ranking by customer rating",
      titleFr: "Classement des restaurants par note client",
      stakeholder: "Théo",
      stakeholderRole: "Head of Partnerships",
      difficulty: "easy",
      description:
        "Théo (Head of Partnerships) wants to rank partner restaurants by their average customer rating. Show the restaurant name, number of reviews, and average restaurant rating (rounded to 1 decimal), sorted by rating descending then name ascending.",
      descriptionFr:
        "Théo (Head of Partnerships) veut classer les restaurants partenaires par note client moyenne. Affiche le nom du restaurant, le nombre d'avis et la note moyenne du restaurant (arrondie à 1 décimale), trié par note décroissante puis nom croissant.",
      hint: "Join ratings with orders and restaurants. GROUP BY restaurant name. Use AVG(restaurant_rating).",
      hintFr: "Jointure entre ratings, orders et restaurants. GROUP BY nom du restaurant. Utilise AVG(restaurant_rating).",
      solutionQuery: `SELECT rest.name AS restaurant_name,
  COUNT(*) AS review_count,
  ROUND(AVG(rt.restaurant_rating), 1) AS avg_rating
FROM ratings rt
JOIN orders o ON rt.order_id = o.order_id
JOIN restaurants rest ON o.restaurant_id = rest.restaurant_id
GROUP BY rest.name
ORDER BY avg_rating DESC, restaurant_name ASC;`,
      expectedColumns: ["restaurant_name", "review_count", "avg_rating"],
      expectedRows: [
        { restaurant_name: "Açaí Corner", review_count: 2, avg_rating: 5.0 },
        { restaurant_name: "Buddha Bowl Bar", review_count: 3, avg_rating: 5.0 },
        { restaurant_name: "Vita Fresh", review_count: 2, avg_rating: 5.0 },
        { restaurant_name: "Bowl & Soul", review_count: 2, avg_rating: 4.5 },
        { restaurant_name: "Fresh Factory", review_count: 1, avg_rating: 4.0 },
        { restaurant_name: "Grain de Folie", review_count: 2, avg_rating: 4.0 },
        { restaurant_name: "Green Garden", review_count: 3, avg_rating: 4.0 },
        { restaurant_name: "Zen Kitchen", review_count: 1, avg_rating: 4.0 },
        { restaurant_name: "Poké Palace", review_count: 1, avg_rating: 3.0 },
        { restaurant_name: "Super Bowl", review_count: 1, avg_rating: 3.0 },
      ],
      orderMatters: true,
    },
    {
      id: "fb-03",
      title: "Daily order count",
      titleFr: "Nombre de commandes par jour",
      stakeholder: "Jade",
      stakeholderRole: "Product Manager App",
      difficulty: "easy",
      description:
        "Jade (Product Manager) wants to see the number of delivered orders per day to understand daily demand patterns. Show the order date and number of orders, sorted chronologically.",
      descriptionFr:
        "Jade (Product Manager) veut voir le nombre de commandes livrées par jour pour comprendre les patterns de demande. Affiche la date de commande et le nombre de commandes, trié chronologiquement.",
      hint: "Filter WHERE status = 'delivered'. GROUP BY order_date, COUNT(*), ORDER BY order_date.",
      hintFr: "Filtre WHERE status = 'delivered'. GROUP BY order_date, COUNT(*), ORDER BY order_date.",
      solutionQuery: `SELECT order_date, COUNT(*) AS order_count
FROM orders
WHERE status = 'delivered'
GROUP BY order_date
ORDER BY order_date;`,
      expectedColumns: ["order_date", "order_count"],
      expectedRows: [
        { order_date: "2024-03-01", order_count: 2 },
        { order_date: "2024-03-02", order_count: 2 },
        { order_date: "2024-03-03", order_count: 2 },
        { order_date: "2024-03-04", order_count: 2 },
        { order_date: "2024-03-05", order_count: 2 },
        { order_date: "2024-03-06", order_count: 2 },
        { order_date: "2024-03-07", order_count: 2 },
        { order_date: "2024-03-08", order_count: 2 },
        { order_date: "2024-03-09", order_count: 1 },
        { order_date: "2024-03-10", order_count: 2 },
        { order_date: "2024-03-11", order_count: 2 },
        { order_date: "2024-03-12", order_count: 2 },
        { order_date: "2024-03-13", order_count: 2 },
        { order_date: "2024-03-14", order_count: 1 },
        { order_date: "2024-03-15", order_count: 2 },
      ],
      orderMatters: true,
    },
    {
      id: "fb-04",
      title: "Restaurants with the most orders",
      titleFr: "Restaurants avec le plus de commandes",
      stakeholder: "Théo",
      stakeholderRole: "Head of Partnerships",
      difficulty: "easy",
      description:
        "Théo (Head of Partnerships) wants to know which restaurants receive the most orders. Show the restaurant name, cuisine type, and total number of delivered orders, sorted by order count descending.",
      descriptionFr:
        "Théo (Head of Partnerships) veut savoir quels restaurants reçoivent le plus de commandes. Affiche le nom du restaurant, le type de cuisine et le nombre total de commandes livrées, trié par nombre de commandes décroissant.",
      hint: "Join orders with restaurants. Filter on delivered status. GROUP BY restaurant name and cuisine type.",
      hintFr: "Jointure entre orders et restaurants. Filtre sur le statut delivered. GROUP BY nom du restaurant et type de cuisine.",
      solutionQuery: `SELECT rest.name AS restaurant_name, rest.cuisine_type, COUNT(*) AS order_count
FROM orders o
JOIN restaurants rest ON o.restaurant_id = rest.restaurant_id
WHERE o.status = 'delivered'
GROUP BY rest.name, rest.cuisine_type
ORDER BY order_count DESC, restaurant_name ASC;`,
      expectedColumns: ["restaurant_name", "cuisine_type", "order_count"],
      expectedRows: [
        { restaurant_name: "Açaí Corner", cuisine_type: "Açaí", order_count: 3 },
        { restaurant_name: "Buddha Bowl Bar", cuisine_type: "Veggie", order_count: 3 },
        { restaurant_name: "Green Garden", cuisine_type: "Veggie", order_count: 3 },
        { restaurant_name: "Vita Fresh", cuisine_type: "Salad", order_count: 3 },
        { restaurant_name: "Bowl & Soul", cuisine_type: "Poke", order_count: 2 },
        { restaurant_name: "Fresh Factory", cuisine_type: "Salad", order_count: 2 },
        { restaurant_name: "Grain de Folie", cuisine_type: "Grain Bowl", order_count: 2 },
        { restaurant_name: "Le Bol Doré", cuisine_type: "Grain Bowl", order_count: 2 },
        { restaurant_name: "Poké Palace", cuisine_type: "Poke", order_count: 2 },
        { restaurant_name: "Smoothie & Bowl", cuisine_type: "Açaí", order_count: 2 },
        { restaurant_name: "Super Bowl", cuisine_type: "Poke", order_count: 2 },
        { restaurant_name: "Zen Kitchen", cuisine_type: "Asian Fusion", order_count: 2 },
      ],
      orderMatters: true,
    },
    {
      id: "fb-05",
      title: "Late deliveries analysis",
      titleFr: "Analyse des livraisons en retard",
      stakeholder: "Emma",
      stakeholderRole: "COO",
      difficulty: "easy",
      description:
        "Emma (COO) needs to identify all late deliveries where the actual time exceeded the estimated time. Show the order ID, customer name, restaurant name, estimated time, actual time, and delay in minutes, sorted by delay descending.",
      descriptionFr:
        "Emma (COO) doit identifier toutes les livraisons en retard où le temps réel a dépassé le temps estimé. Affiche l'ID de commande, le nom du client, le nom du restaurant, le temps estimé, le temps réel et le retard en minutes, trié par retard décroissant.",
      hint: "Join deliveries, orders, and restaurants. Filter WHERE actual_minutes > estimated_minutes. Compute the difference.",
      hintFr: "Jointure entre deliveries, orders et restaurants. Filtre WHERE actual_minutes > estimated_minutes. Calcule la différence.",
      solutionQuery: `SELECT o.order_id, o.customer_name, rest.name AS restaurant_name,
  d.estimated_minutes, d.actual_minutes,
  (d.actual_minutes - d.estimated_minutes) AS delay_minutes
FROM deliveries d
JOIN orders o ON d.order_id = o.order_id
JOIN restaurants rest ON o.restaurant_id = rest.restaurant_id
WHERE d.actual_minutes > d.estimated_minutes
ORDER BY delay_minutes DESC, o.order_id ASC;`,
      expectedColumns: ["order_id", "customer_name", "restaurant_name", "estimated_minutes", "actual_minutes", "delay_minutes"],
      expectedRows: [
        { order_id: 15, customer_name: "Florian Petit", restaurant_name: "Smoothie & Bowl", estimated_minutes: 30, actual_minutes: 38, delay_minutes: 8 },
        { order_id: 10, customer_name: "Jules Robert", restaurant_name: "Poké Palace", estimated_minutes: 20, actual_minutes: 26, delay_minutes: 6 },
        { order_id: 3, customer_name: "Clara Leroy", restaurant_name: "Vita Fresh", estimated_minutes: 30, actual_minutes: 35, delay_minutes: 5 },
        { order_id: 8, customer_name: "Hugo Garcia", restaurant_name: "Super Bowl", estimated_minutes: 25, actual_minutes: 30, delay_minutes: 5 },
        { order_id: 5, customer_name: "Emma Simon", restaurant_name: "Açaí Corner", estimated_minutes: 20, actual_minutes: 24, delay_minutes: 4 },
        { order_id: 1, customer_name: "Alice Dupont", restaurant_name: "Green Garden", estimated_minutes: 25, actual_minutes: 28, delay_minutes: 3 },
        { order_id: 22, customer_name: "Clara Leroy", restaurant_name: "Green Garden", estimated_minutes: 20, actual_minutes: 23, delay_minutes: 3 },
        { order_id: 24, customer_name: "Emma Simon", restaurant_name: "Le Bol Doré", estimated_minutes: 30, actual_minutes: 33, delay_minutes: 3 },
        { order_id: 6, customer_name: "Florian Petit", restaurant_name: "Zen Kitchen", estimated_minutes: 30, actual_minutes: 32, delay_minutes: 2 },
        { order_id: 13, customer_name: "Emma Simon", restaurant_name: "Bowl & Soul", estimated_minutes: 20, actual_minutes: 22, delay_minutes: 2 },
        { order_id: 19, customer_name: "Jules Robert", restaurant_name: "Grain de Folie", estimated_minutes: 25, actual_minutes: 27, delay_minutes: 2 },
        { order_id: 11, customer_name: "Bob Martin", restaurant_name: "Green Garden", estimated_minutes: 20, actual_minutes: 21, delay_minutes: 1 },
        { order_id: 23, customer_name: "Lucas Faure", restaurant_name: "Poké Palace", estimated_minutes: 20, actual_minutes: 21, delay_minutes: 1 },
      ],
      orderMatters: true,
    },
    {
      id: "fb-06",
      title: "Revenue by restaurant",
      titleFr: "Chiffre d'affaires par restaurant",
      stakeholder: "Théo",
      stakeholderRole: "Head of Partnerships",
      difficulty: "medium",
      description:
        "Théo (Head of Partnerships) needs to see total revenue per restaurant for delivered orders. Show the restaurant name, number of orders, and total revenue, sorted by revenue descending. This helps negotiate commission rates.",
      descriptionFr:
        "Théo (Head of Partnerships) a besoin de voir le chiffre d'affaires total par restaurant pour les commandes livrées. Affiche le nom du restaurant, le nombre de commandes et le CA total, trié par CA décroissant. Cela aide à négocier les taux de commission.",
      hint: "Join orders with restaurants. Filter on delivered status. GROUP BY restaurant name. SUM(total_amount).",
      hintFr: "Jointure entre orders et restaurants. Filtre sur le statut delivered. GROUP BY nom du restaurant. SUM(total_amount).",
      solutionQuery: `SELECT rest.name AS restaurant_name,
  COUNT(*) AS order_count,
  SUM(o.total_amount) AS total_revenue
FROM orders o
JOIN restaurants rest ON o.restaurant_id = rest.restaurant_id
WHERE o.status = 'delivered'
GROUP BY rest.name
ORDER BY total_revenue DESC;`,
      expectedColumns: ["restaurant_name", "order_count", "total_revenue"],
      expectedRows: [
        { restaurant_name: "Buddha Bowl Bar", order_count: 3, total_revenue: 60.20 },
        { restaurant_name: "Green Garden", order_count: 3, total_revenue: 45.20 },
        { restaurant_name: "Açaí Corner", order_count: 3, total_revenue: 44.80 },
        { restaurant_name: "Vita Fresh", order_count: 3, total_revenue: 42.80 },
        { restaurant_name: "Zen Kitchen", order_count: 2, total_revenue: 36.80 },
        { restaurant_name: "Poké Palace", order_count: 2, total_revenue: 31.90 },
        { restaurant_name: "Super Bowl", order_count: 2, total_revenue: 31.00 },
        { restaurant_name: "Fresh Factory", order_count: 2, total_revenue: 30.30 },
        { restaurant_name: "Bowl & Soul", order_count: 2, total_revenue: 29.40 },
        { restaurant_name: "Grain de Folie", order_count: 2, total_revenue: 26.40 },
        { restaurant_name: "Le Bol Doré", order_count: 2, total_revenue: 25.00 },
        { restaurant_name: "Smoothie & Bowl", order_count: 2, total_revenue: 21.00 },
      ],
      orderMatters: true,
    },
    {
      id: "fb-07",
      title: "Rider performance ranking",
      titleFr: "Classement des performances livreurs",
      stakeholder: "Emma",
      stakeholderRole: "COO",
      difficulty: "medium",
      description:
        "Emma (COO) wants to evaluate rider performance. Show each rider's first name, last name, number of completed deliveries, and average delivery time in minutes (rounded to 1 decimal). Only include riders who have at least one delivery. Sort by average delivery time ascending.",
      descriptionFr:
        "Emma (COO) veut évaluer la performance des livreurs. Affiche le prénom, nom, nombre de livraisons effectuées et le temps de livraison moyen en minutes (arrondi à 1 décimale) de chaque livreur. Inclus uniquement les livreurs ayant au moins une livraison. Trie par temps de livraison moyen croissant.",
      hint: "Join riders with deliveries. GROUP BY rider. Use AVG(actual_minutes). ORDER BY avg ascending.",
      hintFr: "Jointure entre riders et deliveries. GROUP BY livreur. Utilise AVG(actual_minutes). ORDER BY moyenne croissante.",
      solutionQuery: `SELECT r.first_name, r.last_name,
  COUNT(*) AS delivery_count,
  ROUND(AVG(d.actual_minutes), 1) AS avg_delivery_minutes
FROM riders r
JOIN deliveries d ON r.rider_id = d.rider_id
GROUP BY r.rider_id, r.first_name, r.last_name
ORDER BY avg_delivery_minutes ASC, r.last_name ASC;`,
      expectedColumns: ["first_name", "last_name", "delivery_count", "avg_delivery_minutes"],
      expectedRows: [
        { first_name: "Léa", last_name: "Bernard", delivery_count: 2, avg_delivery_minutes: 20.0 },
        { first_name: "Raphaël", last_name: "Robert", delivery_count: 3, avg_delivery_minutes: 20.0 },
        { first_name: "Camille", last_name: "Moreau", delivery_count: 3, avg_delivery_minutes: 20.3 },
        { first_name: "Louis", last_name: "Garcia", delivery_count: 2, avg_delivery_minutes: 22.5 },
        { first_name: "Chloé", last_name: "Thomas", delivery_count: 2, avg_delivery_minutes: 23.5 },
        { first_name: "Lucas", last_name: "Martin", delivery_count: 3, avg_delivery_minutes: 24.0 },
        { first_name: "Théo", last_name: "Leroy", delivery_count: 2, avg_delivery_minutes: 24.5 },
        { first_name: "Manon", last_name: "Durand", delivery_count: 2, avg_delivery_minutes: 27.5 },
        { first_name: "Hugo", last_name: "Petit", delivery_count: 2, avg_delivery_minutes: 29.5 },
        { first_name: "Nathan", last_name: "Simon", delivery_count: 2, avg_delivery_minutes: 30.0 },
        { first_name: "Emma", last_name: "Laurent", delivery_count: 1, avg_delivery_minutes: 33.0 },
        { first_name: "Jade", last_name: "Richard", delivery_count: 1, avg_delivery_minutes: 38.0 },
      ],
      orderMatters: true,
    },
    {
      id: "fb-08",
      title: "Customer satisfaction by city",
      titleFr: "Satisfaction client par ville",
      stakeholder: "Jade",
      stakeholderRole: "Product Manager App",
      difficulty: "medium",
      description:
        "Jade (Product Manager) wants to understand customer satisfaction trends across cities. Show each city with the average restaurant rating and average rider rating (both rounded to 1 decimal), sorted by restaurant rating descending.",
      descriptionFr:
        "Jade (Product Manager) veut comprendre les tendances de satisfaction client par ville. Affiche chaque ville avec la note moyenne restaurant et la note moyenne livreur (toutes deux arrondies à 1 décimale), trié par note restaurant décroissante.",
      hint: "Join ratings with orders and restaurants. GROUP BY city. Use AVG on both rating columns.",
      hintFr: "Jointure entre ratings, orders et restaurants. GROUP BY ville. Utilise AVG sur les deux colonnes de notes.",
      solutionQuery: `SELECT rest.city,
  ROUND(AVG(rt.restaurant_rating), 1) AS avg_restaurant_rating,
  ROUND(AVG(rt.rider_rating), 1) AS avg_rider_rating
FROM ratings rt
JOIN orders o ON rt.order_id = o.order_id
JOIN restaurants rest ON o.restaurant_id = rest.restaurant_id
GROUP BY rest.city
ORDER BY avg_restaurant_rating DESC, city ASC;`,
      expectedColumns: ["city", "avg_restaurant_rating", "avg_rider_rating"],
      expectedRows: [
        { city: "Marseille", avg_restaurant_rating: 4.5, avg_rider_rating: 4.3 },
        { city: "Paris", avg_restaurant_rating: 4.5, avg_rider_rating: 4.5 },
        { city: "Lyon", avg_restaurant_rating: 4.3, avg_rider_rating: 3.3 },
        { city: "Bordeaux", avg_restaurant_rating: 4.0, avg_rider_rating: 4.0 },
        { city: "Nantes", avg_restaurant_rating: 3.5, avg_rider_rating: 3.0 },
      ],
      orderMatters: true,
    },
    {
      id: "fb-09",
      title: "Repeat customers and their spending",
      titleFr: "Clients fidèles et leurs dépenses",
      stakeholder: "Jade",
      stakeholderRole: "Product Manager App",
      difficulty: "hard",
      description:
        "Jade (Product Manager) wants to identify the most loyal customers. Show the customer name, total number of delivered orders, and total amount spent for all customers, sorted by order count descending then total spent descending.",
      descriptionFr:
        "Jade (Product Manager) veut identifier les clients les plus fidèles. Affiche le nom du client, le nombre total de commandes livrées et le montant total dépensé pour tous les clients, trié par nombre de commandes décroissant puis montant total décroissant.",
      hint: "GROUP BY customer_name on the orders table. Filter on delivered status. COUNT and SUM.",
      hintFr: "GROUP BY customer_name sur la table orders. Filtre sur le statut delivered. COUNT et SUM.",
      solutionQuery: `SELECT customer_name,
  COUNT(*) AS order_count,
  SUM(total_amount) AS total_spent
FROM orders
WHERE status = 'delivered'
GROUP BY customer_name
ORDER BY order_count DESC, total_spent DESC;`,
      expectedColumns: ["customer_name", "order_count", "total_spent"],
      expectedRows: [
        { customer_name: "Alice Dupont", order_count: 4, total_spent: 54.60 },
        { customer_name: "Florian Petit", order_count: 3, total_spent: 59.00 },
        { customer_name: "Inès Thomas", order_count: 3, total_spent: 52.40 },
        { customer_name: "Emma Simon", order_count: 3, total_spent: 49.80 },
        { customer_name: "Clara Leroy", order_count: 3, total_spent: 46.80 },
        { customer_name: "Bob Martin", order_count: 3, total_spent: 42.90 },
        { customer_name: "Jules Robert", order_count: 3, total_spent: 42.10 },
        { customer_name: "David Moreau", order_count: 3, total_spent: 36.00 },
        { customer_name: "Hugo Garcia", order_count: 1, total_spent: 15.50 },
        { customer_name: "Lucas Faure", order_count: 1, total_spent: 13.50 },
        { customer_name: "Karine Blanc", order_count: 1, total_spent: 12.20 },
      ],
      orderMatters: true,
    },
    {
      id: "fb-10",
      title: "Revenue and average order value by city",
      titleFr: "CA et panier moyen par ville",
      stakeholder: "Emma",
      stakeholderRole: "COO",
      difficulty: "hard",
      description:
        "Emma (COO) needs a city-level performance report for the board meeting. Show each city with the total number of delivered orders, total revenue, and average order value (rounded to 2 decimals), sorted by total revenue descending.",
      descriptionFr:
        "Emma (COO) a besoin d'un rapport de performance par ville pour le board. Affiche chaque ville avec le nombre total de commandes livrées, le CA total et le panier moyen (arrondi à 2 décimales), trié par CA total décroissant.",
      hint: "Join orders with restaurants to get city. Filter on delivered. GROUP BY city. Use SUM, COUNT, and ROUND(AVG(...), 2).",
      hintFr: "Jointure entre orders et restaurants pour obtenir la ville. Filtre sur delivered. GROUP BY ville. Utilise SUM, COUNT et ROUND(AVG(...), 2).",
      solutionQuery: `SELECT rest.city,
  COUNT(*) AS order_count,
  SUM(o.total_amount) AS total_revenue,
  ROUND(AVG(o.total_amount), 2) AS avg_order_value
FROM orders o
JOIN restaurants rest ON o.restaurant_id = rest.restaurant_id
WHERE o.status = 'delivered'
GROUP BY rest.city
ORDER BY total_revenue DESC;`,
      expectedColumns: ["city", "order_count", "total_revenue", "avg_order_value"],
      expectedRows: [
        { city: "Paris", order_count: 8, total_revenue: 134.80, avg_order_value: 16.85 },
        { city: "Lyon", order_count: 7, total_revenue: 94.80, avg_order_value: 13.54 },
        { city: "Marseille", order_count: 5, total_revenue: 71.20, avg_order_value: 14.24 },
        { city: "Nantes", order_count: 4, total_revenue: 62.20, avg_order_value: 15.55 },
        { city: "Bordeaux", order_count: 4, total_revenue: 61.80, avg_order_value: 15.45 },
      ],
      orderMatters: true,
    },
  ],
};
