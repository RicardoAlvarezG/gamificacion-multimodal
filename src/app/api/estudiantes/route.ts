import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const aulaId = searchParams.get("aulaId");

    if (!aulaId) {
      return NextResponse.json(
        { error: "Falta el ID del aula" },
        { status: 400 }
      );
    }

    const estudiantes = await prisma.estudiante.findMany({
      where: {
        aulaId: Number(aulaId),
      },
      include: {
        perfil: true,
        puntajes: true,
      },
      orderBy: {
        apellidos: "asc",
      },
    });

    return NextResponse.json(estudiantes);
  } catch (error) {
    console.error("Error al obtener estudiantes:", error);

    return NextResponse.json(
      { error: "Error al obtener estudiantes" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { nombres, apellidos, aulaId } = await req.json();

    if (!nombres || !apellidos || !aulaId) {
      return NextResponse.json(
        { error: "Nombres, apellidos y aula son obligatorios" },
        { status: 400 }
      );
    }

    const estudiante = await prisma.estudiante.create({
      data: {
        nombres,
        apellidos,
        aulaId: Number(aulaId),
        perfil: {
          create: {
            nivel: 1,
            puntosTotal: 0,
          },
        },
      },
      include: {
        perfil: true,
      },
    });

    return NextResponse.json(estudiante);
  } catch (error) {
    console.error("Error al crear estudiante:", error);

    return NextResponse.json(
      { error: "Error al crear estudiante" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { estudianteId, nombres, apellidos, aulaId } = await req.json();

    if (!estudianteId || !nombres || !apellidos || !aulaId) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const estudiante = await prisma.estudiante.update({
      where: {
        id: Number(estudianteId),
      },
      data: {
        nombres,
        apellidos,
        aulaId: Number(aulaId),
      },
      include: {
        perfil: true,
      },
    });

    return NextResponse.json(estudiante);
  } catch (error) {
    console.error("Error al editar estudiante:", error);

    return NextResponse.json(
      { error: "Error al editar estudiante" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { estudianteId } = await req.json();

    if (!estudianteId) {
      return NextResponse.json(
        { error: "Falta el ID del estudiante" },
        { status: 400 }
      );
    }

    await prisma.puntaje.deleteMany({
      where: {
        estudianteId: Number(estudianteId),
      },
    });

    await prisma.perfilGamificado.deleteMany({
      where: {
        estudianteId: Number(estudianteId),
      },
    });

    await prisma.estudiante.delete({
      where: {
        id: Number(estudianteId),
      },
    });

    return NextResponse.json({
      message: "Estudiante eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar estudiante:", error);

    return NextResponse.json(
      { error: "Error al eliminar estudiante" },
      { status: 500 }
    );
  }
}