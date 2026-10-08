# Despliegue Preview

- **Proyecto Vercel:** `laboratorio2-riesgos`
- **Entorno:** Preview
- **URL:** [laboratorio2-riesgos-j8c8jknhk-tomasjuanuson-9831.vercel.app](https://laboratorio2-riesgos-j8c8jknhk-tomasjuanuson-9831.vercel.app)
- **Inspección:** [despliegue en Vercel](https://vercel.com/tomasjuanuson-9831/laboratorio2-riesgos/6xqY2PGv2rKnJyqLhLvDf9k637aR)
- **Fecha:** 8 de octubre de 2026
- **Commit de origen:** `a7847aa`
- **CLI:** Vercel CLI `63.1.0`
- **Resultado:** despliegue listo; compilación de Next.js y TypeScript correctas; comprobación de contenido correcta.

## Comprobación de la página

La comprobación autenticada mediante la CLI oficial confirmó que la respuesta HTML contiene los tres textos requeridos de la fase anterior y el nuevo contexto:

- `Laboratorio de gestión de riesgos`
- `Identificar, evaluar y comunicar riesgos para priorizar medidas de protección`
- `Caso académico con datos ficticios`
- `Organización y objetivo`
- `Condiciones del caso`
- `Cómo evaluaremos los riesgos`
- `Academia Horizonte`
- `próxima campaña de matrícula`

El despliegue se realizó con `--target=preview` y sin `--prod`. El despliegue está marcado por Vercel con `target: preview` y estado `Ready`.

## Seguridad de la subida

- `.vercel/` permanece excluido por `.gitignore`.
- `.env.local` permanece excluido por `.gitignore` y no se leyó ni registró su contenido.
- `node_modules/` y `.next/` permanecen excluidos.
- La revisión de patrones conocidos de credenciales no encontró coincidencias en los archivos del proyecto.
- GitHub no quedó conectado; el intento automático de detección de la CLI falló porque no había una conexión GitHub configurada.
