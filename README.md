# Laboratorio de gestión de riesgos

Aplicación web para registrar, evaluar y gestionar los riesgos de una organización ficticia, presentando medidas de protección comprensibles para la dirección.

## Procedimientos del paso 1

- Se comprobó que la carpeta de trabajo era accesible y que contenía un repositorio Git.
- Se verificó la disponibilidad de Git, Node.js y npm en el entorno Windows:
  - Git `2.55.0.windows.5`
  - Node.js `v24.21.0`
  - npm `11.19.0`, ejecutado mediante `npm.cmd` porque PowerShell bloquea `npm.ps1`.
- Se configuró la rama local `chatgpt` para desarrollar sobre `origin/chatgpt`.
- No se instalaron herramientas ni dependencias.
- No se creó todavía la aplicación.
- No se consultaron archivos de credenciales, contraseñas ni variables de entorno.

## Objetivo del proyecto

Construir por etapas una aplicación web para identificar, evaluar y comunicar riesgos de una organización ficticia, con medidas de protección comprensibles para dirección. El proyecto está preparado para futuros despliegues Preview en Vercel y no integra IA.

## Fase 2: aplicación mínima

Esta fase incorpora una aplicación mínima con Next.js, React y TypeScript. La página inicial está en español e incluye el título, la descripción y el aviso académico solicitados. Todavía no hay base de datos, autenticación ni servicios de IA.

### Requisitos

- Node.js 20.9 o posterior
- npm

### Instalación y ejecución local

```bash
npm install
npm run dev
```

Después, abre `http://localhost:3000` en el navegador.

### Construcción de producción

```bash
npm run build
npm start
```

## Subir a un repositorio privado de GitHub

Desde la raíz del proyecto, configura el remoto privado y sube la rama de desarrollo:

```bash
git add .
git commit -m "Crear aplicación mínima con Next.js"
git remote set-url origin https://github.com/USUARIO/REPOSITORIO.git
git push -u origin chatgpt
```

El repositorio debe crearse previamente como privado en GitHub. Git solicitará autenticación mediante el método configurado en el equipo; no se deben escribir contraseñas ni tokens en este README.
