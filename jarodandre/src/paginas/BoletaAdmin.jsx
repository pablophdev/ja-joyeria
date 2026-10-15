import { Component } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getAdminOrderById, subscribeToOrders } from '../datos/cart'
import { subscribeToAuth } from '../datos/auth'
import { routes } from '../navigation/routes'
import BoletaPedido from '../componentes/pedidos/BoletaPedido'

function findOrder(value) {
  const id = Number(value)
  return /^[1-9]\d*$/.test(value) && Number.isSafeInteger(id) ? getAdminOrderById(id) : null
}

class DetalleBoleta extends Component {
  state = { order: findOrder(this.props.orderId) }

  componentDidMount() {
    this.unsubscribe = subscribeToOrders(this.refreshOrder)
    this.unsubscribeAuth = subscribeToAuth(this.refreshOrder)
    this.refreshOrder()
  }

  componentWillUnmount() {
    this.unsubscribe?.()
    this.unsubscribeAuth?.()
  }

  refreshOrder = () => this.setState({ order: findOrder(this.props.orderId) })

  render() {
    const { order } = this.state
    if (!order) {
      return <section><h1>Orden no encontrada</h1><p>La orden solicitada no está disponible en este navegador.</p><Link className="btn btn-dark" to={routes.adminOrders}>Volver a órdenes y boletas</Link></section>
    }

    return (
      <div>
        <div className="receipt-actions d-flex flex-wrap gap-2 mb-4">
          <Link className="btn btn-outline-dark" to={routes.adminOrders}>Volver a órdenes y boletas</Link>
          <button className="btn btn-dark" type="button" onClick={() => window.print()}>{order.paymentStatus === 'paid' ? 'Imprimir boleta' : 'Imprimir orden'}</button>
        </div>
        <BoletaPedido order={order} />
      </div>
    )
  }
}

function BoletaAdmin() {
  const { orderId } = useParams()
  return <DetalleBoleta key={orderId} orderId={orderId} />
}

export default BoletaAdmin
