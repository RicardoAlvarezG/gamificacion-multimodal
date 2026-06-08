import "dotenv/config";
import { prisma } from "../src/lib/prisma";



async function main() {
  const capacidades = [
    {
      codigo: "C01",
      nombre: "Comprensión Oral",
      area: "Comunicación",
      color: "#3B82F6",
    },
    {
      codigo: "C02",
      nombre: "Expresión Oral",
      area: "Comunicación",
      color: "#2563EB",
    },
    {
      codigo: "C03",
      nombre: "Reconocimiento de Vocales y Letras",
      area: "Comunicación",
      color: "#1D4ED8",
    },
    {
      codigo: "C04",
      nombre: "Conteo y Cantidad",
      area: "Pensamiento Matemático",
      color: "#10B981",
    },
    {
      codigo: "C05",
      nombre: "Figuras Geométricas",
      area: "Pensamiento Matemático",
      color: "#F97316",
    },
    {
      codigo: "C06",
      nombre: "Ubicación Espacial",
      area: "Pensamiento Matemático",
      color: "#8B5CF6",
    },
    {
      codigo: "C07",
      nombre: "Patrones y Secuencias",
      area: "Pensamiento Matemático",
      color: "#22C55E",
    },
    {
      codigo: "C08",
      nombre: "Reconocimiento de Emociones",
      area: "Personal Social",
      color: "#EAB308",
    },
    {
      codigo: "C09",
      nombre: "Trabajo en Equipo",
      area: "Personal Social",
      color: "#FACC15",
    },
    {
      codigo: "C10",
      nombre: "Autonomía y Responsabilidad",
      area: "Personal Social",
      color: "#F59E0B",
    },
    {
      codigo: "C11",
      nombre: "Observación y Atención",
      area: "Exploración del Entorno",
      color: "#A855F7",
    },
    {
      codigo: "C12",
      nombre: "Asociación y Clasificación",
      area: "Exploración del Entorno",
      color: "#EC4899",
    },
  ];
        const juegos = [
        {
            nombre: "Colores Mágicos",
            grado: "3",
            descripcion: "Juego para identificar colores básicos y asociar objetos por color.",
            capacidades: ["C11", "C12"],
        },
        {
            nombre: "Sonidos de Animales",
            grado: "3",
            descripcion: "Juego para reconocer sonidos de animales y asociarlos con imágenes.",
            capacidades: ["C01", "C11"],
        },
        {
            nombre: "Formas Divertidas",
            grado: "3",
            descripcion: "Juego para reconocer figuras geométricas básicas.",
            capacidades: ["C05", "C11"],
        },
        {
            nombre: "¿Dónde está el Osito?",
            grado: "3",
            descripcion: "Juego para trabajar ubicación espacial básica como arriba y abajo.",
            capacidades: ["C06", "C01", "C11"],
        },

        {
            nombre: "Las Vocales Perdidas",
            grado: "4",
            descripcion: "Juego para identificar vocales y relacionarlas con imágenes.",
            capacidades: ["C03", "C01"],
        },
        {
            nombre: "Cuenta Conmigo",
            grado: "4",
            descripcion: "Juego para contar objetos y relacionar número con cantidad.",
            capacidades: ["C04", "C11"],
        },
        {
            nombre: "Memoria Visual",
            grado: "4",
            descripcion: "Juego para fortalecer memoria, atención y asociación visual.",
            capacidades: ["C11", "C12"],
        },
        {
            nombre: "Figuras y Posiciones",
            grado: "4",
            descripcion: "Juego para reconocer figuras geométricas y posiciones espaciales.",
            capacidades: ["C05", "C06", "C11"],
        },

        {
            nombre: "Construye Palabras",
            grado: "5",
            descripcion: "Juego para formar palabras simples a partir de letras o sílabas.",
            capacidades: ["C03", "C02"],
        },
        {
            nombre: "Secuencias Divertidas",
            grado: "5",
            descripcion: "Juego para completar patrones y secuencias lógicas.",
            capacidades: ["C07", "C04", "C11"],
        },
        {
            nombre: "Asociación Imagen-Palabra",
            grado: "5",
            descripcion: "Juego para relacionar imágenes con palabras simples.",
            capacidades: ["C03", "C01", "C12"],
        },
        {
            nombre: "Rompecabezas Inteligente",
            grado: "5",
            descripcion: "Juego para organizar partes de una imagen y resolver problemas visuales.",
            capacidades: ["C11", "C12", "C09"],
        },
        ];
  for (const capacidad of capacidades) {
    await (prisma as any).capacidad.upsert({
      where: {
        codigo: capacidad.codigo,
      },
      update: {},
      create: capacidad,
    });
  }

  for (const juego of juegos) {
  const juegoCreado = await (prisma as any).juego.upsert({
    where: {
      nombre: juego.nombre,
    },
    update: {
      grado: juego.grado,
      descripcion: juego.descripcion,
    },
    create: {
      nombre: juego.nombre,
      grado: juego.grado,
      descripcion: juego.descripcion,
    },
  });

  for (const codigoCapacidad of juego.capacidades) {
    const capacidad = await (prisma as any).capacidad.findUnique({
      where: {
        codigo: codigoCapacidad,
      },
    });

    if (capacidad) {
      await (prisma as any).juegoCapacidad.upsert({
        where: {
          juegoId_capacidadId: {
            juegoId: juegoCreado.id,
            capacidadId: capacidad.id,
          },
        },
        update: {},
        create: {
          juegoId: juegoCreado.id,
          capacidadId: capacidad.id,
        },
      });
    }
  }
}

console.log("Capacidades y juegos registrados correctamente");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });