import { Component } from 'react'
import { Link } from 'react-router-dom'
import ProductGrid from '../components/products/ProductGrid'
import { getProducts, subscribeToProducts } from '../data/products'
import { routes } from '../navigation/routes'

class ShopPage extends Component {
  state = { products: getProducts() }

  componentDidMount() {
    this.unsubscribe = subscribeToProducts(this.refreshProducts)
    this.refreshProducts()
  }

  componentWillUnmount() {
    this.unsubscribe?.()
  }

  refreshProducts = () => {
    this.setState({ products: getProducts() })
  }

  render() {
    const { products } = this.state

    return (
      <>
        <div className="bg-light py-4">
          <div className="container">
            <h1>Productos</h1>
            <nav aria-label="Ruta de navegación">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item"><Link className="text-dark" to={routes.home}>Inicio</Link></li>
                <li className="breadcrumb-item active" aria-current="page">Productos</li>
              </ol>
            </nav>
          </div>
        </div>
        <section className="container py-5" aria-labelledby="catalog-title">
          <div className="d-flex flex-wrap justify-content-between align-items-baseline gap-2 mb-4">
            <h2 id="catalog-title" className="h3 mb-0">Catálogo de joyería</h2>
            <p className="text-secondary mb-0" role="status">
              {products.length} {products.length === 1 ? 'producto disponible' : 'productos disponibles'}
            </p>
          </div>
          <ProductGrid products={products} showCatalogLink={false} />
        </section>
      </>
    )
  }
}

export default ShopPage
