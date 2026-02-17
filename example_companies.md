# Entreprises fictives — SQL Practice Platform

Liste d'entreprises fictives "banales mais fun" pour la gamification et l'immersion utilisateur. Chaque entreprise est conçue pour être réaliste (on pourrait y croire), mémorable (noms accrocheurs), et pédagogiquement riche (schéma de données varié).

---

## Vue d'ensemble

| # | Nom | Secteur | Tagline | Tables clés | Track principal |
|---|-----|---------|---------|-------------|-----------------|
| 1 | **NeonCart** | E-commerce | "L'e-commerce futuriste pour geeks" | orders, customers, products, order_items, returns, reviews | DA Beginner–Intermediate |
| 2 | **DataFlow** | SaaS B2B | "Le CRM que les commerciaux utilisent vraiment" | users, subscriptions, invoices, events, plans, tickets | DA Intermediate–Advanced |
| 3 | **PixelAds** | Marketing / Adtech | "Vos pubs, nos pixels, votre croissance" | campaigns, impressions, clicks, conversions, channels, clients | DA Intermediate |
| 4 | **CashBee** | Fintech / Néobanque | "La banque qui ne dort jamais" | accounts, transactions, cards, users, kyc_checks, transfers | DA Advanced |
| 5 | **TalentHub** | RH / Recrutement | "On ne recrute pas des CV, on recrute des humains" | employees, departments, salaries, performance_reviews, candidates, job_postings | DA Intermediate |
| 6 | **CloudForge** | Data Platform | "Vos données, notre forge" | raw_events, staging_users, dim_customer, dim_date, fact_events, data_quality_logs | DE Intermediate–Advanced |
| 7 | **FreshBowl** | Foodtech / Livraison | "Des bowls frais, livrés chauds" | orders, restaurants, riders, deliveries, menu_items, ratings | DA Beginner |
| 8 | **StreamPulse** | Streaming / Média | "Le son qui pulse, les données qui parlent" | users, streams, artists, playlists, listening_sessions, royalties | DA Intermediate–Advanced |

---

## Fiches détaillées

---

### 1. NeonCart

> **Secteur** : E-commerce
> **Tagline** : "L'e-commerce futuriste pour geeks"
> **Track** : Data Analyst (Beginner → Intermediate)

**Contexte narratif** :
NeonCart est une marketplace en ligne spécialisée dans les produits tech, gaming et gadgets. Fondée en 2021 par deux passionnés de rétro-gaming, l'entreprise est passée de 50 à 2 000 commandes par mois en 3 ans. L'équipe data (3 personnes) est débordée et tu viens d'être recruté(e) pour les épauler.

**Schéma de données** :

| Table | Rows | Description |
|-------|------|-------------|
| `customers` | 25 | Clients inscrits (nom, email, ville, date inscription) |
| `products` | 20 | Catalogue produits (nom, catégorie, prix, stock, fournisseur) |
| `orders` | 30 | Commandes (client, date, statut, montant total, canal) |
| `order_items` | 50 | Lignes de commande (produit, quantité, prix unitaire) |
| `returns` | 8 | Retours produits (motif, date, statut remboursement) |
| `reviews` | 15 | Avis clients (produit, note 1-5, commentaire, date) |

**Stakeholders récurrents** :
- 👤 **Alex** — VP Sales : veut des métriques de vente
- 👤 **Nadia** — Product Manager : veut comprendre le comportement utilisateur
- 👤 **Marc** — Head of Logistics : obsédé par les retours et la livraison

**Exercices typiques** :
- "Alex veut le top 5 produits par CA ce mois-ci" → Top-N per group
- "Nadia veut savoir quels clients n'ont plus commandé depuis 90 jours" → Anti-join
- "Marc veut le taux de retour par catégorie de produit" → Conditional aggregation

---

### 2. DataFlow

> **Secteur** : SaaS B2B
> **Tagline** : "Le CRM que les commerciaux utilisent vraiment"
> **Track** : Data Analyst (Intermediate → Advanced)

**Contexte narratif** :
DataFlow est un CRM SaaS en pleine croissance. 800 clients B2B, 3 plans tarifaires (Starter, Pro, Enterprise). L'enjeu du moment : réduire le churn et augmenter le MRR. Tu rejoins l'équipe data pour donner de la visibilité au board sur les métriques clés.

**Schéma de données** :

