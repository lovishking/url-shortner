# TinyLink - URL Shortener

A modern, full-featured URL shortener built with Next.js 14, PostgreSQL (Neon), and Tailwind CSS.

## 🚀 Features

- ✨ **Short Link Creation** - Convert long URLs into short, shareable links
- 🎯 **Custom Short Codes** - Option to use custom codes (6-8 alphanumeric characters)
- 📊 **Click Tracking** - Track total clicks and last clicked timestamp
- 📈 **Analytics Dashboard** - View detailed statistics for each link
- 🗑️ **Link Management** - Delete links with automatic 404 handling
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- ⚡ **Fast Redirects** - 302 redirects with click tracking
- 🔒 **Input Validation** - Comprehensive URL and code validation
- 💾 **PostgreSQL Database** - Reliable data storage with Neon

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database (Neon recommended)
- Vercel account (for deployment)

## 🛠️ Installation

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd link shortner
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Neon PostgreSQL credentials:

   ```env
   POSTGRES_URL="postgresql://user:password@host.region.neon.tech/database?sslmode=require"
   POSTGRES_PRISMA_URL="postgresql://user:password@host.region.neon.tech/database?sslmode=require&pgbouncer=true"
   POSTGRES_URL_NON_POOLING="postgresql://user:password@host.region.neon.tech/database?sslmode=require"
   POSTGRES_USER="user"
   POSTGRES_HOST="host.region.neon.tech"
   POSTGRES_PASSWORD="password"
   POSTGRES_DATABASE="database"
   ```

4. **Run database migration:**

   ```bash
   npm run db:migrate
   ```

5. **Start the development server:**

   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup (Neon)

