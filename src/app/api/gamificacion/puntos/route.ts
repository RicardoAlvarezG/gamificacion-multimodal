import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function calcularNivel(puntos: number) {
  if (puntos >= 1751) return 5;
  if (puntos >= 1301) return 4;
  if (puntos >= 851) return 3;
  if (puntos >= 401) return 2;
  return 1;
}

export async function POST(request: Request) {
  try {
    const { estudianteId, puntos, motivo } = await request.json();

    if (!estudianteId || !puntos || !motivo) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    const perfilActual = await prisma.perfilGamificado.upsert({
      where: {
        estudianteId: Number(estudianteId),
      },
      update: {},
      create: {
        estudianteId: Number(estudianteId),
        nivel: 1,
        puntosTotal: 0,
      },
    });

    const nuevosPuntos = perfilActual.puntosTotal + Number(puntos);
    const nuevoNivel = calcularNivel(nuevosPuntos);

    await prisma.puntaje.create({
      data: {
        estudianteId: Number(estudianteId),
        puntos: Number(puntos),
        motivo,
      },
    });

    const perfilActualizado = await prisma.perfilGamificado.update({
      where: {
        estudianteId: Number(estudianteId),
      },
      data: {
        puntosTotal: nuevosPuntos,
        nivel: nuevoNivel,
      },
    });

    return NextResponse.json({
      message: "Puntos registrados correctamente",
      perfil: perfilActualizado,
    });
  } catch (error) {
    console.error("Error al registrar puntos:", error);

    return NextResponse.json(
      { error: "Error al registrar puntos" },
      { status: 500 }
    );
  }
}