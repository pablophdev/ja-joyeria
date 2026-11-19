import { allPages, observable, request, setTokenProvider } from './api'
import { completeLogin, getAccessToken, signOut, startLogin } from './cognito'

const events = observable()
let currentUser = null
let users = []
export let needsProfile = false
export let registrationRegions = []
const roles = { CLIENTE: 'user', EMPLEADO: 'employee', ADMIN: 'admin' }
const statuses = { ACTIVO: 'active', PENDIENTE: 'pending', BLOQUEADO: 'inactive' }
setTokenProvider(getAccessToken)

function mapUser(user) {
  return { id: user.id, name: user.nombre, email: user.correo, rut: user.rut, phone: user.telefono || '', region: user.regionId, commune: String(user.comunaId), role: roles[user.rol], status: statuses[user.estado], createdAt: null }
}

export function getCurrentUser() { return currentUser }
export function isAdmin(user) { return user?.role === 'admin' && user?.status === 'active' }
export function getUsers() { return isAdmin(currentUser) ? [...users] : [] }
export function getUserById(id) { return getUsers().find((user) => user.id === id) || null }
export const subscribeToAuth = events.subscribe
export const login = () => startLogin()
export const logout = signOut

export async function loadIdentity() {
  currentUser = null
  users = []
  needsProfile = false
  await completeLogin()
  if (await getAccessToken()) {
    try { currentUser = mapUser(await request('auth', '/v1/me')) }
    catch (error) {
      if (error.status !== 404) throw error
      needsProfile = true
    }
  }
  const regions = await request('auth', '/v1/regiones', { authenticated: false })
  registrationRegions = await Promise.all(regions.map(async (region) => ({
    value: region.id, label: region.nombre,
    communes: await request('auth', `/v1/regiones/${region.id}/comunas`, { authenticated: false }),
  })))
  if (isAdmin(currentUser)) users = (await allPages('auth', '/v1/admin/usuarios')).map(mapUser)
  events.notify()
}

export async function registerUser(data) {
  if (!await getAccessToken()) return startLogin(true)
  currentUser = mapUser(await request('auth', '/v1/me', { method: 'POST', body: {
    nombre: data.name, rut: data.rut, telefono: data.phone?.trim() || null, comunaId: Number(data.commune),
  } }))
  needsProfile = false
  events.notify()
  window.location.assign('/')
  return currentUser
}

export async function updateUser(id, data) {
  const user = mapUser(await request('auth', `/v1/admin/usuarios/${encodeURIComponent(id)}/acceso`, { method: 'PATCH', body: {
    rol: Object.keys(roles).find((key) => roles[key] === data.role),
    estado: Object.keys(statuses).find((key) => statuses[key] === data.status),
  } }))
  users = users.map((item) => item.id === id ? user : item)
  if (currentUser?.id === id) currentUser = user
  events.notify()
  return user
}
