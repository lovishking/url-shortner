# 🚀 TinyLink Quick Start Guide

Get your URL shortener running in 5 minutes!

## Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm
- A Neon PostgreSQL account (free tier works!)

## Step 1: Install Dependencies

```bash
cd "link shortner"
npm install
```

## Step 2: Set Up Database

### Get Neon Database (Free)

1. Go to https://neon.tech and sign up
2. Click "Create Project"
3. Choose a region close to you
4. Copy the connection string

### Configure Environment

```bash
# Copy the example file
cp .env.example .env

# Edit .env and paste your Neon connection details
# You'll get these from your Neon dashboard
```

Your `.env` should look like:

```env
POSTGRES_URL="postgresql://user:pass@host.region.neon.tech/db?sslmode=require"
POSTGRES_PRISMA_URL="postgresql://user:pass@host.region.neon.tech/db?sslmode=require&pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgresql://user:pass@host.region.neon.tech/db?sslmode=require"
POSTGRES_USER="user"
POSTGRES_HOST="host.region.neon.tech"
POSTGRES_PASSWORD="password"
POSTGRES_DATABASE="database"
```

### Run Migration

```bash
npm run db:migrate
```

You should see:

```
✅ Table "links" created
✅ Indexes created
Migration completed successfully!
```

## Step 3: Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser!

## Step 4: Test It Out

1. **Create a short link:**

   - Enter a URL (e.g., `https://github.com`)
   - Optionally add a custom code (e.g., `github`)
   - Click "Shorten URL"

2. **Test the redirect:**

   - Copy the short URL
   - Open it in a new tab
   - You should be redirected!

3. **View stats:**

   - Click the short code in the table
   - See detailed analytics

4. **Delete a link:**
   - Click "Delete" on any link
   - Confirm deletion
   - Try accessing the code (should 404)

## Step 5: Deploy (Optional)

### Fastest: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables when prompted
# Deploy to production
vercel --prod
```

See `DEPLOYMENT.md` for detailed deployment guides!

## Common Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Production
npm run build        # Build for production
npm start            # Start production server

# Database
npm run db:migrate   # Run database migration

# Code Quality
npm run lint         # Run ESLint
```

## Troubleshooting

### "Database connection failed"

- Check your `.env` file exists
- Verify connection string is correct
- Make sure Neon database is not paused (free tier auto-pauses)

### "Migration failed"

- Double-check all environment variables
- Try connecting to Neon dashboard
- Check network/firewall settings

### Port 3000 already in use

```bash
# Use a different port
PORT=3001 npm run dev
```

### Build errors

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

## What's Next?

✅ **Customize the UI**: Edit `app/page.tsx` and `app/globals.css`  
✅ **Add features**: See optional improvements in `README.md`  
✅ **Deploy**: Follow `DEPLOYMENT.md` for production  
✅ **Test**: Use `TESTING.md` for comprehensive testing  
✅ **Monitor**: Set up analytics and error tracking

## File Structure

```
link shortner/
├── app/              # Pages and API routes
├── lib/              # Business logic
├── scripts/          # Database migration
├── .env              # Your secrets (don't commit!)
└── package.json      # Dependencies
```

## Need Help?

- 📖 Read `README.md` for full documentation
- 🚀 Check `DEPLOYMENT.md` for deployment help
- 🧪 See `TESTING.md` for testing guide
- 📁 View `PROJECT_STRUCTURE.md` for architecture

---

## Quick Reference

### API Endpoints

- `GET /api/healthz` - Health check
- `POST /api/links` - Create link
- `GET /api/links` - Get all links
- `GET /api/links/:code` - Get specific link
- `DELETE /api/links/:code` - Delete link
- `GET /:code` - Redirect to long URL

### Pages

- `/` - Dashboard
- `/code/:code` - Stats page
- `/:code` - Redirect (not a page)

### Database

- Table: `links`
- Fields: `id`, `code`, `long_url`, `created_at`, `total_clicks`, `last_clicked`

---

Happy link shortening! 🎉
