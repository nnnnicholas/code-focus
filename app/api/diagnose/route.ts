import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth-minimal'

export async function GET() {
  // Get the GitHub provider config
  const githubProvider = authOptions.providers[0]
  
  // Extract the client ID from the provider
  let clientId = 'unknown'
  if ('options' in githubProvider && githubProvider.options) {
    clientId = githubProvider.options.clientId || 'not found'
  }
  
  return NextResponse.json({
    message: 'Diagnostic info',
    authConfigUsed: 'auth-minimal',
    providerId: githubProvider.id,
    providerName: githubProvider.name,
    clientIdFromConfig: clientId,
    clientIdLength: clientId.length,
    clientIdCharCodes: [...clientId].map((c, i) => `[${i}]: '${c}' (${c.charCodeAt(0)})`),
    lastCharCode: clientId.charCodeAt(clientId.length - 1),
    hasNewline: clientId.includes('\n'),
    trimmedEquals: clientId === clientId.trim(),
    deployment: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown'
  })
}