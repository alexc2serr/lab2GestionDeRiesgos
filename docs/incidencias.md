# Registro de Incidencias de Seguridad

Este documento registra los incidentes de seguridad que hayan podido ocurrir durante el ciclo de vida del proyecto (por ejemplo, exposición accidental de una credencial en commits, logs o capturas), detallando la fecha, el activo o secreto comprometido, la acción inmediata de revocación/rotación y la lección aprendida.

> **Norma de evaluación del laboratorio:** *"Si exponéis una credencial por error: revocadla o cambiadla de inmediato y anotadlo en docs/incidencias.md. Borrarla del último archivo no elimina la exposición. Declarar el incidente se valora; ocultarlo, no."*

---

## Estado Actual de Incidencias

* **Total de incidencias registradas:** 0
* **Estado del repositorio:** Limpio y verificado contra filtraciones de secretos mediante Gitleaks y auditoría manual de commits.
* **Política de credenciales:** Todas las claves reales han permanecido en la bóveda de Bitwarden y en `.env.local` (excluido de Git), sin que la IA ni el historial hayan tenido acceso a secretos reales.

---

## Plantilla para Registro de Incidentes (en caso de producirse)

```markdown
### Incidencia INC-[Número]
* **Fecha y hora de detección:** AAAA-MM-DD HH:MM
* **Secreto o activo comprometido:** (ej. DATABASE_URL, ADMIN_API_KEY, etc.)
* **Canal de exposición:** (ej. commit inadvertido en Git, captura de pantalla compartida, log de consola)
* **Medidas inmediatas de mitigación:**
  1. Revocación inmediata de la credencial en el proveedor (Neon / Vercel / Bitwarden).
  2. Generación de un nuevo secreto seguro en Bitwarden.
  3. Actualización de variables de entorno en .env.local y en Vercel Preview.
  4. Invalidación de sesiones y comprobación de integridad.
* **Lección aprendida y prevención futura:** (ej. verificación previa con 'git status' y 'git diff' antes de hacer commit).
```
