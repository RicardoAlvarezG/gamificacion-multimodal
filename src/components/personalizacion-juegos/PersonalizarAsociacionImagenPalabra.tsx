"use client";

import { useState } from "react";

export type ImagenPersonalizadaAsociacion = {
  id: string;
  palabra: string;
  imagen: string;
};

export type ConfiguracionAsociacionImagenPalabra = {
  modo: "IMAGEN_A_PALABRA" | "PALABRA_A_IMAGEN";
  imagenesPersonalizadas: ImagenPersonalizadaAsociacion[];
  imagenes: string[];
  rondas: number;
};

type Props = {
  configuracionInicial?: ConfiguracionAsociacionImagenPalabra;
  onGuardar: (configuracion: ConfiguracionAsociacionImagenPalabra) => void;
  onCancelar: () => void;
};

export default function PersonalizarAsociacionImagenPalabra({
  configuracionInicial,
  onGuardar,
  onCancelar,
}: Props) {
  const [modo, setModo] = useState<"IMAGEN_A_PALABRA" | "PALABRA_A_IMAGEN">(
    configuracionInicial?.modo ?? "IMAGEN_A_PALABRA"
  );

  const [imagenesPersonalizadas, setImagenesPersonalizadas] = useState<
    ImagenPersonalizadaAsociacion[]
  >(configuracionInicial?.imagenesPersonalizadas ?? []);

  const subirImagen = (archivo?: File) => {
    if (!archivo) return;

    const nuevaImagen: ImagenPersonalizadaAsociacion = {
      id: `subida-${Date.now()}-${Math.random()}`,
      palabra: "",
      imagen: URL.createObjectURL(archivo),
    };

    setImagenesPersonalizadas((actuales) => [...actuales, nuevaImagen]);
  };

  const actualizarPalabra = (id: string, palabra: string) => {
    const textoLimpio = palabra
      .toUpperCase()
      .replace(/[^A-ZÁÉÍÓÚÜÑ]/g, "");

    setImagenesPersonalizadas((actuales) =>
      actuales.map((item) =>
        item.id === id ? { ...item, palabra: textoLimpio } : item
      )
    );
  };

  const eliminarImagen = (id: string) => {
    setImagenesPersonalizadas((actuales) =>
      actuales.filter((item) => item.id !== id)
    );
  };

  const guardar = () => {
    if (imagenesPersonalizadas.length === 0) {
      alert("Sube al menos una imagen.");
      return;
    }

    if (imagenesPersonalizadas.some((item) => item.palabra.trim() === "")) {
      alert("Todas las imágenes deben tener una palabra.");
      return;
    }

    onGuardar({
      modo,
      imagenesPersonalizadas,
      imagenes: [],
      rondas: imagenesPersonalizadas.length,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Modo de juego</h3>

        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={modo === "IMAGEN_A_PALABRA"}
              onChange={() => setModo("IMAGEN_A_PALABRA")}
            />
            Imagen → Palabra
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={modo === "PALABRA_A_IMAGEN"}
              onChange={() => setModo("PALABRA_A_IMAGEN")}
            />
            Palabra → Imagen
          </label>
        </div>
      </div>

      <div className="rounded-3xl border-2 border-purple-100 bg-purple-50 p-4">
        <h3 className="mb-3 font-bold text-purple-700">Subir imagen</h3>

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

      <div className="rounded-2xl bg-purple-50 p-4 text-sm font-bold text-purple-700">
        Rondas: {imagenesPersonalizadas.length}
      </div>

      {imagenesPersonalizadas.length > 0 && (
        <div className="max-h-[360px] space-y-3 overflow-y-auto pr-2">
          {imagenesPersonalizadas.map((item, index) => (
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
                    Nombre o palabra
                  </label>

                  <input
                    type="text"
                    value={item.palabra}
                    onChange={(e) =>
                      actualizarPalabra(item.id, e.target.value)
                    }
                    className="w-full rounded-xl border-2 border-purple-100 px-3 py-2 text-sm font-extrabold uppercase outline-none"
                    placeholder="Ejemplo: PATO"
                  />

                  <button
                    type="button"
                    onClick={() => eliminarImagen(item.id)}
                    className="mt-2 rounded-xl bg-red-100 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-200"
                  >
                    Eliminar imagen
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button onClick={onCancelar} className="px-4 py-2 rounded-lg border">
          Cancelar
        </button>

        <button
          onClick={guardar}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}