| Table | Rows | Description |
|-------|------|-------------|
| `users` | 25 | Utilisateurs (nom, email, company, rôle, date signup) |
| `subscriptions` | 30 | Abonnements (plan, date début/fin, statut, montant mensuel) |
| `invoices` | 25 | Factures (montant, date, statut paiement) |
| `events` | 50 | Events produit (user, event_type, timestamp, metadata) |
| `plans` | 3 | Plans tarifaires (nom, prix, features) |
| `tickets` | 15 | Tickets support (user, priorité, statut, catégorie) |

**Stakeholders récurrents** :
- 👤 **Clara** — CFO : veut MRR, churn, ARR
- 👤 **Hugo** — Head of Product : veut la rétention et l'usage produit
- 👤 **Inès** — Growth Manager : veut les conversions trial → paid

**Exercices typiques** :
- "Clara veut le MRR et le churn rate du mois dernier" → Revenue metrics
- "Hugo veut la rétention par cohorte d'inscription (M1, M3, M6)" → Cohort retention
- "Inès veut le taux de conversion trial → paid par canal" → Funnel analysis

---

### 3. PixelAds

> **Secteur** : Marketing / Adtech
> **Tagline** : "Vos pubs, nos pixels, votre croissance"
> **Track** : Data Analyst (Intermediate)

**Contexte narratif** :
PixelAds est une agence de marketing digital qui gère les campagnes pub de 15 clients. Entre Google Ads, Meta Ads et TikTok, les données affluent de partout. Ton rôle : consolider les métriques et donner aux account managers des insights actionnables.

**Schéma de données** :

| Table | Rows | Description |
|-------|------|-------------|
| `campaigns` | 20 | Campagnes pub (client, canal, budget, date début/fin) |
| `impressions` | 30 | Impressions (campagne, date, count, device) |
| `clicks` | 25 | Clics (campagne, date, count, cost) |
| `conversions` | 15 | Conversions (campagne, date, count, revenue) |
| `channels` | 5 | Canaux (Google, Meta, TikTok, LinkedIn, Email) |
| `clients` | 8 | Clients de l'agence (nom, secteur, budget mensuel) |

**Stakeholders récurrents** :
- 👤 **Léo** — Account Manager : veut le ROAS par client
- 👤 **Sarah** — Head of Performance : veut comparer les canaux
- 👤 **Yann** — Creative Director : veut savoir quel format performe

**Exercices typiques** :
- "Léo veut le ROAS par client sur les 30 derniers jours" → Aggregation + join
- "Sarah veut le CPC moyen par canal, trié du moins cher au plus cher" → Period-over-period
- "Yann veut le CTR par format créatif (vidéo, carrousel, image)" → Conditional aggregation

---

### 4. CashBee

> **Secteur** : Fintech / Néobanque
> **Tagline** : "La banque qui ne dort jamais"
> **Track** : Data Analyst (Advanced)

**Contexte narratif** :
CashBee est une néobanque pour les 25-40 ans. 50 000 comptes actifs, des virements instantanés, et un programme de cashback. Le régulateur veut des rapports, le CEO veut des dashboards, et l'équipe fraude veut dormir la nuit. Tu es leur renfort data.

**Schéma de données** :

| Table | Rows | Description |
|-------|------|-------------|
| `accounts` | 20 | Comptes bancaires (client, type, solde, date ouverture) |
| `transactions` | 50 | Transactions (compte, montant, type, date, merchant, status) |
| `cards` | 15 | Cartes bancaires (compte, type, plafond, statut, expiry) |
| `users` | 20 | Utilisateurs (nom, email, date naissance, kyc_status) |
| `kyc_checks` | 12 | Vérifications KYC (user, date, résultat, document_type) |
| `transfers` | 20 | Virements (émetteur, bénéficiaire, montant, date, type) |

**Stakeholders récurrents** :
- 👤 **Fatima** — Compliance Officer : veut les transactions suspectes
- 👤 **David** — Risk Manager : veut les patterns de fraude
- 👤 **Lisa** — Product Manager : veut l'adoption des features

**Exercices typiques** :
- "Fatima veut les transactions > 10 000€ sans KYC validé" → Anti-join + filtering
- "David veut détecter les comptes avec 5+ transactions en 1 heure" → Gap-and-island / window
- "Lisa veut le taux d'adoption du virement instantané par tranche d'âge" → Conditional agg + bucketing

---

### 5. TalentHub

> **Secteur** : RH / Recrutement
> **Tagline** : "On ne recrute pas des CV, on recrute des humains"
> **Track** : Data Analyst (Intermediate)

