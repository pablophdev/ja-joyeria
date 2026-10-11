import { useEffect, useState } from 'react'
import wordmark from '../../assets/jarodandre-blanco-transparente.webp'
import './Preloader.css'

const MIN_VISIBLE_MS = 1600
const FADE_MS = 550

function Preloader() {
  const [phase, setPhase] = useState('visible')

  useEffect(() => {
    const startedAt = performance.now()
    let finished = false

    const leave = () => {
      if (finished) return
      finished = true
      const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - startedAt))
      window.setTimeout(() => setPhase('leaving'), wait)
    }

    if (document.readyState === 'complete') {
      leave()
    } else {
      window.addEventListener('load', leave, { once: true })
    }

    return () => window.removeEventListener('load', leave)
  }, [])

  useEffect(() => {
    if (phase !== 'leaving') return undefined
    const timerId = window.setTimeout(() => setPhase('gone'), FADE_MS)
    return () => window.clearTimeout(timerId)
  }, [phase])

  if (phase === 'gone') return null

  return (
    <div
      className={`preloader${phase === 'leaving' ? ' preloader--leaving' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Cargando JA Joyería"
    >
      <div className="preloader__inner">
        <img className="preloader__logo" src={wordmark} alt="" width="240" height="80" />
        <span className="preloader__shine" aria-hidden="true" />
      </div>
      <div className="preloader__bar" aria-hidden="true"><span /></div>
    </div>
  )
}

export default Preloader
