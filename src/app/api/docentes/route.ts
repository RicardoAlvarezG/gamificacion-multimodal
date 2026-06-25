import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const institucionId = searchParams.get("institucionId");

    if (!institucionId) {
      return NextResponse.json(
        { error: "Falta el ID de la institución." },
        { status: 400 }
      );
    }

    const docentes = await prisma.usuario.findMany({
      where: {
        rol: "DOCENTE",
        institucionId: Number(institucionId),
      },
              select: {
        id: true,
        nombre: true,
        usuario: true,
        correo: true,
        estado: true,
        institucionId: true,

        _count: {
          select: {
            aulasDocente: true,
          },
        },
      },
    });

    return NextResponse.json(docentes);
  } catch (error) {
    console.error("Error listando docentes:", error);

    return NextResponse.json(
      { error: "Error al listar docentes." },
      { status: 500 }
    );
  }
}