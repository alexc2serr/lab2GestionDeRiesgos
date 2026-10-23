# Metodología y Reglas Didácticas de Evaluación de Riesgos

Este documento establece los criterios, escalas cuantitativas/cualitativas y reglas operativas utilizadas en el laboratorio para la evaluación y priorización de riesgos.

---

## 1. Horizonte Temporal de Evaluación
El análisis de riesgos se circunscribe temporalmente a la **próxima campaña de matrícula** de la Academia Horizonte, cuya duración operativa es de siete días consecutivos.

---

## 2. Escala de Probabilidad (1 a 3)

| Valor | Nivel | Criterio y Descripción Didáctica |
| :---: | :--- | :--- |
| **1** | **Baja** | Existen razones justificadas y verificables para considerar poco probable que el evento ocurra durante los siete días de la campaña. |
| **2** | **Media** | El evento es plausible y las condiciones disponibles no permiten catalogarlo de forma fundamentada como poco probable. |
| **3** | **Alta** | Existen indicios concretos, precedentes o condiciones de vulnerabilidad manifiesta que hacen probable que el evento se materialice durante la campaña. |

---

## 3. Escala de Impacto (1 a 3)

| Valor | Nivel | Criterio y Descripción Didáctica |
| :---: | :--- | :--- |
| **1** | **Menor** | Incidencia limitada que no compromete el plazo final de matriculación ni provoca la pérdida de registros confirmados. |
| **2** | **Significativo** | Provoca una interrupción temporal del servicio o requiere labores relevantes de recuperación, pero los objetivos de la campaña aún pueden alcanzarse. |
| **3** | **Grave** | Impide completar las solicitudes de admisión en plazo o provoca la pérdida no recuperable de registros de matrícula confirmados. |

---

## 4. Puntuación y Clasificación del Nivel de Riesgo

El nivel de riesgo se cuantifica mediante el producto directo de la probabilidad y el impacto:
$$\text{Puntuación de Riesgo} = \text{Probabilidad} \times \text{Impacto}$$

Los valores resultantes (rango 1 a 9) se clasifican en los siguientes umbrales:
* **Bajo (1 a 2):** Puntuaciones 1 y 2. El riesgo es asumible con supervisión rutinaria.
* **Medio (3 a 4):** Puntuaciones 3 y 4. Requiere planificación de medidas correctoras en el corto-medio plazo.
* **Alto (6 a 9):** Puntuaciones 6 y 9 (no existe valor 5 ni 7/8 dada la matriz de $1..3 \times 1..3$). Requiere atención prioritaria e implantación urgente de medidas de protección.

### 4.1. Las Nueve Combinaciones de Probabilidad e Impacto (Prompt 8)

Calculadas unívocamente por la función de servidor (`lib/calculoRiesgo.ts`):

| Combinación | Probabilidad ($P$) | Impacto ($I$) | Puntuación ($P \times I$) | Nivel Asignado | Categoría de Acción |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **1** | 1 (Baja) | 1 (Menor) | **1** | 🟢 **Bajo** | Asumible / Supervisión ordinaria |
| **2** | 1 (Baja) | 2 (Significativo) | **2** | 🟢 **Bajo** | Asumible / Supervisión ordinaria |
| **3** | 1 (Baja) | 3 (Grave) | **3** | 🟡 **Medio** | Mitigación planificada |
| **4** | 2 (Media) | 1 (Menor) | **2** | 🟢 **Bajo** | Asumible / Supervisión ordinaria |
| **5** | 2 (Media) | 2 (Significativo) | **4** | 🟡 **Medio** | Mitigación planificada |
| **6** | 2 (Media) | 3 (Grave) | **6** | 🔴 **Alto** | Atención prioritaria e inmediata |
| **7** | 3 (Alta) | 1 (Menor) | **3** | 🟡 **Medio** | Mitigación planificada |
| **8** | 3 (Alta) | 2 (Significativo) | **6** | 🔴 **Alto** | Atención prioritaria e inmediata |
| **9** | 3 (Alta) | 3 (Grave) | **9** | 🔴 **Alto** | Atención prioritaria e inmediata |

---

## 5. Reglas Metodológicas del Ejercicio

1. **Obligatoriedad de justificación:** Toda asignación numérica de probabilidad e impacto debe acompañarse de una justificación razonada basada en las condiciones conocidas del caso.
2. **Tratamiento de la incertidumbre:** La falta de información o la ausencia de datos no debe convertirse de forma automática en una probabilidad alta; en su lugar, se registrará explícitamente como **supuesto o información pendiente**.
3. **No reducción automática del riesgo:** La simple propuesta o diseño de una medida de protección **no reduce automáticamente la puntuación del riesgo**. Para actualizar la valoración formal, es requisito indispensable que la medida haya sido técnicamente implantada y su eficacia haya sido verificada mediante pruebas objetivas.
4. **Marco didáctico:** Estas escalas, fórmulas y umbrales son reglas propias diseñadas para este laboratorio docente; **no constituyen una fórmula ni metodología formalmente atribuible al ENS ni al NIST SP 800-53**.

