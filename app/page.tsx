"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  AlertTriangle,
  Server,
  Info,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Terminal,
  PlusCircle,
  KeyRound,
  Lock,
  Unlock,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import FormularioRiesgo from "@/components/FormularioRiesgo";
import PanelDireccion from "@/components/PanelDireccion";
import PanelTecnico from "@/components/PanelTecnico";
import { Riesgo } from "@/types/riesgo";
import { RIESGOS_INICIALES } from "@/data/riesgosIniciales";

type TabVista = "direccion" | "tecnico" | "formulario";

export default function Home() {
  const [showEvaluationRules, setShowEvaluationRules] = useState(false);
  const [vistaActiva, setVistaActiva] = useState<TabVista>("direccion");
  const [riesgos, setRiesgos] = useState<Riesgo[]>(RIESGOS_INICIALES);
  const [cargandoRiesgos, setCargandoRiesgos] = useState(true);

  // Estado de Autorización y Sesión del Gestor (Prompt 9 / SEG-03)
  const [adminToken, setAdminToken] = useState<string>("");
  const [estaAutorizado, setEstaAutorizado] = useState(false);
  const [usuarioGestor, setUsuarioGestor] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [inputUsuario, setInputUsuario] = useState("gestor");
  const [inputPassword, setInputPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  // 1. Cargar riesgos desde la API (Persistencia verificada tras recarga)
  const cargarRiesgosDesdeServidor = async () => {
    setCargandoRiesgos(true);
    try {
      const headers: Record<string, string> = {};
      if (adminToken) {
        headers["Authorization"] = `Bearer ${adminToken}`;
      }

      const res = await fetch("/api/riesgos", { headers });
      if (res.ok) {
        const data: Riesgo[] = await res.json();
        if (Array.isArray(data)) {
          setRiesgos(data);
        }
      } else if (res.status === 401) {
        // Sin sesión no se pueden ver registros (Prompt 9, item 2)
        setRiesgos([]);
      }
    } catch (err) {
      console.warn("No se pudo conectar a /api/riesgos:", err);
    } finally {
      setCargandoRiesgos(false);
    }
  };

  // 2. Comprobar sesión al cargar la página
  const comprobarSesionAlCargar = async () => {
    try {
      const res = await fetch("/api/auth/sesion");
      if (res.ok) {
        const data = await res.json();
        if (data.autenticado) {
          setEstaAutorizado(true);
          setUsuarioGestor(data.usuario);
          await cargarRiesgosDesdeServidor();
          return;
        }
      }
    } catch (err) {
      console.warn("Error comprobando sesión HttpOnly:", err);
    }

    // Si había token en sessionStorage para compatibilidad directa
    const tokenGuardado = sessionStorage.getItem("admin_token");
    if (tokenGuardado) {
      setAdminToken(tokenGuardado);
      setEstaAutorizado(true);
      await cargarRiesgosDesdeServidor();
    } else {
      setCargandoRiesgos(false);
    }
  };

  useEffect(() => {
    comprobarSesionAlCargar();
  }, []);

  // 3. Inicio de Sesión perfil «gestor» con contraseña hasheada y cookie HttpOnly (Prompt 9)
  const handleLoginGestor = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario: inputUsuario.trim(),
          contrasena: inputPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setEstaAutorizado(true);
        setUsuarioGestor(data.usuario);
        setAuthSuccessMsg("¡Sesión iniciada con éxito! Cookie HttpOnly firmada en el navegador.");
        setInputPassword("");
        await cargarRiesgosDesdeServidor();
        setTimeout(() => {
          setShowAuthModal(false);
          setAuthSuccessMsg(null);
        }, 1200);
      } else {
        setAuthError(data.error || "Credenciales incorrectas.");
      }
    } catch {
      setAuthError("Error de comunicación con el servicio de autenticación.");
    }
  };

  // 4. Cierre de sesión seguro (limpieza de cookie HttpOnly)
  const handleCerrarSesion = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore
    }
    setAdminToken("");
    setEstaAutorizado(false);
    setUsuarioGestor(null);
    sessionStorage.removeItem("admin_token");
    setInputPassword("");
    setRiesgos([]);
  };

  // 3. Guardar riesgo en el servidor con validación (SEG-05) y autorización (SEG-03)
  const handleGuardarRiesgoEnServidor = async (nuevoRiesgo: Riesgo) => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (adminToken) {
        headers["Authorization"] = `Bearer ${adminToken}`;
      }

      const res = await fetch("/api/riesgos", {
        method: "POST",
        headers,
        body: JSON.stringify(nuevoRiesgo),
      });

      const data = await res.json();

      if (!res.ok) {
        // Alerta con el mensaje exacto del servidor (demostración de SEG-03 o SEG-05)
        alert(`Error del Servidor (${res.status}):\n${data.error || "Operación denegada."}`);
        if (res.status === 401) {
          setShowAuthModal(true);
        }
        return;
      }

      // Si se guardó con éxito:
      alert(`✅ ${data.mensaje}`);
      await cargarRiesgosDesdeServidor();
      setVistaActiva("tecnico");
    } catch (err) {
      alert("Error de conexión al intentar persistir el riesgo.");
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Cabecera Principal y Barra de Autorización (SEG-03) */}
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200 mb-2">
              <Info className="w-3.5 h-3.5" />
              Caso académico con datos ficticios
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Laboratorio de gestión de riesgos
            </h1>
            <p className="mt-1 text-sm sm:text-base text-slate-600">
              Identificar, evaluar y comunicar riesgos para priorizar medidas de protección
            </p>
          </div>

          {/* Control de Seguridad y Autorización (Prompt 9 / SEG-03) */}
          <div className="flex flex-col items-start sm:items-end gap-1.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  estaAutorizado
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                    : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                }`}
              >
                {estaAutorizado ? (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Sesión Gestor Activa (SEG-03)</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Iniciar Sesión Gestor (SEG-03)</span>
                  </>
                )}
              </button>

              {estaAutorizado && (
                <button
                  type="button"
                  onClick={handleCerrarSesion}
                  className="text-[11px] text-rose-600 hover:underline font-semibold"
                >
                  Cerrar Sesión
                </button>
              )}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              Persistencia: PostgreSQL (Neon) / Activa
            </span>
          </div>
        </div>
      </header>

      {/* Modal de Acceso del Gestor y Sesión Segura (Prompt 9) */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Acceso del Gestor (Prompt 9 / SEG-03)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Autenticación para el perfil único <strong>«gestor»</strong>. La sesión se custodia en una cookie <strong>HttpOnly, Secure y SameSite</strong> firmada con secreto de servidor (SESSION_SECRET). La contraseña nunca se guarda en claro (hash PBKDF2/SHA-512) y está protegida contra fuerza bruta.
            </p>

            <form onSubmit={handleLoginGestor} className="space-y-3">
              <div>
                <label htmlFor="inputUsuario" className="block text-xs font-semibold text-slate-700 mb-1">
                  Usuario
                </label>
                <input
                  id="inputUsuario"
                  type="text"
                  value={inputUsuario}
                  onChange={(e) => setInputUsuario(e.target.value)}
                  placeholder="gestor"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label htmlFor="inputPassword" className="block text-xs font-semibold text-slate-700 mb-1">
                  Contraseña (custodiada en Bitwarden)
                </label>
                <input
                  id="inputPassword"
                  type="password"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  placeholder="Introduce la contraseña del gestor..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Valor por defecto en entorno didáctico: <code className="bg-slate-100 px-1 rounded text-slate-700">gestor2026</code>
                </span>
              </div>

              {authError && (
                <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-lg flex items-start gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccessMsg && (
                <div className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{authSuccessMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-colors"
                >
                  Iniciar Sesión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

        {/* NAVEGACIÓN ENTRE VISTAS DE EVALUACIÓN */}
        <div className="bg-slate-200/80 p-1.5 rounded-xl flex flex-wrap gap-1.5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setVistaActiva("direccion")}
            className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
              vistaActiva === "direccion"
                ? "bg-white text-indigo-900 shadow font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-indigo-600" />
            Vista Dirección (Ejecutiva)
          </button>
          <button
            type="button"
            onClick={() => setVistaActiva("tecnico")}
            className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
              vistaActiva === "tecnico"
                ? "bg-white text-indigo-900 shadow font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Terminal className="w-4 h-4 text-indigo-600" />
            Vista Técnica & Matriz
          </button>
          <button
            type="button"
            onClick={() => setVistaActiva("formulario")}
            className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
              vistaActiva === "formulario"
                ? "bg-white text-indigo-900 shadow font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <PlusCircle className="w-4 h-4 text-indigo-600" />
            Identificar / Evaluar Riesgo
          </button>
        </div>

        {/* CONTENIDO SEGÚN LA VISTA SELECCIONADA Y ESTADO DE SESIÓN (Prompt 9 / SEG-03) */}
        {!estaAutorizado ? (
          <div className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-8 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 bg-indigo-50 border border-indigo-200 rounded-full flex items-center justify-center mx-auto text-indigo-600">
              <Lock className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h3 className="text-base font-bold text-slate-900">
                Acceso Protegido: Sesión de Gestor Requerida
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Conforme al <strong>ENS (op.acc.4)</strong> y <strong>NIST SP 800-53 (AC-6)</strong>, sin una sesión válida del perfil <strong>«gestor»</strong> el servidor restringe el acceso a la lectura y escritura de riesgos.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow transition-colors focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <KeyRound className="w-4 h-4" />
              Iniciar Sesión como Gestor
            </button>
          </div>
        ) : (
          <>
            {vistaActiva === "direccion" && <PanelDireccion riesgos={riesgos} />}
            {vistaActiva === "tecnico" && <PanelTecnico riesgos={riesgos} />}
            {vistaActiva === "formulario" && (
              <FormularioRiesgo
                onGuardarRiesgo={handleGuardarRiesgoEnServidor}
                riesgosGuardados={riesgos}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
