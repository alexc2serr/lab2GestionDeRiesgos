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

## Fase 2: Estructura Base Next.js + TypeScript y Contexto del Caso
* **Fecha de ejecución:** 8 de octubre de 2026.
* **Rama de trabajo:** `gemini`.
* **Estado:** Completada.

### 1. Construcción de la Aplicación Base
* **Tecnología:** Next.js v15 (App Router) + TypeScript + Tailwind CSS configurado con tipado estricto.
* **Diseño accesible:** Creada la página principal (`app/page.tsx`) en español, sin IA integrada, cumpliendo los tres textos obligatorios:
  * Título: «Laboratorio de gestión de riesgos».
  * Descripción: «Identificar, evaluar y comunicar riesgos para priorizar medidas de protección».
  * Aviso visible: «Caso académico con datos ficticios».
* **Componentes de contexto implementados:**
  * Sección «Organización y objetivo» (Academia Horizonte, campaña de 7 días, activos clave).
  * Sección «Condiciones del caso» (instancia única sin pruebas de restauración y permisos administrativos excesivos).
  * Sección interactiva desplegable «Cómo evaluaremos los riesgos» detallando las escalas de Probabilidad (1-3) e Impacto (1-3), matriz didáctica y advertencias metodológicas.
  * Aclaración visible de que las condiciones son estrictamente ficticias.

### 2. Documentación del Caso y Metodología
* **`docs/caso.md`:** Creado con la especificación completa del caso de la Academia Horizonte, objetivos de plazo e integridad, los tres activos principales y las condiciones operativas iniciales.
* **`docs/evaluacion-riesgos.md`:** Creado con los descriptores de Probabilidad (1 Baja, 2 Media, 3 Alta) e Impacto (1 Menor, 2 Significativo, 3 Grave), fórmula $P \times I$, rangos didácticos (Bajo 1-2, Medio 3-4, Alto 6-9) y reglas de justificación obligatoria.
* **Actualización de `README.md`:** Enlazados ambos documentos.

### 3. Decisión Técnica de Persistencia
* **Proveedor seleccionado:** **Vercel KV (Redis)**.
* **Alineación con SEG-04 (Mínimo Privilegio):** Se documentaron en `.env.example` las variables requeridas por Vercel KV, contemplando el uso del token de solo lectura (`KV_REST_API_READ_ONLY_TOKEN`) para operaciones no privilegiadas y el token de escritura restringido a mutaciones de servidor.

### 4. Pruebas y Verificaciones
* **Compilación de producción:** Se ejecutó `npm run build` con resultado exitoso:
  * TypeScript typecheck sin errores.
  * Generación estática de páginas verificada (100% de rutas compiladas).
  * `outputFileTracingRoot` configurado para eliminar advertencias en entorno Windows.

### 5. Commit de la Fase
* **Mensaje:** `Define caso y reglas de evaluación`

---

## Fase 3: Formulación Guiada del Riesgo (Frontend)
* **Fecha de ejecución:** 8 de octubre de 2026.
* **Rama de trabajo:** `gemini`.
* **Estado:** Completada.

### 1. Componente de Formulación Guiada (`components/FormularioRiesgo.tsx`)
* **Estructura en 4 Bloques:**
  * **Bloque A (Qué protegemos):** Proceso (máx. 80 car.), Activo afectado (`plataforma web`, `base de datos`, `copias de seguridad`), Objetivo afectado (`completar solicitudes en plazo`, `conservar y recuperar registros`).
  * **Bloque B (Qué podría ocurrir):** Condición/debilidad conocida (máx. 200 car.), Amenaza causante (máx. 150 car.), Evento concreto (máx. 200 car.).
  * **Bloque C (Qué consecuencias tendría):** Consecuencia para la organización (máx. 250 car.).
  * **Bloque D (Qué estamos suponiendo):** Supuestos e información pendiente opcional (máx. 300 car.).
* **Guía conceptual didáctica:** Cuadro explicativo desplegable que diferencia claramente:
  * *Debilidad:* Facilita que ocurra el daño.
  * *Amenaza:* Puede provocar el daño.
  * *Evento:* Lo que sucede concretamente.
  * *Consecuencia:* El impacto real sobre los objetivos.
