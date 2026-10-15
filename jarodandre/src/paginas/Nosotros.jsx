import { Link } from 'react-router-dom'
import TituloPagina from '../componentes/estructura/TituloPagina'
import aboutImage from '../assets/about/about-us.jpg'
import { routes } from '../navigation/routes'

function Nosotros() {
  return (
    <>
      <TituloPagina title="Sobre nosotros" />
      <div className="container py-5">
        <img className="img-fluid w-100 rounded mb-5" src={aboutImage} alt="Collar con colgante en forma de gota sobre hojas oscuras" width="2000" height="1143" />
        <div className="row g-4">
          <section className="col-md-4">
            <h2 className="h4">Quiénes somos</h2>
            <p>Somos una tienda de joyería de autor que se dedica al diseño y fabricación de piezas únicas en metales preciosos. Combinamos técnicas tradicionales de orfebrería con las últimas tendencias de joyería urbana contemporánea.</p>
          </section>
          <section className="col-md-4">
            <h2 className="h4">Qué hacemos</h2>
            <p>Hacemos grillz, cadenas, anillos de sello y collares a medida. Tratamos cada pieza desde el moldeado hasta el pulido final, con mucho cuidado, asegurando un ajuste perfecto y acabados de primera calidad.</p>
          </section>
          <section className="col-md-4">
            <h2 className="h4">Por qué elegirnos</h2>
            <p>Porque cada diseño es único y se crea con autenticidad, usando oro, plata y piedras cuidadosamente seleccionadas. Nos enfocamos en brindar un servicio cercano para plasmar tu estilo personal en joyas que duran y tienen un carácter propio.</p>
          </section>
        </div>
        <div className="d-flex flex-wrap gap-2 mt-4">
          <Link className="btn btn-dark" to={routes.shop}>Explorar productos</Link>
          <Link className="btn btn-outline-dark" to={routes.contact}>Contactar con nosotros</Link>
        </div>
      </div>
      <section className="bg-light py-5" aria-labelledby="company-stats-title">
        <div className="container">
          <h2 className="visually-hidden" id="company-stats-title">jarodandre en cifras</h2>
          <dl className="row g-4 text-center mb-0">
            <div className="col-6 col-lg-3 d-flex flex-column"><dt className="fw-normal">Nuestros clientes</dt><dd className="display-5 fw-bold order-first mb-2">102</dd></div>
            <div className="col-6 col-lg-3 d-flex flex-column"><dt className="fw-normal">Total de categorías</dt><dd className="display-5 fw-bold order-first mb-2">10</dd></div>
            <div className="col-6 col-lg-3 d-flex flex-column"><dt className="fw-normal">Sucursal en Chile</dt><dd className="display-5 fw-bold order-first mb-2">1</dd></div>
            <div className="col-6 col-lg-3 d-flex flex-column"><dt className="fw-normal">Recomendaciones</dt><dd className="display-5 fw-bold order-first mb-2">90 %</dd></div>
          </dl>
        </div>
      </section>
    </>
  )
}

export default Nosotros
