export const routes = {
  home: '/',
  shop: '/productos',
  about: '/nosotros',
  cart: '/carrito',
  blog: '/blog',
  contact: '/contacto',
  register: '/registro',
  login: '/login',
}

export const pendingPages = [
  { path: routes.about, title: 'Sobre nosotros' },
  { path: routes.cart, title: 'Carrito' },
  { path: routes.blog, title: 'Blog' },
  { path: routes.contact, title: 'Contacto' },
  { path: routes.register, title: 'Registrarse' },
  { path: routes.login, title: 'Iniciar sesión' },
]
