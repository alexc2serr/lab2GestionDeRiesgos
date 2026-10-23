import { Riesgo } from "@/types/riesgo";

export const RIESGOS_INICIALES: Riesgo[] = [
  {
    id: "RSG-001",
    proceso: "matrícula",
    activo: "base de datos",
    objetivo: "conservar y recuperar registros",
    condicion: "no se ha probado la restauración de las copias",
    amenaza: "fallo del almacenamiento",
    evento: "pérdida de acceso a los registros confirmados",
    consecuencia: "imposibilidad de reconstruir parte de las matrículas",
    supuestos: "se desconoce si las copias disponibles permiten recuperar todos los registros sin corrupción",
    probabilidad: 2,
    justificacionProbabilidad:
      "La campaña dura solo 7 días con alta concurrencia sobre una única instancia de almacenamiento; aunque existen copias generadas, la ausencia de pruebas previas de recuperación no permite calificar el incidente como poco probable.",
    impacto: 3,
    justificacionImpacto:
      "Grave: un fallo no recuperable en el almacenamiento durante o al cierre de la campaña ocasiona la pérdida definitiva de matrículas confirmadas y el incumplimiento irreparable del servicio educativo.",
    puntuacion: 6,
    nivel: "Alto",
    medida:
      "Implantar un protocolo automatizado de pruebas periódicas de restauración de copias de seguridad en un entorno de contingencia aislado con verificación de integridad criptográfica (checksums SHA-256).",
    prioridad: "Alta",
    comprobacionEficacia:
      "Simular una contingencia restaurando el último backup en un servidor de pruebas y verificar mediante script automatizado que el 100% de los registros de alumnos se recuperan íntegros y accesibles en menos de 2 horas.",
    estadoMedida: "propuesta",
    referenciaControl: "ENS mp.info.2 / NIST SP 800-53 CP-4 y CP-9",
    fechaCreacion: "2026-10-08T10:00:00.000Z",
    fechaModificacion: "2026-10-08T10:00:00.000Z",
  },
  {
    id: "RSG-002",
    proceso: "matrícula",
    activo: "base de datos",
    objetivo: "conservar y recuperar registros",
    condicion: "la cuenta que utiliza la aplicación tiene permisos administrativos sobre la base de datos",
    amenaza: "error de lógica en la aplicación o inyección SQL maliciosa",
    evento: "modificación o borrado no autorizado de tablas de matrículas",
    consecuencia: "corrupción masiva del censo de admitidos e indisponibilidad del servicio",
    supuestos: "se asume que la aplicación no cuenta con controles de acceso basados en roles a nivel de motor de base de datos",
    probabilidad: 2,
    justificacionProbabilidad:
      "Media: la plataforma web está expuesta públicamente a Internet durante los 7 días de matriculación, y el uso de credenciales administrativas por el software amplifica severamente el alcance de cualquier fallo o vulnerabilidad.",
    impacto: 3,
    justificacionImpacto:
      "Grave: la ejecución involuntaria o maliciosa de comandos destructivos DDL (DROP, TRUNCATE) elimina permanentemente registros confirmados, arruinando el proceso de admisión sin posibilidad de continuidad inmediata.",
    puntuacion: 6,
    nivel: "Alto",
    medida:
      "Aplicar el principio de mínimo privilegio (Least Privilege) creando un usuario de base de datos específico para la aplicación web con permisos estrictamente DML (SELECT, INSERT, UPDATE en tablas necesarias) y revocando de forma absoluta cualquier permiso DDL (DROP, ALTER, CREATE) o privilegios administrativos.",
    prioridad: "Alta",
    comprobacionEficacia:
      "Ejecutar una prueba técnica de penetración controlada intentando lanzar sentencias 'DROP TABLE matriculas;' y 'ALTER TABLE...' autenticado como el usuario de la app, constatando que el motor de base de datos deniega la operación con error 'permission denied' (cumplimiento SEG-04).",
    estadoMedida: "propuesta",
    referenciaControl: "ENS op.acc.4 / NIST SP 800-53 AC-6 (Least Privilege)",
    fechaCreacion: "2026-10-08T10:00:00.000Z",
    fechaModificacion: "2026-10-08T10:00:00.000Z",
  },
];

