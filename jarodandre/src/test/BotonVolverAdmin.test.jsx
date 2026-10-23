// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getCurrentUser, isAdmin } from '../datos/auth'
import BotonVolverAdmin from '../componentes/estructura/BotonVolverAdmin'

vi.mock('../datos/auth', () => ({
  getCurrentUser: vi.fn(),
  isAdmin: vi.fn(),
  subscribeToAuth: vi.fn(() => () => {}),
}))

const backButtonName = 'Volver al panel de administración'

function renderButton(path) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <BotonVolverAdmin />
    </MemoryRouter>,
  )
}

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('BotonVolverAdmin', () => {
  // Test de componente
  it('muestra la joya para volver al panel de administración desde la vista de cliente', () => {
    vi.mocked(getCurrentUser).mockReturnValue({ id: 1, name: 'Admin', email: 'admin@duoc.cl' })
    vi.mocked(isAdmin).mockReturnValue(true)

    renderButton('/productos')

    expect(screen.getByRole('link', { name: backButtonName })).toHaveAttribute('href', '/admin')
    expect(screen.getByText('Admin')).toBeTruthy()
  })

  // Test de permisos
  it('no se muestra cuando la sesión no es de administrador', () => {
    vi.mocked(getCurrentUser).mockReturnValue({ id: 2, name: 'Cliente', email: 'cliente@correo.cl' })
    vi.mocked(isAdmin).mockReturnValue(false)

    renderButton('/productos')

    expect(screen.queryByRole('link', { name: backButtonName })).toBeNull()
  })

  // Test de permisos
  it('no se muestra sin sesión iniciada', () => {
    vi.mocked(getCurrentUser).mockReturnValue(null)
    vi.mocked(isAdmin).mockReturnValue(false)

    renderButton('/')

    expect(screen.queryByRole('link', { name: backButtonName })).toBeNull()
  })

  // Test de navegación
  it('se oculta mientras el administrador está dentro del área de administración', () => {
    vi.mocked(getCurrentUser).mockReturnValue({ id: 1, name: 'Admin', email: 'admin@duoc.cl' })
    vi.mocked(isAdmin).mockReturnValue(true)

    renderButton('/admin/productos')

    expect(screen.queryByRole('link', { name: backButtonName })).toBeNull()
  })
})
