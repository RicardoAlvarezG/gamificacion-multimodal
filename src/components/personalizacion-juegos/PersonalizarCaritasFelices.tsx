"use client";

import { useState } from "react";

export type ConfiguracionCaritasFelices = {
  modo: "VER_EMOCION_Y_ELEGIR_NOMBRE" | "LEER_EMOCION_Y_ELEGIR_CARITA";
  emociones: string[];
  opciones: 2 | 3 | 4;
  rondas: number;
};

type Props = {
  configuracionInicial?: ConfiguracionCaritasFelices;
  onGuardar: (configuracion: ConfiguracionCaritasFelices) => void;
  onCancelar: () => void;
};

const EMOCIONES_DISPONIBLES = [
  "FELIZ",
  "TRISTE",
  "ENOJADO",
  "SORPRENDIDO",
  "ASUSTADO",
  "CANSADO",
  "ENFERMO",
  "CONFUNDIDO",
  "ORGULLOSO",
];

export default function PersonalizarCaritasFelices({
  configuracionInicial,
  onGuardar,
  onCancelar,
}: Props) {
  const [modo, setModo] = useState<ConfiguracionCaritasFelices["modo"]>(
    configuracionInicial?.modo || "VER_EMOCION_Y_ELEGIR_NOMBRE"
  );

  const [emociones, setEmociones] = useState<string[]>(
    configuracionInicial?.emociones || [
      "FELIZ",
      "TRISTE",
      "ENOJADO",
      "SORPRENDIDO",
      "ASUSTADO",
    ]
  );

  const [opciones, setOpciones] = useState<2 | 3 | 4>(
    configuracionInicial?.opciones || 3
  );

  const toggleEmocion = (emocion: string) => {
    setEmociones((actuales) =>
      actuales.includes(emocion)
        ? actuales.filter((item) => item !== emocion)
        : [...actuales, emocion]
    );
  };

  const guardar = () => {
    if (emociones.length === 0) {
      alert("Debe seleccionar al menos una emoción.");
      return;
    }

    if (emociones.length < opciones) {
      alert(
        `Debe seleccionar al menos ${opciones} emociones para usar ${opciones} opciones.`
      );
      return;
    }

    onGuardar({
      modo,
      emociones,
      opciones,
      rondas: emociones.length,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-purple-700 mb-3">
          Modo del juego
        </h3>

        <div className="space-y-3">
          <label className="flex items-center gap-3 rounded-2xl border-2 border-purple-100 bg-purple-50 p-4 cursor-pointer">
            <input
              type="radio"
              checked={modo === "VER_EMOCION_Y_ELEGIR_NOMBRE"}
              onChange={() => setModo("VER_EMOCION_Y_ELEGIR_NOMBRE")}
            />
            <span className="font-semibold text-purple-800">
              Ver la carita y elegir la emoción
            </span>
          </label>

          <label className="flex items-center gap-3 rounded-2xl border-2 border-purple-100 bg-purple-50 p-4 cursor-pointer">
            <input
              type="radio"
              checked={modo === "LEER_EMOCION_Y_ELEGIR_CARITA"}
              onChange={() => setModo("LEER_EMOCION_Y_ELEGIR_CARITA")}
            />
            <span className="font-semibold text-purple-800">
              Leer la emoción y elegir la carita
            </span>
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-purple-700 mb-3">
          Emociones a trabajar
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {EMOCIONES_DISPONIBLES.map((emocion) => (
            <button
              key={emocion}
              type="button"
              onClick={() => toggleEmocion(emocion)}
              className={`rounded-2xl border-2 px-4 py-3 font-bold transition ${
                emociones.includes(emocion)
                  ? "bg-purple-500 text-white border-purple-600"
                  : "bg-white text-purple-700 border-purple-200 hover:bg-purple-50"
              }`}
            >
              {emocion}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-purple-700 mb-3">
          Cantidad de opciones
        </h3>

        <div className="flex flex-wrap gap-3">
          {[2, 3, 4].map((cantidad) => (
            <button
              key={cantidad}
              type="button"
              onClick={() => setOpciones(cantidad as 2 | 3 | 4)}
              className={`rounded-2xl px-5 py-3 font-bold border-2 transition ${
                opciones === cantidad
                  ? "bg-pink-500 text-white border-pink-600"
                  : "bg-white text-pink-700 border-pink-200 hover:bg-pink-50"
              }`}
            >
              {cantidad} opciones
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-4 text-sm font-semibold text-yellow-800">
        Las rondas se calcularán automáticamente según la cantidad de emociones
        seleccionadas.
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancelar}
          className="px-5 py-3 rounded-xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={guardar}
          className="px-5 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700"
        >
          Guardar configuración
        </button>
      </div>
    </div>
  );
}