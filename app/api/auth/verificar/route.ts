import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const adminKeyEsperada = process.env.ADMIN_API_KEY || "laboratorio2026";
    const esValido = Boolean(
      body?.adminKey && typeof body.adminKey === "string" && body.adminKey.trim() === adminKeyEsperada
    );

    return NextResponse.json({ valido: esValido }, { status: 200 });
  } catch {
    return NextResponse.json({ valido: false }, { status: 400 });
  }
}
