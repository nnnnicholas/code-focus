# Code Focus - GitHub Activity Dashboard Plan

## Overview
Build a private, Vercel-deployed website that displays Nicholas's (nnnnicholas) GitHub commit activity from the last 72 hours, ranking repositories by lines of code committed.

## Technical Stack
- **Frontend/Backend**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Authentication**: NextAuth.js with GitHub OAuth
- **Deployment**: Vercel
- **Styling**: Tailwind CSS
- **Data Fetching**: GitHub REST API v3
- **Additional Libraries**: 
  - @octokit/rest for GitHub API
  - date-fns for date manipulation
  - axios for HTTP requests

## Key Features
1. **Authentication**: GitHub OAuth login (one-time setup) with persistent sessions
2. **Data Collection**: Fetch commits from last 72 hours across all repositories (private & public)
3. **Metrics**: Calculate lines of code added/removed per repository
4. **Visualization**: Ranked list of repositories by activity
5. **Security**: Private access only - no public exposure of commit data
6. **Caching**: Smart caching to minimize API calls while keeping data fresh

## Implementation Steps

### Phase 1: Setup & Authentication ✓
1. Initialize Next.js project with TypeScript ✓
2. Configure NextAuth with GitHub provider
3. Set up protected routes that require authentication

### Phase 2: GitHub Integration
1. Create GitHub Personal Access Token with repo scope
2. Build API endpoints to fetch user's commits
3. Implement logic to aggregate commits by repository

### Phase 3: Data Processing
1. Calculate lines changed (additions + deletions) per commit
2. Aggregate by repository over 72-hour window
3. Sort repositories by total lines changed

### Phase 4: UI Development
1. Create dashboard showing ranked repositories
2. Display commit counts, lines changed, and last commit time
3. Add refresh functionality
4. Show loading states and error handling

### Phase 5: Deployment
1. Configure environment variables in Vercel
2. Set up GitHub OAuth App for production
3. Deploy and test authentication flow

## Security Considerations
- Store GitHub token as environment variable
- Use NextAuth for secure session management
- API routes protected by authentication middleware
- No client-side exposure of sensitive data
- Implement rate limiting to prevent abuse

## Data Fetching Strategy
1. **Dynamic Loading**: Fetch fresh data on each page load
2. **Caching Layer**: 
   - Cache results for 5-10 minutes
   - Manual refresh button to force fresh data
   - Store cache in server memory or Redis (if needed)
3. **Rate Limit Management**:
   - GitHub API allows 5,000 requests/hour for authenticated requests
   - Implement request queuing and throttling
   - Show rate limit status in UI

## Environment Variables Required
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=[generated secret]
GITHUB_ID=[OAuth App ID]
GITHUB_SECRET=[OAuth App Secret]
GITHUB_TOKEN=[Personal Access Token with repo scope]
```

## API Endpoints Design
- `GET /api/auth/*` - NextAuth endpoints
- `GET /api/commits` - Fetch user's commits (protected)
- `GET /api/stats` - Get aggregated statistics (protected)
- `POST /api/refresh` - Force cache refresh (protected)

## UI Components Structure
```
app/
├── page.tsx              # Landing/login page
├── dashboard/
│   └── page.tsx         # Main dashboard (protected)
├── api/
│   ├── auth/[...nextauth]/
│   │   └── route.ts     # NextAuth configuration
│   ├── commits/
│   │   └── route.ts     # Fetch commits endpoint
│   └── stats/
│       └── route.ts     # Statistics endpoint
└── components/
    ├── LoginButton.tsx
    ├── RepoCard.tsx
    ├── StatsChart.tsx
    └── RefreshButton.tsx
```

## Future Enhancements
1. Add time-based activity charts
2. Show commit messages and file changes
3. Add filtering by language or repository type
4. Export functionality for reports
5. Mobile-responsive design improvements