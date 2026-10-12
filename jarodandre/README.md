# JA Joyería — React

Migración del sitio HTML a React, creada con Vite. Toda la lógica de datos se implementa
en JavaScript dentro de `src/data/`, con persistencia en `localStorage`.
No requiere servidor de backend, base de datos externa ni pruebas unitarias.

## Estado actual

- Inicio, catálogo de 14 productos iniciales, categorías, filtros y fichas dinámicas.
- Compra rápida desde las tarjetas de inicio y catálogo, además de compra desde la ficha.
- Carrito, checkout de entrega, pago simulado, resultado e historial por cuenta.
- Administración de productos con creación, edición y **eliminación persistente**.
- Administración de usuarios con creación, edición, roles, estados y eliminación.
- Órdenes, comprobantes imprimibles y reportes calculados con los registros locales.
- Estados de entrega editables: Pendiente, Enviado y Completado, independientes del pago.
- Nueve artículos completos del blog y descripciones para los 14 productos iniciales.
- Bandeja administrativa de contacto con búsqueda, filtro, lectura y eliminación.
- Newsletter con suscripción persistente, deduplicación de correos y bajas administrativas.

Las descripciones nuevas no establecen tallas, quilatajes ni existencias que no estaban
documentados. Los productos sin stock confirmado muestran «Consultar disponibilidad»;
la demo permite añadirlos al carrito, igual que antes.

### Acceso a administración

Registra una cuenta con un RUT válido y un correo `@duoc.cl` o `@profesor.duoc.cl`,
e inicia sesión para acceder al panel. Se conserva esta regla de la demo académica:
`isAdmin(user)` reconoce tanto el rol `admin` como esos dominios.
Solo las cuentas activas pueden iniciar sesión.

El listado muestra el rol asignado y señala el acceso por dominio cuando corresponde.
Las métricas de «Cuentas con perfil administrativo» usan el mismo criterio e incluyen
las cuentas de ese perfil aunque estén pendientes o inactivas; no representan sesiones activas.
Un administrador puede crear otras cuentas eligiendo rol y estado sin cambiar su sesión.
El registro público continúa creando clientes activos.

### Rutas administrativas

| Ruta | Función |
| --- | --- |
| `/admin` | Resumen y accesos de gestión. |
| `/admin/productos` | Consultar, buscar y eliminar productos. |
| `/admin/productos/nuevo` | Crear producto. |
| `/admin/productos/:productId/editar` | Editar producto. |
| `/usuarios` | Consultar y buscar cuentas. |
| `/usuarios/nuevo` | Crear cuenta con rol y estado. |
| `/usuarios/:userId/editar` | Editar o eliminar cuenta. |
| `/admin/ordenes` | Buscar pedidos, filtrar pago/entrega y guardar estado de entrega. |
| `/admin/ordenes/:orderId/boleta` | Consultar e imprimir orden o comprobante local. |
| `/admin/reportes` | Resumen de ventas y cuentas. |
| `/admin/mensajes` | Leer y administrar mensajes del formulario de contacto. |
| `/admin/suscriptores` | Buscar suscriptores y dar de baja correos. |

### Datos y persistencia actuales

| Clave de `localStorage` | Contenido |
| --- | --- |
| `jarodandre.products` | Catálogo, versión 5 y siguiente ID. |
| `jarodandre.auth` | Cuentas, credenciales derivadas y sesión local. |
| `jarodandre.cart` | Carrito, pedidos, pago y entrega. |
| `jarodandre.contactMessages` | Mensajes, fecha y estado de lectura. |
| `jarodandre.newsletter` | Correos normalizados y fecha de suscripción. |

- La migración de productos conserva ediciones, eliminaciones y catálogos vacíos.
  Completa descripciones, etiquetas y disponibilidad vacías únicamente cuando coinciden
  el ID y el nombre de un producto original. La versión 1 incorpora los seis productos
  adicionales usando IDs libres. No se restauran productos borrados de versiones 2–4.
- Eliminar un producto guarda primero la colección actualizada; si falla el almacenamiento,
  el producto permanece visible. Los pedidos conservan su copia histórica.
- `createUser()` exige sesión administrativa, valida duplicados y conserva la sesión actual.
- `updateOrderStatus()` exige sesión administrativa y pago realizado para enviar o completar.
  El nuevo estado aparece en el historial del cliente y en el comprobante.
- `getContactMessages()`, lectura/borrado de mensajes y consulta/baja de suscriptores
  requieren sesión administrativa. Los visitantes pueden enviar mensajes y suscribirse.
