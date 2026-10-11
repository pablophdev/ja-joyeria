const REVEAL_SELECTOR = '[data-reveal]'

let observer = null

function observeAll(root = document) {
  if (!observer) return
  root.querySelectorAll(REVEAL_SELECTOR).forEach((element) => {
    if (!element.classList.contains('is-visible')) observer.observe(element)
  })
}

export function initScrollReveal() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    document.querySelectorAll(REVEAL_SELECTOR).forEach((element) => element.classList.add('is-visible'))
    return
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-visible')
      observer.unobserve(entry.target)
    })
  }, { threshold: 0.15, rootMargin: '0px 0px -48px 0px' })

  observeAll()

  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return
        if (node.matches?.(REVEAL_SELECTOR)) observer.observe(node)
        observeAll(node)
      })
    })
  })

  mutationObserver.observe(document.body, { childList: true, subtree: true })
}
