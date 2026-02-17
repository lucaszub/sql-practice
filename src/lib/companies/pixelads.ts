import type { CompanyProfile } from "./types";

const schema = `
CREATE TABLE channels (
  channel_id INTEGER PRIMARY KEY,
  channel_name VARCHAR NOT NULL,
  channel_type VARCHAR NOT NULL,
  cost_model VARCHAR NOT NULL
);

CREATE TABLE clients (
  client_id INTEGER PRIMARY KEY,
  client_name VARCHAR NOT NULL,
  sector VARCHAR NOT NULL,
  monthly_budget DECIMAL(10,2) NOT NULL,
  contact_email VARCHAR,
  start_date DATE NOT NULL
);

CREATE TABLE campaigns (
  campaign_id INTEGER PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES clients(client_id),
  channel_id INTEGER NOT NULL REFERENCES channels(channel_id),
  campaign_name VARCHAR NOT NULL,
  budget DECIMAL(10,2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR NOT NULL,
  format VARCHAR NOT NULL
);

CREATE TABLE impressions (
  impression_id INTEGER PRIMARY KEY,
  campaign_id INTEGER NOT NULL REFERENCES campaigns(campaign_id),
  impression_date DATE NOT NULL,
  impression_count INTEGER NOT NULL,
  device VARCHAR NOT NULL
);

CREATE TABLE clicks (
  click_id INTEGER PRIMARY KEY,
  campaign_id INTEGER NOT NULL REFERENCES campaigns(campaign_id),
  click_date DATE NOT NULL,
  click_count INTEGER NOT NULL,
  cost DECIMAL(10,2) NOT NULL
);

CREATE TABLE conversions (
  conversion_id INTEGER PRIMARY KEY,
  campaign_id INTEGER NOT NULL REFERENCES campaigns(campaign_id),
  conversion_date DATE NOT NULL,
  conversion_count INTEGER NOT NULL,
  revenue DECIMAL(10,2) NOT NULL
);

-- Channels (5 rows)
INSERT INTO channels VALUES
  (1, 'Google Ads', 'search', 'CPC'),
  (2, 'Meta Ads', 'social', 'CPM'),
  (3, 'TikTok Ads', 'social', 'CPM'),
  (4, 'LinkedIn Ads', 'professional', 'CPC'),
  (5, 'Email', 'direct', 'flat');

-- Clients (8 rows)
INSERT INTO clients VALUES
  (1, 'BioMarché', 'retail', 5000.00, 'marketing@biomarche.fr', '2023-06-01'),
  (2, 'TechNova', 'saas', 12000.00, 'growth@technova.io', '2023-03-15'),
  (3, 'FitZen', 'fitness', 3000.00, NULL, '2023-09-01'),
  (4, 'LuxeParfum', 'luxury', 8000.00, 'digital@luxeparfum.com', '2023-01-10'),
  (5, 'EduSpark', 'education', 2500.00, 'ads@eduspark.fr', '2024-01-05'),
  (6, 'UrbanBike', 'mobility', 4000.00, NULL, '2023-07-20'),
  (7, 'CloudSecure', 'cybersecurity', 15000.00, 'marketing@cloudsecure.io', '2023-04-01'),
  (8, 'PetitChef', 'food', 2000.00, 'hello@petitchef.fr', '2024-02-10');

-- Campaigns (20 rows)
INSERT INTO campaigns VALUES
  (1,  1, 1, 'BioMarché - Search Brand', 1500.00, '2024-01-10', '2024-03-31', 'completed', 'search'),
  (2,  1, 2, 'BioMarché - Meta Awareness', 2000.00, '2024-01-15', '2024-03-15', 'completed', 'image'),
  (3,  2, 1, 'TechNova - Search SaaS', 4000.00, '2024-01-05', '2024-04-30', 'completed', 'search'),
  (4,  2, 4, 'TechNova - LinkedIn B2B', 3000.00, '2024-02-01', '2024-04-30', 'completed', 'carousel'),
  (5,  3, 3, 'FitZen - TikTok Fitness', 1500.00, '2024-02-10', '2024-04-10', 'completed', 'video'),
  (6,  3, 2, 'FitZen - Meta Retargeting', 1000.00, '2024-03-01', '2024-04-30', 'completed', 'image'),
  (7,  4, 2, 'LuxeParfum - Meta Premium', 3500.00, '2024-01-20', '2024-04-20', 'completed', 'video'),
  (8,  4, 1, 'LuxeParfum - Search Luxury', 2500.00, '2024-02-01', '2024-04-30', 'completed', 'search'),
  (9,  5, 1, 'EduSpark - Search Edu', 1000.00, '2024-02-15', '2024-05-15', 'active', 'search'),
  (10, 5, 3, 'EduSpark - TikTok Students', 800.00, '2024-03-01', '2024-05-31', 'active', 'video'),
  (11, 6, 2, 'UrbanBike - Meta Spring', 2000.00, '2024-03-15', '2024-05-31', 'active', 'carousel'),
  (12, 6, 1, 'UrbanBike - Search Local', 1200.00, '2024-03-01', '2024-05-31', 'active', 'search'),
  (13, 7, 4, 'CloudSecure - LinkedIn Enterprise', 5000.00, '2024-01-10', '2024-06-30', 'active', 'carousel'),
  (14, 7, 1, 'CloudSecure - Search Security', 6000.00, '2024-01-10', '2024-06-30', 'active', 'search'),
  (15, 8, 2, 'PetitChef - Meta Foodies', 1200.00, '2024-03-01', '2024-05-31', 'active', 'video'),
  (16, 8, 5, 'PetitChef - Newsletter', 300.00, '2024-03-15', NULL, 'active', 'email'),
  (17, 2, 3, 'TechNova - TikTok Tech', 2000.00, '2024-03-01', '2024-05-31', 'paused', 'video'),
  (18, 4, 3, 'LuxeParfum - TikTok Luxe', 1500.00, '2024-04-01', '2024-06-30', 'active', 'video'),
  (19, 1, 5, 'BioMarché - Newsletter Bio', 500.00, '2024-02-01', NULL, 'active', 'email'),
  (20, 3, 1, 'FitZen - Search Gym', 800.00, '2024-04-15', NULL, 'paused', 'search');

-- Impressions (30 rows)
INSERT INTO impressions VALUES
  (1,  1,  '2024-01-15', 12000, 'desktop'),
  (2,  1,  '2024-02-15', 15000, 'mobile'),
  (3,  2,  '2024-01-20', 45000, 'mobile'),
  (4,  2,  '2024-02-20', 38000, 'mobile'),
  (5,  3,  '2024-01-15', 20000, 'desktop'),
  (6,  3,  '2024-02-15', 22000, 'desktop'),
  (7,  3,  '2024-03-15', 25000, 'mobile'),
  (8,  4,  '2024-02-15', 8000,  'desktop'),
  (9,  4,  '2024-03-15', 9500,  'desktop'),
  (10, 5,  '2024-02-20', 60000, 'mobile'),
  (11, 5,  '2024-03-20', 55000, 'mobile'),
  (12, 6,  '2024-03-15', 30000, 'mobile'),
  (13, 6,  '2024-04-15', 28000, 'desktop'),
  (14, 7,  '2024-02-15', 50000, 'mobile'),
  (15, 7,  '2024-03-15', 42000, 'desktop'),
  (16, 8,  '2024-02-20', 18000, 'desktop'),
  (17, 8,  '2024-03-20', 20000, 'mobile'),
  (18, 9,  '2024-03-15', 10000, 'desktop'),
  (19, 9,  '2024-04-15', 12000, 'mobile'),
  (20, 10, '2024-03-20', 40000, 'mobile'),
  (21, 11, '2024-04-15', 35000, 'mobile'),
  (22, 12, '2024-04-15', 8000,  'desktop'),
  (23, 13, '2024-02-15', 15000, 'desktop'),
  (24, 13, '2024-03-15', 18000, 'desktop'),
  (25, 14, '2024-02-15', 25000, 'desktop'),
  (26, 14, '2024-03-15', 30000, 'mobile'),
  (27, 15, '2024-03-20', 22000, 'mobile'),
  (28, 15, '2024-04-20', 25000, 'mobile'),
  (29, 17, '2024-03-20', 35000, 'mobile'),
  (30, 18, '2024-04-15', 20000, 'mobile');

-- Clicks (25 rows)
INSERT INTO clicks VALUES
  (1,  1,  '2024-01-15', 480,  360.00),
  (2,  1,  '2024-02-15', 600,  450.00),
  (3,  2,  '2024-01-20', 900,  540.00),
  (4,  2,  '2024-02-20', 760,  456.00),
  (5,  3,  '2024-01-15', 1000, 800.00),
  (6,  3,  '2024-02-15', 1100, 880.00),
  (7,  3,  '2024-03-15', 1250, 1000.00),
  (8,  4,  '2024-02-15', 320,  640.00),
  (9,  4,  '2024-03-15', 380,  760.00),
  (10, 5,  '2024-02-20', 1800, 540.00),
  (11, 5,  '2024-03-20', 1650, 495.00),
  (12, 6,  '2024-03-15', 600,  300.00),
  (13, 6,  '2024-04-15', 560,  280.00),
  (14, 7,  '2024-02-15', 1000, 700.00),
  (15, 7,  '2024-03-15', 840,  588.00),
  (16, 8,  '2024-02-20', 720,  576.00),
  (17, 8,  '2024-03-20', 800,  640.00),
  (18, 9,  '2024-03-15', 400,  320.00),
  (19, 9,  '2024-04-15', 480,  384.00),
  (20, 10, '2024-03-20', 1200, 360.00),
  (21, 11, '2024-04-15', 700,  420.00),
  (22, 12, '2024-04-15', 320,  256.00),
  (23, 13, '2024-02-15', 300,  900.00),
  (24, 13, '2024-03-15', 360,  1080.00),
  (25, 14, '2024-02-15', 1000, 800.00);

-- Conversions (15 rows)
INSERT INTO conversions VALUES
  (1,  1,  '2024-01-20', 12, 960.00),
  (2,  1,  '2024-02-20', 18, 1440.00),
  (3,  3,  '2024-01-20', 25, 5000.00),
  (4,  3,  '2024-02-20', 30, 6000.00),
  (5,  3,  '2024-03-20', 35, 7000.00),
  (6,  4,  '2024-02-20', 8,  3200.00),
  (7,  4,  '2024-03-20', 10, 4000.00),
  (8,  5,  '2024-03-01', 45, 2250.00),
  (9,  7,  '2024-02-20', 15, 4500.00),
  (10, 7,  '2024-03-20', 12, 3600.00),
  (11, 8,  '2024-03-01', 20, 3000.00),
  (12, 9,  '2024-04-01', 10, 1500.00),
  (13, 13, '2024-03-01', 5,  7500.00),
  (14, 14, '2024-02-20', 22, 4400.00),
  (15, 6,  '2024-04-01', 8,  640.00);
`;

