import { Component } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { getCurrentUser, isAdmin, login, registerUser, subscribeToAuth } from '../datos/auth'
import CamposUsuario from '../componentes/usuarios/CamposUsuario'
import { routes } from '../navigation/routes'

const emptyValues = { name: '', rut: '', email: '', confirmEmail: '', password: '', confirmPassword: '', phone: '', region: '', commune: '' }

class Acceso extends Component {
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
        const logged = await login(this.state.values.email, this.state.values.password)
        if (this.mounted) this.setState({ values: { ...emptyValues }, user: logged })
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
    if (isAdmin(user)) return <Navigate to={routes.admin} replace />
    return (
      <section className="container py-5">
        <div className="row justify-content-center"><div className="col-md-8 col-lg-6">
          <h1>{isRegister ? 'Crea tu cuenta' : 'Iniciar sesión'}</h1>
          <p>{isRegister ? 'Regístrate en jarodandre.' : 'Bienvenido a jarodandre. Ingresa tus datos para acceder.'}</p>
          <p className="small text-secondary">Cuenta y sesión de demostración guardadas en este navegador.</p>
          {error && <p className="alert alert-danger" role="alert">{error}</p>}
          {user ? (
            <div><Link className="btn btn-dark me-2" to={routes.shop}>Ir al catálogo</Link><Link className="btn btn-outline-dark" to={routes.orders}>Mis pedidos</Link></div>
          ) : registered ? (
            <div><p className="alert alert-success" role="status">Cuenta creada correctamente. Ya puedes iniciar sesión.</p><Link className="btn btn-dark" to={routes.login}>Iniciar sesión</Link></div>
          ) : (
            <><form onSubmit={this.handleSubmit}>
              <fieldset disabled={busy}>
                <legend className="visually-hidden">{isRegister ? 'Registro de cuenta' : 'Datos de acceso'}</legend>
                {isRegister ? <CamposUsuario values={values} onChange={this.handleChange} /> : (
                  <div className="mb-3">
                    <label className="form-label" htmlFor="auth-email">Correo electrónico</label>
                    <input className="form-control" id="auth-email" name="email" type="email" autoComplete="email" required maxLength={254} value={values.email} onChange={this.handleChange} />
                  </div>
                )}
                {isRegister && <div className="mb-3">
                  <label className="form-label" htmlFor="auth-confirmEmail">Confirmar correo</label>
                  <input className="form-control" id="auth-confirmEmail" name="confirmEmail" type="email" required maxLength={254} value={values.confirmEmail} onChange={this.handleChange} />
                </div>}
                <div className="mb-3">
                  <label className="form-label" htmlFor="auth-password">Contraseña</label>
                  <input className="form-control" id="auth-password" name="password" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} required minLength={6} maxLength={128} value={values.password} onChange={this.handleChange} />
                </div>
                {isRegister && <div className="mb-3">
                  <label className="form-label" htmlFor="auth-confirmPassword">Confirmar contraseña</label>
                  <input className="form-control" id="auth-confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required minLength={6} maxLength={128} value={values.confirmPassword} onChange={this.handleChange} />
                </div>}
                {isRegister && <p className="small text-secondary">Correos admitidos: @gmail.com, @duoc.cl y @profesor.duoc.cl. Contraseña de 6 a 128 caracteres.</p>}
                <button className="btn btn-dark w-100" type="submit">{busy ? 'Procesando…' : isRegister ? 'Crear cuenta' : 'Iniciar sesión'}</button>
              </fieldset>
            </form>
              <p className="mt-4">{isRegister ? '¿Ya tienes una cuenta? ' : '¿No tienes una cuenta? '}<Link to={isRegister ? routes.login : routes.register}>{isRegister ? 'Inicia sesión' : 'Regístrate'}</Link></p></>
          )}
        </div></div>
      </section>
    )
  }
}

export default Acceso
