import { describe, expect, it } from 'vitest'
import { filterCatalogProducts } from '../utilidades/catalogFilters'

describe('filterCatalogProducts', () => {
  // Test de función
  it('filtra productos por nombre ignorando mayúsculas y tildes', () => {
    const products = [
      { id: 1, name: 'Anillo Ámbar', price: 85000 },
      { id: 2, name: 'Cadena de plata', price: 120000 },
      { id: 3, name: 'Anillo urbano', price: 95000 },
    ]

    const result = filterCatalogProducts(products, { query: 'ANILLO AMBAR' })

    expect(result).toEqual([products[0]])
  })
})
