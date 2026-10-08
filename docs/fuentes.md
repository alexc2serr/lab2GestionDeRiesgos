# Fuentes oficiales consultadas

Fecha de consulta de todas las fuentes: **8 de octubre de 2026**.

Estas referencias se utilizan como orientación para el laboratorio. Los resúmenes son propios y no reproducen los documentos completos.

## Esquema Nacional de Seguridad (ENS)

- **Título:** Real Decreto 311/2022, de 3 de mayo, por el que se regula el Esquema Nacional de Seguridad.
- **Revisión o versión consultada:** texto consolidado; la ficha del BOE indica última actualización publicada el 6 de noviembre de 2024. El texto consolidado tiene carácter informativo y debe contrastarse con la publicación oficial para usos jurídicos.
- **Fecha de consulta:** 8 de octubre de 2026.
- **Enlace:** [BOE-A-2022-7191](https://www.boe.es/buscar/act.php?id=BOE-A-2022-7191)
- **Apartados utilizados:** artículo 12 y medidas del anexo II, especialmente `op.acc.4` (proceso de gestión de derechos de acceso), `op.exp.2` (configuración de seguridad), `op.exp.5` (gestión de cambios), `op.exp.8` (registro de la actividad), `mp.sw.1` (desarrollo de aplicaciones) y `mp.sw.2` (aceptación y puesta en servicio).
- **Resumen propio:** El ENS plantea la seguridad como un proceso basado en riesgos y exige controlar los accesos, aplicar mínimo privilegio, mantener configuraciones seguras, gestionar los cambios y comprobar las aplicaciones antes de ponerlas en servicio. El anexo II concreta medidas y refuerzos que dependen de la categoría del sistema.
- **Alcance de uso en este laboratorio:** se emplean los apartados como referencias didácticas para requisitos de una aplicación ficticia; no se determina el ámbito jurídico ni la categoría ENS del proyecto.

## NIST SP 800-53 Rev. 5

- **Título:** Security and Privacy Controls for Information Systems and Organizations.
- **Revisión o versión consultada:** SP 800-53 Revision 5, ficha final de NIST publicada en septiembre de 2020 e indicada con actualizaciones de 10 de diciembre de 2020. La ficha consultada también anuncia una versión menor 5.2.0 publicada posteriormente; los requisitos de esta fase citan expresamente controles de Rev. 5, sin afirmar que cubran la versión 5.2.0 completa.
- **Fecha de consulta:** 8 de octubre de 2026.
- **Enlace:** [NIST SP 800-53 Rev. 5](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final)
- **Apartados utilizados:** `IA-5` (Authenticator Management), `AC-6` (Least Privilege) y `SI-10` (Information Input Validation).
- **Resumen propio:** NIST presenta un catálogo flexible de controles de seguridad y privacidad que debe adaptarse al contexto y al análisis de riesgos. Para este laboratorio se toman como orientación la protección y gestión de autenticadores, la limitación de privilegios y la validación de datos de entrada.
- **Alcance de uso en este laboratorio:** los controles se usan como referencias concretas para requisitos académicos seleccionados, no como una selección completa de controles ni como una evaluación NIST.

## Condiciones de uso de NIST

- **Título:** Copyright, Fair Use, and Licensing Statements for SRD, Data, Software, and Technical Series Publications.
- **Revisión o versión consultada:** página de condiciones y recomendaciones de citación de NIST; la página indica que fue actualizada el 24 de junio de 2025.
- **Fecha de consulta:** 8 de octubre de 2026.
- **Enlace:** [Condiciones de uso y citación de NIST](https://www.nist.gov/open/copyright-fair-use-and-licensing-statements-srd-data-software-and-technical-series-publications)
- **Apartados utilizados:** “Fair Use of Other NIST Data/Works”, “NIST Technical Series Publications” y “Citation Recommendations”.
- **Resumen propio:** NIST distingue entre datos de referencia, obras y publicaciones técnicas. Para publicaciones técnicas de autores de NIST explica las condiciones generales de reutilización y recomienda identificar autoría, título, serie, identificador o URL y fecha de acceso, además de reconocer la fuente.
- **Aplicación en este repositorio:** se enlazan las fuentes oficiales, se indica la fecha de consulta y se redactan resúmenes propios. No se incorporan copias completas ni materiales de NIST al código.

## Nota de alcance

Esta selección es una **adaptación didáctica** para una práctica académica. No acredita conformidad completa con el ENS, NIST SP 800-53 ni con ninguna certificación o auditoría. La aplicación de los marcos reales requeriría, entre otros aspectos, definir el alcance, realizar un análisis de riesgos, seleccionar controles aplicables, establecer responsables y aportar evidencias suficientes.
