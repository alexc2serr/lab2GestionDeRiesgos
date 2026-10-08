import { Riesgo } from "@/types/riesgo";
import { AlertOctagon, CheckCircle2, HelpCircle, ShieldCheck, TrendingUp, Users } from "lucide-react";

interface Props {
  riesgos: Riesgo[];
}

export default function PanelDireccion({ riesgos }: Props) {
  const riesgosAltos = riesgos.filter((r) => r.nivel === "Alto").length;
  const riesgosMedios = riesgos.filter((r) => r.nivel === "Medio").length;
  const riesgosBajos = riesgos.filter((r) => r.nivel === "Bajo").length;

  return (
    <div className="space-y-6">
      {/* Tarjetas KPI para la Dirección */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Riesgos Evaluados
          </span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
            {riesgos.length}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Campaña de matrícula (7 días)
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/30 shadow-sm">
          <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider block">
            Nivel Alto (Urgente)
          </span>
          <span className="text-2xl font-extrabold text-rose-800 mt-1 block">
            {riesgosAltos}
          </span>
          <span className="text-[11px] text-rose-600 mt-1 block">
            Comprometen objetivos clave
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/30 shadow-sm">
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block">
            Nivel Medio
          </span>
          <span className="text-2xl font-extrabold text-amber-800 mt-1 block">
            {riesgosMedios}
          </span>
          <span className="text-[11px] text-amber-600 mt-1 block">
            Mitigación planificada
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Objetivo en Peligro
          </span>
          <span className="text-sm font-bold text-indigo-900 mt-1 block truncate" title="Conservar y recuperar registros">
            Conservar registros
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Riesgo de pérdida de admisiones
          </span>
        </div>
      </div>

      {/* Resumen Ejecutivo Comprensible */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Resumen Ejecutivo para la Dirección
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Informe de impacto en la continuidad de la campaña y priorización de medidas de protección.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <th className="py-2.5 px-3 font-semibold">Identificador</th>
                <th className="py-2.5 px-3 font-semibold">¿Qué puede ocurrir?</th>
                <th className="py-2.5 px-3 font-semibold">Impacto en el Negocio</th>
                <th className="py-2.5 px-3 font-semibold">Nivel</th>
                <th className="py-2.5 px-3 font-semibold">Medida Recomendada</th>
                <th className="py-2.5 px-3 font-semibold">Prioridad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {riesgos.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {r.id}
                  </td>
                  <td className="py-3 px-3 text-slate-800 max-w-xs">
                    <span className="font-semibold text-slate-900">{r.amenaza}:</span> {r.evento}.
                  </td>
                  <td className="py-3 px-3 text-slate-600 max-w-xs">
                    {r.consecuencia} (afecta al objetivo de <em>{r.objetivo}</em>).
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                        r.nivel === "Alto"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : r.nivel === "Medio"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {r.nivel} ({r.puntuacion})
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 max-w-sm">
                    {r.medida}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap font-semibold">
                    <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[11px]">
                      {r.prioridad}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RESPUESTA A LA PREGUNTA DE CIERRE PARA LA DIRECCIÓN */}
      <div className="bg-gradient-to-br from-indigo-50 via-slate-50 to-white border-2 border-indigo-300 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-start gap-3">
          <HelpCircle className="w-6 h-6 text-indigo-700 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded">
              Pregunta de Cierre para la Dirección
            </span>
            <h4 className="text-base font-bold text-slate-900 mt-1">
              «Si la dirección solo pudiera aprobar una de vuestras medidas, ¿cuál recomendaríais primero y cómo comprobaríais que protege el objetivo afectado?»
            </h4>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-indigo-100 text-xs sm:text-sm text-slate-700 space-y-3">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Medida prioritaria recomendada:</strong>
              <p className="mt-0.5">
                Recomendamos aprobar en primer lugar la <strong>Medida 1: Protocolo y verificación automatizada de restauración de copias de seguridad (Backups)</strong>.
              </p>
            </div>
          </div>

          <div className="pl-7 space-y-2 text-xs text-slate-600 border-l-2 border-indigo-200">
            <p>
              <strong>1. Justificación estratégica para dirección:</strong> La Academia Horizonte se juega toda la admisión del año en una campaña de solo siete días. Aunque restringir permisos administrativos (Medida 2) es una excelente práctica preventiva, <em>ninguna barrera preventiva ofrece una garantía del 100%</em> frente a fallos de hardware, incendios en el centro de datos o desastres imprevistos. Disponer de copias cuya restauración haya sido <strong>fehacientemente demostrada</strong> es el único salvavidas que garantiza la supervivencia del negocio ante cualquier fallo catastrófico.
            </p>
            <p>
              <strong>2. Cómo comprobaríamos que protege el objetivo afectado:</strong>
              El objetivo en peligro es <em>«conservar y recuperar registros confirmados»</em>. Para verificar la protección:
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li>Se ejecutará un simulacro de desastre programado en un servidor de pruebas aislado.</li>
              <li>Se volcará la última copia de seguridad y se ejecutará un script de verificación que compare el número exacto y la suma de comprobación criptográfica (hash) de todas las matrículas recuperadas contra la base de datos de origen.</li>
              <li>El criterio de éxito medible: <strong>100% de registros recuperados con un RTO (Tiempo de Recuperación) menor a 2 horas</strong>, asegurando que ningún alumno admitido pierda su plaza.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
