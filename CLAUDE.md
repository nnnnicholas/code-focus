# Code Focus Project Instructions

## Project Overview
Code Focus is a private GitHub activity dashboard that displays commit activity from the last 72 hours for user nnnnicholas.

## Important References
- **Project Plan**: See `documentation/project-plan.md` for detailed implementation plan
- **Development Log**: See `documentation/development-log.md` for decisions made and solutions implemented
- **Setup Guide**: See `documentation/setup-guide.md` for deployment instructions
- **OAuth Troubleshooting**: See `documentation/oauth-troubleshooting-log.md` for current OAuth issue and attempted fixes
- **Tech Stack**: Next.js, TypeScript, NextAuth, Tailwind CSS, Vercel
- **Main Goal**: Show ranked repositories by lines of code committed in last N days (configurable)

## CRITICAL ISSUE - OAuth Authentication
There is an unresolved issue where NextAuth adds `%0A` (newline) to the GitHub Client ID in OAuth URLs, causing 404 errors. See `documentation/oauth-troubleshooting-log.md` for full details and attempted solutions.

## Development Guidelines
1. Always use `pnpm` for package management
2. Follow TypeScript strict mode
3. Use App Router (Next.js 14+) patterns
4. Implement proper error handling and loading states
5. Keep all sensitive data (tokens, secrets) in environment variables

## Security Requirements
- All pages must be authenticated (except login)
- No client-side exposure of GitHub tokens
- Use server-side API routes for all GitHub API calls
- Implement proper session management with NextAuth

## API Integration
- Use GitHub REST API v3 via @octokit/rest
- Personal Access Token required with `repo` scope
- Implement caching to respect rate limits (5000 req/hour)

## Testing Approach
- Test with both public and private repositories
- Verify authentication flow works correctly
- Check that commit aggregation is accurate
- Ensure no private data leaks to client

## Deployment
- Target platform: Vercel
- Environment variables must be configured in Vercel dashboard
- GitHub OAuth App required for production