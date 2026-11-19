import { observable, request, setTokenProvider } from './api'

// Sin proveedor de identidad: no se crean sesiones ni permisos locales.
const events = observable()
export const needsProfile = false
export let registrationRegions = []
setTokenProvider(async () => null)

export function getCurrentUser() { return null }
export function isAdmin(user) { return user?.role === 'admin' && user?.status === 'active' }
export function getUsers() { return [] }
export function getUserById() { return null }
export const subscribeToAuth = events.subscribe

function unavailable() {
  throw new Error('La autenticación está deshabilitada hasta configurar un proveedor de identidad.')
}

export async function login() { unavailable() }
export async function registerUser() { unavailable() }
export async function updateUser() { unavailable() }
export async function logout() { unavailable() }

export async function loadIdentity() {
  const regions = await request('auth', '/v1/regiones', { authenticated: false })
  registrationRegions = await Promise.all(regions.map(async (region) => ({
    value: region.id, label: region.nombre,
    communes: await request('auth', `/v1/regiones/${region.id}/comunas`, { authenticated: false }),
  })))
  events.notify()
}
