// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { loadIdentity, registrationRegions } from '../datos/auth'
import { getProducts, loadProducts } from '../datos/products'
import { blogPosts, loadBlog } from '../datos/blogPosts'
import { addToCart, clearCart, confirmOrder, getCart, getOrders, loadCart, loadOrders } from '../datos/cart'
import { request } from '../datos/api'
import { saveContactMessage } from '../datos/contactMessages'
import { subscribeNewsletter } from '../datos/newsletter'

// Opt-in: requiere los cuatro microservicios locales; escribe datos de prueba.
describe.skipIf(import.meta.env.VITE_LIVE_API_TESTS !== 'true')('Integración HTTP real', () => {
  it.each([
    ['http://localhost:8081/v1/me', 'POST', 'authorization,content-type'],
    ['http://localhost:8082/v1/admin/imagenes', 'POST', 'authorization,content-type'],
    ['http://localhost:8083/v1/checkout', 'POST', 'content-type,idempotency-key,x-carrito-token'],
    ['http://localhost:8084/v1/suscripciones', 'POST', 'content-type'],
  ])('permite el preflight del navegador: %s', async (url, method, headers) => {
    const response = await fetch(url, { method: 'OPTIONS', headers: {
      Origin: 'http://localhost:5173',
      'Access-Control-Request-Method': method,
      'Access-Control-Request-Headers': headers,
    } })
    expect(response.ok).toBe(true)
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:5173')
  })
  it('carga catálogo, blog, territorio y realiza compras de invitado sin simulación JS', async () => {
    sessionStorage.clear()
    await loadIdentity()
    await loadProducts()
    await loadBlog()
    await loadCart()
    expect(getProducts()).toHaveLength(14)
    expect(blogPosts).toHaveLength(9)
    expect(registrationRegions.length).toBeGreaterThan(0)
    await clearCart()
    await addToCart(2, 2)
    expect(getCart()).toMatchObject({ totalQuantity: 2, total: 181980 })
    const customer = { name: 'Cliente Prueba', email: 'integracion@example.cl', address: 'Calle Uno 123', city: 'Santiago' }
    const cancelled = await confirmOrder(customer, 'failed')
    expect(cancelled.paymentStatus).toBe('failed')
    expect(getCart().totalQuantity).toBe(2)

    // Respuesta perdida después de crear el pedido: reintenta la MISMA clave.
    const actualFetch = globalThis.fetch
    let lostResponse = false
    let lostPayment = false
    const spy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (url, options) => {
      const response = await actualFetch(url, options)
      if (String(url).endsWith('/v1/checkout') && !lostResponse) {
        lostResponse = true
        throw new TypeError('Respuesta perdida')
      }
      if (String(url).endsWith('/pago-simulado') && !lostPayment) {
        lostPayment = true
        throw new TypeError('Respuesta de pago perdida')
      }
      return response
    })
    await expect(confirmOrder(customer, 'paid')).rejects.toMatchObject({ status: 0 })
    await expect(confirmOrder(customer, 'paid')).rejects.toMatchObject({ status: 0 })
    const paid = await confirmOrder(customer, 'paid')
    spy.mockRestore()
    expect(paid).toMatchObject({ paymentStatus: 'paid', total: 181980 })
    expect(getCart().items).toHaveLength(0)
    await loadOrders()
    expect(getOrders()).toHaveLength(2)
    const tokens = JSON.parse(sessionStorage.getItem('ja.pedidos.tokens'))
    const receipt = await request('orders', `/v1/pedidos/${paid.id}/comprobante`, { headers: { 'X-Pedido-Token': tokens[paid.id] } })
    expect(receipt.pedido.totalClp).toBe(181980)
    await expect(request('orders', `/v1/pedidos/${paid.id}`, { authenticated: false })).rejects.toMatchObject({ status: 404 })
    const message = await saveContactMessage({ name: 'Cliente Prueba', email: customer.email, message: 'Prueba de integración real.' })
    expect(message).toBeNull()
    await subscribeNewsletter(customer.email)
    expect(await subscribeNewsletter(customer.email)).toBe(false)
    await expect(request('auth', '/v1/admin/usuarios', { authenticated: false })).rejects.toMatchObject({ status: 401 })
  }, 60000)
})
