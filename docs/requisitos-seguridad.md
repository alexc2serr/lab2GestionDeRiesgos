# Requisitos de Seguridad Técnicos (SEG-01 a SEG-08)

Este documento detalla los ocho requisitos de seguridad académicos exigidos para la plataforma de análisis y gestión de riesgos, sus referencias normativas (ENS / NIST SP 800-53 Rev. 5), la implementación técnica prevista, las pruebas de aceptación y las evidencias requeridas.

> **Nota de alcance didáctico:** Esta selección de requisitos representa una adaptación académica con fines pedagógicos y **no acredita conformidad completa** con el Esquema Nacional de Seguridad (ENS) ni con NIST SP 800-53 Rev. 5.

---

## Matriz de Requisitos Comprobables

### SEG-01: Secretos fuera del código y del historial de Git
* **Finalidad:** Evitar la exposición accidental de credenciales, claves criptográficas y tokens de acceso en el repositorio de control de versiones.
* **Referencia normativa:** 
  * ENS Anexo II: `mp.sw.1` (Desarrollo y adquisición de software seguro).
  * NIST SP 800-53 Rev. 5: `IA-5` (Authenticator Management).
* **Implementación prevista:**
  * Inclusión estricta de archivos `.env*` y `.vercel` en el archivo `.gitignore`.
  * Creación y mantenimiento de una plantilla `.env.example` exclusivamente con claves vacías o ejemplos ficticios.
  * Custodia de secretos reales en Bitwarden (Zero-Knowledge para la IA).
  * Job de detección de secretos en la pipeline de CI/CD (GitHub Actions con Gitleaks).
* **Prueba de aceptación:** Inspección del árbol de Git (`git log -p`, búsqueda de patrones sensibles) y ejecución de análisis estático de secretos.
* **Evidencia esperada:** Historial de commits libre de credenciales y archivo `.env.example` validado sin valores reales.
* **Estado:** `Cumplido` (Verificado: `.gitignore` activo, plantilla libre de secretos, suite de pruebas automatizadas).

---

### SEG-02: Secretos de servidor ausentes del código enviado al navegador, respuestas y registros
* **Finalidad:** Garantizar que variables críticas de entorno o datos de autenticación del backend no se filtren al cliente (DOM, bundle JS, respuestas JSON ni cabeceras).
* **Referencia normativa:**
  * ENS Anexo II: `op.exp.2` (Gestión de la configuración y segregación de funciones).
  * NIST SP 800-53 Rev. 5: `AC-6` (Least Privilege / No divulgación).
* **Implementación prevista:**
  * Uso estricto de variables de entorno de servidor en Next.js (sin prefijo `NEXT_PUBLIC_` para secretos).
  * Filtrado y tipado de objetos devueltos por Route Handlers y Server Actions mediante DTOs (Data Transfer Objects).
  * Sanitización de logs en servidor (enmascaramiento de tokens).
* **Prueba de aceptación:** Inspección de las respuestas HTTP en la pestaña Network de DevTools del navegador y búsqueda de cadenas secretas en los bundles JS generados.
* **Evidencia esperada:** Respuestas API limpias que solo contienen los datos comerciales del riesgo, sin campos de infraestructura ni tokens.
* **Estado:** `Cumplido` (Verificado: El endpoint `/api/riesgos` filtra campos sensibles; validado en `npm test`).

---

### SEG-03: Autorización en el servidor para modificar datos
* **Finalidad:** Impedir que usuarios no autenticados o con permisos insuficientes puedan crear, modificar o eliminar registros de riesgos en la aplicación.
* **Referencia normativa:**
  * ENS Anexo II: `op.acc.4` (Control de acceso).
  * NIST SP 800-53 Rev. 5: `AC-6` (Least Privilege).
* **Implementación prevista:**
  * Verificación de cabecera de autorización / token o cookie de sesión válida en el servidor antes de procesar mutaciones (POST, PUT, DELETE).
  * Denegación por defecto ante peticiones sin credencial válida (HTTP 401 Unauthorized / 403 Forbidden).
* **Prueba de aceptación:** Envío de una solicitud POST de inserción/modificación de riesgos sin cabecera de autenticación y verificación de rechazo inmediato.
* **Evidencia esperada:** Código de respuesta HTTP 401/403 con mensaje de error estándar y registro inalterado en la persistencia.
* **Estado:** `Cumplido` (Verificado: Rechazo HTTP 401 en `/api/riesgos` ante peticiones no autorizadas; validado en `npm test`).

