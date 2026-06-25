import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const aulaId = Number(searchParams.get("aulaId"));

    if (!aulaId) {
      return NextResponse.json(
        { error: "Falta el aula." },
        { status: 400 }
      );
    }

    const ultimaSesion = await prisma.sesionJuego.findFirst({
      where: {
        aulaId,
      },
      orderBy: {
        numero: "desc",
      },
    });

    const siguienteNumero = ultimaSesion
      ? ultimaSesion.numero + 1
      : 1;

    return NextResponse.json({
      numeroSesion: siguienteNumero,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error al obtener la sesión." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { aulaId, docenteId, numeroSesion, juegosIds } = await req.json();

    if (!aulaId || !docenteId || !numeroSesion) {
      return NextResponse.json(
        { error: "Faltan datos para guardar la sesión." },
        { status: 400 }
      );
    }

    const sesion = await prisma.sesionJuego.create({
      data: {
        aulaId: Number(aulaId),
        docenteId: Number(docenteId),
        numero: Number(numeroSesion),
        detalles: {
          create: (juegosIds || []).map((juegoId: number) => ({
            juegoId: Number(juegoId),
          })),
        },
      },
      include: {
        detalles: true,
      },
    });

    return NextResponse.json({
      message: "Sesión guardada correctamente.",
      sesion,
    });
  } catch (error) {
    console.error("Error al guardar sesión:", error);

    return NextResponse.json(
      { error: "Error al guardar la sesión." },
      { status: 500 }
    );
  }
}