'use client'

export default function TestSignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">OAuth Test Page</h2>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Click the link below to test GitHub OAuth directly:
          </p>
          
          <button
            onClick={() => window.location.href = '/api/auth/signin/github'}
            className="block w-full text-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            Sign in with GitHub (Direct Link)
          </button>
          
          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-gray-500">
              This bypasses any client-side JavaScript and goes directly to the NextAuth endpoint.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}