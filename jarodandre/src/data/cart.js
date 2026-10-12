import { getProductById, getProducts, subscribeToProducts } from './products'
import { readStoredData, writeStoredData } from './persistence'
import { deliveryStatuses, normalizeCustomer, normalizeOrder } from './orderRecords'
import { getCurrentUser, isAdmin, subscribeToAuth } from './auth'

export const MAX_CART_QUANTITY = 99
const storageKey = 'jarodandre.cart'
let items = []
let orders = []
let nextOrderId = 1
let initialized = false
const listeners = new Set()
let unsubscribeProducts

function validateQuantity(quantity) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_CART_QUANTITY) {
    throw new Error(`La cantidad debe ser un entero entre 1 y ${MAX_CART_QUANTITY}.`)
  }
}

function validateId(productId) {
  if (!Number.isSafeInteger(productId) || productId < 1) throw new Error('El ID del producto no es válido.')
}

export function isProductAvailable(product) {
  const availability = product?.availability?.trim().toLocaleLowerCase('es')
  return Boolean(product) && !['agotado', 'sin stock', 'no disponible'].includes(availability)
}

let unsubscribeAuth

function normalizeEmail(value) {
  return value.trim().toLocaleLowerCase('es')
}

// Al iniciar sesión, los pedidos de invitado hechos con el mismo correo de la
// cuenta pasan a ser del usuario. Así cada cliente ve solo sus propias compras.
function tryClaimGuestOrders() {
  const user = getCurrentUser()
  if (!user) return
  const email = normalizeEmail(user.email)
  let changed = false
  const claimed = orders.map((order) => {
    if (order.userId !== null || normalizeEmail(order.customer.email) !== email) return order
    changed = true
    return { ...order, userId: user.id }
  })
  if (changed) saveCart(items, claimed, nextOrderId)
}

function initializeCart() {
  if (initialized) return
  initialized = true
  const stored = readStoredData(storageKey)
  if (stored === null) {
    if (!unsubscribeAuth) unsubscribeAuth = subscribeToAuth(tryClaimGuestOrders)
    return
  }

  try {
    if (![1, 2].includes(stored.version) || !Array.isArray(stored.items)) throw new Error('Formato de carrito no válido.')
    const ids = new Set()
    const restored = stored.items.map(({ productId, quantity }) => {
      validateId(productId)
      validateQuantity(quantity)
      if (ids.has(productId)) throw new Error('El carrito contiene productos duplicados.')
      ids.add(productId)
      return { productId, quantity }
    })
    let restoredOrders = []
    let restoredNextId = 1
    if (stored.version === 2) {
      if (!Array.isArray(stored.orders)) throw new Error('El historial de pedidos no es válido.')
      restoredOrders = stored.orders.map((order) => normalizeOrder(order, MAX_CART_QUANTITY))
      const orderIds = new Set(restoredOrders.map((order) => order.id))
      restoredNextId = stored.nextOrderId
      if (orderIds.size !== restoredOrders.length || !Number.isSafeInteger(restoredNextId) || restoredNextId < 1
        || restoredOrders.some((order) => order.id >= restoredNextId)) throw new Error('Los IDs de pedidos no son válidos.')
    }
    items = restored
    orders = restoredOrders
    nextOrderId = restoredNextId
  } catch (error) {
    console.warn('No se pudieron restaurar el carrito y sus pedidos. Se mostrarán vacíos.', error)
  }
  if (!unsubscribeAuth) unsubscribeAuth = subscribeToAuth(tryClaimGuestOrders)
  try { tryClaimGuestOrders() } catch (error) { console.warn('No se pudieron asociar pedidos de invitado a la sesión actual.', error) }
}

function notifyCart() {
  for (const listener of listeners) {
    try {
      listener()
    } catch (error) {
      console.error('No se pudo actualizar un componente del carrito.', error)
    }
  }
}

function saveCart(updatedItems, updatedOrders = orders, updatedNextOrderId = nextOrderId) {
  // Un único registro permite confirmar el pedido y vaciar el carrito de forma atómica.
  writeStoredData(storageKey, { version: 2, items: updatedItems, orders: updatedOrders, nextOrderId: updatedNextOrderId })
  items = updatedItems
  orders = updatedOrders
  nextOrderId = updatedNextOrderId
  notifyCart()
}

export function subscribeToCart(listener) {
  if (typeof listener !== 'function') throw new Error('La suscripción debe recibir una función.')
  initializeCart()
  if (!listeners.size) unsubscribeProducts = subscribeToProducts(notifyCart)
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
    if (!listeners.size) {
      unsubscribeProducts?.()
      unsubscribeProducts = undefined
    }
  }
}

