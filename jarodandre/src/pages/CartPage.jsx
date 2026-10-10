import { Component } from 'react'
import { Link } from 'react-router-dom'
import { clearCart, getCart, removeFromCart, subscribeToCart, updateCartQuantity } from '../data/cart'
import CartItem from '../components/cart/CartItem'
import { routes } from '../navigation/routes'
import { formatPrice } from '../utils/formatPrice'

class CartPage extends Component {
  state = { cart: getCart(), error: '', message: '' }

  componentDidMount() {
    this.unsubscribe = subscribeToCart(this.refreshCart)
    this.refreshCart()
  }

  componentWillUnmount() {
    this.unsubscribe?.()
  }

  refreshCart = () => this.setState({ cart: getCart() })

  performAction = (action, message) => {
    try {
      action()
      this.setState({ error: '', message })
    } catch (error) {
      this.setState({ error: error.message, message: '' })
    }
  }

  render() {
    const { cart, error, message } = this.state
    return (
      <div className="container py-5">
        <h1>Carrito de compras</h1>
        <nav aria-label="Ruta de navegación">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to={routes.home}>Inicio</Link></li>
            <li className="breadcrumb-item"><Link to={routes.shop}>Productos</Link></li>
            <li className="breadcrumb-item active" aria-current="page">Carrito</li>
          </ol>
        </nav>
        {error && <p className="alert alert-danger" role="alert">{error}</p>}
        <p className="text-success" role="status">{message}</p>
        {!cart.items.length ? (
          <div className="bg-light rounded p-4 mb-4">
            <h2 className="h4">Tu carrito está vacío</h2>
            <p className="mb-0">Explora el catálogo y añade tus productos favoritos.</p>
          </div>
        ) : (
          <div className="row g-4 mb-4">
            <div className="col-lg-8">
              <ul className="list-group">
                {cart.items.map((item) => (
                  <CartItem key={item.productId} item={item}
                    onQuantityChange={(id, quantity) => this.performAction(() => updateCartQuantity(id, quantity), 'Cantidad actualizada.')}
                    onRemove={(id) => this.performAction(() => removeFromCart(id), 'Producto eliminado del carrito.')}
                  />
                ))}
              </ul>
              <button className="btn btn-outline-danger mt-3" type="button" onClick={() => this.performAction(clearCart, 'Carrito vaciado.')}>Vaciar carrito</button>
            </div>
            <div className="col-lg-4">
              <section className="bg-light rounded p-4" aria-labelledby="cart-summary-title">
                <h2 id="cart-summary-title" className="h4">Resumen del carrito</h2>
                <p>{cart.totalQuantity} unidades en el carrito</p>
                <dl className="mb-0">
                  <dt>Subtotal</dt><dd>{formatPrice(cart.total)}</dd>
                  <dt className="fs-5">Total</dt><dd className="fs-4 fw-bold">{formatPrice(cart.total)}</dd>
                </dl>
                <p className="small mb-0">Total de productos disponibles. Sin gastos de envío ni descuentos. La confirmación de pedidos estará disponible en la siguiente etapa.</p>
              </section>
            </div>
          </div>
        )}
        <Link className="btn btn-dark" to={routes.shop}>Seguir comprando</Link>
      </div>
    )
  }
}

export default CartPage
