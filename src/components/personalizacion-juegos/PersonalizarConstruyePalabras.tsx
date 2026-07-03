"use client";

import { useState } from "react";

export type PalabraPersonalizada = {
  id: string;
  palabra: string;
  imagen: string;
  esSubida?: boolean;
};

export type ConfiguracionConstruyePalabras = {
  palabras: PalabraPersonalizada[];
};

type Props = {
  configuracionInicial?: ConfiguracionConstruyePalabras;
  onGuardar: (configuracion: ConfiguracionConstruyePalabras) => void;
  onCancelar: () => void;
};

const PALABRAS_DISPONIBLES: PalabraPersonalizada[] = [
  { id: "sol", palabra: "SOL", imagen: "/juegos/palabras/sol.webp" },
  { id: "casa", palabra: "CASA", imagen: "/juegos/palabras/casa.webp" },
  { id: "gato", palabra: "GATO", imagen: "/juegos/palabras/gato.webp" },
  { id: "pato", palabra: "PATO", imagen: "/juegos/palabras/pato.webp" },
  { id: "flor", palabra: "FLOR", imagen: "/juegos/palabras/flor.webp" },
  { id: "luna", palabra: "LUNA", imagen: "/juegos/palabras/luna.webp" },
  { id: "pez", palabra: "PEZ", imagen: "/juegos/palabras/pez.webp" },
  { id: "mano", palabra: "MANO", imagen: "/juegos/palabras/mano.webp" },
  { id: "mesa", palabra: "MESA", imagen: "/juegos/palabras/mesa.webp" },
  { id: "vaca", palabra: "VACA", imagen: "/juegos/palabras/vaca.webp" },
];

const idsIniciales = ["sol", "casa", "gato", "pato", "flor"];

export default function PersonalizarConstruyePalabras({
  configuracionInicial,
  onGuardar,
  onCancelar,
}: Props) {
  const [palabras, setPalabras] = useState<PalabraPersonalizada[]>(
    configuracionInicial?.palabras ??
      PALABRAS_DISPONIBLES.filter((item) => idsIniciales.includes(item.id))
  );

  const estaSeleccionada = (id: string) =>
    palabras.some((item) => item.id === id);

  const alternarPalabra = (item: PalabraPersonalizada) => {
    setPalabras((actuales) =>
      actuales.some((palabra) => palabra.id === item.id)
        ? actuales.filter((palabra) => palabra.id !== item.id)
        : [...actuales, item]
    );
  };

  const actualizarTexto = (id: string, nuevoTexto: string) => {
    const textoLimpio = nuevoTexto
      .toUpperCase()
      .replace(/[^A-ZÁÉÍÓÚÜÑ]/g, "");

    setPalabras((actuales) =>
      actuales.map((item) =>
        item.id === id ? { ...item, palabra: textoLimpio } : item
      )
    );
  };

  const subirImagen = (archivo?: File) => {
    if (!archivo) return;

    const nuevaImagen: PalabraPersonalizada = {
      id: `subida-${Date.now()}-${Math.random()}`,
      palabra: "",
      imagen: URL.createObjectURL(archivo),
      esSubida: true,
    };

    setPalabras((actuales) => [...actuales, nuevaImagen]);
  };

  const eliminarImagen = (id: string) => {
    setPalabras((actuales) => actuales.filter((item) => item.id !== id));
  };

  const guardar = () => {
    if (palabras.length === 0) {
      alert("Selecciona o sube al menos una imagen.");
      return;
    }

    if (palabras.some((item) => item.palabra.trim().length === 0)) {
      alert("Todas las imágenes deben tener una palabra.");
      return;
    }

    onGuardar({ palabras });
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-extrabold text-purple-700">
          Personalizar Construye Palabras
        </h3>
        <p className="text-sm font-semibold text-gray-600">
          Selecciona imágenes o sube nuevas. La palabra escrita será la que el
          niño deberá ordenar.
        </p>
      </div>

      <div className="rounded-2xl bg-purple-50 p-4 text-sm font-bold text-purple-700">
        Rondas: {palabras.length}
      </div>

      <div>
        <h3 className="mb-3 text-base font-extrabold text-purple-700">
          Imágenes existentes
        </h3>

        <div className="grid max-h-[330px] grid-cols-2 gap-4 overflow-y-auto pr-2 md:grid-cols-4">
          {PALABRAS_DISPONIBLES.map((item) => {
            const activo = estaSeleccionada(item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => alternarPalabra(item)}
                className={`rounded-3xl border-4 bg-white p-3 transition ${
                  activo
                    ? "border-purple-400 shadow-lg"
                    : "border-gray-100 opacity-70"
                }`}
              >
                <img
                  src={item.imagen}
                  alt={item.palabra}
                  className="h-24 w-full object-contain"
                />

                <p
                  className={`mt-2 text-xs font-bold ${
                    activo ? "text-purple-600" : "text-gray-400"
                  }`}
                >
                  {activo ? "Seleccionado" : "Tocar para elegir"}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl border-2 border-purple-100 bg-purple-50 p-4">
        <h3 className="mb-3 text-base font-extrabold text-purple-700">
          Subir nueva imagen
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

      {palabras.length > 0 && (
        <div>
          <h3 className="mb-3 text-base font-extrabold text-purple-700">
            Palabra para cada ronda
          </h3>

          <div className="max-h-[320px] space-y-3 overflow-y-auto pr-2">
            {palabras.map((item, index) => (
              <div
                key={item.id}
                className="rounded-3xl border-2 border-purple-100 bg-white p-3 shadow-sm"
              >
                <p className="mb-2 text-sm font-extrabold text-purple-700">
                  Ronda {index + 1}
                </p>

                <div className="grid grid-cols-[90px_1fr] gap-3">
                  <img
                    src={item.imagen}
                    alt={item.palabra || `Ronda ${index + 1}`}
                    className="h-24 w-24 rounded-2xl bg-purple-50 object-contain"
                  />

                  <div>
                    <label className="mb-1 block text-xs font-bold text-gray-600">
                      Palabra que deberá formar
                    </label>

                    <input
                      type="text"
                      value={item.palabra}
                      maxLength={8}
                      onChange={(e) => actualizarTexto(item.id, e.target.value)}
                      className="w-full rounded-xl border-2 border-purple-100 px-3 py-2 text-sm font-extrabold uppercase outline-none focus:border-purple-300"
                      placeholder="Ejemplo: PATO"
                    />

                    {item.esSubida && (
                      <button
                        type="button"
                        onClick={() => eliminarImagen(item.id)}
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
          className="rounded-2xl bg-purple-500 px-5 py-3 font-bold text-white hover:bg-purple-600"
        >
          Guardar personalización
        </button>
      </div>
    </div>
  );
}