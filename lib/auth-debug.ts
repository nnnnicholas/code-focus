import { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"

// Hardcoded values with explicit trimming
const GITHUB_ID = "Ov23li4TtKu7i2rEEGsB".trim()
const GITHUB_SECRET = "520a28f544373adee3cabec3b3142c11370b63a9".trim()

console.log("[AUTH-DEBUG] Initializing auth configuration")
console.log("[AUTH-DEBUG] GITHUB_ID:", JSON.stringify(GITHUB_ID))
console.log("[AUTH-DEBUG] GITHUB_ID length:", GITHUB_ID.length)
console.log("[AUTH-DEBUG] GITHUB_ID char codes:", Array.from(GITHUB_ID).map(c => c.charCodeAt(0)))

export const authOptions: NextAuthOptions = {
  debug: true, // Enable NextAuth debug mode
  providers: [
    GithubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
      authorization: {
        params: {
          scope: 'read:user user:email repo'
        }
      }
    })
  ],
  callbacks: {
    async signIn({ account, profile }) {
      console.log("[AUTH-DEBUG] SignIn callback triggered")
      console.log("[AUTH-DEBUG] Account:", account)
      console.log("[AUTH-DEBUG] Profile:", profile)
      return true
    },
    async redirect({ url, baseUrl }) {
      console.log("[AUTH-DEBUG] Redirect callback triggered")
      console.log("[AUTH-DEBUG] URL:", url)
      console.log("[AUTH-DEBUG] BaseURL:", baseUrl)
      return url.startsWith(baseUrl) ? url : baseUrl
    },
    async session({ session, token }) {
      console.log("[AUTH-DEBUG] Session callback triggered")
      if (token?.accessToken) {
        (session as any).accessToken = token.accessToken
      }
      return session
    },
    async jwt({ token, account }) {
      console.log("[AUTH-DEBUG] JWT callback triggered")
      if (account?.access_token) {
        token.accessToken = account.access_token
      }
      return token
    }
  },
  logger: {
    error(code, metadata) {
      console.error("[AUTH-DEBUG] Error:", code, metadata)
    },
    warn(code) {
      console.warn("[AUTH-DEBUG] Warning:", code)
    },
    debug(code, metadata) {
      console.log("[AUTH-DEBUG] Debug:", code, metadata)
    }
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  session: {
    strategy: 'jwt',
  }
}