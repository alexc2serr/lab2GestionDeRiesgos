# Evaluación de Riesgos y Propuesta de Medidas de Protección

Este documento detalla la evaluación cualitativa y cuantitativa de los dos riesgos principales identificados para la **Academia Horizonte**, la asignación de medidas técnicas de protección alineadas con los marcos **ENS** y **NIST SP 800-53 Rev. 5**, la verificación de su eficacia técnica y la justificación estratégica para la alta dirección.

---

## 1. Escenario 1 (RSG-001): Fallo de Almacenamiento y Copias no Verificadas

### Formulación Sintáctica Guiada
> *«Debido a que **no se ha probado la restauración de las copias**, un **fallo del almacenamiento** podría provocar la **pérdida de acceso a los registros confirmados** sobre la **base de datos**, causando la **imposibilidad de reconstruir parte de las matrículas** y afectando al objetivo de **conservar y recuperar registros**, en el proceso de **matrícula**».*

### Evaluación Numérica y Justificación Fundamentada
* **Probabilidad:** `2 - Media`  
  * *Justificación:* La campaña de matrícula concentra un alto volumen de transacciones en una ventana crítica de tan solo siete días sobre una única instancia de almacenamiento. Pese a que se generan copias de seguridad de forma rutinaria, la ausencia total de simulacros previos de restauración en entornos de prueba impide catalogar un fallo como poco probable.
* **Impacto:** `3 - Grave`  
  * *Justificación:* Un incidente de corrupción o avería física en el almacenamiento que no pueda revertirse provoca la pérdida irrecuperable de matrículas formalizadas y pagadas, impidiendo cumplir el objetivo central de la organización y dañando gravemente su viabilidad operativa.
* **Puntuación de Riesgo:** $2 \times 3 =$ **`6`** $\rightarrow$ **Nivel Alto (Urgente)**.

### Propuesta de Medida de Protección
* **Medida concreta:** Implantar un protocolo automatizado y periódico de restauración de copias de seguridad (Backups) en un entorno de contingencia aislado, verificando la integridad de los datos mediante firmas criptográficas (checksums SHA-256).
* **Controles asociados:**
  * **ENS Anexo II:** `mp.info.2` (Copias de seguridad) y `op.exp.8` (Continuidad del servicio).
  * **NIST SP 800-53 Rev. 5:** `CP-4` (Contingency Plan Testing) y `CP-9` (System Backup).
* **Prioridad:** `Alta`.
* **Forma de comprobar su eficacia técnica:**
  * Realizar un simulacro de recuperación completa en un servidor de pruebas partiendo del último backup generado.
  * Ejecutar un script automatizado de auditoría que compare el número de registros y sus hashes frente a la base de datos origen.
  * **Criterio de éxito:** 100% de registros recuperados e íntegros en un tiempo de recuperación (RTO) inferior a 2 horas.

---

## 2. Escenario 2 (RSG-002): Permisos Administrativos Excesivos en Base de Datos

### Formulación Sintáctica Guiada
> *«Debido a que **la cuenta que utiliza la aplicación tiene permisos administrativos sobre la base de datos**, un **error de lógica en la aplicación o inyección SQL maliciosa** podría provocar la **modificación o borrado no autorizado de tablas de matrículas** sobre la **base de datos de matrículas**, causando **corrupción masiva del censo de admitidos e indisponibilidad del servicio** y afectando al objetivo de **conservar y recuperar registros**, en el proceso de **matrícula**».*

### Evaluación Numérica y Justificación Fundamentada
* **Probabilidad:** `2 - Media`  
  * *Justificación:* La aplicación web está expuesta públicamente a Internet durante los 7 días de campaña. La concesión de permisos de superusuario/administrador a la cuenta de servicio de la app amplifica exponencialmente el impacto de cualquier defecto de programación o ataque.
* **Impacto:** `3 - Grave`  
  * *Justificación:* La ejecución no intencionada o maliciosa de sentencias destructivas (`DROP TABLE`, `TRUNCATE`, `ALTER`) puede vaciar o alterar el censo de estudiantes en cuestión de milisegundos, paralizando el proceso de admisión.
