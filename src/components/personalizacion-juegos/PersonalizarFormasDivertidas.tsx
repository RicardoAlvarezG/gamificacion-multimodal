"use client";

import { useState } from "react";

export type ConfiguracionFormasDivertidas = {
  formas: string[];
  rondas: number;
};

type Props = {
  configuracionInicial?: ConfiguracionFormasDivertidas;
  onGuardar: (configuracion: ConfiguracionFormasDivertidas) => void;
  onCancelar: () => void;
};

const FORMAS_DISPONIBLES = [
  "CIRCULO",
  "CUADRADO",
  "TRIANGULO",
  "RECTANGULO",
  "ROMBO",
  "PENTAGONO",
  "HEXAGONO",
  "OVALO",
  "ESTRELLA",
  "OCTOGONO",
];

export default function PersonalizarFormasDivertidas({
  configuracionInicial,
  onGuardar,
  onCancelar,
}: Props) {
  const [formasSeleccionadas, setFormasSeleccionadas] = useState<string[]>(
    configuracionInicial?.formas || [
      "CIRCULO",
      "CUADRADO",
      "TRIANGULO",
      "RECTANGULO",
    ]
  );

  const [rondas, setRondas] = useState<number>(
    configuracionInicial?.rondas || 4
  );

  const alternarForma = (forma: string) => {
    if (formasSeleccionadas.includes(forma)) {
      if (formasSeleccionadas.length === 1) return;
      setFormasSeleccionadas(formasSeleccionadas.filter((f) => f !== forma));
    } else {
      setFormasSeleccionadas([...formasSeleccionadas, forma]);
    }
  };

  const guardar = () => {
    onGuardar({
      formas: formasSeleccionadas,
      rondas,
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-purple-700">
          Personalizar Formas Divertidas
        </h3>
        <p className="text-sm text-gray-600">
          Selecciona las formas que deseas trabajar en esta sesión.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {FORMAS_DISPONIBLES.map((forma) => (
          <button
            key={forma}
            type="button"
            onClick={() => alternarForma(forma)}
            className={`rounded-2xl border-2 px-4 py-3 font-bold transition ${
              formasSeleccionadas.includes(forma)
                ? "border-purple-500 bg-purple-100 text-purple-700"
                : "border-gray-200 bg-white text-gray-500"
            }`}
          >
            {forma}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700">
          Número de rondas
        </label>
        <input
          type="number"
          min={1}
          max={formasSeleccionadas.length}
          value={rondas}
          onChange={(e) => setRondas(Number(e.target.value))}
          className="mt-2 w-full rounded-xl border px-4 py-2"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-xl bg-gray-200 px-4 py-2 font-bold text-gray-700"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={guardar}
          className="rounded-xl bg-purple-600 px-4 py-2 font-bold text-white"
        >
          Guardar configuración
        </button>
      </div>
    </div>
  );
}