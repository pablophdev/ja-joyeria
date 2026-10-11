import { Component } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getOrders, subscribeToOrders } from '../data/cart'
import { subscribeToAuth } from '../data/auth'
import { paymentStatuses } from '../data/orderRecords'
import OrderCard from '../components/orders/OrderCard'
import { routes } from '../navigation/routes'

class PaymentResult extends Component {
  state = { orders: getOrders() }

  componentDidMount() {
    this.unsubscribe = subscribeToOrders(this.refreshOrders)
    this.unsubscribeAuth = subscribeToAuth(this.refreshOrders)
    this.refreshOrders()
  }

  componentWillUnmount() {
    this.unsubscribe?.()
    this.unsubscribeAuth?.()
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
      <section className="container py-5">
        <h1>{paymentStatuses[order.paymentStatus].label}</h1>
        <p className={`alert ${paid ? 'alert-success' : 'alert-warning'}`} role="status">
          {paid
            ? 'Tu pedido quedó registrado correctamente. Gracias por tu compra.'
            : order.paymentStatus === 'failed'
              ? 'El proceso de pago se canceló. Conservamos los productos en el carrito para que puedas volver a intentarlo.'
              : 'Este pedido todavía no tiene un pago registrado.'}
        </p>
        <p className="text-secondary">Resultado de demostración guardado en este navegador. No se realizó ningún cobro real.</p>
        <OrderCard order={order} />
        <div className="d-flex flex-wrap gap-2">
          {order.paymentStatus === 'failed' && <Link className="btn btn-dark" to={routes.checkout}>Volver a intentar con mi carrito</Link>}
          <Link className="btn btn-outline-dark" to={routes.orders}>Ver mis pedidos</Link>
          <Link className="btn btn-outline-dark" to={routes.shop}>Seguir comprando</Link>
        </div>
      </section>
    )
  }
}

function PaymentResultPage() {
  const { orderId } = useParams()
  return <PaymentResult orderId={orderId} />
}

export default PaymentResultPage
