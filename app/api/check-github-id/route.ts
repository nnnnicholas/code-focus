import { NextResponse } from 'next/server'

export async function GET() {
  const githubId = process.env.GITHUB_ID
  
  return NextResponse.json({
    GITHUB_ID: {
      exists: !!githubId,
      length: githubId?.length,
      value: githubId,
      raw: JSON.stringify(githubId),
      hexDump: githubId ? Array.from(githubId).map((c, i) => ({
        index: i,
        char: c,
        charCode: c.charCodeAt(0),
        hex: '0x' + c.charCodeAt(0).toString(16)
      })) : null,
      endsWithNewline: githubId?.endsWith('\n'),
      endsWithCarriageReturn: githubId?.endsWith('\r'),
      trimmedLength: githubId?.trim().length,
      lastChar: githubId ? githubId.charCodeAt(githubId.length - 1) : null,
      lastCharHex: githubId ? '0x' + githubId.charCodeAt(githubId.length - 1).toString(16) : null
    }
  })
}