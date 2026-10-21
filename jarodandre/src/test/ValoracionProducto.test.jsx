// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ValoracionProducto from '../componentes/productos/ValoracionProducto'

describe('ValoracionProducto', () => {
  // Test de componente
  it('muestra una valoración de 4 de 5 estrellas', () => {
    render(<ValoracionProducto rating={4} />)

    expect(screen.getByText('★★★★☆')).toBeInTheDocument()
    expect(screen.getByText('Valoración: 4 de 5 estrellas')).toBeInTheDocument()
  })
})
