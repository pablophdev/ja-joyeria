import { readStoredData, writeStoredData } from './persistence'
import { normalizeEmail, normalizeUserProfile, validatePassword } from '../utilidades/userValidation'
import { userRoles, userStatuses } from './userOptions'

const storageKey = 'jarodandre.auth'
let users = []
let currentUserId = null
let nextId = 1
let initialized = false
const listeners = new Set()

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, rut: user.rut, phone: user.phone, region: user.region, commune: user.commune, role: user.role, status: user.status, createdAt: user.createdAt }
}

function validateUserId(id) {
  if (!Number.isSafeInteger(id) || id < 1) throw new Error('El ID de usuario no es válido.')
}

function validateAccount(role, status) {
  if (!userRoles.some((item) => item.value === role) || !userStatuses.some((item) => item.value === status)) {
    throw new Error('Selecciona un rol y un estado válidos.')
  }
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
      const status = user.status ?? 'active'
      const createdAt = user.createdAt ?? null
      validateAccount(user.role, status)
      if (!Number.isSafeInteger(user.id) || user.id < 1 || ids.has(user.id) || emails.has(profile.email) || ruts.has(profile.rut)
        || (createdAt !== null && (typeof createdAt !== 'string' || !Number.isFinite(Date.parse(createdAt))))
        || !/^[a-f0-9]{32}$/.test(user.salt) || !/^[a-f0-9]{64}$/.test(user.passwordHash)) {
        throw new Error('Los datos de una cuenta no son válidos.')
      }
      ids.add(user.id)
      emails.add(profile.email)
      ruts.add(profile.rut)
      return { ...profile, id: user.id, role: user.role, status, createdAt, salt: user.salt, passwordHash: user.passwordHash }
    })
    if (!Number.isSafeInteger(stored.nextId) || stored.nextId < 1 || restored.some((user) => user.id >= stored.nextId)) throw new Error('El contador de usuarios no es válido.')
    users = restored
    nextId = stored.nextId
    currentUserId = restored.some((user) => user.id === stored.currentUserId && user.status === 'active') ? stored.currentUserId : null
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

function checkDuplicates(profile, excludedId = null) {
  if (users.some((user) => user.id !== excludedId && user.email === profile.email)) throw new Error('Ya existe una cuenta con ese correo.')
  if (users.some((user) => user.id !== excludedId && user.rut === profile.rut)) throw new Error('Ya existe una cuenta con ese RUT.')
}

export function getCurrentUser() {
  initializeAuth()
  const user = users.find((item) => item.id === currentUserId)
  return user ? publicUser(user) : null
}

export function isAdmin(user) {
  if (!user) return false
  if (user.role === 'admin') return true
  const email = user.email.toLowerCase()
  return email.endsWith('@duoc.cl') || email.endsWith('@profesor.duoc.cl')
}

function requireAdmin() {
  if (!isAdmin(getCurrentUser())) throw new Error('Se requiere cuenta de administrador.')
}

export function getUsers() {
  initializeAuth()
  requireAdmin()
  return users.map(publicUser)
}

export function subscribeToAuth(listener) {
  if (typeof listener !== 'function') throw new Error('La suscripción debe recibir una función.')
  initializeAuth()
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export async function registerUser(data) {
  return createAccount(data, false)
}

export async function createUser(data) {
  return createAccount(data, true)
}

async function createAccount(data, administrative) {
  initializeAuth()
  if (administrative) requireAdmin()
  const profile = normalizeUserProfile(data)
  if (!administrative && profile.email !== normalizeEmail(data.confirmEmail)) throw new Error('Los correos no coinciden.')
  const role = administrative ? data.role : 'user'
  const status = administrative ? data.status : 'active'
  validateAccount(role, status)
  validatePassword(data.password)
  if (data.password !== data.confirmPassword) throw new Error('Las contraseñas no coinciden.')
  checkDuplicates(profile)
  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)))
  const passwordHash = await hashPassword(data.password, salt)
  if (administrative) requireAdmin()
  checkDuplicates(profile)
  if (nextId >= Number.MAX_SAFE_INTEGER) throw new Error('No hay más IDs de usuario disponibles.')
  const user = { ...profile, id: nextId, role, status, createdAt: new Date().toISOString(), salt, passwordHash }
  saveAuth([...users, user], currentUserId, nextId + 1)
  return publicUser(user)
}

export async function login(email, password) {
  initializeAuth()
  const normalizedEmail = normalizeEmail(email)
  validatePassword(password)
  const user = users.find((item) => item.email === normalizedEmail)
  if (!user || await hashPassword(password, user.salt) !== user.passwordHash) throw new Error('Correo o contraseña incorrectos.')
  if (users.find((item) => item.id === user.id) !== user) throw new Error('La cuenta cambió durante el acceso. Inténtalo de nuevo.')
  if (user.status !== 'active') throw new Error('Esta cuenta no está activa.')
  saveAuth(users, user.id)
  return publicUser(user)
}

export function logout() {
  initializeAuth()
  saveAuth(users, null)
}

export function getUserById(id) {
  initializeAuth()
  validateUserId(id)
  const user = users.find((item) => item.id === id)
  return user ? publicUser(user) : null
}

export async function updateUser(id, changes) {
  initializeAuth()
  requireAdmin()
  validateUserId(id)
  const user = users.find((item) => item.id === id)
  if (!user) return null
  const allowedFields = ['name', 'rut', 'email', 'phone', 'region', 'commune', 'role', 'status', 'password', 'confirmPassword']
  if (!changes || typeof changes !== 'object' || Array.isArray(changes) || Object.keys(changes).some((field) => !allowedFields.includes(field))) {
    throw new Error('Los cambios contienen campos no editables.')
  }
  const values = { ...user, ...changes }
  const profile = normalizeUserProfile(values)
  validateAccount(values.role, values.status)
  checkDuplicates(profile, id)
  let { salt, passwordHash } = user
  const password = changes.password ?? ''
  const confirmPassword = changes.confirmPassword ?? ''
  if (password !== confirmPassword) throw new Error('Las contraseñas no coinciden.')
  if (password !== '') {
    validatePassword(password)
    salt = toHex(crypto.getRandomValues(new Uint8Array(16)))
    passwordHash = await hashPassword(password, salt)
  }
  requireAdmin()
  if (users.find((item) => item.id === id) !== user) throw new Error('La cuenta cambió durante la edición. Vuelve a cargar sus datos.')
  checkDuplicates(profile, id)
  const updatedUser = { ...user, ...profile, role: values.role, status: values.status, salt, passwordHash }
  const sessionId = currentUserId === id && updatedUser.status !== 'active' ? null : currentUserId
  saveAuth(users.map((item) => item.id === id ? updatedUser : item), sessionId)
  return publicUser(updatedUser)
}

export function deleteUser(id) {
  initializeAuth()
  requireAdmin()
  validateUserId(id)
  const user = users.find((item) => item.id === id)
  if (!user) return null
  saveAuth(users.filter((item) => item.id !== id), currentUserId === id ? null : currentUserId)
  return publicUser(user)
}
