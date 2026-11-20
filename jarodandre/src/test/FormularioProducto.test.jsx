// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import FormularioProducto from '../componentes/administracion/FormularioProducto'
import { getProductFormValues, getProductFormData } from '../utilidades/productForm'

vi.mock('../datos/products', () => ({ getProductCategories: () => [
  { id: 1, slug: 'anillos', nombre: 'Anillos' }, { id: 4, slug: 'grillz', nombre: 'Grillz' },
] }))
vi.mock('../componentes/administracion/EditorDescripcion', () => ({ default: () => <div>Editor</div> }))
afterEach(cleanup)

describe('Formulario de producto administrativo', () => {
  it('exige elegir una categoría del catálogo y deja las valoraciones al comprador', () => {
    const change = vi.fn()
    render(<MemoryRouter><FormularioProducto values={getProductFormValues()} onChange={change} onSubmit={vi.fn()} /></MemoryRouter>)
    const category = screen.getByRole('combobox', { name: 'Categoría' })
    expect(category.required).toBe(true)
    fireEvent.change(category, { target: { value: 'grillz' } })
    expect(change).toHaveBeenCalled()
    expect(screen.queryByLabelText('Valoración (0–5)')).toBeNull()
    expect(screen.queryByLabelText('Cantidad de reseñas')).toBeNull()
    expect(screen.queryByRole('textbox', { name: /Categoría/ })).toBeNull()
  })
  it('prepara el precio sin exigir campos de valoración', () => {
    const data = getProductFormData({ ...getProductFormValues(), price: '35000' })
    expect(data.price).toBe(35000)
    expect(data).not.toHaveProperty('rating')
    expect(data).not.toHaveProperty('reviewCount')
  })
})