**Contexte narratif** :
TalentHub est une scale-up de 300 personnes qui édite une plateforme de recrutement. La DRH veut des données pour piloter la politique RH : turnover, salaires, diversité, performance. Tu viens d'arriver dans l'équipe People Analytics.

**Schéma de données** :

| Table | Rows | Description |
|-------|------|-------------|
| `employees` | 30 | Employés (nom, département, poste, date embauche, manager_id) |
| `departments` | 6 | Départements (nom, budget, head_count_target) |
| `salaries` | 30 | Historique salaires (employé, montant, date début, date fin) |
| `performance_reviews` | 25 | Évaluations annuelles (employé, note, année, commentaire) |
| `candidates` | 20 | Candidats (poste visé, source, date candidature, statut) |
| `job_postings` | 10 | Offres d'emploi (poste, département, date publication, statut) |

**Stakeholders récurrents** :
- 👤 **Marie** — DRH : veut le turnover et l'écart salarial
- 👤 **Paul** — Talent Acquisition : veut le time-to-hire
- 👤 **Céline** — Head of Engineering : veut les perfs de son équipe

**Exercices typiques** :
- "Marie veut le taux de turnover par département sur les 12 derniers mois" → Aggregation + date filtering
- "Paul veut le time-to-hire moyen par source de recrutement" → CTE + aggregation
- "Céline veut le top 5 des développeurs par note de performance" → Top-N per group

---

### 6. CloudForge

> **Secteur** : Data Platform
> **Tagline** : "Vos données, notre forge"
> **Track** : Data Engineer (Intermediate → Advanced)

**Contexte narratif** :
CloudForge est un éditeur de plateforme data qui aide ses clients à construire leur data warehouse. En interne, l'équipe DE gère un pipeline avec architecture medallion (bronze/silver/gold). Tu viens renforcer l'équipe pour fiabiliser les pipelines et améliorer la qualité des données.

**Schéma de données** :

| Table | Rows | Description |
|-------|------|-------------|
| `raw_events` | 50 | Events bruts (source, payload JSON, timestamp, ingestion_date) |
| `staging_users` | 25 | Table staging (données nettoyées mais pas validées) |
| `dim_customer` | 20 | Dimension client (SCD Type 2 : valid_from, valid_to, is_current) |
| `dim_date` | 30 | Dimension date (date, jour semaine, mois, trimestre, année) |
| `fact_events` | 40 | Table de faits (métriques + FK vers dimensions) |
| `data_quality_logs` | 15 | Logs de checks qualité (table, check, résultat, date) |

**Stakeholders récurrents** :
- 👤 **Romain** — CTO : veut la fiabilité des pipelines
- 👤 **Amélie** — Data Engineer Senior : review tes PRs et ton SQL
- 👤 **Karim** — Data Analyst : consomme tes tables et râle quand c'est cassé

**Exercices typiques** :
- "Romain veut un dashboard de freshness des tables (dernière mise à jour < 24h)" → Data quality
- "Amélie te demande d'implémenter le SCD Type 2 pour dim_customer" → SCD Type 2
- "Karim se plaint de doublons dans staging_users — déduplique" → Deduplication + MERGE

---

### 7. FreshBowl

> **Secteur** : Foodtech / Livraison
> **Tagline** : "Des bowls frais, livrés chauds"
> **Track** : Data Analyst (Beginner)

**Contexte narratif** :
FreshBowl est une startup de livraison de bowls healthy dans 5 villes. 12 restaurants partenaires, 30 livreurs, et une app mobile. L'enjeu : comprendre les temps de livraison, les plats populaires, et la satisfaction client. Tu es le premier Data Analyst — tout est à construire.

**Schéma de données** :

| Table | Rows | Description |
|-------|------|-------------|
| `orders` | 30 | Commandes (client, restaurant, date, montant, statut) |
| `restaurants` | 12 | Restaurants partenaires (nom, ville, type cuisine, note moyenne) |
| `riders` | 15 | Livreurs (nom, ville, date inscription, véhicule) |
| `deliveries` | 25 | Livraisons (commande, rider, temps estimé, temps réel, distance) |
| `menu_items` | 20 | Plats (restaurant, nom, prix, catégorie, calories) |
| `ratings` | 18 | Avis (commande, note restaurant, note livreur, commentaire) |

**Stakeholders récurrents** :
- 👤 **Emma** — COO : veut les temps de livraison
- 👤 **Théo** — Head of Partnerships : veut les performances des restaurants
- 👤 **Jade** — Product Manager App : veut les métriques d'usage

