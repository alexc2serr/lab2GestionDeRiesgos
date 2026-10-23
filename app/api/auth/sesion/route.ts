import { NextRequest, NextResponse } from "next/server";
import { verificarTokenSesion } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const cookieToken = req.cookies.get("session_gestor")?.value;

  if (!cookieToken) {
    return NextResponse.json({ autenticado: false }, { status: 200 });
  }

  const payload = verificarTokenSesion(cookieToken);

  if (!payload) {
    return NextResponse.json({ autenticado: false }, { status: 200 });
  }

  return NextResponse.json(
    {
      autenticado: true,
      usuario: payload.usuario,
      exp: payload.exp,
    },
    { status: 200 }
  );
}

