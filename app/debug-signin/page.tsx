'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function DebugSignIn() {
  const [debugInfo, setDebugInfo] = useState<string>('')

  const handleSignIn = async () => {
    try {
      // Get the OAuth URL
      const response = await fetch('/api/auth/signin/github', {
        method: 'GET',
        redirect: 'manual'
      })
      
      const location = response.headers.get('location')
      setDebugInfo(`Redirect URL: ${location}`)
      
      // Copy to clipboard
      if (location) {
        navigator.clipboard.writeText(location)
      }
    } catch (error) {
      setDebugInfo(`Error: ${error}`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-2xl w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">Debug OAuth URL</h2>
        
        <div className="space-y-4">
          <button
            onClick={handleSignIn}
            className="w-full px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            Get OAuth URL (Won\'t Redirect)
          </button>
          
          <button
            onClick={() => signIn('github')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Normal Sign In (Will Redirect)
          </button>
          
          {debugInfo && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <p className="text-xs font-mono break-all">{debugInfo}</p>
              <p className="text-xs text-gray-600 mt-2">URL copied to clipboard!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}