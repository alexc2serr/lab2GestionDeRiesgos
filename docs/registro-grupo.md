# Registro del Grupo de Trabajo y Decisiones Técnicas

> **Documento:** `docs/registro-grupo.md`  
> **Asignatura:** Gestión de Riesgos  
> **Laboratorio:** Laboratorio 2 · Parte 2 (Securización de la Aplicación de Análisis y Gestión de Riesgos)  
> **Fecha de entrega:** 23 de octubre de 2026 (Límite: 30 de octubre de 2026, 23:59)  
> **Rama Git oficial de entrega:** `gemini`  
> **Etiqueta Git oficial de entrega:** `entrega-l2`

---

## 1. Identificación de los Miembros del Grupo

* **Miembro 1 (Responsable técnico y de seguridad):**
  * **Nombre y Apellidos:** Alejandro Serrano Calvo
  * **Correo electrónico institucional / contacto:** `serranocalvoalejandro04@gmail.com`
  * **Usuario de GitHub:** `alexc2serr`

---

## 2. Asignación de Tareas y Trazabilidad de Commits

A continuación se detalla la contribución y autoría de los diferentes componentes de la Parte 2 del laboratorio, enlazando cada bloque técnico con sus commits formales en el repositorio:

| Componente Técnico / Fase | Descripción del Trabajo Desarrollado | Commits de Referencia |
|:---|:---|:---:|
| **Persistencia Relacional y Mínimo Privilegio (Prompt 7)** | Diseño del esquema relacional `riesgos` en PostgreSQL (Neon), creación de roles segregados en `db/roles.sql` (`admin_riesgos` para DDL y `app_riesgos` para DML con mínimos privilegios SEG-04), adaptador en `lib/db.ts` y documentación en `docs/base-de-datos.md`. | [`2604d38`](https://github.com/alexc2serr/lab2GestionDeRiesgos/commit/2604d38) |
| **Lógica Centralizada de Evaluación y Medidas (Prompt 8)** | Implementación de la función matemática centralizada en servidor en `lib/calculoRiesgo.ts` (9 combinaciones $P \times I$, niveles Bajo 1-2, Medio 3-4, Alto 6-9), campos de medidas (`propuesta`, `implantada`, `verificada`), efecto esperado y paneles duales (Dirección y Técnico). | [`c760104`](https://github.com/alexc2serr/lab2GestionDeRiesgos/commit/c760104) |
| **Autenticación, Sesiones y Rate Limiting (Prompt 9)** | Implementación de autenticación del perfil «gestor» con PBKDF2 (SHA-512, 100.000 iteraciones), emisión de cookies seguras `session_gestor` (`HttpOnly`, `Secure`, `SameSite=Lax`), control de fuerza bruta (5 intentos / 15 min) y protección server-side de mutaciones en `/api/riesgos` (HTTP 401). | [`bbf009a`](https://github.com/alexc2serr/lab2GestionDeRiesgos/commit/bbf009a) |
| **Validación Zod y Control de Errores (Prompt 10)** | Esquemas de validación Zod exhaustivos en servidor (`lib/validaciones.ts`), enums cerrados, longitudes acotadas, sanitización de entradas como texto plano (XSS) y control estricto de excepciones sin filtrar *stack traces* ni cadenas de conexión (NIST SI-10). | [`5d60f06`](https://github.com/alexc2serr/lab2GestionDeRiesgos/commit/5d60f06) |
| **Separación de Entornos y Gestión de Secretos (Prompt 11)** | Segregación de entornos Local vs Preview con ramificación *copy-on-write* de Neon PostgreSQL, política Zero-Knowledge con Bitwarden, inventario y rotación en `docs/gestion-secretos.md` y registro en `docs/incidencias.md`. | [`8c4f1aa`](https://github.com/alexc2serr/lab2GestionDeRiesgos/commit/8c4f1aa) |
| **Batería de Pruebas Automatizadas (Prompt 12)** | Suite automatizada de pruebas en TypeScript (`scripts/test-seguridad.ts`) con 11 aserciones cubriendo los 5 casos de prueba obligatorios (clasificación 9 combinaciones, validación, persistencia, 401 sin sesión y ausencia de secretos en git/DTOs). Reporte en `docs/pruebas.md`. | [`78a0734`](https://github.com/alexc2serr/lab2GestionDeRiesgos/commit/78a0734) |
| **Ampliación: Vaultwarden Local con Docker (Prompt 14)** | Creación de `vaultwarden/docker-compose.yml` con versión fija `1.32.7`, vinculación exclusiva a `127.0.0.1:8080`, volumen local ignorado por Git, `SIGNUPS_ALLOWED=false`, hash Argon2id para `ADMIN_TOKEN` y guía en `docs/vaultwarden.md`. | [`5362d31`](https://github.com/alexc2serr/lab2GestionDeRiesgos/commit/5362d31) |
| **Preparación de Entrega y Cierre (Prompt 13)** | Verificación del despliegue en Vercel Preview, consolidación documental de los requisitos SEG-01 a SEG-08, redacción del registro del grupo y etiquetado Git `entrega-l2`. | *Commit de entrega actual* |

---

## 3. Decisiones Técnicas Propuestas por la IA que Fueron Revisadas, Corregidas o Descartadas

En cumplimiento del requisito de supervisión y gobernanza humana sobre las sugerencias de la IA:

### Decisión 1: Sustitución de `bcrypt` nativo por PBKDF2 nativo de Node.js
* **Propuesta de la IA:** La IA sugirió inicialmente instalar dependencias externas como `bcrypt` o `argon2-wasm` mediante npm para computar los hashes de contraseña del perfil «gestor».
* **Revisión y corrección por el alumno:** Se descartó el uso de `bcrypt` porque depende de compilaciones nativas en C/C++ (`node-gyp`), lo cual causa fallos frecuentes durante el despliegue serverless en contenedores Linux de Vercel y complica el entorno Windows de desarrollo. Además, añadir librerías binarias externas amplía innecesariamente la superficie de ataque en la cadena de suministro.
* **Solución adoptada:** Se corrigió a una implementación utilizando exclusivamente el módulo criptográfico nativo de Node.js (`crypto.pbkdf2Sync`) configurado con SHA-512, 100.000 iteraciones y un salt pseudoaleatorio criptográficamente seguro de 16 bytes. Esta solución es universalmente portable, inmune a problemas de compilación en Vercel y cumple con creces los estándares NIST SP 800-132.

### Decisión 2: Desacoplamiento de la Ejecución de Pruebas frente al Compilador de Next.js
* **Propuesta de la IA:** La IA utilizó al principio el flag experimental de Node.js `--experimental-strip-types` añadiendo extensiones `.ts` a todas las rutas relativas en los módulos compartidos (`import ... from "./db.ts"`).
* **Revisión y corrección por el alumno:** Esta decisión rompía de forma crítica la compilación de producción de Next.js (`npm run build`), ya que el TypeScript compiler de Next.js prohíbe importar rutas con extensión `.ts` bajo la configuración `"moduleResolution": "bundler"`.
* **Solución adoptada:** El alumno revisó el error, rechazó alterar la configuración estándar del compilador de Next.js y resolvió el conflicto introduciendo `tsx` como runner de TypeScript desacoplado en el script `npm test`. Con esto, todo el código base mantiene importaciones limpias sin extensiones `.ts` y la compilación de producción de Next.js (`next build`) finaliza con código 0 limpio.

### Decisión 3: Filtrado de Falsos Positivos en la Detección Automatizada de Secretos
* **Propuesta de la IA:** La IA propuso un comando genérico de `git grep` que buscaba cadenas que contuvieran la palabra `PRIVATE KEY` o similares en cualquier fichero del repositorio.
* **Revisión y corrección por el alumno:** Al ejecutarse la prueba, la suite de pruebas falló porque el propio archivo de documentación que describía la prueba (`docs/pruebas.md`) contenía la explicación textual de la búsqueda, provocando un falso positivo de seguridad.
* **Solución adoptada:** Se refinó la expresión regular a los encabezados canónicos PEM (`-----BEGIN ... PRIVATE KEY-----`) y se excluyó formalmente el directorio de documentación (`:!docs/*`) de la comprobación estática de código, garantizando que el escáner busque credenciales reales en el código sin confundir la prosa técnica explicativa.

---

## 4. Respuesta Razonada a la Pregunta de Cierre para la Dirección

> **Pregunta Planteada:**  
> *«A la vista de los resultados del análisis y del estado de las medidas, ¿está la organización en condiciones de asumir el riesgo residual para la campaña que comienza en siete días? ¿Por qué?»*

### Dictamen Técnico y Decisión Ejecutiva

**Dictamen:** **NO, la organización Academia Horizonte NO está en condiciones de asumir el riesgo residual en el día de hoy**, y la Dirección **no debe autorizar el inicio de la campaña en siete días en las condiciones actuales**.

### Fundamentación Basada en los Datos del Caso y Estado de las Medidas

1. **Persistencia de un Riesgo Crítico en Nivel Alto (RSG-001):**
   - El riesgo **RSG-001** (*Pérdida de acceso a registros confirmados de matrícula por fallo en el almacenamiento de base de datos sin copias restaurables probadas*) fue clasificado con **Probabilidad Media (2)** e **Impacto Grave (3)**, resultando en una **Puntuación de 6 (Nivel Alto)**.
   - Las consecuencias para la Academia Horizonte ante la materialización de este riesgo son existenciales: la imposibilidad de reconstruir las solicitudes confirmadas, el incumplimiento legal de los compromisos de admisión, la pérdida irreparable de confianza institucional y sanciones por incumplimiento de deberes de custodia.
   - **Estado de la medida técnica:** La salvaguarda propuesta (*«Protocolo de restauración periódica de copias de seguridad en un entorno de contingencia y verificación de integridad mediante checksums SHA-256»*) se encuentra actualmente en estado **«propuesta»**.
   - Según el marco de gestión de riesgos, **una medida en estado «propuesta» no reduce el riesgo intrínseco**. Mientras no se haya completado con éxito un simulacro real de restauración que demuestre que el RTO (*Recovery Time Objective*) es inferior a 4 horas y el RPO (*Recovery Point Objective*) es inferior a 1 hora, la organización está operando con la misma vulnerabilidad que motivó la alerta.

2. **Progreso Positivo en la Segregación de Privilegios (RSG-002):**
   - El riesgo **RSG-002** (*Modificación o borrado masivo por permisos administrativos excesivos en la cuenta de base de datos*, calificado inicialmente como $P=2 \times I=3 = 6$, Nivel Alto) ha avanzado favorablemente en esta Parte 2:
     - Se ha segregado la cuenta de base de datos mediante el rol de aplicación de mínimos privilegios `app_riesgos` (`db/roles.sql`), revocando cualquier permiso de DDL (`DROP`, `ALTER`, `TRUNCATE`).
     - Se ha protegido la interfaz de gestión mediante el perfil «gestor» con contraseña cifrada (PBKDF2), cookies `HttpOnly`/`SameSite` y bloqueo por fuerza bruta.
   - Esta medida técnica se encuentra ya en estado **«implantada»** a nivel de arquitectura y código, lo que reducirá el impacto y la probabilidad de manipulación indebida una vez verificada en el despliegue.

3. **Plan de Acción Obligatorio antes del Día 7 para Viabilizar la Aceptación:**
   Para que la Dirección General pueda asumir el riesgo residual de forma legal y técnicamente fundamentada antes del inicio de la campaña, el equipo técnico debe ejecutar de forma impostergable el siguiente plan de tres hitos en las próximas 96 horas:
   - **Día +1 a +2 (Hito Crítico):** Ejecutar en el entorno de desarrollo/preproducción un **simulacro controlado de restauración de la copia de seguridad** de la base de datos PostgreSQL, comprobando que los datos se recuperan íntegramente y verificando los hashes SHA-256. Una vez completado con éxito, la medida pasará a estado **«verificada»**, lo que rebajará la Probabilidad de fallo catastrófico de 2 a 1, situando el riesgo residual en **Nivel Bajo (Puntuación 3 o inferior)**.
   - **Día +3:** Confirmar en el panel de Vercel y Neon que la cadena de conexión productiva asignada a la campaña utiliza inequívocamente el rol `app_riesgos` (mínimo privilegio), pasando la medida de RSG-002 a **«verificada»**.
   - **Día +4 a +6:** Presentar el acta técnica de verificación al Comité de Dirección.

**Conclusión:** Solo cuando ambas medidas hayan alcanzado el estado de **«verificada»** y los riesgos residuales se encuentren en zona **Baja/Media**, la Dirección podrá firmar el acta formal de aceptación de riesgo residual. Iniciar la campaña en 7 días con la medida de restauración de copias simplemente «propuesta» constituiría una negligencia operativa grave.
