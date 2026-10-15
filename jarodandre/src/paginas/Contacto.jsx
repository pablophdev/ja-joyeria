import { Component } from 'react'
import { Link } from 'react-router-dom'
import TituloPagina from '../componentes/estructura/TituloPagina'
import { saveContactMessage } from '../datos/contactMessages'
import { routes } from '../navigation/routes'

class Contacto extends Component {
  state = { values: { name: '', email: '', message: '' }, error: '', confirmation: '' }

  handleChange = (event) => {
    const { name, value } = event.target
    this.setState(({ values }) => ({ values: { ...values, [name]: value }, error: '', confirmation: '' }))
  }

  handleSubmit = (event) => {
    event.preventDefault()
    try {
      const message = saveContactMessage(this.state.values)
      this.setState({ values: { name: '', email: '', message: '' }, error: '', confirmation: `Mensaje #${message.id} guardado en este navegador. No se ha enviado ningún correo.` })
    } catch (error) {
      this.setState({ error: error.message, confirmation: '' })
    }
  }

  render() {
    const { values, error, confirmation } = this.state
    return (
      <>
        <TituloPagina title="Contacto" />
        <div className="container py-5">
          <div className="row g-4 g-lg-5">
            <section className="col-lg-5" aria-labelledby="contact-info-title">
              <p className="text-secondary">Información</p>
              <h2 id="contact-info-title">Contáctanos</h2>
              <address className="mt-4">
                <p className="fw-bold">Santiago, Chile</p>
                <ul className="list-unstyled">
                  <li className="mb-2"><a className="text-dark" href="tel:+56944406449">+56 9 4440 6449</a></li>
                  <li className="mb-2"><a className="text-dark" href="tel:+56987654321">+56 9 8765 4321</a></li>
                </ul>
              </address>
              <Link className="btn btn-outline-dark mt-3" to={routes.about}>Conoce nuestra joyería</Link>
            </section>
            <section className="col-lg-7" aria-labelledby="contact-message-title">
              <h2 id="contact-message-title" className="h4 mb-4">Déjanos un mensaje</h2>
              <form onSubmit={this.handleSubmit} aria-describedby="contact-form-note">
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label" htmlFor="contact-name">Nombre</label>
                    <input className="form-control" id="contact-name" name="name" autoComplete="name" required maxLength={120} value={values.name} onChange={this.handleChange} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label" htmlFor="contact-email">Correo electrónico</label>
                    <input className="form-control" id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} value={values.email} onChange={this.handleChange} />
                  </div>
                  <div className="col-12">
                    <label className="form-label" htmlFor="contact-message">Mensaje</label>
                    <textarea className="form-control" id="contact-message" name="message" rows="6" required maxLength={2000} value={values.message} onChange={this.handleChange} aria-describedby="contact-message-limit" />
                    <p className="form-text" id="contact-message-limit">{values.message.length} / 2000 caracteres</p>
                  </div>
                </div>
                <p className="small text-secondary" id="contact-form-note">Formulario de demostración: el mensaje se guarda localmente. Para contactar directamente, utiliza los teléfonos de la tienda.</p>
                {error && <p className="alert alert-danger" role="alert">{error}</p>}
                <p className="text-success" role="status">{confirmation}</p>
                <button className="btn btn-dark" type="submit">Guardar mensaje</button>
              </form>
            </section>
          </div>
        </div>
      </>
    )
  }
}

export default Contacto
