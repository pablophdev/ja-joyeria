# JA Joyería — React

Migración incremental del sitio HTML a React, en 17 commits. Proyecto creado con Vite.

## Desarrollo

```sh
npm install
npm run dev
```

Comprobaciones: `npm run lint` y `npm run build`. Para revisar la compilación: `npm run preview`.
Al desplegar, el alojamiento debe redirigir las rutas de la aplicación a `index.html` para admitir `BrowserRouter`.

## Estructura

- `src/navigation/`: rutas y configuración de React Router.
- `src/components/`: componentes reutilizables; cabecera, pie y layout compartido.
- `src/pages/`: vistas de las rutas.
- `src/data/`: contenido de la portada y fuente simulada de productos con funciones CRUD.
- `src/assets/`: recursos importados por los componentes, como el logo original.
- `public/`: archivos servidos directamente, como el favicon y los videos de `public/videos/`.

## Cambio 1 de 17

Base de navegación con `Link`, layout reutilizable, Bootstrap 5 y texto inicial de la portada.
Las rutas del menú muestran vistas temporales identificadas mientras se migran sus páginas.
La aplicación React no carga jQuery ni los scripts del sitio HTML.

## Cambio 2 de 17

Hero migrado con las imágenes y textos originales de Anillos y Collares.
`HeroCarousel` administra la diapositiva activa con estado de clase de React, sin hooks.
`HeroSlide` recibe los datos mediante props y usa `Link` para navegar a productos.
Las imágenes se importan desde `src/assets/hero/` y los textos están en `src/data/heroSlides.js`.

El carrusel tiene navegación circular manual, botones anterior/siguiente e indicadores.
Los controles funcionan con teclado (Tab y Enter/Espacio), anuncian la colección activa
y la animación respeta la preferencia de movimiento reducido. El diseño utiliza la rejilla de Bootstrap.

### Revisión manual

1. Abrir el inicio con `npm run dev` y comprobar la colección Anillos.
2. Avanzar a Collares y volver a Anillos; comprobar también el botón anterior y ambos indicadores.
3. Recorrer los controles con Tab y activarlos con Enter/Espacio.
4. Pulsar «Ver productos» y comprobar la navegación a `/productos` sin recargar.
5. Revisar el hero en móvil y escritorio, y con movimiento reducido habilitado.

## Cambio 3 de 17

Secciones de inicio migradas a componentes React:

- `CollectionBanners`: tres videos originales con reproducción en silencio, bucle, controles y diseño responsivo.
- `FeaturedProducts`: ocho productos originales y filtros Top Productos, Nuevos y Populares con estado de clase.
- `ProductCard`: tarjeta reutilizable con imagen, etiqueta, valoración y precio en pesos chilenos.
- `InstagramGallery`: seis imágenes originales y enlace al perfil de la tienda.
- Pie compartido con logo, navegación interna, redes sociales y `NewsletterForm` con validación nativa y respuesta de React.

Los videos se sirven desde `public/videos/`, respetando la URL base de Vite.
Las imágenes están en `src/assets/products/` y `src/assets/instagram/`.
Los datos de presentación están en `src/data/homeContent.js`.
Las tarjetas enlazan al catálogo provisional; los detalles y las compras se implementarán en sus etapas correspondientes.
El formulario de novedades es una demostración: valida el correo sin guardarlo ni realizar envíos.

### Revisión manual del cambio 3

1. Abrir el inicio y comprobar los tres videos, sus controles y las ocho tarjetas.
2. Seleccionar Nuevos y Populares: cada filtro debe mostrar cuatro productos; Top Productos restaura los ocho.
3. Recorrer los filtros con Tab y activarlos con Enter/Espacio.
4. Revisar las secciones en móvil, tableta y escritorio, sin desbordamiento horizontal.
5. Comprobar los enlaces al catálogo y el perfil de Instagram.
6. En el pie, enviar un correo vacío o inválido y luego uno válido; comprobar la validación y la respuesta de demostración sin recarga.

## Cambio 4 de 17

`src/data/products.js` centraliza los ocho productos migrados y las operaciones CRUD.
`HomePage` consulta `getFeaturedProducts()` para obtener los productos de portada.
`homeContent.js` conserva los banners, filtros, galería y redes sociales.

### Funciones disponibles

| Función | Resultado |
| --- | --- |
| `getProducts()` | Lista de todos los productos. |
| `getFeaturedProducts()` | Lista de productos con `featured: true`. |
| `getProductById(id)` | Producto encontrado o `null`. |
| `createProduct(data)` | Producto creado con ID automático. |
| `updateProduct(id, changes)` | Producto actualizado o `null` si no existe. |
| `deleteProduct(id)` | Producto eliminado o `null` si no existe. |

Las funciones son síncronas y devuelven copias. La colección interna no se exporta.
Los IDs son números enteros positivos, no editables, y no se reutilizan al eliminar registros.
Las entradas inválidas lanzan un `Error` con un mensaje en español sin modificar los datos.

Para crear un producto se requieren `name`, `price` e `image`.
El precio es un entero no negativo en CLP; los nombres y las imágenes deben ser cadenas no vacías.
Los campos opcionales son `group` (`new` por defecto, o `popular`), `badge` (`''`, `Nuevo` u `Oferta`),
`rating` (entero de 0 a 5, por defecto 0) y `featured` (booleano, por defecto `false`).
Solo se aceptan esos campos; la actualización es parcial y conserva el ID.

```js
import {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} from './data/products'
import image from './assets/products/product-1.jpg'

const product = createProduct({ name: 'Grillz personalizados', price: 99000, image })
const savedProduct = getProductById(product.id)
const updatedProduct = updateProduct(product.id, { price: 105000, featured: true })
const deletedProduct = deleteProduct(product.id)
```

Esta etapa trabaja en memoria: recargar la aplicación restaura los ocho productos iniciales.
La portada consulta los datos al renderizarse; todavía no se suscribe a cambios del CRUD.
La persistencia local y la actualización reactiva se incorporarán en el cambio 5.
Los formularios de administración se incorporarán en su etapa correspondiente.

## Secuencia propuesta

1. Base React, navegación y layout.
2. Hero con carrusel React y recursos originales de la portada.
3. Banners, videos y resto de secciones de inicio.
4. Fuente de datos JavaScript de productos y funciones CRUD.
5. Persistencia local e integración con la interfaz.
6. Catálogo y tarjetas de productos reutilizables.
7. Búsqueda, filtros y ordenamiento del catálogo.
8. Detalles de productos mediante rutas dinámicas.
9. Carrito y actualización de cantidades.
10. Pedidos con persistencia local.
11. Registro e inicio de sesión simulados.
12. Vistas de usuarios y formularios de edición.
13. Panel de administración y gestión de productos.
14. Sobre nosotros y contacto.
15. Blog y detalles de publicaciones.
16. Validaciones e interacciones de formularios.
17. Revisión final de navegación, recursos y diseño responsivo.

El alcance de cada etapa puede ajustarse según las siguientes instrucciones.
No hay backend ni pruebas unitarias. Los datos se gestionarán en JavaScript con persistencia local.
Owl Carousel requiere jQuery; el hero utiliza un carrusel propio de React para eliminar esa dependencia.
