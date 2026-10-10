import { Component } from 'react'
import { Link } from 'react-router-dom'
import { getCurrentUser, login, registerUser, subscribeToAuth } from '../data/auth'
import AuthForm from '../components/auth/AuthForm'
import { routes } from '../navigation/routes'

const emptyValues = { name: '', rut: '', email: '', confirmEmail: '', password: '', confirmPassword: '', phone: '', region: '', commune: '' }

class AuthPage extends Component {
  state = { values: { ...emptyValues }, user: getCurrentUser(), busy: false, error: '', registered: false }
  mounted = false
  submitting = false

  componentDidMount() {
    this.mounted = true
    this.unsubscribe = subscribeToAuth(this.refreshSession)
    this.refreshSession()
  }

  componentWillUnmount() {
    this.mounted = false
    this.unsubscribe?.()
  }

  refreshSession = () => this.setState({ user: getCurrentUser() })

  handleChange = (event) => {
    const { name, value } = event.target
    this.setState(({ values }) => ({ values: { ...values, [name]: value, ...(name === 'region' ? { commune: '' } : {}) }, error: '' }))
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    if (this.submitting) return
    this.submitting = true
    this.setState({ busy: true, error: '' })
    try {
      if (this.props.mode === 'register') {
        await registerUser(this.state.values)
        if (this.mounted) this.setState({ registered: true, values: { ...emptyValues } })
      } else {
        await login(this.state.values.email, this.state.values.password)
        if (this.mounted) this.setState({ values: { ...emptyValues } })
      }
    } catch (error) {
      if (this.mounted) this.setState({ error: error.message })
    } finally {
      this.submitting = false
      if (this.mounted) this.setState({ busy: false })
    }
  }

  render() {
    const isRegister = this.props.mode === 'register'
    const { user, registered, error, busy, values } = this.state
    return (
      <section className="container py-5">
        <div className="row justify-content-center"><div className="col-md-8 col-lg-6">
          <h1>{isRegister ? 'Crea tu cuenta' : 'Iniciar sesión'}</h1>
          <p>{isRegister ? 'Regístrate en JA Joyería.' : 'Bienvenido a JA Joyería. Ingresa tus datos para acceder.'}</p>
          <p className="small text-secondary">Cuenta y sesión de demostración guardadas en este navegador.</p>
          {error && <p className="alert alert-danger" role="alert">{error}</p>}
          {user ? (
            <div><p className="alert alert-success" role="status">Sesión iniciada como {user.name}.</p><Link className="btn btn-dark me-2" to={routes.shop}>Ir al catálogo</Link><Link className="btn btn-outline-dark" to={routes.orders}>Mis pedidos</Link></div>
          ) : registered ? (
            <div><p className="alert alert-success" role="status">Cuenta creada correctamente. Ya puedes iniciar sesión.</p><Link className="btn btn-dark" to={routes.login}>Iniciar sesión</Link></div>
          ) : (
            <><AuthForm mode={this.props.mode} values={values} busy={busy} onChange={this.handleChange} onSubmit={this.handleSubmit} />
              <p className="mt-4">{isRegister ? '¿Ya tienes una cuenta? ' : '¿No tienes una cuenta? '}<Link to={isRegister ? routes.login : routes.register}>{isRegister ? 'Inicia sesión' : 'Regístrate'}</Link></p></>
          )}
        </div></div>
      </section>
    )
  }
}

export default AuthPage
