// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { request } from '../datos/api'
import { addToCart, refreshCart, subscribeToCartAdditions, updateCartQuantity } from '../datos/cart'

vi.mock('../datos/api', async (importOriginal) => ({
  ...await importOriginal(),
  request: vi.fn(),
}))

const emptyCart = { id: 'cart', totalClp: 0, items: [] }
const fullCart = {
  id: 'cart', totalClp: 1000,
  items: [{ productoId: 1, cantidad: 1, nombre: 'Anillo', disponibilidad: 'DISPONIBLE', precioClp: 1000, subtotalClp: 1000 }],
}

beforeEach(async () => {
  request.mockReset()
  request.mockResolvedValue(emptyCart)
  await refreshCart()
})

describe('Confirmación del carrito', () => {
  it('notifica solo después de confirmar la escritura y actualizar el carrito', async () => {
    const listener = vi.fn()
    const unsubscribe = subscribeToCartAdditions(listener)
    let confirm
    request.mockResolvedValueOnce(null).mockImplementationOnce(() => new Promise((resolve) => { confirm = resolve }))
    try {
      const operation = addToCart(1)
      await vi.waitFor(() => expect(confirm).toBeTypeOf('function'))
      expect(listener).not.toHaveBeenCalled()
      confirm(fullCart)
      await operation
      expect(listener).toHaveBeenCalledOnce()
    } finally { unsubscribe() }
  })

  it('no muestra éxito si el servidor rechaza el cambio', async () => {
    const listener = vi.fn()
    const unsubscribe = subscribeToCartAdditions(listener)
    request.mockRejectedValueOnce(new Error('Sin stock'))
    try {
      await expect(addToCart(1)).rejects.toThrow('Sin stock')
      expect(listener).not.toHaveBeenCalled()
    } finally { unsubscribe() }
  })

  it('no dispara la animación de añadido al editar cantidades', async () => {
    const listener = vi.fn()
    const unsubscribe = subscribeToCartAdditions(listener)
    request.mockResolvedValueOnce(null).mockResolvedValueOnce(fullCart)
    try {
      await updateCartQuantity(1, 1)
      expect(listener).not.toHaveBeenCalled()
    } finally { unsubscribe() }
  })

  it('permite retirar la suscripción al desmontar', async () => {
    const listener = vi.fn()
    const unsubscribe = subscribeToCartAdditions(listener)
    unsubscribe()
    request.mockResolvedValueOnce(null).mockResolvedValueOnce(fullCart)
    await addToCart(1)
    expect(listener).not.toHaveBeenCalled()
  })
})
