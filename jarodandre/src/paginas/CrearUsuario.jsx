import { Component } from 'react'
import { Navigate } from 'react-router-dom'
import { createUser } from '../datos/auth'
import FormularioUsuario from '../componentes/usuarios/FormularioUsuario'
import { getUserEditPath } from '../navigation/routes'

class CrearUsuario extends Component {
  state = { values: { name: '', rut: '', email: '', phone: '', region: '', commune: '', role: 'user', status: 'active', password: '', confirmPassword: '' }, busy: false, error: '', userId: null }
  mounted = false
  submitting = false

  componentDidMount() { this.mounted = true }
  componentWillUnmount() { this.mounted = false }

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
      const user = await createUser(this.state.values)
      if (this.mounted) this.setState({ userId: user.id })
    } catch (error) {
      if (this.mounted) this.setState({ error: error.message })
    } finally {
      this.submitting = false
      if (this.mounted) this.setState({ busy: false })
    }
  }

  render() {
    const { values, busy, error, userId } = this.state
    if (userId) return <Navigate to={getUserEditPath(userId)} replace state={{ created: true }} />
    return (
      <section className="container py-5">
        <div className="row justify-content-center"><div className="col-lg-8">
          <h1>Crear usuario</h1>
          <p>Registra una cuenta local y asigna su rol y estado. Tu sesión administrativa se conserva.</p>
          {error && <p className="alert alert-danger" role="alert">{error}</p>}
          <FormularioUsuario creating values={values} busy={busy} onChange={this.handleChange} onSubmit={this.handleSubmit} />
        </div></div>
      </section>
    )
  }
}

export default CrearUsuario
