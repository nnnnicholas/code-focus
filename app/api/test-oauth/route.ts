import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.GITHUB_ID
  const clientSecret = process.env.GITHUB_SECRET
  const nextAuthUrl = process.env.NEXTAUTH_URL
  
  // Manually construct the OAuth URL
  const params = new URLSearchParams({
    client_id: clientId || '',
    redirect_uri: `${nextAuthUrl}/api/auth/callback/github`,
    response_type: 'code',
    scope: 'read:user user:email repo'
  })
  
  const oauthUrl = `https://github.com/login/oauth/authorize?${params.toString()}`
  
  return NextResponse.json({
    clientId,
    clientIdLength: clientId?.length,
    hasTrailingNewline: clientId?.endsWith('\n'),
    nextAuthUrl,
    constructedOAuthUrl: oauthUrl,
    encodedClientId: encodeURIComponent(clientId || '')
  })
}