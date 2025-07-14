# Taking Authenticated Screenshots with Playwright

## Problem
Playwright opens a new browser session without your existing authentication cookies, so it can't access protected pages like `/dashboard`.

## Solutions

### Option 1: Quick Cookie Method (Recommended)
1. Open Chrome DevTools (F12) while logged into Code Focus
2. Go to Application → Cookies → http://localhost:3000
3. Find the `next-auth.session-token` cookie and copy its value
4. Run:
   ```bash
   SESSION_COOKIE="your-cookie-value" pnpm screenshot
   ```

### Option 2: Save & Reuse Auth State
1. Save your auth state after manual login:
   ```bash
   pnpm screenshot:save-auth
   # Browser opens - log in manually
   # Auth state saved to auth-state.json
   ```

2. Take screenshots using saved auth:
   ```bash
   pnpm screenshot:auth
   ```

### Option 3: Global Playwright (No Auth)
For public pages only:
```bash
playwright screenshot http://localhost:3000 homepage.png
```

### Option 4: Browser Extension
Consider using browser extensions like:
- Full Page Screen Capture
- GoFullPage
- Fireshot

These work with your existing session and are simpler for authenticated content.

## Why It's Complicated
- Each Playwright browser instance is isolated (like incognito mode)
- NextAuth uses httpOnly cookies that can't be read by JavaScript
- JWT tokens are encrypted and session-based
- OAuth flow requires real browser interaction

## Best Practice
For development screenshots of authenticated pages, using browser DevTools or extensions is often simpler than automating the auth flow.