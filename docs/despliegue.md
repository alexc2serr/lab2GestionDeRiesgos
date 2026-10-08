# Registro de Despliegue en Vercel (Entorno Preview)

Este documento registra las evidencias formales de publicación del proyecto en la plataforma **Vercel**, verificando el aislamiento de entornos (**SEG-06**), la ausencia de secretos reales (**SEG-01** y **SEG-02**), la trazabilidad con el commit de origen (**SEG-08**) y la comprobación de los requisitos funcionales.

---

## 1. Datos del Despliegue de Entrega

* **Proyecto en Vercel:** `laboratorio2-riesgos`
* **Entorno de despliegue:** **Preview** (despliegue de preproducción oficial del laboratorio).
* **Rama Git de origen:** `gemini`
* **Commit SHA asociado:** `fa36e09` (commit de consolidación final)
* **Fecha y hora del despliegue:** 8 de octubre de 2026.
* **URL de Previsualización Operativa (Preview URL):**  
  👉 **`https://laboratorio2-riesgos-lrqfdos3h-usj6.vercel.app`**
* **Endpoint de Persistencia API:**  
  👉 `https://laboratorio2-riesgos-lrqfdos3h-usj6.vercel.app/api/riesgos`

---

## 2. Verificación de los Tres Textos Obligatorios

Se comprobó que la versión desplegada en la URL Preview renderiza de forma visible e íntegra los tres textos obligatorios del enunciado:

| Elemento | Texto Comprobado | Estado |
| :--- | :--- | :---: |
| **Título principal** | «Laboratorio de gestión de riesgos» | Verificado ✅ |
| **Descripción** | «Identificar, evaluar y comunicar riesgos para priorizar medidas de protección» | Verificado ✅ |
| **Aviso de alcance** | «Caso académico con datos ficticios» | Verificado ✅ |

---

## 3. Verificación de Seguridad y Separación de Entornos (SEG-06)

* **SEG-01 y SEG-02 (Zero-Knowledge):** No existen archivos `.env*` ni credenciales en el código fuente ni en el bundle público de JavaScript. La variable `ADMIN_API_KEY` está configurada de forma segura en las variables de servidor de Vercel y custodiada en la bóveda personal de Bitwarden.
* **SEG-04 (Mínimo Privilegio):** Conectada la base de datos `bd-riesgos` (Upstash for Redis / Vercel KV) con soporte segregado de tokens (`KV_REST_API_READ_ONLY_TOKEN` para consultas y token de servidor para escrituras).
* **SEG-06 (Separación de Configuración y Datos):** El despliegue pertenece formalmente al entorno Preview, aislando la base de datos y parámetros respecto a un entorno definitivo de producción.
* **SEG-03 (Autorización en Servidor):** Verificado el funcionamiento del control de acceso mediante el modal de la interfaz, exigiendo la credencial administrativa para operaciones de mutación.

---

## 4. Evidencia de Entrega para el Profesorado

* **URL Operativa de Vercel:** `https://laboratorio2-riesgos-lrqfdos3h-usj6.vercel.app`
* **Repositorio de GitHub:** `https://github.com/alexc2serr/lab2GestionDeRiesgos.git`
* **Rama de entrega:** `gemini`
* **Identificador de commit:** `fa36e09`
* **Riesgos completos registrados:** 
  * `RSG-001` (Fallo de almacenamiento y copias no probadas, nivel Alto 6).
  * `RSG-002` (Permisos administrativos excesivos en base de datos, nivel Alto 6).
* **Respuesta a la pregunta de cierre para dirección:** Documentada e interactiva en la vista ejecutiva de la aplicación y en [`docs/medidas-proteccion.md`](file:///docs/medidas-proteccion.md).
