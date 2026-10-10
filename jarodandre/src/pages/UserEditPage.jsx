import { Component } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { deleteUser, getUserById, subscribeToAuth, updateUser } from '../data/auth'
import UserEditForm from '../components/users/UserEditForm'
import { routes } from '../navigation/routes'

function findUser(value) {
  const id = Number(value)
  return /^[1-9]\d*$/.test(value) && Number.isSafeInteger(id) ? getUserById(id) : null
}

function formValues(user) {
  if (!user) return null
  const { name, rut, email, phone, region, commune, role, status } = user
  return { name, rut, email, phone, region, commune, role, status, password: '', confirmPassword: '' }
}

class UserEditPage extends Component {
  state = { user: findUser(this.props.userId), values: formValues(findUser(this.props.userId)), busy: false, error: '', message: '', deleted: false }
  mounted = false
  submitting = false

  componentDidMount() {
    this.mounted = true
    this.unsubscribe = subscribeToAuth(this.refreshUser)
    this.refreshUser()
  }

  componentWillUnmount() { this.mounted = false; this.unsubscribe?.() }

  refreshUser = () => {
    const user = findUser(this.props.userId)
    this.setState((state) => JSON.stringify(user) === JSON.stringify(state.user) ? null : { user, values: formValues(user) })
  }

  handleChange = (event) => {
    const { name, value } = event.target
    this.setState(({ values }) => ({ values: { ...values, [name]: value, ...(name === 'region' ? { commune: '' } : {}) }, error: '', message: '' }))
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    if (this.submitting) return
    this.submitting = true
    this.setState({ busy: true, error: '', message: '' })
    try {
      const user = await updateUser(Number(this.props.userId), this.state.values)
      if (!user) throw new Error('El usuario ya no existe.')
      if (this.mounted) this.setState({ user, values: formValues(user), message: 'Cambios guardados correctamente.' })
    } catch (error) {
      if (this.mounted) this.setState({ error: error.message })
    } finally {
      this.submitting = false
      if (this.mounted) this.setState({ busy: false })
    }
  }

  handleDelete = () => {
    if (this.submitting) return
    try {
      deleteUser(Number(this.props.userId))
      this.setState({ deleted: true })
    } catch (error) { this.setState({ error: error.message, message: '' }) }
  }

  render() {
    const { user, values, busy, error, message, deleted } = this.state
    if (deleted) return <Navigate to={routes.users} replace />
    if (!user) return <section className="container py-5"><h1>Usuario no encontrado</h1><p>La cuenta no existe o fue eliminada.</p><Link className="btn btn-dark" to={routes.users}>Volver a usuarios</Link></section>
    return (
      <section className="container py-5">
        <div className="row justify-content-center"><div className="col-lg-8">
          <h1>Editar usuario</h1><p>Cuenta #{user.id}: {user.name}</p>
          <Link className="d-inline-block mb-4" to={routes.users}>Volver a usuarios</Link>
          {error && <p className="alert alert-danger" role="alert">{error}</p>}
          <p className="text-success" role="status">{message}</p>
          <UserEditForm values={values} busy={busy} onChange={this.handleChange} onSubmit={this.handleSubmit} onDelete={this.handleDelete} />
        </div></div>
      </section>
    )
  }
}

export default UserEditPage
