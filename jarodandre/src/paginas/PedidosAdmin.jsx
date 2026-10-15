import { Component } from 'react'
import { Link } from 'react-router-dom'
import { getAdminOrders, subscribeToOrders, updateOrderStatus } from '../datos/cart'
import { subscribeToAuth } from '../datos/auth'
import { deliveryStatuses, formatOrderId, formatReceiptId, paymentStatuses } from '../datos/orderRecords'
import FormularioEstadoPedido from '../componentes/pedidos/FormularioEstadoPedido'
import { getAdminReceiptPath } from '../navigation/routes'
import { formatPrice } from '../utilidades/formatPrice'

const dateFormatter = new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium', timeStyle: 'short' })

function normalizeSearch(value) {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('es').trim()
}

class PedidosAdmin extends Component {
  state = { orders: getAdminOrders(), query: '', paymentStatus: 'all', deliveryStatus: 'all', error: '', message: '' }

  componentDidMount() {
    this.unsubscribe = subscribeToOrders(this.refreshOrders)
    this.unsubscribeAuth = subscribeToAuth(this.refreshOrders)
    this.refreshOrders()
  }

  componentWillUnmount() {
    this.unsubscribe?.()
    this.unsubscribeAuth?.()
  }

  refreshOrders = () => this.setState({ orders: getAdminOrders() })

  handleStatus = (id, status) => {
    try {
      updateOrderStatus(id, status)
      this.setState({ error: '', message: `${formatOrderId(id)}: entrega actualizada a ${status.toLowerCase()}.` })
    } catch (error) {
      this.setState({ error: error.message, message: '' })
    }
  }

  render() {
    const { orders, query, paymentStatus, deliveryStatus, error, message } = this.state
    const search = normalizeSearch(query)
    const visibleOrders = orders.filter((order) => (
      (paymentStatus === 'all' || order.paymentStatus === paymentStatus)
      && (deliveryStatus === 'all' || order.status === deliveryStatus)
      && normalizeSearch([formatOrderId(order.id), order.paymentStatus === 'paid' ? formatReceiptId(order.id) : '', order.customer.name, order.customer.email].join(' ')).includes(search)
    ))
    const paidOrders = orders.filter((order) => order.paymentStatus === 'paid')
    const metrics = [
      { label: 'Órdenes registradas', value: orders.length },
      { label: 'Boletas / Pagadas', value: paidOrders.length },
      { label: 'Sin pago realizado', value: orders.length - paidOrders.length },
      { label: 'Total pagado (local)', value: formatPrice(paidOrders.reduce((total, order) => total + order.total, 0)) },
    ]

    return (
      <section>
        <h1>Órdenes / Boletas</h1>
        <p>Pedidos de todos los clientes e invitados guardados en este navegador.</p>
        {error && <p className="alert alert-danger" role="alert">{error}</p>}
        <p className="text-success" role="status">{message}</p>
        <div className="row g-3 mb-4">
          {metrics.map(({ label, value }) => (
            <div className="col-sm-6 col-xl-3" key={label}>
              <div className="border rounded p-3 h-100"><h2 className="h6">{label}</h2><p className="fs-4 mb-0">{value}</p></div>
            </div>
          ))}
        </div>
        <form className="row g-3 mb-4" onSubmit={(event) => event.preventDefault()} aria-label="Filtrar órdenes">
          <div className="col-md-7">
            <label className="form-label" htmlFor="admin-order-query">Buscar orden, boleta, cliente o correo</label>
            <input className="form-control" id="admin-order-query" type="search" value={query} onChange={(event) => this.setState({ query: event.target.value })} aria-controls="admin-orders-list" />
          </div>
          <div className="col-md-5">
            <label className="form-label" htmlFor="admin-order-payment">Estado del pago</label>
            <select className="form-select" id="admin-order-payment" value={paymentStatus} onChange={(event) => this.setState({ paymentStatus: event.target.value })} aria-controls="admin-orders-list">
              <option value="all">Todos los estados</option>
              {Object.entries(paymentStatuses).map(([value, { label }]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
          <div className="col-md-5">
            <label className="form-label" htmlFor="admin-order-delivery">Estado de entrega</label>
            <select className="form-select" id="admin-order-delivery" value={deliveryStatus} onChange={(event) => this.setState({ deliveryStatus: event.target.value })} aria-controls="admin-orders-list">
              <option value="all">Todos los estados</option>
              {Object.keys(deliveryStatuses).map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
          <div className="col-12"><button className="btn btn-outline-dark btn-sm" type="button" onClick={() => this.setState({ query: '', paymentStatus: 'all', deliveryStatus: 'all' })}>Restablecer filtros</button></div>
        </form>
        <p className="text-secondary" role="status">Mostrando {visibleOrders.length} de {orders.length} órdenes</p>
        <div id="admin-orders-list">
          {!visibleOrders.length ? (
            <p className="border rounded p-4">{orders.length ? 'No hay órdenes que coincidan con los filtros.' : 'Todavía no hay órdenes. Los pedidos aparecerán aquí al finalizar o cancelar el pago desde el checkout.'}</p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <caption>Órdenes y boletas del catálogo local</caption>
                <thead><tr><th scope="col">Orden / Boleta</th><th scope="col">Cliente</th><th scope="col">Fecha</th><th scope="col">Total</th><th scope="col">Pago</th><th scope="col">Entrega</th><th scope="col">Acciones</th></tr></thead>
                <tbody>
                  {visibleOrders.map((order) => {
                    const payment = paymentStatuses[order.paymentStatus]
                    const paid = order.paymentStatus === 'paid'
                    return (
                      <tr key={order.id}>
                        <th scope="row" className="text-nowrap">{formatOrderId(order.id)}{paid && <span className="d-block fw-normal small">{formatReceiptId(order.id)}</span>}</th>
                        <td>{order.customer.name}<span className="d-block text-secondary small">{order.customer.email}</span><span className="small">{order.userId === null ? 'Invitado' : `Cuenta #${order.userId}`}</span></td>
                        <td><time dateTime={order.createdAt}>{dateFormatter.format(new Date(order.createdAt))}</time></td>
                        <td className="text-nowrap">{formatPrice(order.total)}</td>
                        <td><span className={`badge ${payment.badge}`}>{payment.label}</span></td>
                        <td><span className={`badge ${deliveryStatuses[order.status].badge}`}>{order.status}</span><FormularioEstadoPedido key={`${order.id}-${order.status}`} order={order} onSave={this.handleStatus} /></td>
                        <td><Link className="btn btn-outline-dark btn-sm" to={getAdminReceiptPath(order.id)} aria-label={`${paid ? 'Mostrar boleta' : 'Ver orden'} ${formatOrderId(order.id)}`}>{paid ? 'Mostrar boleta' : 'Ver orden'}</Link></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    )
  }
}

export default PedidosAdmin
