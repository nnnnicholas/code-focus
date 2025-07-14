import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { Octokit } from '@octokit/rest'
import { authOptions } from '@/lib/auth'
import { subDays } from 'date-fns'
import { cache } from '@/lib/cache'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if we want to force refresh
    const { searchParams } = new URL(request.url)
    const forceRefresh = searchParams.get('refresh') === 'true'
    const daysParam = searchParams.get('days') || '5'
    const days = parseInt(daysParam, 10)
    
    // Try to get from cache first
    const cacheKey = `stats:${session.user.id}:${days}`
    if (!forceRefresh) {
      const cachedData = cache.get(cacheKey)
      if (cachedData) {
        return NextResponse.json({
          ...cachedData,
          fromCache: true
        })
      }
    }

    // Use the user's GitHub token from their OAuth session
    const userToken = (session as any).token?.accessToken as string | undefined
    
    if (!userToken) {
      return NextResponse.json({ error: 'No GitHub access token found' }, { status: 401 })
    }
    
    const octokit = new Octokit({
      auth: userToken,
    })

    // Get username from the authenticated session
    const username = ((session as any).token?.username || session.user?.name) as string
    const since = subDays(new Date(), days).toISOString()
    
    // Get all repositories (including private ones) for authenticated user
    // Limit to 50 most recently pushed repos to speed up the API
    const { data: repos } = await octokit.repos.listForAuthenticatedUser({
      per_page: 50,
      sort: 'pushed',
      type: 'all'
    })

    // Also get repos from organizations
    const { data: orgs } = await octokit.orgs.listForAuthenticatedUser({
      per_page: 100
    })

    let allRepos: any[] = [...repos]

    // Get repos from each organization
    for (const org of orgs) {
      const { data: orgRepos } = await octokit.repos.listForOrg({
        org: org.login,
        per_page: 100
      })
      allRepos = [...allRepos, ...orgRepos]
    }

    // Get commits for each repository
    const repoStats = []
    
    for (const repo of allRepos) {
      try {
        // Skip if repo hasn't been pushed to recently
        if (repo.pushed_at && new Date(repo.pushed_at) < new Date(since)) {
          continue
        }

        const { data: commits } = await octokit.repos.listCommits({
          owner: repo.owner.login,
          repo: repo.name,
          author: username,
          since,
          per_page: 100
        })
        
        // Debug log for repos with commits
        if (commits.length > 0) {
          console.log(`Found ${commits.length} commits in ${repo.owner.login}/${repo.name}`)
        }

        if (commits.length > 0) {
          let linesAdded = 0
          let linesDeleted = 0

          // Get detailed commit info for line counts
          for (const commit of commits) {
            try {
              const { data: commitDetail } = await octokit.repos.getCommit({
                owner: repo.owner.login,
                repo: repo.name,
                ref: commit.sha
              })

              linesAdded += commitDetail.stats?.additions || 0
              linesDeleted += commitDetail.stats?.deletions || 0
            } catch (error) {
              console.error(`Error fetching commit details for ${commit.sha}:`, error)
            }
          }

          repoStats.push({
            name: repo.name,
            owner: repo.owner.login,
            commitCount: commits.length,
            linesAdded,
            linesDeleted,
            totalLines: linesAdded + linesDeleted,
            lastCommitDate: commits[0].commit.author?.date || new Date().toISOString(),
            isPrivate: repo.private
          })
        }
      } catch (error) {
        console.error(`Error fetching commits for ${repo.full_name}:`, error)
      }
    }

    // Sort by total lines changed (descending)
    repoStats.sort((a, b) => b.totalLines - a.totalLines)

    const responseData = {
      repos: repoStats,
      totalRepos: repoStats.length,
      totalCommits: repoStats.reduce((sum, repo) => sum + repo.commitCount, 0),
      totalLinesChanged: repoStats.reduce((sum, repo) => sum + repo.totalLines, 0)
    }

    // Cache the result
    cache.set(cacheKey, responseData)

    return NextResponse.json({
      ...responseData,
      fromCache: false
    })
  } catch (error) {
    console.error('Error in stats API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch commit statistics' },
      { status: 500 }
    )
  }
}