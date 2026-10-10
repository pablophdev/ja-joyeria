function InstagramGallery({ images }) {
  return (
    <section className="home-section bg-light" aria-labelledby="instagram-title">
      <div className="container">
        <div className="row g-4 align-items-center">
          <div className="col-lg-8">
            <div className="row g-2">
              {images.map((image, index) => (
                <div className="col-6 col-sm-4" key={image}>
                  <img
                    className="instagram-gallery__image rounded"
                    src={image}
                    alt={`Galería de JA Joyería, fotografía ${index + 1}`}
                    width="320"
                    height="320"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-4">
            <h2 id="instagram-title">Jarodandre_</h2>
            <p className="mt-3">
              Observa cuidadosamente el proceso detrás de cada pieza. En nuestro Instagram mostramos
              el trabajo de taller, los lanzamientos especiales y los diseños hechos a medida para
              nuestra comunidad. Conéctate con nosotros.
            </p>
            <a className="btn btn-dark" href="https://www.instagram.com/jarodandre_/">Visitar Instagram</a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default InstagramGallery
