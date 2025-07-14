import { NextResponse } from 'next/server'

export async function GET() {
  // Direct OAuth URL without using NextAuth
  const clientId = "Ov23li4TtKu7i2rEEGsB"
  const redirectUri = "https://code-focus-nnnnicholas.vercel.app/api/auth/callback/github"
  const scope = "read:user user:email repo"
  
  const oauthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`
  
  // Redirect directly to GitHub OAuth
  return NextResponse.redirect(oauthUrl)
}