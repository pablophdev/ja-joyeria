import { Link } from 'react-router-dom'
import PageHeading from '../components/common/PageHeading'
import ContactForm from '../components/contact/ContactForm'
import { companyContact } from '../data/companyContent'
import { routes } from '../navigation/routes'

function ContactPage() {
  return (
    <>
      <PageHeading title="Contacto" />
      <div className="container py-5">
        <div className="row g-5">
          <section className="col-lg-5" aria-labelledby="contact-info-title">
            <p className="text-secondary">Información</p>
            <h2 id="contact-info-title">Contáctanos</h2>
            <address className="mt-4">
              <p className="fw-bold">{companyContact.location}</p>
              <ul className="list-unstyled">
                {companyContact.phones.map(({ label, href }) => <li className="mb-2" key={href}><a className="text-dark" href={href}>{label}</a></li>)}
              </ul>
            </address>
            <Link className="btn btn-outline-dark mt-3" to={routes.about}>Conoce nuestra joyería</Link>
          </section>
          <section className="col-lg-7" aria-labelledby="contact-message-title">
            <h2 id="contact-message-title" className="h4 mb-4">Déjanos un mensaje</h2>
            <ContactForm />
          </section>
        </div>
      </div>
    </>
  )
}

export default ContactPage
