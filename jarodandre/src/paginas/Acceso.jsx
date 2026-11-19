import { Link } from 'react-router-dom'
import { routes } from '../navigation/routes'

export default function Acceso() {
  return <section className="container py-5">
    <h1>Acceso a la cuenta no disponible</h1>
    <p className="alert alert-info" role="status">El registro y el inicio de sesión están deshabilitados hasta configurar un proveedor de autenticación.</p>
    <p>Las operaciones privadas y administrativas permanecen protegidas. Puedes utilizar las funciones públicas cuando el backend tenga una base de datos configurada.</p>
    <Link className="btn btn-dark" to={routes.shop}>Volver al catálogo</Link>
  </section>
}
