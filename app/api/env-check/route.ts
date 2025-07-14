import { NextResponse } from 'next/server'

export async function GET() {
  // Check raw environment variables
  const githubId = process.env.GITHUB_ID
  const githubSecret = process.env.GITHUB_SECRET
  
  // Analyze character by character
  const analysis = {
    GITHUB_ID: {
      value: githubId,
      length: githubId?.length,
      lastChar: githubId ? githubId.charCodeAt(githubId.length - 1) : null,
      lastCharHex: githubId ? githubId.charCodeAt(githubId.length - 1).toString(16) : null,
      endsWithNewline: githubId?.endsWith('\n'),
      endsWithCarriageReturn: githubId?.endsWith('\r'),
      trimmedLength: githubId?.trim().length,
      raw: JSON.stringify(githubId),
    },
    GITHUB_SECRET: {
      exists: !!githubSecret,
      length: githubSecret?.length,
      lastChar: githubSecret ? githubSecret.charCodeAt(githubSecret.length - 1) : null,
      endsWithNewline: githubSecret?.endsWith('\n'),
      trimmedLength: githubSecret?.trim().length,
    },
    // Check if AUTH_ prefixed vars exist (NextAuth v5 style)
    AUTH_GITHUB_ID: {
      exists: !!process.env.AUTH_GITHUB_ID,
      value: process.env.AUTH_GITHUB_ID,
    },
    AUTH_GITHUB_SECRET: {
      exists: !!process.env.AUTH_GITHUB_SECRET,
    },
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL,
  }
  
  return NextResponse.json(analysis)
}