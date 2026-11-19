import { allPages, observable, request } from './api'
const events = observable()
let subscribers = []
export const subscribeToNewsletter = events.subscribe
export function getNewsletterSubscribers() { return [...subscribers] }
export async function loadSubscribers() {
  subscribers = (await allPages('communications', '/v1/admin/suscriptores', {}, { page: 'pagina', size: 'tamano' })).map((item) => ({ id: item.id, email: item.correo, createdAt: item.altaEn }))
  events.notify()
}
export async function subscribeNewsletter(email) {
  const result = await request('communications', '/v1/suscripciones', { method: 'POST', authenticated: false, body: { correo: email } })
  return result.estado !== 'YA_ACTIVA'
}
export async function deleteNewsletterSubscriber(email) {
  const subscriber = subscribers.find((item) => item.email === email)
  if (!subscriber) throw new Error('Suscriptor no encontrado.')
  await request('communications', `/v1/admin/suscriptores/${subscriber.id}`, { method: 'DELETE' })
  await loadSubscribers()
}
