import { Component } from 'react'
import HeroSlide from './HeroSlide'
import './HeroCarousel.css'

const AUTOPLAY_DELAY = 6000
const SWIPE_THRESHOLD = 50

class HeroCarousel extends Component {
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
    if (this.props.slides.length < 2 || reducedMotion) return
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
    const { slides } = this.props
    if (slides.length < 2) return
    let activeIndex = index
    if (index < 0) activeIndex = slides.length - 1
    if (index >= slides.length) activeIndex = 0
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
    const { slides } = this.props

    if (!slides.length) return null

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
          {slides.map((slide, index) => (
            <HeroSlide
              key={slide.id}
              slide={slide}
              position={index + 1}
              total={slides.length}
              isActive={index === activeIndex}
            />
          ))}
        </div>

        {slides.length > 1 && (
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
        )}
      </section>
    )
  }
}

export default HeroCarousel
