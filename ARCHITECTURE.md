# TinyLink Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         TinyLink System                          │
│                      URL Shortener Application                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐      ┌──────────────────┐      ┌─────────────┐
│                 │      │                  │      │             │
│  User Browser   │◄────►│   Next.js App    │◄────►│  PostgreSQL │
│                 │      │   (Port 3000)    │      │   (Neon)    │
└─────────────────┘      └──────────────────┘      └─────────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │   File System   │
                         │  (.env, logs)   │
                         └─────────────────┘
```

## Application Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ Dashboard   │  │ Stats Page   │  │ Redirect Handler     │   │
│  │ (/)         │  │ (/code/:code)│  │ (/:code)             │   │
│  │             │  │              │  │                      │   │
│  │ • Add Link  │  │ • View Stats │  │ • 302 Redirect       │   │
│  │ • List All  │  │ • Copy URL   │  │ • Track Click        │   │
│  │ • Delete    │  │ • Test Link  │  │ • Update Timestamp   │   │
│  │ • Copy      │  │ • Details    │  │                      │   │
│  └─────────────┘  └──────────────┘  └──────────────────────┘   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                          API Layer                                │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  POST   /api/links          │ Create new short link             │
│  GET    /api/links          │ Get all links                     │
│  GET    /api/links/:code    │ Get specific link                 │
│  DELETE /api/links/:code    │ Delete link                       │
│  GET    /api/healthz        │ Health check                      │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                       Service Layer                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  lib/services/linkService.ts                                     │
│  ├─ createLink(url, code?)     → Create new link                │
│  ├─ getAllLinks()               → Fetch all links               │
│  ├─ getLinkByCode(code)         → Get single link               │
│  ├─ incrementClicks(code)       → Update click stats            │
│  └─ deleteLink(code)            → Delete link                   │
│                                                                   │
│  lib/utils/validation.ts                                         │
│  ├─ isValidUrl(url)             → Validate URL                  │
│  ├─ isValidCode(code)           → Validate code                 │
│  └─ generateShortCode(length)   → Generate random code          │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                       Database Layer                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  PostgreSQL (Neon) - Table: links                                │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ id              │ SERIAL PRIMARY KEY                       │ │
│  │ code            │ VARCHAR(8) UNIQUE NOT NULL               │ │
│  │ long_url        │ TEXT NOT NULL                            │ │
│  │ created_at      │ TIMESTAMP WITH TIME ZONE                 │ │
│  │ total_clicks    │ INTEGER DEFAULT 0                        │ │
│  │ last_clicked    │ TIMESTAMP WITH TIME ZONE                 │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  Indexes:                                                         │
│  • idx_links_code (for fast code lookups)                        │
│  • idx_links_created_at (for ordered lists)                      │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Create Link Flow

```
User
  │
  │ 1. Enter URL + optional code
  ▼
Dashboard (page.tsx)
  │
  │ 2. Validate form (client-side)
  ▼
POST /api/links
  │
  │ 3. Validate with Zod
  ▼
linkService.createLink()
  │
  │ 4. Check if code exists
  │ 5. Generate code if needed
  ▼
PostgreSQL INSERT
  │
  │ 6. Return new link object
  ▼
Dashboard
  │
  │ 7. Update UI, show success
  ▼
User sees new link in table
```

### 2. Redirect Flow

```
User
  │
  │ 1. Visit /:code
  ▼
Redirect Route (app/[code]/route.ts)
  │
  │ 2. Validate code format
  ▼
linkService.getLinkByCode()
  │
  │ 3. Query database
  ▼
PostgreSQL SELECT
  │
  ├─ Found? ──────────┐
  │                   │
  │ 4. Async:         │ 5. 302 Redirect
  │ incrementClicks() │ to long_url
  ▼                   ▼
Update clicks      User redirected
+ timestamp        to destination
```

### 3. Delete Link Flow

```
User
  │
  │ 1. Click Delete button
  ▼
Dashboard
  │
  │ 2. Confirm dialog
  ▼
DELETE /api/links/:code
  │
  │ 3. Find link
  ▼
linkService.deleteLink()
  │
  │ 4. Delete from DB
  ▼
PostgreSQL DELETE
  │
  │ 5. Return success
  ▼
Dashboard
  │
  │ 6. Remove from UI
  ▼
Link removed from table
  │
  │ 7. Try to visit /:code
  ▼
404 Not Found
```

### 4. View Stats Flow

```
User
  │
  │ 1. Click on code link
  ▼
Stats Page (app/code/[code]/page.tsx)
  │
  │ 2. Show loading state
  ▼
GET /api/links/:code
  │
  │ 3. Fetch link data
  ▼
linkService.getLinkByCode()
  │
  │ 4. Query database
  ▼
PostgreSQL SELECT
  │
  │ 5. Return link object
  ▼
