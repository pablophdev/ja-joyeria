// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { gsap } from 'gsap'
import { contentEntrance, contentExit, motionScope } from '../utilidades/motion'

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

function setMotionPreference(reduced) {
  vi.stubGlobal('matchMedia', vi.fn((query) => ({
    matches: query === '(prefers-reduced-motion: reduce)' ? reduced : !reduced,
    media: query,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })))
}

describe('Accesibilidad y limpieza de GSAP', () => {
  it('no ejecuta animaciones con movimiento reducido', () => {
    setMotionPreference(true)
    const animate = vi.fn()
    const root = document.createElement('div')
    const dispose = motionScope(root, animate)
    expect(animate).not.toHaveBeenCalled()
    dispose()
  })

  it('conserva el contenido visible si matchMedia no está disponible', () => {
    vi.stubGlobal('matchMedia', undefined)
    const root = document.createElement('div')
    document.body.append(root)
    const dispose = contentEntrance(root)
    expect(root.style.opacity).toBe('')
    expect(root.style.transform).toBe('')
    dispose()
  })

  it('restaura los estilos originales y elimina los tweens al limpiar', () => {
    setMotionPreference(false)
    const root = document.createElement('div')
    document.body.append(root)
    const dispose = contentEntrance(root)
    expect(gsap.getTweensOf(root)).toHaveLength(1)
    expect(root.style.opacity).toBe('0')
    dispose()
    expect(gsap.getTweensOf(root)).toHaveLength(0)
    expect(root.style.opacity).toBe('')
    expect(root.style.transform).toBe('')
  })

  it('completa inmediatamente el cambio de paso sin movimiento', () => {
    setMotionPreference(true)
    const complete = vi.fn()
    const root = document.createElement('div')
    const dispose = contentExit(root, complete)
    expect(complete).toHaveBeenCalledOnce()
    expect(root.style.opacity).toBe('')
    dispose()
  })
})
