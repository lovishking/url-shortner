# TinyLink Testing Plan

## Overview

This document outlines the comprehensive testing strategy for the TinyLink URL shortener application.

## 1. Unit Testing

### API Routes Testing

#### Health Check (`/api/healthz`)

```
Test Case 1: Health check returns correct response
- Method: GET /api/healthz
- Expected: { ok: true, version: "1.0" }
- Status: 200
```

#### Create Link (`POST /api/links`)

```
Test Case 2: Create link with valid URL (auto code)
- Input: { longUrl: "https://example.com" }
- Expected: Link object with 6-char code
- Status: 201

Test Case 3: Create link with custom code
- Input: { longUrl: "https://example.com", customCode: "abc123" }
- Expected: Link object with code "abc123"
- Status: 201

Test Case 4: Invalid URL format
- Input: { longUrl: "not-a-url" }
- Expected: Error message
- Status: 400

Test Case 5: Custom code too short
- Input: { longUrl: "https://example.com", customCode: "abc" }
- Expected: Error message
- Status: 400

Test Case 6: Custom code too long
- Input: { longUrl: "https://example.com", customCode: "abc123456" }
- Expected: Error message
- Status: 400

Test Case 7: Custom code with special characters
- Input: { longUrl: "https://example.com", customCode: "abc-123" }
- Expected: Error message
- Status: 400

Test Case 8: Duplicate custom code
- Input: Same custom code as existing link
- Expected: "Custom code already exists"
- Status: 409
```

#### Get All Links (`GET /api/links`)

```
Test Case 9: Get all links (empty)
- Expected: []
- Status: 200

Test Case 10: Get all links (with data)
- Expected: Array of link objects
- Status: 200
```

#### Get Link by Code (`GET /api/links/:code`)

```
Test Case 11: Get existing link
- Expected: Link object
- Status: 200

Test Case 12: Get non-existent link
- Expected: Error message
- Status: 404
```

#### Delete Link (`DELETE /api/links/:code`)

```
Test Case 13: Delete existing link
- Expected: { success: true }
- Status: 200

Test Case 14: Delete non-existent link
- Expected: Error message
- Status: 404
```

#### Redirect (`GET /:code`)

```
Test Case 15: Redirect valid code
- Expected: 302 redirect
- Side effect: Increment clicks
- Status: 302

Test Case 16: Invalid code format
- Expected: Not Found
- Status: 404

Test Case 17: Non-existent code
- Expected: Not Found
- Status: 404
```

### Validation Functions Testing

#### URL Validation

```
Test Case 18: Valid HTTP URL
- Input: "http://example.com"
- Expected: true

Test Case 19: Valid HTTPS URL
- Input: "https://example.com"
- Expected: true

Test Case 20: Invalid URL
- Input: "not-a-url"
- Expected: false

Test Case 21: Empty string
- Input: ""
- Expected: false
```

#### Code Validation

```
Test Case 22: Valid 6-char code
- Input: "abc123"
- Expected: true

Test Case 23: Valid 8-char code
- Input: "abcd1234"
- Expected: true

Test Case 24: Too short (5 chars)
- Input: "abc12"
- Expected: false

Test Case 25: Too long (9 chars)
- Input: "abc123456"
- Expected: false

Test Case 26: Special characters
- Input: "abc-123"
- Expected: false
```

#### Code Generation

```
Test Case 27: Generate 6-char code
- Expected: String matching /^[A-Za-z0-9]{6}$/

Test Case 28: Generate 8-char code
- Expected: String matching /^[A-Za-z0-9]{8}$/

Test Case 29: Uniqueness
- Generate 1000 codes
- Expected: All unique
```

## 2. Integration Testing

### Database Operations

```
Test Case 30: Create and retrieve link
1. Create link via API
2. Get link by code
3. Verify data matches

Test Case 31: Click tracking
1. Create link
2. Access redirect route
3. Get link by code
4. Verify total_clicks = 1
5. Verify last_clicked is recent timestamp

Test Case 32: Delete and verify 404
1. Create link
2. Delete link
3. Try to get link
4. Expected: 404
5. Try to redirect
6. Expected: 404
```

## 3. End-to-End Testing

### User Workflows

```
Test Case 33: Complete link creation flow
1. Navigate to dashboard
2. Enter long URL
3. Submit form
4. Verify success message
5. Verify link appears in table
6. Copy short URL
7. Access short URL in new tab
8. Verify redirect works

Test Case 34: Custom code flow
1. Navigate to dashboard
2. Enter long URL and custom code
3. Submit form
4. Verify custom code is used
5. Test redirect

Test Case 35: Stats page flow
1. Create link
2. Click link code to view stats
3. Verify all details display
4. Test copy button
5. Click "Test Link"
6. Return to dashboard
7. Verify click count increased

Test Case 36: Delete flow
1. Create link
2. Click delete button
3. Confirm deletion
4. Verify link removed from table
5. Try to access link
6. Verify 404 response
```

