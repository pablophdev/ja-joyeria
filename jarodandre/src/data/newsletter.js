import { readStoredData, writeStoredData } from './persistence'
import { normalizeEmail } from '../utils/userValidation'
import { getCurrentUser, isAdmin } from './auth'

const storageKey = 'jarodandre.newsletter'
let subscribers = []
let initialized = false
const listeners = new Set()

function initializeSubscribers() {
  if (initialized) return
  initialized = true
  const stored = readStoredData(storageKey)
  if (stored === null) return
  try {
    if (stored.version !== 1 || !Array.isArray(stored.subscribers)) throw new Error('Formato de suscriptores no válido.')
    const emails = new Set()
    const restored = stored.subscribers.map((entry) => {
      const email = normalizeEmail(entry.email)
      if (emails.has(email) || typeof entry.createdAt !== 'string' || !Number.isFinite(Date.parse(entry.createdAt))) throw new Error('Suscriptor guardado no válido.')
      emails.add(email)
      return { email, createdAt: entry.createdAt }
    })
    subscribers = restored
  } catch (error) {
    console.warn('No se pudieron restaurar los suscriptores locales.', error)
  }
}

function requireAdmin() {
  if (!isAdmin(getCurrentUser())) throw new Error('Se requiere cuenta de administrador.')
}

function saveSubscribers(updated) {
  writeStoredData(storageKey, { version: 1, subscribers: updated })
  subscribers = updated
  for (const listener of listeners) {
    try { listener() } catch (error) { console.error('No se pudo actualizar la lista de suscriptores.', error) }
  }
}

export function subscribeToNewsletter(listener) {
  if (typeof listener !== 'function') throw new Error('La suscripción debe recibir una función.')
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function subscribeNewsletter(value) {
  initializeSubscribers()
  const email = normalizeEmail(value)
  if (subscribers.some((entry) => entry.email === email)) return false
  saveSubscribers([...subscribers, { email, createdAt: new Date().toISOString() }])
  return true
}

export function getNewsletterSubscribers() {
  requireAdmin()
  initializeSubscribers()
  return subscribers.map((entry) => ({ ...entry })).reverse()
}

export function deleteNewsletterSubscriber(value) {
  requireAdmin()
  initializeSubscribers()
  const email = normalizeEmail(value)
  if (!subscribers.some((entry) => entry.email === email)) throw new Error('El suscriptor ya no existe.')
  saveSubscribers(subscribers.filter((entry) => entry.email !== email))
}
