import { Link } from 'react-router-dom'
import PageHeading from '../components/common/PageHeading'
import CompanyStats from '../components/about/CompanyStats'
import aboutImage from '../assets/about/about-us.jpg'
import { aboutSections, companyStats } from '../data/companyContent'
import { routes } from '../navigation/routes'

function AboutPage() {
  return (
    <>
      <PageHeading title="Sobre nosotros" />
      <div className="container py-5">
        <img className="img-fluid w-100 rounded mb-5" src={aboutImage} alt="Collar con colgante en forma de gota sobre hojas oscuras" width="2000" height="1143" />
        <div className="row g-4">
          {aboutSections.map(({ title, description }) => (
            <section className="col-md-4" key={title}>
              <h2 className="h4">{title}</h2>
              <p>{description}</p>
            </section>
          ))}
        </div>
        <div className="d-flex flex-wrap gap-2 mt-4">
          <Link className="btn btn-dark" to={routes.shop}>Explorar productos</Link>
          <Link className="btn btn-outline-dark" to={routes.contact}>Contactar con nosotros</Link>
        </div>
      </div>
      <CompanyStats stats={companyStats} />
    </>
  )
}

export default AboutPage
