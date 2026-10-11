import { Component } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, subscribeToProducts } from '../data/products'
import { getUsers, subscribeToAuth } from '../data/auth'
import { routes } from '../navigation/routes'

class AdminPage extends Component {
  state = { products: getProducts(), users: getUsers() }

  componentDidMount() {
    this.unsubscribeProducts = subscribeToProducts(this.refreshData)
    this.unsubscribeUsers = subscribeToAuth(this.refreshData)
    this.refreshData()
  }

  componentWillUnmount() {
    this.unsubscribeProducts?.()
    this.unsubscribeUsers?.()
  }

  refreshData = () => this.setState({ products: getProducts(), users: getUsers() })

  render() {
    const { products, users } = this.state
    const metrics = [
      { label: 'Productos', value: products.length },
      { label: 'Destacados', value: products.filter((product) => product.featured).length },
      { label: 'Usuarios', value: users.length },
      { label: 'Cuentas activas', value: users.filter((user) => user.status === 'active').length },
    ]
    return (
      <section>
        <h1>Panel de administración</h1>
        <p>Gestiona los productos, las cuentas y las órdenes guardadas en este navegador.</p>
        <div className="row g-3 mb-4">
          {metrics.map(({ label, value }) => <div className="col-sm-6 col-xl-3" key={label}><div className="border rounded p-3 h-100"><h2 className="h6">{label}</h2><p className="fs-3 mb-0">{value}</p></div></div>)}
        </div>
        <div className="row g-4">
          <div className="col-md-6"><section className="card h-100"><div className="card-body">
            <h2 className="h4">Productos</h2><p>Crea piezas, actualiza sus datos y elige cuáles aparecen en el inicio.</p>
            <div className="d-flex flex-wrap gap-2"><Link className="btn btn-dark" to={routes.adminProductNew}>Nuevo producto</Link><Link className="btn btn-outline-dark" to={routes.adminProducts}>Ver y editar productos</Link></div>
          </div></section></div>
          <div className="col-md-6"><section className="card h-100"><div className="card-body">
            <h2 className="h4">Usuarios</h2><p>Consulta las cuentas y modifica sus datos, roles y estados.</p>
            <Link className="btn btn-outline-dark" to={routes.users}>Gestionar usuarios</Link>
          </div></section></div>
          <div className="col-md-6"><section className="card h-100"><div className="card-body">
            <h2 className="h4">Órdenes / Boletas</h2><p>Consulta los pedidos de clientes e invitados y muestra las boletas de las compras pagadas.</p>
            <Link className="btn btn-outline-dark" to={routes.adminOrders}>Ver órdenes y boletas</Link>
          </div></section></div>
          <div className="col-md-6"><section className="card h-100"><div className="card-body">
            <h2 className="h4">Reportes</h2><p>Resume ingresos, productos más vendidos, clientes y cuentas del catálogo local.</p>
            <Link className="btn btn-outline-dark" to={routes.adminReports}>Ver reportes</Link>
          </div></section></div>
        </div>
      </section>
    )
  }
}

export default AdminPage
