"use client";

import { useState } from "react";

type Vocal = "A" | "E" | "I" | "O" | "U";

export type ImagenPersonalizadaVocal = {
  id: string;
  nombre: string;
  vocal: Vocal;
  imagen: string;
};

export type ConfiguracionVocalesPerdidas = {
  vocales: Vocal[];
  imagenesPersonalizadas?: ImagenPersonalizadaVocal[];
  imagenes: string[];
  rondas: number;
};

type Props = {
  configuracionInicial?: ConfiguracionVocalesPerdidas;
  onGuardar: (configuracion: ConfiguracionVocalesPerdidas) => void;
  onCancelar: () => void;
};

const VOCALES: Vocal[] = ["A", "E", "I", "O", "U"];

export default function PersonalizarVocalesPerdidas({
  configuracionInicial,
  onGuardar,
  onCancelar,
}: Props) {
  const [vocalesSeleccionadas, setVocalesSeleccionadas] = useState<Vocal[]>(
    configuracionInicial?.vocales ?? []
  );

  const [imagenesPersonalizadas, setImagenesPersonalizadas] = useState<
    ImagenPersonalizadaVocal[]
  >(configuracionInicial?.imagenesPersonalizadas ?? []);

  const alternarVocal = (vocal: Vocal) => {
    const existe = vocalesSeleccionadas.includes(vocal);

    if (existe) {
      setVocalesSeleccionadas((actual) =>
        actual.filter((item) => item !== vocal)
      );

      setImagenesPersonalizadas((actual) =>
        actual.filter((imagen) => imagen.vocal !== vocal)
      );

      return;
    }

    setVocalesSeleccionadas((actual) => [...actual, vocal]);
  };

  const subirImagen = (vocal: Vocal, archivo?: File) => {
    if (!archivo) return;

    const urlTemporal = URL.createObjectURL(archivo);

    const nuevaImagen: ImagenPersonalizadaVocal = {
      id: `${vocal}-${Date.now()}-${Math.random()}`,
      nombre: archivo.name.replace(/\.[^/.]+$/, ""),
      vocal,
      imagen: urlTemporal,
    };

    setImagenesPersonalizadas((actual) => [...actual, nuevaImagen]);
  };

  const cambiarNombre = (id: string, nombre: string) => {
    setImagenesPersonalizadas((actual) =>
      actual.map((imagen) =>
        imagen.id === id ? { ...imagen, nombre } : imagen
      )
    );
  };

  const eliminarImagen = (id: string) => {
    setImagenesPersonalizadas((actual) =>
      actual.filter((imagen) => imagen.id !== id)
    );
  };

  const guardar = () => {
    if (vocalesSeleccionadas.length === 0) {
      alert("Selecciona al menos una vocal.");
      return;
    }

    const imagenesValidas = imagenesPersonalizadas.filter((imagen) =>
      vocalesSeleccionadas.includes(imagen.vocal)
    );

    if (imagenesValidas.length === 0) {
      alert("Sube al menos una imagen.");
      return;
    }

    onGuardar({
      vocales: vocalesSeleccionadas,
      imagenesPersonalizadas: imagenesValidas,
      imagenes: [],
      rondas: imagenesValidas.length,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-lg font-black text-purple-700">
          Elige las vocales
        </h3>

        <div className="grid grid-cols-5 gap-3">
          {VOCALES.map((vocal) => {
            const activo = vocalesSeleccionadas.includes(vocal);

            return (
              <button
                key={vocal}
                type="button"
                onClick={() => alternarVocal(vocal)}
                className={`rounded-2xl border-2 px-4 py-3 text-2xl font-black transition ${
                  activo
                    ? "border-purple-500 bg-purple-100 text-purple-700"
                    : "border-purple-200 bg-white text-purple-400 hover:bg-purple-50"
                }`}
              >
                {vocal}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-black text-purple-700">
          Sube imágenes para cada vocal
        </h3>

        {vocalesSeleccionadas.length === 0 ? (
          <p className="rounded-2xl bg-purple-50 p-4 text-sm font-semibold text-purple-500">
            Primero selecciona una vocal para subir sus imágenes.
          </p>
        ) : (
          <div className="max-h-[420px] space-y-5 overflow-y-auto pr-2">
            {vocalesSeleccionadas.map((vocal) => {
              const imagenesDeVocal = imagenesPersonalizadas.filter(
                (imagen) => imagen.vocal === vocal
              );

              return (
                <div
                  key={vocal}
                  className="rounded-3xl border-2 border-purple-200 bg-purple-50 p-4"
                >
                  <h4 className="mb-3 text-base font-black text-purple-700">
                    Vocal {vocal}
                  </h4>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => subirImagen(vocal, e.target.files?.[0])}
                    className="w-full rounded-xl bg-white px-4 py-3 font-bold text-slate-700"
                  />

                  {imagenesDeVocal.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                      {imagenesDeVocal.map((imagen) => (
                        <div
                          key={imagen.id}
                          className="rounded-2xl bg-white p-3 shadow-sm"
                        >
                          <img
                            src={imagen.imagen}
                            alt={imagen.nombre}
                            className="mx-auto h-28 w-full object-contain"
                          />

                          <input
                            type="text"
                            value={imagen.nombre}
                            onChange={(e) =>
                              cambiarNombre(imagen.id, e.target.value)
                            }
                            className="mt-3 w-full rounded-xl border-2 border-purple-100 px-3 py-2 text-sm font-bold outline-none"
                            placeholder="Nombre de la imagen"
                          />

                          <button
                            type="button"
                            onClick={() => eliminarImagen(imagen.id)}
                            className="mt-2 w-full rounded-xl bg-red-100 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-200"
                          >
                            Eliminar imagen
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-700">
        Rondas del juego:{" "}
        {
          imagenesPersonalizadas.filter((imagen) =>
            vocalesSeleccionadas.includes(imagen.vocal)
          ).length
        }
      </div>

      <div className="rounded-2xl bg-purple-50 p-4 text-sm font-bold text-purple-600">
        Las imágenes subidas son temporales. No se guardarán en la base de datos
        ni en el proyecto.
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-xl bg-gray-100 px-5 py-3 font-bold text-gray-600 hover:bg-gray-200"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={guardar}
          className="rounded-xl bg-purple-600 px-5 py-3 font-bold text-white hover:bg-purple-700"
        >
          Guardar personalización
        </button>
      </div>
    </div>
  );
}