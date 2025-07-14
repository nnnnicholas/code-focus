import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth-debug'

export async function GET() {
  const providers = authOptions.providers || []
  const githubProvider = providers[0] as any
  
  const clientId = githubProvider?.options?.clientId || 'not-found'
  
  // Analyze the client ID character by character
  const analysis = {
    clientId: clientId,
    clientIdLength: clientId.length,
    clientIdCharCodes: Array.from(clientId).map((c: string, i: number) => ({
      index: i,
      char: c,
      charCode: c.charCodeAt(0),
      hex: c.charCodeAt(0).toString(16),
      description: getCharDescription(c.charCodeAt(0))
    })),
    hasNewline: clientId.includes('\n'),
    hasCarriageReturn: clientId.includes('\r'),
    hasSpace: clientId.includes(' '),
    trimmedLength: clientId.trim().length,
    differentAfterTrim: clientId !== clientId.trim(),
    encodedClientId: encodeURIComponent(clientId),
    directOAuthUrl: `https://github.com/login/oauth/authorize?client_id=${clientId}`,
    encodedOAuthUrl: `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(clientId)}`,
  }
  
  return NextResponse.json(analysis, { 
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    }
  })
}

function getCharDescription(charCode: number): string {
  const descriptions: Record<number, string> = {
    10: 'LINE FEED (\\n)',
    13: 'CARRIAGE RETURN (\\r)',
    32: 'SPACE',
    9: 'TAB',
    0: 'NULL'
  }
  return descriptions[charCode] || 'NORMAL'
}