- Los mensajes anteriores se interpretan como no leídos. La newsletter acepta correos
  válidos de cualquier dominio y evita duplicados sin distinguir mayúsculas.
- Los cambios se notifican dentro de la misma instancia; otras pestañas los recuperan
  al recargar. Borrar los datos del sitio elimina la información local.

El checkout no realiza cobros, las boletas son comprobantes de demostración y los
formularios no envían correos. El envío, los cupones y el inventario numérico no están
implementados. No se incorporan servicios externos ni un backend real.

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

## Revisión manual de los flujos actuales

1. Registrar una cuenta Duoc válida e iniciar sesión; abrir Administración.
2. Crear un cliente desde Usuarios → Crear usuario. Comprobar rol, estado y mensaje
   de éxito; la cabecera debe conservar la sesión administrativa. Intentar repetir
   correo o RUT y comprobar que se rechaza sin crear una cuenta duplicada.
3. Crear un producto, editarlo y recargar. Añadirlo al carrito, eliminarlo del panel
   y recargar: debe seguir eliminado y el carrito debe permitir quitar la línea no disponible.
4. Añadir productos desde inicio y catálogo. Comprobar cantidades y contador del carrito;
   un producto agotado no debe poder añadirse.
5. Como cliente, completar un pago simulado. Como administrador, cambiar su entrega
   a Enviado y luego Completado. Recargar y volver a la cuenta del cliente: el historial
   debe conservar el estado y los importes. Una orden sin pago no permite envío.
6. Enviar un mensaje en Contacto. Abrir Mensajes, buscarlo, marcarlo como leído,
   recargar y eliminarlo. Revisar el filtro de mensajes sin leer.
7. Suscribirse desde el pie de página; repetir el correo usando mayúsculas y comprobar
   que no se duplica. Abrir Suscriptores, buscarlo, darlo de baja y recargar.
8. Abrir las 14 fichas iniciales y los nueve artículos: todos tienen contenido.
9. Cerrar sesión e intentar abrir rutas administrativas directamente: deben dirigir a login.
   Un cliente con correo Gmail debe volver al inicio si intenta acceder al panel.
10. Revisar los formularios con teclado y en móvil/escritorio; las tablas anchas disponen
    de desplazamiento horizontal. Comprobar estados vacíos y mensajes de error.

## Historial de la migración

Las etapas siguientes documentan estados anteriores del proyecto. Para el comportamiento
vigente, prevalecen las secciones «Estado actual» y «Datos y persistencia actuales».

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

## Cambio 10 de 17

El carrito permite confirmar un pedido simulado con nombre, correo, dirección y ciudad.
`CheckoutForm` valida los campos con controles HTML y la fuente de datos vuelve a validarlos antes de guardar.
La confirmación requiere un carrito no vacío y todos sus artículos disponibles.
Al terminar, se muestra el número de pedido y un enlace al historial, y el carrito y su contador quedan vacíos.

### Datos y persistencia

- `confirmOrder(customer)`, `getOrders()` y `subscribeToOrders(listener)` se exportan desde `src/data/cart.js`.
- `src/data/orderRecords.js` valida los registros, normaliza los datos de contacto y formatea los números de pedido.
- Cada pedido tiene ID incremental, fecha ISO, estado `Pendiente`, datos de contacto, artículos y total.
- Los artículos guardan una copia de ID, nombre, precio unitario, cantidad y subtotal al confirmar.
- Cambiar o eliminar productos del catálogo no modifica el historial.
- Las consultas devuelven copias de los pedidos y de sus objetos internos.

Carrito y pedidos comparten la clave `jarodandre.cart`, ahora con formato
`{ version: 2, items, orders, nextOrderId }`. La confirmación guarda el pedido y el vaciado del carrito
en una única llamada a `localStorage.setItem`, antes de modificar el estado en memoria.
Si falla la escritura, no se crea el pedido ni se vacía el carrito.
Las operaciones posteriores del carrito conservan los pedidos existentes.
El carrito de versión 1 se lee conservando sus artículos, con historial vacío y contador de pedidos en 1;
se escribe en versión 2 en la siguiente operación exitosa.

### Historial

`/pedidos` muestra `OrdersPage`, con enlace desde la cabecera y desde la confirmación del carrito.
Los pedidos aparecen del más reciente al más antiguo, con fecha, total y estado.
`OrderCard` permite desplegar el contacto, dirección y tabla de artículos mediante un control nativo accesible.
El historial se actualiza mediante suscripciones y se conserva al recargar.
El listado muestra los pedidos realmente confirmados en este navegador, sin los ejemplos ficticios de `orders.html`.
La administración y modificación de estados se incorporarán en su etapa correspondiente.

