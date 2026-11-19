import { allPages } from './api'
import { resolveImage } from './media'
export let blogPosts = []
export async function loadBlog() {
  blogPosts = (await allPages('catalog', '/v1/publicaciones', { authenticated: false })).map((item) => ({
    slug: item.slug, title: item.titulo, author: item.autorVisible, paragraphs: item.parrafos,
    image: resolveImage(item.portadaKey), date: item.publicadoEn,
  }))
}
export function getPublishedBlogPost(slug) { return blogPosts.find((post) => post.slug === slug) || null }
export function formatBlogDate(date) { return new Date(date).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }) }
