"use client";

import { useState } from "react";

export type ConfiguracionSecuenciasDivertidas = {
  grupo: string;
  rondas: number;
};

type Props = {
  configuracionInicial?: ConfiguracionSecuenciasDivertidas;
  onGuardar: (configuracion: ConfiguracionSecuenciasDivertidas) => void;
  onCancelar: () => void;
};

const GRUPOS = [
  {
    id: "formas",
    nombre: "Formas",
    descripcion: "Círculos, cuadrados y triángulos de colores.",
  },
  {
    id: "objetos",
    nombre: "Objetos",
    descripcion: "Lápiz, libro, mochila, pelota y tijera.",
  },
  {
    id: "transportes",
    nombre: "Transportes",
    descripcion: "Auto, bicicleta, bus, avión y barco.",
  },
  {
    id: "animales",
    nombre: "Animales",
    descripcion: "Perro, gato, pato, vaca y conejo.",
  },
  {
    id: "frutas",
    nombre: "Frutas",
    descripcion: "Manzana, pera, plátano, uva y fresa.",
  },
  {
    id: "juguetes",
    nombre: "Juguetes",
    descripcion: "Carro, muñeca, peluche, bloques y trompo.",
  },
];

export default function PersonalizarSecuenciasDivertidas({
  configuracionInicial,
  onGuardar,
  onCancelar,
}: Props) {
  const [grupo, setGrupo] = useState(
    configuracionInicial?.grupo ?? "formas"
  );

  const [rondas, setRondas] = useState(
    configuracionInicial?.rondas ?? 3
  );

  const guardar = () => {
    if (rondas < 1) {
      alert("El número de rondas debe ser mayor que cero.");
      return;
    }

    onGuardar({
      grupo,
      rondas,
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-extrabold text-purple-700">
          Personalizar Secuencias Divertidas
        </h3>

        <p className="text-sm font-semibold text-gray-600">
          Selecciona el grupo de imágenes que se utilizará para generar
          las secuencias del juego.
        </p>
      </div>

      <div>
        <label className="text-sm font-bold text-gray-700">
          Número de rondas
        </label>

        <input
          type="number"
          min={1}
          value={rondas}
          onChange={(e) => setRondas(Number(e.target.value))}
          className="mt-2 w-full rounded-2xl border border-purple-200 px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-purple-300"
        />
      </div>

      <div className="grid gap-3">
        {GRUPOS.map((item) => {
          const activo = grupo === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setGrupo(item.id)}
              className={`rounded-3xl border-4 p-5 text-left transition ${
                activo
                  ? "border-purple-400 bg-purple-50 shadow-lg"
                  : "border-gray-100 bg-white hover:border-purple-200"
              }`}
            >
              <h4 className="text-lg font-extrabold text-purple-700">
                {item.nombre}
              </h4>

              <p className="mt-1 text-sm font-semibold text-gray-600">
                {item.descripcion}
              </p>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-2xl bg-gray-100 px-5 py-3 font-bold text-gray-600"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={guardar}
          className="rounded-2xl bg-purple-500 px-5 py-3 font-bold text-white hover:bg-purple-600"
        >
          Guardar personalización
        </button>
      </div>
    </div>
  );
}