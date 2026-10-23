/**
 * Script de ejecución de migraciones de base de datos
 * Uso: npx tsx scripts/migrar.ts  o  node --experimental-strip-types scripts/migrar.ts
 * Utiliza DATABASE_URL_ADMIN (o DATABASE_URL si está en modo desarrollo local)
 */
import fs from "fs";
import path from "path";
import pg from "pg";

const { Pool } = pg;

async function ejecutarMigraciones() {
  const dbUrl = process.env.DATABASE_URL_ADMIN || process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error("❌ ERROR: No se ha configurado DATABASE_URL_ADMIN ni DATABASE_URL.");
    console.error("   Configura la cadena de conexión en tu archivo .env.local (custodiada en Bitwarden).");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: dbUrl,
    ssl: dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1") ? false : { rejectUnauthorized: false },
  });

  try {
    console.log("🔹 Conectando a la base de datos PostgreSQL...");
    const client = await pool.connect();

    try {
      const rutaMigracion = path.join(process.cwd(), "db", "01_crear_tabla_riesgos.sql");
      console.log(`🔹 Leyendo script de migración: ${rutaMigracion}`);
      const sql = fs.readFileSync(rutaMigracion, "utf-8");

      console.log("🔹 Ejecutando DDL de creación de tabla 'riesgos' e inserción de datos iniciales...");
      await client.query(sql);

      console.log("✅ Migración completada con éxito.");
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("❌ Error ejecutando la migración:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

ejecutarMigraciones();

