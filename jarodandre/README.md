# Jarodandre · Guía técnica del frontend

La [guía principal](../README.md) contiene la instalación, las credenciales de desarrollo y el uso de Docker. Esta carpeta contiene la aplicación React y su compilación de producción.

## Organización

```text
src/
├── componentes/     # Formularios y componentes de tienda y administración
├── datos/           # Cliente HTTP, adaptadores de DTO y estado en memoria
├── navigation/      # Rutas y guard de administración
├── paginas/         # Vistas públicas y administrativas
├── utilidades/      # Formateo, validación, animaciones y sanitización
├── test/            # Pruebas Vitest y Testing Library
├── assets/          # Imágenes iniciales y recursos importados
├── main.jsx         # Inicio y carga de la conexión al backend
└── index.css        # Estilos compartidos
```

`public/` contiene recursos estáticos como videos e iconos. Vite genera `dist/`. El Dockerfile compila con Node.js 24 y copia el resultado a Nginx, cuya configuración está en `nginx.conf`.

## Servicios y contratos

| Módulo en `src/datos` | API responsable | Uso |
| --- | --- | --- |
| `auth.js` | Auth | Registro, login, perfil, territorios y gestión de usuarios. |
| `products.js`, `media.js` | Catálogo | Productos, categorías, imágenes y operaciones administrativas. |
| `blogPosts.js` | Catálogo | Artículos publicados y sus párrafos. |
| `cart.js`, `orderRecords.js` | Pedidos | Carrito, entrega, pago simulado, historial y despacho. |
| `contactMessages.js` | Comunicaciones | Envío, lectura y eliminación de mensajes. |
| `newsletter.js` | Comunicaciones | Alta, listado y baja de suscripciones. |

`api.js` aplica un tiempo máximo de solicitud, transforma errores de las APIs en mensajes y agrega el JWT cuando corresponde. La paginación de catálogo y comunicaciones usa `pagina` y `tamano`; usuarios y pedidos usan `page` y `size`.

`ConexionBackend` resuelve la identidad antes de mostrar las rutas. Carga el catálogo y blog, recupera el carrito y el historial y, para administradores, carga mensajes y suscriptores. Las vistas reciben snapshots en memoria y se suscriben a los cambios de los módulos.

## Autenticación y compra

El registro llama a `POST /v1/auth/registro` y el login a `POST /v1/auth/login`. El backend devuelve `accessToken`, `expiresIn` y `usuario`. El cliente conserva la sesión en `sessionStorage`, restaura el perfil desde `/v1/me` y elimina la sesión al vencer. Las rutas administrativas comprueban rol y estado antes de mostrar las vistas, y cada API valida los permisos en el servidor.

El carrito invitado usa `X-Carrito-Token`. Cada checkout envía un UUID en `Idempotency-Key`. Para consultar una compra de invitado se utiliza `X-Pedido-Token`. El frontend conserva esos tokens y la clave del checkout para recuperar respuestas y reintentar operaciones. Al iniciar sesión intenta vincular las compras resueltas mediante el token privado y la coincidencia del correo del perfil.

Los importes se expresan en pesos chilenos enteros. Pedidos consulta catálogo y calcula el total; el cliente envía el total que mostró para detectar cambios antes de crear la orden. El botón de pago del entorno local usa el simulador del backend.

## GSAP

`motion.js` centraliza entradas del carrusel, grillas con ScrollTrigger, hover de productos, feedback del carrito, transiciones del checkout y resultado del pago. Los componentes integran sus efectos mediante `@gsap/react` y sus funciones de limpieza.

`scrollReveal.js` observa los elementos con `data-reveal` y anima su entrada mediante GSAP. También registra elementos añadidos por React y libera observaciones al retirarlos. `main.jsx` elimina sus recursos cuando Vite reemplaza el módulo. Ambos mecanismos respetan el movimiento reducido configurado por el usuario.

## TipTap y DOMPurify

`componentes/administracion/EditorDescripcion.jsx` es un editor controlado por `values.description` en el formulario de productos. Se carga de forma diferida con React `lazy`. StarterKit ofrece el formato visible en la barra y el historial de edición. Los cambios externos del producto se sincronizan sin emitir una nueva edición.

`utilidades/descriptionHtml.js` convierte el texto simple anterior en párrafos y limpia el HTML con DOMPurify. Permite `p`, `br`, `strong`, `b`, `em`, `i`, `ul`, `ol`, `li`, `h3` y `h4`, con atributos deshabilitados. Se aplica en el editor, al construir el DTO del producto y al mostrar la descripción en la ficha. El backend conserva esa cadena en su columna de descripción.

## Desarrollo y compilación

```powershell
npm ci
npm run dev -- --port 5173 --strictPort
npm run lint
npm run build
npm run test -- --run
```

Las direcciones se configuran con `VITE_AUTH_URL`, `VITE_CATALOGO_URL`, `VITE_PEDIDOS_URL`, `VITE_COMUNICACIONES_URL` y, opcionalmente, `VITE_MEDIA_URL`. Después de modificar un archivo `.env` hay que reiniciar Vite. Para cambiar la configuración de una imagen ya compilada, reconstruir el frontend.

Las pruebas de sanitización comprueban etiquetas permitidas, contenido ejecutable y texto anterior. Las de TipTap comprueban carga y sincronización del contenido. La suite también incluye pruebas de animaciones, contratos HTTP y componentes de la tienda.