Stats Page
  │
  │ 6. Display:
  │    • Total clicks
  │    • Days active
  │    • Link details
  │    • Copy button
  │    • Test link
  ▼
User sees analytics
```

## File Organization

```
link shortner/
│
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── healthz/
│   │   │   └── route.ts          # Health check
│   │   └── links/
│   │       ├── route.ts          # GET/POST links
│   │       └── [code]/
│   │           └── route.ts      # GET/DELETE specific link
│   │
│   ├── code/                     # Stats pages
│   │   └── [code]/
│   │       └── page.tsx          # Stats page UI
│   │
│   ├── [code]/                   # Redirect
│   │   └── route.ts              # Redirect handler
│   │
│   ├── page.tsx                  # Dashboard UI
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
│
├── lib/                          # Shared code
│   ├── db/
│   │   └── schema.ts             # DB schema types
│   ├── services/
│   │   └── linkService.ts        # Business logic
│   └── utils/
│       └── validation.ts         # Validation helpers
│
├── db/
│   └── schema.sql                # SQL schema
│
├── scripts/
│   └── migrate.js                # Migration script
│
└── [config files]                # package.json, tsconfig, etc.
```

## Request/Response Examples

### Create Link

```
Request:
POST /api/links
Content-Type: application/json

{
  "longUrl": "https://github.com",
  "customCode": "github"
}

Response:
201 Created

{
  "id": 1,
  "code": "github",
  "long_url": "https://github.com",
  "created_at": "2025-11-18T12:00:00Z",
  "total_clicks": 0,
  "last_clicked": null
}
```

### Redirect

```
Request:
GET /github

Response:
302 Found
Location: https://github.com

Side Effect:
- total_clicks incremented
- last_clicked updated
```

### Get All Links

```
Request:
GET /api/links

Response:
200 OK

[
  {
    "id": 1,
    "code": "github",
    "long_url": "https://github.com",
    "created_at": "2025-11-18T12:00:00Z",
    "total_clicks": 5,
    "last_clicked": "2025-11-18T13:30:00Z"
  },
  ...
]
```

## Technology Stack Layers

```
┌─────────────────────────────────────────┐
│         Deployment Layer                │
│  Vercel / Railway / Render / VPS        │
└─────────────────────────────────────────┘
                  │
┌─────────────────────────────────────────┐
│         Application Layer               │
│  Next.js 14 (React 18 + TypeScript)     │
└─────────────────────────────────────────┘
                  │
┌─────────────────────────────────────────┐
│         Styling Layer                   │
│  Tailwind CSS 3.4                       │
└─────────────────────────────────────────┘
                  │
┌─────────────────────────────────────────┐
│         Validation Layer                │
│  Zod (Schema Validation)                │
└─────────────────────────────────────────┘
                  │
┌─────────────────────────────────────────┐
│         Database Layer                  │
│  PostgreSQL (Neon) + @vercel/postgres   │
└─────────────────────────────────────────┘
```

## Security Architecture

```
┌──────────────────────────────────────────┐
│          Security Layers                 │
└──────────────────────────────────────────┘

1. Input Validation
   ├─ Client-side (Zod + React)
   └─ Server-side (Zod + API routes)

2. SQL Injection Prevention
   └─ Parameterized queries (@vercel/postgres)

3. Environment Variables
   └─ Secrets in .env (not committed)

4. HTTPS/SSL
   └─ Automatic on deployment platforms

5. Database Constraints
   ├─ UNIQUE constraint on code
   └─ NOT NULL on required fields

6. Error Handling
   ├─ Try-catch blocks
   └─ Appropriate HTTP status codes
```

## Scaling Strategy

```
Stage 1: Startup (0-10k users/day)
├─ Neon Free Tier
├─ Vercel Free Tier
└─ Current implementation ✓

Stage 2: Growth (10k-100k users/day)
├─ Neon Pro Plan
├─ Vercel Pro Plan
├─ Add Redis cache
└─ Connection pooling

Stage 3: Scale (100k+ users/day)
├─ Dedicated PostgreSQL
├─ CDN integration
├─ Load balancing
├─ Multiple regions
└─ Advanced monitoring
```

## Monitoring Points

```
Application
├─ Health Check: /api/healthz
├─ Error Logs: console.error()
└─ Performance: Response times

Database
├─ Query Performance
├─ Connection Pool
└─ Disk Usage

Infrastructure
├─ Uptime Monitoring
├─ Response Times
└─ Error Rates
```

## Development Workflow

```
1. Setup
   npm install → Install dependencies
   .env setup → Configure database
   npm run db:migrate → Create tables

2. Development
   npm run dev → Start dev server
   Make changes → Edit code
   Test → Verify functionality

3. Build
   npm run build → Production build
   Fix errors → Resolve issues
   Test build → Verify production

4. Deploy
   git push → Trigger deployment
   Verify → Test production
   Monitor → Check logs
```

---

**Use this diagram as a reference to understand how TinyLink works!**
