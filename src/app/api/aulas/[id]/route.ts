import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const aulaId = Number(id);

    if (isNaN(aulaId)) {
      return NextResponse.json(
        { error: "ID de aula inválido" },
        { status: 400 }
      );
    }

const aula = await prisma.aula.findUnique({
  where: {
    id: aulaId,
  },
  select: {
    id: true,
    nombre: true,
    turno: true,
    docenteId: true,
    docente: {
      select: {
        nombre: true,
        apellido: true,
      },
    },
    estudiantes: {
      select: {
        id: true,
        nombres: true,
        apellidos: true,
            perfil: {
        select: {
          avatar: true,
          nivel: true,
        },
      },
        progresosCapacidad: {
          include: {
            capacidad: true,
          },
        },
      },
      orderBy: {
        apellidos: "asc",
      },
    },
  },
});

    if (!aula) {
      return NextResponse.json(
        { error: "Aula no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(aula);
  } catch (error) {
    console.error("Error al cargar aula:", error);

    return NextResponse.json(
      { error: "Error al cargar aula" },
      { status: 500 }
    );
  }
}