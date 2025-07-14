export default function TestOAuthFlow() {
  // Hardcoded clean OAuth URL
  const clientId = "Ov23li4TtKu7i2rEEGsB"
  const redirectUri = "https://code-focus-nnnnicholas.vercel.app/api/auth/callback/github"
  const scope = "read:user user:email repo"
  
  const oauthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">OAuth Test Flow</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-800 p-6 rounded">
          <h2 className="text-xl font-semibold mb-4">Direct OAuth Link (Working)</h2>
          <p className="mb-4">This link bypasses NextAuth completely:</p>
          <a 
            href={oauthUrl}
            className="inline-block bg-green-600 hover:bg-green-700 px-6 py-3 rounded"
          >
            Sign in with GitHub (Direct)
          </a>
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">OAuth URL:</p>
            <code className="block bg-gray-700 p-2 rounded text-xs break-all">
              {oauthUrl}
            </code>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded">
          <h2 className="text-xl font-semibold mb-4">Via API Route</h2>
          <p className="mb-4">This uses our direct API route:</p>
          <a 
            href="/api/oauth-direct-test"
            className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded"
          >
            Sign in with GitHub (API Route)
          </a>
        </div>

        <div className="bg-gray-800 p-6 rounded">
          <h2 className="text-xl font-semibold mb-4">OAuth Analysis</h2>
          <a 
            href="/oauth-analysis"
            className="inline-block bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded"
          >
            View OAuth Analysis
          </a>
        </div>
      </div>
    </div>
  )
}