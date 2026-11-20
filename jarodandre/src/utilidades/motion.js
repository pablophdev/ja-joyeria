import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Cada efecto devuelve su limpieza: StrictMode, cambios de ruta y preferencias
// de accesibilidad no deben dejar estilos ni animaciones activas.
export function motionScope(root, animate) {
  if (!root || typeof window.matchMedia !== 'function') return () => {}
  const media = gsap.matchMedia()
  media.add('(prefers-reduced-motion: no-preference)', () => animate(root), root)
  return () => media.revert()
}

export function heroEntrance(root) {
  return motionScope(root, (slide) => {
    gsap.timeline({ defaults: { ease: 'power2.out' } })
      .fromTo(slide.querySelector('.hero-slide__image'), { scale: 1.07 }, { scale: 1, duration: 1.6 })
      .fromTo(slide.querySelectorAll('.hero-slide__eyebrow, .hero-slide__title, .hero-slide__lead, .hero-slide__cta'),
        { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, stagger: 0.12, clearProps: 'transform,opacity' }, 0.1)
  })
}

export function productGridEntrance(root) {
  return motionScope(root, (grid) => {
    gsap.registerPlugin(ScrollTrigger)
    const cards = [...grid.children]
    if (!cards.length) return
    gsap.set(cards, { opacity: 0, y: 22 })
    ScrollTrigger.batch(cards, {
      start: 'top 96%',
      once: true,
      interval: 0.08,
      onEnter: (batch) => gsap.to(batch, {
        opacity: 1, y: 0, duration: 0.55, stagger: 0.07,
        ease: 'power2.out', clearProps: 'transform,opacity',
      }),
    })
  })
}

export function productHover(root) {
  return motionScope(root, (card) => {
    const media = gsap.matchMedia()
    media.add('(hover: hover) and (pointer: fine)', () => {
      const image = card.querySelector('.product-card__image')
      const animation = gsap.timeline({ paused: true, defaults: { duration: 0.35, ease: 'power2.out' } })
        .to(card, { y: -5 })
        .to(image, { scale: 1.045 }, 0)
      const enter = () => animation.play()
      const leave = () => animation.reverse()
      card.addEventListener('pointerenter', enter)
      card.addEventListener('pointerleave', leave)
      card.addEventListener('focusin', enter)
      const blur = (event) => { if (!card.contains(event.relatedTarget)) leave() }
      card.addEventListener('focusout', blur)
      return () => {
        card.removeEventListener('pointerenter', enter)
        card.removeEventListener('pointerleave', leave)
        card.removeEventListener('focusin', enter)
        card.removeEventListener('focusout', blur)
      }
    }, card)
    return () => media.revert()
  })
}

export function cartFeedback(root) {
  return motionScope(root, (link) => {
    gsap.timeline()
      .fromTo(link.querySelector('img'), { scale: 1 }, { scale: 1.25, duration: 0.18, repeat: 1, yoyo: true, clearProps: 'transform' })
      .fromTo(link.querySelector('.badge'), { scale: 0.8 }, { scale: 1, duration: 0.4, ease: 'back.out(2)', clearProps: 'transform' }, 0)
  })
}

export function contentEntrance(root) {
  return motionScope(root, (element) => {
    gsap.fromTo(element, { opacity: 0, y: 14 }, {
      opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', clearProps: 'transform,opacity',
    })
  })
}

export function contentExit(root, onComplete) {
  if (typeof window.matchMedia !== 'function' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    onComplete()
    return () => {}
  }
  return motionScope(root, (element) => {
    gsap.to(element, { opacity: 0, y: -8, duration: 0.16, onComplete })
  })
}

export function checkoutProgress(root, step, previousStep) {
  return motionScope(root, (element) => {
    gsap.fromTo(element.querySelector('[data-checkout-progress]'), {
      scaleX: previousStep ? (previousStep === 'payment' ? 1 : 0.5) : 0,
    }, {
      scaleX: step === 'payment' ? 1 : 0.5, duration: 0.45, ease: 'power2.out',
    })
    gsap.fromTo(element.querySelector('[aria-current="step"]'), { y: 3 }, { y: 0, duration: 0.3 })
  })
}

export function paymentEntrance(root) {
  return motionScope(root, (element) => {
    gsap.timeline({ defaults: { ease: 'power2.out' } })
      .fromTo(element.querySelector('[data-payment-symbol]'), { scale: 0.65, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.7)', clearProps: 'transform,opacity' })
      .fromTo(element.querySelectorAll('h1, [role="status"]'), { y: 12, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.12, duration: 0.4, clearProps: 'transform,opacity' }, 0.15)
  })
}
