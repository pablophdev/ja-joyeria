import { Component } from 'react'
import ProductCard from '../products/ProductCard'

class FeaturedProducts extends Component {
  state = { activeFilter: 'all' }

  render() {
    const { products, filters } = this.props
    const { activeFilter } = this.state
    const visibleProducts = products.filter((product) => activeFilter === 'all' || product.group === activeFilter)

    return (
      <section className="home-section container pt-0" aria-labelledby="featured-title">
        <h2 id="featured-title" className="text-center mb-4">Productos destacados</h2>
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-4" role="group" aria-label="Filtrar productos destacados">
          {filters.map((filter) => (
            <button
              className={`btn ${activeFilter === filter.id ? 'btn-dark' : 'btn-outline-dark'}`}
              type="button"
              key={filter.id}
              aria-pressed={activeFilter === filter.id}
              aria-controls="featured-products"
              onClick={() => this.setState({ activeFilter: filter.id })}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <p className="text-center text-secondary" role="status">
          {visibleProducts.length} productos · {filters.find((filter) => filter.id === activeFilter)?.label}
        </p>
        <div className="row g-4" id="featured-products">
          {visibleProducts.length === 0 && (
            <p className="text-center text-secondary py-4">No hay productos destacados para este filtro.</p>
          )}
          {visibleProducts.map((product) => (
            <div className="col-sm-6 col-lg-3" key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>
    )
  }
}

export default FeaturedProducts
