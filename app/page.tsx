"use client";

import { useState } from "react";
import { Shield, AlertTriangle, Database, Server, Info, ChevronDown, ChevronUp } from "lucide-react";

export default function Home() {
  const [showEvaluationRules, setShowEvaluationRules] = useState(false);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Cabecera Principal */}
      <header className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200 mb-3">
          <Info className="w-3.5 h-3.5" />
          Caso académico con datos ficticios
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Laboratorio de gestión de riesgos
        </h1>
        <p className="mt-2 text-base sm:text-lg text-slate-600">
          Identificar, evaluar y comunicar riesgos para priorizar medidas de protección
        </p>
      </header>

      {/* Aclaración de Condiciones Ficticias */}
      <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-6 text-sm text-sky-900 flex items-start gap-3 shadow-sm">
        <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Condiciones ficticias:</span> La organización y las condiciones que se describen a continuación pertenecen a un caso inventado para la práctica académica. No describen la configuración real de este proyecto ni de ninguna organización existente.
        </div>
      </div>

      <div className="space-y-6">
        {/* Sección: Organización y Objetivo */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-indigo-600" />
            Organización y objetivo
          </h2>
          <p className="text-slate-700 leading-relaxed mb-3">
            La <strong className="text-slate-900">Academia Horizonte</strong> gestiona matrículas mediante una plataforma web. La campaña dura <span className="font-semibold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded">siete días</span>.
          </p>
          <div className="mb-3">
            <span className="text-sm font-semibold text-slate-700">Su objetivo es que:</span>
            <ul className="list-disc list-inside mt-1 space-y-1 text-slate-600 text-sm pl-2">
              <li>Las solicitudes puedan completarse dentro del plazo establecido.</li>
              <li>Los registros confirmados se conserven y puedan recuperarse íntegramente.</li>
            </ul>
          </div>
          <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2 items-center text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Activos clave:</span>
            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">Plataforma web</span>
            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">Base de datos de matrículas</span>
            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">Copias de seguridad</span>
          </div>
        </section>

        {/* Sección: Condiciones del Caso */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Condiciones del caso
          </h2>
          <ul className="space-y-2.5 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></span>
              <span>Hay una única instancia de base de datos y <strong className="text-slate-900">no se ha probado la restauración</strong> de las copias de seguridad.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></span>
              <span>La cuenta que utiliza la aplicación web tiene <strong className="text-slate-900">permisos administrativos</strong> sobre la base de datos (infracción del mínimo privilegio).</span>
            </li>
          </ul>
        </section>

        {/* Sección Desplegable: Cómo evaluaremos los riesgos */}
        <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => setShowEvaluationRules(!showEvaluationRules)}
            aria-expanded={showEvaluationRules}
            className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-slate-900 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <span className="flex items-center gap-2 text-lg">
              <Server className="w-5 h-5 text-indigo-600" />
              Cómo evaluaremos los riesgos
            </span>
            {showEvaluationRules ? (
              <ChevronUp className="w-5 h-5 text-slate-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-500" />
            )}
          </button>

          {showEvaluationRules && (
            <div className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-6 text-sm">
              <div className="bg-slate-50 p-3 rounded-lg text-slate-700 text-xs border border-slate-200">
                <strong>Horizonte temporal del análisis:</strong> La próxima campaña de matrícula (duración: 7 días).
              </div>

              {/* Escala de Probabilidad */}
              <div>
                <h3 className="font-bold text-slate-900 mb-2 text-base">Escala de Probabilidad (1 a 3)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                    <span className="font-bold text-emerald-700 block">1 - Baja</span>
                    <p className="text-xs text-slate-600 mt-1">Existen razones justificadas para considerar poco probable el evento durante la campaña.</p>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                    <span className="font-bold text-amber-700 block">2 - Media</span>
                    <p className="text-xs text-slate-600 mt-1">El evento es plausible y las condiciones disponibles no permiten considerarlo poco probable.</p>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                    <span className="font-bold text-rose-700 block">3 - Alta</span>
                    <p className="text-xs text-slate-600 mt-1">Hay indicios concretos de que el evento es probable durante la campaña.</p>
                  </div>
                </div>
              </div>

              {/* Escala de Impacto */}
              <div>
                <h3 className="font-bold text-slate-900 mb-2 text-base">Escala de Impacto (1 a 3)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                    <span className="font-bold text-emerald-700 block">1 - Menor</span>
                    <p className="text-xs text-slate-600 mt-1">Incidencia limitada, sin comprometer el plazo ni perder registros confirmados.</p>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                    <span className="font-bold text-amber-700 block">2 - Significativo</span>
                    <p className="text-xs text-slate-600 mt-1">Interrupción o trabajo de recuperación relevante, pero el objetivo todavía puede alcanzarse.</p>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                    <span className="font-bold text-rose-700 block">3 - Grave</span>
                    <p className="text-xs text-slate-600 mt-1">Impide completar solicitudes en plazo o provoca pérdida no recuperable de registros confirmados.</p>
                  </div>
                </div>
              </div>

              {/* Puntuación y Clasificación */}
              <div>
                <h3 className="font-bold text-slate-900 mb-2 text-base">Cálculo y Clasificación del Nivel de Riesgo</h3>
                <p className="text-slate-600 text-xs mb-3">
                  Puntuación calculada mediante la fórmula: <strong className="text-slate-800">Probabilidad × Impacto</strong>.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-900">
                    <span className="font-bold block text-emerald-800">Bajo (1 a 2)</span>
                    <p className="text-xs mt-1">Riesgo asumible con supervisión rutinaria.</p>
                  </div>
                  <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-900">
                    <span className="font-bold block text-amber-800">Medio (3 a 4)</span>
                    <p className="text-xs mt-1">Requiere medidas de mitigación planificadas.</p>
                  </div>
                  <div className="p-3 rounded-lg border border-rose-200 bg-rose-50 text-rose-900">
                    <span className="font-bold block text-rose-800">Alto (6 a 9)</span>
                    <p className="text-xs mt-1">Requiere atención prioritaria e implantación inmediata.</p>
                  </div>
                </div>
              </div>

              {/* Reglas Metodológicas del Laboratorio */}
              <div className="bg-slate-100 p-3.5 rounded-lg text-xs text-slate-700 space-y-1.5 border border-slate-200">
                <p className="font-semibold text-slate-900">Reglas metodológicas:</p>
                <p>• Toda valoración exige una justificación fundamentada.</p>
                <p>• La falta de información se registra como supuesto o información pendiente; nunca se convierte automáticamente en probabilidad alta.</p>
                <p>• Una medida de protección propuesta no reduce automáticamente el riesgo: debe implantarse y verificarse antes de revisar la valoración.</p>
                <p className="italic text-slate-500 pt-1">Nota: Estas reglas corresponden al marco didáctico del laboratorio; no son una fórmula atribuida al ENS ni al NIST.</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

