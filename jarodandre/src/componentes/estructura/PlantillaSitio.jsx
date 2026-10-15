import { Outlet } from 'react-router-dom'
import Cabecera from './Cabecera'
import PiePagina from './PiePagina'

function PlantillaSitio() {
  return (
    <div className="site-layout d-flex flex-column">
      <a className="visually-hidden-focusable p-3" href="#contenido">Saltar al contenido</a>
      <Cabecera />
      <main id="contenido" className="flex-grow-1" tabIndex={-1}>
        <Outlet />
      </main>
      <PiePagina />
    </div>
  )
}

export default PlantillaSitio
