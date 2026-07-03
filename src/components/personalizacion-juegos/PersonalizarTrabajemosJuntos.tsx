"use client";

import { useState } from "react";

export type ImagenPersonalizadaTrabajo = {
  id: string;
  nombre: string;
  imagen: string;
  esSubida?: boolean;
};

export type ConfiguracionTrabajemosJuntos = {
  situaciones: ImagenPersonalizadaTrabajo[];
  rondas: number;
};

type Props = {
  configuracionInicial?: ConfiguracionTrabajemosJuntos;
  onGuardar: (configuracion: ConfiguracionTrabajemosJuntos) => void;
  onCancelar: () => void;
};

const SITUACIONES_EQUIPO: ImagenPersonalizadaTrabajo[] = Array.from(
  { length: 8 },
  (_, index) => {
    const numero = index + 1;

    return {
      id: `equipo${numero}`,
      nombre: "Observa y elige quiénes trabajan juntos.",
      imagen: `/juegos/trabajemos-juntos/equipo${numero}.webp`,
    };
  }
);

export default function PersonalizarTrabajemosJuntos({
  configuracionInicial,
  onGuardar,
  onCancelar,
}: Props) {
  const [situaciones, setSituaciones] = useState<ImagenPersonalizadaTrabajo[]>(
    configuracionInicial?.situaciones ?? SITUACIONES_EQUIPO.slice(0, 4)
  );

  const estaSeleccionada = (id: string) =>
    situaciones.some((item) => item.id === id);

  const alternarSituacion = (situacion: ImagenPersonalizadaTrabajo) => {
    setSituaciones((actuales) =>
      actuales.some((item) => item.id === situacion.id)
        ? actuales.filter((item) => item.id !== situacion.id)
        : [...actuales, situacion]
    );
  };

  const cambiarTitulo = (id: string, nombre: string) => {
    setSituaciones((actuales) =>
      actuales.map((item) =>
        item.id === id ? { ...item, nombre } : item
      )
    );
  };

  const subirImagen = (archivo?: File) => {
    if (!archivo) return;

    const nuevaImagen: ImagenPersonalizadaTrabajo = {
      id: `subida-${Date.now()}-${Math.random()}`,
      nombre: "Observa y elige quiénes trabajan juntos.",
      imagen: URL.createObjectURL(archivo),
      esSubida: true,
    };

    setSituaciones((actuales) => [...actuales, nuevaImagen]);
  };

  const eliminarImagen = (id: string) => {
    setSituaciones((actuales) => actuales.filter((item) => item.id !== id));
  };

  const guardar = () => {
    if (situaciones.length === 0) {
      alert("Selecciona o sube al menos una imagen.");
      return;
    }

    onGuardar({
      situaciones,
      rondas: situaciones.length,
    });
  };

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-blue-100 bg-blue-50 p-4">
        <h3 className="text-lg font-extrabold text-blue-700">
          Personalizar Trabajemos Juntos
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          Selecciona imágenes o sube nuevas. Cada imagen será una ronda del
          juego.
        </p>
      </div>

      <div className="rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-700">
        Rondas del juego: {situaciones.length}
      </div>

      <div>
        <h3 className="mb-3 text-base font-extrabold text-blue-700">
          Imágenes existentes
        </h3>

        <div className="grid max-h-[300px] grid-cols-2 gap-4 overflow-y-auto pr-2 md:grid-cols-4">
          {SITUACIONES_EQUIPO.map((situacion) => {
            const activo = estaSeleccionada(situacion.id);

            return (
              <button
                key={situacion.id}
                type="button"
                onClick={() => alternarSituacion(situacion)}
                className={`rounded-3xl border-4 bg-white p-3 transition ${
                  activo
                    ? "scale-[1.02] border-blue-400 shadow-lg"
                    : "border-gray-100 opacity-70"
                }`}
              >
                <img
                  src={situacion.imagen}
                  alt={`Trabajo en equipo ${situacion.id}`}
                  className="h-28 w-full object-contain"
                />

                <p
                  className={`mt-2 text-xs font-bold ${
                    activo ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  {activo ? "Seleccionado" : "Tocar para elegir"}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl border-2 border-blue-100 bg-blue-50 p-4">
        <h3 className="mb-3 text-base font-extrabold text-blue-700">
          Subir nuevas imágenes
        </h3>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            subirImagen(e.target.files?.[0]);
            e.currentTarget.value = "";
          }}
          className="w-full rounded-xl bg-white px-4 py-3 font-bold text-slate-700"
        />
      </div>

      {situaciones.length > 0 && (
        <div>
          <h3 className="mb-3 text-base font-extrabold text-blue-700">
            Configurar rondas
          </h3>

          <div className="max-h-[320px] space-y-3 overflow-y-auto pr-2">
            {situaciones.map((situacion, index) => (
              <div
                key={situacion.id}
                className="rounded-3xl border-2 border-blue-100 bg-white p-3 shadow-sm"
              >
                <p className="mb-2 text-sm font-extrabold text-blue-700">
                  Ronda {index + 1}
                </p>

                <div className="grid grid-cols-[90px_1fr] gap-3">
                  <img
                    src={situacion.imagen}
                    alt={`Ronda ${index + 1}`}
                    className="h-24 w-24 rounded-2xl bg-blue-50 object-contain"
                  />

                  <div>
                    <label className="mb-1 block text-xs font-bold text-gray-600">
                      Título que verá el estudiante
                    </label>

                    <input
                      type="text"
                      value={situacion.nombre}
                      onChange={(e) =>
                        cambiarTitulo(situacion.id, e.target.value)
                      }
                      className="w-full rounded-xl border-2 border-blue-100 px-3 py-2 text-sm font-bold outline-none focus:border-blue-300"
                      placeholder="Ejemplo: Observa y elige quiénes trabajan juntos."
                    />

                    {situacion.esSubida && (
                      <button
                        type="button"
                        onClick={() => eliminarImagen(situacion.id)}
                        className="mt-2 rounded-xl bg-red-100 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-200"
                      >
                        Eliminar imagen
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-3">
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-2xl bg-gray-100 px-5 py-3 font-bold text-gray-600 hover:bg-gray-200"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={guardar}
          className="rounded-2xl bg-blue-500 px-5 py-3 font-bold text-white hover:bg-blue-600"
        >
          Guardar personalización
        </button>
      </div>
    </div>
  );
}