# Development Checklist

Use this checklist to set up and verify your TinyLink installation.

## ✅ Initial Setup

### Prerequisites

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm/yarn/pnpm installed
- [ ] Git installed (optional)
- [ ] Code editor (VS Code recommended)

### Database Setup

- [ ] Created Neon account at https://neon.tech
- [ ] Created new Neon project
- [ ] Copied connection string from dashboard
- [ ] Database region selected (close to users)

### Environment Configuration

- [ ] Created `.env` file from `.env.example`
- [ ] Added `POSTGRES_URL` value
- [ ] Added `POSTGRES_PRISMA_URL` value
- [ ] Added `POSTGRES_URL_NON_POOLING` value
- [ ] Added `POSTGRES_USER` value
- [ ] Added `POSTGRES_HOST` value
- [ ] Added `POSTGRES_PASSWORD` value
- [ ] Added `POSTGRES_DATABASE` value

### Installation

- [ ] Ran `npm install` successfully
- [ ] No error messages in install
- [ ] `node_modules` folder created

### Database Migration

- [ ] Ran `npm run db:migrate`
- [ ] Saw "Table 'links' created" message
- [ ] Saw "Indexes created" message
- [ ] No errors in migration

### Development Server

- [ ] Ran `npm run dev`
- [ ] Server started on port 3000
- [ ] No compilation errors
- [ ] Opened http://localhost:3000 in browser
- [ ] Dashboard page loads correctly

---

## ✅ Feature Testing

### Link Creation - Auto-Generated Code

