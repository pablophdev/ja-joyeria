import { Component, createRef } from 'react'
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
  menuRef = createRef()

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
    document.body.classList.remove('menu-open')
  }

  handleResize = () => {
    if (window.innerWidth >= 1200 && this.state.menuOpen) {
      this.closeMenu()
    }
  }

  openMenu = () => {
    this.menuRef.current.showModal()
    document.body.classList.add('menu-open')
    this.setState({ menuOpen: true })
  }

  closeMenu = () => {
    this.menuRef.current.close()
    document.body.classList.remove('menu-open')
    this.setState({ menuOpen: false })
  }

  render() {
    const { menuOpen } = this.state

    return (
      <header className="site-header border-bottom">
        <div className="container py-3 d-flex align-items-center gap-3">
          <Link className="d-flex align-items-center text-decoration-none" to={routes.home} aria-label="jarodandre, ir al inicio">
            <img className="brand-wordmark" src={wordmark} alt="jarodandre" width="168" height="56" />
          </Link>
          <nav className="ms-auto d-none d-xl-block" aria-label="Navegación principal">
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
            className="site-header__burger d-xl-none ms-auto"
            type="button"
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={this.openMenu}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>

        <dialog
          ref={this.menuRef}
          className="mobile-menu"
          id="mobile-menu"
          aria-label="Menú de navegación"
          onCancel={this.closeMenu}
          onClick={(event) => {
            if (event.target === event.currentTarget) this.closeMenu()
          }}
        >
          <div className="mobile-menu__panel">
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
                {menuItems.map((item) => (
                  <li key={item.to}>
                    <Link className="mobile-menu__link" to={item.to} onClick={this.closeMenu}>{item.label}</Link>
                  </li>
                ))}
                <li>
                  <CartLink onNavigate={this.closeMenu} />
                </li>
              </ul>
            </nav>
            <div className="mobile-menu__footer">
              <AuthLinks onNavigate={this.closeMenu} variant="text" />
            </div>
          </div>
        </dialog>
      </header>
    )
  }
}

export default Header
