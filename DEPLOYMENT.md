# HabitHub VPS Deployment Guide

This guide will help you deploy HabitHub on your Ubuntu VPS with Nginx, PostgreSQL, and Cloudflare SSL.

## Prerequisites

- Ubuntu 20.04+ VPS with root access
- Domain name pointed to your VPS IP
- Cloudflare account (for SSL certificate)
- PostgreSQL database (can use Neon, Supabase, or local PostgreSQL)

## Quick Start

### 1. Prepare Your VPS

SSH into your VPS:
```bash
ssh root@your-vps-ip
```

### 2. Clone Your Repository

```bash
cd /tmp
git clone https://github.com/yourusername/HabitHub.git
cd HabitHub
```

Or upload files via SCP:
```bash
# From your local machine
scp -r /path/to/HabitHub root@your-vps-ip:/tmp/
```

### 3. Configure Environment Variables

Before deployment, edit the `.env.example` file:
```bash
nano .env.example
```

Update these critical values:
- `DATABASE_URL`: Your PostgreSQL connection string
- `SESSION_SECRET`: Generate with `openssl rand -base64 32`
- Change `YOUR_DOMAIN` in `nginx.conf` and `deploy.sh`

### 4. Run Deployment Script

Make the script executable and run it:
```bash
chmod +x deploy.sh
sudo ./deploy.sh
```

The script will:
- Install Node.js, Nginx, PM2
- Create application user
- Copy files to `/var/www/habithub`
- Install dependencies
- Build the application
- Set up database schema
- Configure Nginx
- Start the application with PM2
- Configure firewall

### 5. Set Up Cloudflare SSL

#### A. Create Origin Certificate in Cloudflare

1. Log in to Cloudflare Dashboard
2. Select your domain
3. Go to **SSL/TLS** → **Origin Server**
4. Click **Create Certificate**
5. Leave defaults and click **Create**
6. Copy the **Origin Certificate** and **Private Key**

#### B. Install Certificate on VPS

```bash
# Create SSL directory
sudo mkdir -p /etc/ssl/cloudflare

# Create certificate file
sudo nano /etc/ssl/cloudflare/cert.pem
# Paste the Origin Certificate

# Create private key file
sudo nano /etc/ssl/cloudflare/key.pem
# Paste the Private Key

# Set permissions
sudo chmod 600 /etc/ssl/cloudflare/key.pem
sudo chmod 644 /etc/ssl/cloudflare/cert.pem
```

#### C. Configure Cloudflare DNS

1. Go to **DNS** settings in Cloudflare
2. Ensure you have an A record pointing to your VPS IP:
   - Type: `A`
   - Name: `@` (or your subdomain)
   - Content: Your VPS IP
   - Proxy status: **Proxied** (orange cloud)

3. Optionally add www subdomain:
   - Type: `CNAME`
   - Name: `www`
   - Content: `yourdomain.com`
   - Proxy status: **Proxied**

#### D. Configure Cloudflare SSL Settings

1. Go to **SSL/TLS** → **Overview**
2. Set encryption mode to **Full (strict)**
3. Go to **SSL/TLS** → **Edge Certificates**
4. Enable:
   - Always Use HTTPS
   - Automatic HTTPS Rewrites
   - Minimum TLS Version: 1.2

### 6. Restart Services

```bash
sudo systemctl restart nginx
sudo -u habithub pm2 restart habithub
```

### 7. Verify Deployment

Check if the application is running:
```bash
sudo -u habithub pm2 status
sudo -u habithub pm2 logs habithub
```

Check Nginx status:
```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/habithub_error.log
```

Visit your domain: `https://yourdomain.com`

## Database Setup Options

### Option 1: Neon (Recommended - Serverless PostgreSQL)

