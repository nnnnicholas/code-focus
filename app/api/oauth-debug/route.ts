import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.GITHUB_ID
  
  // Create the exact OAuth URL that NextAuth would create
  const params = new URLSearchParams({
    client_id: clientId || '',
    redirect_uri: 'https://code-focus-nnnnicholas.vercel.app/api/auth/callback/github',
    response_type: 'code',
    scope: 'read:user user:email repo'
  })
  
  const oauthUrl = `https://github.com/login/oauth/authorize?${params.toString()}`
  
  // Test if the Client ID exists by making a request
  const testUrl = `https://api.github.com/applications/${clientId}`
  
  return NextResponse.json({
    clientId,
    clientIdCharCodes: clientId ? [...clientId].map(c => `${c}: ${c.charCodeAt(0)}`) : [],
    oauthUrl,
    oauthUrlDecoded: decodeURIComponent(oauthUrl),
    testUrl
  })
}