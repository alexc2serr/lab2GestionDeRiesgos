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
* **[Registro de Fases y Evidencias](file:///docs/registro-fases.md):** Bitácora cronológica con el detalle de tareas completadas, decisiones y commits de cada etapa del laboratorio.

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
```