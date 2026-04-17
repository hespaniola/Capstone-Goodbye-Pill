import { randomUUID } from 'node:crypto'
import { createServer } from 'node:http'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defaultMoodId, getMoodById, moodCatalog } from '../shared/moods.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, 'data')
const storePath = join(dataDir, 'store.json')
const port = Number(process.env.PORT) || 3001
const host = process.env.HOST || '127.0.0.1'

const defaultStore = {
  users: [],
  journalEntries: [],
}

const jsonHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Content-Type': 'application/json',
}

function createHttpError(status, message) {
  const error = new Error(message)
  error.status = status
  return error
}

async function ensureStore() {
  await mkdir(dataDir, { recursive: true })

  try {
    await readFile(storePath, 'utf8')
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error
    }

    await writeStore(defaultStore)
  }
}

async function readStore() {
  await ensureStore()
  const raw = await readFile(storePath, 'utf8')
  return JSON.parse(raw)
}

async function writeStore(store) {
  await mkdir(dataDir, { recursive: true })
  await writeFile(storePath, JSON.stringify(store, null, 2))
}

async function parseBody(req) {
  return await new Promise((resolve, reject) => {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk
    })

    req.on('end', () => {
      if (!body) {
        resolve({})
        return
      }

      try {
        resolve(JSON.parse(body))
      } catch {
        reject(createHttpError(400, 'Invalid JSON body.'))
      }
    })

    req.on('error', reject)
  })
}

function sendJson(res, status, payload) {
  res.writeHead(status, jsonHeaders)
  res.end(JSON.stringify(payload))
}

function normalizeEmail(email) {
  return String(email ?? '').trim().toLowerCase()
}

function serializeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    activeMoodId: user.activeMoodId,
  }
}

function getUserId(req) {
  const userId = req.headers['x-user-id']
  return typeof userId === 'string' ? userId : ''
}

function getAuthedUser(store, req) {
  const userId = getUserId(req)

  if (!userId) {
    throw createHttpError(401, 'Login required.')
  }

  const user = store.users.find((entry) => entry.id === userId)

  if (!user) {
    throw createHttpError(401, 'User not found. Please log in again.')
  }

  return user
}

function getUserEntries(store, userId) {
  return store.journalEntries
    .filter((entry) => entry.userId === userId)
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
}

function buildSessionSummary(store, user) {
  const activeMood = getMoodById(user.activeMoodId)
  const entries = getUserEntries(store, user.id)
  const resetsCompleted = entries.length
  const tokensAvailable = user.startingTokens + resetsCompleted * 10
  const latestJournalEntry = entries[0] ?? null

  return {
    user: serializeUser(user),
    activeMoodId: activeMood.id,
    stats: {
      resetsCompleted,
      tokensAvailable,
      journalEntriesCount: entries.length,
    },
    latestJournalEntry,
    recommendedAction: latestJournalEntry
      ? 'Review your latest reflection, then choose one calm action you can finish today.'
      : activeMood.recommendation,
  }
}

function truncate(text, length = 140) {
  const value = String(text ?? '').trim()

  if (value.length <= length) {
    return value
  }

  return `${value.slice(0, length - 3)}...`
}

function buildRecommendations(store, user) {
  const session = buildSessionSummary(store, user)
  const activeMood = getMoodById(session.activeMoodId)
  const latestEntryPreview = session.latestJournalEntry ? truncate(session.latestJournalEntry.content) : ''

  return {
    activeMoodId: activeMood.id,
    moodRecommendation: activeMood.recommendation,
    journalInsight: latestEntryPreview
      ? `Your latest reflection points to this theme: ${latestEntryPreview}`
      : 'You have not saved a reflection yet. A short journal entry will make the next step more personal.',
    nextStep: session.latestJournalEntry
      ? 'Take one breathing reset, then pick one small task that would reduce today’s emotional weight.'
      : 'Start with the breathing page, then come back and write one honest sentence about what you want to release.',
  }
}

