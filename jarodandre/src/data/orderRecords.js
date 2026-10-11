export const paymentStatuses = {
  pending: { label: 'Pago pendiente', badge: 'text-bg-warning' },
  paid: { label: 'Pago realizado', badge: 'text-bg-success' },
  failed: { label: 'Pago no realizado', badge: 'text-bg-danger' },
}

export function normalizeCustomer(customer) {
  if (!customer || typeof customer !== 'object') throw new Error('Completa los datos de contacto y entrega.')
  const fields = { name: 120, email: 254, address: 250, city: 100 }
  const normalized = {}
  for (const [field, maxLength] of Object.entries(fields)) {
    if (typeof customer[field] !== 'string' || !customer[field].trim() || customer[field].trim().length > maxLength) {
      throw new Error('Completa correctamente el nombre, correo, dirección y ciudad.')
    }
    normalized[field] = customer[field].trim()
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.email)) throw new Error('Ingresa un correo válido.')
  return normalized
}

// Validar y copiar el registro también impide compartir referencias con la interfaz.
export function normalizeOrder(order, maxQuantity) {
  if (!order || !Number.isSafeInteger(order.id) || order.id < 1
    || typeof order.createdAt !== 'string' || !Number.isFinite(Date.parse(order.createdAt))
    || order.status !== 'Pendiente' || !Array.isArray(order.items) || !order.items.length) {
    throw new Error('El pedido guardado no es válido.')
  }
  const userId = order.userId ?? null
  const paymentStatus = order.paymentStatus ?? 'pending'
  if (!Object.hasOwn(paymentStatuses, paymentStatus)) throw new Error('El estado del pago no es válido.')
  if (userId !== null && (!Number.isSafeInteger(userId) || userId < 1)) throw new Error('El usuario del pedido no es válido.')
  const ids = new Set()
  const items = order.items.map((item) => {
    if (!item || !Number.isSafeInteger(item.productId) || item.productId < 1 || ids.has(item.productId)
      || typeof item.name !== 'string' || !item.name.trim()
      || !Number.isSafeInteger(item.price) || item.price < 0
      || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > maxQuantity) {
      throw new Error('Un artículo del pedido no es válido.')
    }
    ids.add(item.productId)
    const subtotal = item.price * item.quantity
    if (!Number.isSafeInteger(subtotal) || item.subtotal !== subtotal) throw new Error('El subtotal del pedido no es válido.')
    return { productId: item.productId, name: item.name.trim(), price: item.price, quantity: item.quantity, subtotal }
  })
  const total = items.reduce((sum, item) => sum + item.subtotal, 0)
  if (!Number.isSafeInteger(total) || order.total !== total) throw new Error('El total del pedido no es válido.')
  return { id: order.id, userId, createdAt: order.createdAt, status: order.status, paymentStatus, customer: normalizeCustomer(order.customer), items, total }
}

export function formatOrderId(id) {
  return `ORD-${String(id).padStart(4, '0')}`
}
