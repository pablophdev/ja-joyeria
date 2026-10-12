import { Component } from 'react'
import { addToCart, isProductAvailable } from '../../data/cart'

class QuickAddButton extends Component {
  state = { message: '', error: '' }

  handleAdd = () => {
    try {
      addToCart(this.props.product.id)
      this.setState({ message: 'Se añadió una unidad al carrito.', error: '' })
    } catch (error) {
      this.setState({ message: '', error: error.message })
    }
  }

  render() {
    const { product } = this.props
    return (
      <div className="mt-2">
        <button className="btn btn-dark" type="button" disabled={!isProductAvailable(product)} onClick={this.handleAdd} aria-label={`Añadir ${product.name} al carrito`}>{isProductAvailable(product) ? 'Añadir al carrito' : 'No disponible'}</button>
        <p className="small text-success mb-0 mt-1" role="status">{this.state.message}</p>
        {this.state.error && <p className="small text-danger mb-0" role="alert">{this.state.error}</p>}
      </div>
    )
  }
}

export default QuickAddButton
