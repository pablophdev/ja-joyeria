import { describe, expect, it } from 'vitest'
import { formatPrice } from '../utilidades/formatPrice'


describe('formatPrice', () => {
  // Test de función
  it('formatea un número como peso chileno', () => {
    expect(formatPrice(100000)).toBe('$100.000')
  })

  // Test de función
  it('aplica el separador de miles chileno en distintos montos', () => {
    expect(formatPrice(0)).toBe('$0')
    expect(formatPrice(999)).toBe('$999')
    expect(formatPrice(1500)).toBe('$1.500')
    expect(formatPrice(2500000)).toBe('$2.500.000')
  })

  // Test de función
  it('no muestra decimales y redondea el importe', () => {
    expect(formatPrice(100000.4)).toBe('$100.000')
    expect(formatPrice(1500.7)).toBe('$1.501')
    expect(formatPrice(999.5)).toBe('$1.000')
  })

  // Test de función
  it('siempre devuelve el símbolo de peso al inicio', () => {
    expect(formatPrice(1).startsWith('$')).toBe(true)
    expect(formatPrice(100000).startsWith('$')).toBe(true)
    expect(formatPrice(999999).startsWith('$')).toBe(true)
  })
})
