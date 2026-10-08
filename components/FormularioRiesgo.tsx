"use client";

import { useState } from "react";
import {
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  Calculator,
  PlusCircle,
  ShieldCheck,
} from "lucide-react";
import {
  Riesgo,
  ProbabilidadValor,
  ImpactoValor,
  PrioridadMedida,
  calcularNivelRiesgo,
} from "@/types/riesgo";

interface Props {
  onGuardarRiesgo?: (nuevoRiesgo: Riesgo) => void;
}

export interface RiesgoFormState {
  proceso: string;
  activo: string;
  objetivo: string;
  condicion: string;
  amenaza: string;
  evento: string;
  consecuencia: string;
  supuestos: string;
  // Evaluación y medidas (Fase 4)
  probabilidad: ProbabilidadValor;
  justificacionProbabilidad: string;
  impacto: ImpactoValor;
  justificacionImpacto: string;
  medida: string;
  prioridad: PrioridadMedida;
  comprobacionEficacia: string;
}

const ESTADO_INICIAL: RiesgoFormState = {
  proceso: "",
  activo: "",
  objetivo: "",
  condicion: "",
  amenaza: "",
  evento: "",
  consecuencia: "",
  supuestos: "",
  probabilidad: 2,
  justificacionProbabilidad: "",
  impacto: 2,
  justificacionImpacto: "",
  medida: "",
  prioridad: "Alta",
  comprobacionEficacia: "",
};

const EJEMPLO_ACADEMICO: RiesgoFormState = {
  proceso: "matrícula",
  activo: "base de datos",
  objetivo: "conservar y recuperar registros",
  condicion: "no se ha probado la restauración de las copias",
  amenaza: "fallo del almacenamiento",
  evento: "pérdida de acceso a los registros confirmados",
  consecuencia: "imposibilidad de reconstruir parte de las matrículas",
  supuestos: "se desconoce si las copias disponibles permiten recuperar todos los registros",
  probabilidad: 2,
  justificacionProbabilidad:
    "Campaña de 7 días de alta afluencia sobre una sola instancia de BD; no habiéndose probado copias, el incidente no es descartable.",
  impacto: 3,
  justificacionImpacto:
    "Grave: la pérdida irreversible de registros confirmados impide tramitar las admisiones en plazo.",
  medida:
    "Protocolo de pruebas periódicas de restauración de copias de seguridad en contingencia con verificación de checksums.",
  prioridad: "Alta",
  comprobacionEficacia:
    "Simular recuperación completa desde el último backup en entorno de prueba y constatar que el 100% de los datos son legibles.",
};

