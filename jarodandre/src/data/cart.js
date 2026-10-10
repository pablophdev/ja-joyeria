import { getProductById, getProducts, subscribeToProducts } from './products'
import { readStoredData, writeStoredData } from './persistence'

export const MAX_CART_QUANTITY = 99
const storageKey = 'jarodandre.cart'
let items = []
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

function initializeCart() {
  if (initialized) return
  initialized = true
  const stored = readStoredData(storageKey)
  if (stored === null) return

  try {
    if (stored.version !== 1 || !Array.isArray(stored.items)) throw new Error('Formato de carrito no válido.')
    const ids = new Set()
    const restored = stored.items.map(({ productId, quantity }) => {
      validateId(productId)
      validateQuantity(quantity)
      if (ids.has(productId)) throw new Error('El carrito contiene productos duplicados.')
      ids.add(productId)
      return { productId, quantity }
    })
    items = restored
  } catch (error) {
    console.warn('No se pudo restaurar el carrito. Se mostrará vacío.', error)
  }
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

function saveCart(updatedItems) {
  writeStoredData(storageKey, { version: 1, items: updatedItems })
  items = updatedItems
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
