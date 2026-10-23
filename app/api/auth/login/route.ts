import { NextRequest, NextResponse } from "next/server";
import {
  comprobarLimiteIntentos,
  registrarIntentoFallido,
  limpiarIntentosFallidos,
  verificarContrasenaGestor,
  firmarTokenSesion,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";

    // 1. Control de Fuerza Bruta (Límite de intentos fallidos)
    const estadoLimite = comprobarLimiteIntentos(ip);
    if (!estadoLimite.permitido) {
      const minutosRestantes = Math.ceil((estadoLimite.restanteMs || 0) / 60000);
      return NextResponse.json(
        {
          error: `Demasiados intentos fallidos consecutivos. Acceso bloqueado temporalmente por seguridad. Inténtelo de nuevo en ${minutosRestantes} minuto(s).`,
        },
        { status: 429 }
      );
    }

    let body: { usuario?: string; contrasena?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Cuerpo de solicitud inválido." },
        { status: 400 }
      );
    }

    const { usuario, contrasena } = body;

    if (!usuario || !contrasena) {
      return NextResponse.json(
        { error: "Debe proporcionar usuario y contraseña." },
        { status: 400 }
      );
    }

    // 2. Comprobación del perfil único «gestor»
    const usuarioValido = usuario.trim().toLowerCase() === "gestor";
    const contrasenaValida = usuarioValido && verificarContrasenaGestor(contrasena);

    if (!usuarioValido || !contrasenaValida) {
      const { bloqueado } = registrarIntentoFallido(ip);
      const msg = bloqueado
        ? "Credenciales incorrectas. Ha superado el límite de intentos permitidos; su acceso ha sido bloqueado temporalmente durante 15 minutos."
        : "Credenciales incorrectas para el perfil gestor.";

      return NextResponse.json({ error: msg }, { status: 401 });
    }

    // 3. Login Exitoso: limpiar intentos fallidos y firmar sesión
    limpiarIntentosFallidos(ip);

    const duracionSegundos = 8 * 60 * 60; // 8 horas
    const exp = Date.now() + duracionSegundos * 1000;
    const token = firmarTokenSesion({ usuario: "gestor", exp });

    const response = NextResponse.json(
      {
        mensaje: "Sesión iniciada correctamente como gestor.",
        usuario: "gestor",
      },
      { status: 200 }
    );

    // 4. Configuración de cookie segura (HttpOnly, Secure, SameSite)
    response.cookies.set({
      name: "session_gestor",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: duracionSegundos,
    });

    return response;
  } catch (error) {
    console.error("Error en POST /api/auth/login:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al autenticar." },
      { status: 500 }
    );
  }
}

