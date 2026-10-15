<p align="center">
  <img src="./jarodandre/src/assets/jarodandre-blanco-transparente.webp" alt="Banner de Jarodandre — Joyería urbana" width="900" />
</p>

# Jarodandre · Joyería urbana

Aplicación web de una tienda de joyería urbana dedicada a **anillos, cadenas, collares y grillz**. Permite explorar el catálogo, gestionar un carrito, completar una compra simulada y administrar productos, usuarios y pedidos.

El proyecto nació como un sitio HTML y fue migrado a una aplicación **React** con navegación sin recargas completas, componentes reutilizables y diseño adaptable a móviles y escritorio.

## Cómo funciona

La lógica que simula el backend está escrita en **JavaScript**, dentro de `jarodandre/src/datos/`. Los datos se guardan en **`localStorage`** y se conservan al recargar la página.

No requiere backend real, una base de datos externa ni claves de servicios. Los pagos y las boletas son simulados; contacto y newsletter guardan información localmente, sin enviar correos.

Los registros pertenecen al navegador y al origen donde se abre la aplicación. Por ejemplo, desarrollo y vista previa pueden tener datos distintos porque usan puertos diferentes.

## Funcionalidades

### Tienda

- Inicio con carrusel, banners en video, destacados y galería de Instagram.
- Catálogo inicial de **14 productos**, con categorías, búsqueda, filtros y ordenamiento.
- Fichas con imagen, descripción, precio en pesos chilenos y disponibilidad.
- Compra rápida desde las tarjetas y selección de cantidades desde la ficha.
- Carrito persistente con edición de cantidades, eliminación y cálculo de totales.
- Checkout con datos de entrega, resultado de pago simulado e historial de pedidos.
- Registro, inicio y cierre de sesión con validaciones de RUT, correo y contraseña.
- Blog con **nueve artículos**, página de la empresa y formulario de contacto.
- Suscripción local a novedades, sin correos duplicados.

### Administración

- Crear, editar, buscar y eliminar productos de forma persistente.
- Crear usuarios con rol y estado; editar, bloquear o eliminar cuentas.
- Consultar pedidos y comprobantes imprimibles.
- Cambiar estados de entrega: **Pendiente, Enviado y Completado**.
- Consultar reportes de ventas, productos más vendidos y clientes.
- Buscar mensajes de contacto, marcarlos como leídos y eliminarlos.
- Consultar suscriptores y gestionar sus bajas.

## Tecnologías utilizadas

| Tecnología | Uso en el proyecto |
| --- | --- |
| **React 19 y React DOM** | Componentes, interfaces y actualización de las vistas. |
| **React Router 7** | Navegación, rutas dinámicas y control de acceso a las vistas administrativas. |
| **Vite 8** | Servidor de desarrollo y generación de la versión de producción. |
| **JavaScript y JSX** | Lógica de negocio, formularios y componentes. |
| **Bootstrap 5.3 y CSS** | Rejillas, formularios, estilos y diseño adaptable. |
| **localStorage** | Persistencia local de catálogo, cuentas, carrito, pedidos y comunicaciones. |
| **Web Crypto API** | Derivación de contraseñas con PBKDF2/SHA-256 y sal aleatoria por cuenta. |
| **ESLint 10** | Revisión estática del código JavaScript y JSX. |
| **Node.js y npm** | Ejecución de herramientas y gestión de dependencias. |

## Requisitos

- **Node.js 24 LTS**, recomendado para ejecutar las herramientas del proyecto.
- **npm**, incluido con Node.js.
- Un navegador actualizado con JavaScript y almacenamiento local habilitados.

Para registrar cuentas e iniciar sesión, utiliza `localhost` en desarrollo o HTTPS al publicar: Web Crypto necesita un contexto seguro.

## Cómo ejecutarlo

Desde la raíz del repositorio, entra en la carpeta de la aplicación:

```bash
cd jarodandre
```

Instala las dependencias con las versiones del archivo de bloqueo:

```bash
npm ci
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Abre la dirección que indique la terminal, normalmente **http://localhost:5173**. Para detenerlo, presiona `Ctrl+C`.

### Comandos disponibles

Ejecuta estos comandos dentro de `jarodandre/`:

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo con actualización automática. |
| `npm run lint` | Revisa el código con ESLint. |
| `npm run build` | Genera la aplicación de producción en `dist/`. |
| `npm run preview` | Sirve localmente la compilación de producción. |

Para revisar la versión compilada:

```bash
npm run build
npm run preview
```

Abre la URL indicada, normalmente **http://localhost:4173**. El comando `preview` requiere que primero se haya generado `dist/`.

Si publicas esa carpeta en un alojamiento estático, configura la redirección de las rutas de la aplicación a `index.html` para permitir accesos directos como `/productos/3`.

## Cómo probarlo

El proyecto se verifica mediante **ESLint, compilación y recorridos manuales**. No incluye pruebas unitarias ni un comando `npm test`.

### 1. Revisar código y compilación

```bash
npm run lint
npm run build
```

### 2. Crear cuentas de demostración

No hay cuentas ni contraseñas preconfiguradas. Crea las cuentas desde **Registro** usando un nombre válido, un RUT con dígito verificador correcto, un correo admitido y una región/comuna del formulario.

- **Cliente:** utiliza un correo `@gmail.com`.
- **Administrador de la demo:** utiliza un correo `@duoc.cl` o `@profesor.duoc.cl` e inicia sesión. La regla académica concede acceso administrativo a esos dominios aunque el rol asignado inicialmente sea cliente.
- Desde el panel también puedes crear cuentas con rol **Administrador**, **Empleado/Ventas** o **Cliente**, y elegir su estado. Solo las cuentas activas pueden iniciar sesión.

El rol Empleado/Ventas no concede por sí solo acceso al panel. Los permisos administrativos se determinan por el rol Administrador o por los dominios Duoc mencionados.

### 3. Recorrer los flujos principales

| Recorrido | Qué comprobar |
| --- | --- |
| **Catálogo** | Buscar, combinar filtros, ordenar y abrir fichas de productos. |
| **Carrito** | Añadir desde tarjetas y fichas, cambiar cantidades, eliminar artículos y recargar para verificar persistencia. |
| **Compra** | Completar entrega y simular un pago realizado; comprobar el pedido y el vaciado del carrito. Al cancelar el pago, el carrito debe conservarse. |
| **Usuarios** | Crear una cuenta desde administración, editar su rol/estado y comprobar que se rechazan correos o RUT duplicados. |
| **Productos** | Crear, editar y eliminar una pieza; recargar y verificar que la eliminación persiste. |
| **Entrega** | Cambiar un pedido pagado a Enviado o Completado; comprobar el estado desde la cuenta del cliente. |
| **Contacto** | Enviar un mensaje, abrir la bandeja administrativa, marcarlo como leído y eliminarlo. |
| **Newsletter** | Suscribirse dos veces con el mismo correo, comprobar que no se duplica y darlo de baja desde el panel. |
| **Accesos** | Cerrar sesión e intentar abrir `/admin`; un visitante debe ir a login y un cliente sin permisos debe volver al inicio. |
| **Contenido y diseño** | Abrir los nueve artículos, recorrer formularios con teclado y revisar vistas en móvil y escritorio. |

## Rutas principales

| Ruta | Pantalla |
| --- | --- |
| `/` | Inicio. |
| `/productos` | Catálogo. |
| `/productos/:productId` | Detalle de producto. |
| `/carrito` | Carrito de compras. |
| `/checkout` | Entrega y pago simulado. |
| `/pedidos` | Historial de pedidos. |
| `/registro` y `/login` | Registro e inicio de sesión. |
| `/blog`, `/nosotros` y `/contacto` | Contenido y contacto. |
| `/admin` | Panel administrativo. |
| `/admin/productos` | Gestión del catálogo. |
| `/usuarios` y `/usuarios/nuevo` | Gestión y creación de cuentas. |
| `/admin/ordenes` y `/admin/reportes` | Órdenes, comprobantes y reportes. |
| `/admin/mensajes` y `/admin/suscriptores` | Mensajes y suscripciones locales. |

## Estructura del proyecto

```text
.
├── README.md
└── jarodandre/
    ├── public/             # Iconos y videos públicos
    ├── src/
    │   ├── assets/         # Banner, imágenes y recursos importados
    │   ├── componentes/    # Formularios y elementos compartidos, con nombres en español
    │   ├── datos/          # Backend simulado en JS y persistencia local
    │   ├── navigation/     # Rutas y acceso a administración
    │   ├── paginas/        # Pantallas con su contenido fijo escrito directamente en JSX
    │   ├── utilidades/     # Validaciones, filtros y formateadores
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    └── README.md           # Documentación técnica e historial de migración
```

## Próximas mejoras

Mejoras propuestas para continuar desarrollando la **simulación local en JavaScript**:

- [ ] Cupones de descuento con validación y cálculo del total.
- [ ] Inventario numérico con control de existencias por producto.
- [ ] Métodos de entrega y costos de envío simulados.
- [ ] Más regiones y comunas disponibles en los formularios.
- [ ] Favoritos y selección de variantes, como talla o acabado.
- [ ] Reportes filtrados por fecha y exportación de datos a CSV.
- [ ] Exportación e importación de respaldos locales en JSON.
- [ ] Sincronización de cambios entre pestañas mediante el evento `storage`.
- [ ] Optimización de imágenes y videos para reducir los tiempos de carga.
- [ ] Mejoras continuas de accesibilidad y presentación en pantallas pequeñas.

Para consultar las decisiones de implementación, las claves de almacenamiento y el historial de la migración, revisa la [documentación técnica de la aplicación](./jarodandre/README.md).