El flujo es local y simulado: no cobra, no envía correos y no realiza envíos.
Los registros pertenecen a este navegador; la asociación con usuarios se abordará con la sesión simulada.
No se agregaron hooks ni pruebas unitarias.

### Revisión manual del cambio 10

1. Añadir dos productos al carrito y completar los datos de contacto y entrega.
2. Confirmar y comprobar el número de pedido, el carrito vacío y el contador en cero.
3. Abrir `/pedidos`, desplegar el detalle y revisar cantidades, precios, dirección y total.
4. Recargar y comprobar que el pedido y el carrito vacío se conservan.
5. Cambiar o eliminar un producto mediante el CRUD: el pedido debe mantener los datos originales.
6. Intentar enviar el formulario vacío o con un correo inválido: no debe crearse un pedido.
7. Marcar un artículo del carrito como agotado: debe requerirse eliminarlo antes de confirmar.
8. Confirmar un segundo pedido y verificar que tiene un ID diferente y aparece primero.

## Cambio 11 de 17

Las rutas `/registro` y `/login` muestran formularios React mediante `AuthPage` y `AuthForm`.
Se migraron nombre, RUT, correo y confirmación, contraseña y confirmación, teléfono opcional,
región y comuna. Las tres regiones y sus comunas originales están en `registrationOptions.js`;
cambiar la región limpia la comuna seleccionada.

`src/data/auth.js` proporciona `registerUser`, `login`, `logout`, `getCurrentUser`, `getUsers`
y `subscribeToAuth`. Registro e inicio de sesión son asíncronos; los formularios bloquean envíos repetidos
y muestran los errores sin recargar la página. El registro termina con un enlace al inicio de sesión.
Al iniciar sesión, la cabecera muestra el nombre y la acción «Cerrar sesión».

### Validaciones y almacenamiento

- Nombre con letras y espacios, RUT con dígito verificador y teléfono opcional de 8 a 12 números.
- Correo normalizado sin distinguir mayúsculas. Se mantienen los dominios originales del registro:
  Gmail, Duoc y Profesor Duoc; cualquiera de ellos puede iniciar sesión.
- Correo y RUT únicos. Las confirmaciones deben coincidir.
- Contraseña de 6 a 128 caracteres; se conserva exactamente al comparar, sin recortar espacios.
- Región y comuna deben pertenecer a las opciones disponibles.

Usuarios, contador de IDs y sesión se guardan juntos en `jarodandre.auth`, versión 1.
La sesión se conserva al recargar; cerrar sesión conserva las cuentas y borra el usuario activo.
Las contraseñas se guardan como un derivado PBKDF2/SHA-256 con sal aleatoria por usuario,
no como texto. Se usa Web Crypto, disponible en localhost y HTTPS.
Las consultas públicas omiten la sal y el derivado de contraseña.
Las escrituras fallidas conservan los datos y la sesión anteriores.
Las cuentas registradas tienen rol `user`; el nombre ingresado no concede un rol de administrador.
Se trata de una simulación local, no de autenticación de servidor.

### Pedidos y sesión

Los nuevos pedidos guardan el ID del usuario activo, o `null` cuando se confirma como invitado.
La vista `/pedidos` muestra los pedidos de la sesión actual y se actualiza al iniciar o cerrar sesión.
Los pedidos anteriores se conservan como pedidos de invitado y pueden consultarse al cerrar sesión.
El carrito sigue siendo compartido por el navegador; iniciar o cerrar sesión no elimina sus artículos.
Los datos de contacto del pedido siguen completándose en el formulario de confirmación.
Las suscripciones de los componentes se cancelan al desmontarse, sin hooks nuevos.

### Revisión manual del cambio 11

1. Registrar una cuenta con RUT válido y una región/comuna del formulario; comprobar el mensaje de éxito.
2. Intentar registrar el mismo correo o RUT, o ingresar confirmaciones diferentes; comprobar los errores.
3. Iniciar sesión con el correo en mayúsculas y la contraseña correcta. Comprobar el saludo en la cabecera.
4. Recargar y comprobar la sesión; cerrar sesión y verificar que vuelven los enlaces de acceso.
5. Confirmar un pedido con una sesión activa y comprobarlo en `/pedidos`.
6. Cambiar de cuenta y comprobar que cada una muestra sus propios pedidos; salir para consultar los de invitado.
7. Revisar los campos y las comunas dependientes con teclado y en pantalla móvil.

