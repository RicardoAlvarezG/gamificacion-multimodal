"use client";

import { useState } from "react";

export type ConfiguracionColoresMagicos = {
  pregunta: string;
  colores: string[];
  rondas: number;
};

type Props = {
  configuracionInicial?: ConfiguracionColoresMagicos;
  onGuardar: (configuracion: ConfiguracionColoresMagicos) => void;
  onCancelar: () => void;
};

const COLORES_DISPONIBLES = [
  { nombre: "ROJO", color: "#ef4444" },
  { nombre: "AZUL", color: "#3b82f6" },
  { nombre: "AMARILLO", color: "#fde047" },
  { nombre: "VERDE", color: "#22c55e" },
  { nombre: "NARANJA", color: "#f97316" },
  { nombre: "MORADO", color: "#a855f7" },
  { nombre: "ROSADO", color: "#ec4899" },
  { nombre: "NEGRO", color: "#000000" },
  { nombre: "BLANCO", color: "#ffffff" },
  { nombre: "MARRÓN", color: "#92400e" },
];

const CONFIGURACION_PREDETERMINADA: ConfiguracionColoresMagicos = {
  pregunta: "Selecciona el color",
  colores: ["ROJO", "AZUL", "AMARILLO"],
  rondas: 6,
};

export default function PersonalizarColoresMagicos({
  configuracionInicial,
  onGuardar,
  onCancelar,
}: Props) {
  const configuracionBase =
    configuracionInicial || CONFIGURACION_PREDETERMINADA;

  const [pregunta, setPregunta] = useState(configuracionBase.pregunta);

  const [coloresSeleccionados, setColoresSeleccionados] = useState<string[]>(
    configuracionBase.colores
  );

  const [rondas, setRondas] = useState(configuracionBase.rondas);

  const cambiarColor = (color: string) => {
    setColoresSeleccionados((prev) =>
      prev.includes(color)
        ? prev.filter((item) => item !== color)
        : [...prev, color]
    );
  };

  const guardar = () => {
    if (coloresSeleccionados.length < 2) {
      alert("Selecciona al menos 2 colores para el juego.");
      return;
    }

    if (rondas < 1) {
      alert("La cantidad de rondas debe ser mayor a 0.");
      return;
    }

    onGuardar({
      pregunta: pregunta.trim() || CONFIGURACION_PREDETERMINADA.pregunta,
      colores: coloresSeleccionados,
      rondas,
    });
  };

  return (
    <>
      <label className="mb-2 block font-bold text-slate-700">
        Pregunta del juego
      </label>

      <input
        value={pregunta}
        onChange={(e) => setPregunta(e.target.value)}
        className="mb-6 w-full rounded-2xl border border-purple-200 p-4 font-bold text-slate-700 outline-none"
        placeholder="Selecciona el color"
      />

      <label className="mb-3 block font-bold text-slate-700">
        Colores disponibles
      </label>

      <div className="mb-6 grid grid-cols-2 gap-3">
        {COLORES_DISPONIBLES.map((color) => {
          const seleccionado = coloresSeleccionados.includes(color.nombre);

          return (
            <button
              key={color.nombre}
              type="button"
              onClick={() => cambiarColor(color.nombre)}
              className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left font-bold transition ${
                seleccionado
                  ? "border-purple-600 bg-purple-100"
                  : "border-slate-200 bg-white hover:border-purple-300"
              }`}
            >
              <div
                className="h-7 w-7 rounded-full border border-slate-300"
                style={{
                  backgroundColor: color.color,
                }}
              />

              <span className="flex-1">{color.nombre}</span>

              <span className="text-xl">
                {seleccionado ? "☑" : "☐"}
              </span>
            </button>
          );
        })}
      </div>

      <label className="mb-2 block font-bold text-slate-700">
        Número de rondas
      </label>

      <input
        type="number"
        min={1}
        max={12}
        value={rondas}
        onChange={(e) => setRondas(Number(e.target.value))}
        className="mb-8 w-full rounded-2xl border border-purple-200 p-4 font-bold text-slate-700 outline-none"
      />

      <div className="flex gap-4">
        <button
          onClick={onCancelar}
          className="flex-1 rounded-2xl bg-slate-200 px-6 py-4 font-bold text-slate-700 shadow-md transition hover:scale-105"
        >
          Cancelar
        </button>

        <button
          onClick={guardar}
          className="flex-1 rounded-2xl bg-green-500 px-6 py-4 font-bold text-white shadow-md transition hover:scale-105"
        >
          Guardar cambios
        </button>
      </div>
    </>
  );
}