import { Link } from 'react-router-dom'
import { formatBlogDate } from '../../data/blogPosts'
import { getBlogDetailsPath } from '../../navigation/routes'

function BlogCard({ post }) {
  const published = Boolean(post.paragraphs?.length)

  return (
    <article className="blog-card h-100">
      <img className="blog-card__image" src={post.image} alt="" loading="lazy" />
      <div className="blog-card__body p-4">
        <time className="small text-secondary" dateTime={post.date}>{formatBlogDate(post.date)}</time>
        <h2 className="h5 mt-3 mb-4">{post.title}</h2>
        {published ? (
          <Link className="btn btn-outline-dark align-self-start mt-auto" to={getBlogDetailsPath(post.slug)} aria-label={`Leer más: ${post.title}`}>
            Leer más
          </Link>
        ) : (
          <span className="text-secondary small mt-auto">Próximamente</span>
        )}
      </div>
    </article>
  )
}

export default BlogCard
