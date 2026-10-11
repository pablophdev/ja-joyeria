import { Component } from 'react'
import { Link } from 'react-router-dom'
import cartIcon from '../../assets/cart.svg'
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
      <Link className="nav-link text-dark d-inline-flex align-items-center gap-1" to={routes.cart} aria-label={`Carrito, ${this.state.quantity} unidades`}>
        <img src={cartIcon} alt="" width="20" height="20" />
        {this.state.quantity > 0 && <span className="badge text-bg-dark">{this.state.quantity}</span>}
      </Link>
    )
  }
}

export default CartLink
