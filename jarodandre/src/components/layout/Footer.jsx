import { Link } from 'react-router-dom'
import { routes } from '../../navigation/routes'
import wordmark from '../../assets/jarodandre-blanco-transparente.webp'
import { socialLinks } from '../../data/homeContent'
import NewsletterForm from './NewsletterForm'

function Footer() {
  return (
    <footer className="bg-dark text-white py-4">
      <div className="container">
        <div className="row g-4 py-3">
          <div className="col-sm-6 col-lg-3">
            <Link className="text-white d-inline-block" to={routes.home} aria-label="JA Joyería, ir al inicio">
              <img className="brand-wordmark" src={wordmark} alt="jarodandre" width="168" height="56" loading="lazy" />
            </Link>
          </div>
          <div className="col-sm-6 col-lg-2">
            <h2 className="h6">Redes sociales</h2>
            <ul className="list-unstyled mb-0">
              {socialLinks.map(({ label, url }) => (
                <li className="mt-2" key={label}><a className="text-white" href={url}>{label}</a></li>
              ))}
            </ul>
          </div>
          <div className="col-sm-6 col-lg-2">
            <h2 className="h6">JA Joyerías</h2>
            <ul className="list-unstyled mb-0">
              <li className="mt-2"><Link className="text-white" to={routes.contact}>Contacto</Link></li>
              <li className="mt-2"><Link className="text-white" to={routes.shop}>Productos</Link></li>
              <li className="mt-2"><Link className="text-white" to={routes.blog}>Blog</Link></li>
            </ul>
          </div>
          <div className="col-sm-6 col-lg-5">
            <h2 className="h6">Contáctanos</h2>
            <NewsletterForm />
          </div>
        </div>
        <p className="mb-0 mt-4 pt-4 border-top text-center">© {new Date().getFullYear()} JA Joyería. Proyecto informática.</p>
      </div>
    </footer>
  )
}

export default Footer
