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
* **Estado inicial:** `Pendiente`.

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
* **Estado inicial:** `Pendiente`.

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
* **Estado inicial:** `Pendiente`.

---

### SEG-04: Mínimo privilegio para la cuenta de base de datos
* **Finalidad:** Minimizar el impacto de un hipotético compromiso de la capa de aplicación restringiendo las capacidades de la base de datos a lo estrictamente necesario.
* **Referencia normativa:**
  * NIST SP 800-53 Rev. 5: `AC-6` (Least Privilege).
  * Requisito específico del laboratorio: Mitigar la debilidad del caso ficticio donde la cuenta tiene permisos administrativos.
* **Implementación prevista:**
  * Uso de credenciales de base de datos configuradas con permisos exclusivamente DML (`SELECT`, `INSERT`, `UPDATE`), revocando privilegios DDL (`DROP`, `ALTER`, `TRUNCATE`) y de superusuario.
* **Prueba de aceptación:** Intento de ejecución de un comando de alteración de esquema o eliminación de tablas con el usuario de conexión de la app.
* **Evidencia esperada:** Error de permisos insuficientes a nivel de base de datos (`permission denied for relation/table`).
* **Estado inicial:** `Pendiente`.

---

### SEG-05: Validación de entradas en el servidor
* **Finalidad:** Prevenir ataques por inyección (SQLi, XSS), estados inconsistentes o desbordamientos mediante la verificación estricta de todas las entradas procedentes del cliente.
* **Referencia normativa:**
  * ENS Anexo II: `mp.sw.1` (Desarrollo y adquisición de software seguro).
  * NIST SP 800-53 Rev. 5: `SI-10` (Information Input Validation).
* **Implementación prevista:**
  * Validación server-side con esquemas **Zod** (verificación de tipos de datos, longitudes mínimas/máximas y valores permitidos en rangos 1..3).
  * Tratamiento de entradas textuales como cadenas de texto plano, sin renderizado como HTML inseguro.
* **Prueba de aceptación:** Envío de payloads con campos ausentes, longitudes fuera de rango (ej. >500 caracteres), o valores de probabilidad/impacto inválidos (ej. 0 o 5).
* **Evidencia esperada:** Respuesta HTTP 400 Bad Request con detalle de validación estructurado sin procesar la petición.
* **Estado inicial:** `Pendiente`.

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
* **Estado inicial:** `Pendiente`.

---

### SEG-07: Errores públicos sin credenciales ni detalles internos sensibles
* **Finalidad:** Evitar la fuga de información técnica sensible (stack traces, rutas absolutas del servidor, nombres de tablas o versiones de software) en respuestas de error.
* **Referencia normativa:**
  * NIST SP 800-53 Rev. 5: `SI-10` (Information Input Validation / Error Handling).
* **Implementación prevista:**
  * Bloques `try/catch` globales en API Routes y Server Actions con formateo de errores genéricos para el usuario final.
  * Ocultación de stack traces cuando el entorno sea diferente de `development`.
* **Prueba de aceptación:** Provocación forzada de un error interno (ej. desconexión simulada de base de datos) y análisis del cuerpo de respuesta HTTP devuelto.
* **Evidencia esperada:** Mensaje controlado (ej. `{"error": "No ha sido posible procesar la solicitud. Inténtelo más tarde."}`) con código HTTP 500, sin trazas técnicas ni cadenas de conexión.
* **Estado inicial:** `Pendiente`.

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
* **Estado inicial:** `Pendiente`.

