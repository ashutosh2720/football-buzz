/* global process */

const FOOTBALL_DATA_BASE_URL = 'https://api.football-data.org/v4'
const CACHE_TTL_SECONDS = 300

export default async function handler(request, response) {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY || process.env.VITE_FOOTBALL_DATA_API_KEY

  if (!apiKey) {
    response.status(500).json({ message: 'Missing FOOTBALL_DATA_API_KEY' })
    return
  }

  const requestUrl = new URL(request.url, `https://${request.headers.host}`)
  const upstreamPath = requestUrl.pathname.replace(/^\/api\/football-data/, '') || '/'
  const upstreamUrl = new URL(`${FOOTBALL_DATA_BASE_URL}${upstreamPath}`)
  requestUrl.searchParams.forEach((value, key) => {
    upstreamUrl.searchParams.set(key, value)
  })

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      headers: {
        'X-Auth-Token': apiKey,
      },
    })
    const body = await upstreamResponse.text()

    response.status(upstreamResponse.status)
    response.setHeader(
      'content-type',
      upstreamResponse.headers.get('content-type') || 'application/json',
    )

    if (upstreamResponse.ok) {
      response.setHeader(
        'cache-control',
        `s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=${CACHE_TTL_SECONDS}`,
      )
    }

    response.send(body)
  } catch {
    response.status(502).json({ message: 'Unable to reach football-data.org' })
  }
}
