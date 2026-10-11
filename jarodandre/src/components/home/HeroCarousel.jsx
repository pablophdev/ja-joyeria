import { Component, createRef } from 'react'
import HeroSlide from './HeroSlide'
import './HeroCarousel.css'

const AUTOPLAY_DELAY = 6000
const SWIPE_THRESHOLD = 50

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

class HeroCarousel extends Component {
  state = { activeIndex: 0, direction: 1 }

  rootRef = createRef()
  timerId = null
  touchStartX = null

  componentDidMount() {
    this.startTimer()
    this.preloadNextSlide()
  }

  componentDidUpdate(_prevProps, prevState) {
    if (prevState.activeIndex !== this.state.activeIndex) {
      this.restartTimer()
      this.preloadNextSlide()
    }
  }

  componentWillUnmount() {
    this.stopTimer()
  }

  startTimer = () => {
    if (this.props.slides.length < 2 || prefersReducedMotion()) return
    this.timerId = window.setInterval(() => {
      this.goTo(this.state.activeIndex + 1, 1)
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

  preloadNextSlide = () => {
    const { slides } = this.props
    if (!slides.length) return
    const nextIndex = (this.state.activeIndex + 1) % slides.length
    const image = new Image()
    image.src = slides[nextIndex].image
  }

  goTo = (index, direction) => {
    const { slides } = this.props
    if (slides.length < 2) return
    const activeIndex = ((index % slides.length) + slides.length) % slides.length
    if (activeIndex === this.state.activeIndex) return
    this.setState({ activeIndex, direction })
  }

  handlePointerLeave = () => {
    this.resetParallax()
  }

  handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      this.goTo(this.state.activeIndex - 1, -1)
    }
    if (event.key === 'ArrowRight') {
      this.goTo(this.state.activeIndex + 1, 1)
    }
  }

  handleTouchStart = (event) => {
    this.touchStartX = event.touches[0].clientX
  }

  handleTouchEnd = (event) => {
    if (this.touchStartX === null) return
    const delta = event.changedTouches[0].clientX - this.touchStartX
    this.touchStartX = null
    if (Math.abs(delta) < SWIPE_THRESHOLD) return
    const step = delta < 0 ? 1 : -1
    this.goTo(this.state.activeIndex + step, step)
  }

  handleMouseMove = (event) => {
    const node = this.rootRef.current
    if (!node || prefersReducedMotion()) return
    const rect = node.getBoundingClientRect()
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5
    node.style.setProperty('--hero-parallax-x', `${(offsetX * 18).toFixed(2)}px`)
    node.style.setProperty('--hero-parallax-y', `${(offsetY * 12).toFixed(2)}px`)
  }

  resetParallax = () => {
    const node = this.rootRef.current
    if (!node) return
    node.style.setProperty('--hero-parallax-x', '0px')
    node.style.setProperty('--hero-parallax-y', '0px')
  }

  render() {
    const { slides } = this.props

    if (!slides.length) return null

    const { activeIndex, direction } = this.state

    return (
      <section
        ref={this.rootRef}
        className="hero-carousel"
        aria-label="Colecciones destacadas"
        aria-roledescription="carrusel"
        onMouseLeave={this.handlePointerLeave}
        onMouseMove={this.handleMouseMove}
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
              direction={direction}
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
                onClick={() => this.goTo(activeIndex - 1, -1)}
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
                onClick={() => this.goTo(activeIndex + 1, 1)}
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
