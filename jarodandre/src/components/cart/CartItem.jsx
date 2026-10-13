import { Link } from 'react-router-dom'
import { getProductDetailsPath } from '../../navigation/routes'
import { formatPrice } from '../../utils/formatPrice'
import QuantityControl from './QuantityControl'

function CartItem({ item, onQuantityChange, onRemove }) {
  const { product, productId, quantity, subtotal, available } = item
  const name = product?.name ?? `Producto eliminado (#${productId})`

  return (
    <li className="list-group-item p-3">
      <article className="row g-3 align-items-center">
        <div className="col-12 col-xl-6">
          {product ? (
            <div className="d-flex align-items-center gap-3">
              <img className="rounded object-fit-cover flex-shrink-0" src={product.image} alt="" width="72" height="72" loading="lazy" />
              <div>
                <h2 className="h6"><Link className="text-dark" to={getProductDetailsPath(productId)}>{name}</Link></h2>
                <p className="mb-0">{formatPrice(product.price)} por unidad</p>
              </div>
            </div>
          ) : <h2 className="h6">{name}</h2>}
          {!available && <p className="text-danger mt-2 mb-0">No disponible. No se incluye en el total; puedes quitarlo del carrito.</p>}
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <QuantityControl id={`cart-quantity-${productId}`} label={`Cantidad de ${name}`} quantity={quantity} disabled={!available} onChange={(value) => onQuantityChange(productId, value)} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3 text-sm-end">
          <p className="fw-bold mb-2">Subtotal: {formatPrice(subtotal)}</p>
          <button className="btn btn-outline-danger btn-sm" type="button" onClick={() => onRemove(productId)} aria-label={`Eliminar ${name} del carrito`}>Eliminar</button>
        </div>
      </article>
    </li>
  )
}

export default CartItem
