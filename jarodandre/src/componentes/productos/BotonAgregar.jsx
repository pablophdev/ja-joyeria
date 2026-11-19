import { Component } from 'react'
import { addToCart, isProductAvailable } from '../../datos/cart'

class BotonAgregar extends Component {
  state = { message: '', error: '', busy: false }

  handleAdd = async () => {
    if (this.state.busy) return
    this.setState({ busy: true })
    try {
      await addToCart(this.props.product.id)
      this.setState({ message: 'Se añadió una unidad al carrito.', error: '' })
    } catch (error) {
      this.setState({ message: '', error: error.message })
    } finally { this.setState({ busy: false }) }
  }

  render() {
    const { product } = this.props
    return (
      <div className="mt-2">
        <button className="btn btn-dark" type="button" disabled={this.state.busy || !isProductAvailable(product)} onClick={this.handleAdd} aria-label={`Añadir ${product.name} al carrito`}>{this.state.busy ? 'Añadiendo…' : isProductAvailable(product) ? 'Añadir al carrito' : 'No disponible'}</button>
        <p className="small text-success mb-0 mt-1" role="status">{this.state.message}</p>
        {this.state.error && <p className="small text-danger mb-0" role="alert">{this.state.error}</p>}
      </div>
    )
  }
}

export default BotonAgregar
