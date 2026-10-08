# Registro de Progreso y Evidencias por Fases

Este documento actúa como bitácora oficial y cuaderno de auditoría del proyecto. Registra las tareas completadas, decisiones técnicas adoptadas, pruebas ejecutadas y evidencias obtenidas en cada fase del desarrollo, conforme a los criterios del **Laboratorio 2 de Análisis y Gestión de Riesgos**.

---

## Índice de Fases
* [Fase 1: Preparación del Entorno, Higiene de Git y Requisitos de Seguridad](#fase-1-preparación-del-entorno-higiene-de-git-y-requisitos-de-seguridad)
* [Fase 2: Estructura Base Next.js + TypeScript y Contexto del Caso](#fase-2-estructura-base-nextjs--typescript-y-contexto-del-caso-pendiente)
* [Fase 3: Formulación Guiada del Riesgo (Frontend)](#fase-3-formulación-guiada-del-riesgo-frontend-pendiente)
* [Fase 4: Evaluación, Matriz y Medidas de Protección](#fase-4-evaluación-matriz-y-medidas-de-protección-pendiente)
* [Fase 5: Persistencia, Servidor y Validaciones SEG](#fase-5-persistencia-servidor-y-validaciones-seg-pendiente)
* [Fase 6: Pipeline CI/CD en GitHub Actions y Docker](#fase-6-pipeline-cicd-en-github-actions-y-docker-pendiente)
* [Fase 7: Despliegue en Vercel (Preview) y Entrega Final](#fase-7-despliegue-en-vercel-preview-y-entrega-final-pendiente)

---

## Fase 1: Preparación del Entorno, Higiene de Git y Requisitos de Seguridad
* **Fecha de ejecución:** 8 de octubre de 2026.
* **Rama de trabajo:** `gemini`.
* **Estado:** Completada.

### 1. Comprobación del Entorno de Ejecución
Se realizaron comprobaciones locales en el entorno de desarrollo (Windows PowerShell):
* **Git:** versión 2.55.0.windows.5 disponible y autenticado con el repositorio remoto.
* **Node.js:** versión v24.21.0 disponible en el PATH del sistema.
* **npm:** versión 11.19.0 disponible.
* **Aislamiento y Credenciales:** Se constata que Docker y Bitwarden CLI no están en el PATH del sistema, por lo que la gestión de secretos se realiza mediante la aplicación Bitwarden del usuario y la plantilla `.env.example`, sin acceso de la IA a secretos reales.

### 2. Higiene del Repositorio Git
* **Corrección de nombres de ramas:** Se identificaron y eliminaron las ramas locales auxiliares `delete` y `ç`.
* **Renombrado del remoto:** El remoto fue configurado como `origin` (apuntando a `https://github.com/alexc2serr/lab2GestionDeRiesgos.git`), resolviendo el error previo de conflicto con el nombre de rama remota.
* **Rama activa:** Se fijó `gemini` como rama de trabajo vinculada al upstream remoto `origin/gemini`.

### 3. Seguridad Base y Política de Secretos (Zero-Knowledge)
* **Archivo `.gitignore`:** Configurado para ignorar de manera exhaustiva `node_modules/`, salidas de build (`.next/`, `dist/`), archivos `.env*` y la carpeta de configuración `.vercel`. Se permite explícitamente únicamente la plantilla `!.env.example`.
* **Archivo `.env.example`:** Creado con la documentación técnica de cada variable requerida (`NODE_ENV`, `SESSION_SECRET`, `ADMIN_API_KEY`, `DATABASE_URL`), explicando su finalidad, formato esperado y prohibiendo valores reales en el control de versiones.

### 4. Documentación Oficial y Requisitos Académicos
* **`docs/fuentes.md`:** Incorpora las referencias oficiales del ENS (BOE-A-2022-7191: `op.acc.4`, `op.exp.2`, `mp.sw.1`) y NIST SP 800-53 Rev. 5 (`IA-5`, `AC-6`, `SI-10`), junto con las condiciones de uso de publicaciones del NIST y la declaración de alcance didáctico.
* **`docs/requisitos-seguridad.md`:** Detalla los 8 requisitos de seguridad comprobables (**SEG-01** a **SEG-08**) con su finalidad, referencia normativa, implementación prevista, prueba de aceptación, evidencia y estado inicial (*Pendiente*).
* **`README.md`:** Actualizado con el título oficial, descripción del objetivo y enlaces de navegación a los documentos de seguridad.

### 5. Estado de los Requisitos de Seguridad tras la Fase 1
* **SEG-01:** En progreso (protegido por `.gitignore`, `.env.example` y política de secretos).
* **SEG-02 a SEG-08:** Pendientes para las siguientes fases de desarrollo.

### 6. Commit de la Fase
* **Mensaje:** `Documenta fuentes y requisitos de seguridad`

---

## Fase 2: Estructura Base Next.js + TypeScript y Contexto del Caso (Pendiente)
* Próxima fase: Creación de la aplicación mínima, configuración de TypeScript/Tailwind, creación de `docs/caso.md` y `docs/evaluacion-riesgos.md`, e interfaz inicial de contexto.
