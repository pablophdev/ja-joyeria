const env = import.meta.env
export const serviceUrls = {
  auth: env.VITE_AUTH_URL || 'http://localhost:8081',
  catalog: env.VITE_CATALOGO_URL || 'http://localhost:8082',
  orders: env.VITE_PEDIDOS_URL || 'http://localhost:8083',
  communications: env.VITE_COMUNICACIONES_URL || 'http://localhost:8084',
}

let tokenProvider = async () => null
export function setTokenProvider(provider) { tokenProvider = provider }
const networkEvents = observable()
let activeRequests = 0
export const subscribeToNetwork = networkEvents.subscribe
export function getActiveRequests() { return activeRequests }

export class ApiError extends Error {
  constructor(message, status) { super(message); this.status = status }
}

export async function request(service, path, { method = 'GET', body, headers = {}, authenticated = true } = {}) {
  const token = authenticated ? await tokenProvider() : null
  const multipart = body instanceof FormData
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20000)
  activeRequests++
  networkEvents.notify()
  try {
    const response = await fetch(`${serviceUrls[service]}${path}`, {
      method, signal: controller.signal,
      headers: { ...(body && !multipart ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...headers },
      body: body === undefined ? undefined : multipart ? body : JSON.stringify(body),
    })
    if (!response.ok) {
      const problem = await response.json().catch(() => ({}))
      throw new ApiError(problem.detail || problem.message || `La operación falló (${response.status}).`, response.status)
    }
    if (response.status === 204) return null
    const text = await response.text()
    if (!text) return null
    try { return JSON.parse(text) }
    catch { throw new ApiError('El servidor devolvió una respuesta con formato no válido.', response.status) }
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(error.name === 'AbortError' ? 'El servidor tardó demasiado. Vuelve a intentarlo.' : `No se pudo conectar con ${serviceUrls[service]}. Comprueba que el servicio esté iniciado.`, 0)
  } finally {
    clearTimeout(timeout)
    activeRequests--
    networkEvents.notify()
  }
}

export async function allPages(service, path, options, pagination = { page: 'page', size: 'size' }) {
  const items = []
  for (let page = 0; ; page++) {
    const data = await request(service, `${path}${path.includes('?') ? '&' : '?'}${pagination.size}=100&${pagination.page}=${page}`, options)
    if (Array.isArray(data)) return data
    if (!Array.isArray(data.content)) throw new Error('El servidor devolvió una página no válida.')
    items.push(...data.content)
    if (data.last || data.content.length === 0 || page + 1 >= data.totalPages) return items
  }
}

export function observable() {
  const listeners = new Set()
  return {
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener) },
    notify() { for (const listener of listeners) listener() },
  }
}
