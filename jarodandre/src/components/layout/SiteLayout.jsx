import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

function SiteLayout() {
  return (
    <div className="site-layout d-flex flex-column">
      <a className="visually-hidden-focusable p-3" href="#contenido">Saltar al contenido</a>
      <Header />
      <main id="contenido" className="flex-grow-1" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default SiteLayout
