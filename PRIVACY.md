# Privacy & Data Handling

## 🔒 Your Data Stays Yours

Code Focus is designed with privacy as a core principle. Here's exactly how your data is handled:

### What We DON'T Do
- ❌ **No data storage**: We don't store your commit data, repository information, or any statistics
- ❌ **No analytics**: We don't track your usage or collect any analytics
- ❌ **No third-party services**: Your data isn't sent to any third-party services
- ❌ **No cookies beyond auth**: Only authentication cookies are used, nothing else

### How It Works
1. **Authentication**: You log in with GitHub OAuth
2. **Direct API calls**: Your browser makes direct calls to GitHub's API using YOUR token
3. **Client-side processing**: All data processing happens in your browser
4. **Temporary caching**: Data is cached in memory for 5 minutes to reduce API calls (cleared on refresh)
5. **No backend storage**: The server only proxies requests - no database, no logs, no storage

### Technical Details
- **GitHub Token**: Your OAuth token is stored in an encrypted JWT cookie
- **API Requests**: Made on-behalf-of your authenticated session
- **Cache**: In-memory only, tied to your session, cleared after 5 minutes
- **Server Role**: Only validates authentication and forwards requests to GitHub

### Self-Hosting
For maximum privacy, you can self-host this application:
```bash
git clone https://github.com/[your-username]/code-focus
cd code-focus
pnpm install
pnpm build
pnpm start
```

### Verifying Privacy
You can verify these claims by:
1. Checking the source code - it's all open source
2. Monitoring network requests in your browser's dev tools
3. Reviewing the [app/api/stats/route.ts](app/api/stats/route.ts) file to see data handling

### Questions?
If you have any privacy concerns or questions, please open an issue on GitHub.