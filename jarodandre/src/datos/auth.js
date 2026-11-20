import { allPages, observable, request, setTokenProvider } from './api'

const events = observable()
const sessionKey = 'ja.auth.session'
const roles = { CLIENTE: 'user', EMPLEADO: 'employee', ADMIN: 'admin' }
const statuses = { ACTIVO: 'active', PENDIENTE: 'pending', BLOQUEADO: 'inactive' }

let currentUser = null
let users = []
let expirationTimer
let session = readSession()

export const needsProfile = false
export let registrationRegions = []
export const subscribeToAuth = events.subscribe

function readSession() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(sessionKey) || 'null')
    if (typeof saved?.accessToken === 'string' && saved.expiresAt > Date.now()) {
      return saved
    }
  } catch {
    sessionStorage.removeItem(sessionKey)
  }
  return null
}

function clearSession() {
  clearTimeout(expirationTimer)
  session = null
  currentUser = null
  users = []
  sessionStorage.removeItem(sessionKey)
  events.notify()
}

function scheduleExpiration() {
  clearTimeout(expirationTimer)
  if (!session) return

  expirationTimer = setTimeout(() => {
    clearSession()
    window.location.assign('/login')
  }, Math.max(0, session.expiresAt - Date.now()))
}

setTokenProvider(async () => {
  if (session && session.expiresAt <= Date.now()) clearSession()
  return session?.accessToken || null
})

function mapUser(user) {
  return {
    id: user.id,
    email: user.correo,
    rut: user.rut,
    name: user.nombre,
    phone: user.telefono || '',
    region: user.regionId,
    commune: String(user.comunaId),
    role: roles[user.rol],
    status: statuses[user.estado],
  }
}

function saveSession(result) {
  if (!result.accessToken || !result.usuario || !(result.expiresIn > 0)) {
    throw new Error('El servidor devolvió una sesión incompleta.')
  }

  session = {
    accessToken: result.accessToken,
    expiresAt: Date.now() + result.expiresIn * 1000,
  }

  sessionStorage.setItem(sessionKey, JSON.stringify(session))
  currentUser = mapUser(result.usuario)
  scheduleExpiration()
  events.notify()
  return currentUser
}

export function getCurrentUser() {
  return currentUser
}

export function isAdmin(user) {
  return user?.role === 'admin' && user?.status === 'active'
}

export function getUsers() {
  return isAdmin(currentUser) ? [...users] : []
}

export function getUserById(id) {
  return getUsers().find((user) => user.id === String(id)) || null
}

export async function login(email, password) {
  const result = await request('auth', '/v1/auth/login', {
    method: 'POST',
    authenticated: false,
    body: { correo: email, password },
  })
  return saveSession(result)
}

export async function registerUser(data) {
  const result = await request('auth', '/v1/auth/registro', {
    method: 'POST',
    authenticated: false,
    body: {
      correo: data.email,
      password: data.password,
      rut: data.rut,
      nombre: data.name,
      telefono: data.phone?.trim() || null,
      comunaId: Number(data.commune),
    },
  })
  return saveSession(result)
}

export async function updateUser(id, changes) {
  const role = Object.keys(roles).find((key) => roles[key] === changes.role)
  const status = Object.keys(statuses).find((key) => statuses[key] === changes.status)

  if (!role || !status) throw new Error('Selecciona un rol y estado válidos.')

  const result = await request('auth', `/v1/admin/usuarios/${id}/acceso`, {
    method: 'PATCH',
    body: { rol: role, estado: status },
  })

  const user = mapUser(result)
  users = users.map((entry) => entry.id === user.id ? user : entry)
  if (currentUser?.id === user.id) currentUser = user
  events.notify()
  return user
}

export async function logout() {
  clearSession()
  window.location.assign('/')
}

export async function loadIdentity() {
  const regions = await request('auth', '/v1/regiones', { authenticated: false })

  registrationRegions = await Promise.all(regions.map(async (region) => ({
    value: region.id,
    label: region.nombre,
    communes: await request('auth', `/v1/regiones/${region.id}/comunas`, {
      authenticated: false,
    }),
  })))

  currentUser = null
  users = []

  if (session) {
    try {
      currentUser = mapUser(await request('auth', '/v1/me'))
    } catch (error) {
      if (![401, 403].includes(error.status)) throw error
      clearSession()
    }
  }

  if (isAdmin(currentUser)) {
    users = (await allPages('auth', '/v1/admin/usuarios')).map(mapUser)
  }

  scheduleExpiration()
  events.notify()
}