'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'

interface RepoStats {
  name: string
  owner: string
  commitCount: number
  linesAdded: number
  linesDeleted: number
  totalLines: number
  lastCommitDate: string
  isPrivate: boolean
}


export default function Dashboard() {
  const { data: session } = useSession()
  const [repos, setRepos] = useState<RepoStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [days, setDays] = useState(5)

  const fetchCommitData = async (forceRefresh = false) => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        days: days.toString(),
        ...(forceRefresh && { refresh: 'true' })
      })
      const url = `/api/stats?${params}`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch commit data')
      }
      
      const data = await response.json()
      setRepos(data.repos)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCommitData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your commit data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Code Focus</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome back, {session?.user?.name || 'User'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => fetchCommitData(true)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Refresh
              </button>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Your Activity (Last {days} Days)
            </h2>
            <div className="flex gap-2">
              {[3, 5, 7, 30].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    days === d
                      ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {d} days
                </button>
              ))}
            </div>
          </div>
          {lastUpdated && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last updated: {format(lastUpdated, 'PPpp')}
            </p>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 rounded-md">
            Error: {error}
          </div>
        )}

        {repos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No commits found in the last 72 hours.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {repos.map((repo, index) => (
              <div
                key={`${repo.owner}/${repo.name}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      #{index + 1} {repo.owner}/{repo.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {repo.isPrivate ? '🔒 Private' : '🌐 Public'} Repository
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {repo.totalLines.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      lines changed
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Commits</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {repo.commitCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Lines Added</p>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                      +{repo.linesAdded.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Lines Deleted</p>
                    <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                      -{repo.linesDeleted.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Last commit: {format(new Date(repo.lastCommitDate), 'PPp')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}