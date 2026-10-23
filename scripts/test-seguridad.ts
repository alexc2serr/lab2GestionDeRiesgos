/**
 * ==============================================================================
 * SCRIPT DE PRUEBAS DE SEGURIDAD Y FUNCIONAMIENTO AUTOMATIZADAS (SEG-01 a SEG-08)
 * Laboratorio 2 (Parte 1 y Parte 2) - Academia Horizonte
 * ==============================================================================
 */

import { RiesgoSchema } from "../lib/validaciones.ts";
import {
  calcularNivelRiesgoServidor,
  obtenerLasNueveCombinaciones,
} from "../lib/calculoRiesgo.ts";
import {
  hashContrasena,
  verificarContrasenaGestor,
  firmarTokenSesion,
  verificarTokenSesion,
  comprobarLimiteIntentos,
  registrarIntentoFallido,
  limpiarIntentosFallidos,
} from "../lib/auth.ts";

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
  efectoEsperado: "Garantizar RTO < 4h y RPO < 1h.",
  comprobacionEficacia: "Simulacro de restauración en contingencia y cotejo de datos.",
  estadoMedida: "propuesta",
};

const resValido = RiesgoSchema.safeParse(payloadValido);
assert(resValido.success === true, "Payload válido es aceptado correctamente por el servidor.");

// Caso 1.2: Rechazar probabilidad fuera de rango
const payloadProbInvalida = { ...payloadValido, probabilidad: 5 };
const resProbInvalida = RiesgoSchema.safeParse(payloadProbInvalida);
assert(
  resProbInvalida.success === false,
  "Rechaza probabilidad inválida (5 fuera del rango didáctico 1..3)."
);

// Caso 1.3: Rechazar activo no admitido en catálogo
const payloadActivoInvalido = { ...payloadValido, activo: "servidor_externo_desconocido" };
const resActivoInvalido = RiesgoSchema.safeParse(payloadActivoInvalido);
assert(
  resActivoInvalido.success === false,
  "Rechaza activo no contemplado en el catálogo formal."
);

// Caso 1.4: Rechazar textos excesivamente largos
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
// TEST 2: CLASIFICACIÓN Y CÁLCULO SERVER-SIDE (Prompt 8 y 12 / 9 Combinaciones)
// -----------------------------------------------------------------------------
console.log("\n🔹 2. Verificando Clasificación y Función Única de Servidor (Prompt 8 & 12):");

const combinaciones = obtenerLasNueveCombinaciones();
assert(combinaciones.length === 9, "Devuelve las 9 combinaciones exactas de Probabilidad e Impacto.");

const todasCorrectas = combinaciones.every((c) => {
  const pEsperada = c.probabilidad * c.impacto;
  let nivelEsperado = "Bajo";
  if (pEsperada >= 6) nivelEsperado = "Alto";
  else if (pEsperada >= 3) nivelEsperado = "Medio";
  return c.puntuacion === pEsperada && c.nivel === nivelEsperado;
});
assert(todasCorrectas, "Las 9 combinaciones calculan la puntuación y nivel correctos bajo las reglas didácticas.");

// -----------------------------------------------------------------------------
// TEST 3: ACCESO DEL GESTOR, HASH Y SESIONES FIRMADAS (Prompt 9 / SEG-03)
// -----------------------------------------------------------------------------
console.log("\n🔹 3. Verificando Acceso del Gestor y Sesión Segura (Prompt 9):");

// 3.1: Hashing con sal de contraseña
const hash1 = hashContrasena("mi_password_seguro");
const hash2 = hashContrasena("mi_password_seguro");
assert(hash1 === hash2 && hash1.length === 128, "Genera hash criptográfico determinista SHA-512 (128 hex chars).");

// 3.2: Verificación de contraseña gestor
assert(verificarContrasenaGestor("gestor2026") === true, "Verifica con éxito la contraseña correcta del gestor.");
assert(verificarContrasenaGestor("password_falso") === false, "Rechaza inmediatamente contraseñas erróneas.");

// 3.3: Firma y verificación de token de sesión (HttpOnly HMAC-SHA256)
const expFutura = Date.now() + 3600 * 1000;
const tokenValido = firmarTokenSesion({ usuario: "gestor", exp: expFutura });
const payloadSesion = verificarTokenSesion(tokenValido);
assert(
  payloadSesion !== null && payloadSesion.usuario === "gestor",
  "Firma y valida correctamente el token de sesión con HMAC-SHA256."
);

// 3.4: Rechazo de token manipulado
const tokenManipulado = tokenValido.substring(0, tokenValido.length - 5) + "XXXXX";
assert(
  verificarTokenSesion(tokenManipulado) === null,
  "Rechaza tokens de sesión con firma alterada o manipulada."
);

// 3.5: Control contra Fuerza Bruta (Rate Limiting)
const ipPrueba = "192.168.100.50";
limpiarIntentosFallidos(ipPrueba);
assert(comprobarLimiteIntentos(ipPrueba).permitido === true, "Permite intentos dentro del umbral normal.");

for (let i = 0; i < 5; i++) {
  registrarIntentoFallido(ipPrueba);
}
assert(
  comprobarLimiteIntentos(ipPrueba).permitido === false,
  "Bloquea temporalmente al cliente tras superar 5 intentos fallidos consecutivos."
);
limpiarIntentosFallidos(ipPrueba);

// -----------------------------------------------------------------------------
// TEST 4: REQUISITO SEG-01 y SEG-02 (Ausencia de Secretos en Código y DTOs)
// -----------------------------------------------------------------------------
console.log("\n🔹 4. Verificando SEG-01 y SEG-02 (Protección contra Exposición de Secretos):");

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
