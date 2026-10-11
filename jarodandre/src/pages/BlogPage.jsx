import PageHeading from '../components/common/PageHeading'
import BlogCard from '../components/blog/BlogCard'
import { blogPosts } from '../data/blogPosts'
import '../components/blog/Blog.css'

function BlogPage() {
  return (
    <>
      <PageHeading title="Nuestro blog" />
      <div className="container py-5">
        <div className="row g-4">
          {blogPosts.map((post) => (
            <div className="col-sm-6 col-lg-4" key={post.slug}>
              <BlogCard post={post} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default BlogPage
