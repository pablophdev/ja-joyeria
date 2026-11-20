import { Component, createRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getOrders, subscribeToOrders } from '../datos/cart'
import { subscribeToAuth } from '../datos/auth'
import { paymentStatuses } from '../datos/orderRecords'
import TarjetaPedido from '../componentes/pedidos/TarjetaPedido'
import { routes } from '../navigation/routes'
import { paymentEntrance } from '../utilidades/motion'

class DetallePago extends Component {
  state = { orders: getOrders() }
  root = createRef()
  cleanupAnimation = () => {}

  componentDidMount() {
    this.unsubscribe = subscribeToOrders(this.refreshOrders)
    this.unsubscribeAuth = subscribeToAuth(this.refreshOrders)
    this.refreshOrders()
    this.animateResult()
  }

  componentDidUpdate(previousProps, previousState) {
    const previousOrder = previousState.orders.find((item) => String(item.id) === previousProps.orderId)
    const order = this.state.orders.find((item) => String(item.id) === this.props.orderId)
    if (previousProps.orderId !== this.props.orderId || previousOrder?.paymentStatus !== order?.paymentStatus) this.animateResult()
  }

  animateResult = () => {
    this.cleanupAnimation()
    this.cleanupAnimation = paymentEntrance(this.root.current)
  }

  componentWillUnmount() {
    this.unsubscribe?.()
    this.unsubscribeAuth?.()
    this.cleanupAnimation()
  }

  refreshOrders = () => this.setState({ orders: getOrders() })

  render() {
    const order = this.state.orders.find((item) => String(item.id) === this.props.orderId)
    if (!order) {
      return (
        <section className="container py-5">
          <h1>Resultado no disponible</h1>
          <p>No encontramos este pedido en el historial de tu sesión actual.</p>
          <Link className="btn btn-dark" to={routes.orders}>Ver mis pedidos</Link>
        </section>
      )
    }

    const paid = order.paymentStatus === 'paid'
    return (
      <section ref={this.root} className="container py-5">
        <div className={`payment-symbol mb-3 ${paid ? 'text-success' : 'text-warning'}`} data-payment-symbol aria-hidden="true">
          <svg viewBox="0 0 48 48" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="24" cy="24" r="21" />
            {paid ? <path d="m14 24 7 7 14-15" /> : <path d="M24 13v14m0 7h.01" />}
          </svg>
        </div>
        <h1>{paymentStatuses[order.paymentStatus].label}</h1>
        <p className={`alert ${paid ? 'alert-success' : 'alert-warning'}`} role="status">
          {paid
            ? 'Tu pedido quedó registrado correctamente. Gracias por tu compra.'
            : order.paymentStatus === 'failed'
              ? 'El proceso de pago se canceló. Conservamos los productos en el carrito para que puedas volver a intentarlo.'
              : 'Este pedido todavía no tiene un pago registrado.'}
        </p>
        <p className="text-secondary">Pago simulado registrado en el servidor. No se realizó ningún cobro real.</p>
        <TarjetaPedido order={order} />
        <div className="d-flex flex-wrap gap-2">
          {order.paymentStatus === 'failed' && <Link className="btn btn-dark" to={routes.checkout}>Volver a intentar con mi carrito</Link>}
          <Link className="btn btn-outline-dark" to={routes.orders}>Ver mis pedidos</Link>
          <Link className="btn btn-outline-dark" to={routes.shop}>Seguir comprando</Link>
        </div>
      </section>
    )
  }
}

function ResultadoPago() {
  const { orderId } = useParams()
  return <DetallePago orderId={orderId} />
}

export default ResultadoPago
