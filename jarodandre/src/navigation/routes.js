export const routes = {
  home: '/',
  shop: '/productos',
  productDetails: '/productos/:productId',
  about: '/nosotros',
  cart: '/carrito',
  orders: '/pedidos',
  blog: '/blog',
  contact: '/contacto',
  register: '/registro',
  login: '/login',
  users: '/usuarios',
  userEdit: '/usuarios/:userId/editar',
  admin: '/admin',
  adminProducts: '/admin/productos',
  adminProductNew: '/admin/productos/nuevo',
  adminProductEdit: '/admin/productos/:productId/editar',
}

export function getProductDetailsPath(id) {
  return `${routes.shop}/${encodeURIComponent(id)}`
}

export function getUserEditPath(id) {
  return `${routes.users}/${encodeURIComponent(id)}/editar`
}

export function getAdminProductEditPath(id) {
  return `${routes.adminProducts}/${encodeURIComponent(id)}/editar`
}

export const pendingPages = [
  { path: routes.about, title: 'Sobre nosotros' },
  { path: routes.blog, title: 'Blog' },
  { path: routes.contact, title: 'Contacto' },
]
