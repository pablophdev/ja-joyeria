// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { allPages, request, setTokenProvider } from '../datos/api'
import { isAdmin } from '../datos/auth'
import { imageKey, resolveImage } from '../datos/media'
import { mapProduct } from '../datos/products'
import { mapOrder } from '../datos/cart'

afterEach(() => { vi.unstubAllGlobals(); setTokenProvider(async () => null) })
const json = (data, status = 200) => ({ ok: status < 400, status, json: async () => data, text: async () => JSON.stringify(data) })

describe('Cliente HTTP', () => {
  it('envía el access token, JSON y encabezados de checkout', async () => {
    const fetch = vi.fn().mockResolvedValue(json({ id: 1 }))
    vi.stubGlobal('fetch', fetch)
    setTokenProvider(async () => 'access-token')
    await request('orders', '/v1/checkout', { method: 'POST', body: { totalEsperadoClp: 100 }, headers: { 'Idempotency-Key': 'key' } })
    const [url, options] = fetch.mock.calls[0]
    expect(url).toBe('http://localhost:8083/v1/checkout')
    expect(options.headers.Authorization).toBe('Bearer access-token')
    expect(options.headers['Idempotency-Key']).toBe('key')
    expect(JSON.parse(options.body)).toEqual({ totalEsperadoClp: 100 })
  })
  it('no envía la sesión a endpoints públicos', async () => {
    const fetch = vi.fn().mockResolvedValue(json([]))
    vi.stubGlobal('fetch', fetch)
    setTokenProvider(async () => 'secret')
    await request('catalog', '/v1/productos', { authenticated: false })
    expect(fetch.mock.calls[0][1].headers.Authorization).toBeUndefined()
  })
  it('no asigna Content-Type a un archivo multipart', async () => {
    const fetch = vi.fn().mockResolvedValue(json({ key: 'uploads/image.webp' }))
    vi.stubGlobal('fetch', fetch)
    const body = new FormData()
    body.append('imagen', new Blob(['image']))
    await request('catalog', '/v1/admin/imagenes', { method: 'POST', body })
    expect(fetch.mock.calls[0][1].headers['Content-Type']).toBeUndefined()
    expect(fetch.mock.calls[0][1].body).toBe(body)
  })
  it('acepta 204 sin intentar leer JSON', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 204 }))
    await expect(request('orders', '/v1/carrito/items/1', { method: 'DELETE' })).resolves.toBeNull()
  })
  it('acepta 201 sin cuerpo al recibir un mensaje', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 201, text: async () => '' }))
    await expect(request('communications', '/v1/contacto', { method: 'POST' })).resolves.toBeNull()
  })
  it('preserva los detalles y el estado de errores del backend', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({ detail: 'El precio cambió' }, 409)))
    await expect(request('orders', '/v1/checkout')).rejects.toMatchObject({ message: 'El precio cambió', status: 409 })
  })
  it('informa fallos de conexión sin mostrar éxito', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    await expect(request('catalog', '/v1/productos')).rejects.toMatchObject({ status: 0 })
  })
  it('recorre todas las páginas sin truncar el catálogo', async () => {
    const fetch = vi.fn().mockResolvedValueOnce(json({ content: [1], last: false, totalPages: 2 }))
      .mockResolvedValueOnce(json({ content: [2], last: true, totalPages: 2 }))
    vi.stubGlobal('fetch', fetch)
    expect(await allPages('catalog', '/v1/productos')).toEqual([1, 2])
    expect(fetch.mock.calls[1][0]).toContain('page=1')
  })
  it('utiliza los parámetros españoles de paginación en comunicaciones', async () => {
    const fetch = vi.fn().mockResolvedValue(json({ content: [], last: true }))
    vi.stubGlobal('fetch', fetch)
    await allPages('communications', '/v1/admin/mensajes', {}, { page: 'pagina', size: 'tamano' })
    expect(fetch.mock.calls[0][0]).toContain('tamano=100&pagina=0')
  })
})

describe('Contratos e imágenes', () => {
  it('mapea producto, categoría y estados desde la API', () => {
    const product = mapProduct({ id: 2, nombre: 'Anillo', precioClp: 990, imagenKey: 'products/product-2.jpg',
      categoria: { id: 1, slug: 'anillos' }, etiquetas: ['plata'], disponibilidad: 'AGOTADO', valoracion: 4, cantidadResenas: 2 })
    expect(product).toMatchObject({ id: 2, name: 'Anillo', price: 990, category: 'anillos', availability: 'Agotado', rating: 4 })
    expect(imageKey(product.image)).toBe('products/product-2.jpg')
  })
  it('resuelve uploads en el servidor y conserva la clave para guardar', () => {
    expect(resolveImage('uploads/a.webp')).toBe('http://localhost:8082/media/uploads/a.webp')
    expect(imageKey(resolveImage('uploads/a.webp'))).toBe('uploads/a.webp')
    expect(resolveImage('blog/blog-1.jpg')).not.toContain('/media/blog')
  })
  it('conserva UUID y montos del servidor en pedidos', () => {
    const order = mapOrder({ id: 1, usuarioId: 'd7aa9e8f-c746-4afe-a134-f67ca8201420', creadoEn: '2026-01-01',
      estadoPago: 'PAGADO', estadoEntrega: 'ENVIADO', totalClp: 200,
      entrega: { nombre: 'Cliente', correo: 'a@example.cl', direccion: 'Calle', ciudad: 'Santiago' },
      items: [{ productoId: 2, nombre: 'Anillo', precioUnitarioClp: 100, cantidad: 2, subtotalClp: 200 }] })
    expect(order).toMatchObject({ paymentStatus: 'paid', status: 'Enviado', total: 200, userId: 'd7aa9e8f-c746-4afe-a134-f67ca8201420' })
    expect(order.items[0]).toMatchObject({ price: 100, quantity: 2, subtotal: 200 })
  })
  it('un dominio Duoc no concede permisos administrativos', () => {
    expect(isAdmin({ email: 'admin@duoc.cl', role: 'user', status: 'active' })).toBe(false)
    expect(isAdmin({ role: 'admin', status: 'inactive' })).toBe(false)
    expect(isAdmin({ role: 'admin', status: 'active' })).toBe(true)
  })
})
