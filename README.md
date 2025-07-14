# Code Focus

Track your GitHub commit activity and see what you've been working on.

🔒 **Privacy First**: Your data never leaves your browser. See [PRIVACY.md](PRIVACY.md) for details.

## Features

- 📊 See your GitHub commit activity from the last 3, 5, 7, or 30 days
- 📈 Repositories ranked by lines of code changed
- 🔒 Works with both public and private repositories
- ⚡ Fast and responsive with smart caching
- 🌐 No data storage - everything happens in your browser

## Demo

[Try it live](https://code-focus.vercel.app) - Sign in with your GitHub account

## Quick Start

### Use the Hosted Version

1. Visit [code-focus.vercel.app](https://code-focus.vercel.app)
2. Sign in with GitHub
3. View your commit activity

### Self-Host (Recommended for Privacy)

1. **Fork this repository**

2. **Deploy to Vercel** (free)
   
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/[your-username]/code-focus)

3. **Set up GitHub OAuth App**
   - Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/applications/new)
   - Create a new OAuth App with:
     - Homepage URL: `https://your-app.vercel.app`
     - Callback URL: `https://your-app.vercel.app/api/auth/callback/github`

4. **Configure Environment Variables in Vercel**
   ```env
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
   GITHUB_ID=<your-oauth-app-id>
   GITHUB_SECRET=<your-oauth-app-secret>
   ```

## Local Development

1. **Clone and install**
   ```bash
   git clone https://github.com/[your-username]/code-focus
   cd code-focus
   pnpm install
   ```

2. **Set up environment variables**
   ```bash
   cp example.env .env.local
   # Edit .env.local with your values
   ```

3. **Run locally**
   ```bash
   pnpm dev
   ```

## How It Works

1. You authenticate with GitHub OAuth
2. Your browser requests your commit data directly from GitHub
3. The app calculates statistics and displays them
4. Data is cached for 5 minutes to reduce API calls
5. **No data is ever stored on our servers**

## Privacy & Security

- ✅ **Your data stays in your browser** - we never store it
- ✅ **Direct GitHub API calls** - using your OAuth token
- ✅ **Open source** - verify the code yourself
- ✅ **No analytics or tracking**
- ✅ **Self-hostable** - run your own instance

See [PRIVACY.md](PRIVACY.md) for detailed privacy information.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Authentication**: NextAuth.js with GitHub OAuth
- **Styling**: Tailwind CSS
- **API**: GitHub REST API v3
- **Deployment**: Vercel (or self-host anywhere)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT - See [LICENSE](LICENSE) for details

---

**Note**: This is a personal project and is not affiliated with GitHub.