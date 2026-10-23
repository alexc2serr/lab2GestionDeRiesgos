/**
 * Adaptador de base de datos PostgreSQL para la Academia Horizonte
 * Soporta conexión con Neon / PostgreSQL mediante la variable DATABASE_URL (cuenta app_riesgos)
 * Incluye fallback seguro en memoria para pruebas y desarrollo cuando no se dispone de conexión activa.
 */
import pg from "pg";
import { Riesgo } from "@/types/riesgo";
import { RIESGOS_INICIALES } from "@/data/riesgosIniciales";

const { Pool } = pg;

declare global {
  // eslint-disable-next-line no-var
  var __postgresPool: pg.Pool | undefined;
}

let pool: pg.Pool | null = null;

export function getDbPool(): pg.Pool | null {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    return null;
  }

  if (global.__postgresPool) {
    return global.__postgresPool;
  }

  try {
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
        ? false
        : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    if (process.env.NODE_ENV !== "production") {
      global.__postgresPool = pool;
    }

    return pool;
  } catch (err) {
    console.warn("⚠️ No se pudo inicializar el Pool de PostgreSQL:", err);
    return null;
  }
}

// Almacén en memoria volátil para fallback
let memoriaLocal: Riesgo[] = [...RIESGOS_INICIALES];

/**
 * Mapea una fila de PostgreSQL (snake_case) al tipo de TypeScript Riesgo (camelCase)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToRiesgo(row: any): Riesgo {
  return {
    id: row.id,
    proceso: row.proceso,
    activo: row.activo,
    objetivo: row.objetivo,
    condicion: row.condicion,
    amenaza: row.amenaza,
    evento: row.evento,
    consecuencia: row.consecuencia,
    supuestos: row.supuestos || "",
    probabilidad: row.probabilidad,
    justificacionProbabilidad: row.justificacion_probabilidad,
    impacto: row.impacto,
    justificacionImpacto: row.justificacion_impacto,
    puntuacion: row.puntuacion,
    nivel: row.nivel,
    medida: row.medida,
    prioridad: row.prioridad,
    comprobacionEficacia: row.comprobacion_eficacia,
    estadoMedida: row.estado_medida || "propuesta",
    referenciaControl: row.referencia_control || "",
    fechaCreacion: row.fecha_creacion ? new Date(row.fecha_creacion).toISOString() : new Date().toISOString(),
    fechaModificacion: row.fecha_modificacion ? new Date(row.fecha_modificacion).toISOString() : new Date().toISOString(),
  };
}

/**
 * Lista todos los riesgos registrados en el sistema
 */
export async function listarRiesgos(): Promise<Riesgo[]> {
  const p = getDbPool();
  if (p) {
    try {
      const res = await p.query("SELECT * FROM riesgos ORDER BY fecha_creacion DESC");
      if (res.rows.length === 0) {
        // Si la tabla está vacía, retornar iniciales
        return RIESGOS_INICIALES;
      }
      return res.rows.map(rowToRiesgo);
    } catch (error) {
      console.warn("⚠️ Error consultando PostgreSQL, usando fallback en memoria:", (error as Error).message);
    }
  }
  return memoriaLocal;
}

/**
 * Obtiene un riesgo por su identificador
 */
export async function obtenerRiesgoPorId(id: string): Promise<Riesgo | null> {
  const p = getDbPool();
  if (p) {
    try {
      const res = await p.query("SELECT * FROM riesgos WHERE id = $1 LIMIT 1", [id]);
      if (res.rows.length > 0) {
        return rowToRiesgo(res.rows[0]);
      }
      return null;
    } catch (error) {
      console.warn("⚠️ Error consultando riesgo por ID en PostgreSQL:", (error as Error).message);
    }
  }
  return memoriaLocal.find((r) => r.id === id) || null;
}

/**
 * Crea un nuevo riesgo en la base de datos
 */