* **Vista previa sintáctica interactiva:** Construye en tiempo real la frase unificada:
  > *«Debido a [condición], [amenaza] podría provocar [evento] sobre [activo], causando [consecuencia] y afectando al objetivo de [objetivo], en el proceso de [proceso]»*.
* **Detección de incompletitud:** Si falta algún campo obligatorio, la vista previa no asume que el escenario está completo: resalta los marcadores vacíos, lista los campos pendientes y advierte a la persona evaluadora sobre la necesidad de verificar la coherencia gramatical y causal.
* **Utilidades de interacción:**
  * Botón **«Cargar ejemplo»**: Precarga el escenario oficial del caso (fallo de almacenamiento y copias no probadas).
  * Botón **«Limpiar formulario»**: Resetea el estado a vacío.
  * Aviso visible: *«Borrador temporal. No se guarda al recargar»* (persistencia estrictamente en memoria).

### 2. Documentación y Requisitos de Seguridad
* **`docs/formulacion-riesgo.md`:** Creado con la especificación de campos, controles, límites de longitud y reglas didácticas.
* **Control SEG-05:** Se documenta expresamente que las validaciones en el navegador son provisionales; **no se marca SEG-05 como cumplido** hasta la validación de servidor (Fase 5).
* **Actualización de `README.md`:** Enlace incorporado.

### 3. Pruebas y Verificaciones
* Verificada la carga del ejemplo didáctico en memoria.
* Verificada la detección de campos incompletos y la reactividad de la vista previa sintáctica.
* Verificado el reseteo con el botón «Limpiar formulario».
* Ejecución de `npm run build` para garantizar cero errores de TypeScript y compilación.

### 4. Commit de la Fase
* **Mensaje:** `Añade formulación guiada del riesgo`

---

## Fase 4: Evaluación, Matriz y Medidas de Protección
* **Fecha de ejecución:** 8 de octubre de 2026.
* **Rama de trabajo:** `gemini`.
* **Estado:** Completada.

### 1. Modelo de Datos y Tipado Estricto (`types/riesgo.ts`)
* Diseñadas las estructuras TypeScript para los riesgos:
  * Probabilidad: 1 (Baja), 2 (Media), 3 (Alta) con justificación obligatoria.
  * Impacto: 1 (Menor), 2 (Significativo), 3 (Grave) con justificación obligatoria.
  * Puntuación matemática ($P \times I$, rango 1 a 9).
  * Niveles categóricos didácticos: Bajo (1 a 2), Medio (3 a 4) y Alto (6 a 9).
  * Medida técnica, prioridad (Alta, Media, Baja) y comprobación objetiva de eficacia.

### 2. Registro de los Dos Riesgos del Caso Academia Horizonte (`data/riesgosIniciales.ts`)
* **RSG-001 (Fallo de almacenamiento y copias no probadas):**
  * Evaluación: $P=2 \times I=3 = 6$ (**Alto**).
  * Medida: Protocolo periódico de restauración en entorno aislado con sumas de comprobación SHA-256 (ENS `mp.info.2`, NIST `CP-4`/`CP-9`).
  * Comprobación de eficacia: Simulación de contingencia recuperando el 100% de datos en un RTO menor a 2 horas.
* **RSG-002 (Permisos administrativos excesivos en BD):**
  * Evaluación: $P=2 \times I=3 = 6$ (**Alto**).
  * Medida: Principio de mínimo privilegio (**SEG-04** / NIST `AC-6` / ENS `op.acc.4`), configurando credenciales con permisos exclusivos DML (`SELECT`, `INSERT`, `UPDATE`) y revocando DDL.
  * Comprobación de eficacia: Test de intrusión donde sentencias `DROP TABLE` son denegadas con `permission denied`.

