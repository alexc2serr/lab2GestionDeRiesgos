/**
 * Capa de persistencia del sistema (Laboratorio 2 - Parte 2)
 * Delega en el adaptador de base de datos PostgreSQL (lib/db.ts)
 * garantizando la seguridad en el servidor, mínimo privilegio y aislamiento de conexión.
 */
import { Riesgo } from "@/types/riesgo";
import {
  listarRiesgos,
  crearRiesgo,
  modificarRiesgo,
  obtenerRiesgoPorId,
  eliminarRiesgo,
  restablecerRiesgos,
} from "@/lib/db";

/**
 * Recupera la lista de riesgos persistidos
 */
export async function obtenerRiesgos(): Promise<Riesgo[]> {
  return listarRiesgos();
}

/**
 * Guarda o añade un nuevo riesgo en la base de datos
 */
export async function guardarRiesgoPersistente(nuevoRiesgo: Riesgo): Promise<Riesgo[]> {
  await crearRiesgo(nuevoRiesgo);
  return listarRiesgos();
}

/**
 * Actualiza un riesgo existente
 */
export async function actualizarRiesgo(id: string, datos: Partial<Riesgo>): Promise<Riesgo | null> {
  return modificarRiesgo(id, datos);
}

/**
 * Obtiene un riesgo por su ID
 */
export async function buscarRiesgo(id: string): Promise<Riesgo | null> {
  return obtenerRiesgoPorId(id);
}

/**
 * Elimina un riesgo
 */
export async function borrarRiesgo(id: string): Promise<boolean> {
  return eliminarRiesgo(id);
}

/**
 * Restablece los datos a los riesgos iniciales del laboratorio
 */
export async function reiniciarRiesgos(): Promise<Riesgo[]> {
  return restablecerRiesgos();
}
