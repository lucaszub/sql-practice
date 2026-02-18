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

DOMAIN="${DOMAIN:?Set DOMAIN env var (e.g. export DOMAIN=practicedata.com)}"

info "Pulling latest changes..."
git pull origin main

info "Building Docker image..."
DOMAIN="$DOMAIN" docker compose build --no-cache

info "Restarting services..."
DOMAIN="$DOMAIN" docker compose up -d

info "Waiting for health check..."
sleep 10

if docker compose ps | grep -q "healthy"; then
  info "Deployment successful! App is healthy."
else
  info "Checking service status..."
  docker compose ps
  docker compose logs --tail=20 nextjs
fi
