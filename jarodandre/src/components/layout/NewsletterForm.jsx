import { Component } from 'react'

class NewsletterForm extends Component {
  state = { email: '', submitted: false }

  handleSubmit = (event) => {
    event.preventDefault()
    this.setState({ email: '', submitted: true })
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
            onChange={(event) => this.setState({ email: event.target.value, submitted: false })}
          />
          <button className="btn btn-outline-light" type="submit">Suscribirme</button>
        </div>
        <p className="small mt-2 mb-0" id="newsletter-note">Formulario de demostración: no se guardan correos ni se envían novedades todavía.</p>
        <p className="small mt-2 mb-0" role="status">
          {this.state.submitted && '¡Gracias por tu interés! La validación del correo se completó en esta demostración.'}
        </p>
      </form>
    )
  }
}

export default NewsletterForm
