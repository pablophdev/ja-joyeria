import { Link } from 'react-router-dom'
import logo from '../../assets/logo.jpg'
import { routes } from '../../navigation/routes'
import CartLink from '../cart/CartLink'

const menuItems = [
  { to: routes.home, label: 'Inicio' },
  { to: routes.shop, label: 'Productos' },
  { to: routes.about, label: 'Sobre nosotros' },
  { to: routes.blog, label: 'Blog' },
  { to: routes.contact, label: 'Contacto' },
]

function Header() {
  return (
    <header className="border-bottom">
      <div className="bg-dark py-2">
        <div className="container d-flex flex-wrap justify-content-end gap-3">
          <Link className="text-white" to={routes.register}>Registrarse</Link>
          <Link className="text-white" to={routes.login}>Iniciar sesión</Link>
          <Link className="text-white" to={routes.orders}>Pedidos</Link>
        </div>
      </div>
      <div className="container py-3 d-flex flex-column flex-lg-row align-items-center gap-3">
        <Link className="d-flex align-items-center gap-2 text-dark text-decoration-none fw-bold" to={routes.home}>
          <img className="brand-logo" src={logo} width="48" height="48" alt="" />
          JA Joyería
        </Link>
        <nav className="ms-lg-auto" aria-label="Navegación principal">
          <ul className="nav justify-content-center">
            {menuItems.map(({ to, label }) => (
              <li className="nav-item" key={to}>
                <Link className="nav-link text-dark" to={to}>{label}</Link>
              </li>
            ))}
            <li className="nav-item"><CartLink /></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
