import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { mensaje: "Sesión cerrada con éxito." },
    { status: 200 }
  );

  // Destruir la cookie de sesión HttpOnly
  response.cookies.set({
    name: "session_gestor",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}

