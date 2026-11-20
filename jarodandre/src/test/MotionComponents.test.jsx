// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { StrictMode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import RejillaAnimada from '../componentes/productos/RejillaAnimada'
import TransicionPaso from '../componentes/pedidos/TransicionPaso'
import Carrusel from '../componentes/inicio/Carrusel'
import { contentEntrance, contentExit, heroEntrance, productGridEntrance } from '../utilidades/motion'

vi.mock('../utilidades/motion', () => ({
  productGridEntrance: vi.fn(() => vi.fn()),
  contentEntrance: vi.fn(() => vi.fn()),
  contentExit: vi.fn((_root, complete) => { complete(); return vi.fn() }),
  heroEntrance: vi.fn(() => vi.fn()),
}))

beforeEach(() => vi.clearAllMocks())
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.useRealTimers() })

describe('Entrada del inicio', () => {
  it('espera a que termine la pantalla de carga antes de animar', () => {
    vi.useFakeTimers()
    const preloader = document.createElement('div')
    preloader.className = 'preloader'
    document.body.append(preloader)
    const { unmount } = render(<MemoryRouter><Carrusel /></MemoryRouter>)
    expect(heroEntrance).not.toHaveBeenCalled()
    preloader.remove()
    act(() => window.dispatchEvent(new Event('ja:intro-ready')))
    expect(heroEntrance).toHaveBeenCalledOnce()
    act(() => vi.advanceTimersByTime(6000))
    expect(heroEntrance).toHaveBeenCalledTimes(2)
    expect(screen.getByRole('group', { name: '2 de 2: Collares' })).toHaveClass('is-active')
    unmount()
    for (const result of heroEntrance.mock.results) expect(result.value).toHaveBeenCalledOnce()
  })

  it('desactiva el avance automático con movimiento reducido', () => {
    vi.useFakeTimers()
    vi.stubGlobal('matchMedia', vi.fn(() => ({
      matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn(),
    })))
    render(<MemoryRouter><Carrusel /></MemoryRouter>)
    act(() => vi.advanceTimersByTime(12000))
    expect(screen.getByRole('group', { name: '1 de 2: Anillos' })).toHaveClass('is-active')
    expect(heroEntrance).toHaveBeenCalledOnce()
  })
})

describe('Rejilla animada', () => {
  it('anima los resultados nuevos al filtrar y limpia el efecto anterior', () => {
    const { rerender, unmount } = render(<RejillaAnimada products={[{ id: 1 }]}><div>Anillo</div></RejillaAnimada>)
    const dispose = productGridEntrance.mock.results[0].value
    rerender(<RejillaAnimada products={[{ id: 2 }]}><div>Collar</div></RejillaAnimada>)
    expect(dispose).toHaveBeenCalledOnce()
    expect(productGridEntrance).toHaveBeenCalledTimes(2)
    expect(screen.getByText('Collar')).toBeVisible()
    unmount()
    expect(productGridEntrance.mock.results[1].value).toHaveBeenCalledOnce()
  })

  it('no reinicia la entrada si la lista conserva los mismos productos', () => {
    const { rerender } = render(<RejillaAnimada products={[{ id: 1 }]}><div>Anillo</div></RejillaAnimada>)
    rerender(<RejillaAnimada products={[{ id: 1 }]}><div>Anillo actualizado</div></RejillaAnimada>)
    expect(productGridEntrance).toHaveBeenCalledOnce()
  })

  it('limpia los efectos en StrictMode', () => {
    const { unmount } = render(<StrictMode><RejillaAnimada products={[]} /></StrictMode>)
    unmount()
    for (const result of productGridEntrance.mock.results) expect(result.value).toHaveBeenCalledOnce()
  })
})

describe('Transiciones del checkout', () => {
  const content = (step) => <p>{step === 'delivery' ? 'Formulario de entrega' : 'Formulario de pago'}</p>

  it('sale del paso anterior, muestra el siguiente y mueve el foco', () => {
    const { rerender } = render(<TransicionPaso step="delivery">{content}</TransicionPaso>)
    rerender(<TransicionPaso step="payment">{content}</TransicionPaso>)
    expect(contentExit).toHaveBeenCalledOnce()
    expect(screen.queryByText('Formulario de entrega')).not.toBeInTheDocument()
    expect(screen.getByText('Formulario de pago')).toBeVisible()
    expect(document.activeElement).toHaveAttribute('aria-label', 'Pago')
    expect(contentEntrance).toHaveBeenCalledTimes(2)
  })

  it('resuelve una transición en curso al activar movimiento reducido', () => {
    let onPreferenceChange
    const removeEventListener = vi.fn()
    vi.stubGlobal('matchMedia', vi.fn(() => ({
      matches: false,
      addEventListener: (_event, listener) => { onPreferenceChange = listener },
      removeEventListener,
    })))
    contentExit.mockImplementationOnce(() => vi.fn())
    const { rerender, unmount } = render(<TransicionPaso step="delivery">{content}</TransicionPaso>)
    rerender(<TransicionPaso step="payment">{content}</TransicionPaso>)
    expect(screen.getByText('Formulario de entrega').parentElement).toHaveAttribute('inert')
    act(() => onPreferenceChange({ matches: true }))
    expect(screen.getByText('Formulario de pago').parentElement).not.toHaveAttribute('inert')
    unmount()
    expect(removeEventListener).toHaveBeenCalledWith('change', onPreferenceChange)
  })
})