export default function FormularioRiesgo({ onGuardarRiesgo }: Props) {
  const [formData, setFormData] = useState<RiesgoFormState>(ESTADO_INICIAL);
  const [showConceptHelp, setShowConceptHelp] = useState(false);
  const [feedbackMensaje, setFeedbackMensaje] = useState<string | null>(null);

  const { puntuacion, nivel } = calcularNivelRiesgo(
    formData.probabilidad,
    formData.impacto
  );

  const handleChange = <K extends keyof RiesgoFormState>(
    campo: K,
    valor: RiesgoFormState[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const handleCargarEjemplo = () => {
    setFormData(EJEMPLO_ACADEMICO);
    setFeedbackMensaje("Ejemplo del caso Academia Horizonte cargado.");
    setTimeout(() => setFeedbackMensaje(null), 3000);
  };

  const handleLimpiar = () => {
    setFormData(ESTADO_INICIAL);
    setFeedbackMensaje(null);
  };

  // Validación de campos obligatorios en cliente
  const camposObligatorios: { key: keyof RiesgoFormState; label: string }[] = [
    { key: "proceso", label: "Proceso o servicio" },
    { key: "activo", label: "Activo afectado" },
    { key: "objetivo", label: "Objetivo afectado" },
    { key: "condicion", label: "Condición o debilidad" },
    { key: "amenaza", label: "Amenaza" },
    { key: "evento", label: "Evento" },
    { key: "consecuencia", label: "Consecuencia" },
  ];

  const camposPendientes = camposObligatorios.filter(
    (c) => !String(formData[c.key]).trim()
  );

  const formularioCompleto = camposPendientes.length === 0;

  const evaluacionValida =
    formData.justificacionProbabilidad.trim().length > 0 &&
    formData.justificacionImpacto.trim().length > 0 &&
    formData.medida.trim().length > 0 &&
    formData.comprobacionEficacia.trim().length > 0;

  const handleRegistrarRiesgo = () => {
    if (!formularioCompleto) {
      alert("Por favor completa todos los campos de formulación obligatorios.");
      return;
    }
    if (!evaluacionValida) {
      alert("Por favor completa las justificaciones de probabilidad e impacto, la medida y su método de comprobación.");
      return;
    }

    if (onGuardarRiesgo) {
      const nuevoRiesgo: Riesgo = {
        id: `RSG-00${Math.floor(Math.random() * 900 + 100)}`,
        proceso: formData.proceso.trim(),
        activo: formData.activo.trim(),
        objetivo: formData.objetivo.trim(),
        condicion: formData.condicion.trim(),
        amenaza: formData.amenaza.trim(),
        evento: formData.evento.trim(),
        consecuencia: formData.consecuencia.trim(),
        supuestos: formData.supuestos.trim() || undefined,
        probabilidad: formData.probabilidad,
        justificacionProbabilidad: formData.justificacionProbabilidad.trim(),
        impacto: formData.impacto,
        justificacionImpacto: formData.justificacionImpacto.trim(),
        puntuacion,
        nivel,
        medida: formData.medida.trim(),
        prioridad: formData.prioridad,
        comprobacionEficacia: formData.comprobacionEficacia.trim(),
      };

      onGuardarRiesgo(nuevoRiesgo);
      setFeedbackMensaje(`¡Riesgo registrado con éxito con nivel ${nivel} (${puntuacion})!`);
      setTimeout(() => setFeedbackMensaje(null), 4000);
    }
  };

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
      {/* Cabecera de la sección */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-600" />
            Identificar y Evaluar un Riesgo
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Formulación sintáctica guiada, evaluación cuantitativa (1-3) y asignación de medidas de protección.
          </p>
        </div>

        {/* Botones de acción rápida */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCargarEjemplo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Cargar ejemplo
          </button>
          <button
            type="button"
            onClick={handleLimpiar}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors focus:ring-2 focus:ring-slate-400 focus:outline-none"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Limpiar formulario
          </button>
        </div>
      </div>

      {feedbackMensaje && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-lg p-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMensaje}</span>
        </div>
      )}

      {/* Aviso de borrador temporal */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-center justify-between">
        <span className="font-medium">
          ⚠️ Borrador temporal. No se guarda al recargar la página.
        </span>
        <span className="text-[11px] text-amber-700 hidden sm:inline">
          Los datos permanecen únicamente en memoria en esta fase del ejercicio.
        </span>
      </div>

      {/* Botón de Ayuda Conceptual */}
      <div>
        <button
          type="button"
          onClick={() => setShowConceptHelp(!showConceptHelp)}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 focus:outline-none"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          {showConceptHelp
            ? "Ocultar guía conceptual de formulación"
            : "Ver guía conceptual (Debilidad vs Amenaza vs Evento vs Consecuencia)"}
        </button>

        {showConceptHelp && (
          <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2 text-slate-700">
            <p className="font-semibold text-slate-900 mb-1">Diferenciación conceptual didáctica:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <strong className="text-amber-800">Debilidad (Condición):</strong> Facilita o predispone que ocurra el daño (ej. copias no probadas, permisos administrativos excesivos).
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <strong className="text-rose-800">Amenaza:</strong> Causa externa o interna con capacidad de provocar daño (ej. fallo del hardware de almacenamiento, ciberataque).
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <strong className="text-sky-800">Evento:</strong> Suceso concreto observable que se materializa (ej. pérdida de acceso a los registros confirmados).
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <strong className="text-purple-800">Consecuencia:</strong> El impacto y efecto real sobre la actividad y sus objetivos (ej. imposibilidad de reconstruir matrículas).
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Formulario en 4 Bloques */}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {/* BLOQUE A: Qué queremos proteger */}
        <fieldset className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3">
          <legend className="px-2 text-xs font-bold uppercase tracking-wider text-indigo-800 bg-indigo-50 border border-indigo-200 rounded">
            Bloque A · Qué queremos proteger
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="proceso" className="block text-xs font-semibold text-slate-700 mb-1">
                Proceso o servicio <span className="text-rose-500">*</span>
              </label>
              <input
                id="proceso"
                type="text"
                maxLength={80}
                value={formData.proceso}
                onChange={(e) => handleChange("proceso", e.target.value)}
                placeholder="Ej. matrícula"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              />
              <span className="text-[10px] text-slate-400">Máx. 80 caracteres</span>
            </div>

            <div>
              <label htmlFor="activo" className="block text-xs font-semibold text-slate-700 mb-1">
                Activo afectado <span className="text-rose-500">*</span>
              </label>
              <select
                id="activo"
                value={formData.activo}
                onChange={(e) => handleChange("activo", e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value="">-- Seleccionar activo --</option>
                <option value="plataforma web">plataforma web</option>
                <option value="base de datos">base de datos</option>
                <option value="copias de seguridad">copias de seguridad</option>
              </select>
            </div>

            <div>
              <label htmlFor="objetivo" className="block text-xs font-semibold text-slate-700 mb-1">
                Objetivo afectado <span className="text-rose-500">*</span>
              </label>
              <select
                id="objetivo"
                value={formData.objetivo}
                onChange={(e) => handleChange("objetivo", e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value="">-- Seleccionar objetivo --</option>
                <option value="completar solicitudes en plazo">completar solicitudes en plazo</option>
                <option value="conservar y recuperar registros">conservar y recuperar registros</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* BLOQUE B: Qué podría ocurrir y por qué */}
        <fieldset className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3">
          <legend className="px-2 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 rounded">
            Bloque B · Qué podría ocurrir y por qué
          </legend>

          <div className="space-y-3">
            <div>
              <label htmlFor="condicion" className="block text-xs font-semibold text-slate-700 mb-1">
                Condición o debilidad conocida <span className="text-rose-500">*</span>
              </label>
              <input
                id="condicion"
                type="text"
                maxLength={200}
                value={formData.condicion}
                onChange={(e) => handleChange("condicion", e.target.value)}
                placeholder="Ej. no se ha probado la restauración de las copias"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              />
              <span className="text-[10px] text-slate-400">Condición previa que facilita el incidente (máx. 200 caract.)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="amenaza" className="block text-xs font-semibold text-slate-700 mb-1">
                  Amenaza (qué podría provocar daño) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="amenaza"
                  type="text"
                  maxLength={150}
                  value={formData.amenaza}
                  onChange={(e) => handleChange("amenaza", e.target.value)}
                  placeholder="Ej. fallo del almacenamiento"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                />
                <span className="text-[10px] text-slate-400">Origen o causa del daño (máx. 150 caract.)</span>
              </div>

              <div>
                <label htmlFor="evento" className="block text-xs font-semibold text-slate-700 mb-1">
                  Evento (qué sucedería concretamente) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="evento"
                  type="text"
                  maxLength={200}
                  value={formData.evento}
                  onChange={(e) => handleChange("evento", e.target.value)}
                  placeholder="Ej. pérdida de acceso a los registros confirmados"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                />
                <span className="text-[10px] text-slate-400">Suceso tangible observable (máx. 200 caract.)</span>
              </div>
            </div>
          </div>
        </fieldset>

        {/* BLOQUE C: Qué consecuencias tendría */}
        <fieldset className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3">
          <legend className="px-2 text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-50 border border-rose-200 rounded">
            Bloque C · Qué consecuencias tendría
          </legend>

          <div>
            <label htmlFor="consecuencia" className="block text-xs font-semibold text-slate-700 mb-1">
              Consecuencia para la organización <span className="text-rose-500">*</span>
            </label>
            <input
              id="consecuencia"
              type="text"
              maxLength={250}
              value={formData.consecuencia}
              onChange={(e) => handleChange("consecuencia", e.target.value)}
              placeholder="Ej. imposibilidad de reconstruir parte de las matrículas"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
            />
            <span className="text-[10px] text-slate-400">Impacto operativo y en el servicio (máx. 250 caract.)</span>
          </div>
        </fieldset>

        {/* BLOQUE D: Qué estamos suponiendo */}
        <fieldset className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3">
          <legend className="px-2 text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-200 rounded">
            Bloque D · Qué estamos suponiendo (Opcional)
          </legend>

          <div>
            <label htmlFor="supuestos" className="block text-xs font-semibold text-slate-700 mb-1">
              Supuestos o información pendiente
            </label>
            <textarea
              id="supuestos"
              rows={2}
              maxLength={300}
              value={formData.supuestos}
              onChange={(e) => handleChange("supuestos", e.target.value)}
              placeholder="Ej. se desconoce si las copias disponibles permiten recuperar todos los registros"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
            />
            <span className="text-[10px] text-slate-400">
              Incertidumbre registrada formalmente (no incrementa automáticamente la probabilidad a nivel alto). Máx. 300 caract.
            </span>
          </div>
        </fieldset>

        {/* BLOQUE E: EVALUACIÓN CUANTITATIVA Y JUSTIFICACIÓN (Fase 4) */}
        <fieldset className="border border-indigo-200 rounded-lg p-4 bg-indigo-50/30 space-y-4">
          <legend className="px-2 text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 border border-indigo-200 rounded flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5" />
            Evaluación Cuantitativa y Justificación (1 a 3)
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Probabilidad */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="probabilidad" className="text-xs font-bold text-slate-800">
                  Probabilidad (1 a 3) <span className="text-rose-500">*</span>
                </label>
                <select
                  id="probabilidad"
                  value={formData.probabilidad}
                  onChange={(e) =>
                    handleChange("probabilidad", Number(e.target.value) as ProbabilidadValor)
                  }
                  className="px-2.5 py-1 text-xs border border-slate-300 rounded-md bg-white font-bold text-slate-900"
                >
                  <option value={1}>1 - Baja</option>
                  <option value={2}>2 - Media</option>
                  <option value={3}>3 - Alta</option>
                </select>
              </div>
              <textarea
                id="justificacionProbabilidad"
                rows={2}
                maxLength={300}
                value={formData.justificacionProbabilidad}
                onChange={(e) => handleChange("justificacionProbabilidad", e.target.value)}
                placeholder="Justificación fundamentada obligatoria de la probabilidad..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 block">
                Explicar por qué es baja, media o alta según las condiciones del caso (máx. 300 car.).
              </span>
            </div>

            {/* Impacto */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="impacto" className="text-xs font-bold text-slate-800">
                  Impacto (1 a 3) <span className="text-rose-500">*</span>
                </label>
                <select
                  id="impacto"
                  value={formData.impacto}
                  onChange={(e) =>
                    handleChange("impacto", Number(e.target.value) as ImpactoValor)
                  }
                  className="px-2.5 py-1 text-xs border border-slate-300 rounded-md bg-white font-bold text-slate-900"
                >
                  <option value={1}>1 - Menor</option>
                  <option value={2}>2 - Significativo</option>
                  <option value={3}>3 - Grave</option>
                </select>
              </div>
              <textarea
                id="justificacionImpacto"
                rows={2}
                maxLength={300}
                value={formData.justificacionImpacto}
                onChange={(e) => handleChange("justificacionImpacto", e.target.value)}
                placeholder="Justificación fundamentada obligatoria del impacto..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 block">
                Explicar afectación al plazo de 7 días o pérdida de registros confirmados (máx. 300 car.).
              </span>
            </div>
          </div>

          {/* Resultado de la Puntuación */}
          <div className="bg-white p-3 rounded-lg border border-indigo-200 flex items-center justify-between">
            <span className="text-xs text-slate-700">
              Cálculo: <strong>{formData.probabilidad}</strong> (Prob.) × <strong>{formData.impacto}</strong> (Imp.) ={" "}
              <span className="font-extrabold text-slate-900 text-sm">{puntuacion} puntos</span>
            </span>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-md border ${
                nivel === "Alto"
                  ? "bg-rose-100 text-rose-800 border-rose-300"
                  : nivel === "Medio"
                  ? "bg-amber-100 text-amber-800 border-amber-300"
                  : "bg-emerald-100 text-emerald-800 border-emerald-300"
              }`}
            >
              Nivel de Riesgo: {nivel}
            </span>
          </div>
        </fieldset>

        {/* BLOQUE F: MEDIDA DE PROTECCIÓN Y COMPROBACIÓN DE EFICACIA (Fase 4) */}
        <fieldset className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3">
          <legend className="px-2 text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-100 border border-slate-200 rounded flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Propuesta de Medida de Protección Concreta
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-3">
              <label htmlFor="medida" className="block text-xs font-semibold text-slate-700 mb-1">
                Medida concreta recomendada <span className="text-rose-500">*</span>
              </label>
              <input
                id="medida"
                type="text"
                maxLength={250}
                value={formData.medida}
                onChange={(e) => handleChange("medida", e.target.value)}
                placeholder="Ej. Protocolo de pruebas periódicas de restauración con checksums..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              />
            </div>

            <div>
              <label htmlFor="prioridad" className="block text-xs font-semibold text-slate-700 mb-1">
                Prioridad <span className="text-rose-500">*</span>
              </label>
              <select
                id="prioridad"
                value={formData.prioridad}
                onChange={(e) => handleChange("prioridad", e.target.value as PrioridadMedida)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white font-semibold"
              >
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="comprobacionEficacia" className="block text-xs font-semibold text-slate-700 mb-1">
              Forma de comprobar su eficacia técnica <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="comprobacionEficacia"
              rows={2}
              maxLength={300}
              value={formData.comprobacionEficacia}
              onChange={(e) => handleChange("comprobacionEficacia", e.target.value)}
              placeholder="Ej. Simulación de recuperación en servidor de contingencia y verificación de hashes..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
            />
            <span className="text-[10px] text-slate-400">
              Método objetivo y comprobable que verifica que la medida protege el activo y objetivo (máx. 300 car.).
            </span>
          </div>

          <div className="bg-amber-50 p-2.5 rounded text-[11px] text-amber-800 border border-amber-200 italic">
            * Recordatorio: Una medida propuesta no reduce automáticamente el riesgo hasta ser implantada y verificada.
          </div>
        </fieldset>
      </form>

      {/* VISTA PREVIA SINTÁCTICA DEL RIESGO */}
      <div className="border border-indigo-200 bg-indigo-50/60 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-1.5">
            {formularioCompleto ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600" />
            )}
            Vista previa de la formulación sintáctica
          </h3>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
              formularioCompleto
                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                : "bg-amber-100 text-amber-800 border border-amber-200"
            }`}
          >
            {formularioCompleto ? "Formulación completa" : "Campos incompletos"}
          </span>
        </div>

        {/* Frase sintáctica compuesta */}
        <div className="bg-white p-4 rounded-lg border border-indigo-100 text-sm leading-relaxed text-slate-800 font-mono text-xs sm:text-sm">
          «Debido a{" "}
          <span className={formData.condicion.trim() ? "font-semibold text-amber-900 bg-amber-50 px-1 py-0.5 rounded" : "italic text-slate-400 bg-slate-100 px-1 rounded"}>
            {formData.condicion.trim() || "[condición o debilidad]"}
          </span>
          ,{" "}
          <span className={formData.amenaza.trim() ? "font-semibold text-rose-900 bg-rose-50 px-1 py-0.5 rounded" : "italic text-slate-400 bg-slate-100 px-1 rounded"}>
            {formData.amenaza.trim() || "[amenaza]"}
          </span>{" "}
          podría provocar{" "}
          <span className={formData.evento.trim() ? "font-semibold text-sky-900 bg-sky-50 px-1 py-0.5 rounded" : "italic text-slate-400 bg-slate-100 px-1 rounded"}>
            {formData.evento.trim() || "[evento concreto]"}
          </span>{" "}
          sobre{" "}
          <span className={formData.activo.trim() ? "font-semibold text-indigo-900 bg-indigo-50 px-1 py-0.5 rounded" : "italic text-slate-400 bg-slate-100 px-1 rounded"}>
            {formData.activo.trim() || "[activo afectado]"}
          </span>
          , causando{" "}
          <span className={formData.consecuencia.trim() ? "font-semibold text-purple-900 bg-purple-50 px-1 py-0.5 rounded" : "italic text-slate-400 bg-slate-100 px-1 rounded"}>
            {formData.consecuencia.trim() || "[consecuencia para la organización]"}
          </span>{" "}
          y afectando al objetivo de{" "}
          <span className={formData.objetivo.trim() ? "font-semibold text-emerald-900 bg-emerald-50 px-1 py-0.5 rounded" : "italic text-slate-400 bg-slate-100 px-1 rounded"}>
            {formData.objetivo.trim() || "[objetivo afectado]"}
          </span>
          , en el proceso de{" "}
          <span className={formData.proceso.trim() ? "font-semibold text-slate-900 bg-slate-200 px-1 py-0.5 rounded" : "italic text-slate-400 bg-slate-100 px-1 rounded"}>
            {formData.proceso.trim() || "[proceso o servicio]"}
          </span>
          ».
        </div>

        {/* Advertencia sobre campos pendientes */}
        {!formularioCompleto && (
          <div className="bg-amber-100/80 border border-amber-300 rounded-lg p-3 text-xs text-amber-900 space-y-1">
            <p className="font-semibold">Faltan campos por completar para cerrar la formulación:</p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {camposPendientes.map((c) => (
                <span key={c.key} className="bg-white text-amber-800 px-2 py-0.5 rounded border border-amber-300 text-[11px]">
                  • {c.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Botón para incorporar a la evaluación */}
        {onGuardarRiesgo && (
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleRegistrarRiesgo}
              disabled={!formularioCompleto || !evaluacionValida}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow transition-colors focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <PlusCircle className="w-4 h-4" />
              Incorporar riesgo a la evaluación
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
