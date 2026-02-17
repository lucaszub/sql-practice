import type { CompanyProfile } from "./types";

const schema = `
CREATE TABLE users (
  user_id INTEGER PRIMARY KEY,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  country VARCHAR NOT NULL,
  plan VARCHAR NOT NULL,
  signup_date DATE NOT NULL,
  email VARCHAR,
  age INTEGER
);

CREATE TABLE artists (
  artist_id INTEGER PRIMARY KEY,
  artist_name VARCHAR NOT NULL,
  genre VARCHAR NOT NULL,
  country VARCHAR NOT NULL,
  signup_date DATE NOT NULL,
  monthly_listeners INTEGER
);

CREATE TABLE streams (
  stream_id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id),
  artist_id INTEGER NOT NULL REFERENCES artists(artist_id),
  track_name VARCHAR NOT NULL,
  genre VARCHAR NOT NULL,
  streamed_at TIMESTAMP NOT NULL,
  duration_seconds INTEGER NOT NULL,
  source VARCHAR NOT NULL
);

CREATE TABLE playlists (
  playlist_id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id),
  playlist_name VARCHAR NOT NULL,
  track_count INTEGER NOT NULL,
  is_public BOOLEAN NOT NULL,
  created_at DATE NOT NULL
);

CREATE TABLE listening_sessions (
  session_id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id),
  session_start TIMESTAMP NOT NULL,
  session_end TIMESTAMP NOT NULL,
  device VARCHAR NOT NULL,
  tracks_played INTEGER NOT NULL
);

CREATE TABLE royalties (
  royalty_id INTEGER PRIMARY KEY,
  artist_id INTEGER NOT NULL REFERENCES artists(artist_id),
  month DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  stream_count INTEGER NOT NULL
);

-- Users (25 rows)
INSERT INTO users VALUES
  (1, 'Léa', 'Moreau', 'France', 'premium', '2023-01-10', 'lea.moreau@email.com', 28),
  (2, 'Thomas', 'Bernard', 'France', 'free', '2023-01-22', 'thomas.b@email.com', 34),
  (3, 'Camille', 'Dubois', 'Belgium', 'premium', '2023-02-05', 'camille.d@email.com', 22),
  (4, 'Hugo', 'Petit', 'France', 'free', '2023-02-18', 'hugo.petit@email.com', 19),
  (5, 'Manon', 'Roux', 'Switzerland', 'premium', '2023-03-01', 'manon.roux@email.com', 31),
  (6, 'Lucas', 'Fournier', 'France', 'family', '2023-03-15', 'lucas.f@email.com', 42),
  (7, 'Emma', 'Girard', 'France', 'free', '2023-04-02', NULL, 26),
  (8, 'Nathan', 'Andre', 'Belgium', 'premium', '2023-04-20', 'nathan.andre@email.com', 29),
  (9, 'Chloé', 'Leroy', 'France', 'free', '2023-05-08', 'chloe.leroy@email.com', 23),
  (10, 'Maxime', 'Simon', 'France', 'premium', '2023-05-25', 'maxime.s@email.com', 37),
  (11, 'Sarah', 'Laurent', 'Switzerland', 'family', '2023-06-10', 'sarah.l@email.com', 45),
  (12, 'Antoine', 'Lefebvre', 'France', 'free', '2023-06-28', NULL, 20),
  (13, 'Julie', 'Garcia', 'France', 'premium', '2023-07-15', 'julie.garcia@email.com', 33),
  (14, 'Romain', 'Martinez', 'France', 'free', '2023-08-01', 'romain.m@email.com', 27),
  (15, 'Clara', 'Bonnet', 'Belgium', 'premium', '2023-08-20', 'clara.bonnet@email.com', NULL),
  (16, 'Alexandre', 'Dupont', 'France', 'family', '2023-09-05', 'alex.dupont@email.com', 38),
  (17, 'Inès', 'Fontaine', 'France', 'free', '2023-09-22', NULL, 21),
  (18, 'Gabriel', 'Rousseau', 'Switzerland', 'premium', '2023-10-10', 'gabriel.r@email.com', 30),
  (19, 'Zoé', 'Chevalier', 'France', 'free', '2023-10-28', 'zoe.c@email.com', 25),
  (20, 'Louis', 'Blanc', 'France', 'premium', '2023-11-15', 'louis.blanc@email.com', 41),
  (21, 'Jade', 'Faure', 'Belgium', 'family', '2023-12-01', 'jade.faure@email.com', 35),
  (22, 'Raphaël', 'Perrin', 'France', 'free', '2024-01-08', 'raphael.p@email.com', 18),
  (23, 'Lina', 'Clement', 'France', 'premium', '2024-01-25', 'lina.clement@email.com', 29),
  (24, 'Enzo', 'Mercier', 'Switzerland', 'free', '2024-02-10', NULL, NULL),
  (25, 'Agathe', 'Guerin', 'France', 'premium', '2024-03-01', 'agathe.g@email.com', 26);

-- Artists (15 rows)
INSERT INTO artists VALUES
  (1, 'Luna Nova', 'pop', 'France', '2022-01-15', 45000),
  (2, 'Les Échos', 'rock', 'Belgium', '2022-03-01', 32000),
  (3, 'DJ Pulse', 'electronic', 'France', '2022-04-20', 28000),
  (4, 'Alma Soul', 'jazz', 'Switzerland', '2021-11-10', 15000),
  (5, 'Fracture', 'rock', 'France', '2022-06-05', 22000),
  (6, 'Nuit Blanche', 'electronic', 'France', '2022-08-12', 38000),
  (7, 'Rosa Parks', 'hip-hop', 'Belgium', '2022-09-30', 51000),
  (8, 'Mélodie', 'pop', 'France', '2023-01-10', 12000),
  (9, 'Soleil Noir', 'jazz', 'France', '2023-03-25', 8000),
  (10, 'Éclipse', 'electronic', 'Switzerland', '2023-05-15', 19000),
  (11, 'Vague Bleue', 'pop', 'France', '2023-07-01', 25000),
  (12, 'Le Quatuor', 'classical', 'Belgium', '2023-08-20', NULL),
  (13, 'Tempête', 'rock', 'France', '2023-10-05', 16000),
  (14, 'Ondes FM', 'hip-hop', 'France', '2023-12-01', 9000),
  (15, 'Aurore', 'pop', 'Switzerland', '2024-02-15', 5000);

-- Streams (50 rows)
INSERT INTO streams VALUES
  (1, 1, 1, 'Clair de lune', 'pop', '2024-03-01 08:15:00', 210, 'playlist'),
  (2, 1, 1, 'Étoile filante', 'pop', '2024-03-01 08:19:00', 195, 'playlist'),
  (3, 1, 6, 'Nuit électrique', 'electronic', '2024-03-01 08:23:00', 320, 'search'),
  (4, 2, 7, 'Rues de Bruxelles', 'hip-hop', '2024-03-01 10:00:00', 240, 'recommendation'),
  (5, 2, 7, 'Flow capital', 'hip-hop', '2024-03-01 10:04:00', 198, 'recommendation'),
  (6, 3, 3, 'Bass Drop', 'electronic', '2024-03-01 14:30:00', 280, 'playlist'),
  (7, 3, 6, 'Synthwave Dreams', 'electronic', '2024-03-01 14:35:00', 310, 'playlist'),
  (8, 3, 10, 'Digital Rain', 'electronic', '2024-03-01 14:40:00', 265, 'playlist'),
  (9, 4, 2, 'Mur du son', 'rock', '2024-03-02 09:00:00', 245, 'search'),
  (10, 4, 5, 'Tremblement', 'rock', '2024-03-02 09:05:00', 230, 'search'),
  (11, 5, 4, 'Minuit à Genève', 'jazz', '2024-03-02 20:00:00', 340, 'recommendation'),
  (12, 5, 9, 'Crépuscule', 'jazz', '2024-03-02 20:06:00', 290, 'recommendation'),
  (13, 6, 1, 'Clair de lune', 'pop', '2024-03-03 07:30:00', 210, 'playlist'),
  (14, 6, 11, 'Océan pacifique', 'pop', '2024-03-03 07:34:00', 225, 'playlist'),
  (15, 7, 7, 'Rues de Bruxelles', 'hip-hop', '2024-03-03 12:00:00', 240, 'search'),
  (16, 7, 14, 'Fréquence libre', 'hip-hop', '2024-03-03 12:04:00', 215, 'search'),
  (17, 8, 6, 'Nuit électrique', 'electronic', '2024-03-04 18:00:00', 320, 'recommendation'),
  (18, 8, 3, 'Bass Drop', 'electronic', '2024-03-04 18:06:00', 280, 'recommendation'),
  (19, 9, 1, 'Clair de lune', 'pop', '2024-03-05 08:00:00', 210, 'playlist'),
  (20, 9, 8, 'Petite chanson', 'pop', '2024-03-05 08:04:00', 185, 'playlist'),
  (21, 10, 2, 'Mur du son', 'rock', '2024-03-05 19:00:00', 245, 'search'),
  (22, 10, 13, 'Ouragan', 'rock', '2024-03-05 19:05:00', 260, 'search'),
  (23, 11, 12, 'Adagio en si', 'classical', '2024-03-06 21:00:00', 420, 'recommendation'),
  (24, 12, 7, 'Flow capital', 'hip-hop', '2024-03-06 15:00:00', 198, 'search'),
  (25, 13, 1, 'Étoile filante', 'pop', '2024-03-07 09:30:00', 195, 'playlist'),
  (26, 13, 11, 'Vague après vague', 'pop', '2024-03-07 09:34:00', 205, 'playlist'),
  (27, 14, 5, 'Tremblement', 'rock', '2024-03-07 17:00:00', 230, 'recommendation'),
  (28, 15, 6, 'Synthwave Dreams', 'electronic', '2024-03-08 22:00:00', 310, 'playlist'),
  (29, 15, 10, 'Digital Rain', 'electronic', '2024-03-08 22:06:00', 265, 'playlist'),
  (30, 16, 1, 'Clair de lune', 'pop', '2024-03-09 07:00:00', 210, 'recommendation'),
  (31, 16, 15, 'Premier matin', 'pop', '2024-03-09 07:04:00', 180, 'recommendation'),
  (32, 17, 7, 'Rues de Bruxelles', 'hip-hop', '2024-03-09 16:00:00', 240, 'search'),
  (33, 18, 4, 'Minuit à Genève', 'jazz', '2024-03-10 20:30:00', 340, 'playlist'),
  (34, 18, 9, 'Ombre et lumière', 'jazz', '2024-03-10 20:36:00', 300, 'playlist'),
  (35, 19, 3, 'Bass Drop', 'electronic', '2024-03-11 14:00:00', 280, 'search'),
  (36, 20, 2, 'Mur du son', 'rock', '2024-03-11 19:30:00', 245, 'playlist'),
  (37, 20, 5, 'Éclats', 'rock', '2024-03-11 19:35:00', 220, 'playlist'),
  (38, 21, 11, 'Océan pacifique', 'pop', '2024-03-12 10:00:00', 225, 'recommendation'),
  (39, 22, 14, 'Fréquence libre', 'hip-hop', '2024-03-12 16:30:00', 215, 'search'),
  (40, 23, 1, 'Clair de lune', 'pop', '2024-03-13 08:00:00', 210, 'playlist'),
  (41, 23, 8, 'Douce mélodie', 'pop', '2024-03-13 08:04:00', 200, 'recommendation'),
  (42, 24, 6, 'Nuit électrique', 'electronic', '2024-03-13 23:00:00', 320, 'search'),
  (43, 25, 1, 'Étoile filante', 'pop', '2024-03-14 09:00:00', 195, 'playlist'),
  (44, 25, 11, 'Vague après vague', 'pop', '2024-03-14 09:04:00', 205, 'playlist'),
  (45, 1, 7, 'Flow capital', 'hip-hop', '2024-03-14 12:00:00', 198, 'recommendation'),
  (46, 3, 6, 'Aurora Borealis', 'electronic', '2024-03-14 22:00:00', 295, 'playlist'),
  (47, 5, 4, 'Solo de minuit', 'jazz', '2024-03-15 20:00:00', 360, 'recommendation'),
  (48, 10, 13, 'Tempête de fer', 'rock', '2024-03-15 19:00:00', 275, 'search'),
  (49, 1, 1, 'Clair de lune', 'pop', '2024-03-15 08:00:00', 210, 'playlist'),
  (50, 2, 2, 'Mur du son', 'rock', '2024-03-15 10:00:00', 245, 'search');

-- Playlists (12 rows)
INSERT INTO playlists VALUES
  (1, 1, 'Morning Vibes', 8, TRUE, '2024-01-15'),
  (2, 1, 'Late Night Electronic', 12, TRUE, '2024-02-01'),
  (3, 3, 'Electro Mix', 15, TRUE, '2024-01-20'),
  (4, 5, 'Jazz Evenings', 6, TRUE, '2024-02-10'),
  (5, 7, 'Hip-Hop Essentials', 10, FALSE, '2024-01-25'),
  (6, 10, 'Rock Classics', 9, TRUE, '2024-03-01'),
  (7, 13, 'Pop Hits 2024', 20, TRUE, '2024-02-15'),
  (8, 16, 'Family Favorites', 14, FALSE, '2024-03-05'),
  (9, 20, 'Workout Rock', 11, TRUE, '2024-02-20'),
  (10, 23, 'Chill Pop', 7, TRUE, '2024-03-10'),
  (11, 6, 'Sunday Morning', 5, FALSE, '2024-01-30'),
  (12, 18, 'Swiss Jazz Selection', 8, TRUE, '2024-03-12');

-- Listening sessions (20 rows)
INSERT INTO listening_sessions VALUES
  (1, 1, '2024-03-01 08:00:00', '2024-03-01 09:30:00', 'mobile', 12),
  (2, 2, '2024-03-01 09:45:00', '2024-03-01 10:30:00', 'desktop', 5),
  (3, 3, '2024-03-01 14:00:00', '2024-03-01 16:00:00', 'mobile', 15),
  (4, 4, '2024-03-02 08:30:00', '2024-03-02 09:30:00', 'desktop', 6),
  (5, 5, '2024-03-02 19:30:00', '2024-03-02 21:00:00', 'smart_speaker', 8),
  (6, 6, '2024-03-03 07:00:00', '2024-03-03 08:15:00', 'mobile', 7),
  (7, 7, '2024-03-03 11:30:00', '2024-03-03 12:30:00', 'desktop', 6),
  (8, 8, '2024-03-04 17:30:00', '2024-03-04 19:00:00', 'mobile', 10),
  (9, 9, '2024-03-05 07:30:00', '2024-03-05 08:30:00', 'mobile', 5),
  (10, 10, '2024-03-05 18:30:00', '2024-03-05 20:00:00', 'desktop', 9),
  (11, 11, '2024-03-06 20:30:00', '2024-03-06 22:00:00', 'smart_speaker', 4),
  (12, 12, '2024-03-06 14:30:00', '2024-03-06 15:15:00', 'mobile', 3),
  (13, 13, '2024-03-07 09:00:00', '2024-03-07 10:30:00', 'desktop', 8),
  (14, 14, '2024-03-07 16:30:00', '2024-03-07 17:30:00', 'mobile', 4),
  (15, 15, '2024-03-08 21:30:00', '2024-03-08 23:00:00', 'desktop', 11),
  (16, 16, '2024-03-09 06:30:00', '2024-03-09 07:45:00', 'mobile', 6),
  (17, 18, '2024-03-10 20:00:00', '2024-03-10 21:30:00', 'smart_speaker', 7),
  (18, 20, '2024-03-11 19:00:00', '2024-03-11 20:15:00', 'desktop', 8),
  (19, 23, '2024-03-13 07:30:00', '2024-03-13 09:00:00', 'mobile', 9),
  (20, 25, '2024-03-14 08:30:00', '2024-03-14 09:30:00', 'mobile', 6);

-- Royalties (15 rows)
INSERT INTO royalties VALUES
  (1, 1, '2024-01-01', 450.00, 11250),
  (2, 7, '2024-01-01', 380.00, 9500),
  (3, 6, '2024-01-01', 320.00, 8000),
  (4, 2, '2024-01-01', 180.00, 4500),
  (5, 11, '2024-01-01', 200.00, 5000),
  (6, 1, '2024-02-01', 520.00, 13000),
  (7, 7, '2024-02-01', 410.00, 10250),
  (8, 6, '2024-02-01', 350.00, 8750),
  (9, 3, '2024-02-01', 190.00, 4750),
  (10, 11, '2024-02-01', 240.00, 6000),
  (11, 1, '2024-03-01', 580.00, 14500),
  (12, 7, '2024-03-01', 460.00, 11500),
  (13, 6, '2024-03-01', 390.00, 9750),
  (14, 4, '2024-03-01', 120.00, 3000),
  (15, 13, '2024-03-01', 95.00, 2375);
`;

