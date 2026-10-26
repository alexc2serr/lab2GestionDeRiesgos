# Decisiones iniciales de arquitectura

## Persistencia

Se utilizará Redis mediante la integración de Upstash en Vercel Marketplace. La antigua oferta de Vercel KV fue retirada; por eso el código usa el SDK oficial de Upstash para Redis compatible con Vercel.

La configuración requiere `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`. No se guardan valores reales en Git. Cada entorno debe tener su propia instancia o separación equivalente:

| Entorno | Datos | Configuración |
| --- | --- | --- |
| Desarrollo | Datos ficticios locales | `.env.local` sin versionar |
| Preview | Datos de prueba aislados | Variables de entorno de Preview |
| Producción | Datos reales del proyecto | Variables de entorno de Production |

## Roles iniciales

- **admin:** administra usuarios, roles, configuración y todos los datos funcionales.
- **analista:** registra y evalúa riesgos y propone medidas; no administra usuarios ni configuración.
- **direccion:** consulta riesgos, prioridades e informes; no modifica datos.

La autorización se comprobará en el servidor en cada operación de escritura. La interfaz no será considerada un mecanismo de seguridad.

## Límites de esta etapa

Esta etapa prepara el cliente de Redis y el catálogo de roles, pero no crea cuentas, no configura una base de datos externa, no añade autenticación real y no almacena todavía riesgos. Para activar Redis se necesitará crear la integración en Vercel y definir sus variables en cada entorno, sin introducirlas en el repositorio.
