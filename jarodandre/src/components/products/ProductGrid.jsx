import ProductCard from './ProductCard'

function ProductGrid({ products, showCatalogLink = true, emptyMessage = 'No hay productos disponibles.' }) {
  if (products.length === 0) {
    return <p className="text-center text-secondary py-4">{emptyMessage}</p>
  }

  return (
    <div className="row g-4">
      {products.map((product) => (
        <div className="col-sm-6 col-lg-3" key={product.id}>
          <ProductCard product={product} showCatalogLink={showCatalogLink} />
        </div>
      ))}
    </div>
  )
}

export default ProductGrid
