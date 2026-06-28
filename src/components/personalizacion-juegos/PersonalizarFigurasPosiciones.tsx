"use client";

import Image from "next/image";
import { useState } from "react";

export type ConfiguracionFigurasPosiciones = {
  escenas: string[];
  rondas: number;
};

type Props = {
  configuracionInicial?: ConfiguracionFigurasPosiciones;
  onGuardar: (configuracion: ConfiguracionFigurasPosiciones) => void;
  onCancelar: () => void;
};

const ESCENAS_DISPONIBLES = [
  {
    id: "escena1",
    nombre: "Escena 1",
    descripcion: "Casa, niño, ventana y pájaro",
    imagen: "/juegos/figuras-posiciones/escena1.webp",
  },
  {
    id: "escena2",
    nombre: "Escena 2",
    descripcion: "Parque, árbol, pelota y columpio",
    imagen: "/juegos/figuras-posiciones/escena2.webp",
  },
  {
    id: "escena3",
    nombre: "Escena 3",
    descripcion: "Granja, granero, árbol y pato",
    imagen: "/juegos/figuras-posiciones/escena3.webp",
  },
  {
    id: "escena4",
    nombre: "Escena 4",
    descripcion: "Mar, delfín, estrella y tesoro",
    imagen: "/juegos/figuras-posiciones/escena4.webp",
  },
];

export default function PersonalizarFigurasPosiciones({
  configuracionInicial,
  onGuardar,
  onCancelar,
}: Props) {
  const [escenas, setEscenas] = useState<string[]>(
    configuracionInicial?.escenas ?? ["escena1", "escena2", "escena3"]
  );

  const [rondas, setRondas] = useState(configuracionInicial?.rondas ?? 3);

  const alternarEscena = (id: string) => {
    setEscenas((actuales) =>
      actuales.includes(id)
        ? actuales.filter((escena) => escena !== id)
        : [...actuales, id]
    );
  };

  const guardar = () => {
    if (escenas.length < 1) {
      alert("Selecciona al menos una escena.");
      return;
    }

    onGuardar({
      escenas,
      rondas,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-2 text-lg font-black text-purple-700">
          Escenas del juego
        </h3>

        <p className="mb-5 text-sm font-semibold text-slate-500">
          Selecciona las escenas que aparecerán durante el juego.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {ESCENAS_DISPONIBLES.map((escena) => {
            const seleccionada = escenas.includes(escena.id);

            return (
              <button
                key={escena.id}
                type="button"
                onClick={() => alternarEscena(escena.id)}
                className={`overflow-hidden rounded-3xl border-2 bg-white text-left transition ${
                  seleccionada
                    ? "border-pink-400 shadow-md"
                    : "border-slate-200 hover:border-purple-300"
                }`}
              >
                <div className="relative h-40 w-full bg-purple-50">
                  <Image
                    src={escena.imagen}
                    alt={escena.nombre}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-4">
                  <p className="text-base font-black text-slate-700">
                    {seleccionada ? "✓ " : ""}
                    {escena.nombre}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {escena.descripcion}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-black text-purple-700">
          Número de rondas
        </h3>

        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => setRondas((r) => Math.max(1, r - 1))}
            className="h-12 w-12 rounded-full bg-pink-100 text-2xl font-black text-pink-600"
          >
            −
          </button>

          <span className="w-10 text-center text-3xl font-black text-purple-700">
            {rondas}
          </span>

          <button
            type="button"
            onClick={() => setRondas((r) => Math.min(10, r + 1))}
            className="h-12 w-12 rounded-full bg-pink-100 text-2xl font-black text-pink-600"
          >
            +
          </button>

          <span className="text-sm font-semibold text-slate-500">
            Máximo 10 rondas
          </span>
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