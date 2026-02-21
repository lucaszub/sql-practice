#!/usr/bin/env bash
# deploy.sh — Pull latest changes and redeploy
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# Ensure we're in the project directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$PROJECT_DIR"

DOMAIN="${DOMAIN:-datapratice.lzubdev.com}"
DEPLOY_START=$(date +%s)

# Load telegram secrets if available (for notifications)
SECRETS_FILE="${HOME}/.config/secrets/telegram.env"
if [ -f "$SECRETS_FILE" ]; then
    set -a; source "$SECRETS_FILE"; set +a
fi

tg_notify() {
    local msg="$1"
    if [ -n "${TELEGRAM_BOT_TOKEN:-}" ] && [ -n "${ALLOWED_USER_ID:-}" ]; then
        curl -s -X POST \
            "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
            -d "chat_id=${ALLOWED_USER_ID}" \
            -d "text=${msg}" \
            -d "parse_mode=Markdown" > /dev/null 2>&1 || true
    fi
}

tg_notify "🚀 *sql-practice* — Deploy started..."

info "Pulling latest changes..."
git pull origin main

info "Building Docker image..."
DOMAIN="$DOMAIN" docker compose build --no-cache

info "Restarting services..."
DOMAIN="$DOMAIN" docker compose up -d

info "Waiting for health check..."
sleep 10

DEPLOY_END=$(date +%s)
ELAPSED=$((DEPLOY_END - DEPLOY_START))

if docker compose ps | grep -q "healthy"; then
    info "Deployment successful! App is healthy. (${ELAPSED}s)"
    tg_notify "✅ *sql-practice* deployed in ${ELAPSED}s — https://${DOMAIN}"
else
    info "Checking service status..."
    docker compose ps
    docker compose logs --tail=20 nextjs
    tg_notify "⚠️ *sql-practice* deploy done in ${ELAPSED}s — health check inconclusive. Check \`/logs\`"
fi
