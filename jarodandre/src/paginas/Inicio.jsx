import { Component } from 'react'
import { Link } from 'react-router-dom'
import { routes } from '../navigation/routes'
import Carrusel from '../componentes/inicio/Carrusel'
import TarjetaProducto from '../componentes/productos/TarjetaProducto'
import instagram1 from '../assets/instagram/instagram-1.jpg'
import instagram2 from '../assets/instagram/instagram-2.jpg'
import instagram3 from '../assets/instagram/instagram-3.jpg'
import instagram4 from '../assets/instagram/instagram-4.jpg'
import instagram5 from '../assets/instagram/instagram-5.jpg'
import instagram6 from '../assets/instagram/instagram-6.jpg'
import { getFeaturedProducts, subscribeToProducts } from '../datos/products'
import './Inicio.css'

class Inicio extends Component {
  state = { featuredProducts: getFeaturedProducts(), filtro: 'all' }

  componentDidMount() {
    this.unsubscribe = subscribeToProducts(this.refreshProducts)
    this.refreshProducts()
  }

  componentWillUnmount() {
    this.unsubscribe?.()
  }

  refreshProducts = () => {
    this.setState({ featuredProducts: getFeaturedProducts() })
  }

  render() {
    const { featuredProducts, filtro } = this.state
    const productos = featuredProducts.filter((producto) => filtro === 'all' || producto.group === filtro)

    return (
      <>
        <h1 className="visually-hidden">jarodandre — Alta joyería urbana</h1>
        <Carrusel />
        <section className="home-section container">
          <h2 className="text-center mb-5">Nuestras colecciones</h2>
          <div className="row g-4">
            <article className="col-md-6 col-lg-4">
              <video className="collection-video border rounded" autoPlay loop muted playsInline preload="metadata" aria-label="Colección de grillz">
                <source src={`${import.meta.env.BASE_URL}videos/jarod.mp4`} type="video/mp4" />
              </video>
              <h3 className="h4 mt-3">Grillz Colecciones 2026</h3>
              <Link className="text-dark" to={routes.shop}>Explorar productos</Link>
            </article>
            <article className="col-md-6 col-lg-4">
              <video className="collection-video border rounded" autoPlay loop muted playsInline preload="metadata" aria-label="Colección de anillos">
                <source src={`${import.meta.env.BASE_URL}videos/jarod2.mp4`} type="video/mp4" />
              </video>
              <h3 className="h4 mt-3">Anillos</h3>
              <Link className="text-dark" to={routes.shop}>Explorar productos</Link>
            </article>
            <article className="col-md-6 col-lg-4">
              <video className="collection-video border rounded" autoPlay loop muted playsInline preload="metadata" aria-label="Colección de cadenas y collares">
                <source src={`${import.meta.env.BASE_URL}videos/video2joya.mp4`} type="video/mp4" />
              </video>
              <h3 className="h4 mt-3">Cadenas y Collares</h3>
              <Link className="text-dark" to={routes.shop}>Explorar productos</Link>
            </article>
          </div>
        </section>
        <section className="home-section container pt-0">
          <h2 className="text-center mb-4">Productos destacados</h2>
          <div className="d-flex flex-wrap justify-content-center gap-2 mb-4" role="group" aria-label="Filtrar productos destacados">
            <button className={`btn ${filtro === 'all' ? 'btn-dark' : 'btn-outline-dark'}`} type="button" aria-pressed={filtro === 'all'} onClick={() => this.setState({ filtro: 'all' })}>Top Productos</button>
            <button className={`btn ${filtro === 'new' ? 'btn-dark' : 'btn-outline-dark'}`} type="button" aria-pressed={filtro === 'new'} onClick={() => this.setState({ filtro: 'new' })}>Nuevos</button>
            <button className={`btn ${filtro === 'popular' ? 'btn-dark' : 'btn-outline-dark'}`} type="button" aria-pressed={filtro === 'popular'} onClick={() => this.setState({ filtro: 'popular' })}>Populares</button>
          </div>
          <p className="text-center text-secondary" role="status">{productos.length} productos</p>
          <div className="row g-4">
            {productos.map((producto) => <div className="col-sm-6 col-lg-3" key={producto.id}><TarjetaProducto product={producto} /></div>)}
          </div>
          {productos.length === 0 && <p className="text-center text-secondary py-4">No hay productos destacados para este filtro.</p>}
        </section>
        <section className="home-section bg-light">
          <div className="container">
            <div className="row g-4 align-items-center">
              <div className="col-lg-8">
                <div className="row g-2">
                  <div className="col-6 col-sm-4"><img className="instagram-gallery__image rounded" src={instagram1} alt="Galería de jarodandre, fotografía 1" width="320" height="320" loading="lazy" /></div>
                  <div className="col-6 col-sm-4"><img className="instagram-gallery__image rounded" src={instagram2} alt="Galería de jarodandre, fotografía 2" width="320" height="320" loading="lazy" /></div>
                  <div className="col-6 col-sm-4"><img className="instagram-gallery__image rounded" src={instagram3} alt="Galería de jarodandre, fotografía 3" width="320" height="320" loading="lazy" /></div>
                  <div className="col-6 col-sm-4"><img className="instagram-gallery__image rounded" src={instagram4} alt="Galería de jarodandre, fotografía 4" width="320" height="320" loading="lazy" /></div>
                  <div className="col-6 col-sm-4"><img className="instagram-gallery__image rounded" src={instagram5} alt="Galería de jarodandre, fotografía 5" width="320" height="320" loading="lazy" /></div>
                  <div className="col-6 col-sm-4"><img className="instagram-gallery__image rounded" src={instagram6} alt="Galería de jarodandre, fotografía 6" width="320" height="320" loading="lazy" /></div>
                </div>
              </div>
              <div className="col-lg-4">
                <h2>Jarodandre_</h2>
                <p className="mt-3">Observa cuidadosamente el proceso detrás de cada pieza. En nuestro Instagram mostramos el trabajo de taller, los lanzamientos especiales y los diseños hechos a medida para nuestra comunidad. Conéctate con nosotros.</p>
                <a className="btn btn-dark" href="https://www.instagram.com/jarodandre_/">Visitar Instagram</a>
              </div>
            </div>
          </div>
        </section>
      </>
    )
  }
}

export default Inicio