1. **Create a Neon account:**

   - Go to [neon.tech](https://neon.tech)
   - Sign up for a free account

2. **Create a new project:**

   - Click "New Project"
   - Choose a region close to your users
   - Copy the connection string

3. **Run the migration:**
   - Update `.env` with your connection string
   - Run `npm run db:migrate`

## 📁 Project Structure

```
link shortner/
├── app/
│   ├── api/
│   │   ├── healthz/
│   │   │   └── route.ts          # Health check endpoint
│   │   └── links/
│   │       ├── route.ts           # GET all links, POST new link
│   │       └── [code]/
│   │           └── route.ts       # GET/DELETE specific link
│   ├── code/
│   │   └── [code]/
│   │       └── page.tsx           # Stats page for individual link
│   ├── [code]/
│   │   └── route.ts               # Redirect route (/:code)
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Dashboard page
│   └── globals.css                # Global styles
├── lib/
│   ├── db/
│   │   └── schema.ts              # Database schema definition
│   ├── services/
│   │   └── linkService.ts         # Link CRUD operations
│   └── utils/
│       └── validation.ts          # Validation utilities
├── scripts/
│   └── migrate.js                 # Database migration script
├── db/
│   └── schema.sql                 # SQL schema file
├── .env.example                   # Environment variables template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🔌 API Endpoints

### Health Check

```
GET /api/healthz
Response: { "ok": true, "version": "1.0" }
```

### Create Link

```
POST /api/links
Body: {
  "longUrl": "https://example.com/very-long-url",
  "customCode": "abc123" // optional
}
Response: {
  "id": 1,
  "code": "abc123",
  "long_url": "https://example.com/very-long-url",
  "created_at": "2025-11-18T...",
  "total_clicks": 0,
  "last_clicked": null
}
Status Codes:
- 201: Created successfully
- 400: Invalid URL or code format
- 409: Custom code already exists
```

### Get All Links

```
GET /api/links
Response: [
  {
    "id": 1,
    "code": "abc123",
    "long_url": "https://example.com/...",
    "created_at": "2025-11-18T...",
    "total_clicks": 5,
    "last_clicked": "2025-11-18T..."
  }
]
```

### Get Link by Code

```
GET /api/links/:code
Response: {
  "id": 1,
  "code": "abc123",
  "long_url": "https://example.com/...",
  "created_at": "2025-11-18T...",
  "total_clicks": 5,
  "last_clicked": "2025-11-18T..."
}
Status Codes:
- 200: Success
- 404: Link not found
```

### Delete Link

```
DELETE /api/links/:code
Response: { "success": true }
Status Codes:
- 200: Deleted successfully
- 404: Link not found
```

### Redirect

```
GET /:code
Response: 302 Redirect to long URL
Status Codes:
- 302: Redirect successful
- 404: Link not found
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI:**

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**

   ```bash
   vercel login
   ```

3. **Deploy:**

   ```bash
   vercel
   ```

4. **Set environment variables:**

   - Go to your project on Vercel dashboard
   - Navigate to Settings > Environment Variables
   - Add all variables from `.env`

5. **Deploy to production:**
   ```bash
   vercel --prod
   ```

### Railway

1. **Install Railway CLI:**

   ```bash
   npm install -g @railway/cli
   ```

2. **Login:**

   ```bash
   railway login
   ```

3. **Initialize project:**

   ```bash
   railway init
   ```

4. **Add environment variables:**

   ```bash
   railway variables set POSTGRES_URL="your-connection-string"
   ```

5. **Deploy:**
   ```bash
   railway up
   ```

### Render

1. **Create a new Web Service:**

   - Go to [render.com](https://render.com)
   - Click "New +" > "Web Service"
   - Connect your repository

2. **Configure:**

   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

3. **Add environment variables:**

   - Add all variables from `.env` in the dashboard

4. **Deploy:**
   - Click "Create Web Service"

## 🧪 Testing Plan

### Manual Testing Checklist

#### 1. Link Creation

- [ ] Create link with valid URL (auto-generated code)
- [ ] Create link with custom code (6 characters)
- [ ] Create link with custom code (8 characters)
- [ ] Try invalid URL format (should show error)
- [ ] Try invalid custom code (less than 6 chars)
- [ ] Try invalid custom code (more than 8 chars)
- [ ] Try invalid custom code (special characters)
- [ ] Try duplicate custom code (should return 409)

#### 2. Link Display

- [ ] Verify all links show in dashboard table
- [ ] Check long URL truncation with ellipsis
- [ ] Verify click count displays correctly
- [ ] Check "Never" displays for never-clicked links
- [ ] Verify date formatting is readable

#### 3. Copy Functionality

- [ ] Click copy button
- [ ] Verify "Copied!" feedback appears
- [ ] Paste and verify correct URL copied

#### 4. Link Redirection

- [ ] Click short link
- [ ] Verify 302 redirect to long URL
- [ ] Refresh dashboard and verify click count increased
- [ ] Verify last_clicked timestamp updated
- [ ] Try non-existent code (should show 404)

#### 5. Stats Page

- [ ] Navigate to stats page from dashboard
- [ ] Verify all details display correctly
- [ ] Test copy button on stats page
- [ ] Click "Test Link" button
- [ ] Return to dashboard using back button

#### 6. Link Deletion

- [ ] Delete a link
- [ ] Confirm deletion dialog appears
- [ ] Verify link removed from dashboard
- [ ] Try accessing deleted link code (should 404)

#### 7. UI/UX

- [ ] Test on mobile device
- [ ] Test on tablet
- [ ] Test on desktop
- [ ] Verify loading states appear
- [ ] Verify empty state shows when no links
- [ ] Check form validation error messages
- [ ] Verify success messages appear

#### 8. API Testing

```bash
# Health check
curl http://localhost:3000/api/healthz

# Create link
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "https://example.com"}'

# Get all links
curl http://localhost:3000/api/links

# Get specific link
curl http://localhost:3000/api/links/abc123

# Delete link
curl -X DELETE http://localhost:3000/api/links/abc123
```

### Automated Testing (Optional)

For production apps, consider adding:

```bash
npm install -D @playwright/test
npm install -D vitest
```

Create tests for:

- API endpoint functionality
- UI component rendering
- Link creation flow
- Redirect behavior
- Error handling

## 🎨 UI Best Practices Implemented

- ✅ **Responsive Design** - Mobile-first approach with Tailwind
- ✅ **Loading States** - Spinners and skeleton screens
- ✅ **Error States** - Clear error messages with recovery options
- ✅ **Empty States** - Helpful messaging when no data
- ✅ **Form Validation** - Inline errors with clear messaging
- ✅ **Copy Feedback** - Visual confirmation on copy actions
- ✅ **Hover States** - Interactive elements have hover effects
- ✅ **Consistent Spacing** - Proper padding and margins
- ✅ **Color Hierarchy** - Primary actions stand out
- ✅ **Accessible Text** - Readable font sizes and contrast
- ✅ **URL Truncation** - Long URLs don't break layout
- ✅ **Confirmation Dialogs** - Prevent accidental deletions

## 🔧 Optional Improvements

### Security

- Add rate limiting to prevent abuse
- Implement API authentication
- Add CAPTCHA for link creation

### Features

- QR code generation for links
- Link expiration dates
- Password-protected links
- Analytics graphs (clicks over time)
- Bulk link creation via CSV
- Link categories/tags
- Custom domains

### Performance

- Redis caching for popular links
- CDN integration
- Image optimization for QR codes

### Monitoring

- Error tracking (Sentry)
- Analytics (Google Analytics, Plausible)
- Uptime monitoring

## 📝 Environment Variables

| Variable                   | Description                          | Required |
| -------------------------- | ------------------------------------ | -------- |
| `POSTGRES_URL`             | Main PostgreSQL connection string    | Yes      |
| `POSTGRES_PRISMA_URL`      | Pooled connection for Prisma         | Yes      |
| `POSTGRES_URL_NON_POOLING` | Direct connection (no pooling)       | Yes      |
| `POSTGRES_USER`            | Database username                    | Yes      |
| `POSTGRES_HOST`            | Database host                        | Yes      |
| `POSTGRES_PASSWORD`        | Database password                    | Yes      |
| `POSTGRES_DATABASE`        | Database name                        | Yes      |
| `NODE_ENV`                 | Environment (development/production) | No       |

## 🐛 Troubleshooting

### Database Connection Issues

- Verify `.env` file exists and has correct values
- Check Neon dashboard for connection string
- Ensure database is not paused (free tier)

### Migration Fails

- Check database credentials
- Verify network connectivity
- Try running migration manually with SQL file

### 404 on Redirect

- Verify link code exists in database
- Check code format (6-8 alphanumeric)
- Clear browser cache

### Build Errors

- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Check Node.js version (18+)

## 📄 License

MIT License - feel free to use this project for learning or production!

## 👨‍💻 Author

Built with ❤️ using Next.js 14, TypeScript, Tailwind CSS, and Neon PostgreSQL

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
