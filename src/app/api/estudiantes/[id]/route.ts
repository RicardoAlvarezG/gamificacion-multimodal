import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const estudianteId = Number(id);

    if (Number.isNaN(estudianteId)) {
      return NextResponse.json(
        { error: "ID de estudiante inválido" },
        { status: 400 }
      );
    }

    const estudiante = await prisma.estudiante.findUnique({
      where: {
        id: estudianteId,
      },
      include: {
        aula: true,
        perfil: true,
        progresosCapacidad: {
      include: {
      capacidad: true,
    },
  },
},
    });

    if (!estudiante) {
      return NextResponse.json(
        { error: "Estudiante no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(estudiante);
  } catch (error) {
    console.error("Error al obtener estudiante:", error);

    return NextResponse.json(
      { error: "Error al obtener estudiante" },
      { status: 500 }
    );
  }
}