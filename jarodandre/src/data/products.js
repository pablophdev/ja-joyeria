import product1 from '../assets/products/product-1.jpg'
import product2 from '../assets/products/product-2.jpg'
import product3 from '../assets/products/product-3.jpg'
import product4 from '../assets/products/product-4.jpg'
import product5 from '../assets/products/product-5.jpg'
import product6 from '../assets/products/product-6.jpg'
import product7 from '../assets/products/product-7.jpg'
import product8 from '../assets/products/product-8.jpg'
import product9 from '../assets/products/product-9.jpg'
import product10 from '../assets/products/product-10.jpg'
import product11 from '../assets/products/product-11.jpg'
import product12 from '../assets/products/product-12.jpg'
import product13 from '../assets/products/product-13.jpg'
import product14 from '../assets/products/product-14.jpg'
import { readStoredData, writeStoredData } from './persistence'
import { initialProductDetails } from './productDetails'

// Base simulada, restaurada desde localStorage en la primera consulta.
// Solo las funciones de este módulo pueden modificar la colección.
let products = [
  { id: 1, name: 'Grillz Custom Silver Star & Heart', price: 90990, image: product1, group: 'new', badge: 'Nuevo', rating: 0, featured: true },
  { id: 2, name: 'Grillz Flor y Media Luna Plata', price: 90990, image: product2, group: 'popular', badge: '', rating: 0, featured: true },
  { id: 3, name: 'Cadena Eslabón Cubano Oro Rosa', price: 105990, image: product3, group: 'new', badge: 'Oferta', rating: 4, featured: true },
  { id: 4, name: 'Cadena Corona Real', price: 219990, image: product4, group: 'popular', badge: '', rating: 0, featured: true },
  { id: 5, name: 'Collar Flor de Nácar con Detalles Esmeralda', price: 80000, image: product5, group: 'new', badge: '', rating: 0, featured: true },
  { id: 6, name: 'Anillo Halo Zafiro Azul en Plata', price: 95990, image: product6, group: 'popular', badge: 'Oferta', rating: 4, featured: true },
  { id: 7, name: 'Anillo Solitario Doble Halo Circonias', price: 200990, image: product7, group: 'new', badge: '', rating: 0, featured: true },
  { id: 8, name: 'Anillo Compromiso Oro Blanco y Rosa', price: 189990, image: product8, group: 'popular', badge: '', rating: 0, featured: true },
  { id: 9, name: 'Grillz Set Completo Chrome Black & Silver (8 Piezas)', price: 180990, image: product9, group: 'new', badge: '', rating: 0, featured: false },
  { id: 10, name: 'Grillz Duo Colmillos Plateados', price: 90990, image: product10, group: 'new', badge: 'Oferta', rating: 4, featured: false },
  { id: 11, name: 'Grillz Custom Dos Dientes Estilo tribal / Wave', price: 60990, image: product11, group: 'new', badge: '', rating: 0, featured: false },
  { id: 12, name: 'Anillo Solitario Oro Rosa con Circonia Corte Brillante', price: 150990, image: product12, group: 'new', badge: 'Oferta', rating: 4, featured: false },
  { id: 13, name: 'Sello San Benito Oro Laminado 18K', price: 210990, image: product13, group: 'new', badge: '', rating: 0, featured: false },
  { id: 14, name: 'Anillo Signet Oro con Piedra Onix Negra y Circones', price: 230990, image: product14, group: 'new', badge: '', rating: 0, featured: false },
].map((product) => ({ ...product, ...normalizeProduct({ ...initialProductDetails[product.id], ...product }) }))

const catalogAdditions = products.slice(8)
let nextId = Math.max(...products.map((product) => product.id)) + 1
let initialized = false
const listeners = new Set()
const storageKey = 'jarodandre.products'
const storageVersion = 2
let currentStorageVersion = storageVersion

// Guardar referencias estables evita persistir las URLs con hash generadas por Vite.
const productImages = Object.fromEntries(products.map((product) => [`asset:product-${product.id}`, product.image]))

export function getProductImageOptions() {
  return Object.entries(productImages).map(([reference, image]) => ({ image, label: `Imagen ${reference.replace('asset:product-', '')}` }))
}

function serializeImage(image) {
  return Object.entries(productImages).find(([, url]) => url === image)?.[0] ?? image
}

function restoreImage(image) {
  if (typeof image === 'string' && image.startsWith('asset:')) {
    if (!Object.hasOwn(productImages, image)) throw new Error('La referencia de imagen no existe.')
    return productImages[image]
  }
  return image
}

function initializeProducts() {
  if (initialized) return
  initialized = true
  const stored = readStoredData(storageKey)
  if (stored === null) return

  try {
    if (![1, storageVersion].includes(stored.version) || !Array.isArray(stored.products)) {
      throw new Error('El formato de los productos guardados no es compatible.')
    }

    const ids = new Set()
    const restoredProducts = stored.products.map((product) => {
      validateId(product.id)
      if (ids.has(product.id)) throw new Error('Hay IDs de productos duplicados.')
      ids.add(product.id)
      const { id, ...values } = product
      validateInput(values)
      return { id, ...normalizeProduct({ ...initialProductDetails[id], ...values, image: restoreImage(values.image) }) }
    })

    validateId(stored.nextId)
    if (restoredProducts.some((product) => product.id >= stored.nextId)) {
      throw new Error('El siguiente ID de producto no es válido.')
    }

    products = restoredProducts
    nextId = stored.nextId
    currentStorageVersion = stored.version

    if (stored.version === 1) {
      // Respetar una colección vaciada y asignar IDs nuevos sin pisar productos creados por el usuario.
      const additions = products.length ? catalogAdditions.map((product, index) => ({ ...product, id: nextId + index })) : []
      try {
        validateId(nextId + additions.length)
        saveProducts([...products, ...additions], nextId + additions.length, storageVersion)
      } catch (error) {
        console.warn('No se pudo ampliar el catálogo guardado. Se conserva la colección anterior.', error)
      }
    }
  } catch (error) {
    // No sobrescribir el contenido inválido durante la lectura.
    console.warn('Los productos guardados no son válidos. Se usarán los datos iniciales.', error)
  }
}

