import { gsap } from 'gsap'

const REVEAL_SELECTOR = '[data-reveal]'

export function initScrollReveal() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const pending = new Set()
  const animations = new Map()

  function show(element) {
    element.classList.add('is-visible')
    gsap.set(element, { clearProps: 'opacity,transform' })
  }

  const observer = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      const element = entry.target
      observer.unobserve(element)
      pending.delete(element)
      if (reducedMotion.matches) { show(element); continue }
      const direction = element.dataset.reveal
      const delay = parseFloat(getComputedStyle(element).getPropertyValue('--reveal-delay')) || 0
      element.classList.add('is-visible')
      const tween = gsap.fromTo(element, {
        opacity: 0,
        x: direction === 'left' ? -32 : direction === 'right' ? 32 : 0,
        y: direction === 'left' || direction === 'right' || direction === 'scale' ? 0 : 40,
        scale: direction === 'scale' ? 0.94 : 1,
      }, {
        opacity: 1, x: 0, y: 0, scale: 1, duration: 0.8,
        delay: Math.max(0, delay / 1000), ease: 'power3.out', clearProps: 'opacity,transform',
        onComplete: () => animations.delete(element),
      })
      animations.set(element, tween)
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -48px 0px' }) : null

  function register(element) {
    if (element.classList.contains('is-visible') || pending.has(element)) return
    if (!observer || reducedMotion.matches) { show(element); return }
    pending.add(element)
    observer.observe(element)
  }

  function visit(root, action) {
    if (root.nodeType !== Node.ELEMENT_NODE) return
    if (root.matches(REVEAL_SELECTOR)) action(root)
    root.querySelectorAll(REVEAL_SELECTOR).forEach(action)
  }

  function remove(element) {
    observer?.unobserve(element)
    pending.delete(element)
    animations.get(element)?.kill()
    animations.delete(element)
    show(element)
  }

  function motionChanged() {
    if (!reducedMotion.matches) return
    for (const element of pending) { observer?.unobserve(element); show(element) }
    pending.clear()
    for (const [element, animation] of animations) { animation.kill(); show(element) }
    animations.clear()
  }

  visit(document.body, register)
  const mutations = new MutationObserver((changes) => {
    for (const change of changes) {
      change.removedNodes.forEach((node) => visit(node, remove))
      change.addedNodes.forEach((node) => visit(node, register))
    }
  })
  mutations.observe(document.body, { childList: true, subtree: true })
  reducedMotion.addEventListener('change', motionChanged)

  return () => {
    observer?.disconnect()
    mutations.disconnect()
    reducedMotion.removeEventListener('change', motionChanged)
    for (const element of pending) show(element)
    for (const [element, animation] of animations) { animation.kill(); show(element) }
    pending.clear()
    animations.clear()
  }
}