---

### SEG-04: Mínimo privilegio para la cuenta de base de datos
* **Finalidad:** Minimizar el impacto de un hipotético compromiso de la capa de aplicación restringiendo las capacidades de la base de datos a lo estrictamente necesario.
* **Referencia normativa:**
  * NIST SP 800-53 Rev. 5: `AC-6` (Least Privilege).
  * Requisito específico del laboratorio: Mitigar la debilidad del caso ficticio donde la cuenta tiene permisos administrativos.
* **Implementación técnica:**
  * Segregación formal de roles en PostgreSQL en [`db/roles.sql`](file:///db/roles.sql):
    * **Rol `admin_riesgos`:** Cuenta de administración utilizada exclusivamente en local para migraciones DDL (`scripts/migrar.ts`).
    * **Rol `app_riesgos`:** Cuenta de aplicación utilizada por el servidor web en producción y Preview, restringida estrictamente a operaciones DML (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) sobre la tabla `riesgos`.
  * **Revocación de DDL:** Al rol `app_riesgos` se le revoca expresamente cualquier permiso de `CREATE TABLE`, `DROP TABLE` o `ALTER TABLE`.
* **Prueba de aceptación:** Intento de ejecución de un comando de alteración de esquema o eliminación de tablas (`DROP TABLE riesgos`) utilizando la cuenta `app_riesgos`.
* **Evidencia esperada:** Error de permisos insuficientes a nivel de motor de base de datos (`permission denied for relation/table riesgos`).
* **Estado:** `Cumplido` (Verificado: Script `db/roles.sql` implementado en commit `2604d38` y documentado en `docs/base-de-datos.md`).

---

### SEG-05: Validación de entradas en el servidor
* **Finalidad:** Prevenir ataques por inyección (SQLi, XSS), estados inconsistentes o desbordamientos mediante la verificación estricta de todas las entradas procedentes del cliente en el backend.
* **Referencia normativa:**
  * ENS Anexo II: `mp.sw.1` (Desarrollo y adquisición de software seguro).
  * NIST SP 800-53 Rev. 5: `SI-10` (Information Input Validation).
* **Implementación técnica:**
  * Validación server-side mediante esquemas **Zod** (`RiesgoSchema` y `RiesgoModificacionSchema` en `lib/validaciones.ts`) ejecutada en `POST /api/riesgos` y `PUT /api/riesgos`.
  * **Catálogos cerrados (Enums):**
    * `activo`: exclusivamente `'plataforma web'`, `'base de datos'` o `'copias de seguridad'`.
    * `objetivo`: exclusivamente `'completar solicitudes en plazo'` o `'conservar y recuperar registros'`.
    * `probabilidad`: enteros restringidos al conjunto didáctico `[1, 2, 3]`.
    * `impacto`: enteros restringidos al conjunto didáctico `[1, 2, 3]`.
    * `prioridad`: `'Baja'`, `'Media'` o `'Alta'`.
    * `estadoMedida`: `'propuesta'`, `'implantada'` o `'verificada'`.
  * **Límites de longitud y obligatoriedad:**
    * `proceso`: 2 a 80 caracteres.
    * `condicion`: 5 a 200 caracteres.
    * `amenaza`: 3 a 150 caracteres.
    * `evento`: 5 a 200 caracteres.
    * `consecuencia`: 5 a 250 caracteres.
    * `justificacionProbabilidad` y `justificacionImpacto`: 5 a 300 caracteres.
    * `medida`: 5 a 250 caracteres.
    * `efectoEsperado` y `comprobacionEficacia`: 5 a 300 caracteres.
  * **Tratamiento como texto plano:** Función de transformación `sanitizarTextoPlano` que purga caracteres `<` y `>` y recorta espacios en blanco, combinada con el renderizado nativo de React que escapa entidades HTML por defecto.
* **Prueba de aceptación:**
  1. Envío de payloads con campos ausentes requeridos (rechazo inmediato).
  2. Envío de probabilidad 5 o impacto 0 (rechazo por rango didáctico no admitido).
  3. Envío de activo no contemplado en el catálogo formal (rechazo por valor inválido).
  4. Envío de campos sobredimensionados (ej. `proceso` con 150 caracteres).
  5. Inserción de payloads con etiquetas HTML/script (sanitización a texto plano).
* **Evidencia esperada:** Respuesta HTTP 400 Bad Request con estructura JSON limpia detallando los campos erróneos sin procesar la mutación.
* **Estado:** `Cumplido` (Verificado: Validación en servidor activa en `lib/validaciones.ts` y probada en `scripts/test-seguridad.ts` con 5/5 casos de prueba pasados).

---

### SEG-06: Separación de configuración y datos entre desarrollo, Preview y producción
* **Finalidad:** Evitar que datos o configuraciones de entornos de prueba o previsualización contaminen o expongan el entorno de producción.
* **Referencia normativa:**
  * ENS Anexo II: `op.exp.2` (Gestión de la configuración y segregación de entornos).
* **Implementación prevista:**
  * Configuración independiente de variables de entorno en Vercel asignadas a los ámbitos *Development*, *Preview* y *Production*.
  * Uso de bases de datos o esquemas diferenciados para el entorno de desarrollo y los despliegues Preview.
* **Prueba de aceptación:** Verificación en Vercel Dashboard de que las variables asignadas al entorno Preview no apuntan a la base de datos productiva.
* **Evidencia esperada:** Despliegue Preview funcional con datos aislados respecto al entorno definitivo.
* **Estado:** `Cumplido` (Verificado: Proyecto `laboratorio2-riesgos` desplegado en el entorno Preview de Vercel con URL `https://laboratorio2-riesgos-lrqfdos3h-usj6.vercel.app`, conectado a base de datos aislada `bd-riesgos` vía Upstash for Redis y variables de entorno gestionadas por el usuario desde Bitwarden).

---

### SEG-07: Errores públicos sin credenciales ni detalles internos sensibles
* **Finalidad:** Evitar la fuga de información técnica sensible (stack traces, consultas SQL, cadenas de conexión, rutas absolutas del servidor o versiones) en respuestas de error.
* **Referencia normativa:**
  * NIST SP 800-53 Rev. 5: `SI-10` (Information Input Validation / Error Handling).
* **Implementación técnica:**
  * Envoltorio global de bloques `try/catch` en todos los Route Handlers (`app/api/riesgos`, `app/api/auth/login`, `app/api/auth/logout`, `app/api/auth/sesion`).
  * En caso de excepción no controlada, el backend captura el fallo, registra un log operacional controlado en servidor (`console.error` con descripción sucinta sin credenciales ni variables de entorno) y responde al cliente con **HTTP 500** y un mensaje genérico inofensivo:
    ```json
    { "error": "Error interno del servidor al procesar el riesgo. No se alteró ningún dato." }
    ```
  * En ningún caso se envían `stack`, rutas de disco de Windows/Linux ni sentencias SQL completas al navegador.
* **Prueba de aceptación:**
  1. Envío forzado de JSON malformado a `POST /api/riesgos` (devuelve HTTP 400 sin filtrar trazas).
  2. Provocación de fallo de conexión a base de datos (devuelve mensaje estándar HTTP 500 sin exponer la URI `DATABASE_URL`).
* **Evidencia esperada:** Respuestas HTTP limpias sin stack traces, rutas ni tokens, verificables en la pestaña Network de DevTools.
* **Estado:** `Cumplido` (Verificado: Handlers protegidos en todas las rutas de `app/api/` y respuestas de error sanitizadas).

---

### SEG-08: Trazabilidad entre cambios, pruebas y despliegues
* **Finalidad:** Asegurar que cada versión desplegada sea auditable, reproducible y esté vinculada a un commit de Git y a resultados de pruebas verificados.
* **Referencia normativa:**
  * ENS Anexo II: `op.exp.2` (Gestión de la configuración).
* **Implementación prevista:**
  * Pipeline de CI/CD en GitHub Actions que ejecuta pruebas y linters en cada push a ramas principales y pull requests.
  * Vinculación unívoca del commit SHA con el despliegue Preview en Vercel.
  * Registro de cada despliegue en `docs/despliegue.md`.
* **Prueba de aceptación:** Verificación del flujo completo: push de commit -> ejecución exitosa de pipeline en GitHub Actions -> generación de despliegue Preview con commit hash trazable.
* **Evidencia esperada:** Badge / log verde de GitHub Actions y entrada registrada en `docs/despliegue.md` con URL, fecha y hash de commit.
* **Estado:** `Cumplido` (Verificado: Workflow de CI `.github/workflows/ci.yml`, suite de pruebas automatizadas en `docs/pruebas.md`, etiqueta Git oficial `entrega-l2` y registro exhaustivo en `docs/registro-fases.md`).

