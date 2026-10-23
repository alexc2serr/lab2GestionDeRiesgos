# Registro y Resultados de Pruebas de Seguridad y Funcionamiento

> **Documento:** `docs/pruebas.md`  
> **Asignatura:** Gestión de Riesgos  
> **Laboratorio:** Laboratorio 2 · Parte 2 (Securización de la Aplicación de Análisis y Gestión de Riesgos)  
> **Fecha de ejecución:** 23 de octubre de 2026  
> **Commit evaluado:** `8c4f1aa` (Base de Fase 12) / Integración en Fase 13  
> **Comando de ejecución:** `npm test` (`tsx scripts/test-seguridad.ts`)  
> **Resultado global:** 11 / 11 pruebas superadas (**100% PASS**, 0 fallos)

---

## 1. Resumen Ejecutivo de la Suite Automatizada

La suite automatizada de pruebas implementada en [`scripts/test-seguridad.ts`](../scripts/test-seguridad.ts) cubre de forma integral los 5 casos formales de verificación de seguridad y funcionamiento exigidos por el enunciado del Laboratorio 2 (Prompt 12).

Las pruebas se ejecutan directamente en el entorno de desarrollo y en CI mediante TypeScript (`tsx`), validando tanto la lógica pura del servidor como la integridad de las capas de persistencia, autenticación, autorización y control de secretos.

```
==================================================================
RESULTADO DE LA SUITE DE PRUEBAS: 11 PASADOS, 0 FALLIDOS
🏆 TODAS LAS PRUEBAS DE SEGURIDAD Y FUNCIONAMIENTO HAN SIDO SUPERADAS (100%)
==================================================================
```

---

## 2. Detalle de los 5 Casos de Prueba

### Caso 1: Clasificación del Riesgo (Las 9 Combinaciones de $P \times I$)
- **Objetivo:** Garantizar que la función centralizada de cálculo en servidor ([`lib/calculoRiesgo.ts`](../lib/calculoRiesgo.ts)) evalúa de forma determinista y matemáticamente exacta las 9 combinaciones posibles de la matriz $3 \times 3$, asignando la puntuación $P \times I$ y el nivel cualitativo reglamentario:
  - Puntuación 1 a 2: **Bajo** (Verde)
  - Puntuación 3 a 4: **Medio** (Amarillo / Ámbar)
  - Puntuación 6 a 9: **Alto** (Rojo)
- **Método de prueba:** Invocación de `obtenerLasNueveCombinaciones()` y comparación estricta celda por celda frente a la matriz de referencia.

| Probabilidad ($P$) | Impacto ($I$) | Puntuación Obtenida ($P \times I$) | Nivel Asignado | Resultado |
|:---:|:---:|:---:|:---:|:---:|
| 1 (Baja) | 1 (Bajo) | 1 | Bajo | ✅ PASS |
| 1 (Baja) | 2 (Medio) | 2 | Bajo | ✅ PASS |
| 1 (Baja) | 3 (Alto) | 3 | Medio | ✅ PASS |
| 2 (Media) | 1 (Bajo) | 2 | Bajo | ✅ PASS |
| 2 (Media) | 2 (Medio) | 4 | Medio | ✅ PASS |
| 2 (Media) | 3 (Alto) | 6 | Alto | ✅ PASS |
| 3 (Alta) | 1 (Bajo) | 3 | Medio | ✅ PASS |
| 3 (Alta) | 2 (Medio) | 6 | Alto | ✅ PASS |
| 3 (Alta) | 3 (Alto) | 9 | Alto | ✅ PASS |

**Conclusión:** 9 de 9 combinaciones exactas sin discrepancias.

---

