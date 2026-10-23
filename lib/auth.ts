/**
 * Módulo de Autenticación y Sesiones del Gestor (Prompt 9)
 * - Perfil único «gestor»
 * - Contraseña nunca en claro: verificación mediante PBKDF2 (SHA-512) con sal usando Node.js crypto nativo.
 * - Sesión firmada con HMAC-SHA256 (secreto de servidor SESSION_SECRET).
 * - Rate limiting en memoria para mitigación de ataques por fuerza bruta.
 */
import crypto from "crypto";

const DEFAULT_SALT = "laboratorio2_salt_ficticio_academico";
const MAX_INTENTOS_FALLIDOS = 5;
const BLOQUEO_MS = 15 * 60 * 1000; // 15 minutos

// Almacén en memoria de intentos fallidos por IP o identificador
interface IntentoRegistro {
  intentos: number;
  bloqueadoHasta: number | null;
}
const intentosFallidos = new Map<string, IntentoRegistro>();

/**
 * Genera un hash seguro para la contraseña del gestor
 */
export function hashContrasena(contrasena: string, salt: string = DEFAULT_SALT): string {
  return crypto.pbkdf2Sync(contrasena, salt, 100000, 64, "sha512").toString("hex");
}

/**
 * Verifica la contraseña del gestor contra el hash esperado en GESTOR_PASSWORD_HASH
 * Si GESTOR_PASSWORD_HASH no está configurado, usa el hash didáctico por defecto de "gestor2026".
 */
export function verificarContrasenaGestor(contrasenaCandidata: string): boolean {
  const hashEsperado =
    process.env.GESTOR_PASSWORD_HASH ||
    // Hash por defecto para pruebas de "gestor2026"
    hashContrasena("gestor2026");

  const hashCandidato = hashContrasena(contrasenaCandidata);

  try {
    return crypto.timingSafeEqual(
      Buffer.from(hashCandidato, "hex"),
      Buffer.from(hashEsperado, "hex")
    );
  } catch {
    return false;
  }
}

/**
 * Control de Fuerza Bruta: Comprueba si un cliente está bloqueado
 */
export function comprobarLimiteIntentos(identificador: string): { permitido: boolean; restanteMs?: number } {
  const ahora = Date.now();
  const registro = intentosFallidos.get(identificador);

  if (!registro) {
    return { permitido: true };
  }

  if (registro.bloqueadoHasta && registro.bloqueadoHasta > ahora) {
    return { permitido: false, restanteMs: registro.bloqueadoHasta - ahora };
  }

  if (registro.bloqueadoHasta && registro.bloqueadoHasta <= ahora) {
    // Expiró el bloqueo, resetear
    intentosFallidos.delete(identificador);
    return { permitido: true };
  }

  return { permitido: true };
}

/**
 * Registra un intento fallido y bloquea si supera el umbral
 */
export function registrarIntentoFallido(identificador: string): { bloqueado: boolean } {
  const ahora = Date.now();
  const registro = intentosFallidos.get(identificador) || { intentos: 0, bloqueadoHasta: null };

  registro.intentos += 1;

  if (registro.intentos >= MAX_INTENTOS_FALLIDOS) {
    registro.bloqueadoHasta = ahora + BLOQUEO_MS;
    intentosFallidos.set(identificador, registro);
    return { bloqueado: true };
  }

  intentosFallidos.set(identificador, registro);
  return { bloqueado: false };
}

/**
 * Limpia los intentos fallidos tras un login exitoso
 */
export function limpiarIntentosFallidos(identificador: string): void {
  intentosFallidos.delete(identificador);
}

/**
 * Genera y firma un token de sesión opaco con HMAC-SHA256
 */
export function firmarTokenSesion(payload: { usuario: string; exp: number }): string {
  const secret = process.env.SESSION_SECRET || "secreto_desarrollo_temporal_academico_min_32_chars";
  const datosJson = JSON.stringify(payload);
  const datosBase64 = Buffer.from(datosJson).toString("base64url");
  const firma = crypto.createHmac("sha256", secret).update(datosBase64).digest("base64url");
  return `${datosBase64}.${firma}`;
}

/**
 * Verifica y extrae el payload de una cookie de sesión firmada
 */
export function verificarTokenSesion(tokenFirmado: string): { usuario: string; exp: number } | null {
  const secret = process.env.SESSION_SECRET || "secreto_desarrollo_temporal_academico_min_32_chars";
  const partes = tokenFirmado.split(".");
  if (partes.length !== 2) {
    return null;
  }

  const [datosBase64, firmaRecibida] = partes;
  const firmaEsperada = crypto.createHmac("sha256", secret).update(datosBase64).digest("base64url");

  try {
    const firmaValida = crypto.timingSafeEqual(
      Buffer.from(firmaRecibida),
      Buffer.from(firmaEsperada)
    );

    if (!firmaValida) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(datosBase64, "base64url").toString("utf-8"));

    // Verificar si la sesión expiró
    if (payload.exp && payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

