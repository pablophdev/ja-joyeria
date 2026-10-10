import { Component } from 'react'
import HeroSlide from './HeroSlide'
import './HeroCarousel.css'

class HeroCarousel extends Component {
  state = { activeIndex: 0 }

  changeSlide = (direction) => {
    this.setState(({ activeIndex }, { slides }) => ({
      activeIndex: (activeIndex + direction + slides.length) % slides.length,
    }))
  }

  render() {
    const { slides } = this.props

    if (!slides.length) return null

    const activeIndex = this.state.activeIndex % slides.length
    const activeSlide = slides[activeIndex]

    return (
      <section
        className="hero-carousel"
        aria-label="Colecciones destacadas"
        aria-roledescription="carrusel"
      >
        <div aria-live="polite" aria-atomic="true">
          <HeroSlide
            key={activeSlide.id}
            slide={activeSlide}
            position={activeIndex + 1}
            total={slides.length}
          />
        </div>
        {slides.length > 1 && (
          <div className="hero-carousel__controls container d-flex flex-wrap align-items-center justify-content-center gap-3">
            <button
              className="btn btn-outline-light hero-carousel__arrow"
              type="button"
              aria-label="Diapositiva anterior"
              onClick={() => this.changeSlide(-1)}
            >
              <span aria-hidden="true">←</span>
            </button>
            <div className="d-flex gap-2" role="group" aria-label="Elegir colección">
              {slides.map((slide, index) => (
                <button
                  className="hero-carousel__indicator"
                  key={slide.id}
                  type="button"
                  aria-label={`Mostrar ${slide.category}`}
                  aria-current={index === activeIndex ? 'true' : undefined}
                  onClick={() => this.setState({ activeIndex: index })}
                >
                  <span aria-hidden="true" />
                </button>
              ))}
            </div>
            <button
              className="btn btn-outline-light hero-carousel__arrow"
              type="button"
              aria-label="Diapositiva siguiente"
              onClick={() => this.changeSlide(1)}
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </section>
    )
  }
}

export default HeroCarousel
