import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiFetch } from '@/lib/api'

describe('apiFetch', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )
    )
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('uses NEXT_PUBLIC_API_URL plus /api/v1 for frontend auth requests', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://localhost:8080')

    await apiFetch('/frontend/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'client@example.com', password: 'secret' }),
    })

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/frontend/auth/login',
      expect.objectContaining({
        credentials: 'include',
        method: 'POST',
      })
    )
  })

  it('does not duplicate /api/v1 when NEXT_PUBLIC_API_URL already includes it', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://localhost:8080/api/v1/')

    await apiFetch('/frontend/bootstrap')

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/frontend/bootstrap',
      expect.objectContaining({
        credentials: 'include',
      })
    )
  })
})
