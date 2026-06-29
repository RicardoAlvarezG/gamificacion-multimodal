"use client";

import { useState } from "react";

export type ConfiguracionTrabajemosJuntos = {
  situaciones: string[];
  rondas: number;
};

type Props = {
  configuracionInicial?: ConfiguracionTrabajemosJuntos;
  onGuardar: (configuracion: ConfiguracionTrabajemosJuntos) => void;
  onCancelar: () => void;
};

const SITUACIONES_EQUIPO = Array.from({ length: 20 }, (_, index) => {
  const numero = index + 1;

  return {
    id: `equipo${numero}`,
    nombre: `Trabajo en equipo ${numero}`,
    imagen: `/juegos/trabajemos-juntos/equipo${numero}.webp`,
  };
});

export default function PersonalizarTrabajemosJuntos({
  configuracionInicial,
  onGuardar,
  onCancelar,
}: Props) {
  const [situaciones, setSituaciones] = useState<string[]>(
    configuracionInicial?.situaciones ?? ["equipo1", "equipo2", "equipo3", "equipo4"]
  );

  const [rondas, setRondas] = useState(
    configuracionInicial?.rondas ?? situaciones.length
  );

  const alternarSituacion = (id: string) => {
    setSituaciones((actuales) => {
      if (actuales.includes(id)) {
        return actuales.filter((situacion) => situacion !== id);
      }

      return [...actuales, id];
    });
  };

  const guardar = () => {
    if (situaciones.length === 0) {
      alert("Selecciona al menos una situación de trabajo en equipo.");
      return;
    }

    if (rondas < situaciones.length) {
      alert("El número de rondas no puede ser menor que la cantidad de imágenes seleccionadas.");
      return;
    }

    onGuardar({
      situaciones,
      rondas,
    });
  };

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-blue-50 p-4 border border-blue-100">
        <h3 className="text-lg font-extrabold text-blue-700">
          Personalizar Trabajemos Juntos
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Selecciona las situaciones correctas de trabajo en equipo que aparecerán en el juego.
        </p>
      </div>

      <div>
        <label className="text-sm font-bold text-gray-700">
          Número de rondas
        </label>

        <input
          type="number"
          min={situaciones.length || 1}
          value={rondas}
          onChange={(e) => setRondas(Number(e.target.value))}
          className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-blue-300"
        />

        <p className="mt-1 text-xs text-gray-500">
          Debe ser igual o mayor a la cantidad de imágenes seleccionadas.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[430px] overflow-y-auto pr-2">
        {SITUACIONES_EQUIPO.map((situacion) => {
          const activo = situaciones.includes(situacion.id);

          return (
            <button
              key={situacion.id}
              type="button"
              onClick={() => alternarSituacion(situacion.id)}
              className={`rounded-3xl border-4 p-3 transition bg-white ${
                activo
                  ? "border-blue-400 shadow-lg scale-[1.02]"
                  : "border-gray-100 opacity-70"
              }`}
            >
              <img
                src={situacion.imagen}
                alt={situacion.nombre}
                className="w-full h-28 object-contain"
              />

              <p className="mt-2 text-sm font-extrabold text-gray-700">
                {situacion.nombre}
              </p>

              <p className={`text-xs font-bold ${activo ? "text-blue-600" : "text-gray-400"}`}>
                {activo ? "Seleccionado" : "Tocar para elegir"}
              </p>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end gap-3 pt-3">
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-2xl px-5 py-3 font-bold bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={guardar}
          className="rounded-2xl px-5 py-3 font-bold bg-blue-500 text-white hover:bg-blue-600"
        >
          Guardar personalización
        </button>
      </div>
    </div>
  );
}