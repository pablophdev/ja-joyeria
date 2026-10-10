import { Component } from 'react'
import { Link } from 'react-router-dom'
import { getProductById, subscribeToProducts } from '../data/products'
import ProductRating from '../components/products/ProductRating'
import { formatPrice } from '../utils/formatPrice'
import { routes } from '../navigation/routes'

function findProduct(productId) {
  if (!/^[1-9]\d*$/.test(productId)) return null
  const id = Number(productId)
  return Number.isSafeInteger(id) ? getProductById(id) : null
}

class ProductDetailsPage extends Component {
  state = { product: findProduct(this.props.productId) }

  componentDidMount() {
    this.unsubscribe = subscribeToProducts(this.refreshProduct)
    this.refreshProduct()
  }

  componentWillUnmount() {
    this.unsubscribe?.()
  }

  refreshProduct = () => {
    this.setState({ product: findProduct(this.props.productId) })
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
                <ProductRating rating={product.rating} />
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

export default ProductDetailsPage
