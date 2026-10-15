import { Component } from 'react'
import { Link } from 'react-router-dom'
import { routes } from '../../navigation/routes'
import anillos from '../../assets/hero/hero-3.jpg'
import collares from '../../assets/hero/hero-2.jpg'
import './Carrusel.css'

const AUTOPLAY_DELAY = 6000
const SWIPE_THRESHOLD = 50

class Carrusel extends Component {
  state = { activeIndex: 0 }

  timerId = null
  touchStartX = null
  touchStartY = null

  componentDidMount() {
    this.startTimer()
  }

  componentDidUpdate(_prevProps, prevState) {
    if (prevState.activeIndex !== this.state.activeIndex) {
      this.restartTimer()
    }
  }

  componentWillUnmount() {
    this.stopTimer()
  }

  startTimer = () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return
    this.stopTimer()
    this.timerId = window.setInterval(() => {
      this.goTo(this.state.activeIndex + 1)
    }, AUTOPLAY_DELAY)
  }

  stopTimer = () => {
    window.clearInterval(this.timerId)
    this.timerId = null
  }

  restartTimer = () => {
    this.stopTimer()
    this.startTimer()
  }

  goTo = (index) => {
    let activeIndex = index
    if (index < 0) activeIndex = 1
    if (index >= 2) activeIndex = 0
    if (activeIndex === this.state.activeIndex) return
    this.setState({ activeIndex })
  }

  handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      this.goTo(this.state.activeIndex - 1)
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      this.goTo(this.state.activeIndex + 1)
    }
  }

  handleTouchStart = (event) => {
    this.touchStartX = event.touches[0].clientX
    this.touchStartY = event.touches[0].clientY
  }

  handleTouchEnd = (event) => {
    if (this.touchStartX === null) return
    const delta = event.changedTouches[0].clientX - this.touchStartX
    const verticalDelta = event.changedTouches[0].clientY - this.touchStartY
    this.touchStartX = null
    this.touchStartY = null
    if (Math.abs(delta) < SWIPE_THRESHOLD) return
    if (Math.abs(verticalDelta) > Math.abs(delta)) return

    if (delta < 0) {
      this.goTo(this.state.activeIndex + 1)
    } else {
      this.goTo(this.state.activeIndex - 1)
    }
  }

  render() {
    const { activeIndex } = this.state

    return (
      <section
        className="hero-carousel"
        aria-label="Colecciones destacadas"
        aria-roledescription="carrusel"
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleTouchEnd}
        onKeyDown={this.handleKeyDown}
      >
        <div className="hero-carousel__viewport" aria-live="polite">
          <div className={`hero-slide${activeIndex === 0 ? ' is-active' : ''}`} role="group" aria-roledescription="diapositiva" aria-label="1 de 2: Anillos" aria-hidden={activeIndex !== 0} inert={activeIndex !== 0}>
            <div className="hero-slide__media">
              <img className="hero-slide__image" src={anillos} alt="Anillo plateado con una figura religiosa y piedras rojas" fetchPriority="high" />
            </div>
            <div className="hero-slide__veil" aria-hidden="true" />
            <div className="hero-slide__content container">
              <div className="row"><div className="col-lg-8 col-xl-7">
                <p className="hero-slide__eyebrow"><span className="hero-slide__eyebrow-line" aria-hidden="true" />Anillos</p>
                <h2 className="hero-slide__title">Anillos<span className="hero-slide__title-accent">Colecciones 2026</span></h2>
                <p className="hero-slide__lead">Especialistas en alta joyería urbana. En jarodandre hacemos anillos y grillz únicos. Los fabricamos con cuidado y con una dedicación total a la calidad y a los detalles perfectos.</p>
                <Link className="hero-slide__cta" to={routes.shop}>Ver productos <span aria-hidden="true">→</span></Link>
              </div></div>
            </div>
          </div>
          <div className={`hero-slide${activeIndex === 1 ? ' is-active' : ''}`} role="group" aria-roledescription="diapositiva" aria-label="2 de 2: Collares" aria-hidden={activeIndex !== 1} inert={activeIndex !== 1}>
            <div className="hero-slide__media">
              <img className="hero-slide__image" src={collares} alt="Cadenas doradas y collar con un colgante de cruz" loading="lazy" />
            </div>
            <div className="hero-slide__veil" aria-hidden="true" />
            <div className="hero-slide__content container">
              <div className="row"><div className="col-lg-8 col-xl-7">
                <p className="hero-slide__eyebrow"><span className="hero-slide__eyebrow-line" aria-hidden="true" />Collares</p>
                <h2 className="hero-slide__title">Collares<span className="hero-slide__title-accent">Colecciones 2026</span></h2>
                <p className="hero-slide__lead">Estas piezas están hechas para llamar la atención. Creamos collares únicos que tienen un buen peso, terminaciones pulidas a mano y la actitud propia de la joyería urbana.</p>
                <Link className="hero-slide__cta" to={routes.shop}>Ver productos <span aria-hidden="true">→</span></Link>
              </div></div>
            </div>
          </div>
        </div>

          <div className="hero-carousel__hud container">
            <div className="hero-carousel__arrows">
              <button
                className="hero-carousel__arrow"
                type="button"
                aria-label="Diapositiva anterior"
                onClick={() => this.goTo(activeIndex - 1)}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M19 12H5" />
                  <path d="M11 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                className="hero-carousel__arrow"
                type="button"
                aria-label="Diapositiva siguiente"
                onClick={() => this.goTo(activeIndex + 1)}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>
      </section>
    )
  }
}

export default Carrusel
