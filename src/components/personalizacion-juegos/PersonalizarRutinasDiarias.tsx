"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export type ConfiguracionRutinasDiarias = {
  rutinaId: string;
  pasos: {
    id: string;
    texto: string;
    imagen: string;
    pregunta: string;
  }[];
};

type PasoPersonalizable = {
  id: string;
  texto: string;
  imagen: string;
};

type RutinaPersonalizable = {
  id: string;
  titulo: string;
  emoji: string;
  descripcion: string;
  pasos: PasoPersonalizable[];
};

type Props = {
  configuracionInicial?: ConfiguracionRutinasDiarias;
  onGuardar: (configuracion: ConfiguracionRutinasDiarias) => void;
  onCancelar: () => void;
};

const RUTINAS_DISPONIBLES: RutinaPersonalizable[] = [
  {
    id: "manana",
    titulo: "Rutina de la mañana",
    emoji: "🌅",
    descripcion: "Levantarse, asearse, desayunar e ir al colegio.",
    pasos: [
      { id: "levantar", texto: "Me levanto", imagen: "/juegos/rutinas/levantar.webp" },
      { id: "cama", texto: "Tiendo mi cama", imagen: "/juegos/rutinas/cama.webp" },
      { id: "aseo", texto: "Me aseo", imagen: "/juegos/rutinas/aseo.webp" },
      { id: "vestir", texto: "Me visto", imagen: "/juegos/rutinas/vestir.webp" },
      { id: "desayuno", texto: "Desayuno", imagen: "/juegos/rutinas/desayuno.webp" },
      { id: "colegio", texto: "Voy al colegio", imagen: "/juegos/rutinas/colegio.webp" },
    ],
  },
  {
    id: "tarde",
    titulo: "Rutina de la tarde",
    emoji: "☀️",
    descripcion: "Almorzar, descansar, jugar, hacer tareas y ordenar.",
    pasos: [
      { id: "almuerzo", texto: "Almuerzo", imagen: "/juegos/rutinas/almuerzo.webp" },
      { id: "descanso", texto: "Descanso", imagen: "/juegos/rutinas/descanso.webp" },
      { id: "juego", texto: "Juego", imagen: "/juegos/rutinas/juego.webp" },
      { id: "tareas", texto: "Hago mis tareas", imagen: "/juegos/rutinas/tareas.webp" },
      { id: "ordenar", texto: "Ordeno mis cosas", imagen: "/juegos/rutinas/ordenar.webp" },
      { id: "merienda", texto: "Meriendo", imagen: "/juegos/rutinas/merienda.webp" },
    ],
  },
  {
    id: "noche",
    titulo: "Rutina de la noche",
    emoji: "🌙",
    descripcion: "Cenar, bañarse, ponerse pijama y dormir.",
    pasos: [
      { id: "cena", texto: "Ceno", imagen: "/juegos/rutinas/cena.webp" },
      { id: "familia", texto: "Juego en familia", imagen: "/juegos/rutinas/familia.webp" },
      { id: "bano", texto: "Me baño", imagen: "/juegos/rutinas/bano.webp" },
      { id: "pijama", texto: "Me pongo pijama", imagen: "/juegos/rutinas/pijama.webp" },
      { id: "dientes", texto: "Me cepillo los dientes", imagen: "/juegos/rutinas/dientes.webp" },
      { id: "dormir", texto: "Me acuesto", imagen: "/juegos/rutinas/dormir.webp" },
    ],
  },
];

function crearPasosConPreguntas(rutina: RutinaPersonalizable) {
  return rutina.pasos.map((paso) => ({
    ...paso,
    pregunta: `¿Qué actividad corresponde a: ${paso.texto}?`,
  }));
}