export function getCart() {
  initializeCart()
  const products = new Map(getProducts().map((product) => [product.id, product]))
  const cartItems = items.map((item) => {
    const product = products.get(item.productId) ?? null
    const available = isProductAvailable(product)
    return { ...item, product, available, subtotal: available ? product.price * item.quantity : 0 }
  })
  return {
    items: cartItems,
    totalQuantity: cartItems.reduce((total, item) => total + item.quantity, 0),
    total: cartItems.reduce((total, item) => total + item.subtotal, 0),
  }
}

export function addToCart(productId, quantity = 1) {
  initializeCart()
  validateId(productId)
  validateQuantity(quantity)
  if (!isProductAvailable(getProductById(productId))) throw new Error('Este producto no está disponible.')
  const existing = items.find((item) => item.productId === productId)
  const updatedQuantity = (existing?.quantity ?? 0) + quantity
  validateQuantity(updatedQuantity)
  saveCart(existing
    ? items.map((item) => item.productId === productId ? { ...item, quantity: updatedQuantity } : item)
    : [...items, { productId, quantity }])
}

export function updateCartQuantity(productId, quantity) {
  initializeCart()
  validateId(productId)
  validateQuantity(quantity)
  if (!items.some((item) => item.productId === productId)) throw new Error('El producto no está en el carrito.')
  if (!isProductAvailable(getProductById(productId))) throw new Error('Este producto no está disponible.')
  saveCart(items.map((item) => item.productId === productId ? { ...item, quantity } : item))
}

export function removeFromCart(productId) {
  initializeCart()
  validateId(productId)
  saveCart(items.filter((item) => item.productId !== productId))
}

export function clearCart() {
  initializeCart()
  saveCart([])
}

export function getOrders() {
  initializeCart()
  const userId = getCurrentUser()?.id ?? null
  return orders.filter((order) => order.userId === userId).map((order) => normalizeOrder(order, MAX_CART_QUANTITY)).sort((first, second) => second.id - first.id)
}

export function getAdminOrders() {
  initializeCart()
  if (!isAdmin(getCurrentUser())) return []
  return orders.map((order) => normalizeOrder(order, MAX_CART_QUANTITY)).sort((first, second) => second.id - first.id)
}

export function getAdminOrderById(id) {
  return getAdminOrders().find((order) => order.id === id) ?? null
}

export function subscribeToOrders(listener) {
  return subscribeToCart(listener)
}

export function updateOrderStatus(id, status) {
  initializeCart()
  if (!isAdmin(getCurrentUser())) throw new Error('Se requiere cuenta de administrador.')
  if (!Number.isSafeInteger(id) || id < 1) throw new Error('El ID del pedido no es válido.')
  if (!Object.hasOwn(deliveryStatuses, status)) throw new Error('Selecciona un estado de entrega válido.')
  const order = orders.find((entry) => entry.id === id)
  if (!order) throw new Error('El pedido ya no existe.')
  if (status !== 'Pendiente' && order.paymentStatus !== 'paid') throw new Error('Solo se pueden enviar o completar pedidos con pago realizado.')
  const updated = normalizeOrder({ ...order, status }, MAX_CART_QUANTITY)
  saveCart(items, orders.map((entry) => entry.id === id ? updated : entry))
  return normalizeOrder(updated, MAX_CART_QUANTITY)
}

export function confirmOrder(customer, paymentStatus) {
  if (!['paid', 'failed'].includes(paymentStatus)) throw new Error('No se pudo determinar el resultado del pago.')
  const normalizedCustomer = normalizeCustomer(customer)
  const cart = getCart()
  if (!cart.items.length) throw new Error('El carrito está vacío.')
  if (cart.items.some((item) => !item.available)) throw new Error('Quita los productos no disponibles antes de confirmar el pedido.')
  if (nextOrderId >= Number.MAX_SAFE_INTEGER) throw new Error('No hay más IDs de pedido disponibles.')

  const order = normalizeOrder({
    id: nextOrderId,
    userId: getCurrentUser()?.id ?? null,
    createdAt: new Date().toISOString(),
    status: 'Pendiente',
    paymentStatus,
    customer: normalizedCustomer,
    items: cart.items.map(({ product, quantity, subtotal }) => ({ productId: product.id, name: product.name, price: product.price, quantity, subtotal })),
    total: cart.total,
  }, MAX_CART_QUANTITY)
  saveCart(paymentStatus === 'paid' ? [] : items, [...orders, order], nextOrderId + 1)
  return normalizeOrder(order, MAX_CART_QUANTITY)
}