## Cambio 12 de 17

Se migraron las vistas de usuarios y edición:

- `/usuarios`: listado de cuentas locales, búsqueda por nombre/RUT/correo y métricas calculadas desde los registros.
- `/usuarios/:userId/editar`: formulario de edición con datos actuales, cambio opcional de contraseña,
  rol, estado y eliminación de la cuenta.
- `UserProfileFields`: campos compartidos entre registro y edición, incluyendo región y comuna dependientes.
- `UserEditForm`: formulario responsivo con guardar, cancelar y eliminar.
- `UserEditRoute`: adaptador de `useParams`, siguiendo el patrón de los detalles de producto.

Las rutas y enlaces se mantienen en `navigation` y usan React Router. El enlace Usuarios está en la cabecera.
Las páginas manejan estado y suscripciones mediante clases y muestran estados vacíos o de usuario no encontrado.
El listado omite las credenciales internas y permite buscar RUT con o sin puntos y guion.
Las métricas sustituyen los valores ficticios del HTML por las cuentas realmente guardadas.

### Operaciones de usuarios

`src/data/auth.js` incorpora `getUserById(id)`, `updateUser(id, changes)` y `deleteUser(id)`.
La edición es parcial, conserva el ID y la fecha de registro, y rechaza campos no editables.
Se reutilizan las validaciones de perfil y se comprueban correos/RUT duplicados excluyendo la propia cuenta.
Dejar ambas contraseñas vacías conserva la actual; cambiarla genera una nueva sal y derivado PBKDF2.
Los cambios se guardan antes de notificar a los componentes. Si falla el almacenamiento, se conserva el estado anterior.

Los roles disponibles son Cliente (`user`), Empleado/Ventas (`employee`) y Administrador (`admin`).
Los estados son Activo (`active`), Pendiente (`pending`) e Inactivo/Bloqueado (`inactive`).
Solo las cuentas activas pueden iniciar sesión. Bloquear o eliminar la cuenta de la sesión actual la cierra.
Editar su nombre o correo actualiza la cabecera y el acceso; los pedidos conservan su ID de usuario e información histórica.
Eliminar una cuenta no elimina sus pedidos ni reutiliza su ID.

Las cuentas anteriores se leen como activas y sin fecha conocida; el listado muestra «Sin registro de fecha».
Las nuevas cuentas registran fecha ISO y siguen creándose como clientes activos.
Esta etapa ofrece gestión local de las cuentas del navegador; el panel de administración corresponde al cambio 13.

### Revisión manual del cambio 12

1. Registrar dos cuentas y abrir `/usuarios`: revisar métricas, búsqueda y enlaces de edición.
2. Cambiar nombre, correo, teléfono y comuna de una cuenta; recargar y comprobar persistencia.
3. Intentar usar el correo o RUT de la otra cuenta y comprobar el error sin cambios parciales.
4. Guardar sin contraseña nueva y verificar el acceso con la anterior; cambiarla y verificar que solo funciona la nueva.
5. Con una sesión activa, editar su nombre y comprobar la cabecera; bloquearla y comprobar el cierre de sesión.
6. Reactivar la cuenta y cambiar el rol; comprobar listado, métricas y persistencia al recargar.
7. Eliminar una cuenta y comprobar la vuelta al listado, sus métricas y el estado no encontrado de su antigua URL.
8. Revisar el registro original, los campos compartidos y la distribución en móvil y escritorio.

## Cambio 13 de 17

Panel de administración y gestión de productos conectado a las fuentes de datos existentes.

### Rutas

- `/admin`: resumen con cantidades reales de productos, destacados, usuarios y cuentas activas.
- `/admin/productos`: listado con búsqueda por nombre y acciones para ver, editar y eliminar.
- `/admin/productos/nuevo`: formulario para crear un producto.
- `/admin/productos/:productId/editar`: edición de un producto existente.

Las rutas anidadas usan `AdminLayout`, con navegación mediante `Link` y contenido mediante `Outlet`.
La cabecera incorpora el enlace Administración; el panel enlaza también a usuarios, tienda y pedidos de la sesión.
Se mantiene el modelo de gestión local del navegador de la etapa anterior.

### Componentes y datos

`ProductForm` se comparte entre creación y edición. Permite modificar nombre, precio en CLP, categoría,
etiquetas, disponibilidad, grupo, promoción, valoración, reseñas, descripción, imagen y visibilidad en destacados.
Los campos numéricos se convierten antes de llamar al CRUD y sus validaciones se mantienen en la fuente de datos.
El formulario informa errores de validación y de almacenamiento sin perder los valores ingresados.
Los productos nuevos reciben su ID desde `createProduct`; editar conserva el ID.