export default function PersonalizarRutinasDiarias({
  configuracionInicial,
  onGuardar,
  onCancelar,
}: Props) {
  const rutinaInicial =
    RUTINAS_DISPONIBLES.find(
      (rutina) => rutina.id === configuracionInicial?.rutinaId
    ) ?? RUTINAS_DISPONIBLES[0];

  const [rutinaId, setRutinaId] = useState(rutinaInicial.id);

  const rutinaSeleccionada = useMemo(
    () =>
      RUTINAS_DISPONIBLES.find((rutina) => rutina.id === rutinaId) ??
      RUTINAS_DISPONIBLES[0],
    [rutinaId]
  );

  const [preguntasPorRutina, setPreguntasPorRutina] = useState<
    Record<string, ConfiguracionRutinasDiarias["pasos"]>
  >(() => {
    const base: Record<string, ConfiguracionRutinasDiarias["pasos"]> = {};

    RUTINAS_DISPONIBLES.forEach((rutina) => {
      base[rutina.id] = crearPasosConPreguntas(rutina);
    });

    if (configuracionInicial) {
      base[configuracionInicial.rutinaId] = configuracionInicial.pasos;
    }

    return base;
  });

  const pasosActuales =
    preguntasPorRutina[rutinaSeleccionada.id] ??
    crearPasosConPreguntas(rutinaSeleccionada);

  const cambiarRutina = (id: string) => {
    setRutinaId(id);
  };

  const actualizarPregunta = (pasoId: string, pregunta: string) => {
    setPreguntasPorRutina((actual) => ({
      ...actual,
      [rutinaSeleccionada.id]: pasosActuales.map((paso) =>
        paso.id === pasoId ? { ...paso, pregunta } : paso
      ),
    }));
  };

  const guardar = () => {
    const preguntasVacias = pasosActuales.some(
      (paso) => paso.pregunta.trim().length === 0
    );

    if (preguntasVacias) {
      alert("Cada imagen debe tener una pregunta.");
      return;
    }

    onGuardar({
      rutinaId: rutinaSeleccionada.id,
      pasos: pasosActuales,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-2 text-lg font-black text-purple-700">
          Elige la rutina
        </h3>

        <p className="mb-5 text-sm font-semibold text-slate-500">
          Selecciona una rutina para trabajar con sus imágenes y preguntas.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {RUTINAS_DISPONIBLES.map((rutina) => {
            const seleccionada = rutina.id === rutinaId;

            return (
              <button
                key={rutina.id}
                type="button"
                onClick={() => cambiarRutina(rutina.id)}
                className={`rounded-3xl border-2 p-5 text-left transition ${
                  seleccionada
                    ? "border-pink-400 bg-pink-50 shadow-md"
                    : "border-slate-200 bg-white hover:border-purple-300"
                }`}
              >
                <div className="text-4xl">{rutina.emoji}</div>

                <p className="mt-3 text-base font-black text-purple-700">
                  {rutina.titulo}
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-500">
                  {rutina.descripcion}
                </p>

                {seleccionada && (
                  <p className="mt-3 text-sm font-black text-pink-600">
                    ✓ Seleccionada
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-lg font-black text-purple-700">
          Preguntas por imagen
        </h3>

        <p className="mb-5 text-sm font-semibold text-slate-500">
          Escribe una pregunta para cada imagen de la rutina seleccionada.
        </p>

        <div className="grid grid-cols-1 gap-5">
          {pasosActuales.map((paso, index) => (
            <div
              key={paso.id}
              className="rounded-3xl border-2 border-purple-100 bg-white p-5 shadow-sm"
            >
              <div className="grid gap-5 md:grid-cols-[220px_1fr]">
                <div className="flex flex-col items-center justify-center rounded-3xl bg-purple-50 p-4">
                  <Image
                    src={paso.imagen}
                    alt={paso.texto}
                    width={180}
                    height={180}
                    className="h-44 w-44 object-contain"
                  />

                  <p className="mt-3 text-center text-lg font-black text-purple-700">
                    {index + 1}. {paso.texto}
                  </p>
                </div>

                <div className="flex flex-col justify-center">
                  <label className="mb-2 text-sm font-black text-slate-600">
                    Pregunta para esta imagen
                  </label>

                  <textarea
                    value={paso.pregunta}
                    onChange={(e) =>
                      actualizarPregunta(paso.id, e.target.value)
                    }
                    rows={3}
                    className="w-full rounded-2xl border-2 border-purple-100 p-4 text-base font-semibold text-slate-700 outline-none transition focus:border-pink-300"
                    placeholder="Ejemplo: ¿Qué hace el niño en esta imagen?"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t pt-6">
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-full bg-slate-200 px-6 py-2 font-bold text-slate-700 hover:bg-slate-300"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={guardar}
          className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 font-black text-white shadow-md hover:scale-105"
        >
          Guardar personalización
        </button>
      </div>
    </div>
  );
}