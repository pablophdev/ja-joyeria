import { Component } from 'react'
import { saveContactMessage } from '../../data/contactMessages'

const emptyValues = { name: '', email: '', message: '' }

class ContactForm extends Component {
  state = { values: { ...emptyValues }, error: '', confirmation: '' }

  handleChange = (event) => {
    const { name, value } = event.target
    this.setState(({ values }) => ({ values: { ...values, [name]: value }, error: '', confirmation: '' }))
  }

  handleSubmit = (event) => {
    event.preventDefault()
    try {
      const message = saveContactMessage(this.state.values)
      this.setState({ values: { ...emptyValues }, error: '', confirmation: `Mensaje #${message.id} guardado en este navegador. No se ha enviado ningún correo.` })
    } catch (error) {
      this.setState({ error: error.message, confirmation: '' })
    }
  }

  render() {
    const { values, error, confirmation } = this.state
    return (
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
    )
  }
}

export default ContactForm
