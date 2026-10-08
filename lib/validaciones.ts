import { z } from "zod";

/**
 * Función de sanitización de texto plano (Defensa en profundidad contra XSS e inyecciones)
 */
function sanitizarTextoPlano(texto: string): string {
  return texto
    .replace(/[<>]/g, "") // Eliminar etiquetas HTML
    .trim();
}

/**
 * Esquema Zod de validación estricta para el Requisito SEG-05 (Validación en Servidor)
 * ENS: mp.sw.1 | NIST SP 800-53 Rev. 5: SI-10
 */
export const RiesgoSchema = z.object({
  id: z
    .string()
    .max(50)
    .optional(),

  // Bloque A: Qué queremos proteger
  proceso: z
    .string({ required_error: "El proceso es obligatorio" })
    .min(2, "El proceso debe tener al menos 2 caracteres")
    .max(80, "El proceso no puede superar los 80 caracteres")
    .transform(sanitizarTextoPlano),

  activo: z.enum(
    ["plataforma web", "base de datos", "copias de seguridad"],
    {
      errorMap: () => ({
        message:
          "El activo debe ser uno de los permitidos: 'plataforma web', 'base de datos' o 'copias de seguridad'",
      }),
    }
  ),

  objetivo: z.enum(
    ["completar solicitudes en plazo", "conservar y recuperar registros"],
    {
      errorMap: () => ({
        message:
          "El objetivo debe ser: 'completar solicitudes en plazo' o 'conservar y recuperar registros'",
      }),
    }
  ),

  // Bloque B: Qué podría ocurrir y por qué
  condicion: z
    .string({ required_error: "La condición o debilidad es obligatoria" })
    .min(5, "La condición debe tener al menos 5 caracteres")
    .max(200, "La condición no puede superar los 200 caracteres")
    .transform(sanitizarTextoPlano),

  amenaza: z
    .string({ required_error: "La amenaza es obligatoria" })
    .min(3, "La amenaza debe tener al menos 3 caracteres")
    .max(150, "La amenaza no puede superar los 150 caracteres")
    .transform(sanitizarTextoPlano),

  evento: z
    .string({ required_error: "El evento es obligatorio" })
    .min(5, "El evento debe tener al menos 5 caracteres")
    .max(200, "El evento no puede superar los 200 caracteres")
    .transform(sanitizarTextoPlano),

  // Bloque C: Qué consecuencias tendría
  consecuencia: z
    .string({ required_error: "La consecuencia es obligatoria" })
    .min(5, "La consecuencia debe tener al menos 5 caracteres")
    .max(250, "La consecuencia no puede superar los 250 caracteres")
    .transform(sanitizarTextoPlano),

  // Bloque D: Supuestos (Opcional)
  supuestos: z
    .string()
    .max(300, "Los supuestos no pueden superar los 300 caracteres")
    .transform(sanitizarTextoPlano)
    .optional(),

  // Evaluación (1 a 3)
  probabilidad: z.union([z.literal(1), z.literal(2), z.literal(3)], {
    errorMap: () => ({
      message: "La probabilidad debe ser un entero válido entre 1 y 3",
    }),
  }),

  justificacionProbabilidad: z
    .string({ required_error: "La justificación de probabilidad es obligatoria" })
    .min(5, "La justificación de probabilidad debe tener al menos 5 caracteres")
    .max(300, "La justificación de probabilidad no puede superar los 300 caracteres")
    .transform(sanitizarTextoPlano),

  impacto: z.union([z.literal(1), z.literal(2), z.literal(3)], {
    errorMap: () => ({
      message: "El impacto debe ser un entero válido entre 1 y 3",
    }),
  }),

  justificacionImpacto: z
    .string({ required_error: "La justificación de impacto es obligatoria" })
    .min(5, "La justificación de impacto debe tener al menos 5 caracteres")
    .max(300, "La justificación de impacto no puede superar los 300 caracteres")
    .transform(sanitizarTextoPlano),

  // Medida de Protección
  medida: z
    .string({ required_error: "La propuesta de medida es obligatoria" })
    .min(5, "La medida debe tener al menos 5 caracteres")
    .max(250, "La medida no puede superar los 250 caracteres")
    .transform(sanitizarTextoPlano),

  prioridad: z.enum(["Baja", "Media", "Alta"], {
    errorMap: () => ({
      message: "La prioridad debe ser 'Baja', 'Media' o 'Alta'",
    }),
  }),

  comprobacionEficacia: z
    .string({ required_error: "La comprobación de eficacia es obligatoria" })
    .min(5, "La comprobación de eficacia debe tener al menos 5 caracteres")
    .max(300, "La comprobación de eficacia no puede superar los 300 caracteres")
    .transform(sanitizarTextoPlano),
});

export type RiesgoValidado = z.infer<typeof RiesgoSchema>;

