# Requisitos académicos de seguridad

Estos requisitos definen el objetivo de seguridad de la práctica. Las referencias indicadas son orientativas y no implican que el requisito sea una transcripción ni que exista una correspondencia uno a uno. Todos parten del estado inicial **pendiente**.

## SEG-01 — Secretos fuera del código y del historial de Git

- **Finalidad:** evitar que credenciales, tokens, claves o contraseñas queden expuestos en el código fuente o en commits.
- **Referencia concreta:** requisito propio del laboratorio. Como orientación, NIST `IA-5` trata la protección y gestión de autenticadores; no prescribe por sí solo un procedimiento Git concreto.
- **Implementación prevista:** usar variables de entorno o un gestor de secretos para valores sensibles; mantener solo una plantilla `.env.example` sin secretos; revisar cambios antes de confirmar y documentar la revocación si se filtra un secreto.
- **Prueba de aceptación:** buscar patrones de secretos en los archivos versionados y en el historial del commit; comprobar que `.env.example` contiene únicamente nombres o ejemplos no utilizables.
- **Evidencia esperada:** salida de la revisión de secretos, `.gitignore`, `.env.example` sin valores sensibles y registro del resultado de la comprobación.
- **Estado inicial:** pendiente.

## SEG-02 — Secretos de servidor fuera del navegador, las respuestas y los registros

- **Finalidad:** impedir que un secreto de servidor llegue al cliente, a una respuesta HTTP o a un log.
- **Referencia concreta:** requisito propio del laboratorio. `IA-5` respalda de forma general la protección de autenticadores, pero no se fuerza una equivalencia específica con el flujo de una aplicación Next.js.
- **Implementación prevista:** leer secretos solo en código de servidor; no exponerlos mediante props, HTML, endpoints, mensajes de error ni logs; revisar la separación entre componentes de servidor y cliente.
- **Prueba de aceptación:** inspeccionar el HTML y las respuestas de las rutas, ejecutar una prueba con un secreto ficticio y revisar los logs para confirmar que no aparece.
- **Evidencia esperada:** prueba automatizada o manual con respuesta capturada, revisión de logs y explicación de qué código se ejecuta solo en servidor.
- **Estado inicial:** pendiente.

## SEG-03 — Autorización en el servidor para modificar datos

- **Finalidad:** evitar que un cliente pueda modificar datos únicamente manipulando la interfaz o la petición.
- **Referencia concreta:** adaptación propia del laboratorio, orientada por ENS `op.acc.4`: el acceso debe estar prohibido salvo autorización expresa y los permisos deben asignarse según la función.
- **Implementación prevista:** comprobar identidad, rol y autorización en cada operación de escritura del servidor; no confiar en controles de interfaz; devolver respuestas uniformes ante intentos no autorizados.
- **Prueba de aceptación:** enviar directamente una petición de modificación sin sesión, con un rol insuficiente y con datos de otro usuario; ninguna debe alterar datos.
- **Evidencia esperada:** pruebas de autorización, código o configuración de la comprobación server-side y registro de respuestas esperadas.
- **Estado inicial:** pendiente.

## SEG-04 — Mínimo privilegio para la cuenta de base de datos

- **Finalidad:** limitar el impacto de una credencial de base de datos comprometida o de un error de aplicación.
- **Referencia concreta:** ENS `op.acc.4.2` establece el mínimo privilegio; NIST `AC-6` trata el principio de Least Privilege. La aplicación todavía no tiene base de datos, por lo que la verificación queda aplazada.
- **Implementación prevista:** crear una cuenta por entorno y servicio con solo los permisos necesarios; separar lectura y escritura cuando sea viable; evitar cuentas de administración en la aplicación.
- **Prueba de aceptación:** enumerar los permisos efectivos de la cuenta y comprobar que no puede realizar operaciones administrativas o ajenas a su función.
- **Evidencia esperada:** definición de roles o permisos por entorno, resultado de una prueba de acceso y documentación de la cuenta utilizada.
- **Estado inicial:** pendiente.

## SEG-05 — Validación de entradas en el servidor

