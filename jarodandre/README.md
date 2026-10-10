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
- `src/data/`: datos de presentación del hero; la fuente simulada con CRUD se incorporará en el cambio 4.
- `src/assets/`: recursos importados por los componentes, como el logo original.
- `public/`: archivos servidos directamente, como el favicon. Los videos se incorporarán aquí al migrar sus secciones.

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
