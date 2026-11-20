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

## Animaciones con GSAP

Se utiliza **GSAP (GreenSock Animation Platform)** para crear animaciones suaves en la tienda, junto con **ScrollTrigger** para activarlas al desplazarse y **@gsap/react** para integrarlas con el ciclo de vida de los componentes React.

Se aplicó en cinco áreas:

1. **Inicio y carrusel:** acercamiento suave de la imagen y aparición escalonada del título, descripción y botón. La entrada inicial espera a que termine la pantalla de carga.
2. **Catálogo y productos destacados:** aparición de las tarjetas por grupos al entrar en pantalla y al cambiar los resultados de los filtros.
3. **Interacción con productos:** elevación de la tarjeta y zoom de la imagen al pasar el cursor, con retorno suave al retirarlo. También responde al foco del teclado en dispositivos con puntero preciso.
4. **Confirmación del carrito:** pulso del icono, animación del contador y entrada del mensaje de confirmación, únicamente después de que el servidor confirme que se añadió el producto.
5. **Checkout y resultado del pago:** transiciones de salida y entrada entre los datos de entrega y el pago, barra de progreso animada y aparición del símbolo y mensaje del resultado.

Los efectos están centralizados en `jarodandre/src/utilidades/motion.js`. Respetan la preferencia de accesibilidad `prefers-reduced-motion` y limpian sus animaciones, estilos y suscripciones al desmontar los componentes.

## Verificación

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd test -- --run
```
