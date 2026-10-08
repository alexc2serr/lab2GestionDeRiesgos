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

## Fase 6: Pipeline CI/CD en GitHub Actions y Docker (Pendiente)
* Próxima fase: Configuración del workflow `.github/workflows/ci.yml` para automatizar linting, chequeo de tipos, escaneo de secretos (Gitleaks / patrones) y ejecución de pruebas de seguridad (`npm test` y `npm run build`), garantizando la trazabilidad (**SEG-08**), y creación de `Dockerfile` multi-stage y `docker-compose.yml` para desarrollo local y ampliación con Vaultwarden.

