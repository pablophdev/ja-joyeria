// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

beforeEach(() => {
  vi.resetModules()
  sessionStorage.clear()
  window.history.replaceState({}, '', '/login')
  vi.stubEnv('VITE_COGNITO_DOMAIN', 'https://pool.auth.example.com')
  vi.stubEnv('VITE_COGNITO_CLIENT_ID', 'public-client')
})
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals() })

describe('Sesión Cognito', () => {
  it('no inventa una sesión cuando no hay tokens', async () => {
    const { getAccessToken } = await import('../datos/cognito')
    expect(await getAccessToken()).toBeNull()
  })
  it('renueva tokens expirados sin enviar client secret', async () => {
    sessionStorage.setItem('ja.cognito.session', JSON.stringify({ accessToken: 'old', refreshToken: 'refresh', expiresAt: 0 }))
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ access_token: 'new', expires_in: 3600 }) })
    vi.stubGlobal('fetch', fetch)
    const { getAccessToken } = await import('../datos/cognito')
    expect(await getAccessToken()).toBe('new')
    expect(fetch).toHaveBeenCalledTimes(1)
    const body = fetch.mock.calls[0][1].body
    expect(body.get('grant_type')).toBe('refresh_token')
    expect(body.get('client_id')).toBe('public-client')
    expect(body.has('client_secret')).toBe(false)
    expect(JSON.parse(sessionStorage.getItem('ja.cognito.session')).refreshToken).toBe('refresh')
  })
  it('rechaza callbacks con state incorrecto antes del canje', async () => {
    sessionStorage.setItem('ja.cognito.pkce', JSON.stringify({ state: 'expected', verifier: 'verifier', createdAt: Date.now() }))
    window.history.replaceState({}, '', '/login?code=code&state=wrong')
    const fetch = vi.fn()
    vi.stubGlobal('fetch', fetch)
    const { completeLogin } = await import('../datos/cognito')
    await expect(completeLogin()).rejects.toThrow('verificación')
    expect(fetch).not.toHaveBeenCalled()
    expect(window.location.search).toBe('')
  })
  it('canjea un código con el verifier PKCE y limpia la URL', async () => {
    sessionStorage.setItem('ja.cognito.pkce', JSON.stringify({ state: 'expected', verifier: 'verifier', createdAt: Date.now() }))
    window.history.replaceState({}, '', '/login?code=code&state=expected')
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ access_token: 'new', expires_in: 3600 }) })
    vi.stubGlobal('fetch', fetch)
    const { completeLogin, getAccessToken } = await import('../datos/cognito')
    await completeLogin()
    expect(fetch.mock.calls[0][1].body.get('code_verifier')).toBe('verifier')
    expect(await getAccessToken()).toBe('new')
    expect(window.location.search).toBe('')
  })
  it('borra una sesión que no puede renovarse', async () => {
    sessionStorage.setItem('ja.cognito.session', JSON.stringify({ accessToken: 'old', refreshToken: 'refresh', expiresAt: 0 }))
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, json: async () => ({ error_description: 'Expired' }) }))
    const { getAccessToken } = await import('../datos/cognito')
    await expect(getAccessToken()).rejects.toThrow('expiró')
    expect(sessionStorage.getItem('ja.cognito.session')).toBeNull()
  })
})
