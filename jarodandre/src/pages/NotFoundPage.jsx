import { Link } from 'react-router-dom'
import { routes } from '../navigation/routes'

function NotFoundPage() {
  return (
    <section className="container py-5">
      <h1>Página no encontrada</h1>
      <p>La dirección que ingresaste no existe.</p>
      <Link className="btn btn-dark" to={routes.home}>Volver al inicio</Link>
    </section>
  )
}

export default NotFoundPage
