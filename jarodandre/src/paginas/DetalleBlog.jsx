import { Link, useParams } from 'react-router-dom'
import { formatBlogDate, getPublishedBlogPost } from '../datos/blogPosts'
import { routes } from '../navigation/routes'
import './Blog.css'

function DetalleBlog() {
  const { slug } = useParams()
  const post = getPublishedBlogPost(slug)

  if (!post) {
    return (
      <section className="container py-5">
        <h1>Artículo no disponible</h1>
        <p>Este artículo no existe o todavía no se ha publicado.</p>
        <Link className="btn btn-dark" to={routes.blog}>Volver al blog</Link>
      </section>
    )
  }

  return (
    <article className="container py-5">
      <nav aria-label="Ruta de navegación" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link className="text-dark" to={routes.home}>Inicio</Link></li>
          <li className="breadcrumb-item"><Link className="text-dark" to={routes.blog}>Blog</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{post.title}</li>
        </ol>
      </nav>
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <header className="text-center mb-5">
            <h1 className="mb-4">{post.title}</h1>
            <p className="text-secondary mb-0">
              Por {post.author} · <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
            </p>
          </header>
          <img className="blog-article__image mb-5" src={post.image} alt="" />
          <div className="blog-article__content">
            {post.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            <Link className="btn btn-outline-dark mt-4" to={routes.blog}>Volver al blog</Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default DetalleBlog
