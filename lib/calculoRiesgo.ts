/**
 * Módulo de Servidor: Cálculo de Evaluación y Nivel de Riesgo (Prompt 8)
 * Función única y probada que calcula la puntuación (Probabilidad x Impacto) y el nivel
 * según las reglas didácticas de la Academia Horizonte (Bajo 1-2, Medio 3-4, Alto 6-9).
 * El navegador solo consume y muestra el resultado devuelto por esta función.
 */
import { ProbabilidadValor, ImpactoValor, NivelRiesgo } from "@/types/riesgo";

export interface ResultadoCalculoRiesgo {
  probabilidad: ProbabilidadValor;
  impacto: ImpactoValor;
  puntuacion: number;
  nivel: NivelRiesgo;
}

/**
 * Función canónica del servidor para calcular la severidad del riesgo
 */
export function calcularNivelRiesgoServidor(
  probabilidad: ProbabilidadValor,
  impacto: ImpactoValor
): ResultadoCalculoRiesgo {
  // Validación estricta de rangos en servidor
  if (![1, 2, 3].includes(probabilidad)) {
    throw new Error(`Probabilidad inválida: ${probabilidad}. Debe ser 1, 2 o 3.`);
  }
  if (![1, 2, 3].includes(impacto)) {
    throw new Error(`Impacto inválido: ${impacto}. Debe ser 1, 2 o 3.`);
  }

  const puntuacion = probabilidad * impacto;
  let nivel: NivelRiesgo = "Bajo";

  if (puntuacion >= 6) {
    nivel = "Alto";
  } else if (puntuacion >= 3) {
    nivel = "Medio";
  } else {
    nivel = "Bajo";
  }

  return {
    probabilidad,
    impacto,
    puntuacion,
    nivel,
  };
}

/**
 * Retorna las 9 combinaciones posibles de Probabilidad x Impacto con su nivel
 * según las reglas del laboratorio.
 */
export function obtenerLasNueveCombinaciones(): ResultadoCalculoRiesgo[] {
  const probabilidades: ProbabilidadValor[] = [1, 2, 3];
  const impactos: ImpactoValor[] = [1, 2, 3];
  const combinaciones: ResultadoCalculoRiesgo[] = [];

  for (const p of probabilidades) {
    for (const i of impactos) {
      combinaciones.push(calcularNivelRiesgoServidor(p, i));
    }
  }

  return combinaciones;
}

