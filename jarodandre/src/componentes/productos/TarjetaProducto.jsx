import { Link } from 'react-router-dom'
import { getProductDetailsPath } from '../../navigation/routes'
import { formatPrice } from '../../utilidades/formatPrice'
import ValoracionProducto from './ValoracionProducto'
import BotonAgregar from './BotonAgregar'
import './TarjetaProducto.css'

function TarjetaProducto({ product }) {
  const detailsPath = getProductDetailsPath(product.id)
  return (
    <article className="product-card card h-100 border-0">
      <div className="position-relative">
        <Link to={detailsPath} aria-label={`Ver ${product.name}`}>
          <img
            className="card-img-top product-card__image"
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            width="400"
            height="400"
          />
        </Link>
        {product.badge && (
          <span className={`badge position-absolute top-0 start-0 m-3 ${product.badge === 'Oferta' ? 'text-bg-dark' : 'text-bg-light'}`}>
            {product.badge}
          </span>
        )}
      </div>
      <div className="card-body px-0 d-flex flex-column align-items-start">
        <h3 className="h6"><Link className="text-dark text-decoration-none" to={detailsPath}>{product.name}</Link></h3>
        <p className="mb-2">
          <ValoracionProducto rating={product.rating} />
        </p>
        <p className="fw-bold fs-5">{formatPrice(product.price)}</p>
        <Link className="btn btn-outline-dark mt-auto" to={detailsPath}>Ver detalle</Link>
        <BotonAgregar product={product} />
      </div>
    </article>
  )
}

export default TarjetaProducto