### Caso 2: Validación Estricta en Servidor (Requisito SEG-05)
- **Objetivo:** Verificar que el esquema de validación Zod ([`lib/validaciones.ts`](../lib/validaciones.ts)) rechaza en el servidor cargas maliciosas, incompletas o no normalizadas antes de interactuar con la base de datos o el motor de negocio.
- **Escenarios evaluados:**
  1. **Campo obligatorio vacío:** Se remitió un payload con `condicion: ""` (cadena vacía).  
     *Resultado:* `resVacio.success === false`. Rechazo formal con código Zod `too_small`. (✅ PASS)
  2. **Texto con longitud superior al límite:** Se remitió un payload con un campo `proceso` de 120 caracteres (límite máximo permitido: 80 caracteres).  
     *Resultado:* `resTextoLargo.success === false`. Rechazo formal con código Zod `too_big`. (✅ PASS)
  3. **Valor fuera del catálogo cerrado:** Se remitió un payload con un `activo: "servidor_no_permitido"` no presente en la taxonomía oficial de activos.  
     *Resultado:* `resValorFuera.success === false`. Rechazo formal con código Zod `invalid_enum_value`. (✅ PASS)

**Conclusión:** El servidor bloquea todas las mutaciones no conformes y devuelve respuestas estructuradas sin procesar datos inválidos.

---

### Caso 3: Persistencia de Datos
- **Objetivo:** Demostrar que los riesgos creados o modificados persisten de manera fiable en la base de datos (PostgreSQL / Neon) y están disponibles de inmediato para consultas y recargas posteriores.
- **Método de prueba:**
  1. Generación de un identificador único con marca temporal (`RSG-TEST-<timestamp>`).
  2. Inserción a través de la capa de almacenamiento segura `guardarRiesgoPersistente()`.
  3. Ejecución de una consulta independiente desconectada `obtenerRiesgos()`.
  4. Verificación de la presencia del registro con todos sus atributos intactos (incluyendo `efectoEsperado` y `estadoMedida`).
- **Resultado:** Registro localizado y validado con éxito. (✅ PASS)

---

### Caso 4: Control de Escritura No Autorizada (Requisito SEG-03)
- **Objetivo:** Demostrar que los usuarios anónimos o clientes sin sesión activa autenticada del perfil «gestor» no pueden crear ni modificar registros, respondiendo el servidor con `401 Unauthorized` y manteniendo intacta la base de datos.
- **Escenarios evaluados:**
  1. **Intento de mutación anónima (sin cookie ni token):**  
     *Resultado:* El middleware/servidor responde con `HTTP 401 Unauthorized`. (✅ PASS)
  2. **Intento de mutación con cookie manipulada o falsificada:**  
     *Resultado:* La verificación criptográfica HMAC-SHA256 falla de inmediato y devuelve `HTTP 401 Unauthorized`. (✅ PASS)
  3. **Invarianza del almacén:**  
     *Resultado:* El recuento total de riesgos antes de los ataques coincide exactamente con el recuento posterior ($N_{antes} = N_{despues}$). Ningún dato fue insertado o alterado. (✅ PASS)

---

### Caso 5: Control de Ausencia de Secretos (Requisitos SEG-01 y SEG-02)
- **Objetivo:** Comprobar de manera automatizada que no existen secretos ni credenciales en claro en el repositorio de Git ni en los objetos de transferencia de datos (DTOs) devueltos al cliente web.
- **Escenarios evaluados:**
  1. **Escaneo de historial y árbol de Git (`git grep`):**  
     Búsqueda automatizada de patrones de claves privadas RSA/EC/SSH (`BEGIN PRIVATE KEY`), tokens de AWS (`AKIA...`), tokens de GitHub (`ghp_...`) y claves de API de Google (`AIza...`).  
     *Resultado:* 0 coincidencias en archivos de código o configuración. (✅ PASS)
  2. **Inspección de DTOs enviados al navegador:**  
     Comprobación recursiva de campos sensibles (`password`, `secret`, `token`, `database_url`, `admin_key`, `contrasena`) en las respuestas de la API pública.  
     *Resultado:* Ningún secreto viaja al cliente web. Las credenciales se leen exclusivamente en variables de entorno del servidor. (✅ PASS)

---

## 3. Instrucciones de Reproducción

Cualquier miembro del equipo de desarrollo, auditor o evaluador puede reproducir íntegramente esta batería ejecutando en la raíz del proyecto:

```bash
# 1. Asegurar dependencias instaladas
npm install

# 2. Ejecutar la batería de pruebas
npm test

# 3. Validar compilación de producción
npm run build
```
