import { Component } from 'react'
import { subscribeNewsletter } from '../../datos/newsletter'

class FormularioSuscripcion extends Component {
  state = { email: '', message: '', error: '', busy: false }
  submitting = false

  handleSubmit = async (event) => {
    event.preventDefault()
    if (this.submitting) return
    this.submitting = true
    this.setState({ busy: true })
    try {
      const created = await subscribeNewsletter(this.state.email)
      this.setState({ email: '', error: '', message: created ? 'Suscripción registrada. ¡Gracias por tu interés!' : 'Este correo ya está suscrito.' })
    } catch (error) {
      this.setState({ error: error.message, message: '' })
    } finally { this.submitting = false; this.setState({ busy: false }) }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label className="form-label" htmlFor="newsletter-email">Coloca tu email para recibir nuestras novedades</label>
        <div className="d-flex flex-wrap gap-2">
          <input
            className="form-control"
            id="newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            required
            maxLength={254}
            value={this.state.email}
            aria-describedby="newsletter-note"
            onChange={(event) => this.setState({ email: event.target.value, message: '', error: '' })}
          />
          <button className="btn btn-outline-light" type="submit" disabled={this.state.busy}>{this.state.busy ? 'Enviando…' : 'Suscribirme'}</button>
        </div>
        <p className="small mt-2 mb-0" id="newsletter-note">Tu correo se registrará en la lista de suscriptores de la tienda.</p>
        <p className="small mt-2 mb-0" role="status">
          {this.state.message}
        </p>
        {this.state.error && <p className="small mt-2 mb-0 text-warning" role="alert">{this.state.error}</p>}
      </form>
    )
  }
}

export default FormularioSuscripcion
