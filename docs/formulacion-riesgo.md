# Guía y Especificación de Formulación Guiada del Riesgo

Este documento describe la estructura sintáctica, los campos requeridos, las comprobaciones en cliente y las consideraciones de seguridad aplicadas al formulario de identificación de riesgos.

---

## 1. Estructura Sintáctica del Riesgo

La plataforma exige formular los riesgos siguiendo una cadena lógica coherente basada en la siguiente plantilla:

> *«Debido a **[condición o debilidad]**, **[amenaza]** podría provocar **[evento concreto]** sobre **[activo afectado]**, causando **[consecuencia para la organización]** y afectando al objetivo de **[objetivo afectado]**, en el proceso de **[proceso o servicio]**».*

### Diferenciación Conceptual Didáctica
Para asegurar que los elementos formen un escenario coherente, la interfaz incorpora ayudas conceptuales:
* **Condición / Debilidad:** Estado previo, carencia o vulnerabilidad conocida que facilita o predispone a que ocurra el daño (ej. *no se ha probado la restauración de las copias*).
* **Amenaza:** Factor interno o externo potencialmente dañino que puede desencadenar el incidente (ej. *fallo del almacenamiento*).
* **Evento:** Hecho o suceso concreto observable que se materializa sobre el activo (ej. *pérdida de acceso a los registros confirmados*).
* **Consecuencia:** Efecto e impacto tangible sobre el servicio, la organización y sus objetivos (ej. *imposibilidad de reconstruir parte de las matrículas*).

---

## 2. Bloques del Formulario y Comprobaciones

| Bloque | Campo | Tipo / Control | Longitud Máx. | Obligatorio | Propósito didáctico |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **A. Qué protegemos** | Proceso | Input texto | 80 caracteres | Sí | Contextualiza el servicio analizado (ej. *matrícula*). |
| | Activo afectado | Selector (`<select>`) | - | Sí | Delimita el activo (*plataforma web*, *base de datos*, *copias de seguridad*). |
| | Objetivo afectado | Selector (`<select>`) | - | Sí | Vincula el daño a los fines del negocio (*plazo* o *integridad*). |
| **B. Qué podría ocurrir** | Condición / Debilidad | Input texto | 200 caracteres | Sí | Registra la vulnerabilidad conocida de partida. |
| | Amenaza | Input texto | 150 caracteres | Sí | Identifica el agente causante del daño. |
| | Evento | Input texto | 200 caracteres | Sí | Describe el incidente concreto resultante. |
| **C. Consecuencias** | Consecuencia | Input texto | 250 caracteres | Sí | Detalla el impacto operativo sobre la academia. |
| **D. Supuestos** | Supuestos / Pendiente | Textarea | 300 caracteres | No | Registra incertidumbre sin inflar la probabilidad a nivel alto. |

---

## 3. Comprobaciones en Cliente y Experiencia de Usuario

1. **Detección interactiva de campos incompletos:** La vista previa no asume que la frase está lista mientras existan campos vacíos; destaca visualmente las piezas pendientes y muestra un listado explícito de lo que falta.
2. **Revisión humana de coherencia:** Se aclara de manera visible que la persona evaluadora es responsable de revisar la concordancia gramatical y causal de la frase.
3. **Carga de ejemplo didáctico:** Permite precargar instantáneamente el escenario del caso conocido (fallo de almacenamiento y copias no probadas) para agilizar la comprensión.
4. **Borrador volátil en memoria:** Se advierte que el formulario opera únicamente en memoria volátil de React (*«Borrador temporal. No se guarda al recargar»*). No hay persistencia en base de datos ni `localStorage`.
5. **Tratamiento como texto plano:** Todas las entradas son interpoladas como literales de texto plano por React, previniendo inyección de etiquetas HTML no seguras (XSS en cliente).

---

## 4. Estado del Requisito SEG-05 (Validación en Servidor)

> ⚠️ **Advertencia de Seguridad Normativa:**
> 
> Las comprobaciones, selectores y límites de longitud implementados en el navegador constituyen **únicamente una validación provisional orientada a la experiencia de usuario (UX)**.
> 
> Conforme al principio de defensa en profundidad (**ENS mp.sw.1** y **NIST SI-10**), el cliente web es un entorno no confiable. Por tanto:
> * **NO se marca el requisito SEG-05 como cumplido.**
> * El requisito **SEG-05** permanecerá en estado `Pendiente` hasta la **Fase 5**, donde se implementará la validación server-side estricta mediante esquemas Zod en los Route Handlers / Server Actions antes de cualquier mutación o persistencia en base de datos.