1. Go to [neon.tech](https://neon.tech)
2. Create a free account
3. Create a new project
4. Copy the connection string
5. Add to `.env` as `DATABASE_URL`

### Option 2: Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (URI format)
5. Add to `.env` as `DATABASE_URL`

### Option 3: Local PostgreSQL

```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
postgres=# CREATE DATABASE habithub;
postgres=# CREATE USER habithub WITH ENCRYPTED PASSWORD 'your_password';
postgres=# GRANT ALL PRIVILEGES ON DATABASE habithub TO habithub;
postgres=# \q

# Connection string format:
# DATABASE_URL=postgresql://habithub:your_password@localhost:5432/habithub
```

## Post-Deployment

### Managing the Application

Start/Stop/Restart:
```bash
sudo -u habithub pm2 start habithub
sudo -u habithub pm2 stop habithub
sudo -u habithub pm2 restart habithub
```

View logs:
```bash
sudo -u habithub pm2 logs habithub
sudo -u habithub pm2 logs habithub --lines 100
```

Monitor resources:
```bash
sudo -u habithub pm2 monit
```

### Updating the Application

```bash
cd /var/www/habithub

# Pull latest changes
sudo -u habithub git pull

# Install dependencies
sudo -u habithub npm ci --omit=dev

# Build
sudo -u habithub npm run build

# Push database changes (if schema changed)
sudo -u habithub npm run db:push

# Restart
sudo -u habithub pm2 restart habithub
```

### Database Migrations

To update the database schema after making changes:
```bash
cd /var/www/habithub
sudo -u habithub npm run db:push
```

### Backup Database

If using local PostgreSQL:
```bash
# Backup
sudo -u postgres pg_dump habithub > backup.sql

# Restore
sudo -u postgres psql habithub < backup.sql
```

### SSL Certificate Renewal

Cloudflare Origin Certificates are valid for 15 years, so no renewal needed. However, if you need to renew:

1. Generate new certificate in Cloudflare Dashboard
2. Replace files in `/etc/ssl/cloudflare/`
3. Restart Nginx: `sudo systemctl restart nginx`

## Troubleshooting

### Application won't start

1. Check logs:
   ```bash
   sudo -u habithub pm2 logs habithub --err
   ```

2. Check environment variables:
   ```bash
   cat /var/www/habithub/.env
   ```

3. Ensure database is accessible:
   ```bash
   # Test connection (replace with your DATABASE_URL)
   psql "postgresql://user:pass@host:5432/dbname"
   ```

### Nginx errors

1. Test configuration:
   ```bash
   sudo nginx -t
   ```

2. Check error logs:
   ```bash
   sudo tail -f /var/log/nginx/habithub_error.log
   ```

3. Verify SSL certificates exist:
   ```bash
   ls -la /etc/ssl/cloudflare/
   ```

### Database connection issues

1. Check if DATABASE_URL is set:
   ```bash
   grep DATABASE_URL /var/www/habithub/.env
   ```

2. Test connection:
   ```bash
   cd /var/www/habithub
   sudo -u habithub node -e "const { Pool } = require('@neondatabase/serverless'); const pool = new Pool({ connectionString: process.env.DATABASE_URL }); pool.query('SELECT NOW()').then(r => console.log('Connected:', r.rows[0])).catch(e => console.error('Error:', e));"
   ```

### Port already in use

If port 5000 is already in use:
```bash
# Find process using port 5000
sudo lsof -i :5000

# Kill the process
sudo kill -9 <PID>

# Or change PORT in .env and ecosystem.config.js
```

### Permission issues

```bash
# Reset permissions
sudo chown -R habithub:habithub /var/www/habithub
sudo chmod -R 755 /var/www/habithub
```

## Security Checklist

- [ ] Strong SESSION_SECRET is set
- [ ] Database uses strong password
- [ ] Firewall is enabled (UFW)
- [ ] Only necessary ports are open (22, 80, 443)
- [ ] Cloudflare proxy is enabled
- [ ] SSL is configured correctly
- [ ] Regular backups are scheduled
- [ ] Application runs as non-root user
- [ ] Environment variables are not committed to git

## Monitoring

### Setup PM2 Monitoring (Optional)

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### System Monitoring

Monitor server resources:
```bash
# CPU and Memory
htop

# Disk usage
df -h

# Application logs
sudo -u habithub pm2 logs

# Nginx access logs
sudo tail -f /var/log/nginx/habithub_access.log
```

## Maintenance

### Regular Tasks

1. **Keep system updated**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Monitor logs for errors**:
   ```bash
   sudo -u habithub pm2 logs habithub --err
   ```

3. **Check disk space**:
   ```bash
   df -h
   ```

4. **Backup database regularly**

5. **Review Nginx logs**:
   ```bash
   sudo tail -f /var/log/nginx/habithub_access.log
   ```

## Support

For issues or questions:
- Check application logs: `sudo -u habithub pm2 logs habithub`
- Check Nginx logs: `/var/log/nginx/habithub_error.log`
- Review this deployment guide
- Check the GitHub repository issues

## Production Optimizations

### Enable Log Rotation

```bash
sudo nano /etc/logrotate.d/habithub
```

Add:
```
/var/www/habithub/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 habithub habithub
    sharedscripts
}
```

### Set up Monitoring Alerts

Consider setting up:
- Uptime monitoring (UptimeRobot, Pingdom)
- Error tracking (Sentry)
- Performance monitoring (New Relic, Datadog)

### Optimize Database

For high traffic, consider:
- Connection pooling (already implemented)
- Database indexes (already added)
- Query optimization
- Read replicas

---

**Congratulations!** Your HabitHub application should now be deployed and running securely on your VPS with Cloudflare SSL.
