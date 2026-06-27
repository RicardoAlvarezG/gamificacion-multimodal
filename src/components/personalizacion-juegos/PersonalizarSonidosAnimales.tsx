"use client";

import { useState } from "react";

export type ConfiguracionSonidosAnimales = {
  pregunta: string;
  modo: "ESCUCHAR_Y_ELEGIR_ANIMAL" | "VER_ANIMAL_Y_ELEGIR_SONIDO";
  animales: string[];
  rondas: number;
};

type Props = {
  configuracionInicial?: ConfiguracionSonidosAnimales;
  onGuardar: (configuracion: ConfiguracionSonidosAnimales) => void;
  onCancelar: () => void;
};

const ANIMALES_DISPONIBLES = [
  "Perro",
  "Gato",
  "Pato",
  "Pollito",
  "Vaca",
  "Cabra",
  "Burro",
  "Gallina",
  "Gallo",
  "Oveja",
  "Pavo",
  "Caballo",
  "Cerdo",
  "Cuy",
];

export default function PersonalizarSonidosAnimales({
  configuracionInicial,
  onGuardar,
  onCancelar,
}: Props) {
  const [pregunta, setPregunta] = useState(
    configuracionInicial?.pregunta || "Escucha el sonido y toca el animal correcto."
  );

  const [modo, setModo] = useState<
    "ESCUCHAR_Y_ELEGIR_ANIMAL" | "VER_ANIMAL_Y_ELEGIR_SONIDO"
  >(configuracionInicial?.modo || "ESCUCHAR_Y_ELEGIR_ANIMAL");

  const [animales, setAnimales] = useState<string[]>(
    configuracionInicial?.animales || ["Perro", "Gato", "Pato", "Pollito", "Vaca"]
  );

  const [rondas, setRondas] = useState(configuracionInicial?.rondas || 5);

  const cambiarAnimal = (animal: string) => {
    setAnimales((prev) =>
      prev.includes(animal)
        ? prev.filter((item) => item !== animal)
        : [...prev, animal]
    );
  };

  const cambiarModo = (
    nuevoModo: "ESCUCHAR_Y_ELEGIR_ANIMAL" | "VER_ANIMAL_Y_ELEGIR_SONIDO"
  ) => {
    setModo(nuevoModo);

    if (nuevoModo === "ESCUCHAR_Y_ELEGIR_ANIMAL") {
      setPregunta("Escucha el sonido y toca el animal correcto.");
    } else {
      setPregunta("Observa el animal y toca el sonido correcto.");
    }
  };

  const guardar = () => {
    if (!pregunta.trim()) {
      alert("Debes escribir una pregunta o instrucción.");
      return;
    }

    if (animales.length < 3) {
      alert("Debes seleccionar al menos 3 animales.");
      return;
    }

    if (rondas < 1) {
      alert("Debe haber al menos 1 ronda.");
      return;
    }

    if (rondas > animales.length) {
      alert("La cantidad de rondas no puede ser mayor que los animales seleccionados.");
      return;
    }

    onGuardar({
      pregunta: pregunta.trim(),
      modo,
      animales,
      rondas,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-lg font-extrabold text-purple-700">
          Pregunta o instrucción
        </label>

        <input
          type="text"
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          className="w-full rounded-2xl border border-purple-200 bg-purple-50 p-4 font-bold text-slate-700 outline-none"
        />
      </div>

      <div>
        <h3 className="mb-3 text-lg font-extrabold text-purple-700">
          Animales
        </h3>

        <div className="grid max-h-56 grid-cols-2 gap-3 overflow-y-auto rounded-2xl bg-yellow-50 p-4">
          {ANIMALES_DISPONIBLES.map((animal) => (
            <label
              key={animal}
              className="flex cursor-pointer items-center gap-3 rounded-xl bg-white p-3 font-bold text-slate-700 shadow-sm"
            >
              <input
                type="checkbox"
                checked={animales.includes(animal)}
                onChange={() => cambiarAnimal(animal)}
                className="h-5 w-5"
              />
              {animal}
            </label>
          ))}
        </div>

        <p className="mt-2 text-sm font-semibold text-slate-500">
          Seleccionados: {animales.length}
        </p>
      </div>

      <div>
        <label className="mb-2 block text-lg font-extrabold text-purple-700">
          Cantidad de rondas
        </label>

        <input
          type="number"
          min={1}
          max={10}
          value={rondas}
          onChange={(e) => setRondas(Number(e.target.value))}
          className="w-full rounded-2xl border border-purple-200 bg-purple-50 p-4 text-lg font-bold text-slate-700 outline-none"
        />
      </div>

      <div>
        <h3 className="mb-3 text-lg font-extrabold text-purple-700">
          Modo de juego
        </h3>

        <div className="space-y-3 rounded-2xl bg-pink-50 p-4">
          <label className="flex cursor-pointer items-center gap-3 font-bold text-slate-700">
            <input
              type="radio"
              name="modo-sonidos"
              checked={modo === "ESCUCHAR_Y_ELEGIR_ANIMAL"}
              onChange={() => cambiarModo("ESCUCHAR_Y_ELEGIR_ANIMAL")}
              className="h-5 w-5"
            />
            🔊 Escuchar sonido y elegir animal
          </label>

          <label className="flex cursor-pointer items-center gap-3 font-bold text-slate-700">
            <input
              type="radio"
              name="modo-sonidos"
              checked={modo === "VER_ANIMAL_Y_ELEGIR_SONIDO"}
              onChange={() => cambiarModo("VER_ANIMAL_Y_ELEGIR_SONIDO")}
              className="h-5 w-5"
            />
            🐾 Ver animal y elegir sonido
          </label>
        </div>
      </div>

      <div className="flex gap-4 pt-2">
        <button
          type="button"
          onClick={onCancelar}
          className="flex-1 rounded-2xl bg-slate-200 px-6 py-4 font-bold text-slate-700 shadow"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={guardar}
          className="flex-1 rounded-2xl bg-purple-600 px-6 py-4 font-bold text-white shadow"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}