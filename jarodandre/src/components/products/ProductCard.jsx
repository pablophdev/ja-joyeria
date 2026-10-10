import { Link } from 'react-router-dom'
import { routes } from '../../navigation/routes'

const currencyFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

function ProductCard({ product }) {
  return (
    <article className="card h-100 border-0 home-product">
      <div className="position-relative">
        <img
          className="card-img-top home-product__image"
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          width="400"
          height="400"
        />
        {product.badge && (
          <span className={`badge position-absolute top-0 start-0 m-3 ${product.badge === 'Oferta' ? 'text-bg-dark' : 'text-bg-light'}`}>
            {product.badge}
          </span>
        )}
      </div>
      <div className="card-body px-0 d-flex flex-column align-items-start">
        <h3 className="h6">{product.name}</h3>
        <p className="mb-2">
          <span aria-hidden="true">{'★'.repeat(product.rating)}{'☆'.repeat(5 - product.rating)}</span>
          <span className="visually-hidden">
            {product.rating ? `Valoración: ${product.rating} de 5 estrellas` : 'Sin valoraciones'}
          </span>
        </p>
        <p className="fw-bold fs-5">{currencyFormatter.format(product.price)}</p>
        <Link className="btn btn-outline-dark mt-auto" to={routes.shop}>Ver catálogo</Link>
      </div>
    </article>
  )
}

export default ProductCard
