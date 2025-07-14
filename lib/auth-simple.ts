import { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"

// Get environment variables with aggressive cleaning
const getCleanEnv = (key: string, fallback: string): string => {
  const value = process.env[key] || fallback
  // Remove all whitespace characters including newlines, carriage returns, tabs
  return value.replace(/\s/g, '')
}

const GITHUB_ID = getCleanEnv('GITHUB_ID', 'Ov23li4TtKu7i2rEEGsB')
const GITHUB_SECRET = getCleanEnv('GITHUB_SECRET', '520a28f544373adee3cabec3b3142c11370b63a9')

export const authOptions: NextAuthOptions = {
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