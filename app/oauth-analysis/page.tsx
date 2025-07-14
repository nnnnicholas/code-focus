'use client'

import { useEffect, useState } from 'react'
import { signIn, getProviders } from 'next-auth/react'

export default function OAuthAnalysisPage() {
  const [providers, setProviders] = useState<any>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch providers
    getProviders().then(setProviders)
    
    // Fetch OAuth trace analysis
    fetch('/api/oauth-trace')
      .then(res => res.json())
      .then(data => {
        setAnalysis(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch analysis:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">OAuth Analysis</h1>
      
      {loading ? (
        <p>Loading analysis...</p>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Client ID Analysis</h2>
            {analysis && (
              <div className="bg-gray-800 p-4 rounded">
                <p className="mb-2">Client ID: <code className="bg-gray-700 px-2 py-1 rounded">{analysis.clientId}</code></p>
                <p className="mb-2">Length: {analysis.clientIdLength}</p>
                <p className="mb-2">Has newline: {analysis.hasNewline ? 'YES ❌' : 'NO ✅'}</p>
                <p className="mb-2">Different after trim: {analysis.differentAfterTrim ? 'YES ❌' : 'NO ✅'}</p>
                <p className="mb-2">Encoded: <code className="bg-gray-700 px-2 py-1 rounded break-all">{analysis.encodedClientId}</code></p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">Character Analysis:</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-2">Index</th>
                        <th className="text-left p-2">Char</th>
                        <th className="text-left p-2">Code</th>
                        <th className="text-left p-2">Hex</th>
                        <th className="text-left p-2">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.clientIdCharCodes?.map((char: any) => (
                        <tr key={char.index} className={char.description !== 'NORMAL' ? 'bg-red-900' : ''}>
                          <td className="p-2">{char.index}</td>
                          <td className="p-2 font-mono">{char.char}</td>
                          <td className="p-2">{char.charCode}</td>
                          <td className="p-2 font-mono">0x{char.hex}</td>
                          <td className="p-2">{char.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">OAuth URLs</h2>
            {analysis && (
              <div className="bg-gray-800 p-4 rounded space-y-4">
                <div>
                  <p className="font-semibold mb-2">Direct URL (unencoded client_id):</p>
                  <code className="block bg-gray-700 p-2 rounded break-all text-xs">
                    {analysis.directOAuthUrl}
                  </code>
                </div>
                <div>
                  <p className="font-semibold mb-2">Encoded URL (encoded client_id):</p>
                  <code className="block bg-gray-700 p-2 rounded break-all text-xs">
                    {analysis.encodedOAuthUrl}
                  </code>
                </div>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">NextAuth Providers</h2>
            <div className="bg-gray-800 p-4 rounded">
              <pre>{JSON.stringify(providers, null, 2)}</pre>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded"
            >
              Refresh Analysis
            </button>
            
            <button
              onClick={() => signIn('github')}
              className="ml-4 bg-green-600 hover:bg-green-700 px-6 py-2 rounded"
            >
              Test Sign In
            </button>
          </div>
        </>
      )}
    </div>
  )
}