import { Component } from 'react'
import { deleteContactMessage, getContactMessages, setContactMessageRead, subscribeToContactMessages } from '../data/contactMessages'
import { getCurrentUser, isAdmin, subscribeToAuth } from '../data/auth'

class AdminMessagesPage extends Component {
  state = { messages: getContactMessages(), query: '', filter: 'all', error: '', message: '' }

  componentDidMount() {
    this.unsubscribe = subscribeToContactMessages(this.refreshMessages)
    this.unsubscribeAuth = subscribeToAuth(this.refreshMessages)
    this.refreshMessages()
  }

  componentWillUnmount() { this.unsubscribe?.(); this.unsubscribeAuth?.() }

  refreshMessages = () => {
    this.setState({ messages: isAdmin(getCurrentUser()) ? getContactMessages() : [] })
  }

  handleAction = (entry, remove = false) => {
    try {
      if (remove) deleteContactMessage(entry.id)
      else setContactMessageRead(entry.id, !entry.read)
      this.setState({ error: '', message: remove ? 'Mensaje eliminado.' : `Mensaje marcado como ${entry.read ? 'no leído' : 'leído'}.` })
    } catch (error) {
      this.setState({ error: error.message, message: '' })
    }
  }

  render() {
    const { messages, query, filter, error, message } = this.state
    const visible = messages.filter((entry) => (
      (filter === 'all' || entry.read === (filter === 'read'))
      && `${entry.name} ${entry.email} ${entry.message}`.toLocaleLowerCase('es').includes(query.trim().toLocaleLowerCase('es'))
    ))
    return (
      <section>
        <h1>Mensajes de contacto</h1>
        <p>Bandeja local: {messages.filter((entry) => !entry.read).length} sin leer de {messages.length} mensajes. No se envían respuestas por correo desde esta demo.</p>
        {error && <p className="alert alert-danger" role="alert">{error}</p>}
        <p className="text-success" role="status">{message}</p>
        <div className="row g-3 mb-4">
          <div className="col-md-8"><label className="form-label" htmlFor="message-search">Buscar nombre, correo o mensaje</label><input className="form-control" id="message-search" type="search" value={query} onChange={(event) => this.setState({ query: event.target.value })} /></div>
          <div className="col-md-4"><label className="form-label" htmlFor="message-filter">Lectura</label><select className="form-select" id="message-filter" value={filter} onChange={(event) => this.setState({ filter: event.target.value })}><option value="all">Todos</option><option value="unread">Sin leer</option><option value="read">Leídos</option></select></div>
        </div>
        <p role="status">Mostrando {visible.length} mensajes</p>
        {!visible.length && <p className="bg-light rounded p-4">{messages.length ? 'No hay mensajes que coincidan con los filtros.' : 'Los mensajes enviados desde Contacto aparecerán aquí.'}</p>}
        {visible.map((entry) => (
          <article className="card mb-3" key={entry.id}>
            <div className="card-body">
              <div className="d-flex flex-wrap justify-content-between gap-2"><h2 className="h5">{entry.name}</h2><span className={`badge align-self-start ${entry.read ? 'text-bg-secondary' : 'text-bg-warning'}`}>{entry.read ? 'Leído' : 'Sin leer'}</span></div>
              <p className="small text-secondary text-break">{entry.email} · <time dateTime={entry.createdAt}>{new Date(entry.createdAt).toLocaleString('es-CL')}</time></p>
              <p className="text-break" style={{ whiteSpace: 'pre-wrap' }}>{entry.message}</p>
              <div className="d-flex flex-wrap gap-2"><button className="btn btn-outline-dark btn-sm" type="button" onClick={() => this.handleAction(entry)}>Marcar como {entry.read ? 'no leído' : 'leído'}</button><button className="btn btn-outline-danger btn-sm" type="button" onClick={() => this.handleAction(entry, true)} aria-label={`Eliminar mensaje de ${entry.name}`}>Eliminar</button></div>
            </div>
          </article>
        ))}
      </section>
    )
  }
}

export default AdminMessagesPage
