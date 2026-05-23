import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { usuario, password } = await req.json();

    if (!usuario || !password) {
      return NextResponse.json(
        { error: "Usuario y contraseña son obligatorios." },
        { status: 400 }
      );
    }

    const user = await prisma.usuario.findUnique({
      where: { usuario },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario o contraseña incorrectos." },
        { status: 401 }
      );
    }

    const passwordValida = await bcrypt.compare(password, user.password);

    if (!passwordValida) {
      return NextResponse.json(
        { error: "Usuario o contraseña incorrectos." },
        { status: 401 }
      );
    }

    if (user.estado !== "activo") {
      return NextResponse.json(
        { error: "Tu cuenta aún no está activa." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      message: "Login correcto.",
      usuario: {
        id: user.id,
        nombre: user.nombre,
        usuario: user.usuario,
        rol: user.rol,
        codigoInstitucional: user.codigoInstitucional,
        }
    });
  } catch (error) {
    console.error("Error en login:", error);

    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}