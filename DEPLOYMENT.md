# TinyLink Deployment Guide

## 🚀 Quick Start Deployment

Choose one of these platforms for deployment. Each has free tier options.

---

## Option 1: Vercel (Recommended) ⭐

### Why Vercel?

- ✅ Best Next.js integration
- ✅ Auto-deployment from Git
- ✅ Free SSL certificates
- ✅ Edge network (fast globally)
- ✅ Easy environment variable management

### Step-by-Step Deployment

#### 1. Prerequisites

- GitHub, GitLab, or Bitbucket account
- Neon PostgreSQL database (free tier available)

#### 2. Set Up Neon Database

1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project:
   - Project name: `tinylink`
   - Region: Choose closest to your users
3. Copy the connection string from the dashboard
4. Run the migration:
   ```bash
   # Locally, update .env with Neon credentials
   npm run db:migrate
   ```

#### 3. Push Code to Git

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: TinyLink URL shortener"

# Add remote (create repo on GitHub first)
git remote add origin https://github.com/yourusername/tinylink.git

# Push
git push -u origin main
```

#### 4. Deploy to Vercel

**Option A: Using Vercel Dashboard (Easiest)**

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "Add New Project"
3. Import your Git repository
4. Configure:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
5. Add Environment Variables:
   - Click "Environment Variables"
   - Add each variable from `.env.example`:
     ```
     POSTGRES_URL=postgresql://...
     POSTGRES_PRISMA_URL=postgresql://...
     POSTGRES_URL_NON_POOLING=postgresql://...
     POSTGRES_USER=your-user
     POSTGRES_HOST=your-host.neon.tech
     POSTGRES_PASSWORD=your-password
     POSTGRES_DATABASE=your-database
     ```
6. Click "Deploy"
7. Wait 2-3 minutes for deployment

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Link to existing project? No
# - Project name? tinylink
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add POSTGRES_URL production
# Paste your connection string when prompted

# Repeat for all environment variables

# Deploy to production
vercel --prod
```

#### 5. Post-Deployment

1. Visit your deployed URL (e.g., `tinylink.vercel.app`)
2. Test link creation
3. Test redirect functionality
4. Check `/api/healthz` endpoint

#### 6. Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" > "Domains"
3. Add your domain
4. Update DNS records as instructed
5. Wait for SSL certificate (automatic)

---

## Option 2: Railway 🚂

### Why Railway?

- ✅ Includes database hosting
- ✅ Simple deployment
- ✅ Good free tier
- ✅ Built-in monitoring

### Step-by-Step Deployment

#### 1. Set Up Railway

