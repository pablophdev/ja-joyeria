import { Component } from 'react'
import { getAdminOrders, subscribeToOrders } from '../datos/cart'
import { getCurrentUser, getUsers, isAdmin, subscribeToAuth } from '../datos/auth'
import { getProducts, subscribeToProducts } from '../datos/products'
import { paymentStatuses } from '../datos/orderRecords'
import { formatPrice } from '../utilidades/formatPrice'

function buildReport(orders, products, users) {
  const paidOrders = orders.filter((order) => order.paymentStatus === 'paid')
  const totalRevenue = paidOrders.reduce((total, order) => total + order.total, 0)
  const productSales = new Map()
  for (const order of paidOrders) {
    for (const item of order.items) {
      const current = productSales.get(item.productId) ?? { name: item.name, quantity: 0, revenue: 0 }
      current.quantity += item.quantity
      current.revenue += item.subtotal
      productSales.set(item.productId, current)
    }
  }
  const topProducts = [...productSales.values()].sort((first, second) => second.quantity - first.quantity)
  const customerSales = new Map()
  for (const order of paidOrders) {
    const key = order.customer.email.toLocaleLowerCase('es')
    const current = customerSales.get(key) ?? { name: order.customer.name, email: order.customer.email, orders: 0, total: 0 }
    current.orders += 1
    current.total += order.total
    customerSales.set(key, current)
  }
  const topCustomers = [...customerSales.values()].sort((first, second) => second.total - first.total)
  const salesByStatus = Object.keys(paymentStatuses).map((status) => ({
    status,
    label: paymentStatuses[status].label,
    badge: paymentStatuses[status].badge,
    count: orders.filter((order) => order.paymentStatus === status).length,
  }))
  return {
    totalRevenue,
    averageTicket: paidOrders.length ? Math.round(totalRevenue / paidOrders.length) : 0,
    topProducts,
    topCustomers,
    salesByStatus,
    productCount: products.length,
    featuredCount: products.filter((product) => product.featured).length,
    userCount: users.length,
    activeUserCount: users.filter((user) => user.status === 'active').length,
    adminCount: users.filter(isAdmin).length,
  }
}

class ReportesAdmin extends Component {
  state = { report: buildReport(getAdminOrders(), getProducts(), getUsers()) }

  componentDidMount() {
    this.unsubscribeOrders = subscribeToOrders(this.refreshReport)
    this.unsubscribeAuth = subscribeToAuth(this.refreshReport)
    this.unsubscribeProducts = subscribeToProducts(this.refreshReport)
  }

  componentWillUnmount() {
    this.unsubscribeOrders?.()
    this.unsubscribeAuth?.()
    this.unsubscribeProducts?.()
  }

  refreshReport = () => {
    if (isAdmin(getCurrentUser())) this.setState({ report: buildReport(getAdminOrders(), getProducts(), getUsers()) })
  }

  render() {
    const { report } = this.state
    const summary = [
      { label: 'Ingresos pagados', value: formatPrice(report.totalRevenue) },
      { label: 'Ticket promedio', value: formatPrice(report.averageTicket) },
      { label: 'Productos en catálogo', value: report.productCount },
      { label: 'Cuentas registradas', value: report.userCount },
    ]

    return (
      <section>
        <h1>Reportes</h1>
        <p>Resumen de ventas, productos y cuentas guardados en este navegador.</p>
        <div className="row g-3 mb-4">
          {summary.map(({ label, value }) => (
            <div className="col-sm-6 col-xl-3" key={label}>
              <div className="border rounded p-3 h-100"><h2 className="h6">{label}</h2><p className="fs-4 mb-0">{value}</p></div>
            </div>
          ))}
        </div>

        <section className="card mb-4"><div className="card-body">
          <h2 className="h4">Ventas por estado de pago</h2>
          {!report.salesByStatus.length ? <p>Todavía no hay datos de ventas.</p> : (
            <ul className="list-group list-group-flush">
              {report.salesByStatus.map(({ status, label, badge, count }) => (
                <li className="list-group-item d-flex justify-content-between align-items-center px-0" key={status}>
                  <span className={`badge ${badge}`}>{label}</span>
                  <span>{count} {count === 1 ? 'orden' : 'órdenes'}</span>
                </li>
              ))}
            </ul>
          )}
        </div></section>

        <section className="card mb-4"><div className="card-body">
          <h2 className="h4">Productos más vendidos</h2>
          <p className="text-secondary">Considera solo las órdenes con pago realizado.</p>
          {!report.topProducts.length ? <p>No hay ventas pagadas todavía.</p> : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <caption>Productos más vendidos según pagos confirmados</caption>
                <thead><tr><th scope="col">Producto</th><th scope="col">Unidades vendidas</th><th scope="col">Ingresos</th></tr></thead>
                <tbody>
                  {report.topProducts.slice(0, 10).map((product) => (
                    <tr key={product.name}><th scope="row">{product.name}</th><td>{product.quantity}</td><td className="text-nowrap">{formatPrice(product.revenue)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div></section>

        <section className="card mb-4"><div className="card-body">
          <h2 className="h4">Clientes con más compras</h2>
          <p className="text-secondary">Basado en órdenes pagadas (cuentas e invitados).</p>
          {!report.topCustomers.length ? <p>No hay compras pagadas todavía.</p> : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <caption>Clientes con más compras pagadas</caption>
                <thead><tr><th scope="col">Cliente</th><th scope="col">Órdenes pagadas</th><th scope="col">Total gastado</th></tr></thead>
                <tbody>
                  {report.topCustomers.slice(0, 10).map((customer) => (
                    <tr key={customer.email}><th scope="row">{customer.name}<span className="d-block fw-normal small">{customer.email}</span></th><td>{customer.orders}</td><td className="text-nowrap">{formatPrice(customer.total)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div></section>

        <section className="card"><div className="card-body">
          <h2 className="h4">Cuentas</h2>
          <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex justify-content-between align-items-center px-0"><span>Cuentas activas</span><span>{report.activeUserCount}</span></li>
            <li className="list-group-item d-flex justify-content-between align-items-center px-0"><span>Cuentas con perfil administrativo (rol o dominio)</span><span>{report.adminCount}</span></li>
            <li className="list-group-item d-flex justify-content-between align-items-center px-0"><span>Productos destacados</span><span>{report.featuredCount}</span></li>
          </ul>
        </div></section>
      </section>
    )
  }
}

export default ReportesAdmin
