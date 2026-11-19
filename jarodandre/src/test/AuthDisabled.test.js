// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getCurrentUser, getUsers, login, registerUser, updateUser } from '../datos/auth'
afterEach(() => vi.unstubAllGlobals())
describe('Autenticación sin proveedor', () => {
  it('no restaura cuentas ni permisos locales', () => {
    expect(getCurrentUser()).toBeNull()
    expect(getUsers()).toEqual([])
  })
  it('rechaza las operaciones de cuentas sin contactar a proveedores', async () => {
    const fetch = vi.fn()
    vi.stubGlobal('fetch', fetch)
    await expect(login()).rejects.toThrow('deshabilitada')
    await expect(registerUser()).rejects.toThrow('deshabilitada')
    await expect(updateUser()).rejects.toThrow('deshabilitada')
    expect(fetch).not.toHaveBeenCalled()
  })
})
