# Caso de Estudio Ficticio: Academia Horizonte

Este documento describe el escenario, la organización, los activos críticos y las condiciones operativas evaluadas en la práctica académica de análisis y gestión de riesgos.

---

## 1. Organización y Proceso Analizado

* **Organización:** Academia Horizonte (institución educativa ficticia).
* **Proceso crítico:** Gestión de matrículas de alumnos a través de una plataforma web pública.
* **Horizonte temporal de la campaña:** La campaña de admisión tiene una duración estricta de **siete días**.

---

## 2. Objetivos de la Organización

1. **Cumplimiento de plazo:** Asegurar que todas las solicitudes de matrícula puedan recibirse y completarse satisfactoriamente dentro del plazo fijado de 7 días.
2. **Integridad y disponibilidad de la información:** Garantizar que los registros confirmados de los alumnos matriculados se conserven de manera íntegra, segura y puedan recuperarse en cualquier momento para prestar el servicio educativo.

---

## 3. Activos Identificados

* **Plataforma web:** Aplicación web accesible por los usuarios para cumplimentar los formularios de solicitud y pago/confirmación.
* **Base de datos de matrículas:** Sistema gestor de base de datos donde se almacenan las solicitudes recibidas, estados de tramitación y datos personales de los solicitantes.
* **Copias de seguridad (Backups):** Copias periódicas generadas para permitir la recuperación ante desastres o corrupciones de información.

---

## 4. Condiciones Operativas Conocidas

1. **Instancia única y copias no verificadas:** Existe una única instancia activa del servidor de base de datos y **no se han llevado a cabo pruebas periódicas de restauración** a partir de las copias de seguridad existentes.
2. **Exceso de privilegios en la aplicación:** La cuenta de usuario que utiliza la aplicación web para interactuar con el motor de base de datos cuenta con **permisos administrativos completos (DDL/DML)**, contraviniendo el principio de mínimo privilegio.

---

## ⚠️ Aclaración de Ámbito Ficticio

> **Advertencia de seguridad:** La organización, debilidades y condiciones operativas descritas en este documento corresponden exclusivamente a un **escenario ficticio formulado con propósitos didácticos**. No representan ni describen la configuración técnica real, la infraestructura ni las políticas de seguridad implementadas en este proyecto de software ni en ningún sistema productivo existente.

