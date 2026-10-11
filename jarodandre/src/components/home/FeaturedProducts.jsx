import { Component } from 'react'
import ProductGrid from '../products/ProductGrid'

class FeaturedProducts extends Component {
  state = { activeFilter: 'all' }

  render() {
    const { products, filters } = this.props
    const { activeFilter } = this.state
    const visibleProducts = products.filter((product) => activeFilter === 'all' || product.group === activeFilter)

    return (
      <section className="home-section container pt-0" aria-labelledby="featured-title">
        <h2 id="featured-title" className="text-center mb-4" data-reveal>Productos destacados</h2>
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-4" role="group" aria-label="Filtrar productos destacados" data-reveal style={{ '--reveal-delay': '100ms' }}>
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
        <div id="featured-products">
          <ProductGrid products={visibleProducts} emptyMessage="No hay productos destacados para este filtro." />
        </div>
      </section>
    )
  }
}

export default FeaturedProducts
