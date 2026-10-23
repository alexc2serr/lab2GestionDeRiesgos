export type ProbabilidadValor = 1 | 2 | 3;
export type ImpactoValor = 1 | 2 | 3;
export type NivelRiesgo = "Bajo" | "Medio" | "Alto";
export type PrioridadMedida = "Baja" | "Media" | "Alta";
export type EstadoMedida = "propuesta" | "implantada" | "verificada";

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

  // Evaluación del Riesgo
  probabilidad: ProbabilidadValor;
  justificacionProbabilidad: string;
  impacto: ImpactoValor;
  justificacionImpacto: string;
  puntuacion: number; // Probabilidad * Impacto (1 a 9)
  nivel: NivelRiesgo; // Bajo (1-2), Medio (3-4), Alto (6-9)

  // Medida de Protección
  medida: string;
  prioridad: PrioridadMedida;
  efectoEsperado?: string; // Efecto que se espera lograr tras implantar la salvaguarda
  comprobacionEficacia: string;
  estadoMedida: EstadoMedida; // propuesta | implantada | verificada
  referenciaControl?: string; // ENS / NIST SP 800-53

  // Auditoría temporal
  fechaCreacion: string;
  fechaModificacion: string;
}

export { calcularNivelRiesgoServidor as calcularNivelRiesgo } from "@/lib/calculoRiesgo";

