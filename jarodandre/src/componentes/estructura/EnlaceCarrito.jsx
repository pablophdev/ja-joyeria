import { Component, createRef } from 'react'
import { Link } from 'react-router-dom'
import cartIcon from '../../assets/cart.svg'
import { getCart, subscribeToCart, subscribeToCartAdditions } from '../../datos/cart'
import { cartFeedback } from '../../utilidades/motion'
import { routes } from '../../navigation/routes'

class EnlaceCarrito extends Component {
  state = { quantity: getCart().totalQuantity }
  root = createRef()
  cleanupAnimation = () => {}

  componentDidMount() {
    this.unsubscribe = subscribeToCart(this.refreshCart)
    this.unsubscribeAdditions = subscribeToCartAdditions(() => {
      this.setState({ quantity: getCart().totalQuantity }, () => {
        this.cleanupAnimation()
        this.cleanupAnimation = cartFeedback(this.root.current)
      })
    })
    this.refreshCart()
  }

  componentWillUnmount() {
    this.unsubscribe?.()
    this.unsubscribeAdditions?.()
    this.cleanupAnimation()
  }

  refreshCart = () => this.setState({ quantity: getCart().totalQuantity })

  render() {
    const { onNavigate, tabIndex } = this.props

    return (
      <Link
        ref={this.root}
        className="nav-link text-dark d-inline-flex align-items-center gap-1"
        to={routes.cart}
        aria-label={`Carrito, ${this.state.quantity} unidades`}
        onClick={onNavigate}
        tabIndex={tabIndex}
      >
        <img src={cartIcon} alt="" width="20" height="20" />
        {this.state.quantity > 0 && <span className="badge text-bg-dark">{this.state.quantity}</span>}
      </Link>
    )
  }
}

export default EnlaceCarrito
