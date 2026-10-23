-- ==============================================================================
-- Migración 01: Creación de la tabla de riesgos para la Academia Horizonte
-- Plataforma de Análisis y Gestión de Riesgos (Laboratorio 2 - Parte 2)
-- ==============================================================================

-- Creación de la tabla principal 'riesgos' con tipado estricto y restricciones CHECK
CREATE TABLE IF NOT EXISTS riesgos (
    id VARCHAR(50) PRIMARY KEY,
    
    -- Bloque A: Qué queremos proteger
    proceso VARCHAR(80) NOT NULL,
    activo VARCHAR(80) NOT NULL,
    objetivo VARCHAR(100) NOT NULL,
    
    -- Bloque B: Qué podría ocurrir y por qué
    condicion TEXT NOT NULL,
    amenaza TEXT NOT NULL,
    evento TEXT NOT NULL,
    
    -- Bloque C: Consecuencias
    consecuencia TEXT NOT NULL,
    
    -- Bloque D: Supuestos
    supuestos TEXT,
    
    -- Evaluación del Riesgo (Escalas didácticas 1..3)
    probabilidad SMALLINT NOT NULL CHECK (probabilidad BETWEEN 1 AND 3),
    impacto SMALLINT NOT NULL CHECK (impacto BETWEEN 1 AND 3),
    justificacion_probabilidad TEXT NOT NULL,
    justificacion_impacto TEXT NOT NULL,
    puntuacion SMALLINT NOT NULL CHECK (puntuacion = probabilidad * impacto),
    nivel VARCHAR(20) NOT NULL CHECK (nivel IN ('Bajo', 'Medio', 'Alto')),
    
    -- Medidas de Protección y Control
    medida TEXT NOT NULL,
    prioridad VARCHAR(20) NOT NULL CHECK (prioridad IN ('Baja', 'Media', 'Alta')),
    comprobacion_eficacia TEXT NOT NULL,
    estado_medida VARCHAR(20) NOT NULL DEFAULT 'propuesta' CHECK (estado_medida IN ('propuesta', 'implantada', 'verificada')),
    referencia_control VARCHAR(120),
    
    -- Auditoría temporal
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimización de consultas recurrentes
CREATE INDEX IF NOT EXISTS idx_riesgos_nivel ON riesgos(nivel);
CREATE INDEX IF NOT EXISTS idx_riesgos_fecha_mod ON riesgos(fecha_modificacion DESC);

-- Función y trigger para actualización automática de fecha_modificacion
CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_modificacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_actualizar_fecha_mod ON riesgos;
CREATE TRIGGER trigger_actualizar_fecha_mod
BEFORE UPDATE ON riesgos
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_modificacion();

-- Carga inicial de riesgos de referencia si la tabla está vacía
INSERT INTO riesgos (
    id, proceso, activo, objetivo, condicion, amenaza, evento, consecuencia, supuestos,
    probabilidad, justificacion_probabilidad, impacto, justificacion_impacto,
    puntuacion, nivel, medida, prioridad, comprobacion_eficacia, estado_medida, referencia_control,
    fecha_creacion, fecha_modificacion
) VALUES 
(
    'RSG-001',
    'matrícula',
    'base de datos',
    'conservar y recuperar registros',
    'no se ha probado la restauración de las copias',
    'fallo del almacenamiento',
    'pérdida de acceso a los registros confirmados',
    'imposibilidad de reconstruir parte de las matrículas',
    'se desconoce si las copias disponibles permiten recuperar todos los registros sin corrupción',
    2,
    'La campaña dura solo 7 días con alta concurrencia sobre una única instancia de almacenamiento; aunque existen copias generadas, la ausencia de pruebas previas de recuperación no permite calificar el incidente como poco probable.',
    3,
    'Grave: un fallo no recuperable en el almacenamiento durante o al cierre de la campaña ocasiona la pérdida definitiva de matrículas confirmadas y el incumplimiento irreparable del servicio educativo.',
    6,
    'Alto',
    'Implantar un protocolo automatizado de pruebas periódicas de restauración de copias de seguridad en un entorno de contingencia aislado con verificación de integridad criptográfica (checksums SHA-256).',
    'Alta',
    'Simular una contingencia restaurando el último backup en un servidor de pruebas y verificar mediante script automatizado que el 100% de los registros de alumnos se recuperan íntegros y accesibles en menos de 2 horas.',
    'propuesta',
    'ENS mp.info.2 / NIST SP 800-53 CP-4 y CP-9',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'RSG-002',
    'matrícula',
    'base de datos',
    'conservar y recuperar registros',
    'la cuenta que utiliza la aplicación tiene permisos administrativos sobre la base de datos',
    'error de lógica en la aplicación o inyección SQL maliciosa',
    'modificación o borrado no autorizado de tablas de matrículas',
    'corrupción masiva del censo de admitidos e indisponibilidad del servicio',
    'se asume que la aplicación no cuenta con controles de acceso basados en roles a nivel de motor de base de datos',
    2,
    'Media: la plataforma web está expuesta públicamente a Internet durante los 7 días de matriculación, y el uso de credenciales administrativas por el software amplifica severamente el alcance de cualquier fallo o vulnerabilidad.',
    3,
    'Grave: la ejecución involuntaria o maliciosa de comandos destructivos DDL (DROP, TRUNCATE) elimina permanentemente registros confirmados, arruinando el proceso de admisión sin posibilidad de continuidad inmediata.',
    6,
    'Alto',
    'Aplicar el principio de mínimo privilegio (Least Privilege) creando un usuario de base de datos específico para la aplicación web con permisos estrictamente DML (SELECT, INSERT, UPDATE en tablas necesarias) y revocando de forma absoluta cualquier permiso DDL (DROP, ALTER, CREATE) o privilegios administrativos.',
    'Alta',
    'Ejecutar una prueba técnica de penetración controlada intentando lanzar sentencias ''DROP TABLE matriculas;'' y ''ALTER TABLE...'' autenticado como el usuario de la app, constatando que el motor de base de datos deniega la operación con error ''permission denied'' (cumplimiento SEG-04).',
    'propuesta',
    'ENS op.acc.4 / NIST SP 800-53 AC-6 (Least Privilege)',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO NOTHING;

