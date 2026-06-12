const API_BASE_URL = import.meta.env.VITE_FOOTBALL_DATA_API_BASE_URL || '/api/football-data'
const DEFAULT_COMPETITION = import.meta.env.VITE_FOOTBALL_DATA_COMPETITION || 'PL'
const requestCache = new Map()

export const hasApiKey = true

async function requestJson(url) {
  const cacheKey = url.toString()
  const cachedRequest = requestCache.get(cacheKey)
  if (cachedRequest) {
    console.log('[football-data] using browser cache:', url.pathname, url.search)
    return cachedRequest
  }

  console.log('[football-data] fetching:', url.pathname, url.search)

  const request = fetch(url)
    .then(async (response) => {
      console.log('[football-data] response:', {
        path: url.pathname,
        status: response.status,
        ok: response.ok,
      })

      if (!response.ok) {
        const retryAfter = response.headers.get('retry-after')
        const suffix = retryAfter ? `, try again in ${retryAfter} seconds` : ''
        let serverMessage

        try {
          const errorPayload = await response.clone().json()
          serverMessage = errorPayload.message ? `: ${errorPayload.message}` : ''
        } catch {
          try {
            const errorText = await response.clone().text()
            serverMessage = errorText ? `: ${errorText.slice(0, 120)}` : ''
          } catch {
            serverMessage = ''
          }
        }

        throw new Error(`football-data.org request failed: ${response.status}${serverMessage || ''}${suffix}`)
      }

      const payload = await response.json()
      console.log('[football-data] payload:', {
        path: url.pathname,
        matches: payload.matches?.length,
        standings: payload.standings?.length,
        scorers: payload.scorers?.length,
      })

      return payload
    })
    .catch((error) => {
      console.error('[football-data] error:', {
        path: url.pathname,
        message: error.message,
      })
      requestCache.delete(cacheKey)
      throw error
    })

  requestCache.set(cacheKey, request)
  return request
}

async function apiFetch(path, params = {}) {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })

  return requestJson(url)
}

function formatDate(dateString) {
  if (!dateString) return ''
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(dateString))
}

function formatTime(dateString) {
  if (!dateString) return ''
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  }).format(new Date(dateString))
}

function normalizeStatus(status) {
  if (['IN_PLAY', 'PAUSED'].includes(status)) return status === 'PAUSED' ? 'Half Time' : 'Live'
  if (['SCHEDULED', 'TIMED'].includes(status)) return 'Upcoming'
  if (status === 'FINISHED') return 'Finished'
  return 'Upcoming'
}

export function mapFixture(apiFixture) {
  const status = normalizeStatus(apiFixture.status)
  const homeScore = apiFixture.score?.fullTime?.home ?? apiFixture.score?.halfTime?.home
  const awayScore = apiFixture.score?.fullTime?.away ?? apiFixture.score?.halfTime?.away

  return {
    id: String(apiFixture.id),
    league: apiFixture.competition?.name || '-',
    status,
    minute: null,
    home: apiFixture.homeTeam?.name || '-',
    away: apiFixture.awayTeam?.name || '-',
    homeLogo: apiFixture.homeTeam?.crest,
    awayLogo: apiFixture.awayTeam?.crest,
    homeScore,
    awayScore,
    venue: apiFixture.area?.name || '',
    note: apiFixture.status,
    kickoff: `${formatTime(apiFixture.utcDate)} IST`,
    date: formatDate(apiFixture.utcDate),
    time: formatTime(apiFixture.utcDate),
    stage: apiFixture.stage || apiFixture.group || '',
    tag: status,
    stats: null,
    timeline: [],
  }
}

export function mapFixtureStats(statsResponse) {
  const [home, away] = statsResponse
  if (!home || !away) return null

  function statValue(team, type, fallback = 0) {
    const stat = team.statistics.find((item) => item.type === type)
    const value = stat?.value
    if (typeof value === 'string' && value.endsWith('%')) return Number(value.replace('%', ''))
    return Number(value ?? fallback)
  }

  return {
    possession: [statValue(home, 'Ball Possession'), statValue(away, 'Ball Possession')],
    shots: [statValue(home, 'Total Shots'), statValue(away, 'Total Shots')],
    corners: [statValue(home, 'Corner Kicks'), statValue(away, 'Corner Kicks')],
    fouls: [statValue(home, 'Fouls'), statValue(away, 'Fouls')],
  }
}

export function mapEvents(eventsResponse) {
  return eventsResponse.map((event) => ({
    min: event.time.elapsed,
    type: event.type,
    text: `${event.player?.name || 'Unknown'}${event.detail ? ` - ${event.detail}` : ''}`,
  }))
}

export function mapStanding(row) {
  return {
    team: row.team.name,
    logo: row.team.crest,
    played: row.playedGames,
    won: row.won,
    drawn: row.draw,
    lost: row.lost,
    gd: row.goalDifference > 0 ? `+${row.goalDifference}` : String(row.goalDifference),
    points: row.points,
    form: '-',
  }
}

export function mapPlayer(playerRow) {
  return {
    id: String(playerRow.player?.id || playerRow.player?.name),
    name: playerRow.player?.name || '-',
    photo: null,
    team: playerRow.team?.name || '-',
    teamLogo: playerRow.team?.crest,
    goals: playerRow.goals || 0,
    assists: '-',
    rating: '-',
    appearances: '-',
  }
}

export async function getLiveFixtures() {
  const payload = await apiFetch('/matches', { status: 'LIVE' })
  const fixtures = (payload.matches || []).map(mapFixture)
  console.log('[football-data] live fixtures mapped:', fixtures)
  return fixtures
}

export async function getUpcomingFixtures() {
  const today = new Date()
  const nextTenDays = new Date()
  nextTenDays.setDate(today.getDate() + 10)

  const payload = await apiFetch('/matches', {
    dateFrom: today.toISOString().slice(0, 10),
    dateTo: nextTenDays.toISOString().slice(0, 10),
    status: 'SCHEDULED',
  })
  const fixtures = (payload.matches || []).slice(0, 24).map(mapFixture)
  console.log('[football-data] upcoming fixtures mapped:', fixtures)
  return fixtures
}

export async function getFixtureDetails(fixtureId) {
  const fixture = await apiFetch(`/matches/${fixtureId}`)
  const mappedFixture = fixture ? mapFixture(fixture) : null
  console.log('[football-data] fixture details mapped:', mappedFixture)
  return mappedFixture
}

export async function getStandings(competition = DEFAULT_COMPETITION) {
  const payload = await apiFetch(`/competitions/${competition}/standings`)
  const standings = payload.standings?.find((standing) => standing.type === 'TOTAL')?.table || []
  const table = standings.map(mapStanding)
  console.log('[football-data] standings mapped:', table)
  return table
}

export async function getTopPlayers(competition = DEFAULT_COMPETITION) {
  const payload = await apiFetch(`/competitions/${competition}/scorers`, { limit: 10 })

  const players = {
    scorers: (payload.scorers || []).slice(0, 10).map(mapPlayer),
    assists: [],
  }
  console.log('[football-data] top players mapped:', players)
  return players
}