1. Go to [railway.app](https://railway.app) and sign up
2. Create a new project
3. Click "Deploy from GitHub repo"
4. Select your repository

#### 2. Add PostgreSQL

1. Click "New" > "Database" > "PostgreSQL"
2. Wait for database to provision
3. Click on PostgreSQL service
4. Copy connection string variables

#### 3. Configure Environment

1. Click on your web service
2. Go to "Variables" tab
3. Add environment variables:
   ```
   POSTGRES_URL=${{Postgres.DATABASE_URL}}
   POSTGRES_PRISMA_URL=${{Postgres.DATABASE_URL}}
   POSTGRES_URL_NON_POOLING=${{Postgres.DATABASE_URL}}
   POSTGRES_USER=${{Postgres.PGUSER}}
   POSTGRES_HOST=${{Postgres.PGHOST}}
   POSTGRES_PASSWORD=${{Postgres.PGPASSWORD}}
   POSTGRES_DATABASE=${{Postgres.PGDATABASE}}
   ```

#### 4. Deploy

1. Railway auto-deploys on git push
2. Click "Deploy" to trigger manual deployment
3. Wait for build to complete

#### 5. Run Migration

1. In Railway dashboard, click your service
2. Go to "Settings" > "Deployments"
3. Click "New Deployment"
4. Or run locally:

   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login
   railway login

   # Link project
   railway link

   # Run migration
   railway run npm run db:migrate
   ```

#### 6. Get URL

1. Go to "Settings" tab
2. Under "Domains", click "Generate Domain"
3. Visit your Railway URL

---

## Option 3: Render 🎨

### Why Render?

- ✅ Free PostgreSQL database
- ✅ Auto-deploy from Git
- ✅ Free SSL
- ✅ Good documentation

### Step-by-Step Deployment

#### 1. Set Up Render

1. Go to [render.com](https://render.com) and sign up
2. Connect your GitHub account

#### 2. Create PostgreSQL Database

1. Click "New +" > "PostgreSQL"
2. Name: `tinylink-db`
3. Choose free tier
4. Click "Create Database"
5. Copy "Internal Database URL"

#### 3. Run Migration

```bash
# Connect to Render database locally
psql <your-render-db-url>

# Or run migration script locally with Render DB URL in .env
npm run db:migrate
```

#### 4. Create Web Service

1. Click "New +" > "Web Service"
2. Connect your repository
3. Configure:
   - Name: `tinylink`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

#### 5. Add Environment Variables

1. Scroll to "Environment Variables"
2. Add variables:
   ```
   POSTGRES_URL=<your-render-db-url>
   POSTGRES_PRISMA_URL=<your-render-db-url>
   POSTGRES_URL_NON_POOLING=<your-render-db-url>
   POSTGRES_USER=<from-db-page>
   POSTGRES_HOST=<from-db-page>
   POSTGRES_PASSWORD=<from-db-page>
   POSTGRES_DATABASE=<from-db-page>
   NODE_ENV=production
   ```

#### 6. Deploy

1. Click "Create Web Service"
2. Wait for build (5-10 minutes)
3. Visit your Render URL (e.g., `tinylink.onrender.com`)

---

## Option 4: Self-Hosted (VPS) 🖥️

### Requirements

- Ubuntu/Debian VPS (DigitalOcean, Linode, AWS EC2, etc.)
- Domain name (optional)
- SSH access

### Step-by-Step Deployment

#### 1. Set Up Server

```bash
# SSH into server
ssh user@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2
```

#### 2. Set Up PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE tinylink;
CREATE USER tinylink_user WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE tinylink TO tinylink_user;
\q
```

#### 3. Deploy Application

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/yourusername/tinylink.git
cd tinylink

# Install dependencies
sudo npm install

# Create .env file
sudo nano .env
# Add your environment variables

# Run migration
sudo npm run db:migrate

# Build application
sudo npm run build

# Start with PM2
sudo pm2 start npm --name "tinylink" -- start
sudo pm2 startup
sudo pm2 save
```

#### 4. Configure Nginx

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/tinylink

# Add configuration:
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/tinylink /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. Set Up SSL (Optional but Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## Post-Deployment Checklist ✅

After deploying to any platform:

- [ ] Test health check: `https://your-url.com/api/healthz`
- [ ] Create a test link via UI
- [ ] Test redirect functionality
- [ ] Verify click tracking works
- [ ] Test delete functionality
- [ ] Check stats page
- [ ] Test on mobile device
- [ ] Monitor error logs
- [ ] Set up uptime monitoring
- [ ] Add custom domain (optional)
- [ ] Configure analytics (optional)

---

## Monitoring & Maintenance 📊

### Vercel

- Dashboard: Built-in analytics and logs
- Logs: `vercel logs`
- Monitoring: Automatic

### Railway

- Dashboard: Metrics and logs tab
- Logs: Real-time in dashboard
- Alerts: Configure in settings

### Render

- Dashboard: Metrics tab
- Logs: Logs tab in service
- Health checks: Automatic

### Self-Hosted

```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs tinylink

# Check status
pm2 status

# Restart if needed
pm2 restart tinylink
```

---

## Troubleshooting Common Issues 🔧

### "Database connection failed"

1. Check environment variables are set correctly
2. Verify database is running
3. Test connection string locally
4. Check firewall/security groups

### "Build failed"

1. Check Node.js version (18+)
2. Clear cache and rebuild
3. Check for missing dependencies
4. Review build logs

### "Redirect not working"

1. Verify link exists in database
2. Check code format (6-8 alphanumeric)
3. Review server logs
4. Test API endpoint directly

### "High latency"

1. Check database region (should be close to app)
2. Enable connection pooling
3. Add Redis cache (advanced)
4. Use CDN for static assets

---

## Performance Optimization 🚀

### Database

- Create indexes (already in schema)
- Use connection pooling
- Regular VACUUM on PostgreSQL

### Application

- Enable Next.js caching
- Use ISR for stats pages
- Implement rate limiting

### Infrastructure

- Use CDN (automatic on Vercel)
- Enable compression
- Monitor and scale as needed

---

## Cost Estimates 💰

### Free Tier Limits

| Platform      | Hosting      | Database     | Bandwidth | Custom Domain |
| ------------- | ------------ | ------------ | --------- | ------------- |
| Vercel + Neon | Free         | 0.5GB        | 100GB/mo  | Yes           |
| Railway       | $5/mo credit | Included     | 100GB/mo  | Yes           |
| Render        | Free         | 90 days free | 100GB/mo  | Yes           |

### Scaling Costs (Monthly)

| Users/Day      | Vercel + Neon | Railway          | Render |
| -------------- | ------------- | ---------------- | ------ |
| < 1,000        | Free          | Free ($5 credit) | Free   |
| 1,000-10,000   | $20           | $10              | $7     |
| 10,000-100,000 | $20           | $20              | $25    |

---

## Security Recommendations 🔒

1. **Environment Variables**: Never commit `.env`
2. **Database**: Use strong passwords
3. **SSL**: Always use HTTPS
4. **Rate Limiting**: Add if needed
5. **Monitoring**: Set up error tracking
6. **Backups**: Enable database backups
7. **Updates**: Keep dependencies updated

---

## Support & Resources 📚

- [Next.js Documentation](https://nextjs.org/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)

---

Good luck with your deployment! 🎉
