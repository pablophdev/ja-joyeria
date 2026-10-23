export function normalizeContactMessage(data) {
  if (!data || typeof data !== 'object') throw new Error('Completa los datos del formulario.')
  const name = typeof data.name === 'string' ? data.name.trim() : ''
  const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : ''
  const message = typeof data.message === 'string' ? data.message.trim() : ''
  if (!name || name.length > 120 || !/^[\p{L}\p{M}\s]+$/u.test(name)) throw new Error('Ingresa tu nombre usando letras y espacios, con un máximo de 120 caracteres.')
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Ingresa un correo electrónico válido.')
  if (!message || message.length > 2000) throw new Error('Escribe un mensaje de entre 1 y 2000 caracteres.')
  return { name, email, message }
}
z