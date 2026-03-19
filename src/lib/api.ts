const DEFAULT_API_BASE_URL = '/api/proxy'

function normalizeBaseUrl(url: string) {
  return url.endsWith('/') ? url.slice(0, -1) : url
}

function getApiBaseUrl() {
  const configuredBaseUrl = normalizeBaseUrl(
    process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL
  )

  if (/^https?:\/\//i.test(configuredBaseUrl)) {
    return configuredBaseUrl
  }

  if (typeof window !== 'undefined') {
    return normalizeBaseUrl(new URL(configuredBaseUrl, window.location.origin).toString())
  }

  return normalizeBaseUrl(new URL(configuredBaseUrl, 'http://localhost').toString())
}

export function clearLegacyAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('salon_access_token')
  }
}

async function readResponseBody(response: Response) {
  const text = await response.text()

  if (!text.trim()) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {})

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
    ...options,
    credentials: options.credentials ?? 'include',
    headers,
  })

  if (!response.ok) {
    let errorDesc = response.statusText

    const errorBody = await readResponseBody(response)

    if (typeof errorBody === 'string' && errorBody.trim()) {
      errorDesc = errorBody
    } else if (errorBody && typeof errorBody === 'object') {
      if ('message' in errorBody && typeof errorBody.message === 'string') {
        errorDesc = errorBody.message
      } else if ('error' in errorBody && typeof errorBody.error === 'string') {
        errorDesc = errorBody.error
      }
    }

    throw new Error(`API Error: ${response.status} ${errorDesc}`)
  }

  if (response.status === 204) {
    return {} as T
  }

  const body = await readResponseBody(response)

  if (body === null) {
    return {} as T
  }

  return body as T
}
