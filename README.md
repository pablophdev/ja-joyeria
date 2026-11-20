# Jarodandre: tienda en React

Este repositorio contiene la página de JA Joyería. Desde aquí se muestra el catálogo, se realizan las compras y se accede a la administración. Los datos de usuarios, productos, pedidos y mensajes se guardan en el backend, en MySQL.

## Cómo se conecta la tienda

La web está hecha con React y se comunica con cuatro servicios Spring Boot: autenticación, catálogo, pedidos y comunicaciones. En el modo Docker, Nginx sirve la web y reenvía las solicitudes a cada servicio. Nginx también permite abrir directamente una página como `/productos/3` y recargar el navegador sin perder la ruta.

```mermaid
flowchart LR
    Persona --> Web[React y Nginx]
    Web --> Auth[ms-auth]
    Web --> Catalogo[ms-catalogo]
    Web --> Pedidos[ms-pedidos]
    Web --> Comunicaciones[ms-comunicaciones]
    Pedidos --> Catalogo
    Catalogo --> Auth
    Pedidos --> Auth
    Comunicaciones --> Auth
```

La guía para iniciar la base y los servicios está en el [README del backend](https://github.com/pablophdev/jarodandre-backend#jarodandre-backend-y-gu%C3%ADa-para-ejecutarlo).

## Qué puedes hacer

- Ver productos, buscar por nombre, filtrar categorías y revisar los detalles.
- Crear una cuenta o iniciar sesión.
- Añadir productos al carrito y completar una compra de prueba, como invitado o con una cuenta.
- Consultar pedidos, comprobantes y estado de entrega.
- Usar la administración para gestionar productos, usuarios, pedidos, mensajes y suscripciones.
- Leer artículos del blog, enviar una consulta y registrarte para recibir novedades.
- Publicar una reseña de un producto después de pagarlo. El administrador no asigna estrellas ni reseñas: el cliente elige su valoración desde la ficha del producto.

En este entorno los pagos son simulados y el inventario utiliza la disponibilidad indicada para cada producto.

## Tecnologías principales

| Herramienta | Uso en la tienda |
| --- | --- |
| React, React Router y Vite | Pantallas, navegación y desarrollo local. |
| Bootstrap y CSS | Estilos y presentación adaptable a distintos tamaños. |
| GSAP | Animaciones de la tienda. |
| TipTap | Editor de texto enriquecido para descripciones de productos. |
| DOMPurify | Limpia el HTML de las descripciones antes de mostrarlo. |
| Docker y Nginx | Sirven la versión de producción local y conectan la web con las APIs. |

## Iniciar toda la tienda

Necesitas Docker Desktop con el motor Linux activo y Docker Compose v2. Clona este repositorio junto al backend y ejecuta Compose desde la carpeta `jarodandre-backend`:

```powershell
git clone https://github.com/pablophdev/ja-joyeria.git
git clone https://github.com/pablophdev/jarodandre-backend.git
cd jarodandre-backend
docker compose up -d --build
docker compose ps
```

Cuando los servicios estén listos, abre [http://localhost:5173](http://localhost:5173). Para detenerlos y conservar tus datos:

```powershell
docker compose down
```

La cuenta administrativa local es `admin@jarodandre.local` y su contraseña es `Admin123123`. MySQL está disponible desde tu equipo en `127.0.0.1:3307`, con usuario `ja` y contraseña `123123`. Estas cuentas son solo para desarrollo.

Después de editar el frontend, puedes volver a construirlo desde la carpeta del backend:

```powershell
docker compose up -d --build frontend
```

## Trabajar en el frontend con Vite

Para usar el servidor de desarrollo necesitas Node.js 24 y npm. Primero inicia MySQL y los cuatro servicios siguiendo la guía del backend. Después, desde este repositorio:

```powershell
cd jarodandre
npm ci
npm run dev -- --port 5173 --strictPort
```

Abre `http://localhost:5173`. Si cambian las direcciones de las APIs, copia `.env.example` a `.env.local`, ajusta sus valores y reinicia Vite.

| Variable | Dirección local habitual |
| --- | --- |
| `VITE_AUTH_URL` | `http://localhost:8081` |
| `VITE_CATALOGO_URL` | `http://localhost:8082` |
| `VITE_PEDIDOS_URL` | `http://localhost:8083` |
| `VITE_COMUNICACIONES_URL` | `http://localhost:8084` |
| `VITE_MEDIA_URL` | Opcional. Por defecto usa el servicio de catálogo. |

Las variables que comienzan con `VITE_` se incluyen en los archivos web. No pongas contraseñas ni claves privadas en ellas.

## Reseñas, descripciones y animaciones

En la ficha de un producto aparecen las reseñas de clientes. Para publicar o actualizar una, la persona debe iniciar sesión con la cuenta asociada a una compra pagada del producto. El backend valida la compra y calcula el promedio que se muestra en la tienda.

El formulario de administración permite elegir una categoría existente de la lista. Las reseñas y estrellas se gestionan desde la ficha por los compradores.

El editor TipTap se usa para escribir las descripciones. DOMPurify limpia el HTML antes de guardarlo y volver a mostrarlo, conservando el formato permitido. GSAP anima elementos de la tienda y respeta la preferencia del sistema para reducir el movimiento.

## Dónde vive cada parte del frontend

| Carpeta | Qué contiene |
| --- | --- |
| `src/componentes` | Piezas reutilizables de las páginas, como formularios, tarjetas y navegación. |
| `src/paginas` | Pantallas completas de la tienda. |
| `src/datos` | Solicitudes al backend y adaptación de sus respuestas para la web. |
| `src/utilidades` | Funciones compartidas, como formato, limpieza de HTML y animaciones. |
| `public` y `src/assets` | Iconos e imágenes de la tienda. |

El navegador guarda la sesión y algunos tokens temporales de compras de invitado. Los productos, cuentas, pedidos, mensajes y suscripciones se guardan en el backend.

## Comprobar cambios

Desde la carpeta `jarodandre`, puedes revisar el código y crear la versión lista para servir así:

```powershell
npm run lint
npm run build
npm run test -- --run
```

`npm run preview` permite abrir la compilación de prueba. Para probar la misma conexión `/api/...` usada por la tienda Docker, ejecuta el frontend con Compose.

## Páginas principales

| Dirección | Página |
| --- | --- |
| `/`, `/productos`, `/productos/:productId` | Inicio, catálogo y detalle del producto. |
| `/registro`, `/login` | Registro e inicio de sesión. |
| `/carrito`, `/checkout`, `/pedidos` | Carrito, compra e historial. |
| `/blog`, `/blog/:slug`, `/nosotros`, `/contacto` | Artículos, información y contacto. |
| `/admin`, `/admin/productos`, `/usuarios` | Panel y gestión de la tienda. |
| `/admin/ordenes`, `/admin/reportes`, `/admin/mensajes`, `/admin/suscriptores` | Pedidos, reportes, mensajes y lista de novedades. |

Si la web no carga datos, comprueba que los servicios estén iniciados con `docker compose ps` desde la carpeta del backend. Para ver el motivo de un fallo, usa `docker compose logs --tail=100 nombre-del-servicio`.

## Diseña tus grillz en 3D

La nueva página `/grillz`, accesible desde el menú, permite elegir entre 16 dientes (8 superiores y 8 inferiores), girar y acercar el modelo, elegir dorado, plateado u oro rosado y añadir piedras. Puedes aplicar un acabado a todos los dientes cubiertos o combinar acabados al añadir dientes.

La descarga JPG funciona sin iniciar sesión e incluye el diseño y una descripción. El borrador se conserva en la pestaña mientras inicias sesión. Con una cuenta puedes guardar diseños, volver a abrirlos y solicitar cotizaciones. El administrador las revisa en `/admin/grillz` y puede reconstruir la misma configuración en 3D.

El modelo `arcada-v1` es una dentadura estilizada creada con geometría propia en Three.js. No requiere descargar modelos de terceros. El visor se carga únicamente al entrar a estas páginas. Si WebGL no está disponible, la selección mediante botones continúa disponible, aunque no es posible generar el JPG.

Los importes son referencias de desarrollo que llegan del backend. El modelo representa la apariencia; la fabricación requiere confirmar el presupuesto, los materiales y el molde. No se realiza un pago al pedir una cotización.
