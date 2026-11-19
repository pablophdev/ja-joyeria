import { Component } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { getCurrentUser, isAdmin, login, needsProfile, registerUser } from '../datos/auth'
import { cognitoConfigured } from '../datos/cognito'
import CamposUsuario from '../componentes/usuarios/CamposUsuario'
import { routes } from '../navigation/routes'

export default class Acceso extends Component {
  state = { values: { name: '', rut: '', phone: '', region: '', commune: '' }, busy: false, error: '' }
  handleChange = ({ target: { name, value } }) => {
    this.setState(({ values }) => ({ values: { ...values, [name]: value, ...(name === 'region' ? { commune: '' } : {}) } }))
  }
  submit = async (event) => {
    event.preventDefault()
    if (this.state.busy) return
    this.setState({ busy: true, error: '' })
    try {
      if (needsProfile || this.props.mode === 'register') await registerUser(this.state.values)
      else await login()
    } catch (error) { this.setState({ error: error.message }) }
    finally { this.setState({ busy: false }) }
  }
  render() {
    const user = getCurrentUser()
    if (isAdmin(user)) return <Navigate to={routes.admin} replace />
    return <section className="container py-5"><div className="row justify-content-center"><div className="col-lg-6">
      <h1>{needsProfile ? 'Completa tu perfil' : this.props.mode === 'register' ? 'Crea tu cuenta' : 'Iniciar sesión'}</h1>
      {user ? <><p>Sesión iniciada como {user.name}.</p><Link to={routes.orders}>Mis pedidos</Link></> :
        <form onSubmit={this.submit}><fieldset disabled={this.state.busy || (!needsProfile && !cognitoConfigured)}>
          {needsProfile ? <><p>Tu correo y contraseña se gestionan en Cognito. Completa tus datos de compra.</p><CamposUsuario values={this.state.values} onChange={this.handleChange} /></> :
            <p>Continúa en la página segura de AWS Cognito para acceder o registrar una cuenta.</p>}
          <button className="btn btn-dark" type="submit">{this.state.busy ? 'Procesando…' : needsProfile ? 'Guardar perfil' : 'Continuar con Cognito'}</button>
        </fieldset></form>}
      {!cognitoConfigured && !user && <p className="alert alert-warning mt-3">El acceso requiere configurar VITE_COGNITO_DOMAIN y VITE_COGNITO_CLIENT_ID. Puedes comprar como invitado.</p>}
      {this.state.error && <p className="alert alert-danger mt-3" role="alert">{this.state.error}</p>}
      <Link className="d-block mt-3" to={routes.shop}>Volver al catálogo</Link>
    </div></div></section>
  }
}
