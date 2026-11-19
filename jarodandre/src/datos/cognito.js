const env = import.meta.env
const domain = (env.VITE_COGNITO_DOMAIN || '').replace(/\/$/, '')
const clientId = env.VITE_COGNITO_CLIENT_ID || ''
const redirectUri = env.VITE_COGNITO_REDIRECT_URI || `${window.location.origin}/login`
const sessionKey = 'ja.cognito.session'
const flowKey = 'ja.cognito.pkce'
function readSession(key) {
  try { return JSON.parse(sessionStorage.getItem(key) || 'null') }
  catch { sessionStorage.removeItem(key); return null }
}
let session = readSession(sessionKey)
let refreshing
export const cognitoConfigured = Boolean(domain && clientId)

function base64(bytes) {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function exchange(data) {
  const response = await fetch(`${domain}/oauth2/token`, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: clientId, ...data }),
  })
  const result = await response.json()
  if (!response.ok) throw new Error(result.error_description || 'No se pudo completar el acceso con Cognito.')
  session = { accessToken: result.access_token, refreshToken: result.refresh_token || session?.refreshToken, expiresAt: Date.now() + result.expires_in * 1000 }
  sessionStorage.setItem(sessionKey, JSON.stringify(session))
  return session.accessToken
}

export async function startLogin(register = false) {
  if (!cognitoConfigured) throw new Error('Configura VITE_COGNITO_DOMAIN y VITE_COGNITO_CLIENT_ID para acceder.')
  const verifier = base64(crypto.getRandomValues(new Uint8Array(48)))
  const state = base64(crypto.getRandomValues(new Uint8Array(32)))
  const challenge = base64(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))))
  sessionStorage.setItem(flowKey, JSON.stringify({ verifier, state, createdAt: Date.now() }))
  const params = new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri, response_type: 'code', scope: 'openid email profile', state, code_challenge_method: 'S256', code_challenge: challenge })
  window.location.assign(`${domain}/${register ? 'signup' : 'oauth2/authorize'}?${params}`)
}

export async function completeLogin() {
  const url = new URL(window.location.href)
  if (!url.searchParams.has('code') && !url.searchParams.has('error')) return
  const flow = readSession(flowKey)
  sessionStorage.removeItem(flowKey)
  const valid = flow && flow.state === url.searchParams.get('state') && Date.now() - flow.createdAt < 600000
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error_description')
  for (const key of ['code', 'state', 'error', 'error_description']) url.searchParams.delete(key)
  window.history.replaceState({}, '', url.pathname + url.search + url.hash)
  if (!valid) throw new Error('La sesión de acceso expiró o su verificación no es válida. Inicia sesión nuevamente.')
  if (!code) throw new Error(error || 'Acceso cancelado.')
  await exchange({ grant_type: 'authorization_code', code, redirect_uri: redirectUri, code_verifier: flow.verifier })
}

export async function getAccessToken() {
  if (!session) return null
  if (session.expiresAt > Date.now() + 60000) return session.accessToken
  if (!session.refreshToken) { clearSession(); return null }
  if (!refreshing) {
    refreshing = exchange({ grant_type: 'refresh_token', refresh_token: session.refreshToken })
      .catch(() => { clearSession(); throw new Error('Tu sesión expiró. Inicia sesión nuevamente.') })
      .finally(() => { refreshing = null })
  }
  return refreshing
}

export function clearSession() { session = null; sessionStorage.removeItem(sessionKey) }
export function signOut() {
  clearSession()
  if (cognitoConfigured) window.location.assign(`${domain}/logout?${new URLSearchParams({ client_id: clientId, logout_uri: env.VITE_COGNITO_LOGOUT_URI || window.location.origin })}`)
  else window.location.assign('/')
}
