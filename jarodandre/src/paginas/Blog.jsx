import TituloPagina from '../componentes/estructura/TituloPagina'
import { Link } from 'react-router-dom'
import { blogPosts, formatBlogDate } from '../datos/blogPosts'
import { getBlogDetailsPath } from '../navigation/routes'
import './Blog.css'

function Blog() {
  return (
    <>
      <TituloPagina title="Nuestro blog" />
      <div className="container py-5">
        <div className="row g-4">
          {blogPosts.map((post) => (
            <div className="col-sm-6 col-lg-4" key={post.slug}>
              <article className="blog-card h-100">
                <img className="blog-card__image" src={post.image} alt="" loading="lazy" />
                <div className="blog-card__body p-4">
                  <time className="small text-secondary" dateTime={post.date}>{formatBlogDate(post.date)}</time>
                  <h2 className="h5 mt-3 mb-4">{post.title}</h2>
                  {post.paragraphs?.length ? (
                    <Link className="btn btn-outline-dark align-self-start mt-auto" to={getBlogDetailsPath(post.slug)} aria-label={`Leer más: ${post.title}`}>Leer más</Link>
                  ) : (
                    <span className="text-secondary small mt-auto">Próximamente</span>
                  )}
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Blog
