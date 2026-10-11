import ProductCard from './ProductCard'

function ProductGrid({ products, emptyMessage = 'No hay productos disponibles.', columnClass = 'col-sm-6 col-lg-3' }) {
  if (products.length === 0) {
    return <p className="text-center text-secondary py-4">{emptyMessage}</p>
  }

  return (
    <div className="row g-4">
      {products.map((product) => (
        <div className={columnClass} key={product.id}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  )
}

export default ProductGrid
