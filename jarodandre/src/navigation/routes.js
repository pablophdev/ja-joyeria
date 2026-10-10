export const routes = {
  home: '/',
  shop: '/productos',
  productDetails: '/productos/:productId',
  about: '/nosotros',
  cart: '/carrito',
  blog: '/blog',
  contact: '/contacto',
  register: '/registro',
  login: '/login',
}

export function getProductDetailsPath(id) {
  return `${routes.shop}/${encodeURIComponent(id)}`
}

export const pendingPages = [
  { path: routes.about, title: 'Sobre nosotros' },
  { path: routes.blog, title: 'Blog' },
  { path: routes.contact, title: 'Contacto' },
  { path: routes.register, title: 'Registrarse' },
  { path: routes.login, title: 'Iniciar sesión' },
]
