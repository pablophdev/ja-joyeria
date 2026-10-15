import { Component } from 'react'
import { Link } from 'react-router-dom'
import { getCurrentUser, getUsers, isAdmin, subscribeToAuth } from '../datos/auth'
import { userRoles, userStatuses } from '../datos/userOptions'
import { getUserEditPath, routes } from '../navigation/routes'

function normalizeSearch(value) {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[.\s-]/g, '')
}

class Usuarios extends Component {
  state = { users: getUsers(), query: '' }

  componentDidMount() {
    this.unsubscribe = subscribeToAuth(this.refreshUsers)
    this.refreshUsers()
  }

  componentWillUnmount() { this.unsubscribe?.() }

  refreshUsers = () => this.setState({ users: isAdmin(getCurrentUser()) ? getUsers() : [] })

  render() {
    const { users, query } = this.state
    const search = normalizeSearch(query)
    const visibleUsers = users.filter((user) => [user.name, user.email, user.rut].some((value) => normalizeSearch(value).includes(search)))
    const metrics = [
      { label: 'Total de cuentas', count: users.length },
      { label: 'Cuentas activas', count: users.filter((user) => user.status === 'active').length },
      { label: 'Cuentas con perfil administrativo', count: users.filter(isAdmin).length },
      { label: 'Pendientes o bloqueadas', count: users.filter((user) => user.status !== 'active').length },
    ]
    return (
      <section className="container py-5">
        <h1>Gestión de usuarios</h1>
        <Link className="btn btn-dark mb-3" to={routes.userNew}>Crear usuario</Link>
        <p>Cuentas registradas en la aplicación local.</p>
        <div className="row g-3 mb-4">
          {metrics.map(({ label, count }) => <div className="col-sm-6 col-lg-3" key={label}><div className="border rounded p-3 h-100"><h2 className="h6">{label}</h2><p className="fs-3 mb-0">{count}</p></div></div>)}
        </div>
        <label className="form-label" htmlFor="user-search">Buscar por nombre, RUT o correo</label>
        <input className="form-control mb-3" id="user-search" type="search" value={query} onChange={(event) => this.setState({ query: event.target.value })} aria-controls="users-list" />
        <p className="text-secondary" role="status">Mostrando {visibleUsers.length} de {users.length} cuentas</p>
        <div id="users-list">
          {!visibleUsers.length ? <p className="bg-light p-4 rounded">{users.length ? 'No hay usuarios que coincidan con la búsqueda.' : 'Todavía no hay usuarios registrados.'}</p> : (
            <div className="table-responsive"><table className="table align-middle">
              <caption>Usuarios guardados en este navegador</caption>
              <thead><tr><th scope="col">ID</th><th scope="col">Usuario / RUT</th><th scope="col">Correo</th><th scope="col">Rol</th><th scope="col">Registro</th><th scope="col">Estado</th><th scope="col">Acciones</th></tr></thead>
              <tbody>{visibleUsers.map((user) => (
                <tr key={user.id}><td>{user.id}</td><th scope="row">{user.name}<span className="d-block fw-normal">{user.rut}</span></th><td>{user.email}</td>
                  <td>{userRoles.find((role) => role.value === user.role)?.label}{isAdmin(user) && user.role !== 'admin' && <span className="d-block small text-secondary">Acceso administrativo por dominio</span>}</td><td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-CL') : 'Sin registro de fecha'}</td>
                  <td>{userStatuses.find((status) => status.value === user.status)?.label}</td><td><Link className="btn btn-outline-dark btn-sm" to={getUserEditPath(user.id)} aria-label={`Editar a ${user.name}`}>Editar</Link></td>
                </tr>
              ))}</tbody>
            </table></div>
          )}
        </div>
        <Link className="btn btn-outline-dark mt-3" to={routes.home}>Volver al inicio</Link>
      </section>
    )
  }
}

export default Usuarios
