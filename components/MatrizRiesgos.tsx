import { Riesgo } from "@/types/riesgo";

interface Props {
  riesgos: Riesgo[];
}

export default function MatrizRiesgos({ riesgos }: Props) {
  // Matriz 3x3: Filas = Probabilidad (3, 2, 1), Columnas = Impacto (1, 2, 3)
  const filasProbabilidad: (3 | 2 | 1)[] = [3, 2, 1];
  const columnasImpacto: (1 | 2 | 3)[] = [1, 2, 3];

  const getColorCelda = (p: number, i: number) => {
    const score = p * i;
    if (score >= 6) return "bg-rose-100/90 border-rose-300 text-rose-950";
    if (score >= 3) return "bg-amber-100/90 border-amber-300 text-amber-950";
    return "bg-emerald-100/90 border-emerald-300 text-emerald-950";
  };

  const getEtiquetaNivel = (p: number, i: number) => {
    const score = p * i;
    if (score >= 6) return "Alto";
    if (score >= 3) return "Medio";
    return "Bajo";
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
        <h3 className="text-base font-bold text-slate-900">
          Matriz de Evaluación de Riesgos (3 × 3)
        </h3>
        <span className="text-xs text-slate-500">
          Puntuación = Probabilidad × Impacto
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[420px]">
          {/* Encabezado de columnas: Impacto */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold mb-2">
            <div className="text-slate-400 self-end text-[11px] pb-1">
              Probabilidad \ Impacto
            </div>
            <div className="bg-slate-100 py-1.5 px-2 rounded text-slate-700">
              1 · Menor
            </div>
            <div className="bg-slate-100 py-1.5 px-2 rounded text-slate-700">
              2 · Significativo
            </div>
            <div className="bg-slate-100 py-1.5 px-2 rounded text-slate-700">
              3 · Grave
            </div>
          </div>

          {/* Filas: Probabilidad descendente (3, 2, 1) */}
          {filasProbabilidad.map((p) => {
            const pNombre = p === 3 ? "3 · Alta" : p === 2 ? "2 · Media" : "1 · Baja";
            return (
              <div key={p} className="grid grid-cols-4 gap-2 mb-2">
                {/* Etiqueta de fila */}
                <div className="bg-slate-100 py-2 px-2.5 rounded text-xs font-semibold text-slate-700 flex items-center justify-center">
                  {pNombre}
                </div>

                {/* Celdas de la fila */}
                {columnasImpacto.map((i) => {
                  const score = p * i;
                  const nivel = getEtiquetaNivel(p, i);
                  const colorClass = getColorCelda(p, i);
                  const riesgosEnCelda = riesgos.filter(
                    (r) => r.probabilidad === p && r.impacto === i
                  );

                  return (
                    <div
                      key={`${p}-${i}`}
                      className={`border rounded-lg p-2.5 min-h-[72px] flex flex-col justify-between transition-shadow hover:shadow-md ${colorClass}`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span>Punt: {score}</span>
                        <span className="uppercase tracking-wider text-[10px] opacity-80">
                          {nivel}
                        </span>
                      </div>

                      {/* Chips de riesgos ubicados en esta celda */}
                      <div className="mt-1 flex flex-wrap gap-1">
                        {riesgosEnCelda.map((r) => (
                          <span
                            key={r.id}
                            title={`${r.id}: ${r.amenaza}`}
                            className="bg-white/95 text-slate-900 border border-slate-300 font-mono text-[10px] px-1.5 py-0.5 rounded shadow-sm"
                          >
                            {r.id}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            Bajo (1 a 2)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            Medio (3 a 4)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
            Alto (6 a 9)
          </span>
        </div>
        <span className="italic text-slate-500">
          Ubicación de riesgos según su evaluación actual
        </span>
      </div>
    </div>
  );
}