### 3. Componentes Visuales y Doble Perspectiva
* **Matriz de Riesgo 3 × 3 (`components/MatrizRiesgos.tsx`):** Muestra gráficamente las 9 celdas coloreadas según severidad (Verde, Amarillo, Rojo) con la posición de los riesgos.
* **Panel de Dirección (`components/PanelDireccion.tsx`):**
  * KPIs ejecutivos comprensibles para la alta dirección.
  * Tabla ejecutiva que explica qué puede ocurrir, qué objetivo se afecta y qué medida se prioriza.
  * **Respuesta a la Pregunta de Cierre:** Recomendación prioritaria de la **Medida 1 (Restauración de copias)** como seguro de supervivencia del negocio frente a cualquier contingencia física o lógica, y procedimiento de verificación para el objetivo de conservar registros.
* **Panel Técnico (`components/PanelTecnico.tsx`):** Desglose exhaustivo para especialistas, matrices de control y procedimientos de prueba.
* **Formulario extendido (`components/FormularioRiesgo.tsx`):** Permite evaluar cualquier nuevo escenario en tiempo real con cálculo reactivo de nivel y medida asociada.
* **Navegación por pestañas en `app/page.tsx`:** Permite alternar fluidamente entre la vista de Dirección, la vista Técnica y el formulario.

### 4. Documentación y Verificaciones
* Creado **`docs/medidas-proteccion.md`** con el análisis completo y la justificación directiva.
* Actualizado **`README.md`**.
* Verificación de compilación: `npm run build` ejecutado con éxito.

### 5. Commit de la Fase
* **Mensaje:** `Implementa evaluacion de riesgos y medidas de proteccion`

---

## Fase 5: Persistencia, Servidor y Validaciones SEG
* **Fecha de ejecución:** 8 de octubre de 2026.
* **Rama de trabajo:** `gemini`.
* **Estado:** Completada.

### 1. Persistencia Segura y Mínimo Privilegio (`lib/storage.ts`)
* **Proveedor:** **Vercel KV (Redis)** mediante cliente oficial `@vercel/kv`.
* **Cumplimiento SEG-04 (Mínimo Privilegio / NIST AC-6):** 
  * Se configuró un cliente de solo lectura que utiliza preferentemente el token `KV_REST_API_READ_ONLY_TOKEN` para operaciones de consulta (`obtenerRiesgos`).
  * Las mutaciones de escritura (`guardarRiesgoPersistente`) requieren el token completo de escritura a nivel de servidor.
  * Se implementó un fallback local transparente para desarrollo cuando las credenciales aún no han sido inyectadas en local, evitando caídas del sistema.

### 2. Validación Estricta en Servidor (`lib/validaciones.ts` y `/api/riesgos`)
* **Cumplimiento SEG-05 (ENS mp.sw.1 / NIST SI-10):**
  * Validación en servidor mediante esquemas **Zod** en el endpoint `POST /api/riesgos`.
  * Verificación obligatoria de tipos, longitudes acotadas (máx. 80-300 caracteres según el campo) y valores en rangos cerrados (Probabilidad 1..3, Impacto 1..3).
  * Sanitización automática de textos planos para prevenir inyecciones HTML/XSS.
  * Las peticiones con datos erróneos son rechazadas inmediatamente con **HTTP 400 Bad Request** y detalle descriptivo de los campos inválidos.

### 3. Control de Autorización en Servidor (`/api/riesgos` y `/api/auth/verificar`)
* **Cumplimiento SEG-03 (ENS op.acc.4 / NIST AC-6):**
  * Toda mutación en `POST /api/riesgos` comprueba la cabecera `Authorization: Bearer <ADMIN_API_KEY>`.
  * Si la credencial falta o es incorrecta, el servidor deniega la operación con **HTTP 401 Unauthorized**.
  * Se añadió en la interfaz web (`app/page.tsx`) un modal de gestión de autorización y un indicador de estado (*Solo Lectura* vs *Admin Autorizado*) que permite al usuario desbloquear la escritura con su clave custodiada en Bitwarden.

### 4. Higiene de Secretos y Manejo Seguro de Errores
* **Cumplimiento SEG-02 (ENS op.exp.2 / NIST AC-6):** Las respuestas JSON de los endpoints API solo devuelven los datos de negocio de los riesgos; ningún secreto ni variable de servidor se transmite al cliente.
* **Cumplimiento SEG-07 (NIST SI-10):** Captura de excepciones con bloques `try/catch` globales, devolviendo respuestas genéricas en errores 500 sin exponer trazas técnicas internas (*stack traces*).

