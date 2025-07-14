'use client'

export default function ManualOAuth() {
  const clientId = "Ov23li4TtKu7i2rEEGsB"
  const redirectUri = "https://code-focus-nnnnicholas.vercel.app/api/auth/callback/github"
  const scope = "read:user user:email repo"
  
  const handleLogin = () => {
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: scope
    })
    
    const url = `https://github.com/login/oauth/authorize?${params.toString()}`
    window.location.href = url
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">Manual OAuth Test</h2>
        <p className="text-sm text-gray-600">
          This bypasses NextAuth completely and creates the OAuth URL manually.
        </p>
        <button
          onClick={handleLogin}
          className="w-full px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
        >
          Login with GitHub (Manual)
        </button>
      </div>
    </div>
  )
}