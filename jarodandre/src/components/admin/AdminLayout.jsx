import { Link, Outlet } from 'react-router-dom'
import { routes } from '../../navigation/routes'

const links = [
  { to: routes.admin, label: 'Resumen' },
  { to: routes.adminProducts, label: 'Gestionar productos' },
  { to: routes.adminProductNew, label: 'Nuevo producto' },
  { to: routes.users, label: 'Gestionar usuarios' },
  { to: routes.adminOrders, label: 'Órdenes / Boletas' },
  { to: routes.adminReports, label: 'Reportes' },
  { to: routes.shop, label: 'Ver tienda' },
]

function AdminLayout() {
  return (
    <div className="container py-4 py-lg-5 admin-layout">
      <div className="row g-4">
        <aside className="col-lg-3 admin-sidebar">
          <nav className="bg-light rounded p-3" aria-label="Administración">
            <p className="fw-bold">jarodandre · Administración</p>
            <ul className="nav flex-column">
              {links.map(({ to, label }) => <li className="nav-item" key={to}><Link className="nav-link text-dark px-0" to={to}>{label}</Link></li>)}
            </ul>
          </nav>
        </aside>
        <div className="col-lg-9 admin-content"><Outlet /></div>
      </div>
    </div>
  )
}

export default AdminLayout
