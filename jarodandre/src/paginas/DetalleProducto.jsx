import { Component } from 'react'
import { Link } from 'react-router-dom'
import { getProductById, subscribeToProducts } from '../datos/products'
import ValoracionProducto from '../componentes/productos/ValoracionProducto'
import { formatPrice } from '../utilidades/formatPrice'
import { routes } from '../navigation/routes'
import { addToCart, isProductAvailable } from '../datos/cart'
import ControlCantidad from '../componentes/carrito/ControlCantidad'

function findProduct(productId) {
  if (!/^[1-9]\d*$/.test(productId)) return null
  const id = Number(productId)
  return Number.isSafeInteger(id) ? getProductById(id) : null
}

class DetalleProducto extends Component {
  state = { product: findProduct(this.props.productId), quantity: 1, error: '', message: '' }

  componentDidMount() {
    this.unsubscribe = subscribeToProducts(this.refreshProduct)
    this.refreshProduct()
  }

  componentWillUnmount() {
    this.unsubscribe?.()
  }

  refreshProduct = () => {
    this.setState({ product: findProduct(this.props.productId), error: '', message: '' })
  }

  handleAddToCart = (event) => {
    event.preventDefault()
    try {
      addToCart(Number(this.props.productId), this.state.quantity)
      this.setState({ error: '', message: 'Producto añadido al carrito.' })
    } catch (error) {
      this.setState({ error: error.message, message: '' })
    }
  }

  render() {
    const { product } = this.state

    if (!product) {
      return (
        <section className="container py-5">
          <h1>Producto no encontrado</h1>
          <p>Este producto no existe o fue eliminado del catálogo.</p>
          <Link className="btn btn-dark" to={routes.shop}>Volver a productos</Link>
        </section>
      )
    }

    return (
      <>
        <div className="bg-light py-4">
          <nav className="container" aria-label="Ruta de navegación">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link className="text-dark" to={routes.home}>Inicio</Link></li>
              <li className="breadcrumb-item"><Link className="text-dark" to={routes.shop}>Productos</Link></li>
              <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
            </ol>
          </nav>
        </div>
        <article className="container py-5">
          <div className="row g-4 g-lg-5 align-items-start">
            <div className="col-md-6">
              <img className="img-fluid w-100 rounded" src={product.image} alt={product.name} />
            </div>
            <div className="col-md-6">
              {product.badge && <span className="badge text-bg-dark mb-3">{product.badge}</span>}
              <h1 className="h2">{product.name}</h1>
              <p className="mt-3">
                <ValoracionProducto rating={product.rating} />
                {product.reviewCount > 0 && <span> · {product.reviewCount} {product.reviewCount === 1 ? 'reseña' : 'reseñas'}</span>}
              </p>
              <p className="fs-3 fw-bold">{formatPrice(product.price)}</p>
              <p>{product.description || 'Este producto todavía no tiene una descripción detallada.'}</p>
              <dl className="mt-4">
                <dt>Disponibilidad</dt>
                <dd>{product.availability || 'Consultar disponibilidad'}</dd>
                {product.category && <><dt>Categoría</dt><dd>{product.category}</dd></>}
                {product.tags && <><dt>Etiquetas</dt><dd>{product.tags}</dd></>}
              </dl>
              <form onSubmit={this.handleAddToCart} className="mt-4">
                <ControlCantidad id="product-quantity" quantity={this.state.quantity} disabled={!isProductAvailable(product)} onChange={(quantity) => this.setState({ quantity, error: '', message: '' })} />
                <button className="btn btn-dark mt-3" type="submit" disabled={!isProductAvailable(product)}>Añadir al carrito</button>
              </form>
              {this.state.error && <p className="alert alert-danger mt-3" role="alert">{this.state.error}</p>}
              <p className="text-success mt-3" role="status">{this.state.message}</p>
              {this.state.message && <Link className="btn btn-outline-dark" to={routes.cart}>Ver carrito</Link>}
              <div className="d-flex flex-wrap gap-2 mt-4">
                <Link className="btn btn-dark" to={routes.shop}>Volver a productos</Link>
                <Link className="btn btn-outline-dark" to={routes.contact}>Consultar sobre el producto</Link>
              </div>
            </div>
          </div>
        </article>
      </>
    )
  }
}

export default DetalleProducto
