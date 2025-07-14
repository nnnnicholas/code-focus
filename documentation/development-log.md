# Code Focus Development Log

## Project Overview
Built a privacy-first GitHub activity dashboard that shows commit activity from the last N days, ranking repositories by lines of code changed.

## Key Design Decisions & Solutions

### 1. Privacy-First Architecture
**Problem**: Need to show GitHub data without storing user information
**Solution**: 
- No backend database
- Use user's OAuth token for all API calls
- Only in-memory caching (5 minutes)
- All processing happens client-side

### 2. Authentication Strategy
**Problem**: Need secure access to private repos without storing credentials
**Solution**:
- NextAuth.js with GitHub OAuth provider
- Store OAuth token in encrypted JWT session
- Pass token through to API routes via session
- Originally restricted to single user (ALLOWED_USERS), then made it open for anyone

### 3. API Design
**Problem**: GitHub API rate limits and performance
**Solutions implemented**:
- Limited to 50 most recently pushed repos
- Skip repos that haven't been pushed to in the time window
- In-memory cache with 5-minute TTL
- Cache key includes user ID and time period

### 4. Time Period Flexibility
**Problem**: Originally hardcoded to 72 hours, but users wanted flexibility
**Solution**:
- Added toggle buttons for 3, 5, 7, and 30 days
- Default to 5 days
- Update API to accept days parameter
- Cache separately for each time period

### 5. Performance Optimizations
**Problem**: API was taking 40+ seconds checking hundreds of repos
**Solutions**:
- Check pushed_at date before fetching commits
- Limit to 50 repos instead of all
- Handle empty repos gracefully (409 errors)
- Add loading states and error handling

### 6. Making It Public-Ready
**Problem**: Initially hardcoded for single user (nnnnicholas)
**Changes made**:
- Removed hardcoded username
- Use authenticated user's token instead of personal token
- Made ALLOWED_USERS optional
- Added comprehensive privacy documentation
- Created setup guides for self-hosting

### 7. Deployment Issues
**Problems encountered**:
- TypeScript strict mode errors with `any` types
- ESLint blocking build
- Missing environment variables

**Solutions**:
- Added .eslintrc.json to disable no-explicit-any rule
- Set up all required env vars in Vercel
- Connected GitHub repo for auto-deploy

## Technical Stack Chosen
- **Next.js 14 App Router**: Modern React framework with good Vercel integration
- **NextAuth.js**: Handles OAuth flow and session management
- **Tailwind CSS**: Quick styling without custom CSS
- **TypeScript**: Type safety (though we had to relax some rules)
- **@octokit/rest**: Official GitHub API client

## API Endpoints Created
- `GET /api/auth/*` - NextAuth endpoints
- `GET /api/stats?days=N&refresh=true` - Fetch commit statistics

## Key Files
- `lib/auth.ts` - NextAuth configuration
- `app/api/stats/route.ts` - Main API logic
- `app/dashboard/page.tsx` - Dashboard UI
- `middleware.ts` - Route protection
- `PRIVACY.md` - Privacy documentation

## Lessons Learned
1. Start with flexible design (not hardcoded values)
2. Consider deployment requirements early (ESLint, types)
3. Privacy-first design limits features but builds trust
4. Caching is essential for API-heavy applications
5. Clear documentation is crucial for open source

## Current Status
- ✅ Feature complete
- ✅ Works for any GitHub user
- ✅ Privacy-focused design
- ❌ Vercel deployment having ESLint issues
- 🔄 Need to fix build configuration

## Next Steps
1. Fix Vercel build issues
2. Add custom domain
3. Consider adding more visualizations
4. Add export functionality