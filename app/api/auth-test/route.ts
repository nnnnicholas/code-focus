import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  
  // Simulate what NextAuth does
  const clientId = process.env.GITHUB_ID
  const baseUrl = process.env.NEXTAUTH_URL || `https://${request.headers.get('host')}`
  
  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize')
  githubAuthUrl.searchParams.append('client_id', clientId || '')
  githubAuthUrl.searchParams.append('redirect_uri', `${baseUrl}/api/auth/callback/github`)
  githubAuthUrl.searchParams.append('response_type', 'code')
  githubAuthUrl.searchParams.append('scope', 'read:user user:email repo')
  
  return NextResponse.json({
    env_GITHUB_ID: clientId,
    env_GITHUB_ID_length: clientId?.length,
    env_GITHUB_ID_trimmed: clientId?.trim(),
    env_GITHUB_ID_trimmed_length: clientId?.trim().length,
    env_NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    detected_host: request.headers.get('host'),
    constructed_base_url: baseUrl,
    github_oauth_url: githubAuthUrl.toString(),
    github_oauth_url_decoded: decodeURIComponent(githubAuthUrl.toString())
  })
}