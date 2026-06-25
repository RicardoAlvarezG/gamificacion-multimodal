import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";

function validarPassword(password: string) {
  const longitud = password.length >= 8 && password.length <= 15;
  const mayuscula = /[A-Z]/.test(password);
  const minuscula = /[a-z]/.test(password);
  const numero = /\d/.test(password);
  const simbolo = /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\];'`~]/.test(password);

  return longitud && mayuscula && minuscula && numero && simbolo;
}

export async function PUT(req: Request) {
  try {
    const { usuarioId, passwordActual, nuevaPassword } = await req.json();

    if (!usuarioId || !passwordActual || !nuevaPassword) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios." },
        { status: 400 }
      );
    }

    if (!validarPassword(nuevaPassword)) {
      return NextResponse.json(
        {
          error:
            "La nueva contraseña debe tener entre 8 y 15 caracteres, incluir una mayúscula, una minúscula, un número y un símbolo.",
        },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        id: Number(usuarioId),
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuario no encontrado." },
        { status: 404 }
      );
    }

    const passwordCorrecta = await bcrypt.compare(
      passwordActual,
      usuario.password
    );

    if (!passwordCorrecta) {
      return NextResponse.json(
        { error: "La contraseña actual es incorrecta." },
        { status: 401 }
      );
    }

    const nuevaPasswordHash = await bcrypt.hash(nuevaPassword, 10);

    await prisma.usuario.update({
      where: {
        id: Number(usuarioId),
      },
      data: {
        password: nuevaPasswordHash,
      },
    });

    return NextResponse.json({
      message: "Contraseña actualizada correctamente.",
    });
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);

    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}