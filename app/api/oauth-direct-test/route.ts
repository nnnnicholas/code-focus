import { NextResponse } from 'next/server'

export async function GET() {
  // Hardcoded clean values
  const clientId = "Ov23li4TtKu7i2rEEGsB"
  const redirectUri = "https://code-focus-nnnnicholas.vercel.app/api/auth/callback/github"
  const scope = "read:user user:email repo"
  
  // Build OAuth URL manually
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scope,
    response_type: "code"
  })
  
  const oauthUrl = `https://github.com/login/oauth/authorize?${params.toString()}`
  
  // Return a redirect response
  return NextResponse.redirect(oauthUrl)
}