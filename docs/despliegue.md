# Registro de Despliegue en Vercel (Entorno Preview)

> **Documento:** `docs/despliegue.md`  
> **Asignatura:** Gestión de Riesgos  
> **Laboratorio:** Laboratorio 2 · Parte 2 (Securización de la Aplicación de Análisis y Gestión de Riesgos)  
> **Fecha de verificación:** 23 de octubre de 2026  
> **Rama de despliegue:** `gemini`  
> **Etiqueta Git asociada:** `entrega-l2`  
> **URL de Previsualización Operativa (Preview URL):**  
> 👉 **`https://laboratorio2-riesgos-lrqfdos3h-usj6.vercel.app`**

---

## 1. Verificación del Entorno Preview y Aislamiento (SEG-06)

* **Entorno exclusivo:** El despliegue está configurado y publicado formalmente bajo el entorno **Preview** de Vercel.
* **Prohibición de `--prod`:** Se ha verificado rigurosamente que **NO se ha utilizado la bandera `--prod`** en ningún comando ni pipeline, garantizando el aislamiento de preproducción exigido en el enunciado.
* **Limpieza absoluta de la URL pública:**
  * Se certifica que la URL pública (`https://laboratorio2-riesgos-lrqfdos3h-usj6.vercel.app`) y todas sus rutas y endpoints (`/api/riesgos`, `/api/auth/*`) **no contienen cadenas de conexión, parámetros de credenciales, contraseñas ni tokens expuestos en query strings o rutas**.
* **Persistencia Segregada en Neon PostgreSQL:**
  * La aplicación en Preview se conecta a una rama *copy-on-write* aislada de Neon mediante el rol de aplicación de mínimos privilegios (`app_riesgos`), desacoplada de la base de datos de administración.

---

## 2. Verificación de los Tres Textos Obligatorios

Se comprobó que la versión desplegada en la URL Preview renderiza de forma visible e íntegra los tres textos obligatorios del enunciado:

| Elemento | Texto Comprobado en la Interfaz | Estado |
| :--- | :--- | :---: |
| **Título principal** | «Laboratorio de gestión de riesgos» | Verificado ✅ |
| **Descripción** | «Identificar, evaluar y comunicar riesgos para priorizar medidas de protección» | Verificado ✅ |
| **Aviso de alcance** | «Caso académico con datos ficticios» | Verificado ✅ |

---

## 3. Estado de los Endpoints de la Aplicación

| Ruta / Endpoint | Método | Autenticación Requerida | Comportamiento Verificado |
|:---|:---:|:---:|:---|
| `/` | GET | Pública | Carga del panel con pestañas (Dirección, Técnico, Formulario). Muestra riesgos en modo lectura. |
| `/api/riesgos` | GET | Pública | Devuelve la lista de riesgos persistidos en PostgreSQL sin incluir campos sensibles de servidor. |
| `/api/riesgos` | POST | Sesión «gestor» | Inserta nuevo riesgo validado con Zod. Sin sesión devuelve `401 Unauthorized`. |
| `/api/riesgos` | PUT | Sesión «gestor» | Modifica riesgo existente. Sin sesión devuelve `401 Unauthorized`. |
| `/api/auth/login` | POST | Pública | Valida hash PBKDF2 del gestor y emite cookie firmada `session_gestor` (`HttpOnly`, `Secure`, `SameSite=Lax`). Rate limit activo (5 intentos / 15 min). |
| `/api/auth/sesion` | GET | Pública | Comprueba el estado de la sesión activa del usuario para refresco de interfaz. |
| `/api/auth/logout` | POST | Sesión activa | Invalida y borra la cookie de sesión del gestor. |

---

## 4. Evidencias de Seguridad y Auditoría (Zero-Knowledge)

1. **SEG-01 y SEG-02 (Ausencia de Secretos):**
   - El bundle de JavaScript servido al cliente no contiene `DATABASE_URL`, `DATABASE_URL_ADMIN`, `SESSION_SECRET` ni contraseñas.
   - Las credenciales se inyectan exclusivamente como variables de entorno del servidor en Vercel Dashboard (ámbito Preview).
2. **SEG-03 (Control de Escritura):**
   - Todo intento de POST o PUT no autenticado desde clientes HTTP (curl/fetch) es interceptado por el middleware/backend y rechazado inmediatamente con código `HTTP 401`.
3. **SEG-04 (Mínimo Privilegio):**
   - La cadena `DATABASE_URL` configurada en el servidor opera con el rol `app_riesgos` que carece de permisos DDL sobre la tabla `riesgos`.
4. **SEG-05 (Validación Server-Side):**
   - Entradas validadas mediante esquemas Zod en servidor antes de llegar al motor relacional.
5. **SEG-07 (Tratamiento de Errores):**
   - Respuestas de error sanitizadas sin *stack traces* ni detalles internos.

---

## 5. Resumen de Entrega

* **URL del Despliegue Preview:** `https://laboratorio2-riesgos-lrqfdos3h-usj6.vercel.app`
* **Repositorio GitHub:** `https://github.com/alexc2serr/lab2GestionDeRiesgos.git`
* **Rama de Trabajo y Entrega:** `gemini`
* **Etiqueta Git:** `entrega-l2`
