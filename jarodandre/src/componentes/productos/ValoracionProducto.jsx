function ValoracionProducto({ rating }) {
  return (
    <span>
      <span aria-hidden="true">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
      <span className="visually-hidden">
        {rating ? `Valoración: ${rating} de 5 estrellas` : 'Sin valoraciones'}
      </span>
    </span>
  )
}

export default ValoracionProducto
