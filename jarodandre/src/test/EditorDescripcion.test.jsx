// @vitest-environment jsdom
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import EditorDescripcion from '../componentes/administracion/EditorDescripcion'

afterEach(cleanup)
describe('Editor de descripción', () => {
  it('carga texto previo y sincroniza un cambio de producto sin emitir ediciones', async () => {
    const onChange = vi.fn()
    const { rerender } = render(<EditorDescripcion value="Descripción anterior" onChange={onChange} />)
    const field = await screen.findByRole('textbox')
    expect(field.textContent).toBe('Descripción anterior')
    rerender(<EditorDescripcion value="<p>Plata <strong>925</strong></p>" onChange={onChange} />)
    await waitFor(() => expect(field.querySelector('strong')?.textContent).toBe('925'))
    expect(onChange).not.toHaveBeenCalled()
  })
})
