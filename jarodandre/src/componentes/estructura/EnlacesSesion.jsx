import { Component } from 'react'
import { Link } from 'react-router-dom'
import loginIcon from '../../assets/login.svg'
import { getCurrentUser, logout, subscribeToAuth } from '../../datos/auth'
import { routes } from '../../navigation/routes'

class EnlacesSesion extends Component {
  state = { user: getCurrentUser(), error: '' }

  componentDidMount() {
    this.unsubscribe = subscribeToAuth(this.refreshSession)
    this.refreshSession()
  }

  componentWillUnmount() { this.unsubscribe?.() }

  refreshSession = () => this.setState({ user: getCurrentUser(), error: '' })

  handleLogout = () => {
    try { logout() } catch (error) { this.setState({ error: error.message }) }
  }

  render() {
    const { onNavigate, variant } = this.props

    return (
      <>
        {this.state.user ? (
          <>
            <span className="nav-link text-dark px-0">Hola, {this.state.user.name}</span>
            <button className="btn btn-link nav-link text-dark p-0" type="button" onClick={this.handleLogout}>Cerrar sesión</button>
          </>
        ) : variant === 'text' ? (
          <Link className="nav-link text-dark" to={routes.login} onClick={onNavigate}>Iniciar sesión</Link>
        ) : (
          <Link className="nav-link text-dark d-inline-flex align-items-center" to={routes.login} aria-label="Iniciar sesión" onClick={onNavigate}>
            <img src={loginIcon} alt="" width="20" height="20" />
          </Link>
        )}
        {this.state.error && <span className="nav-link text-danger px-0" role="alert">{this.state.error}</span>}
      </>
    )
  }
}

export default EnlacesSesion
