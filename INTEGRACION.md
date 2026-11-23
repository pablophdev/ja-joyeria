# Integración con los microservicios

El frontend consume cuatro APIs Spring Boot para catálogo, territorios, carrito, pedidos y comunicaciones. La autenticación local la administra ms-auth.

## Preparar

1. Configura la persistencia MySQL externa del backend según `../jarodandre-backend/README.md`.
2. Inicia los cuatro servicios: puertos 8081, 8082, 8083 y 8084.
3. Dentro de `jarodandre`, instala con `npm.cmd ci`.
4. Si cambian las URLs de los servicios, copia `.env.example` a `.env.local` y ajústalas.
5. Ejecuta `npm.cmd run dev -- --port 5173 --strictPort`.
6. Abre `http://localhost:5173`.

Registro y login usan ms-auth. Las rutas privadas requieren JWT y la administración exige una cuenta administradora activa. Solo los cuatro microservicios se ejecutan con Docker; el frontend se ejecuta con Node.js o se publica como archivos estáticos.

## Funciones conectadas

- Catálogo, blog y territorios mediante HTTP.
- Carga, errores, paginación y adaptación de formatos.
- Imágenes iniciales de Vite y recursos multimedia del backend.
- Carrito invitado con precios y totales confirmados por el servidor.
- Tokens privados, checkout idempotente y recuperación ante fallos de red.
- Contacto y suscripciones mediante las APIs.

Estas operaciones requieren que el backend tenga una base de datos configurada. No existe una base embebida alternativa.

## Verificación

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd test -- --run
```

`BackendLive.test.js` es optativo: necesita los cuatro servicios, una base de prueba y pagos simulados habilitados. Crea registros de prueba; no debe ejecutarse contra producción.
