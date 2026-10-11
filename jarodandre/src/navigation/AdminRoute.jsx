import { Component } from 'react'
import { Navigate } from 'react-router-dom'
import { getCurrentUser, isAdmin, subscribeToAuth } from '../data/auth'
import { routes } from './routes'

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
    if (!isAdmin(user)) return <Navigate to={routes.home} replace />
    return this.props.children
  }
}

export default AdminRoute
