import { allPages, observable, request } from './api'
import { getCurrentUser, isAdmin } from './auth'
import { getProductById } from './products'
import { normalizeCustomer } from './orderRecords'

export const MAX_CART_QUANTITY = 99
const events = observable()
const additionEvents = observable()
let cart = { items: [], totalQuantity: 0, total: 0 }
let orders = []
let adminOrders = []
let recoveredCheckoutId = null
let queue = Promise.resolve()
const tokenKey = 'ja.carrito.token'
const guestKey = 'ja.pedidos.tokens'
const checkoutKey = 'ja.checkout'
const paymentStates = { PENDIENTE: 'pending', PAGADO: 'paid', FALLIDO: 'failed', CANCELADO: 'failed' }
const deliveryStates = { PENDIENTE: 'Pendiente', ENVIADO: 'Enviado', COMPLETADO: 'Completado' }
const stored = (key, fallback) => JSON.parse(sessionStorage.getItem(key) || JSON.stringify(fallback))
const guestTokens = () => stored(guestKey, {})
const headers = () => {
  const token = sessionStorage.getItem(tokenKey)
  return !getCurrentUser() && token ? { 'X-Carrito-Token': token } : {}
}
const orderHeaders = (id) => ({ ...(guestTokens()[id] ? { 'X-Pedido-Token': guestTokens()[id] } : {}) })
const orderRequest = (path, options = {}) => request('orders', path, { ...options, authenticated: Boolean(getCurrentUser()) })

export function mapOrder(item) {
  return { id: item.id, userId: item.usuarioId, createdAt: item.creadoEn, status: deliveryStates[item.estadoEntrega],
    paymentStatus: paymentStates[item.estadoPago], total: item.totalClp,
    customer: { name: item.entrega.nombre, email: item.entrega.correo, address: item.entrega.direccion, city: item.entrega.ciudad },
    items: item.items.map((line) => ({ productId: line.productoId, name: line.nombre, price: line.precioUnitarioClp, quantity: line.cantidad, subtotal: line.subtotalClp })) }
}

export function isProductAvailable(product) {
  return Boolean(product) && (product.availabilityCode ? product.availabilityCode !== 'AGOTADO' : !['agotado', 'sin stock', 'no disponible'].includes(product.availability?.toLowerCase()))
}
export const subscribeToCart = events.subscribe
export const subscribeToCartAdditions = additionEvents.subscribe
export const subscribeToOrders = events.subscribe
export function getCart() { return cart }
export function getOrders() { return [...orders] }
export function getAdminOrders() { return isAdmin(getCurrentUser()) ? [...adminOrders] : [] }
export function getAdminOrderById(id) { return getAdminOrders().find((order) => order.id === id) || null }

export async function refreshCart() {
  const data = await orderRequest('/v1/carrito', { headers: headers() })
  cart = { id: data.id, pendingOrderId: data.pedidoPendienteId, total: data.totalClp,
    totalQuantity: data.items.reduce((sum, line) => sum + line.cantidad, 0),
    items: data.items.map((line) => {
      const product = getProductById(line.productoId)
      return { productId: line.productoId, quantity: line.cantidad, subtotal: line.subtotalClp,
        available: line.disponibilidad !== 'AGOTADO' && line.precioClp !== null,
        product: { ...product, id: line.productoId, name: line.nombre, price: line.precioClp } }
    }) }
  events.notify()
}

export async function loadOrders() {
  const user = getCurrentUser()
  if (user) {
    // Vincular solo mediante prueba de posesión y correo verificado, nunca por correo local.
    for (const [id, token] of Object.entries(guestTokens())) {
      try {
        await orderRequest(`/v1/pedidos/${id}/vincular`, { method: 'POST', headers: { 'X-Pedido-Token': token } })
        const tokens = guestTokens(); delete tokens[id]; sessionStorage.setItem(guestKey, JSON.stringify(tokens))
      } catch (error) {
        if (![403, 404, 409].includes(error.status)) throw error
      }
    }
    const summaries = await allPages('orders', isAdmin(user) ? '/v1/admin/pedidos' : '/v1/mis-pedidos')
    const details = await Promise.all(summaries.map((item) => orderRequest(`/v1/pedidos/${item.id}`).then(mapOrder)))
    adminOrders = isAdmin(user) ? details : []
    orders = details.filter((order) => order.userId === user.id)
  } else {
    const details = await Promise.all(Object.keys(guestTokens()).map(async (id) => {
      try { return mapOrder(await orderRequest(`/v1/pedidos/${id}`, { headers: orderHeaders(id) })) }
      catch (error) { if (error.status === 404) return null; throw error }
    }))
    orders = details.filter(Boolean)
  }
  orders.sort((a, b) => b.id - a.id)
  events.notify()
}