export const pixelAds: CompanyProfile = {
  id: "pixelads",
  name: "PixelAds",
  tagline: "Your ads, our pixels, your growth",
  taglineFr: "Vos pubs, nos pixels, votre croissance",
  sector: "Marketing / Adtech",
  sectorFr: "Marketing / Adtech",
  icon: "📊",
  description:
    "You just joined PixelAds, a digital marketing agency that manages ad campaigns for 15 clients across Google Ads, Meta Ads, TikTok, LinkedIn, and Email. Data is flooding in from everywhere and the performance team needs help making sense of it all. Your mission: turn raw campaign data into actionable insights.",
  descriptionFr:
    "Tu viens de rejoindre PixelAds, une agence de marketing digital qui gère les campagnes pub de 15 clients. Entre Google Ads, Meta Ads, TikTok, LinkedIn et Email, les données affluent de partout et l'équipe performance a besoin d'aide pour y voir clair. Ta mission : transformer les données brutes en insights actionnables.",
  schema,
  tables: [
    {
      name: "channels",
      description: "Advertising channels (Google, Meta, TikTok, LinkedIn, Email)",
      descriptionFr: "Canaux publicitaires (Google, Meta, TikTok, LinkedIn, Email)",
      rowCount: 5,
      columns: [
        { name: "channel_id", type: "INTEGER", nullable: false, description: "Unique channel ID", descriptionFr: "ID unique du canal" },
        { name: "channel_name", type: "VARCHAR", nullable: false, description: "Channel name", descriptionFr: "Nom du canal" },
        { name: "channel_type", type: "VARCHAR", nullable: false, description: "Channel type (search, social, professional, direct)", descriptionFr: "Type de canal (search, social, professional, direct)" },
        { name: "cost_model", type: "VARCHAR", nullable: false, description: "Pricing model (CPC, CPM, flat)", descriptionFr: "Modèle de tarification (CPC, CPM, flat)" },
      ],
    },
    {
      name: "clients",
      description: "Agency clients with sector and monthly budget",
      descriptionFr: "Clients de l'agence avec secteur et budget mensuel",
      rowCount: 8,
      columns: [
        { name: "client_id", type: "INTEGER", nullable: false, description: "Unique client ID", descriptionFr: "ID unique du client" },
        { name: "client_name", type: "VARCHAR", nullable: false, description: "Client company name", descriptionFr: "Nom de l'entreprise cliente" },
        { name: "sector", type: "VARCHAR", nullable: false, description: "Business sector", descriptionFr: "Secteur d'activité" },
        { name: "monthly_budget", type: "DECIMAL(10,2)", nullable: false, description: "Monthly ad budget in EUR", descriptionFr: "Budget publicitaire mensuel en EUR" },
        { name: "contact_email", type: "VARCHAR", nullable: true, description: "Contact email (can be NULL)", descriptionFr: "Email de contact (peut être NULL)" },
        { name: "start_date", type: "DATE", nullable: false, description: "Client relationship start date", descriptionFr: "Date de début de la relation client" },
      ],
    },
    {
      name: "campaigns",
      description: "Ad campaigns with client, channel, budget, dates, and format",
      descriptionFr: "Campagnes pub avec client, canal, budget, dates et format",
      rowCount: 20,
      columns: [
        { name: "campaign_id", type: "INTEGER", nullable: false, description: "Unique campaign ID", descriptionFr: "ID unique de la campagne" },
        { name: "client_id", type: "INTEGER", nullable: false, description: "FK to clients", descriptionFr: "FK vers clients" },
        { name: "channel_id", type: "INTEGER", nullable: false, description: "FK to channels", descriptionFr: "FK vers channels" },
        { name: "campaign_name", type: "VARCHAR", nullable: false, description: "Campaign name", descriptionFr: "Nom de la campagne" },
        { name: "budget", type: "DECIMAL(10,2)", nullable: false, description: "Campaign budget in EUR", descriptionFr: "Budget de la campagne en EUR" },
        { name: "start_date", type: "DATE", nullable: false, description: "Campaign start date", descriptionFr: "Date de début" },
        { name: "end_date", type: "DATE", nullable: true, description: "Campaign end date (NULL if ongoing)", descriptionFr: "Date de fin (NULL si en cours)" },
        { name: "status", type: "VARCHAR", nullable: false, description: "Status (active, completed, paused)", descriptionFr: "Statut (active, completed, paused)" },
        { name: "format", type: "VARCHAR", nullable: false, description: "Ad format (search, image, video, carousel, email)", descriptionFr: "Format pub (search, image, video, carousel, email)" },
      ],
    },
    {
      name: "impressions",
      description: "Daily impression counts per campaign and device",
      descriptionFr: "Compteurs d'impressions quotidiens par campagne et appareil",
      rowCount: 30,
      columns: [
        { name: "impression_id", type: "INTEGER", nullable: false, description: "Unique impression record ID", descriptionFr: "ID unique de l'enregistrement" },
        { name: "campaign_id", type: "INTEGER", nullable: false, description: "FK to campaigns", descriptionFr: "FK vers campaigns" },
        { name: "impression_date", type: "DATE", nullable: false, description: "Date of impressions", descriptionFr: "Date des impressions" },
        { name: "impression_count", type: "INTEGER", nullable: false, description: "Number of impressions", descriptionFr: "Nombre d'impressions" },
        { name: "device", type: "VARCHAR", nullable: false, description: "Device type (desktop, mobile)", descriptionFr: "Type d'appareil (desktop, mobile)" },
      ],
    },
    {
      name: "clicks",
      description: "Daily click counts and costs per campaign",
      descriptionFr: "Compteurs de clics et coûts quotidiens par campagne",
      rowCount: 25,
      columns: [
        { name: "click_id", type: "INTEGER", nullable: false, description: "Unique click record ID", descriptionFr: "ID unique de l'enregistrement" },
        { name: "campaign_id", type: "INTEGER", nullable: false, description: "FK to campaigns", descriptionFr: "FK vers campaigns" },
        { name: "click_date", type: "DATE", nullable: false, description: "Date of clicks", descriptionFr: "Date des clics" },
        { name: "click_count", type: "INTEGER", nullable: false, description: "Number of clicks", descriptionFr: "Nombre de clics" },
        { name: "cost", type: "DECIMAL(10,2)", nullable: false, description: "Total click cost in EUR", descriptionFr: "Coût total des clics en EUR" },
      ],
    },
    {
      name: "conversions",
      description: "Daily conversion counts and revenue per campaign",
      descriptionFr: "Compteurs de conversions et revenus quotidiens par campagne",
      rowCount: 15,
      columns: [
        { name: "conversion_id", type: "INTEGER", nullable: false, description: "Unique conversion record ID", descriptionFr: "ID unique de l'enregistrement" },
        { name: "campaign_id", type: "INTEGER", nullable: false, description: "FK to campaigns", descriptionFr: "FK vers campaigns" },
        { name: "conversion_date", type: "DATE", nullable: false, description: "Date of conversions", descriptionFr: "Date des conversions" },
        { name: "conversion_count", type: "INTEGER", nullable: false, description: "Number of conversions", descriptionFr: "Nombre de conversions" },
        { name: "revenue", type: "DECIMAL(10,2)", nullable: false, description: "Revenue generated in EUR", descriptionFr: "Revenu généré en EUR" },
      ],
    },
  ],
  questions: [
    {
      id: "pa-01",
      title: "Cost per click by channel",
      titleFr: "Coût par clic par canal",
      stakeholder: "Sarah",
      stakeholderRole: "Head of Performance",
      difficulty: "easy",
      description:
        "Sarah (Head of Performance) wants to compare the average cost per click across advertising channels. Show the channel name, total clicks, total cost, and average CPC (cost / clicks, rounded to 2 decimals). Sort by CPC descending.",
      descriptionFr:
        "Sarah (Head of Performance) veut comparer le coût par clic moyen entre les canaux publicitaires. Affiche le nom du canal, le total de clics, le coût total et le CPC moyen (coût / clics, arrondi à 2 décimales). Trie par CPC décroissant.",
      hint: "Join channels → campaigns → clicks. GROUP BY channel_name. Divide total cost by total clicks.",
      hintFr: "Jointure channels → campaigns → clicks. GROUP BY channel_name. Divise le coût total par le total de clics.",
      solutionQuery: `SELECT
  ch.channel_name,
  SUM(ck.click_count) AS total_clicks,
  ROUND(SUM(ck.cost), 2) AS total_cost,
  ROUND(SUM(ck.cost) / SUM(ck.click_count), 2) AS avg_cpc
FROM channels ch
JOIN campaigns c ON ch.channel_id = c.channel_id
JOIN clicks ck ON c.campaign_id = ck.campaign_id
GROUP BY ch.channel_name
ORDER BY avg_cpc DESC;`,
      expectedColumns: ["channel_name", "total_clicks", "total_cost", "avg_cpc"],
      expectedRows: [
        { channel_name: "LinkedIn Ads", total_clicks: 1360, total_cost: 3380.00, avg_cpc: 2.49 },
        { channel_name: "Google Ads", total_clicks: 8150, total_cost: 6466.00, avg_cpc: 0.79 },
        { channel_name: "Meta Ads", total_clicks: 5360, total_cost: 3284.00, avg_cpc: 0.61 },
        { channel_name: "TikTok Ads", total_clicks: 4650, total_cost: 1395.00, avg_cpc: 0.3 },
      ],
      orderMatters: true,
    },
    {
      id: "pa-02",
      title: "Click-through rate by ad format",
      titleFr: "Taux de clic par format publicitaire",
      stakeholder: "Yann",
      stakeholderRole: "Creative Director",
      difficulty: "easy",
      description:
        "Yann (Creative Director) wants to know which ad formats perform best in terms of click-through rate. For each format that has impressions, show the format, total impressions, total clicks, and CTR (clicks / impressions * 100, rounded to 2 decimals). Sort by CTR descending.",
      descriptionFr:
        "Yann (Creative Director) veut savoir quels formats publicitaires performent le mieux en taux de clic. Pour chaque format ayant des impressions, affiche le format, le total d'impressions, le total de clics et le CTR (clics / impressions * 100, arrondi à 2 décimales). Trie par CTR décroissant.",
      hint: "Aggregate impressions and clicks separately per format using CTEs, then LEFT JOIN them. Some formats may have impressions but no clicks.",
      hintFr: "Agrège les impressions et clics séparément par format avec des CTEs, puis LEFT JOIN. Certains formats peuvent avoir des impressions mais pas de clics.",
      solutionQuery: `WITH format_impressions AS (
  SELECT c.format, SUM(i.impression_count) AS total_impressions
  FROM campaigns c
  JOIN impressions i ON c.campaign_id = i.campaign_id
  GROUP BY c.format
),
format_clicks AS (
  SELECT c.format, SUM(ck.click_count) AS total_clicks
  FROM campaigns c
  JOIN clicks ck ON c.campaign_id = ck.campaign_id
  GROUP BY c.format
)
SELECT
  fi.format,
  fi.total_impressions,
  COALESCE(fc.total_clicks, 0) AS total_clicks,
  ROUND(100.0 * COALESCE(fc.total_clicks, 0) / fi.total_impressions, 2) AS ctr
FROM format_impressions fi
LEFT JOIN format_clicks fc ON fi.format = fc.format
ORDER BY ctr DESC;`,
      expectedColumns: ["format", "total_impressions", "total_clicks", "ctr"],
      expectedRows: [
        { format: "search", total_impressions: 217000, total_clicks: 8150, ctr: 3.76 },
        { format: "carousel", total_impressions: 85500, total_clicks: 2060, ctr: 2.41 },
        { format: "image", total_impressions: 141000, total_clicks: 2820, ctr: 2.0 },
        { format: "video", total_impressions: 349000, total_clicks: 6490, ctr: 1.86 },
      ],
      orderMatters: true,
    },
    {
      id: "pa-03",
      title: "Total impressions by client",
      titleFr: "Impressions totales par client",
      stakeholder: "Léo",
      stakeholderRole: "Account Manager",
      difficulty: "easy",
      description:
        "Léo (Account Manager) needs a quick overview of total impressions per client to prepare for the weekly review. Show the client name and total impressions, sorted by impressions descending.",
      descriptionFr:
        "Léo (Account Manager) a besoin d'un aperçu rapide des impressions totales par client pour préparer la revue hebdomadaire. Affiche le nom du client et le total d'impressions, trié par impressions décroissant.",
      hint: "Join clients → campaigns → impressions. GROUP BY client_name.",
      hintFr: "Jointure clients → campaigns → impressions. GROUP BY client_name.",
      solutionQuery: `SELECT
  cl.client_name,
  SUM(i.impression_count) AS total_impressions
FROM clients cl
JOIN campaigns c ON cl.client_id = c.client_id
JOIN impressions i ON c.campaign_id = i.campaign_id
GROUP BY cl.client_name
ORDER BY total_impressions DESC;`,
      expectedColumns: ["client_name", "total_impressions"],
      expectedRows: [
        { client_name: "FitZen", total_impressions: 173000 },
        { client_name: "LuxeParfum", total_impressions: 150000 },
        { client_name: "TechNova", total_impressions: 119500 },
        { client_name: "BioMarché", total_impressions: 110000 },
        { client_name: "CloudSecure", total_impressions: 88000 },
        { client_name: "EduSpark", total_impressions: 62000 },
        { client_name: "PetitChef", total_impressions: 47000 },
        { client_name: "UrbanBike", total_impressions: 43000 },
      ],
      orderMatters: true,
    },
    {
      id: "pa-04",
      title: "ROAS by client",
      titleFr: "ROAS par client",
      stakeholder: "Léo",
      stakeholderRole: "Account Manager",
      difficulty: "medium",
      description:
        "Léo (Account Manager) wants to calculate the Return on Ad Spend (ROAS) for each client. ROAS = total conversion revenue / total click cost. Pre-aggregate costs and revenue per campaign before joining to avoid double-counting. Show client name, total revenue, total cost, and ROAS rounded to 2 decimals. Clients with zero cost should show NULL for ROAS. Sort by ROAS descending (NULLs last).",
      descriptionFr:
        "Léo (Account Manager) veut calculer le ROAS (Return on Ad Spend) par client. ROAS = revenu total des conversions / coût total des clics. Pré-agrège les coûts et revenus par campagne avant de joindre pour éviter le double comptage. Affiche le nom du client, le revenu total, le coût total et le ROAS arrondi à 2 décimales. Les clients sans coût doivent afficher NULL pour le ROAS. Trie par ROAS décroissant (NULLs en dernier).",
      hint: "Use two CTEs: one for total cost per campaign (from clicks), one for total revenue per campaign (from conversions). Then join both to campaigns → clients.",
      hintFr: "Utilise deux CTEs : un pour le coût total par campagne (depuis clicks), un pour le revenu total par campagne (depuis conversions). Puis joins les deux à campaigns → clients.",
      solutionQuery: `WITH campaign_costs AS (
  SELECT campaign_id, SUM(cost) AS total_cost
  FROM clicks
  GROUP BY campaign_id
),
campaign_revenue AS (
  SELECT campaign_id, SUM(revenue) AS total_revenue
  FROM conversions
  GROUP BY campaign_id
)
SELECT
  cl.client_name,
  COALESCE(SUM(cr.total_revenue), 0) AS total_revenue,
  COALESCE(SUM(cc.total_cost), 0) AS total_cost,
  CASE WHEN COALESCE(SUM(cc.total_cost), 0) = 0 THEN NULL
       ELSE ROUND(COALESCE(SUM(cr.total_revenue), 0) / SUM(cc.total_cost), 2)
  END AS roas
FROM clients cl
JOIN campaigns c ON cl.client_id = c.client_id
LEFT JOIN campaign_costs cc ON c.campaign_id = cc.campaign_id
LEFT JOIN campaign_revenue cr ON c.campaign_id = cr.campaign_id
GROUP BY cl.client_name
ORDER BY roas DESC NULLS LAST;`,
      expectedColumns: ["client_name", "total_revenue", "total_cost", "roas"],
      expectedRows: [
        { client_name: "TechNova", total_revenue: 25200.00, total_cost: 4080.00, roas: 6.18 },
        { client_name: "LuxeParfum", total_revenue: 11100.00, total_cost: 2504.00, roas: 4.43 },
        { client_name: "CloudSecure", total_revenue: 11900.00, total_cost: 2780.00, roas: 4.28 },
        { client_name: "FitZen", total_revenue: 2890.00, total_cost: 1615.00, roas: 1.79 },
        { client_name: "EduSpark", total_revenue: 1500.00, total_cost: 1064.00, roas: 1.41 },
        { client_name: "BioMarché", total_revenue: 2400.00, total_cost: 1806.00, roas: 1.33 },
        { client_name: "UrbanBike", total_revenue: 0.00, total_cost: 676.00, roas: 0.0 },
        { client_name: "PetitChef", total_revenue: 0.00, total_cost: 0.00, roas: null },
      ],
      orderMatters: true,
    },
    {
      id: "pa-05",
      title: "Budget utilization for completed campaigns",
      titleFr: "Utilisation du budget des campagnes terminées",
      stakeholder: "Léo",
      stakeholderRole: "Account Manager",
      difficulty: "medium",
      description:
        "Léo (Account Manager) wants to review budget utilization for clients whose campaigns have completed. For each client with at least one completed campaign, show the client name, total campaign budget, total amount actually spent (from clicks), and utilization percentage (spent / budget * 100, rounded to 1 decimal). Sort by utilization descending.",
      descriptionFr:
        "Léo (Account Manager) veut examiner l'utilisation du budget pour les clients dont les campagnes sont terminées. Pour chaque client ayant au moins une campagne completed, affiche le nom du client, le budget total des campagnes, le montant réellement dépensé (depuis clicks) et le pourcentage d'utilisation (dépensé / budget * 100, arrondi à 1 décimale). Trie par utilisation décroissante.",
      hint: "Filter campaigns WHERE status = 'completed'. Aggregate budget and click costs per client. Use CTEs to keep it clean.",
      hintFr: "Filtre les campagnes WHERE status = 'completed'. Agrège le budget et les coûts de clics par client. Utilise des CTEs pour garder le code propre.",
      solutionQuery: `WITH client_budget AS (
  SELECT client_id, SUM(budget) AS total_budget
  FROM campaigns
  WHERE status = 'completed'
  GROUP BY client_id
),
client_spent AS (
  SELECT c.client_id, SUM(ck.cost) AS total_spent
  FROM campaigns c
  JOIN clicks ck ON c.campaign_id = ck.campaign_id
  WHERE c.status = 'completed'
  GROUP BY c.client_id
)
SELECT
  cl.client_name,
  cb.total_budget,
  COALESCE(cs.total_spent, 0) AS total_spent,
  ROUND(100.0 * COALESCE(cs.total_spent, 0) / cb.total_budget, 1) AS utilization_pct
FROM client_budget cb
JOIN clients cl ON cb.client_id = cl.client_id
LEFT JOIN client_spent cs ON cb.client_id = cs.client_id
ORDER BY utilization_pct DESC;`,
      expectedColumns: ["client_name", "total_budget", "total_spent", "utilization_pct"],
      expectedRows: [
        { client_name: "FitZen", total_budget: 2500.00, total_spent: 1615.00, utilization_pct: 64.6 },
        { client_name: "TechNova", total_budget: 7000.00, total_spent: 4080.00, utilization_pct: 58.3 },
        { client_name: "BioMarché", total_budget: 3500.00, total_spent: 1806.00, utilization_pct: 51.6 },
        { client_name: "LuxeParfum", total_budget: 6000.00, total_spent: 2504.00, utilization_pct: 41.7 },
      ],
      orderMatters: true,
    },
    {
      id: "pa-06",
      title: "Conversion funnel by channel",
      titleFr: "Entonnoir de conversion par canal",
      stakeholder: "Sarah",
      stakeholderRole: "Head of Performance",
      difficulty: "medium",
      description:
        "Sarah (Head of Performance) wants a full conversion funnel breakdown by advertising channel: impressions, clicks, conversions, CTR (clicks/impressions * 100), and conversion rate (conversions/clicks * 100). Only include channels that have impressions. Round rates to 2 decimals. Sort by conversion rate descending. If a channel has no clicks, its conversion rate should be NULL.",
      descriptionFr:
        "Sarah (Head of Performance) veut une analyse complète de l'entonnoir de conversion par canal publicitaire : impressions, clics, conversions, CTR (clics/impressions * 100) et taux de conversion (conversions/clics * 100). Inclure uniquement les canaux ayant des impressions. Arrondir les taux à 2 décimales. Trier par taux de conversion décroissant. Si un canal n'a pas de clics, son taux de conversion doit être NULL.",
      hint: "Create three CTEs (impressions, clicks, conversions per channel_id). Join them to channels. Use CASE WHEN for NULL handling when dividing by zero clicks.",
      hintFr: "Crée trois CTEs (impressions, clics, conversions par channel_id). Joins-les à channels. Utilise CASE WHEN pour gérer les NULLs lors de la division par zéro clic.",
      solutionQuery: `WITH channel_impressions AS (
  SELECT c.channel_id, SUM(i.impression_count) AS total_impressions
  FROM campaigns c
  JOIN impressions i ON c.campaign_id = i.campaign_id
  GROUP BY c.channel_id
),
channel_clicks AS (
  SELECT c.channel_id, SUM(ck.click_count) AS total_clicks
  FROM campaigns c
  JOIN clicks ck ON c.campaign_id = ck.campaign_id
  GROUP BY c.channel_id
),
channel_conversions AS (
  SELECT c.channel_id, SUM(cv.conversion_count) AS total_conversions
  FROM campaigns c
  JOIN conversions cv ON c.campaign_id = cv.campaign_id
  GROUP BY c.channel_id
)
SELECT
  ch.channel_name,
  ci.total_impressions,
  COALESCE(cc.total_clicks, 0) AS total_clicks,
  COALESCE(ccv.total_conversions, 0) AS total_conversions,
  ROUND(100.0 * COALESCE(cc.total_clicks, 0) / ci.total_impressions, 2) AS ctr,
  CASE WHEN COALESCE(cc.total_clicks, 0) = 0 THEN NULL
       ELSE ROUND(100.0 * COALESCE(ccv.total_conversions, 0) / cc.total_clicks, 2)
  END AS conversion_rate
FROM channels ch
JOIN channel_impressions ci ON ch.channel_id = ci.channel_id
LEFT JOIN channel_clicks cc ON ch.channel_id = cc.channel_id
LEFT JOIN channel_conversions ccv ON ch.channel_id = ccv.channel_id
ORDER BY conversion_rate DESC NULLS LAST;`,
      expectedColumns: ["channel_name", "total_impressions", "total_clicks", "total_conversions", "ctr", "conversion_rate"],
      expectedRows: [
        { channel_name: "Google Ads", total_impressions: 217000, total_clicks: 8150, total_conversions: 172, ctr: 3.76, conversion_rate: 2.11 },
        { channel_name: "LinkedIn Ads", total_impressions: 50500, total_clicks: 1360, total_conversions: 23, ctr: 2.69, conversion_rate: 1.69 },
        { channel_name: "TikTok Ads", total_impressions: 210000, total_clicks: 4650, total_conversions: 45, ctr: 2.21, conversion_rate: 0.97 },
        { channel_name: "Meta Ads", total_impressions: 315000, total_clicks: 5360, total_conversions: 35, ctr: 1.7, conversion_rate: 0.65 },
      ],
      orderMatters: true,
    },
    {
      id: "pa-07",
      title: "Monthly performance trends",
      titleFr: "Tendances de performance mensuelles",
      stakeholder: "Sarah",
      stakeholderRole: "Head of Performance",
      difficulty: "medium",
      description:
        "Sarah (Head of Performance) wants to see how overall campaign performance evolves month by month. Show the month (as a date, first day of month), total impressions, total clicks, and CTR (rounded to 2 decimals). Sort chronologically. Use separate CTEs for impressions and clicks to avoid row duplication.",
      descriptionFr:
        "Sarah (Head of Performance) veut voir comment la performance globale des campagnes évolue mois par mois. Affiche le mois (en date, premier jour du mois), le total d'impressions, le total de clics et le CTR (arrondi à 2 décimales). Trie chronologiquement. Utilise des CTEs séparées pour impressions et clics pour éviter la duplication.",
      hint: "Create two CTEs grouped by DATE_TRUNC('month', ...). LEFT JOIN them on the month column.",
      hintFr: "Crée deux CTEs groupées par DATE_TRUNC('month', ...). LEFT JOIN sur la colonne mois.",
      solutionQuery: `WITH monthly_impressions AS (
  SELECT DATE_TRUNC('month', impression_date) AS month, SUM(impression_count) AS total_impressions
  FROM impressions
  GROUP BY DATE_TRUNC('month', impression_date)
),
monthly_clicks AS (
  SELECT DATE_TRUNC('month', click_date) AS month, SUM(click_count) AS total_clicks
  FROM clicks
  GROUP BY DATE_TRUNC('month', click_date)
)
SELECT
  mi.month,
  mi.total_impressions,
  COALESCE(mc.total_clicks, 0) AS total_clicks,
  ROUND(100.0 * COALESCE(mc.total_clicks, 0) / mi.total_impressions, 2) AS ctr
FROM monthly_impressions mi
LEFT JOIN monthly_clicks mc ON mi.month = mc.month
ORDER BY mi.month;`,
      expectedColumns: ["month", "total_impressions", "total_clicks", "ctr"],
      expectedRows: [
        { month: "2024-01-01", total_impressions: 77000, total_clicks: 2380, ctr: 3.09 },
        { month: "2024-02-01", total_impressions: 251000, total_clicks: 7600, ctr: 3.03 },
        { month: "2024-03-01", total_impressions: 336500, total_clicks: 7480, ctr: 2.22 },
        { month: "2024-04-01", total_impressions: 128000, total_clicks: 2060, ctr: 1.61 },
      ],
      orderMatters: true,
    },
    {
      id: "pa-08",
      title: "Top 5 campaigns by ROAS",
      titleFr: "Top 5 campagnes par ROAS",
      stakeholder: "Léo",
      stakeholderRole: "Account Manager",
      difficulty: "hard",
      description:
        "Léo (Account Manager) wants to identify the 5 best-performing campaigns by ROAS (Return on Ad Spend). Only consider campaigns that have both click costs and conversion revenue. Show campaign name, client name, channel name, total revenue, total cost, and ROAS (rounded to 2 decimals). Sort by ROAS descending, limit to 5.",
      descriptionFr:
        "Léo (Account Manager) veut identifier les 5 campagnes les plus performantes en ROAS. Ne considère que les campagnes ayant à la fois des coûts de clics et du revenu de conversions. Affiche le nom de la campagne, le nom du client, le canal, le revenu total, le coût total et le ROAS (arrondi à 2 décimales). Trie par ROAS décroissant, limite à 5.",
      hint: "Pre-aggregate clicks and conversions per campaign in CTEs. INNER JOIN both to campaigns (ensures both exist). LIMIT 5.",
      hintFr: "Pré-agrège les clics et conversions par campagne dans des CTEs. INNER JOIN les deux à campaigns (assure que les deux existent). LIMIT 5.",
      solutionQuery: `WITH campaign_costs AS (
  SELECT campaign_id, SUM(cost) AS total_cost
  FROM clicks
  GROUP BY campaign_id
),
campaign_revenue AS (
  SELECT campaign_id, SUM(revenue) AS total_revenue
  FROM conversions
  GROUP BY campaign_id
)
SELECT
  c.campaign_name,
  cl.client_name,
  ch.channel_name,
  cr.total_revenue,
  cc.total_cost,
  ROUND(cr.total_revenue / cc.total_cost, 2) AS roas
FROM campaigns c
JOIN clients cl ON c.client_id = cl.client_id
JOIN channels ch ON c.channel_id = ch.channel_id
JOIN campaign_costs cc ON c.campaign_id = cc.campaign_id
JOIN campaign_revenue cr ON c.campaign_id = cr.campaign_id
ORDER BY roas DESC
LIMIT 5;`,
      expectedColumns: ["campaign_name", "client_name", "channel_name", "total_revenue", "total_cost", "roas"],
      expectedRows: [
        { campaign_name: "TechNova - Search SaaS", client_name: "TechNova", channel_name: "Google Ads", total_revenue: 18000.00, total_cost: 2680.00, roas: 6.72 },
        { campaign_name: "LuxeParfum - Meta Premium", client_name: "LuxeParfum", channel_name: "Meta Ads", total_revenue: 8100.00, total_cost: 1288.00, roas: 6.29 },
        { campaign_name: "CloudSecure - Search Security", client_name: "CloudSecure", channel_name: "Google Ads", total_revenue: 4400.00, total_cost: 800.00, roas: 5.5 },
        { campaign_name: "TechNova - LinkedIn B2B", client_name: "TechNova", channel_name: "LinkedIn Ads", total_revenue: 7200.00, total_cost: 1400.00, roas: 5.14 },
        { campaign_name: "CloudSecure - LinkedIn Enterprise", client_name: "CloudSecure", channel_name: "LinkedIn Ads", total_revenue: 7500.00, total_cost: 1980.00, roas: 3.79 },
      ],
      orderMatters: true,
    },
    {
      id: "pa-09",
      title: "Campaigns burning budget without conversions",
      titleFr: "Campagnes qui dépensent sans convertir",
      stakeholder: "Sarah",
      stakeholderRole: "Head of Performance",
      difficulty: "hard",
      description:
        "Sarah (Head of Performance) wants to flag campaigns that have received impressions but generated zero conversions -- potential budget waste. Show campaign name, client name, channel name, total impressions, total clicks, and total cost. Include campaigns with zero clicks (cost = 0). Sort by impressions descending, then campaign name ascending.",
      descriptionFr:
        "Sarah (Head of Performance) veut identifier les campagnes qui ont reçu des impressions mais généré zéro conversion -- potentiel gaspillage de budget. Affiche le nom de la campagne, le nom du client, le canal, le total d'impressions, le total de clics et le coût total. Inclure les campagnes avec zéro clic (coût = 0). Trie par impressions décroissant, puis nom de campagne croissant.",
      hint: "JOIN campaigns with impressions (to ensure impressions exist). LEFT JOIN with a clicks subquery and LEFT JOIN with conversions. Filter WHERE conversions.campaign_id IS NULL.",
      hintFr: "JOIN campaigns avec impressions (pour s'assurer qu'il y a des impressions). LEFT JOIN avec une sous-requête clicks et LEFT JOIN avec conversions. Filtre WHERE conversions.campaign_id IS NULL.",
      solutionQuery: `SELECT
  c.campaign_name,
  cl.client_name,
  ch.channel_name,
  SUM(i.impression_count) AS total_impressions,
  COALESCE(ck_agg.total_clicks, 0) AS total_clicks,
  COALESCE(ck_agg.total_cost, 0) AS total_cost
FROM campaigns c
JOIN clients cl ON c.client_id = cl.client_id
JOIN channels ch ON c.channel_id = ch.channel_id
JOIN impressions i ON c.campaign_id = i.campaign_id
LEFT JOIN (
  SELECT campaign_id, SUM(click_count) AS total_clicks, SUM(cost) AS total_cost
  FROM clicks
  GROUP BY campaign_id
) ck_agg ON c.campaign_id = ck_agg.campaign_id
LEFT JOIN conversions cv ON c.campaign_id = cv.campaign_id
WHERE cv.campaign_id IS NULL
GROUP BY c.campaign_name, cl.client_name, ch.channel_name, ck_agg.total_clicks, ck_agg.total_cost
ORDER BY total_impressions DESC, c.campaign_name;`,
      expectedColumns: ["campaign_name", "client_name", "channel_name", "total_impressions", "total_clicks", "total_cost"],
      expectedRows: [
        { campaign_name: "BioMarché - Meta Awareness", client_name: "BioMarché", channel_name: "Meta Ads", total_impressions: 83000, total_clicks: 1660, total_cost: 996.00 },
        { campaign_name: "PetitChef - Meta Foodies", client_name: "PetitChef", channel_name: "Meta Ads", total_impressions: 47000, total_clicks: 0, total_cost: 0.00 },
        { campaign_name: "EduSpark - TikTok Students", client_name: "EduSpark", channel_name: "TikTok Ads", total_impressions: 40000, total_clicks: 1200, total_cost: 360.00 },
        { campaign_name: "TechNova - TikTok Tech", client_name: "TechNova", channel_name: "TikTok Ads", total_impressions: 35000, total_clicks: 0, total_cost: 0.00 },
        { campaign_name: "UrbanBike - Meta Spring", client_name: "UrbanBike", channel_name: "Meta Ads", total_impressions: 35000, total_clicks: 700, total_cost: 420.00 },
        { campaign_name: "LuxeParfum - TikTok Luxe", client_name: "LuxeParfum", channel_name: "TikTok Ads", total_impressions: 20000, total_clicks: 0, total_cost: 0.00 },
        { campaign_name: "UrbanBike - Search Local", client_name: "UrbanBike", channel_name: "Google Ads", total_impressions: 8000, total_clicks: 320, total_cost: 256.00 },
      ],
      orderMatters: true,
    },
    {
      id: "pa-10",
      title: "Revenue per conversion ranking with ties",
      titleFr: "Classement du revenu par conversion avec ex-aequo",
      stakeholder: "Yann",
      stakeholderRole: "Creative Director",
      difficulty: "hard",
      description:
        "Yann (Creative Director) wants to rank all campaigns by their average revenue per conversion to understand which creative approaches drive the highest-value conversions. Use RANK() to handle ties. Show campaign name, client name, total conversions, total revenue, revenue per conversion (rounded to 2 decimals), and rank. Sort by rank ascending, then campaign name ascending for tie-breaking.",
      descriptionFr:
        "Yann (Creative Director) veut classer toutes les campagnes par revenu moyen par conversion pour comprendre quelles approches créatives génèrent les conversions les plus rentables. Utilise RANK() pour gérer les ex-aequo. Affiche le nom de la campagne, le client, le total de conversions, le revenu total, le revenu par conversion (arrondi à 2 décimales) et le rang. Trie par rang croissant puis nom de campagne croissant pour départager les ex-aequo.",
      hint: "Aggregate conversions per campaign. Compute revenue/conversions. Use RANK() OVER (ORDER BY revenue_per_conversion DESC). ORDER BY rank, campaign_name.",
      hintFr: "Agrège les conversions par campagne. Calcule revenu/conversions. Utilise RANK() OVER (ORDER BY revenue_per_conversion DESC). ORDER BY rank, campaign_name.",
      solutionQuery: `WITH campaign_metrics AS (
  SELECT
    c.campaign_id,
    c.campaign_name,
    cl.client_name,
    SUM(cv.conversion_count) AS total_conversions,
    SUM(cv.revenue) AS total_revenue,
    ROUND(SUM(cv.revenue) / SUM(cv.conversion_count), 2) AS revenue_per_conversion
  FROM campaigns c
  JOIN clients cl ON c.client_id = cl.client_id
  JOIN conversions cv ON c.campaign_id = cv.campaign_id
  GROUP BY c.campaign_id, c.campaign_name, cl.client_name
)
SELECT
  campaign_name,
  client_name,
  total_conversions,
  total_revenue,
  revenue_per_conversion,
  RANK() OVER (ORDER BY revenue_per_conversion DESC) AS rank
FROM campaign_metrics
ORDER BY rank, campaign_name;`,
      expectedColumns: ["campaign_name", "client_name", "total_conversions", "total_revenue", "revenue_per_conversion", "rank"],
      expectedRows: [
        { campaign_name: "CloudSecure - LinkedIn Enterprise", client_name: "CloudSecure", total_conversions: 5, total_revenue: 7500.00, revenue_per_conversion: 1500.0, rank: 1 },
        { campaign_name: "TechNova - LinkedIn B2B", client_name: "TechNova", total_conversions: 18, total_revenue: 7200.00, revenue_per_conversion: 400.0, rank: 2 },
        { campaign_name: "LuxeParfum - Meta Premium", client_name: "LuxeParfum", total_conversions: 27, total_revenue: 8100.00, revenue_per_conversion: 300.0, rank: 3 },
        { campaign_name: "CloudSecure - Search Security", client_name: "CloudSecure", total_conversions: 22, total_revenue: 4400.00, revenue_per_conversion: 200.0, rank: 4 },
        { campaign_name: "TechNova - Search SaaS", client_name: "TechNova", total_conversions: 90, total_revenue: 18000.00, revenue_per_conversion: 200.0, rank: 4 },
        { campaign_name: "EduSpark - Search Edu", client_name: "EduSpark", total_conversions: 10, total_revenue: 1500.00, revenue_per_conversion: 150.0, rank: 6 },
        { campaign_name: "LuxeParfum - Search Luxury", client_name: "LuxeParfum", total_conversions: 20, total_revenue: 3000.00, revenue_per_conversion: 150.0, rank: 6 },
        { campaign_name: "BioMarché - Search Brand", client_name: "BioMarché", total_conversions: 30, total_revenue: 2400.00, revenue_per_conversion: 80.0, rank: 8 },
        { campaign_name: "FitZen - Meta Retargeting", client_name: "FitZen", total_conversions: 8, total_revenue: 640.00, revenue_per_conversion: 80.0, rank: 8 },
        { campaign_name: "FitZen - TikTok Fitness", client_name: "FitZen", total_conversions: 45, total_revenue: 2250.00, revenue_per_conversion: 50.0, rank: 10 },
      ],
      orderMatters: true,
    },
  ],
};
