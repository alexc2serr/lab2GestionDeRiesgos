export type ProbabilidadValor = 1 | 2 | 3;
export type ImpactoValor = 1 | 2 | 3;
export type NivelRiesgo = "Bajo" | "Medio" | "Alto";
export type PrioridadMedida = "Baja" | "Media" | "Alta";

export interface Riesgo {
  id: string;
  // Bloque A: Qué queremos proteger
  proceso: string;
  activo: "plataforma web" | "base de datos" | "copias de seguridad" | string;
  objetivo: "completar solicitudes en plazo" | "conservar y recuperar registros" | string;

  // Bloque B: Qué podría ocurrir y por qué
  condicion: string;
  amenaza: string;
  evento: string;

  // Bloque C: Consecuencias
  consecuencia: string;

  // Bloque D: Supuestos
  supuestos?: string;

  // Evaluación del Riesgo (Fase 4)
  probabilidad: ProbabilidadValor;
  justificacionProbabilidad: string;
  impacto: ImpactoValor;
  justificacionImpacto: string;
  puntuacion: number; // Probabilidad * Impacto (1 a 9)
  nivel: NivelRiesgo; // Bajo (1-2), Medio (3-4), Alto (6-9)

  // Medida de Protección (Fase 4)
  medida: string;
  prioridad: PrioridadMedida;
  comprobacionEficacia: string;
  referenciaControl?: string; // ENS / NIST SP 800-53
}

export function calcularNivelRiesgo(p: ProbabilidadValor, i: ImpactoValor): { puntuacion: number; nivel: NivelRiesgo } {
  const puntuacion = p * i;
  let nivel: NivelRiesgo = "Bajo";
  if (puntuacion >= 6) {
    nivel = "Alto";
  } else if (puntuacion >= 3) {
    nivel = "Medio";
  } else {
    nivel = "Bajo";
  }
  return { puntuacion, nivel };
}

