import { Component } from 'react'
import { subscribeNewsletter } from '../../data/newsletter'

class NewsletterForm extends Component {
  state = { email: '', message: '', error: '' }

  handleSubmit = (event) => {
    event.preventDefault()
    try {
      const created = subscribeNewsletter(this.state.email)
      this.setState({ email: '', error: '', message: created ? 'Suscripción guardada en este navegador. ¡Gracias por tu interés!' : 'Este correo ya está suscrito en este navegador.' })
    } catch (error) {
      this.setState({ error: error.message, message: '' })
    }
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
          <button className="btn btn-outline-light" type="submit">Suscribirme</button>
        </div>
        <p className="small mt-2 mb-0" id="newsletter-note">Suscripción local de demostración: el correo se guarda en este navegador. No se envían novedades por correo.</p>
        <p className="small mt-2 mb-0" role="status">
          {this.state.message}
        </p>
        {this.state.error && <p className="small mt-2 mb-0 text-warning" role="alert">{this.state.error}</p>}
      </form>
    )
  }
}

export default NewsletterForm
