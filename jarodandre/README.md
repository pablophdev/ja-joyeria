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

En el cambio 4 los datos se manejaban en memoria. El cambio 5 incorpora persistencia local
y suscripciones para actualizar la portada.
Los formularios de administración se incorporarán en su etapa correspondiente.

## Cambio 5 de 17

- `src/data/persistence.js`: lectura y escritura JSON mediante `localStorage`.
- `src/data/products.js`: restaura la colección en la primera consulta y guarda cada operación CRUD exitosa.
- `subscribeToProducts(listener)`: notifica los cambios del CRUD a los componentes de esta instancia de la aplicación y devuelve una función para cancelar la suscripción.
- `HomePage`: componente de clase que se suscribe al montar y cancela la suscripción al desmontar, también bajo `StrictMode`.
- `FeaturedProducts`: mensaje cuando el filtro seleccionado no tiene productos.

Los datos se almacenan en la clave `jarodandre.products`, con `version`, `nextId` y `products`.
Se conservan las eliminaciones, una colección vacía y el contador de IDs después de recargar.
Las imágenes incluidas en el proyecto se guardan como referencias estables y se resuelven a sus URLs actuales al cargar.
Las imágenes personalizadas conservan la URL proporcionada.

Si no hay datos guardados se utilizan los productos iniciales (ocho en el cambio 5, catorce desde el cambio 6); el primer cambio del CRUD guarda la colección.
Si el JSON o sus datos no son válidos, se usan los productos iniciales y se informa en la consola,
sin sobrescribir el almacenamiento durante la lectura. Una operación CRUD posterior guardará la colección válida.
Si una escritura falla por falta de espacio o permisos, el CRUD lanza un error y conserva el estado anterior.
No hay backend: los datos pertenecen al navegador y origen donde se ejecuta la aplicación.
La suscripción actual notifica cambios hechos en la misma instancia; otras pestañas recuperan los datos al recargar.

### Comprobación manual en desarrollo

Con `npm run dev`, abrir la portada y ejecutar en la consola del navegador
(para el servidor en `/`; si se configura otra base, anteponerla a la ruta del módulo):

```js
const productsDb = await import('/src/data/products.js')
const original = productsDb.getProductById(1)
productsDb.updateProduct(1, { price: 99000 })
// El precio cambia en la portada sin recargar y se conserva al recargar.
productsDb.updateProduct(1, { price: original.price })

const sample = productsDb.createProduct({
  name: 'Producto de demostración',
  price: 15000,
  image: original.image,
  featured: true,
})
// Aparece en la portada; al eliminarlo desaparece sin recargar.
productsDb.deleteProduct(sample.id)
```

Para comprobar la limpieza de suscripciones, navegar a Productos y volver al inicio;
repetir una actualización y verificar la portada. Los filtros conservan su selección al cambiar los datos.
No se agregaron hooks ni pruebas unitarias.

## Cambio 6 de 17

La ruta `/productos` muestra `ShopPage`, reemplazando su vista provisional.
El catálogo consulta todos los productos y se suscribe al CRUD con el mismo ciclo de montaje y limpieza que la portada.
Incluye navegación Inicio / Productos con `Link`, contador de productos, cuadrícula Bootstrap y estado vacío.

`ProductGrid` y `ProductCard` se reutilizan en inicio y catálogo. Los estilos de las imágenes
pertenecen ahora a `ProductCard.css`, para que la tarjeta funcione sin depender de los estilos del inicio.
En el catálogo se oculta el enlace «Ver catálogo» para evitar enlaces a la propia página.
La búsqueda y los filtros se incorporan en el cambio 7; los detalles y el carrito en sus etapas previstas.

Se incorporaron seis productos de `shop.html` con sus nombres, precios, etiquetas e imágenes originales.
La colección inicial reúne catorce productos únicos de inicio y tienda; ocho siguen siendo destacados.
Las seis imágenes adicionales se importan desde `src/assets/products/`.

### Actualización de los datos guardados

El almacenamiento pasa a la versión 2. Una colección guardada con versión 1 se amplía una sola vez
con los seis productos nuevos, asignando IDs desde su contador para conservar los productos creados por el usuario.
Se respetan las ediciones y eliminaciones anteriores. Una colección vaciada por completo permanece vacía.
La versión 2 se guarda al completar la ampliación, evitando duplicados al recargar.
Si el almacenamiento rechaza la actualización, se conserva la colección y versión anteriores y se reintenta al recargar.

