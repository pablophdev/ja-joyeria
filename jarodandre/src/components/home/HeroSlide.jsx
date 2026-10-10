import { Link } from 'react-router-dom'

function HeroSlide({ slide, position, total }) {
  return (
    <div
      className="hero-slide"
      role="group"
      aria-roledescription="diapositiva"
      aria-label={`${position} de ${total}: ${slide.category}`}
    >
      <img className="hero-slide__image" src={slide.image} alt={slide.imageAlt} fetchPriority="high" />
      <div className="hero-slide__content container">
        <div className="row">
          <div className="col-md-9 col-lg-7 col-xl-6">
            <p className="collection-label">{slide.category}</p>
            <h2 className="display-4 fw-bold mb-4">{slide.title}</h2>
            <p className="lead mb-4">{slide.description}</p>
            <Link className="btn btn-light px-4 py-3 fw-semibold" to={slide.to}>
              {slide.linkLabel} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSlide
