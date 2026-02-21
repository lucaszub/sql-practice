# SQL Practice — Plan de Déploiement VPS

## 1. Synthèse Technique du Projet

### Framework & Runtime
| Élément | Valeur |
|---------|--------|
| Framework | Next.js 16.1.6 (App Router) |
| Node.js requis | >= 20.9.0 (recommandé: 22 LTS) |
| Package manager | pnpm |
| TypeScript | strict mode |
| Build | `next build --webpack` (WASM support) |
| Output | standalone (ajouté) |

### Caractéristiques clés
- **100% client-side** : DuckDB-WASM s'exécute dans le navigateur
- **Aucune API route** : pas de `src/app/api/`
- **Aucun middleware** : pas de `middleware.ts`
- **Aucune variable d'environnement** : zéro `process.env` dans le code
- **Aucune base de données** : tout tourne en WASM côté navigateur
- **Aucun secret** : pas de fichier `.env`

### Dépendances sensibles
- `@duckdb/duckdb-wasm@1.33.1-dev18.0` : fichiers WASM chargés depuis jsDelivr CDN
- `next@16.1.6` : nécessite config webpack custom pour WASM async
- Aucune dépendance native en production (esbuild/duckdb sont devDependencies uniquement)

### Risques identifiés
| Risque | Sévérité | Statut |
|--------|----------|--------|
| Pas de headers de sécurité HTTP | Moyenne | **Corrigé** (CSP, HSTS, X-Frame-Options ajoutés) |
| CSP manquant pour WASM/Workers | Moyenne | **Corrigé** (blob:, wasm-src ajoutés) |
| Pas de rate limiting | Faible | N/A (pas d'API routes) |
| Dépendance CDN jsDelivr pour WASM | Faible | Acceptable (fallback possible) |

---

## 2. Architecture Cible

```
Utilisateur
    │
    ▼
   DNS (A record → IP du VPS)
    │
    ▼
┌──────────────────────────────────────┐
│              VPS Hostinger            │
│              Ubuntu 22/24            │
│                                      │
│  ┌──────────────────────────────┐   │
│  │      Caddy (reverse proxy)   │   │
│  │      :80 → :443 redirect    │   │
│  │      HTTPS auto (Let's Encrypt)│  │
│  │      Security headers        │   │
│  │      gzip/zstd compression   │   │
│  └──────────┬───────────────────┘   │
│             │                        │
│             ▼                        │
│  ┌──────────────────────────────┐   │
│  │     Next.js (standalone)     │   │
│  │     Node.js 22 Alpine        │   │
│  │     :3000 (internal only)    │   │
│  │     Healthcheck intégré     │   │
│  └──────────────────────────────┘   │
│                                      │
│  Docker Compose (réseau bridge)     │
│  UFW + fail2ban + SSH hardened      │
└──────────────────────────────────────┘
```

### Choix techniques
| Composant | Choix | Justification |
|-----------|-------|---------------|
| Reverse proxy | **Caddy** | HTTPS automatique, config 4 lignes, HTTP/3 natif |
| Conteneurisation | **Docker + Compose** | Reproductible, isolation, restart automatique |
| Image base | `node:22-alpine` | LTS, taille minimale (~150MB final) |
| Hardening | Ansible + script bash | Reproductible, versionné |
| Monitoring | Docker healthcheck | Suffisant pour un seul service |

---

## 3. Structure des Fichiers Créés

```
sql-practice/
├── Dockerfile                          # Build multi-stage (4 étapes)
├── .dockerignore                       # Exclusions pour le build
├── docker-compose.yml                  # Next.js + Caddy
├── Caddyfile                           # Reverse proxy + HTTPS + headers
├── Makefile                            # Commandes simplifiées
├── next.config.ts                      # Modifié: standalone + security headers
│
└── infra/
    ├── DEPLOYMENT.md                   # Ce document
    ├── scripts/
    │   ├── bootstrap.sh                # Setup initial du VPS
    │   └── deploy.sh                   # Redéploiement
    └── ansible/
        ├── inventory.ini               # Inventaire des serveurs
        ├── playbook.yml                # Playbook principal
        └── roles/
            ├── base/tasks/main.yml     # Paquets essentiels
            ├── users/tasks/main.yml    # Création user deploy
            ├── ssh/
            │   ├── tasks/main.yml      # Hardening SSH
            │   └── templates/hardening.conf.j2
            ├── ufw/tasks/main.yml      # Firewall
            ├── fail2ban/
            │   ├── tasks/main.yml      # Protection brute-force
            │   └── templates/jail.local.j2
            ├── upgrades/tasks/main.yml # Mises à jour auto
            └── docker/tasks/main.yml   # Installation Docker
```

---

## 4. Guide de Déploiement Pas à Pas

### Prérequis
- VPS Hostinger avec Ubuntu 22.04 ou 24.04
- Accès root SSH avec clé publique
- Nom de domaine pointé vers l'IP du VPS (A record)

### Option A : Script Bootstrap (rapide)

```bash
# 1. Se connecter en root au VPS
ssh root@<VPS_IP>

# 2. Cloner le repo
git clone https://github.com/lucaszub/sql-practice.git
cd sql-practice

# 3. Lancer le bootstrap (sécurise le VPS + installe Docker)
chmod +x infra/scripts/bootstrap.sh
sudo bash infra/scripts/bootstrap.sh

# 4. IMPORTANT: Tester la connexion SSH en tant que deploy AVANT de fermer la session
# Dans un AUTRE terminal :
ssh deploy@<VPS_IP>

# 5. Configurer le domaine
export DOMAIN=votredomaine.com
# Éditer le Caddyfile si besoin (ou utiliser la variable d'env)

# 6. Déployer
make deploy
```

### Option B : Ansible (reproductible)

```bash
# Depuis votre machine locale

# 1. Éditer l'inventaire
vi infra/ansible/inventory.ini
# Décommenter et renseigner l'IP du VPS

# 2. Lancer le playbook de hardening
cd infra/ansible
ansible-playbook -i inventory.ini playbook.yml

# 3. Se connecter au VPS en tant que deploy
ssh deploy@<VPS_IP>

# 4. Cloner et déployer
git clone https://github.com/lucaszub/sql-practice.git
cd sql-practice
export DOMAIN=votredomaine.com
make deploy
```

---

## 5. Checklist VPS Production-Ready

### Sécurité système
- [ ] Root SSH désactivé (`PermitRootLogin no`)
- [ ] Authentification par mot de passe désactivée (`PasswordAuthentication no`)
- [ ] Login par clé SSH uniquement (`PubkeyAuthentication yes`)
- [ ] Firewall UFW actif (ports 22, 80, 443 uniquement)
- [ ] fail2ban actif (ban SSH après 3 tentatives)
- [ ] Mises à jour de sécurité automatiques (unattended-upgrades)
- [ ] User `deploy` créé avec sudo sans mot de passe
- [ ] MaxAuthTries SSH limité à 3

### Déploiement applicatif
- [ ] Docker + Docker Compose installés
- [ ] User deploy dans le groupe docker
- [ ] Image Docker buildée (multi-stage, ~150MB)
- [ ] Container Next.js avec healthcheck
- [ ] Restart automatique (`unless-stopped`)
- [ ] Port 3000 non exposé publiquement (interne Docker uniquement)

### Domaine + HTTPS
- [ ] DNS A record pointé vers l'IP du VPS
- [ ] Caddy configuré avec le bon domaine
- [ ] HTTPS Let's Encrypt automatique
- [ ] Redirection HTTP → HTTPS automatique
- [ ] HTTP/3 (QUIC) activé
- [ ] Certificats auto-renouvelés (géré par Caddy)

### Headers de sécurité
- [ ] HSTS activé (max-age=2 ans, includeSubDomains, preload)
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: DENY
- [ ] Referrer-Policy: strict-origin-when-cross-origin
- [ ] Permissions-Policy (camera, micro, geo désactivés)
- [ ] Content-Security-Policy (adapté pour WASM + Workers)
- [ ] Compression gzip/zstd activée

---

## 6. Commandes Makefile

| Commande | Description |
|----------|-------------|
| `make help` | Affiche l'aide |
| `make bootstrap` | Setup initial du VPS (en root) |
| `make deploy` | Build + lancement |
| `make build` | Build de l'image Docker uniquement |
| `make up` | Démarrer les services |
| `make down` | Arrêter les services |
| `make logs` | Voir les logs en temps réel |
| `make logs-app` | Logs Next.js uniquement |
| `make restart` | Redémarrer |
| `make status` | État des services |
| `make clean` | Tout supprimer (containers, images, volumes) |
| `make update` | git pull + redéploiement |

---

## 7. Maintenance & Monitoring

### Vérifier l'état
```bash
# Status des containers
make status

# Logs en temps réel
make logs

# Vérifier le healthcheck
docker inspect --format='{{.State.Health.Status}}' sql-practice-nextjs-1
```

### Mise à jour de l'application
```bash
make update
# Équivalent à: git pull + make deploy
```

### Renouvellement des certificats
Caddy gère automatiquement le renouvellement Let's Encrypt. Aucune action requise.

### En cas de problème
```bash
# Voir les logs d'erreur
docker compose logs --tail=50 nextjs

# Redémarrer proprement
make down && make up

# Rebuild complet
make clean && make deploy
```

---

## 8. Sécurité Applicative Next.js

### Headers CSP (Content Security Policy)
La CSP configurée dans `next.config.ts` autorise :
- `script-src 'self' 'unsafe-eval' 'unsafe-inline' blob:` — nécessaire pour DuckDB-WASM Workers
- `connect-src 'self' https://cdn.jsdelivr.net blob:` — chargement des fichiers WASM DuckDB
- `worker-src 'self' blob:` — Web Workers pour DuckDB
- `wasm-src 'self' blob:` — exécution WebAssembly

### Pourquoi `unsafe-eval` est nécessaire
DuckDB-WASM utilise `eval()` pour l'initialisation des Workers. C'est un compromis acceptable car :
1. L'application n'a aucune entrée utilisateur envoyée au serveur
2. Tout le SQL s'exécute localement dans le navigateur
3. Il n'y a aucune API route exposée

### Audit npm
```bash
pnpm audit
```
À exécuter régulièrement. Aucune vulnérabilité connue identifiée dans les dépendances actuelles.
