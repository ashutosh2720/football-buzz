import { useEffect, useState } from 'react'
import {
  getFixtureDetails,
  getLiveFixtures,
  getStandings,
  getTopPlayers,
  getUpcomingFixtures,
  hasApiKey,
} from './apiFootball'
import {
  fixtures as fallbackFixtures,
  matches as fallbackMatches,
  playerStats as fallbackPlayerStats,
  standings as fallbackStandings,
} from './data'

function useAsyncData(loader, fallback, dependencies = []) {
  const [data, setData] = useState(fallback)
  const [loading, setLoading] = useState(hasApiKey)
  const [error, setError] = useState(
    hasApiKey ? null : 'Add VITE_FOOTBALL_DATA_API_KEY to load live data.',
  )
  const [isFallback, setIsFallback] = useState(!hasApiKey)

  useEffect(() => {
    let alive = true

    if (!hasApiKey) {
      return () => {
        alive = false
      }
    }

    loader()
      .then((result) => {
        if (!alive) return
        setData(result?.length === 0 ? fallback : result)
        setIsFallback(result?.length === 0)
      })
      .catch((apiError) => {
        if (!alive) return
        setData(fallback)
        setError(formatApiError(apiError))
        setIsFallback(true)
      })
      .finally(() => {
        if (alive) setLoading(false)
      })

    return () => {
      alive = false
    }
  }, dependencies)

  return { data, loading, error, isFallback }
}

function formatApiError(apiError) {
  if (apiError.message.includes('429')) {
    return 'Live API limit reached. Showing demo data for now; try again in a minute.'
  }

  return apiError.message
}

export function useLiveFixtures() {
  return useAsyncData(getLiveFixtures, fallbackMatches, [])
}

export function useUpcomingFixtures() {
  return useAsyncData(getUpcomingFixtures, fallbackFixtures, [])
}

export function useStandings() {
  return useAsyncData(getStandings, fallbackStandings, [])
}

export function useTopPlayers() {
  return useAsyncData(
    async () => {
      const result = await getTopPlayers()
      return result.scorers.length || result.assists.length ? result : fallbackPlayerStats
    },
    fallbackPlayerStats,
    [],
  )
}

export function useFixtureDetails(matchId) {
  const fallbackMatch =
    fallbackMatches.find((match) => String(match.id) === String(matchId)) || fallbackMatches[0]

  return useAsyncData(
    async () => {
      const result = await getFixtureDetails(matchId)
      return result ? [result] : [fallbackMatch]
    },
    [fallbackMatch],
    [matchId],
  )
}