`getProductImageOptions()` ofrece las catorce imágenes originales importadas desde `src/assets/products/`.
También se puede indicar una URL o ruta de imagen pública. `ProductImagePreview` muestra la imagen o un error de carga.
No se almacenan archivos nuevos: las imágenes del proyecto mantienen sus referencias estables al persistir.
La disponibilidad admite las opciones En stock y Agotado, además de texto personalizado.

`AdminProductsPage` y `AdminPage` se suscriben a sus fuentes de datos y liberan las suscripciones al desmontarse.
El editor usa el adaptador de `useParams` existente como patrón y maneja el formulario mediante una clase.
Crear, editar o eliminar se refleja en catálogo, portada, ficha y carrito mediante suscripciones;
los pedidos ya confirmados conservan su copia histórica.
Los IDs inválidos o eliminados muestran el estado Producto no encontrado.

### Revisión manual del cambio 13

1. Abrir Administración desde la cabecera y revisar las métricas y enlaces del panel.
2. Crear un producto con imagen, precio y descripción; activar Destacado y comprobar su ficha y aparición en inicio.
3. Editarlo, cambiar precio/disponibilidad y desactivar Destacado; revisar catálogo, ficha, portada y carrito.
4. Recargar para comprobar que los cambios se conservan.
5. Buscar por nombre en la gestión de productos y usar los enlaces Ver y Editar.
6. Introducir un precio negativo o una valoración fuera de 0–5 y comprobar el rechazo del dato.
7. Eliminar un producto, comprobar el listado y visitar su URL anterior: debe mostrarse el estado no encontrado.
8. Revisar el formulario en móvil y escritorio, incluyendo selección y vista previa de imágenes.

## Cambio 14 de 17

Las rutas `/nosotros` y `/contacto` sustituyen sus vistas provisionales por `AboutPage` y `ContactPage`.
Comparten `PageHeading`, con título y navegación Inicio / Página mediante `Link`.

### Sobre nosotros

Se conservan la imagen original, los textos de Quiénes somos, Qué hacemos y Por qué elegirnos,
y las cuatro cifras de presentación de `about.html`. Estas cifras son contenido del sitio original,
no métricas calculadas a partir de las cuentas o productos de la simulación.
`CompanyStats` recibe sus valores por props; `companyContent.js` concentra los textos y datos de la empresa.
La imagen se importa desde `src/assets/about/about-us.jpg`.
La vista incorpora enlaces al catálogo y a contacto, con distribución Bootstrap responsiva.

### Contacto

Se conservan Santiago, Chile y los dos teléfonos del HTML, con enlaces `tel:` para llamar.
`ContactForm` usa estado de clase para nombre, correo y mensaje, sin manipulación directa del DOM.
Valida nombre con letras y espacios, correo válido y mensaje no vacío, con límites de longitud.
El contador muestra los caracteres del mensaje; los errores y confirmaciones se anuncian mediante roles accesibles.

`saveContactMessage(data)` y `getContactMessages()` están en `src/data/contactMessages.js`.
Los mensajes se guardan en `jarodandre.contactMessages` con versión, contador de IDs, contenido y fecha ISO.
Se normalizan los datos y se devuelven copias. Un fallo al guardar conserva el contenido del formulario
y no modifica los mensajes en memoria. Después de un guardado exitoso se limpia el formulario.
El texto de confirmación indica que el mensaje se guardó localmente: no se envían correos ni solicitudes a un backend.
No se agregaron hooks ni pruebas unitarias.

### Revisión manual del cambio 14

1. Abrir Sobre nosotros desde el menú y comprobar imagen, textos, cifras y enlaces.
2. Abrir Contacto desde menú, pie de página y ficha de producto; revisar los teléfonos y sus enlaces.
3. Completar el formulario y comprobar la confirmación local y la limpieza de campos.
4. Intentar guardar un nombre con números, correo inválido o mensaje compuesto solo de espacios.
5. Con `npm run dev`, consultar `getContactMessages()` importando `/src/data/contactMessages.js` en la consola;
   recargar y comprobar que se conserva el mensaje.
6. Revisar ambas vistas en móvil y escritorio, y recorrer el formulario con teclado.

## Secuencia original propuesta

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

No hay backend real ni pruebas unitarias. Los datos se gestionan en JavaScript con persistencia local.
Owl Carousel requiere jQuery; el hero utiliza un carrusel propio de React para eliminar esa dependencia.