**Exercices typiques** :
- "Emma veut le temps de livraison moyen par ville" → Basic aggregation
- "Théo veut le classement des restaurants par note moyenne" → ORDER BY + window
- "Jade veut savoir combien de commandes par jour cette semaine" → GROUP BY date

---

### 8. StreamPulse

> **Secteur** : Streaming / Média
> **Tagline** : "Le son qui pulse, les données qui parlent"
> **Track** : Data Analyst (Intermediate → Advanced)

**Contexte narratif** :
StreamPulse est une plateforme de streaming musical indépendante qui mise sur les artistes émergents. 100 000 utilisateurs, 50 000 morceaux, un algorithme de recommandation maison. L'équipe data analyse les écoutes pour payer les artistes (royalties) et améliorer les recommandations.

**Schéma de données** :

| Table | Rows | Description |
|-------|------|-------------|
| `users` | 25 | Utilisateurs (nom, pays, plan, date inscription) |
| `streams` | 50 | Écoutes (user, track, timestamp, duration_seconds, source) |
| `artists` | 15 | Artistes (nom, genre, pays, date inscription) |
| `playlists` | 12 | Playlists (créateur, nom, nb tracks, is_public) |
| `listening_sessions` | 20 | Sessions d'écoute (user, start, end, device, tracks_played) |
| `royalties` | 15 | Royalties versées (artiste, mois, montant, streams count) |

**Stakeholders récurrents** :
- 👤 **Nina** — Head of Content : veut savoir quels artistes montent
- 👤 **Julien** — CFO : veut optimiser les royalties
- 👤 **Mia** — Data Scientist Reco : veut des features d'écoute

**Exercices typiques** :
- "Nina veut le top 10 artistes par nombre d'écoutes ce mois-ci" → Top-N + aggregation
- "Julien veut le coût moyen par stream par plan tarifaire" → Revenue metrics + join
- "Mia veut les sessions d'écoute avec 10+ morceaux consécutifs du même genre" → Gap-and-island

---

## Critères de sélection des entreprises

Chaque entreprise a été choisie selon ces critères :

| Critère | Justification |
|---------|---------------|
| **Relatable** | L'utilisateur peut se projeter ("j'ai déjà commandé sur un site e-commerce") |
| **Schéma naturellement riche** | Minimum 5-6 tables avec relations FK naturelles |
| **Couverture des patterns SQL** | Chaque entreprise permet de pratiquer 10+ patterns différents |
| **Variété des métriques** | Chaque secteur a ses KPIs propres (MRR ≠ ROAS ≠ turnover) |
| **Progression logique** | Les exercices peuvent aller du SELECT simple à l'analyse multi-table |
| **Noms mémorables** | Courts, prononçables, légèrement fun sans être ridicules |
| **Pas de conflit de marque** | Noms inventés, aucune ressemblance avec des entreprises réelles |

---

## Mapping entreprise → track et niveau

```
Beginner                     Intermediate                   Advanced
────────────────────────────────────────────────────────────────────

FreshBowl ─────────┐
                    │
NeonCart ───────────┼───── NeonCart ──────────┐
                    │                         │
                    ├───── TalentHub ─────────┤
                    │                         │
                    ├───── PixelAds ──────────┤
                    │                         │
                    └───── DataFlow ──────────┼──── DataFlow
                                              │
                                              ├──── CashBee
                                              │
                                              ├──── StreamPulse
                                              │
                          CloudForge (DE) ────┼──── CloudForge (DE)
```

---

## Ordre de développement recommandé

| Priorité | Entreprise | Raison |
|----------|-----------|--------|
| **P0** | NeonCart | E-commerce = domaine le plus intuitif, déjà 30+ exercices existants adaptables |
| **P0** | DataFlow | SaaS = couvre les métriques business les plus demandées en entretien |
| **P1** | PixelAds | Marketing = complète la couverture des domaines intermédiaires |
| **P1** | FreshBowl | Foodtech = excellent point d'entrée pour les débutants absolus |
| **P2** | CashBee | Fintech = exercices avancés, patterns complexes |
| **P2** | TalentHub | RH = self-joins, hiérarchies, patterns intermédiaires variés |
| **P3** | CloudForge | Data Platform = spécifique au track Data Engineer |
| **P3** | StreamPulse | Streaming = cohorts, sessions, gap-and-island avancé |
