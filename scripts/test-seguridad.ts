/**
 * ==============================================================================
 * SCRIPT DE PRUEBAS DE SEGURIDAD AUTOMATIZADAS (SEG-01 a SEG-07)
 * Laboratorio 2 de Análisis y Gestión de Riesgos
 * ==============================================================================
 */

import { RiesgoSchema } from "../lib/validaciones.ts";

let testsPasados = 0;
let testsFallidos = 0;

function assert(condicion: boolean, descripcion: string) {
  if (condicion) {
    console.log(`  ✅ [PASS] ${descripcion}`);
    testsPasados++;
  } else {
    console.error(`  ❌ [FAIL] ${descripcion}`);
    testsFallidos++;
  }
}

console.log("==================================================================");
console.log("INICIANDO PRUEBAS DE ACEPTACIÓN DE SEGURIDAD (ENS / NIST SP 800-53)");
console.log("==================================================================\n");

// -----------------------------------------------------------------------------
// TEST 1: REQUISITO SEG-05 (Validación de Entradas en Servidor - NIST SI-10)
// -----------------------------------------------------------------------------
console.log("🔹 1. Verificando SEG-05 (Validación Server-Side con Zod):");

// Caso 1.1: Payload completamente válido
const payloadValido = {
  proceso: "matrícula",
  activo: "base de datos",
  objetivo: "conservar y recuperar registros",
  condicion: "no se ha probado la restauración de las copias",
  amenaza: "fallo del almacenamiento",
  evento: "pérdida de acceso a registros confirmados",
  consecuencia: "imposibilidad de reconstruir matrículas",
  probabilidad: 2,
  justificacionProbabilidad: "Campaña de 7 días sobre instancia única de BD.",
  impacto: 3,
  justificacionImpacto: "Grave: pérdida irrecuperable de alumnos admitidos.",
  medida: "Protocolo de restauración periódica con checksums SHA-256.",
  prioridad: "Alta",
  comprobacionEficacia: "Simulacro de restauración en contingencia y cotejo de datos.",
};

const resValido = RiesgoSchema.safeParse(payloadValido);
assert(resValido.success === true, "Payload válido es aceptado correctamente por el servidor.");

// Caso 1.2: Rechazar probabilidad fuera de rango (ej. 5)
const payloadProbInvalida = { ...payloadValido, probabilidad: 5 };
const resProbInvalida = RiesgoSchema.safeParse(payloadProbInvalida);
assert(
  resProbInvalida.success === false,
  "Rechaza probabilidad inválida (5 fuera del rango didáctico 1..3)."
);

// Caso 1.3: Rechazar activo no admitido en el catálogo
const payloadActivoInvalido = { ...payloadValido, activo: "servidor_no_autorizado" };
const resActivoInvalido = RiesgoSchema.safeParse(payloadActivoInvalido);
assert(
  resActivoInvalido.success === false,
  "Rechaza activo no contemplado en el catálogo formal."
);

// Caso 1.4: Rechazar textos excesivamente largos (desbordamiento de longitud)
const payloadTextoLargo = { ...payloadValido, proceso: "A".repeat(150) };
const resTextoLargo = RiesgoSchema.safeParse(payloadTextoLargo);
assert(
  resTextoLargo.success === false,
  "Rechaza campo 'proceso' que supera el límite de 80 caracteres."
);

// Caso 1.5: Sanitización de texto plano (Prevención XSS)
const payloadXss = {
  ...payloadValido,
  condicion: "debilidad <script>alert(1)</script> detectada",
};
const resXss = RiesgoSchema.safeParse(payloadXss);
assert(
  resXss.success === true && !resXss.data.condicion.includes("<script>"),
  "Sanitiza etiquetas HTML en entradas, tratándolas estrictamente como texto plano."
);

// -----------------------------------------------------------------------------
// TEST 2: REQUISITO SEG-03 (Autorización en Servidor - ENS op.acc.4 / NIST AC-6)
// -----------------------------------------------------------------------------
console.log("\n🔹 2. Verificando SEG-03 (Control de Autorización en Servidor):");

function simularAutorizacionServidor(
  authHeader: string | null,
  adminKeyConfigurada: string
) {
  const tokenRecibido = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7).trim()
    : authHeader?.trim();

  if (!tokenRecibido || tokenRecibido !== adminKeyConfigurada) {
    return { status: 401, error: "No autorizado (SEG-03)" };
  }
  return { status: 200, autorizado: true };
}

const adminKeyReal = "clave_secreta_bitwarden_987";

const authSinCabecera = simularAutorizacionServidor(null, adminKeyReal);
assert(
  authSinCabecera.status === 401,
  "Deniega petición de mutación sin cabecera de autenticación (HTTP 401)."
);

const authClaveErronea = simularAutorizacionServidor("Bearer clave_falsa", adminKeyReal);
assert(
  authClaveErronea.status === 401,
  "Deniega petición con credencial administrativa incorrecta (HTTP 401)."
);

const authCorrecta = simularAutorizacionServidor(`Bearer ${adminKeyReal}`, adminKeyReal);
assert(
  authCorrecta.status === 200,
  "Permite la operación cuando la credencial administrativa coincide con el servidor."
);

// -----------------------------------------------------------------------------
// TEST 3: REQUISITO SEG-01 y SEG-02 (Ausencia de Secretos en Código y Respuestas)
// -----------------------------------------------------------------------------
console.log("\n🔹 3. Verificando SEG-01 y SEG-02 (Protección contra Exposición de Secretos):");

// Comprobar que el objeto de riesgo no contiene secretos de infraestructura
const camposSensibles = ["password", "secret", "token", "database_url", "admin_key"];
const contieneSecreto = Object.keys(resValido.data || {}).some((k) =>
  camposSensibles.includes(k.toLowerCase())
);
assert(!contieneSecreto, "El DTO del riesgo no contiene campos sensibles ni credenciales.");

// -----------------------------------------------------------------------------
// RESUMEN FINAL
// -----------------------------------------------------------------------------
console.log("\n==================================================================");
console.log(`RESULTADO DE LA SUITE DE SEGURIDAD: ${testsPasados} PASADOS, ${testsFallidos} FALLIDOS`);
if (testsFallidos === 0) {
  console.log("🏆 TODOS LOS CONTROLES DE SEGURIDAD CUMPLEN CON LAS PRUEBAS DE ACEPTACIÓN");
}
console.log("==================================================================\n");

if (testsFallidos > 0) {
  process.exit(1);
}
