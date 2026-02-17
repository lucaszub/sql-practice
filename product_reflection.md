# Product Reflection — SQL Practice Platform

## Table des matières

1. [Analyse du produit actuel](#1-analyse-du-produit-actuel)
2. [Problématiques identifiées](#2-problématiques-identifiées)
3. [Architecture multi-base et sélection d'entreprise](#3-architecture-multi-base-et-sélection-dentreprise)
4. [UX/UI — Navigation et immersion](#4-uxui--navigation-et-immersion)
5. [Gamification et immersion par entreprise](#5-gamification-et-immersion-par-entreprise)
6. [Personas métiers et cas d'usage réels](#6-personas-métiers-et-cas-dusage-réels)
7. [Skills et agents internes Claude Code](#7-skills-et-agents-internes-claude-code)
8. [Roadmap des évolutions](#8-roadmap-des-évolutions)
9. [Considérations techniques](#9-considérations-techniques)

---

## 1. Analyse du produit actuel

### Forces

| Aspect | Détail |
|--------|--------|
| **Zero setup** | DuckDB-WASM exécuté entièrement dans le navigateur, aucun backend |
| **101 exercices** | Deux tracks (Data Analyst, Data Engineer) avec modules hiérarchiques |
| **Validation rigoureuse** | 2+ test cases par exercice (default + edge case), diff row-by-row |
| **UX soignée** | Panneaux redimensionnables, CodeMirror 6, TanStack Table virtuel |
| **Progression** | Zustand + localStorage, progress ring, activity heatmap, module prerequisites |
| **i18n** | FR/EN complet (UI + contenu exercices) |
| **Patterns SQL nommés** | Top-N per group, gap-and-island, cohort retention, etc. |

### Métriques clés

- **101 exercices** répartis sur 2 tracks et 7 domaines business
- **31 catégories** SQL couvertes (du SELECT basique au JSON processing)
- **2 langues** supportées (EN/FR)
- **0 backend** : architecture 100% client-side

### Stack technique

- Next.js 16 App Router + TypeScript strict
- DuckDB-WASM 1.33.x (worker thread)
- CodeMirror 6, TanStack Table/Virtual, shadcn/ui + Tailwind
- Zustand (progress + session), Vitest

---

## 2. Problématiques identifiées

### 2.1 Base de données unique et répétitive

**Constat** : Chaque exercice définit son propre schéma inline (`CREATE TABLE + INSERT`) dans `exercise.ts`. Les schémas sont isolés — pas de vision "vraie base de données d'entreprise". L'utilisateur voit des tables jetables qui apparaissent et disparaissent à chaque exercice.

**Impact** :
- Pas de familiarisation avec un schéma persistant (comme en entreprise)
- Données répétitives : `orders`, `customers`, `products` redéfinis dans 30+ exercices avec des variantes mineures
- Pas de sentiment de "travailler sur une vraie base"
- Pas de possibilité d'explorer librement les tables entre les exercices

### 2.2 Absence de contexte business immersif

**Constat** : Les exercices mentionnent des scénarios business dans la description, mais il n'y a pas de contexte persistent. L'utilisateur ne "travaille" pas pour une entreprise — il résout des exercices isolés.

**Impact** :
- Pas de narration progressive
- Pas d'attachement émotionnel au contexte
- Pas de différenciation par rapport aux concurrents (LeetCode, StrataScratch)
- Les exercices semblent être des drills techniques déguisés

### 2.3 Pas de vue macro des données

**Constat** : L'utilisateur ne voit que le schéma de l'exercice en cours (dans la description). Il n'y a pas d'explorateur de tables, pas de diagramme ER, pas de vue "Data Catalog".

**Impact** :
- En entreprise, un analyste passe beaucoup de temps à explorer les tables avant d'écrire du SQL
- Compétence cruciale non entraînée : la découverte de données
- Pas de possibilité de `SELECT * FROM ...` pour explorer avant de résoudre

### 2.4 Progression linéaire sans personnalisation

**Constat** : Tous les utilisateurs suivent les mêmes exercices dans le même ordre. Pas de sélection de secteur, de difficulté adaptative, ni de parcours personnalisé.

**Impact** :
- Un analyste e-commerce et un analyste fintech voient les mêmes données
- Pas de replay value (une fois résolu, rien ne change)
- Pas de personnalisation du parcours d'apprentissage

---

## 3. Architecture multi-base et sélection d'entreprise

### 3.1 Concept : "Pour quelle entreprise voulez-vous travailler ?"

L'utilisateur choisit une entreprise fictive au lancement. Ce choix détermine :

1. **Le schéma de données** (tables, colonnes, types)
2. **Les données seed** (noms, montants, dates contextualisés)
3. **Les intitulés d'exercices** (questions business contextualisées)
4. **Le vocabulaire métier** (MRR vs CA, users vs clients, etc.)
5. **L'ambiance visuelle** (logo, couleur d'accent optionnelle)

### 3.2 Architecture technique proposée

```
src/
  companies/
    index.ts                          # Registre des entreprises
    types.ts                          # CompanyProfile, CompanySchema, etc.
    neon-cart/                        # Exemple: e-commerce
      profile.ts                     # Nom, description, secteur, logo
      schema.ts                      # CREATE TABLE + INSERT (base complète)
      catalog.ts                     # Métadonnées tables (descriptions, relations)
      exercises/                     # Exercices contextualisés
        beginner/
        intermediate/
        advanced/
    dataflow-saas/                   # Exemple: SaaS B2B
      ...
    pixel-ads/                       # Exemple: marketing/adtech
      ...
```

#### Types principaux

```typescript
interface CompanyProfile {
  id: string;                        // "neon-cart"
  name: string;                      // "NeonCart"
  tagline: string;                   // "E-commerce futuriste pour geeks"
  sector: BusinessSector;            // "e-commerce" | "saas" | "marketing" | ...
  icon: string;                      // Emoji ou URL
  accentColor: string;               // Tailwind color class
  description: string;               // Contexte immersif (3-5 phrases)
  teamContext: string;               // "Tu rejoins l'équipe Data de NeonCart..."
  tables: TableCatalogEntry[];       // Vue macro des tables
}

interface TableCatalogEntry {
  name: string;                      // "orders"
  description: string;               // "Commandes passées par les clients"
  columns: ColumnInfo[];             // Nom, type, description, nullable
  rowCount: number;                  // Nombre de lignes seed
  relationships: Relationship[];     // FK vers autres tables
  sampleQuery?: string;              // "SELECT * FROM orders LIMIT 5"
}

interface CompanyExercise extends Exercise {
  companyId: string;                 // Lien vers l'entreprise
  businessContext: string;           // Contexte métier spécifique
  stakeholder: string;               // "Le Product Manager demande..."
  urgency?: "routine" | "urgent" | "exploration";
}
```

### 3.3 Schéma partagé vs spécifique

| Couche | Contenu | Exemple |
|--------|---------|---------|
| **Noyau SQL** | Patterns SQL invariants (la logique SQL testée) | `ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)` |
| **Schéma entreprise** | Tables, colonnes, types, données seed | `orders` chez NeonCart vs `subscriptions` chez DataFlow |
| **Contexte métier** | Description, stakeholder, vocabulaire | "Le VP Sales veut..." vs "Le CTO demande..." |

**Principe** : Le même pattern SQL (ex: Top-N per group) peut être décliné dans plusieurs entreprises avec des schémas et contextes différents. Les `testCases` et `solutionQuery` sont spécifiques à chaque entreprise.

### 3.4 Modèle de données DuckDB

Chaque entreprise dispose d'une base DuckDB cohérente et persistante pendant la session :

```sql
-- Schéma chargé une fois au choix de l'entreprise
-- Reste en mémoire pour tous les exercices de cette entreprise

-- NeonCart (e-commerce)
CREATE TABLE customers (...);       -- 25 rows
CREATE TABLE products (...);        -- 20 rows
CREATE TABLE orders (...);          -- 30 rows
CREATE TABLE order_items (...);     -- 50 rows
CREATE TABLE returns (...);         -- 8 rows
CREATE TABLE reviews (...);         -- 15 rows

-- L'utilisateur peut explorer à tout moment :
-- SELECT * FROM customers LIMIT 10;
-- SHOW TABLES;
-- DESCRIBE orders;
```

---

## 4. UX/UI — Navigation et immersion

### 4.1 Flux utilisateur proposé

```
[Landing Page]
     │
     ▼
[Choix du track]  ──→  Data Analyst / Data Engineer
     │
     ▼
[Choix de l'entreprise]  ──→  NeonCart / DataFlow / PixelAds / ...
     │
     ▼
[Dashboard entreprise]
  ├── Vue macro : Data Catalog (tables, relations, descriptions)
  ├── Exercices contextualisés (groupés par module)
  ├── Sandbox SQL libre (explorer les tables)
  └── Progression par entreprise
     │
     ▼
[Exercice]  ──→  Description + Éditeur + Résultats (existant, enrichi)
```

### 4.2 Page de sélection d'entreprise

**Route** : `/select-company`

**Layout** :
- Titre : "Pour quelle entreprise voulez-vous travailler ?"
- Grille de cartes (3-4 entreprises par ligne)
- Chaque carte :
  - Logo/icône + nom de l'entreprise
  - Tagline (1 ligne)
  - Secteur (badge)
  - Nombre de tables / exercices disponibles
  - Indicateur de progression (si déjà commencé)
- Filtre par secteur (optionnel)
- Bouton "Explorer" → Dashboard entreprise

### 4.3 Data Catalog — Vue macro des tables

**Route** : `/company/{id}/catalog`

**Inspiration** : Interface similaire à un data catalog d'entreprise (dbt docs, Atlan, DataHub)

**Fonctionnalités** :
1. **Liste des tables** (sidebar gauche)
   - Nom de la table + icône (fact, dimension, staging)
   - Nombre de lignes
   - Indicateur : "utilisée dans X exercices"

2. **Détail d'une table** (panneau principal)
   - Description en langage naturel
   - Liste des colonnes : nom, type, nullable, description
   - Relations (FK) : liens cliquables vers autres tables
   - Données sample (`SELECT * FROM table LIMIT 5`)
   - Bouton "Explorer dans le Sandbox"

3. **Vue ERD simplifiée** (optionnelle, phase 2)
   - Diagramme entité-relation interactif
   - Clic sur une table → détail

4. **Sandbox SQL**
   - Éditeur SQL libre (CodeMirror existant)
   - Accès à toutes les tables de l'entreprise
   - Pas de validation, pas de test — exploration libre
   - Bouton "SHOW TABLES", "DESCRIBE table_name" en raccourcis

### 4.4 Dashboard entreprise

**Route** : `/company/{id}`

**Sections** :
1. **En-tête immersif**
   - Nom de l'entreprise + tagline
   - Contexte narratif : "Tu viens d'être recruté(e) comme Data Analyst chez NeonCart. L'équipe Data compte 5 personnes et tu reportes au Head of Analytics. Voici ta première semaine..."
   - Statistiques : X exercices résolus / Y total

2. **Parcours d'exercices**
   - Modules existants (B1, B2, ...) contextualisés
   - Chaque exercice a un titre business : "Le VP Sales demande le top 5 produits par catégorie"
   - Badge stakeholder : 👤 VP Sales, 👤 Product Manager, 👤 CFO

3. **Quick links**
   - "Explorer les tables" → Data Catalog
   - "SQL Sandbox" → Éditeur libre
   - "Changer d'entreprise" → Retour sélection

### 4.5 Améliorations de la page exercice

**Ajouts au panneau gauche (description)** :
- **Stakeholder** : "Demandé par : Marie, Product Manager"
- **Contexte** : "L'équipe produit prépare la revue trimestrielle..."
- **Tables disponibles** : Liste cliquable → ouvre DESCRIBE dans le panneau résultat
- **Lien Data Catalog** : "Voir le schéma complet"

**Ajout d'un onglet "Tables"** dans le panneau résultats :
- `SHOW TABLES` : liste des tables
- Clic sur une table → `DESCRIBE table` + `SELECT * FROM table LIMIT 10`
- Permet l'exploration sans quitter l'exercice

---

## 5. Gamification et immersion par entreprise

### 5.1 Système de progression narrative

| Concept | Détail |
|---------|--------|
| **Onboarding week** | Les 5 premiers exercices = "ta première semaine" |
| **Missions** | Groupes de 3-5 exercices liés à un objectif métier |
| **Stakeholders** | Personnages récurrents qui posent les questions |
| **Promotions** | Débloquer le titre "Senior Analyst" après X exercices |
| **Inter-entreprise** | Comparer sa progression entre entreprises |

### 5.2 Badges et récompenses

| Badge | Condition | Description |
|-------|-----------|-------------|
| 🏢 **Onboarding Complete** | 5 premiers exercices d'une entreprise | "Tu survis à ta première semaine !" |
| 🔍 **Data Explorer** | Utiliser le Sandbox 10 fois | "Tu connais les données mieux que personne" |
| ⚡ **Speed Demon** | Résoudre un exercice en < 60 secondes | "Le SQL coule dans tes veines" |
| 🎯 **First Try** | Résoudre sans erreur au premier essai | "Pas besoin de debug" |
| 🏆 **Module Master** | Compléter un module entier | "Expert du module [nom]" |
| 🌍 **Polyvalent** | Compléter des exercices dans 3+ entreprises | "Tu es un consultant data" |
| 🔥 **Streak 7** | 7 jours consécutifs d'activité | "Une semaine complète !" |
| 💎 **Completionist** | 100% d'une entreprise | "Rien ne t'échappe chez [entreprise]" |

### 5.3 Difficulté contextuelle

Chaque entreprise propose une **progression interne** :

1. **Semaine 1** (Beginner) : Découverte des tables, requêtes simples
2. **Mois 1** (Intermediate) : Analyses multi-tables, CTEs, window functions
3. **Trimestre 1** (Advanced) : Métriques business complexes, optimisation

Le niveau de difficulté est le même pattern SQL, mais contextualisé à l'entreprise : calculer le MRR chez DataFlow (SaaS) = calculer le CA mensuel chez NeonCart (e-commerce).

### 5.4 Éléments narratifs par exercice

```typescript
interface NarrativeContext {
  stakeholder: {
    name: string;           // "Marie"
    role: string;           // "Product Manager"
    avatar: string;         // Emoji ou initiales
  };
  channel: string;          // "Slack #data-requests" | "Email" | "Meeting"
  urgency: "routine" | "urgent" | "exploration";
  backstory: string;        // "L'équipe prépare le board meeting de vendredi..."
}
```

---

## 6. Personas métiers et cas d'usage réels

### 6.1 Persona : Data Analyst E-commerce

| Attribut | Détail |
|----------|--------|
| **Nom** | Léa, 27 ans |
| **Poste** | Data Analyst chez NeonCart (e-commerce) |
| **Stack** | SQL (DuckDB/BigQuery), Python, Looker |
| **Objectifs** | Dashboards hebdo, analyses ad-hoc, A/B tests |
| **Frustrations** | Données sales, requêtes lentes, demandes floues |

**Cas d'usage réels** :
1. "Le VP Sales veut le top 10 produits par CA ce trimestre, par catégorie"
2. "Le Head of Logistics demande le taux de retour par fournisseur sur les 6 derniers mois"
3. "Le CEO veut comparer le panier moyen entre clients mobile et desktop"
4. "L'équipe CRM veut identifier les clients inactifs depuis 90 jours"
5. "Le Product Manager veut le funnel d'achat : visite → ajout panier → commande → livraison"

### 6.2 Persona : Data Analyst SaaS

| Attribut | Détail |
|----------|--------|
| **Nom** | Thomas, 30 ans |
| **Poste** | Data Analyst chez DataFlow (SaaS B2B) |
| **Stack** | SQL (Snowflake), dbt, Metabase |
| **Objectifs** | MRR/ARR, churn, cohorts, product usage |
| **Frustrations** | Définitions floues (qu'est-ce qu'un "utilisateur actif" ?), données d'events mal structurées |

**Cas d'usage réels** :
1. "Le CFO veut le MRR, le churn rate et le net revenue retention ce mois-ci"
2. "Le Head of Product veut la rétention par cohorte (M1, M3, M6, M12)"
3. "Le Growth Manager veut le taux de conversion trial → paid par canal d'acquisition"
4. "Le Support Lead veut les comptes avec le plus de tickets ouverts par plan"
5. "Le CEO veut le LTV/CAC ratio par segment de clients"

### 6.3 Persona : Data Analyst Marketing

| Attribut | Détail |
|----------|--------|
| **Nom** | Camille, 25 ans |
| **Poste** | Data Analyst chez PixelAds (agence marketing) |
| **Stack** | SQL (PostgreSQL), Google Analytics, Tableau |
| **Objectifs** | Attribution, ROAS, funnels, A/B test analysis |
| **Frustrations** | Multi-touch attribution complexe, données de tracking incohérentes |

**Cas d'usage réels** :
1. "Le Account Manager veut le ROAS par canal pour la campagne Q4 du client Boutique Zen"
2. "Le Head of Performance veut comparer CPC, CPM et CPA entre Google et Meta"
3. "Le Creative Director veut le taux de clic par format créatif (vidéo, carrousel, image)"
4. "Le Client Success veut un rapport hebdo : impressions, clics, conversions, CA généré"
5. "Le CEO veut savoir quels clients sont les plus rentables (marge agence vs temps passé)"

### 6.4 Persona : Data Analyst Fintech

| Attribut | Détail |
|----------|--------|
| **Nom** | Amir, 32 ans |
| **Poste** | Data Analyst chez CashBee (néobanque) |
| **Stack** | SQL (Redshift), Python, Looker |
| **Objectifs** | Détection fraude, analyse transactions, reporting réglementaire |
| **Frustrations** | Données sensibles, jointures complexes entre systèmes, compliance |

**Cas d'usage réels** :
1. "Le Compliance Officer veut les transactions > 10 000€ sans vérification KYC"
2. "Le Risk Manager veut détecter les comptes avec 5+ transactions dans la même heure"
3. "Le CFO veut le volume de transactions par devise et par jour, sur les 30 derniers jours"
4. "Le Product Manager veut le taux d'adoption du virement instantané par tranche d'âge"
5. "Le Head of Fraud veut les patterns de transactions suspectes (montants ronds, fréquence anormale)"

### 6.5 Persona : Data Analyst RH

| Attribut | Détail |
|----------|--------|
| **Nom** | Sophie, 29 ans |
| **Poste** | People Analyst chez TalentHub (plateforme RH) |
| **Stack** | SQL (MySQL), Excel avancé, PowerBI |
| **Objectifs** | Turnover, satisfaction, pyramide des âges, gap salarial |
| **Frustrations** | Données incomplètes, silos entre paie et SIRH, définitions changeantes |

**Cas d'usage réels** :
1. "Le DRH veut le taux de turnover par département et par ancienneté"
2. "Le Head of Comp veut l'écart salarial médian H/F par niveau hiérarchique"
3. "Le Talent Acquisition veut le time-to-hire moyen par poste et par source"
4. "Le CEO veut la pyramide des âges et la projection à 5 ans"
5. "Le Manager Engineering veut la corrélation entre note de performance et ancienneté"

### 6.6 Persona : Data Engineer

| Attribut | Détail |
|----------|--------|
| **Nom** | Julien, 34 ans |
| **Poste** | Data Engineer chez DataFlow (SaaS B2B) |
| **Stack** | SQL (DuckDB/Snowflake), dbt, Airflow, Python |
| **Objectifs** | Pipelines fiables, data quality, schéma optimal |
| **Frustrations** | Données dupliquées, schémas qui changent, jobs qui échouent silencieusement |

**Cas d'usage réels** :
1. "Concevoir le schéma en étoile pour les analytics produit (fait_events + dim_user + dim_date)"
2. "Implémenter un SCD Type 2 pour l'historique des plans d'abonnement"
3. "Écrire un MERGE pour charger les nouvelles données clients de façon idempotente"
4. "Créer des checks de data quality : complétude, unicité, intégrité référentielle"
5. "Optimiser une requête de 45 secondes qui agrège les events sur 6 mois"

---

## 7. Skills et agents internes Claude Code

### 7.1 Organisation des skills

Chaque skill est un agent autonome avec un objectif précis. Ces agents aident **Claude Code à produire le contenu** (exercices, datasets, hints, validations) de façon structurée et cohérente.

### 7.2 Skill : Company Schema Generator

**Objectif** : Générer le schéma complet d'une entreprise (tables, colonnes, relations, données seed).

**Input** :
- Secteur (e-commerce, SaaS, marketing, fintech, RH)
- Nom de l'entreprise
- Nombre de tables cible (5-10)
- Taille des données (10-30 lignes par table)

**Output** :
- `schema.ts` : SQL `CREATE TABLE` + `INSERT INTO` pour toutes les tables
- `catalog.ts` : Métadonnées (descriptions, relations, sample queries)

**Règles** :
- Respecter les conventions de nommage (`snake_case`, noms descriptifs)
- Inclure des NULLs dans au moins une colonne par table
- Données déterministes, réalistes, avec edge cases intégrés
- Foreign keys explicites entre tables

### 7.3 Skill : Exercise Contextualizer

**Objectif** : Prendre un pattern SQL existant et le contextualiser pour une entreprise spécifique.

**Input** :
- Pattern SQL (ex: "Top-N per group")
- Entreprise cible (ex: NeonCart)
- Niveau de difficulté
- Module cible

**Output** :
- `exercise.ts` complet avec :
  - Titre et description contextualisés (FR + EN)
  - Schéma inline (référence au schéma entreprise)
  - `solutionQuery` adapté aux tables de l'entreprise
  - `testCases` avec edge cases réalistes
  - `solutionExplanation` avec pattern nommé
  - Éléments narratifs (stakeholder, backstory)

### 7.4 Skill : Dataset Builder

**Objectif** : Générer des jeux de données réalistes et cohérents pour une entreprise.

**Input** :
- Schéma de l'entreprise
- Contraintes (taille, edge cases requis, périodes temporelles)

**Output** :
- Instructions `INSERT INTO` pour chaque table
- Fichier de documentation : quelles anomalies/edge cases sont présentes et pourquoi

**Règles** :
- Noms réalistes mais pas de données personnelles réelles
- Montants cohérents par secteur (e-commerce: 10-500€, SaaS: 29-999€/mois)
- Dates cohérentes (pas de commande avant l'inscription du client)
- Intégrité référentielle respectée

### 7.5 Skill : Hint & Feedback Generator

**Objectif** : Produire des indices progressifs et du feedback intelligent pour chaque exercice.

**Input** :
- Exercice complet (description, solution, test cases)
- Erreurs courantes connues pour ce pattern

**Output** :
- 3 niveaux de hints :
  1. **Hint conceptuel** : "Pense à partitionner par catégorie avant de classer"
  2. **Hint structurel** : "Tu auras besoin d'un CTE avec ROW_NUMBER"
  3. **Hint quasi-solution** : "Le WHERE final filtre sur rank <= 3"
- Messages d'erreur contextualisés :
  - Colonnes manquantes → "Ta requête ne retourne pas la colonne `category`"
  - Mauvais ordre → "Les résultats doivent être ordonnés par catégorie puis par rang"
  - Rows en trop → "Ta requête retourne 15 lignes, on en attend 9 — vérifie ton filtre"

### 7.6 Skill : Content Organizer

**Objectif** : Structurer et organiser le contenu dans les fichiers de la plateforme.

**Input** :
- Nouvelle entreprise ou nouveaux exercices à intégrer

**Output** :
- Mise à jour du registre d'exercices (`exercises/index.ts`)
- Mise à jour des modules (`exercises/modules.ts`)
- Mise à jour de la roadmap (`roadmap/`)
- Mise à jour du plan global (`plan.md`)
- Fichiers de l'entreprise structurés correctement

---

## 8. Roadmap des évolutions

### Phase 1 — Fondations (MVP)

**Objectif** : Permettre la sélection d'entreprise et la vue macro des tables.

| Tâche | Détail |
|-------|--------|
| Définir le type `CompanyProfile` | Types TypeScript pour les profils d'entreprises |
| Créer 3 entreprises initiales | NeonCart (e-commerce), DataFlow (SaaS), PixelAds (marketing) |
| Page de sélection | `/select-company` avec grille de cartes |
| Data Catalog basique | `/company/{id}/catalog` — liste tables + DESCRIBE |
| Schéma persistant par session | Charger le schéma entreprise au choix, le garder en mémoire |
| SQL Sandbox | Éditeur libre avec accès aux tables de l'entreprise |
| Zustand : company store | Stocker l'entreprise active + schéma chargé |

### Phase 2 — Exercices contextualisés

**Objectif** : Contextualiser les exercices existants et en créer de nouveaux.

| Tâche | Détail |
|-------|--------|
| Adapter 20 exercices existants | Réécrire descriptions et données pour NeonCart |
| Créer 10 exercices DataFlow | SaaS : MRR, churn, cohorts, product usage |
| Créer 10 exercices PixelAds | Marketing : ROAS, attribution, funnels |
| Ajouter éléments narratifs | Stakeholders, backstory, urgence |
| Hints progressifs | 3 niveaux de hints au lieu d'un seul |

### Phase 3 — Gamification et immersion

**Objectif** : Rendre l'expérience addictive et différenciante.

| Tâche | Détail |
|-------|--------|
| Système de badges | 8+ badges (onboarding, explorer, streak, etc.) |
| Progression narrative | "Semaine 1", "Mois 1" par entreprise |
| Stakeholders récurrents | Personas par entreprise avec avatars |
| Comparaison inter-entreprises | "Tu es Analyst chez NeonCart ET consultant chez PixelAds" |
| Achievements store | Zustand + localStorage pour badges et titres |

### Phase 4 — Expansion du contenu

**Objectif** : Atteindre 200+ exercices sur 6+ entreprises.

| Tâche | Détail |
|-------|--------|
| 3 nouvelles entreprises | CashBee (fintech), TalentHub (RH), CloudForge (data platform) |
| 50+ exercices supplémentaires | Couvrir les modules vides (I6, I7, A5-A8) |
| Track Data Engineer contextualisé | Schéma design et pipelines par entreprise |
| Vue ERD interactive | Diagramme entité-relation cliquable |
| Spaced repetition | Reproposer les exercices échoués après X jours |

### Phase 5 — Fonctionnalités sociales et avancées

**Objectif** : Préparer la plateforme pour une adoption plus large.

| Tâche | Détail |
|-------|--------|
| Timed challenges | Mode chrono pour pratiquer la vitesse |
| Comparaison de solutions | Voir d'autres approches après avoir résolu |
| Export de progression | PDF "certificat" par entreprise |
| API de contenu | Permettre à des tiers de contribuer des entreprises |
| Mode interview prep | Exercices formatés comme des entretiens tech |

---

## 9. Considérations techniques

### 9.1 Impact sur l'architecture existante

| Composant | Changement | Risque |
|-----------|------------|--------|
| DuckDB-WASM | Charger un schéma plus large (5-10 tables) au lieu d'un schéma par exercice | Faible — DuckDB gère bien les petits datasets en mémoire |
| Zustand stores | Ajouter `CompanyStore` (entreprise active, schéma chargé) | Faible — extension naturelle du store existant |
| Exercise types | Étendre `Exercise` avec champs optionnels narratifs | Faible — backward compatible |
| Routing | Nouvelles routes `/select-company`, `/company/[id]/*` | Moyen — restructuration de la navigation |
| Exercices existants | Les 101 exercices restent fonctionnels (mode "classique") | Nul — pas de breaking change |

### 9.2 Performance

- **Schéma entreprise** : 5-10 tables × 20-30 lignes = ~200-300 lignes total → négligeable en mémoire
- **Chargement** : Exécuter ~50 statements SQL au choix d'entreprise (~100ms avec DuckDB-WASM)
- **Navigation** : Le schéma reste en mémoire entre les exercices → pas de rechargement

### 9.3 Compatibilité

- Les 101 exercices existants continuent à fonctionner en mode "exercice isolé"
- L'utilisateur peut choisir : mode classique (exercices individuels) ou mode entreprise (contextualisé)
- La migration est progressive : les entreprises sont ajoutées sans casser l'existant

### 9.4 Stockage et persistance

```typescript
// Zustand store pour l'entreprise active
interface CompanyState {
  activeCompany: CompanyProfile | null;
  isSchemaLoaded: boolean;

  selectCompany(companyId: string): Promise<void>;  // Charge le schéma DuckDB
  clearCompany(): void;                              // Reset
}

// Extension du progress store
interface ProgressState {
  // Existant
  progress: Record<exerciseId, ExerciseProgress>;

  // Nouveau : progression par entreprise
  companyProgress: Record<companyId, {
    exercisesSolved: string[];
    badges: string[];
    startedAt: string;
    lastActiveAt: string;
  }>;
}
```

---

## Conclusion

La plateforme SQL Practice a des fondations solides : architecture client-side performante, 101 exercices de qualité, et une UX soignée. L'évolution vers un modèle multi-entreprise immersif transformerait l'outil d'un "exerciseur SQL" en une **simulation de travail data réaliste** — un positionnement unique sur le marché.

Les clés du succès :
1. **Ne pas casser l'existant** : migration progressive, mode classique préservé
2. **Commencer petit** : 3 entreprises, 20 exercices contextualisés, itérer
3. **Investir dans l'immersion** : stakeholders, narration, vue macro — c'est ce qui différencie
4. **Exploiter DuckDB** : le schéma persistant en mémoire est un avantage technique naturel
