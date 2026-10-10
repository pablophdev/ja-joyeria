import { registrationRegions } from '../data/registrationOptions'

export function normalizeEmail(email) {
  if (typeof email !== 'string') throw new Error('Ingresa un correo válido.')
  const normalized = email.trim().toLowerCase()
  if (normalized.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) throw new Error('Ingresa un correo válido.')
  return normalized
}

function normalizeRut(value) {
  const rut = typeof value === 'string' ? value.replace(/\./g, '').trim().toUpperCase() : ''
  if (!/^[1-9]\d{6,7}-[0-9K]$/.test(rut)) throw new Error('Ingresa un RUT válido con guion y dígito verificador.')
  const [digits, checkDigit] = rut.split('-')
  let sum = 0
  let multiplier = 2
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    sum += Number(digits[index]) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }
  const remainder = 11 - sum % 11
  const expected = remainder === 11 ? '0' : remainder === 10 ? 'K' : String(remainder)
  if (checkDigit !== expected) throw new Error('El dígito verificador del RUT no es válido.')
  return rut
}

export function validatePassword(password) {
  if (typeof password !== 'string' || password.trim().length < 6 || password.length > 128) {
    throw new Error('La contraseña debe tener entre 6 y 128 caracteres.')
  }
}

export function normalizeUserProfile(data) {
  if (!data || typeof data !== 'object') throw new Error('Completa los datos del registro.')
  const name = typeof data.name === 'string' ? data.name.trim() : ''
  if (name.length < 3 || name.length > 120 || !/^[\p{L}\p{M}\s]+$/u.test(name)) throw new Error('Ingresa un nombre de 3 a 120 caracteres, usando letras y espacios.')
  const email = normalizeEmail(data.email)
  if (!['gmail.com', 'duoc.cl', 'profesor.duoc.cl'].includes(email.split('@')[1])) {
    throw new Error('Usa un correo @gmail.com, @duoc.cl o @profesor.duoc.cl.')
  }
  const rut = normalizeRut(data.rut)
  const phone = typeof data.phone === 'string' ? data.phone.trim() : ''
  if (phone && !/^\d{8,12}$/.test(phone)) throw new Error('El teléfono debe tener entre 8 y 12 números.')
  const region = registrationRegions.find((item) => item.value === data.region)
  if (!region || !region.communes.includes(data.commune)) throw new Error('Selecciona una región y una comuna de esa región.')
  return { name, email, rut, phone, region: region.value, commune: data.commune }
}
