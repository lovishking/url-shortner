# TinyLink - Project Structure

Complete file tree for the TinyLink URL shortener application.

```
link shortner/
├── 📁 app/                              # Next.js 14 App Router
│   ├── 📁 api/                          # API Routes
│   │   ├── 📁 healthz/                  # Health check endpoint
│   │   │   └── route.ts                 # GET /api/healthz → { ok: true, version: "1.0" }
│   │   └── 📁 links/                    # Links API
│   │       ├── route.ts                 # GET /api/links, POST /api/links
│   │       └── 📁 [code]/               # Dynamic route for specific link
│   │           └── route.ts             # GET /api/links/:code, DELETE /api/links/:code
│   ├── 📁 code/                         # Stats pages
│   │   └── 📁 [code]/                   # Dynamic stats page
│   │       └── page.tsx                 # GET /code/:code - Link statistics page
│   ├── 📁 [code]/                       # Dynamic redirect route
│   │   └── route.ts                     # GET /:code - 302 redirect with click tracking
│   ├── layout.tsx                       # Root layout with metadata
│   ├── page.tsx                         # Dashboard page (/) - Main UI
│   └── globals.css                      # Global Tailwind CSS styles
│
├── 📁 lib/                              # Shared libraries and utilities
│   ├── 📁 db/                           # Database related code
│   │   └── schema.ts                    # TypeScript interface for Link model
│   ├── 📁 services/                     # Business logic layer
│   │   └── linkService.ts               # CRUD operations for links
│   └── 📁 utils/                        # Utility functions
│       └── validation.ts                # URL & code validation, code generation
│
├── 📁 scripts/                          # Utility scripts
│   └── migrate.js                       # Database migration script
│
├── 📁 db/                               # Database files
│   └── schema.sql                       # SQL schema definition
│
├── 📁 node_modules/                     # Dependencies (not in git)
│
├── 📁 .next/                            # Next.js build output (not in git)
│
├── 📄 .env                              # Environment variables (not in git, create from .env.example)
├── 📄 .env.example                      # Environment variables template
├── 📄 .gitignore                        # Git ignore rules
├── 📄 package.json                      # Project dependencies and scripts
├── 📄 package-lock.json                 # Locked dependency versions
├── 📄 tsconfig.json                     # TypeScript configuration
├── 📄 tailwind.config.ts                # Tailwind CSS configuration
├── 📄 postcss.config.js                 # PostCSS configuration
├── 📄 next.config.js                    # Next.js configuration
├── 📄 vercel.json                       # Vercel deployment configuration
├── 📄 README.md                         # Main documentation
├── 📄 DEPLOYMENT.md                     # Deployment guide
└── 📄 TESTING.md                        # Testing plan and procedures
```

## File Descriptions

### 📁 App Router (`/app`)

#### API Routes (`/app/api`)

**`/app/api/healthz/route.ts`**
- Health check endpoint
- Returns `{ ok: true, version: "1.0" }`
- Used for monitoring and uptime checks

**`/app/api/links/route.ts`**
- `GET /api/links` - Fetch all links
- `POST /api/links` - Create new short link
  - Accepts: `{ longUrl: string, customCode?: string }`
  - Returns: Link object with generated/custom code
  - Status codes: 201 (created), 400 (invalid), 409 (duplicate code)

**`/app/api/links/[code]/route.ts`**
- `GET /api/links/:code` - Get specific link by code
- `DELETE /api/links/:code` - Delete link
- Status codes: 200 (success), 404 (not found)

#### Pages

**`/app/page.tsx`** (Dashboard)
- Main UI with link creation form
- Table displaying all links
- Features:
  - Create links (with optional custom code)
  - Copy short URL to clipboard
  - View click statistics
  - Delete links
  - Loading, error, and empty states
  - Form validation with inline errors
  - Responsive design

**`/app/code/[code]/page.tsx`** (Stats Page)
- Detailed statistics for individual link
- Displays:
  - Short URL with copy button
  - Total clicks (large metric card)
  - Days active (large metric card)
  - Link details table
  - Test link button
- Back to dashboard navigation

#### Redirect Route

**`/app/[code]/route.ts`**
- Handles `GET /:code`
- Performs 302 redirect to long URL
- Increments click counter asynchronously
- Updates last_clicked timestamp
- Returns 404 if code not found or invalid

#### Layout & Styles

**`/app/layout.tsx`**
- Root layout component
- Sets up HTML structure
- Includes Inter font
- Adds metadata (title, description)

**`/app/globals.css`**
- Tailwind directives
- Global styles
- Custom CSS variables
- Gradient backgrounds

### 📁 Library (`/lib`)

#### Database (`/lib/db`)

**`/lib/db/schema.ts`**
- TypeScript interface for Link model
- Database schema functions
- Table creation/migration helpers

#### Services (`/lib/services`)

**`/lib/services/linkService.ts`**
- Business logic layer
- Functions:
  - `createLink(longUrl, customCode?)` - Create new link
  - `getAllLinks()` - Fetch all links
  - `getLinkByCode(code)` - Get single link
  - `incrementClicks(code)` - Update click stats
  - `deleteLink(code)` - Delete link
- Uses `@vercel/postgres` for queries
- Handles errors (duplicate codes, not found, etc.)

#### Utilities (`/lib/utils`)

**`/lib/utils/validation.ts`**
- Input validation with Zod
- Functions:
  - `isValidUrl(url)` - Validate URL format
  - `isValidCode(code)` - Validate code format (6-8 alphanumeric)
  - `generateShortCode(length)` - Generate random code
