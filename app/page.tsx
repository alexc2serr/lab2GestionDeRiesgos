export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero-card" aria-labelledby="page-title">
        <header className="hero-header">
          <p className="eyebrow">Gestión de riesgos · Fase 5</p>
          <h1 id="page-title">Laboratorio de gestión de riesgos</h1>
          <p className="description">
            Identificar, evaluar y comunicar riesgos para priorizar medidas de
            protección
          </p>
        </header>

        <div className="notice" role="note">
          <span aria-hidden="true">ⓘ</span>
          <span>Caso académico con datos ficticios</span>
        </div>

        <div className="content-grid">
          <section className="content-section" aria-labelledby="organization-title">
            <p className="section-label">Contexto</p>
            <h2 id="organization-title">Organización y objetivo</h2>
            <p>
              La Academia Horizonte gestiona matrículas mediante una plataforma
              web durante una campaña de siete días. El objetivo es completar
              las solicitudes dentro del plazo y conservar los registros
              confirmados para poder recuperarlos.
            </p>
          </section>

          <section className="content-section" aria-labelledby="conditions-title">
            <p className="section-label">Punto de partida</p>
            <h2 id="conditions-title">Condiciones del caso</h2>
            <ul>
              <li>Activos: plataforma web, base de datos y copias de seguridad.</li>
              <li>Existe una única instancia de base de datos.</li>
              <li>No se ha probado la restauración de las copias.</li>
              <li>La cuenta de la aplicación tiene permisos administrativos.</li>
            </ul>
            <p className="fiction-note">
              Estas condiciones son ficticias y no describen la configuración
              real de este proyecto.
            </p>
          </section>

          <details className="evaluation-details">
            <summary>Cómo evaluaremos los riesgos</summary>
            <div className="details-content">
              <p>
                El horizonte será la próxima campaña de matrícula. La
                puntuación se calculará como probabilidad × impacto.
              </p>
              <div className="scale-grid">
                <div>
                  <h3>Probabilidad</h3>
                  <ul>
                    <li><strong>1 Baja:</strong> razones justificadas para considerarlo poco probable.</li>
                    <li><strong>2 Media:</strong> es plausible y no puede considerarse poco probable.</li>
                    <li><strong>3 Alta:</strong> hay indicios concretos de que ocurrirá durante la campaña.</li>
                  </ul>
                </div>
                <div>
                  <h3>Impacto</h3>
                  <ul>
                    <li><strong>1 Menor:</strong> incidencia limitada sin perder plazo ni registros.</li>
                    <li><strong>2 Significativo:</strong> recuperación relevante, pero el objetivo aún puede alcanzarse.</li>
                    <li><strong>3 Grave:</strong> impide el plazo o causa pérdida no recuperable de registros.</li>
                  </ul>
                </div>
              </div>
              <p className="classification">
                <strong>Clasificación:</strong> bajo 1–2, medio 3–4 y alto 6–9.
                Cada valoración debe incluir una justificación.
              </p>
              <p>
                La falta de información se anotará como supuesto o información
                pendiente; no se convertirá automáticamente en probabilidad
                alta.
              </p>
            </div>
          </details>
        </div>
      </section>
    </main>
  );
}
