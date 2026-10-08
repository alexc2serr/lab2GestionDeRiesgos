# Despliegue Preview

- **Proyecto Vercel:** `laboratorio2-riesgos`
- **Entorno:** Preview
- **URL:** [laboratorio2-riesgos-oz3q5vscy-tomasjuanuson-9831.vercel.app](https://laboratorio2-riesgos-oz3q5vscy-tomasjuanuson-9831.vercel.app)
- **Inspección:** [despliegue en Vercel](https://vercel.com/tomasjuanuson-9831/laboratorio2-riesgos/B26Cyeo8WGQDfcf6bTih62mFsVGL)
- **Fecha:** 8 de octubre de 2026
- **Commit de origen:** `5ebcd3361726a398f4db86f4d4e2d12fd4e91293`
- **CLI:** Vercel CLI `63.1.0`
- **Resultado:** despliegue listo; compilación de Next.js y TypeScript correctas.

## Comprobación de la página

La comprobación autenticada mediante la CLI oficial confirmó que la respuesta HTML contiene los tres textos requeridos:

- `Laboratorio de gestión de riesgos`
- `Identificar, evaluar y comunicar riesgos para priorizar medidas de protección`
- `Caso académico con datos ficticios`

El despliegue se realizó con `--target=preview` y sin `--prod`. El primer despliegue del proyecto fue creado automáticamente por Vercel como producción; se retiró después y se conservó únicamente el despliegue Preview indicado arriba.

## Seguridad de la subida

- `.vercel/` permanece excluido por `.gitignore`.
- `.env.local` permanece excluido por `.gitignore` y no se leyó ni registró su contenido.
- `node_modules/` y `.next/` permanecen excluidos.
- La revisión de patrones conocidos de credenciales no encontró coincidencias en los archivos del proyecto.
- GitHub no quedó conectado; el intento automático de detección de la CLI falló porque no había una conexión GitHub configurada.
