const DEFAULT_API_ORIGIN = 'http://localhost:8080'
const API_BASE_PATH = '/api/v1'

function normalizeBaseUrl(url: string) {
  return url.endsWith('/') ? url.slice(0, -1) : url
}

function appendApiBasePath(url: string) {
  const normalizedUrl = normalizeBaseUrl(url)
  return normalizedUrl.endsWith(API_BASE_PATH)
    ? normalizedUrl
    : `${normalizedUrl}${API_BASE_PATH}`
}

export function getApiBaseUrl(origin?: string) {
  const configuredBaseUrl = appendApiBasePath(
    process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_ORIGIN
  )

  if (/^https?:\/\//i.test(configuredBaseUrl)) {
    return configuredBaseUrl
  }

  return normalizeBaseUrl(new URL(configuredBaseUrl, origin || 'http://localhost').toString())
}