export async function loadCart() {
  let session
  try { session = await orderRequest('/v1/carrito', { method: 'POST', headers: headers() }) }
  catch (error) {
    if (error.status !== 401 || getCurrentUser()) throw error
    sessionStorage.removeItem(tokenKey)
    sessionStorage.removeItem(checkoutKey)
    session = await orderRequest('/v1/carrito', { method: 'POST' })
  }
  if (session.tokenInvitado) sessionStorage.setItem(tokenKey, session.tokenInvitado)
  await refreshCart()
  await loadOrders()
  const checkout = stored(checkoutKey, null)
  const resolved = [...orders, ...adminOrders].find((order) => order.id === checkout?.orderId && order.paymentStatus !== 'pending')
  if (resolved) {
    recoveredCheckoutId = resolved.id
    sessionStorage.removeItem(checkoutKey)
  }
}

function serialize(action) {
  const operation = queue.then(action)
  queue = operation.catch(() => {})
  return operation
}

async function setQuantity(id, quantity) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_CART_QUANTITY) throw new Error('La cantidad debe estar entre 1 y 99.')
  await orderRequest(`/v1/carrito/items/${id}`, { method: 'PUT', headers: headers(), body: { cantidad: quantity } })
  sessionStorage.removeItem(checkoutKey)
  await refreshCart()
}
export function addToCart(id, quantity = 1) {
  return serialize(async () => {
    await setQuantity(id, (cart.items.find((item) => item.productId === id)?.quantity || 0) + quantity)
    additionEvents.notify()
  })
}
export function updateCartQuantity(id, quantity) { return serialize(() => setQuantity(id, quantity)) }
export function removeFromCart(id) {
  return serialize(async () => {
    await orderRequest(`/v1/carrito/items/${id}`, { method: 'DELETE', headers: headers() })
    sessionStorage.removeItem(checkoutKey)
    await refreshCart()
  })
}
export function clearCart() {
  return serialize(async () => {
    // No existe un borrado masivo: cada cambio se confirma en el servidor.
    try {
      for (const item of cart.items) await orderRequest(`/v1/carrito/items/${item.productId}`, { method: 'DELETE', headers: headers() })
      sessionStorage.removeItem(checkoutKey)
    } finally { await refreshCart() }
  })
}

export async function updateOrderStatus(id, status) {
  await orderRequest(`/v1/admin/pedidos/${id}/entrega`, { method: 'PATCH', body: { estado: Object.keys(deliveryStates).find((key) => deliveryStates[key] === status) } })
  await loadOrders()
}

export function confirmOrder(customer, paymentStatus) {
  return serialize(async () => {
    if (!['paid', 'failed'].includes(paymentStatus)) throw new Error('Resultado de pago no válido.')
    const delivery = normalizeCustomer(customer)
    let checkout = stored(checkoutKey, null)
    if (checkout && checkout.cartId !== cart.id) { checkout = null; sessionStorage.removeItem(checkoutKey) }
    if (!checkout) {
      checkout = { key: crypto.randomUUID(), cartId: cart.id, customer: delivery, total: cart.total }
      sessionStorage.setItem(checkoutKey, JSON.stringify(checkout))
    } else if (JSON.stringify(checkout.customer) !== JSON.stringify(delivery)) {
      throw new Error('Hay un checkout iniciado con otros datos. Conserva los datos originales para resolverlo.')
    }
    if (!checkout.orderId) {
      let result
      try { result = await orderRequest('/v1/checkout', { method: 'POST',
        headers: { ...headers(), 'Idempotency-Key': checkout.key },
        body: { entrega: { nombre: delivery.name, correo: delivery.email, direccion: delivery.address, ciudad: delivery.city }, totalEsperadoClp: checkout.total },
      }) } catch (error) {
        if ([400, 409].includes(error.status)) {
          await refreshCart()
          if (!cart.pendingOrderId) sessionStorage.removeItem(checkoutKey)
        }
        throw error
      }
      checkout.orderId = result.pedido.id
      sessionStorage.setItem(checkoutKey, JSON.stringify(checkout))
      if (result.tokenConsulta) sessionStorage.setItem(guestKey, JSON.stringify({ ...guestTokens(), [checkout.orderId]: result.tokenConsulta }))
    }
    let result
    try { result = await orderRequest(`/v1/pedidos/${checkout.orderId}/pago-simulado`, { method: 'POST', headers: headers(), body: { accion: paymentStatus === 'paid' ? 'CONFIRMAR' : 'CANCELAR' } }) }
    catch (error) {
      if (error.status !== 409) throw error
      result = await orderRequest(`/v1/pedidos/${checkout.orderId}`, { headers: orderHeaders(checkout.orderId) })
      if (result.estadoPago === 'PENDIENTE') throw error
    }
    const order = mapOrder(result)
    orders = [order, ...orders.filter((item) => item.id !== order.id)]
    await refreshCart()
    sessionStorage.removeItem(checkoutKey)
    events.notify()
    return order
  })
}

export function pendingCustomer() {
  const checkout = stored(checkoutKey, null)
  return checkout?.cartId === cart.id ? checkout.customer : null
}
export function getRecoveredCheckoutId() { return recoveredCheckoutId }
export function clearRecoveredCheckoutId() { recoveredCheckoutId = null }
