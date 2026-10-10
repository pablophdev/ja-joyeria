import { Component } from 'react'
import { Link } from 'react-router-dom'
import { getCurrentUser, logout, subscribeToAuth } from '../../data/auth'
import { routes } from '../../navigation/routes'

class AuthLinks extends Component {
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
    return (
      <>
        {this.state.user ? (
          <>
            <span className="text-white">Hola, {this.state.user.name}</span>
            <button className="btn btn-link text-white p-0 align-baseline" type="button" onClick={this.handleLogout}>Cerrar sesión</button>
          </>
        ) : (
          <><Link className="text-white" to={routes.register}>Registrarse</Link><Link className="text-white" to={routes.login}>Iniciar sesión</Link></>
        )}
        {this.state.error && <span className="text-white w-100 text-end" role="alert">{this.state.error}</span>}
      </>
    )
  }
}

export default AuthLinks
