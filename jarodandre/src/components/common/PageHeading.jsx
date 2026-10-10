import { Link } from 'react-router-dom'
import { routes } from '../../navigation/routes'

function PageHeading({ title }) {
  return (
    <div className="bg-light py-4">
      <div className="container">
        <h1>{title}</h1>
        <nav aria-label="Ruta de navegación">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><Link className="text-dark" to={routes.home}>Inicio</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{title}</li>
          </ol>
        </nav>
      </div>
    </div>
  )
}

export default PageHeading
