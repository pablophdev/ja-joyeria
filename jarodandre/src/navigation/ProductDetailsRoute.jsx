import { useParams } from 'react-router-dom'
import ProductDetailsPage from '../pages/ProductDetailsPage'

function ProductDetailsRoute() {
  const { productId } = useParams()
  // La clave reinicia la ficha y su suscripción al navegar entre productos.
  return <ProductDetailsPage key={productId} productId={productId} />
}

export default ProductDetailsRoute
