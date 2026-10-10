import { Link } from 'react-router-dom'
import { routes } from '../navigation/routes'

function HomePage() {
  return (
    <section className="home-intro" aria-labelledby="home-title">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-xl-6">
            <p className="collection-label">Anillos</p>
            <h1 id="home-title" className="display-4 fw-bold mb-4">Anillos - Colecciones 2026</h1>
            <p className="lead mb-4">
              Especialistas en alta joyería urbana. En JA hacemos anillos y grillz únicos.
              Los fabricamos con cuidado y con una dedicación total a la calidad y a los detalles perfectos.
            </p>
            <Link className="btn btn-dark px-4 py-3" to={routes.shop}>Ver productos</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomePage
