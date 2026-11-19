# Frontend conectado al backend

La tienda ya no utiliza `localStorage` como base de datos. `src/datos/` consulta los cuatro microservicios mediante `fetch`. Las vistas leen snapshots en memoria que se actualizan después de las operaciones HTTP.

## Ejecutar

1. Inicia los servicios desde `Desktop/jarodandre-backend`, uno por terminal:

   ```powershell
   cd ms-auth
   .\mvnw.cmd spring-boot:run
   ```

   Repite para `ms-catalogo`, `ms-pedidos` y `ms-comunicaciones`.

2. Desde `Desktop/ja-joyeria/jarodandre`:

   ```powershell
   Copy-Item .env.example .env.local
   npm.cmd ci
   npm.cmd run dev -- --port 5173 --strictPort
   ```

3. Abre **http://localhost:5173**. Usa ese origen exacto para CORS. El backend incluye H2 persistente, catálogo y blog iniciales.

También puedes ejecutar `.\start-local.ps1` desde el repositorio del backend para abrir las cinco terminales. Si tu política de PowerShell impide ejecutar scripts, usa los comandos manuales; no necesitas modificar la política del sistema.

## Cognito

Las operaciones públicas y las compras de invitado funcionan sin Cognito. No existe acceso administrativo local ni por dominio de correo.

Para habilitar cuentas:

- Configura un User Pool de Cognito con un app client público **sin client secret**, Hosted UI y **Authorization Code + PKCE**.
- Habilita los scopes `openid email profile` y el registro con correo verificado.
- Registra callback `http://localhost:5173/login` y salida `http://localhost:5173`.
- Completa `VITE_COGNITO_DOMAIN` (URL HTTPS del dominio) y `VITE_COGNITO_CLIENT_ID` en `jarodandre/.env.local`.
- Exporta `COGNITO_ISSUER`, `COGNITO_CLIENT_ID` y `COGNITO_USERINFO_URL` en el entorno de los microservicios. El Client ID debe coincidir con el del frontend.
- Reinicia Vite y los servicios después de cambiar la configuración.

El frontend verifica `state`, utiliza PKCE S256, canjea el código, renueva el access token y envía `Authorization: Bearer`. Guarda los tokens únicamente en `sessionStorage`, nunca contraseñas. El rol siempre procede de `/v1/me`, no del correo ni de un token decodificado sin verificar.

Tras el primer acceso, el usuario completa su perfil (nombre, RUT, teléfono y comuna). Regiones y comunas provienen de `ms-auth`.

La API no permite crear el primer administrador desde el navegador. Asigna el rol ADMIN a un perfil existente mediante un procedimiento administrativo confiable en la base de datos. No hay una puerta trasera pública para elevar permisos.

## Contratos y persistencia

- URLs por entorno: `VITE_AUTH_URL`, `VITE_CATALOGO_URL`, `VITE_PEDIDOS_URL`, `VITE_COMUNICACIONES_URL`.
- CORS: los cuatro servicios registran explícitamente `corsConfigurationSource`; solo aceptan el origen configurado en `FRONTEND_ORIGIN`. Se prueban los preflights de autorización, imágenes y encabezados de checkout.
- Paginación: se recorren todas las páginas de los listados.
- Productos: se traducen nombres, categoría, precios CLP y estados; altas, edición y archivo se confirman en el backend.
- Imágenes iniciales: las claves `products/...` y `blog/...` se resuelven a los assets empaquetados por Vite.
- Imágenes subidas: multipart con campo `imagen`; se almacena la clave `uploads/...`, no un data URL. Por defecto se sirven desde `ms-catalogo/media`. Para S3/CDN configura `VITE_MEDIA_URL` con la base que contiene `uploads/` y permita acceso de lectura.
- Carrito invitado: se conserva `X-Carrito-Token` en la sesión del navegador. El total y los precios siempre los devuelve el backend.
- Checkout: conserva UUID de idempotencia, datos de entrega y pedido pendiente hasta resolver el pago. Un reintento de red utiliza la misma clave.
- Pedidos invitados: se conserva el token privado de consulta; el backend exige ese token para consultar o vincular pedidos. No se asocian por un correo local.
- La administración de usuarios cambia **solo rol y estado**. Crear/eliminar identidades y modificar contraseñas no son operaciones de esta API; se gestionan en Cognito. Bloquear un perfil impide su acceso a las APIs.
- Los pagos siguen siendo **simulados**, no una pasarela de cobro real.
- Los datos antiguos `jarodandre.*` de `localStorage` no se borran ni se importan automáticamente. No son una fuente de identidad ni de datos confiables para el backend.

Cerrar la pestaña termina la sesión de navegador y puede perder el acceso privado a pedidos invitados. Los registros del servidor permanecen en su base de datos. Los pedidos vinculados se recuperan iniciando sesión.

## Pruebas

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd test -- --run
```

Prueba optativa con los cuatro servicios iniciados, **preferiblemente con bases de datos de prueba**:

```powershell
$env:VITE_LIVE_API_TESTS = 'true'
npm.cmd test -- --run src/test/BackendLive.test.js
Remove-Item Env:VITE_LIVE_API_TESTS
```

Esta prueba crea dos pedidos (cancelado y pagado), un contacto y una suscripción. Comprueba montos reales, recuperación ante una respuesta de checkout perdida, comprobante, acceso privado y rechazo de administración anónima. No elimina datos existentes.
