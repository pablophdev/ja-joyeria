import { allPages, observable, request } from './api'
const events = observable()
let messages = []
export const subscribeToContactMessages = events.subscribe
export function getContactMessages() { return [...messages] }
export async function loadMessages() {
  messages = (await allPages('communications', '/v1/admin/mensajes', {}, { page: 'pagina', size: 'tamano' })).map((item) => ({
    id: item.id, name: item.nombre, email: item.correo, message: item.mensaje, createdAt: item.creadoEn, read: Boolean(item.leidoEn),
  }))
  events.notify()
}
export async function saveContactMessage(data) {
  return request('communications', '/v1/contacto', { method: 'POST', authenticated: false, body: { nombre: data.name, correo: data.email, mensaje: data.message } })
}
export async function setContactMessageRead(id, read) {
  await request('communications', `/v1/admin/mensajes/${id}/lectura`, { method: 'PATCH', body: { leido: read } })
  await loadMessages()
}
export async function deleteContactMessage(id) {
  await request('communications', `/v1/admin/mensajes/${id}`, { method: 'DELETE' })
  await loadMessages()
}
