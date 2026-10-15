import { Component } from 'react'
import { deleteNewsletterSubscriber, getNewsletterSubscribers, subscribeToNewsletter } from '../datos/newsletter'
import { getCurrentUser, isAdmin, subscribeToAuth } from '../datos/auth'

class SuscriptoresAdmin extends Component {
  state = { subscribers: getNewsletterSubscribers(), query: '', error: '', message: '' }

  componentDidMount() {
    this.unsubscribe = subscribeToNewsletter(this.refreshSubscribers)
    this.unsubscribeAuth = subscribeToAuth(this.refreshSubscribers)
    this.refreshSubscribers()
  }

  componentWillUnmount() { this.unsubscribe?.(); this.unsubscribeAuth?.() }

  refreshSubscribers = () => {
    this.setState({ subscribers: isAdmin(getCurrentUser()) ? getNewsletterSubscribers() : [] })
  }

  handleDelete = (email) => {
    try {
      deleteNewsletterSubscriber(email)
      this.setState({ error: '', message: `Se dio de baja a ${email} de la lista local.` })
    } catch (error) {
      this.setState({ error: error.message, message: '' })
    }
  }

  render() {
    const { subscribers, query, error, message } = this.state
    const visible = subscribers.filter((entry) => entry.email.includes(query.trim().toLowerCase()))
    return (
      <section>
        <h1>Suscriptores</h1>
        <p>Correos registrados desde el pie de página en este navegador. No se realizan envíos de correo.</p>
        {error && <p className="alert alert-danger" role="alert">{error}</p>}
        <p className="text-success" role="status">{message}</p>
        <label className="form-label" htmlFor="subscriber-search">Buscar correo</label>
        <input className="form-control mb-3" id="subscriber-search" type="search" value={query} onChange={(event) => this.setState({ query: event.target.value })} />
        <p role="status">Mostrando {visible.length} de {subscribers.length} suscriptores</p>
        {!visible.length ? <p className="bg-light rounded p-4">{subscribers.length ? 'No hay correos que coincidan con la búsqueda.' : 'Todavía no hay suscriptores.'}</p> : (
          <div className="table-responsive"><table className="table align-middle">
            <caption>Suscripciones locales</caption>
            <thead><tr><th scope="col">Correo</th><th scope="col">Fecha de suscripción</th><th scope="col">Acciones</th></tr></thead>
            <tbody>{visible.map((entry) => <tr key={entry.email}><th scope="row" className="text-break">{entry.email}</th><td><time dateTime={entry.createdAt}>{new Date(entry.createdAt).toLocaleString('es-CL')}</time></td><td><button className="btn btn-outline-danger btn-sm" type="button" onClick={() => this.handleDelete(entry.email)} aria-label={`Dar de baja a ${entry.email}`}>Dar de baja</button></td></tr>)}</tbody>
          </table></div>
        )}
      </section>
    )
  }
}

export default SuscriptoresAdmin
