const USER_STORAGE_KEY = 'goodbyepills-user-id'
const API_BASE = '/api'

function isBrowser() {
  return typeof window !== 'undefined'
}

export function getStoredUserId() {
  if (!isBrowser()) {
    return ''
  }

  return window.localStorage.getItem(USER_STORAGE_KEY) ?? ''
}

function setStoredUserId(userId) {
  if (!isBrowser()) {
    return
  }

  window.localStorage.setItem(USER_STORAGE_KEY, userId)
}

export function clearStoredUserId() {
  if (!isBrowser()) {
    return
  }

  window.localStorage.removeItem(USER_STORAGE_KEY)
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers ?? {})
  const userId = getStoredUserId()

  if (options.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (userId) {
    headers.set('x-user-id', userId)
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401) {
      clearStoredUserId()
    }

    throw new Error(data?.error ?? 'Request failed.')
  }

  return data
}

export async function signup(payload) {
  const data = await request('/auth/signup', {
    method: 'POST',
    body: payload,
  })

  setStoredUserId(data.user.id)
  return data
}

export async function login(payload) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: payload,
  })

  setStoredUserId(data.user.id)
  return data
}

export function logout() {
  clearStoredUserId()
}

export function getSessionSummary() {
  return request('/session')
}

export function saveMoodSelection(moodId) {
  return request('/session/mood', {
    method: 'POST',
    body: { moodId },
  })
}

export function createJournalEntry(content) {
  return request('/journal', {
    method: 'POST',
    body: { content },
  })
}

export function getRecommendations() {
  return request('/recommendations')
}