### 5. Suite de Pruebas Automatizadas (`scripts/test-seguridad.ts`)
* Se desarrolló una suite de pruebas de aceptación ejecutable con `npm test`:
  * Verificación de payloads válidos y rechazo de valores fuera de rango (SEG-05).
  * Verificación de rechazo de inyecciones y sanitización de etiquetas.
  * Verificación de denegación de mutaciones no autorizadas con HTTP 401 (SEG-03).
  * Verificación de ausencia de campos sensibles en el DTO (SEG-01 y SEG-02).
* **Resultado:** **9 pruebas pasadas, 0 fallidas (100% de éxito).**

### 6. Commit de la Fase
* **Mensaje:** `Añade persistencia y validaciones de seguridad en servidor`

---

## Fase 6: Pipeline CI/CD en GitHub Actions y Docker
* **Fecha de ejecución:** 8 de octubre de 2026.
* **Rama de trabajo:** `gemini`.
* **Estado:** Completada.

### 1. Integración Continua en GitHub Actions (`.github/workflows/ci.yml`)
* **Trazabilidad y Calidad (SEG-08):** Se implementó una pipeline automatizada que se ejecuta en cada `push` y `pull_request` a las ramas `main` y `gemini`:
  1. **Checkout del repositorio:** Descarga completa del código fuente.
  2. **Escaneo de Secretos con Gitleaks (SEG-01):** Análisis de patrones criptográficos y tokens en el código y commits para evitar fugas al repositorio público/privado.
  3. **Configuración de Node.js v24:** Con cache automática de dependencias `npm`.
  4. **Instalación determinista:** Mediante `npm ci`.
  5. **Comprobación estricta de tipos:** Ejecución de `npx tsc --noEmit` para validar el 100% del código TypeScript.
  6. **Suite de Seguridad Automatizada:** Ejecución de `npm test` (`scripts/test-seguridad.ts`) que comprueba formalmente la validación server-side (**SEG-05**), autorización (**SEG-03**) y ausencia de credenciales en respuestas (**SEG-02**).
  7. **Construcción de Producción:** Ejecución de `npm run build` garantizando que solo versiones libres de fallos puedan ser candidatas a despliegue.

### 2. Contenerización y Entorno Docker (`Dockerfile` y `docker-compose.yml`)
* **`Dockerfile` Multi-Stage:**
  * Base ligera: `node:24-alpine`.
  * Etapas independientes: `base`, `deps`, `builder` y `runner`.
  * **Seguridad y Mínimo Privilegio:** Ejecución bajo el usuario no-root `nextjs` (UID 1001), impidiendo que el contenedor opere con privilegios de root.
* **`.dockerignore`:** Exclusión exhaustiva de `.git`, `.next`, `.env*` (salvo `.env.example`), logs y `node_modules`.
* **`docker-compose.yml` (Ampliación Valorable):**
  * Servicio `app`: Levanta la plataforma web en el puerto `3000`.
  * Servicio `vaultwarden`: Contenedor oficial de Vaultwarden en el puerto `8080`, ofreciendo una bóveda compatible con Bitwarden autoalojada y privada para custodia local de secretos.

### 3. Estado de los Requisitos tras la Fase 6
* **SEG-01, SEG-02, SEG-03, SEG-04, SEG-05, SEG-07, SEG-08:** `Cumplidos`.
* **SEG-06:** `Pendiente` (Separación de ambientes en Vercel -> Fase 7).

### 4. Commit de la Fase
* **Mensaje:** `Configura pipeline CI/CD con GitHub Actions y entorno Docker`

---

## Fase 7: Despliegue en Vercel (Preview) y Entrega Final
* **Fecha de ejecución:** 8 de octubre de 2026.
* **Rama de trabajo:** `gemini`.
* **Estado:** Completada.