* **Puntuación de Riesgo:** $2 \times 3 =$ **`6`** $\rightarrow$ **Nivel Alto (Urgente)**.

### Propuesta de Medida de Protección
* **Medida concreta:** Aplicar de forma estricta el **principio de mínimo privilegio (Least Privilege)**, creando un usuario de base de datos específico para la aplicación web con permisos restringidos exclusivamente a operaciones DML (`SELECT`, `INSERT`, `UPDATE` en las tablas requeridas) y revocando de forma absoluta cualquier permiso administrativo o DDL (`DROP`, `ALTER`, `CREATE`, `GRANT`).
* **Controles asociados:**
  * **ENS Anexo II:** `op.acc.4` (Control de acceso) y `mp.sw.1` (Software seguro).
  * **NIST SP 800-53 Rev. 5:** `AC-6` (Least Privilege - Privilegio mínimo).
  * **Requisito académico del proyecto:** **SEG-04** (Mínimo privilegio para la cuenta de base de datos).
* **Prioridad:** `Alta`.
* **Forma de comprobar su eficacia técnica:**
  * Ejecutar una prueba de penetración técnica intentando lanzar consultas `DROP TABLE matriculas;` autenticados como la cuenta de la aplicación web.
  * **Criterio de éxito:** El motor de base de datos debe rechazar inmediatamente la instrucción con un error de permisos insuficientes (`permission denied for relation/table`), impidiendo cualquier daño estructural al esquema.

---

## 3. Pregunta de Cierre para la Alta Dirección

> **Pregunta:** *«Si la dirección solo pudiera aprobar una de vuestras medidas, ¿cuál recomendaríais primero y cómo comprobaríais que protege el objetivo afectado?»*

### Recomendación Estratégica: Medida 1 (Restauración Verificada de Copias de Seguridad)

#### 1. Razón de la elección
Aunque ambas medidas abordan riesgos de nivel Alto (puntuación 6), **la Medida 1 (Restauración de copias) es la salvaguarda definitiva de último recurso ante cualquier contingencia imprevista**:
* La Medida 2 (Mínimo privilegio) previene una causa concreta de fallo (modificación indebida a través de la aplicación), pero no protege a la academia ante fallos mecánicos de disco, caídas del proveedor de hosting, ransomware o catástrofes físicas.
* La Medida 1 es agnóstica a la causa: ante *cualquier desastre* que destruya la base de datos principal durante los 7 días de campaña, unas copias cuya restauración haya sido fehacientemente comprobada garantizan la **supervivencia del negocio**. Sin copias recuperables, la pérdida de datos es definitiva e irresoluble.

#### 2. Procedimiento de comprobación ante la Dirección
Para demostrar de forma concluyente a la dirección que la medida protege el objetivo de *«conservar y recuperar registros confirmados»*:
1. Se establece un entorno de contingencia idéntico al de producción pero aislado de la red pública.
2. Se programa un simulacro periódico donde se inyecta el backup más reciente.
3. Se ejecuta una batería de pruebas de integridad:
   * Verificación del total de expedientes recuperados (cero pérdidas respecto a la base de datos original).
   * Verificación de sumas de comprobación (hash criptográfico de los registros).
   * Verificación del tiempo de recuperación (RTO): el sistema debe estar listo para operar en menos de 2 horas.
4. **Evidencia para Dirección:** Un informe ejecutivo mensual con los resultados de la prueba de restauración y la firma del responsable técnico certificando que el objetivo está blindado.

---

## 4. Regla Metodológica: No Reducción Automática del Riesgo

> ⚠️ **Aviso Metodológico:**  
> En la metodología de este laboratorio, **la mera propuesta o diseño de una medida de protección NO reduce automáticamente la puntuación de riesgo**.  
> El riesgo residual solo podrá recalcularse a la baja una vez que la medida haya sido técnicamente desplegada en el entorno y su eficacia haya sido corroborada mediante las pruebas de aceptación documentadas.
