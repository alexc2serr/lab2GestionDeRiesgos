# Laboratorio de gestión de riesgos

Plataforma académica para identificar, evaluar y comunicar riesgos de seguridad de la información de una organización ficticia (**Academia Horizonte**), orientada a facilitar la toma de decisiones directivas y la priorización fundamentada de medidas técnicas de protección.

> **Aviso:** Caso académico con datos ficticios. Funciona sin IA integrada y se despliega en Vercel.

---

## 🎯 Objetivo del Proyecto

El sistema permite:
1. Registrar riesgos mediante una formulación sintáctica guiada y coherente.
2. Evaluar probabilidad e impacto con justificación fundamentada según escalas didácticas (1 a 3).
3. Calcular automáticamente el nivel de riesgo (Bajo, Medio, Alto).
4. Proponer medidas de protección concretas, asociando su prioridad y un método riguroso para verificar su eficacia técnica.
5. Ofrecer una doble perspectiva: resumen ejecutivo para la alta dirección y detalle técnico para responsables de seguridad.
6. Garantizar la seguridad de la aplicación mediante buenas prácticas alineadas con el **ENS (Esquema Nacional de Seguridad)** y **NIST SP 800-53 Rev. 5**.

---

## 🔐 Gestión de Secretos y Seguridad (Zero-Knowledge)

