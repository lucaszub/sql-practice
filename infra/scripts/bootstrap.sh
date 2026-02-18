#!/usr/bin/env bash
# bootstrap.sh — First-time VPS setup script
# Run as root on a fresh Ubuntu 22.04/24.04 VPS
set -euo pipefail

# ---------- Colors ----------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ---------- Check root ----------
[[ $EUID -eq 0 ]] || error "This script must be run as root"

DEPLOY_USER="${DEPLOY_USER:-deploy}"
SSH_PORT="${SSH_PORT:-22}"

info "=== VPS Bootstrap Starting ==="

# ---------- 1. System update ----------
info "Updating system packages..."
apt-get update -qq && apt-get upgrade -y -qq

# ---------- 2. Install essentials ----------
info "Installing essential packages..."
apt-get install -y -qq \
  curl wget git unzip \
  ufw fail2ban \
  unattended-upgrades apt-listchanges \
  ca-certificates gnupg lsb-release

# ---------- 3. Create deploy user ----------
if id "$DEPLOY_USER" &>/dev/null; then
  info "User '$DEPLOY_USER' already exists"
else
  info "Creating user '$DEPLOY_USER'..."
  adduser --disabled-password --gecos "" "$DEPLOY_USER"
  usermod -aG sudo "$DEPLOY_USER"
  # Allow sudo without password for deploy user
  echo "$DEPLOY_USER ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/"$DEPLOY_USER"
  chmod 440 /etc/sudoers.d/"$DEPLOY_USER"
fi

# ---------- 4. Setup SSH keys ----------
info "Setting up SSH keys for '$DEPLOY_USER'..."
DEPLOY_HOME="/home/$DEPLOY_USER"
mkdir -p "$DEPLOY_HOME/.ssh"
chmod 700 "$DEPLOY_HOME/.ssh"

if [[ -f /root/.ssh/authorized_keys ]]; then
  cp /root/.ssh/authorized_keys "$DEPLOY_HOME/.ssh/authorized_keys"
  chmod 600 "$DEPLOY_HOME/.ssh/authorized_keys"
  chown -R "$DEPLOY_USER:$DEPLOY_USER" "$DEPLOY_HOME/.ssh"
  info "Copied SSH keys from root to '$DEPLOY_USER'"
else
  warn "No /root/.ssh/authorized_keys found. Add your public key manually:"
  warn "  echo 'ssh-ed25519 AAAA...' >> $DEPLOY_HOME/.ssh/authorized_keys"
fi

# ---------- 5. Harden SSH ----------
info "Hardening SSH configuration..."
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak

cat > /etc/ssh/sshd_config.d/hardening.conf <<'SSHEOF'
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
PermitEmptyPasswords no
X11Forwarding no
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
AllowAgentForwarding no
AllowTcpForwarding no
SSHEOF

systemctl restart sshd
info "SSH hardened: root login disabled, password auth disabled"

# ---------- 6. Configure UFW ----------
info "Configuring firewall (UFW)..."
ufw default deny incoming
ufw default allow outgoing
ufw allow "$SSH_PORT"/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw --force enable
info "UFW enabled: SSH($SSH_PORT), HTTP(80), HTTPS(443)"

# ---------- 7. Configure fail2ban ----------
info "Configuring fail2ban..."
cat > /etc/fail2ban/jail.local <<'F2BEOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5
banaction = ufw

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
F2BEOF

systemctl enable fail2ban
systemctl restart fail2ban
info "fail2ban configured and started"

# ---------- 8. Enable unattended upgrades ----------
info "Enabling automatic security updates..."
cat > /etc/apt/apt.conf.d/20auto-upgrades <<'UUEOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
UUEOF

dpkg-reconfigure -plow unattended-upgrades 2>/dev/null || true
info "Unattended upgrades enabled"

# ---------- 9. Install Docker ----------
info "Installing Docker..."
if command -v docker &>/dev/null; then
  info "Docker already installed: $(docker --version)"
else
  curl -fsSL https://get.docker.com | sh
  usermod -aG docker "$DEPLOY_USER"
  systemctl enable docker
  systemctl start docker
  info "Docker installed: $(docker --version)"
fi

# ---------- 10. Install Docker Compose plugin ----------
info "Verifying Docker Compose..."
if docker compose version &>/dev/null; then
  info "Docker Compose available: $(docker compose version)"
else
  warn "Docker Compose plugin not found. Install manually if needed."
fi

# ---------- Summary ----------
echo ""
info "=== Bootstrap Complete ==="
echo ""
echo "  Next steps:"
echo "  1. Test SSH login as '$DEPLOY_USER' from your local machine:"
echo "     ssh $DEPLOY_USER@<your-vps-ip>"
echo ""
echo "  2. Clone your repo and deploy:"
echo "     git clone <your-repo-url>"
echo "     cd sql-practice"
echo "     export DOMAIN=yourdomain.com"
echo "     make deploy"
echo ""
echo "  3. Point your DNS A record to this server's IP"
echo ""
warn "IMPORTANT: Test SSH as '$DEPLOY_USER' BEFORE closing this session!"
