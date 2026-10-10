import { Component } from 'react'
import { Navigate } from 'react-router-dom'
import { getCurrentUser, subscribeToAuth } from '../data/auth'
import { routes } from './routes'

function isAdminEmail(user) {
  return Boolean(user && user.email && user.email.toLowerCase().includes('@duoc.cl'))
}

class AdminRoute extends Component {
  state = { user: getCurrentUser() }

  componentDidMount() {
    this.unsubscribe = subscribeToAuth(this.refreshSession)
  }

  componentWillUnmount() { this.unsubscribe?.() }

  refreshSession = () => this.setState({ user: getCurrentUser() })

  render() {
    const { user } = this.state
    if (!user) return <Navigate to={routes.login} replace />
    if (!isAdminEmail(user)) return <Navigate to={routes.home} replace />
    return this.props.children
  }
}

export default AdminRoute
