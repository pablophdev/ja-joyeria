import { Component } from 'react'
import { Link } from 'react-router-dom'
import TarjetaProducto from '../componentes/productos/TarjetaProducto'
import FiltrosCatalogo from '../componentes/productos/FiltrosCatalogo'
import CategoriasCatalogo from '../componentes/productos/CategoriasCatalogo'
import { getProducts, subscribeToProducts } from '../datos/products'
import { routes } from '../navigation/routes'
import { defaultCatalogFilters, filterCatalogProducts } from '../utilidades/catalogFilters'
import { getProductCategories } from '../utilidades/productCategories'

class Tienda extends Component {
  state = { products: getProducts(), filters: { ...defaultCatalogFilters } }

  componentDidMount() {
    this.unsubscribe = subscribeToProducts(this.refreshProducts)
    this.refreshProducts()
  }

  componentWillUnmount() {
    this.unsubscribe?.()
  }

  refreshProducts = () => {
    const products = getProducts()
    const categories = getProductCategories(products)
    this.setState((previousState) => {
      const filters = { ...previousState.filters }
      const categoryExists = categories.some((category) => category.value === filters.category)

      if (!categoryExists) {
        filters.category = 'all'
      }

      return { products, filters }
    })
  }

  handleFilterChange = (name, value) => {
    this.setState((previousState) => {
      const filters = { ...previousState.filters }
      filters[name] = value
      return { filters }
    })
  }

  resetFilters = () => {
    this.setState({ filters: { ...defaultCatalogFilters } })
  }

  render() {
    const { products, filters } = this.state
    const visibleProducts = filterCatalogProducts(products, filters)
    const categories = getProductCategories(products)
    const selectedCategory = categories.find((category) => category.value === filters.category)

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
          <h2 id="catalog-title" className="h3 mb-4" data-reveal>Catálogo de joyería</h2>
          <CategoriasCatalogo
            categories={categories}
            selectedCategory={filters.category}
            total={products.length}
            onSelect={(value) => this.handleFilterChange('category', value)}
          />
          <div className="row g-4">
            <div className="col-lg-3">
              <FiltrosCatalogo filters={filters} onFilterChange={this.handleFilterChange} onReset={this.resetFilters} />
            </div>
            <div className="col-lg-9" data-reveal="right">
              <h3 className="h4">{selectedCategory?.label || 'Todos los productos'}</h3>
              <p className="text-secondary mb-4" role="status" aria-atomic="true">
                Mostrando {visibleProducts.length} de {selectedCategory?.count ?? products.length} productos
                {selectedCategory && ` en ${selectedCategory.label}`}
              </p>
              <div id="catalog-results">
                <div className="row g-4">
                  {visibleProducts.map((product) => <div className="col-12 col-sm-6 col-xl-4" key={product.id}><TarjetaProducto product={product} /></div>)}
                </div>
                {visibleProducts.length === 0 && <p className="text-center text-secondary py-4">{products.length === 0 ? 'No hay productos disponibles.' : 'No encontramos productos con estos criterios. Prueba otra búsqueda o restablece los filtros.'}</p>}
              </div>
            </div>
          </div>
        </section>
      </>
    )
  }
}

export default Tienda
