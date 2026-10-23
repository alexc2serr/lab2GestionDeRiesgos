-- ==============================================================================
-- Configuración de Roles y Permisos Segregados (SEG-04 / Mínimo Privilegio)
-- Plataforma de Análisis y Gestión de Riesgos (Laboratorio 2 - Parte 2)
-- ==============================================================================
-- NOTA DE SEGURIDAD (Zero-Knowledge):
-- Este script no contiene contraseñas reales. Las contraseñas deben ser generadas
-- de forma segura en Bitwarden y sustituidas únicamente en el momento de ejecución
-- o mediante variables de entorno seguras.
-- ==============================================================================

-- 1. Rol Administrador: Cuenta técnica exclusiva para la ejecución de migraciones DDL
-- Solo se utiliza localmente o en pipelines de mantenimiento con la variable DATABASE_URL_ADMIN.
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'admin_riesgos') THEN
        CREATE ROLE admin_riesgos WITH LOGIN PASSWORD 'REEMPLAZAR_CON_PASSWORD_SEGURO_BITWARDEN';
    END IF;
END
$$;

-- Otorgar permisos completos de DDL y DML sobre el esquema público al administrador
GRANT CONNECT ON DATABASE current_database() TO admin_riesgos;
GRANT USAGE, CREATE ON SCHEMA public TO admin_riesgos;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin_riesgos;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin_riesgos;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO admin_riesgos;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO admin_riesgos;

-- 2. Rol Aplicación: Cuenta con permisos mínimos necesarios (Least Privilege - SEG-04)
-- Esta es la credencial que utiliza el backend web en tiempo de ejecución (DATABASE_URL).
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_riesgos') THEN
        CREATE ROLE app_riesgos WITH LOGIN PASSWORD 'REEMPLAZAR_CON_PASSWORD_SEGURO_BITWARDEN';
    END IF;
END
$$;

-- Permisos estrictos para app_riesgos:
-- SOLO conectar y usar el esquema public
GRANT CONNECT ON DATABASE current_database() TO app_riesgos;
GRANT USAGE ON SCHEMA public TO app_riesgos;

-- Revocar explícitamente cualquier permiso de creación o eliminación en el esquema
REVOKE CREATE ON SCHEMA public FROM app_riesgos;

-- Conceder exclusivamente operaciones DML (SELECT, INSERT, UPDATE, DELETE) sobre la tabla 'riesgos'
-- NO puede hacer DDL: NO puede ejecutar CREATE TABLE, DROP TABLE, ALTER TABLE ni TRUNCATE.
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE riesgos TO app_riesgos;

-- Si se utilizan secuencias para identificadores, conceder solo USAGE/SELECT
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_riesgos;

-- ==============================================================================
-- Verificación de seguridad de los permisos (Comprobación de cumplimiento SEG-04):
-- Intentar ejecutar: 'DROP TABLE riesgos;' autenticado como 'app_riesgos'
-- Resultado esperado: ERROR: permission denied for table riesgos
-- ==============================================================================

