// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { login, logout, registerUser, getCurrentUser } from '../datos/auth'

afterEach(() => { sessionStorage.clear(); vi.unstubAllGlobals() })
describe('Autenticación del backend local', () => {
  it('propaga credenciales inválidas sin crear una sesión', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ detail: 'Credenciales inválidas' }), { status: 401 })))
    await expect(login('ana@example.cl', 'incorrecta')).rejects.toThrow('Credenciales inválidas')
    expect(getCurrentUser()).toBeNull()
  })
  it('envía registro al backend y conserva el token de la respuesta', async () => {
    const result = { accessToken: 'jwt-local', expiresIn: 3600, usuario: {
      id: 'usuario', correo: 'ana@example.cl', nombre: 'Ana Soto', rut: '12345678-5', comunaId: 1,
      regionId: 'RM', rol: 'CLIENTE', estado: 'ACTIVO',
    } }
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify(result), { status: 201 }))
    vi.stubGlobal('fetch', fetch)
    const user = await registerUser({ email: 'ana@example.cl', password: 'Clave1234', name: 'Ana Soto', rut: '12345678-5', commune: '1' })
    expect(user.role).toBe('user')
    expect(fetch.mock.calls[0][0]).toBe('http://localhost:8081/v1/auth/registro')
    expect(JSON.parse(sessionStorage.getItem('ja.auth.session')).accessToken).toBe('jwt-local')
    await logout()
  })
})
