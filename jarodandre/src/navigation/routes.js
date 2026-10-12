export const routes = {
  home: '/',
  shop: '/productos',
  productDetails: '/productos/:productId',
  about: '/nosotros',
  cart: '/carrito',
  checkout: '/checkout',
  paymentResult: '/checkout/resultado/:orderId',
  orders: '/pedidos',
  blog: '/blog',
  blogDetails: '/blog/:slug',
  contact: '/contacto',
  register: '/registro',
  login: '/login',
  users: '/usuarios',
  userNew: '/usuarios/nuevo',
  adminMessages: '/admin/mensajes',
  adminSubscribers: '/admin/suscriptores',
  userEdit: '/usuarios/:userId/editar',
  admin: '/admin',
  adminOrders: '/admin/ordenes',
  adminReceipt: '/admin/ordenes/:orderId/boleta',
  adminReports: '/admin/reportes',
  adminProducts: '/admin/productos',
  adminProductNew: '/admin/productos/nuevo',
  adminProductEdit: '/admin/productos/:productId/editar',
}

export function getProductDetailsPath(id) {
  return `${routes.shop}/${encodeURIComponent(id)}`
}

export function getPaymentResultPath(id) {
  return `${routes.checkout}/resultado/${encodeURIComponent(id)}`
}

export function getUserEditPath(id) {
  return `${routes.users}/${encodeURIComponent(id)}/editar`
}

export function getAdminProductEditPath(id) {
  return `${routes.adminProducts}/${encodeURIComponent(id)}/editar`
}

export function getAdminReceiptPath(id) {
  return `${routes.adminOrders}/${encodeURIComponent(id)}/boleta`
}

export function getBlogDetailsPath(slug) {
  return `${routes.blog}/${encodeURIComponent(slug)}`
}