### Revisión manual del cambio 6

1. Abrir `/productos` directamente y desde los enlaces del menú, hero y tarjetas de inicio.
2. Sin datos previos, comprobar catorce tarjetas y ocho destacados en la portada.
3. Revisar imágenes, precios en CLP y distribución en móvil, tableta y escritorio.
4. Actualizar un precio mediante el CRUD desde la consola: el catálogo debe reflejarlo sin recargar.
5. Navegar entre inicio y catálogo, y recargar para comprobar la persistencia.
6. Con datos guardados de la etapa anterior, comprobar que se agregan seis productos una sola vez y se mantienen los cambios existentes.

## Cambio 7 de 17

El catálogo incluye búsqueda por nombre, filtros combinables y ordenamiento.

- `CatalogFilters`: controles responsivos con etiquetas, búsqueda y botón para restablecer.
- `src/utils/catalogFilters.js`: opciones y lógica de filtrado y ordenamiento, sin modificar la colección original.
- `ShopPage`: mantiene los controles en estado de clase y calcula los resultados a partir de los productos actuales.

La búsqueda ignora mayúsculas, tildes y espacios sobrantes. Cada palabra debe aparecer en el nombre,
sin importar su orden: por ejemplo, «rosa oro» encuentra nombres que contienen «Oro Rosa».
Los filtros permiten elegir grupo (Todos, Nuevos, Populares), etiqueta (Todas, Nuevo, Oferta)
y precio en CLP (menos de $100.000, de $100.000 a $200.000 inclusive, o más de $200.000).
Los rangos de precio no se solapan.

Se puede ordenar por precio ascendente/descendente, nombre A–Z/Z–A o conservar el orden original.
El contador anuncia cuántos productos se muestran sobre el total. El estado sin coincidencias
se distingue del catálogo vacío. Restablecer limpia la búsqueda, los filtros y el ordenamiento.

Las actualizaciones del CRUD vuelven a calcular los resultados conservando los controles seleccionados.
Estos controles son estado local de la vista: al salir del catálogo o recargar vuelven a sus valores iniciales.
Los productos siguen persistiendo en `localStorage`.

### Revisión manual del cambio 7

1. Buscar `NACAR` y comprobar que aparece «Collar Flor de Nácar con Detalles Esmeralda».
2. Buscar `  rosa   oro  ` y comprobar las coincidencias con nombres que contienen ambas palabras.
3. Combinar Populares + Oferta + Menos de $100.000: con los datos iniciales aparece el anillo Halo Zafiro Azul.
4. Ordenar por precio y por nombre en ambos sentidos; restablecer y comprobar los catorce productos iniciales.
5. Buscar un texto inexistente y comprobar el contador y el mensaje sin resultados.
6. Con filtros activos, actualizar un producto mediante el CRUD: los resultados deben reflejar el cambio sin perder la selección.
7. Recorrer los controles con teclado y revisar la distribución en móvil y escritorio.

## Cambio 8 de 17

Ruta dinámica `/productos/:productId`, declarada en `src/navigation/`, para consultar cualquier producto del catálogo.
Las imágenes, nombres y botones «Ver detalle» de `ProductCard` utilizan `Link` y `getProductDetailsPath(id)`.
La ficha reutiliza `ProductRating` y el formateador de precios `formatPrice`.

`ProductDetailsRoute` es un adaptador mínimo que usa el hook de React Router `useParams` para pasar el ID
a `ProductDetailsPage`. El estado y la suscripción al CRUD permanecen en la clase de la página;
no se agregan hooks personalizados. Al cambiar el ID se remonta la ficha y se limpia la suscripción anterior.

Los textos de `shop-details.html`, `shop-details-2.html` y `shop-details-3.html` se conservan en
`src/data/productDetails.js` y se incorporan a los productos iniciales 3, 2 y 4 respectivamente.
Sus imágenes se reutilizan desde `src/assets/products/`.
La fuente de productos admite ahora campos opcionales de texto `description`, `category`, `tags`
y `availability`, además de `reviewCount` (entero no negativo, por defecto 0).
Estos campos pueden modificarse con `updateProduct` y se guardan mediante la persistencia existente.
Los registros guardados en las etapas anteriores se completan con los detalles originales cuando faltan;
sus precios, nombres y demás modificaciones se conservan. No se restaura ningún producto eliminado.

