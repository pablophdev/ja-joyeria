import product1 from '../assets/products/product-1.jpg'
import product2 from '../assets/products/product-2.jpg'
import product3 from '../assets/products/product-3.jpg'
import product4 from '../assets/products/product-4.jpg'
import product5 from '../assets/products/product-5.jpg'
import product6 from '../assets/products/product-6.jpg'
import product7 from '../assets/products/product-7.jpg'
import product8 from '../assets/products/product-8.jpg'
import instagram1 from '../assets/instagram/instagram-1.jpg'
import instagram2 from '../assets/instagram/instagram-2.jpg'
import instagram3 from '../assets/instagram/instagram-3.jpg'
import instagram4 from '../assets/instagram/instagram-4.jpg'
import instagram5 from '../assets/instagram/instagram-5.jpg'
import instagram6 from '../assets/instagram/instagram-6.jpg'

export const collectionBanners = [
  { id: 'grillz', title: 'Grillz Colecciones 2026', video: 'jarod.mp4' },
  { id: 'anillos', title: 'Anillos', video: 'jarod2.mp4' },
  { id: 'collares', title: 'Cadenas y Collares', video: 'video2joya.mp4' },
]

export const productFilters = [
  { id: 'all', label: 'Top Productos' },
  { id: 'new', label: 'Nuevos' },
  { id: 'popular', label: 'Populares' },
]

// Datos de presentación; el CRUD y la persistencia se incorporan en las próximas etapas.
export const featuredProducts = [
  { id: 1, name: 'Grillz Custom Silver Star & Heart', price: 90990, image: product1, group: 'new', badge: 'Nuevo', rating: 0 },
  { id: 2, name: 'Grillz Flor y Media Luna Plata', price: 90990, image: product2, group: 'popular', rating: 0 },
  { id: 3, name: 'Cadena Eslabón Cubano Oro Rosa', price: 105990, image: product3, group: 'new', badge: 'Oferta', rating: 4 },
  { id: 4, name: 'Cadena Corona Real', price: 219990, image: product4, group: 'popular', rating: 0 },
  { id: 5, name: 'Collar Flor de Nácar con Detalles Esmeralda', price: 80000, image: product5, group: 'new', rating: 0 },
  { id: 6, name: 'Anillo Halo Zafiro Azul en Plata', price: 95990, image: product6, group: 'popular', badge: 'Oferta', rating: 4 },
  { id: 7, name: 'Anillo Solitario Doble Halo Circonias', price: 200990, image: product7, group: 'new', rating: 0 },
  { id: 8, name: 'Anillo Compromiso Oro Blanco y Rosa', price: 189990, image: product8, group: 'popular', rating: 0 },
]

export const instagramImages = [instagram1, instagram2, instagram3, instagram4, instagram5, instagram6]

export const socialLinks = [
  { label: 'Instagram', url: 'https://www.instagram.com/jarodandre_/' },
  { label: 'Facebook', url: 'https://www.facebook.com/' },
  { label: 'Pinterest', url: 'https://www.pinterest.com/' },
  { label: 'TikTok', url: 'https://www.tiktok.com/' },
]
