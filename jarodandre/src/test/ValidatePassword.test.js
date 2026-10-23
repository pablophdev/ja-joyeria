import { describe, expect, it } from 'vitest'
import { validatePassword } from '../utilidades/userValidation'

describe('validatePassword', () => {
  // Test de función
  it('acepta contraseñas con al menos 6 caracteres y al menos un número', () => {
    expect(() => validatePassword('clave123')).not.toThrow()
    expect(() => validatePassword('1clave')).not.toThrow()
    expect(() => validatePassword('123456')).not.toThrow()
    expect(() => validatePassword('a1' + 'a'.repeat(78))).not.toThrow()
  })

  // Test de función
  it('rechaza contraseñas con menos de 6 caracteres', () => {
    expect(() => validatePassword('ab1')).toThrow()
    expect(() => validatePassword('abc12')).toThrow()
    expect(() => validatePassword('   ab1')).toThrow()
    expect(() => validatePassword('1')).toThrow()
  })

  // Test de función
  it('rechaza contraseñas de 6 o más caracteres que no contienen números', () => {
    expect(() => validatePassword('abcdef')).toThrow()
    expect(() => validatePassword('clave sin numero')).toThrow()
    expect(() => validatePassword('Contraseña')).toThrow()
  })

  // Test de función
  it('rechaza contraseñas de más de 80 caracteres', () => {
    expect(() => validatePassword('a1' + 'a'.repeat(79))).toThrow()
  })

  // Test de función
  it('rechaza entradas que no son texto', () => {
    expect(() => validatePassword(null)).toThrow()
    expect(() => validatePassword(undefined)).toThrow()
    expect(() => validatePassword(123456)).toThrow()
  })

})
