import { Component } from 'react'
import { Link } from 'react-router-dom'
import { getOrders, subscribeToOrders } from '../data/cart'
import OrderCard from '../components/orders/OrderCard'
import { routes } from '../navigation/routes'
import { getCurrentUser, subscribeToAuth } from '../data/auth'

class OrdersPage extends Component {
  state = { orders: getOrders(), user: getCurrentUser() }

  componentDidMount() {
    this.unsubscribe = subscribeToOrders(this.refreshOrders)
    this.unsubscribeAuth = subscribeToAuth(this.refreshOrders)
    this.refreshOrders()
  }

  componentWillUnmount() {
    this.unsubscribe?.()
    this.unsubscribeAuth?.()
  }

  refreshOrders = () => this.setState({ orders: getOrders(), user: getCurrentUser() })

  render() {
    const { orders, user } = this.state
    if (!user) {
      return (
        <section className="container py-5">
          <h1>Pedidos</h1>
          <nav aria-label="Ruta de navegación">
            <ol className="breadcrumb"><li className="breadcrumb-item"><Link to={routes.home}>Inicio</Link></li><li className="breadcrumb-item active" aria-current="page">Pedidos</li></ol>
          </nav>
          <div className="bg-light rounded p-4 mb-4">
            <h2 className="h4">Inicia sesión para ver tus pedidos</h2>
            <p>Cada cuenta solo puede ver sus propias compras. Si compraste como invitado, inicia sesión con el mismo correo usado en el checkout y tus pedidos aparecerán aquí; también puedes usar el enlace de confirmación de tu compra.</p>
            <div className="d-flex flex-wrap gap-2">
              <Link className="btn btn-dark" to={routes.login}>Iniciar sesión</Link>
              <Link className="btn btn-outline-dark" to={routes.register}>Crear cuenta</Link>
            </div>
          </div>
          <Link className="btn btn-dark" to={routes.shop}>Seguir comprando</Link>
        </section>
      )
    }
    return (
      <section className="container py-5">
        <h1>Pedidos</h1>
        <nav aria-label="Ruta de navegación">
          <ol className="breadcrumb"><li className="breadcrumb-item"><Link to={routes.home}>Inicio</Link></li><li className="breadcrumb-item active" aria-current="page">Pedidos</li></ol>
        </nav>
        <p>Pedidos de {user.name}.</p>
        <p className="text-secondary" role="status">{orders.length} {orders.length === 1 ? 'pedido registrado' : 'pedidos registrados'}</p>
        {orders.length ? orders.map((order) => <OrderCard key={order.id} order={order} />) : (
          <div className="bg-light rounded p-4 mb-4"><h2 className="h4">Todavía no hay pedidos</h2><p className="mb-0">Añade productos al carrito y confirma tu primer pedido.</p></div>
        )}
        <Link className="btn btn-dark" to={routes.shop}>Seguir comprando</Link>
      </section>
    )
  }
}

export default OrdersPage
