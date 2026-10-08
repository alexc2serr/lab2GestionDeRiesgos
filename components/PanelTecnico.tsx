import { Riesgo } from "@/types/riesgo";
import MatrizRiesgos from "@/components/MatrizRiesgos";
import { Terminal, Shield, CheckCircle, Wrench, AlertTriangle, FileCode } from "lucide-react";

interface Props {
  riesgos: Riesgo[];
}

export default function PanelTecnico({ riesgos }: Props) {
  return (
    <div className="space-y-6">
      {/* Matriz 3x3 interactiva */}
      <MatrizRiesgos riesgos={riesgos} />

      {/* Detalle Técnico de Riesgos Registrados */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-600" />
            Detalle Técnico y Medidas de Protección
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {riesgos.length} escenario(s) documentado(s)
          </span>
        </div>

        {/* Advertencia metodológica obligatoria */}
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Regla didáctica fundamental:</strong> Una medida de protección propuesta <strong>no reduce automáticamente la valoración del riesgo</strong>. Es indispensable implantarla técnicamente en el entorno y verificar su eficacia mediante pruebas objetivas antes de recalcular la puntuación residual.
          </span>
        </div>

        {/* Tarjetas de Detalle Técnico */}
        <div className="space-y-5">
          {riesgos.map((r) => (
            <div
              key={r.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4"
            >
              {/* Cabecera del Riesgo */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm bg-slate-900 text-white px-2.5 py-0.5 rounded">
                    {r.id}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    Activo: <strong className="text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{r.activo}</strong>
                  </span>
                  <span className="text-xs font-semibold text-slate-600 hidden sm:inline">
                    Proceso: <strong className="text-slate-800">{r.proceso}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-mono">
                    P: {r.probabilidad} × I: {r.impacto} =
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                      r.nivel === "Alto"
                        ? "bg-rose-50 text-rose-800 border-rose-300"
                        : r.nivel === "Medio"
                        ? "bg-amber-50 text-amber-800 border-amber-300"
                        : "bg-emerald-50 text-emerald-800 border-emerald-300"
                    }`}
                  >
                    Nivel {r.nivel} ({r.puntuacion})
                  </span>
                </div>
              </div>

              {/* Formulación Sintáctica */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-mono leading-relaxed text-slate-800">
                <span className="text-slate-400 block mb-1 text-[10px] uppercase font-sans font-bold">
                  Formulación sintáctica guiada:
                </span>
                «Debido a <strong className="text-amber-800">{r.condicion}</strong>,{" "}
                <strong className="text-rose-800">{r.amenaza}</strong> podría provocar{" "}
                <strong className="text-sky-800">{r.evento}</strong> sobre{" "}
                <strong className="text-indigo-800">{r.activo}</strong>, causando{" "}
                <strong className="text-purple-800">{r.consecuencia}</strong> y afectando al objetivo de{" "}
                <strong className="text-emerald-800">{r.objetivo}</strong>, en el proceso de{" "}
                <strong className="text-slate-900">{r.proceso}</strong>».
              </div>

              {/* Justificación de la Evaluación */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <span className="font-bold text-slate-900 block mb-1">
                    Justificación de Probabilidad (Valor: {r.probabilidad}/3):
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {r.justificacionProbabilidad}
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <span className="font-bold text-slate-900 block mb-1">
                    Justificación de Impacto (Valor: {r.impacto}/3):
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {r.justificacionImpacto}
                  </p>
                </div>
              </div>

              {/* Supuestos si existen */}
              {r.supuestos && (
                <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-200">
                  <strong className="text-slate-700">Supuesto / Incertidumbre registrada:</strong> {r.supuestos}
                </div>
              )}

              {/* Medida de Protección y Verificación de Eficacia */}
              <div className="border border-indigo-200 bg-indigo-50/40 rounded-lg p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-indigo-100 pb-2">
                  <span className="font-bold text-xs text-indigo-950 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-indigo-700" />
                    Propuesta de Medida de Protección Técnica
                  </span>
                  <div className="flex items-center gap-2">
                    {r.referenciaControl && (
                      <span className="text-[11px] font-mono text-indigo-800 bg-white px-2 py-0.5 rounded border border-indigo-200">
                        {r.referenciaControl}
                      </span>
                    )}
                    <span className="text-[11px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
                      Prioridad: {r.prioridad}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-800">
                  <strong className="text-slate-900 block mb-0.5">Descripción de la medida:</strong>
                  {r.medida}
                </div>

                <div className="text-xs text-slate-700 bg-white p-3 rounded border border-indigo-100 space-y-1">
                  <strong className="text-indigo-950 flex items-center gap-1">
                    <Wrench className="w-3.5 h-3.5 text-indigo-600" />
                    Forma de comprobar su eficacia técnica:
                  </strong>
                  <p className="text-slate-600 leading-relaxed">
                    {r.comprobacionEficacia}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
