import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function calcularNivelCapacidad(puntos: number) {
  if (puntos >= 121) return "DESTACADO";
  if (puntos >= 81) return "LOGRADO";
  if (puntos >= 41) return "EN_PROCESO";
  return "EN_INICIO";
}

function calcularNivelAvatar(puntos: number) {
  if (puntos >= 1601) return 5;
  if (puntos >= 1201) return 4;
  if (puntos >= 801) return 3;
  if (puntos >= 401) return 2;
  return 1;
}

export async function POST(request: Request) {
  try {
    const { estudianteId, juegoId, capacidadId } = await request.json();

    if (!estudianteId || !juegoId || !capacidadId) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    const puntos = 10;

    await (prisma as any).evidenciaCapacidad.create({
      data: {
        estudianteId: Number(estudianteId),
        juegoId: Number(juegoId),
        capacidadId: Number(capacidadId),
        puntos,
      },
    });

    const progreso = await (prisma as any).progresoCapacidad.upsert({
      where: {
        estudianteId_capacidadId: {
          estudianteId: Number(estudianteId),
          capacidadId: Number(capacidadId),
        },
      },
      update: {},
      create: {
        estudianteId: Number(estudianteId),
        capacidadId: Number(capacidadId),
        puntos: 0,
        nivel: "EN_INICIO",
      },
    });

    const nuevosPuntosCapacidad = progreso.puntos + puntos;
    const nuevoNivelCapacidad = calcularNivelCapacidad(nuevosPuntosCapacidad);

    await (prisma as any).progresoCapacidad.update({
      where: {
        estudianteId_capacidadId: {
          estudianteId: Number(estudianteId),
          capacidadId: Number(capacidadId),
        },
      },
      data: {
        puntos: nuevosPuntosCapacidad,
        nivel: nuevoNivelCapacidad,
      },
    });

    const progresos = await (prisma as any).progresoCapacidad.findMany({
      where: {
        estudianteId: Number(estudianteId),
      },
    });

    const puntosTotales = progresos.reduce(
      (total: number, item: any) => total + item.puntos,
      0
    );

    const nuevoNivelAvatar = calcularNivelAvatar(puntosTotales);

    await prisma.perfilGamificado.upsert({
      where: {
        estudianteId: Number(estudianteId),
      },
      update: {
        puntosTotal: puntosTotales,
        nivel: nuevoNivelAvatar,
      },
      create: {
        estudianteId: Number(estudianteId),
        puntosTotal: puntosTotales,
        nivel: nuevoNivelAvatar,
      },
    });

    return NextResponse.json({
      message: "Evidencia registrada correctamente",
      puntosCapacidad: nuevosPuntosCapacidad,
      nivelCapacidad: nuevoNivelCapacidad,
      puntosTotales,
      nivelAvatar: nuevoNivelAvatar,
    });
  } catch (error) {
    console.error("Error al registrar evidencia:", error);

    return NextResponse.json(
      { error: "Error al registrar evidencia" },
      { status: 500 }
    );
  }
}