import { sanitizeDescription } from '../utilidades/descriptionHtml'
import { allPages, observable, request } from './api'
import { imageKey, productImageOptions, resolveImage } from './media'

const events = observable()
let products = []
let categories = []
const availability = { DISPONIBLE: 'Disponible', AGOTADO: 'Agotado', CONSULTAR: 'Consultar disponibilidad' }
export const subscribeToProducts = events.subscribe
export const getProductImageOptions = productImageOptions
export function getProducts() { return [...products] }
export function getFeaturedProducts() { return products.filter((product) => product.featured) }
export function getProductById(id) { return products.find((product) => product.id === Number(id)) || null }

export function mapProduct(item) {
  return { id: item.id, name: item.nombre, price: item.precioClp, image: resolveImage(item.imagenKey),
    imageKey: item.imagenKey, category: item.categoria.slug, categoryId: item.categoria.id,
    description: item.descripcion, tags: item.etiquetas.join(', '), group: item.grupo,
    badge: item.insignia, featured: item.destacado, rating: item.valoracion,
    reviewCount: item.cantidadResenas, availability: availability[item.disponibilidad],
    availabilityCode: item.disponibilidad }
}

export async function loadProducts() {
  const [items, groups] = await Promise.all([
    allPages('catalog', '/v1/productos', { authenticated: false }, { page: 'pagina', size: 'tamano' }),
    request('catalog', '/v1/categorias', { authenticated: false }),
  ])
  products = items.map(mapProduct)
  categories = groups
  events.notify()
}

function payload(data) {
  const category = categories.find((item) => item.slug === data.category || item.nombre === data.category)
  if (!category) throw new Error('Selecciona una categoría del catálogo.')
  const code = Object.keys(availability).find((key) => availability[key].toLowerCase() === data.availability.toLowerCase())
  if (!code) throw new Error('Disponibilidad válida: Disponible, Agotado o Consultar disponibilidad.')
  return { categoriaId: category.id, nombre: data.name, descripcion: sanitizeDescription(data.description),
    precioClp: data.price, imagenKey: imageKey(data.image), etiquetas: data.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    grupo: data.group, insignia: data.badge, destacado: data.featured, valoracion: data.rating,
    cantidadResenas: data.reviewCount, disponibilidad: code }
}

export async function createProduct(data) {
  const product = mapProduct(await request('catalog', '/v1/admin/productos', { method: 'POST', body: payload(data) }))
  products = [...products, product]
  events.notify()
  return product
}
export async function updateProduct(id, data) {
  const product = mapProduct(await request('catalog', `/v1/admin/productos/${id}`, { method: 'PUT', body: payload(data) }))
  products = products.map((item) => item.id === id ? product : item)
  events.notify()
  return product
}
export async function deleteProduct(id) {
  await request('catalog', `/v1/admin/productos/${id}`, { method: 'DELETE' })
  products = products.filter((item) => item.id !== id)
  events.notify()
}