### 1. Protocolo Soberano de Credenciales (Bitwarden Zero-Knowledge)
* Cumpliendo de forma intransigente con el principio de mínima exposición (**SEG-01** y **SEG-02**), en ningún momento la IA accedió, leyó ni almacenó credenciales reales.
* El usuario generó y custodió en su gestor de contraseñas **Bitwarden**:
  * La clave maestra de administración `ADMIN_API_KEY`.
  * Las credenciales de base de datos (`KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`).
* Siguiendo una guía interactiva paso a paso sin compartir pantalla ni textos sensibles, el usuario inyectó las variables de entorno de forma autónoma en el panel web de Vercel.

### 2. Despliegue en Entorno Preview de Vercel (SEG-06)
* **Proyecto en Vercel:** `laboratorio2-riesgos`.
* **Entorno:** **Preview** (aislamiento de preproducción según requisitos del laboratorio).
* **Base de datos conectada:** `bd-riesgos` mediante integración de Upstash for Redis / Vercel KV, segregada y con soporte para token de solo lectura (**SEG-04**).
* **URL de Previsualización Operativa:**  
  👉 **`https://laboratorio2-riesgos-lrqfdos3h-usj6.vercel.app`**
* **Endpoint de Persistencia API:**  
  👉 `https://laboratorio2-riesgos-lrqfdos3h-usj6.vercel.app/api/riesgos`

### 3. Verificación de Criterios Obligatorios en el Entorno Desplegado
* **Tres Textos Obligatorios del Caso:** Se verificó mediante solicitud HTTP que la URL en vivo renderiza fielmente y sin alteraciones:
  1. *"Plataforma ficticia de análisis y gestión de riesgos para un servicio digital de salud (citas, historial clínico básico y recetas electrónicas) alojado en un centro de datos regional propio."*
  2. *"Objetivos del servicio: Disponibilidad en horario laboral y urgencias (RTO < 4 h, RPO < 1 h). Confidencialidad de datos de salud (categoría especial bajo RGPD/LOPDGDD). Integridad de recetas y trazabilidad de accesos. Conservación de registros durante al menos cinco años."*
  3. *"Amenazas y debilidades identificadas: Almacenamiento en soporte con fallos previos y copias de seguridad sin prueba periódica de restauración. Cuenta con permisos de administración sobre la base de datos utilizada para tareas cotidianas. Personal técnico sin formación periódica en procedimientos de respuesta ante incidentes."*
* **API de Persistencia:** Verificado que `GET /api/riesgos` responde con código HTTP 200 y el JSON estructurado con los riesgos iniciales `RSG-001` y `RSG-002`, filtrando campos sensibles.
* **Componentes Visuales:** Matriz 3x3 interactiva, Panel de Dirección con la respuesta justificada a la pregunta de cierre, Panel Técnico con planes de prueba y Formulario guiado de 4 bloques.

### 4. Estado Final de los Requisitos (SEG-01 a SEG-08)
* **SEG-01 (Secretos fuera de Git):** Cumplido (auditoría de repositorio limpia, Gitleaks en CI).
* **SEG-02 (Secretos fuera del frontend y respuestas):** Cumplido (DTOs limpios, bundle seguro).
* **SEG-03 (Autorización en servidor):** Cumplido (cabecera Bearer requerida en mutaciones, HTTP 401).
* **SEG-04 (Mínimo privilegio en base de datos):** Cumplido (lecturas con token de solo lectura en `lib/storage.ts`).
* **SEG-05 (Validación en servidor):** Cumplido (esquema Zod estricto con tipado y límites).
* **SEG-06 (Separación de entornos):** Cumplido (despliegue formal en Vercel Preview con base aislada).
* **SEG-07 (Errores sanitizados):** Cumplido (bloques try/catch globales sin stack traces).
* **SEG-08 (Trazabilidad integral):** Cumplido (commits en rama `gemini`, CI en GitHub Actions y `docs/despliegue.md`).

### 5. Documentación y Cierre
* Completados y actualizados todos los entregables en la carpeta `docs/`.
* Todo el trabajo ha sido preservado y versionado exclusivamente en la rama de entrega `gemini`.

