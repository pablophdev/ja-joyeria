import { Component } from 'react'
import { Link } from 'react-router-dom'
import { getCart, subscribeToCart } from '../../data/cart'
import { routes } from '../../navigation/routes'

class CartLink extends Component {
  state = { quantity: getCart().totalQuantity }

  componentDidMount() {
    this.unsubscribe = subscribeToCart(this.refreshCart)
    this.refreshCart()
  }

  componentWillUnmount() {
    this.unsubscribe?.()
  }

  refreshCart = () => this.setState({ quantity: getCart().totalQuantity })

  render() {
    return (
      <Link className="nav-link text-dark" to={routes.cart} aria-label={`Carrito, ${this.state.quantity} unidades`}>
        Carrito <span className="badge text-bg-dark">{this.state.quantity}</span>
      </Link>
    )
  }
}

export default CartLink
