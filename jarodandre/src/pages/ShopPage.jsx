import { Component } from 'react'
import { Link } from 'react-router-dom'
import ProductGrid from '../components/products/ProductGrid'
import CatalogFilters from '../components/products/CatalogFilters'
import { getProducts, subscribeToProducts } from '../data/products'
import { routes } from '../navigation/routes'
import { defaultCatalogFilters, filterCatalogProducts } from '../utils/catalogFilters'

class ShopPage extends Component {
  state = { products: getProducts(), filters: { ...defaultCatalogFilters } }

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

  handleFilterChange = (name, value) => {
    this.setState(({ filters }) => ({ filters: { ...filters, [name]: value } }))
  }

  resetFilters = () => {
    this.setState({ filters: { ...defaultCatalogFilters } })
  }

  render() {
    const { products, filters } = this.state
    const visibleProducts = filterCatalogProducts(products, filters)

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
          <h2 id="catalog-title" className="h3 mb-4">Catálogo de joyería</h2>
          <CatalogFilters filters={filters} onFilterChange={this.handleFilterChange} onReset={this.resetFilters} />
          <p className="text-secondary mb-4" role="status" aria-atomic="true">
            Mostrando {visibleProducts.length} de {products.length} {products.length === 1 ? 'producto' : 'productos'}
          </p>
          <div id="catalog-results">
            <ProductGrid
              products={visibleProducts}
              showCatalogLink={false}
              emptyMessage={products.length === 0
                ? 'No hay productos disponibles.'
                : 'No encontramos productos con estos criterios. Prueba otra búsqueda o restablece los filtros.'}
            />
          </div>
        </section>
      </>
    )
  }
}

export default ShopPage