## 4. UI/UX Testing

### Responsive Design

```
Test Case 37: Mobile view (320px)
- All elements visible
- No horizontal scroll
- Forms usable
- Table scrolls horizontally

Test Case 38: Tablet view (768px)
- Layout adapts properly
- Grid adjusts

Test Case 39: Desktop view (1024px+)
- Full layout displayed
- Optimal spacing
```

### Loading States

```
Test Case 40: Dashboard loading
- Spinner displays while fetching
- Data replaces spinner

Test Case 41: Form submission loading
- Button shows "Creating..."
- Button disabled during submit

Test Case 42: Stats page loading
- Loading indicator shows
- Data replaces loader
```

### Error States

```
Test Case 43: Network error
- Graceful error message
- Retry option available

Test Case 44: Form validation errors
- Inline errors display
- Red border on invalid fields

Test Case 45: 404 page
- Friendly error message
- Link back to dashboard
```

### Empty States

```
Test Case 46: No links
- Empty state illustration
- Helpful message
- Call to action visible
```

## 5. Performance Testing

```
Test Case 47: Database query performance
- Create 1000 links
- Measure GET /api/links response time
- Expected: < 500ms

Test Case 48: Redirect performance
- Measure redirect time
- Expected: < 100ms

Test Case 49: Concurrent requests
- Send 100 simultaneous requests
- All should succeed
- No race conditions
```

## 6. Security Testing

```
Test Case 50: SQL Injection prevention
- Try SQL in URL field
- Expected: Sanitized/rejected

Test Case 51: XSS prevention
- Try JavaScript in URL field
- Expected: Escaped/sanitized

Test Case 52: Code enumeration
- Try sequential code access
- Verify only valid codes work
```

## 7. Browser Compatibility

```
Test Case 53: Chrome (latest)
Test Case 54: Firefox (latest)
Test Case 55: Safari (latest)
Test Case 56: Edge (latest)
```

## 8. Accessibility Testing

```
Test Case 57: Keyboard navigation
- Tab through all interactive elements
- All should be accessible

Test Case 58: Screen reader compatibility
- All labels present
- Alt text on icons

Test Case 59: Color contrast
- Text readable on all backgrounds
```

## Test Execution Checklist

### Before Each Test

- [ ] Clear database or use test database
- [ ] Reset application state
- [ ] Clear browser cache/cookies

### During Test

- [ ] Document actual results
- [ ] Take screenshots of failures
- [ ] Note any unexpected behavior

### After Test

- [ ] Mark test as pass/fail
- [ ] Log any bugs discovered
- [ ] Update test case if needed

## Automated Testing Setup (Optional)

### Tools to Consider

- **Unit Tests**: Vitest or Jest
- **E2E Tests**: Playwright or Cypress
- **API Tests**: Supertest
- **Load Tests**: k6 or Artillery

### Sample Test Structure

```typescript
// Example with Vitest
import { describe, it, expect } from "vitest";
import { isValidUrl, isValidCode } from "@/lib/utils/validation";

describe("Validation Utils", () => {
  it("validates correct URLs", () => {
    expect(isValidUrl("https://example.com")).toBe(true);
  });

  it("rejects invalid URLs", () => {
    expect(isValidUrl("not-a-url")).toBe(false);
  });

  it("validates correct codes", () => {
    expect(isValidCode("abc123")).toBe(true);
  });

  it("rejects short codes", () => {
    expect(isValidCode("abc")).toBe(false);
  });
});
```

## Bug Reporting Template

```
Bug ID: [Number]
Title: [Brief description]
Severity: [Critical/High/Medium/Low]
Test Case: [TC Number]
Steps to Reproduce:
1.
2.
3.

Expected Result:
[What should happen]

Actual Result:
[What actually happened]

Screenshots:
[Attach if applicable]

Environment:
- Browser:
- OS:
- URL:
```

## Test Results Tracking

| Test Case | Status | Date | Tester | Notes |
| --------- | ------ | ---- | ------ | ----- |
| TC-1      | ⬜     |      |        |       |
| TC-2      | ⬜     |      |        |       |
| ...       | ⬜     |      |        |       |

Legend:

- ✅ Pass
- ❌ Fail
- ⬜ Not Run
- ⚠️ Blocked
