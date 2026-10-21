// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import TarjetaProducto from '../componentes/productos/TarjetaProducto'

describe('TarjetaProducto', () => {
  // Test de componente
  it('incluye un enlace al detalle del producto', () => {
    const product = {
      id: 7,
      name: 'Anillo urbano',
      image: '/anillo.jpg',
      price: 95000,
      rating: 4,
      badge: 'Nuevo',
      availability: 'Disponible',
    }

    render(
      <MemoryRouter>
        <TarjetaProducto product={product} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Ver detalle' })).toHaveAttribute('href', '/productos/7')
  })
})
