/**
 * Herramienta CLI para generar el hash seguro de la contraseña del gestor
 * Uso: node --experimental-strip-types scripts/generar-hash-gestor.ts <tu_contraseña>
 * Muestra el hash generado para guardarlo en Bitwarden y configurarlo en GESTOR_PASSWORD_HASH.
 */
import { hashContrasena } from "../lib/auth";

const args = process.argv.slice(2);
const password = args[0] || "gestor2026";

console.log("==================================================================");
console.log("GENERADOR DE HASH PARA PERFIL GESTOR (PBKDF2 SHA-512)");
console.log("==================================================================");
console.log(`Contraseña de entrada: ${password === "gestor2026" ? "gestor2026 (por defecto)" : "[oculta]"}`);
const hash = hashContrasena(password);
console.log("\nHash generado para GESTOR_PASSWORD_HASH:");
console.log(hash);
console.log("\nInstrucciones de custodia (Zero-Knowledge):");
console.log("1. Guarda tu contraseña en tu gestor Bitwarden.");
console.log("2. Añade este hash a tu archivo '.env.local' y a las variables de entorno de Vercel como GESTOR_PASSWORD_HASH.");
console.log("==================================================================");

