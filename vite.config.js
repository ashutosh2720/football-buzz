import { cwd } from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const FOOTBALL_DATA_BASE_URL = 'https://api.football-data.org/v4'
const CACHE_TTL_MS = 10 * 60 * 1000
const footballDataCache = new Map()

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode
  res.setHeader('content-type', 'application/json')
  res.end(JSON.stringify(payload))
}

function footballDataProxy(apiKey) {
  return {
    name: 'football-data-proxy',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/football-data')) {
          next()
          return
        }

        if (!apiKey) {
          sendJson(res, 500, { message: 'Missing FOOTBALL_DATA_API_KEY' })
          return
        }

        const upstreamPath = req.url.replace(/^\/api\/football-data/, '') || '/'
        const upstreamUrl = new URL(`${FOOTBALL_DATA_BASE_URL}${upstreamPath}`)
        const cacheKey = upstreamUrl.toString()
        const cached = footballDataCache.get(cacheKey)
        const now = Date.now()

        if (cached && now - cached.createdAt < CACHE_TTL_MS) {
          res.statusCode = 200
          res.setHeader('content-type', 'application/json')
          res.setHeader('x-football-data-cache', 'hit')
          res.end(cached.body)
          return
        }

        try {
          const upstreamResponse = await fetch(upstreamUrl, {
            headers: {
              'X-Auth-Token': apiKey,
            },
          })
          const body = await upstreamResponse.text()

          if (upstreamResponse.ok) {
            footballDataCache.set(cacheKey, { body, createdAt: now })
          } else if (upstreamResponse.status === 429 && cached) {
            res.statusCode = 200
            res.setHeader('content-type', 'application/json')
            res.setHeader('x-football-data-cache', 'stale')
            res.end(cached.body)
            return
          }

          res.statusCode = upstreamResponse.status
          res.setHeader(
            'content-type',
            upstreamResponse.headers.get('content-type') || 'application/json',
          )
          res.end(body)
        } catch {
          if (cached) {
            res.statusCode = 200
            res.setHeader('content-type', 'application/json')
            res.setHeader('x-football-data-cache', 'stale')
            res.end(cached.body)
            return
          }

          sendJson(res, 502, { message: 'Unable to reach football-data.org' })
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, cwd(), '')

  return {
    plugins: [footballDataProxy(env.FOOTBALL_DATA_API_KEY || env.VITE_FOOTBALL_DATA_API_KEY), react()],
  }
})
