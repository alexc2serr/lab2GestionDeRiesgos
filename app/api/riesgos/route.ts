import { NextRequest, NextResponse } from "next/server";
import { RiesgoSchema, RiesgoModificacionSchema } from "@/lib/validaciones";
import { obtenerRiesgos, guardarRiesgoPersistente, actualizarRiesgo } from "@/lib/storage";
import { calcularNivelRiesgo, Riesgo } from "@/types/riesgo";
import { verificarTokenSesion } from "@/lib/auth";

/**
 * Función auxiliar para comprobar autorización (SEG-03 / ENS op.acc.4 / NIST AC-6)
 * Valida la cookie HttpOnly firmada del perfil gestor o el token Bearer en cabecera
 */
function comprobarAutorizacion(req: NextRequest): boolean {
  // 1. Verificar cookie de sesión firmada 'session_gestor' (Prompt 9)
  const cookieSesion = req.cookies.get("session_gestor")?.value;
  if (cookieSesion) {
    const payload = verificarTokenSesion(cookieSesion);
    if (payload && payload.usuario === "gestor") {
      return true;
    }
  }

  // 2. Verificar cabecera Authorization (para integraciones directas o scripts de test)
  const authHeader = req.headers.get("authorization") || req.headers.get("x-admin-key");
  const adminKeyEsperada = process.env.ADMIN_API_KEY || "laboratorio2026";

  const tokenRecibido = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7).trim()
    : authHeader?.trim();

  return !!tokenRecibido && tokenRecibido === adminKeyEsperada;
}

/**
 * Endpoint GET /api/riesgos
 * Recupera la lista de riesgos registrados (Persistencia en PostgreSQL / Neon)
 * Prompt 9: Sin sesión válida no se pueden ver los registros (401).
 * SEG-02: Ningún secreto de servidor ni cadena de conexión se envía al navegador.
 */
export async function GET(req: NextRequest) {
  try {
    if (!comprobarAutorizacion(req)) {
      return NextResponse.json(
        {
          error:
            "No autorizado. Se requiere iniciar sesión con el perfil «gestor» para consultar los riesgos (Prompt 9 / Requisito SEG-03).",
        },
        { status: 401 }
      );
    }

    const riesgos = await obtenerRiesgos();
    return NextResponse.json(riesgos, { status: 200 });
  } catch (error) {
    // Requisito SEG-07: Errores públicos sin detalles internos sensibles ni stack traces
    console.error("Error en GET /api/riesgos:", error);
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
    // 1. REQUISITO SEG-03: Autorización en Servidor
    if (!comprobarAutorizacion(req)) {
      return NextResponse.json(
        {
          error:
            "No autorizado. El servidor denegó la operación de escritura por falta de credencial válida (Requisito SEG-03 / ENS op.acc.4).",
        },
        { status: 401 }
      );
    }

    // 2. REQUISITO SEG-05: Validación en Servidor (Zod)
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

    const datos = resultadoValidacion.data;

    // 3. Cálculo de puntuación y nivel en el Servidor (Prompt 8)
    const { puntuacion, nivel } = calcularNivelRiesgo(datos.probabilidad, datos.impacto);

    const now = new Date().toISOString();
    const nuevoRiesgo: Riesgo = {
      id: datos.id || `RSG-${Math.floor(Math.random() * 9000 + 1000)}`,
      proceso: datos.proceso,
      activo: datos.activo,
      objetivo: datos.objetivo,
      condicion: datos.condicion,
      amenaza: datos.amenaza,
      evento: datos.evento,
      consecuencia: datos.consecuencia,
      supuestos: datos.supuestos || "",
      probabilidad: datos.probabilidad,
      justificacionProbabilidad: datos.justificacionProbabilidad,
      impacto: datos.impacto,
      justificacionImpacto: datos.justificacionImpacto,
      puntuacion,
      nivel,
      medida: datos.medida,
      prioridad: datos.prioridad,
      comprobacionEficacia: datos.comprobacionEficacia,
      estadoMedida: datos.estadoMedida || "propuesta",
      referenciaControl: datos.referenciaControl || "",
      fechaCreacion: now,
      fechaModificacion: now,
    };

    // 4. Persistencia en PostgreSQL
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
    console.error("Error en POST /api/riesgos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al procesar el riesgo. No se alteró ningún dato." },
      { status: 500 }
    );
  }
}

/**
 * Endpoint PUT /api/riesgos
 * Modifica un riesgo existente en el sistema (Prompt 7, item 5).
 */
export async function PUT(req: NextRequest) {
  try {
    // 1. REQUISITO SEG-03: Autorización en Servidor
    if (!comprobarAutorizacion(req)) {
      return NextResponse.json(
        {
          error:
            "No autorizado. Se requiere autorización para modificar riesgos (Requisito SEG-03 / ENS op.acc.4).",
        },
        { status: 401 }
      );
    }

    // 2. REQUISITO SEG-05: Validación de campos de modificación
    let bodyRaw: unknown;
    try {
      bodyRaw = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Cuerpo de solicitud inválido (formato JSON no reconocible)." },
        { status: 400 }
      );
    }

    const resultadoValidacion = RiesgoModificacionSchema.safeParse(bodyRaw);

    if (!resultadoValidacion.success) {
      return NextResponse.json(
        {
          error: "Falló la validación de los datos a modificar en el servidor.",
          detalles: resultadoValidacion.error.issues.map((e) => ({
            campo: e.path.join("."),
            mensaje: e.message,
          })),
        },
        { status: 400 }
      );
    }

    const { id, ...datosAModificar } = resultadoValidacion.data;

    // Si se modifica probabilidad o impacto, recalcular en servidor
    let calculoExtra: Partial<Riesgo> = {};
    if (datosAModificar.probabilidad !== undefined && datosAModificar.impacto !== undefined) {
      calculoExtra = calcularNivelRiesgo(datosAModificar.probabilidad, datosAModificar.impacto);
    }

    const actualizado = await actualizarRiesgo(id, {
      ...datosAModificar,
      ...calculoExtra,
    });

    if (!actualizado) {
      return NextResponse.json(
        { error: `No se encontró ningún riesgo con el identificador ${id}.` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        mensaje: "Riesgo modificado y persistido con éxito en el servidor.",
        riesgo: actualizado,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en PUT /api/riesgos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al modificar el riesgo." },
      { status: 500 }
    );
  }
}
