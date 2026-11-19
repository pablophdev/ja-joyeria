import { Component } from 'react'
import { getCurrentUser, isAdmin, loadIdentity, needsProfile } from '../../datos/auth'
import { loadProducts } from '../../datos/products'
import { loadBlog } from '../../datos/blogPosts'
import { loadCart } from '../../datos/cart'
import { loadMessages } from '../../datos/contactMessages'
import { loadSubscribers } from '../../datos/newsletter'
import { getActiveRequests, subscribeToNetwork } from '../../datos/api'

// Las vistas existentes leen snapshots en memoria; solo las API son persistencia.
// No se monta ninguna vista ni guard de permisos hasta resolver la identidad.
let initialization
function initialize() {
  if (!initialization) initialization = (async () => {
    await loadIdentity()
    await Promise.all([loadProducts(), loadBlog()])
    await loadCart()
    if (isAdmin(getCurrentUser())) await Promise.all([loadMessages(), loadSubscribers()])
  })().catch((error) => { initialization = null; throw error })
  return initialization
}

export default class ConexionBackend extends Component {
  state = { loading: true, error: '', pending: 0 }
  mounted = false
  componentDidMount() {
    this.mounted = true
    this.unsubscribe = subscribeToNetwork(() => this.setState({ pending: getActiveRequests() }))
    this.load()
  }
  componentWillUnmount() { this.mounted = false; this.unsubscribe?.() }
  load = async () => {
    this.setState({ loading: true, error: '' })
    try { await initialize(); if (this.mounted) this.setState({ loading: false }) }
    catch (error) { if (this.mounted) this.setState({ loading: false, error: error.message }) }
  }
  render() {
    if (this.state.loading) return <main className="container py-5" role="status">Conectando con la tienda…</main>
    if (this.state.error) return <main className="container py-5"><h1>No se pudo cargar la tienda</h1><p className="alert alert-danger" role="alert">{this.state.error}</p><button className="btn btn-dark" onClick={this.load}>Reintentar</button><a className="btn btn-outline-dark ms-2" href="/login" onClick={() => sessionStorage.removeItem('ja.cognito.session')}>Volver sin sesión</a></main>
    return <>{needsProfile && <p className="alert alert-info m-0">Tu identidad está verificada. <a href="/registro">Completa tu perfil</a> para usar tu cuenta.</p>}{this.props.children}{this.state.pending > 0 && <div className="position-fixed bottom-0 start-0 m-3 bg-dark text-white rounded px-3 py-2" style={{ zIndex: 2000 }} role="status">Procesando con el servidor…</div>}</>
  }
}
