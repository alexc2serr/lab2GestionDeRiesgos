import { NextRequest, NextResponse } from "next/server";
import { RiesgoSchema } from "@/lib/validaciones";
import { obtenerRiesgos, guardarRiesgoPersistente } from "@/lib/storage";
import { calcularNivelRiesgo, Riesgo } from "@/types/riesgo";

/**
 * Endpoint GET /api/riesgos
 * Recupera la lista de riesgos registrados (Persistencia)
 * SEG-02: Ningún secreto de servidor se incluye en la respuesta.
 */
export async function GET() {
  try {
    const riesgos = await obtenerRiesgos();
    return NextResponse.json(riesgos, { status: 200 });
  } catch (error) {
    // Requisito SEG-07: Errores públicos sin detalles internos sensibles ni stack traces
    return NextResponse.json(
      { error: "No ha sido posible recuperar los riesgos. Inténtelo más tarde." },
      { status: 500 }
    );
  }
}

/**
 * Endpoint POST /api/riesgos
 * Registra un nuevo riesgo en el sistema.
 * Aplica:
 * - SEG-03: Autorización en el servidor antes de modificar datos.
 * - SEG-05: Validación de tipos, longitudes y valores permitidos con Zod.
 * - SEG-07: Manejo seguro de errores.
 */
export async function POST(req: NextRequest) {
  try {
    // --------------------------------------------------------------------------
    // 1. REQUISITO SEG-03: Comprobación de Autorización en el Servidor
    // ENS: op.acc.4 | NIST SP 800-53 Rev. 5: AC-6
    // --------------------------------------------------------------------------
    const authHeader = req.headers.get("authorization") || req.headers.get("x-admin-key");
    const adminKeyEsperada = process.env.ADMIN_API_KEY || "laboratorio2026";

    // Si viene en formato "Bearer <token>", extraer solo el token
    const tokenRecibido = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7).trim()
      : authHeader?.trim();

    if (!tokenRecibido || tokenRecibido !== adminKeyEsperada) {
      return NextResponse.json(
        {
          error:
            "No autorizado. El servidor denegó la operación de escritura por falta de credencial administrativa válida (Requisito SEG-03 / ENS op.acc.4).",
        },
        { status: 401 }
      );
    }

    // --------------------------------------------------------------------------
    // 2. REQUISITO SEG-05: Validación estricta en el Servidor (Zod)
    // ENS: mp.sw.1 | NIST SP 800-53 Rev. 5: SI-10
    // --------------------------------------------------------------------------
    let bodyRaw: unknown;
    try {
      bodyRaw = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Cuerpo de solicitud inválido (formato JSON no reconocible)." },
        { status: 400 }
      );
    }

    const resultadoValidacion = RiesgoSchema.safeParse(bodyRaw);

    if (!resultadoValidacion.success) {
      return NextResponse.json(
        {
          error: "Falló la validación de datos en el servidor (Requisito SEG-05 / NIST SI-10).",
          detalles: resultadoValidacion.error.issues.map((e) => ({
            campo: e.path.join("."),
            mensaje: e.message,
          })),
        },
        { status: 400 }
      );
    }

    const datosValidados = resultadoValidacion.data;

    // --------------------------------------------------------------------------
    // 3. Cálculo de puntuación y nivel en el Servidor
    // --------------------------------------------------------------------------
    const { puntuacion, nivel } = calcularNivelRiesgo(
      datosValidados.probabilidad,
      datosValidados.impacto
    );

    const nuevoRiesgo: Riesgo = {
      id: datosValidados.id || `RSG-${Math.floor(Math.random() * 9000 + 1000)}`,
      proceso: datosValidados.proceso,
      activo: datosValidados.activo,
      objetivo: datosValidados.objetivo,
      condicion: datosValidados.condicion,
      amenaza: datosValidados.amenaza,
      evento: datosValidados.evento,
      consecuencia: datosValidados.consecuencia,
      supuestos: datosValidados.supuestos,
      probabilidad: datosValidados.probabilidad,
      justificacionProbabilidad: datosValidados.justificacionProbabilidad,
      impacto: datosValidados.impacto,
      justificacionImpacto: datosValidados.justificacionImpacto,
      puntuacion,
      nivel,
      medida: datosValidados.medida,
      prioridad: datosValidados.prioridad,
      comprobacionEficacia: datosValidados.comprobacionEficacia,
    };

    // --------------------------------------------------------------------------
    // 4. Persistencia en Almacén (Vercel KV o Local)
    // --------------------------------------------------------------------------
    const listaActualizada = await guardarRiesgoPersistente(nuevoRiesgo);

    return NextResponse.json(
      {
        mensaje: "Riesgo validado y persistido con éxito en el servidor.",
        riesgo: nuevoRiesgo,
        total: listaActualizada.length,
      },
      { status: 201 }
    );
  } catch (error) {
    // --------------------------------------------------------------------------
    // REQUISITO SEG-07: Errores públicos sin credenciales ni detalles internos
    // NIST SP 800-53 Rev. 5: SI-10
    // --------------------------------------------------------------------------
    console.error("Error no controlado en POST /api/riesgos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al procesar el riesgo. No se alteró ningún dato." },
      { status: 500 }
    );
  }
}
