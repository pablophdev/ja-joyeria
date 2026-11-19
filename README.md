# Jarodandre · Joyería urbana

Tienda React 19 + Vite conectada a los microservicios Spring Boot de `../jarodandre-backend`.

## Estado actual

El catálogo, blog, carrito invitado, checkout y comunicaciones consumen las APIs del backend. La persistencia requiere configurar una base PostgreSQL.

**Registro, login y administración están deshabilitados:** no hay un proveedor de identidad configurado. No se generan sesiones ni permisos locales.

## Ejecutar

Consulta [INTEGRACION.md](./INTEGRACION.md) e inicia primero los cuatro microservicios.

```powershell
cd jarodandre
npm.cmd ci
npm.cmd run dev -- --port 5173 --strictPort
```

Las URLs de las APIs se pueden ajustar con las variables indicadas en `jarodandre/.env.example`. No deben incluirse secretos de servidor en el frontend.

## Verificación

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd test -- --run
```
