import { readStoredData, writeStoredData } from './persistence'
import { normalizeContactMessage } from '../utils/contactValidation'

const storageKey = 'jarodandre.contactMessages'
let messages = []
let nextId = 1
let initialized = false

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
      return { id: entry.id, createdAt: entry.createdAt, ...content }
    })
    if (!Number.isSafeInteger(stored.nextId) || stored.nextId < 1 || restored.some((entry) => entry.id >= stored.nextId)) throw new Error('Contador de mensajes no válido.')
    messages = restored
    nextId = stored.nextId
  } catch (error) {
    console.warn('No se pudieron restaurar los mensajes locales.', error)
  }
}

export function getContactMessages() {
  initializeMessages()
  return messages.map((message) => ({ ...message }))
}

export function saveContactMessage(data) {
  initializeMessages()
  const content = normalizeContactMessage(data)
  if (nextId >= Number.MAX_SAFE_INTEGER) throw new Error('No hay más IDs de mensaje disponibles.')
  const message = { id: nextId, createdAt: new Date().toISOString(), ...content }
  const updatedMessages = [...messages, message]
  writeStoredData(storageKey, { version: 1, nextId: nextId + 1, messages: updatedMessages })
  messages = updatedMessages
  nextId += 1
  return { ...message }
}