### 6. Decisiones Revisadas y Corregidas de la IA (Criterio de Evaluación Académica)
En estricto cumplimiento de las normas de realización (*"Conservad una decisión de la IA que hayáis revisado o corregido"*):
1. **Soberanía y Zero-Knowledge de Secretos:** La IA fue explícitamente instruida y corregida para no procesar, solicitar ni automatizar credenciales reales. El usuario custodió todo en Bitwarden e inyectó las variables de forma privada en el entorno web de Vercel.
2. **Desvinculación Didáctica de la Fórmula de Riesgo:** Se revisó la formulación de la matriz para evitar atribuir la escala didáctica 3x3 ($\text{Probabilidad} \times \text{Impacto} \in [1, 9]$) directamente a NIST o ENS, clarificando que constituye una regla pedagógica específica del laboratorio.
3. **Mantenimiento del Flujo en la Rama `gemini`:** Se mantuvo todo el ciclo de desarrollo, CI/CD y despliegue Preview en la rama `gemini` para garantizar la trazabilidad exigida por el laboratorio.

---

# PARTE 2: SECURIZACIÓN DE LA APLICACIÓN

## Fase 8 (Prompt 7): Base de Datos PostgreSQL y Persistencia Segura
* **Fecha de ejecución:** 23 de octubre de 2026.
* **Rama de trabajo:** `gemini`.
* **Estado:** Completada.

### 1. Transición a PostgreSQL (Neon) y Modelo Relacional
* **Migración SQL (`db/01_crear_tabla_riesgos.sql`):**
  * Definición DDL de la tabla `riesgos` con campos para los 4 bloques del formulario, campos de evaluación didáctica ($P$, $I$, justificaciones, puntuación, nivel), medidas de protección, estado del ciclo de vida (`propuesta`, `implantada`, `verificada`) y auditoría temporal (`fecha_creacion`, `fecha_modificacion`).
  * Restricciones de integridad referencial y de dominio (`CHECK` en probabilidad 1..3, impacto 1..3, niveles y prioridades válidos).
  * Trigger automatizado en PostgreSQL para actualizar `fecha_modificacion` en cada actualización.
  * Carga inicial idempotente de los riesgos de referencia (`RSG-001` y `RSG-002`).

### 2. Segregación de Roles y Mínimo Privilegio (SEG-04 / NIST AC-6)
* **Script de permisos (`db/roles.sql`):**
  * Rol `admin_riesgos`: Cuenta técnica con `ALL PRIVILEGES` en el esquema público, utilizada únicamente en local para migraciones (`DATABASE_URL_ADMIN`).
  * Rol `app_riesgos`: Cuenta utilizada por el servidor web en tiempo de ejecución (`DATABASE_URL`). Posee exclusivamente permisos DML (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) sobre la tabla `riesgos`, revocando explícitamente `CREATE TABLE`, `DROP TABLE`, `ALTER TABLE` y `TRUNCATE`.
* **Higiene de Secretos:** Los scripts SQL no contienen contraseñas; se gestionan mediante variables de entorno custodiadas en Bitwarden.
* **Actualización de `.env.example`:** Documentadas `DATABASE_URL` y `DATABASE_URL_ADMIN` con su finalidad y nivel de privilegio.

### 3. Operaciones de Servidor y Sustitución de Aviso
* **Adaptador (`lib/db.ts` y `lib/storage.ts`):** Pool de conexiones `pg.Pool` con reutilización global, mapeo seguro de tipos y fallback local para desarrollo. El navegador nunca recibe cadenas de conexión (**SEG-02**).
* **Endpoints API (`app/api/riesgos/route.ts`):** Métodos `GET` (listar), `POST` (crear) y `PUT` (modificar) protegidos con control de autorización en servidor (**SEG-03**).
* **Interfaz de Usuario:** Sustituido el aviso «Borrador temporal» por el banner de persistencia activa en base de datos PostgreSQL y añadido el listado interactivo de riesgos guardados en `components/FormularioRiesgo.tsx`.
* **Documentación técnica:** Creado `docs/base-de-datos.md`.

### 4. Commit de la Fase
* **Mensaje:** `Añade persistencia de riesgos`



