import { Component } from 'react'

const customerFields = [
  { name: 'name', label: 'Nombre completo', type: 'text', autoComplete: 'name', maxLength: 120 },
  { name: 'email', label: 'Correo electrónico', type: 'email', autoComplete: 'email', maxLength: 254 },
  { name: 'address', label: 'Dirección de entrega', type: 'text', autoComplete: 'street-address', maxLength: 250 },
  { name: 'city', label: 'Ciudad', type: 'text', autoComplete: 'address-level2', maxLength: 100 },
]

class CheckoutForm extends Component {
  state = { name: '', email: '', address: '', city: '', ...this.props.initialCustomer }

  handleSubmit = (event) => {
    event.preventDefault()
    this.props.onContinue({ ...this.state })
  }

  render() {
    return (
      <form className="mt-4" onSubmit={this.handleSubmit}>
        <fieldset disabled={this.props.disabled}>
          <legend className="h5">Datos de contacto y entrega</legend>
          {customerFields.map(({ name, label, ...inputProps }) => (
            <div className="mb-3" key={name}>
              <label className="form-label" htmlFor={`checkout-${name}`}>{label}</label>
              <input {...inputProps} className="form-control" id={`checkout-${name}`} name={name} required value={this.state[name]} onChange={(event) => this.setState({ [name]: event.target.value })} />
            </div>
          ))}
          <button className="btn btn-dark w-100" type="submit">Continuar al pago</button>
        </fieldset>
      </form>
    )
  }
}

export default CheckoutForm
