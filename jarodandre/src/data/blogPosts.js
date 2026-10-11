import blog1 from '../assets/blog/blog-1.jpg'
import blog2 from '../assets/blog/blog-2.jpg'
import blog3 from '../assets/blog/blog-3.jpg'
import blog4 from '../assets/blog/blog-4.jpg'
import blog5 from '../assets/blog/blog-5.jpg'
import blog6 from '../assets/blog/blog-6.jpg'
import blog7 from '../assets/blog/blog-7.jpg'
import blog8 from '../assets/blog/blog-8.jpg'
import blog9 from '../assets/blog/blog-9.jpg'

export const blogPosts = [
  {
    slug: 'como-limpiar-y-conservar-tus-joyas',
    title: 'Cómo limpiar y conservar el brillo de tus cadenas y anillos en casa',
    date: '2025-02-21',
    image: blog1,
    author: 'Equipo JA Joyerías',
    paragraphs: [
      'Tus joyas son una extensión de tu estilo, pero el uso diario, el sudor, los perfumes y cremas pueden ir opacando su brillo natural. No necesitas ser un experto ni tener maquinaria profesional para mantener tus cadenas y anillos relucientes. Con ingredientes simples que tienes en casa, puedes devolverles la vida.',
      'El primer consejo y el más efectivo es crear una solución suave. Mezcla agua tibia (no hirviendo) con unas gotas de jabón líquido para platos. Sumerge tus joyas de oro o plata por unos 15 a 20 minutos. Esto aflojará la suciedad acumulada en los eslabones de tus cadenas y en las grietas de tus anillos.',
      'Para la limpieza profunda, utiliza un cepillo de dientes de cerdas suaves. Cepilla con mucho cuidado, asegurándote de no aplicar demasiada fuerza para evitar micro rayaduras, especialmente en metales más maleables como el oro de 18k o la plata pura.',
      'Finalmente, enjuaga con agua limpia y seca inmediatamente con un paño de microfibra. Nunca uses toallas de papel, ya que sus fibras son abrasivas. Siguiendo esta rutina una vez al mes, tus piezas de JA Joyerías siempre se verán como recién salidas de la vitrina.',
    ],
  },
  {
    slug: 'oro-10k-14k-18k-cual-elegir',
    title: 'Oro 10k, 14k o 18k: Diferencias, resistencia y cuál elegir para tu joya',
    date: '2026-01-03',
    image: blog2,
    author: 'Equipo JA Joyerías',
    paragraphs: [
      'Al momento de invertir en una pieza de joyería, uno de los dilemas más comunes es elegir el quilataje adecuado. Entender qué significa "k" (quilate) es fundamental: el oro puro es de 24k, pero es demasiado blando para la joyería. Por lo tanto, se mezcla con otras aleaciones (como plata, cobre o zinc) para darle resistencia y durabilidad.',
      'El oro de 10k contiene un 41.7% de oro puro. Es la opción más resistente y económica, ideal para anillos de uso rudo o cadenas gruesas que podrían sufrir impactos. Por otro lado, el oro de 14k (58.3% oro) es el rey de la joyería moderna, ofreciendo el equilibrio perfecto entre un brillo excepcional, buena durabilidad y un precio accesible.',
      'Si buscas lujo y prestigio, el oro de 18k es la elección suprema. Con un 75% de pureza, posee un color amarillo rico y profundo que no se puede imitar. Sin embargo, requiere un trato más cuidadoso, ya que es más propenso a rayarse en comparación con el 10k o 14k, por lo que solemos recomendarlo para joyas de ocasiones especiales o anillos de compromiso.',
      'En JA Joyerías trabajamos con todas estas variaciones. Si tu pieza es un Grillz que estarás usando y retirando constantemente de tu boca, solemos recomendar 10k o 14k por la fricción y resistencia estructural que se necesita.',
    ],
  },
  {
    slug: 'impresion-dental-para-custom-grillz',
    title: 'Guía definitiva: Cómo tomar la impresión dental perfecta para tus custom grillz',
    date: '2026-03-15',
    image: blog3,
  },
  {
    slug: 'elegir-un-anillo-con-caracter',
    title: 'Cómo elegir un anillo con textura y carácter que combine con tu estilo',
    date: '2025-12-30',
    image: blog4,
  },
  {
    slug: 'control-de-calidad-de-nuestras-piezas',
    title: 'Del soplete a tu dedo: El riguroso proceso de control de calidad en cada una de nuestras piezas',
    date: '2026-05-05',
    image: blog5,
  },
  {
    slug: 'invertir-en-una-joya-de-alto-estandar',
    title: 'Piezas de vitrina: En qué fijarte antes de invertir en una joya de alto estándar',
    date: '2026-07-30',
    image: blog6,
  },
  {
    slug: 'mantener-el-brillo-de-tu-cadena-de-oro',
    title: 'El secreto para mantener el brillo impecable de tu cadena de oro todos los días',
    date: '2026-03-15',
    image: blog7,
  },
  {
    slug: 'higiene-y-cuidados-de-grillz',
    title: 'Uso responsable de grillz: Claves de higiene dental y cuidados esenciales para tu sonrisa',
    date: '2026-02-15',
    image: blog8,
  },
  {
    slug: 'crear-una-joya-personalizada',
    title: 'De tu idea a la realidad: El paso a paso para mandar a hacer una joya personalizada',
    date: '2026-08-28',
    image: blog9,
  },
]

const dateFormatter = new Intl.DateTimeFormat('es-CL', { dateStyle: 'long', timeZone: 'UTC' })

export function formatBlogDate(date) {
  return dateFormatter.format(new Date(`${date}T00:00:00Z`))
}

export function getPublishedBlogPost(slug) {
  return blogPosts.find((post) => post.slug === slug && post.paragraphs?.length)
}
