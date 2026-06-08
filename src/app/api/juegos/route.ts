import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const grado = searchParams.get("grado");

    if (!grado) {
      return NextResponse.json(
        { error: "Falta el grado" },
        { status: 400 }
      );
    }

    const juegos = await (prisma as any).juego.findMany({
      where: {
        grado,
      },
      include: {
        capacidades: {
          include: {
            capacidad: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(juegos);
  } catch (error) {
    console.error("Error al listar juegos:", error);

    return NextResponse.json(
      { error: "Error al listar juegos" },
      { status: 500 }
    );
  }
}