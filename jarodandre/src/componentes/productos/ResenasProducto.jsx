import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCurrentUser, subscribeToAuth } from '../../datos/auth'
import { getOrders, subscribeToOrders } from '../../datos/cart'
import { allPages, request } from '../../datos/api'
import { refreshProduct } from '../../datos/products'
import { routes } from '../../navigation/routes'
import ValoracionProducto from './ValoracionProducto'

function canReview(productId) {
  return Boolean(getCurrentUser()) && getOrders().some((order) => order.paymentStatus === 'paid'
    && order.items.some((item) => item.productId === Number(productId)))
}

export default function ResenasProducto({ productId }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [eligible, setEligible] = useState(() => canReview(productId))
  const [signedIn, setSignedIn] = useState(() => Boolean(getCurrentUser()))
  const [stars, setStars] = useState('5')
  const [comment, setComment] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true
    const refreshAccess = () => {
      setEligible(canReview(productId))
      setSignedIn(Boolean(getCurrentUser()))
    }
    const unsubscribeAuth = subscribeToAuth(refreshAccess)
    const unsubscribeOrders = subscribeToOrders(refreshAccess)
    allPages('catalog', `/v1/productos/${productId}/resenas`, { authenticated: false }, { page: 'pagina', size: 'tamano' })
      .then((items) => { if (active) setReviews(items) })
      .catch((failure) => { if (active) setError(failure.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false; unsubscribeAuth(); unsubscribeOrders() }
  }, [productId])

  async function submit(event) {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    setMessage('')
    try {
      await request('catalog', `/v1/productos/${productId}/resenas`, {
        method: 'PUT', body: { estrellas: Number(stars), comentario: comment },
      })
      const [items] = await Promise.all([
        allPages('catalog', `/v1/productos/${productId}/resenas`, { authenticated: false }, { page: 'pagina', size: 'tamano' }),
        refreshProduct(productId),
      ])
      setReviews(items)
      setMessage('Tu reseña se guardó correctamente.')
    } catch (failure) { setError(failure.message) }
    finally { setBusy(false) }
  }

  return <section className="mt-5 pt-4 border-top" aria-labelledby="reviews-title">
    <h2 id="reviews-title" className="h4">Reseñas de compradores</h2>
    {error && <p className="alert alert-danger" role="alert">{error}</p>}
    {loading ? <p role="status">Cargando reseñas…</p> : <>
      {reviews.length === 0 && <p>Este producto todavía no tiene reseñas.</p>}
      {reviews.map((review) => <article className="border-bottom py-3" key={review.id}>
        <p className="mb-1"><strong>{review.autor}</strong> · Compra verificada</p>
        <ValoracionProducto rating={review.estrellas} />
        {review.comentario && <p className="mt-2 mb-0" style={{ whiteSpace: 'pre-wrap' }}>{review.comentario}</p>}
      </article>)}
    </>}
    {eligible ? <form className="mt-4" onSubmit={submit}>
      <fieldset disabled={busy}><legend className="h5">Tu valoración</legend>
        <p className="form-text">Puedes dejar una reseña después de una compra pagada. Si ya publicaste una, se actualizará.</p>
        <label className="form-label" htmlFor="review-stars">Estrellas</label>
        <select className="form-select w-auto mb-3" id="review-stars" value={stars} onChange={(event) => setStars(event.target.value)}>
          {[5,4,3,2,1].map((number) => <option key={number} value={number}>{number} {number === 1 ? 'estrella' : 'estrellas'}</option>)}
        </select>
        <label className="form-label" htmlFor="review-comment">Tu reseña (opcional)</label>
        <textarea className="form-control mb-3" id="review-comment" rows="3" maxLength="2000" value={comment} onChange={(event) => setComment(event.target.value)} />
        <button className="btn btn-dark" type="submit">{busy ? 'Guardando…' : 'Guardar reseña'}</button>
      </fieldset>
    </form> : <p className="mt-3 text-secondary">{signedIn ? 'Podrás valorar este producto cuando tengas una compra pagada en tu cuenta.'
      : <><Link to={routes.login}>Inicia sesión</Link> con la cuenta de tu compra para dejar una reseña.</>}</p>}
    <p className="text-success mt-3" role="status">{message}</p>
  </section>
}