- **Finalidad:** rechazar datos ausentes, malformados, excesivos o no permitidos antes de procesarlos o persistirlos.
- **Referencia concreta:** NIST `SI-10` (Information Input Validation). La asociación es de orientación para la validación de entradas, no una declaración de cumplimiento del control completo.
- **Implementación prevista:** definir esquemas de validación en el servidor para cada entrada; comprobar tipos, longitudes, rangos y valores permitidos; normalizar o rechazar entradas según el caso.
- **Prueba de aceptación:** probar entradas válidas, vacías, con tipos incorrectos, fuera de rango y con contenido inesperado; las inválidas deben rechazarse sin modificar datos.
- **Evidencia esperada:** esquemas o funciones de validación, conjunto de casos de prueba y resultados de respuestas de error.
- **Estado inicial:** pendiente.

## SEG-06 — Separación de configuración y datos entre desarrollo, Preview y producción

- **Finalidad:** impedir que un cambio o dato de un entorno afecte accidentalmente a otro y evitar el uso de secretos de producción durante el desarrollo.
- **Referencia concreta:** requisito propio del laboratorio. ENS `op.exp.2` orienta sobre configuración segura y mínima funcionalidad, pero no define por sí solo la configuración concreta de Vercel para este proyecto.
- **Implementación prevista:** mantener variables y recursos separados por entorno; documentar qué configuración requiere cada entorno; no reutilizar bases de datos ni secretos de producción en desarrollo o Preview.
- **Prueba de aceptación:** comprobar que cada entorno resuelve sus variables y recursos esperados y que una operación de prueba en Preview no aparece en producción.
- **Evidencia esperada:** matriz de configuración por entorno sin secretos, configuración de despliegue y prueba de aislamiento.
- **Estado inicial:** pendiente.

## SEG-07 — Errores sin credenciales ni detalles internos sensibles

- **Finalidad:** reducir la información útil para un atacante y evitar la filtración accidental de secretos, consultas, rutas internas o trazas.
- **Referencia concreta:** requisito propio del laboratorio. No se fuerza una asociación directa con `SI-10`, porque ese control se refiere a validación de entradas y no a la presentación de errores.
- **Implementación prevista:** mostrar mensajes generales al cliente; registrar detalles técnicos solo en canales protegidos y sin secretos; usar identificadores de correlación cuando sea necesario investigar un fallo.
- **Prueba de aceptación:** provocar errores de validación, autenticación y servidor; comprobar que las respuestas no contienen credenciales, trazas, consultas ni rutas internas.
- **Evidencia esperada:** respuestas capturadas, revisión de logs y casos de prueba de errores.
- **Estado inicial:** pendiente.

## SEG-08 — Trazabilidad entre cambios, pruebas y despliegues

- **Finalidad:** poder relacionar cada cambio con su revisión, las pruebas realizadas y el despliegue que lo contiene.
- **Referencia concreta:** requisito propio del laboratorio, orientado por ENS `mp.sw.1` (desarrollo de aplicaciones) y por la gestión documentada de cambios del ENS. No acredita una auditoría completa del ciclo de vida.
- **Implementación prevista:** usar commits descriptivos, revisión de cambios, pruebas asociadas y referencias al despliegue Preview o producción; conservar un registro mínimo de resultados y decisiones.
- **Prueba de aceptación:** seleccionar un cambio y reconstruir desde Git qué pruebas lo validaron y en qué despliegue se verificó.
- **Evidencia esperada:** commit, revisión o pull request, resultados de pruebas, identificador de despliegue y registro de aceptación.
- **Estado inicial:** pendiente.

## Decisiones pendientes

- Configurar la integración de Upstash Redis en Vercel y crear la separación de datos por entorno.
- Elegir e implementar el mecanismo de autenticación; el catálogo inicial de roles ya está definido.
- Determinar los recursos y variables separados para desarrollo, Preview y producción.
- Seleccionar las pruebas automatizadas y el procedimiento de revisión de secretos.
- Establecer el formato definitivo de evidencias y trazabilidad de los despliegues.
