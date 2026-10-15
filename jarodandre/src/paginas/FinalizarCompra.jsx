import { Component } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { confirmOrder, getCart, subscribeToCart } from '../datos/cart'
import FormularioEntrega from '../componentes/pedidos/FormularioEntrega'
import PagoPedido from '../componentes/pedidos/PagoPedido'
import { normalizeCustomer } from '../datos/orderRecords'
import { getPaymentResultPath, routes } from '../navigation/routes'
import { formatPrice } from '../utilidades/formatPrice'

class FinalizarCompra extends Component {
  state = { cart: getCart(), error: '', orderId: null, step: 'delivery', customer: null }
  submitting = false

  componentDidMount() {
    this.unsubscribe = subscribeToCart(this.refreshCart)
    this.refreshCart()
  }

  componentWillUnmount() { this.unsubscribe?.() }

  refreshCart = () => this.setState({ cart: getCart() })

  handleContinue = (values) => {
    try {
      const customer = normalizeCustomer(values)
      const cart = getCart()
      if (!cart.items.length || cart.items.some((item) => !item.available)) {
        throw new Error('Revisa los productos del carrito antes de continuar.')
      }
      this.setState({ customer, cart, step: 'payment', error: '' })
    } catch (error) {
      this.setState({ error: error.message })
    }
  }

  handlePay = () => this.completeCheckout('paid')

  handleCancel = () => this.completeCheckout('failed')

  completeCheckout = (paymentStatus) => {
    if (this.submitting || this.state.orderId) return
    this.submitting = true
    try {
      const order = confirmOrder(this.state.customer, paymentStatus)
      this.setState({ orderId: order.id, error: '' })
    } catch (error) {
      this.submitting = false
      this.setState({ error: `Pago no realizado. ${error.message} Puedes volver a intentarlo.` })
    }
  }

  render() {
    const { cart, error, orderId, step, customer } = this.state
    if (orderId) return <Navigate to={getPaymentResultPath(orderId)} replace />
    const unavailable = cart.items.some((item) => !item.available)

    return (
      <section className="container py-5">
        <h1>Checkout</h1>
        <nav aria-label="Ruta de navegación">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link className="text-dark" to={routes.home}>Inicio</Link></li>
            <li className="breadcrumb-item"><Link className="text-dark" to={routes.cart}>Carrito</Link></li>
            <li className="breadcrumb-item active" aria-current="page">Checkout</li>
          </ol>
        </nav>
        <ol className="list-unstyled d-flex flex-wrap gap-3 mt-4" aria-label="Pasos de la compra">
          <li className={step === 'delivery' ? 'fw-bold' : 'text-secondary'} aria-current={step === 'delivery' ? 'step' : undefined}>1. Datos de entrega</li>
          <li className={step === 'payment' ? 'fw-bold' : 'text-secondary'} aria-current={step === 'payment' ? 'step' : undefined}>2. Pago</li>
          <li className="text-secondary">3. Resultado</li>
        </ol>
        {!cart.items.length ? (
          <div className="border rounded p-4 my-4">
            <h2 className="h4">Tu carrito está vacío</h2>
            <p>Añade productos antes de finalizar la compra.</p>
            <Link className="btn btn-dark" to={routes.shop}>Ver productos</Link>
          </div>
        ) : (
          <div className="row g-4 mt-2">
            <div className="col-lg-7">
              <h2 className="h4">Resumen de tu compra</h2>
              <ul className="list-group mb-4">
                {cart.items.map(({ productId, product, quantity, subtotal, available }) => (
                  <li className="list-group-item d-flex gap-3 align-items-center" key={productId}>
                    {product && <img className="object-fit-cover rounded" src={product.image} alt="" width="64" height="64" />}
                    <div className="flex-grow-1">
                      <h3 className="h6">{product?.name || 'Producto eliminado'}</h3>
                      <p className="small mb-0">Cantidad: {quantity}{available && ` · ${formatPrice(product.price)} por unidad`}</p>
                      {!available && <p className="text-danger mb-0">No disponible</p>}
                    </div>
                    <span className="fw-bold">{formatPrice(subtotal)}</span>
                  </li>
                ))}
              </ul>
              <p>{cart.totalQuantity} unidades</p>
              <p className="fs-4 fw-bold">Total: {formatPrice(cart.total)}</p>
              <p className="small text-secondary">Sin gastos de envío ni descuentos.</p>
              <Link className="btn btn-outline-dark" to={routes.cart}>Editar carrito</Link>
            </div>
            <div className="col-lg-5">
              {unavailable && <p className="alert alert-warning" role="alert">Vuelve al carrito y elimina los productos no disponibles para continuar.</p>}
              {error && <p className="alert alert-danger" role="alert">{error}</p>}
              {step === 'delivery' ? (
                <FormularioEntrega initialCustomer={customer} disabled={unavailable} onContinue={this.handleContinue} />
              ) : (
                <PagoPedido
                  customer={customer}
                  total={cart.total}
                  disabled={unavailable}
                  onPay={this.handlePay}
                  onCancel={this.handleCancel}
                  onEdit={() => this.setState({ step: 'delivery', error: '' })}
                />
              )}
            </div>
          </div>
        )}
      </section>
    )
  }
}

export default FinalizarCompra
