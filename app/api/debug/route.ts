import { NextResponse } from 'next/server'

export async function GET() {
  const githubId = process.env.GITHUB_ID
  const githubIdLength = githubId ? githubId.length : 0
  const githubIdCharCodes = githubId ? Array.from(githubId).map(c => c.charCodeAt(0)) : []
  
  return NextResponse.json({
    GITHUB_ID_length: githubIdLength,
    GITHUB_ID_last_char_code: githubIdCharCodes[githubIdCharCodes.length - 1],
    GITHUB_ID_char_codes: githubIdCharCodes,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NODE_ENV: process.env.NODE_ENV
  })
}