* **Custodia en Bitwarden:** Todas las credenciales, contraseñas de bases de datos y tokens se custodian exclusivamente en la bóveda de Bitwarden del usuario.
* **Sin secretos en Git:** El repositorio incluye únicamente la plantilla [.env.example](file:///.env.example) sin valores reales. El archivo `.gitignore` excluye cualquier variante de archivo `.env*` y configuraciones locales de Vercel.
* **Separación de privilegios:** La IA y el control de versiones operan con conocimiento cero de las claves reales de producción.

---

## 📚 Documentación del Proyecto

* **[Fuentes Oficiales y Normativa](file:///docs/fuentes.md):** Enlaces oficiales del ENS (Real Decreto 311/2022) y NIST SP 800-53 Rev. 5, con condiciones de reutilización y declaración de alcance didáctico.
* **[Requisitos de Seguridad Técnicos](file:///docs/requisitos-seguridad.md):** Especificación completa de los requisitos **SEG-01** a **SEG-08**, sus pruebas de aceptación y evidencias esperadas.
* **[Caso de Estudio (Academia Horizonte)](file:///docs/caso.md):** Descripción del caso ficticio, proceso de matriculación, activos y condiciones conocidas.
* **[Metodología de Evaluación de Riesgos](file:///docs/evaluacion-riesgos.md):** Escalas didácticas de probabilidad e impacto (1 a 3), umbrales de puntuación y reglas metodológicas.
* **[Formulación Guiada del Riesgo](file:///docs/formulacion-riesgo.md):** Estructura sintáctica, campos del formulario, validaciones provisionales y tratamiento de SEG-05.
* **[Modelo y Persistencia en Base de Datos](file:///docs/base-de-datos.md):** Esquema relacional de riesgos, segregación de roles (`admin_riesgos` y `app_riesgos`) y procedimiento de migración en PostgreSQL (Neon).
* **[Guía de Gestión y Custodia de Secretos](file:///docs/gestion-secretos.md):** Inventario de secretos, separación de entornos (local vs Preview Neon), custodia Zero-Knowledge en Bitwarden y protocolo de rotación.
* **[Evaluación y Medidas de Protección](file:///docs/medidas-proteccion.md):** Escenarios completos evaluados (RSG-001 y RSG-002), medidas técnicas, pruebas de eficacia y respuesta a la pregunta de cierre para dirección.
* **[Registro de Despliegue en Vercel](file:///docs/despliegue.md):** Evidencias del despliegue en entorno Preview, commit trazable y comprobación de textos obligatorios.
* **[Registro de Fases y Evidencias](file:///docs/registro-fases.md):** Bitácora cronológica con el detalle de tareas completadas, decisiones y commits de cada etapa del laboratorio.
* **[Batería de Pruebas de Seguridad y Funcionamiento](file:///docs/pruebas.md):** Reporte de verificación automatizada de los 5 casos obligatorios (clasificación, validación, persistencia, 401 y ausencia de secretos).
* **[Guía de Despliegue de Vaultwarden Local](file:///docs/vaultwarden.md):** Instrucciones de ejecución de Vaultwarden mediante Docker Compose, configuración con Bitwarden y protocolo de copias de seguridad.
* **[Registro de Incidencias](file:///docs/incidencias.md):** Control de incidentes de seguridad y protocolo de declaración obligatoria.

---

## 🚀 Puesta en Marcha (Instrucciones de Construcción)

### Requisitos previos
* Node.js v20+ o v24+
* npm v10+ o v11+
* Git

### Instalación local
```bash
# 1. Clonar el repositorio
git clone https://github.com/alexc2serr/lab2GestionDeRiesgos.git
cd lab2GestionDeRiesgos

# 2. Configurar variables de entorno desde la plantilla
cp .env.example .env.local
# (Completar .env.local con las credenciales custodiadas en Bitwarden)

# 3. Instalar dependencias
npm install

# 4. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará accesible en `http://localhost:3000`.

### Verificación y compilación
```bash
# Comprobación de tipos y build de producción
npm run build

# Ejecución de la suite de pruebas de seguridad (SEG-01 a SEG-05)
npm test
```

---

## 🐳 Ejecución con Docker y Vaultwarden (Ampliación)

El proyecto incluye soporte contenerizado multi-stage para desarrollo y producción:

```bash
# Levantar la aplicación web y la bóveda local Vaultwarden (puerto 8080)
docker compose up --build
```
* Aplicación web: `http://localhost:3000`
* Bóveda local Vaultwarden (Bitwarden): `http://localhost:8080`

---

## 🔄 Integración Continua (GitHub Actions)

El workflow [`.github/workflows/ci.yml`](file:///.github/workflows/ci.yml) automatiza en cada push y pull request:
1. Escaneo de secretos con **Gitleaks** (**SEG-01**).
2. Verificación estricta de tipos TypeScript (**SEG-05**).
3. Ejecución de pruebas de aceptación de seguridad (`npm test`) (**SEG-03**, **SEG-05**).
4. Verificación de compilación de producción (**SEG-08**).

---

## 🌐 Despliegue en Vercel (Preview) y Verificación de la Entrega

* **URL de Previsualización Oficial (Preview):**  
  👉 **[https://laboratorio2-riesgos-lrqfdos3h-usj6.vercel.app](https://laboratorio2-riesgos-lrqfdos3h-usj6.vercel.app)**
* **Endpoint API de Persistencia:**  
  👉 [https://laboratorio2-riesgos-lrqfdos3h-usj6.vercel.app/api/riesgos](https://laboratorio2-riesgos-lrqfdos3h-usj6.vercel.app/api/riesgos)
* **Rama de Entrega:** **`gemini`**
* **Commit SHA de Entrega:** **`fa36e09`**

### Forma de Comprobar la Entrega por el Profesorado:
1. **Comprobación de la Interfaz Web:** Acceder a la URL Preview. Comprobar que en la cabecera figuran los tres textos obligatorios del caso (Título, Descripción y Aviso de datos ficticios) y las secciones informativas de la Academia Horizonte.
2. **Comprobación de la Doble Perspectiva:** Alternar entre la pestaña **Panel de Dirección** (resumen ejecutivo, KPIs, respuesta a la pregunta de cierre) y la pestaña **Panel Técnico** (matriz 3x3, controles ENS/NIST, comandos y planes de pruebas técnicas).
3. **Comprobación de Persistencia y Clasificación:** Comprobar que se cargan los dos riesgos completos (`RSG-001` y `RSG-002`) clasificados como nivel Alto (6) en la matriz 3x3 interactiva.
4. **Comprobación de Seguridad Server-Side:** Intentar crear un riesgo sin identificarse: el sistema opera en modo *Solo Lectura* y deniega mutaciones con HTTP 401 (**SEG-03**). Pulsar sobre *Solo Lectura* para introducir la credencial administrativa (`ADMIN_API_KEY`) custodiada en Bitwarden (valor de prueba didáctico en plantilla: `laboratorio2026`).
5. **Comprobación de Pruebas Automatizadas:** Ejecutar en local o en CI `npm test` para verificar el paso de las 9 pruebas de aceptación (validación Zod, sanitización XSS, autorización y no divulgación de secretos).

---

## 🧠 Decisiones Revisadas y Corregidas de la IA (Criterio de Evaluación)

En cumplimiento de las normas de realización del laboratorio, se documentan las siguientes decisiones clave donde el criterio humano del alumno revisó y corrigió las propuestas del asistente de IA:

1. **Corrección de Custodia de Credenciales (Zero-Knowledge):** Ante la posibilidad de que la IA automatizase la creación o lectura de archivos con secretos reales o ejecutase comandos directos de Vercel con tokens en memoria, el alumno exigió de forma estricta el aislamiento: *"antes de seguir estamos utilizando bitwarden para las credenciales no? y no tienes nada de acceso a credenciales no?"*. La IA fue corregida para adoptar un rol de asesoramiento guiado paso a paso, dejando la custodia de secretos en Bitwarden y la inyección en el dashboard web de Vercel exclusivamente en manos del alumno.
2. **Delimitación Normativa de las Escalas Didácticas:** La IA tendía a asociar la fórmula de puntuación $\text{Probabilidad} \times \text{Impacto}$ ($1\text{ a }3$) directamente como una metodología oficial del ENS o NIST. Se corrigió explícitamente para documentar que dicha matriz 3x3 y sus umbrales (1-2 Bajo, 3-4 Medio, 6-9 Alto) son **reglas didácticas propias del laboratorio** y no una fórmula atribuible al ENS ni a NIST SP 800-53 Rev. 5, preservando la honestidad metodológica requerida por el profesor.
3. **Segregación de Entornos en Git y Vercel:** Se corrigió la sugerencia inicial de fusionar los avances a la rama `main`, manteniendo todo el ciclo de iteraciones, pruebas y despliegues Preview en la rama de trabajo aislada **`gemini`**, garantizando un historial transparente y auditable para la evaluación.