import { Link } from 'react-router-dom'

function HeroSlide({ slide, position, total, isActive, direction }) {
  const [mainTitle, ...rest] = slide.title.split(' - ')
  const subtitle = rest.join(' - ')

  return (
    <div
      className={`hero-slide${isActive ? ' is-active' : ''}`}
      role="group"
      aria-roledescription="diapositiva"
      aria-label={`${position} de ${total}: ${slide.category}`}
      aria-hidden={isActive ? undefined : true}
      data-direction={direction > 0 ? 'next' : 'prev'}
    >
      <div className="hero-slide__media">
        <img
          className="hero-slide__image"
          src={slide.image}
          alt={slide.imageAlt}
          loading={isActive ? 'eager' : 'lazy'}
          fetchPriority={isActive ? 'high' : 'auto'}
        />
      </div>
      <div className="hero-slide__veil" aria-hidden="true" />
      <div className="hero-slide__content container">
        <div className="row">
          <div className="col-lg-8 col-xl-7">
            <p className="hero-slide__eyebrow">
              <span className="hero-slide__eyebrow-line" aria-hidden="true" />
              {slide.category}
            </p>
            <h2 className="hero-slide__title">
              {mainTitle}
              {subtitle && <span className="hero-slide__title-accent">{subtitle}</span>}
            </h2>
            <p className="hero-slide__lead">{slide.description}</p>
            <Link className="hero-slide__cta" to={slide.to}>
              <span>{slide.linkLabel}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSlide
