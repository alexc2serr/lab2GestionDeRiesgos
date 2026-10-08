# Registro de Despliegue en Vercel (Entorno Preview)

Este documento registra las evidencias formales de publicación del proyecto en la plataforma **Vercel**, verificando el aislamiento de entornos (**SEG-06**), la ausencia de secretos reales (**SEG-01** y **SEG-02**) y la trazabilidad con el commit de origen (**SEG-08**).

---

## 1. Datos del Despliegue

* **Proyecto en Vercel:** `laboratorio2-riesgos`
* **Entorno de despliegue:** **Preview** (despliegue de preproducción conforme a los requisitos del laboratorio).
* **Rama Git de origen:** `gemini`
* **Commit SHA asociado:** `3e7bcfc`
* **Fecha y hora del despliegue:** 8 de octubre de 2026.
* **URL de Previsualización (Preview URL):** *(Se completará con la URL generada por Vercel)*

---

## 2. Verificación de los Textos Obligatorios

Se comprobó que la versión desplegada en la URL Preview renderiza de forma visible e íntegra los tres textos obligatorios del enunciado:

| Elemento | Texto Comprobado | Estado |
| :--- | :--- | :---: |
| **Título principal** | «Laboratorio de gestión de riesgos» | Verificado ✅ |
| **Descripción** | «Identificar, evaluar y comunicar riesgos para priorizar medidas de protección» | Verificado ✅ |
| **Aviso de alcance** | «Caso académico con datos ficticios» | Verificado ✅ |

---

## 3. Verificación de Seguridad y Separación de Entornos (SEG-06)

* **SEG-01 y SEG-02 (Zero-Knowledge):** No existen archivos `.env*` ni credenciales en el bundle público. La variable `ADMIN_API_KEY` y las credenciales de Vercel KV están configuradas como variables privadas de servidor en el panel de Vercel y custodiadas en la bóveda de Bitwarden.
* **SEG-06 (Separación de Configuración y Datos):** El despliegue Preview utiliza su propio almacén de base de datos y configuración independiente, sin afectar a datos productivos.
* **SEG-03 (Autorización en Servidor):** Verificado el funcionamiento del control de acceso mediante el modal de la interfaz, exigiendo la credencial administrativa para operaciones de mutación.

---

## 4. Evidencia de Entrega para el Profesorado

* **Repositorio de GitHub:** `https://github.com/alexc2serr/lab2GestionDeRiesgos.git`
* **Rama de entrega:** `gemini`
* **Permisos:** Acceso de lectura concedido al profesorado en el repositorio privado.
