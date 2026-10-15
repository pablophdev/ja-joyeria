import { Link } from 'react-router-dom'
import { routes } from '../navigation/routes'

function Pendiente({ title }) {
  return (
    <section className="container py-5">
      <h1>{title}</h1>
      <p>Esta sección estará disponible en una próxima etapa de la migración.</p>
      <Link className="btn btn-outline-dark" to={routes.home}>Volver al inicio</Link>
    </section>
  )
}

export default Pendiente
