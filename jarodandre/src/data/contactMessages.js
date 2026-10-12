import { readStoredData, writeStoredData } from './persistence'
import { normalizeContactMessage } from '../utils/contactValidation'
import { getCurrentUser, isAdmin } from './auth'

const storageKey = 'jarodandre.contactMessages'
let messages = []
let nextId = 1
let initialized = false
const listeners = new Set()

function requireAdmin() {
  if (!isAdmin(getCurrentUser())) throw new Error('Se requiere cuenta de administrador.')
}

function saveMessages(updatedMessages, updatedNextId = nextId) {
  writeStoredData(storageKey, { version: 1, nextId: updatedNextId, messages: updatedMessages })
  messages = updatedMessages
  nextId = updatedNextId
  for (const listener of listeners) {
    try { listener() } catch (error) { console.error('No se pudo actualizar la bandeja de mensajes.', error) }
  }
}

export function subscribeToContactMessages(listener) {
  if (typeof listener !== 'function') throw new Error('La suscripción debe recibir una función.')
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function initializeMessages() {
  if (initialized) return
  initialized = true
  const stored = readStoredData(storageKey)
  if (stored === null) return
  try {
    if (stored.version !== 1 || !Array.isArray(stored.messages)) throw new Error('Formato de mensajes no válido.')
    const ids = new Set()
    const restored = stored.messages.map((entry) => {
      const content = normalizeContactMessage(entry)
      if (!Number.isSafeInteger(entry.id) || entry.id < 1 || ids.has(entry.id)
        || typeof entry.createdAt !== 'string' || !Number.isFinite(Date.parse(entry.createdAt))) throw new Error('Mensaje guardado no válido.')
      ids.add(entry.id)
      if (entry.read !== undefined && typeof entry.read !== 'boolean') throw new Error('Estado de mensaje no válido.')
      return { id: entry.id, createdAt: entry.createdAt, read: entry.read ?? false, ...content }
    })
    if (!Number.isSafeInteger(stored.nextId) || stored.nextId < 1 || restored.some((entry) => entry.id >= stored.nextId)) throw new Error('Contador de mensajes no válido.')
    messages = restored
    nextId = stored.nextId
  } catch (error) {
    console.warn('No se pudieron restaurar los mensajes locales.', error)
  }
}

export function getContactMessages() {
  requireAdmin()
  initializeMessages()
  return messages.map((message) => ({ ...message })).sort((first, second) => second.id - first.id)
}

export function setContactMessageRead(id, read) {
  requireAdmin()
  initializeMessages()
  if (typeof read !== 'boolean') throw new Error('El estado de lectura no es válido.')
  if (!messages.some((entry) => entry.id === id)) throw new Error('El mensaje ya no existe.')
  saveMessages(messages.map((entry) => entry.id === id ? { ...entry, read } : entry))
}

export function deleteContactMessage(id) {
  requireAdmin()
  initializeMessages()
  if (!messages.some((entry) => entry.id === id)) throw new Error('El mensaje ya no existe.')
  saveMessages(messages.filter((entry) => entry.id !== id))
}

export function saveContactMessage(data) {
  initializeMessages()
  const content = normalizeContactMessage(data)
  if (nextId >= Number.MAX_SAFE_INTEGER) throw new Error('No hay más IDs de mensaje disponibles.')
  const message = { id: nextId, createdAt: new Date().toISOString(), read: false, ...content }
  const updatedMessages = [...messages, message]
  saveMessages(updatedMessages, nextId + 1)
  return { ...message }
}