export async function crearRiesgo(r: Riesgo): Promise<Riesgo> {
  const p = getDbPool();
  const now = new Date().toISOString();
  const riesgoAGuardar: Riesgo = {
    ...r,
    fechaCreacion: r.fechaCreacion || now,
    fechaModificacion: now,
  };

  if (p) {
    try {
      const query = `
        INSERT INTO riesgos (
          id, proceso, activo, objetivo, condicion, amenaza, evento, consecuencia, supuestos,
          probabilidad, justificacion_probabilidad, impacto, justificacion_impacto,
          puntuacion, nivel, medida, prioridad, comprobacion_eficacia, estado_medida, referencia_control,
          fecha_creacion, fecha_modificacion
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9,
          $10, $11, $12, $13,
          $14, $15, $16, $17, $18, $19, $20,
          $21, $22
        )
        RETURNING *;
      `;
      const values = [
        riesgoAGuardar.id,
        riesgoAGuardar.proceso,
        riesgoAGuardar.activo,
        riesgoAGuardar.objetivo,
        riesgoAGuardar.condicion,
        riesgoAGuardar.amenaza,
        riesgoAGuardar.evento,
        riesgoAGuardar.consecuencia,
        riesgoAGuardar.supuestos || "",
        riesgoAGuardar.probabilidad,
        riesgoAGuardar.justificacionProbabilidad,
        riesgoAGuardar.impacto,
        riesgoAGuardar.justificacionImpacto,
        riesgoAGuardar.puntuacion,
        riesgoAGuardar.nivel,
        riesgoAGuardar.medida,
        riesgoAGuardar.prioridad,
        riesgoAGuardar.comprobacionEficacia,
        riesgoAGuardar.estadoMedida || "propuesta",
        riesgoAGuardar.referenciaControl || "",
        riesgoAGuardar.fechaCreacion,
        riesgoAGuardar.fechaModificacion,
      ];

      const res = await p.query(query, values);
      return rowToRiesgo(res.rows[0]);
    } catch (error) {
      console.warn("⚠️ Error insertando en PostgreSQL, guardando en fallback local:", (error as Error).message);
    }
  }

  memoriaLocal = [riesgoAGuardar, ...memoriaLocal.filter((item) => item.id !== riesgoAGuardar.id)];
  return riesgoAGuardar;
}

/**
 * Modifica un riesgo existente en la base de datos
 */
export async function modificarRiesgo(id: string, r: Partial<Riesgo>): Promise<Riesgo | null> {
  const existente = await obtenerRiesgoPorId(id);
  if (!existente) {
    return null;
  }

  const actualizado: Riesgo = {
    ...existente,
    ...r,
    id, // No mutable
    fechaModificacion: new Date().toISOString(),
  };

  const p = getDbPool();
  if (p) {
    try {
      const query = `
        UPDATE riesgos SET
          proceso = $1, activo = $2, objetivo = $3, condicion = $4, amenaza = $5, evento = $6,
          consecuencia = $7, supuestos = $8, probabilidad = $9, justificacion_probabilidad = $10,
          impacto = $11, justificacion_impacto = $12, puntuacion = $13, nivel = $14, medida = $15,
          prioridad = $16, comprobacion_eficacia = $17, estado_medida = $18, referencia_control = $19,
          fecha_modificacion = $20
        WHERE id = $21
        RETURNING *;
      `;
      const values = [
        actualizado.proceso,
        actualizado.activo,
        actualizado.objetivo,
        actualizado.condicion,
        actualizado.amenaza,
        actualizado.evento,
        actualizado.consecuencia,
        actualizado.supuestos || "",
        actualizado.probabilidad,
        actualizado.justificacionProbabilidad,
        actualizado.impacto,
        actualizado.justificacionImpacto,
        actualizado.puntuacion,
        actualizado.nivel,
        actualizado.medida,
        actualizado.prioridad,
        actualizado.comprobacionEficacia,
        actualizado.estadoMedida,
        actualizado.referenciaControl || "",
        actualizado.fechaModificacion,
        id,
      ];

      const res = await p.query(query, values);
      if (res.rows.length > 0) {
        return rowToRiesgo(res.rows[0]);
      }
    } catch (error) {
      console.warn("⚠️ Error modificando en PostgreSQL, guardando en fallback local:", (error as Error).message);
    }
  }

  memoriaLocal = memoriaLocal.map((item) => (item.id === id ? actualizado : item));
  return actualizado;
}

/**
 * Elimina un riesgo
 */
export async function eliminarRiesgo(id: string): Promise<boolean> {
  const p = getDbPool();
  if (p) {
    try {
      const res = await p.query("DELETE FROM riesgos WHERE id = $1 RETURNING id", [id]);
      return res.rowCount !== null && res.rowCount > 0;
    } catch (error) {
      console.warn("⚠️ Error eliminando en PostgreSQL:", (error as Error).message);
    }
  }
  const inicial = memoriaLocal.length;
  memoriaLocal = memoriaLocal.filter((item) => item.id !== id);
  return memoriaLocal.length < inicial;
}

/**
 * Restablece a los valores iniciales
 */
export async function restablecerRiesgos(): Promise<Riesgo[]> {
  memoriaLocal = [...RIESGOS_INICIALES];
  return memoriaLocal;
}

