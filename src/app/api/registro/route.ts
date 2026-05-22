import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";

function generarCodigoInstitucional() {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numeros = "0123456789";

  let codigo = "INST-";

  for (let i = 0; i < 2; i++) {
    codigo += letras[Math.floor(Math.random() * letras.length)];
  }

  for (let i = 0; i < 4; i++) {
    codigo += numeros[Math.floor(Math.random() * numeros.length)];
  }

  return codigo;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      nombre,
      correo,
      institucion,
      usuario,
      rol,
      codigoInstitucional,
      password,
    } = body;

    if (!nombre || !correo || !usuario || !rol || !password) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios." },
        { status: 400 }
      );
    }

    const usuarioExiste = await prisma.usuario.findFirst({
      where: {
        OR: [{ usuario }, { correo }],
      },
    });

    if (usuarioExiste) {
      return NextResponse.json(
        { error: "El usuario o correo ya está registrado." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    if (rol === "ADMIN") {
      if (!institucion) {
        return NextResponse.json(
          { error: "La institución es obligatoria para administrador." },
          { status: 400 }
        );
      }

      const codigo = generarCodigoInstitucional();

      const nuevaInstitucion = await prisma.institucion.create({
        data: {
          nombre: institucion,
          codigo,
        },
      });

      const nuevoUsuario = await prisma.usuario.create({
        data: {
          nombre,
          correo,
          usuario,
          password: passwordHash,
          rol: "ADMIN",
          codigoInstitucional: codigo,
          institucionId: nuevaInstitucion.id,
          estado: "activo",
        },
      });

      return NextResponse.json({
        message: "Administrador registrado correctamente.",
        usuario: {
          id: nuevoUsuario.id,
          nombre: nuevoUsuario.nombre,
          rol: nuevoUsuario.rol,
          codigoInstitucional: codigo,
        },
      });
    }

    if (rol === "DOCENTE") {
      let institucionId = null;
      let estado = "activo";

      if (codigoInstitucional) {
        const institucionEncontrada = await prisma.institucion.findUnique({
          where: {
            codigo: codigoInstitucional,
          },
        });

        if (!institucionEncontrada) {
          return NextResponse.json(
            { error: "El código institucional no existe." },
            { status: 400 }
          );
        }

        institucionId = institucionEncontrada.id;
        estado = "pendiente";
      }

      const nuevoUsuario = await prisma.usuario.create({
        data: {
          nombre,
          correo,
          usuario,
          password: passwordHash,
          rol: "DOCENTE",
          institucionId,
          estado,
        },
      });

      return NextResponse.json({
        message:
          estado === "pendiente"
            ? "Docente registrado. Queda pendiente de aprobación."
            : "Docente independiente registrado correctamente.",
        usuario: {
          id: nuevoUsuario.id,
          nombre: nuevoUsuario.nombre,
          rol: nuevoUsuario.rol,
          estado: nuevoUsuario.estado,
        },
      });
    }

    return NextResponse.json(
      { error: "Rol no válido." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error en registro:", error);

    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}