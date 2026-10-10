import { readStoredData, writeStoredData } from './persistence'
import { normalizeEmail, normalizeUserProfile, validatePassword } from '../utils/userValidation'

const storageKey = 'jarodandre.auth'
let users = []
let currentUserId = null
let nextId = 1
let initialized = false
const listeners = new Set()

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, rut: user.rut, phone: user.phone, region: user.region, commune: user.commune, role: user.role }
}

function initializeAuth() {
  if (initialized) return
  initialized = true
  const stored = readStoredData(storageKey)
  if (stored === null) return
  try {
    if (stored.version !== 1 || !Array.isArray(stored.users)) throw new Error('Formato de usuarios no válido.')
    const ids = new Set()
    const emails = new Set()
    const ruts = new Set()
    const restored = stored.users.map((user) => {
      const profile = normalizeUserProfile(user)
      if (!Number.isSafeInteger(user.id) || user.id < 1 || ids.has(user.id) || emails.has(profile.email) || ruts.has(profile.rut)
        || user.role !== 'user' || !/^[a-f0-9]{32}$/.test(user.salt) || !/^[a-f0-9]{64}$/.test(user.passwordHash)) {
        throw new Error('Los datos de una cuenta no son válidos.')
      }
      ids.add(user.id)
      emails.add(profile.email)
      ruts.add(profile.rut)
      return { ...profile, id: user.id, role: 'user', salt: user.salt, passwordHash: user.passwordHash }
    })
    if (!Number.isSafeInteger(stored.nextId) || stored.nextId < 1 || restored.some((user) => user.id >= stored.nextId)) throw new Error('El contador de usuarios no es válido.')
    users = restored
    nextId = stored.nextId
    currentUserId = ids.has(stored.currentUserId) ? stored.currentUserId : null
  } catch (error) {
    console.warn('No se pudieron restaurar las cuentas locales.', error)
  }
}

function saveAuth(updatedUsers, sessionId, updatedNextId = nextId) {
  writeStoredData(storageKey, { version: 1, users: updatedUsers, currentUserId: sessionId, nextId: updatedNextId })
  users = updatedUsers
  currentUserId = sessionId
  nextId = updatedNextId
  for (const listener of listeners) {
    try { listener() } catch (error) { console.error('No se pudo actualizar un componente de sesión.', error) }
  }
}

function toHex(bytes) {
  return Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('')
}

async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const saltBytes = Uint8Array.from(salt.match(/.{2}/g), (value) => Number.parseInt(value, 16))
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: saltBytes, iterations: 100000, hash: 'SHA-256' }, key, 256)
  return toHex(new Uint8Array(bits))
}

function checkDuplicates(profile) {
  if (users.some((user) => user.email === profile.email)) throw new Error('Ya existe una cuenta con ese correo.')
  if (users.some((user) => user.rut === profile.rut)) throw new Error('Ya existe una cuenta con ese RUT.')
}

export function getCurrentUser() {
  initializeAuth()
  const user = users.find((item) => item.id === currentUserId)
  return user ? publicUser(user) : null
}

export function getUsers() {
  initializeAuth()
  return users.map(publicUser)
}

export function subscribeToAuth(listener) {
  if (typeof listener !== 'function') throw new Error('La suscripción debe recibir una función.')
  initializeAuth()
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export async function registerUser(data) {
  initializeAuth()
  const profile = normalizeUserProfile(data)
  if (profile.email !== normalizeEmail(data.confirmEmail)) throw new Error('Los correos no coinciden.')
  validatePassword(data.password)
  if (data.password !== data.confirmPassword) throw new Error('Las contraseñas no coinciden.')
  checkDuplicates(profile)
  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)))
  const passwordHash = await hashPassword(data.password, salt)
  // Volver a comprobar tras la operación asíncrona evita registros simultáneos duplicados.
  checkDuplicates(profile)
  if (nextId >= Number.MAX_SAFE_INTEGER) throw new Error('No hay más IDs de usuario disponibles.')
  const user = { ...profile, id: nextId, role: 'user', salt, passwordHash }
  saveAuth([...users, user], currentUserId, nextId + 1)
  return publicUser(user)
}

export async function login(email, password) {
  initializeAuth()
  const normalizedEmail = normalizeEmail(email)
  validatePassword(password)
  const user = users.find((item) => item.email === normalizedEmail)
  if (!user || await hashPassword(password, user.salt) !== user.passwordHash) throw new Error('Correo o contraseña incorrectos.')
  saveAuth(users, user.id)
  return publicUser(user)
}

export function logout() {
  initializeAuth()
  saveAuth(users, null)
}
