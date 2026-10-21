// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ControlCantidad from '../componentes/carrito/ControlCantidad'

describe('ControlCantidad', () => {
  // Test de componente
  it('aumenta la cantidad en una unidad', () => {
    const onChange = vi.fn()
    render(<ControlCantidad id="cantidad" quantity={2} onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: 'Aumentar cantidad' }))

    expect(onChange).toHaveBeenCalledWith(3)
  })
})
