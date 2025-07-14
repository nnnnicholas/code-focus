import { NextAuthOptions } from "next-auth"
import { OAuthConfig, OAuthUserConfig } from "next-auth/providers"

// Custom GitHub provider that ensures clean client ID
function GitHubProvider<P extends Record<string, any> = any>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  // Clean the client ID and secret
  const cleanClientId = (options.clientId || "").toString().trim().replace(/[\r\n]/g, '')
  const cleanClientSecret = (options.clientSecret || "").toString().trim().replace(/[\r\n]/g, '')
  
  console.log("[AUTH-FINAL] Original clientId length:", options.clientId?.length)
  console.log("[AUTH-FINAL] Cleaned clientId length:", cleanClientId.length)
  console.log("[AUTH-FINAL] Cleaned clientId:", JSON.stringify(cleanClientId))
  
  return {
    id: "github",
    name: "GitHub",
    type: "oauth",
    authorization: {
      url: "https://github.com/login/oauth/authorize",
      params: {
        scope: "read:user user:email repo",
        client_id: cleanClientId // Explicitly set client_id in params
      }
    },
    token: {
      url: "https://github.com/login/oauth/access_token",
      params: {
        client_id: cleanClientId,
        client_secret: cleanClientSecret
      }
    },
    userinfo: "https://api.github.com/user",
    profile(profile: any) {
      return {
        id: profile.id.toString(),
        name: profile.name || profile.login,
        email: profile.email,
        image: profile.avatar_url,
      }
    },
    options: {
      clientId: cleanClientId,
      clientSecret: cleanClientSecret,
      ...options
    }
  }
}

// Use environment variables or fallback to hardcoded values
const GITHUB_ID = (process.env.GITHUB_ID || "Ov23li4TtKu7i2rEEGsB").trim().replace(/[\r\n]/g, '')
const GITHUB_SECRET = (process.env.GITHUB_SECRET || "520a28f544373adee3cabec3b3142c11370b63a9").trim().replace(/[\r\n]/g, '')

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
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