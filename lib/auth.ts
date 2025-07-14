import { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"

interface GitHubProfile {
  login: string
  [key: string]: unknown
}

// If ALLOWED_USERS is set, only those users can access. Otherwise, anyone can use it.
const allowedUsers = process.env.ALLOWED_USERS?.split(',').map(u => u.trim()).filter(Boolean) || []

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: 'read:user user:email repo'
        }
      }
    })
  ],
  callbacks: {
    async signIn({ account, profile }) {
      // If no allowed users are configured, allow anyone
      if (allowedUsers.length === 0) {
        return true
      }
      
      // Otherwise, only allow specific GitHub users to sign in
      if (account?.provider === "github" && profile) {
        const githubProfile = profile as GitHubProfile
        return allowedUsers.includes(githubProfile.login)
      }
      return false
    },
    async session({ session, token }) {
      // Add GitHub username to session
      if (token?.sub) {
        session.user.id = token.sub
      }
      // Pass through the token to make it accessible in API routes
      ;(session as any).token = token
      return session
    },
    async jwt({ token, account, profile }) {
      // Store GitHub access token for API calls
      if (account?.access_token) {
        token.accessToken = account.access_token
      }
      if (profile) {
        const githubProfile = profile as GitHubProfile
        if (githubProfile.login) {
          token.username = githubProfile.login
        }
      }
      return token
    }
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  }
}