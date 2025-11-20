#!/bin/bash

# HabitHub Deployment Script
# This script deploys the HabitHub application on Ubuntu VPS

set -e  # Exit on any error

echo "🚀 Starting HabitHub Deployment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/var/www/habithub"
DOMAIN="YOUR_DOMAIN"  # Replace with your actual domain
USER="habithub"  # Application user

echo -e "${BLUE}Step 1: Checking system requirements...${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Please run as root (use sudo)${NC}"
  exit 1
fi

echo -e "${BLUE}Step 2: Installing system dependencies...${NC}"

# Update system
apt update && apt upgrade -y

# Install Node.js 20.x
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi

# Install required packages
apt install -y nginx postgresql-client git ufw certbot

# Install PM2 globally
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi

echo -e "${GREEN}✓ System dependencies installed${NC}"

echo -e "${BLUE}Step 3: Creating application user...${NC}"

# Create application user if doesn't exist
if ! id "$USER" &>/dev/null; then
    useradd -r -s /bin/bash -d /home/$USER -m $USER
    echo -e "${GREEN}✓ User $USER created${NC}"
else
    echo -e "${GREEN}✓ User $USER already exists${NC}"
fi

echo -e "${BLUE}Step 4: Setting up application directory...${NC}"

# Create app directory
mkdir -p $APP_DIR
mkdir -p $APP_DIR/logs
mkdir -p /etc/ssl/cloudflare

# Copy application files
echo "Copying application files..."
cp -r $(pwd)/* $APP_DIR/ 2>/dev/null || :

# Set permissions
chown -R $USER:$USER $APP_DIR
chmod -R 755 $APP_DIR

echo -e "${GREEN}✓ Application directory set up${NC}"

echo -e "${BLUE}Step 5: Configuring environment variables...${NC}"

# Check if .env exists
if [ ! -f "$APP_DIR/.env" ]; then
    if [ -f "$APP_DIR/.env.example" ]; then
        cp $APP_DIR/.env.example $APP_DIR/.env
        echo -e "${RED}⚠️  .env file created from .env.example${NC}"
        echo -e "${RED}⚠️  IMPORTANT: Edit $APP_DIR/.env with your actual values!${NC}"
        echo -e "${RED}⚠️  Required: DATABASE_URL, SESSION_SECRET${NC}"
    else
        echo -e "${RED}ERROR: .env.example not found!${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

echo -e "${BLUE}Step 6: Installing Node dependencies...${NC}"

# Install dependencies as app user
cd $APP_DIR
sudo -u $USER npm ci --omit=dev

echo -e "${GREEN}✓ Dependencies installed${NC}"

echo -e "${BLUE}Step 7: Building application...${NC}"

# Build the application
sudo -u $USER npm run build

echo -e "${GREEN}✓ Application built${NC}"

echo -e "${BLUE}Step 8: Setting up database...${NC}"

# Run database migrations
echo "Pushing database schema..."
sudo -u $USER npm run db:push

echo -e "${GREEN}✓ Database schema pushed${NC}"

echo -e "${BLUE}Step 9: Configuring Nginx...${NC}"

# Backup existing nginx config if exists
if [ -f /etc/nginx/sites-available/habithub ]; then
    cp /etc/nginx/sites-available/habithub /etc/nginx/sites-available/habithub.backup
fi

# Copy nginx config
cp $APP_DIR/nginx.conf /etc/nginx/sites-available/habithub

# Replace domain placeholder
sed -i "s/YOUR_DOMAIN/$DOMAIN/g" /etc/nginx/sites-available/habithub

# Enable site
ln -sf /etc/nginx/sites-available/habithub /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx config
nginx -t

echo -e "${GREEN}✓ Nginx configured${NC}"

echo -e "${BLUE}Step 10: Configuring firewall...${NC}"

# Configure UFW
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp  # SSH
ufw allow 80/tcp  # HTTP
ufw allow 443/tcp # HTTPS

echo -e "${GREEN}✓ Firewall configured${NC}"

echo -e "${BLUE}Step 11: Setting up PM2...${NC}"

# Stop existing PM2 process if running
sudo -u $USER pm2 stop habithub 2>/dev/null || true
sudo -u $USER pm2 delete habithub 2>/dev/null || true

# Start application with PM2
cd $APP_DIR
sudo -u $USER pm2 start ecosystem.config.js

# Setup PM2 startup script
pm2 startup systemd -u $USER --hp /home/$USER
sudo -u $USER pm2 save

echo -e "${GREEN}✓ PM2 configured and application started${NC}"

echo -e "${BLUE}Step 12: Restarting services...${NC}"

# Restart Nginx
systemctl restart nginx
systemctl enable nginx

echo -e "${GREEN}✓ Services restarted${NC}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo ""
echo "1. Edit environment variables:"
echo "   sudo nano $APP_DIR/.env"
echo ""
echo "2. Set up Cloudflare SSL certificate:"
echo "   - Go to Cloudflare Dashboard → SSL/TLS → Origin Server"
echo "   - Create a new certificate"
echo "   - Save the certificate to: /etc/ssl/cloudflare/cert.pem"
echo "   - Save the private key to: /etc/ssl/cloudflare/key.pem"
echo ""
echo "3. Set proper permissions for SSL files:"
echo "   sudo chmod 600 /etc/ssl/cloudflare/key.pem"
echo "   sudo chmod 644 /etc/ssl/cloudflare/cert.pem"
echo ""
echo "4. Restart services:"
echo "   sudo systemctl restart nginx"
echo "   sudo -u $USER pm2 restart habithub"
echo ""
echo "5. Check application status:"
echo "   sudo -u $USER pm2 status"
echo "   sudo -u $USER pm2 logs habithub"
echo ""
echo "6. View logs:"
echo "   sudo tail -f $APP_DIR/logs/pm2-error.log"
echo "   sudo tail -f /var/log/nginx/habithub_error.log"
echo ""
echo -e "${BLUE}Your application should be accessible at:${NC}"
echo -e "${GREEN}https://$DOMAIN${NC}"
echo ""
