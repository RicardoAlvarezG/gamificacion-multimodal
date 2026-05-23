import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const aulas = await prisma.aula.findMany({
      include: {
        docente: true,
        institucion: true,
        estudiantes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(aulas);
  } catch (error) {
    console.error("Error al obtener aulas:", error);

    return NextResponse.json(
      { error: "Error al obtener aulas" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { nombre, turno, institucionId, docenteId } = body;

    if (!nombre || !turno) {
      return NextResponse.json(
        { error: "Nombre y turno son obligatorios" },
        { status: 400 }
      );
    }

    const aula = await prisma.aula.create({
      data: {
        nombre,
        turno,
        institucionId: institucionId || null,
        docenteId: docenteId ? Number(docenteId) : null,
      },
    });

    return NextResponse.json(aula);
  } catch (error) {
    console.error("Error al crear aula:", error);

    return NextResponse.json(
      { error: "Error al crear aula" },
      { status: 500 }
    );
  }
}
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const { aulaId, docenteId } = body;

    if (!aulaId) {
      return NextResponse.json(
        { error: "Falta el ID del aula" },
        { status: 400 }
      );
    }

    const aulaActualizada = await prisma.aula.update({
      where: {
        id: Number(aulaId),
      },
      data: {
        docenteId: docenteId ? Number(docenteId) : null,
      },
      include: {
        docente: true,
        institucion: true,
        estudiantes: true,
      },
    });

    return NextResponse.json(aulaActualizada);
  } catch (error) {
    console.error("Error al actualizar aula:", error);

    return NextResponse.json(
      { error: "Error al actualizar aula" },
      { status: 500 }
    );
  }
}