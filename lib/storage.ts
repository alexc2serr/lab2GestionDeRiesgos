import { kv, createClient } from "@vercel/kv";
import { Riesgo } from "@/types/riesgo";
import { RIESGOS_INICIALES } from "@/data/riesgosIniciales";

const STORAGE_KEY = "laboratorio2:riesgos:lista";

// Almacén en memoria para desarrollo local cuando no hay credenciales de Vercel KV configuradas
let memoriaLocalRiesgos: Riesgo[] = [...RIESGOS_INICIALES];

/**
 * Cliente de solo lectura para cumplir con SEG-04 (Mínimo Privilegio) en operaciones de consulta
 */
function getKvReadClient() {
  const url = process.env.KV_REST_API_URL;
  // Priorizar el token de solo lectura si está presente (Least Privilege), o fallback al token general
  const token =
    process.env.KV_REST_API_READ_ONLY_TOKEN || process.env.KV_REST_API_TOKEN;

  if (url && token) {
    return createClient({ url, token });
  }
  return null;
}

/**
 * Cliente de escritura para mutaciones autorizadas (requiere token completo de servidor)
 */
function getKvWriteClient() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (url && token) {
    return createClient({ url, token });
  }
  return null;
}

/**
 * Recupera la lista de riesgos persistidos
 */
export async function obtenerRiesgos(): Promise<Riesgo[]> {
  try {
    const client = getKvReadClient();
    if (client) {
      const data = await client.get<Riesgo[]>(STORAGE_KEY);
      if (data && Array.isArray(data) && data.length > 0) {
        return data;
      }
      // Si la BD de Vercel KV está vacía, inicializar con los riesgos de Academia Horizonte
      const writeClient = getKvWriteClient();
      if (writeClient) {
        await writeClient.set(STORAGE_KEY, RIESGOS_INICIALES);
      }
      return RIESGOS_INICIALES;
    }
  } catch (error) {
    // Si falla la conexión a Vercel KV en desarrollo, recurrir al almacén local
    console.warn("Aviso: Vercel KV no accesible o no configurado. Utilizando almacén local.");
  }

  return memoriaLocalRiesgos;
}

/**
 * Guarda un nuevo riesgo en la base de datos persistente
 */
export async function guardarRiesgoPersistente(nuevoRiesgo: Riesgo): Promise<Riesgo[]> {
  try {
    const client = getKvWriteClient();
    if (client) {
      const riesgosActuales = await obtenerRiesgos();
      const listaActualizada = [nuevoRiesgo, ...riesgosActuales];
      await client.set(STORAGE_KEY, listaActualizada);
      return listaActualizada;
    }
  } catch (error) {
    console.warn("Aviso: Fallback a memoria local para escritura.");
  }

  memoriaLocalRiesgos = [nuevoRiesgo, ...memoriaLocalRiesgos];
  return memoriaLocalRiesgos;
}

/**
 * Restablece los datos a los riesgos iniciales del laboratorio
 */
export async function restablecerRiesgos(): Promise<Riesgo[]> {
  try {
    const client = getKvWriteClient();
    if (client) {
      await client.set(STORAGE_KEY, RIESGOS_INICIALES);
    }
  } catch (error) {
    console.warn("Aviso: Fallback a memoria local para reset.");
  }
  memoriaLocalRiesgos = [...RIESGOS_INICIALES];
  return memoriaLocalRiesgos;
}

