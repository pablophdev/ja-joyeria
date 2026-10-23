import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getCurrentUser, isAdmin, subscribeToAuth } from '../../datos/auth'
import { routes } from '../../navigation/routes'
import './BotonVolverAdmin.css'

const adminSections = [routes.admin, routes.users]

function isAdminSection(pathname) {
  return adminSections.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

function BotonVolverAdmin() {
  const { pathname } = useLocation()
  const [user, setUser] = useState(() => getCurrentUser())

  useEffect(() => subscribeToAuth(() => setUser(getCurrentUser())), [])

  if (!user || !isAdmin(user) || isAdminSection(pathname)) return null

  return (
    <div className="gem-return">
      <Link
        className="gem-return__button"
        to={routes.admin}
        aria-label="Volver al panel de administración"
        title="Volver al panel de administración"
      >
        <svg className="gem-return__stone" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path className="gem-return__body" d="M20 4H80L98 32L50 96L2 32Z" />
          <path className="gem-return__facet gem-return__facet--table" d="M20 4H80L70 32H30Z" />
          <path className="gem-return__facet gem-return__facet--crown-left" d="M2 32L20 4L30 32Z" />
          <path className="gem-return__facet gem-return__facet--crown-right" d="M70 32L80 4L98 32Z" />
          <path className="gem-return__facet gem-return__facet--pavilion-left" d="M2 32L30 32L50 96Z" />
          <path className="gem-return__facet gem-return__facet--pavilion-center" d="M30 32H70L50 96Z" />
          <path className="gem-return__facet gem-return__facet--pavilion-right" d="M70 32L98 32L50 96Z" />
        </svg>
        <span className="gem-return__content">
          <svg className="gem-return__arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M10.5 3.5 6 8l4.5 4.5" />
          </svg>
          <span className="gem-return__label">Admin</span>
        </span>
      </Link>
    </div>
  )
}

export default BotonVolverAdmin
