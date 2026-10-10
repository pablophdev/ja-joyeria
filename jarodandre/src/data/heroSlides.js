import ringsImage from '../assets/hero/hero-3.jpg'
import necklacesImage from '../assets/hero/hero-2.jpg'
import { routes } from '../navigation/routes'

export const heroSlides = [
  {
    id: 'anillos',
    category: 'Anillos',
    title: 'Anillos - Colecciones 2026',
    description: 'Especialistas en alta joyería urbana. En JA hacemos anillos y grillz únicos. Los fabricamos con cuidado y con una dedicación total a la calidad y a los detalles perfectos.',
    image: ringsImage,
    imageAlt: 'Anillo plateado con una figura religiosa y piedras rojas',
    to: routes.shop,
    linkLabel: 'Ver productos',
  },
  {
    id: 'collares',
    category: 'Collares',
    title: 'Collares - Colecciones 2026',
    description: 'Estas piezas están hechas para llamar la atención. Creamos collares únicos que tienen un buen peso, terminaciones pulidas a mano y la actitud propia de la joyería urbana.',
    image: necklacesImage,
    imageAlt: 'Cadenas doradas y collar con un colgante de cruz',
    to: routes.shop,
    linkLabel: 'Ver productos',
  },
]
