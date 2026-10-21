// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getCurrentUser, isAdmin } from '../datos/auth'
import RutaAdmin from '../navigation/RutaAdmin'

vi.mock('../datos/auth', () => ({
  getCurrentUser: vi.fn(),
  isAdmin: vi.fn(),
  subscribeToAuth: vi.fn(() => () => {}),
}))

function renderAdminRoute() {
  render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route path="/" element={<h1>Inicio</h1>} />
        <Route path="/login" element={<h1>Iniciar sesión</h1>} />
        <Route path="/admin" element={<RutaAdmin><h1>Administración</h1></RutaAdmin>} />
      </Routes>
    </MemoryRouter>,
  )
}

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('RutaAdmin', () => {
  // Test de navegación
  it('redirige al login cuando no existe una sesión', () => {
    vi.mocked(getCurrentUser).mockReturnValue(null)

    renderAdminRoute()

    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeTruthy()
  })

  // Test de navegación
  it('redirige al inicio cuando el usuario no es administrador', () => {
    vi.mocked(getCurrentUser).mockReturnValue({ id: 1, name: 'Cliente' })
    vi.mocked(isAdmin).mockReturnValue(false)

    renderAdminRoute()

    expect(screen.getByRole('heading', { name: 'Inicio' })).toBeTruthy()
  })
})
