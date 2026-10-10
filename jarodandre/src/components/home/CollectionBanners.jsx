import { Link } from 'react-router-dom'
import { routes } from '../../navigation/routes'

function CollectionBanners({ collections }) {
  return (
    <section className="home-section container" aria-labelledby="collections-title">
      <h2 id="collections-title" className="text-center mb-5">Nuestras colecciones</h2>
      <div className="row g-4">
        {collections.map((collection) => (
          <div className="col-md-6 col-lg-4" key={collection.id}>
            <article className="h-100">
              <video
                className="collection-video border rounded"
                autoPlay
                loop
                muted
                playsInline
                controls
                preload="metadata"
                aria-label={`Video de la colección ${collection.title}`}
              >
                <source src={`${import.meta.env.BASE_URL}videos/${collection.video}`} type="video/mp4" />
                Tu navegador no admite la reproducción de este video.
              </video>
              <h3 className="h4 mt-3">{collection.title}</h3>
              <Link className="text-dark" to={routes.shop}>Explorar productos</Link>
            </article>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CollectionBanners
