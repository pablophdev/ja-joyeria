import { Link } from 'react-router-dom'
import { routes } from '../../navigation/routes'

function Footer() {
  return (
    <footer className="bg-dark text-white py-4">
      <div className="container d-flex flex-column flex-sm-row justify-content-between gap-3">
        <p className="mb-0">© {new Date().getFullYear()} JA Joyería. Alta joyería urbana.</p>
        <Link className="text-white" to={routes.contact}>Contacto</Link>
      </div>
    </footer>
  )
}

export default Footer
