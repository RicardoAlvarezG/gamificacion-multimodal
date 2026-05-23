import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function PATCH(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID de docente requerido." },
        { status: 400 }
      );
    }

    const docente = await prisma.usuario.update({
      where: { id: Number(id) },
      data: { estado: "activo" },
      select: {
        id: true,
        nombre: true,
        usuario: true,
        estado: true,
      },
    });

    return NextResponse.json({
      message: "Docente aprobado correctamente.",
      docente,
    });
  } catch (error) {
    console.error("Error aprobando docente:", error);

    return NextResponse.json(
      { error: "Error al aprobar docente." },
      { status: 500 }
    );
  }
}