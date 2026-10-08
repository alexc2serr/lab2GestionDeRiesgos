# Fuentes Oficiales de Referencia

Este documento recopila las normas y estándares oficiales de seguridad de la información consultados para el diseño e implementación de las medidas técnicas del proyecto.

---

## 1. Esquema Nacional de Seguridad (ENS)

* **Título oficial:** Real Decreto 311/2022, de 3 de mayo, por el que se regula el Esquema Nacional de Seguridad.
* **Versión consultada:** Texto consolidado (última modificación: 4 de mayo de 2022).
* **Fecha de consulta:** 8 de octubre de 2026.
* **Enlace oficial:** [BOE-A-2022-7191](https://www.boe.es/buscar/act.php?id=BOE-A-2022-7191)
* **Apartados y medidas utilizadas (Anexo II - Medidas de Seguridad):**
  * **`op.acc.4` (Control de acceso):** Exige establecer mecanismos para verificar la identidad y permisos de los usuarios antes de autorizar el acceso o la modificación de datos del sistema.
  * **`op.exp.2` (Gestión de la configuración y segregación de entornos):** Establece la necesidad de separar adecuadamente los entornos de desarrollo, pruebas/previsualización y producción, impidiendo el uso de datos o configuraciones sensibles en entornos no productivos.
  * **`mp.sw.1` (Desarrollo y adquisición de software seguro):** Obliga a aplicar prácticas de desarrollo seguro, incluyendo la validación exhaustiva de datos de entrada y la proscripción de secretos o credenciales embebidos en el código fuente.

---

## 2. NIST Special Publication 800-53, Revision 5

* **Título oficial:** Security and Privacy Controls for Information Systems and Organizations.
* **Versión consultada:** NIST SP 800-53 Rev. 5 (con actualización upd1-final).
* **Fecha de consulta:** 8 de octubre de 2026.
* **Enlace oficial:** [NIST CSRC SP 800-53 Rev. 5](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final)
* **Controles seleccionados:**
  * **`IA-5` (Authenticator Management):** Regula la generación, custodia, rotación y protección de credenciales y autenticadores (claves, tokens, certificados) evitando su almacenamiento o transmisión en texto plano.
  * **`AC-6` (Least Privilege):** Limita los privilegios concedidos a procesos, aplicaciones y usuarios estrictamente a aquellos requeridos para ejecutar sus funciones asignadas (ej. permisos DML limitados en bases de datos).
  * **`SI-10` (Information Input Validation):** Exige que el sistema compruebe la sintaxis, longitud, tipos de datos y valores admisibles de toda entrada antes de ser procesada por el servidor, previniendo inyecciones y desbordamientos.

---

## 3. Condiciones de Uso y Propiedad Intelectual de NIST

* **Título oficial:** Copyright, Fair Use, and Licensing Statements for SRD Data, Software, and Technical Series Publications.
* **Fecha de consulta:** 8 de octubre de 2026.
* **Enlace oficial:** [NIST Technical Series Licensing](https://www.nist.gov/open/copyright-fair-use-and-licensing-statements-srd-data-software-and-technical-series-publications)
* **Condiciones aplicables:** Las publicaciones del NIST forman parte de los trabajos del Gobierno Federal de los Estados Unidos y se encuentran en el dominio público. Su uso en este laboratorio se realiza con fines estrictamente académicos, respetando la atribución de autoría y sin atribuir respaldo o certificación oficial de conformidad por parte del NIST.

---

## 4. Declaración de Alcance Didáctico

> **Aviso de cumplimiento:** La selección de medidas y controles del ENS y del NIST SP 800-53 Rev. 5 contenida en este proyecto constituye una **adaptación didáctica y orientativa** para el desarrollo del ejercicio académico. Su adopción no acredita conformidad completa ni certificación formal con ninguno de los dos marcos normativos.
