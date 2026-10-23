# Documentación del Modelo y Persistencia en Base de Datos (PostgreSQL / Neon)

Este documento describe la arquitectura de persistencia, el modelo de datos de la tabla `riesgos`, la segregación de cuentas según el principio de mínimo privilegio (**SEG-04**) y el procedimiento para la aplicación de migraciones en la plataforma de la **Academia Horizonte**.

---

## 1. Modelo de Datos: Tabla `riesgos`

La tabla almacena todos los atributos necesarios para la formulación sintáctica de escenarios de riesgo, su evaluación según las escalas didácticas del laboratorio, las medidas de protección propuestas y la trazabilidad temporal.

| Campo | Tipo SQL | Restricciones / Validación | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(50)` | `PRIMARY KEY` | Identificador único del riesgo (ej. `RSG-001`, `RSG-002`). |
| `proceso` | `VARCHAR(80)` | `NOT NULL` | Proceso de negocio analizado (ej. "matrícula"). |
| `activo` | `VARCHAR(80)` | `NOT NULL` | Activo afectado ("plataforma web", "base de datos", "copias de seguridad"). |
| `objetivo` | `VARCHAR(100)` | `NOT NULL` | Objetivo comprometido ("completar solicitudes en plazo", "conservar y recuperar registros"). |
| `condicion` | `TEXT` | `NOT NULL` | Debilidad o vulnerabilidad conocida que predispone al daño. |
| `amenaza` | `TEXT` | `NOT NULL` | Agente o evento potencial causante del daño. |
| `evento` | `TEXT` | `NOT NULL` | Suceso concreto que materializa el riesgo. |
| `consecuencia` | `TEXT` | `NOT NULL` | Impacto directo sobre la organización y el servicio. |
| `supuestos` | `TEXT` | `NULL` | Supuestos de partida o información pendiente (opcional). |
| `probabilidad` | `SMALLINT` | `CHECK (1..3)` | Probabilidad didáctica (1=Baja, 2=Media, 3=Alta). |
| `justificacion_probabilidad` | `TEXT` | `NOT NULL` | Justificación obligatoria de la probabilidad asignada. |
| `impacto` | `SMALLINT` | `CHECK (1..3)` | Impacto didáctico (1=Menor, 2=Significativo, 3=Grave). |
| `justificacion_impacto` | `TEXT` | `NOT NULL` | Justificación obligatoria del impacto estimado. |
| `puntuacion` | `SMALLINT` | `CHECK (p = p * i)` | Producto calculado estrictamente en el backend ($P \times I$). |
| `nivel` | `VARCHAR(20)` | `CHECK ('Bajo', 'Medio', 'Alto')` | Nivel resultante (Bajo 1-2, Medio 3-4, Alto 6-9). |
| `medida` | `TEXT` | `NOT NULL` | Descripción de la salvaguarda o control técnico propuesto. |
| `prioridad` | `VARCHAR(20)` | `CHECK ('Baja', 'Media', 'Alta')` | Prioridad asignada para la implantación de la medida. |
| `comprobacion_eficacia` | `TEXT` | `NOT NULL` | Procedimiento técnico para comprobar que la medida funciona. |
| `estado_medida` | `VARCHAR(20)` | `DEFAULT 'propuesta'` | Estado del ciclo de vida (`propuesta`, `implantada`, `verificada`). |
| `referencia_control` | `VARCHAR(120)` | `NULL` | Mapeo normativo orientativo (ENS / NIST SP 800-53 Rev. 5). |
| `fecha_creacion` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Fecha y hora de alta en el sistema. |
| `fecha_modificacion` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Fecha y hora de la última modificación (actualizada por trigger). |

---

## 2. Segregación de Cuentas y Mínimo Privilegio (SEG-04)

Siguiendo el principio de mínimo privilegio (**NIST SP 800-53 Rev. 5: AC-6** y **ENS Anexo II: op.acc.4**), se definen dos cuentas de base de datos con responsabilidades estrictamente separadas en [`db/roles.sql`](file:///db/roles.sql):

### A. Cuenta de Administración (`admin_riesgos`)
* **Uso:** Exclusivamente para la ejecución de scripts de migración de esquema DDL (`CREATE TABLE`, `ALTER TABLE`, etc.).
* **Variable de entorno asociada:** `DATABASE_URL_ADMIN`.
* **Ámbito de ejecución:** Solo en el entorno local del desarrollador o en tareas de mantenimiento puntuales.
* **Privilegios:** `ALL PRIVILEGES` sobre el esquema `public` y sus tablas y secuencias.
* **Regla de seguridad:** **NUNCA** se configura como cadena de conexión principal de la aplicación web en producción ni en Vercel.

### B. Cuenta de Aplicación (`app_riesgos`)
* **Uso:** Utilizada por el backend de la aplicación web Next.js en tiempo de ejecución para atender las solicitudes de los usuarios.
* **Variable de entorno asociada:** `DATABASE_URL`.
* **Ámbito de ejecución:** Entornos de desarrollo local y preproducción (Vercel Preview).
* **Privilegios concedidos:** Estrictamente **DML**: `SELECT`, `INSERT`, `UPDATE`, `DELETE` sobre la tabla `riesgos`.
* **Privilegios revocados / denegados:** No tiene permiso `CREATE` en el esquema, ni `DROP TABLE`, ni `ALTER TABLE`, ni `TRUNCATE`.
* **Prueba de intrusión (Verificación SEG-04):** Si un atacante inyectara un comando destructivo como `DROP TABLE riesgos;`, el motor PostgreSQL deniega la ejecución con:
  ```text
  ERROR: permission denied for table riesgos
  ```

---

## 3. Procedimiento para Aplicar las Migraciones

Las migraciones se encuentran centralizadas en el directorio [`db/`](file:///db/):
* [`db/01_crear_tabla_riesgos.sql`](file:///db/01_crear_tabla_riesgos.sql): Crea la tabla `riesgos`, trigger de auditoría temporal e inserta los riesgos de partida (`RSG-001` y `RSG-002`) de forma idempotente (`ON CONFLICT DO NOTHING`).
* [`db/roles.sql`](file:///db/roles.sql): Configura los roles `admin_riesgos` y `app_riesgos`.

### Opción 1: Aplicación mediante script de Node.js (Recomendado)
1. Asegurarse de tener configurada la variable `DATABASE_URL_ADMIN` (o `DATABASE_URL`) en el archivo `.env.local`:
   ```bash
   DATABASE_URL_ADMIN="postgresql://admin_riesgos:PASSWORD@ep-xxx.neon.tech/neondb?sslmode=require"
   ```
2. Ejecutar el script automatizado:
   ```bash
   npm run migrate
   ```

### Opción 2: Aplicación directa mediante consola SQL o psql
Conectar como usuario administrador de la base de datos y ejecutar:
```bash
psql "$DATABASE_URL_ADMIN" -f db/01_crear_tabla_riesgos.sql
psql "$DATABASE_URL_ADMIN" -f db/roles.sql
```

---

## 4. Instrucciones para el Proveedor (Neon) y Vercel

### Paso 1: En Neon (o Vercel Marketplace)
1. En el panel de Vercel (pestaña **Storage**) o en [Neon.tech](https://neon.tech), crea una base de datos PostgreSQL gratuita (ej. `bd-riesgos-neon`).
2. Copia la cadena de conexión generada y guárdala en tu gestor **Bitwarden**.
3. En la consola SQL de Neon (SQL Editor), ejecuta el contenido de [`db/01_crear_tabla_riesgos.sql`](file:///db/01_crear_tabla_riesgos.sql) para inicializar la tabla.

### Paso 2: En el Panel de Vercel
1. Ve a tu proyecto `laboratorio2-riesgos` -> **Settings** -> **Environment Variables**.
2. Añade la variable `DATABASE_URL`:
   * **Key:** `DATABASE_URL`
   * **Value:** *(Pega la cadena de conexión desde Bitwarden)*
   * **Environment:** Selecciona **Preview** y **Development**.
3. Guarda los cambios.

### Paso 3: Comprobación de Persistencia tras Recargar
1. Abre la aplicación web en el navegador.
2. Comprueba que el banner superior indica:
   *"Persistencia en Base de Datos Activa: Los riesgos guardados se sincronizan en PostgreSQL (Neon) y se mantienen al recargar la página."*
3. Observa que el listado inferior muestra los riesgos precargados (`RSG-001` y `RSG-002`).
4. Introduce o modifica un riesgo en el formulario y pulsa *Incorporar riesgo a la evaluación*.
5. Recarga la página con `F5` o `Ctrl + R`: el nuevo riesgo permanecerá visible y accesible en la tabla, demostrando la persistencia efectiva en base de datos.