function saveProducts(updatedProducts, updatedNextId = nextId, version = currentStorageVersion) {
  // Persistir primero: si el navegador rechaza la escritura, no cambia la colección.
  writeStoredData(storageKey, {
    version,
    nextId: updatedNextId,
    products: updatedProducts.map((product) => ({ ...product, image: serializeImage(product.image) })),
  })
  products = updatedProducts
  nextId = updatedNextId
  currentStorageVersion = version

  for (const listener of listeners) {
    try {
      listener()
    } catch (error) {
      console.error('No se pudo actualizar un componente suscrito a los productos.', error)
    }
  }
}

// Cada componente debe cancelar su suscripción al desmontarse.
export function subscribeToProducts(listener) {
  if (typeof listener !== 'function') throw new Error('La suscripción debe recibir una función.')
  initializeProducts()
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const editableFields = ['name', 'price', 'image', 'group', 'badge', 'rating', 'featured', 'description', 'category', 'tags', 'availability', 'reviewCount']

function validateId(id) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error('El ID del producto debe ser un entero positivo.')
  }
}

function validateInput(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Los datos del producto deben ser un objeto.')
  }

  for (const field of Object.keys(data)) {
    if (!editableFields.includes(field)) {
      throw new Error(`El campo "${field}" no se puede asignar. El ID se genera automáticamente.`)
    }
  }
}

function normalizeProduct(data) {
  const { description = '', category = '', tags = '', availability = '', reviewCount = 0 } = data
  if (typeof data.name !== 'string' || !data.name.trim()) {
    throw new Error('El nombre del producto es obligatorio.')
  }

  if (!Number.isSafeInteger(data.price) || data.price < 0) {
    throw new Error('El precio debe ser un entero mayor o igual a cero, en pesos chilenos.')
  }

  if (typeof data.image !== 'string' || !data.image.trim()) {
    throw new Error('La imagen del producto es obligatoria.')
  }

  if (!['new', 'popular'].includes(data.group)) {
    throw new Error('El grupo debe ser "new" o "popular".')
  }

  if (!['', 'Nuevo', 'Oferta'].includes(data.badge)) {
    throw new Error('La etiqueta debe ser "Nuevo", "Oferta" o una cadena vacía.')
  }

  if (!Number.isInteger(data.rating) || data.rating < 0 || data.rating > 5) {
    throw new Error('La valoración debe ser un entero entre 0 y 5.')
  }

  if (typeof data.featured !== 'boolean') {
    throw new Error('El indicador de producto destacado debe ser booleano.')
  }

  if (![description, category, tags, availability].every((value) => typeof value === 'string')) {
    throw new Error('La descripción, categoría, etiquetas y disponibilidad deben ser textos.')
  }

  if (!Number.isSafeInteger(reviewCount) || reviewCount < 0) {
    throw new Error('La cantidad de reseñas debe ser un entero mayor o igual a cero.')
  }

  return {
    name: data.name.trim(),
    price: data.price,
    image: data.image.trim(),
    group: data.group,
    badge: data.badge,
    rating: data.rating,
    featured: data.featured,
    description: description.trim(),
    category: category.trim(),
    tags: tags.trim(),
    availability: availability.trim(),
    reviewCount,
  }
}

// Se devuelven copias: modificar un resultado no altera la base simulada.
export function getProducts() {
  initializeProducts()
  return products.map((product) => ({ ...product }))
}

export function getFeaturedProducts() {
  return getProducts().filter((product) => product.featured)
}

export function getProductById(id) {
  initializeProducts()
  validateId(id)
  const product = products.find((item) => item.id === id)
  return product ? { ...product } : null
}

export function createProduct(data) {
  initializeProducts()
  validateInput(data)
  const values = normalizeProduct({
    group: 'new',
    badge: '',
    rating: 0,
    featured: false,
    ...data,
  })
  if (nextId >= Number.MAX_SAFE_INTEGER) throw new Error('No hay más IDs de producto disponibles.')
  const product = { id: nextId, ...values }
  saveProducts([...products, product], nextId + 1)
  return { ...product }
}

export function updateProduct(id, changes) {
  initializeProducts()
  validateId(id)
  validateInput(changes)
  const index = products.findIndex((product) => product.id === id)

  if (index === -1) return null

  // Validar antes de reemplazar evita actualizaciones parciales ante un error.
  const values = normalizeProduct({ ...products[index], ...changes })
  const updatedProduct = { id, ...values }
  saveProducts(products.map((product) => product.id === id ? updatedProduct : product))
  return { ...updatedProduct }
}

export function deleteProduct(id) {
  initializeProducts()
  validateId(id)
  const product = products.find((item) => item.id === id)

  if (!product) return null

  saveProducts(products.filter((item) => item.id !== id))
  return { ...product }
}
