import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const { estudianteId, avatar } = await request.json();

    if (!estudianteId || !avatar) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    const perfil = await prisma.perfilGamificado.upsert({
      where: {
        estudianteId: Number(estudianteId),
      },
      update: {
        avatar,
      },
      create: {
        estudianteId: Number(estudianteId),
        avatar,
        nivel: 1,
        puntosTotal: 0,
      },
    });

    return NextResponse.json({
      message: "Avatar actualizado correctamente",
      perfil,
    });
  } catch (error) {
    console.error("Error al actualizar avatar:", error);

    return NextResponse.json(
      { error: "Error al actualizar avatar" },
      { status: 500 }
    );
  }
}