- Schemas:
  - `urlSchema` - URL validation
  - `customCodeSchema` - Code validation
  - `createLinkSchema` - Combined validation

### 📁 Scripts (`/scripts`)

**`/scripts/migrate.js`**
- Database migration script
- Creates `links` table
- Adds indexes for performance
- Run with: `npm run db:migrate`

### 📁 Database (`/db`)

**`/db/schema.sql`**
- Raw SQL schema
- Table definitions
- Index definitions
- Sample queries for reference

### 📄 Configuration Files

**`package.json`**
- Dependencies:
  - `next` - Framework
  - `react`, `react-dom` - UI library
  - `@vercel/postgres` - Database client
  - `zod` - Validation
  - `tailwindcss` - Styling
  - `typescript` - Type safety
- Scripts:
  - `dev` - Development server
  - `build` - Production build
  - `start` - Production server
  - `lint` - Linting
  - `db:migrate` - Run migration

**`tsconfig.json`**
- TypeScript compiler options
- Path aliases (`@/*`)
- Strict mode enabled
- Next.js plugin configured

**`tailwind.config.ts`**
- Content paths for purging
- Custom color theme
- Responsive breakpoints

**`next.config.js`**
- Next.js configuration
- React strict mode enabled
- Production optimizations

**`vercel.json`**
- Vercel deployment settings
- Build commands
- Environment variable declarations

**`.env.example`**
- Template for environment variables
- Database connection strings
- Required variables documented

**`.gitignore`**
- Excludes:
  - `node_modules/`
  - `.next/`
  - `.env`
  - Build artifacts

### 📄 Documentation

**`README.md`**
- Project overview
- Installation instructions
- API documentation
- Deployment guide
- Feature list
- Troubleshooting

**`DEPLOYMENT.md`**
- Detailed deployment guides for:
  - Vercel (recommended)
  - Railway
  - Render
  - Self-hosted VPS
- Post-deployment checklist
- Monitoring setup
- Cost estimates

**`TESTING.md`**
- Comprehensive testing plan
- Test cases for all features
- Manual testing checklist
- Automated testing setup
- Bug reporting template

## Data Flow

```
User Request → Next.js Route → Link Service → PostgreSQL → Response

Example: Create Link
1. User submits form (page.tsx)
2. POST /api/links (route.ts)
3. Validate input (validation.ts)
4. createLink() (linkService.ts)
5. INSERT query (PostgreSQL)
6. Return link object
7. Update UI

Example: Redirect
1. User visits /:code
2. GET /:code (route.ts)
3. getLinkByCode() (linkService.ts)
4. SELECT query (PostgreSQL)
5. incrementClicks() (async)
6. 302 redirect to long URL
```

## Database Schema

```sql
Table: links
├── id (SERIAL PRIMARY KEY)
├── code (VARCHAR(8) UNIQUE NOT NULL)
├── long_url (TEXT NOT NULL)
├── created_at (TIMESTAMP WITH TIME ZONE)
├── total_clicks (INTEGER DEFAULT 0)
└── last_clicked (TIMESTAMP WITH TIME ZONE)

Indexes:
├── idx_links_code (code)
└── idx_links_created_at (created_at DESC)
```

## Routes Map

```
Public Routes:
├── GET  /                          → Dashboard (UI)
├── GET  /code/:code                → Stats page (UI)
├── GET  /:code                     → Redirect (302)
└── GET  /api/healthz               → Health check

API Routes:
├── GET    /api/links               → Get all links
├── POST   /api/links               → Create link
├── GET    /api/links/:code         → Get specific link
└── DELETE /api/links/:code         → Delete link
```

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon)
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Deployment**: Vercel / Railway / Render
- **ORM**: Raw SQL with @vercel/postgres

## Key Features Implementation

### ✅ Short Link Creation
- File: `app/api/links/route.ts`, `app/page.tsx`
- Custom code support with uniqueness check

### ✅ URL Validation
- File: `lib/utils/validation.ts`
- Zod schemas for type-safe validation

### ✅ 302 Redirect
- File: `app/[code]/route.ts`
- Next.js `redirect()` function

### ✅ Click Tracking
- Files: `app/[code]/route.ts`, `lib/services/linkService.ts`
- Async increment to not block redirect

### ✅ Link Management
- Files: `app/page.tsx`, `app/api/links/[code]/route.ts`
- Full CRUD operations

### ✅ Analytics
- File: `app/code/[code]/page.tsx`
- Detailed stats display

### ✅ Responsive UI
- Files: All `.tsx` files
- Tailwind CSS responsive utilities

### ✅ Error Handling
- Files: All route files
- Try-catch blocks with appropriate status codes

## Development Workflow

1. **Setup**: `npm install` + create `.env`
2. **Migrate**: `npm run db:migrate`
3. **Develop**: `npm run dev`
4. **Build**: `npm run build`
5. **Deploy**: Push to Git → Auto-deploy

## Production Considerations

- ✅ Environment variables secured
- ✅ Database indexes for performance
- ✅ Error logging (console.error)
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ Responsive design
- ✅ Loading states
- ✅ 404 handling
- ⚠️ Consider adding: Rate limiting, Analytics, Caching

---

**Total Files**: ~20
**Lines of Code**: ~2,500+
**Build Size**: ~500KB (optimized)
**Database Tables**: 1