export const streamPulse: CompanyProfile = {
  id: "streampulse",
  name: "StreamPulse",
  tagline: "The sound that pulses, the data that speaks",
  taglineFr: "Le son qui pulse, les données qui parlent",
  sector: "Streaming / Media",
  sectorFr: "Streaming / Média",
  icon: "🎵",
  description:
    "You just joined the data team at StreamPulse, an independent music streaming platform championing emerging artists. With 100,000 users, 50,000 tracks, and a homegrown recommendation algorithm, the 4-person data team needs your SQL skills to answer questions from Content, Finance, and Data Science.",
  descriptionFr:
    "Tu viens de rejoindre l'équipe data de StreamPulse, une plateforme de streaming musical indépendante qui mise sur les artistes émergents. Avec 100 000 utilisateurs, 50 000 morceaux et un algorithme de recommandation maison, l'équipe data (4 personnes) a besoin de tes compétences SQL pour répondre aux questions du Content, de la Finance et de la Data Science.",
  schema,
  tables: [
    {
      name: "users",
      description: "Registered users with plan and signup info",
      descriptionFr: "Utilisateurs inscrits avec plan et informations d'inscription",
      rowCount: 25,
      columns: [
        { name: "user_id", type: "INTEGER", nullable: false, description: "Unique user ID", descriptionFr: "ID unique de l'utilisateur" },
        { name: "first_name", type: "VARCHAR", nullable: false, description: "First name", descriptionFr: "Prénom" },
        { name: "last_name", type: "VARCHAR", nullable: false, description: "Last name", descriptionFr: "Nom de famille" },
        { name: "country", type: "VARCHAR", nullable: false, description: "Country of residence", descriptionFr: "Pays de résidence" },
        { name: "plan", type: "VARCHAR", nullable: false, description: "Subscription plan (free, premium, family)", descriptionFr: "Plan d'abonnement (free, premium, family)" },
        { name: "signup_date", type: "DATE", nullable: false, description: "Registration date", descriptionFr: "Date d'inscription" },
        { name: "email", type: "VARCHAR", nullable: true, description: "Email address (can be NULL)", descriptionFr: "Adresse email (peut être NULL)" },
        { name: "age", type: "INTEGER", nullable: true, description: "User age (can be NULL)", descriptionFr: "Âge de l'utilisateur (peut être NULL)" },
      ],
    },
    {
      name: "artists",
      description: "Music artists with genre and audience metrics",
      descriptionFr: "Artistes musicaux avec genre et métriques d'audience",
      rowCount: 15,
      columns: [
        { name: "artist_id", type: "INTEGER", nullable: false, description: "Unique artist ID", descriptionFr: "ID unique de l'artiste" },
        { name: "artist_name", type: "VARCHAR", nullable: false, description: "Artist name", descriptionFr: "Nom de l'artiste" },
        { name: "genre", type: "VARCHAR", nullable: false, description: "Primary music genre", descriptionFr: "Genre musical principal" },
        { name: "country", type: "VARCHAR", nullable: false, description: "Artist country", descriptionFr: "Pays de l'artiste" },
        { name: "signup_date", type: "DATE", nullable: false, description: "Platform registration date", descriptionFr: "Date d'inscription sur la plateforme" },
        { name: "monthly_listeners", type: "INTEGER", nullable: true, description: "Monthly listeners (can be NULL for new artists)", descriptionFr: "Auditeurs mensuels (peut être NULL pour les nouveaux artistes)" },
      ],
    },
    {
      name: "streams",
      description: "Individual track streams with timing and source",
      descriptionFr: "Écoutes individuelles avec timing et source",
      rowCount: 50,
      columns: [
        { name: "stream_id", type: "INTEGER", nullable: false, description: "Unique stream ID", descriptionFr: "ID unique de l'écoute" },
        { name: "user_id", type: "INTEGER", nullable: false, description: "FK to users", descriptionFr: "FK vers users" },
        { name: "artist_id", type: "INTEGER", nullable: false, description: "FK to artists", descriptionFr: "FK vers artists" },
        { name: "track_name", type: "VARCHAR", nullable: false, description: "Track title", descriptionFr: "Titre du morceau" },
        { name: "genre", type: "VARCHAR", nullable: false, description: "Track genre", descriptionFr: "Genre du morceau" },
        { name: "streamed_at", type: "TIMESTAMP", nullable: false, description: "Stream timestamp", descriptionFr: "Horodatage de l'écoute" },
        { name: "duration_seconds", type: "INTEGER", nullable: false, description: "Listening duration in seconds", descriptionFr: "Durée d'écoute en secondes" },
        { name: "source", type: "VARCHAR", nullable: false, description: "Discovery source (playlist, search, recommendation)", descriptionFr: "Source de découverte (playlist, search, recommendation)" },
      ],
    },
    {
      name: "playlists",
      description: "User-created playlists",
      descriptionFr: "Playlists créées par les utilisateurs",
      rowCount: 12,
      columns: [
        { name: "playlist_id", type: "INTEGER", nullable: false, description: "Unique playlist ID", descriptionFr: "ID unique de la playlist" },
        { name: "user_id", type: "INTEGER", nullable: false, description: "FK to users (creator)", descriptionFr: "FK vers users (créateur)" },
        { name: "playlist_name", type: "VARCHAR", nullable: false, description: "Playlist name", descriptionFr: "Nom de la playlist" },
        { name: "track_count", type: "INTEGER", nullable: false, description: "Number of tracks in playlist", descriptionFr: "Nombre de morceaux dans la playlist" },
        { name: "is_public", type: "BOOLEAN", nullable: false, description: "Whether the playlist is public", descriptionFr: "Si la playlist est publique" },
        { name: "created_at", type: "DATE", nullable: false, description: "Playlist creation date", descriptionFr: "Date de création de la playlist" },
      ],
    },
    {
      name: "listening_sessions",
      description: "User listening sessions with device and activity info",
      descriptionFr: "Sessions d'écoute avec appareil et informations d'activité",
      rowCount: 20,
      columns: [
        { name: "session_id", type: "INTEGER", nullable: false, description: "Unique session ID", descriptionFr: "ID unique de la session" },
        { name: "user_id", type: "INTEGER", nullable: false, description: "FK to users", descriptionFr: "FK vers users" },
        { name: "session_start", type: "TIMESTAMP", nullable: false, description: "Session start time", descriptionFr: "Heure de début de session" },
        { name: "session_end", type: "TIMESTAMP", nullable: false, description: "Session end time", descriptionFr: "Heure de fin de session" },
        { name: "device", type: "VARCHAR", nullable: false, description: "Listening device (mobile, desktop, smart_speaker)", descriptionFr: "Appareil d'écoute (mobile, desktop, smart_speaker)" },
        { name: "tracks_played", type: "INTEGER", nullable: false, description: "Number of tracks played in session", descriptionFr: "Nombre de morceaux joués dans la session" },
      ],
    },
    {
      name: "royalties",
      description: "Monthly royalty payments to artists",
      descriptionFr: "Paiements de royalties mensuels aux artistes",
      rowCount: 15,
      columns: [
        { name: "royalty_id", type: "INTEGER", nullable: false, description: "Unique royalty payment ID", descriptionFr: "ID unique du paiement de royalties" },
        { name: "artist_id", type: "INTEGER", nullable: false, description: "FK to artists", descriptionFr: "FK vers artists" },
        { name: "month", type: "DATE", nullable: false, description: "Payment month (first day)", descriptionFr: "Mois du paiement (premier jour)" },
        { name: "amount", type: "DECIMAL(10,2)", nullable: false, description: "Royalty amount in EUR", descriptionFr: "Montant des royalties en EUR" },
        { name: "stream_count", type: "INTEGER", nullable: false, description: "Number of streams that month", descriptionFr: "Nombre d'écoutes ce mois-là" },
      ],
    },
  ],
  questions: [
    {
      id: "sp-01",
      title: "Top artists by stream count",
      titleFr: "Top artistes par nombre d'écoutes",
      stakeholder: "Nina",
      stakeholderRole: "Head of Content",
      difficulty: "easy",
      description:
        "Nina (Head of Content) wants to know which artists are the most streamed on the platform. Show the artist name, genre, and total number of streams, sorted by stream count descending then artist name ascending.",
      descriptionFr:
        "Nina (Head of Content) veut savoir quels artistes sont les plus écoutés sur la plateforme. Affiche le nom de l'artiste, le genre et le nombre total d'écoutes, trié par nombre d'écoutes décroissant puis nom d'artiste croissant.",
      hint: "Join streams with artists. GROUP BY artist, then ORDER BY stream count descending.",
      hintFr: "Jointure entre streams et artists. GROUP BY artiste, puis ORDER BY nombre d'écoutes décroissant.",
      solutionQuery: `SELECT a.artist_name, a.genre, COUNT(*) AS stream_count
FROM streams s
JOIN artists a ON s.artist_id = a.artist_id
GROUP BY a.artist_name, a.genre
ORDER BY stream_count DESC, a.artist_name ASC;`,
      expectedColumns: ["artist_name", "genre", "stream_count"],
      expectedRows: [
        { artist_name: "Luna Nova", genre: "pop", stream_count: 9 },
        { artist_name: "Nuit Blanche", genre: "electronic", stream_count: 6 },
        { artist_name: "Rosa Parks", genre: "hip-hop", stream_count: 6 },
        { artist_name: "Les Échos", genre: "rock", stream_count: 4 },
        { artist_name: "Vague Bleue", genre: "pop", stream_count: 4 },
        { artist_name: "Alma Soul", genre: "jazz", stream_count: 3 },
        { artist_name: "DJ Pulse", genre: "electronic", stream_count: 3 },
        { artist_name: "Fracture", genre: "rock", stream_count: 3 },
        { artist_name: "Éclipse", genre: "electronic", stream_count: 2 },
        { artist_name: "Mélodie", genre: "pop", stream_count: 2 },
        { artist_name: "Ondes FM", genre: "hip-hop", stream_count: 2 },
        { artist_name: "Soleil Noir", genre: "jazz", stream_count: 2 },
        { artist_name: "Tempête", genre: "rock", stream_count: 2 },
        { artist_name: "Aurore", genre: "pop", stream_count: 1 },
        { artist_name: "Le Quatuor", genre: "classical", stream_count: 1 },
      ],
      orderMatters: true,
    },
    {
      id: "sp-02",
      title: "Average listening duration by plan",
      titleFr: "Durée d'écoute moyenne par plan",
      stakeholder: "Julien",
      stakeholderRole: "CFO",
      difficulty: "easy",
      description:
        "Julien (CFO) wants to understand listening behavior across subscription plans. Show each plan type, the number of streams, and the average listening duration in seconds rounded to the nearest integer, sorted by average duration descending.",
      descriptionFr:
        "Julien (CFO) veut comprendre le comportement d'écoute selon les plans d'abonnement. Affiche chaque type de plan, le nombre d'écoutes et la durée d'écoute moyenne en secondes arrondie à l'entier, trié par durée moyenne décroissante.",
      hint: "Join streams with users on user_id. GROUP BY plan. Use ROUND(AVG(...), 0).",
      hintFr: "Jointure entre streams et users sur user_id. GROUP BY plan. Utilise ROUND(AVG(...), 0).",
      solutionQuery: `SELECT u.plan, COUNT(*) AS stream_count, ROUND(AVG(s.duration_seconds), 0) AS avg_duration_seconds
FROM streams s
JOIN users u ON s.user_id = u.user_id
GROUP BY u.plan
ORDER BY avg_duration_seconds DESC;`,
      expectedColumns: ["plan", "stream_count", "avg_duration_seconds"],
      expectedRows: [
        { plan: "premium", stream_count: 29, avg_duration_seconds: 260 },
        { plan: "family", stream_count: 6, avg_duration_seconds: 245 },
        { plan: "free", stream_count: 15, avg_duration_seconds: 233 },
      ],
      orderMatters: true,
    },
    {
      id: "sp-03",
      title: "Streams per genre",
      titleFr: "Écoutes par genre musical",
      stakeholder: "Nina",
      stakeholderRole: "Head of Content",
      difficulty: "easy",
      description:
        "Nina (Head of Content) wants a breakdown of streams by music genre. Show the genre, total streams, and total listening time in minutes (rounded to 1 decimal), sorted by total streams descending.",
      descriptionFr:
        "Nina (Head of Content) veut une répartition des écoutes par genre musical. Affiche le genre, le nombre total d'écoutes et le temps d'écoute total en minutes (arrondi à 1 décimale), trié par nombre d'écoutes décroissant.",
      hint: "GROUP BY genre on the streams table. Divide duration_seconds by 60.0 for minutes.",
      hintFr: "GROUP BY genre sur la table streams. Divise duration_seconds par 60.0 pour les minutes.",
      solutionQuery: `SELECT genre, COUNT(*) AS total_streams, ROUND(SUM(duration_seconds) / 60.0, 1) AS total_minutes
FROM streams
GROUP BY genre
ORDER BY total_streams DESC;`,
      expectedColumns: ["genre", "total_streams", "total_minutes"],
      expectedRows: [
        { genre: "pop", total_streams: 16, total_minutes: 54.5 },
        { genre: "electronic", total_streams: 11, total_minutes: 54.1 },
        { genre: "rock", total_streams: 9, total_minutes: 36.6 },
        { genre: "hip-hop", total_streams: 8, total_minutes: 29.1 },
        { genre: "jazz", total_streams: 5, total_minutes: 27.2 },
        { genre: "classical", total_streams: 1, total_minutes: 7.0 },
      ],
      orderMatters: true,
    },
    {
      id: "sp-04",
      title: "Monthly royalty growth by artist",
      titleFr: "Croissance mensuelle des royalties par artiste",
      stakeholder: "Julien",
      stakeholderRole: "CFO",
      difficulty: "medium",
      description:
        "Julien (CFO) needs to track how royalties are evolving for each artist month over month. For each artist that has royalties in at least 2 months, show the artist name, the month, the royalty amount, and the growth percentage vs the previous month (rounded to 1 decimal). Only show rows where a previous month exists. Sort by artist name, then month.",
      descriptionFr:
        "Julien (CFO) doit suivre l'évolution des royalties de chaque artiste mois après mois. Pour chaque artiste ayant des royalties sur au moins 2 mois, affiche le nom de l'artiste, le mois, le montant des royalties et le pourcentage de croissance par rapport au mois précédent (arrondi à 1 décimale). N'affiche que les lignes où un mois précédent existe. Trie par nom d'artiste puis par mois.",
      hint: "Use LAG(amount) OVER (PARTITION BY artist_id ORDER BY month) to get the previous month amount. Filter out NULLs in an outer query.",
      hintFr: "Utilise LAG(amount) OVER (PARTITION BY artist_id ORDER BY month) pour obtenir le montant du mois précédent. Filtre les NULL dans une requête externe.",
      solutionQuery: `WITH royalty_with_prev AS (
  SELECT a.artist_name, r.month, r.amount,
    LAG(r.amount) OVER (PARTITION BY r.artist_id ORDER BY r.month) AS prev_amount
  FROM royalties r
  JOIN artists a ON r.artist_id = a.artist_id
)
SELECT artist_name, month, amount,
  ROUND(100.0 * (amount - prev_amount) / prev_amount, 1) AS growth_pct
FROM royalty_with_prev
WHERE prev_amount IS NOT NULL
ORDER BY artist_name, month;`,
      expectedColumns: ["artist_name", "month", "amount", "growth_pct"],
      expectedRows: [
        { artist_name: "Luna Nova", month: "2024-02-01", amount: 520.00, growth_pct: 15.6 },
        { artist_name: "Luna Nova", month: "2024-03-01", amount: 580.00, growth_pct: 11.5 },
        { artist_name: "Nuit Blanche", month: "2024-02-01", amount: 350.00, growth_pct: 9.4 },
        { artist_name: "Nuit Blanche", month: "2024-03-01", amount: 390.00, growth_pct: 11.4 },
        { artist_name: "Rosa Parks", month: "2024-02-01", amount: 410.00, growth_pct: 7.9 },
        { artist_name: "Rosa Parks", month: "2024-03-01", amount: 460.00, growth_pct: 12.2 },
        { artist_name: "Vague Bleue", month: "2024-02-01", amount: 240.00, growth_pct: 20.0 },
      ],
      orderMatters: true,
    },
    {
      id: "sp-05",
      title: "Average session duration by device",
      titleFr: "Durée moyenne de session par appareil",
      stakeholder: "Mia",
      stakeholderRole: "Data Scientist Reco",
      difficulty: "medium",
      description:
        "Mia (Data Scientist Reco) wants to understand how listening behavior differs across devices. For each device type, show the number of sessions, the average session duration in minutes (rounded to 1 decimal), and the average number of tracks played per session (rounded to 1 decimal). Sort by average session duration descending.",
      descriptionFr:
        "Mia (Data Scientist Reco) veut comprendre comment le comportement d'écoute varie selon les appareils. Pour chaque type d'appareil, affiche le nombre de sessions, la durée moyenne de session en minutes (arrondie à 1 décimale) et le nombre moyen de morceaux joués par session (arrondi à 1 décimale). Trie par durée moyenne de session décroissante.",
      hint: "Use EXTRACT(EPOCH FROM session_end - session_start) / 60 to get session duration in minutes. GROUP BY device.",
      hintFr: "Utilise EXTRACT(EPOCH FROM session_end - session_start) / 60 pour obtenir la durée de session en minutes. GROUP BY device.",
      solutionQuery: `SELECT device,
  COUNT(*) AS session_count,
  ROUND(AVG(EXTRACT(EPOCH FROM (session_end - session_start)) / 60), 1) AS avg_duration_minutes,
  ROUND(AVG(tracks_played), 1) AS avg_tracks_per_session
FROM listening_sessions
GROUP BY device
ORDER BY avg_duration_minutes DESC;`,
      expectedColumns: ["device", "session_count", "avg_duration_minutes", "avg_tracks_per_session"],
      expectedRows: [
        { device: "smart_speaker", session_count: 3, avg_duration_minutes: 90.0, avg_tracks_per_session: 6.3 },
        { device: "mobile", session_count: 10, avg_duration_minutes: 76.5, avg_tracks_per_session: 7.7 },
        { device: "desktop", session_count: 7, avg_duration_minutes: 72.9, avg_tracks_per_session: 7.6 },
      ],
      orderMatters: true,
    },
    {
      id: "sp-06",
      title: "Cost per stream by plan",
      titleFr: "Coût par écoute selon le plan",
      stakeholder: "Julien",
      stakeholderRole: "CFO",
      difficulty: "medium",
      description:
        "Julien (CFO) wants to evaluate the platform's unit economics. Assuming monthly plan prices are: free = 0 EUR, premium = 9.99 EUR, family = 14.99 EUR, calculate the theoretical cost per stream for each plan type. Show the plan, the number of users who streamed, total streams, and cost per stream in EUR rounded to 4 decimals. Sort by cost per stream descending.",
      descriptionFr:
        "Julien (CFO) veut évaluer l'économie unitaire de la plateforme. En supposant les prix mensuels suivants : free = 0 EUR, premium = 9,99 EUR, family = 14,99 EUR, calcule le coût théorique par écoute pour chaque type de plan. Affiche le plan, le nombre d'utilisateurs ayant écouté, le total d'écoutes et le coût par écoute en EUR arrondi à 4 décimales. Trie par coût par écoute décroissant.",
      hint: "Use a CASE expression to map plan to price. Revenue = price * distinct users. Cost per stream = total revenue / total streams.",
      hintFr: "Utilise une expression CASE pour associer le plan au prix. Revenu = prix * utilisateurs distincts. Coût par écoute = revenu total / total écoutes.",
      solutionQuery: `SELECT u.plan,
  COUNT(DISTINCT s.user_id) AS active_users,
  COUNT(*) AS total_streams,
  ROUND(
    SUM(CASE u.plan WHEN 'premium' THEN 9.99 WHEN 'family' THEN 14.99 ELSE 0 END)
    / COUNT(*), 4
  ) AS cost_per_stream
FROM streams s
JOIN users u ON s.user_id = u.user_id
GROUP BY u.plan
ORDER BY cost_per_stream DESC;`,
      expectedColumns: ["plan", "active_users", "total_streams", "cost_per_stream"],
      expectedRows: [
        { plan: "family", active_users: 4, total_streams: 6, cost_per_stream: 14.99 },
        { plan: "premium", active_users: 11, total_streams: 29, cost_per_stream: 9.99 },
        { plan: "free", active_users: 10, total_streams: 15, cost_per_stream: 0.0 },
      ],
      orderMatters: true,
    },
    {
      id: "sp-07",
      title: "Playlist creators with most public tracks",
      titleFr: "Créateurs de playlists avec le plus de morceaux publics",
      stakeholder: "Nina",
      stakeholderRole: "Head of Content",
      difficulty: "medium",
      description:
        "Nina (Head of Content) wants to identify the most active playlist curators. Show each user who created at least one public playlist, with their first name, last name, the number of public playlists they created, and the total number of tracks across those public playlists. Sort by total tracks descending, then first name ascending.",
      descriptionFr:
        "Nina (Head of Content) veut identifier les curateurs de playlists les plus actifs. Affiche chaque utilisateur ayant créé au moins une playlist publique, avec leur prénom, nom, le nombre de playlists publiques créées et le nombre total de morceaux dans ces playlists publiques. Trie par nombre total de morceaux décroissant, puis prénom croissant.",
      hint: "Filter playlists WHERE is_public = TRUE. Join with users. GROUP BY user.",
      hintFr: "Filtre les playlists WHERE is_public = TRUE. Jointure avec users. GROUP BY utilisateur.",
      solutionQuery: `SELECT u.first_name, u.last_name,
  COUNT(*) AS public_playlists,
  SUM(p.track_count) AS total_tracks
FROM playlists p
JOIN users u ON p.user_id = u.user_id
WHERE p.is_public = TRUE
GROUP BY u.user_id, u.first_name, u.last_name
ORDER BY total_tracks DESC, u.first_name ASC;`,
      expectedColumns: ["first_name", "last_name", "public_playlists", "total_tracks"],
      expectedRows: [
        { first_name: "Julie", last_name: "Garcia", public_playlists: 1, total_tracks: 20 },
        { first_name: "Léa", last_name: "Moreau", public_playlists: 2, total_tracks: 20 },
        { first_name: "Camille", last_name: "Dubois", public_playlists: 1, total_tracks: 15 },
        { first_name: "Louis", last_name: "Blanc", public_playlists: 1, total_tracks: 11 },
        { first_name: "Maxime", last_name: "Simon", public_playlists: 1, total_tracks: 9 },
        { first_name: "Gabriel", last_name: "Rousseau", public_playlists: 1, total_tracks: 8 },
        { first_name: "Lina", last_name: "Clement", public_playlists: 1, total_tracks: 7 },
        { first_name: "Manon", last_name: "Roux", public_playlists: 1, total_tracks: 6 },
      ],
      orderMatters: true,
    },
    {
      id: "sp-08",
      title: "Top artist per genre by royalties",
      titleFr: "Meilleur artiste par genre en royalties",
      stakeholder: "Julien",
      stakeholderRole: "CFO",
      difficulty: "hard",
      description:
        "Julien (CFO) wants to see the highest-earning artist in each genre based on total royalties. Show the genre, artist name, and total royalties earned. Only include artists who have received royalties. Sort by total royalties descending.",
      descriptionFr:
        "Julien (CFO) veut voir l'artiste le mieux rémunéré dans chaque genre basé sur le total des royalties. Affiche le genre, le nom de l'artiste et le total des royalties perçues. N'inclus que les artistes ayant reçu des royalties. Trie par total des royalties décroissant.",
      hint: "Use ROW_NUMBER() OVER (PARTITION BY genre ORDER BY total_royalties DESC) or QUALIFY to pick the top artist per genre.",
      hintFr: "Utilise ROW_NUMBER() OVER (PARTITION BY genre ORDER BY total_royalties DESC) ou QUALIFY pour sélectionner le meilleur artiste par genre.",
      solutionQuery: `WITH artist_royalties AS (
  SELECT a.genre, a.artist_name, SUM(r.amount) AS total_royalties
  FROM royalties r
  JOIN artists a ON r.artist_id = a.artist_id
  GROUP BY a.genre, a.artist_name
),
ranked AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY genre ORDER BY total_royalties DESC) AS rn
  FROM artist_royalties
)
SELECT genre, artist_name, total_royalties
FROM ranked
WHERE rn = 1
ORDER BY total_royalties DESC;`,
      expectedColumns: ["genre", "artist_name", "total_royalties"],
      expectedRows: [
        { genre: "pop", artist_name: "Luna Nova", total_royalties: 1550.00 },
        { genre: "hip-hop", artist_name: "Rosa Parks", total_royalties: 1250.00 },
        { genre: "electronic", artist_name: "Nuit Blanche", total_royalties: 1060.00 },
        { genre: "rock", artist_name: "Les Échos", total_royalties: 180.00 },
        { genre: "jazz", artist_name: "Alma Soul", total_royalties: 120.00 },
      ],
      orderMatters: true,
    },
    {
      id: "sp-09",
      title: "User engagement: streams per active day",
      titleFr: "Engagement utilisateur : écoutes par jour actif",
      stakeholder: "Mia",
      stakeholderRole: "Data Scientist Reco",
      difficulty: "hard",
      description:
        "Mia (Data Scientist Reco) wants to compute user engagement intensity. For each user who has streamed at least 3 tracks, show their first name, last name, total streams, number of distinct active days, and average streams per active day (rounded to 1 decimal). Sort by avg streams per day descending, then by first name ascending.",
      descriptionFr:
        "Mia (Data Scientist Reco) veut calculer l'intensité d'engagement des utilisateurs. Pour chaque utilisateur ayant écouté au moins 3 morceaux, affiche leur prénom, nom, le total d'écoutes, le nombre de jours actifs distincts et la moyenne d'écoutes par jour actif (arrondie à 1 décimale). Trie par moyenne d'écoutes par jour décroissante, puis par prénom croissant.",
      hint: "Use COUNT(DISTINCT CAST(streamed_at AS DATE)) for active days. HAVING COUNT(*) >= 3. Divide total streams by active days.",
      hintFr: "Utilise COUNT(DISTINCT CAST(streamed_at AS DATE)) pour les jours actifs. HAVING COUNT(*) >= 3. Divise le total d'écoutes par les jours actifs.",
      solutionQuery: `SELECT u.first_name, u.last_name,
  COUNT(*) AS total_streams,
  COUNT(DISTINCT CAST(s.streamed_at AS DATE)) AS active_days,
  ROUND(COUNT(*) * 1.0 / COUNT(DISTINCT CAST(s.streamed_at AS DATE)), 1) AS avg_streams_per_day
FROM streams s
JOIN users u ON s.user_id = u.user_id
GROUP BY u.user_id, u.first_name, u.last_name
HAVING COUNT(*) >= 3
ORDER BY avg_streams_per_day DESC, u.first_name ASC;`,
      expectedColumns: ["first_name", "last_name", "total_streams", "active_days", "avg_streams_per_day"],
      expectedRows: [
        { first_name: "Camille", last_name: "Dubois", total_streams: 4, active_days: 2, avg_streams_per_day: 2.0 },
        { first_name: "Léa", last_name: "Moreau", total_streams: 5, active_days: 3, avg_streams_per_day: 1.7 },
        { first_name: "Manon", last_name: "Roux", total_streams: 3, active_days: 2, avg_streams_per_day: 1.5 },
        { first_name: "Maxime", last_name: "Simon", total_streams: 3, active_days: 2, avg_streams_per_day: 1.5 },
        { first_name: "Thomas", last_name: "Bernard", total_streams: 3, active_days: 2, avg_streams_per_day: 1.5 },
      ],
      orderMatters: true,
    },
    {
      id: "sp-10",
      title: "Revenue vs royalties analysis",
      titleFr: "Analyse revenus vs royalties",
      stakeholder: "Julien",
      stakeholderRole: "CFO",
      difficulty: "hard",
      description:
        "Julien (CFO) wants to compare total royalties paid each month against the estimated platform revenue. Assume monthly revenue = (number of premium users * 9.99) + (number of family users * 14.99) stays constant at the current user count (10 premium, 4 family). Show each month, total royalties paid, estimated monthly revenue (rounded to 2 decimals), and the royalty-to-revenue ratio as a percentage (rounded to 1 decimal). Sort by month.",
      descriptionFr:
        "Julien (CFO) veut comparer le total des royalties versées chaque mois aux revenus estimés de la plateforme. En supposant un revenu mensuel = (nombre d'utilisateurs premium * 9,99) + (nombre d'utilisateurs family * 14,99) constant au nombre actuel (10 premium, 4 family). Affiche chaque mois, le total des royalties versées, le revenu mensuel estimé (arrondi à 2 décimales) et le ratio royalties/revenus en pourcentage (arrondi à 1 décimale). Trie par mois.",
      hint: "Aggregate royalties by month. The estimated revenue is a constant: 10 * 9.99 + 4 * 14.99. Compute ratio = 100 * royalties / revenue.",
      hintFr: "Agrège les royalties par mois. Le revenu estimé est une constante : 10 * 9,99 + 4 * 14,99. Calcule le ratio = 100 * royalties / revenu.",
      solutionQuery: `SELECT month,
  SUM(amount) AS total_royalties,
  ROUND(10 * 9.99 + 4 * 14.99, 2) AS estimated_revenue,
  ROUND(100.0 * SUM(amount) / (10 * 9.99 + 4 * 14.99), 1) AS royalty_to_revenue_pct
FROM royalties
GROUP BY month
ORDER BY month;`,
      expectedColumns: ["month", "total_royalties", "estimated_revenue", "royalty_to_revenue_pct"],
      expectedRows: [
        { month: "2024-01-01", total_royalties: 1530.00, estimated_revenue: 159.86, royalty_to_revenue_pct: 957.1 },
        { month: "2024-02-01", total_royalties: 1710.00, estimated_revenue: 159.86, royalty_to_revenue_pct: 1069.7 },
        { month: "2024-03-01", total_royalties: 1645.00, estimated_revenue: 159.86, royalty_to_revenue_pct: 1029.0 },
      ],
      orderMatters: true,
    },
  ],
};