- [ ] Entered valid URL (e.g., https://github.com)
- [ ] Left custom code blank
- [ ] Clicked "Shorten URL"
- [ ] Saw success message
- [ ] Link appeared in table below
- [ ] Code is 6 characters (alphanumeric)

### Link Creation - Custom Code

- [ ] Entered valid URL
- [ ] Entered custom code (e.g., "github")
- [ ] Clicked "Shorten URL"
- [ ] Saw success message
- [ ] Link appeared with custom code
- [ ] Custom code is exactly what I entered

### Form Validation - Invalid URL

- [ ] Entered invalid URL (e.g., "not-a-url")
- [ ] Clicked "Shorten URL"
- [ ] Saw error message
- [ ] Red border on URL field
- [ ] Form did not submit

### Form Validation - Invalid Code (Too Short)

- [ ] Entered valid URL
- [ ] Entered short code (e.g., "abc")
- [ ] Clicked "Shorten URL"
- [ ] Saw error message for code
- [ ] Form did not submit

### Form Validation - Invalid Code (Special Chars)

- [ ] Entered valid URL
- [ ] Entered code with special chars (e.g., "abc-123")
- [ ] Clicked "Shorten URL"
- [ ] Saw error message
- [ ] Form did not submit

### Duplicate Code Handling

- [ ] Created link with custom code (e.g., "test123")
- [ ] Tried to create another link with same code
- [ ] Saw "Code already exists" error
- [ ] HTTP status 409 returned
- [ ] First link still exists

### Copy Functionality

- [ ] Clicked copy button next to a link
- [ ] Icon changed to checkmark
- [ ] Saw "Copied!" or checkmark feedback
- [ ] Pasted URL into browser/notepad
- [ ] Full URL copied correctly (e.g., http://localhost:3000/abc123)

### URL Redirect

- [ ] Copied a short URL
- [ ] Opened short URL in new tab
- [ ] Redirected to original long URL
- [ ] Redirect was fast (< 1 second)
- [ ] Original URL loaded correctly

### Click Tracking

- [ ] Noted initial click count for a link
- [ ] Visited the short URL
- [ ] Returned to dashboard
- [ ] Refreshed dashboard
- [ ] Click count increased by 1
- [ ] "Last Clicked" timestamp updated

### Stats Page Access

- [ ] Clicked on a short code in the table
- [ ] Navigated to /code/:code page
- [ ] Stats page loaded correctly
- [ ] All details displayed

### Stats Page Content

- [ ] Short URL displays correctly
- [ ] Total clicks shows correct number
- [ ] Days active calculated correctly
- [ ] Original URL is a clickable link
- [ ] Created at date formatted nicely
- [ ] Last clicked shows timestamp (or "Never")

### Stats Page - Copy Button

- [ ] Clicked copy button on stats page
- [ ] Saw "Copied!" feedback
- [ ] Pasted URL - was correct

### Stats Page - Test Link

- [ ] Clicked "Test Link" button
- [ ] Link opened in new tab
- [ ] Redirected correctly

### Stats Page - Back Navigation

- [ ] Clicked "Back to Dashboard" link
- [ ] Returned to main page
- [ ] Dashboard loaded correctly

### Link Deletion

- [ ] Clicked "Delete" button for a link
- [ ] Saw confirmation dialog
- [ ] Confirmed deletion
- [ ] Link removed from table
- [ ] Table updated immediately

### 404 After Deletion

- [ ] Deleted a link
- [ ] Tried to visit the short URL
- [ ] Got 404 error (Not Found)
- [ ] Tried to access stats page
- [ ] Got "Link Not Found" message

### Empty State

- [ ] Deleted all links
- [ ] Dashboard shows empty state
- [ ] Helpful message displayed
- [ ] Icon/illustration visible

### Loading States

- [ ] Refreshed dashboard
- [ ] Saw loading spinner briefly
- [ ] Data loaded and replaced spinner

---

## ✅ API Endpoint Testing

### Health Check

```bash
curl http://localhost:3000/api/healthz
```

- [ ] Returns `{ "ok": true, "version": "1.0" }`
- [ ] Status code 200

### Create Link (Auto Code)

```bash
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"longUrl":"https://example.com"}'
```

- [ ] Returns link object
- [ ] Contains auto-generated code (6 chars)
- [ ] Status code 201

### Create Link (Custom Code)

```bash
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"longUrl":"https://example.com","customCode":"test123"}'
```

- [ ] Returns link object
- [ ] Code is "test123"
- [ ] Status code 201

### Create Link (Invalid URL)

```bash
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"longUrl":"not-a-url"}'
```

- [ ] Returns error message
- [ ] Status code 400

### Create Link (Duplicate Code)

```bash
# Create first link, then run again with same customCode
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"longUrl":"https://example.com","customCode":"duplicate"}'
```

- [ ] First request: Status 201
- [ ] Second request: Status 409
- [ ] Error message mentions "already exists"

### Get All Links

```bash
curl http://localhost:3000/api/links
```

- [ ] Returns array of links
- [ ] Each link has all fields
- [ ] Status code 200

### Get Link by Code

```bash
curl http://localhost:3000/api/links/test123
```

- [ ] Returns single link object
- [ ] Status code 200

### Get Non-Existent Link

```bash
curl http://localhost:3000/api/links/doesnotexist
```

- [ ] Returns error message
- [ ] Status code 404

### Delete Link

```bash
curl -X DELETE http://localhost:3000/api/links/test123
```

- [ ] Returns `{ "success": true }`
- [ ] Status code 200
- [ ] Link removed from database

### Delete Non-Existent Link

```bash
curl -X DELETE http://localhost:3000/api/links/doesnotexist
```

- [ ] Returns error message
- [ ] Status code 404

---

## ✅ Responsive Design Testing

### Mobile (320px - 480px)

- [ ] Opened in Chrome DevTools mobile view
- [ ] Dashboard displays correctly
- [ ] Form is usable
- [ ] Table scrolls horizontally if needed
- [ ] Buttons are touch-friendly
- [ ] Text is readable
- [ ] No horizontal overflow

### Tablet (768px - 1024px)

- [ ] Dashboard adapts to tablet size
- [ ] Table displays well
- [ ] Form has good width
- [ ] Stats page looks good
- [ ] Navigation works

### Desktop (1024px+)

- [ ] Full layout visible
- [ ] Optimal spacing
- [ ] Table displays all columns
- [ ] Forms have good proportions

---

## ✅ Browser Compatibility

### Chrome

- [ ] All features work
- [ ] No console errors
- [ ] UI renders correctly

### Firefox

- [ ] All features work
- [ ] No console errors
- [ ] UI renders correctly

### Safari (if available)

- [ ] All features work
- [ ] No console errors
- [ ] UI renders correctly

### Edge

- [ ] All features work
- [ ] No console errors
- [ ] UI renders correctly

---

## ✅ Deployment Readiness

### Pre-Deployment

- [ ] All tests passing locally
- [ ] No console errors
- [ ] .env variables documented
- [ ] README.md reviewed
- [ ] Code committed to Git (optional)

### Deployment Platform Chosen

- [ ] Vercel (recommended)
- [ ] Railway
- [ ] Render
- [ ] Self-hosted

### Environment Variables Set

- [ ] All Neon credentials configured in platform
- [ ] Verified variable names match exactly
- [ ] No typos in values

### Post-Deployment

- [ ] Production URL accessible
- [ ] Health check working (`/api/healthz`)
- [ ] Created test link successfully
- [ ] Redirect works in production
- [ ] Click tracking works
- [ ] Stats page loads
- [ ] Delete works

---

## ✅ Optional Enhancements

### Security

- [ ] Considered rate limiting
- [ ] Reviewed API authentication needs
- [ ] SSL/HTTPS enabled (automatic on Vercel)

### Monitoring

- [ ] Set up error tracking (Sentry)
- [ ] Configured analytics (GA, Plausible)
- [ ] Set up uptime monitoring

### Features

- [ ] QR code generation
- [ ] Link expiration
- [ ] Analytics graphs
- [ ] Custom domains

---

## 🎯 Final Checklist

- [ ] Application runs without errors
- [ ] All core features tested
- [ ] API endpoints verified
- [ ] Responsive design confirmed
- [ ] Documentation reviewed
- [ ] Ready for deployment or production use

---

## 📝 Notes

Use this space to track any issues or customizations:

```
Issue/Customization:
Date:
Status:
Resolution:
```

---

## 🆘 Need Help?

If you encounter issues:

1. Check `QUICKSTART.md` for troubleshooting
2. Review `README.md` for detailed docs
3. See `TESTING.md` for test cases
4. Check console for error messages
5. Verify .env file is correct
6. Ensure database is running (Neon dashboard)

---

**Once all items are checked, your TinyLink installation is complete and ready!** 🎉
