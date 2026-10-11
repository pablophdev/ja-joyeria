import { Component } from 'react'
import { Link } from 'react-router-dom'
import wordmark from '../../assets/jarodandre-blanco-transparente.webp'
import { routes } from '../../navigation/routes'
import CartLink from '../cart/CartLink'
import AuthLinks from '../auth/AuthLinks'
import './Header.css'

const menuItems = [
  { to: routes.home, label: 'Inicio' },
  { to: routes.shop, label: 'Productos' },
  { to: routes.about, label: 'Sobre nosotros' },
  { to: routes.blog, label: 'Blog' },
  { to: routes.contact, label: 'Contacto' },
]

class Header extends Component {
  state = { menuOpen: false }

  componentDidMount() {
    document.addEventListener('keydown', this.handleEscape)
  }

  componentDidUpdate(_prevProps, prevState) {
    if (prevState.menuOpen !== this.state.menuOpen) {
      document.body.classList.toggle('menu-open', this.state.menuOpen)
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleEscape)
    document.body.classList.remove('menu-open')
  }

  handleEscape = (event) => {
    if (event.key === 'Escape') this.setState({ menuOpen: false })
  }

  closeMenu = () => this.setState({ menuOpen: false })

  render() {
    const { menuOpen } = this.state

    return (
      <header className="site-header border-bottom">
        <div className="container py-3 d-flex align-items-center gap-3">
          <Link className="d-flex align-items-center text-decoration-none" to={routes.home} aria-label="jarodandre, ir al inicio">
            <img className="brand-wordmark" src={wordmark} alt="jarodandre" width="168" height="56" />
          </Link>
          <nav className="ms-auto d-none d-lg-block" aria-label="Navegación principal">
            <ul className="nav align-items-center">
              {menuItems.map(({ to, label }) => (
                <li className="nav-item" key={to}>
                  <Link className="nav-link text-dark" to={to}>{label}</Link>
                </li>
              ))}
              <li className="nav-item"><CartLink /></li>
              <li className="nav-item d-flex flex-wrap align-items-center gap-3 ms-2"><AuthLinks /></li>
            </ul>
          </nav>
          <button
            className="site-header__burger d-lg-none ms-auto"
            type="button"
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => this.setState({ menuOpen: true })}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>

        <div className={`mobile-menu${menuOpen ? ' is-open' : ''}`} id="mobile-menu" aria-hidden={!menuOpen}>
          <div className="mobile-menu__backdrop" onClick={this.closeMenu} aria-hidden="true" />
          <div className="mobile-menu__panel" role="dialog" aria-modal="true" aria-label="Menú de navegación">
            <div className="mobile-menu__head">
              <img className="brand-wordmark" src={wordmark} alt="" width="140" height="47" />
              <button className="mobile-menu__close" type="button" aria-label="Cerrar menú" onClick={this.closeMenu}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <nav aria-label="Navegación móvil">
              <ul className="mobile-menu__list">
                {menuItems.map(({ to, label }, index) => (
                  <li key={to} style={{ '--menu-delay': `${index * 50}ms` }}>
                    <Link className="mobile-menu__link" to={to} onClick={this.closeMenu} tabIndex={menuOpen ? 0 : -1}>{label}</Link>
                  </li>
                ))}
                <li style={{ '--menu-delay': `${menuItems.length * 50}ms` }}>
                  <CartLink onNavigate={this.closeMenu} tabIndex={menuOpen ? 0 : -1} />
                </li>
              </ul>
            </nav>
            <div className="mobile-menu__footer">
              <AuthLinks onNavigate={this.closeMenu} variant="text" />
            </div>
          </div>
        </div>
      </header>
    )
  }
}

export default Header
