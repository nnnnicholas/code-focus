import { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"

// Force trim all whitespace including newlines
const cleanString = (str: string): string => {
  return str.replace(/[\r\n\s]+$/, '').replace(/^[\r\n\s]+/, '')
}

const GITHUB_ID = cleanString("Ov23li4TtKu7i2rEEGsB")
const GITHUB_SECRET = cleanString("520a28f544373adee3cabec3b3142c11370b63a9")

console.log("[AUTH-TRIMMED] Client ID length:", GITHUB_ID.length)
console.log("[AUTH-TRIMMED] Client ID:", JSON.stringify(GITHUB_ID))

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
      authorization: {
        params: {
          scope: 'read:user user:email repo'
        }
      },
      // Override the authorization URL construction
      authorizationUrl: "https://github.com/login/oauth/authorize",
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token?.accessToken) {
        (session as any).accessToken = token.accessToken
      }
      return session
    },
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token
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
  }
}