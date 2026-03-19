import { type NextRequest, NextResponse } from 'next/server'

const DEFAULT_BACKEND_BASE_URL = 'http://localhost:8080/api/v1'
const AUTH_COOKIE_NAME = 'SALON_AUTH'
const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7

function normalizeBaseUrl(url: string) {
  return url.endsWith('/') ? url.slice(0, -1) : url
}

function getBackendBaseUrl() {
  return normalizeBaseUrl(
    process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_BACKEND_BASE_URL
  )
}

function getTargetUrl(request: NextRequest, path: string[]) {
  const baseUrl = getBackendBaseUrl()
  const joinedPath = path.join('/')
  const target = new URL(joinedPath ? `${baseUrl}/${joinedPath}` : baseUrl)
  target.search = request.nextUrl.search
  return target
}

function getForwardHeaders(request: NextRequest) {
  const headers = new Headers()

  for (const name of ['accept', 'content-type', 'cookie', 'authorization']) {
    const value = request.headers.get(name)
    if (value) {
      headers.set(name, value)
    }
  }

  return headers
}

function getResponseHeaders(response: Response) {
  const headers = new Headers()

  for (const name of ['content-type', 'cache-control']) {
    const value = response.headers.get(name)
    if (value) {
      headers.set(name, value)
    }
  }

  return headers
}

function syncAuthCookie(
  response: NextResponse,
  pathname: string,
  backendSetCookieHeader: string | null
) {
  const secure = process.env.NODE_ENV === 'production'

  if (pathname.endsWith('/frontend/auth/logout')) {
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: '',
      maxAge: 0,
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure,
    })
    return
  }

  const tokenMatch = backendSetCookieHeader?.match(/SALON_AUTH=([^;]+)/)
  if (!tokenMatch) {
    return
  }

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: tokenMatch[1],
    maxAge: AUTH_COOKIE_MAX_AGE_SECONDS,
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure,
  })
}

async function handleProxy(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const { path = [] } = params
  const targetUrl = getTargetUrl(request, path)
  const method = request.method.toUpperCase()
  const response = await fetch(targetUrl, {
    method,
    headers: getForwardHeaders(request),
    body: method === 'GET' || method === 'HEAD' ? undefined : await request.arrayBuffer(),
    redirect: 'manual',
    cache: 'no-store',
  })

  const proxiedResponse = new NextResponse(await response.arrayBuffer(), {
    status: response.status,
    headers: getResponseHeaders(response),
  })

  syncAuthCookie(proxiedResponse, request.nextUrl.pathname, response.headers.get('set-cookie'))

  return proxiedResponse
}

export const dynamic = 'force-dynamic'

export const GET = handleProxy
export const POST = handleProxy
export const PUT = handleProxy
export const PATCH = handleProxy
export const DELETE = handleProxy
export const HEAD = handleProxy
export const OPTIONS = handleProxy