La vista muestra nombre, imagen, precio, valoración, descripción y datos disponibles, con diseño Bootstrap.
Los productos sin descripción o disponibilidad presentan mensajes de información pendiente.
Los IDs inválidos, inexistentes o eliminados muestran «Producto no encontrado» con un enlace al catálogo.
El precio y los detalles se actualizan cuando cambia el CRUD; eliminar el producto abierto muestra el estado no encontrado.
La incorporación de cantidades y la acción de añadir al carrito corresponden al cambio 9.

### Revisión manual del cambio 8

1. Abrir las tarjetas desde inicio y catálogo y comprobar la URL `/productos/ID`.
2. Visitar `/productos/2`, `/productos/3` y `/productos/4`: revisar los textos originales y las imágenes.
3. Visitar `/productos/1` y comprobar la ficha con información pendiente, sin inventar especificaciones.
4. Abrir `/productos/abc`, `/productos/0` y un ID inexistente: deben mostrar el estado no encontrado.
5. Recargar una ficha y comprobar que se conserva el acceso directo a la ruta.
6. Actualizar precio y descripción mediante el CRUD con una ficha abierta y comprobar la actualización.
7. Revisar los enlaces de regreso, el historial del navegador y la distribución en móvil y escritorio.

## Cambio 9 de 17

La ruta `/carrito` muestra `CartPage` con artículos, cantidades, subtotales y total en CLP.
Desde cada ficha se puede elegir la cantidad y añadir el producto al carrito.
Si ya existe, se suman las unidades en la misma línea. El enlace de cabecera muestra el total de unidades.

### Datos y componentes

- `src/data/cart.js`: `getCart`, `addToCart`, `updateCartQuantity`, `removeFromCart`, `clearCart` y `subscribeToCart`.
- `QuantityControl`: selector y botones de incremento/decremento compartidos entre ficha y carrito.
- `CartItem`: artículo del carrito, enlazado a su ficha mediante `Link`.
- `CartLink`: contador de unidades suscrito a los cambios del carrito.
- `CartPage`: vista responsiva con edición, eliminación, vaciado, resumen y estado vacío.

El carrito se guarda en `jarodandre.cart` con formato `{ version: 1, items: [{ productId, quantity }] }`.
Los nombres, imágenes, precios y disponibilidad se consultan desde la fuente actual de productos;
las actualizaciones del catálogo también notifican a los componentes del carrito.
`getCart()` devuelve las líneas con producto, disponibilidad y subtotal, además de `total` y `totalQuantity`.
La cantidad debe ser un entero entre 1 y 99 por producto; este límite de interfaz no representa inventario.

Un producto eliminado, o con disponibilidad `Agotado`, `Sin stock` o `No disponible` (sin distinguir mayúsculas),
no puede añadirse ni cambiar de cantidad. Si ya estaba en el carrito, se muestra para poder eliminarlo,
pero no aporta al total. El contador incluye todas las unidades guardadas, también las no disponibles.
Los productos sin información de disponibilidad pueden añadirse al carrito simulado.

Las escrituras se realizan antes de actualizar el estado; si fallan, la interfaz informa del error
y conserva los datos anteriores. Los datos inválidos guardados se ignoran sin sobrescribirlos durante la lectura.
Las suscripciones se cancelan al desmontar y la suscripción al catálogo se libera cuando no quedan consumidores del carrito.
La sincronización es dentro de la misma instancia de la aplicación; las otras pestañas recuperan el carrito al recargar.

Los totales corresponden a productos, sin envío ni descuentos. La confirmación y persistencia de pedidos
se implementarán en el cambio 10. No se agregan hooks ni pruebas unitarias en esta etapa.

### Revisión manual del cambio 9

1. Abrir `/productos/3`, seleccionar dos unidades y añadirlas. Comprobar el mensaje y el contador de cabecera.
2. Volver a añadir una unidad del mismo producto: debe quedar una sola línea con tres unidades.
3. Abrir `/carrito`, cambiar cantidades y comprobar subtotales y total. Recargar y comprobar persistencia.
4. Eliminar un artículo y vaciar el carrito; comprobar el estado vacío y «Seguir comprando».
5. Alcanzar el límite de 99 unidades y comprobar que no se puede superar al añadir más.
6. Actualizar el precio mediante el CRUD con el carrito abierto: el total debe recalcularse.
7. Marcar un producto como agotado o eliminarlo desde el CRUD: su línea queda no disponible y excluida del total.
8. Revisar controles con teclado y distribución en móvil y escritorio.

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
