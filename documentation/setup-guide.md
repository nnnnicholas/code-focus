# Code Focus Setup Guide

## Quick Start

### 1. Set Up GitHub OAuth App

1. Go to https://github.com/settings/applications/new
2. Fill in the following:
   - **Application name**: Code Focus
   - **Homepage URL**: http://localhost:3000 (for local) or your Vercel URL
   - **Authorization callback URL**: http://localhost:3000/api/auth/callback/github
3. Click "Register application"
4. Save the Client ID and generate a Client Secret

### 2. Create GitHub Personal Access Token

1. Go to https://github.com/settings/tokens/new
2. Give it a name: "Code Focus API"
3. Set expiration as needed
4. Select scopes:
   - `repo` - Full control of private repositories (required)
5. Click "Generate token"
6. Copy and save the token immediately

### 3. Configure Environment Variables

Copy `example.env` to `.env.local` and fill in your values:

```env
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-generated-secret

# From GitHub OAuth App
GITHUB_ID=your-client-id
GITHUB_SECRET=your-client-secret

# Personal Access Token
GITHUB_TOKEN=ghp_your-token-here

# Your GitHub username
ALLOWED_USERS=NNNN

# For local development
NEXTAUTH_URL=http://localhost:3000
```

### 4. Run Locally

```bash
pnpm install
pnpm dev
```

## Vercel Deployment

### 1. Prepare for Production

1. Create a new GitHub OAuth App for production with your Vercel URL
2. Update the Authorization callback URL to: `https://your-app.vercel.app/api/auth/callback/github`

### 2. Deploy to Vercel

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Add environment variables:
   - All variables from `.env.local`
   - Update `NEXTAUTH_URL` to your Vercel URL
   - Use production OAuth App credentials

### 3. Post-Deployment

1. Test authentication flow
2. Verify only allowed users can access
3. Check that private repos are visible

## Troubleshooting

### "Access Denied" after login
- Ensure your GitHub username is in `ALLOWED_USERS`
- Check that the username matches exactly (case-sensitive)

### No repositories showing
- Verify your Personal Access Token has `repo` scope
- Check that you have commits in the last 72 hours
- Try the refresh button

### API Rate Limits
- The app uses authenticated requests (5,000/hour limit)
- Implement caching if hitting limits frequently

### Authentication Errors
- Verify all environment variables are set correctly
- Ensure OAuth callback URL matches exactly
- Check NEXTAUTH_SECRET is properly generated