function buildAuthResponse(store, user) {
  return {
    user: serializeUser(user),
    session: buildSessionSummary(store, user),
  }
}

async function handleRequest(req, res) {
  if (req.method === 'OPTIONS') {
    sendJson(res, 200, { ok: true })
    return
  }

  const url = new URL(req.url, `http://${req.headers.host}`)
  const { pathname } = url
  const store = await readStore()

  if (req.method === 'GET' && pathname === '/api/health') {
    sendJson(res, 200, {
      ok: true,
      users: store.users.length,
      journalEntries: store.journalEntries.length,
    })
    return
  }

  if (req.method === 'GET' && pathname === '/api/moods') {
    sendJson(res, 200, { moods: moodCatalog })
    return
  }

  if (req.method === 'POST' && pathname === '/api/auth/signup') {
    const body = await parseBody(req)
    const name = String(body.name ?? '').trim()
    const email = normalizeEmail(body.email)
    const password = String(body.password ?? '').trim()

    if (!name || !email || !password) {
      throw createHttpError(400, 'Name, email, and password are required.')
    }

    if (store.users.some((user) => user.email === email)) {
      throw createHttpError(409, 'An account with that email already exists.')
    }

    const user = {
      id: randomUUID(),
      name,
      email,
      password,
      activeMoodId: defaultMoodId,
      startingTokens: 40,
      createdAt: new Date().toISOString(),
    }

    store.users.push(user)
    await writeStore(store)
    sendJson(res, 201, buildAuthResponse(store, user))
    return
  }

  if (req.method === 'POST' && pathname === '/api/auth/login') {
    const body = await parseBody(req)
    const email = normalizeEmail(body.email)
    const password = String(body.password ?? '').trim()

    const user = store.users.find((entry) => entry.email === email && entry.password === password)

    if (!user) {
      throw createHttpError(401, 'Invalid email or password.')
    }

    sendJson(res, 200, buildAuthResponse(store, user))
    return
  }

  if (req.method === 'GET' && pathname === '/api/session') {
    const user = getAuthedUser(store, req)
    sendJson(res, 200, buildSessionSummary(store, user))
    return
  }

  if (req.method === 'POST' && pathname === '/api/session/mood') {
    const user = getAuthedUser(store, req)
    const body = await parseBody(req)
    const nextMood = getMoodById(body.moodId)

    user.activeMoodId = nextMood.id

    await writeStore(store)
    sendJson(res, 200, buildSessionSummary(store, user))
    return
  }

  if (req.method === 'GET' && pathname === '/api/journal') {
    const user = getAuthedUser(store, req)
    sendJson(res, 200, { entries: getUserEntries(store, user.id) })
    return
  }

  if (req.method === 'POST' && pathname === '/api/journal') {
    const user = getAuthedUser(store, req)
    const body = await parseBody(req)
    const content = String(body.content ?? '').trim()

    if (!content) {
      throw createHttpError(400, 'Journal content is required.')
    }

    const entry = {
      id: randomUUID(),
      userId: user.id,
      moodId: user.activeMoodId,
      content,
      createdAt: new Date().toISOString(),
    }

    store.journalEntries.push(entry)
    await writeStore(store)
    sendJson(res, 201, {
      entry,
      session: buildSessionSummary(store, user),
    })
    return
  }

  if (req.method === 'GET' && pathname === '/api/recommendations') {
    const user = getAuthedUser(store, req)
    sendJson(res, 200, buildRecommendations(store, user))
    return
  }

  sendJson(res, 404, { error: 'Route not found.' })
}

const server = createServer(async (req, res) => {
  try {
    await handleRequest(req, res)
  } catch (error) {
    const status = error.status ?? 500
    sendJson(res, status, { error: error.message ?? 'Unexpected server error.' })
  }
})

server.listen(port, host, () => {
  console.log(`GoodbyePills API listening on http://${host}:${port}`)
})
